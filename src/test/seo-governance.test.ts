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
import { getArticleStructuredData } from '../content/articleStructuredData';
import { getSitemapLastModified, isValidIsoDateOnly } from '../content/sitemapLastmod';
import { localizedRoutes } from '../i18n/localizedRoutes';
import { EN_MVP_PATH_COUNT, EN_MVP_PATHS } from './i18nMvpTestData';

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function isEnglishPath(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/');
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

function extractSitemapLastmods(xml: string): Map<string, string> {
  const entries = new Map<string, string>();
  const regex = /<url>([\s\S]*?)<\/url>/g;
  let match = regex.exec(xml);

  while (match) {
    const block = match[1] ?? '';
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];

    if (loc !== undefined && lastmod !== undefined) {
      entries.set(loc, lastmod);
    }

    match = regex.exec(xml);
  }

  return entries;
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
    const englishSitemapUrls = sitemapUrls.filter((url) => isEnglishPath(new URL(url).pathname));

    expect(sitemapUrls).toEqual(expectedUrls);
    expect(sitemapXml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(englishSitemapUrls).toHaveLength(EN_MVP_PATH_COUNT);
    EN_MVP_PATHS.forEach((pathname) => {
      expect(sitemapUrls).toContain(getCanonicalUrl(pathname));
      expect(sitemapXml).toContain(`href="${getCanonicalUrl(pathname)}"`);
    });
    expect(sitemapUrls).not.toContain(`${SITE_URL}/404`);
  });

  it('keeps sitemap lastmod complete, controlled and canonical', () => {
    const sitemapXml = readFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), 'utf8');
    const lastmods = extractSitemapLastmods(sitemapXml);
    const expectedPaths = getIndexablePaths();

    expect(lastmods.size).toBe(expectedPaths.length);

    expectedPaths.forEach((pathname) => {
      const canonicalUrl = getCanonicalUrl(pathname);
      const lastmod = lastmods.get(canonicalUrl);

      expect(lastmod).toBe(getSitemapLastModified(pathname));
      expect(isValidIsoDateOnly(lastmod ?? '')).toBe(true);
    });

    const articlePath = '/actualites/micro-bic-2026-meuble-classe-vs-non-classe';
    const article = getArticleStructuredData(articlePath);
    expect(lastmods.get(getCanonicalUrl(articlePath))).toBe(article?.dateModified);
    expect(lastmods.get(getCanonicalUrl('/actualites'))).toBe('2026-07-08');
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

  it('keeps unknown English routes noindex and out of sitemap/prerender', () => {
    const pathname = '/en/not-ready-route';
    const seoConfig = getSeoRouteConfig(pathname);

    expect(seoConfig.locale).toBe('en');
    expect(seoConfig.title).toBe('Page not found');
    expect(seoConfig.robots).toBe('noindex,follow');
    expect(seoConfig.indexable).toBe(false);
    expect(seoConfig.prerender).toBe(false);
    expect(seoConfig.includeCanonical).toBe(false);
    expect(seoConfig.includeStructuredData).toBe(false);
    expect(seoConfig.isNotFound).toBe(true);
    expect(getHtmlLang(pathname)).toBe('en');
    expect(getSeoAlternateLinks(pathname)).toEqual([]);
    expect(getIndexablePaths()).not.toContain(pathname);
    expect(getPrerenderPaths()).not.toContain(pathname);
  });

  it('keeps unknown French routes noindex without canonical or hreflang', () => {
    const pathname = '/route-inexistante';
    const seoConfig = getSeoRouteConfig(pathname);

    expect(seoConfig.locale).toBe('fr');
    expect(seoConfig.title).toBe('Page non trouvée');
    expect(seoConfig.robots).toBe('noindex,follow');
    expect(seoConfig.indexable).toBe(false);
    expect(seoConfig.prerender).toBe(false);
    expect(seoConfig.includeCanonical).toBe(false);
    expect(seoConfig.includeStructuredData).toBe(false);
    expect(seoConfig.isNotFound).toBe(true);
    expect(getHtmlLang(pathname)).toBe('fr');
    expect(getSeoAlternateLinks(pathname)).toEqual([]);
  });

  it('makes all completed English MVP routes indexable and prerenderable', () => {
    const englishIndexablePaths = getIndexablePaths().filter(isEnglishPath);
    const englishPrerenderPaths = getPrerenderPaths().filter(isEnglishPath);

    expect(englishIndexablePaths).toHaveLength(EN_MVP_PATH_COUNT);
    expect(englishPrerenderPaths).toHaveLength(EN_MVP_PATH_COUNT);

    EN_MVP_PATHS.forEach((pathname) => {
      const seoConfig = getSeoRouteConfig(pathname);

      expect(seoConfig.locale).toBe('en');
      expect(seoConfig.robots).toBeUndefined();
      expect(seoConfig.indexable ?? true).toBe(true);
      expect(seoConfig.prerender ?? true).toBe(true);
      expect(getIndexablePaths()).toContain(pathname);
      expect(getPrerenderPaths()).toContain(pathname);
    });
  });

  it('exposes reciprocal hreflang for every completed English MVP route', () => {
    Object.values(localizedRoutes).forEach(({ fr, en }) => {
      const expectedAlternates = [
        { hreflang: 'fr', href: getCanonicalUrl(fr) },
        { hreflang: 'en', href: getCanonicalUrl(en) },
        { hreflang: 'x-default', href: getCanonicalUrl(fr) },
      ];

      expect(getSeoAlternateLinks(fr)).toEqual(expectedAlternates);
      expect(getSeoAlternateLinks(en)).toEqual(expectedAlternates);
    });
  });

  it('does not expose English alternates from French routes outside the MVP', () => {
    [
      '/actualites',
      '/simulateur',
      '/zones-intervention',
      '/classement-meuble-tourisme-dordogne',
      '/classement-meuble-tourisme-gironde',
      '/classement-meuble-tourisme-lot-et-garonne',
      '/recrutement',
      '/mentions-legales',
    ].forEach((pathname) => {
      expect(getSeoAlternateLinks(pathname)).toEqual([]);
    });
  });

  it('exposes self-referencing canonical URLs and html lang for English MVP routes', () => {
    expect(getCanonicalUrl('/en')).toBe(`${SITE_URL}/en`);
    expect(getCanonicalUrl('/en/')).toBe(`${SITE_URL}/en`);
    EN_MVP_PATHS.forEach((pathname) => {
      expect(getCanonicalUrl(pathname)).toBe(`${SITE_URL}${pathname}`);
      expect(getHtmlLang(pathname)).toBe('en');
    });
    expect(getHtmlLang('/enquete')).toBe('fr');
  });
});
