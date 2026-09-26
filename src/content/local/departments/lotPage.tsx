import { ArrowDown, MapPin } from 'lucide-react';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { LOT_SERVICE_SECTORS } from './lot';
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

const lotHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-lot');

export const LOT_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'lot',
  hero: {
    eyebrow: 'Propriétaires dans le Lot',
    title: 'Classement de gîtes et meublés de tourisme dans le Lot',
    highlightedTitleText: 'dans le Lot',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'lotHero',
      alt: 'Vue sur la vallée du Lot depuis Saint-Cirq-Lapopie',
      sizes: lotHeroImageSizes,
      className:
        'h-full w-full object-cover object-[55%_center] max-[899px]:object-[57%_center] max-[680px]:object-[59%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Saint-Cirq-Lapopie, Lot
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.lot,
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
    title: 'Dans quelles communes du Lot intervenons-nous ?',
    intro:
      'Nos inspecteurs interviennent dans tout le Lot. Les communes ci-dessous sont regroupées par grands secteurs pour vous donner des repères ; votre commune reste couverte même si elle n’apparaît pas dans cette sélection.',
    sectors: toCollapsedSectors(LOT_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé dans le Lot ?',
    intro: LOCAL_V6_DEPARTMENT_PRICING_INTRO,
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé dans le Lot ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Cahors, Rocamadour, Figeac',
      communeIndexUrl: '/data/communes-lot-index.v1.json',
      defaultPricingProfileId: 'lot-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement dans le Lot ?',
    image: {
      assetKey: 'lotRocamadour',
      alt: 'Cité religieuse de Rocamadour dans le Lot',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_42%]',
      caption: 'Rocamadour, Lot.',
      credit: {
        sourceLabel: 'Franck-fnba / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Rocamadour_2025-114909.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  // Sources Lot Tourisme vérifiées le 22 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Après le classement de votre meublé dans le Lot',
    intro:
      'Dans le Lot, le suivi des attestations et la mise à jour des fiches touristiques sont deux démarches distinctes après le classement.',
    items: [
      {
        title: 'Le suivi départemental des attestations',
        // Plan d’actions 2026, p. 12 : suivi après les visites, sans nouvelle démarche imposée au loueur.
        // https://www.tourisme-lot.com/app/uploads/lot-tourisme/2025/12/251105-Plan-actions-2026-CA.pdf
        body: 'Lot Tourisme assure le suivi et l’enregistrement des attestations de classement dans l’outil national, après les visites des différents organismes, y compris privés accrédités. Ce rôle départemental est distinct de la visite de votre meublé réalisée par Etoilys.',
      },
      {
        title: 'Actualiser votre fiche touristique',
        body: 'Votre classement obtenu, pensez à faire actualiser les étoiles de votre fiche auprès de votre office de tourisme. Pour les autres informations de l’hébergement, l’Extranet VIT du Lot permet des mises à jour toute l’année depuis « Mes Offres ».',
        link: {
          label: 'Mettre à jour ma fiche avec les outils du Lot',
          href: 'https://www.tourisme-lot.com/pros-centre-de-ressources/nos-services/promotion-visibilite/sit/outils-pratiques-et-accompagnement/',
        },
      },
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans le Lot',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems({
      question: 'Intervenez-vous dans ma commune dans le Lot ?',
      answer: (
        <>
          Oui. Etoilys intervient dans l’ensemble du département du Lot. Les secteurs présentés sur
          cette page donnent des repères autour de Cahors, Rocamadour, Figeac, Saint-Cirq-Lapopie,
          Gourdon et du Quercy Blanc, avec des communes représentatives. Consultez les{' '}
          <a href="#communes">communes de nos secteurs</a> ou indiquez l’adresse de votre logement
          dans votre demande pour confirmer l’organisation de la visite.
        </>
      ),
    }),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé dans le Lot',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
