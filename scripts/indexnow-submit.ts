import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getCanonicalUrl, getIndexablePaths, SITE_URL } from '../src/content/seoRoutes.ts';

const SITE_HOST = 'www.etoilys.fr';
const INDEXNOW_KEY = 'a4f9bc0d1e4b47b9b0e2b438d9d8f2aa';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_RETRIES = 3;
const MAX_URLS_PER_BATCH = 10_000;
const IS_DRY_RUN = process.env.INDEXNOW_DRY_RUN === '1';
const LIVE_POLL_ATTEMPTS = Number(process.env.INDEXNOW_LIVE_POLL_ATTEMPTS ?? 12);
const LIVE_POLL_DELAY_MS = Number(process.env.INDEXNOW_LIVE_POLL_DELAY_MS ?? 10_000);

type ChangedFileStatus = 'added' | 'modified' | 'deleted' | 'renamed';

export interface ChangedFileEntry {
  status: ChangedFileStatus;
  path: string;
  oldPath?: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

interface CliOptions {
  urls: string[];
  urlFiles: string[];
  changedFilesFile?: string;
  sitemapDiff?: {
    previousPath: string;
    currentPath: string;
  };
  all: boolean;
  verifyLive: boolean;
}

function assertArgValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];

  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    urls: [],
    urlFiles: [],
    all: false,
    verifyLive: false,
  };

  let index = 0;
  while (index < args.length) {
    const arg = args[index];

    if (arg === '--url') {
      options.urls.push(assertArgValue(args, index, arg));
      index += 2;
      continue;
    }

    if (arg === '--urls') {
      options.urlFiles.push(assertArgValue(args, index, arg));
      index += 2;
      continue;
    }

    if (arg === '--from-changed-files') {
      options.changedFilesFile = assertArgValue(args, index, arg);
      index += 2;
      continue;
    }

    if (arg === '--from-sitemap-diff') {
      const previousPath = assertArgValue(args, index, arg);
      const currentPath = args[index + 2];
      if (currentPath === undefined || currentPath.startsWith('--')) {
        throw new Error('--from-sitemap-diff requires previous and current sitemap paths.');
      }
      options.sitemapDiff = { previousPath, currentPath };
      index += 3;
      continue;
    }

    if (arg === '--all') {
      options.all = true;
      index += 1;
      continue;
    }

    if (arg === '--verify-live') {
      options.verifyLive = true;
      index += 1;
      continue;
    }

    throw new Error(`Unknown IndexNow argument: ${arg}`);
  }

  return options;
}

export function parseSitemapEntries(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  let urlMatch = urlRegex.exec(xml);

  while (urlMatch) {
    const block = urlMatch[1] ?? '';
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];

    if (loc !== undefined) {
      const entry: SitemapEntry = { loc };
      if (lastmod !== undefined) {
        entry.lastmod = lastmod;
      }
      entries.push(entry);
    }

    urlMatch = urlRegex.exec(xml);
  }

  return entries;
}

function normalizeSitemap(xml: string): string {
  return parseSitemapEntries(xml)
    .map((entry) => `${entry.loc}|${entry.lastmod ?? ''}`)
    .sort()
    .join('\n');
}

export function getUrlsFromSitemapDiff(previousXml: string, currentXml: string): string[] {
  const previousEntries = parseSitemapEntries(previousXml);
  const currentEntries = parseSitemapEntries(currentXml);
  const previousByLoc = new Map(previousEntries.map((entry) => [entry.loc, entry.lastmod ?? '']));
  const currentByLoc = new Map(currentEntries.map((entry) => [entry.loc, entry.lastmod ?? '']));
  const urls: string[] = [];

  previousByLoc.forEach((lastmod, loc) => {
    if (!currentByLoc.has(loc) || currentByLoc.get(loc) !== lastmod) {
      urls.push(loc);
    }
  });

  currentByLoc.forEach((lastmod, loc) => {
    if (!previousByLoc.has(loc) || previousByLoc.get(loc) !== lastmod) {
      urls.push(loc);
    }
  });

  return urls;
}

export function parseChangedFileEntries(input: string): ChangedFileEntry[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): ChangedFileEntry => {
      const parts = line.split(/\t+/);
      const status = parts[0];

      if (status?.startsWith('R')) {
        const oldPath = parts[1];
        const newPath = parts[2];
        if (oldPath === undefined || newPath === undefined) {
          throw new Error(`Invalid renamed file entry: ${line}`);
        }
        return { status: 'renamed', oldPath, path: newPath };
      }

      const filePath = parts.length === 1 ? parts[0] : parts[1];
      if (filePath === undefined) {
        throw new Error(`Invalid changed file entry: ${line}`);
      }

      if (status === 'A') return { status: 'added', path: filePath };
      if (status === 'D') return { status: 'deleted', path: filePath };
      return { status: 'modified', path: filePath };
    });
}

function allIndexableUrls(): string[] {
  return getIndexablePaths().map(getCanonicalUrl);
}

function routeUrl(pathname: string): string {
  return getCanonicalUrl(pathname);
}

function articlePathFromPage(filePath: string): string | null {
  const articlePageRoutes: Record<string, string> = {
    'src/pages/actualites/MeublesChangements20252026.tsx':
      '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    'src/pages/actualites/MicroBic2026.tsx':
      '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    'src/pages/actualites/ResidencePrincipale90Jours.tsx':
      '/actualites/airbnb-residence-principale-limite-90-jours',
    'src/pages/actualites/CoproprieteLocationTouristique.tsx':
      '/actualites/copropriete-location-touristique-reglement',
    'src/pages/actualites/TaxeDeSejour2026.tsx':
      '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    'src/pages/actualites/MeubleClasseNonClasseSeuils.tsx':
      '/actualites/meuble-classe-non-classe-seuils-micro-bic',
    'src/pages/actualites/FacturationElectronique2026.tsx':
      '/actualites/facturation-electronique-2026-proprietaires-meubles',
    'src/pages/actualites/DpeMeublesTourisme.tsx': '/actualites/dpe-meubles-tourisme-2026-2034',
    'src/pages/actualites/ApiMeublesDeclarationMeubleTourisme.tsx':
      '/actualites/api-meubles-declaration-meuble-tourisme',
    'src/pages/actualites/TransmissionDonneesPlateformesCommunes.tsx':
      '/actualites/airbnb-booking-abritel-donnees-communes-api-meubles',
    'src/pages/actualites/QueFaireApresClassementMeubleTourisme.tsx':
      '/actualites/que-faire-apres-classement-meuble-tourisme',
  };

  return articlePageRoutes[filePath.replace(/\\/g, '/')] ?? null;
}

function staticRoutesFromPage(filePath: string): string[] {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const pageRoutes: Record<string, string[]> = {
    'src/pages/Home.tsx': ['/', '/en'],
    'src/pages/Classement.tsx': [
      '/classement',
      '/en/furnished-tourist-accommodation-classification',
    ],
    'src/pages/PourquoiClasser.tsx': [
      '/les-avantages-du-classement',
      '/en/benefits-of-furnished-tourist-accommodation-classification',
    ],
    'src/pages/Prerequis.tsx': ['/prerequis-au-classement', '/en/classification-requirements'],
    'src/pages/Procedure.tsx': ['/procedure', '/en/classification-process'],
    'src/pages/ZonesIntervention.tsx': ['/zones-intervention'],
    'src/pages/locales/ClassementBergerac.tsx': ['/classement-meuble-tourisme-bergerac'],
    'src/pages/locales/ClassementDordogne.tsx': ['/classement-meuble-tourisme-dordogne'],
    'src/pages/locales/ClassementGironde.tsx': ['/classement-meuble-tourisme-gironde'],
    'src/pages/locales/ClassementLotEtGaronne.tsx': ['/classement-meuble-tourisme-lot-et-garonne'],
    'src/pages/Simulateur.tsx': ['/simulateur'],
    'src/pages/SimulateurTaxeSejour.tsx': ['/simulateur-taxe-sejour'],
    'src/pages/SimulateurFiscalClassement.tsx': ['/simulateur-fiscal-classement'],
    'src/pages/FAQ.tsx': ['/faq', '/en/faq'],
    'src/pages/Actualites.tsx': ['/actualites'],
    'src/pages/Recrutement.tsx': ['/recrutement'],
    'src/pages/Contact.tsx': ['/contact', '/en/contact'],
    'src/pages/DemandeClassement.tsx': ['/demande-classement', '/en/request-a-classification'],
    'src/pages/Confidentialite.tsx': ['/confidentialite', '/en/privacy-policy'],
    'src/pages/MentionsLegales.tsx': ['/mentions-legales'],
  };

  return pageRoutes[normalizedPath] ?? [];
}

export function getUrlsForChangedFiles(entries: ChangedFileEntry[]): string[] {
  const urls: string[] = [];

  for (const entry of entries) {
    const pathsToInspect = entry.oldPath === undefined ? [entry.path] : [entry.oldPath, entry.path];

    if (
      pathsToInspect.some((filePath) =>
        [
          'src/AppRoutes.tsx',
          'src/content/seoRoutes.ts',
          'src/content/sitemapLastmod.ts',
          'src/components/layout/Layout.tsx',
          'src/components/ui/SEO.tsx',
        ].includes(filePath.replace(/\\/g, '/'))
      )
    ) {
      return allIndexableUrls();
    }

    for (const filePath of pathsToInspect) {
      const normalizedPath = filePath.replace(/\\/g, '/');

      if (
        normalizedPath === 'src/content/articleStructuredData.ts' ||
        normalizedPath === 'src/content/actualitesArticles.ts'
      ) {
        urls.push(routeUrl('/actualites'));
        urls.push(...allIndexableUrls().filter((url) => url.includes('/actualites/')));
        continue;
      }

      const articlePath = articlePathFromPage(normalizedPath);
      if (articlePath !== null) {
        urls.push(routeUrl(articlePath), routeUrl('/actualites'));
        continue;
      }

      staticRoutesFromPage(normalizedPath).forEach((pathname) => urls.push(routeUrl(pathname)));
    }
  }

  return urls;
}

export function dedupeAndValidateUrls(urls: string[]): string[] {
  const normalizedUrls: string[] = [];
  const seenUrls = new Set<string>();

  urls
    .map((url) => url.trim())
    .filter(Boolean)
    .forEach((url) => {
      const parsed = new URL(url);

      if (parsed.protocol !== 'https:' || parsed.hostname !== SITE_HOST) {
        throw new Error(`IndexNow URL is outside canonical host: ${url}`);
      }

      parsed.hash = '';
      const normalizedUrl = parsed.toString();

      if (!seenUrls.has(normalizedUrl)) {
        seenUrls.add(normalizedUrl);
        normalizedUrls.push(normalizedUrl);
      }
    });

  return normalizedUrls;
}

export function chunkUrls(urls: string[]): string[][] {
  const chunks: string[][] = [];

  for (let index = 0; index < urls.length; index += MAX_URLS_PER_BATCH) {
    chunks.push(urls.slice(index, index + MAX_URLS_PER_BATCH));
  }

  return chunks;
}

export function shouldRetry(status: number): boolean {
  return status === 429 || status >= 500;
}

export function isSuccessfulIndexNowStatus(status: number): boolean {
  return status === 200 || status === 202;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readUrlsFromFile(filePath: string): Promise<string[]> {
  const content = await readFile(path.resolve(process.cwd(), filePath), 'utf8');
  return content.split(/\r?\n/).filter(Boolean);
}

async function readSitemapUrls(filePath: string): Promise<string[]> {
  const sitemapXml = await readFile(path.resolve(process.cwd(), filePath), 'utf8');
  return parseSitemapEntries(sitemapXml).map((entry) => entry.loc);
}

async function collectUrls(options: CliOptions): Promise<string[]> {
  const urls = [...options.urls];

  for (const filePath of options.urlFiles) {
    urls.push(...(await readUrlsFromFile(filePath)));
  }

  if (options.changedFilesFile !== undefined) {
    const changedFiles = await readFile(
      path.resolve(process.cwd(), options.changedFilesFile),
      'utf8'
    );
    urls.push(...getUrlsForChangedFiles(parseChangedFileEntries(changedFiles)));
  }

  if (options.sitemapDiff !== undefined) {
    const previousXml = await readFile(
      path.resolve(process.cwd(), options.sitemapDiff.previousPath),
      'utf8'
    );
    const currentXml = await readFile(
      path.resolve(process.cwd(), options.sitemapDiff.currentPath),
      'utf8'
    );
    urls.push(...getUrlsFromSitemapDiff(previousXml, currentXml));
  }

  if (options.all) {
    urls.push(...(await readSitemapUrls('public/sitemap.xml')));
  }

  return dedupeAndValidateUrls(urls);
}

async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const response = await fetch(url, { redirect: 'manual' });
  return { status: response.status, text: await response.text() };
}

async function assertLiveSitemapMatchesExpected(): Promise<void> {
  const expectedXml = await readFile(path.resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
  const expected = normalizeSitemap(expectedXml);

  for (let attempt = 1; attempt <= LIVE_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetchText(`${SITE_URL}/sitemap.xml`);

    if (response.status === 200 && normalizeSitemap(response.text) === expected) {
      console.log(`Live sitemap matches expected deployment (attempt ${attempt}).`);
      return;
    }

    if (attempt < LIVE_POLL_ATTEMPTS) {
      console.log(`Live sitemap is not ready yet (attempt ${attempt}/${LIVE_POLL_ATTEMPTS}).`);
      await sleep(LIVE_POLL_DELAY_MS);
    }
  }

  throw new Error('Live sitemap did not match the expected deployed sitemap before timeout.');
}

async function assertIndexNowKeyIsLive(): Promise<void> {
  const response = await fetchText(INDEXNOW_KEY_LOCATION);

  if (response.status !== 200 || response.text.trim() !== INDEXNOW_KEY) {
    throw new Error(`IndexNow key is not served correctly (${response.status}).`);
  }
}

async function assertSubmittedUrlsHaveLiveFinalState(urls: string[]): Promise<void> {
  const currentSitemap = await readFile(path.resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
  const currentUrls = new Set(parseSitemapEntries(currentSitemap).map((entry) => entry.loc));

  for (const url of urls) {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    const status = response.status;
    const isCurrentUrl = currentUrls.has(url);

    if (isCurrentUrl && status >= 200 && status < 300) {
      continue;
    }

    if (!isCurrentUrl && [301, 302, 404, 410].includes(status)) {
      continue;
    }

    throw new Error(`Unexpected live status ${status} for ${url}`);
  }
}

async function verifyLiveBeforeSubmit(urls: string[]): Promise<void> {
  await assertLiveSitemapMatchesExpected();
  await assertIndexNowKeyIsLive();
  await assertSubmittedUrlsHaveLiveFinalState(urls);
}

async function postBatchWithRetry(urlList: string[]): Promise<void> {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  let attempt = 1;

  while (attempt <= MAX_RETRIES) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      console.log(`IndexNow batch submitted successfully (attempt ${attempt}).`);
      return;
    }

    if (response.status === 202) {
      console.log(`IndexNow batch accepted, key validation pending (attempt ${attempt}).`);
      return;
    }

    const body = await response.text();
    console.error(`IndexNow response ${response.status}: ${body}`);

    if (!shouldRetry(response.status) || attempt === MAX_RETRIES) {
      throw new Error(`IndexNow definitive failure with status ${response.status}`);
    }

    await sleep(attempt * 1000);
    attempt += 1;
  }
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const urlList = await collectUrls(options);

  if (urlList.length === 0) {
    console.log('No IndexNow URLs to submit.');
    return;
  }

  if (options.verifyLive) {
    await verifyLiveBeforeSubmit(urlList);
  }

  const batches = chunkUrls(urlList);

  if (IS_DRY_RUN) {
    console.log(`[DRY RUN] Would submit ${urlList.length} URL(s) in ${batches.length} batch(es).`);
    urlList.forEach((url) => console.log(url));
    return;
  }

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow in ${batches.length} batch(es).`);

  for (const batch of batches) {
    await postBatchWithRetry(batch);
  }
}

const scriptPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';

if (import.meta.url === scriptPath) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
