import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const OUTPUT_PATH = path.join(ROOT_DIR, 'docs', 'dordogne-tourisme-meubles.json');
const BASE_URL = 'https://www.dordogne-perigord-tourisme.fr';
const PLAYLIST_PATH = '/api/render/website_v2/dordogne-perigord/playlist/14474/fr_FR/json';
const CONF_ID = '14474';
const RANDOM_SEED = '76b7b2b4-0faa-4d70-b983-152c23502886';
const USER_AGENT = 'Mozilla/5.0 (compatible; EtoilysDataCollection/1.0; +https://www.etoilys.fr)';

const DEFAULT_CONCURRENCY = 6;
const MAX_RETRIES = 3;

type JsonRecord = Record<string, unknown>;

interface PlaylistResponse {
  playlist?: {
    total?: number;
  };
  items?: PlaylistItem[];
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
}

interface PlaylistItem {
  contract?: string | null;
  bordereau?: string | null;
  sheetId?: string | null;
  title?: string | null;
  type?: string | null;
  link?: string | null;
  address?: string | null;
  town?: string | null;
  website?: string | null;
  phone?: {
    text?: string | null;
    number?: string | null;
  } | null;
  gps?: {
    latitude?: string | null;
    longitude?: string | null;
  } | null;
  description?: string | null;
  desc?: string | null;
  ratings?: unknown;
  booking?: unknown;
  services?: {
    data?: Array<{ key?: string; name?: string; icon?: string; logo?: string }>;
  } | null;
  territoryLabelBrands?: {
    data?: unknown[];
  } | null;
}

interface ContactEntry {
  type?: string | null;
  _type?: string | null;
  businessName?: string | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  commune?: string | null;
  deliveryOffice?: string | null;
  inseeCode?: string | null;
  zipCode?: string | null;
  country?: string | null;
  civility?: string | null;
  peopleFirstName?: string | null;
  peopleLastName?: string | null;
  function?: string | null;
  phones?: string[] | null;
  hasEmail?: boolean | null;
  descriptionPhones?: string[] | null;
  descriptionWebsites?: string[] | null;
  fax?: string | null;
  websites?: string[] | null;
  position?: number | null;
}

interface HwSheet {
  bordereau?: string | null;
  sousBordereau?: string | null;
  contractCode?: string | null;
  businessName?: string | null;
  sheetId?: string | null;
  labelRatings?: Record<string, LabelRecord> | null;
  extralabels?: unknown;
  chains?: unknown[];
  territoryLabelBrands?: unknown[];
  specialLabels?: unknown[];
  labels?: {
    simpleLabels?: {
      _title?: string | null;
      _labels?: unknown[];
    };
    tourismHandicap?: {
      _title?: string | null;
      _labels?: unknown[];
    };
  } | null;
  description?: string | null;
  lightDescription?: string | null;
  geolocations?: {
    latitude?: string | null;
    longitude?: string | null;
  } | null;
  contactsMultiples?: {
    establishments?: ContactEntry[] | null;
    owners?: ContactEntry[] | null;
    bookings?: ContactEntry[] | null;
    groups?: ContactEntry[] | null;
  } | null;
  contactLabel?: string | null;
  mailContact?: unknown;
  hasCentraleDispo?: boolean | null;
  hasTsAvailabilities?: boolean | null;
  centralResa?: unknown;
  bookingUrl?: string | null;
  capacities?: unknown;
  arrangementsDefault?: unknown[];
  referenceTariff?: unknown;
  tariffs?: unknown[];
  tariffComplement?: string | null;
  tariffFree?: unknown;
  tariffPeriods?: unknown;
  paymentMethods?: Record<string, LabelRecord> | null;
  openingPeriods?: unknown;
  availabilities?: {
    periods?: unknown[];
    updateDateAvailability?: string | null;
  } | null;
  servicesOffers?: Record<string, ServiceOffer> | null;
  mainServices?: unknown;
  medias?: {
    photos?: MediaItem[];
    videos?: unknown[];
  } | null;
  gallery?: MediaItem[];
  mosaicMedias?: MediaItem[];
  microDataJSON?: unknown;
}

interface LabelRecord {
  code?: string | null;
  libelle?: string | null;
  repeated?: string | null;
  character?: string | null;
  url?: string | null;
}

interface ServiceOffer {
  type?: string | null;
  servicesDetail?: Array<{
    service?: string | null;
    _service?: string | null;
  }>;
}

interface MediaItem {
  URL?: string;
  _thumbURL?: string;
  _name?: string;
  _caption?: string;
  _copyright?: string;
  copyright?: string;
}

interface ConsolidatedMeuble {
  source: {
    site: string;
    playlistPage: number;
    detailUrlAttempted: string;
    detailUrlFinal: string | null;
    playlistLink: string | null;
  };
  identifiers: {
    sheetId: string;
    bordereau: string | null;
    sousBordereau: string | null;
    contract: string | null;
    contractCode: string | null;
    sitId: string | null;
  };
  nom: string | null;
  type: string | null;
  classement: {
    principal: string | null;
    labels: Array<{
      code: string | null;
      libelle: string | null;
      valeur: string | null;
      icon: string | null;
    }>;
    playlistRatings: unknown;
  };
  contacts: {
    email: null;
    hasEmail: boolean;
    phones: string[];
    websites: string[];
    establishments: ContactEntry[];
    owners: ContactEntry[];
    bookings: ContactEntry[];
    groups: ContactEntry[];
  };
  adresse: {
    address1: string | null;
    address2: string | null;
    address3: string | null;
    commune: string | null;
    deliveryOffice: string | null;
    inseeCode: string | null;
    zipCode: string | null;
    country: string | null;
    rawPlaylistAddress: string | null;
  };
  geolocalisation: {
    latitude: string | null;
    longitude: string | null;
  };
  description: {
    courte: string | null;
    longue: string | null;
  };
  labels: {
    simples: unknown[];
    tourismeHandicap: unknown[];
    extra: unknown;
    chaines: unknown[];
    marquesTerritoriales: unknown[];
    specialLabels: unknown[];
  };
  capacites: unknown;
  reservation: {
    playlistBooking: unknown;
    hasCentraleDispo: boolean | null;
    hasTsAvailabilities: boolean | null;
    centralResa: unknown;
    bookingUrl: string | null;
  };
  tarifs: {
    reference: unknown;
    details: unknown[];
    complement: string | null;
    gratuit: unknown;
    periodes: unknown;
    moyensPaiement: string[];
  };
  disponibilites: {
    periods: unknown[];
    updateDateAvailability: string | null;
    openingPeriods: unknown;
  };
  services: {
    playlist: Array<{ key?: string; name?: string; icon?: string; logo?: string }>;
    groupes: Array<{
      type: string | null;
      items: Array<{
        code: string | null;
        libelle: string | null;
      }>;
    }>;
    mainServices: unknown;
  };
  medias: {
    photos: Array<{
      url: string | null;
      thumbUrl: string | null;
      name: string | null;
      caption: string | null;
      copyright: string | null;
    }>;
    videos: unknown[];
  };
  schemaOrg: unknown;
  extraction: {
    status: 'ok' | 'playlist_only' | 'error';
    error: string | null;
  };
}

interface PageItem {
  page: number;
  item: PlaylistItem;
}

interface FailedDetail {
  sheetId: string;
  url: string;
  error: string;
}

interface PlaylistPageResult {
  page: number;
  response: PlaylistResponse;
  usedFallbackWithoutRandomSeed: boolean;
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

function buildPlaylistUrl(page: number, includeRandomSeed = true): string {
  const url = new URL(PLAYLIST_PATH, BASE_URL);
  url.searchParams.set('page', String(page));
  if (includeRandomSeed) {
    url.searchParams.set('randomSeed', RANDOM_SEED);
  }
  url.searchParams.set('confId', CONF_ID);
  return url.toString();
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/&/g, ' et ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function buildDetailUrl(item: PlaylistItem): string {
  if (item.link?.startsWith('http')) {
    return item.link;
  }
  if (item.link?.startsWith('/')) {
    return new URL(item.link, BASE_URL).toString();
  }

  const sheetId = requireNonEmpty(item.sheetId, 'sheetId');
  const slug = slugify(`${item.title ?? ''} ${item.town ?? ''}`);
  return `${BASE_URL}/offres/${slug}-fr-${sheetId}/`;
}

function requireNonEmpty(value: string | null | undefined, label: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`Missing ${label}.`);
  }
  return normalized;
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
          'User-Agent': USER_AGENT,
        },
      });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await wait(400 * attempt);
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithRetry(url);
  return (await response.json()) as T;
}

async function fetchTextWithFinalUrl(url: string): Promise<{ text: string; finalUrl: string }> {
  const response = await fetchWithRetry(url);
  return {
    text: await response.text(),
    finalUrl: response.url,
  };
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

function extractConstObject(html: string, constName: string): string | null {
  const marker = `const ${constName} = `;
  const start = html.indexOf(marker);
  if (start < 0) {
    return null;
  }

  let index = start + marker.length;
  while (/\s/.test(html[index] ?? '')) {
    index += 1;
  }

  if (html[index] !== '{') {
    return null;
  }

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let cursor = index; cursor < html.length; cursor += 1) {
    const char = html[cursor];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return html.slice(index, cursor + 1);
      }
    }
  }

  return null;
}

function parseHwSheet(html: string): HwSheet | null {
  const raw = extractConstObject(html, 'HwSheet');
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as HwSheet;
}

function extractJsonLd(html: string): unknown[] {
  const matches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  const parsed: unknown[] = [];
  for (const match of matches) {
    const content = match[1]?.trim();
    if (!content) {
      continue;
    }
    try {
      parsed.push(JSON.parse(content));
    } catch {
      // JSON-LD is a secondary source here; keep the crawl resilient.
    }
  }
  return parsed;
}

function getFirstContact(hwSheet: HwSheet | null): ContactEntry | null {
  return hwSheet?.contactsMultiples?.establishments?.[0] ?? null;
}

function collectPhones(playlistItem: PlaylistItem, hwSheet: HwSheet | null): string[] {
  const phones = new Set<string>();
  if (playlistItem.phone?.number) {
    phones.add(playlistItem.phone.number);
  }

  for (const contact of getAllContacts(hwSheet)) {
    for (const phone of contact.phones ?? []) {
      if (phone.trim()) {
        phones.add(phone.trim());
      }
    }
  }

  return [...phones];
}

function collectWebsites(playlistItem: PlaylistItem, hwSheet: HwSheet | null): string[] {
  const websites = new Set<string>();
  if (playlistItem.website?.trim()) {
    websites.add(playlistItem.website.trim());
  }

  for (const contact of getAllContacts(hwSheet)) {
    for (const website of contact.websites ?? []) {
      if (website.trim()) {
        websites.add(website.trim());
      }
    }
  }

  return [...websites];
}

function getAllContacts(hwSheet: HwSheet | null): ContactEntry[] {
  return [
    ...(hwSheet?.contactsMultiples?.establishments ?? []),
    ...(hwSheet?.contactsMultiples?.owners ?? []),
    ...(hwSheet?.contactsMultiples?.bookings ?? []),
    ...(hwSheet?.contactsMultiples?.groups ?? []),
  ];
}

function hasEmail(hwSheet: HwSheet | null): boolean {
  return getAllContacts(hwSheet).some((contact) => contact.hasEmail === true);
}

function normalizeLabelRatings(hwSheet: HwSheet | null) {
  return Object.values(hwSheet?.labelRatings ?? {}).map((rating) => ({
    code: rating.code ?? null,
    libelle: rating.libelle ?? null,
    valeur: rating.repeated ?? null,
    icon: rating.character ?? null,
  }));
}

function getPrincipalClassement(hwSheet: HwSheet | null): string | null {
  const ratings = normalizeLabelRatings(hwSheet);
  const starRating = ratings.find((rating) => rating.libelle?.includes('étoile'));
  return starRating?.libelle ?? ratings[0]?.libelle ?? null;
}

function normalizePaymentMethods(hwSheet: HwSheet | null): string[] {
  return Object.values(hwSheet?.paymentMethods ?? {})
    .map((method) => method.libelle?.trim())
    .filter((value): value is string => Boolean(value));
}

function normalizeServices(hwSheet: HwSheet | null) {
  return Object.values(hwSheet?.servicesOffers ?? {}).map((group) => ({
    type: group.type ?? null,
    items: (group.servicesDetail ?? []).map((service) => ({
      code: service.service ?? null,
      libelle: service._service ?? null,
    })),
  }));
}

function normalizeMedias(hwSheet: HwSheet | null) {
  const photos = hwSheet?.medias?.photos ?? hwSheet?.gallery ?? [];
  return photos.map((photo) => ({
    url: photo.URL ?? null,
    thumbUrl: photo._thumbURL ?? null,
    name: photo._name ?? null,
    caption: photo._caption ?? null,
    copyright: photo._copyright ?? photo.copyright ?? null,
  }));
}

function normalizeMeuble(
  pageItem: PageItem,
  detail: {
    hwSheet: HwSheet | null;
    jsonLd: unknown[];
    detailUrlFinal: string | null;
    error: string | null;
  }
): ConsolidatedMeuble {
  const { item, page } = pageItem;
  const hwSheet = detail.hwSheet;
  const firstContact = getFirstContact(hwSheet);

  return {
    source: {
      site: 'dordogne-perigord-tourisme.fr',
      playlistPage: page,
      detailUrlAttempted: buildDetailUrl(item),
      detailUrlFinal: detail.detailUrlFinal,
      playlistLink: item.link ?? null,
    },
    identifiers: {
      sheetId: requireNonEmpty(item.sheetId ?? hwSheet?.sheetId, 'sheetId'),
      bordereau: hwSheet?.bordereau ?? item.bordereau ?? null,
      sousBordereau: hwSheet?.sousBordereau ?? null,
      contract: item.contract ?? null,
      contractCode: hwSheet?.contractCode ?? null,
      sitId: extractSitIdFromJsonLd(detail.jsonLd),
    },
    nom: hwSheet?.businessName ?? item.title ?? null,
    type: item.type ?? null,
    classement: {
      principal: getPrincipalClassement(hwSheet),
      labels: normalizeLabelRatings(hwSheet),
      playlistRatings: item.ratings ?? null,
    },
    contacts: {
      email: null,
      hasEmail: hasEmail(hwSheet),
      phones: collectPhones(item, hwSheet),
      websites: collectWebsites(item, hwSheet),
      establishments: hwSheet?.contactsMultiples?.establishments ?? [],
      owners: hwSheet?.contactsMultiples?.owners ?? [],
      bookings: hwSheet?.contactsMultiples?.bookings ?? [],
      groups: hwSheet?.contactsMultiples?.groups ?? [],
    },
    adresse: {
      address1: firstContact?.address1 ?? null,
      address2: firstContact?.address2 ?? null,
      address3: firstContact?.address3 ?? null,
      commune: firstContact?.commune ?? item.town ?? null,
      deliveryOffice: firstContact?.deliveryOffice ?? null,
      inseeCode: firstContact?.inseeCode ?? null,
      zipCode: firstContact?.zipCode ?? null,
      country: firstContact?.country ?? null,
      rawPlaylistAddress: item.address ?? null,
    },
    geolocalisation: {
      latitude: hwSheet?.geolocations?.latitude ?? item.gps?.latitude ?? null,
      longitude: hwSheet?.geolocations?.longitude ?? item.gps?.longitude ?? null,
    },
    description: {
      courte: hwSheet?.lightDescription ?? item.description ?? null,
      longue: hwSheet?.description ?? item.desc ?? null,
    },
    labels: {
      simples: hwSheet?.labels?.simpleLabels?._labels ?? [],
      tourismeHandicap: hwSheet?.labels?.tourismHandicap?._labels ?? [],
      extra: hwSheet?.extralabels ?? null,
      chaines: hwSheet?.chains ?? [],
      marquesTerritoriales: hwSheet?.territoryLabelBrands ?? [],
      specialLabels: hwSheet?.specialLabels ?? [],
    },
    capacites: hwSheet?.capacities ?? null,
    reservation: {
      playlistBooking: item.booking ?? null,
      hasCentraleDispo: hwSheet?.hasCentraleDispo ?? null,
      hasTsAvailabilities: hwSheet?.hasTsAvailabilities ?? null,
      centralResa: hwSheet?.centralResa ?? null,
      bookingUrl: hwSheet?.bookingUrl ?? null,
    },
    tarifs: {
      reference: hwSheet?.referenceTariff ?? null,
      details: hwSheet?.tariffs ?? [],
      complement: hwSheet?.tariffComplement ?? null,
      gratuit: hwSheet?.tariffFree ?? null,
      periodes: hwSheet?.tariffPeriods ?? null,
      moyensPaiement: normalizePaymentMethods(hwSheet),
    },
    disponibilites: {
      periods: hwSheet?.availabilities?.periods ?? [],
      updateDateAvailability: hwSheet?.availabilities?.updateDateAvailability ?? null,
      openingPeriods: hwSheet?.openingPeriods ?? null,
    },
    services: {
      playlist: item.services?.data ?? [],
      groupes: normalizeServices(hwSheet),
      mainServices: hwSheet?.mainServices ?? null,
    },
    medias: {
      photos: normalizeMedias(hwSheet),
      videos: hwSheet?.medias?.videos ?? [],
    },
    schemaOrg: hwSheet?.microDataJSON ?? detail.jsonLd,
    extraction: {
      status: detail.hwSheet ? 'ok' : detail.error ? 'error' : 'playlist_only',
      error: detail.error,
    },
  };
}

function extractSitIdFromJsonLd(jsonLd: unknown[]): string | null {
  for (const entry of jsonLd) {
    const found = findStringValue(entry, /^DORDOGNE-HLO/i);
    if (found) {
      return found;
    }
  }
  return null;
}

function findStringValue(value: unknown, pattern: RegExp): string | null {
  if (typeof value === 'string') {
    return pattern.test(value) ? value : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStringValue(item, pattern);
      if (found) {
        return found;
      }
    }
    return null;
  }
  if (isRecord(value)) {
    for (const nested of Object.values(value)) {
      const found = findStringValue(nested, pattern);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

async function fetchPlaylistPage(page: number): Promise<PlaylistPageResult> {
  try {
    return {
      page,
      response: await fetchJson<PlaylistResponse>(buildPlaylistUrl(page)),
      usedFallbackWithoutRandomSeed: false,
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'HTTP 404') {
      return {
        page,
        response: await fetchJson<PlaylistResponse>(buildPlaylistUrl(page, false)),
        usedFallbackWithoutRandomSeed: true,
      };
    }
    throw error;
  }
}

async function fetchPlaylistPages(
  concurrency: number,
  maxPages: number | null
): Promise<{
  total: number | null;
  lastPage: number;
  items: PageItem[];
  fallbackPages: number[];
}> {
  const firstPage = await fetchPlaylistPage(1);
  const realLastPage = firstPage.response.lastPage ?? 1;
  const lastPage = maxPages ? Math.min(realLastPage, maxPages) : realLastPage;
  const pages = Array.from({ length: lastPage }, (_, index) => index + 1);

  const pageResponses = await mapConcurrent(pages, concurrency, async (page) => {
    if (page === 1) {
      return firstPage;
    }
    return fetchPlaylistPage(page);
  });

  const items: PageItem[] = [];
  const fallbackPages: number[] = [];
  for (const pageResponse of pageResponses) {
    if (pageResponse.usedFallbackWithoutRandomSeed) {
      fallbackPages.push(pageResponse.page);
    }
    for (const item of pageResponse.response.items ?? []) {
      if (item.sheetId) {
        items.push({ page: pageResponse.page, item });
      }
    }
  }

  return {
    total: firstPage.response.playlist?.total ?? null,
    lastPage,
    items,
    fallbackPages,
  };
}

function deduplicateBySheetId(items: PageItem[]): PageItem[] {
  const seen = new Set<string>();
  const uniqueItems: PageItem[] = [];
  for (const pageItem of items) {
    const sheetId = pageItem.item.sheetId;
    if (!sheetId || seen.has(sheetId)) {
      continue;
    }
    seen.add(sheetId);
    uniqueItems.push(pageItem);
  }
  return uniqueItems;
}

async function fetchDetail(pageItem: PageItem): Promise<{
  hwSheet: HwSheet | null;
  jsonLd: unknown[];
  detailUrlFinal: string | null;
  error: string | null;
}> {
  const detailUrl = buildDetailUrl(pageItem.item);
  try {
    const { text, finalUrl } = await fetchTextWithFinalUrl(detailUrl);
    return {
      hwSheet: parseHwSheet(text),
      jsonLd: extractJsonLd(text),
      detailUrlFinal: finalUrl,
      error: null,
    };
  } catch (error) {
    return {
      hwSheet: null,
      jsonLd: [],
      detailUrlFinal: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const options = parseArgs();
  const startedAt = new Date();

  console.log('Fetching Dordogne playlist pages...');
  const playlist = await fetchPlaylistPages(options.concurrency, options.maxPages);
  const uniquePageItems = deduplicateBySheetId(playlist.items);
  const selectedPageItems = options.limitDetails
    ? uniquePageItems.slice(0, options.limitDetails)
    : uniquePageItems;

  console.log(
    `Playlist: ${playlist.items.length} rows, ${uniquePageItems.length} unique sheetIds, ${playlist.lastPage} pages.`
  );
  console.log(
    `Fetching ${selectedPageItems.length} detail pages with concurrency ${options.concurrency}...`
  );

  let detailCount = 0;
  const failedDetails: FailedDetail[] = [];
  const meubles = await mapConcurrent(selectedPageItems, options.concurrency, async (pageItem) => {
    const detail = await fetchDetail(pageItem);
    detailCount += 1;
    if (detailCount % 100 === 0 || detailCount === selectedPageItems.length) {
      console.log(`Details fetched: ${detailCount}/${selectedPageItems.length}`);
    }
    if (detail.error && pageItem.item.sheetId) {
      failedDetails.push({
        sheetId: pageItem.item.sheetId,
        url: buildDetailUrl(pageItem.item),
        error: detail.error,
      });
    }
    return normalizeMeuble(pageItem, detail);
  });

  const generatedAt = new Date().toISOString();
  const output = {
    metadata: {
      generatedAt,
      source: {
        playlistUrl: buildPlaylistUrl(1).replace('page=1', 'page={page}'),
        pagesFetched: playlist.lastPage,
        playlistTotal: playlist.total,
        playlistRows: playlist.items.length,
        uniqueSheetIds: uniquePageItems.length,
        detailsFetched: selectedPageItems.length,
        failedDetails: failedDetails.length,
        playlistFallbackPagesWithoutRandomSeed: playlist.fallbackPages,
        durationSeconds: Math.round((Date.now() - startedAt.getTime()) / 1000),
      },
      notes: [
        'Les emails ne sont pas exposés en clair par les fiches Dordogne ; le champ contacts.email reste donc null.',
        "contacts.hasEmail indique seulement qu'un formulaire de contact existe côté Dordogne Périgord Tourisme.",
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
