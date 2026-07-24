import type { ImageAssetKey } from './imageManifest';
import type { LocalFaqItem, LocalProcedureStep } from './localServiceAreas';
import {
  BERGERAC_FAQ,
  BERGERAC_PROCEDURE_STEPS,
  BERGERAC_SERVICE_COMMUNES,
} from './localServiceAreas';

interface HeroImageCredit {
  sourceLabel: string;
  sourceHref: string;
  licenseLabel: string;
  licenseHref: string;
}

interface CityServiceAreaContent {
  title: string;
  intro: string;
  communes: string[];
  outro: string[];
  parentLink: {
    label: string;
    href: string;
  };
}

interface CityTaxComparisonItem {
  label: string;
  value: string;
}

interface CityTaxContent {
  title: string;
  paragraphs: string[];
  exampleLabel: string;
  exampleTitle: string;
  comparison: CityTaxComparisonItem[];
  savingsHeadline: string;
  savingsDetail: string;
  sourceNote: string;
}

interface CityLocalWarningContent {
  title: string;
  paragraphs: string[];
  source?: {
    label: string;
    href: string;
  };
}

interface CityFinalCtaContent {
  title: string;
  paragraphs: string[];
}

export interface CityLandingPageConfig {
  city: string;
  areaName: string;
  hero: {
    assetKey: ImageAssetKey;
    alt: string;
    eyebrow: string;
    h1: string;
    intro: string;
    credit: HeroImageCredit;
  };
  serviceArea: CityServiceAreaContent;
  tax: CityTaxContent;
  localWarning?: CityLocalWarningContent;
  procedure: {
    title: string;
    intro: string;
    steps: LocalProcedureStep[];
  };
  faq: {
    title: string;
    items: LocalFaqItem[];
  };
  finalCta: CityFinalCtaContent;
}

const BORDEAUX_SERVICE_COMMUNES = [
  'Bordeaux',
  'Mérignac',
  'Pessac',
  'Talence',
  'Bègles',
  'Le Bouscat',
  'Bruges',
  'Cenon',
  'Floirac',
  'Lormont',
  'Villenave-d’Ornon',
  'Gradignan',
];

const BORDEAUX_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous envoyez votre demande',
    description:
      'Remplissez le formulaire en 30 secondes. Un inspecteur proche de chez vous vous recontacte sous 24h ouvrées.',
  },
  {
    number: 2,
    title: 'Nous organisons la visite',
    description:
      'Etoilys confirme le tarif et vous propose une date d’intervention dans le secteur de Bordeaux.',
  },
  {
    number: 3,
    title: 'Nous réalisons le classement',
    description:
      'La visite est effectuée sur place selon le référentiel officiel. Vous recevez ensuite les documents correspondant au classement obtenu.',
  },
];

export const BERGERAC_CITY_LANDING_PAGE: CityLandingPageConfig = {
  city: 'Bergerac',
  areaName: 'Bergeracois',
  hero: {
    assetKey: 'bergeracHero',
    alt: 'Vue de la Dordogne et du centre-ville de Bergerac en fin d’après-midi',
    eyebrow: 'Bergerac et le Bergeracois',
    h1: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    intro:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    credit: {
      sourceLabel: 'Benjamin Smith / Wikimedia Commons',
      sourceHref: 'https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg',
      licenseLabel: 'CC BY-SA 4.0',
      licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
  },
  serviceArea: {
    title: 'Etoilys intervient à Bergerac et dans les communes proches',
    intro:
      'Etoilys organise des visites à Bergerac et dans l’ensemble du Bergeracois, notamment dans les communes suivantes :',
    communes: BERGERAC_SERVICE_COMMUNES,
    outro: [
      'Cette liste n’est pas exhaustive. Si votre commune n’apparaît pas, transmettez-nous simplement l’adresse du logement pour connaître les prochaines possibilités d’intervention.',
    ],
    parentLink: {
      label: 'Voir l’ensemble de nos interventions en Dordogne',
      href: '/classement-meuble-tourisme-dordogne',
    },
  },
  tax: {
    title: 'À Bergerac, le classement peut réduire la taxe de séjour',
    paragraphs: [
      'Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Au-delà de ses avantages fiscaux et de la visibilité qu’il peut apporter, le classement a aussi un effet concret sur la taxe de séjour payée par vos voyageurs.',
      'À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne.',
      'Sur une réservation à 150 € la nuit pour quatre adultes, un meublé classé 2 étoiles permet par exemple de réduire la taxe de séjour de 3,48 € par nuit.',
    ],
    exampleLabel: 'Exemple à Bergerac',
    exampleTitle: 'Taxe de séjour pour 150 € la nuit · 4 adultes',
    comparison: [
      { label: 'Meublé non classé', value: '6,60 € par nuit' },
      { label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
    ],
    savingsHeadline: '3,48 € de moins par nuit · soit environ –53 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de la Communauté d’agglomération Bergeracoise.',
  },
  procedure: {
    title: 'Comment faire classer votre meublé à Bergerac ?',
    intro:
      'La démarche est simple : vous nous transmettez les informations principales, nous organisons la visite dans votre logement, puis Etoilys réalise le classement officiel.',
    steps: BERGERAC_PROCEDURE_STEPS,
  },
  faq: {
    title: 'Questions fréquentes sur le classement à Bergerac',
    items: BERGERAC_FAQ,
  },
  finalCta: {
    title: 'Vous souhaitez faire classer votre meublé à Bergerac ?',
    paragraphs: [
      'Envoyez-nous l’adresse du logement et quelques informations. Nous vous confirmerons rapidement le tarif et les prochaines disponibilités dans le Bergeracois.',
    ],
  },
};

export const BORDEAUX_CITY_LANDING_PAGE: CityLandingPageConfig = {
  city: 'Bordeaux',
  areaName: 'Bordeaux Métropole',
  hero: {
    assetKey: 'bordeauxHero',
    alt: 'Place de la Bourse et miroir d’eau à Bordeaux',
    eyebrow: 'Bordeaux et Bordeaux Métropole',
    h1: 'Classement de meublé de tourisme à Bordeaux et dans la métropole',
    intro:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bordeaux ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    credit: {
      sourceLabel: 'Miguel Cuenca / Pexels',
      sourceHref: 'https://www.pexels.com/photo/place-de-la-bourse-in-bordeaux-france-17356595/',
      licenseLabel: 'Pexels License',
      licenseHref: 'https://www.pexels.com/license/',
    },
  },
  serviceArea: {
    title: 'Où intervenons-nous autour de Bordeaux ?',
    intro:
      'Etoilys intervient à Bordeaux ainsi que dans les communes proches de la métropole, notamment dans les communes suivantes :',
    communes: BORDEAUX_SERVICE_COMMUNES,
    outro: [
      'Cette liste est indicative et non exhaustive. Pour un logement situé dans une autre commune de Bordeaux Métropole ou ailleurs en Gironde, le propriétaire doit transmettre l’adresse afin qu’Etoilys confirme les modalités d’intervention.',
    ],
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      href: '/classement-meuble-tourisme-gironde',
    },
  },
  tax: {
    title: 'À Bordeaux, mieux se différencier peut aussi coûter moins cher à vos voyageurs',
    paragraphs: [
      'Bordeaux attire aussi bien les voyageurs venus profiter de la ville que ceux qui souhaitent découvrir les vignobles et le reste de la Gironde. Face à une offre de locations saisonnières particulièrement dense, le classement permet de donner à votre logement un repère officiel, plus lisible et plus rassurant au moment de réserver.',
      'Il peut également améliorer sa visibilité, notamment auprès des voyageurs sensibles aux étoiles, et vous faire bénéficier d’un régime fiscal plus favorable que celui d’un meublé non classé. À Bordeaux Métropole, son intérêt se retrouve aussi directement dans la taxe de séjour payée par vos voyageurs.',
      'Pour une réservation à 150 € HT la nuit et quatre adultes, un meublé classé 2 étoiles représente ainsi 5,04 € de taxe de séjour en moins par nuit, soit 35,28 € économisés sur une semaine.',
    ],
    exampleLabel: 'Exemple à Bordeaux',
    exampleTitle: 'Taxe de séjour pour 150 € HT la nuit · 4 adultes',
    comparison: [
      { label: 'Meublé non classé', value: '10,80 € par nuit' },
      { label: 'Meublé classé 2 étoiles', value: '5,76 € par nuit' },
    ],
    savingsHeadline: '5,04 € de moins par nuit · soit environ –47 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 35,28 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de Bordeaux Métropole, taxes additionnelles comprises.',
  },
  localWarning: {
    title: 'À Bordeaux, le classement ne remplace pas les autorisations locales',
    paragraphs: [
      'Dans la commune de Bordeaux, toute location d’un meublé de tourisme doit disposer d’un numéro d’enregistrement, qu’il s’agisse d’une résidence principale ou secondaire. Depuis le 1er janvier 2026, une résidence principale ne peut pas être proposée en location touristique plus de 90 jours par année civile.',
      'Pour une résidence secondaire, une autorisation préalable de changement d’usage est requise et peut impliquer une compensation selon la situation du bien. Le classement du meublé ne dispense d’aucune de ces démarches.',
    ],
    source: {
      label: 'Consulter le guide propriétaire de la Ville de Bordeaux',
      href: 'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires',
    },
  },
  procedure: {
    title: 'Comment faire classer votre meublé à Bordeaux ?',
    intro:
      'La démarche est simple : vous nous transmettez les informations principales, nous organisons la visite dans votre logement, puis Etoilys réalise le classement officiel.',
    steps: BORDEAUX_PROCEDURE_STEPS,
  },
  faq: {
    title: 'Questions fréquentes sur le classement à Bordeaux',
    items: BERGERAC_FAQ,
  },
  finalCta: {
    title: 'Vous souhaitez faire classer votre meublé à Bordeaux ?',
    paragraphs: [
      'Envoyez-nous l’adresse du logement et quelques informations. Nous vous confirmerons rapidement le tarif et les prochaines disponibilités dans la métropole bordelaise.',
    ],
  },
};
