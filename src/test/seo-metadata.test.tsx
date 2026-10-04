import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { actualitesArticlesByRecency } from '../content/actualitesArticles';
import {
  getAllArticleStructuredData,
  getArticleStructuredData,
} from '../content/articleStructuredData';
import { IMAGE_ALT_TEXT, getImageAltText } from '../content/imageAltText';
import { IMAGE_MANIFEST } from '../content/imageManifest';
import { DORDOGNE_LOCAL_LANDING_PAGE_V6 } from '../content/local/v6Pages';
import { getLocalRegistryEntry } from '../content/local/registry';
import {
  DEFAULT_OG_IMAGE_KEY,
  SEO_MANAGED_META_KEYS,
  buildSeoMetaTags,
  getSeoMetaAttribute,
  parseRobotsDirectives,
  resolveRobotsContent,
  resolveSeoMetadata,
  type SeoMetaKey,
} from '../content/seoMetadata';
import {
  NOT_FOUND_SEO,
  NOT_FOUND_SEO_EN,
  NOT_FOUND_SEO_NL,
  SEO_ROUTES,
  SITE_URL,
  getCanonicalUrl,
  getIndexablePaths,
  getPrerenderPaths,
  getSeoAlternateLinks,
  getSeoRouteConfig,
} from '../content/seoRoutes';

const ARTICLE_PATH = '/actualites/plf-2027-meubles-tourisme';
const DORDOGNE_PATH = '/classement-meuble-tourisme-dordogne';
const DYNAMIC_SIMULATION_PATH = '/simulateur/simulation-id';
const NOT_FOUND_PATHS = ['/route-inexistante', '/en/not-ready-route', '/nl/route-inconnue'];
const EXPOSED_PATHS = [...getPrerenderPaths(), DYNAMIC_SIMULATION_PATH, ...NOT_FOUND_PATHS];

function getMetaSelector(key: SeoMetaKey): string {
  return `meta[${getSeoMetaAttribute(key)}='${key}']`;
}

function getHeadMetaContents(key: SeoMetaKey): string[] {
  return Array.from(document.head.querySelectorAll(getMetaSelector(key))).map(
    (element) => element.getAttribute('content') ?? ''
  );
}

function getMetaTagContent(pathname: string, key: SeoMetaKey): string | undefined {
  return buildSeoMetaTags(resolveSeoMetadata(pathname)).find((tag) => tag.key === key)?.content;
}

function clearSeoHead() {
  document.head
    .querySelectorAll(
      [
        ...SEO_MANAGED_META_KEYS.map(getMetaSelector),
        "link[rel='canonical']",
        "link[data-seo-alternate='true']",
        "link[data-seo-lcp-preload='true']",
        "script[type='application/ld+json']",
      ].join(',')
    )
    .forEach((element) => element.remove());
}

function renderAt(pathname: string) {
  window.history.pushState({}, 'SEO metadata test', pathname);
  return render(<App />);
}

function navigateTo(pathname: string) {
  act(() => {
    window.history.pushState({}, 'SEO metadata test', pathname);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

function expectHeadToMatchResolver(pathname: string) {
  const metadata = resolveSeoMetadata(pathname);
  const expectedContentByKey = new Map(
    buildSeoMetaTags(metadata).map((tag) => [tag.key, tag.content])
  );

  expect(document.title).toBe(metadata.title);
  expect(document.documentElement.lang).toBe(metadata.htmlLang);
  SEO_MANAGED_META_KEYS.forEach((key) => {
    const expectedContent = expectedContentByKey.get(key);
    expect(getHeadMetaContents(key), `${pathname} ${key}`).toEqual(
      expectedContent === undefined ? [] : [expectedContent]
    );
  });

  const canonicalLinks = Array.from(document.head.querySelectorAll("link[rel='canonical']"));
  expect(canonicalLinks.map((link) => link.getAttribute('href'))).toEqual(
    metadata.canonicalUrl === null ? [] : [metadata.canonicalUrl]
  );
  expect(
    Array.from(document.head.querySelectorAll("link[data-seo-alternate='true']")).map((link) => ({
      hreflang: link.getAttribute('hreflang'),
      href: link.getAttribute('href'),
    }))
  ).toEqual(metadata.alternateLinks);
}

afterEach(() => {
  cleanup();
  clearSeoHead();
  window.history.replaceState({}, '', '/');
});

describe('central SEO metadata resolver', () => {
  it('adds large image previews only when indexing is allowed', () => {
    expect(resolveRobotsContent(undefined)).toBe('index,follow,max-image-preview:large');
    expect(resolveRobotsContent('noindex,follow')).toBe('noindex,follow');
    expect(resolveRobotsContent('none')).toBe('none');
    expect(resolveRobotsContent('index,nofollow')).toBe('index,nofollow,max-image-preview:large');
    expect(resolveRobotsContent('index,follow,max-image-preview:standard')).toBe(
      'index,follow,max-image-preview:standard'
    );
    expect(resolveRobotsContent(' INDEX , follow,index ')).toBe(
      'index,follow,max-image-preview:large'
    );
    expect(parseRobotsDirectives('noindex, follow ,noindex')).toEqual(['noindex', 'follow']);
  });

  it('resolves article Open Graph metadata from the canonical article registry', () => {
    const article = getArticleStructuredData(ARTICLE_PATH);
    expect(article).not.toBeNull();
    if (!article) return;

    const metadata = resolveSeoMetadata(ARTICLE_PATH);
    const expectedImageUrl = `${SITE_URL}${IMAGE_MANIFEST[article.imageKey].src}`;

    expect(metadata.ogType).toBe('article');
    expect(metadata.image).toEqual({
      key: article.imageKey,
      url: expectedImageUrl,
      alt: IMAGE_ALT_TEXT[article.imageKey].fr,
    });
    expect(metadata.image.url).toContain('article-plf-2027');
    expect(metadata.article?.publishedTime).toBe('2026-10-04');
    expect(metadata.article?.modifiedTime).toBe('2026-10-04');
    expect(metadata.article?.structuredData.image).toBe(metadata.image.url);
    expect(parseRobotsDirectives(metadata.robots)).toEqual(
      expect.arrayContaining(['index', 'follow', 'max-image-preview:large'])
    );
    expect(getMetaTagContent(ARTICLE_PATH, 'og:type')).toBe('article');
    expect(getMetaTagContent(ARTICLE_PATH, 'og:image:alt')).toBe(
      IMAGE_ALT_TEXT.articlePlf2027MeublesTourisme.fr
    );
    expect(getMetaTagContent(ARTICLE_PATH, 'article:published_time')).toBe('2026-10-04');
    expect(getMetaTagContent(ARTICLE_PATH, 'article:modified_time')).toBe('2026-10-04');
  });

  it.each(['/classement', '/contact'])('keeps %s as a website without article metadata', (path) => {
    const metadata = resolveSeoMetadata(path);
    const tagKeys = buildSeoMetaTags(metadata).map((tag) => tag.key);

    expect(metadata.ogType).toBe('website');
    expect(metadata.article).toBeNull();
    expect(tagKeys.filter((key) => key.startsWith('article:'))).toEqual([]);
    expect(parseRobotsDirectives(metadata.robots)).toEqual(
      expect.arrayContaining(['index', 'follow', 'max-image-preview:large'])
    );
    expect(metadata.image.key).toBe(DEFAULT_OG_IMAGE_KEY);
    expect(metadata.image.alt).toBe(IMAGE_ALT_TEXT[DEFAULT_OG_IMAGE_KEY].fr);
  });

  it('reuses the local V6 hero description for the local Open Graph image', () => {
    const metadata = resolveSeoMetadata(DORDOGNE_PATH);
    const hero = DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image;

    expect(metadata.ogType).toBe('website');
    expect(getLocalRegistryEntry('dordogne')?.seo.ogImageKey).toBe(hero.assetKey);
    expect(metadata.image.key).toBe(hero.assetKey);
    expect(metadata.image.url).toBe(`${SITE_URL}${IMAGE_MANIFEST.dordogneLaRoqueGageac.src}`);
    expect(metadata.image.alt).toBe(hero.alt);
    expect(metadata.canonicalUrl).toBe(getCanonicalUrl(DORDOGNE_PATH));
    expect(metadata.alternateLinks).toEqual(getSeoAlternateLinks(DORDOGNE_PATH));
  });

  it.each([
    ['/en/benefits-of-furnished-tourist-accommodation-classification', 'en'],
    ['/nl/voordelen-classificatie-vakantiewoning', 'nl'],
  ] as const)('exposes the canonical image alt in the route language on %s', (path, locale) => {
    const metadata = resolveSeoMetadata(path);

    expect(metadata.htmlLang).toBe(locale);
    expect(metadata.image.key).toBe('pourquoiReferencement');
    expect(metadata.image.alt).toBe(IMAGE_ALT_TEXT.pourquoiReferencement[locale]);
    expect(metadata.alternateLinks).toEqual(getSeoAlternateLinks(path));
  });

  it('keeps dynamic simulations noindex without canonical or hreflang regression', () => {
    const metadata = resolveSeoMetadata(DYNAMIC_SIMULATION_PATH);

    expect(metadata.robots).toBe('noindex,follow');
    expect(metadata.canonicalUrl).toBe(getCanonicalUrl(DYNAMIC_SIMULATION_PATH));
    expect(metadata.alternateLinks).toEqual([]);
    expect(getIndexablePaths()).not.toContain('/simulateur/:simulationId');
    expect(getPrerenderPaths()).not.toContain('/simulateur/:simulationId');
  });

  it.each(NOT_FOUND_PATHS)('keeps the 404 contract on %s', (path) => {
    const metadata = resolveSeoMetadata(path);

    expect(metadata.robots).toBe('noindex,follow');
    expect(metadata.canonicalUrl).toBeNull();
    expect(metadata.alternateLinks).toEqual([]);
    expect(metadata.includeStructuredData).toBe(false);
    expect(metadata.article).toBeNull();
    expect(metadata.ogType).toBe('website');
  });

  it('never opens indexing on a route configured as non-indexable', () => {
    [
      ...Object.values(SEO_ROUTES).filter((route) => route.indexable === false),
      NOT_FOUND_SEO,
      NOT_FOUND_SEO_EN,
      NOT_FOUND_SEO_NL,
    ].forEach((route) => {
      expect(parseRobotsDirectives(resolveRobotsContent(route.robots))).toContain('noindex');
      expect(resolveRobotsContent(route.robots)).not.toContain('max-image-preview');
    });
  });

  it.each(EXPOSED_PATHS)(
    'exposes the canonical alt of the resolved image in the route language on %s',
    (path) => {
      const metadata = resolveSeoMetadata(path);
      const canonicalAlt = getImageAltText(metadata.image.key, metadata.htmlLang);
      const fallbackAlt = getImageAltText(DEFAULT_OG_IMAGE_KEY, metadata.htmlLang);
      const tagKeys = buildSeoMetaTags(metadata).map((tag) => tag.key);

      expect(canonicalAlt?.trim()).toBeTruthy();
      expect(metadata.image.alt).toBe(canonicalAlt);
      expect(getMetaTagContent(path, 'og:image:alt')).toBe(canonicalAlt);
      expect(new Set(tagKeys).size).toBe(tagKeys.length);
      if (metadata.image.key !== DEFAULT_OG_IMAGE_KEY) {
        expect(metadata.image.alt).not.toBe(fallbackAlt);
      }
    }
  );

  it('gives every editorial image exposed in Open Graph or article data an explicit description', () => {
    getAllArticleStructuredData().forEach((article) => {
      const routeOgImageKey = getSeoRouteConfig(article.path).ogImageKey;

      expect(IMAGE_ALT_TEXT[article.imageKey].fr.trim()).not.toBe('');
      expect(resolveSeoMetadata(article.path).ogType).toBe('article');
      expect([undefined, article.imageKey]).toContain(routeOgImageKey);
    });

    Object.values(SEO_ROUTES).forEach((route) => {
      if (route.ogImageKey) {
        expect(getImageAltText(route.ogImageKey, route.locale ?? 'fr')?.trim()).toBeTruthy();
      }
    });
  });
});

describe('runtime SEO head', () => {
  it.each([
    ARTICLE_PATH,
    '/classement',
    DORDOGNE_PATH,
    '/nl/voordelen-classificatie-vakantiewoning',
    '/route-inexistante',
  ])('renders exactly the resolved SEO head on %s', (path) => {
    renderAt(path);
    expectHeadToMatchResolver(path);
  });

  it('cleans conditional article metadata during SPA navigation', () => {
    renderAt(ARTICLE_PATH);
    expect(getHeadMetaContents('og:type')).toEqual(['article']);
    expect(getHeadMetaContents('article:published_time')).toEqual(['2026-10-04']);

    fireEvent.click(screen.getByRole('link', { name: 'Retour aux actualités' }));

    expect(window.location.pathname).toBe('/actualites');
    expect(document.head.querySelectorAll("meta[property^='article:']")).toHaveLength(0);
    expect(getHeadMetaContents('og:type')).toEqual(['website']);
    expect(getHeadMetaContents('og:image')).toEqual([
      `${SITE_URL}${IMAGE_MANIFEST[DEFAULT_OG_IMAGE_KEY].src}`,
    ]);
    expect(getHeadMetaContents('og:image:alt')).toEqual([IMAGE_ALT_TEXT[DEFAULT_OG_IMAGE_KEY].fr]);
    expectHeadToMatchResolver('/actualites');

    navigateTo(DORDOGNE_PATH);
    expect(getHeadMetaContents('og:image')).toEqual([
      `${SITE_URL}${IMAGE_MANIFEST.dordogneLaRoqueGageac.src}`,
    ]);
    expect(getHeadMetaContents('og:image:alt')).toEqual([
      DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.image.alt,
    ]);
    expectHeadToMatchResolver(DORDOGNE_PATH);

    navigateTo(ARTICLE_PATH);
    navigateTo('/contact');
    expect(document.head.querySelectorAll("meta[property^='article:']")).toHaveLength(0);
    expectHeadToMatchResolver('/contact');
  });

  it('uses the canonical image alt on every Actualités card instead of the title', () => {
    renderAt('/actualites');

    actualitesArticlesByRecency.forEach((article) => {
      const link = screen.getByRole('link', { name: `Lire l’article ${article.title}` });

      expect(link.querySelector('img')).toHaveAttribute('alt', IMAGE_ALT_TEXT[article.imageKey].fr);
    });
  });
});
