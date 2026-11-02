import { DEFAULT_LOCALE, type Locale } from './locales';
import type { ApiErrorCode, FieldErrorCode } from '../utils/api';
import type { ClassementActuelDeclare } from '../utils/formValidation';

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
    progressLabel: string;
    steps: readonly [string, string, string];
    sections: { property: string; contact: string; request: string };
    actions: { previous: string; next: string };
    labels: {
      codePostal: string;
      commune: string;
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse: string;
      classementActuelDeclare: string;
      message: string;
    };
    placeholders: {
      codePostal: string;
      commune: string;
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      adresse: string;
      classementActuelDeclare: string;
      message: string;
    };
    classementOptions: Record<ClassementActuelDeclare, string>;
    communeLookup: {
      loading: string;
      notFound: string;
      unavailable: string;
      retry: string;
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
    adresseTooLong: string;
    codePostalRequired: string;
    codePostalInvalid: string;
    communeRequired: string;
    classementRequired: string;
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
      progressLabel: 'Progression de la demande',
      steps: ['Logement', 'Coordonnées', 'Demande'],
      sections: {
        property: 'Votre logement',
        contact: 'Vos coordonnées',
        request: 'Votre demande',
      },
      actions: { previous: 'Précédent', next: 'Suivant' },
      labels: {
        codePostal: 'Code postal du logement',
        commune: 'Commune',
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        telephone: 'Téléphone',
        adresse: 'Adresse du logement',
        classementActuelDeclare: 'Classement actuel',
        message: 'Message (optionnel)',
      },
      placeholders: {
        codePostal: '24200',
        commune: 'Sélectionnez votre commune',
        nom: 'Votre nom',
        prenom: 'Votre prénom',
        email: 'vous@exemple.fr',
        telephone: '06 12 34 56 78',
        adresse: 'Numéro, rue ou lieu-dit',
        classementActuelDeclare: 'Sélectionnez votre situation',
        message:
          'Une précision sur votre logement ou vos disponibilités ? D’autres logements à classer ? Indiquez-les ici.',
      },
      classementOptions: {
        NC: 'Non classé',
        UNE_ETOILE: '1 étoile',
        DEUX_ETOILES: '2 étoiles',
        TROIS_ETOILES: '3 étoiles',
        QUATRE_ETOILES: '4 étoiles',
        CINQ_ETOILES: '5 étoiles',
        INCONNU: 'Je ne sais pas',
      },
      communeLookup: {
        loading: 'Recherche des communes...',
        notFound: 'Aucune commune ne correspond à ce code postal. Merci de le corriger.',
        unavailable:
          'La recherche des communes est momentanément indisponible. Réessayez ou appelez-nous.',
        retry: 'Réessayer',
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
      adresseTooLong: "L'adresse du logement ne doit pas dépasser 255 caractères",
      codePostalRequired: 'Le code postal est requis',
      codePostalInvalid: 'Le code postal doit contenir 5 chiffres',
      communeRequired: 'Sélectionnez votre commune',
      classementRequired: 'Sélectionnez votre situation',
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
        FORM_OUTDATED:
          'Ce formulaire a été mis à jour. Merci d’actualiser la page avant de réessayer.',
        SUBMISSION_CONFLICT:
          'Votre demande a déjà été enregistrée avec d’autres informations. Pour la corriger, appelez-nous.',
        REFERENTIAL_UNAVAILABLE:
          'La vérification de la commune est momentanément indisponible. Réessayez dans quelques instants ou appelez-nous.',
        PERSISTENCE_UNAVAILABLE:
          'Votre demande n’a pas pu être enregistrée pour le moment. Merci de réessayer.',
      },
      fieldErrorCodes: {
        REQUIRED: 'Ce champ est requis.',
        INVALID_EMAIL: "L'email n'est pas valide.",
        INVALID_PHONE: "Le numéro de téléphone n'est pas valide.",
        INVALID_VALUE: "Cette valeur n'est pas valide.",
        TOO_LONG: 'Cette valeur est trop longue.',
        INVALID_COMMUNE: 'La commune sélectionnée ne correspond pas au code postal.',
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
        adresse: {
          REQUIRED: "L'adresse du bien est requise.",
          TOO_LONG: "L'adresse du logement ne doit pas dépasser 255 caractères.",
        },
        codePostal: {
          REQUIRED: 'Le code postal est requis.',
          INVALID_VALUE: 'Le code postal doit contenir 5 chiffres.',
        },
        commune: {
          REQUIRED: 'La commune est requise.',
          INVALID_COMMUNE:
            'La commune sélectionnée ne correspond pas au code postal. Merci de vérifier votre choix.',
        },
        classementActuelDeclare: {
          REQUIRED: 'Le classement actuel est requis.',
          INVALID_VALUE: "Le classement actuel n'est pas valide.",
        },
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
      progressLabel: 'Request progress',
      steps: ['Accommodation', 'Contact details', 'Request'],
      sections: {
        property: 'Your accommodation',
        contact: 'Your contact details',
        request: 'Your request',
      },
      actions: { previous: 'Previous', next: 'Next' },
      labels: {
        codePostal: 'Accommodation postcode',
        commune: 'Town',
        nom: 'Last name',
        prenom: 'First name',
        email: 'Email',
        telephone: 'Phone',
        adresse: 'Accommodation address',
        classementActuelDeclare: 'Current classification',
        message: 'Message (optional)',
      },
      placeholders: {
        codePostal: '24200',
        commune: 'Select your town',
        nom: 'Your last name',
        prenom: 'Your first name',
        email: 'you@example.com',
        telephone: '+44 7700 900123',
        adresse: 'Number and street, or locality',
        classementActuelDeclare: 'Select your situation',
        message:
          'Anything to add about your accommodation or availability? Other properties to classify? Mention them here.',
      },
      classementOptions: {
        NC: 'Not classified',
        UNE_ETOILE: '1 star',
        DEUX_ETOILES: '2 stars',
        TROIS_ETOILES: '3 stars',
        QUATRE_ETOILES: '4 stars',
        CINQ_ETOILES: '5 stars',
        INCONNU: "I don't know",
      },
      communeLookup: {
        loading: 'Searching for towns...',
        notFound: 'No town matches this postcode. Please correct it.',
        unavailable: 'Town search is temporarily unavailable. Please try again or call us.',
        retry: 'Try again',
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
      adresseTooLong: 'Accommodation address must not exceed 255 characters',
      codePostalRequired: 'Postcode is required',
      codePostalInvalid: 'Postcode must contain 5 digits',
      communeRequired: 'Select your town',
      classementRequired: 'Select your situation',
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
        FORM_OUTDATED: 'This form has been updated. Please refresh the page before trying again.',
        SUBMISSION_CONFLICT:
          'Your request has already been recorded with different details. To correct it, please call us.',
        REFERENTIAL_UNAVAILABLE:
          'Town verification is temporarily unavailable. Please try again in a moment or call us.',
        PERSISTENCE_UNAVAILABLE: 'Your request could not be saved right now. Please try again.',
      },
      fieldErrorCodes: {
        REQUIRED: 'This field is required.',
        INVALID_EMAIL: 'Email is not valid.',
        INVALID_PHONE: 'Phone number is not valid.',
        INVALID_VALUE: 'This value is not valid.',
        TOO_LONG: 'This value is too long.',
        INVALID_COMMUNE: 'The selected town does not match the postcode.',
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
        adresse: {
          REQUIRED: 'Accommodation address is required.',
          TOO_LONG: 'Accommodation address must not exceed 255 characters.',
        },
        codePostal: {
          REQUIRED: 'Postcode is required.',
          INVALID_VALUE: 'Postcode must contain 5 digits.',
        },
        commune: {
          REQUIRED: 'Town is required.',
          INVALID_COMMUNE:
            'The selected town does not match the postcode. Please check your choice.',
        },
        classementActuelDeclare: {
          REQUIRED: 'Current classification is required.',
          INVALID_VALUE: 'Current classification is not valid.',
        },
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
      progressLabel: 'Voortgang van de aanvraag',
      steps: ['Vakantiewoning', 'Contactgegevens', 'Aanvraag'],
      sections: {
        property: 'Uw vakantiewoning',
        contact: 'Uw contactgegevens',
        request: 'Uw aanvraag',
      },
      actions: { previous: 'Vorige', next: 'Volgende' },
      labels: {
        codePostal: 'Postcode van de vakantiewoning',
        commune: 'Gemeente',
        nom: 'Achternaam',
        prenom: 'Voornaam',
        email: 'E-mail',
        telephone: 'Telefoon',
        adresse: 'Adres van de vakantiewoning',
        classementActuelDeclare: 'Huidige classificatie',
        message: 'Bericht (optioneel)',
      },
      placeholders: {
        codePostal: '24200',
        commune: 'Selecteer uw gemeente',
        nom: 'Uw achternaam',
        prenom: 'Uw voornaam',
        email: 'u@voorbeeld.nl',
        telephone: '+31 6 12345678',
        adresse: 'Huisnummer en straat, of plaatsaanduiding',
        classementActuelDeclare: 'Selecteer uw situatie',
        message:
          'Iets toe te voegen over uw woning of beschikbaarheid? Nog andere woningen te classificeren? Vermeld ze hier.',
      },
      classementOptions: {
        NC: 'Niet geclassificeerd',
        UNE_ETOILE: '1 ster',
        DEUX_ETOILES: '2 sterren',
        TROIS_ETOILES: '3 sterren',
        QUATRE_ETOILES: '4 sterren',
        CINQ_ETOILES: '5 sterren',
        INCONNU: 'Ik weet het niet',
      },
      communeLookup: {
        loading: 'Gemeenten zoeken...',
        notFound: 'Geen enkele gemeente komt overeen met deze postcode. Corrigeer de postcode.',
        unavailable:
          'Het zoeken naar gemeenten is tijdelijk niet beschikbaar. Probeer het opnieuw of bel ons.',
        retry: 'Opnieuw proberen',
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
      adresseTooLong: 'Het adres van de vakantiewoning mag niet langer zijn dan 255 tekens',
      codePostalRequired: 'Postcode is verplicht',
      codePostalInvalid: 'De postcode moet uit 5 cijfers bestaan',
      communeRequired: 'Selecteer uw gemeente',
      classementRequired: 'Selecteer uw situatie',
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
        FORM_OUTDATED:
          'Dit formulier is bijgewerkt. Vernieuw de pagina voordat u het opnieuw probeert.',
        SUBMISSION_CONFLICT:
          'Uw aanvraag is al geregistreerd met andere gegevens. Bel ons om deze te corrigeren.',
        REFERENTIAL_UNAVAILABLE:
          'De controle van de gemeente is tijdelijk niet beschikbaar. Probeer het zo meteen opnieuw of bel ons.',
        PERSISTENCE_UNAVAILABLE:
          'Uw aanvraag kon op dit moment niet worden opgeslagen. Probeer het opnieuw.',
      },
      fieldErrorCodes: {
        REQUIRED: 'Dit veld is verplicht.',
        INVALID_EMAIL: 'E-mail is niet geldig.',
        INVALID_PHONE: 'Telefoonnummer is niet geldig.',
        INVALID_VALUE: 'Deze waarde is niet geldig.',
        TOO_LONG: 'Deze waarde is te lang.',
        INVALID_COMMUNE: 'De geselecteerde gemeente komt niet overeen met de postcode.',
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
        adresse: {
          REQUIRED: 'Adres van de vakantiewoning is verplicht.',
          TOO_LONG: 'Het adres van de vakantiewoning mag niet langer zijn dan 255 tekens.',
        },
        codePostal: {
          REQUIRED: 'Postcode is verplicht.',
          INVALID_VALUE: 'De postcode moet uit 5 cijfers bestaan.',
        },
        commune: {
          REQUIRED: 'Gemeente is verplicht.',
          INVALID_COMMUNE:
            'De geselecteerde gemeente komt niet overeen met de postcode. Controleer uw keuze.',
        },
        classementActuelDeclare: {
          REQUIRED: 'Huidige classificatie is verplicht.',
          INVALID_VALUE: 'Huidige classificatie is niet geldig.',
        },
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
