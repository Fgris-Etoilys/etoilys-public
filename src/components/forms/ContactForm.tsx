import { useState, FormEvent } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { validateContactForm, ContactFormData, ValidationError } from '../../utils/formValidation';

interface ContactFormProps {
  title?: string;
  submitButtonText?: string;
  successMessage?: string;
}

export default function ContactForm({
  title = 'Envoyez-nous un message',
  submitButtonText = 'Envoyer',
  successMessage = 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
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

    const validationErrors = validateContactForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    console.log('Contact Form Payload:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        nom: '',
        email: '',
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
      <h3 className='text-2xl font-playfair font-semibold text-gray-900 mb-6'>
        {title}
      </h3>

      {isSuccess && (
        <div className='mb-6 p-4 bg-success-100 border border-success-200 rounded-lg text-success-500'>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
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
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Textarea
          label='Message'
          name='message'
          rows={5}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          required
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
          {isSubmitting ? 'Envoi en cours...' : submitButtonText}
        </Button>
      </form>
    </div>
  );
}
