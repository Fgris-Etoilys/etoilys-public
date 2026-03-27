import { FormEvent, useCallback, useState } from 'react';
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
import { submitToApi } from '../../utils/api';

type DemandeSubmissionResponse =
  | {
      success: true;
      submissionId: string;
      message: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

const CONSENT_VERSION = 'privacy-v1';

export default function DemandeClassementForm() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setIsSuccess(false);
    setSubmitError(null);

    const validationErrors = validateDemandeClassementForm(formData);
    if (!turnstileToken) {
      validationErrors.turnstileToken = 'Merci de valider la verification anti-spam.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const response = await submitToApi<DemandeSubmissionResponse, Record<string, unknown>>(
      '/public/forms/classement',
      {
        ...formData,
        turnstileToken,
        consentVersion: CONSENT_VERSION,
      }
    );

    setIsSubmitting(false);

    if (!response.success) {
      setErrors(response.fieldErrors || {});
      setSubmitError(response.error);
      return;
    }

    if (!response.data.success) {
      setErrors(response.data.fieldErrors || {});
      setSubmitError(response.data.error || 'La soumission a echoue.');
      return;
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

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-card border border-gray-200 p-8">
      <h2 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">
        Formulaire de demande
      </h2>
      <p className="text-textLight mb-8 leading-comfortable">
        Renseignez les informations ci-dessous pour demarrer votre demarche de classement.
      </p>

      {isSuccess && (
        <div className="mb-6 p-4 bg-success-100 border border-success-200 rounded-lg text-success-500">
          Votre demande a ete envoyee avec succes. Notre equipe reviendra vers vous sous 24 heures.
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
            label="Nom"
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            required
          />

          <Input
            label="Prenom"
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Telephone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder="Ex: 06 12 34 56 78"
            required
          />
        </div>

        <Input
          label="Adresse du bien"
          name="adresse"
          type="text"
          value={formData.adresse}
          onChange={handleChange}
          error={errors.adresse}
          placeholder="Adresse complete de votre meuble de tourisme"
          required
        />

        <Textarea
          label="Message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          placeholder="Parlez-nous de votre hebergement et de vos attentes (optionnel)"
        />

        <Checkbox
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          error={errors.consent}
          label={
            <>
              J'accepte que mes donnees soient traitees conformement a la{' '}
              <Link to="/confidentialite" className="text-primary-300 hover:text-primary-400">
                politique de confidentialite
              </Link>
            </>
          }
          required
        />

        <TurnstileField
          onTokenChange={handleTurnstileChange}
          error={errors.turnstileToken}
          resetKey={turnstileResetKey}
        />

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </Button>
      </form>
    </div>
  );
}
