import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6CityConfig } from '../types';
import {
  BORDEAUX_FAQ,
  BORDEAUX_LOCAL_NOTICE,
  BORDEAUX_SERVICE_COMMUNES,
  BORDEAUX_TAX_MODULE,
} from './bordeaux';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const bordeauxHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-bordeaux');

const bordeauxPricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif dépend de la typologie de votre logement, pas du nombre d’étoiles demandé.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

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
      note: LOCAL_V6_HERO_NOTE,
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
  proofItems: LOCAL_V6_PROOF_ITEMS,
  serviceArea: {
    title: 'Où intervenons-nous autour de Bordeaux ?',
    intro:
      'Nos inspecteurs interviennent à Bordeaux et dans Bordeaux Métropole, sans frais de déplacement, notamment à :',
    communes: BORDEAUX_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      localEntryId: 'gironde',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bordeaux ?',
    checklist: bordeauxPricingChecklist,
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
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Bordeaux',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
