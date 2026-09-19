import type { Locale } from '../../i18n/locales';

type RequestClassificationPageContent = {
  hero: { eyebrow: string; title: string; description: string; phoneNote: string };
  afterRequest: { responseTime: string; title: string; description: string; note: string };
  accreditation: {
    imageAlt: string;
    numberLabel: string;
    scopePrefix: string;
    scopeLinkLabel: string;
  };
};

export const requestClassificationPageContent = {
  fr: {
    hero: {
      eyebrow: 'Le classement de votre meublé',
      title: 'Votre demande, simplement.',
      description:
        'Quelques minutes pour nous transmettre vos coordonnées et l’adresse de votre logement.',
      phoneNote: 'Une question avant de commencer ?',
    },
    afterRequest: {
      responseTime: 'Nous vous recontactons sous 24 h ouvrées.',
      title: 'Et ensuite ?',
      description:
        'Nous échangeons avec vous pour confirmer les modalités de visite, le tarif et les disponibilités.',
      note: 'Vous décidez ensuite. Cette demande ne valide pas la visite et aucun dossier complexe n’est à préparer.',
    },
    accreditation: {
      imageAlt: 'Marque d’accréditation Cofrac Inspection',
      numberLabel: 'Accréditation n°3-2394',
      scopePrefix: 'Portée disponible sur',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
  en: {
    hero: {
      eyebrow: 'Your accommodation classification',
      title: 'Your request, made simple.',
      description:
        'A few minutes to share your contact details and the address of your accommodation.',
      phoneNote: 'A question before you start?',
    },
    afterRequest: {
      responseTime: 'We contact you within 24 working hours.',
      title: 'What happens next?',
      description:
        'We get in touch to confirm the inspection arrangements, the fee and the available dates.',
      note: 'You decide afterwards. This request does not confirm an inspection, and there is no complicated file to prepare.',
    },
    accreditation: {
      imageAlt: 'Cofrac Inspection accreditation mark',
      numberLabel: 'Accreditation no. 3-2394',
      scopePrefix: 'Scope available on',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
  nl: {
    hero: {
      eyebrow: 'De classificatie van uw vakantiewoning',
      title: 'Uw aanvraag, eenvoudig geregeld.',
      description:
        'Deel in enkele minuten uw contactgegevens en het adres van uw vakantiewoning in de gebieden waar wij actief zijn.',
      phoneNote: 'Een vraag voordat u begint?',
    },
    afterRequest: {
      responseTime: 'Wij nemen binnen één werkdag contact op.',
      title: 'Wat gebeurt er daarna?',
      description: 'Samen bespreken we de inspectievoorwaarden, het tarief en de beschikbare data.',
      note: 'Daarna beslist u. Deze aanvraag bevestigt nog geen inspectie en u hoeft geen ingewikkeld dossier samen te stellen.',
    },
    accreditation: {
      imageAlt: 'Cofrac Inspection-accreditatiemerk',
      numberLabel: 'Accreditatie nr. 3-2394',
      scopePrefix: 'Reikwijdte van de accreditatie op',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
} as const satisfies Record<Locale, RequestClassificationPageContent>;
