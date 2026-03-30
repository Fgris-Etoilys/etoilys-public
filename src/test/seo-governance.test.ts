import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getAllKnownPaths,
  getIndexablePaths,
  getPrerenderPaths,
  SITE_URL,
} from '../content/seoRoutes';

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
    urls.push(match[1]);
    match = regex.exec(xml);
  }
  return urls;
}

function extractActiveAppPaths(): string[] {
  const appSource = readFileSync(path.resolve(process.cwd(), 'src', 'App.tsx'), 'utf8');
  const noLineComments = appSource.replace(/\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const matches = [...noBlockComments.matchAll(/<Route\s+path="([^"]+)"/g)];
  const paths = matches
    .map((match) => match[1])
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
      .map((pathname) => (pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`))
      .sort();

    expect(sitemapUrls).toEqual(expectedUrls);
  });

  it('keeps prerender paths aligned with indexable routes', () => {
    const indexablePaths = new Set(getIndexablePaths().map(normalizePath));
    const prerenderPaths = getPrerenderPaths().map(normalizePath);

    prerenderPaths.forEach((pathname) => {
      expect(indexablePaths.has(pathname)).toBe(true);
    });
  });
});
