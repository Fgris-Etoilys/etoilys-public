import { DEFAULT_LOCALE, type Locale } from './locales';
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

const EN_INDEXABLE_ROUTE_ID_SET = new Set<LocalizedRouteId>(EN_INDEXABLE_ROUTE_IDS);

export const isContentReadyForIndexing = (
  locale: Locale,
  routeId: LocalizedRouteId | undefined
): boolean => {
  if (locale === DEFAULT_LOCALE) {
    return true;
  }

  return locale === 'en' && routeId !== undefined && EN_INDEXABLE_ROUTE_ID_SET.has(routeId);
};
