export const TAXE_SEJOUR_DATASET_URL = '/data/taxe-sejour-dataset.v1.json';

export const TAXE_MASK_DEPARTMENTAL_10 = 1;
export const TAXE_MASK_REGIONAL_15 = 2;
export const TAXE_MASK_LGV_34 = 4;
export const TAXE_MASK_IDFM_200 = 8;

export type TaxeSejourRegimeCode = 'r' | 'f';

export type TaxeSejourCityTuple = [
  id: string,
  label: string,
  searchKey: string,
  regime: TaxeSejourRegimeCode,
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

interface RawTaxeSejourDataset {
  v: string;
  sd: string;
  g: string;
  c: TaxeSejourCityTuple[];
}

export interface TaxeSejourCity {
  id: string;
  label: string;
  searchKey: string;
  regime: TaxeSejourRegimeCode;
  hasMultiplePeriods: boolean;
  taxMask: number;
  rates: {
    nonClassRatePct: number;
    nonClassCap: number;
    star1Rate: number;
    star2Rate: number;
    star3Rate: number;
    star4Rate: number;
    star5Rate: number;
  };
}

export interface TaxeSejourDataset {
  version: string;
  sourceDate: string;
  generatedAt: string;
  cities: TaxeSejourCity[];
}

function isTaxeSejourCityTuple(value: unknown): value is TaxeSejourCityTuple {
  return (
    Array.isArray(value) &&
    value.length === 13 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string' &&
    typeof value[2] === 'string' &&
    (value[3] === 'r' || value[3] === 'f') &&
    (value[4] === 0 || value[4] === 1) &&
    typeof value[5] === 'number' &&
    typeof value[6] === 'number' &&
    typeof value[7] === 'number' &&
    typeof value[8] === 'number' &&
    typeof value[9] === 'number' &&
    typeof value[10] === 'number' &&
    typeof value[11] === 'number' &&
    typeof value[12] === 'number'
  );
}

function isRawDataset(value: unknown): value is RawTaxeSejourDataset {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const dataset = value as Partial<RawTaxeSejourDataset>;
  return (
    typeof dataset.v === 'string' &&
    typeof dataset.sd === 'string' &&
    typeof dataset.g === 'string' &&
    Array.isArray(dataset.c) &&
    dataset.c.every(isTaxeSejourCityTuple)
  );
}

function decodeCity(tuple: TaxeSejourCityTuple): TaxeSejourCity {
  return {
    id: tuple[0],
    label: tuple[1],
    searchKey: tuple[2],
    regime: tuple[3],
    hasMultiplePeriods: tuple[4] === 1,
    taxMask: tuple[5],
    rates: {
      nonClassRatePct: tuple[6],
      nonClassCap: tuple[7],
      star1Rate: tuple[8],
      star2Rate: tuple[9],
      star3Rate: tuple[10],
      star4Rate: tuple[11],
      star5Rate: tuple[12],
    },
  };
}

export function normalizeTaxeSejourSearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export async function loadTaxeSejourDataset(signal?: AbortSignal): Promise<TaxeSejourDataset> {
  const response = await fetch(TAXE_SEJOUR_DATASET_URL, {
    method: 'GET',
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Impossible de charger le dataset taxe de sejour (HTTP ${response.status}).`);
  }

  const rawData: unknown = await response.json();
  if (!isRawDataset(rawData)) {
    throw new Error('Format de dataset taxe de sejour invalide.');
  }

  return {
    version: rawData.v,
    sourceDate: rawData.sd,
    generatedAt: rawData.g,
    cities: rawData.c.map(decodeCity),
  };
}
