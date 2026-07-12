import type { Locale } from '../../i18n/locales';

type ProcedureStep = {
  number: number;
  title: string;
  description?: string;
  inspection?: {
    beforeReferenceLink: string;
    referenceLinkLabel: string;
    afterReferenceLink: string;
    accreditationText: string;
    accreditationLinkLabel: string;
  };
};

type ClassificationProcessPageContent = {
  hero: {
    title: string;
    description: string;
  };
  stepsTitle: string;
  steps: readonly ProcedureStep[];
  keyFigures: {
    title: string;
    items: readonly {
      value: string;
      label: string;
    }[];
  };
  certificate: {
    title: string;
    description: string;
    items: readonly string[];
  };
  finalCta: {
    title: string;
    description: string;
    links: readonly [
      {
        label: string;
        href: string;
        variant: 'ghost';
      },
      {
        label: string;
        href: string;
        variant: 'white';
      },
    ];
  };
};

export const classificationProcessPageContent: Record<Locale, ClassificationProcessPageContent> = {
  fr: {
    hero: {
      title: 'La procédure de classement',
      description:
        "Le classement d'un meublé de tourisme suit une procédure structurée en 5 étapes, de la demande initiale à l'attribution officielle du classement.",
    },
    stepsTitle: 'Les 5 étapes du classement',
    steps: [
      {
        number: 1,
        title: 'Demande de classement',
        description:
          'Votre demande peut être déposée en ligne ou bien en contactant directement Etoilys au 06 49 55 15 40.',
      },
      {
        number: 2,
        title: 'Prise de contact',
        description:
          "L'inspecteur de votre secteur prend contact avec vous sous 24 heures pour confirmer l'éligibilité de votre logement et convenir avec vous de la date de la visite d'inspection.",
      },
      {
        number: 3,
        title: "Visite d'inspection",
        inspection: {
          beforeReferenceLink:
            "La visite se déroule sur place. L'inspecteur contrôle le logement selon le ",
          referenceLinkLabel: 'référentiel officiel',
          afterReferenceLink:
            " et vérifie les équipements, les surfaces, l'état général et les services annoncés. À l'issue de la visite, vous avez la possibilité d'ajuster le niveau de classement visé en fonction des résultats.",
          accreditationText:
            'Cette visite officielle est réalisée par Etoilys dans le cadre de son accréditation Cofrac Inspection n°3-2394 pour le classement des meublés de tourisme.',
          accreditationLinkLabel: "Voir la portée d'accréditation",
        },
      },
      {
        number: 4,
        title: 'Proposition de classement',
        description:
          "Vous recevez sous 7 jours le certificat de visite complet incluant la grille de contrôle, le rapport d'inspection détaillé et la proposition de classement officielle. Vous disposez alors de 15 jours pour refuser la proposition de classement.",
      },
      {
        number: 5,
        title: 'Attribution du classement',
        description:
          "À l'issue de la procédure, le classement obtenu est valable 5 ans et peut figurer sur les annonces et supports de communication du logement.",
      },
    ],
    keyFigures: {
      title: 'Chiffres clés de la procédure',
      items: [
        { value: '24h', label: 'Délai de rappel après la demande' },
        { value: '133', label: 'Critères contrôlés lors de la visite' },
        { value: '7 jours', label: 'Délai de remise du certificat' },
        { value: '15 jours', label: 'Délai pour refuser la proposition' },
        { value: '5 ans', label: 'Durée de validité du classement' },
      ],
    },
    certificate: {
      title: 'Ce que comprend le certificat de visite',
      description:
        "À l'issue de la visite, un dossier complet est transmis dans un délai de 7 jours.",
      items: [
        'La grille de contrôle complète des 133 critères',
        "Le rapport d'inspection détaillé",
        'La proposition de classement officielle',
      ],
    },
    finalCta: {
      title: 'Vous souhaitez faire classer votre meublé ?',
      description:
        'Déposez votre demande en ligne ou contactez Etoilys pour organiser les prochaines étapes.',
      links: [
        { label: 'Questions fréquentes', href: '/faq', variant: 'ghost' },
        { label: 'Demander votre classement', href: '/demande-classement', variant: 'white' },
      ],
    },
  },
  en: {
    hero: {
      title: 'Furnished tourist accommodation classification process',
      description:
        'The classification of furnished tourist accommodation follows a structured 5-step process, from the initial request to the official classification decision.',
    },
    stepsTitle: 'The 5 classification steps',
    steps: [
      {
        number: 1,
        title: 'Classification request',
        description:
          'The request can be submitted online or by contacting Etoilys directly on +33 6 49 55 15 40.',
      },
      {
        number: 2,
        title: 'Contact',
        description:
          'The inspector for your area contacts you within 24 hours to confirm that the accommodation is eligible and to agree the inspection date with you.',
      },
      {
        number: 3,
        title: 'Inspection visit',
        inspection: {
          beforeReferenceLink:
            'The visit takes place on site. The inspector checks the accommodation against the ',
          referenceLinkLabel: 'official reference framework',
          afterReferenceLink:
            ' and reviews the equipment, surface areas, general condition and services announced. After the visit, the target classification level can be adjusted according to the results.',
          accreditationText:
            'This official inspection is carried out by Etoilys under its Cofrac Inspection accreditation no. 3-2394 for furnished tourist accommodation classification.',
          accreditationLinkLabel: 'View the accreditation scope',
        },
      },
      {
        number: 4,
        title: 'Classification proposal',
        description:
          'You receive the full inspection certificate within 7 days, including the inspection grid, the detailed inspection report and the official classification proposal. You then have 15 days to refuse the classification proposal.',
      },
      {
        number: 5,
        title: 'Classification awarded',
        description:
          'At the end of the process, the classification obtained is valid for 5 years and may appear on the accommodation listings and communication materials.',
      },
    ],
    keyFigures: {
      title: 'Key figures for the process',
      items: [
        { value: '24h', label: 'Call-back time after the request' },
        { value: '133', label: 'Criteria checked during the inspection' },
        { value: '7 days', label: 'Time for delivery of the certificate' },
        { value: '15 days', label: 'Time to refuse the proposal' },
        { value: '5 years', label: 'Classification validity period' },
      ],
    },
    certificate: {
      title: 'What the inspection certificate includes',
      description: 'After the inspection, a complete file is sent within 7 days.',
      items: [
        'The complete inspection grid covering the 133 criteria',
        'The detailed inspection report',
        'The official classification proposal',
      ],
    },
    finalCta: {
      title: 'Would you like to have your furnished accommodation classified?',
      description: 'Submit your request online or contact Etoilys to organize the next steps.',
      links: [
        { label: 'Frequently asked questions', href: '/en/faq', variant: 'ghost' },
        {
          label: 'Request your classification',
          href: '/en/request-a-classification',
          variant: 'white',
        },
      ],
    },
  },
  nl: {
    hero: {
      title: 'Classificatieprocedure voor een vakantiewoning',
      description:
        'De classificatie van een Franse vakantiewoning, juridisch aangeduid als een “meublé de tourisme”, volgt een gestructureerde procedure in 5 stappen, van de eerste aanvraag tot de officiële toekenning.',
    },
    stepsTitle: 'De 5 stappen van de classificatie',
    steps: [
      {
        number: 1,
        title: 'Classificatieaanvraag',
        description:
          'De aanvraag kan online worden ingediend of door rechtstreeks contact op te nemen met Etoilys via +33 6 49 55 15 40.',
      },
      {
        number: 2,
        title: 'Persoonlijk contact',
        description:
          'De inspecteur in uw sector neemt binnen 24 uur contact met u op om te bevestigen dat de woning in aanmerking komt en om samen met u de datum van het inspectiebezoek vast te leggen.',
      },
      {
        number: 3,
        title: 'Inspectiebezoek',
        inspection: {
          beforeReferenceLink:
            'Het bezoek vindt ter plaatse plaats. De inspecteur controleert de woning volgens het ',
          referenceLinkLabel: 'officiële referentiekader',
          afterReferenceLink:
            ' en verifieert de uitrusting, oppervlakten, algemene staat en aangekondigde diensten. Na het bezoek kan het beoogde classificatieniveau worden aangepast volgens de resultaten.',
          accreditationText:
            'Dit officiële bezoek wordt door Etoilys uitgevoerd binnen zijn Cofrac Inspection-accreditatie nr. 3-2394 voor de classificatie van vakantiewoningen.',
          accreditationLinkLabel: 'De reikwijdte van de accreditatie bekijken',
        },
      },
      {
        number: 4,
        title: 'Classificatievoorstel',
        description:
          'Binnen 7 dagen ontvangt u het volledige inspectiecertificaat, met de controlelijst, het gedetailleerde inspectierapport en het officiële classificatievoorstel. Daarna heeft u 15 dagen om het voorstel te weigeren.',
      },
      {
        number: 5,
        title: 'Toekenning van de classificatie',
        description:
          'Aan het einde van de procedure is de verkregen classificatie 5 jaar geldig en kan zij worden vermeld in advertenties en communicatiemiddelen van de woning.',
      },
    ],
    keyFigures: {
      title: 'Kerncijfers van de procedure',
      items: [
        { value: '24 uur', label: 'Terugbeltermijn na de aanvraag' },
        { value: '133', label: 'Criteria gecontroleerd tijdens het bezoek' },
        { value: '7 dagen', label: 'Termijn voor afgifte van het certificaat' },
        { value: '15 dagen', label: 'Termijn om het voorstel te weigeren' },
        { value: '5 jaar', label: 'Geldigheidsduur van de classificatie' },
      ],
    },
    certificate: {
      title: 'Wat het inspectiecertificaat bevat',
      description: 'Na het bezoek wordt binnen 7 dagen een volledig dossier verzonden.',
      items: [
        'De volledige controlelijst van de 133 criteria',
        'Het gedetailleerde inspectierapport',
        'Het officiële classificatievoorstel',
      ],
    },
    finalCta: {
      title: 'Wilt u uw vakantiewoning laten classificeren?',
      description:
        'Dien uw aanvraag online in of neem contact op met Etoilys om de volgende stappen te organiseren.',
      links: [
        { label: 'Veelgestelde vragen', href: '/nl/faq', variant: 'ghost' },
        { label: 'Classificatie aanvragen', href: '/nl/classificatie-aanvragen', variant: 'white' },
      ],
    },
  },
};
