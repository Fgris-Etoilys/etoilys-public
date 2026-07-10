import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './locales';
import { LOCALIZED_ROUTE_IDS, localizedRoutes, type LocalizedRouteId } from './localizedRoutes';

export interface AlternateLocaleLink {
  locale: Locale;
  href: string;
}

const EN_LOCALE_PREFIX = '/en';

const normalizePathname = (pathname: string): string => {
  const pathOnly = pathname.split(/[?#]/)[0] ?? '';
  const withLeadingSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;

  if (withLeadingSlash === '/') {
    return '/';
  }

  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '') || '/';

  return withoutTrailingSlash;
};

const normalizeBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/+$/, '');

const toAbsoluteUrl = (path: string, baseUrl: string): string =>
  `${normalizeBaseUrl(baseUrl)}${path}`;

export const getLocaleFromPath = (pathname: string): Locale => {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === EN_LOCALE_PREFIX || normalizedPathname.startsWith('/en/')) {
    return 'en';
  }

  return DEFAULT_LOCALE;
};

export const getRouteIdFromPath = (pathname: string): LocalizedRouteId | null => {
  const normalizedPathname = normalizePathname(pathname);

  for (const routeId of LOCALIZED_ROUTE_IDS) {
    const routePaths = localizedRoutes[routeId];
    if (
      Object.values(routePaths).some(
        (routePath) => normalizePathname(routePath) === normalizedPathname
      )
    ) {
      return routeId;
    }
  }

  return null;
};

export const getLocalizedPath = (routeId: LocalizedRouteId, locale: Locale): string | null =>
  localizedRoutes[routeId][locale] ?? null;

export const getLocalizedPathFromPathname = (
  pathname: string,
  targetLocale: Locale
): string | null => {
  const routeId = getRouteIdFromPath(pathname);

  if (routeId === null) {
    return null;
  }

  return getLocalizedPath(routeId, targetLocale);
};

export const getAlternateLocaleLinks = (
  pathname: string,
  baseUrl: string
): AlternateLocaleLink[] => {
  const routeId = getRouteIdFromPath(pathname);

  if (routeId === null) {
    return [];
  }

  return SUPPORTED_LOCALES.flatMap((locale) => {
    const path = getLocalizedPath(routeId, locale);
    return path === null ? [] : [{ locale, href: toAbsoluteUrl(path, baseUrl) }];
  });
};

export const isLocalizedRoute = (pathname: string): boolean =>
  getRouteIdFromPath(pathname) !== null;
