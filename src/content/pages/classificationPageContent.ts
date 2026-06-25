import type { Locale } from '../../i18n/locales';

type ClassificationLevel = {
  stars: number;
  title: string;
  description: string;
};

type ClassificationAdvantage = {
  icon: 'calculator' | 'users' | 'globe';
  title: string;
  description: string;
};

type ClassificationPageContent = {
  hero: {
    title: string;
    description: string;
  };
  definition: {
    title: string;
    paragraph1: {
      beforeCodeLink: string;
      codeLinkLabel: string;
      betweenLinks: string;
      orderLinkLabel: string;
      afterOrderLink: string;
    };
    paragraph2: string;
    accreditation: {
      title: string;
      description: string;
      linkLabel: string;
    };
    paragraph3: {
      beforeReferenceLink: string;
      referenceLinkLabel: string;
      beforeRequirementsLink: string;
      requirementsLinkLabel: string;
      afterRequirementsLink: string;
    };
    note: {
      label: string;
      text: string;
    };
  };
  levelsTitle: string;
  levels: readonly ClassificationLevel[];
  advantages: {
    title: string;
    description: string;
    items: readonly ClassificationAdvantage[];
    ctaLabel?: string;
    ctaHref?: string;
  };
  localIntervention?: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  finalCta: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
  };
};

export const classificationPageContent: Record<Locale, ClassificationPageContent> = {
  fr: {
    hero: {
      title: 'Le classement des meublés de tourisme',
      description:
        "Le classement en étoiles est une démarche officielle qui évalue le niveau de confort, d'équipement et de services de votre meublé de tourisme. Voici l'essentiel pour comprendre son fonctionnement et savoir si votre logement peut être concerné.",
    },
    definition: {
      title: "Qu'est-ce que le classement meublé de tourisme ?",
      paragraph1: {
        beforeCodeLink:
          "Le classement des meublés de tourisme est une démarche volontaire permettant d'obtenir une certification officielle de 1 à 5 étoiles, valable 5 ans. Il est régi par le ",
        codeLinkLabel: 'Code du tourisme (articles L.324-1 et suivants)',
        betweenLinks: " et son référentiel est fixé par l'",
        orderLinkLabel: 'arrêté du 24 novembre 2021',
        afterOrderLink: ', entré en vigueur le 1er février 2022.',
      },
      paragraph2:
        'La visite de contrôle est obligatoirement réalisée en présence physique par un organisme accrédité par le COFRAC ou agréé par Atout France. Les listes des organismes habilités sont publiées et tenues à jour par Atout France.',
      accreditation: {
        title: 'Organisme accrédité Cofrac Inspection',
        description:
          "Etoilys est un organisme de contrôle accrédité Cofrac Inspection n°3-2394 pour le classement des meublés de tourisme. Cette accréditation permet de réaliser les visites officielles et d'émettre les documents de classement.",
        linkLabel: "Voir la portée d'accréditation",
      },
      paragraph3: {
        beforeReferenceLink:
          "Le classement s'applique à tous les types de meublés de tourisme : studios, appartements, maisons, chalets. Il n'est soumis à aucun critère géographique ou de taille minimale autre que ceux du ",
        referenceLinkLabel: 'référentiel officiel',
        beforeRequirementsLink:
          ". Pour plus d'informations sur les conditions d'éligibilité, consultez les ",
        requirementsLinkLabel: 'prérequis au classement',
        afterRequirementsLink: '.',
      },
      note: {
        label: 'À noter : ',
        text: "le classement ne remplace pas les obligations locales - déclaration en mairie, numéro d'enregistrement si applicable, immatriculation (SIRET). Ces démarches sont distinctes et peuvent être exigées indépendamment du classement.",
      },
    },
    levelsTitle: 'Les 5 niveaux de classement',
    levels: [
      {
        stars: 1,
        title: '1 étoile',
        description:
          "Hébergement confortable répondant aux critères de base de qualité et d'équipement.",
      },
      {
        stars: 2,
        title: '2 étoiles',
        description: 'Niveau de confort supérieur avec des équipements et services de qualité.',
      },
      {
        stars: 3,
        title: '3 étoiles',
        description: 'Hébergement de standing avec équipements modernes et prestations soignées.',
      },
      {
        stars: 4,
        title: '4 étoiles',
        description:
          'Très haut niveau de confort, équipements haut de gamme et prestations exceptionnelles.',
      },
      {
        stars: 5,
        title: '5 étoiles',
        description:
          "Excellence absolue, luxe et prestations d'exception pour une expérience inoubliable.",
      },
    ],
    advantages: {
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
      ctaLabel: 'Découvrir tous les avantages',
      ctaHref: '/les-avantages-du-classement',
    },
    localIntervention: {
      title: 'Etoilys intervient aussi localement',
      description:
        'Etoilys intervient auprès des propriétaires de meublés de tourisme dans plusieurs secteurs du Sud-Ouest, notamment en Dordogne.',
      ctaLabel: "Voir les zones d'intervention",
      ctaHref: '/zones-intervention',
    },
    finalCta: {
      title: 'Prêt à faire classer votre meublé ?',
      description:
        'Vous souhaitez faire classer votre meublé ? Transmettez-nous votre demande et nous vous recontactons pour organiser la suite.',
      primaryLabel: 'Demander votre classement',
      primaryHref: '/demande-classement',
    },
  },
  en: {
    hero: {
      title: 'Official classification of furnished tourist accommodation',
      description:
        'The star rating classification is an official French process that assesses the level of comfort, equipment and services of a furnished tourist accommodation. This page explains the essentials: how it works and when a property may be concerned.',
    },
    definition: {
      title: 'What is furnished tourist accommodation classification?',
      paragraph1: {
        beforeCodeLink:
          'The classification of furnished tourist accommodation is a voluntary process that can award an official 1 to 5 star classification, valid for 5 years. It is governed by the ',
        codeLinkLabel: 'French Tourism Code (Articles L.324-1 et seq.)',
        betweenLinks: ' and its reference framework is set by the ',
        orderLinkLabel: 'order of 24 November 2021',
        afterOrderLink: ', which entered into force on 1 February 2022.',
      },
      paragraph2:
        'The inspection visit must be carried out on site by a body accredited by Cofrac or approved by Atout France. Atout France publishes and updates the lists of authorised bodies.',
      accreditation: {
        title: 'Cofrac Inspection accredited body',
        description:
          'Etoilys is a Cofrac Inspection accredited inspection body, no. 3-2394, for the classification of furnished tourist accommodation. This accreditation allows Etoilys to carry out official inspections and issue classification documents.',
        linkLabel: 'View the accreditation scope',
      },
      paragraph3: {
        beforeReferenceLink:
          'The classification applies to all types of furnished tourist accommodation: studios, apartments, houses and chalets. It is not subject to a geographic condition or a minimum size condition other than those set out in the ',
        referenceLinkLabel: 'official reference framework',
        beforeRequirementsLink: '. For more information about eligibility conditions, see the ',
        requirementsLinkLabel: 'classification requirements',
        afterRequirementsLink: '.',
      },
      note: {
        label: 'Please note: ',
        text: 'classification does not replace local obligations such as declaration to the town hall, registration number where applicable, or SIRET registration. These procedures are separate and may be required independently of classification.',
      },
    },
    levelsTitle: 'The 5 classification levels',
    levels: [
      {
        stars: 1,
        title: '1 star',
        description:
          'Comfortable accommodation meeting the basic criteria for quality and equipment.',
      },
      {
        stars: 2,
        title: '2 stars',
        description: 'A higher level of comfort with quality equipment and services.',
      },
      {
        stars: 3,
        title: '3 stars',
        description:
          'Well-appointed accommodation with modern equipment and carefully presented services.',
      },
      {
        stars: 4,
        title: '4 stars',
        description: 'A very high level of comfort, high-end equipment and exceptional services.',
      },
      {
        stars: 5,
        title: '5 stars',
        description: 'The highest category, with luxury equipment and exceptional services.',
      },
    ],
    advantages: {
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
      ctaLabel: 'Discover all the benefits',
      ctaHref: '/en/benefits-of-furnished-tourist-accommodation-classification',
    },
    finalCta: {
      title: 'Ready to have your furnished accommodation classified?',
      description:
        'Would you like to have your furnished accommodation classified? Send us your request and we will contact you to organize the next steps.',
      primaryLabel: 'Request your classification',
      primaryHref: '/en/request-a-classification',
    },
  },
};
