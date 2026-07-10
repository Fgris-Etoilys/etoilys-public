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
] as const;

export type LocalizedRouteId = (typeof LOCALIZED_ROUTE_IDS)[number];

export type LocalizedRoutePaths = Readonly<Record<Locale, string>>;

export type LocalizedRoutes = Readonly<Record<LocalizedRouteId, LocalizedRoutePaths>>;

export const localizedRoutes = {
  home: {
    fr: '/',
    en: '/en',
  },
  classement: {
    fr: '/classement',
    en: '/en/furnished-tourist-accommodation-classification',
  },
  avantages: {
    fr: '/les-avantages-du-classement',
    en: '/en/benefits-of-furnished-tourist-accommodation-classification',
  },
  prerequis: {
    fr: '/prerequis-au-classement',
    en: '/en/classification-requirements',
  },
  procedure: {
    fr: '/procedure',
    en: '/en/classification-process',
  },
  faq: {
    fr: '/faq',
    en: '/en/faq',
  },
  contact: {
    fr: '/contact',
    en: '/en/contact',
  },
  demandeClassement: {
    fr: '/demande-classement',
    en: '/en/request-a-classification',
  },
  confidentialite: {
    fr: '/confidentialite',
    en: '/en/privacy-policy',
  },
} as const satisfies LocalizedRoutes;
