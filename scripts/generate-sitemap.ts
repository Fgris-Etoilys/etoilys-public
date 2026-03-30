import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getIndexablePaths, SITE_URL } from '../src/content/seoRoutes.ts';

function buildSitemapXml(urls: string[]): string {
  const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

async function main() {
  const urls = getIndexablePaths().map((pathname) =>
    pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`
  );
  const sitemap = buildSitemapXml(urls);
  const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

  await writeFile(outputPath, sitemap, 'utf8');
  console.log(`Sitemap generated with ${urls.length} URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
