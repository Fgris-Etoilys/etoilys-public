import { ArrowDown, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { LOT_ET_GARONNE_SERVICE_SECTORS } from './lot-et-garonne';
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

const lotEtGaronneHeroImageSizes = getLocalHeroImageSizes(
  '/classement-meuble-tourisme-lot-et-garonne'
);

export const LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'lot-et-garonne',
  hero: {
    eyebrow: 'Propriétaires en Lot-et-Garonne',
    title: 'Classement de gîtes et meublés de tourisme dans le Lot-et-Garonne',
    highlightedTitleText: 'dans le Lot-et-Garonne',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'lotEtGaronneHero',
      alt: 'Nérac et son pont sur la Baïse',
      sizes: lotEtGaronneHeroImageSizes,
      className: 'h-full w-full object-cover object-center',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Nérac, Lot-et-Garonne
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES['lot-et-garonne'],
      credit: {
        sourceLabel: 'Adobe Stock',
        sourceHref: 'https://stock.adobe.com/',
        licenseLabel: 'Adobe Stock License',
        licenseHref: 'https://stock.adobe.com/license-terms',
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
    title: 'Dans quelles communes du Lot-et-Garonne intervenons-nous ?',
    intro:
      'Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais, la vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le Fumélois, les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le secteur de Casteljaloux.',
    sectors: toCollapsedSectors(LOT_ET_GARONNE_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Agen, Marmande, Villeneuve-sur-Lot',
      communeIndexUrl: '/data/communes-lot-et-garonne-index.v1.json',
      defaultPricingProfileId: 'lot-et-garonne-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement dans le Lot-et-Garonne ?',
    image: {
      assetKey: 'lotEtGaronneTerritory',
      alt: 'Tour horloge et maisons de pierre à Monflanquin',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Monflanquin, Lot-et-Garonne.',
      credit: {
        sourceLabel: 'D Goth / Pexels',
        sourceHref: 'https://www.pexels.com/photo/37724280/',
        licenseLabel: 'Pexels License',
        licenseHref: 'https://www.pexels.com/license/',
      },
    },
  },
  // Sources Tourisme Lot-et-Garonne vérifiées le 20 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Des ressources pour votre meublé en Lot-et-Garonne',
    intro:
      'Tourisme Lot-et-Garonne fournit des repères pour présenter votre classement et préparer l’information des voyageurs dans votre logement.',
    items: [
      {
        title: 'Présenter votre classement',
        body: 'L’agence départementale tient à jour la liste des meublés classés. Après réception de votre décision, vérifiez que vos annonces et les informations transmises à votre office de tourisme présentent le bon nombre d’étoiles.',
        link: {
          label: 'Voir les informations de l’agence',
          href: 'https://pro.tourisme-lotetgaronne.com/accompagnement/classement-2/classement-des-meubles-de-tourisme/',
        },
      },
      {
        title: 'Informer vos voyageurs',
        body: 'Tourisme Lot-et-Garonne propose un guide des écogestes en vacances et des affiches ADEME sur l’eau, l’énergie et le tri. Utilisez ces supports pour informer vos voyageurs, en les adaptant aux équipements du logement.',
        link: {
          label: 'Découvrir le kit écogestes',
          href: 'https://pro.tourisme-lotetgaronne.com/guide-et-kit-ecogestes/',
        },
      },
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans le Lot-et-Garonne',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans ma commune dans le Lot-et-Garonne ?',
      answer: (
        <>
          Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais, la
          vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le Fumélois,
          les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le secteur de
          Casteljaloux. Consultez les <a href="#communes">communes de nos secteurs</a> ou indiquez
          l’adresse de votre logement dans votre demande pour confirmer notre intervention.
        </>
      ),
    }),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé dans le Lot-et-Garonne',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
