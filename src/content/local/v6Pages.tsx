import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  DepartmentSector,
  LocalFaqItem,
  LocalV6Action,
  LocalLandingPageV6CityConfig,
  LocalLandingPageV6DepartmentConfig,
} from './types';
import { COFRAC_ACCREDITATION_URL } from '../accreditationLinks';
import { BERGERAC_FAQ, BERGERAC_SERVICE_COMMUNES } from './cities/bergerac';
import {
  BORDEAUX_FAQ,
  BORDEAUX_LOCAL_NOTICE,
  BORDEAUX_SERVICE_COMMUNES,
  BORDEAUX_TAX_MODULE,
} from './cities/bordeaux';
import { DORDOGNE_V6_SERVICE_SECTORS } from './departments/dordogne';
import { GIRONDE_SERVICE_SECTORS } from './departments/gironde';
import { LOT_SERVICE_SECTORS } from './departments/lot';
import { LOT_ET_GARONNE_SERVICE_SECTORS } from './departments/lot-et-garonne';
import { getSeoRouteConfig } from '../seoRoutes';
import {
  LOCAL_V6_COMMON_PROCEDURE,
  LOCAL_V6_HERO_REASSURANCE,
  LOCAL_V6_PRICING_CHECKLIST,
} from './sharedLocalContent';

function getLocalHeroImageSizes(path: string) {
  return getSeoRouteConfig(path).lcpImageSizes ?? '100vw';
}

const dordogneHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-dordogne');
const bergeracHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-bergerac');
const girondeHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-gironde');
const bordeauxHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-bordeaux');
const lotHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-lot');
const lotEtGaronneHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-lot-et-garonne'
);
const officialClassificationUrl =
  'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme';

export const LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION =
  'Faites classer votre gîte, maison ou appartement de 1 à 5 étoiles avec Etoilys, organisme accrédité Cofrac. Nous réalisons la visite officielle dans votre logement.';

export const LOCAL_V6_DEPARTMENT_PRICING_INTRO =
  'Indiquez la commune de votre logement pour consulter le tarif prévu. Nous confirmons ensuite les modalités et la possibilité d’intervenir à votre adresse.';

export const LOCAL_V6_DEPARTMENT_HERO_INDEXES = {
  dordogne: '24 / LE PÉRIGORD',
  gironde: '33 / LA GIRONDE',
  lot: '46 / LE LOT',
  'lot-et-garonne': '47 / LOT-ET-GARONNE',
} as const;

const localV6HeroPrimaryAction: LocalV6Action = {
  href: '/demande-classement',
  variant: 'white',
  className: 'editorial-dark-button',
  label: (
    <>
      Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
    </>
  ),
};

const localV6FinalPrimaryAction: LocalV6Action = {
  href: '/demande-classement',
  variant: 'white',
  className: 'editorial-inverse-button',
  label: (
    <>
      Demander mon classement <ArrowRight size={20} aria-hidden="true" />
    </>
  ),
};

function toCollapsedSectors(sectors: readonly DepartmentSector[], visibleCount = 5) {
  return sectors.map((sector) => ({
    name: sector.name,
    visibleCommunes: (sector.communes ?? []).slice(0, visibleCount),
    collapsedCommunes: (sector.communes ?? []).slice(visibleCount),
  }));
}

const heroReassurance = LOCAL_V6_HERO_REASSURANCE;
const pricingChecklist = LOCAL_V6_PRICING_CHECKLIST;
const commonProcedure = LOCAL_V6_COMMON_PROCEDURE;

const dordogneQuestions = [
  {
    question: 'Intervenez-vous dans ma commune en Dordogne ?',
    answer: (
      <>
        Nous couvrons les sept secteurs présentés sur cette page, du Bergeracois au Périgord Noir,
        ainsi que le Grand Périgueux, la vallée de l’Isle et le Ribéracois. Consultez les{' '}
        <a href="#communes">communes de nos secteurs</a> ou indiquez votre adresse dans votre
        demande pour confirmer notre intervention.
      </>
    ),
  },
  {
    question: 'Quel est le prix d’une visite de classement ?',
    answer: (
      <>
        Sélectionnez votre commune dans le <a href="#tarifs">calculateur de tarif</a>. Le prix
        inclut la visite et les documents de classement, sans frais de déplacement. Nous confirmons
        les modalités avant tout engagement.
      </>
    ),
  },
  {
    question: 'Sous quel délai pouvez-vous réaliser la visite ?',
    answer: (
      <>
        Nous vous rappelons sous 24 h ouvrées après votre demande. La visite a lieu en moyenne sous
        deux semaines, à une date convenue ensemble selon les disponibilités.
      </>
    ),
  },
  {
    question: 'Proposez-vous un tarif pour plusieurs meublés ?',
    answer: (
      <>
        Oui, des tarifs dégressifs s’appliquent pour plusieurs meublés visités le même jour dans le
        même secteur. Précisez le nombre de logements dans votre demande : nous vous confirmons le
        tarif adapté.
      </>
    ),
  },
  {
    question: 'Etoilys est-il accrédité pour réaliser le classement ?',
    answer: (
      <>
        Oui. Etoilys est un organisme d’inspection accrédité Cofrac sous le numéro 3-2394. La visite
        suit le référentiel officiel des meublés de tourisme.{' '}
        <a href={COFRAC_ACCREDITATION_URL} target="_blank" rel="noopener noreferrer">
          Consulter notre portée d’accréditation.
        </a>
      </>
    ),
  },
  {
    question: 'Mon gîte ou mon logement proposé sur Airbnb peut-il être classé ?',
    answer: (
      <>
        Maison de vacances, gîte rural, studio ou appartement : le classement concerne les meublés
        de tourisme, quelle que soit la plateforme de réservation utilisée. Les critères dépendent
        de la capacité, des équipements et de la catégorie visée.{' '}
        <Link to="/prerequis-au-classement">Consulter les prérequis.</Link>
      </>
    ),
  },
  {
    question: 'Comment choisir le nombre d’étoiles à demander ?',
    answer: (
      <>
        Notre <Link to="/simulateur">simulateur de classement</Link> vous aide à repérer les
        critères de la catégorie envisagée. Son résultat est indicatif : seule la visite officielle
        permet d’évaluer le logement. Vous pouvez aussi nous expliquer votre projet dès la demande.
      </>
    ),
  },
  {
    question: 'Et si mon logement ne remplit pas tous les critères ?',
    answer: (
      <>
        L’inspecteur vous explique les points constatés. Selon le critère et ce que permet le
        référentiel, certains justificatifs ou compléments peuvent être transmis après la visite. La
        catégorie demandée n’est jamais garantie à l’avance.
      </>
    ),
  },
  {
    question: 'Le classement est-il obligatoire ? Combien de temps dure-t-il ?',
    answer: (
      <>
        Le classement est volontaire et valable cinq ans une fois acquis. Il ne remplace pas les
        formalités de déclaration ou d’enregistrement applicables à votre location.{' '}
        <a href={officialClassificationUrl} target="_blank" rel="noopener noreferrer">
          Voir le cadre officiel.
        </a>
      </>
    ),
  },
] as const satisfies readonly LocalFaqItem[];

function buildDepartmentFaqItems(
  coverageItem: LocalFaqItem,
  localItems: readonly LocalFaqItem[] = []
) {
  return [coverageItem, ...dordogneQuestions.slice(1), ...localItems] satisfies LocalFaqItem[];
}

export const DORDOGNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'dordogne',
  hero: {
    eyebrow: 'Propriétaires en Dordogne',
    title: 'Classement de gîtes et meublés de tourisme en Dordogne',
    highlightedTitleText: 'en Dordogne',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'dordogneLaRoqueGageac',
      alt: 'Les maisons de pierre de La Roque-Gageac au bord de la Dordogne',
      sizes: dordogneHeroImageSizes,
      className: 'h-full w-full object-cover object-[38%_center] max-[680px]:object-[center_48%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> La Roque-Gageac, Dordogne
        </>
      ),
      note: {
        lead: 'Du studio au grand gîte,',
        title: 'un classement de 1 à 5 étoiles.',
        caption: 'Un repère de qualité pour vos voyageurs.',
      },
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.dordogne,
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'primary',
      label: (
        <>
          Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
        </>
      ),
    },
    secondaryAction: {
      href: '#department-pricing-locality',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: heroReassurance,
  },
  proofItems: [
    {
      icon: ShieldCheck,
      title: 'Organisme accrédité',
      link: {
        href: COFRAC_ACCREDITATION_URL,
        label: 'Cofrac Inspection n° 3-2394',
      },
    },
    {
      value: '5',
      title: 'ans de validité',
      description: 'Une fois le classement acquis',
    },
    {
      icon: MapPin,
      title: 'Une équipe qui connaît votre secteur',
      description: 'À votre écoute, réactive à chaque étape.',
    },
  ],
  serviceArea: {
    title: 'Dans quelles communes de Dordogne intervenons-nous ?',
    intro:
      'Etoilys intervient en Dordogne sur une large zone couvrant notamment le Bergeracois, le Périgord Noir, la vallée de la Dordogne, la vallée de la Vézère, le Grand Périgueux, la vallée de l’Isle, le Ribéracois et une partie du nord-ouest du département.',
    sectors: DORDOGNE_V6_SERVICE_SECTORS,
    communeLinks: {
      Bergerac: {
        label: 'Bergerac →',
        href: '/classement-meuble-tourisme-bergerac',
      },
    },
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Dordogne ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé en Dordogne ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Périgueux, Ribérac, Monbazillac',
      communeIndexUrl: '/data/communes-dordogne-index.v1.json',
      defaultPricingProfileId: 'dordogne-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement ?',
    image: {
      assetKey: 'dordogneLandscape',
      alt: 'Architecture de pierre et végétation dans un village du Périgord',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_55%] max-[680px]:object-[center_40%]',
      caption: 'Les pierres du Périgord.',
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Dordogne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: dordogneQuestions,
  },
  finalCta: {
    eyebrow: 'À VOUS DE JOUER',
    title: 'Demandez le classement de votre meublé en Dordogne',
    description: (
      <>
        Parlez-nous de votre projet. Rappel sous 24 h ouvrées,
        <br />
        visite en moyenne sous deux semaines.
      </>
    ),
    primaryAction: {
      href: '/demande-classement',
      variant: 'primary',
      className: 'editorial-inverse-button',
      label: (
        <>
          Demander mon classement <ArrowRight size={20} aria-hidden="true" />
        </>
      ),
    },
    hint: 'Tarif confirmé avant tout engagement.',
  },
};

export const BERGERAC_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6CityConfig = {
  layoutVersion: 'v6',
  scope: 'city',
  localEntryId: 'bergerac',
  city: 'Bergerac',
  hero: {
    eyebrow: 'Bergerac et le Bergeracois',
    title: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    highlightedTitleText: 'à Bergerac et dans le Bergeracois',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'bergeracHero',
      alt: 'Vue sur la Dordogne et le quai Cyrano à Bergerac en fin d’après-midi',
      sizes: bergeracHeroImageSizes,
      className:
        'h-full w-full object-cover object-[76%_center] max-[899px]:object-[78%_center] max-[680px]:object-[76%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Quai Cyrano, Bergerac
        </>
      ),
      note: {
        lead: 'Du studio au grand gîte,',
        title: 'un classement de 1 à 5 étoiles.',
        caption: 'Un repère de qualité pour vos voyageurs.',
      },
      credit: {
        sourceLabel: 'Benjamin Smith / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'white',
      className: 'editorial-dark-button',
      label: (
        <>
          Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
        </>
      ),
    },
    secondaryAction: {
      href: '#tarifs',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: ['Demande en 30 secondes', ...heroReassurance.slice(1)],
  },
  proofItems: DORDOGNE_LOCAL_LANDING_PAGE_V6.proofItems,
  serviceArea: {
    title: 'Où intervenons-nous autour de Bergerac\u00a0?',
    intro:
      'Nos inspecteurs interviennent à Bergerac et dans le Bergeracois, sans frais de déplacement, notamment à :',
    communes: BERGERAC_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir l’ensemble de nos interventions en Dordogne',
      href: '/classement-meuble-tourisme-dordogne',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bergerac ?',
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'dordogne-standard',
  },
  procedure: {
    ...commonProcedure,
    link: {
      ...commonProcedure.link,
      variant: 'secondary',
      className: 'editorial-link ui-focus',
    },
  },
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
    image: {
      assetKey: 'bergeracSaintJacquesCyrano',
      alt: 'Église Saint-Jacques et statue de Cyrano de Bergerac',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_42%]',
      caption: 'Église Saint-Jacques, Bergerac. ',
      credit: {
        sourceLabel: 'JGS25 / Wikimedia Commons',
        sourceHref:
          'https://commons.wikimedia.org/wiki/File:Bergerac,_l%27%C3%A9glise_Saint-Jacques_et_Cyrano.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  localModule: {
    type: 'tax-comparison',
    title: 'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
    highlightedTitleText: 'taxe de séjour',
    paragraphs: [
      'Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Dans ce contexte local, l’écart de taxe de séjour entre un meublé non classé et un meublé classé donne un exemple concret de l’intérêt du classement.',
      'À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne.',
      'Sur une réservation à 150 € la nuit hors taxe de séjour pour quatre adultes, un meublé classé 2 étoiles permet par exemple de réduire la taxe de séjour de 3,48 € par nuit.',
    ],
    exampleLabel: 'Exemple à Bergerac',
    exampleTitle: 'Taxe de séjour pour 4 adultes',
    exampleSubtitle: 'Logement à 150 € la nuit',
    comparison: [
      { key: 'unclassified', label: 'Meublé non classé', value: '6,60 € par nuit' },
      { key: 'classified', label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
    ],
    savingsHeadline: '3,48 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de la Communauté d’agglomération Bergeracoise.',
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Bergerac',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: BERGERAC_FAQ,
  },
  finalCta: {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6.finalCta,
    primaryAction: {
      ...DORDOGNE_LOCAL_LANDING_PAGE_V6.finalCta.primaryAction,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};

export const GIRONDE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'gironde',
  hero: {
    eyebrow: 'Propriétaires en Gironde',
    title: 'Classement de gîtes et meublés de tourisme en Gironde',
    highlightedTitleText: 'en Gironde',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'girondeHero',
      alt: 'Vue de Saint-Émilion en Gironde',
      sizes: girondeHeroImageSizes,
      className: 'h-full w-full object-cover object-center',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Saint-Émilion, Gironde
        </>
      ),
      note: DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image.note,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.gironde,
      credit: {
        sourceLabel: 'Axel Delansorne / Unsplash',
        sourceHref: 'https://unsplash.com/photos/fSpupJ0C95E',
        licenseLabel: 'Unsplash License',
        licenseHref: 'https://unsplash.com/license',
      },
    },
    primaryAction: localV6HeroPrimaryAction,
    secondaryAction: {
      href: '#department-pricing-locality',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: heroReassurance,
  },
  proofItems: DORDOGNE_LOCAL_LANDING_PAGE_V6.proofItems,
  serviceArea: {
    title: 'Dans quelles communes de Gironde intervenons-nous ?',
    intro:
      'Etoilys intervient en Gironde sur une zone concentrée autour du Libournais, de la Haute-Gironde, de Bordeaux Métropole, de l’Entre-deux-Mers, de Montesquieu, de la vallée de la Garonne et du nord du Sud-Gironde.',
    sectors: toCollapsedSectors(GIRONDE_SERVICE_SECTORS),
    communeLinks: {
      Bordeaux: {
        label: 'Bordeaux →',
        href: '/classement-meuble-tourisme-bordeaux',
      },
    },
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Gironde ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé en Gironde ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Bordeaux, Libourne, Saint-Émilion',
      communeIndexUrl: '/data/communes-gironde-index.v1.json',
      defaultPricingProfileId: 'gironde-standard',
      overrides: {
        '33063': 'bordeaux-standard',
      },
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement en Gironde ?',
    image: {
      assetKey: 'girondeTerritory',
      alt: 'Front de mer et promenade à Arcachon',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Front de mer d’Arcachon.',
      credit: {
        sourceLabel: 'Árpád Czapp / Unsplash',
        sourceHref: 'https://unsplash.com/photos/J181eozqAd8',
        licenseLabel: 'Unsplash License',
        licenseHref: 'https://unsplash.com/license',
      },
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Gironde',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems(
      {
        question: 'Intervenez-vous dans ma commune en Gironde ?',
        answer: (
          <>
            Etoilys intervient en Gironde sur une zone concentrée autour du Libournais, de la
            Haute-Gironde, de Bordeaux Métropole, de l’Entre-deux-Mers, de Montesquieu, de la vallée
            de la Garonne et du nord du Sud-Gironde. Consultez les{' '}
            <a href="#communes">communes de nos secteurs</a> ou indiquez l’adresse de votre logement
            dans votre demande pour confirmer notre intervention.
          </>
        ),
      },
      [
        {
          question: 'Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?',
          answer:
            'Les demandes situées sur le Bassin d’Arcachon, le littoral médocain ou les secteurs plus éloignés sont étudiées selon la localisation du logement et l’organisation des tournées. Indiquez la commune dans votre demande pour recevoir une réponse claire avant toute validation.',
        },
      ]
    ),
  },
  finalCta: {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6.finalCta,
    title: 'Demandez le classement de votre meublé en Gironde',
    primaryAction: localV6FinalPrimaryAction,
  },
};

export const BORDEAUX_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6CityConfig = {
  layoutVersion: 'v6',
  scope: 'city',
  localEntryId: 'bordeaux',
  city: 'Bordeaux',
  hero: {
    eyebrow: 'Bordeaux et Bordeaux Métropole',
    title: 'Classement de meublé de tourisme à Bordeaux et dans la métropole',
    highlightedTitleText: 'à Bordeaux et dans la métropole',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bordeaux ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'bordeauxHero',
      alt: 'Place de la Bourse et miroir d’eau à Bordeaux',
      sizes: bordeauxHeroImageSizes,
      className: 'h-full w-full object-cover object-[center_55%] max-[899px]:object-[center_45%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Place de la Bourse, Bordeaux
        </>
      ),
      note: DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image.note,
      credit: {
        sourceLabel: 'Miguel Cuenca / Pexels',
        sourceHref: 'https://www.pexels.com/photo/place-de-la-bourse-in-bordeaux-france-17356595/',
        licenseLabel: 'Pexels License',
        licenseHref: 'https://www.pexels.com/license/',
      },
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'white',
      className: 'editorial-dark-button',
      label: (
        <>
          Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
        </>
      ),
    },
    secondaryAction: {
      href: '#tarifs',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: ['Demande en 30 secondes', ...heroReassurance.slice(1)],
  },
  proofItems: GIRONDE_LOCAL_LANDING_PAGE_V6.proofItems,
  serviceArea: {
    title: 'Où intervenons-nous autour de Bordeaux ?',
    intro:
      'Nos inspecteurs interviennent à Bordeaux et dans Bordeaux Métropole, sans frais de déplacement, notamment à :',
    communes: BORDEAUX_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      href: '/classement-meuble-tourisme-gironde',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bordeaux ?',
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'bordeaux-standard',
  },
  procedure: {
    ...commonProcedure,
    link: {
      ...commonProcedure.link,
      variant: 'secondary',
      className: 'editorial-link ui-focus',
    },
  },
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement à Bordeaux ?',
    image: {
      assetKey: 'bordeauxExpertise',
      alt: 'Tramway devant la place de la Bourse à Bordeaux',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_46%]',
      caption: 'Tramway devant la place de la Bourse, Bordeaux.',
      credit: {
        sourceLabel: 'Charl Durand / Pexels',
        sourceHref: 'https://www.pexels.com/photo/place-de-la-bourse-6506986/',
        licenseLabel: 'Pexels License',
        licenseHref: 'https://www.pexels.com/license/',
      },
    },
  },
  localModule: BORDEAUX_TAX_MODULE,
  localNotice: BORDEAUX_LOCAL_NOTICE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Bordeaux',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: BORDEAUX_FAQ,
  },
  finalCta: {
    ...GIRONDE_LOCAL_LANDING_PAGE_V6.finalCta,
    title: 'Demandez le classement de votre meublé à Bordeaux',
    primaryAction: {
      ...GIRONDE_LOCAL_LANDING_PAGE_V6.finalCta.primaryAction,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};

export const LOT_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'lot',
  hero: {
    eyebrow: 'Propriétaires dans le Lot',
    title: 'Classement de gîtes et meublés de tourisme dans le Lot',
    highlightedTitleText: 'dans le Lot',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'lotHero',
      alt: 'Vue sur la vallée du Lot depuis Saint-Cirq-Lapopie',
      sizes: lotHeroImageSizes,
      className:
        'h-full w-full object-cover object-[55%_center] max-[899px]:object-[57%_center] max-[680px]:object-[59%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Saint-Cirq-Lapopie, Lot
        </>
      ),
      note: DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image.note,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.lot,
    },
    primaryAction: localV6HeroPrimaryAction,
    secondaryAction: {
      href: '#department-pricing-locality',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: heroReassurance,
  },
  proofItems: DORDOGNE_LOCAL_LANDING_PAGE_V6.proofItems,
  serviceArea: {
    title: 'Dans quelles communes du Lot intervenons-nous ?',
    intro:
      'Nos inspecteurs interviennent dans tout le Lot. Les communes ci-dessous sont regroupées par grands secteurs pour vous donner des repères ; votre commune reste couverte même si elle n’apparaît pas dans cette sélection.',
    sectors: toCollapsedSectors(LOT_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé dans le Lot ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé dans le Lot ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Cahors, Rocamadour, Figeac',
      communeIndexUrl: '/data/communes-lot-index.v1.json',
      defaultPricingProfileId: 'lot-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement dans le Lot ?',
    image: {
      assetKey: 'lotRocamadour',
      alt: 'Cité religieuse de Rocamadour dans le Lot',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_42%]',
      caption: 'Rocamadour, Lot.',
      credit: {
        sourceLabel: 'Franck-fnba / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Rocamadour_2025-114909.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans le Lot',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans ma commune dans le Lot ?',
      answer: (
        <>
          Oui. Etoilys intervient dans l’ensemble du département du Lot. Les secteurs présentés sur
          cette page donnent des repères autour de Cahors, Rocamadour, Figeac, Saint-Cirq-Lapopie,
          Gourdon et du Quercy Blanc, avec des communes représentatives. Consultez les{' '}
          <a href="#communes">communes de nos secteurs</a> ou indiquez l’adresse de votre logement
          dans votre demande pour confirmer l’organisation de la visite.
        </>
      ),
    }),
  },
  finalCta: {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6.finalCta,
    title: 'Demandez le classement de votre meublé dans le Lot',
    primaryAction: localV6FinalPrimaryAction,
  },
};

export const LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'lot-et-garonne',
  hero: {
    eyebrow: 'Propriétaires en Lot-et-Garonne',
    title: 'Classement de gîtes et meublés de tourisme dans le Lot-et-Garonne',
    highlightedTitleText: 'dans le Lot-et-Garonne',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'lotEtGaronneHero',
      alt: 'Nérac et son pont sur la Baïse',
      sizes: lotEtGaronneHeroImageSizes,
      className: 'h-full w-full object-cover object-center',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Nérac, Lot-et-Garonne
        </>
      ),
      note: DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image.note,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES['lot-et-garonne'],
      credit: {
        sourceLabel: 'Adobe Stock',
        sourceHref: 'https://stock.adobe.com/',
        licenseLabel: 'Adobe Stock License',
        licenseHref: 'https://stock.adobe.com/license-terms',
      },
    },
    primaryAction: localV6HeroPrimaryAction,
    secondaryAction: {
      href: '#department-pricing-locality',
      variant: 'secondary',
      className: 'editorial-link ui-focus local-v6-hero-price',
      label: (
        <>
          Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
        </>
      ),
    },
    reassuranceItems: heroReassurance,
  },
  proofItems: DORDOGNE_LOCAL_LANDING_PAGE_V6.proofItems,
  serviceArea: {
    title: 'Dans quelles communes du Lot-et-Garonne intervenons-nous ?',
    intro:
      'Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais, la vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le Fumélois, les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le secteur de Casteljaloux.',
    sectors: toCollapsedSectors(LOT_ET_GARONNE_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Agen, Marmande, Villeneuve-sur-Lot',
      communeIndexUrl: '/data/communes-lot-et-garonne-index.v1.json',
      defaultPricingProfileId: 'lot-et-garonne-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement dans le Lot-et-Garonne ?',
    image: {
      assetKey: 'lotEtGaronneTerritory',
      alt: 'Tour horloge et maisons de pierre à Monflanquin',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Monflanquin, Lot-et-Garonne.',
      credit: {
        sourceLabel: 'D Goth / Pexels',
        sourceHref: 'https://www.pexels.com/photo/37724280/',
        licenseLabel: 'Pexels License',
        licenseHref: 'https://www.pexels.com/license/',
      },
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans le Lot-et-Garonne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans ma commune dans le Lot-et-Garonne ?',
      answer: (
        <>
          Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais, la
          vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le Fumélois,
          les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le secteur de
          Casteljaloux. Consultez les <a href="#communes">communes de nos secteurs</a> ou indiquez
          l’adresse de votre logement dans votre demande pour confirmer notre intervention.
        </>
      ),
    }),
  },
  finalCta: {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6.finalCta,
    title: 'Demandez le classement de votre meublé dans le Lot-et-Garonne',
    primaryAction: localV6FinalPrimaryAction,
  },
};
