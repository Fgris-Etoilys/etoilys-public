/* eslint-disable react-refresh/only-export-components */
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COFRAC_ACCREDITATION_URL } from '../accreditationLinks';
import { getSeoRouteConfig } from '../seoRoutes';
import type { DepartmentSector, LocalFaqItem, LocalProcedureStep, LocalV6Action } from './types';

export const LOCAL_CLASSIFICATION_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous envoyez votre demande',
    description:
      'Remplissez le formulaire en 30 secondes. Un inspecteur Etoilys vous recontacte sous 24h ouvrées.',
  },
  {
    number: 2,
    title: 'Nous organisons la visite',
    description:
      'Etoilys confirme le tarif et vous propose une date d’intervention dans votre secteur.',
  },
  {
    number: 3,
    title: 'Nous réalisons le classement',
    description:
      'La visite est effectuée sur place selon le référentiel officiel. Vous recevez ensuite les documents correspondant au classement obtenu.',
  },
];

export const LOCAL_CLASSIFICATION_PROCEDURE = {
  title: 'Votre classement en 3 étapes',
  intro: '',
  steps: LOCAL_CLASSIFICATION_PROCEDURE_STEPS,
};

export const LOCAL_V6_HERO_REASSURANCE = [
  'Rappel sous 24 h ouvrées',
  'Visite en moyenne sous deux semaines',
  'Aucun frais de déplacement',
] as const;

export const LOCAL_V6_PRICING_CHECKLIST = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Des tarifs dégressifs pour plusieurs meublés visités le même jour dans le même secteur.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const LOCAL_V6_PROCESS_STEPS: readonly LocalProcedureStep[] = [
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

export const LOCAL_V6_COMMON_PROCEDURE = {
  title: 'Votre classement en trois étapes',
  eyebrow: 'DE LA DEMANDE AUX ÉTOILES',
  steps: LOCAL_V6_PROCESS_STEPS,
  link: {
    href: '/procedure',
    label: 'La procédure en détail',
  },
  note: 'Nos inspecteurs vous accompagnent à chaque étape, de votre demande à la remise des documents de classement.',
} as const;

export const LOCAL_V6_HERO_NOTE = {
  lead: 'Du studio au grand gîte,',
  title: 'un classement de 1 à 5 étoiles.',
  caption: 'Un repère de qualité pour vos voyageurs.',
} as const;

export const LOCAL_V6_PROOF_ITEMS = [
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
] as const;

export const LOCAL_V6_HERO_PRIMARY_ACTION: LocalV6Action = {
  href: '/demande-classement',
  variant: 'white',
  className: 'editorial-dark-button',
  label: (
    <>
      Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
    </>
  ),
};

export const LOCAL_V6_FINAL_PRIMARY_ACTION: LocalV6Action = {
  href: '/demande-classement',
  variant: 'white',
  className: 'editorial-inverse-button',
  label: (
    <>
      Demander mon classement <ArrowRight size={20} aria-hidden="true" />
    </>
  ),
};

export const LOCAL_V6_FINAL_CTA_BASE = {
  eyebrow: 'À VOUS DE JOUER',
  description: (
    <>
      Parlez-nous de votre projet. Rappel sous 24 h ouvrées,
      <br />
      visite en moyenne sous deux semaines.
    </>
  ),
  hint: 'Tarif confirmé avant tout engagement.',
} as const;

export const COMMON_LOCAL_V6_FAQ_ITEMS = [
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
] as const satisfies readonly LocalFaqItem[];

export function getLocalHeroImageSizes(path: string) {
  return getSeoRouteConfig(path).lcpImageSizes ?? '100vw';
}

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

export const officialClassificationUrl =
  'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme';

export function toCollapsedSectors(sectors: readonly DepartmentSector[], visibleCount = 5) {
  return sectors.map((sector) => ({
    name: sector.name,
    visibleCommunes: (sector.communes ?? []).slice(0, visibleCount),
    collapsedCommunes: (sector.communes ?? []).slice(visibleCount),
  }));
}

export const heroReassurance = LOCAL_V6_HERO_REASSURANCE;
export const pricingChecklist = LOCAL_V6_PRICING_CHECKLIST;
export const commonProcedure = LOCAL_V6_COMMON_PROCEDURE;

export const dordogneQuestions = [
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

export function buildDepartmentFaqItems(
  coverageItem: LocalFaqItem,
  localItems: readonly LocalFaqItem[] = []
) {
  return [coverageItem, ...dordogneQuestions.slice(1), ...localItems] satisfies LocalFaqItem[];
}
