import type { ImageAssetKey } from './imageManifest';
import { BERGERAC_FAQ, BERGERAC_SERVICE_COMMUNES } from './local/cities/bergerac';
import { LOCAL_CLASSIFICATION_PROCEDURE } from './local/sharedLocalContent';
import type { LocalFaqItem, LocalProcedureStep } from './local/types';
import type { PricingProfileId } from './local/pricing';

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
  exampleSubtitle: string;
  comparison: CityTaxComparisonItem[];
  savingsHeadline: string;
  savingsDetail: string;
  sourceNote: string;
}

interface CityLocalWarningContent {
  title: string;
  intro: string;
  items: string[];
  conclusion: string;
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
  layoutVersion?: 'v3' | 'v4';
  localWarningPlacement?: 'afterServiceArea' | 'afterTax';
  pricingProfileId: PricingProfileId;
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

export const BERGERAC_CITY_LANDING_PAGE: CityLandingPageConfig = {
  layoutVersion: 'v4',
  pricingProfileId: 'dordogne-standard',
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
    title: 'Votre classement directement dans votre logement',
    intro:
      'Nos inspecteurs interviennent à Bergerac et dans le Bergeracois, sans frais de déplacement, notamment à :',
    communes: BERGERAC_SERVICE_COMMUNES,
    outro: [],
    parentLink: {
      label: 'Voir l’ensemble de nos interventions en Dordogne',
      href: '/classement-meuble-tourisme-dordogne',
    },
  },
  tax: {
    title: 'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
    paragraphs: [
      'Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Dans ce contexte local, l’écart de taxe de séjour entre un meublé non classé et un meublé classé donne un exemple concret de l’intérêt du classement.',
      'À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne.',
      'Sur une réservation à 150 € la nuit hors taxe de séjour pour quatre adultes, un meublé classé 2 étoiles permet par exemple de réduire la taxe de séjour de 3,48 € par nuit.',
    ],
    exampleLabel: 'Exemple à Bergerac',
    exampleTitle: 'Taxe de séjour pour 4 adultes',
    exampleSubtitle: 'Logement à 150 € la nuit',
    comparison: [
      { label: 'Meublé non classé', value: '6,60 € par nuit' },
      { label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
    ],
    savingsHeadline: '3,48 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de la Communauté d’agglomération Bergeracoise.',
  },
  procedure: LOCAL_CLASSIFICATION_PROCEDURE,
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
  layoutVersion: 'v4',
  localWarningPlacement: 'afterTax',
  pricingProfileId: 'bordeaux-standard',
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
    title: 'Votre classement directement dans votre logement',
    intro:
      'Nos inspecteurs interviennent à Bordeaux et dans Bordeaux Métropole, sans frais de déplacement, notamment à :',
    communes: BORDEAUX_SERVICE_COMMUNES,
    outro: [],
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      href: '/classement-meuble-tourisme-gironde',
    },
  },
  tax: {
    title: 'À Bordeaux, mieux se différencier peut aussi coûter moins cher à vos voyageurs',
    paragraphs: [
      'Bordeaux attire aussi bien les voyageurs venus profiter de la ville que ceux qui souhaitent découvrir les vignobles et le reste de la Gironde. Face à une offre de locations saisonnières particulièrement dense, le classement donne à votre logement un repère officiel qui peut l’aider à mieux se distinguer au moment de réserver.',
      'À Bordeaux Métropole, cet intérêt se retrouve aussi très concrètement dans la taxe de séjour. Pour une réservation à 150 € la nuit hors taxe de séjour et quatre adultes, un meublé classé 2 étoiles représente 5,04 € de taxe de séjour en moins par nuit, soit 35,28 € économisés sur une semaine.',
    ],
    exampleLabel: 'Exemple à Bordeaux',
    exampleTitle: 'Taxe de séjour pour 4 adultes',
    exampleSubtitle: 'Logement à 150 € la nuit',
    comparison: [
      { label: 'Meublé non classé', value: '10,80 € par nuit' },
      { label: 'Meublé classé 2 étoiles', value: '5,76 € par nuit' },
    ],
    savingsHeadline: '5,04 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 35,28 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de Bordeaux Métropole, taxes additionnelles comprises.',
  },
  localWarning: {
    title: 'À Bordeaux, quelques règles locales à connaître',
    intro:
      'Le classement de votre meublé est indépendant de certaines démarches locales liées à la location touristique. À Bordeaux, pensez notamment à vérifier les règles applicables concernant l’enregistrement, la résidence principale et, selon votre situation, le changement d’usage.',
    items: [
      'le numéro d’enregistrement obligatoire pour la location d’un logement entier ;',
      'la limite de 90 jours par année civile lorsqu’il s’agit de la résidence principale ;',
      'l’autorisation de changement d’usage applicable aux résidences secondaires, avec une éventuelle compensation selon la situation du bien.',
    ],
    conclusion:
      'Ces formalités restent indépendantes du classement et doivent être vérifiées auprès de la Ville de Bordeaux avant la mise en location.',
    source: {
      label: 'Consulter le guide propriétaire de la Ville de Bordeaux',
      href: 'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires',
    },
  },
  procedure: LOCAL_CLASSIFICATION_PROCEDURE,
  faq: {
    title: 'Questions fréquentes sur le classement à Bordeaux',
    items: [
      ...BERGERAC_FAQ,
      {
        question: 'Le classement me permet-il automatiquement de louer mon logement à Bordeaux ?',
        answer:
          'Non. Le classement et les formalités locales sont deux démarches distinctes. Selon votre logement, vous devez notamment vérifier le numéro d’enregistrement, la limite applicable à une résidence principale et les règles de changement d’usage.',
      },
    ],
  },
  finalCta: {
    title: 'Vous souhaitez faire classer votre meublé à Bordeaux ?',
    paragraphs: [
      'Envoyez-nous l’adresse du logement et quelques informations. Nous vous confirmerons rapidement le tarif et les prochaines disponibilités dans la métropole bordelaise.',
    ],
  },
};
