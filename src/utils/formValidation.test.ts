import { describe, expect, it } from 'vitest';
import {
  validateContactForm,
  validateDemandeClassementForm,
  validatePhone,
} from './formValidation';

describe('validatePhone', () => {
  it('accepts French phone numbers', () => {
    expect(validatePhone('0612345678')).toBe(true);
    expect(validatePhone('06 12 34 56 78')).toBe(true);
    expect(validatePhone('+33612345678')).toBe(true);
    expect(validatePhone('+33 6 12 34 56 78')).toBe(true);
    expect(validatePhone('0033612345678')).toBe(true);
  });

  it('accepts international phone numbers', () => {
    expect(validatePhone('+32 470 12 34 56')).toBe(true);
    expect(validatePhone('0032 470 12 34 56')).toBe(true);
    expect(validatePhone('+44 7700 900123')).toBe(true);
    expect(validatePhone('+31 6 12345678')).toBe(true);
    expect(validatePhone('+1 (202) 555-0123')).toBe(true);
  });

  it('rejects malformed phone numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('abcdefghij')).toBe(false);
    expect(validatePhone('+32 abc 12 34')).toBe(false);
    expect(validatePhone('+0123456789')).toBe(false);
    expect(validatePhone('+33')).toBe(false);
  });
});

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
