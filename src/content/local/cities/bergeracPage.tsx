import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { LocalLandingPageV6CityConfig } from '../types';
import { BERGERAC_FAQ, BERGERAC_SERVICE_COMMUNES } from './bergerac';
import {
  LOCAL_V6_FINAL_CTA_BASE,
  LOCAL_V6_FINAL_PRIMARY_ACTION,
  LOCAL_V6_PROOF_ITEMS,
  commonProcedure,
  getLocalHeroImageSizes,
  heroReassurance,
  pricingChecklist,
} from '../sharedLocalContent';

const bergeracHeroImageSizes = getLocalHeroImageSizes('/classement-meuble-tourisme-bergerac');

export const BERGERAC_LOCAL_LANDING_PAGE_V6: LocalLandingPageV6CityConfig = {
  layoutVersion: 'v6',
  scope: 'city',
  localEntryId: 'bergerac',
  city: 'Bergerac',
  hero: {
    eyebrow: 'Bergerac et le Bergeracois',
    title: 'Classement de meublé de tourisme à Bergerac et dans le Bergeracois',
    highlightedTitleText: 'à Bergerac et dans le Bergeracois',
    description:
      'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.',
    image: {
      assetKey: 'bergeracHero',
      alt: 'Vue sur la Dordogne et le quai Cyrano à Bergerac en fin d’après-midi',
      sizes: bergeracHeroImageSizes,
      className:
        'h-full w-full object-cover object-[76%_center] max-[899px]:object-[78%_center] max-[680px]:object-[76%_center]',
      caption: (
        <>
          <MapPin size={14} aria-hidden="true" /> Quai Cyrano, Bergerac
        </>
      ),
      note: {
        lead: 'Du studio au grand gîte,',
        title: 'un classement de 1 à 5 étoiles.',
        caption: 'Un repère de qualité pour vos voyageurs.',
      },
      credit: {
        sourceLabel: 'Benjamin Smith / Wikimedia Commons',
        sourceHref: 'https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
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
    reassuranceItems: ['Demande en 30 secondes', ...heroReassurance.slice(1)],
  },
  proofItems: LOCAL_V6_PROOF_ITEMS,
  serviceArea: {
    title: 'Où intervenons-nous autour de Bergerac\u00a0?',
    intro:
      'Nos inspecteurs interviennent à Bergerac et dans le Bergeracois, sans frais de déplacement, notamment à :',
    communes: BERGERAC_SERVICE_COMMUNES,
    parentLink: {
      label: 'Voir l’ensemble de nos interventions en Dordogne',
      localEntryId: 'dordogne',
    },
  },
  pricing: {
    mode: 'direct',
    title: 'Combien coûte le classement d’un meublé à Bergerac ?',
    checklist: pricingChecklist,
    procedureLink: {
      href: '/procedure',
      label: 'Les modalités de la visite',
    },
    pricingProfileId: 'dordogne-standard',
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
    title: 'Pourquoi choisir Etoilys pour votre classement à Bergerac ?',
    image: {
      assetKey: 'bergeracSaintJacquesCyrano',
      alt: 'Église Saint-Jacques et statue de Cyrano de Bergerac',
      sizes: '(min-width: 900px) 35vw, 100vw',
      className: 'h-full w-full object-cover object-[center_42%]',
      caption: 'Église Saint-Jacques, Bergerac. ',
      credit: {
        sourceLabel: 'JGS25 / Wikimedia Commons',
        sourceHref:
          'https://commons.wikimedia.org/wiki/File:Bergerac,_l%27%C3%A9glise_Saint-Jacques_et_Cyrano.jpg',
        licenseLabel: 'CC BY-SA 4.0',
        licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
  },
  localModule: {
    type: 'tax-comparison',
    title: 'Un exemple concret à Bergerac : l’effet du classement sur la taxe de séjour',
    highlightedTitleText: 'taxe de séjour',
    paragraphs: [
      'Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Dans ce contexte local, l’écart de taxe de séjour entre un meublé non classé et un meublé classé donne un exemple concret de l’intérêt du classement.',
      'À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne.',
      'Sur une réservation à 150 € la nuit hors taxe de séjour pour quatre adultes, un meublé classé 2 étoiles permet par exemple de réduire la taxe de séjour de 3,48 € par nuit.',
    ],
    exampleLabel: 'Exemple à Bergerac',
    exampleTitle: 'Taxe de séjour pour 4 adultes',
    exampleSubtitle: 'Logement à 150 € la nuit',
    comparison: [
      { key: 'unclassified', label: 'Meublé non classé', value: '6,60 € par nuit' },
      { key: 'classified', label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
    ],
    savingsHeadline: '3,48 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %',
    savingsDetail:
      'Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une semaine.',
    sourceNote: 'Tarifs 2026 de la Communauté d’agglomération Bergeracoise.',
  },
  faq: {
    eyebrow: 'AVANT DE VOUS LANCER',
    title: 'Questions fréquentes sur le classement à Bergerac',
    intro: 'Un point particulier sur votre logement ?',
    contactLink: {
      href: '/contact',
      label: 'Parlons-en',
    },
    items: BERGERAC_FAQ,
  },
  finalCta: {
    ...LOCAL_V6_FINAL_CTA_BASE,
    title: 'Demandez le classement de votre meublé en Dordogne',
    primaryAction: {
      ...LOCAL_V6_FINAL_PRIMARY_ACTION,
      variant: 'white',
      className: 'editorial-inverse-button',
    },
  },
};
