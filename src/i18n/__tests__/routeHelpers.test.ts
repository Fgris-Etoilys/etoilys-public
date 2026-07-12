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
  nl?: string;
}> = [
  { routeId: 'home', fr: '/', en: '/en', nl: '/nl' },
  {
    routeId: 'classement',
    fr: '/classement',
    en: '/en/furnished-tourist-accommodation-classification',
    nl: '/nl/classificatie-vakantiewoning-frankrijk',
  },
  {
    routeId: 'avantages',
    fr: '/les-avantages-du-classement',
    en: '/en/benefits-of-furnished-tourist-accommodation-classification',
    nl: '/nl/voordelen-classificatie-vakantiewoning',
  },
  {
    routeId: 'prerequis',
    fr: '/prerequis-au-classement',
    en: '/en/classification-requirements',
    nl: '/nl/voorwaarden-classificatie-vakantiewoning',
  },
  {
    routeId: 'procedure',
    fr: '/procedure',
    en: '/en/classification-process',
    nl: '/nl/classificatieprocedure-vakantiewoning',
  },
  { routeId: 'faq', fr: '/faq', en: '/en/faq', nl: '/nl/faq' },
  { routeId: 'contact', fr: '/contact', en: '/en/contact', nl: '/nl/contact' },
  {
    routeId: 'demandeClassement',
    fr: '/demande-classement',
    en: '/en/request-a-classification',
    nl: '/nl/classificatie-aanvragen',
  },
  {
    routeId: 'confidentialite',
    fr: '/confidentialite',
    en: '/en/privacy-policy',
    nl: '/nl/privacybeleid',
  },
  {
    routeId: 'simulateurTaxeSejour',
    fr: '/simulateur-taxe-sejour',
    en: '/en/tourist-tax-simulator',
  },
  {
    routeId: 'simulateurFiscalClassement',
    fr: '/simulateur-fiscal-classement',
    en: '/en/furnished-tourist-accommodation-tax-simulator',
  },
];

describe('i18n route helpers', () => {
  it('detects the active locale from explicit /en URLs only', () => {
    expect(getLocaleFromPath('/')).toBe('fr');
    expect(getLocaleFromPath('/classement')).toBe('fr');
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/contact')).toBe('en');
    expect(getLocaleFromPath('/nl')).toBe('nl');
    expect(getLocaleFromPath('/nl/contact')).toBe('nl');
    expect(getLocaleFromPath('/enquete')).toBe('fr');
    expect(getLocaleFromPath('/nligne')).toBe('fr');
  });

  it('normalizes /en and trailing slashes when resolving route IDs', () => {
    expect(getRouteIdFromPath('/en')).toBe('home');
    expect(getRouteIdFromPath('/en/')).toBe('home');
    expect(getRouteIdFromPath('/procedure/')).toBe('procedure');
    expect(getRouteIdFromPath('/en/classification-process/')).toBe('procedure');
    expect(getRouteIdFromPath('/nl/classificatieprocedure-vakantiewoning/')).toBe('procedure');
  });

  it('resolves every MVP route ID from French and English paths', () => {
    localizedRouteCases.forEach(({ routeId, fr, en, nl }) => {
      expect(getRouteIdFromPath(fr)).toBe(routeId);
      expect(getRouteIdFromPath(en)).toBe(routeId);
      if (nl) {
        expect(getRouteIdFromPath(nl)).toBe(routeId);
      }
    });
  });

  it('returns localized paths from the central route table', () => {
    localizedRouteCases.forEach(({ routeId, fr, en, nl }) => {
      expect(getLocalizedPath(routeId, 'fr')).toBe(fr);
      expect(getLocalizedPath(routeId, 'en')).toBe(en);
      expect(localizedRoutes[routeId].fr).toBe(fr);
      expect(localizedRoutes[routeId].en).toBe(en);
      expect(getLocalizedPath(routeId, 'nl')).toBe(nl ?? null);
    });
  });

  it('returns the direct equivalent path from an existing localized pathname', () => {
    expect(getLocalizedPathFromPathname('/', 'en')).toBe('/en');
    expect(getLocalizedPathFromPathname('/en/', 'en')).toBe('/en');
    expect(getLocalizedPathFromPathname('/procedure', 'en')).toBe('/en/classification-process');
    expect(getLocalizedPathFromPathname('/en/classification-process', 'fr')).toBe('/procedure');
    expect(getLocalizedPathFromPathname('/procedure', 'nl')).toBe(
      '/nl/classificatieprocedure-vakantiewoning'
    );
    expect(getLocalizedPathFromPathname('/nl/classificatieprocedure-vakantiewoning', 'en')).toBe(
      '/en/classification-process'
    );
    expect(getLocalizedPathFromPathname('/en/contact/', 'fr')).toBe('/contact');
    expect(getLocalizedPathFromPathname('/confidentialite', 'en')).toBe('/en/privacy-policy');
    expect(getLocalizedPathFromPathname('/confidentialite', 'nl')).toBe('/nl/privacybeleid');
  });

  it('returns null for paths without localized MVP equivalents', () => {
    expect(getLocalizedPathFromPathname('/actualites', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/simulateur', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/simulateur-taxe-sejour', 'nl')).toBeNull();
    expect(getLocalizedPathFromPathname('/classement-meuble-tourisme-dordogne', 'en')).toBeNull();
    expect(getLocalizedPathFromPathname('/url-inconnue', 'en')).toBeNull();
  });

  it('builds reciprocal absolute alternate locale links without double slashes', () => {
    expect(getAlternateLocaleLinks('/procedure', 'https://www.etoilys.fr/')).toEqual([
      { locale: 'fr', href: 'https://www.etoilys.fr/procedure' },
      { locale: 'en', href: 'https://www.etoilys.fr/en/classification-process' },
      { locale: 'nl', href: 'https://www.etoilys.fr/nl/classificatieprocedure-vakantiewoning' },
    ]);

    expect(getAlternateLocaleLinks('/en/classification-process', 'https://www.etoilys.fr')).toEqual(
      [
        { locale: 'fr', href: 'https://www.etoilys.fr/procedure' },
        { locale: 'en', href: 'https://www.etoilys.fr/en/classification-process' },
        { locale: 'nl', href: 'https://www.etoilys.fr/nl/classificatieprocedure-vakantiewoning' },
      ]
    );

    expect(getAlternateLocaleLinks('/en/tourist-tax-simulator', 'https://www.etoilys.fr')).toEqual([
      { locale: 'fr', href: 'https://www.etoilys.fr/simulateur-taxe-sejour' },
      { locale: 'en', href: 'https://www.etoilys.fr/en/tourist-tax-simulator' },
    ]);
  });

  it('returns no alternate locale links for unknown or non-MVP paths', () => {
    expect(getAlternateLocaleLinks('/actualites', 'https://www.etoilys.fr/')).toEqual([]);
    expect(getAlternateLocaleLinks('/url-inconnue', 'https://www.etoilys.fr/')).toEqual([]);
  });

  it('distinguishes MVP localized routes from routes outside the MVP', () => {
    expect(isLocalizedRoute('/')).toBe(true);
    expect(isLocalizedRoute('/en/faq')).toBe(true);
    expect(isLocalizedRoute('/nl/faq')).toBe(true);
    expect(isLocalizedRoute('/simulateur')).toBe(false);
    expect(isLocalizedRoute('/actualites')).toBe(false);
    expect(isLocalizedRoute('/url-inconnue')).toBe(false);
  });
});
