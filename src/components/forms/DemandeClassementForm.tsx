import { ChangeEvent, FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import RadioGroup from '../ui/RadioGroup';
import ClientCoordonneesFields from './ClientCoordonneesFields';
import CommuneLookupField from './CommuneLookupField';
import FormPhoneLink from './FormPhoneLink';
import TurnstileField from './TurnstileField';
import FormSuccess from './FormSuccess';
import { useCommuneLookup } from '../../hooks/useCommuneLookup';
import {
  buildDemandeClassementPayload,
  CIVILITE_VALUES,
  CLASSEMENT_ACTUEL_DECLARE_VALUES,
  DEMANDE_CLASSEMENT_LAST_STEP,
  getFirstDemandeClassementStepWithError,
  isPostalCodeValidForCountry,
  PAYS_FRANCE,
  validateDemandeClassementForm,
  validateDemandeClassementStep,
  type AdresseIdentique,
  type Civilite,
  type DemandeClassementFormData,
  type DemandeClassementStep,
  type TypeClient,
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
import { createSubmissionId } from '../../utils/submissionId';
import {
  formContent,
  getLocalizedApiErrorMessage,
  getLocalizedFieldErrorMessage,
  getLocalizedFieldErrors,
} from '../../i18n/formContent';
import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales';
import { getLocalizedPath } from '../../i18n/routeHelpers';

type DemandeClassementFormProps = {
  locale?: Locale;
};

type DemandeClassementSubmissionPayload = ReturnType<typeof buildDemandeClassementPayload> & {
  submissionId: string;
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

type SubmitFailure = {
  error: string;
  errorCode?: ApiErrorCode | undefined;
  fieldErrors?: Record<string, string> | undefined;
  fieldErrorCodes?: Record<string, FieldErrorCode> | undefined;
};

type SubmitError = {
  message: string;
  showPhone: boolean;
};

const CONSENT_VERSION = 'privacy-v1';

const ERROR_CODES_WITH_PHONE: readonly ApiErrorCode[] = [
  'SUBMISSION_CONFLICT',
  'REFERENTIAL_UNAVAILABLE',
];

const EMPTY_ADRESSE_CLIENT = {
  adresseClient: '',
  complementAdresseClient: '',
  codePostalClient: '',
  villeClient: '',
  paysClient: PAYS_FRANCE,
};

const ADRESSE_CLIENT_FIELDS = Object.keys(EMPTY_ADRESSE_CLIENT);

const INITIAL_FORM_DATA: DemandeClassementFormData = {
  codePostal: '',
  commune: '',
  codeInsee: '',
  adresse: '',
  civilite: '',
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  typeClient: '',
  raisonSociale: '',
  numSiret: '',
  adresseClientIdentiqueLogement: '',
  ...EMPTY_ADRESSE_CLIENT,
  classementActuelDeclare: '',
  message: '',
  consent: false,
};

export default function DemandeClassementForm({
  locale = DEFAULT_LOCALE,
}: DemandeClassementFormProps) {
  const content = formContent[locale];
  const demandeContent = content.demandeClassement;
  const stepLabels: readonly string[] = demandeContent.steps;
  const privacyPath = getLocalizedPath('confidentialite', locale) ?? '/confidentialite';
  const [formData, setFormData] = useState<DemandeClassementFormData>(INITIAL_FORM_DATA);
  const [step, setStep] = useState<DemandeClassementStep>(0);
  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const {
    lookup: communeLookup,
    search: searchCommunes,
    reset: resetCommuneLookup,
  } = useCommuneLookup();
  const hasTrackedFormStarted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submissionPending = useRef(false);
  // Conservé après toute erreur : seul un succès ouvre une nouvelle demande distincte.
  const submissionId = useRef<string | null>(null);
  const lastConvertedSubmissionId = useRef<string | null>(null);
  const pendingFocus = useRef<'error' | 'step' | 'start' | null>(null);
  const titleId = useId();
  const isLastStep = step === DEMANDE_CLASSEMENT_LAST_STEP;

  useEffect(() => {
    const form = formRef.current;
    if (pendingFocus.current === 'error') {
      form?.querySelector<HTMLElement>('[aria-invalid="true"], .inquiry-error')?.focus();
    } else if (pendingFocus.current === 'step') {
      form?.querySelector<HTMLElement>('legend')?.focus();
    } else if (pendingFocus.current === 'start') {
      form?.querySelector<HTMLInputElement>('[name="codePostal"]')?.focus();
    }
    pendingFocus.current = null;
  }, [errors, submitError, isSuccess, step]);

  const markFormStarted = () => {
    if (!hasTrackedFormStarted.current) {
      hasTrackedFormStarted.current = trackFormStarted('demande_classement');
    }
  };

  const clearFieldErrors = (fields: string[]) => {
    setErrors((prev) => {
      if (!fields.some((field) => prev[field])) return prev;
      const nextErrors = { ...prev };
      fields.forEach((field) => delete nextErrors[field]);
      return nextErrors;
    });
  };

  const goToStep = (nextStep: DemandeClassementStep) => {
    // Le widget est démonté hors de la dernière étape : son jeton ne doit pas lui survivre.
    if (nextStep !== DEMANDE_CLASSEMENT_LAST_STEP) {
      setTurnstileToken(null);
    }
    setStep(nextStep);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    markFormStarted();

    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSubmitError(null);
    clearFieldErrors([name]);
  };

  const runCommuneSearch = async (codePostal: string) => {
    const communes = await searchCommunes(codePostal);
    const [uniqueCommune] = communes?.length === 1 ? communes : [];
    if (uniqueCommune) {
      setFormData((prev) => ({
        ...prev,
        commune: uniqueCommune.nom,
        codeInsee: uniqueCommune.codeInsee,
      }));
    }
  };

  const handleCodePostalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const codePostal = e.target.value.replace(/\D/g, '').slice(0, 5);
    if (codePostal === formData.codePostal) return;

    markFormStarted();
    setFormData((prev) => ({ ...prev, codePostal, commune: '', codeInsee: '' }));
    setSubmitError(null);
    clearFieldErrors(['codePostal', 'commune']);

    if (codePostal.length === 5) {
      void runCommuneSearch(codePostal);
    } else {
      resetCommuneLookup();
    }
  };

  const handleCommuneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const communes = communeLookup.status === 'ready' ? communeLookup.communes : [];
    const commune = communes.find(({ codeInsee }) => codeInsee === e.target.value);

    setFormData((prev) => ({
      ...prev,
      commune: commune?.nom ?? '',
      codeInsee: commune?.codeInsee ?? '',
    }));
    setSubmitError(null);
    clearFieldErrors(['commune']);
  };

  const handleCommuneRetry = () => {
    formRef.current?.querySelector<HTMLInputElement>('[name="codePostal"]')?.focus();
    void runCommuneSearch(formData.codePostal);
  };

  const updateCoordonnees = (changes: Partial<DemandeClassementFormData>, fields: string[]) => {
    markFormStarted();
    setFormData((prev) => ({ ...prev, ...changes }));
    setSubmitError(null);
    clearFieldErrors(fields);
  };

  const handleCiviliteChange = (civilite: Civilite) => {
    updateCoordonnees({ civilite }, ['civilite']);
  };

  const handleTypeClientChange = (typeClient: TypeClient) => {
    // Une adresse étrangère n'est pas celle d'une société française : elle est ressaisie, jamais requalifiée en FR.
    const resetsAdresse = typeClient === 'PROFESSIONNEL' && formData.paysClient !== PAYS_FRANCE;
    updateCoordonnees(
      {
        typeClient,
        raisonSociale: '',
        numSiret: '',
        ...(resetsAdresse ? EMPTY_ADRESSE_CLIENT : {}),
      },
      ['typeClient', 'raisonSociale', 'numSiret', ...(resetsAdresse ? ADRESSE_CLIENT_FIELDS : [])]
    );
  };

  const handleAdresseIdentiqueChange = (adresseClientIdentiqueLogement: AdresseIdentique) => {
    updateCoordonnees({ adresseClientIdentiqueLogement, ...EMPTY_ADRESSE_CLIENT }, [
      'adresseClientIdentiqueLogement',
      ...ADRESSE_CLIENT_FIELDS,
    ]);
  };

  const handleNumSiretChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCoordonnees({ numSiret: e.target.value.replace(/\D/g, '').slice(0, 14) }, ['numSiret']);
  };

  const handleCodePostalClientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const codePostalClient =
      formData.paysClient === PAYS_FRANCE ? value.replace(/\D/g, '').slice(0, 5) : value;
    updateCoordonnees({ codePostalClient }, ['codePostalClient']);
  };

  const handlePaysClientChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const paysClient = e.target.value;
    const isCompatible = isPostalCodeValidForCountry(paysClient, formData.codePostalClient);
    updateCoordonnees({ paysClient, ...(isCompatible ? {} : { codePostalClient: '' }) }, [
      'paysClient',
      'codePostalClient',
    ]);
  };

  const handleTurnstileChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
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

  const showValidationErrors = (validationErrors: ValidationError) => {
    trackFormValidationFailed('demande_classement', Object.keys(validationErrors).sort());
    setErrors(validationErrors);
    pendingFocus.current = 'error';
    const errorStep = getFirstDemandeClassementStepWithError(validationErrors);
    if (errorStep !== null) {
      goToStep(errorStep);
    }
  };

  const handleSubmitFailure = (failure: SubmitFailure) => {
    // Le code INSEE reste technique : son erreur, comme son message backend, n'est jamais affichée.
    const { codeInsee: codeInseeError, ...fieldErrors } = getLocalizedFieldErrors(
      failure.fieldErrorCodes,
      locale,
      failure.fieldErrors
    );

    if (codeInseeError !== undefined || fieldErrors.commune !== undefined) {
      fieldErrors.commune = getLocalizedFieldErrorMessage('commune', 'INVALID_COMMUNE', locale);
      setFormData((prev) => ({ ...prev, commune: '', codeInsee: '' }));
      void runCommuneSearch(formData.codePostal);
    }

    pendingFocus.current = 'error';
    setErrors(fieldErrors);
    setSubmitError({
      message: failure.error,
      showPhone:
        failure.errorCode !== undefined && ERROR_CODES_WITH_PHONE.includes(failure.errorCode),
    });
    resetTurnstileToken();
    const errorStep = getFirstDemandeClassementStepWithError(fieldErrors);
    if (errorStep !== null) {
      goToStep(errorStep);
    }
    trackFormSubmitFailed(
      'demande_classement',
      'api',
      Object.keys(failure.fieldErrorCodes || failure.fieldErrors || {}).sort()
    );
  };

  const handlePrevious = () => {
    if (step === 0) return;
    setErrors({});
    setSubmitError(null);
    pendingFocus.current = 'step';
    goToStep(step === 2 ? 1 : 0);
  };

  const handleNext = () => {
    const validationErrors = validateDemandeClassementStep(step, formData, locale);
    if (Object.keys(validationErrors).length > 0) {
      showValidationErrors(validationErrors);
      return;
    }

    setErrors({});
    pendingFocus.current = 'step';
    goToStep(step === 0 ? 1 : 2);
  };

  const submitRequest = async () => {
    const validationErrors = validateDemandeClassementForm(formData, locale);
    if (!turnstileToken) {
      validationErrors.turnstileToken = content.turnstile.required;
    }

    if (Object.keys(validationErrors).length > 0 || !turnstileToken) {
      showValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    submissionPending.current = true;
    setErrors({});
    trackFormSubmitAttempted('demande_classement');

    const currentSubmissionId = submissionId.current ?? createSubmissionId();
    submissionId.current = currentSubmissionId;

    const payload: DemandeClassementSubmissionPayload = {
      ...buildDemandeClassementPayload(formData),
      submissionId: currentSubmissionId,
      turnstileToken,
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
      handleSubmitFailure(response);
      return;
    }

    if (!response.data.success) {
      handleSubmitFailure({
        ...response.data,
        error: getLocalizedApiErrorMessage(
          {
            errorCode: response.data.errorCode,
            fallbackError: response.data.error,
          },
          locale
        ),
      });
      return;
    }

    if (lastConvertedSubmissionId.current !== currentSubmissionId) {
      lastConvertedSubmissionId.current = currentSubmissionId;
      trackFormSubmitSucceeded('demande_classement');
      try {
        trackLeadCreatedConversion();
      } catch {
        // OpenAI Ads ne doit jamais empêcher l'affichage du succès métier.
      }
    }

    submissionId.current = null;
    setIsSuccess(true);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    resetCommuneLookup();
    goToStep(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submissionPending.current || isSuccess) return;
    markFormStarted();
    setSubmitError(null);

    if (isLastStep) {
      await submitRequest();
    } else {
      handleNext();
    }
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

        <ol className="inquiry-steps" aria-label={demandeContent.progressLabel}>
          {stepLabels.map((label, index) => (
            <li
              key={label}
              className={`inquiry-step ${index <= step ? 'inquiry-step-reached' : ''}`}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="inquiry-step-number" aria-hidden="true">
                {index < step ? <Check size={14} /> : index + 1}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset className="inquiry-fieldset">
            <legend tabIndex={-1}>{demandeContent.sections.property}</legend>
            <div className="inquiry-fields">
              <CommuneLookupField
                content={demandeContent}
                codePostal={formData.codePostal}
                codeInsee={formData.codeInsee}
                lookup={communeLookup}
                codePostalError={errors.codePostal}
                communeError={errors.commune}
                onCodePostalChange={handleCodePostalChange}
                onCommuneChange={handleCommuneChange}
                onRetry={handleCommuneRetry}
              />
              {formData.codeInsee && (
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
              )}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="inquiry-fieldset">
            <legend tabIndex={-1}>{demandeContent.sections.contact}</legend>
            <div className="inquiry-fields">
              <RadioGroup
                label={demandeContent.labels.civilite}
                name="civilite"
                value={formData.civilite}
                options={CIVILITE_VALUES.map((value) => ({
                  value,
                  label: demandeContent.civiliteOptions[value],
                }))}
                onChange={handleCiviliteChange}
                error={errors.civilite}
                required
              />
              <div className="inquiry-field-grid">
                <Input
                  label={demandeContent.labels.nom}
                  name="nom"
                  type="text"
                  autoComplete="family-name"
                  maxLength={255}
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
                  maxLength={255}
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
                  maxLength={255}
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
                  maxLength={50}
                  value={formData.telephone}
                  onChange={handleChange}
                  error={errors.telephone}
                  placeholder={demandeContent.placeholders.telephone}
                  required
                />
              </div>
              <ClientCoordonneesFields
                content={demandeContent}
                locale={locale}
                data={formData}
                errors={errors}
                onChange={handleChange}
                onTypeClientChange={handleTypeClientChange}
                onAdresseIdentiqueChange={handleAdresseIdentiqueChange}
                onNumSiretChange={handleNumSiretChange}
                onCodePostalClientChange={handleCodePostalClientChange}
                onPaysClientChange={handlePaysClientChange}
              />
            </div>
          </fieldset>
        )}

        {isLastStep && (
          <fieldset className="inquiry-fieldset" disabled={isSubmitting}>
            <legend tabIndex={-1}>{demandeContent.sections.request}</legend>
            <div className="inquiry-fields">
              <Select
                label={demandeContent.labels.classementActuelDeclare}
                name="classementActuelDeclare"
                value={formData.classementActuelDeclare}
                onChange={handleChange}
                error={errors.classementActuelDeclare}
                options={[
                  { value: '', label: demandeContent.placeholders.classementActuelDeclare },
                  ...CLASSEMENT_ACTUEL_DECLARE_VALUES.map((value) => ({
                    value,
                    label: demandeContent.classementOptions[value],
                  })),
                ]}
                required
              />
              <Textarea
                label={demandeContent.labels.message}
                name="message"
                rows={4}
                maxLength={4000}
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                placeholder={demandeContent.placeholders.message}
              />
            </div>
          </fieldset>
        )}

        <div className="inquiry-submit">
          {isLastStep && (
            <>
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
            </>
          )}
          {submitError && (
            <div className="inquiry-error ui-focus" role="alert" tabIndex={-1}>
              {submitError.message}
              {submitError.showPhone && (
                <>
                  {' '}
                  <FormPhoneLink />
                </>
              )}
            </div>
          )}
          <div className="inquiry-wizard-actions">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                className="inquiry-previous-button"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                {demandeContent.actions.previous}
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              className="inquiry-submit-button"
              disabled={isSubmitting || (step === 0 && communeLookup.status === 'loading')}
            >
              {isSubmitting
                ? demandeContent.submitting
                : isLastStep
                  ? demandeContent.submitButton
                  : demandeContent.actions.next}
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
        </div>
      </form>
    </div>
  );
}
