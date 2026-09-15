import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  LocalLandingPageV6CityConfig,
  LocalLandingPageV6DepartmentConfig,
  LocalProcedureStep,
} from './types';
import { COFRAC_ACCREDITATION_URL } from '../accreditationLinks';
import { BERGERAC_FAQ, BERGERAC_SERVICE_COMMUNES } from './cities/bergerac';
import { DORDOGNE_DEPARTMENT_PAGE, DORDOGNE_V5_SERVICE_SECTORS } from './departments/dordogne';
import { getSeoRouteConfig } from '../seoRoutes';

function getLocalHeroImageSizes(path: string) {
  return getSeoRouteConfig(path).lcpImageSizes ?? '100vw';
}

const dordogneHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-dordogne');
const bergeracHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-bergerac');
const officialClassificationUrl =
  'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme';

const heroReassurance = [
  'Rappel sous 24 h ouvrées',
  'Visite en moyenne sous deux semaines',
  'Aucun frais de déplacement',
] as const;

const pricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Des tarifs dégressifs pour plusieurs meublés visités le même jour dans le même secteur.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

const processSteps: readonly LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous nous parlez de votre logement.',
    description:
      'Envoyez vos coordonnées et l’adresse du meublé. Nous vous rappelons sous 24 h ouvrées pour préciser votre projet.',
  },
  {
    number: 2,
    title: 'Nous préparons la visite ensemble.',
    description:
      'Nous confirmons le tarif et les modalités, puis convenons d’une date. La visite a lieu en moyenne sous deux semaines.',
  },
  {
    number: 3,
    title: 'Votre logement est évalué sur place.',
    description:
      'Après le contrôle selon la grille officielle, vous recevez les documents et la proposition de classement.',
  },
];

const commonProcedure = {
  title: 'Votre classement en trois étapes',
  eyebrow: 'DE LA DEMANDE AUX ÉTOILES',
  steps: processSteps,
  link: {
    href: '/procedure',
    label: 'La procédure en détail',
  },
  note: 'Nos inspecteurs vous accompagnent à chaque étape, de votre demande à la remise des documents de classement.',
} as const;

const COMMON_LOCAL_V6_FAQ_ITEMS = [
  {
    question: 'Comment me préparer à une visite de classement ?',
    answer: (
      <>
        Quelques vérifications avant le rendez-vous permettent de préparer sereinement la visite :
        équipements, informations utiles et principaux critères de la grille.{' '}
        <Link to="/actualites/preparer-visite-classement-meuble-tourisme">
          Voir notre guide pour préparer la visite de classement
        </Link>
      </>
    ),
  },
  {
    question: 'Que faire une fois le classement obtenu ?',
    answer: (
      <>
        Une fois votre classement obtenu, quelques démarches restent à effectuer, notamment pour
        l’affichage, la déclaration, la taxe de séjour et vos annonces.{' '}
        <Link to="/actualites/que-faire-apres-classement-meuble-tourisme">
          Voir les démarches à effectuer après le classement
        </Link>
      </>
    ),
  },
] as const;

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
] as const;

const bergeracFaqItems = BERGERAC_FAQ.map((item) => ({
  question: item.question,
  answer:
    item.question === 'Comment savoir quelle catégorie viser ?' ? (
      <>
        Le <Link to="/simulateur">simulateur Etoilys</Link> permet d’obtenir une première estimation
        à partir des caractéristiques du logement. Il aide à situer la catégorie visée avant la
        visite officielle.
      </>
    ) : item.question === 'Quels sont les effets du classement sur la fiscalité ?' ? (
      <>
        Le classement peut ouvrir un cadre fiscal plus favorable pour les meublés de tourisme,
        notamment en micro-BIC. Vous pouvez estimer l’impact avec le{' '}
        <Link to="/simulateur-fiscal-classement">simulateur fiscal</Link>.
      </>
    ) : (
      item.answer
    ),
}));

export const DORDOGNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'dordogne',
  hero: {
    eyebrow: 'Propriétaires en Dordogne',
    title: 'Classement de gîtes et meublés de tourisme en Dordogne',
    highlightedTitleText: 'en Dordogne',
    description:
      'Faites classer votre gîte, maison ou appartement de 1 à 5 étoiles avec Etoilys, organisme accrédité Cofrac. Nous réalisons la visite officielle dans votre logement.',
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
      index: '24 / LE PÉRIGORD',
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
    intro: DORDOGNE_DEPARTMENT_PAGE.serviceArea.intro,
    sectors: DORDOGNE_V5_SERVICE_SECTORS,
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
    intro:
      'Indiquez la commune de votre logement pour consulter le tarif prévu. Nous confirmons ensuite les modalités et la possibilité d’intervenir à votre adresse.',
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: DORDOGNE_DEPARTMENT_PAGE.pricing!,
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
    items: [...dordogneQuestions, ...COMMON_LOCAL_V6_FAQ_ITEMS],
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
  city: 'Bergerac',
  hero: {
    eyebrow: 'Bergerac et le Bergeracois',
    title: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    highlightedTitleText: 'à Bergerac et dans le Bergeracois',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'bergeracHero',
      alt: 'Vue de la Dordogne et du centre-ville de Bergerac en fin d’après-midi',
      sizes: bergeracHeroImageSizes,
      className:
        'h-full w-full object-cover object-[76%_center] max-[899px]:object-[78%_center] max-[680px]:object-[76%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Bergerac et le Bergeracois
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
      className: '!border-ink !bg-ink !text-white hover:!bg-ink-hover hover:!text-white',
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
    title: 'Au plus proche de chez vous',
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
    items: [...bergeracFaqItems, ...COMMON_LOCAL_V6_FAQ_ITEMS],
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
