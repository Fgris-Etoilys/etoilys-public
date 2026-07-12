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
        'La visite de contrôle est obligatoirement réalisée en présence physique par un organisme évaluateur accrédité ou un organisme agréé figurant sur la liste officielle. Les listes des organismes habilités sont publiées et tenues à jour par Atout France.',
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
            'Pour les revenus 2026 déclarés en 2027, un meublé classé bénéficie d’un abattement micro-BIC de 50 %, contre 30 % pour un meublé non classé.',
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
        'The inspection visit must be carried out on site by a Cofrac-accredited inspection body or a body recognised under the French regulatory scheme and included on the official list. Atout France publishes and updates the lists of authorised bodies.',
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
            'For 2026 income declared in 2027, classified furnished tourist accommodation benefits from a 50% micro-BIC tax allowance, compared with 30% for non-classified accommodation.',
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
  nl: {
    hero: {
      title: 'Officiële classificatie van een vakantiewoning in Frankrijk',
      description:
        'De sterrenclassificatie is een officiële Franse procedure die het comfort, de uitrusting en de diensten van een vakantiewoning beoordeelt. In juridische termen gaat het om een “meublé de tourisme”. Deze pagina legt de basis uit: hoe de classificatie werkt en wanneer een woning ermee te maken kan hebben.',
    },
    definition: {
      title: 'Wat is de classificatie van een vakantiewoning?',
      paragraph1: {
        beforeCodeLink:
          'De classificatie van vakantiewoningen is een vrijwillige procedure waarmee een officiële classificatie van 1 tot 5 sterren kan worden verkregen, geldig voor 5 jaar. Zij wordt geregeld door de ',
        codeLinkLabel: 'Franse Code du tourisme (artikelen L.324-1 en volgende)',
        betweenLinks: ' en het referentiekader is vastgesteld bij het ',
        orderLinkLabel: 'besluit van 24 november 2021',
        afterOrderLink: ', dat op 1 februari 2022 in werking is getreden.',
      },
      paragraph2:
        'Het controlebezoek moet fysiek ter plaatse worden uitgevoerd door een door Cofrac geaccrediteerde inspectie-instelling of een volgens de Franse regelgeving erkende instantie (organisme agréé) die op de officiële lijst staat. Atout France publiceert en actualiseert de lijsten van bevoegde instanties.',
      accreditation: {
        title: 'Door Cofrac Inspection geaccrediteerde inspectie-instelling',
        description:
          'Etoilys is een door Cofrac Inspection geaccrediteerde inspectie-instelling, nr. 3-2394, voor de classificatie van vakantiewoningen. Deze accreditatie maakt het mogelijk officiële bezoeken uit te voeren en classificatiedocumenten af te geven.',
        linkLabel: 'De reikwijdte van de accreditatie bekijken',
      },
      paragraph3: {
        beforeReferenceLink:
          'De classificatie geldt voor alle soorten vakantiewoningen: studio’s, appartementen, huizen en chalets. Zij is niet afhankelijk van een geografische voorwaarde of een minimale grootte, behalve de voorwaarden uit het ',
        referenceLinkLabel: 'officiële referentiekader',
        beforeRequirementsLink: '. Meer informatie over de toelatingsvoorwaarden staat bij de ',
        requirementsLinkLabel: 'voorwaarden voor classificatie',
        afterRequirementsLink: '.',
      },
      note: {
        label: 'Let op: ',
        text: 'de classificatie vervangt lokale verplichtingen niet, zoals aangifte bij de gemeente, een registratienummer wanneer dat van toepassing is, of SIRET-registratie. Deze stappen staan los van de classificatie en kunnen onafhankelijk daarvan verplicht zijn.',
      },
    },
    levelsTitle: 'De 5 classificatieniveaus',
    levels: [
      {
        stars: 1,
        title: '1 ster',
        description:
          'Comfortabele accommodatie die voldoet aan basiscriteria voor kwaliteit en uitrusting.',
      },
      {
        stars: 2,
        title: '2 sterren',
        description: 'Een hoger comfortniveau met hoogwaardige uitrusting en diensten.',
      },
      {
        stars: 3,
        title: '3 sterren',
        description: 'Een verzorgde accommodatie met moderne uitrusting en nette voorzieningen.',
      },
      {
        stars: 4,
        title: '4 sterren',
        description:
          'Een zeer hoog comfortniveau, hoogwaardige uitrusting en uitgebreide voorzieningen.',
      },
      {
        stars: 5,
        title: '5 sterren',
        description: 'De hoogste categorie, met luxe uitrusting en uitzonderlijke voorzieningen.',
      },
    ],
    advantages: {
      title: 'De voordelen van een officiële classificatie',
      description:
        'Een sterrenclassificatie heeft verschillende concrete effecten voor seizoensverhuur in Frankrijk.',
      items: [
        {
          icon: 'calculator',
          title: 'Fiscaal regime',
          description:
            'Voor inkomsten over 2026 die in 2027 worden aangegeven, geldt voor een geclassificeerde vakantiewoning een micro-BIC-aftrek van 50%, tegenover 30% voor een niet-geclassificeerde woning.',
        },
        {
          icon: 'users',
          title: 'Vertrouwen van reizigers',
          description:
            'De sterrenclassificatie is een officieel herkenningspunt voor kwaliteit en transparantie.',
        },
        {
          icon: 'globe',
          title: 'Officiële toeristische vermelding',
          description:
            'Geclassificeerde vakantiewoningen kunnen worden opgenomen in officiële toeristische netwerken en krijgen een gestandaardiseerd sterrenniveau.',
        },
      ],
      ctaLabel: 'Alle voordelen bekijken',
      ctaHref: '/nl/voordelen-classificatie-vakantiewoning',
    },
    finalCta: {
      title: 'Een classificatie voor uw vakantiewoning aanvragen?',
      description:
        'Wilt u uw vakantiewoning laten classificeren? Stuur uw aanvraag en Etoilys neemt contact met u op om de volgende stappen te organiseren.',
      primaryLabel: 'Classificatie aanvragen',
      primaryHref: '/nl/classificatie-aanvragen',
    },
  },
};
