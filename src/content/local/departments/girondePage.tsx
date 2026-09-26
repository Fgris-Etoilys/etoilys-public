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
  toCollapsedSectors,
} from '../sharedLocalContent';

const girondeHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-gironde');

const girondePricingChecklist = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Le tarif applicable dépend de la commune de votre logement et, selon le secteur, de sa typologie.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

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
    title: 'Où intervenons-nous en Gironde ?',
    intro:
      'Etoilys intervient désormais dans toute la Gironde. Pour vous repérer, nous regroupons ci-dessous les principales communes par grands secteurs. Cette liste donne des repères géographiques : elle n’est pas exhaustive.',
    sectors: toCollapsedSectors(GIRONDE_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé en Gironde ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: girondePricingChecklist,
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
        '33020': 'dordogne-standard',
        '33094': 'dordogne-standard',
        '33160': 'dordogne-standard',
        '33223': 'dordogne-standard',
        '33242': 'dordogne-standard',
        '33246': 'dordogne-standard',
        '33247': 'dordogne-standard',
        '33269': 'dordogne-standard',
        '33277': 'dordogne-standard',
        '33316': 'dordogne-standard',
        '33324': 'dordogne-standard',
        '33354': 'dordogne-standard',
        '33360': 'dordogne-standard',
        '33369': 'dordogne-standard',
        '33377': 'dordogne-standard',
        '33378': 'dordogne-standard',
        '33402': 'dordogne-standard',
        '33462': 'dordogne-standard',
        '33467': 'dordogne-standard',
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
  // Sources institutionnelles ci-dessous et pages filles vérifiées le 22 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Quels repères pour votre meublé en Gironde ?',
    intro:
      'Bordeaux, le Bassin d’Arcachon et le Médoc Atlantique ont chacun leurs repères. Notre couverture reste départementale : ailleurs en Gironde, préparez votre demande avec le sélecteur de commune ci-dessus.',
    items: [
      {
        title: 'Bordeaux et sa métropole',
        // https://taxedesejour.bordeaux-metropole.fr/
        body: 'Le portail métropolitain distingue les démarches d’enregistrement et de changement d’usage de Bordeaux des informations pour les autres communes. Vérifiez la commune de votre logement : les règles de la ville ne s’étendent pas automatiquement à toute la métropole.',
        link: {
          label: 'Le classement à Bordeaux et dans sa métropole',
          localEntryId: 'bordeaux',
        },
      },
      {
        title: 'Le Bassin d’Arcachon, commune par commune',
        // https://www.gironde-tourisme.com/espace-pro/hebergements/meubles-de-tourisme/faq-meuble-de-tourisme/
        body: 'Sur le Bassin, vérifiez les démarches de location auprès de la mairie du logement : la destination ne forme pas un cadre administratif unique. Notre page dédiée précise les repères locaux pour préparer votre classement.',
        link: {
          label: 'Le classement sur le Bassin d’Arcachon',
          localEntryId: 'bassin-arcachon',
        },
      },
      {
        title: 'Lacanau et Médoc Atlantique',
        // https://medocatlantique.taxesejour.fr/
        body: 'Lacanau, Carcans, Hourtin et Soulac-sur-Mer relèvent du portail de taxe de séjour de Médoc Atlantique. Consultez-y le barème de votre hébergement et pensez à actualiser votre classement. Ce périmètre ne couvre pas tout le Médoc.',
        link: {
          label: 'Le classement à Lacanau et en Médoc Atlantique',
          localEntryId: 'medoc-atlantique',
        },
      },
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement en Gironde',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans toute la Gironde ?',
      answer:
        'Oui. Etoilys intervient désormais dans toute la Gironde, y compris sur le Bassin d’Arcachon, dans le Médoc, le Libournais et le Sud-Gironde. Les communes présentées sur cette page servent de repères géographiques : elles ne constituent pas une liste exhaustive.',
    }),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé en Gironde',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
