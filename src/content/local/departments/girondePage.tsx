import { ArrowDown, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { GIRONDE_SERVICE_SECTORS } from './gironde';
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

const girondeHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-gironde');

export const GIRONDE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'gironde',
  hero: {
    eyebrow: 'Propriétaires en Gironde',
    title: 'Classement de gîtes et meublés de tourisme en Gironde',
    highlightedTitleText: 'en Gironde',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'girondeHero',
      alt: 'Vue de Saint-Émilion en Gironde',
      sizes: girondeHeroImageSizes,
      className: 'h-full w-full object-cover object-center',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Saint-Émilion, Gironde
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.gironde,
      credit: {
        sourceLabel: 'Axel Delansorne / Unsplash',
        sourceHref: 'https://unsplash.com/photos/fSpupJ0C95E',
        licenseLabel: 'Unsplash License',
        licenseHref: 'https://unsplash.com/license',
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
    title: 'Dans quelles communes de Gironde intervenons-nous ?',
    intro:
      'Etoilys intervient en Gironde sur une zone concentrée autour du Libournais, de la Haute-Gironde, de Bordeaux Métropole, de l’Entre-deux-Mers, de Montesquieu, de la vallée de la Garonne et du nord du Sud-Gironde.',
    sectors: toCollapsedSectors(GIRONDE_SERVICE_SECTORS),
    communeLinks: {
      Bordeaux: {
        label: 'Bordeaux →',
        localEntryId: 'bordeaux',
      },
    },
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Gironde ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé en Gironde ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Bordeaux, Libourne, Saint-Émilion',
      communeIndexUrl: '/data/communes-gironde-index.v1.json',
      defaultPricingProfileId: 'gironde-standard',
      overrides: {
        '33063': 'bordeaux-standard',
      },
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement en Gironde ?',
    image: {
      assetKey: 'girondeTerritory',
      alt: 'Front de mer et promenade à Arcachon',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Front de mer d’Arcachon.',
      credit: {
        sourceLabel: 'Árpád Czapp / Unsplash',
        sourceHref: 'https://unsplash.com/photos/J181eozqAd8',
        licenseLabel: 'Unsplash License',
        licenseHref: 'https://unsplash.com/license',
      },
    },
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Gironde',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems(
      {
        question: 'Intervenez-vous dans ma commune en Gironde ?',
        answer: (
          <>
            Etoilys intervient en Gironde sur une zone concentrée autour du Libournais, de la
            Haute-Gironde, de Bordeaux Métropole, de l’Entre-deux-Mers, de Montesquieu, de la vallée
            de la Garonne et du nord du Sud-Gironde. Consultez les{' '}
            <a href="#communes">communes de nos secteurs</a> ou indiquez l’adresse de votre logement
            dans votre demande pour confirmer notre intervention.
          </>
        ),
      },
      [
        {
          question: 'Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?',
          answer:
            'Les demandes situées sur le Bassin d’Arcachon, le littoral médocain ou les secteurs plus éloignés sont étudiées selon la localisation du logement et l’organisation des tournées. Indiquez la commune dans votre demande pour recevoir une réponse claire avant toute validation.',
        },
      ]
    ),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé en Gironde',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
