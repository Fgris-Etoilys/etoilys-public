import { DEFAULT_LOCALE, type Locale } from './locales';
import { localizedRoutes } from './localizedRoutes';
import type { LocalizedRouteId } from './localizedRoutes';

export const EN_INDEXABLE_ROUTE_IDS = [
  'home',
  'avantages',
  'contact',
  'demandeClassement',
  'confidentialite',
  'classement',
  'prerequis',
  'procedure',
  'faq',
  'simulateurTaxeSejour',
  'simulateurFiscalClassement',
] as const satisfies readonly LocalizedRouteId[];

export const NL_INDEXABLE_ROUTE_IDS = [
  'home',
  'classement',
  'avantages',
  'prerequis',
  'procedure',
  'faq',
  'contact',
  'demandeClassement',
  'confidentialite',
] as const satisfies readonly LocalizedRouteId[];

const INDEXABLE_ROUTE_IDS_BY_LOCALE: Partial<Record<Locale, ReadonlySet<LocalizedRouteId>>> = {
  en: new Set<LocalizedRouteId>(EN_INDEXABLE_ROUTE_IDS),
  nl: new Set<LocalizedRouteId>(NL_INDEXABLE_ROUTE_IDS),
};

export const isContentReadyForIndexing = (
  locale: Locale,
  routeId: LocalizedRouteId | undefined
): boolean => {
  if (locale === DEFAULT_LOCALE) {
    return true;
  }

  if (routeId === undefined || localizedRoutes[routeId][locale] === undefined) {
    return false;
  }

  return INDEXABLE_ROUTE_IDS_BY_LOCALE[locale]?.has(routeId) ?? false;
};
