import { ArrowDown, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { AVEYRON_SERVICE_SECTORS } from './aveyron';
import {
  LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
  LOCAL_V6_DEPARTMENT_HERO_INDEXES,
  LOCAL_V6_DEPARTMENT_PRICING_INTRO,
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_HERO_NOTE,
  LOCAL_V6_HERO_PRIMARY_ACTION,
  LOCAL_V6_PROOF_ITEMS,
  buildDepartmentFaqItems,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
  pricingChecklist,
  toCollapsedSectors,
} from '../sharedLocalContent';

const aveyronHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-aveyron');

export const AVEYRON_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'aveyron',
  hero: {
    eyebrow: 'Propriétaires en Aveyron',
    title: 'Classement de gîtes et meublés de tourisme en Aveyron',
    highlightedTitleText: 'en Aveyron',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'aveyronHero',
      alt: 'Village de Belcastel et château au bord de la rivière Aveyron',
      sizes: aveyronHeroImageSizes,
      className:
        'h-full w-full object-cover object-[45%_center] max-[899px]:object-[48%_center] max-[680px]:object-[52%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Belcastel, Aveyron
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.aveyron,
      credit: {
        sourceLabel: 'Kallerna / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Belcastel_4.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
    primaryAction: LOCAL_V6_HERO_PRIMARY_ACTION,
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
    title: 'Dans quelles communes de l’Aveyron intervenons-nous ?',
    intro:
      'Nos inspecteurs interviennent dans tout l’Aveyron. Les communes ci-dessous sont des repères autour des principaux secteurs du département ; votre commune reste couverte même si elle n’apparaît pas dans cette sélection.',
    sectors: toCollapsedSectors(AVEYRON_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Aveyron ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé en Aveyron ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Rodez, Millau, Conques-en-Rouergue',
      communeIndexUrl: '/data/communes-aveyron-index.v1.json',
      defaultPricingProfileId: 'aveyron-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement en Aveyron ?',
    image: {
      assetKey: 'aveyronTerritory',
      alt: 'Abbatiale Sainte-Foy de Conques-en-Rouergue en Aveyron',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_42%]',
      caption: 'Conques-en-Rouergue, Aveyron.',
      credit: {
        sourceLabel: 'Joran Quinten / Unsplash',
        sourceHref:
          'https://unsplash.com/fr/photos/batiment-en-beton-brun-pres-de-green-mountain-pendant-la-journee-wYzuwwLKmGM',
        licenseLabel: 'Licence Unsplash',
        licenseHref: 'https://unsplash.com/license',
      },
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Aveyron',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans ma commune en Aveyron ?',
      answer: (
        <>
          Oui. Etoilys intervient dans l’ensemble du département de l’Aveyron. Les secteurs
          présentés sur cette page donnent des repères autour de Rodez, Belcastel,
          Conques-en-Rouergue, Millau, Laguiole, Espalion, Villefranche-de-Rouergue et Najac, avec
          des communes représentatives. Consultez les{' '}
          <a href="#communes">communes de nos secteurs</a> ou indiquez l’adresse de votre logement
          dans votre demande pour confirmer l’organisation de la visite.
        </>
      ),
    }),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé en Aveyron',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
