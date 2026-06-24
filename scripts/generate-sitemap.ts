import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  getCanonicalUrl,
  getIndexablePaths,
  getSitemapAlternateLinks,
} from '../src/content/seoRoutes.ts';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemapXml(paths: string[]): string {
  const entries = paths
    .map((pathname) => {
      const alternateLinks = getSitemapAlternateLinks(pathname);
      const alternateEntries = alternateLinks
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`
        )
        .join('\n');

      return alternateEntries
        ? `  <url>\n    <loc>${escapeXml(getCanonicalUrl(pathname))}</loc>\n${alternateEntries}\n  </url>`
        : `  <url><loc>${escapeXml(getCanonicalUrl(pathname))}</loc></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

async function main() {
  const paths = getIndexablePaths();
  const sitemap = buildSitemapXml(paths);
  const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

  await writeFile(outputPath, sitemap, 'utf8');
  console.log(`Sitemap generated with ${paths.length} URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
