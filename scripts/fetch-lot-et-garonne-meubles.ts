import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUTPUT_PATH = path.join(ROOT_DIR, 'docs', 'lot-et-garonne-tourisme-meubles.json');
const BASE_URL = 'https://www.tourisme-lotetgaronne.com';
const LIST_URL = `${BASE_URL}/sejourner/locations-vacances/`;
const USER_AGENT = 'Mozilla/5.0 (compatible; EtoilysDataCollection/1.0; +https://www.etoilys.fr)';
const DEFAULT_CONCURRENCY = 6;
const MAX_RETRIES = 4;

interface ListPageResult {
  page: number;
  url: string;
  links: string[];
}

interface InfoPair {
  label: string;
  value: string;
  links: string[];
  emails: string[];
  phones: string[];
}

interface LotEtGaronneMeuble {
  source: {
    site: string;
    listPage: number;
    detailUrl: string;
    detailUrlFinal: string | null;
  };
  identifiers: {
    slug: string;
    tourinsoftIds: string[];
  };
  nom: string | null;
  type: string;
  classement: {
    principal: string | null;
    raw: string[];
  };
  contacts: {
    emails: string[];
    phones: string[];
    websites: string[];
    reservationLinks: string[];
  };
  adresse: {
    raw: string | null;
    commune: string | null;
    codePostal: string | null;
  };
  geolocalisation: {
    latitude: string | null;
    longitude: string | null;
  };
  labels: {
    marquesEtLabels: string | null;
    languesParlees: string | null;
    accessiblePmr: string | null;
  };
  ouverture: {
    informations: string | null;
  };
  tarifs: {
    descriptif: string | null;
    modesPaiement: string | null;
  };
  capacites: {
    nombreChambres: string | null;
    capaciteMaximum: string | null;
    capaciteClassee: string | null;
    typeHabitation: string | null;
  };
  prestations: {
    confort: string | null;
    habitation: string | null;
    equipements: string | null;
    services: string | null;
    activitesProximite: string | null;
    borneRechargeMoins300m: string | null;
  };
  medias: {
    images: string[];
  };
  rawInfo: Record<string, string>;
  extraction: {
    status: 'ok' | 'error';
    error: string | null;
  };
}

interface FailedDetail {
  url: string;
  error: string;
}

function parseArgs() {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const match = /^--([^=]+)=(.*)$/.exec(arg);
    if (match) {
      args.set(match[1], match[2]);
    }
  }

  return {
    outputPath: args.get('output') ? path.resolve(ROOT_DIR, args.get('output') ?? '') : OUTPUT_PATH,
    concurrency: parsePositiveInteger(args.get('concurrency'), DEFAULT_CONCURRENCY),
    maxPages: parseOptionalPositiveInteger(args.get('pages')),
    limitDetails: parseOptionalPositiveInteger(args.get('limitDetails')),
  };
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOptionalPositiveInteger(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildListPageUrl(page: number): string {
  return page === 1 ? LIST_URL : `${LIST_URL}page/${page}/`;
}

async function fetchText(url: string): Promise<{ text: string; finalUrl: string }> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'User-Agent': USER_AGENT,
        },
      });

      if (response.ok) {
        return {
          text: await response.text(),
          finalUrl: response.url,
        };
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await wait(500 * attempt);
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function mapConcurrent<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex] as T, currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function decodeHtml(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    eacute: 'é',
    egrave: 'è',
    ecirc: 'ê',
    agrave: 'à',
    ccedil: 'ç',
    ocirc: 'ô',
    ugrave: 'ù',
    nbsp: ' ',
    quot: '"',
    rsquo: '’',
    laquo: '«',
    raquo: '»',
    ndash: '–',
    hellip: '…',
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

function stripTags(value: string): string {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function normalizeText(value: string): string {
  return stripTags(value).normalize('NFC');
}

function extractHrefAttributes(html: string): string[] {
  return unique(
    [...html.matchAll(/href=["']([^"']+)["']/gi)]
      .map((match) => decodeHtml(match[1] ?? '').trim())
      .filter(Boolean)
  );
}

function absoluteUrl(value: string): string {
  return new URL(value, BASE_URL).toString();
}

function extractListLinks(html: string): string[] {
  return unique(
    [...html.matchAll(/<a[^>]+class=["'][^"']*card-thumb thumb[^"']*["'][^>]*>/gi)]
      .map((match) => /href=["']([^"']+)["']/i.exec(match[0])?.[1])
      .filter((value): value is string => Boolean(value))
      .map((value) => absoluteUrl(decodeHtml(value)))
      .filter((value) => value.includes('/hebergements-locatifs/'))
  );
}

function discoverLastPage(html: string): number {
  const pages = [...html.matchAll(/locations-vacances\/+page\/(\d+)\//gi)]
    .map((match) => Number(match[1]))
    .filter((page) => Number.isInteger(page) && page > 0);
  return pages.length > 0 ? Math.max(...pages) : 1;
}

async function fetchListPages(
  concurrency: number,
  maxPages: number | null
): Promise<{ lastPage: number; pages: ListPageResult[] }> {
  const first = await fetchText(LIST_URL);
  const discoveredLastPage = discoverLastPage(first.text);
  const lastPage = maxPages ? Math.min(discoveredLastPage, maxPages) : discoveredLastPage;
  const pageNumbers = Array.from({ length: lastPage }, (_, index) => index + 1);

  const pages = await mapConcurrent(pageNumbers, concurrency, async (page) => {
    if (page === 1) {
      return {
        page,
        url: LIST_URL,
        links: extractListLinks(first.text),
      };
    }
    const url = buildListPageUrl(page);
    const { text, finalUrl } = await fetchText(url);
    return {
      page,
      url: finalUrl,
      links: extractListLinks(text),
    };
  });

  return { lastPage, pages };
}

function dedupePageLinks(pages: ListPageResult[]): Array<{ page: number; url: string }> {
  const seen = new Set<string>();
  const links: Array<{ page: number; url: string }> = [];

  for (const page of pages) {
    for (const url of page.links) {
      if (seen.has(url)) {
        continue;
      }
      seen.add(url);
      links.push({ page: page.page, url });
    }
  }

  return links;
}

function extractInfoPairs(html: string): InfoPair[] {
  return [
    ...html.matchAll(
      /<div class=["']offer-label[^"']*["']>([\s\S]*?)<\/div>\s*<div class=["']offer-info[^"']*["']>([\s\S]*?)<\/div>/gi
    ),
  ].map((match) => {
    const rawInfo = match[2] ?? '';
    const links = extractHrefAttributes(rawInfo).map((link) =>
      link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:')
        ? link
        : absoluteUrl(link)
    );
    return {
      label: normalizeText(match[1] ?? ''),
      value: normalizeText(rawInfo),
      links,
      emails: extractEmails(rawInfo),
      phones: extractPhones(rawInfo),
    };
  });
}

function extractEmails(htmlOrText: string): string[] {
  return unique(
    [
      ...[...htmlOrText.matchAll(/mailto:([^"'>?\s]+)/gi)].map((match) =>
        decodeURIComponent(decodeHtml(match[1] ?? '').trim())
      ),
      ...(htmlOrText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []),
    ]
      .map((email) => email.toLowerCase())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  );
}

function extractPhones(htmlOrText: string): string[] {
  return unique(
    [
      ...[...htmlOrText.matchAll(/tel:([^"'>\s]+)/gi)].map((match) =>
        decodeURIComponent(decodeHtml(match[1] ?? '').trim())
      ),
      ...(htmlOrText.match(/(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g) ?? []),
    ]
      .map((phone) => phone.replace(/\s+/g, ' ').trim())
      .filter(isFrenchPhone)
  );
}

function isFrenchPhone(value: string): boolean {
  return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value);
}

function extractTitle(html: string): string | null {
  const offerHeader = /<div class=["']tag["']>[\s\S]*?<\/div>\s*<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(
    html
  )?.[1];
  if (offerHeader) {
    return normalizeText(offerHeader);
  }

  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  if (!title) {
    return null;
  }
  return normalizeText(title)
    .replace(/\s*[–-]\s*Tourisme Lot-et-Garonne\s*$/i, '')
    .trim();
}

function extractCommuneFromHeader(html: string): string | null {
  const tag = /<div class=["']tag["']>([\s\S]*?)<\/div>/i.exec(html)?.[1];
  return tag ? normalizeText(tag) : null;
}

function extractClassements(html: string): string[] {
  const headerMeta =
    /<div class=["']header-meta[^"']*["']>([\s\S]*?)<\/div>/i.exec(html)?.[1] ?? '';
  return unique(
    [...headerMeta.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)]
      .map((match) => normalizeText(match[1] ?? ''))
      .filter(Boolean)
  );
}

function extractCoordinates(html: string): { latitude: string | null; longitude: string | null } {
  const values = [...new Set(html.match(/-?\d{1,3}\.\d{5,}/g) ?? [])];
  const longitude = values.find((value) => Number(value) >= -1 && Number(value) <= 2) ?? null;
  const latitude = values.find((value) => Number(value) >= 43 && Number(value) <= 45.5) ?? null;
  return { latitude, longitude };
}

function extractImages(html: string): string[] {
  return unique(
    [...html.matchAll(/https:\/\/cdt47\.media\.tourinsoft\.eu\/upload\/[^"' )]+/gi)].map((match) =>
      decodeHtml(match[0]).replace(/&amp;/g, '&')
    )
  );
}

function extractReservationLinks(html: string): string[] {
  return unique(
    [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .filter((match) => /réserver|reserver|reservation/i.test(stripTags(match[2] ?? '')))
      .map((match) => decodeHtml(match[1] ?? '').trim())
      .filter(Boolean)
      .map((link) => (link.startsWith('http') ? link : absoluteUrl(link)))
  );
}

function toRawInfo(pairs: InfoPair[]): Record<string, string> {
  const rawInfo: Record<string, string> = {};
  for (const pair of pairs) {
    if (!pair.label) {
      continue;
    }
    rawInfo[pair.label] = pair.value;
  }
  return rawInfo;
}

function getInfo(rawInfo: Record<string, string>, label: string): string | null {
  return rawInfo[label] || null;
}

function findPair(pairs: InfoPair[], label: string): InfoPair | null {
  return pairs.find((pair) => pair.label === label) ?? null;
}

function extractPostalCode(address: string | null): string | null {
  return /\b(47\d{3})\b/.exec(address ?? '')?.[1] ?? null;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function slugFromUrl(url: string): string {
  return new URL(url).pathname.replace(/\/+$/, '').split('/').pop() ?? url;
}

async function fetchDetail(entry: { page: number; url: string }): Promise<LotEtGaronneMeuble> {
  try {
    const { text, finalUrl } = await fetchText(entry.url);
    const pairs = extractInfoPairs(text);
    const rawInfo = toRawInfo(pairs);
    const address = getInfo(rawInfo, 'Adresse');
    const websitePair = findPair(pairs, 'Site web');
    const classements = extractClassements(text);

    return {
      source: {
        site: 'tourisme-lotetgaronne.com',
        listPage: entry.page,
        detailUrl: entry.url,
        detailUrlFinal: finalUrl,
      },
      identifiers: {
        slug: slugFromUrl(finalUrl),
        tourinsoftIds: unique(text.match(/HLO[A-Z0-9]+/g) ?? []),
      },
      nom: extractTitle(text),
      type: 'MEUBLÉS',
      classement: {
        principal:
          classements.find((classement) => classement.includes('étoile')) ?? classements[0] ?? null,
        raw: classements,
      },
      contacts: {
        emails: extractEmails(text),
        phones: unique(pairs.flatMap((pair) => pair.phones)),
        websites: unique(
          [
            ...(websitePair?.links ?? []),
            ...extractHrefAttributes(text).filter((link) => /^https?:\/\//i.test(link)),
          ].filter(
            (link) => !link.includes('tourisme-lotetgaronne.com') && !link.includes('tourinsoft.eu')
          )
        ),
        reservationLinks: extractReservationLinks(text),
      },
      adresse: {
        raw: address,
        commune: extractCommuneFromHeader(text),
        codePostal: extractPostalCode(address),
      },
      geolocalisation: extractCoordinates(text),
      labels: {
        marquesEtLabels: getInfo(rawInfo, 'Marques et labels'),
        languesParlees: getInfo(rawInfo, 'Langues parlées'),
        accessiblePmr: getInfo(rawInfo, 'Accessible aux personnes à mobilité réduite'),
      },
      ouverture: {
        informations: getInfo(rawInfo, 'Informations ouverture'),
      },
      tarifs: {
        descriptif: getInfo(rawInfo, 'Descriptif tarifs'),
        modesPaiement: getInfo(rawInfo, 'Mode de paiement'),
      },
      capacites: {
        nombreChambres: getInfo(rawInfo, 'Nombre total de chambres'),
        capaciteMaximum: getInfo(rawInfo, 'Capacité maximum'),
        capaciteClassee: getInfo(rawInfo, 'Capacité classée'),
        typeHabitation: getInfo(rawInfo, "Type d'habitation"),
      },
      prestations: {
        confort: getInfo(rawInfo, 'Descriptif confort'),
        habitation: getInfo(rawInfo, 'Descriptif habitation'),
        equipements: getInfo(rawInfo, 'Equipements'),
        services: getInfo(rawInfo, 'Services'),
        activitesProximite: getInfo(rawInfo, 'Activités à proximité'),
        borneRechargeMoins300m: getInfo(rawInfo, 'Borne de recharge électrique à moins de 300m'),
      },
      medias: {
        images: extractImages(text),
      },
      rawInfo,
      extraction: {
        status: 'ok',
        error: null,
      },
    };
  } catch (error) {
    return {
      source: {
        site: 'tourisme-lotetgaronne.com',
        listPage: entry.page,
        detailUrl: entry.url,
        detailUrlFinal: null,
      },
      identifiers: {
        slug: slugFromUrl(entry.url),
        tourinsoftIds: [],
      },
      nom: null,
      type: 'MEUBLÉS',
      classement: { principal: null, raw: [] },
      contacts: { emails: [], phones: [], websites: [], reservationLinks: [] },
      adresse: { raw: null, commune: null, codePostal: null },
      geolocalisation: { latitude: null, longitude: null },
      labels: { marquesEtLabels: null, languesParlees: null, accessiblePmr: null },
      ouverture: { informations: null },
      tarifs: { descriptif: null, modesPaiement: null },
      capacites: {
        nombreChambres: null,
        capaciteMaximum: null,
        capaciteClassee: null,
        typeHabitation: null,
      },
      prestations: {
        confort: null,
        habitation: null,
        equipements: null,
        services: null,
        activitesProximite: null,
        borneRechargeMoins300m: null,
      },
      medias: { images: [] },
      rawInfo: {},
      extraction: {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

async function main() {
  const options = parseArgs();
  const startedAt = Date.now();

  console.log('Fetching Lot-et-Garonne listing pages...');
  const listing = await fetchListPages(options.concurrency, options.maxPages);
  const uniqueLinks = dedupePageLinks(listing.pages);
  const selectedLinks = options.limitDetails
    ? uniqueLinks.slice(0, options.limitDetails)
    : uniqueLinks;

  console.log(
    `Listing: ${listing.pages.length} pages, ${listing.pages.reduce((count, page) => count + page.links.length, 0)} rows, ${uniqueLinks.length} unique detail links.`
  );
  console.log(
    `Fetching ${selectedLinks.length} detail pages with concurrency ${options.concurrency}...`
  );

  let detailCount = 0;
  const meubles = await mapConcurrent(selectedLinks, options.concurrency, async (entry) => {
    const meuble = await fetchDetail(entry);
    detailCount += 1;
    if (detailCount % 100 === 0 || detailCount === selectedLinks.length) {
      console.log(`Details fetched: ${detailCount}/${selectedLinks.length}`);
    }
    return meuble;
  });

  const failedDetails: FailedDetail[] = meubles
    .filter((meuble) => meuble.extraction.status === 'error')
    .map((meuble) => ({
      url: meuble.source.detailUrl,
      error: meuble.extraction.error ?? 'Unknown error',
    }));

  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: {
        listUrl: LIST_URL,
        pagesFetched: listing.lastPage,
        listRows: listing.pages.reduce((count, page) => count + page.links.length, 0),
        uniqueDetailLinks: uniqueLinks.length,
        detailsFetched: selectedLinks.length,
        failedDetails: failedDetails.length,
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      },
      notes: [
        'Les données Lot-et-Garonne sont extraites du HTML public des pages liste et détail.',
        'Les emails sont exposés en clair dans certaines fiches via des liens mailto.',
        'La date officielle de classement n’est pas exposée dans les données récupérées.',
      ],
      failedDetails,
    },
    meubles,
  };

  await mkdir(path.dirname(options.outputPath), { recursive: true });
  await writeFile(options.outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log(
    `Generated ${meubles.length} meubles in ${path.relative(ROOT_DIR, options.outputPath)}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
