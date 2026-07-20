import React from 'react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import AppRoutes from '../src/AppRoutes.tsx';
import {
  SITE_NAME,
  SITE_URL,
  getBreadcrumbItems,
  getCanonicalUrl,
  getHtmlLang,
  getOgLocale,
  getIndexablePaths,
  getPrerenderPaths,
  getSeoRouteConfig,
  getSeoAlternateLinks,
  getSeoTitle,
} from '../src/content/seoRoutes.ts';
import { getArticleStructuredData } from '../src/content/articleStructuredData.ts';
import { IMAGE_MANIFEST } from '../src/content/imageManifest.ts';
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData as buildBreadcrumbStructuredDataFromItems,
  buildPageStructuredData,
} from '../src/content/structuredData.ts';
import { EN_INDEXABLE_ROUTE_IDS, NL_INDEXABLE_ROUTE_IDS } from '../src/i18n/contentReadiness.ts';
import { localizedRoutes } from '../src/i18n/localizedRoutes.ts';

const NOT_FOUND_PRERENDER_PATH = '/404';
const EN_NOT_FOUND_RENDER_PATH = '/en/route-inexistante';
const EN_NOT_FOUND_OUTPUT_PATH = 'en/404.html';
const NL_NOT_FOUND_RENDER_PATH = '/nl/route-inconnue';
const NL_NOT_FOUND_OUTPUT_PATH = 'nl/404.html';
const DYNAMIC_SIMULATION_RENDER_PATH = '/simulateur/seo-shell';
const DYNAMIC_SIMULATION_SHELL_OUTPUT = 'simulation-noindex.html';
const OG_IMAGE_ALT_BY_LANG = {
  fr: 'Etoilys - Classement des meublés de tourisme',
  en: 'Etoilys - Furnished tourist accommodation classification',
  nl: 'Etoilys - Classificatie van vakantiewoningen in Frankrijk',
} as const;
const ROOT_PLACEHOLDER_PATTERN = /<div id="root"><\/div>/i;
const ROOT_CONTAINER_PATTERN = /<div id="root">[\s\S]*<\/div>\s*<\/body>/i;
const ROOT_CONTENT_PATTERN = /<div id="root">([\s\S]*)<\/div>\s*<\/body>/i;
const EN_MVP_PRERENDER_PATHS = new Set(
  EN_INDEXABLE_ROUTE_IDS.map((routeId) => localizedRoutes[routeId].en)
);
const NL_MVP_PRERENDER_PATHS = new Set(
  NL_INDEXABLE_ROUTE_IDS.map((routeId) => localizedRoutes[routeId].nl)
);
const FORBIDDEN_EN_MVP_INTERNAL_LINK_PATTERNS = [
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
const FORBIDDEN_EN_MVP_VISIBLE_TEXT_PATTERN =
  /nos dernières actualités|actualités|latest news|news articles|zones d’intervention|service areas|recrutement|recruitment|mentions légales|legal notice/i;
const FORBIDDEN_NL_MVP_INTERNAL_LINK_PATTERNS = [
  /^\/nl\/actualites(?:\/|$)/,
  /^\/nl\/simulateur(?:\/|-|$)/,
  /^\/nl\/simulators(?:\/|$)/,
  /^\/nl\/classification-simulator(?:\/|$)/,
  /^\/nl\/tourist-tax-simulator(?:\/|$)/,
  /^\/nl\/zones(?:\/|-|$)/,
  /^\/nl\/recrutement(?:\/|$)/,
  /^\/nl\/mentions-legales(?:\/|$)/,
] as const;
const FORBIDDEN_NL_MVP_VISIBLE_TEXT_PATTERN =
  /actualités|nieuws|recrutement|werving|mentions légales|juridische vermeldingen/i;

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function resolveOutputPath(distDir: string, routePath: string): string {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }
  if (routePath === NOT_FOUND_PRERENDER_PATH) {
    return path.join(distDir, '404.html');
  }

  const trimmed = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, trimmed, 'index.html');
}

function ensureDoctype(html: string): string {
  if (html.toLowerCase().startsWith('<!doctype html>')) {
    return html;
  }
  return `<!DOCTYPE html>\n${html}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function buildBreadcrumbStructuredData(pathname: string): Record<string, unknown> | null {
  return buildBreadcrumbStructuredDataFromItems(getBreadcrumbItems(pathname));
}

function buildArticleStructuredDataForPath(pathname: string): Record<string, unknown> | null {
  const article = getArticleStructuredData(pathname);
  if (!article) {
    return null;
  }

  return buildArticleStructuredData({
    url: `${SITE_URL}${article.path}`,
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: `${SITE_URL}${IMAGE_MANIFEST[article.imageKey].src}`,
    authorId: article.authorId,
  });
}

function getOgImage(pathname: string): string {
  const seoConfig = getSeoRouteConfig(pathname);
  const article = getArticleStructuredData(pathname);
  const defaultOgImage = `${SITE_URL}${IMAGE_MANIFEST.homeHero.src}`;

  if (article) {
    return `${SITE_URL}${IMAGE_MANIFEST[article.imageKey].src}`;
  }

  if (seoConfig.ogImageKey) {
    return `${SITE_URL}${IMAGE_MANIFEST[seoConfig.ogImageKey].src}`;
  }

  return defaultOgImage;
}

function getOgImageAlt(pathname: string): string {
  return OG_IMAGE_ALT_BY_LANG[getHtmlLang(pathname)];
}

function stripSeoTags(html: string): string {
  const patterns = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta[^>]+name=['"]description['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]robots['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:title['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:description['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:url['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:type['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:site_name['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:locale['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:image['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:image:alt['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:card['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:title['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:description['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:image['"][^>]*>\s*/gi,
    /<link[^>]+rel=['"]canonical['"][^>]*>\s*/gi,
    /<link[^>]+rel=['"]alternate['"][^>]*>\s*/gi,
    /<link[^>]+data-seo-lcp-preload=['"]true['"][^>]*>\s*/gi,
    /<script[^>]+id=['"]structured-data-global['"][\s\S]*?<\/script>\s*/gi,
    /<script[^>]+id=['"]structured-data-breadcrumbs['"][\s\S]*?<\/script>\s*/gi,
    /<script[^>]+id=['"]structured-data-article['"][\s\S]*?<\/script>\s*/gi,
  ];

  let cleaned = html;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned;
}

function buildSeoHead(pathname: string): string {
  const seoConfig = getSeoRouteConfig(pathname);
  const title = getSeoTitle(seoConfig.title);
  const description = seoConfig.description;
  const robots = seoConfig.robots ?? 'index,follow';
  const currentUrl = getCanonicalUrl(pathname);
  const ogImage = getOgImage(pathname);
  const preloadImage = seoConfig.lcpImageKey ? IMAGE_MANIFEST[seoConfig.lcpImageKey] : null;
  const alternateLinks = getSeoAlternateLinks(pathname);

  const tags = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}">`,
    `    <meta name="robots" content="${escapeHtml(robots)}">`,
    `    <meta property="og:title" content="${escapeHtml(title)}">`,
    `    <meta property="og:description" content="${escapeHtml(description)}">`,
    `    <meta property="og:url" content="${escapeHtml(currentUrl)}">`,
    '    <meta property="og:type" content="website">',
    `    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `    <meta property="og:locale" content="${escapeHtml(getOgLocale(pathname))}">`,
    `    <meta property="og:image" content="${escapeHtml(ogImage)}">`,
    `    <meta property="og:image:alt" content="${escapeHtml(getOgImageAlt(pathname))}">`,
    '    <meta name="twitter:card" content="summary_large_image">',
    `    <meta name="twitter:title" content="${escapeHtml(title)}">`,
    `    <meta name="twitter:description" content="${escapeHtml(description)}">`,
    `    <meta name="twitter:image" content="${escapeHtml(ogImage)}">`,
  ];

  if (seoConfig.includeCanonical !== false) {
    tags.push(`    <link rel="canonical" href="${escapeHtml(currentUrl)}">`);
  }

  alternateLinks.forEach((alternate) => {
    tags.push(
      `    <link rel="alternate" hreflang="${escapeHtml(alternate.hreflang)}" href="${escapeHtml(alternate.href)}" data-seo-alternate="true">`
    );
  });

  if (preloadImage) {
    tags.push(
      `    <link rel="preload" as="image" href="${escapeHtml(preloadImage.src)}" imagesrcset="${escapeHtml(preloadImage.srcSetAvif)}" imagesizes="100vw" data-seo-lcp-preload="true">`
    );
  }

  if (seoConfig.includeStructuredData !== false) {
    const pageStructuredData = buildPageStructuredData(pathname);
    if (pageStructuredData) {
      tags.push(
        `    <script type="application/ld+json" id="structured-data-global">${serializeJsonLd(pageStructuredData)}</script>`
      );
    }

    const breadcrumbData = buildBreadcrumbStructuredData(pathname);
    if (breadcrumbData) {
      tags.push(
        `    <script type="application/ld+json" id="structured-data-breadcrumbs">${serializeJsonLd(breadcrumbData)}</script>`
      );
    }

    const articleData = buildArticleStructuredDataForPath(pathname);
    if (articleData) {
      tags.push(
        `    <script type="application/ld+json" id="structured-data-article">${serializeJsonLd(articleData)}</script>`
      );
    }
  }

  return tags.join('\n');
}

function injectSeoHead(templateHtml: string, pathname: string): string {
  const normalizedPath = normalizePath(pathname);
  const cleaned = stripSeoTags(ensureDoctype(templateHtml));
  const seoHead = buildSeoHead(normalizedPath);
  const withLang = cleaned.replace(/<html([^>]*)\s+lang=["'][^"']*["']([^>]*)>/i, '<html$1$2>');

  return withLang
    .replace(/<html([^>]*)>/i, `<html$1 lang="${escapeHtml(getHtmlLang(normalizedPath))}">`)
    .replace(/<\/head>/i, `${seoHead}\n  </head>`);
}

function renderAppHtml(pathname: string): string {
  return renderToString(
    React.createElement(StaticRouter, { location: pathname }, React.createElement(AppRoutes))
  );
}

function injectRootHtml(templateHtml: string, rootHtml: string): string {
  if (ROOT_PLACEHOLDER_PATTERN.test(templateHtml)) {
    return templateHtml.replace(ROOT_PLACEHOLDER_PATTERN, `<div id="root">${rootHtml}</div>`);
  }

  if (ROOT_CONTAINER_PATTERN.test(templateHtml)) {
    return templateHtml.replace(
      ROOT_CONTAINER_PATTERN,
      `<div id="root">${rootHtml}</div>\n  </body>`
    );
  }

  throw new Error('Cannot find #root container in dist/index.html.');
}

function countOccurrences(html: string, pattern: RegExp): number {
  return [...html.matchAll(pattern)].length;
}

function extractSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url));
}

function getRootContent(html: string): string {
  return ROOT_CONTENT_PATTERN.exec(html)?.[1] ?? '';
}

function getInternalHrefPath(href: string): string | null {
  if (!href.startsWith('/')) {
    return null;
  }

  return href.split(/[?#]/)[0] ?? href;
}

function isForbiddenEnglishMvpInternalHref(href: string): boolean {
  return FORBIDDEN_EN_MVP_INTERNAL_LINK_PATTERNS.some((pattern) => pattern.test(href));
}

function isForbiddenDutchMvpInternalHref(href: string): boolean {
  return FORBIDDEN_NL_MVP_INTERNAL_LINK_PATTERNS.some((pattern) => pattern.test(href));
}

function getInternalHrefs(rootContent: string): string[] {
  return [...rootContent.matchAll(/href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((href): href is string => href !== undefined)
    .map(getInternalHrefPath)
    .filter((href): href is string => href !== null);
}

function assertEnglishMvpPrerenderScope(
  pathname: string,
  rootContent: string,
  rootText: string
): void {
  if (!pathname.startsWith('/en')) {
    return;
  }

  const internalHrefs = getInternalHrefs(rootContent);
  const outOfScopeHrefs = internalHrefs.filter(
    (href) =>
      isForbiddenEnglishMvpInternalHref(href) ||
      (href.startsWith('/en/') && !EN_MVP_PRERENDER_PATHS.has(href))
  );

  if (outOfScopeHrefs.length > 0) {
    throw new Error(
      `${pathname} contains out-of-scope English MVP internal links: ${outOfScopeHrefs.join(', ')}.`
    );
  }

  if (FORBIDDEN_EN_MVP_VISIBLE_TEXT_PATTERN.test(rootText)) {
    throw new Error(`${pathname} contains visible text from an out-of-scope English MVP block.`);
  }
}

function assertDutchMvpPrerenderScope(
  pathname: string,
  rootContent: string,
  rootText: string
): void {
  if (!pathname.startsWith('/nl')) {
    return;
  }

  const internalHrefs = getInternalHrefs(rootContent);
  const outOfScopeHrefs = internalHrefs.filter(
    (href) =>
      isForbiddenDutchMvpInternalHref(href) ||
      (href.startsWith('/nl/') && !NL_MVP_PRERENDER_PATHS.has(href))
  );

  if (outOfScopeHrefs.length > 0) {
    throw new Error(
      `${pathname} contains out-of-scope Dutch MVP internal links: ${outOfScopeHrefs.join(', ')}.`
    );
  }

  if (FORBIDDEN_NL_MVP_VISIBLE_TEXT_PATTERN.test(rootText)) {
    throw new Error(`${pathname} contains visible text from an out-of-scope Dutch MVP block.`);
  }
}

function assertUniqueJsonLdIds(html: string, pathname: string): void {
  const ids = ['structured-data-global', 'structured-data-breadcrumbs', 'structured-data-article'];

  for (const id of ids) {
    const count = countOccurrences(html, new RegExp(`id=["']${id}["']`, 'g'));
    if (count > 1) {
      throw new Error(`${pathname} contains duplicated JSON-LD script id: ${id}.`);
    }
  }
}

function assertNoSeoLinksOrJsonLd(html: string, pathname: string): void {
  if (/<link[^>]+rel=["']canonical["']/i.test(html)) {
    throw new Error(`${pathname} 404 must not contain a canonical link.`);
  }
  if (/<link[^>]+rel=["']alternate["']/i.test(html)) {
    throw new Error(`${pathname} 404 must not contain hreflang alternate links.`);
  }
  if (/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
    throw new Error(`${pathname} 404 must not contain JSON-LD.`);
  }
}

function assertPrerenderedHtml(pathname: string, html: string): void {
  const rootContent = getRootContent(html);
  const rootText = rootContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const expectedCanonical = getCanonicalUrl(pathname);
  const expectedLang = getHtmlLang(pathname);
  const alternateLinks = getSeoAlternateLinks(pathname);

  if (!rootContent || /<div id="root"><\/div>/i.test(html)) {
    throw new Error(`${pathname} was prerendered with an empty #root.`);
  }
  if (rootText.length < 300) {
    throw new Error(`${pathname} prerendered body is too small (${rootText.length} chars).`);
  }
  if (!/<h1[\s>]/i.test(rootContent)) {
    throw new Error(`${pathname} prerendered body does not contain an h1.`);
  }
  assertEnglishMvpPrerenderScope(pathname, rootContent, rootText);
  assertDutchMvpPrerenderScope(pathname, rootContent, rootText);
  if (!/<title>[\s\S]+<\/title>/i.test(html)) {
    throw new Error(`${pathname} is missing a title tag.`);
  }
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) {
    throw new Error(`${pathname} is missing a meta description.`);
  }
  if (!/<meta\s+name=["']robots["']\s+content=["']index,follow["']/i.test(html)) {
    throw new Error(`${pathname} is missing index,follow robots metadata.`);
  }
  if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) {
    throw new Error(`${pathname} has an invalid canonical URL.`);
  }
  if (!new RegExp(`<html[^>]+lang=["']${expectedLang}["']`, 'i').test(html)) {
    throw new Error(`${pathname} has an invalid html lang attribute.`);
  }
  alternateLinks.forEach((alternate) => {
    const expectedAlternate = `<link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" data-seo-alternate="true">`;
    if (!html.includes(expectedAlternate)) {
      throw new Error(`${pathname} is missing alternate link ${alternate.hreflang}.`);
    }
  });

  assertUniqueJsonLdIds(html, pathname);
}

function assertPrerenderedNotFoundHtml(pathname: string, html: string): void {
  const rootContent = getRootContent(html);
  const rootText = rootContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const expectedLang = getHtmlLang(pathname);
  const expectedHeading = expectedLang === 'en' ? 'Page not found' : 'Page non trouvée';

  if (!rootContent || /<div id="root"><\/div>/i.test(html)) {
    throw new Error(`${pathname} 404 was prerendered with an empty #root.`);
  }
  if (
    !rootText.includes(expectedHeading) &&
    !(expectedLang === 'nl' && rootText.includes('Pagina niet gevonden'))
  ) {
    throw new Error(`${pathname} 404 is missing localized heading ${expectedHeading}.`);
  }
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(html)) {
    throw new Error(`${pathname} 404 is missing noindex,follow robots metadata.`);
  }
  if (!new RegExp(`<html[^>]+lang=["']${expectedLang}["']`, 'i').test(html)) {
    throw new Error(`${pathname} 404 has an invalid html lang attribute.`);
  }

  assertNoSeoLinksOrJsonLd(html, pathname);
}

async function assertSitemapMatchesIndexableRoutes(): Promise<void> {
  const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const sitemapUrls = extractSitemapUrls(sitemapXml).sort();
  const expectedUrls = getIndexablePaths()
    .map((pathname) => (pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`))
    .sort();

  if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) {
    throw new Error('public/sitemap.xml is not aligned with indexable SEO routes.');
  }
}

async function prerenderRoute(
  distDir: string,
  templateHtml: string,
  routePath: string,
  outputPathOverride?: string
) {
  const normalizedPath = normalizePath(routePath);
  const outputPath = outputPathOverride ?? resolveOutputPath(distDir, normalizedPath);
  const rootHtml = renderAppHtml(normalizedPath);
  const htmlWithRoot = injectRootHtml(templateHtml, rootHtml);
  const html = injectSeoHead(htmlWithRoot, normalizedPath);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');

  return { html, outputPath, pathname: normalizedPath };
}

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');
  const templateHtml = await readFile(templatePath, 'utf8');
  const routes = getPrerenderPaths();

  await assertSitemapMatchesIndexableRoutes();

  for (const routePath of routes) {
    const result = await prerenderRoute(distDir, templateHtml, routePath);
    assertPrerenderedHtml(result.pathname, result.html);
    console.log(`Prerendered: ${result.pathname} -> ${result.outputPath}`);
  }

  const notFound = await prerenderRoute(distDir, templateHtml, NOT_FOUND_PRERENDER_PATH);
  assertPrerenderedNotFoundHtml(notFound.pathname, notFound.html);
  assertUniqueJsonLdIds(notFound.html, NOT_FOUND_PRERENDER_PATH);
  console.log(`Prerendered: ${NOT_FOUND_PRERENDER_PATH} -> ${notFound.outputPath}`);

  const englishNotFoundOutputPath = path.join(distDir, EN_NOT_FOUND_OUTPUT_PATH);
  const englishNotFound = await prerenderRoute(
    distDir,
    templateHtml,
    EN_NOT_FOUND_RENDER_PATH,
    englishNotFoundOutputPath
  );
  assertPrerenderedNotFoundHtml(englishNotFound.pathname, englishNotFound.html);
  assertUniqueJsonLdIds(englishNotFound.html, EN_NOT_FOUND_RENDER_PATH);
  console.log(`Prerendered: ${EN_NOT_FOUND_RENDER_PATH} -> ${englishNotFoundOutputPath}`);

  const dutchNotFoundOutputPath = path.join(distDir, NL_NOT_FOUND_OUTPUT_PATH);
  const dutchNotFound = await prerenderRoute(
    distDir,
    templateHtml,
    NL_NOT_FOUND_RENDER_PATH,
    dutchNotFoundOutputPath
  );
  assertPrerenderedNotFoundHtml(dutchNotFound.pathname, dutchNotFound.html);
  assertUniqueJsonLdIds(dutchNotFound.html, NL_NOT_FOUND_RENDER_PATH);
  console.log(`Prerendered: ${NL_NOT_FOUND_RENDER_PATH} -> ${dutchNotFoundOutputPath}`);

  const simulationShellOutputPath = path.join(distDir, DYNAMIC_SIMULATION_SHELL_OUTPUT);
  const simulationShell = await prerenderRoute(
    distDir,
    templateHtml,
    DYNAMIC_SIMULATION_RENDER_PATH,
    simulationShellOutputPath
  );
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(simulationShell.html)) {
    throw new Error('Dynamic simulation shell is missing noindex,follow robots metadata.');
  }
  console.log(`Prerendered: ${DYNAMIC_SIMULATION_RENDER_PATH} -> ${simulationShellOutputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
