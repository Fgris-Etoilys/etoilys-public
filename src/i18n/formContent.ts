import { DEFAULT_LOCALE, type Locale } from './locales';
import type { ApiErrorCode, FieldErrorCode } from '../utils/api';

type FieldErrorMessages = Partial<Record<FieldErrorCode, string>>;

type FormContent = {
  contact: {
    title: string;
    labels: {
      nom: string;
      email: string;
      message: string;
    };
    consentPrefix: string;
    privacyLinkLabel: string;
    submitButton: string;
    submitting: string;
    success: string;
  };
  demandeClassement: {
    title: string;
    intro: string;
    labels: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse: string;
      message: string;
    };
    placeholders: {
      telephone: string;
      adresse: string;
      message: string;
    };
    consentPrefix: string;
    privacyLinkLabel: string;
    submitButton: string;
    submitting: string;
    success: string;
  };
  validation: {
    nomRequired: string;
    prenomRequired: string;
    emailRequired: string;
    emailInvalid: string;
    telephoneRequired: string;
    telephoneInvalid: string;
    adresseRequired: string;
    messageRequired: string;
    consentRequired: string;
  };
  turnstile: {
    required: string;
    missingConfig: string;
    expired: string;
    verificationError: string;
  };
  api: {
    genericError: string;
    invalidResponse: string;
    rateLimited: string;
    httpError: (status: number) => string;
    errorCodes: Record<ApiErrorCode, string>;
    fieldErrorCodes: Record<FieldErrorCode, string>;
    fieldErrors: Record<string, FieldErrorMessages>;
  };
};

export const formContent = {
  fr: {
    contact: {
      title: 'Posez-nous votre question',
      labels: {
        nom: 'Nom',
        email: 'Email',
        message: 'Message',
      },
      consentPrefix: "J'accepte que mes données soient traitées conformément à la",
      privacyLinkLabel: 'politique de confidentialité',
      submitButton: 'Envoyer mon message',
      submitting: 'Envoi en cours...',
      success:
        'Votre message a été envoyé avec succès. Notre équipe reviendra vers vous rapidement.',
    },
    demandeClassement: {
      title: 'Votre demande de classement',
      intro:
        "Indiquez vos coordonnées et l'adresse du logement à classer. Nous vous recontacterons rapidement pour organiser la suite.",
      labels: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        telephone: 'Téléphone',
        adresse: 'Adresse du bien',
        message: 'Message',
      },
      placeholders: {
        telephone: 'Ex: 06 12 34 56 78',
        adresse: 'Adresse complète de votre meublé de tourisme',
        message: 'Parlez-nous de votre hébergement et de vos attentes (optionnel)',
      },
      consentPrefix: "J'accepte que mes données soient traitées conformément à la",
      privacyLinkLabel: 'politique de confidentialité',
      submitButton: 'Envoyer ma demande',
      submitting: 'Envoi en cours...',
      success:
        'Votre demande a été envoyée avec succès. Notre équipe reviendra vers vous sous 24 heures.',
    },
    validation: {
      nomRequired: 'Le nom est requis',
      prenomRequired: 'Le prénom est requis',
      emailRequired: "L'email est requis",
      emailInvalid: "L'email n'est pas valide",
      telephoneRequired: 'Le téléphone est requis',
      telephoneInvalid: "Le numéro de téléphone n'est pas valide",
      adresseRequired: "L'adresse du bien est requise",
      messageRequired: 'Le message est requis',
      consentRequired: 'Vous devez accepter la politique de confidentialité',
    },
    turnstile: {
      required: 'Merci de valider la vérification anti-spam.',
      missingConfig: 'Protection anti-spam indisponible (configuration manquante).',
      expired: 'La vérification anti-spam a expiré. Merci de réessayer.',
      verificationError: 'Erreur de vérification anti-spam. Merci de réessayer.',
    },
    api: {
      genericError: 'Une erreur est survenue. Merci de réessayer plus tard.',
      invalidResponse: 'Réponse API invalide',
      rateLimited: 'Trop de requêtes envoyées en peu de temps. Réessayez dans quelques minutes.',
      httpError: (status: number) => `Erreur HTTP ${status}`,
      errorCodes: {
        METHOD_NOT_ALLOWED: 'La soumission du formulaire est indisponible.',
        INVALID_JSON: 'La soumission a échoué. Merci de réessayer.',
        INVALID_PAYLOAD: 'La soumission a échoué. Merci de réessayer.',
        VALIDATION_FAILED: 'Certains champs doivent être corrigés.',
        TURNSTILE_INVALID: 'La vérification anti-spam a échoué. Merci de réessayer.',
        RATE_LIMITED: 'Trop de requêtes envoyées en peu de temps. Réessayez dans quelques minutes.',
        RATE_LIMIT_UNAVAILABLE: 'Une erreur est survenue. Merci de réessayer plus tard.',
        INSERT_FAILED: "Impossible d'enregistrer la demande. Merci de réessayer plus tard.",
        NOTIFICATION_FAILED:
          'Demande enregistrée mais notification indisponible. Merci de réessayer plus tard.',
      },
      fieldErrorCodes: {
        REQUIRED: 'Ce champ est requis.',
        INVALID_EMAIL: "L'email n'est pas valide.",
        INVALID_PHONE: "Le numéro de téléphone n'est pas valide.",
      },
      fieldErrors: {
        nom: { REQUIRED: 'Le nom est requis.' },
        prenom: { REQUIRED: 'Le prénom est requis.' },
        email: {
          REQUIRED: "L'email est requis.",
          INVALID_EMAIL: "L'email n'est pas valide.",
        },
        telephone: {
          REQUIRED: 'Le téléphone est requis.',
          INVALID_PHONE: "Le numéro de téléphone n'est pas valide.",
        },
        adresse: { REQUIRED: "L'adresse du bien est requise." },
        message: { REQUIRED: 'Le message est requis.' },
        consent: { REQUIRED: 'Le consentement est requis.' },
        consentVersion: { REQUIRED: 'La version de consentement est requise.' },
        turnstileToken: { REQUIRED: 'La vérification anti-spam est requise.' },
      },
    },
  },
  en: {
    contact: {
      title: 'Ask us your question',
      labels: {
        nom: 'Name',
        email: 'Email',
        message: 'Message',
      },
      consentPrefix: 'I agree that my data may be processed in accordance with the',
      privacyLinkLabel: 'privacy policy',
      submitButton: 'Send my message',
      submitting: 'Sending...',
      success: 'Your message has been sent successfully. Our team will get back to you soon.',
    },
    demandeClassement: {
      title: 'Your classification request',
      intro:
        'Enter your contact details and the address of the accommodation to be classified. We will contact you quickly to organize the next steps.',
      labels: {
        nom: 'Last name',
        prenom: 'First name',
        email: 'Email',
        telephone: 'Phone',
        adresse: 'Accommodation address',
        message: 'Message',
      },
      placeholders: {
        telephone: 'Example: +33 6 12 34 56 78',
        adresse: 'Full address of your furnished tourist accommodation',
        message: 'Tell us about your accommodation and expectations (optional)',
      },
      consentPrefix: 'I agree that my data may be processed in accordance with the',
      privacyLinkLabel: 'privacy policy',
      submitButton: 'Send my request',
      submitting: 'Sending...',
      success:
        'Your request has been sent successfully. Our team will get back to you within 24 hours.',
    },
    validation: {
      nomRequired: 'Name is required',
      prenomRequired: 'First name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is not valid',
      telephoneRequired: 'Phone number is required',
      telephoneInvalid: 'Phone number is not valid',
      adresseRequired: 'Accommodation address is required',
      messageRequired: 'Message is required',
      consentRequired: 'You must accept the privacy policy',
    },
    turnstile: {
      required: 'Please complete the anti-spam verification.',
      missingConfig: 'Anti-spam protection is unavailable (missing configuration).',
      expired: 'The anti-spam verification has expired. Please try again.',
      verificationError: 'Anti-spam verification failed. Please try again.',
    },
    api: {
      genericError: 'An unexpected error occurred. Please try again later.',
      invalidResponse: 'Invalid API response',
      rateLimited:
        'Too many requests were sent in a short time. Please try again in a few minutes.',
      httpError: (status: number) => `HTTP error ${status}`,
      errorCodes: {
        METHOD_NOT_ALLOWED: 'The form submission is unavailable.',
        INVALID_JSON: 'The submission failed. Please try again.',
        INVALID_PAYLOAD: 'The submission failed. Please try again.',
        VALIDATION_FAILED: 'Some fields need to be corrected.',
        TURNSTILE_INVALID: 'The anti-spam verification failed. Please try again.',
        RATE_LIMITED:
          'Too many requests were sent in a short time. Please try again in a few minutes.',
        RATE_LIMIT_UNAVAILABLE: 'An unexpected error occurred. Please try again later.',
        INSERT_FAILED: 'The request could not be saved. Please try again later.',
        NOTIFICATION_FAILED:
          'The request was saved, but the notification is unavailable. Please try again later.',
      },
      fieldErrorCodes: {
        REQUIRED: 'This field is required.',
        INVALID_EMAIL: 'Email is not valid.',
        INVALID_PHONE: 'Phone number is not valid.',
      },
      fieldErrors: {
        nom: { REQUIRED: 'Name is required.' },
        prenom: { REQUIRED: 'First name is required.' },
        email: {
          REQUIRED: 'Email is required.',
          INVALID_EMAIL: 'Email is not valid.',
        },
        telephone: {
          REQUIRED: 'Phone number is required.',
          INVALID_PHONE: 'Phone number is not valid.',
        },
        adresse: { REQUIRED: 'Accommodation address is required.' },
        message: { REQUIRED: 'Message is required.' },
        consent: { REQUIRED: 'Consent is required.' },
        consentVersion: { REQUIRED: 'Consent version is required.' },
        turnstileToken: { REQUIRED: 'Anti-spam verification is required.' },
      },
    },
  },
} as const satisfies Record<Locale, FormContent>;

export const getLocalizedApiErrorMessage = (
  input: {
    errorCode?: ApiErrorCode | undefined;
    status?: number | undefined;
    fallbackError?: string | undefined;
  },
  locale: Locale = DEFAULT_LOCALE
): string => {
  const content = formContent[locale].api;

  if (input.errorCode) {
    return content.errorCodes[input.errorCode];
  }

  if (input.status === 429) {
    return content.rateLimited;
  }

  if (locale === DEFAULT_LOCALE && input.fallbackError) {
    return input.fallbackError;
  }

  return content.genericError;
};

export const getLocalizedFieldErrorMessage = (
  field: string,
  code: FieldErrorCode,
  locale: Locale = DEFAULT_LOCALE
): string => {
  const content = formContent[locale].api;
  const fieldErrors = content.fieldErrors as Record<string, FieldErrorMessages>;
  return fieldErrors[field]?.[code] ?? content.fieldErrorCodes[code];
};

export const getLocalizedFieldErrors = (
  fieldErrorCodes: Record<string, FieldErrorCode> | undefined,
  locale: Locale = DEFAULT_LOCALE,
  fallbackFieldErrors?: Record<string, string>
): Record<string, string> => {
  const localizedErrors: Record<string, string> = {};

  if (fieldErrorCodes) {
    Object.entries(fieldErrorCodes).forEach(([field, code]) => {
      localizedErrors[field] = getLocalizedFieldErrorMessage(field, code, locale);
    });
  }

  if (locale === DEFAULT_LOCALE && fallbackFieldErrors) {
    Object.entries(fallbackFieldErrors).forEach(([field, message]) => {
      if (localizedErrors[field] === undefined) {
        localizedErrors[field] = message;
      }
    });
  }

  return localizedErrors;
};
