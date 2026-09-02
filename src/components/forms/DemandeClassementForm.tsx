import { FormEvent, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import TurnstileField from './TurnstileField';
import {
  validateDemandeClassementForm,
  type DemandeClassementFormData,
  type ValidationError,
} from '../../utils/formValidation';
import { submitToApi, type ApiErrorCode, type FieldErrorCode } from '../../utils/api';
import {
  trackFormStarted,
  trackFormSubmitAttempted,
  trackFormSubmitFailed,
  trackFormSubmitSucceeded,
  trackFormValidationFailed,
} from '../../utils/analytics';
import {
  formContent,
  getLocalizedApiErrorMessage,
  getLocalizedFieldErrors,
} from '../../i18n/formContent';
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales';
import { getLocalizedPath } from '../../i18n/routeHelpers';

type DemandeClassementFormProps = {
  locale?: Locale;
};

type DemandeClassementSubmissionPayload = DemandeClassementFormData & {
  turnstileToken: string;
  consentVersion: typeof CONSENT_VERSION;
  preferredLanguage: Locale;
};

type DemandeSubmissionResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
      errorCode?: ApiErrorCode;
      fieldErrors?: Record<string, string>;
      fieldErrorCodes?: Record<string, FieldErrorCode>;
    };

const CONSENT_VERSION = 'privacy-v1';

export default function DemandeClassementForm({
  locale = DEFAULT_LOCALE,
}: DemandeClassementFormProps) {
  const content = formContent[locale];
  const demandeContent = content.demandeClassement;
  const privacyPath = getLocalizedPath('confidentialite', locale) ?? '/confidentialite';
  const [formData, setFormData] = useState<DemandeClassementFormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const hasTrackedFormStarted = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!hasTrackedFormStarted.current) {
      trackFormStarted('demande_classement');
      hasTrackedFormStarted.current = true;
    }

    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSubmitError(null);

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleTurnstileChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token !== null) {
      setSubmitError(null);
    }
    setErrors((prev) => {
      if (!prev.turnstileToken) return prev;
      const nextErrors = { ...prev };
      delete nextErrors.turnstileToken;
      return nextErrors;
    });
  }, []);

  const resetTurnstileToken = () => {
    setTurnstileToken(null);
    setTurnstileResetKey((prev) => prev + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasTrackedFormStarted.current) {
      trackFormStarted('demande_classement');
      hasTrackedFormStarted.current = true;
    }

    setIsSuccess(false);
    setSubmitError(null);

    const validationErrors = validateDemandeClassementForm(formData, locale);
    if (!turnstileToken) {
      validationErrors.turnstileToken = content.turnstile.required;
    }

    if (Object.keys(validationErrors).length > 0) {
      trackFormValidationFailed('demande_classement', Object.keys(validationErrors).sort());
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    trackFormSubmitAttempted('demande_classement');

    const verifiedTurnstileToken = turnstileToken;
    if (!verifiedTurnstileToken) {
      setIsSubmitting(false);
      setErrors({ turnstileToken: content.turnstile.required });
      return;
    }

    const payload: DemandeClassementSubmissionPayload = {
      ...formData,
      turnstileToken: verifiedTurnstileToken,
      consentVersion: CONSENT_VERSION,
      preferredLanguage: locale,
    };

    const response = await submitToApi<
      DemandeSubmissionResponse,
      DemandeClassementSubmissionPayload
    >('/public/forms/classement', payload, { locale });

    setIsSubmitting(false);

    if (!response.success) {
      setErrors(getLocalizedFieldErrors(response.fieldErrorCodes, locale, response.fieldErrors));
      setSubmitError(response.error);
      resetTurnstileToken();
      trackFormSubmitFailed(
        'demande_classement',
        'api',
        Object.keys(response.fieldErrorCodes || response.fieldErrors || {}).sort()
      );
      return;
    }

    if (!response.data.success) {
      setErrors(
        getLocalizedFieldErrors(response.data.fieldErrorCodes, locale, response.data.fieldErrors)
      );
      setSubmitError(
        getLocalizedApiErrorMessage(
          {
            errorCode: response.data.errorCode,
            fallbackError: response.data.error,
          },
          locale
        )
      );
      trackFormSubmitFailed(
        'demande_classement',
        'api',
        Object.keys(response.data.fieldErrorCodes || response.data.fieldErrors || {}).sort()
      );
      resetTurnstileToken();
      return;
    }

    trackFormSubmitSucceeded('demande_classement');
    setIsSuccess(true);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      message: '',
      consent: false,
    });
    setTurnstileToken(null);
    setTurnstileResetKey((prev) => prev + 1);

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-card border border-gray-200 p-8">
      <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">
        {demandeContent.title}
      </h2>
      <p className="text-textLight mb-8 leading-comfortable">{demandeContent.intro}</p>

      {isSuccess && (
        <div className="mb-6 p-4 bg-success-100 border border-success-200 rounded-lg text-success-500">
          {demandeContent.success}
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-alert-100 border border-alert-200 rounded-lg text-alert-500">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={demandeContent.labels.nom}
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            required
          />

          <Input
            label={demandeContent.labels.prenom}
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            error={errors.prenom}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={demandeContent.labels.email}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label={demandeContent.labels.telephone}
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder={demandeContent.placeholders.telephone}
            required
          />
        </div>

        <Input
          label={demandeContent.labels.adresse}
          name="adresse"
          type="text"
          value={formData.adresse}
          onChange={handleChange}
          error={errors.adresse}
          placeholder={demandeContent.placeholders.adresse}
          required
        />

        <Textarea
          label={demandeContent.labels.message}
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          placeholder={demandeContent.placeholders.message}
        />

        <Checkbox
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          error={errors.consent}
          label={
            <>
              {demandeContent.consentPrefix}{' '}
              <Link to={privacyPath} className="text-primary-300 hover:text-primary-400">
                {demandeContent.privacyLinkLabel}
              </Link>
            </>
          }
          required
        />

        <TurnstileField
          onTokenChange={handleTurnstileChange}
          error={errors.turnstileToken}
          resetKey={turnstileResetKey}
          locale={locale}
          messages={content.turnstile}
        />

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? demandeContent.submitting : demandeContent.submitButton}
        </Button>
      </form>
    </div>
  );
}
