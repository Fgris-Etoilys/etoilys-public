import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { IMAGE_ALT_TEXT } from '../../imageAltText';
import type { LocalLandingPageV6DestinationConfig } from '../types';
import {
  SARLAT_PERIGORD_NOIR_FAQ,
  SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES,
  SARLAT_PERIGORD_NOIR_TAX_MODULE,
  SARLAT_PERIGORD_NOIR_TERRITORIAL_MODULE,
} from './sarlatPerigordNoir';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
} from '../sharedLocalContent';

const sarlatPerigordNoirHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-sarlat'
);

const sarlatPerigordNoirPricingChecklist = [
  'La visite et les documents de classement sont inclus, sans frais de déplacement supplémentaires.',
  'Les tarifs dégressifs dépendent du nombre de logements à classer.',
  'Le tarif applicable est confirmé avant tout engagement.',
] as const;

export const SARLAT_PERIGORD_NOIR_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DestinationConfig = {
  layoutVersion: 'v6',
  scope: 'destination',
  localEntryId: 'sarlat-perigord-noir',
  destination: 'Sarlat et le Périgord Noir',
  hero: {
    eyebrow: 'Sarlat · Périgord Noir',
    title: 'Classement de gîtes et meublés de tourisme à Sarlat et dans le Périgord Noir',
    highlightedTitleText: 'à Sarlat et dans le Périgord Noir',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Sarlat ou dans le Périgord Noir ? Etoilys réalise la visite officielle directement dans votre logement, avec une procédure simple, des tarifs clairs et un classement de 1 à 5 étoiles.',
    image: {
      assetKey: 'sarlatPerigordNoirHero',
      alt: IMAGE_ALT_TEXT.sarlatPerigordNoirHero.fr,
      sizes: sarlatPerigordNoirHeroImageSizes,
      className:
        'h-full w-full object-cover object-[38%_center] max-[899px]:object-[40%_center] max-[680px]:object-[center_50%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Château de Castelnaud-la-Chapelle
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
    title: 'Où intervenons-nous autour de Sarlat et dans le Périgord Noir ?',
    intro:
      'Etoilys intervient à Sarlat-la-Canéda et dans de nombreuses communes du Périgord Noir, notamment dans la vallée de la Dordogne et autour des principaux sites touristiques du secteur. Voici quelques communes couvertes par nos inspecteurs.',
    communes: SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir notre zone d’intervention en Dordogne',
      localEntryId: 'dordogne',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Sarlat et dans le Périgord Noir ?',
    intro:
      'La visite de classement d’un premier logement coûte 200 € TTC, ou 160 € TTC si vous êtes adhérent d’un office de tourisme partenaire d’Etoilys. Des tarifs dégressifs s’appliquent lorsque vous faites classer plusieurs meublés.',
    localityHeading: 'Votre meublé à Sarlat et dans le Périgord Noir',
    checklist: sarlatPerigordNoirPricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'sarlat-perigord-noir',
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Sarlat et dans le Périgord Noir ?',
    image: {
      assetKey: 'sarlatPlaceLiberte',
      alt: 'Place de la Liberté et bâtiments historiques du centre de Sarlat-la-Canéda',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[40%_center]',
      caption: 'Place de la Liberté, Sarlat-la-Canéda',
      credit: {
        sourceLabel: 'Jean-Christophe BENOIST / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Sarlat_-_Place_de_la_Libert%C3%A9.jpg',
        licenseLabel: 'CC BY 3.0',
        licenseHref: 'https://creativecommons.org/licenses/by/3.0/',
      },
    },
  },
  localModule: SARLAT_PERIGORD_NOIR_TAX_MODULE,
  territorialModule: SARLAT_PERIGORD_NOIR_TERRITORIAL_MODULE,
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Sarlat et dans le Périgord Noir',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: SARLAT_PERIGORD_NOIR_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé à Sarlat et dans le Périgord Noir',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
