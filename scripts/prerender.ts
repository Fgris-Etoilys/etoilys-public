import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import {
  SITE_URL,
  getBreadcrumbItems,
  getPrerenderPaths,
  getSeoRouteConfig,
} from '../src/content/seoRoutes.ts';
import { getArticleStructuredData } from '../src/content/articleStructuredData.ts';
import { IMAGE_MANIFEST } from '../src/content/imageManifest.ts';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PRERENDER_PORT ?? 4173);
const BASE_URL = `http://${HOST}:${PORT}`;
const NOT_FOUND_PRERENDER_PATH = '/404';
const TITLE_SUFFIX = ' | Etoilys - Classement Meubles de Tourisme';
const OG_IMAGE_ALT = 'Etoilys - Classement des meublés de tourisme';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServerReady(timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting for server startup.
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for Vite preview on ${BASE_URL}`);
}

function startPreviewServer(): ChildProcessWithoutNullStreams {
  const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(
    process.execPath,
    [viteBin, 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: 'pipe',
    }
  );

  child.stdout.on('data', (data) => process.stdout.write(data));
  child.stderr.on('data', (data) => process.stderr.write(data));

  return child;
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

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
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

function buildGlobalStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Etoilys',
        legalName: 'ETOILYS',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-etoilys.svg`,
        identifier: '93933080900012',
        email: 'contact@etoilys.fr',
        telephone: '+33649551540',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'contact@etoilys.fr',
            telephone: '+33649551540',
            availableLanguage: 'fr',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1345 route de Dautre',
          addressLocality: 'Mauzac-et-Grand-Castang',
          postalCode: '24150',
          addressCountry: 'FR',
        },
      },
      {
        '@type': 'WebSite',
        name: 'Etoilys',
        url: SITE_URL,
      },
    ],
  };
}

function buildBreadcrumbStructuredData(pathname: string): Record<string, unknown> | null {
  const items = getBreadcrumbItems(pathname);
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildArticleStructuredData(pathname: string): Record<string, unknown> | null {
  const article = getArticleStructuredData(pathname);
  if (!article) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: `${SITE_URL}${IMAGE_MANIFEST[article.imageKey].src}`,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Etoilys',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-etoilys.svg`,
      },
    },
    mainEntityOfPage: `${SITE_URL}${article.path}`,
  };
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

function stripSeoTags(html: string): string {
  const patterns = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta[^>]+name=['"]description['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]robots['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:title['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:description['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:url['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:type['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:image['"][^>]*>\s*/gi,
    /<meta[^>]+property=['"]og:image:alt['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:card['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:title['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:description['"][^>]*>\s*/gi,
    /<meta[^>]+name=['"]twitter:image['"][^>]*>\s*/gi,
    /<link[^>]+rel=['"]canonical['"][^>]*>\s*/gi,
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
  const title = `${seoConfig.title}${TITLE_SUFFIX}`;
  const description = seoConfig.description;
  const robots = seoConfig.robots ?? 'index,follow';
  const currentUrl = `${SITE_URL}${pathname}`;
  const ogImage = getOgImage(pathname);
  const preloadImage = seoConfig.lcpImageKey ? IMAGE_MANIFEST[seoConfig.lcpImageKey].src : null;

  const tags = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}">`,
    `    <meta name="robots" content="${escapeHtml(robots)}">`,
    `    <meta property="og:title" content="${escapeHtml(title)}">`,
    `    <meta property="og:description" content="${escapeHtml(description)}">`,
    `    <meta property="og:url" content="${escapeHtml(currentUrl)}">`,
    '    <meta property="og:type" content="website">',
    `    <meta property="og:image" content="${escapeHtml(ogImage)}">`,
    `    <meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}">`,
    '    <meta name="twitter:card" content="summary_large_image">',
    `    <meta name="twitter:title" content="${escapeHtml(title)}">`,
    `    <meta name="twitter:description" content="${escapeHtml(description)}">`,
    `    <meta name="twitter:image" content="${escapeHtml(ogImage)}">`,
    `    <link rel="canonical" href="${escapeHtml(currentUrl)}">`,
  ];

  if (preloadImage) {
    tags.push(
      `    <link rel="preload" as="image" href="${escapeHtml(preloadImage)}" data-seo-lcp-preload="true">`
    );
  }

  tags.push(
    `    <script type="application/ld+json" id="structured-data-global">${serializeJsonLd(buildGlobalStructuredData())}</script>`
  );

  const breadcrumbData = buildBreadcrumbStructuredData(pathname);
  if (breadcrumbData) {
    tags.push(
      `    <script type="application/ld+json" id="structured-data-breadcrumbs">${serializeJsonLd(breadcrumbData)}</script>`
    );
  }

  const articleData = buildArticleStructuredData(pathname);
  if (articleData) {
    tags.push(
      `    <script type="application/ld+json" id="structured-data-article">${serializeJsonLd(articleData)}</script>`
    );
  }

  return tags.join('\n');
}

function injectSeoHead(templateHtml: string, pathname: string): string {
  const normalizedPath = normalizePath(pathname);
  const cleaned = stripSeoTags(ensureDoctype(templateHtml));
  const seoHead = buildSeoHead(normalizedPath);

  return cleaned.replace(/<\/head>/i, `${seoHead}\n  </head>`);
}

async function prerenderStatic(distDir: string, routes: string[]): Promise<void> {
  const templatePath = path.join(distDir, 'index.html');
  const templateHtml = await readFile(templatePath, 'utf8');

  for (const routePath of routes) {
    const normalizedPath = normalizePath(routePath);
    const outputPath = resolveOutputPath(distDir, normalizedPath);
    const html = injectSeoHead(templateHtml, normalizedPath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
    console.log(`Prerendered (static): ${normalizedPath} -> ${outputPath}`);
  }
}

async function prerenderWithPlaywright(distDir: string, routes: string[]): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const routePath of routes) {
      const normalizedPath = normalizePath(routePath);
      const url = `${BASE_URL}${normalizedPath}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(300);

      const html = ensureDoctype(await page.content());

      const outputPath = resolveOutputPath(distDir, normalizedPath);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, 'utf8');
      console.log(`Prerendered: ${normalizedPath} -> ${outputPath}`);
    }

    const notFoundUrl = `${BASE_URL}${NOT_FOUND_PRERENDER_PATH}`;
    await page.goto(notFoundUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(300);

    const notFoundHtml = ensureDoctype(await page.content());
    const notFoundOutputPath = resolveOutputPath(distDir, NOT_FOUND_PRERENDER_PATH);
    await mkdir(path.dirname(notFoundOutputPath), { recursive: true });
    await writeFile(notFoundOutputPath, notFoundHtml, 'utf8');
    console.log(`Prerendered: ${NOT_FOUND_PRERENDER_PATH} -> ${notFoundOutputPath}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const routes = getPrerenderPaths();
  const previewProcess = startPreviewServer();

  try {
    await waitForServerReady();
    try {
      await prerenderWithPlaywright(distDir, routes);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `Playwright prerender unavailable (${message}). Falling back to static SEO prerender.`
      );
      await prerenderStatic(distDir, [...routes, NOT_FOUND_PRERENDER_PATH]);
    }
  } finally {
    previewProcess.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
