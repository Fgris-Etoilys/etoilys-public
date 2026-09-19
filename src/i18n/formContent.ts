import { DEFAULT_LOCALE, type Locale } from './locales';
import type { ApiErrorCode, FieldErrorCode } from '../utils/api';

type FieldErrorMessages = Partial<Record<FieldErrorCode, string>>;

type FormContent = {
  contact: {
    title: string;
    requiredNote: string;
    placeholders: { nom: string; email: string; message: string };
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
    successTitle: string;
    successAction: string;
  };
  demandeClassement: {
    title: string;
    intro: string;
    requiredNote: string;
    sections: { contact: string; property: string };
    telephoneHint: string;
    submitNote: string;
    labels: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse: string;
      message: string;
    };
    placeholders: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse: string;
      message: string;
    };
    consentPrefix: string;
    privacyLinkLabel: string;
    submitButton: string;
    submitting: string;
    success: string;
    successTitle: string;
    successAction: string;
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
    label: string;
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
      title: 'Écrivez-nous',
      requiredNote: '* Champs obligatoires',
      placeholders: {
        nom: 'Votre nom',
        email: 'vous@exemple.fr',
        message: 'Comment pouvons-nous vous aider ?',
      },
      labels: {
        nom: 'Nom',
        email: 'Email',
        message: 'Message',
      },
      consentPrefix: "J'accepte que mes données soient traitées conformément à la",
      privacyLinkLabel: 'politique de confidentialité',
      submitButton: 'Envoyer mon message',
      submitting: 'Envoi en cours...',
      successTitle: 'Votre message est bien envoyé',
      success: 'Nous vous répondrons sous 24 heures ouvrées, à l’adresse email indiquée.',
      successAction: 'Écrire un autre message',
    },
    demandeClassement: {
      title: 'Votre demande de classement',
      intro: 'Vos coordonnées et l’adresse du logement, simplement.',
      requiredNote: '* Champs obligatoires',
      sections: { contact: 'Vos coordonnées', property: 'Votre logement' },
      telephoneHint: 'Hors de France, ajoutez l’indicatif du pays (ex. +32 ou +44).',
      submitNote: 'L’envoi de cette demande ne valide pas la visite.',
      labels: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        telephone: 'Téléphone',
        adresse: 'Adresse du logement',
        message: 'Message (optionnel)',
      },
      placeholders: {
        nom: 'Votre nom',
        prenom: 'Votre prénom',
        email: 'vous@exemple.fr',
        telephone: '06 12 34 56 78',
        adresse: 'Numéro, rue, code postal et commune',
        message: 'Une précision utile sur votre logement ou vos disponibilités ?',
      },
      consentPrefix: "J'accepte que mes données soient traitées conformément à la",
      privacyLinkLabel: 'politique de confidentialité',
      submitButton: 'Envoyer ma demande',
      submitting: 'Envoi en cours...',
      successTitle: 'Votre demande est bien envoyée',
      success:
        'Nous vous recontactons sous 24 heures ouvrées pour confirmer ensemble les modalités de visite, le tarif et les disponibilités, avant toute validation.',
      successAction: 'Faire une autre demande',
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
      label: 'Vérification anti-spam',
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
        NOTIFICATION_FAILED: 'Votre demande n’a pas pu être envoyée. Merci de réessayer plus tard.',
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
      title: 'Write to us',
      requiredNote: '* Required fields',
      placeholders: {
        nom: 'Your name',
        email: 'you@example.com',
        message: 'How can we help you?',
      },
      labels: {
        nom: 'Name',
        email: 'Email',
        message: 'Message',
      },
      consentPrefix: 'I agree that my data may be processed in accordance with the',
      privacyLinkLabel: 'privacy policy',
      submitButton: 'Send my message',
      submitting: 'Sending...',
      successTitle: 'Your message has been sent',
      success: 'We will reply within 24 business hours at the email address you provided.',
      successAction: 'Write another message',
    },
    demandeClassement: {
      title: 'Your classification request',
      intro: 'Just your contact details and the accommodation address.',
      requiredNote: '* Required fields',
      sections: { contact: 'Your contact details', property: 'Your accommodation' },
      telephoneHint: 'Outside France, include your country code (e.g. +44 or +32).',
      submitNote: 'Sending this request does not confirm an inspection.',
      labels: {
        nom: 'Last name',
        prenom: 'First name',
        email: 'Email',
        telephone: 'Phone',
        adresse: 'Accommodation address',
        message: 'Message (optional)',
      },
      placeholders: {
        nom: 'Your last name',
        prenom: 'Your first name',
        email: 'you@example.com',
        telephone: '+44 7700 900123',
        adresse: 'Number, street, postcode and town',
        message: 'Anything to add about your accommodation or availability?',
      },
      consentPrefix: 'I agree that my data may be processed in accordance with the',
      privacyLinkLabel: 'privacy policy',
      submitButton: 'Send my request',
      submitting: 'Sending...',
      successTitle: 'Your request has been sent',
      success:
        'We will contact you within 24 business hours to confirm the visit arrangements, price and availability together before anything is agreed.',
      successAction: 'Make another request',
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
      label: 'Anti-spam verification',
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
        NOTIFICATION_FAILED: 'Your request could not be sent. Please try again later.',
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
  nl: {
    contact: {
      title: 'Schrijf ons',
      requiredNote: '* Verplichte velden',
      placeholders: {
        nom: 'Uw naam',
        email: 'u@voorbeeld.nl',
        message: 'Waarmee kunnen wij u helpen?',
      },
      labels: {
        nom: 'Naam',
        email: 'E-mail',
        message: 'Bericht',
      },
      consentPrefix: 'Ik ga ermee akkoord dat mijn gegevens worden verwerkt volgens het',
      privacyLinkLabel: 'privacybeleid',
      submitButton: 'Mijn bericht versturen',
      submitting: 'Bezig met verzenden...',
      successTitle: 'Uw bericht is verzonden',
      success: 'Wij antwoorden binnen één werkdag op het opgegeven e-mailadres.',
      successAction: 'Nog een bericht schrijven',
    },
    demandeClassement: {
      title: 'Uw classificatieaanvraag',
      intro: 'Alleen uw contactgegevens en het adres van de vakantiewoning.',
      requiredNote: '* Verplichte velden',
      sections: { contact: 'Uw contactgegevens', property: 'Uw vakantiewoning' },
      telephoneHint: 'Buiten Frankrijk: voeg uw landcode toe (bijv. +31 of +32).',
      submitNote: 'Het versturen van deze aanvraag bevestigt nog geen inspectie.',
      labels: {
        nom: 'Achternaam',
        prenom: 'Voornaam',
        email: 'E-mail',
        telephone: 'Telefoon',
        adresse: 'Adres van de vakantiewoning',
        message: 'Bericht (optioneel)',
      },
      placeholders: {
        nom: 'Uw achternaam',
        prenom: 'Uw voornaam',
        email: 'u@voorbeeld.nl',
        telephone: '+31 6 12345678',
        adresse: 'Huisnummer, straat, postcode en plaats',
        message: 'Iets toe te voegen over uw woning of beschikbaarheid?',
      },
      consentPrefix: 'Ik ga ermee akkoord dat mijn gegevens worden verwerkt volgens het',
      privacyLinkLabel: 'privacybeleid',
      submitButton: 'Mijn aanvraag versturen',
      submitting: 'Bezig met verzenden...',
      successTitle: 'Uw aanvraag is verzonden',
      success:
        'Wij nemen binnen één werkdag contact met u op om samen de bezoekvoorwaarden, het tarief en de beschikbaarheid te bevestigen, voordat u iets vastlegt.',
      successAction: 'Nog een aanvraag doen',
    },
    validation: {
      nomRequired: 'Naam is verplicht',
      prenomRequired: 'Voornaam is verplicht',
      emailRequired: 'E-mail is verplicht',
      emailInvalid: 'E-mail is niet geldig',
      telephoneRequired: 'Telefoonnummer is verplicht',
      telephoneInvalid: 'Telefoonnummer is niet geldig',
      adresseRequired: 'Adres van de vakantiewoning is verplicht',
      messageRequired: 'Bericht is verplicht',
      consentRequired: 'U moet het privacybeleid accepteren',
    },
    turnstile: {
      label: 'Antispamcontrole',
      required: 'Vul de antispamcontrole in.',
      missingConfig: 'Antispambeveiliging is niet beschikbaar (configuratie ontbreekt).',
      expired: 'De antispamcontrole is verlopen. Probeer het opnieuw.',
      verificationError: 'Antispamcontrole mislukt. Probeer het opnieuw.',
    },
    api: {
      genericError: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
      invalidResponse: 'Ongeldig API-antwoord',
      rateLimited:
        'Er zijn te veel verzoeken in korte tijd verzonden. Probeer het over enkele minuten opnieuw.',
      httpError: (status: number) => `HTTP-fout ${status}`,
      errorCodes: {
        METHOD_NOT_ALLOWED: 'Het formulier kan momenteel niet worden verzonden.',
        INVALID_JSON: 'Het verzenden is mislukt. Probeer het opnieuw.',
        INVALID_PAYLOAD: 'Het verzenden is mislukt. Probeer het opnieuw.',
        VALIDATION_FAILED: 'Sommige velden moeten worden gecorrigeerd.',
        TURNSTILE_INVALID: 'De antispamcontrole is mislukt. Probeer het opnieuw.',
        RATE_LIMITED:
          'Er zijn te veel verzoeken in korte tijd verzonden. Probeer het over enkele minuten opnieuw.',
        RATE_LIMIT_UNAVAILABLE: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
        NOTIFICATION_FAILED: 'Uw aanvraag kon niet worden verzonden. Probeer het later opnieuw.',
      },
      fieldErrorCodes: {
        REQUIRED: 'Dit veld is verplicht.',
        INVALID_EMAIL: 'E-mail is niet geldig.',
        INVALID_PHONE: 'Telefoonnummer is niet geldig.',
      },
      fieldErrors: {
        nom: { REQUIRED: 'Naam is verplicht.' },
        prenom: { REQUIRED: 'Voornaam is verplicht.' },
        email: {
          REQUIRED: 'E-mail is verplicht.',
          INVALID_EMAIL: 'E-mail is niet geldig.',
        },
        telephone: {
          REQUIRED: 'Telefoonnummer is verplicht.',
          INVALID_PHONE: 'Telefoonnummer is niet geldig.',
        },
        adresse: { REQUIRED: 'Adres van de vakantiewoning is verplicht.' },
        message: { REQUIRED: 'Bericht is verplicht.' },
        consent: { REQUIRED: 'Toestemming is verplicht.' },
        consentVersion: { REQUIRED: 'Versie van de toestemming is verplicht.' },
        turnstileToken: { REQUIRED: 'Antispamcontrole is verplicht.' },
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

  if (fallbackFieldErrors) {
    Object.entries(fallbackFieldErrors).forEach(([field, message]) => {
      if (localizedErrors[field] === undefined) {
        localizedErrors[field] = message;
      }
    });
  }

  return localizedErrors;
};
