import { useState, FormEvent } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import {
  validateDemandeClassementForm,
  DemandeClassementFormData,
  ValidationError,
} from '../../utils/formValidation';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    const validationErrors = validateDemandeClassementForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    console.log('Demande de Classement Payload:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
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

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className='bg-white rounded-card border border-gray-200 p-8'>
      <h2 className='text-2xl font-playfair font-semibold text-gray-900 mb-2'>
        Formulaire de demande
      </h2>
      <p className='text-textLight mb-8 leading-comfortable'>
        Renseignez les informations ci-dessous pour démarrer votre démarche de classement.
      </p>

      {isSuccess && (
        <div className='mb-6 p-4 bg-success-100 border border-success-200 rounded-lg text-success-500'>
          Votre demande a été envoyée avec succès ! Notre équipe reviendra vers vous sous 24 heures.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='Nom'
            name='nom'
            type='text'
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            required
          />

          <Input
            label='Prénom'
            name='prenom'
            type='text'
            value={formData.prenom}
            onChange={handleChange}
            error={errors.prenom}
            required
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='Email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label='Téléphone'
            name='telephone'
            type='tel'
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder='Ex: 06 12 34 56 78'
            required
          />
        </div>

        <Input
          label='Adresse du bien'
          name='adresse'
          type='text'
          value={formData.adresse}
          onChange={handleChange}
          error={errors.adresse}
          placeholder='Adresse complète de votre meublé de tourisme'
          required
        />

        <Textarea
          label='Message'
          name='message'
          rows={5}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          helperText='Parlez-nous de votre hébergement et de vos attentes (optionnel)'
        />

        <Checkbox
          name='consent'
          checked={formData.consent}
          onChange={handleChange}
          error={errors.consent}
          label={
            <>
              J'accepte que mes données soient traitées conformément à la{' '}
              <a href='/confidentialite' className='text-primary-300 hover:text-primary-400'>
                politique de confidentialité
              </a>
            </>
          }
          required
        />

        <Button
          type='submit'
          variant='primary'
          className='w-full'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </Button>
      </form>
    </div>
  );
}
