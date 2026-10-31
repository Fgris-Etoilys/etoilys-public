import { ArrowDown, MapPin } from 'lucide-react';
import { IMAGE_ALT_TEXT } from '../../imageAltText';
import type { LocalLandingPageV6DepartmentConfig } from '../types';
import { AUDE_SERVICE_SECTORS } from './aude';
import {
  LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
  LOCAL_V6_DEPARTMENT_HERO_INDEXES,
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

const audeHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-aude');

const audePricingChecklist = [
  'La visite et les documents de classement sont inclus, sans frais de déplacement.',
  'Plusieurs meublés à faire classer ? Un tarif dégressif peut être proposé sur demande.',
  'Le tarif est confirmé avant tout engagement, quelle que soit la catégorie d’étoiles visée.',
] as const;

export const AUDE_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6DepartmentConfig = {
  layoutVersion: 'v6',
  scope: 'department',
  departmentId: 'aude',
  hero: {
    eyebrow: 'Propriétaires dans l’Aude',
    title: 'Classement de gîtes et meublés de tourisme dans l’Aude',
    highlightedTitleText: 'dans l’Aude',
    description: LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
    image: {
      assetKey: 'audeHero',
      alt: IMAGE_ALT_TEXT.audeHero.fr,
      sizes: audeHeroImageSizes,
      className: 'h-full w-full object-cover object-[18%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Cité de Carcassonne, Aude
        </>
      ),
      note: LOCAL_V6_HERO_NOTE,
      index: LOCAL_V6_DEPARTMENT_HERO_INDEXES.aude,
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
    title: 'Dans quelles communes de l’Aude intervenons-nous ?',
    intro:
      'Nos inspecteurs interviennent dans tout le département de l’Aude, de Carcassonne au littoral narbonnais, en passant par le Lauragais, les Corbières, le Minervois, le Limouxin et les Pyrénées audoises. Les communes ci-dessous sont des repères géographiques : votre commune reste couverte même si elle ne figure pas dans cette sélection.',
    localPagesLabel: 'Nos pages locales dans l’Aude',
    sectors: toCollapsedSectors(AUDE_SERVICE_SECTORS),
    parentLink: {
      href: '/zones-intervention',
      label: 'Voir toutes nos zones d’intervention',
    },
  },
  pricing: {
    mode: 'picker',
    title: 'Quel tarif pour classer votre meublé dans l’Aude ?',
    intro:
      'Indiquez la commune de votre logement pour consulter le tarif de la visite. Etoilys intervient dans tout le département de l’Aude, sans frais de déplacement supplémentaires.',
    checklist: audePricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    picker: {
      title: 'Quel tarif pour classer votre meublé dans l’Aude ?',
      intro: 'Sélectionnez la commune de votre meublé pour afficher le tarif applicable.',
      inputLabel: 'Commune',
      placeholder: 'Ex. Carcassonne, Narbonne, Castelnaudary',
      communeIndexUrl: '/data/communes-aude-index.v1.json',
      defaultPricingProfileId: 'aude-standard',
      overrides: {},
    },
  },
  procedure: commonProcedure,
  expertise: {
    title: 'Pourquoi choisir Etoilys pour votre classement dans l’Aude ?',
    image: {
      assetKey: 'audeGruissan',
      alt: 'Village de Gruissan et tour Barberousse vus depuis l’autre rive de l’étang',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-center',
      caption: 'Gruissan et la tour Barberousse, Aude.',
    },
  },
  // Sources ADT de l’Aude, portail de taxe de séjour de Carcassonne, Carcassonne Agglo,
  // ville de Gruissan et Grand Narbonne vérifiées le 31 octobre 2026.
  localModule: {
    type: 'territorial-service',
    title: 'Les démarches utiles pour votre meublé dans l’Aude',
    intro:
      'Dans l’Aude, les démarches liées à votre location touristique dépendent notamment de la commune où elle se situe. Office de tourisme de rattachement, taxe de séjour, actualisation des informations de votre hébergement : voici trois ressources locales utiles avant ou après votre classement.',
    items: [
      {
        title: 'Mettre à jour votre fiche touristique',
        body: 'L’Agence de développement touristique de l’Aude propose un outil pour retrouver votre office de tourisme de rattachement à partir de la commune de votre logement. Les offices équipés du système Tourinsoft peuvent actualiser les informations de votre hébergement diffusées sur les sites touristiques du réseau audois, notamment après l’obtention d’un classement.',
        link: {
          label: 'Retrouver mon office de tourisme dans l’Aude',
          href: 'https://pro.audetourisme.com/accompagnement/systeme-information/mettre-a-jour-vos-donnees/',
        },
      },
      {
        title: 'Carcassonne : quel portail de taxe de séjour ?',
        body: 'La commune de Carcassonne dispose de son propre portail de taxe de séjour, distinct du dispositif de Carcassonne Agglo. Depuis le 1er octobre 2026, le paiement de la taxe de séjour communale est mensuel, et non plus trimestriel. Avant de déclarer vos nuitées ou de signaler un nouveau classement, vérifiez quelle collectivité gère la taxe de séjour de votre logement. Les démarches ne sont pas interchangeables.',
        link: {
          label: 'Accéder au portail de taxe de séjour de Carcassonne',
          href: 'https://carcassonne.taxesejour.fr/',
        },
      },
      {
        title: 'Narbonne et Gruissan : des modalités différentes',
        body: 'À Narbonne, la taxe de séjour relève du portail du Grand Narbonne, avec une perception au réel. Gruissan dispose de son propre portail communal et applique notamment une taxe de séjour forfaitaire aux hébergements classés. Le mode de calcul et les démarches ne sont donc pas identiques : vérifiez la commune exacte de votre logement avant de déclarer.',
        link: {
          label: 'Consulter les règles de taxe de séjour à Gruissan',
          href: 'https://ville-gruissan.fr/economie-tourisme/fiscalite-locale/',
        },
      },
    ],
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement dans l’Aude',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: buildDepartmentFaqItems(
      {
        question: 'Intervenez-vous dans toutes les communes de l’Aude ?',
        answer:
          'Oui. Etoilys réalise des visites de classement dans l’ensemble du département de l’Aude, notamment à Carcassonne, Narbonne, Castelnaudary, Limoux, Lézignan-Corbières, Gruissan, Leucate et Quillan. Les secteurs présentés sur cette page sont des repères géographiques et ne limitent pas notre zone d’intervention.',
      },
      [],
      {
        multiPropertyItem: {
          question: 'Proposez-vous un tarif pour plusieurs meublés ?',
          answer:
            'Oui. Un tarif dégressif peut être proposé sur demande pour plusieurs meublés. Précisez le nombre de logements dans votre demande : nous vous confirmons le tarif avant tout engagement.',
        },
      }
    ),
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé dans l’Aude',
    primaryAction: LOCAL_V6_FINAL_PRIMARY_ACTION,
  },
};
