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
      pendingFocus.current = 'error';
      return;
    }

    setIsSubmitting(true);
    submissionPending.current = true;
    setErrors({});
    trackFormSubmitAttempted('contact');

    const verifiedTurnstileToken = turnstileToken;
    if (!verifiedTurnstileToken) {
      setIsSubmitting(false);
      submissionPending.current = false;
      pendingFocus.current = 'error';
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
    submissionPending.current = false;

    if (!response.success) {
      pendingFocus.current = 'error';
      setErrors(getLocalizedFieldErrors(response.fieldErrorCodes, locale, response.fieldErrors));
      setSubmitError(response.error);
      resetTurnstileToken();
      trackFormSubmitFailed(
        'contact',
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
        'contact',
        'api',
        Object.keys(response.data.fieldErrorCodes || response.data.fieldErrors || {}).sort()
      );
      resetTurnstileToken();
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
  };

  return (
    <div className="inquiry-form">
      {isSuccess && (
        <FormSuccess
          title={contactContent.successTitle}
          message={displayedSuccessMessage}
          actionLabel={contactContent.successAction}
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
            {displayedTitle}
          </h2>
          <p className="inquiry-form-note">{contactContent.requiredNote}</p>
        </div>
        <div className="inquiry-field-grid">
          <Input
            label={contactContent.labels.nom}
            name="nom"
            type="text"
            autoComplete="name"
            placeholder={contactContent.placeholders.nom}
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            disabled={isSubmitting}
            required
          />

          <Input
            label={contactContent.labels.email}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={contactContent.placeholders.email}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            required
          />
        </div>

        <Textarea
          label={contactContent.labels.message}
          name="message"
          rows={5}
          placeholder={contactContent.placeholders.message}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          disabled={isSubmitting}
          required
        />

        <div className="inquiry-submit">
          <Checkbox
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            error={errors.consent}
            disabled={isSubmitting}
            label={
              <>
                {contactContent.consentPrefix}{' '}
                <Link to={privacyPath} className="editorial-inline-link">
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
            {isSubmitting ? contactContent.submitting : displayedSubmitButtonText}
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
