import type { Locale } from './locales';

export const LOCALIZED_ROUTE_IDS = [
  'home',
  'classement',
  'avantages',
  'prerequis',
  'procedure',
  'faq',
  'contact',
  'demandeClassement',
  'confidentialite',
  'simulateurTaxeSejour',
  'simulateurFiscalClassement',
] as const;

export type LocalizedRouteId = (typeof LOCALIZED_ROUTE_IDS)[number];

export type LocalizedRoutePaths = Readonly<Partial<Record<Locale, string>>>;

export type LocalizedRoutes = Readonly<Record<LocalizedRouteId, LocalizedRoutePaths>>;

export const localizedRoutes: LocalizedRoutes = {
  home: {
    fr: '/',
    en: '/en',
    nl: '/nl',
  },
  classement: {
    fr: '/classement',
    en: '/en/furnished-tourist-accommodation-classification',
    nl: '/nl/classificatie-vakantiewoning-frankrijk',
  },
  avantages: {
    fr: '/les-avantages-du-classement',
    en: '/en/benefits-of-furnished-tourist-accommodation-classification',
    nl: '/nl/voordelen-classificatie-vakantiewoning',
  },
  prerequis: {
    fr: '/prerequis-au-classement',
    en: '/en/classification-requirements',
    nl: '/nl/voorwaarden-classificatie-vakantiewoning',
  },
  procedure: {
    fr: '/procedure',
    en: '/en/classification-process',
    nl: '/nl/classificatieprocedure-vakantiewoning',
  },
  faq: {
    fr: '/faq',
    en: '/en/faq',
    nl: '/nl/faq',
  },
  contact: {
    fr: '/contact',
    en: '/en/contact',
    nl: '/nl/contact',
  },
  demandeClassement: {
    fr: '/demande-classement',
    en: '/en/request-a-classification',
    nl: '/nl/classificatie-aanvragen',
  },
  confidentialite: {
    fr: '/confidentialite',
    en: '/en/privacy-policy',
    nl: '/nl/privacybeleid',
  },
  simulateurTaxeSejour: {
    fr: '/simulateur-taxe-sejour',
    en: '/en/tourist-tax-simulator',
  },
  simulateurFiscalClassement: {
    fr: '/simulateur-fiscal-classement',
    en: '/en/furnished-tourist-accommodation-tax-simulator',
  },
} as const;
