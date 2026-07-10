import { describe, expect, it } from 'vitest';
import {
  chunkUrls,
  dedupeAndValidateUrls,
  getUrlsForChangedFiles,
  getUrlsFromSitemapDiff,
  isSuccessfulIndexNowStatus,
  parseChangedFileEntries,
  shouldRetry,
} from './indexnow-submit';

describe('indexnow-submit helpers', () => {
  it('deduplicates URLs and rejects non-canonical hosts', () => {
    expect(
      dedupeAndValidateUrls([
        'https://www.etoilys.fr/actualites#section',
        'https://www.etoilys.fr/actualites',
      ])
    ).toEqual(['https://www.etoilys.fr/actualites']);

    expect(() => dedupeAndValidateUrls(['https://example.com/actualites'])).toThrow(
      /outside canonical host/
    );
  });

  it('splits URL submissions into IndexNow batches of 10000', () => {
    const urls = Array.from(
      { length: 10_001 },
      (_, index) => `https://www.etoilys.fr/page-${index}`
    );

    const batches = chunkUrls(urls);

    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(10_000);
    expect(batches[1]).toHaveLength(1);
  });

  it('classifies IndexNow response handling', () => {
    expect(isSuccessfulIndexNowStatus(200)).toBe(true);
    expect(isSuccessfulIndexNowStatus(202)).toBe(true);
    expect(shouldRetry(429)).toBe(true);
    expect(shouldRetry(500)).toBe(true);
    expect(shouldRetry(503)).toBe(true);
    expect(shouldRetry(400)).toBe(false);
    expect(shouldRetry(403)).toBe(false);
    expect(shouldRetry(422)).toBe(false);
  });

  it('returns added, removed and changed URLs from sitemap diffs', () => {
    const previous = `
      <urlset>
        <url><loc>https://www.etoilys.fr/a</loc><lastmod>2026-01-01</lastmod></url>
        <url><loc>https://www.etoilys.fr/b</loc><lastmod>2026-01-01</lastmod></url>
      </urlset>
    `;
    const current = `
      <urlset>
        <url><loc>https://www.etoilys.fr/b</loc><lastmod>2026-02-01</lastmod></url>
        <url><loc>https://www.etoilys.fr/c</loc><lastmod>2026-02-01</lastmod></url>
      </urlset>
    `;

    expect(getUrlsFromSitemapDiff(previous, current)).toEqual([
      'https://www.etoilys.fr/a',
      'https://www.etoilys.fr/b',
      'https://www.etoilys.fr/b',
      'https://www.etoilys.fr/c',
    ]);
  });

  it('maps added, modified, renamed and deleted files to affected routes', () => {
    const changedFiles = parseChangedFileEntries(
      [
        'M\tsrc/pages/actualites/MicroBic2026.tsx',
        'D\tsrc/pages/Actualites.tsx',
        'R100\tsrc/pages/Contact.tsx\tsrc/pages/DemandeClassement.tsx',
        'A\tsrc/content/actualitesArticles.ts',
      ].join('\n')
    );

    const urls = dedupeAndValidateUrls(getUrlsForChangedFiles(changedFiles));

    expect(urls).toContain(
      'https://www.etoilys.fr/actualites/micro-bic-2026-meuble-classe-vs-non-classe'
    );
    expect(urls).toContain('https://www.etoilys.fr/actualites');
    expect(urls).toContain('https://www.etoilys.fr/contact');
    expect(urls).toContain('https://www.etoilys.fr/demande-classement');
    expect(urls).toContain('https://www.etoilys.fr/en/contact');
    expect(urls).toContain('https://www.etoilys.fr/en/request-a-classification');
  });
});
