import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import TurnstileField from './TurnstileField';
import FormSuccess from './FormSuccess';
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
import { trackLeadCreatedConversion } from '../../utils/openAiAds';
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
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const submissionPending = useRef(false);
  const pendingFocus = useRef<'error' | 'start' | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (pendingFocus.current === 'error') {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (firstInvalid ?? errorRef.current)?.focus();
    } else if (pendingFocus.current === 'start') {
      formRef.current?.querySelector<HTMLInputElement>('[name="nom"]')?.focus();
    }
    pendingFocus.current = null;
  }, [errors, submitError, isSuccess]);

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
    if (submissionPending.current || isSuccess) return;
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
      pendingFocus.current = 'error';
      return;
    }

    setIsSubmitting(true);
    submissionPending.current = true;
    setErrors({});
    trackFormSubmitAttempted('demande_classement');

    const verifiedTurnstileToken = turnstileToken;
    if (!verifiedTurnstileToken) {
      setIsSubmitting(false);
      submissionPending.current = false;
      pendingFocus.current = 'error';
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
    submissionPending.current = false;

    if (!response.success) {
      pendingFocus.current = 'error';
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
      pendingFocus.current = 'error';
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
    try {
      trackLeadCreatedConversion();
    } catch {
      // OpenAI Ads ne doit jamais empêcher l'affichage du succès métier.
    }
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
  };

  return (
    <div className="inquiry-form">
      {isSuccess && (
        <FormSuccess
          title={demandeContent.successTitle}
          message={demandeContent.success}
          actionLabel={demandeContent.successAction}
          onRestart={() => {
            pendingFocus.current = 'start';
            setIsSuccess(false);
          }}
        />
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="inquiry-fields"
        aria-labelledby={titleId}
        aria-busy={isSubmitting}
        noValidate
        hidden={isSuccess}
      >
        <div>
          <h2 id={titleId} className="inquiry-form-heading">
            {demandeContent.title}
          </h2>
          <p className="inquiry-form-note">{demandeContent.requiredNote}</p>
        </div>
        <fieldset className="inquiry-fieldset" disabled={isSubmitting}>
          <legend>{demandeContent.sections.contact}</legend>
          <div className="inquiry-fields">
            <div className="inquiry-field-grid">
              <Input
                label={demandeContent.labels.nom}
                name="nom"
                type="text"
                autoComplete="family-name"
                placeholder={demandeContent.placeholders.nom}
                value={formData.nom}
                onChange={handleChange}
                error={errors.nom}
                required
              />
              <Input
                label={demandeContent.labels.prenom}
                name="prenom"
                type="text"
                autoComplete="given-name"
                placeholder={demandeContent.placeholders.prenom}
                value={formData.prenom}
                onChange={handleChange}
                error={errors.prenom}
                required
              />
            </div>
            <div className="inquiry-field-grid">
              <Input
                label={demandeContent.labels.email}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={demandeContent.placeholders.email}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label={demandeContent.labels.telephone}
                name="telephone"
                type="tel"
                autoComplete="tel"
                value={formData.telephone}
                onChange={handleChange}
                error={errors.telephone}
                placeholder={demandeContent.placeholders.telephone}
                helperText={demandeContent.telephoneHint}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="inquiry-fieldset" disabled={isSubmitting}>
          <legend>{demandeContent.sections.property}</legend>
          <div className="inquiry-fields">
            <Input
              label={demandeContent.labels.adresse}
              name="adresse"
              type="text"
              autoComplete="off"
              value={formData.adresse}
              onChange={handleChange}
              error={errors.adresse}
              placeholder={demandeContent.placeholders.adresse}
              required
            />
            <Textarea
              label={demandeContent.labels.message}
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              placeholder={demandeContent.placeholders.message}
            />
          </div>
        </fieldset>

        <div className="inquiry-submit">
          <Checkbox
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            error={errors.consent}
            disabled={isSubmitting}
            label={
              <>
                {demandeContent.consentPrefix}{' '}
                <Link to={privacyPath} className="editorial-inline-link">
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
          {submitError && (
            <div ref={errorRef} className="inquiry-error ui-focus" role="alert" tabIndex={-1}>
              {submitError}
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            className="inquiry-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? demandeContent.submitting : demandeContent.submitButton}
            {isSubmitting ? (
              <LoaderCircle
                className="inquiry-submit-icon motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ArrowRight className="inquiry-submit-icon" aria-hidden="true" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
