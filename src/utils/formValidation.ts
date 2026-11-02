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
  const normalizedPhone = phone.trim().replace(/[\s().-]/g, '');

  const frenchPhoneRegex = /^0[1-9]\d{8}$/;
  const internationalPhoneRegex = /^(?:\+|00)[1-9]\d{6,14}$/;

  return frenchPhoneRegex.test(normalizedPhone) || internationalPhoneRegex.test(normalizedPhone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePostalCode = (codePostal: string): boolean => /^\d{5}$/.test(codePostal);

export interface ContactFormData {
  nom: string;
  email: string;
  message: string;
  consent: boolean;
}

export const CLASSEMENT_ACTUEL_DECLARE_VALUES = [
  'NC',
  'UNE_ETOILE',
  'DEUX_ETOILES',
  'TROIS_ETOILES',
  'QUATRE_ETOILES',
  'CINQ_ETOILES',
  'INCONNU',
] as const;

export type ClassementActuelDeclare = (typeof CLASSEMENT_ACTUEL_DECLARE_VALUES)[number];

export const DEMANDE_ADRESSE_MAX_LENGTH = 255;

export interface DemandeClassementFormData {
  codePostal: string;
  commune: string;
  codeInsee: string;
  adresse: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  classementActuelDeclare: ClassementActuelDeclare | '';
  message: string;
  consent: boolean;
}

export type DemandeClassementStep = 0 | 1 | 2;

export const DEMANDE_CLASSEMENT_LAST_STEP: DemandeClassementStep = 2;

const DEMANDE_CLASSEMENT_STEPS: DemandeClassementStep[] = [0, 1, 2];

const DEMANDE_CLASSEMENT_FIELD_STEPS: Record<string, DemandeClassementStep> = {
  codePostal: 0,
  commune: 0,
  adresse: 0,
  nom: 1,
  prenom: 1,
  email: 1,
  telephone: 1,
  classementActuelDeclare: 2,
  message: 2,
  consent: 2,
  turnstileToken: 2,
};

/** Première étape portant une erreur, ou `null` si aucune erreur ne concerne un champ affiché. */
export const getFirstDemandeClassementStepWithError = (
  errors: ValidationError
): DemandeClassementStep | null => {
  const steps = Object.keys(errors)
    .map((field) => DEMANDE_CLASSEMENT_FIELD_STEPS[field])
    .filter((step) => step !== undefined);

  return steps.length > 0 ? (Math.min(...steps) as DemandeClassementStep) : null;
};

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

export const validateDemandeClassementStep = (
  step: DemandeClassementStep,
  data: DemandeClassementFormData,
  locale: Locale = DEFAULT_LOCALE
): ValidationError => {
  const errors: ValidationError = {};
  const messages = formContent[locale].validation;

  if (step === 0) {
    if (!validateRequired(data.codePostal)) {
      errors.codePostal = messages.codePostalRequired;
    } else if (!validatePostalCode(data.codePostal)) {
      errors.codePostal = messages.codePostalInvalid;
    } else if (!data.commune || !data.codeInsee) {
      errors.commune = messages.communeRequired;
    } else if (!validateRequired(data.adresse)) {
      // L'adresse n'est demandée qu'une fois la commune confirmée.
      errors.adresse = messages.adresseRequired;
    } else if (data.adresse.trim().length > DEMANDE_ADRESSE_MAX_LENGTH) {
      errors.adresse = messages.adresseTooLong;
    }
  }

  if (step === 1) {
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
  }

  if (step === 2) {
    if (!data.classementActuelDeclare) {
      errors.classementActuelDeclare = messages.classementRequired;
    }

    if (!data.consent) {
      errors.consent = messages.consentRequired;
    }
  }

  return errors;
};

export const validateDemandeClassementForm = (
  data: DemandeClassementFormData,
  locale: Locale = DEFAULT_LOCALE
): ValidationError =>
  Object.assign(
    {},
    ...DEMANDE_CLASSEMENT_STEPS.map((step) => validateDemandeClassementStep(step, data, locale))
  );
