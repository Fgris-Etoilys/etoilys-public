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

export const validateSiret = (numSiret: string): boolean => /^\d{14}$/.test(numSiret);

export const PAYS_FRANCE = 'FR';

/** Mêmes règles que le BO et le backend : un code vide n'est pas invalide, seulement absent. */
export const isPostalCodeValidForCountry = (pays: string, codePostal: string): boolean => {
  const value = codePostal.trim();
  if (!value) return true;
  return pays === PAYS_FRANCE ? validatePostalCode(value) : /^[A-Za-z0-9 -]{1,10}$/.test(value);
};

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

export const CIVILITE_VALUES = ['Madame', 'Monsieur'] as const;

export type Civilite = (typeof CIVILITE_VALUES)[number];

export const TYPE_CLIENT_VALUES = ['PARTICULIER', 'PROFESSIONNEL'] as const;

export type TypeClient = (typeof TYPE_CLIENT_VALUES)[number];

export const ADRESSE_IDENTIQUE_VALUES = ['oui', 'non'] as const;

export type AdresseIdentique = (typeof ADRESSE_IDENTIQUE_VALUES)[number];

export interface DemandeClassementFormData {
  codePostal: string;
  commune: string;
  codeInsee: string;
  adresse: string;
  civilite: Civilite | '';
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeClient: TypeClient | '';
  raisonSociale: string;
  numSiret: string;
  adresseClientIdentiqueLogement: AdresseIdentique | '';
  adresseClient: string;
  complementAdresseClient: string;
  codePostalClient: string;
  villeClient: string;
  paysClient: string;
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
  civilite: 1,
  nom: 1,
  prenom: 1,
  email: 1,
  telephone: 1,
  typeClient: 1,
  raisonSociale: 1,
  numSiret: 1,
  adresseClientIdentiqueLogement: 1,
  adresseClient: 1,
  complementAdresseClient: 1,
  codePostalClient: 1,
  villeClient: 1,
  paysClient: 1,
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
    if (!data.civilite) {
      errors.civilite = messages.civiliteRequired;
    }

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

    if (!data.typeClient) {
      errors.typeClient = messages.typeClientRequired;
    } else if (!data.adresseClientIdentiqueLogement) {
      // La question d'adresse n'est posée qu'une fois le type choisi, son libellé en dépend.
      errors.adresseClientIdentiqueLogement = messages.adresseIdentiqueRequired;
    }

    if (data.typeClient === 'PROFESSIONNEL') {
      if (!validateRequired(data.raisonSociale)) {
        errors.raisonSociale = messages.raisonSocialeRequired;
      }

      if (!validateRequired(data.numSiret)) {
        errors.numSiret = messages.numSiretRequired;
      } else if (!validateSiret(data.numSiret)) {
        errors.numSiret = messages.numSiretInvalid;
      }
    }

    if (data.adresseClientIdentiqueLogement === 'non') {
      if (!validateRequired(data.adresseClient)) {
        errors.adresseClient = messages.adresseClientRequired;
      }

      if (!validateRequired(data.villeClient)) {
        errors.villeClient = messages.villeClientRequired;
      }

      const isFrance = data.paysClient === PAYS_FRANCE;
      if (isFrance && !validateRequired(data.codePostalClient)) {
        errors.codePostalClient = messages.codePostalRequired;
      } else if (!isPostalCodeValidForCountry(data.paysClient, data.codePostalClient)) {
        errors.codePostalClient = isFrance
          ? messages.codePostalInvalid
          : messages.codePostalEtrangerInvalid;
      }
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

/** Seuls les champs applicables partent : le backend refuse une valeur devenue sans objet. */
export const buildDemandeClassementPayload = ({
  raisonSociale,
  numSiret,
  adresseClientIdentiqueLogement,
  adresseClient,
  complementAdresseClient,
  codePostalClient,
  villeClient,
  paysClient,
  ...fields
}: DemandeClassementFormData) => {
  const complement = complementAdresseClient.trim();
  const codePostal = codePostalClient.trim();

  return {
    ...fields,
    adresseClientIdentiqueLogement: adresseClientIdentiqueLogement === 'oui',
    ...(fields.typeClient === 'PROFESSIONNEL' && {
      raisonSociale: raisonSociale.trim(),
      numSiret,
    }),
    ...(adresseClientIdentiqueLogement === 'non' && {
      adresseClient: adresseClient.trim(),
      ...(complement ? { complementAdresseClient: complement } : {}),
      ...(codePostal ? { codePostalClient: codePostal } : {}),
      villeClient: villeClient.trim(),
      paysClient,
    }),
  };
};
