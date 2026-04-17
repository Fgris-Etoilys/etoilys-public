import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const ROOT_DIR = process.cwd();
const INPUT_XML_PATH = path.join(ROOT_DIR, 'docs', 'taxe_sejour_donnees_deliberations.xml');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data');
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, 'taxe-sejour-dataset.v1.json');

const MEUBLE_NATURE_ID = '4';
const TAX_MASK_DEPARTMENTAL_10 = 1;
const TAX_MASK_REGIONAL_15 = 2;
const TAX_MASK_LGV_34 = 4;
const TAX_MASK_IDFM_200 = 8;

type RegimeCode = 'r' | 'f';

type CityTuple = [
  id: string,
  label: string,
  searchKey: string,
  regime: RegimeCode,
  multiPeriodFlag: 0 | 1,
  taxMask: number,
  nonClassRatePct: number,
  nonClassCap: number,
  star1Rate: number,
  star2Rate: number,
  star3Rate: number,
  star4Rate: number,
  star5Rate: number,
];

interface CompactDataset {
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
  tarifs?: {
    tarif?: RawTarif | RawTarif[];
  };
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
  regime: RegimeCode;
  multiPeriodFlag: 0 | 1;
  taxMask: number;
  nonClassRatePct: number;
  nonClassCap: number;
  star1Rate: number;
  star2Rate: number;
  star3Rate: number;
  star4Rate: number;
  star5Rate: number;
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

function getMeubleRegime(deliberation: RawDeliberation): RegimeCode {
  const regimes = toArray(deliberation.regimes?.regime);
  const meubleRegime = regimes.find((regime) => readText(regime.natureId) === MEUBLE_NATURE_ID);
  const regimeText = readText(meubleRegime);
  return regimeText.toLowerCase() === 'forfaitaire' ? 'f' : 'r';
}

function extractRates(deliberation: RawDeliberation): {
  multiPeriodFlag: 0 | 1;
  nonClassRatePct: number;
  nonClassCap: number;
  star1Rate: number;
  star2Rate: number;
  star3Rate: number;
  star4Rate: number;
  star5Rate: number;
} | null {
  const periodes = toArray(deliberation.periodes?.periode);
  if (periodes.length === 0) {
    return null;
  }

  const firstPeriod = periodes[0];
  const tarifs = toArray(firstPeriod.tarifs?.tarif);
  if (tarifs.length === 0) {
    return null;
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
    return null;
  }

  const fixedRates = Array.from(byCategory.entries())
    .filter(([categoryId]) => categoryId !== '9')
    .map(([, value]) => value);
  const nonClassCap = fixedRates.length > 0 ? Math.max(...fixedRates) : 0;

  return {
    multiPeriodFlag: periodes.length > 1 ? 1 : 0,
    nonClassRatePct,
    nonClassCap,
    star1Rate,
    star2Rate,
    star3Rate,
    star4Rate,
    star5Rate,
  };
}

function toCityTuple(entry: CityAccumulator, displayLabel: string): CityTuple {
  const searchKey = normalizeForSearch(
    `${entry.cityName} ${entry.departmentCode} ${entry.epciName}`
  );

  return [
    entry.id,
    displayLabel,
    searchKey,
    entry.regime,
    entry.multiPeriodFlag,
    entry.taxMask,
    entry.nonClassRatePct,
    entry.nonClassCap,
    entry.star1Rate,
    entry.star2Rate,
    entry.star3Rate,
    entry.star4Rate,
    entry.star5Rate,
  ];
}

async function main() {
  const xml = await readFile(INPUT_XML_PATH, 'utf8');
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
    const rates = extractRates(deliberation);
    if (!rates) {
      continue;
    }

    const departmentCode = readText(
      deliberation.saisie?.collectiviteDeliberante?.departement?.numero
    );
    const epciName = readText(deliberation.saisie?.collectiviteDeliberante?.nom);
    const deliberationTimestamp = parseFrenchDate(deliberation.date);

    const regime = getMeubleRegime(deliberation);
    const taxMask = buildTaxMask(deliberation);

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
        regime,
        multiPeriodFlag: rates.multiPeriodFlag,
        taxMask,
        nonClassRatePct: rates.nonClassRatePct,
        nonClassCap: rates.nonClassCap,
        star1Rate: rates.star1Rate,
        star2Rate: rates.star2Rate,
        star3Rate: rates.star3Rate,
        star4Rate: rates.star4Rate,
        star5Rate: rates.star5Rate,
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

  const dataset: CompactDataset = {
    v: readText(delta.version) || 'unknown',
    sd: readText(delta.date),
    g: new Date().toISOString(),
    c: tuples,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_JSON_PATH, JSON.stringify(dataset), 'utf8');

  console.log(`Generated ${tuples.length} cities in ${path.relative(ROOT_DIR, OUTPUT_JSON_PATH)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
