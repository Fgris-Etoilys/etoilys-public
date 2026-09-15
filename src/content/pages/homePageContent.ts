import type { Locale } from '../../i18n/locales';
import { COFRAC_ACCREDITATION_URL } from '../accreditationLinks';

export type HomeIconKey = 'shield' | 'star' | 'clock' | 'calculator' | 'users' | 'globe';

type HomeFeatureBase = {
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
};

export type HomeFeature = HomeFeatureBase & {
  icon: HomeIconKey;
};

export type HomeProofFeature = HomeFeatureBase & {
  icon?: HomeIconKey;
  value?: string;
};

export type HomeServiceLink = {
  title: string;
  description: string;
  href: string;
};

export type HomePageContent = {
  hero: {
    imageAlt: string;
    eyebrow: string;
    title: { lead: string; accent: string };
    description: string;
    reassurance: readonly string[];
    photoNote: { lead: string; title: string; caption: string };
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  proofStrip: readonly HomeProofFeature[];
  features: {
    eyebrow: string;
    imageAlt: string;
    title: string;
    description: string;
    items: readonly HomeFeature[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly HomeFeature[];
    cta: {
      label: string;
      href: string;
    };
  };
  procedure: {
    eyebrow: string;
    title: string;
    steps: readonly { title: string; description: string }[];
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
      eyebrow: 'Propriétaires de meublés de tourisme',
      imageAlt: "Terrasse avec piscine d'un meublé de tourisme",
      title: {
        lead: 'Classement officiel de votre',
        accent: 'meublé de tourisme',
      },
      description:
        'Etoilys vous accompagne pour obtenir le classement officiel en étoiles de votre meublé de tourisme.',
      primaryCta: {
        label: 'Demander mon classement',
        href: '/demande-classement',
      },
      secondaryCta: {
        label: 'Les avantages du classement',
        href: '/les-avantages-du-classement',
      },
      reassurance: ['Rappel sous 24 h ouvrées', 'Visite en moyenne sous deux semaines'],
      photoNote: {
        lead: 'Du studio au grand gîte,',
        title: 'un classement de 1 à 5 étoiles.',
        caption: 'Un repère de qualité pour vos voyageurs.',
      },
    },
    proofStrip: [
      {
        icon: 'shield',
        title: 'Organisme accrédité',
        description: 'Cofrac Inspection n° 3-2394',
        link: {
          label: 'Cofrac Inspection n° 3-2394',
          href: COFRAC_ACCREDITATION_URL,
        },
      },
      {
        value: '5',
        title: 'ans de validité',
        description: 'Une fois le classement acquis',
      },
      {
        icon: 'users',
        title: 'Un inspecteur à vos côtés',
        description: 'De la demande aux documents de classement',
      },
    ],
    features: {
      eyebrow: 'Une expertise dédiée à votre logement',
      imageAlt: 'Salon lumineux avec canapé gris, fauteuil en bois et mur vert doux',
      title: 'Pourquoi choisir Etoilys ?',
      description:
        'Des spécialistes du classement, des outils pour vous préparer et un accompagnement à chaque étape.',
      items: [
        {
          icon: 'star',
          title: '100 % spécialisés dans le classement des meublés de tourisme',
          description:
            'Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos inspecteurs connaissent en profondeur la réglementation, la grille officielle et les points qui font réellement la différence pour atteindre la catégorie visée.',
        },
        {
          icon: 'calculator',
          title: 'Des outils pour préparer votre visite',
          description:
            'Notre simulateur vous aide à estimer la catégorie visée et à repérer les points à préparer.',
          link: {
            label: 'Estimer mon classement',
            href: '/simulateur',
          },
        },
        {
          icon: 'shield',
          title: 'Un organisme accrédité Cofrac',
          description:
            'Etoilys réalise les visites officielles de classement dans le cadre de son accréditation Cofrac Inspection n° 3-2394.',
          link: {
            label: 'Consulter notre portée d’accréditation',
            href: COFRAC_ACCREDITATION_URL,
          },
        },
      ],
    },
    benefits: {
      eyebrow: 'Le classement, pour vous',
      title: "Les bénéfices d'un classement officiel",
      description:
        'Un classement en étoiles apporte de nombreux avantages pour votre activité de location saisonnière.',
      items: [
        {
          icon: 'calculator',
          title: 'Régime fiscal avantageux',
          description:
            'Pour les revenus 2026 déclarés en 2027, un meublé classé bénéficie d’un abattement micro-BIC de 50 %, contre 30 % pour un meublé non classé.',
          link: {
            label: 'Estimer mon avantage fiscal',
            href: '/simulateur-fiscal-classement',
          },
        },
        {
          icon: 'users',
          title: 'Confiance des voyageurs',
          description:
            'Le classement en étoiles est un gage de qualité et de transparence pour les locataires.',
          link: {
            label: 'Comprendre les étoiles',
            href: '/classement',
          },
        },
        {
          icon: 'globe',
          title: 'Référencement officiel',
          description:
            "Les meublés classés sont référencés dans les réseaux officiels du tourisme et bénéficient d'une meilleure visibilité.",
          link: {
            label: 'Découvrir les atouts du classement',
            href: '/les-avantages-du-classement#reconnaissance',
          },
        },
      ],
      cta: {
        label: 'Découvrir tous les avantages',
        href: '/les-avantages-du-classement',
      },
    },
    procedure: {
      eyebrow: 'De la demande aux étoiles',
      title: 'Votre classement en trois étapes',
      steps: [
        {
          title: 'Vous nous parlez de votre logement.',
          description:
            'Envoyez vos coordonnées et l’adresse du meublé. Nous vous rappelons sous 24 h ouvrées pour préciser votre projet.',
        },
        {
          title: 'Nous préparons la visite ensemble.',
          description:
            'Nous confirmons le tarif et les modalités, puis convenons d’une date. La visite a lieu en moyenne sous deux semaines.',
        },
        {
          title: 'Votre logement est évalué sur place.',
          description:
            'Après le contrôle selon la grille officielle, vous recevez sous 7 jours les documents et la proposition de classement.',
        },
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
        label: 'Demander mon classement',
        href: '/demande-classement',
      },
    },
  },
  en: {
    hero: {
      eyebrow: 'Owners of furnished tourist accommodation',
      imageAlt: 'Terrace with swimming pool at furnished tourist accommodation',
      title: {
        lead: 'Official classification of your',
        accent: 'furnished tourist accommodation',
      },
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
      reassurance: ['Callback within 24 business hours', 'Inspection usually within two weeks'],
      photoNote: {
        lead: 'From studios to large holiday homes,',
        title: 'a classification from 1 to 5 stars.',
        caption: 'A quality reference for your guests.',
      },
    },
    proofStrip: [
      {
        icon: 'shield',
        title: 'Accredited body',
        description: 'Cofrac Inspection no. 3-2394',
        link: {
          label: 'Cofrac Inspection no. 3-2394',
          href: COFRAC_ACCREDITATION_URL,
        },
      },
      {
        value: '5',
        title: 'years of validity',
        description: 'Once classification has been awarded',
      },
      {
        icon: 'users',
        title: 'An inspector by your side',
        description: 'From your request to the classification documents',
      },
    ],
    features: {
      eyebrow: 'Expertise dedicated to your property',
      imageAlt: 'Sunlit living room with a grey sofa, wooden armchair and soft green wall',
      title: 'Why choose Etoilys?',
      description:
        'Classification specialists, resources to prepare your property and support at every stage.',
      items: [
        {
          icon: 'star',
          title: '100% specialised in furnished tourist accommodation classification',
          description:
            'Etoilys focuses exclusively on furnished tourist accommodation classification. Our inspectors know the regulations, the official assessment framework and the details that truly make the difference in reaching the target category.',
        },
        {
          icon: 'calculator',
          title: 'Tools to prepare your inspection',
          description:
            'Our requirements guide helps you identify the points to check before requesting an inspection.',
          link: {
            label: 'Check the requirements',
            href: '/en/classification-requirements',
          },
        },
        {
          icon: 'shield',
          title: 'A Cofrac-accredited body',
          description:
            'Etoilys carries out official classification inspections under its Cofrac Inspection accreditation no. 3-2394.',
          link: {
            label: 'View our accreditation scope',
            href: COFRAC_ACCREDITATION_URL,
          },
        },
      ],
    },
    benefits: {
      eyebrow: 'What classification brings you',
      title: 'The benefits of an official classification',
      description: 'A star classification brings many benefits for your seasonal rental activity.',
      items: [
        {
          icon: 'calculator',
          title: 'Advantageous tax regime',
          description:
            'For 2026 income declared in 2027, classified furnished tourist accommodation benefits from a 50% micro-BIC tax allowance, compared with 30% for non-classified accommodation.',
          link: {
            label: 'Compare the tax rules',
            href: '/en/benefits-of-furnished-tourist-accommodation-classification#fiscalite',
          },
        },
        {
          icon: 'users',
          title: 'Traveller trust',
          description: 'The star classification is a sign of quality and transparency for tenants.',
          link: {
            label: 'Understand the star categories',
            href: '/en/furnished-tourist-accommodation-classification',
          },
        },
        {
          icon: 'globe',
          title: 'Official tourism listing',
          description:
            'Classified furnished tourist accommodation is listed in official tourism networks and benefits from better visibility.',
          link: {
            label: 'Explore official recognition',
            href: '/en/benefits-of-furnished-tourist-accommodation-classification#reconnaissance',
          },
        },
      ],
      cta: {
        label: 'Discover all the benefits',
        href: '/en/benefits-of-furnished-tourist-accommodation-classification',
      },
    },
    procedure: {
      eyebrow: 'From request to stars',
      title: 'Your classification in three steps',
      steps: [
        {
          title: 'You tell us about your property.',
          description:
            'Send us your contact details and the address of the furnished accommodation. We call you back within 24 business hours to clarify your project.',
        },
        {
          title: 'We prepare the inspection together.',
          description:
            'We confirm the price and practical details, then agree on a date. The inspection usually takes place within two weeks.',
        },
        {
          title: 'Your accommodation is assessed on site.',
          description:
            'After the inspection using the official framework, you receive the documents and classification proposal within 7 days.',
        },
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
  nl: {
    hero: {
      eyebrow: 'Eigenaren van vakantiewoningen in Frankrijk',
      imageAlt: 'Terras met zwembad bij een Franse vakantiewoning',
      title: {
        lead: 'Officiële classificatie van uw',
        accent: 'vakantiewoning in Frankrijk',
      },
      description:
        'Etoilys begeleidt u in de momenteel bediende gebieden bij het verkrijgen van de officiële sterrenclassificatie van uw vakantiewoning, juridisch aangeduid als een “meublé de tourisme” in Frankrijk.',
      primaryCta: {
        label: 'Classificatie aanvragen',
        href: '/nl/classificatie-aanvragen',
      },
      secondaryCta: {
        label: 'Voordelen van classificatie',
        href: '/nl/voordelen-classificatie-vakantiewoning',
      },
      reassurance: ['Terugbellen binnen 24 werkuren', 'Inspectie gemiddeld binnen twee weken'],
      photoNote: {
        lead: 'Van studio tot groot vakantiehuis,',
        title: 'een classificatie van 1 tot 5 sterren.',
        caption: 'Een kwaliteitskenmerk voor uw gasten.',
      },
    },
    proofStrip: [
      {
        icon: 'shield',
        title: 'Geaccrediteerde inspectie-instelling',
        description: 'Cofrac Inspection nr. 3-2394',
        link: {
          label: 'Cofrac Inspection nr. 3-2394',
          href: COFRAC_ACCREDITATION_URL,
        },
      },
      {
        value: '5',
        title: 'jaar geldig',
        description: 'Zodra de classificatie is toegekend',
      },
      {
        icon: 'users',
        title: 'Een inspecteur die u begeleidt',
        description: 'Van aanvraag tot classificatiedocumenten',
      },
    ],
    features: {
      eyebrow: 'Expertise voor uw vakantiewoning',
      imageAlt: 'Lichte woonkamer met grijze bank, houten fauteuil en zachtgroene muur',
      title: 'Waarom Etoilys?',
      description:
        'Classificatiespecialisten, hulpmiddelen ter voorbereiding en begeleiding bij elke stap.',
      items: [
        {
          icon: 'star',
          title: '100% gespecialiseerd in de classificatie van vakantiewoningen',
          description:
            'Etoilys richt zich uitsluitend op de classificatie van vakantiewoningen. Onze inspecteurs kennen de regelgeving, het officiële beoordelingskader en de punten die echt het verschil maken om de beoogde categorie te bereiken.',
        },
        {
          icon: 'calculator',
          title: 'Hulpmiddelen om uw bezoek voor te bereiden',
          description:
            'Onze gids met voorwaarden helpt u de aandachtspunten te controleren voordat u een inspectie aanvraagt.',
          link: {
            label: 'De voorwaarden bekijken',
            href: '/nl/voorwaarden-classificatie-vakantiewoning',
          },
        },
        {
          icon: 'shield',
          title: 'Geaccrediteerd door Cofrac',
          description:
            'Etoilys voert officiële classificatiebezoeken uit binnen zijn Cofrac Inspection-accreditatie nr. 3-2394.',
          link: {
            label: 'De reikwijdte van onze accreditatie bekijken',
            href: COFRAC_ACCREDITATION_URL,
          },
        },
      ],
    },
    benefits: {
      eyebrow: 'Wat classificatie u biedt',
      title: 'De voordelen van een officiële classificatie',
      description:
        'Een sterrenclassificatie heeft verschillende concrete effecten voor een seizoensverhuur in Frankrijk.',
      items: [
        {
          icon: 'calculator',
          title: 'Fiscaal regime',
          description:
            'Voor inkomsten over 2026 die in 2027 worden aangegeven, geldt voor een geclassificeerde vakantiewoning een micro-BIC-aftrek van 50%, tegenover 30% voor een niet-geclassificeerde woning.',
          link: {
            label: 'De fiscale regels vergelijken',
            href: '/nl/voordelen-classificatie-vakantiewoning#fiscalite',
          },
        },
        {
          icon: 'users',
          title: 'Herkenningspunt voor reizigers',
          description:
            'De sterrenclassificatie is een officieel kwaliteitskenmerk dat reizigers duidelijkheid geeft over het comfort en de uitrusting.',
          link: {
            label: 'De sterrencategorieën begrijpen',
            href: '/nl/classificatie-vakantiewoning-frankrijk',
          },
        },
        {
          icon: 'globe',
          title: 'Officiële toeristische vermelding',
          description:
            'Geclassificeerde vakantiewoningen kunnen worden opgenomen in officiële toeristische netwerken en krijgen een gestandaardiseerd sterrenniveau.',
          link: {
            label: 'Officiële erkenning ontdekken',
            href: '/nl/voordelen-classificatie-vakantiewoning#reconnaissance',
          },
        },
      ],
      cta: {
        label: 'Alle voordelen bekijken',
        href: '/nl/voordelen-classificatie-vakantiewoning',
      },
    },
    procedure: {
      eyebrow: 'Van aanvraag tot sterren',
      title: 'Uw classificatie in drie stappen',
      steps: [
        {
          title: 'U vertelt ons over uw woning.',
          description:
            'Stuur uw contactgegevens en het adres van de vakantiewoning. Wij bellen u binnen 24 werkuren terug om uw project te verduidelijken.',
        },
        {
          title: 'Wij bereiden het bezoek samen voor.',
          description:
            'Wij bevestigen het tarief en de praktische modaliteiten, en spreken daarna een datum af. Het bezoek vindt gemiddeld binnen twee weken plaats.',
        },
        {
          title: 'Uw woning wordt ter plaatse beoordeeld.',
          description:
            'Na de controle volgens het officiële beoordelingskader ontvangt u binnen 7 dagen de documenten en het classificatievoorstel.',
        },
      ],
      cta: {
        label: 'De procedure bekijken',
        href: '/nl/classificatieprocedure-vakantiewoning',
      },
    },
    serviceLinks: {
      title: 'Nuttige pagina’s over classificatie',
      description:
        'Belangrijke informatie in het Nederlands over de Franse classificatieprocedure en de volgende stappen met Etoilys.',
      links: [
        {
          title: 'Wat is officiële classificatie?',
          description: 'Begrijp het Franse sterrenclassificatiesysteem voor vakantiewoningen.',
          href: '/nl/classificatie-vakantiewoning-frankrijk',
        },
        {
          title: 'Voordelen van classificatie',
          description: 'Fiscaliteit, toeristenbelasting, officiële sterren en ANCV.',
          href: '/nl/voordelen-classificatie-vakantiewoning',
        },
        {
          title: 'Voorwaarden vóór inspectie',
          description: 'Belangrijke punten om te controleren vóór een classificatiebezoek.',
          href: '/nl/voorwaarden-classificatie-vakantiewoning',
        },
        {
          title: 'Classificatieprocedure',
          description: 'De stappen van aanvraag tot inspectiecertificaat en besluit.',
          href: '/nl/classificatieprocedure-vakantiewoning',
        },
        {
          title: 'Veelgestelde vragen',
          description: 'Antwoorden over classificatie, geldigheid en verplichtingen.',
          href: '/nl/faq',
        },
        {
          title: 'Classificatie aanvragen',
          description:
            'Stuur de benodigde gegevens zodat Etoilys contact kan opnemen over de volgende stappen.',
          href: '/nl/classificatie-aanvragen',
        },
      ],
    },
    finalCta: {
      title: 'Start uw classificatieprocedure.',
      description:
        'Etoilys verzorgt de volledige procedure. Een lokale inspecteur begeleidt u vanaf het eerste contact tot aan de afgifte van het officiële certificaat.',
      cta: {
        label: 'Classificatie aanvragen',
        href: '/nl/classificatie-aanvragen',
      },
    },
  },
} as const satisfies Record<Locale, HomePageContent>;
