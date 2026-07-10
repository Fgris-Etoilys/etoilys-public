import { describe, expect, it } from 'vitest';
import { localizedRoutes, type LocalizedRouteId } from '../localizedRoutes';
import {
  getAlternateLocaleLinks,
  getLocaleFromPath,
  getLocalizedPath,
  getLocalizedPathFromPathname,
  getRouteIdFromPath,
  isLocalizedRoute,
} from '../routeHelpers';

const localizedRouteCases: Array<{
  routeId: LocalizedRouteId;
  fr: string;
  en: string;
}> = [
  { routeId: 'home', fr: '/', en: '/en' },
  {
    routeId: 'classement',
    fr: '/classement',
    en: '/en/furnished-tourist-accommodation-classification',
  },
  {
    routeId: 'avantages',
    fr: '/les-avantages-du-classement',
    en: '/en/benefits-of-furnished-tourist-accommodation-classification',
  },
  {
    routeId: 'prerequis',
    fr: '/prerequis-au-classement',
    en: '/en/classification-requirements',
  },
  { routeId: 'procedure', fr: '/procedure', en: '/en/classification-process' },
  { routeId: 'faq', fr: '/faq', en: '/en/faq' },
  { routeId: 'contact', fr: '/contact', en: '/en/contact' },
  {
    routeId: 'demandeClassement',
    fr: '/demande-classement',
    en: '/en/request-a-classification',
  },
  { routeId: 'confidentialite', fr: '/confidentialite', en: '/en/privacy-policy' },
];

describe('i18n route helpers', () => {
  it('detects the active locale from explicit /en URLs only', () => {
    expect(getLocaleFromPath('/')).toBe('fr');
    expect(getLocaleFromPath('/classement')).toBe('fr');
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/contact')).toBe('en');
    expect(getLocaleFromPath('/enquete')).toBe('fr');
  });

  it('normalizes /en and trailing slashes when resolving route IDs', () => {
    expect(getRouteIdFromPath('/en')).toBe('home');
    expect(getRouteIdFromPath('/en/')).toBe('home');
    expect(getRouteIdFromPath('/procedure/')).toBe('procedure');
    expect(getRouteIdFromPath('/en/classification-process/')).toBe('procedure');
  });

  it('resolves every MVP route ID from French and English paths', () => {
    localizedRouteCases.forEach(({ routeId, fr, en }) => {
      expect(getRouteIdFromPath(fr)).toBe(routeId);
      expect(getRouteIdFromPath(en)).toBe(routeId);
    });
  });

  it('returns localized paths from the central route table', () => {
    localizedRouteCases.forEach(({ routeId, fr, en }) => {
      expect(getLocalizedPath(routeId, 'fr')).toBe(fr);
      expect(getLocalizedPath(routeId, 'en')).toBe(en);
      expect(localizedRoutes[routeId].fr).toBe(fr);
      expect(localizedRoutes[routeId].en).toBe(en);
    });
  });

  it('returns the direct equivalent path from an existing localized pathname', () => {
    expect(getLocalizedPathFromPathname('/', 'en')).toBe('/en');
    expect(getLocalizedPathFromPathname('/en/', 'en')).toBe('/en');
    expect(getLocalizedPathFromPathname('/procedure', 'en')).toBe('/en/classification-process');
    expect(getLocalizedPathFromPathname('/en/classification-process', 'fr')).toBe('/procedure');
    expect(getLocalizedPathFromPathname('/en/contact/', 'fr')).toBe('/contact');
    expect(getLocalizedPathFromPathname('/confidentialite', 'en')).toBe('/en/privacy-policy');
  });

  it('returns null for paths without localized MVP equivalents', () => {
    expect(getLocalizedPathFromPathname('/actualites', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/simulateur', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/classement-meuble-tourisme-dordogne', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/url-inconnue', 'en')).toBeNull();
  });

  it('builds reciprocal absolute alternate locale links without double slashes', () => {
    expect(getAlternateLocaleLinks('/procedure', 'https://www.etoilys.fr/')).toEqual([
      { locale: 'fr', href: 'https://www.etoilys.fr/procedure' },
      { locale: 'en', href: 'https://www.etoilys.fr/en/classification-process' },
    ]);

    expect(getAlternateLocaleLinks('/en/classification-process', 'https://www.etoilys.fr')).toEqual(
      [
        { locale: 'fr', href: 'https://www.etoilys.fr/procedure' },
        { locale: 'en', href: 'https://www.etoilys.fr/en/classification-process' },
      ]
    );
  });

  it('returns no alternate locale links for unknown or non-MVP paths', () => {
    expect(getAlternateLocaleLinks('/actualites', 'https://www.etoilys.fr/')).toEqual([]);
    expect(getAlternateLocaleLinks('/url-inconnue', 'https://www.etoilys.fr/')).toEqual([]);
  });

  it('distinguishes MVP localized routes from routes outside the MVP', () => {
    expect(isLocalizedRoute('/')).toBe(true);
    expect(isLocalizedRoute('/en/faq')).toBe(true);
    expect(isLocalizedRoute('/simulateur')).toBe(false);
    expect(isLocalizedRoute('/actualites')).toBe(false);
    expect(isLocalizedRoute('/url-inconnue')).toBe(false);
  });
});
