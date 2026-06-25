import type { Locale } from '../../i18n/locales';

export type HomeIconKey = 'shield' | 'zap' | 'clock' | 'calculator' | 'users' | 'globe';

export type HomeFeature = {
  icon: HomeIconKey;
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
};

export type HomeServiceLink = {
  title: string;
  description: string;
  href: string;
};

export type HomePageContent = {
  hero: {
    imageAlt: string;
    title: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  features: {
    title: string;
    description: string;
    items: readonly HomeFeature[];
  };
  benefits: {
    title: string;
    description: string;
    items: readonly HomeFeature[];
    cta: {
      label: string;
      href: string;
    };
  };
  procedure: {
    imageAlt: string;
    title: string;
    paragraphs: readonly string[];
    cta: {
      label: string;
      href: string;
    };
  };
  news?: {
    title: string;
    description: string;
    cta: {
      label: string;
      href: string;
    };
  };
  serviceLinks?: {
    title: string;
    description: string;
    links: readonly HomeServiceLink[];
  };
  finalCta: {
    title: string;
    description: string;
    cta: {
      label: string;
      href: string;
    };
  };
};

export const homePageContent = {
  fr: {
    hero: {
      imageAlt: "Terrasse avec piscine d'un meublé de tourisme",
      title: 'Classement officiel de votre meublé de tourisme',
      description:
        'Etoilys vous accompagne pour obtenir le classement officiel en étoiles de votre meublé de tourisme.',
      primaryCta: {
        label: 'Demander votre classement',
        href: '/demande-classement',
      },
      secondaryCta: {
        label: 'Les avantages du classement',
        href: '/les-avantages-du-classement',
      },
    },
    features: {
      title: 'Pourquoi choisir Etoilys ?',
      description:
        'Un accompagnement simple, réactif et de proximité pour obtenir le classement officiel de votre meublé de tourisme.',
      items: [
        {
          icon: 'shield',
          title: 'Organisme accrédité Cofrac',
          description:
            'Etoilys est accrédité Cofrac Inspection n°3-2394 pour le classement des meublés de tourisme. La portée d’accréditation est ',
          link: {
            label: 'consultable en ligne',
            href: 'cofrac',
          },
        },
        {
          icon: 'zap',
          title: 'Un parcours simplifié',
          description:
            "Nos outils internes simplifient la démarche : pas de dossier complexe à constituer, un suivi clair et un accompagnement fluide jusqu'à la décision de classement.",
        },
        {
          icon: 'clock',
          title: 'Proximité et réactivité',
          description:
            'Nos inspecteurs proches de chez vous vous accompagnent personnellement pour un classement rapide et efficace.',
        },
      ],
    },
    benefits: {
      title: "Les bénéfices d'un classement officiel",
      description:
        'Un classement en étoiles apporte de nombreux avantages pour votre activité de location saisonnière.',
      items: [
        {
          icon: 'calculator',
          title: 'Régime fiscal avantageux',
          description:
            "Un meublé classé bénéficie d'un abattement fiscal majoré en régime micro-BIC (50 % contre 30 %).",
        },
        {
          icon: 'users',
          title: 'Confiance des voyageurs',
          description:
            'Le classement en étoiles est un gage de qualité et de transparence pour les locataires.',
        },
        {
          icon: 'globe',
          title: 'Référencement officiel',
          description:
            "Les meublés classés sont référencés dans les réseaux officiels du tourisme et bénéficient d'une meilleure visibilité.",
        },
      ],
      cta: {
        label: 'Découvrir tous les avantages',
        href: '/les-avantages-du-classement',
      },
    },
    procedure: {
      imageAlt: "Interieur d'un meuble de tourisme moderne",
      title: 'Une procédure simple et rapide',
      paragraphs: [
        'La démarche est simple : vous déposez votre demande, puis un inspecteur vous contacte sous 24 heures pour vérifier les informations utiles et organiser la visite selon vos disponibilités.',
        'La visite se déroule à votre logement, sur rendez-vous, à une date qui vous convient.',
        "Sous 7 jours suivant la visite, vous recevez une proposition de classement en étoiles, que vous êtes libre d'accepter ou de refuser.",
      ],
      cta: {
        label: 'Découvrir la procédure',
        href: '/procedure',
      },
    },
    news: {
      title: 'Nos dernières actualités',
      description:
        'Restez informé des nouveautés réglementaires et des évolutions du secteur de la location meublée de tourisme.',
      cta: {
        label: 'Voir toutes les actualités',
        href: '/actualites',
      },
    },
    finalCta: {
      title: 'Lancez votre démarche de classement.',
      description:
        "Etoilys prend en charge l'intégralité de la procédure. Un inspecteur de proximité vous accompagne de la première prise de contact jusqu'à la délivrance de votre certificat officiel.",
      cta: {
        label: 'Demander votre classement',
        href: '/demande-classement',
      },
    },
  },
  en: {
    hero: {
      imageAlt: 'Terrace with swimming pool at furnished tourist accommodation',
      title: 'Official classification of your furnished tourist accommodation',
      description:
        'Etoilys supports you in obtaining the official star classification of your furnished tourist accommodation.',
      primaryCta: {
        label: 'Request your classification',
        href: '/en/request-a-classification',
      },
      secondaryCta: {
        label: 'The benefits of classification',
        href: '/en/benefits-of-furnished-tourist-accommodation-classification',
      },
    },
    features: {
      title: 'Why choose Etoilys?',
      description:
        'Simple, responsive and local support to obtain the official classification of your furnished tourist accommodation.',
      items: [
        {
          icon: 'shield',
          title: 'Cofrac accredited inspection body',
          description:
            'Etoilys is Cofrac Inspection accredited, no. 3-2394, for furnished tourist accommodation classification. The accreditation scope is ',
          link: {
            label: 'available online',
            href: 'cofrac',
          },
        },
        {
          icon: 'zap',
          title: 'A simplified process',
          description:
            'Our internal tools simplify the process: no complex file to prepare, clear follow-up and smooth support through to the classification decision.',
        },
        {
          icon: 'clock',
          title: 'Local presence and responsiveness',
          description:
            'Inspectors located near you provide personal support for a fast and efficient classification process.',
        },
      ],
    },
    benefits: {
      title: 'The benefits of an official classification',
      description: 'A star classification brings many benefits for your seasonal rental activity.',
      items: [
        {
          icon: 'calculator',
          title: 'Advantageous tax regime',
          description:
            'Classified furnished tourist accommodation benefits from an increased micro-BIC tax allowance (50% instead of 30%).',
        },
        {
          icon: 'users',
          title: 'Traveller trust',
          description: 'The star classification is a sign of quality and transparency for tenants.',
        },
        {
          icon: 'globe',
          title: 'Official tourism listing',
          description:
            'Classified furnished tourist accommodation is listed in official tourism networks and benefits from better visibility.',
        },
      ],
      cta: {
        label: 'Discover all the benefits',
        href: '/en/benefits-of-furnished-tourist-accommodation-classification',
      },
    },
    procedure: {
      imageAlt: 'Interior of modern furnished tourist accommodation',
      title: 'A simple and fast procedure',
      paragraphs: [
        'The process is simple: you submit your request, then an inspector contacts you within 24 hours to check the useful information and organize the visit according to your availability.',
        'The visit takes place at your accommodation, by appointment, on a date that suits you.',
        'Within 7 days after the visit, you receive a star classification proposal, which you are free to accept or refuse.',
      ],
      cta: {
        label: 'Discover the procedure',
        href: '/en/classification-process',
      },
    },
    serviceLinks: {
      title: 'Useful pages about classification',
      description:
        'Key information pages in English about the French classification process and the next steps with Etoilys.',
      links: [
        {
          title: 'What is official classification?',
          description:
            'Understand the French star rating framework for furnished tourist accommodation.',
          href: '/en/furnished-tourist-accommodation-classification',
        },
        {
          title: 'Classification benefits',
          description: 'Tax, tourist tax, official signs, ANCV and other objective effects.',
          href: '/en/benefits-of-furnished-tourist-accommodation-classification',
        },
        {
          title: 'Requirements before inspection',
          description: 'Minimum points to check before requesting a classification visit.',
          href: '/en/classification-requirements',
        },
        {
          title: 'Classification process',
          description:
            'The steps from request to inspection certificate and classification decision.',
          href: '/en/classification-process',
        },
        {
          title: 'Frequently asked questions',
          description:
            'Answers to common questions about classification, validity and obligations.',
          href: '/en/faq',
        },
        {
          title: 'Request your classification',
          description:
            'Send the useful information so Etoilys can contact you about the next steps.',
          href: '/en/request-a-classification',
        },
      ],
    },
    finalCta: {
      title: 'Start your classification process.',
      description:
        'Etoilys takes care of the entire procedure. A local inspector supports you from the first contact through to the delivery of your official certificate.',
      cta: {
        label: 'Request your classification',
        href: '/en/request-a-classification',
      },
    },
  },
} as const satisfies Record<Locale, HomePageContent>;
