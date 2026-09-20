import type { Locale } from '../../i18n/locales';

export type RequestClassificationPageContent = {
  hero: { eyebrow: string; title: string; description: string; phoneNote: string };
  afterRequest: { responseTime: string; title: string; description: string };
  resources?: Array<{ title: string; description: string; cta: string; href: string }> | undefined;
  reassurance: { title: string; items: string[] };
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
      title: 'Demande de classement',
      description:
        'Quelques minutes pour nous transmettre vos coordonnées et l’adresse de votre logement.',
      phoneNote: 'Une question avant de commencer ?',
    },
    afterRequest: {
      responseTime: 'Nous vous recontactons sous 24 h ouvrées.',
      title: 'Et ensuite ?',
      description:
        'Nous échangeons avec vous pour confirmer les modalités de visite, le tarif et les disponibilités.',
    },
    resources: [
      {
        title: 'Préparer votre visite',
        description: 'Les équipements et les points à vérifier avant le passage de l’inspecteur.',
        cta: 'Lire le guide',
        href: '/actualites/preparer-visite-classement-meuble-tourisme',
      },
      {
        title: 'Faire une première simulation',
        description:
          'Testez votre logement pour voir vers quelle catégorie de classement il se situe.',
        cta: 'Lancer la simulation',
        href: '/simulateur',
      },
    ],
    reassurance: {
      title: 'Pourquoi Etoilys ?',
      items: [
        'Organisme accrédité Cofrac Inspection',
        'Une procédure simple, sans dossier complexe à constituer',
        'Un interlocuteur unique à chaque étape',
        'Une visite organisée en moyenne sous deux semaines',
      ],
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
      title: 'Classification request',
      description:
        'A few minutes to share your contact details and the address of your accommodation.',
      phoneNote: 'A question before you start?',
    },
    afterRequest: {
      responseTime: 'We contact you within 24 working hours.',
      title: 'What happens next?',
      description:
        'We get in touch to confirm the inspection arrangements, the fee and the available dates.',
    },
    reassurance: {
      title: 'Why Etoilys?',
      items: [
        'Inspection body accredited by Cofrac',
        'A simple process, with no complex file to prepare',
        'One contact person at every step',
        'An inspection usually arranged within two weeks',
      ],
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
      title: 'Classificatie aanvragen',
      description:
        'Deel in enkele minuten uw contactgegevens en het adres van uw vakantiewoning in de gebieden waar wij actief zijn.',
      phoneNote: 'Een vraag voordat u begint?',
    },
    afterRequest: {
      responseTime: 'Wij nemen binnen één werkdag contact op.',
      title: 'Wat gebeurt er daarna?',
      description: 'Samen bespreken we de inspectievoorwaarden, het tarief en de beschikbare data.',
    },
    reassurance: {
      title: 'Waarom Etoilys?',
      items: [
        'Door Cofrac geaccrediteerde inspectie-instelling',
        'Een eenvoudige procedure, zonder ingewikkeld dossier',
        'Eén contactpersoon in elke stap',
        'Een inspectie gemiddeld binnen twee weken georganiseerd',
      ],
    },
    accreditation: {
      imageAlt: 'Cofrac Inspection-accreditatiemerk',
      numberLabel: 'Accreditatie nr. 3-2394',
      scopePrefix: 'Reikwijdte van de accreditatie op',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
} as const satisfies Record<Locale, RequestClassificationPageContent>;
