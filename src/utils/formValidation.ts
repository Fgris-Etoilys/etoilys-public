import { formContent } from '../i18n/formContent';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';

export interface ValidationError {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export interface ContactFormData {
  nom: string;
  email: string;
  message: string;
  consent: boolean;
}

export interface DemandeClassementFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  message: string;
  consent: boolean;
}

export const validateContactForm = (
  data: ContactFormData,
  locale: Locale = DEFAULT_LOCALE
): ValidationError => {
  const errors: ValidationError = {};
  const messages = formContent[locale].validation;

  if (!validateRequired(data.nom)) {
    errors.nom = messages.nomRequired;
  }

  if (!validateRequired(data.email)) {
    errors.email = messages.emailRequired;
  } else if (!validateEmail(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!validateRequired(data.message)) {
    errors.message = messages.messageRequired;
  }

  if (!data.consent) {
    errors.consent = messages.consentRequired;
  }

  return errors;
};

export const validateDemandeClassementForm = (
  data: DemandeClassementFormData,
  locale: Locale = DEFAULT_LOCALE
): ValidationError => {
  const errors: ValidationError = {};
  const messages = formContent[locale].validation;

  if (!validateRequired(data.nom)) {
    errors.nom = messages.nomRequired;
  }

  if (!validateRequired(data.prenom)) {
    errors.prenom = messages.prenomRequired;
  }

  if (!validateRequired(data.email)) {
    errors.email = messages.emailRequired;
  } else if (!validateEmail(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!validateRequired(data.telephone)) {
    errors.telephone = messages.telephoneRequired;
  } else if (!validatePhone(data.telephone)) {
    errors.telephone = messages.telephoneInvalid;
  }

  if (!validateRequired(data.adresse)) {
    errors.adresse = messages.adresseRequired;
  }

  if (!data.consent) {
    errors.consent = messages.consentRequired;
  }

  return errors;
};
