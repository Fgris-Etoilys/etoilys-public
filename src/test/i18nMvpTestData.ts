import { EN_INDEXABLE_ROUTE_IDS, NL_INDEXABLE_ROUTE_IDS } from '../i18n/contentReadiness';
import type { Locale } from '../i18n/locales';
import { localizedRoutes, type LocalizedRouteId } from '../i18n/localizedRoutes';

const getLocalizedTestPath = (routeId: LocalizedRouteId, locale: Locale): string => {
  const path = localizedRoutes[routeId][locale];
  if (path === undefined) {
    throw new Error(`Missing ${locale} path for localized route ${routeId}.`);
  }
  return path;
};

export const EN_MVP_PATHS = EN_INDEXABLE_ROUTE_IDS.map((routeId) =>
  getLocalizedTestPath(routeId, 'en')
);

export const NL_MVP_PATHS = NL_INDEXABLE_ROUTE_IDS.map((routeId) =>
  getLocalizedTestPath(routeId, 'nl')
);

export const EN_MVP_PATH_SET = new Set<string>(EN_MVP_PATHS);
export const NL_MVP_PATH_SET = new Set<string>(NL_MVP_PATHS);

export const EN_MVP_PATH_COUNT = EN_INDEXABLE_ROUTE_IDS.length;
export const NL_MVP_PATH_COUNT = NL_INDEXABLE_ROUTE_IDS.length;

export const FORBIDDEN_EN_MVP_INTERNAL_LINK_PATTERNS = [
  /^\/actualites(?:\/|$)/,
  /^\/simulateur(?:\/|-|$)/,
  /^\/zones-intervention(?:\/|$)/,
  /^\/classement-meuble-tourisme-(?:dordogne|gironde|lot-et-garonne)(?:\/|$)/,
  /^\/recrutement(?:\/|$)/,
  /^\/mentions-legales(?:\/|$)/,
  /^\/en\/actualites(?:\/|$)/,
  /^\/en\/simulateur(?:\/|-|$)/,
  /^\/en\/zones(?:\/|-|$)/,
  /^\/en\/recrutement(?:\/|$)/,
  /^\/en\/mentions-legales(?:\/|$)/,
  /^\/en\/legal-notice(?:\/|$)/,
] as const;

export function isForbiddenEnglishMvpInternalHref(href: string): boolean {
  return FORBIDDEN_EN_MVP_INTERNAL_LINK_PATTERNS.some((pattern) => pattern.test(href));
}
