import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  VALLEE_DORDOGNE_FAQ,
  VALLEE_DORDOGNE_SERVICE_COMMUNES,
  VALLEE_DORDOGNE_TAX_MODULE,
} from './valleeDordogne';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const valleeDordogneHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-vallee-dordogne'
);

const valleeDordognePricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif applicable est celui du Lot, confirmé avant tout engagement.',
  'Un tarif clair quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const VALLEE_DORDOGNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'vallee-dordogne',
  destination: 'Vallée de la Dordogne',
  hero: {
    eyebrow: 'Vallée de la Dordogne',
    title: 'Classement de meublé de tourisme dans la Vallée de la Dordogne',
    highlightedTitleText: 'dans la Vallée de la Dordogne',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement dans la Vallée de la Dordogne ? Etoilys réalise la visite officielle directement dans votre logement, autour de Rocamadour, Souillac, Gramat, Martel et Saint-Céré, avec une démarche simple et le tarif applicable dans le Lot.',
    image: {
      assetKey: 'valleeDordogneHero',
      alt: 'Dordogne entre Lacave et Pinsac dans le Lot',
      sizes: valleeDordogneHeroImageSizes,
      className:
        'h-full w-full object-cover object-[center_48%] max-[899px]:object-[center_50%] max-[680px]:object-[center_52%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Dordogne entre Lacave et Pinsac
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      credit: {
        sourceLabel: 'Krzysztof Golik / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Dordogne_River_01.jpg',
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
    title: 'Où intervenons-nous dans la Vallée de la Dordogne ?',
    intro:
      'Dans le Lot, nous intervenons dans toute la Vallée de la Dordogne, notamment autour de Rocamadour, Souillac, Gramat, Martel et Saint-Céré, ainsi qu’à Padirac, Carennac, Autoire, Loubressac et dans les communes voisines.',
    communes: VALLEE_DORDOGNE_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention dans le Lot',
      localEntryId: 'lot',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé dans la Vallée de la Dordogne ?',
    localityHeading: 'Votre meublé dans la Vallée de la Dordogne',
    checklist: valleeDordognePricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'lot-standard',
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
    title: 'Pourquoi choisir Etoilys pour votre classement dans la Vallée de la Dordogne ?',
    image: {
      assetKey: 'valleeDordogneBelcastel',
      alt: 'Château de Belcastel à Lacave dans la Vallée de la Dordogne',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_48%] max-[899px]:object-[center_46%]',
      caption: 'Belcastel, Lacave, Vallée de la Dordogne.',
      credit: {
        sourceLabel: 'Sonja Van Acolyen / Unsplash',
        sourceHref:
          'https://unsplash.com/fr/photos/un-chateau-perche-au-sommet-dune-falaise-entouree-darbres-MQH_rzprHhI',
        licenseLabel: 'Licence Unsplash',
        licenseHref: 'https://unsplash.com/fr/licence',
      },
    },
  },
  localModule: VALLEE_DORDOGNE_TAX_MODULE,
  localNotice: {
    title: 'Une destination touristique, une page rattachée au Lot',
    paragraphs: [
      'La Vallée de la Dordogne s’étend au-delà des limites du Lot. Cette page présente plus particulièrement notre intervention dans sa partie lotoise. Etoilys intervient également dans les autres secteurs de la Vallée de la Dordogne.',
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans la Vallée de la Dordogne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: VALLEE_DORDOGNE_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé dans la Vallée de la Dordogne',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
