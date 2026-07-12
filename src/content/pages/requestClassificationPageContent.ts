import type { Locale } from '../../i18n/locales';

type RequestClassificationPageContent = {
  hero: {
    title: string;
    description: string;
    phoneNote: string;
  };
  sidebar: {
    title: string;
    items: readonly string[];
  };
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
      title: 'Demande de classement',
      description:
        'Déposez votre demande en quelques minutes. Etoilys vous recontacte sous 24 heures ouvrées pour confirmer les modalités de visite, le tarif applicable et les prochaines disponibilités avant toute validation.',
      phoneNote: 'Vous pouvez également contacter le 06 49 55 15 40',
    },
    sidebar: {
      title: 'Pourquoi confier votre classement à Etoilys ?',
      items: [
        'Organisme accrédité Cofrac Inspection',
        'Accompagnement personnalisé à chaque étape',
        'Procédure simple, sans dossier à constituer',
        'Réactivité et fiabilité',
        'Visite planifiée rapidement',
      ],
    },
    accreditation: {
      imageAlt: "Marque d'accréditation Cofrac Inspection",
      numberLabel: 'Accréditation n°3-2394',
      scopePrefix: 'Portée disponible sur',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
  en: {
    hero: {
      title: 'Classification request',
      description:
        'Submit your request in a few minutes. Etoilys will contact you within 24 working hours to confirm the inspection arrangements, the applicable fee and the next available dates before any validation.',
      phoneNote: 'You can also call +33 6 49 55 15 40',
    },
    sidebar: {
      title: 'Why entrust your classification to Etoilys?',
      items: [
        'Cofrac Inspection accredited inspection body',
        'Personalized support at each step',
        'Simple procedure, with no file to prepare',
        'Responsiveness and reliability',
        'Visit scheduled quickly',
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
      title: 'Classificatie aanvragen',
      description:
        'Dien uw aanvraag in enkele minuten in. Etoilys neemt binnen 24 werkuren contact met u op om de inspectievoorwaarden, het toepasselijke tarief en de eerstvolgende beschikbaarheden te bevestigen vóór elke validatie.',
      phoneNote: 'U kunt ook bellen naar +33 6 49 55 15 40',
    },
    sidebar: {
      title: 'Waarom uw classificatie aan Etoilys toevertrouwen?',
      items: [
        'Door Cofrac Inspection geaccrediteerde controle-instantie',
        'Persoonlijke begeleiding bij elke stap',
        'Eenvoudige procedure, zonder dossier om samen te stellen',
        'Responsiviteit en betrouwbaarheid',
        'Bezoek snel gepland',
      ],
    },
    accreditation: {
      imageAlt: 'Cofrac Inspection-accreditatiemerk',
      numberLabel: 'Accreditatie nr. 3-2394',
      scopePrefix: 'Scope beschikbaar op',
      scopeLinkLabel: 'www.cofrac.fr',
    },
  },
} as const satisfies Record<Locale, RequestClassificationPageContent>;
