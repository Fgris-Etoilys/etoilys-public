import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  MEDOC_ATLANTIQUE_FAQ,
  MEDOC_ATLANTIQUE_SERVICE_COMMUNES,
  MEDOC_ATLANTIQUE_TAX_MODULE,
} from './medocAtlantique';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const medocAtlantiqueHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-lacanau-medoc-atlantique'
);

const medocAtlantiquePricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif dépend de la typologie de votre logement, pas du nombre d’étoiles demandées.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const MEDOC_ATLANTIQUE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'medoc-atlantique',
  destination: 'Lacanau et Médoc Atlantique',
  hero: {
    eyebrow: 'Lacanau · Médoc Atlantique',
    title: 'Classement de meublé de tourisme à Lacanau et dans le Médoc Atlantique',
    highlightedTitleText: 'à Lacanau et dans le Médoc Atlantique',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Lacanau ou sur le littoral médocain ? Etoilys réalise la visite officielle directement dans votre logement, de Lacanau au Verdon-sur-Mer, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'medocAtlantiqueHero',
      alt: 'Étang de Lacanau dans le Médoc Atlantique',
      sizes: medocAtlantiqueHeroImageSizes,
      className:
        'h-full w-full object-cover object-[center_50%] max-[899px]:object-[center_48%] max-[680px]:object-[center_45%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Étang de Lacanau
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      credit: {
        sourceLabel: 'Paternel 1 / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:%C3%89tang_de_Lacanau_1.JPG',
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
    reassuranceItems: heroReassurance,
  },
  proofItems: LOCAL_V6_PROOF_ITEMS,
  serviceArea: {
    title: 'Où intervenons-nous dans le Médoc Atlantique ?',
    intro:
      'Nos inspecteurs interviennent dans les 14 communes de la Communauté de communes Médoc Atlantique, de Lacanau au Verdon-sur-Mer, sans frais de déplacement.',
    communes: MEDOC_ATLANTIQUE_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      localEntryId: 'gironde',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Lacanau et dans le Médoc Atlantique ?',
    localityHeading: 'Votre meublé à Lacanau et dans le Médoc Atlantique',
    checklist: medocAtlantiquePricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'gironde-standard',
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Lacanau et dans le Médoc Atlantique ?',
    image: {
      assetKey: 'medocAtlantiqueExpertise',
      alt: 'Océan Atlantique vu depuis la dune à Carcans-Plage',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_48%] max-[899px]:object-[center_45%]',
      caption: 'Océan Atlantique depuis la dune à Carcans-Plage.',
      credit: {
        sourceLabel: 'Michel VENOT / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Carcans_plage.jpg',
        licenseLabel: 'CC BY-SA 3.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
      },
    },
  },
  localModule: MEDOC_ATLANTIQUE_TAX_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Lacanau et dans le Médoc Atlantique',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: MEDOC_ATLANTIQUE_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Lacanau et dans le Médoc Atlantique',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
