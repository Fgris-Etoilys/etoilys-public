import type { Locale } from '../../i18n/locales';

type ContactPageContent = {
  hero: {
    title: string;
    description: string;
  };
  detailsTitle: string;
  contactLabels: {
    phone: string;
    email: string;
    headOffice: string;
  };
  quickResponse: {
    title: string;
    description: string;
  };
};

export const contactPageContent = {
  fr: {
    hero: {
      title: 'Contacter Etoilys',
      description:
        'Vous avez une question avant de demander le classement de votre meublé ? Etoilys vous répond et vous aide à comprendre les prochaines étapes.',
    },
    detailsTitle: 'Nos coordonnées',
    contactLabels: {
      phone: 'Téléphone',
      email: 'Email',
      headOffice: 'Siège social',
    },
    quickResponse: {
      title: 'Réponse rapide',
      description:
        "Nous nous engageons à répondre à votre demande sous 24 heures ouvrées. Pour une demande urgente, n'hésitez pas à nous appeler directement.",
    },
  },
  en: {
    hero: {
      title: 'Contact Etoilys',
      description:
        'Do you have a question before requesting the official classification of your furnished tourist accommodation? Etoilys can reply and help you understand the next steps.',
    },
    detailsTitle: 'Contact details',
    contactLabels: {
      phone: 'Phone',
      email: 'Email',
      headOffice: 'Head office',
    },
    quickResponse: {
      title: 'Quick reply',
      description:
        'We undertake to reply to your request within 24 working hours. For an urgent request, please feel free to call us directly.',
    },
  },
} as const satisfies Record<Locale, ContactPageContent>;
