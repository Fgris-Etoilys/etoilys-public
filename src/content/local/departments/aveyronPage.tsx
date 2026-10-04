import { ArrowDown, MapPin } from 'lucide-react';
import { IMAGE_ALT_TEXT } from '../../imageAltText';
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
      alt: IMAGE_ALT_TEXT.aveyronHero.fr,
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
    localPagesLabel: 'Nos pages locales en Aveyron',
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
  // Sources Aveyron Attractivité Tourisme et OT du Pays Decazevillois vérifiées le 27 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Vos repères pour un classement en Aveyron',
    intro:
      'Depuis 2026, Aveyron Attractivité Tourisme ne réalise plus les visites de classement. Si vous préparez votre démarche en Aveyron, voici les ressources locales utiles à connaître avant la visite.',
    items: [
      {
        title: 'Votre interlocuteur en 2026',
        body: 'Aveyron Attractivité Tourisme ne réalise plus de classements depuis la fin de son agrément, le 29 avril 2026. L’agence oriente désormais les propriétaires vers un organisme agréé ou accrédité.',
        link: {
          label: 'Lire l’annonce de l’agence',
          href: 'https://www.aveyron-attractivite.fr/fin-de-lagrement-pour-le-classement-des-meubles-de-tourisme-29-avril-2026/',
        },
      },
      {
        title: 'Les ressources du Pays Decazevillois',
        body: 'L’office de tourisme du Pays Decazevillois publie le référentiel et le mémo départemental « Les incontournables du classement ». Ces documents donnent des repères pour préparer votre meublé et vos questions avant la visite.',
        link: {
          label: 'Consulter les ressources du Pays Decazevillois',
          href: 'https://www.tourisme-paysdecazevillois.fr/les-meubles-de-tourisme/',
          nofollow: true,
        },
      },
    ],
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
