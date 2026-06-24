import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getAllKnownPaths,
  getCanonicalUrl,
  getHtmlLang,
  getIndexablePaths,
  getPrerenderPaths,
  getSeoRouteConfig,
  getSeoAlternateLinks,
  SITE_URL,
} from '../content/seoRoutes';
import { EN_CONTENT_READY } from '../i18n/locales';

const EN_MVP_PATHS = [
  '/en/',
  '/en/furnished-tourist-accommodation-classification',
  '/en/benefits-of-furnished-tourist-accommodation-classification',
  '/en/classification-requirements',
  '/en/classification-process',
  '/en/faq',
  '/en/contact',
  '/en/request-a-classification',
  '/en/privacy-policy',
] as const;

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function extractSitemapUrls(xml: string): string[] {
  const regex = /<loc>(.*?)<\/loc>/g;
  const urls: string[] = [];
  let match = regex.exec(xml);
  while (match) {
    const url = match[1];
    if (url) {
      urls.push(url);
    }
    match = regex.exec(xml);
  }
  return urls;
}

function extractActiveAppPaths(): string[] {
  const appSource = readFileSync(path.resolve(process.cwd(), 'src', 'AppRoutes.tsx'), 'utf8');
  const noLineComments = appSource.replace(/\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const matches = [...noBlockComments.matchAll(/<Route\s+path="([^"]+)"/g)];
  const paths = matches
    .map((match) => match[1])
    .filter((routePath): routePath is string => routePath !== undefined)
    .filter((routePath) => routePath !== '*')
    .map((routePath) => normalizePath(routePath.startsWith('/') ? routePath : `/${routePath}`));

  return ['/'].concat(paths);
}

describe('seo governance', () => {
  it('covers all active app routes in seo config', () => {
    const seoPaths = new Set(getAllKnownPaths().map(normalizePath));
    const appPaths = extractActiveAppPaths();

    appPaths.forEach((pathname) => {
      expect(seoPaths.has(pathname)).toBe(true);
    });
  });

  it('keeps sitemap aligned with indexable routes', () => {
    const sitemapXml = readFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), 'utf8');
    const sitemapUrls = extractSitemapUrls(sitemapXml).sort();
    const expectedUrls = getIndexablePaths()
      .map((pathname) => getCanonicalUrl(pathname))
      .sort();

    expect(sitemapUrls).toEqual(expectedUrls);
    expect(sitemapXml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(sitemapUrls.some((url) => url.includes('/en/'))).toBe(false);
    expect(sitemapXml).not.toMatch(/<xhtml:link[^>]+href="https:\/\/www\.etoilys\.fr\/en\//);
  });

  it('keeps prerender paths aligned with indexable routes', () => {
    const indexablePaths = new Set(getIndexablePaths().map(normalizePath));
    const prerenderPaths = getPrerenderPaths().map(normalizePath);

    prerenderPaths.forEach((pathname) => {
      expect(indexablePaths.has(pathname)).toBe(true);
    });
  });

  it('keeps dynamic public simulations noindex and out of the sitemap', () => {
    const dynamicSimulationSeo = getSeoRouteConfig('/simulateur/simulation-id');

    expect(dynamicSimulationSeo.robots).toBe('noindex,follow');
    expect(dynamicSimulationSeo.indexable).toBe(false);
    expect(getIndexablePaths()).not.toContain('/simulateur/:simulationId');
  });

  it('keeps English MVP routes noindex while English content is not ready', () => {
    expect(EN_CONTENT_READY).toBe(false);

    EN_MVP_PATHS.forEach((pathname) => {
      const seoConfig = getSeoRouteConfig(pathname);

      expect(seoConfig.locale).toBe('en');
      expect(seoConfig.robots).toBe('noindex,follow');
      expect(seoConfig.indexable).toBe(false);
      expect(seoConfig.prerender).toBe(false);
      expect(getIndexablePaths()).not.toContain(pathname);
      expect(getPrerenderPaths()).not.toContain(pathname);
    });
  });

  it('does not expose hreflang to noindex English pages', () => {
    expect(getSeoAlternateLinks('/procedure')).toEqual([]);
    expect(getSeoAlternateLinks('/en/classification-process')).toEqual([]);
  });

  it('exposes canonical URLs and html lang for technical English routes', () => {
    expect(getCanonicalUrl('/en')).toBe(`${SITE_URL}/en/`);
    expect(getCanonicalUrl('/en/contact')).toBe(`${SITE_URL}/en/contact`);
    expect(getHtmlLang('/en/contact')).toBe('en');
    expect(getHtmlLang('/enquete')).toBe('fr');
  });
});
