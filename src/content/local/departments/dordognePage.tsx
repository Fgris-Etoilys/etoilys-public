import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { DORDOGNE_V6_SERVICE_SECTORS } from './dordogne';
import {
  LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
  LOCAL_V6_DEPARTMENT_HERO_INDEXES,
  LOCAL_V6_DEPARTMENT_PRICING_INTRO,
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  dordogneQuestions,
  getLocalHeroImageSizes,
  heroReassurance,
  pricingChecklist,
} from '../sharedLocalContent';

const dordogneHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-dordogne');

export const DORDOGNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'dordogne',
  hero: {
    eyebrow: 'Propriétaires en Dordogne',
    title: 'Classement de gîtes et meublés de tourisme en Dordogne',
    highlightedTitleText: 'en Dordogne',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'dordogneLaRoqueGageac',
      alt: 'Les maisons de pierre de La Roque-Gageac au bord de la Dordogne',
      sizes: dordogneHeroImageSizes,
      className: 'h-full w-full object-cover object-[38%_center] max-[680px]:object-[center_48%]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> La Roque-Gageac, Dordogne
        </>
      ),
      note: {
        lead: 'Du studio au grand gîte,',
        title: 'un classement de 1 à 5 étoiles.',
        caption: 'Un repère de qualité pour vos voyageurs.',
      },
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.dordogne,
    },
    primaryAction: {
      href: '/demande-classement',
      variant: 'primary',
      label: (
        <>
          Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
        </>
      ),
    },
    secondaryAction: {
      href: '#department-pricing-locality',
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
    title: 'Dans quelles communes de Dordogne intervenons-nous ?',
    intro:
      'Etoilys intervient en Dordogne sur une large zone couvrant notamment le Bergeracois, le Périgord Noir, la vallée de la Dordogne, la vallée de la Vézère, le Grand Périgueux, la vallée de l’Isle, le Ribéracois et une partie du nord-ouest du département.',
    sectors: DORDOGNE_V6_SERVICE_SECTORS,
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Dordogne ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé en Dordogne ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Périgueux, Ribérac, Monbazillac',
      communeIndexUrl: '/data/communes-dordogne-index.v1.json',
      defaultPricingProfileId: 'dordogne-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement ?',
    image: {
      assetKey: 'dordogneLandscape',
      alt: 'Architecture de pierre et végétation dans un village du Périgord',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_55%] max-[680px]:object-[center_40%]',
      caption: 'Les pierres du Périgord.',
    },
  },
  // Sources institutionnelles et liens locaux vérifiés le 22 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Vos interlocuteurs locaux en Dordogne',
    intro:
      'Du Bergeracois au Périgord Noir, nos secteurs situent votre logement dans notre zone d’intervention. Votre commune permet ensuite d’identifier les interlocuteurs locaux.',
    items: [
      {
        title: 'Périgueux et vallée de l’Isle : des contacts distincts',
        body: 'Dordogne Périgord Tourisme distingue les offices de Périgueux, du Grand Périgueux et de la vallée de l’Isle. À Saint-Astier, Neuvic ou Mussidan, retrouvez votre office pour préparer l’information locale de vos voyageurs.',
        link: {
          label: 'Les offices de Périgueux et de la vallée de l’Isle',
          href: 'https://www.dordogne-perigord-tourisme.fr/sinspirer/nos-destinations/perigueux-vallee-isle/',
        },
      },
      {
        title: 'Taxe de séjour : partir de la collectivité',
        // https://grandperigueux.taxesejour.fr/ et https://lacab.taxesejour.fr/
        body: 'Le Grand Périgueux et l’agglomération Bergeracoise ont des portails de taxe de séjour distincts. Pour signaler votre classement, identifiez la collectivité de votre commune : nos secteurs de visite ne définissent pas ce rattachement.',
        link: {
          label: 'Consulter le portail du Grand Périgueux',
          href: 'https://grandperigueux.taxesejour.fr/',
        },
      },
      {
        title: 'Bergerac et le Bergeracois',
        // Source de couverture : cities/bergeracPage.tsx et registry.ts.
        body: 'Pour un meublé à Bergerac ou dans le Bergeracois, la page dédiée précise les communes desservies autour de la ville et les repères de classement du secteur. Utilisez-la pour préparer votre demande à la bonne adresse.',
        link: {
          label: 'Le classement à Bergerac et dans le Bergeracois',
          localEntryId: 'bergerac',
        },
      },
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Dordogne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: dordogneQuestions,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé en Dordogne',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'primary',
      className: 'editorial-inverse-button',
    },
  },
};
