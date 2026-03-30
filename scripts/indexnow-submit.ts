import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_HOST = 'www.etoilys.fr';
const SITE_URL = 'https://www.etoilys.fr';
const INDEXNOW_KEY = 'a4f9bc0d1e4b47b9b0e2b438d9d8f2aa';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_RETRIES = 3;
const IS_DRY_RUN = process.env.INDEXNOW_DRY_RUN === '1';

function extractUrlsFromSitemap(xml: string): string[] {
  const urls: string[] = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null = regex.exec(xml);

  while (match) {
    urls.push(match[1]);
    match = regex.exec(xml);
  }

  return urls;
}

function shouldRetry(status: number): boolean {
  return status >= 500 || status === 429;
}

async function postWithRetry(payload: unknown): Promise<void> {
  let attempt = 1;

  while (attempt <= MAX_RETRIES) {
    try {
      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`IndexNow submission succeeded (attempt ${attempt}).`);
        return;
      }

      const body = await response.text();
      console.error(`IndexNow response ${response.status}: ${body}`);

      if (!shouldRetry(response.status) || attempt === MAX_RETRIES) {
        throw new Error(`IndexNow definitive failure with status ${response.status}`);
      }
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      console.error(`IndexNow submission attempt ${attempt} failed:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    attempt += 1;
  }
}

async function main() {
  const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const urlList = extractUrlsFromSitemap(sitemapXml);

  if (urlList.length === 0) {
    throw new Error('No URLs found in public/sitemap.xml');
  }

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  if (IS_DRY_RUN) {
    console.log(`[DRY RUN] Would submit ${urlList.length} URL(s) to IndexNow.`);
    return;
  }

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`);
  await postWithRetry(payload);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
