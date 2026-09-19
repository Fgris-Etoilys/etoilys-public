import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  BASSIN_ARCACHON_FAQ,
  BASSIN_ARCACHON_SERVICE_COMMUNES,
  BASSIN_ARCACHON_TAX_MODULE,
} from './bassinArcachon';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const bassinArcachonHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-bassin-arcachon'
);

const bassinArcachonPricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif dépend de la typologie de votre logement, pas du nombre d’étoiles demandées.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const BASSIN_ARCACHON_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'bassin-arcachon',
  destination: 'Bassin d’Arcachon',
  hero: {
    eyebrow: 'Bassin d’Arcachon',
    title: 'Classement de meublé de tourisme sur le Bassin d’Arcachon',
    highlightedTitleText: 'sur le Bassin d’Arcachon',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement sur le Bassin d’Arcachon ? Etoilys réalise la visite officielle directement dans votre logement, dans les 12 communes du Bassin, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'bassinArcachonHero',
      alt: 'Cabanes tchanquées sur l’île aux Oiseaux dans le Bassin d’Arcachon',
      sizes: bassinArcachonHeroImageSizes,
      className:
        'h-full w-full object-cover object-[center_52%] max-[899px]:object-[center_50%] max-[680px]:object-[center_48%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Cabanes tchanquées, île aux Oiseaux
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      credit: {
        sourceLabel: 'Grand Parc - Bordeaux, France / Wikimedia Commons',
        sourceHref:
          'https://commons.wikimedia.org/wiki/File:Bassin_d%27Arcachon_-_Cabanes_Tchanqu%C3%A9es_sur_l%27%C3%AFle_aux_oiseaux_-_Picture_Image_Photography_(14524551963).jpg',
        licenseLabel: 'CC BY 2.0',
        licenseHref: 'https://creativecommons.org/licenses/by/2.0/',
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
    title: 'Où intervenons-nous sur le Bassin d’Arcachon ?',
    intro:
      'Nos inspecteurs interviennent dans les 12 communes du Bassin d’Arcachon, sans frais de déplacement.',
    communes: BASSIN_ARCACHON_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention en Gironde',
      localEntryId: 'gironde',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé sur le Bassin d’Arcachon ?',
    localityHeading: 'Votre meublé sur le Bassin d’Arcachon',
    checklist: bassinArcachonPricingChecklist,
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
    title: 'Pourquoi choisir Etoilys pour votre classement sur le Bassin d’Arcachon ?',
    image: {
      assetKey: 'bassinArcachonDunePilat',
      alt: 'Entrée du bassin d’Arcachon depuis la dune du Pilat',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_48%] max-[899px]:object-[center_44%]',
      caption: 'Entrée du bassin d’Arcachon depuis la dune du Pilat.',
      credit: {
        sourceLabel: 'Franck-fnba / Wikimedia Commons',
        sourceHref:
          'https://commons.wikimedia.org/wiki/File:Entree_du_bassin_d_Arcachon_depuis_la_dune_du_Pilat_-_2016a.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  localModule: BASSIN_ARCACHON_TAX_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans le Bassin d’Arcachon',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: BASSIN_ARCACHON_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé sur le Bassin d’Arcachon',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
