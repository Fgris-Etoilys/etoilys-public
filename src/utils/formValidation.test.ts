import { describe, expect, it } from 'vitest';
import { validateContactForm, validateDemandeClassementForm } from './formValidation';

describe('form validation i18n', () => {
  it('keeps French validation messages by default', () => {
    expect(
      validateContactForm({
        nom: '',
        email: 'email-invalide',
        message: '',
        consent: false,
      })
    ).toEqual({
      nom: 'Le nom est requis',
      email: "L'email n'est pas valide",
      message: 'Le message est requis',
      consent: 'Vous devez accepter la politique de confidentialité',
    });
  });

  it('returns English validation messages when locale is en', () => {
    expect(
      validateDemandeClassementForm(
        {
          nom: '',
          prenom: '',
          email: '',
          telephone: '123',
          adresse: '',
          message: '',
          consent: false,
        },
        'en'
      )
    ).toEqual({
      nom: 'Name is required',
      prenom: 'First name is required',
      email: 'Email is required',
      telephone: 'Phone number is not valid',
      adresse: 'Accommodation address is required',
      consent: 'You must accept the privacy policy',
    });
  });
});
