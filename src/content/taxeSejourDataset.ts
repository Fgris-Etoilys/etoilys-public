export const TAXE_SEJOUR_DATASET_URL = '/data/taxe-sejour-dataset.v1.json';

export const TAXE_MASK_DEPARTMENTAL_10 = 1;
export const TAXE_MASK_REGIONAL_15 = 2;
export const TAXE_MASK_LGV_34 = 4;
export const TAXE_MASK_IDFM_200 = 8;

export type TaxeSejourRegimeCode = 'r' | 'f';

export type TaxeSejourPeriodTuple = [
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

export type TaxeSejourAbatementTuple = [ratePercent: number, nightsMin: number, nightsMax: number];

export type TaxeSejourCityTuple = [
  id: string,
  label: string,
  searchKey: string,
  classifiedRegime: TaxeSejourRegimeCode,
  unclassifiedRegime: TaxeSejourRegimeCode,
  taxMask: number,
  periods: TaxeSejourPeriodTuple[],
  abatements: TaxeSejourAbatementTuple[],
];

interface RawTaxeSejourDataset {
  v: string;
  sd: string;
  g: string;
  c: TaxeSejourCityTuple[];
}

export interface TaxeSejourPeriod {
  key: string;
  startLabel: string;
  endLabel: string;
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

export interface TaxeSejourAbatement {
  ratePercent: number;
  nightsMin: number;
  nightsMax: number;
}

export interface TaxeSejourCity {
  id: string;
  label: string;
  searchKey: string;
  classifiedRegime: TaxeSejourRegimeCode;
  unclassifiedRegime: TaxeSejourRegimeCode;
  taxMask: number;
  periods: TaxeSejourPeriod[];
  abatements: TaxeSejourAbatement[];
  hasMultiplePeriods: boolean;
}

export interface TaxeSejourDataset {
  version: string;
  sourceDate: string;
  generatedAt: string;
  cities: TaxeSejourCity[];
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isRegimeCode(value: unknown): value is TaxeSejourRegimeCode {
  return value === 'r' || value === 'f';
}

function isTaxeSejourPeriodTuple(value: unknown): value is TaxeSejourPeriodTuple {
  return (
    Array.isArray(value) &&
    value.length === 10 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string' &&
    typeof value[2] === 'string' &&
    isFiniteNumber(value[3]) &&
    isFiniteNumber(value[4]) &&
    isFiniteNumber(value[5]) &&
    isFiniteNumber(value[6]) &&
    isFiniteNumber(value[7]) &&
    isFiniteNumber(value[8]) &&
    isFiniteNumber(value[9])
  );
}

function isTaxeSejourAbatementTuple(value: unknown): value is TaxeSejourAbatementTuple {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    isFiniteNumber(value[0]) &&
    isFiniteNumber(value[1]) &&
    isFiniteNumber(value[2])
  );
}

function isTaxeSejourCityTuple(value: unknown): value is TaxeSejourCityTuple {
  return (
    Array.isArray(value) &&
    value.length === 8 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string' &&
    typeof value[2] === 'string' &&
    isRegimeCode(value[3]) &&
    isRegimeCode(value[4]) &&
    isFiniteNumber(value[5]) &&
    Array.isArray(value[6]) &&
    value[6].every(isTaxeSejourPeriodTuple) &&
    Array.isArray(value[7]) &&
    value[7].every(isTaxeSejourAbatementTuple)
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

function decodePeriod(tuple: TaxeSejourPeriodTuple): TaxeSejourPeriod {
  return {
    key: tuple[0],
    startLabel: tuple[1],
    endLabel: tuple[2],
    rates: {
      nonClassRatePct: tuple[3],
      nonClassCap: tuple[4],
      star1Rate: tuple[5],
      star2Rate: tuple[6],
      star3Rate: tuple[7],
      star4Rate: tuple[8],
      star5Rate: tuple[9],
    },
  };
}

function decodeAbatement(tuple: TaxeSejourAbatementTuple): TaxeSejourAbatement {
  return {
    ratePercent: tuple[0],
    nightsMin: tuple[1],
    nightsMax: tuple[2],
  };
}

function decodeCity(tuple: TaxeSejourCityTuple): TaxeSejourCity {
  const periods = tuple[6].map(decodePeriod);
  return {
    id: tuple[0],
    label: tuple[1],
    searchKey: tuple[2],
    classifiedRegime: tuple[3],
    unclassifiedRegime: tuple[4],
    taxMask: tuple[5],
    periods,
    abatements: tuple[7].map(decodeAbatement),
    hasMultiplePeriods: periods.length > 1,
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
  const requestInit: RequestInit = {
    method: 'GET',
    cache: 'no-store',
  };
  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(TAXE_SEJOUR_DATASET_URL, requestInit);

  if (!response.ok) {
    throw new Error(`Impossible de charger le dataset taxe de séjour (HTTP ${response.status}).`);
  }

  const rawData: unknown = await response.json();
  if (!isRawDataset(rawData)) {
    throw new Error('Format de dataset taxe de séjour invalide.');
  }

  return {
    version: rawData.v,
    sourceDate: rawData.sd,
    generatedAt: rawData.g,
    cities: rawData.c.map(decodeCity),
  };
}
