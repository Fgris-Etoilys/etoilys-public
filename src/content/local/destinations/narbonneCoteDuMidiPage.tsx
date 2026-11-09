import { ArrowDown, MapPin } from 'lucide-react';
import { IMAGE_ALT_TEXT } from '../../imageAltText';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  NARBONNE_COTE_DU_MIDI_FAQ,
  NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES,
  NARBONNE_COTE_DU_MIDI_TAX_MODULE,
  NARBONNE_COTE_DU_MIDI_TERRITORIAL_MODULE,
} from './narbonneCoteDuMidi';
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

const narbonneCoteDuMidiHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-narbonne'
);

const narbonneCoteDuMidiPricingChecklist = [
  'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
  'Un tarif dégressif peut être proposé pour plusieurs meublés, sur demande.',
  'Le tarif est confirmé avant tout engagement, quelle que soit la catégorie d’étoiles visée.',
] as const;

export const NARBONNE_COTE_DU_MIDI_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'narbonne-cote-du-midi',
  destination: 'Narbonne et la Côte du Midi',
  hero: {
    eyebrow: 'Narbonne · Côte du Midi',
    title: 'Classement de gîtes et meublés de tourisme à Narbonne et sur la Côte du Midi',
    highlightedTitleText: 'à Narbonne et sur la Côte du Midi',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Narbonne ou sur la Côte du Midi ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple, des tarifs clairs et un classement de 1 à 5 étoiles.',
    image: {
      assetKey: 'narbonneCoteDuMidiHero',
      alt: IMAGE_ALT_TEXT.narbonneCoteDuMidiHero.fr,
      sizes: narbonneCoteDuMidiHeroImageSizes,
      className: 'h-full w-full object-cover object-[85%_30%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Canal de la Robine, Narbonne
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
    reassuranceItems: heroReassurance,
  },
  proofItems: LOCAL_V6_PROOF_ITEMS,
  serviceArea: {
    title: 'Où intervenons-nous à Narbonne et sur la Côte du Midi ?',
    intro:
      'Etoilys intervient à Narbonne, sur le littoral et dans les communes environnantes de la Côte du Midi. Du centre historique de Narbonne aux plages méditerranéennes, en passant par les étangs et les villages de la Narbonnaise, nos inspecteurs se déplacent directement dans votre logement, sans frais de déplacement supplémentaires.',
    communes: NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention dans l’Aude',
      localEntryId: 'aude',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Narbonne et sur la Côte du Midi ?',
    localityHeading: 'Votre meublé à Narbonne et sur la Côte du Midi',
    checklist: narbonneCoteDuMidiPricingChecklist,
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Narbonne et sur la Côte du Midi ?',
    image: {
      assetKey: 'narbonneCoteDuMidiPeyriac',
      alt: 'Ponton de bois traversant un étang devant le village de Peyriac-de-Mer',
      // Sur desktop, l’image remplit un cadre de 470 px de haut : 752 px de large au ratio 1,6.
      sizes: '(min-width: 900px) 752px, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Ponton de bois sur l’étang, Peyriac-de-Mer',
      credit: {
        sourceLabel: 'Christian Ferrer / Wikimedia Commons',
        sourceHref:
          'https://commons.wikimedia.org/wiki/File:Peyriac-de-Mer,_february_2018_(05).jpg',
        licenseLabel: 'CC BY 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by/4.0/',
      },
    },
  },
  localModule: NARBONNE_COTE_DU_MIDI_TAX_MODULE,
  territorialModule: NARBONNE_COTE_DU_MIDI_TERRITORIAL_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Narbonne et sur la Côte du Midi',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: NARBONNE_COTE_DU_MIDI_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Narbonne et sur la Côte du Midi',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
