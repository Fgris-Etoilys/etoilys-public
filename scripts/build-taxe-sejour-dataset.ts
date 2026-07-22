import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { XMLParser } from 'fast-xml-parser';

const ROOT_DIR = process.cwd();
const INPUT_XML_PATH = path.join(ROOT_DIR, 'docs', 'data', 'taxe_sejour_donnees_deliberations.xml');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data');
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, 'taxe-sejour-dataset.v1.json');

const CLASSIFIED_NATURE_ID = '4';
const UNCLASSIFIED_NATURE_ID = '10';
const TAX_MASK_DEPARTMENTAL_10 = 1;
const TAX_MASK_REGIONAL_15 = 2;
const TAX_MASK_LGV_34 = 4;
const TAX_MASK_IDFM_200 = 8;

type RegimeCode = 'r' | 'f';

type PeriodTuple = [
  key: string,
  startLabel: string,
  endLabel: string,
  nonClassRatePct: number,
  nonClassCap: number,
  star1Rate: number,
  star2Rate: number,
  star3Rate: number,
  star4Rate: number,
  star5Rate: number,
];

type AbatementTuple = [ratePercent: number, nightsMin: number, nightsMax: number];

type CityTuple = [
  id: string,
  label: string,
  searchKey: string,
  classifiedRegime: RegimeCode,
  unclassifiedRegime: RegimeCode,
  taxMask: number,
  periods: PeriodTuple[],
  abatements: AbatementTuple[],
];

export interface CompactDataset {
  v: string;
  sd: string;
  g: string;
  c: CityTuple[];
}

interface TextNode {
  '#text'?: string;
  [key: string]: unknown;
}

interface RawCollectivite {
  nom?: string;
  codeInsee?: string;
}

interface RawTarif extends TextNode {
  categorieId?: string;
  isMax?: string;
}

interface RawPeriode {
  dateDebut?: string;
  dateFin?: string;
  tarifs?: {
    tarif?: RawTarif | RawTarif[];
  };
}

interface RawAbattement {
  taux?: string;
  nuiteMin?: string;
  nuiteMax?: string;
}

interface RawRegime extends TextNode {
  natureId?: string;
}

interface RawDeliberation {
  date?: string;
  taxeAdditionnelleDepartementale?: string;
  taxeAdditionnelleRegionale?: string;
  taxeAdditionnelleLGV?: string;
  'taxeAdditionnelleArticleL2531-18'?: string;
  saisie?: {
    collectiviteDeliberante?: {
      nom?: string;
      codeInsee?: string;
      departement?: {
        numero?: string;
      };
    };
  };
  collectivites?: {
    collectivite?: RawCollectivite | RawCollectivite[];
  };
  regimes?: {
    regime?: RawRegime | RawRegime[];
  };
  periodes?: {
    periode?: RawPeriode | RawPeriode[];
  };
  abattements?: {
    abattement?: RawAbattement | RawAbattement[];
  };
}

interface RawDeltaRoot {
  delta?: {
    version?: string;
    date?: string;
    deliberations?: {
      deliberation?: RawDeliberation | RawDeliberation[];
    };
  };
}

interface CityAccumulator {
  id: string;
  cityName: string;
  departmentCode: string;
  epciName: string;
  classifiedRegime: RegimeCode;
  unclassifiedRegime: RegimeCode;
  taxMask: number;
  periods: PeriodTuple[];
  abatements: AbatementTuple[];
  deliberationTimestamp: number;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function readText(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value && typeof value === 'object' && '#text' in value) {
    const text = (value as TextNode)['#text'];
    return typeof text === 'string' ? text.trim() : '';
  }
  return '';
}

function parseNumber(value: unknown): number {
  const raw = readText(value).replace(',', '.');
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInteger(value: unknown): number {
  const parsed = Number(readText(value));
  if (!Number.isFinite(parsed)) {
    return NaN;
  }
  return Math.trunc(parsed);
}

function parseBoolean(value: unknown): boolean {
  return readText(value).toLowerCase() === 'true';
}

function parseFrenchDate(value: unknown): number {
  const raw = readText(value);
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (!match) {
    return 0;
  }

  const [, day, month, year] = match;
  const parsed = Date.UTC(Number(year), Number(month) - 1, Number(day));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function toRegimeCode(regimeText: string): RegimeCode {
  return regimeText.toLowerCase() === 'forfaitaire' ? 'f' : 'r';
}

function buildTaxMask(deliberation: RawDeliberation): number {
  let mask = 0;
  if (parseBoolean(deliberation.taxeAdditionnelleDepartementale)) {
    mask |= TAX_MASK_DEPARTMENTAL_10;
  }
  if (parseBoolean(deliberation.taxeAdditionnelleRegionale)) {
    mask |= TAX_MASK_REGIONAL_15;
  }
  if (parseBoolean(deliberation.taxeAdditionnelleLGV)) {
    mask |= TAX_MASK_LGV_34;
  }
  if (parseBoolean(deliberation['taxeAdditionnelleArticleL2531-18'])) {
    mask |= TAX_MASK_IDFM_200;
  }
  return mask;
}

function getRegimeByNatureId(deliberation: RawDeliberation, natureId: string): RegimeCode {
  const regimes = toArray(deliberation.regimes?.regime);
  const matchingRegime = regimes.find((regime) => readText(regime.natureId) === natureId);
  return toRegimeCode(readText(matchingRegime));
}

function extractPeriods(deliberation: RawDeliberation): PeriodTuple[] {
  const periodes = toArray(deliberation.periodes?.periode);
  const extractedPeriods: PeriodTuple[] = [];

  for (let index = 0; index < periodes.length; index += 1) {
    const period = periodes[index];
    const tarifs = toArray(period.tarifs?.tarif);
    if (tarifs.length === 0) {
      continue;
    }

    const byCategory = new Map<string, number>();
    for (const tarif of tarifs) {
      const categoryId = readText(tarif.categorieId);
      if (!categoryId) {
        continue;
      }
      byCategory.set(categoryId, parseNumber(tarif));
    }

    const nonClassRatePct = byCategory.get('9');
    const star1Rate = byCategory.get('6');
    const star2Rate = byCategory.get('5');
    const star3Rate = byCategory.get('4');
    const star4Rate = byCategory.get('3');
    const star5Rate = byCategory.get('2');

    if (
      nonClassRatePct === undefined ||
      star1Rate === undefined ||
      star2Rate === undefined ||
      star3Rate === undefined ||
      star4Rate === undefined ||
      star5Rate === undefined
    ) {
      continue;
    }

    const fixedRates = Array.from(byCategory.entries())
      .filter(([categoryId]) => categoryId !== '9')
      .map(([, value]) => value);
    const nonClassCap = fixedRates.length > 0 ? Math.max(...fixedRates) : 0;

    const startLabel = readText(period.dateDebut);
    const endLabel = readText(period.dateFin);
    const normalizedKey = normalizeForSearch(`${startLabel} ${endLabel}`) || 'periode';

    extractedPeriods.push([
      `${normalizedKey}-${index + 1}`,
      startLabel,
      endLabel,
      nonClassRatePct,
      nonClassCap,
      star1Rate,
      star2Rate,
      star3Rate,
      star4Rate,
      star5Rate,
    ]);
  }

  return extractedPeriods;
}

function extractAbatements(deliberation: RawDeliberation): AbatementTuple[] {
  const abattements = toArray(deliberation.abattements?.abattement);
  const extractedAbatements: AbatementTuple[] = [];

  for (const abattement of abattements) {
    const ratePercent = parseNumber(abattement.taux);
    const nightsMin = parseInteger(abattement.nuiteMin);
    const nightsMax = parseInteger(abattement.nuiteMax);

    if (
      !Number.isFinite(ratePercent) ||
      !Number.isFinite(nightsMin) ||
      !Number.isFinite(nightsMax) ||
      nightsMin < 0 ||
      nightsMax < nightsMin
    ) {
      continue;
    }

    extractedAbatements.push([ratePercent, nightsMin, nightsMax]);
  }

  extractedAbatements.sort((left, right) => left[1] - right[1] || left[2] - right[2]);
  return extractedAbatements;
}

function toCityTuple(entry: CityAccumulator, displayLabel: string): CityTuple {
  const searchKey = normalizeForSearch(
    `${entry.cityName} ${entry.departmentCode} ${entry.epciName}`
  );

  return [
    entry.id,
    displayLabel,
    searchKey,
    entry.classifiedRegime,
    entry.unclassifiedRegime,
    entry.taxMask,
    entry.periods,
    entry.abatements,
  ];
}

export function buildCompactDatasetFromXml(
  xml: string,
  generatedAt = new Date().toISOString()
): CompactDataset {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    trimValues: true,
    parseTagValue: false,
    parseAttributeValue: false,
  });
  const parsed = parser.parse(xml) as RawDeltaRoot;
  const delta = parsed.delta;

  if (!delta) {
    throw new Error('Invalid XML: root <delta> not found.');
  }

  const deliberations = toArray(delta.deliberations?.deliberation);
  const cityById = new Map<string, CityAccumulator>();

  for (const deliberation of deliberations) {
    const periods = extractPeriods(deliberation);
    if (periods.length === 0) {
      continue;
    }

    const departmentCode = readText(
      deliberation.saisie?.collectiviteDeliberante?.departement?.numero
    );
    const epciName = readText(deliberation.saisie?.collectiviteDeliberante?.nom);
    const deliberationTimestamp = parseFrenchDate(deliberation.date);
    const classifiedRegime = getRegimeByNatureId(deliberation, CLASSIFIED_NATURE_ID);
    const unclassifiedRegime = getRegimeByNatureId(deliberation, UNCLASSIFIED_NATURE_ID);
    const taxMask = buildTaxMask(deliberation);
    const abatements = extractAbatements(deliberation);

    const collectivites = toArray(deliberation.collectivites?.collectivite);
    const deliberanteCodeInsee = readText(deliberation.saisie?.collectiviteDeliberante?.codeInsee);
    const deliberanteName = readText(deliberation.saisie?.collectiviteDeliberante?.nom);
    if (deliberanteCodeInsee && deliberanteName) {
      collectivites.push({
        codeInsee: deliberanteCodeInsee,
        nom: deliberanteName,
      });
    }

    for (const collectivite of collectivites) {
      const id = readText(collectivite.codeInsee);
      const cityName = readText(collectivite.nom);

      if (!id || !cityName || !departmentCode || !epciName) {
        continue;
      }

      const nextEntry: CityAccumulator = {
        id,
        cityName,
        departmentCode,
        epciName,
        classifiedRegime,
        unclassifiedRegime,
        taxMask,
        periods,
        abatements,
        deliberationTimestamp,
      };

      const current = cityById.get(id);
      if (!current || nextEntry.deliberationTimestamp >= current.deliberationTimestamp) {
        cityById.set(id, nextEntry);
      }
    }
  }

  const cities = Array.from(cityById.values());
  const collisions = new Map<string, number>();
  for (const city of cities) {
    const key = `${normalizeForSearch(city.cityName)}|${city.departmentCode}`;
    collisions.set(key, (collisions.get(key) ?? 0) + 1);
  }

  const tuples = cities
    .map((city) => {
      const key = `${normalizeForSearch(city.cityName)}|${city.departmentCode}`;
      const hasCollision = (collisions.get(key) ?? 0) > 1;
      const displayLabel = hasCollision
        ? `${city.cityName} (${city.departmentCode}) - ${city.epciName}`
        : `${city.cityName} (${city.departmentCode})`;
      return toCityTuple(city, displayLabel);
    })
    .sort((left, right) => left[1].localeCompare(right[1], 'fr-FR'));

  return {
    v: readText(delta.version) || 'unknown',
    sd: readText(delta.date),
    g: generatedAt,
    c: tuples,
  };
}

async function main() {
  const xml = await readFile(INPUT_XML_PATH, 'utf8');
  const dataset = buildCompactDatasetFromXml(xml);

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_JSON_PATH, JSON.stringify(dataset), 'utf8');

  console.log(
    `Generated ${dataset.c.length} cities in ${path.relative(ROOT_DIR, OUTPUT_JSON_PATH)}.`
  );
}

const isDirectExecution =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
