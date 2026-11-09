import { ArrowDown, MapPin } from 'lucide-react';
import { IMAGE_ALT_TEXT } from '../../imageAltText';
import type { LocalLandingPageV6CityConfig } from '../types';
import {
  CARCASSONNE_FAQ,
  CARCASSONNE_SERVICE_COMMUNES,
  CARCASSONNE_TAX_MODULE,
  CARCASSONNE_TERRITORIAL_MODULE,
} from './carcassonne';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_HERO_PRIMARY_ACTION,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const carcassonneHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-carcassonne');

const carcassonnePricingChecklist = [
  'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
  'Un tarif dégressif peut être proposé pour plusieurs meublés, sur demande.',
  'Le tarif est confirmé avant tout engagement, quelle que soit la catégorie d’étoiles visée.',
] as const;

export const CARCASSONNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6CityConfig = {
  layoutVersion: 'v6',
  scope: 'city',
  localEntryId: 'carcassonne',
  city: 'Carcassonne',
  hero: {
    eyebrow: 'Carcassonne et le Carcassonnais',
    title: 'Classement de gîtes et meublés de tourisme à Carcassonne et dans le Carcassonnais',
    highlightedTitleText: 'à Carcassonne et dans le Carcassonnais',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Carcassonne ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'carcassonneHero',
      alt: IMAGE_ALT_TEXT.carcassonneHero.fr,
      sizes: carcassonneHeroImageSizes,
      className: 'h-full w-full object-cover object-[70%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Cité de Carcassonne et Pont-Vieux
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
    },
    primaryAction: LOCAL_V6_HERO_PRIMARY_ACTION,
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
    title: 'Où intervenons-nous autour de Carcassonne ?',
    intro:
      'Nos inspecteurs interviennent à Carcassonne et dans le Carcassonnais, sans frais de déplacement, notamment à :',
    communes: CARCASSONNE_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention dans l’Aude',
      localEntryId: 'aude',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Carcassonne ?',
    localityHeading: 'Votre meublé à Carcassonne et dans le Carcassonnais',
    checklist: carcassonnePricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'aude-standard',
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Carcassonne ?',
    image: {
      assetKey: 'carcassonneExpertise',
      alt: 'Promeneurs sur le Pont-Vieux devant la Cité médiévale de Carcassonne',
      // Sur desktop, l’image remplit un cadre de 470 px de haut : 752 px de large au ratio 1,6.
      sizes: '(min-width: 900px) 752px, 100vw',
      className: 'h-full w-full object-cover object-right',
      caption: 'Pont-Vieux et Cité médiévale de Carcassonne',
      credit: {
        sourceLabel: 'Sue Winston / Unsplash',
        sourceHref:
          'https://unsplash.com/fr/photos/les-gens-marchent-sur-un-pont-de-pierre-pres-dun-chateau-m5QeiDz8sS0',
        licenseLabel: 'Licence Unsplash',
        licenseHref: 'https://unsplash.com/fr/licence',
      },
    },
  },
  localModule: CARCASSONNE_TAX_MODULE,
  territorialModule: CARCASSONNE_TERRITORIAL_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Carcassonne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: CARCASSONNE_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Carcassonne',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
