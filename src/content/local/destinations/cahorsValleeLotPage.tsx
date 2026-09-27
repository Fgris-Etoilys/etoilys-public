import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  CAHORS_VALLEE_LOT_FAQ,
  CAHORS_VALLEE_LOT_SERVICE_COMMUNES,
  CAHORS_VALLEE_LOT_TAX_MODULE,
} from './cahorsValleeLot';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const cahorsValleeLotHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-cahors');

const cahorsValleeLotPricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif applicable est celui du Lot, confirmé avant tout engagement.',
  'Un tarif clair quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const CAHORS_VALLEE_LOT_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'cahors-vallee-lot',
  destination: 'Cahors et la Vallée du Lot',
  hero: {
    eyebrow: 'Cahors · Vallée du Lot',
    title: 'Classement de meublé de tourisme à Cahors et dans la Vallée du Lot',
    highlightedTitleText: 'à Cahors et dans la Vallée du Lot',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Cahors ou dans la Vallée du Lot ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'cahorsValleeLotHero',
      alt: 'Vue panoramique de Cahors depuis le Mont Saint-Cyr',
      sizes: cahorsValleeLotHeroImageSizes,
      className:
        'h-full w-full object-cover object-[center_48%] max-[899px]:object-[center_50%] max-[680px]:object-[center_52%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Cahors depuis le Mont Saint-Cyr
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      credit: {
        sourceLabel: 'Velvet / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Cahors_vue_pano.jpg',
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
    title: 'Où intervenons-nous à Cahors et dans la Vallée du Lot ?',
    intro:
      'Nos inspecteurs interviennent à Cahors et dans la Vallée du Lot, du Vignoble de Cahors au Quercy Blanc, sans frais de déplacement, notamment à :',
    communes: CAHORS_VALLEE_LOT_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention dans le Lot',
      localEntryId: 'lot',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Cahors et dans la Vallée du Lot ?',
    localityHeading: 'Votre meublé à Cahors et dans la Vallée du Lot',
    checklist: cahorsValleeLotPricingChecklist,
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Cahors et dans la Vallée du Lot ?',
    image: {
      assetKey: 'cahorsValleeLotDouelle',
      alt: 'Rivière Lot à Douelle près de Cahors',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_50%] max-[899px]:object-[center_46%]',
      caption: 'Rivière Lot à Douelle, près de Cahors.',
      credit: {
        sourceLabel: 'Arbref / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Rivi%C3%A8re_Lot_%C3%A0_Douelle.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  localModule: CAHORS_VALLEE_LOT_TAX_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Cahors et dans la Vallée du Lot',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: CAHORS_VALLEE_LOT_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Cahors et dans la Vallée du Lot',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
