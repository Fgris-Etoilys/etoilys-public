import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  FIGEAC_GRAND_FIGEAC_FAQ,
  FIGEAC_GRAND_FIGEAC_SERVICE_COMMUNES,
  FIGEAC_GRAND_FIGEAC_TAX_MODULE,
} from './figeacGrandFigeac';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const figeacGrandFigeacHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-figeac'
);

const figeacGrandFigeacPricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif applicable est celui du Lot, confirmé avant tout engagement.',
  'Un tarif clair quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const FIGEAC_GRAND_FIGEAC_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'figeac-grand-figeac',
  destination: 'Figeac et le Grand-Figeac',
  hero: {
    eyebrow: 'Figeac · Grand-Figeac lotois',
    title: 'Classement de meublé de tourisme à Figeac et dans le Grand-Figeac',
    highlightedTitleText: 'à Figeac et dans le Grand-Figeac',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Figeac, dans les vallées du Lot et du Célé ou dans la partie lotoise du Grand-Figeac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'figeacGrandFigeacHero',
      alt: 'Place des Écritures à Figeac dans le Lot',
      sizes: figeacGrandFigeacHeroImageSizes,
      className:
        'h-full w-full object-cover object-[center_50%] max-[899px]:object-[center_50%] max-[680px]:object-[center_52%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Place des Écritures, Figeac
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
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
    title: 'Où intervenons-nous dans le bassin de Figeac ?',
    intro:
      'Dans le Lot, nous intervenons autour de Figeac et dans le bassin lotois du Grand-Figeac, notamment dans les vallées du Lot et du Célé. Nous couvrons notamment les communes suivantes :',
    communes: FIGEAC_GRAND_FIGEAC_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention dans le Lot',
      localEntryId: 'lot',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Figeac et dans le Grand-Figeac ?',
    localityHeading: 'Votre meublé à Figeac et dans le Grand-Figeac',
    checklist: figeacGrandFigeacPricingChecklist,
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Figeac et dans le Grand-Figeac ?',
    image: {
      assetKey: 'figeacGrandFigeacCajarc',
      alt: 'Rivière Lot à Cajarc dans le bassin de Figeac',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_50%] max-[899px]:object-[center_48%]',
      caption: 'Le Lot à Cajarc, dans le bassin de Figeac.',
      credit: {
        sourceLabel: 'Krzysztof Golik / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Lot_River_in_Cajarc_01.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  localModule: FIGEAC_GRAND_FIGEAC_TAX_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Figeac et dans le Grand-Figeac',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: FIGEAC_GRAND_FIGEAC_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Figeac et dans le Grand-Figeac',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
