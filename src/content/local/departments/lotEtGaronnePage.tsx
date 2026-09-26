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
  // Sources Tourisme Lot-et-Garonne et portails intercommunaux vérifiés le 22 septembre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Après le classement en Lot-et-Garonne',
    intro:
      'Le suivi départemental des meublés classés et la taxe de séjour relèvent d’interlocuteurs différents. Identifiez celui qui correspond à votre démarche et à la commune du logement.',
    items: [
      {
        title: 'Présenter votre classement',
        // Source factuelle uniquement : cette page propose aussi la commande d’une visite concurrente.
        // https://pro.tourisme-lotetgaronne.com/accompagnement/classement-2/classement-des-meubles-de-tourisme/
        body: 'Tourisme Lot-et-Garonne tient à jour la liste départementale des meublés classés. Après réception de votre décision, vérifiez que vos annonces et les informations transmises à votre office de tourisme présentent le bon nombre d’étoiles.',
      },
      {
        title: 'Taxe de séjour : retrouver votre intercommunalité',
        // Portails recoupés : https://taxe.3douest.com/agen.php,
        // https://grandvilleneuvois.taxesejour.fr/ et https://valdegaronne.taxesejour.fr/
        body: 'Agen, le Grand Villeneuvois et le Val de Garonne ont chacun leur portail de taxe de séjour. Une fois votre classement obtenu, signalez-le à la collectivité de votre commune et vérifiez le barème correspondant à vos étoiles : il n’existe pas de tarif unique pour tout le Lot-et-Garonne.',
        link: {
          label: 'Trouver le portail de taxe de séjour de ma collectivité',
          href: 'https://pro.tourisme-lotetgaronne.com/accompagnement/legislation-et-reglementation/taxe-de-sejour/',
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
