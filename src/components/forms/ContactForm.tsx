import { FormEvent, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import TurnstileField from './TurnstileField';
import {
  validateContactForm,
  type ContactFormData,
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

interface ContactFormProps {
  locale?: Locale;
  title?: string;
  submitButtonText?: string;
  successMessage?: string;
}

type ContactSubmissionPayload = ContactFormData & {
  turnstileToken: string;
  consentVersion: typeof CONSENT_VERSION;
  preferredLanguage: Locale;
};

type ContactSubmissionResponse =
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

export default function ContactForm({
  locale = DEFAULT_LOCALE,
  title,
  submitButtonText,
  successMessage,
}: ContactFormProps) {
  const content = formContent[locale];
  const contactContent = content.contact;
  const privacyPath = getLocalizedPath('confidentialite', locale) ?? '/confidentialite';
  const displayedTitle = title ?? contactContent.title;
  const displayedSubmitButtonText = submitButtonText ?? contactContent.submitButton;
  const displayedSuccessMessage = successMessage ?? contactContent.success;
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
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
      trackFormStarted('contact');
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
    setSubmitError(null);
    setErrors((prev) => {
      if (!prev.turnstileToken) return prev;
      const nextErrors = { ...prev };
      delete nextErrors.turnstileToken;
      return nextErrors;
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasTrackedFormStarted.current) {
      trackFormStarted('contact');
      hasTrackedFormStarted.current = true;
    }

    setIsSuccess(false);
    setSubmitError(null);

    const validationErrors = validateContactForm(formData, locale);

    if (!turnstileToken) {
      validationErrors.turnstileToken = content.turnstile.required;
    }

    if (Object.keys(validationErrors).length > 0) {
      trackFormValidationFailed('contact', Object.keys(validationErrors).sort());
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    trackFormSubmitAttempted('contact');

    const verifiedTurnstileToken = turnstileToken;
    if (!verifiedTurnstileToken) {
      setIsSubmitting(false);
      setErrors({ turnstileToken: content.turnstile.required });
      return;
    }

    const payload: ContactSubmissionPayload = {
      ...formData,
      turnstileToken: verifiedTurnstileToken,
      consentVersion: CONSENT_VERSION,
      preferredLanguage: locale,
    };

    const response = await submitToApi<ContactSubmissionResponse, ContactSubmissionPayload>(
      '/public/forms/contact',
      payload,
      { locale }
    );

    setIsSubmitting(false);

    if (!response.success) {
      setErrors(getLocalizedFieldErrors(response.fieldErrorCodes, locale, response.fieldErrors));
      setSubmitError(response.error);
      trackFormSubmitFailed('contact', 'api', Object.keys(response.fieldErrorCodes || {}).sort());
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
        'contact',
        'api',
        Object.keys(response.data.fieldErrorCodes || response.data.fieldErrors || {}).sort()
      );
      return;
    }

    trackFormSubmitSucceeded('contact');
    setIsSuccess(true);
    setFormData({
      nom: '',
      email: '',
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
      <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-6">{displayedTitle}</h3>

      {isSuccess && (
        <div className="mb-6 p-4 bg-success-100 border border-success-200 rounded-lg text-success-500">
          {displayedSuccessMessage}
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-alert-100 border border-alert-200 rounded-lg text-alert-500">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={contactContent.labels.nom}
          name="nom"
          type="text"
          value={formData.nom}
          onChange={handleChange}
          error={errors.nom}
          required
        />

        <Input
          label={contactContent.labels.email}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Textarea
          label={contactContent.labels.message}
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          required
        />

        <Checkbox
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          error={errors.consent}
          label={
            <>
              {contactContent.consentPrefix}{' '}
              <Link to={privacyPath} className="text-primary-300 hover:text-primary-400">
                {contactContent.privacyLinkLabel}
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
          {isSubmitting ? contactContent.submitting : displayedSubmitButtonText}
        </Button>
      </form>
    </div>
  );
}
