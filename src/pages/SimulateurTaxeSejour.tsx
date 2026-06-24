import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Tooltip from '../components/ui/Tooltip';
import ResponsiveComparisonTable, {
  type ResponsiveComparisonColumn,
  type ResponsiveComparisonRow,
} from '../components/ui/ResponsiveComparisonTable';
import { useToast } from '../components/ui/Toast';
import {
  loadTaxeSejourDataset,
  normalizeTaxeSejourSearchTerm,
  type TaxeSejourCity,
  type TaxeSejourDataset,
} from '../content/taxeSejourDataset';
import {
  calculateTaxeSejour,
  type TaxeSejourCalculationOutput,
} from '../utils/taxeSejourCalculator';
import {
  copyToClipboard,
  formatFilenameDate,
  getAutoTableFinalY,
  getEtoilysLogoPngAsset,
  normalizePdfText,
} from '../utils/simulatorExport';
import { trackSimulatorCalculated, trackSimulatorStarted } from '../utils/analytics';

interface FormErrors {
  city?: string;
  nightlyPriceHt?: string;
  nights?: string;
  capacity?: string;
  personsStaying?: string;
  exemptedPersons?: string;
}

interface ParsedFormValues {
  nightlyPriceHt: number;
  nights: number;
  capacity?: number;
  personsStaying?: number;
  exemptedPersons?: number;
}

interface PreparedCitySearch {
  city: TaxeSejourCity;
  normalizedCityName: string;
  normalizedNameTokens: string[];
}

interface ScoredSuggestion {
  city: TaxeSejourCity;
  tier: number;
  position: number;
  length: number;
}

const MAX_CITY_SUGGESTIONS = 8;
const TAXE_SEJOUR_STORAGE_KEY = 'etoilys.simulateurTaxeSejour.v1';
const SHARE_QUERY_KEYS = ['city', 'nightly', 'nights', 'capacity', 'persons', 'exempted'] as const;
const RESULT_SCROLL_OFFSET_PX = 96;

interface PersistedFormState {
  cityQuery: string;
  selectedCityId: string | null;
  nightlyPriceHt: string;
  capacity: string;
  nights: string;
  personsStaying: string;
  exemptedPersons: string;
}

interface PersistedCalculationSnapshot {
  cityId: string;
  nightlyPriceHt: number;
  nights: number;
  capacity?: number;
  personsStaying?: number;
  exemptedPersons?: number;
}

interface PersistedSimulateurState {
  version: 1;
  form: PersistedFormState;
  lastCalculation: PersistedCalculationSnapshot | null;
}

interface ShareableCalculationQuery {
  city: string;
  nightly: string;
  nights: string;
  capacity: string | null;
  persons: string | null;
  exempted: string | null;
}

interface BestSavingsResult {
  category: string;
  savingsAmount: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function parsePersistedForm(value: unknown): PersistedFormState | null {
  if (!isRecord(value)) {
    return null;
  }

  const selectedCityIdValue = value.selectedCityId;
  const hasValidSelectedCityId = selectedCityIdValue === null || isString(selectedCityIdValue);
  if (!hasValidSelectedCityId) {
    return null;
  }

  if (
    !isString(value.cityQuery) ||
    !isString(value.nightlyPriceHt) ||
    !isString(value.capacity) ||
    !isString(value.nights) ||
    !isString(value.personsStaying) ||
    !isString(value.exemptedPersons)
  ) {
    return null;
  }

  return {
    cityQuery: value.cityQuery,
    selectedCityId: selectedCityIdValue,
    nightlyPriceHt: value.nightlyPriceHt,
    capacity: value.capacity,
    nights: value.nights,
    personsStaying: value.personsStaying,
    exemptedPersons: value.exemptedPersons,
  };
}

function parsePersistedCalculationSnapshot(value: unknown): PersistedCalculationSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const capacity = value.capacity;
  const personsStaying = value.personsStaying;
  const exemptedPersons = value.exemptedPersons;

  if (
    !isString(value.cityId) ||
    !isFiniteNumber(value.nightlyPriceHt) ||
    !isFiniteNumber(value.nights)
  ) {
    return null;
  }

  if (capacity !== undefined && !isFiniteNumber(capacity)) {
    return null;
  }

  if (personsStaying !== undefined && !isFiniteNumber(personsStaying)) {
    return null;
  }

  if (exemptedPersons !== undefined && !isFiniteNumber(exemptedPersons)) {
    return null;
  }

  const snapshot: PersistedCalculationSnapshot = {
    cityId: value.cityId,
    nightlyPriceHt: value.nightlyPriceHt,
    nights: value.nights,
  };
  if (capacity !== undefined) {
    snapshot.capacity = capacity;
  }
  if (personsStaying !== undefined) {
    snapshot.personsStaying = personsStaying;
  }
  if (exemptedPersons !== undefined) {
    snapshot.exemptedPersons = exemptedPersons;
  }
  return snapshot;
}

function readPersistedSimulateurState(): PersistedSimulateurState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(TAXE_SEJOUR_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawValue);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return null;
    }

    const form = parsePersistedForm(parsed.form);
    if (!form) {
      return null;
    }

    let lastCalculation: PersistedCalculationSnapshot | null = null;
    if (parsed.lastCalculation !== null && parsed.lastCalculation !== undefined) {
      lastCalculation = parsePersistedCalculationSnapshot(parsed.lastCalculation);
      if (!lastCalculation) {
        return null;
      }
    }

    return {
      version: 1,
      form,
      lastCalculation,
    };
  } catch {
    return null;
  }
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parsePositiveInteger(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}

function parseNonNegativeInteger(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}

function parseShareableCalculationSnapshot(search: string): PersistedCalculationSnapshot | null {
  const params = new URLSearchParams(search);
  const query = {
    city: params.get('city') ?? '',
    nightly: params.get('nightly') ?? '',
    nights: params.get('nights') ?? '',
    capacity: params.get('capacity'),
    persons: params.get('persons'),
    exempted: params.get('exempted'),
  } satisfies ShareableCalculationQuery;

  if (!query.city.trim()) {
    return null;
  }

  const nightlyPriceHt = parsePositiveNumber(query.nightly);
  const nights = parsePositiveInteger(query.nights);
  if (nightlyPriceHt === null || nights === null) {
    return null;
  }

  const parsedCapacity =
    query.capacity === null || query.capacity === ''
      ? undefined
      : parsePositiveInteger(query.capacity);
  if (query.capacity !== null && query.capacity !== '' && parsedCapacity === null) {
    return null;
  }
  const capacity = parsedCapacity ?? undefined;

  const parsedPersonsStaying =
    query.persons === null || query.persons === ''
      ? undefined
      : parsePositiveInteger(query.persons);
  if (query.persons !== null && query.persons !== '' && parsedPersonsStaying === null) {
    return null;
  }
  const personsStaying = parsedPersonsStaying ?? undefined;

  const parsedExemptedPersons =
    query.exempted === null || query.exempted === ''
      ? undefined
      : parseNonNegativeInteger(query.exempted);
  if (query.exempted !== null && query.exempted !== '' && parsedExemptedPersons === null) {
    return null;
  }
  const exemptedPersons = parsedExemptedPersons ?? undefined;

  if (
    personsStaying !== undefined &&
    exemptedPersons !== undefined &&
    exemptedPersons > personsStaying
  ) {
    return null;
  }

  const snapshot: PersistedCalculationSnapshot = {
    cityId: query.city.trim(),
    nightlyPriceHt,
    nights,
  };
  if (capacity !== undefined) {
    snapshot.capacity = capacity;
  }
  if (personsStaying !== undefined) {
    snapshot.personsStaying = personsStaying;
  }
  if (exemptedPersons !== undefined) {
    snapshot.exemptedPersons = exemptedPersons;
  }
  return snapshot;
}

function buildShareQueryParams(snapshot: PersistedCalculationSnapshot): URLSearchParams {
  const params = new URLSearchParams();
  params.set('city', snapshot.cityId);
  params.set('nightly', snapshot.nightlyPriceHt.toString());
  params.set('nights', snapshot.nights.toString());

  if (snapshot.capacity !== undefined) {
    params.set('capacity', snapshot.capacity.toString());
  }
  if (snapshot.personsStaying !== undefined) {
    params.set('persons', snapshot.personsStaying.toString());
  }
  if (snapshot.exemptedPersons !== undefined) {
    params.set('exempted', snapshot.exemptedPersons.toString());
  }

  return params;
}

function replaceShareQueryInUrl(snapshot: PersistedCalculationSnapshot | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  for (const key of SHARE_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  if (snapshot) {
    const shareParams = buildShareQueryParams(snapshot);
    shareParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function buildShareUrl(snapshot: PersistedCalculationSnapshot): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  for (const key of SHARE_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  const shareParams = buildShareQueryParams(snapshot);
  shareParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function formatEuro(value: number): string {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPdfEuro(value: number): string {
  return normalizePdfText(formatEuro(value));
}

function formatDeltaPercent(delta: number, nonClasseReference: number): string {
  if (nonClasseReference === 0) {
    return 'n/a';
  }

  const percent = Math.round((delta / nonClasseReference) * 100);
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent} %`;
}

function formatReadableDeltaWithPercent(delta: number, nonClasseReference: number): string {
  if (delta === 0) {
    return 'Aucun écart';
  }

  const formattedAmount = formatEuro(Math.abs(delta));
  const formattedPercent = formatDeltaPercent(delta, nonClasseReference);
  const deltaLabel = delta < 0 ? 'économisés' : 'de plus';

  return `${formattedAmount} ${deltaLabel} (${formattedPercent})`;
}

function formatPdfReadableDeltaWithPercent(delta: number, nonClasseReference: number): string {
  return normalizePdfText(formatReadableDeltaWithPercent(delta, nonClasseReference));
}

function getDeltaClassName(delta: number): string {
  if (delta < 0) {
    return 'text-success-500';
  }
  if (delta > 0) {
    return 'text-alert-500';
  }
  return 'text-gray-600';
}

function getNightsLabel(nights: number): string {
  return `${nights} ${nights > 1 ? 'nuits' : 'nuit'}`;
}

function getRentedNightsLabel(nights: number): string {
  return `${nights} ${nights > 1 ? 'nuits louées' : 'nuit louée'}`;
}

function formatPeopleLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`;
}

function formatClassifiedCategoryForSentence(category: string): string {
  const match = category.match(/^([1-5])\*$/);
  if (!match) {
    return category;
  }

  const stars = Number(match[1]);
  return `${stars} ${stars > 1 ? 'étoiles' : 'étoile'}`;
}

function findBestSavings(
  rows: TaxeSejourCalculationOutput['rows'],
  nonClasseReference: number
): BestSavingsResult | null {
  let bestSavings: BestSavingsResult | null = null;

  for (const row of rows) {
    if (row.category === 'Non classé') {
      continue;
    }

    const savingsAmount = nonClasseReference - row.amount;
    if (savingsAmount <= 0) {
      continue;
    }

    if (!bestSavings || savingsAmount > bestSavings.savingsAmount) {
      bestSavings = {
        category: row.category,
        savingsAmount,
      };
    }
  }

  return bestSavings;
}

function getSimulationAssumptionsSentence(
  cityLabel: string,
  snapshot: PersistedCalculationSnapshot
): string {
  const parts = [`Simulation réalisée pour ${cityLabel}`, `sur ${getNightsLabel(snapshot.nights)}`];

  if (snapshot.personsStaying !== undefined) {
    const personsLabel = formatPeopleLabel(
      snapshot.personsStaying,
      'personne accueillie',
      'personnes accueillies'
    );
    const exemptedLabel = formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exonérée', 'exonérées');
    parts.push(`avec ${personsLabel} dont ${exemptedLabel}`);
  } else if (snapshot.capacity !== undefined) {
    parts.push(
      `avec une capacité renseignée de ${formatPeopleLabel(
        snapshot.capacity,
        'personne',
        'personnes'
      )}`
    );
  }

  parts.push(`au prix moyen de ${formatEuro(snapshot.nightlyPriceHt)} HT / nuit`);

  return `${parts.join(', ')}.`;
}

function getSimulationAssumptionFacts(
  cityLabel: string,
  snapshot: PersistedCalculationSnapshot
): string[] {
  const facts = [cityLabel, getRentedNightsLabel(snapshot.nights)];

  if (snapshot.personsStaying !== undefined) {
    facts.push(
      formatPeopleLabel(snapshot.personsStaying, 'personne accueillie', 'personnes accueillies')
    );
    facts.push(formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exonérée', 'exonérées'));
  } else if (snapshot.capacity !== undefined) {
    facts.push(
      formatPeopleLabel(snapshot.capacity, 'personne de capacité', 'personnes de capacité')
    );
  }

  return facts;
}

function formatFrenchTariffDateLabel(label: string): string {
  const normalizedLabel = label.trim().replace(/\s+/g, ' ');
  const firstDayMatch = normalizedLabel.match(/^0?1\s+(.+)$/i);
  if (firstDayMatch?.[1]) {
    return `1er ${firstDayMatch[1]}`;
  }

  return normalizedLabel.replace(/^0([2-9])\s+/, '$1 ');
}

function getTariffPeriodSentence(startLabel: string, endLabel: string): string {
  return `Période tarifaire considérée : du ${formatFrenchTariffDateLabel(
    startLabel
  )} au ${formatFrenchTariffDateLabel(endLabel)}.`;
}

function getTariffPeriodCompactLabel(startLabel: string, endLabel: string): string {
  return `Période : du ${formatFrenchTariffDateLabel(startLabel)} au ${formatFrenchTariffDateLabel(
    endLabel
  )}`;
}

function isFullYearPeriod(startLabel: string, endLabel: string): boolean {
  const normalizedStart = startLabel.trim().toLowerCase();
  const normalizedEnd = endLabel.trim().toLowerCase();
  const isJanuaryStart = /^(0?1|1er)\s+janvier$/.test(normalizedStart);
  const isDecemberEnd = /^31\s+d[ée]cembre$/.test(normalizedEnd);
  return isJanuaryStart && isDecemberEnd;
}

function extractCityNameWithoutDepartment(label: string): string {
  return label.replace(/\s*\([0-9A-Z]{2,3}\)\s*$/i, '').trim();
}

function extractDepartmentBucket(label: string): string {
  return label.match(/\(([0-9A-Z]{2,3})\)\s*$/i)?.[1] ?? 'unknown';
}

function bucketNumber(value: number, buckets: readonly number[]): string {
  const firstBucket = buckets[0];
  if (firstBucket === undefined || value <= firstBucket) {
    return `0-${firstBucket ?? 0}`;
  }

  for (let index = 1; index < buckets.length; index += 1) {
    const previous = buckets[index - 1];
    const current = buckets[index];
    if (previous !== undefined && current !== undefined && value <= current) {
      return `${previous + 1}-${current}`;
    }
  }

  return `${buckets[buckets.length - 1]}+`;
}

function isEditDistanceAtMostOneWithSwap(query: string, candidate: string): boolean {
  if (query === candidate) {
    return true;
  }

  const queryLength = query.length;
  const candidateLength = candidate.length;
  const lengthDifference = Math.abs(queryLength - candidateLength);
  if (lengthDifference > 1) {
    return false;
  }

  if (queryLength === candidateLength) {
    const mismatchIndexes: number[] = [];
    for (let index = 0; index < queryLength; index += 1) {
      if (query[index] !== candidate[index]) {
        mismatchIndexes.push(index);
        if (mismatchIndexes.length > 2) {
          return false;
        }
      }
    }

    if (mismatchIndexes.length === 1) {
      return true;
    }

    if (mismatchIndexes.length === 2) {
      const firstIndex = mismatchIndexes[0];
      const secondIndex = mismatchIndexes[1];
      if (firstIndex === undefined || secondIndex === undefined) {
        return false;
      }
      return (
        secondIndex === firstIndex + 1 &&
        query[firstIndex] === candidate[secondIndex] &&
        query[secondIndex] === candidate[firstIndex]
      );
    }

    return false;
  }

  const longer = queryLength > candidateLength ? query : candidate;
  const shorter = queryLength > candidateLength ? candidate : query;

  let longerIndex = 0;
  let shorterIndex = 0;
  let mismatchCount = 0;

  while (longerIndex < longer.length && shorterIndex < shorter.length) {
    if (longer[longerIndex] === shorter[shorterIndex]) {
      longerIndex += 1;
      shorterIndex += 1;
      continue;
    }

    mismatchCount += 1;
    if (mismatchCount > 1) {
      return false;
    }
    longerIndex += 1;
  }

  return true;
}

function getFuzzyScore(query: string, citySearch: PreparedCitySearch): number | null {
  const candidates = [citySearch.normalizedCityName, ...citySearch.normalizedNameTokens];
  let bestScore: number | null = null;

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (Math.abs(candidate.length - query.length) > 1) {
      continue;
    }
    if (candidate[0] !== query[0]) {
      continue;
    }
    if (!isEditDistanceAtMostOneWithSwap(query, candidate)) {
      continue;
    }

    const score =
      Math.abs(candidate.length - query.length) +
      (candidate === citySearch.normalizedCityName ? 0 : 1);
    if (bestScore === null || score < bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}

export default function SimulateurTaxeSejour() {
  const { showToast } = useToast();
  const [dataset, setDataset] = useState<TaxeSejourDataset | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cityQuery, setCityQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [nightlyPriceHt, setNightlyPriceHt] = useState('');
  const [capacity, setCapacity] = useState('');
  const [nights, setNights] = useState('');
  const [personsStaying, setPersonsStaying] = useState('');
  const [exemptedPersons, setExemptedPersons] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [result, setResult] = useState<TaxeSejourCalculationOutput | null>(null);
  const [resultCityLabel, setResultCityLabel] = useState('');
  const [lastCalculationSnapshot, setLastCalculationSnapshot] =
    useState<PersistedCalculationSnapshot | null>(null);
  const [pendingRestoredCalculation, setPendingRestoredCalculation] =
    useState<PersistedCalculationSnapshot | null>(null);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const [isCityLabelSyncPending, setIsCityLabelSyncPending] = useState(false);
  const hasTrackedSimulatorStarted = useRef(false);
  const resultBlockRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResultRef = useRef(false);

  const nonClasseAmount = useMemo(() => {
    if (!result) {
      return null;
    }
    return result.rows.find((row) => row.category === 'Non classé')?.amount ?? null;
  }, [result]);

  const bestSavings = useMemo(() => {
    if (!result || nonClasseAmount === null) {
      return null;
    }

    return findBestSavings(result.rows, nonClasseAmount);
  }, [result, nonClasseAmount]);

  const resultColumns = useMemo<ResponsiveComparisonColumn[]>(
    () => [
      {
        key: 'category',
        label: 'Catégorie',
        mobileLabel: 'Catégorie',
        align: 'center',
        widthClassName: 'w-1/4',
      },
      {
        key: 'delta',
        label: 'Économie / surcoût',
        mobileLabel: 'Écart vs non classé',
        align: 'center',
        widthClassName: 'w-5/12',
      },
      {
        key: 'amount',
        label: 'Taxe de séjour totale',
        mobileLabel: 'Taxe de séjour totale',
        align: 'center',
        widthClassName: 'w-1/3',
      },
    ],
    []
  );

  const resultRows = useMemo<ResponsiveComparisonRow[]>(() => {
    if (!result) {
      return [];
    }

    const nonClassReference = nonClasseAmount ?? 0;

    return result.rows.map((row, index) => {
      const delta = row.amount - nonClassReference;
      const isReferenceRow = row.category === 'Non classé';
      const mobileCardClassName = isReferenceRow ? 'border-primary-200 bg-primary-100/60' : null;
      const comparisonRow: ResponsiveComparisonRow = {
        key: row.category,
        rowClassName: isReferenceRow
          ? 'border-b border-primary-200 bg-primary-100/60'
          : index % 2 === 0
            ? 'bg-white border-b border-gray-100'
            : 'bg-gray-50',
        cells: {
          category: (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="font-semibold">{row.category}</span>
              {row.status === 'indicatif' && (
                <span className="text-xs font-semibold text-warning-500">indicatif</span>
              )}
            </div>
          ),
          amount: (
            <span
              className={
                row.category === 'Non classé'
                  ? 'font-semibold text-primary-500'
                  : 'font-semibold text-gray-900'
              }
            >
              {formatEuro(row.amount)}
            </span>
          ),
          delta: isReferenceRow ? (
            <span className="inline-block max-w-[13rem] text-right font-medium text-gray-600 md:max-w-none md:text-center">
              Référence de comparaison
            </span>
          ) : (
            <span
              className={`inline-block max-w-[13rem] text-right font-semibold md:max-w-none md:text-center ${getDeltaClassName(
                delta
              )}`}
            >
              {formatReadableDeltaWithPercent(delta, nonClassReference)}
            </span>
          ),
        },
      };

      if (mobileCardClassName) {
        comparisonRow.mobileCardClassName = mobileCardClassName;
      }

      return comparisonRow;
    });
  }, [result, nonClasseAmount]);

  const resultSummary = useMemo(() => {
    if (!lastCalculationSnapshot) {
      return null;
    }

    return {
      facts: getSimulationAssumptionFacts(resultCityLabel, lastCalculationSnapshot),
      nightlyPriceLabel: `Prix moyen : ${formatEuro(
        lastCalculationSnapshot.nightlyPriceHt
      )} HT / nuit`,
      bestSavings,
    };
  }, [bestSavings, lastCalculationSnapshot, resultCityLabel]);

  const closeTimerRef = useRef<number | null>(null);
  const listId = 'taxe-sejour-city-listbox';

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsStorageHydrated(true);
      return;
    }

    const querySnapshot = parseShareableCalculationSnapshot(window.location.search);
    if (querySnapshot) {
      setCityQuery('');
      setSelectedCityId(querySnapshot.cityId);
      setNightlyPriceHt(querySnapshot.nightlyPriceHt.toString());
      setCapacity(querySnapshot.capacity?.toString() ?? '');
      setNights(querySnapshot.nights.toString());
      setPersonsStaying(querySnapshot.personsStaying?.toString() ?? '');
      setExemptedPersons(querySnapshot.exemptedPersons?.toString() ?? '');
      setLastCalculationSnapshot(querySnapshot);
      setPendingRestoredCalculation(querySnapshot);
      setIsCityLabelSyncPending(true);
      setIsStorageHydrated(true);
      return;
    }

    const persistedState = readPersistedSimulateurState();
    if (persistedState) {
      setCityQuery(persistedState.form.cityQuery);
      setSelectedCityId(persistedState.form.selectedCityId);
      setNightlyPriceHt(persistedState.form.nightlyPriceHt);
      setCapacity(persistedState.form.capacity);
      setNights(persistedState.form.nights);
      setPersonsStaying(persistedState.form.personsStaying);
      setExemptedPersons(persistedState.form.exemptedPersons);
      setLastCalculationSnapshot(persistedState.lastCalculation);
      setPendingRestoredCalculation(persistedState.lastCalculation);
      if (!persistedState.form.cityQuery.trim() && persistedState.form.selectedCityId) {
        setIsCityLabelSyncPending(true);
      }
    }

    setIsStorageHydrated(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    loadTaxeSejourDataset(controller.signal)
      .then((nextDataset) => {
        setDataset(nextDataset);
        setLoadingError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLoadingError(
          error instanceof Error
            ? error.message
            : 'Le chargement du simulateur taxe de séjour a échoué.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const selectedCity = useMemo(() => {
    if (!dataset || !selectedCityId) {
      return null;
    }
    return dataset.cities.find((city) => city.id === selectedCityId) ?? null;
  }, [dataset, selectedCityId]);

  useEffect(() => {
    if (!isCityLabelSyncPending || !selectedCity) {
      return;
    }

    setCityQuery(selectedCity.label);
    setIsCityLabelSyncPending(false);
  }, [isCityLabelSyncPending, selectedCity]);

  const requiresCapacity = selectedCity?.classifiedRegime === 'f';
  const requiresOccupancy = selectedCity
    ? selectedCity.classifiedRegime === 'r' || selectedCity.unclassifiedRegime === 'r'
    : false;

  const normalizedQuery = useMemo(() => normalizeTaxeSejourSearchTerm(cityQuery), [cityQuery]);

  const preparedCitySearch = useMemo(() => {
    if (!dataset) {
      return [] as PreparedCitySearch[];
    }

    return dataset.cities.map((city) => {
      const normalizedCityName = normalizeTaxeSejourSearchTerm(
        extractCityNameWithoutDepartment(city.label)
      );

      return {
        city,
        normalizedCityName,
        normalizedNameTokens: normalizedCityName.split(' ').filter(Boolean),
      };
    });
  }, [dataset]);

  const suggestions = useMemo(() => {
    if (!dataset || !normalizedQuery) {
      return [] as TaxeSejourCity[];
    }

    const strictMatches: ScoredSuggestion[] = [];
    for (const prepared of preparedCitySearch) {
      const { city, normalizedCityName, normalizedNameTokens } = prepared;
      const searchIndex = city.searchKey.indexOf(normalizedQuery);
      if (searchIndex < 0) {
        continue;
      }

      if (normalizedCityName === normalizedQuery) {
        strictMatches.push({
          city,
          tier: 0,
          position: 0,
          length: normalizedCityName.length,
        });
        continue;
      }

      const tokenExactIndex = normalizedNameTokens.findIndex((token) => token === normalizedQuery);
      if (tokenExactIndex >= 0) {
        strictMatches.push({
          city,
          tier: 1,
          position: Math.abs(normalizedCityName.length - normalizedQuery.length),
          length: normalizedCityName.length,
        });
        continue;
      }

      if (normalizedCityName.startsWith(normalizedQuery)) {
        strictMatches.push({
          city,
          tier: 2,
          position: 0,
          length: normalizedCityName.length,
        });
        continue;
      }

      const tokenStartsWithIndex = normalizedNameTokens.findIndex((token) =>
        token.startsWith(normalizedQuery)
      );
      if (tokenStartsWithIndex >= 0) {
        strictMatches.push({
          city,
          tier: 3,
          position: tokenStartsWithIndex,
          length: normalizedCityName.length,
        });
        continue;
      }

      const cityNameContainsIndex = normalizedCityName.indexOf(normalizedQuery);
      if (cityNameContainsIndex >= 0) {
        strictMatches.push({
          city,
          tier: 4,
          position: cityNameContainsIndex,
          length: normalizedCityName.length,
        });
        continue;
      }

      strictMatches.push({
        city,
        tier: 5,
        position: searchIndex,
        length: normalizedCityName.length,
      });
    }

    strictMatches.sort(
      (left, right) =>
        left.tier - right.tier ||
        left.position - right.position ||
        left.length - right.length ||
        left.city.label.localeCompare(right.city.label, 'fr')
    );

    const picked: TaxeSejourCity[] = [];
    const pickedIds = new Set<string>();
    for (const match of strictMatches) {
      if (!pickedIds.has(match.city.id)) {
        picked.push(match.city);
        pickedIds.add(match.city.id);
      }
      if (picked.length >= MAX_CITY_SUGGESTIONS) {
        return picked;
      }
    }

    if (normalizedQuery.length < 4) {
      return picked;
    }

    const fuzzyMatches: ScoredSuggestion[] = [];
    for (const prepared of preparedCitySearch) {
      if (pickedIds.has(prepared.city.id)) {
        continue;
      }

      const fuzzyScore = getFuzzyScore(normalizedQuery, prepared);
      if (fuzzyScore === null) {
        continue;
      }

      fuzzyMatches.push({
        city: prepared.city,
        tier: 6 + fuzzyScore,
        position: 0,
        length: prepared.normalizedCityName.length,
      });
    }

    fuzzyMatches.sort(
      (left, right) =>
        left.tier - right.tier ||
        left.length - right.length ||
        left.city.label.localeCompare(right.city.label, 'fr')
    );

    for (const match of fuzzyMatches) {
      picked.push(match.city);
      if (picked.length >= MAX_CITY_SUGGESTIONS) {
        break;
      }
    }

    return picked;
  }, [dataset, normalizedQuery, preparedCitySearch]);

  useEffect(() => {
    if (!dataset || !pendingRestoredCalculation) {
      return;
    }

    if (selectedCityId !== pendingRestoredCalculation.cityId) {
      setPendingRestoredCalculation(null);
      return;
    }

    const restoredCity = dataset.cities.find(
      (city) => city.id === pendingRestoredCalculation.cityId
    );
    if (!restoredCity) {
      setPendingRestoredCalculation(null);
      return;
    }

    try {
      const restoredValues: ParsedFormValues = {
        nightlyPriceHt: pendingRestoredCalculation.nightlyPriceHt,
        nights: pendingRestoredCalculation.nights,
      };
      if (pendingRestoredCalculation.capacity !== undefined) {
        restoredValues.capacity = pendingRestoredCalculation.capacity;
      }
      if (pendingRestoredCalculation.personsStaying !== undefined) {
        restoredValues.personsStaying = pendingRestoredCalculation.personsStaying;
      }
      if (pendingRestoredCalculation.exemptedPersons !== undefined) {
        restoredValues.exemptedPersons = pendingRestoredCalculation.exemptedPersons;
      }

      const restoredResult = computeResult(restoredCity, restoredValues);
      setResult(restoredResult);
      setResultCityLabel(restoredCity.label);
    } catch {
      // Ignorer silencieusement une restauration invalide.
    } finally {
      setPendingRestoredCalculation(null);
    }
  }, [dataset, pendingRestoredCalculation, selectedCityId]);

  useEffect(() => {
    if (!isStorageHydrated || typeof window === 'undefined') {
      return;
    }

    const persistedState: PersistedSimulateurState = {
      version: 1,
      form: {
        cityQuery,
        selectedCityId,
        nightlyPriceHt,
        capacity,
        nights,
        personsStaying,
        exemptedPersons,
      },
      lastCalculation: lastCalculationSnapshot,
    };

    try {
      window.sessionStorage.setItem(TAXE_SEJOUR_STORAGE_KEY, JSON.stringify(persistedState));
    } catch {
      // Ignorer silencieusement les erreurs de quota/session.
    }
  }, [
    isStorageHydrated,
    cityQuery,
    selectedCityId,
    nightlyPriceHt,
    capacity,
    nights,
    personsStaying,
    exemptedPersons,
    lastCalculationSnapshot,
  ]);

  useEffect(() => {
    if (!result || !shouldScrollToResultRef.current) {
      return;
    }

    shouldScrollToResultRef.current = false;
    const resultBlock = resultBlockRef.current;
    if (!resultBlock) {
      return;
    }

    const targetTop = resultBlock.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, targetTop - RESULT_SCROLL_OFFSET_PX),
      behavior: 'smooth',
    });
  }, [result]);

  function clearResultState() {
    setResult(null);
    setResultCityLabel('');
    setLastCalculationSnapshot(null);
    replaceShareQueryInUrl(null);
  }

  function clearFormError(key: keyof FormErrors) {
    setErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const nextErrors = { ...previous };
      delete nextErrors[key];
      return nextErrors;
    });
  }

  function clearCityError() {
    if (!errors.city) {
      return;
    }
    clearFormError('city');
  }

  function trackSimulatorStartOnce() {
    if (!hasTrackedSimulatorStarted.current) {
      trackSimulatorStarted('taxe_sejour');
      hasTrackedSimulatorStarted.current = true;
    }
  }

  function selectCity(city: TaxeSejourCity) {
    trackSimulatorStartOnce();
    setCityQuery(city.label);
    setSelectedCityId(city.id);
    setIsListOpen(false);
    setHighlightedIndex(-1);
    clearCityError();
    clearResultState();
  }

  function handleCityInputChange(nextValue: string) {
    trackSimulatorStartOnce();
    setCityQuery(nextValue);
    setSelectedCityId(null);
    setIsListOpen(true);
    setHighlightedIndex(-1);
    clearCityError();
    clearResultState();
  }

  function handleCityInputBlur() {
    closeTimerRef.current = window.setTimeout(() => {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }, 120);
  }

  function handleCityInputFocus() {
    if (suggestions.length > 0) {
      setIsListOpen(true);
    }
  }

  function handleCityInputClick(event: React.MouseEvent<HTMLInputElement>) {
    event.currentTarget.select();
  }

  function handleCityInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isListOpen && suggestions.length > 0 && event.key === 'ArrowDown') {
      setIsListOpen(true);
      setHighlightedIndex(0);
      event.preventDefault();
      return;
    }

    if (!isListOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      setHighlightedIndex((previous) => Math.min(previous + 1, suggestions.length - 1));
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      setHighlightedIndex((previous) => Math.max(previous - 1, 0));
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      const highlightedCity = suggestions[highlightedIndex];
      if (highlightedCity) {
        selectCity(highlightedCity);
      }
      return;
    }

    if (event.key === 'Escape') {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function validateForm(): ParsedFormValues | null {
    const nextErrors: FormErrors = {};
    const parsedNightlyPriceHt = Number(nightlyPriceHt.replace(',', '.'));
    const parsedNights = Number(nights);
    const parsedCapacity = Number(capacity);
    const parsedPersonsStaying = Number(personsStaying);
    const hasExemptedInput = exemptedPersons.trim() !== '';
    const parsedExemptedPersons = hasExemptedInput ? Number(exemptedPersons) : 0;

    if (!selectedCity) {
      nextErrors.city = 'Sélectionnez une commune dans la liste proposée.';
    }

    if (!Number.isFinite(parsedNightlyPriceHt) || parsedNightlyPriceHt <= 0) {
      nextErrors.nightlyPriceHt = 'Indiquez un prix HT strictement positif.';
    }

    if (!Number.isFinite(parsedNights) || parsedNights <= 0 || !Number.isInteger(parsedNights)) {
      nextErrors.nights = 'Indiquez un nombre de nuits entier strictement positif.';
    }

    if (requiresCapacity) {
      if (
        !Number.isFinite(parsedCapacity) ||
        parsedCapacity <= 0 ||
        !Number.isInteger(parsedCapacity)
      ) {
        nextErrors.capacity =
          'Indiquez une capacité du logement en nombre entier strictement positif.';
      }
    }

    if (requiresOccupancy) {
      if (
        !Number.isFinite(parsedPersonsStaying) ||
        parsedPersonsStaying <= 0 ||
        !Number.isInteger(parsedPersonsStaying)
      ) {
        nextErrors.personsStaying =
          'Indiquez un nombre de personnes accueillies entier strictement positif.';
      }

      if (
        hasExemptedInput &&
        (!Number.isFinite(parsedExemptedPersons) ||
          parsedExemptedPersons < 0 ||
          !Number.isInteger(parsedExemptedPersons))
      ) {
        nextErrors.exemptedPersons =
          'Indiquez un nombre de personnes exonérées entier positif ou nul.';
      }

      if (
        Number.isFinite(parsedPersonsStaying) &&
        Number.isFinite(parsedExemptedPersons) &&
        parsedExemptedPersons > parsedPersonsStaying
      ) {
        nextErrors.exemptedPersons =
          'Le nombre de personnes exonérées ne peut pas dépasser le nombre de personnes accueillies.';
      }

      if (
        requiresCapacity &&
        Number.isFinite(parsedCapacity) &&
        Number.isFinite(parsedPersonsStaying) &&
        parsedPersonsStaying > parsedCapacity
      ) {
        nextErrors.personsStaying =
          'Le nombre de personnes accueillies ne peut pas dépasser la capacité du logement.';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    const parsedValues: ParsedFormValues = {
      nightlyPriceHt: parsedNightlyPriceHt,
      nights: parsedNights,
    };
    if (requiresCapacity) {
      parsedValues.capacity = parsedCapacity;
    }
    if (requiresOccupancy) {
      parsedValues.personsStaying = parsedPersonsStaying;
      parsedValues.exemptedPersons = parsedExemptedPersons;
    }
    return parsedValues;
  }

  function computeResult(city: TaxeSejourCity, values: ParsedFormValues) {
    const input = {
      cityId: city.id,
      nightlyPriceHt: values.nightlyPriceHt,
      nights: values.nights,
    };
    if (values.capacity !== undefined) {
      Object.assign(input, { capacity: values.capacity });
    }
    if (values.personsStaying !== undefined) {
      Object.assign(input, { personsStaying: values.personsStaying });
    }
    if (values.exemptedPersons !== undefined) {
      Object.assign(input, { exemptedPersons: values.exemptedPersons });
    }
    return calculateTaxeSejour(input, city);
  }

  function buildCalculationSnapshot(
    cityId: string,
    values: ParsedFormValues
  ): PersistedCalculationSnapshot {
    const snapshot: PersistedCalculationSnapshot = {
      cityId,
      nightlyPriceHt: values.nightlyPriceHt,
      nights: values.nights,
    };
    if (values.capacity !== undefined) {
      snapshot.capacity = values.capacity;
    }
    if (values.personsStaying !== undefined) {
      snapshot.personsStaying = values.personsStaying;
    }
    if (values.exemptedPersons !== undefined) {
      snapshot.exemptedPersons = values.exemptedPersons;
    }
    return snapshot;
  }

  async function handleCopyShareLink() {
    if (!lastCalculationSnapshot) {
      showToast('Aucun résultat à partager.', { type: 'info' });
      return;
    }

    const shareUrl = buildShareUrl(lastCalculationSnapshot);
    const isCopied = await copyToClipboard(shareUrl);
    showToast(isCopied ? 'Lien copié.' : 'Impossible de copier le lien.', {
      type: isCopied ? 'success' : 'error',
    });
  }

  async function handleExportPdf() {
    if (!result || !lastCalculationSnapshot) {
      showToast('Aucun résultat à exporter.', { type: 'info' });
      return;
    }

    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let cursorY = 40;
      const marginX = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoAsset = await getEtoilysLogoPngAsset();
      let logoWidth = 0;
      let logoHeight = 0;

      if (logoAsset) {
        const maxLogoWidth = 180;
        const maxLogoHeight = 44;
        logoWidth = maxLogoWidth;
        logoHeight = logoWidth / logoAsset.aspectRatio;
        if (logoHeight > maxLogoHeight) {
          logoHeight = maxLogoHeight;
          logoWidth = logoHeight * logoAsset.aspectRatio;
        }

        const logoY = 24;
        doc.addImage(logoAsset.dataUrl, 'PNG', marginX, logoY, logoWidth, logoHeight);
        doc.link(marginX, logoY, logoWidth, logoHeight, {
          url: 'https://www.etoilys.fr',
        });
        cursorY = Math.max(cursorY, logoY + logoHeight + 18);
      }

      doc.setFontSize(18);
      doc.setTextColor(49, 107, 255);
      const title = 'Simulation taxe de séjour';
      const titleWidth = doc.getTextWidth(title);
      const centeredTitleX = (pageWidth - titleWidth) / 2;
      doc.text(title, centeredTitleX, cursorY);

      cursorY += 34;
      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text('Paramètres de simulation', marginX, cursorY);

      const simulationParametersRows: string[][] = [
        ['Commune', resultCityLabel],
        ['Prix par nuit HT', formatPdfEuro(lastCalculationSnapshot.nightlyPriceHt)],
        ['Durée du séjour', getNightsLabel(lastCalculationSnapshot.nights)],
      ];
      if (lastCalculationSnapshot.capacity !== undefined) {
        simulationParametersRows.push([
          'Capacité du logement',
          String(lastCalculationSnapshot.capacity),
        ]);
      }
      if (lastCalculationSnapshot.personsStaying !== undefined) {
        simulationParametersRows.push([
          'Personnes accueillies',
          String(lastCalculationSnapshot.personsStaying),
        ]);
      }
      if (lastCalculationSnapshot.exemptedPersons !== undefined) {
        simulationParametersRows.push([
          'Personnes exonérées',
          String(lastCalculationSnapshot.exemptedPersons),
        ]);
      }

      autoTable(doc, {
        startY: cursorY + 10,
        head: [['Paramètre', 'Valeur']],
        body: simulationParametersRows,
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 26;

      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text('Résultats', marginX, cursorY);

      cursorY += 18;
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const resultSummaryLines =
        bestSavings !== null
          ? [
              `Jusqu’à ${formatPdfEuro(
                bestSavings.savingsAmount
              )} de taxe de séjour en moins avec un classement ${formatClassifiedCategoryForSentence(
                bestSavings.category
              )}, par rapport à un meublé non classé.`,
              getSimulationAssumptionsSentence(resultCityLabel, lastCalculationSnapshot),
              getTariffPeriodSentence(
                result.selectedPeriod.startLabel,
                result.selectedPeriod.endLabel
              ),
            ]
          : [
              'Dans cette simulation, le classement ne réduit pas la taxe de séjour par rapport au non classé. Les montants varient selon la catégorie de classement et les tarifs votés localement.',
              getSimulationAssumptionsSentence(resultCityLabel, lastCalculationSnapshot),
              getTariffPeriodSentence(
                result.selectedPeriod.startLabel,
                result.selectedPeriod.endLabel
              ),
            ];
      const wrappedResultSummary = doc.splitTextToSize(
        normalizePdfText(resultSummaryLines.join(' ')),
        515
      );
      doc.text(wrappedResultSummary, marginX, cursorY);
      cursorY += wrappedResultSummary.length * 13 + 12;

      const resultRowsForPdf = result.rows.map((row) => {
        const nonClassReference = nonClasseAmount ?? 0;
        const deltaRaw = row.amount - nonClassReference;
        return {
          category: row.category,
          rawCategory: row.category,
          amount: row.amount,
          deltaText:
            row.category === 'Non classé'
              ? 'Référence de comparaison'
              : formatPdfReadableDeltaWithPercent(deltaRaw, nonClassReference),
          deltaRaw,
        };
      });

      autoTable(doc, {
        startY: cursorY,
        head: [['Catégorie', 'Économie / surcoût', 'Taxe de séjour totale']],
        body: resultRowsForPdf.map((row) => [
          row.category,
          row.deltaText,
          formatPdfEuro(row.amount),
        ]),
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        didParseCell: (hookData) => {
          if (hookData.section !== 'body') {
            return;
          }

          const rowData = resultRowsForPdf[hookData.row.index];
          if (!rowData) {
            return;
          }

          if (hookData.column.index === 2 && rowData.rawCategory === 'Non classé') {
            hookData.cell.styles.textColor = [1, 50, 176];
            hookData.cell.styles.fontStyle = 'bold';
          }

          if (hookData.column.index === 1) {
            if (rowData.rawCategory === 'Non classé' || rowData.deltaRaw === 0) {
              hookData.cell.styles.textColor = [75, 85, 99];
            } else if (rowData.deltaRaw < 0) {
              hookData.cell.styles.textColor = [0, 115, 0];
              hookData.cell.styles.fontStyle = 'bold';
            } else {
              hookData.cell.styles.textColor = [140, 0, 0];
              hookData.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 24;

      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text('Taxes additionnelles', marginX, cursorY);
      cursorY += 8;

      autoTable(doc, {
        startY: cursorY,
        head: [['Taxes additionnelles', 'Appliquée']],
        body: result.additionalTaxes.map((tax) => [tax.label, tax.isApplied ? 'Oui' : 'Non']),
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 24;

      if (result.warnings.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(25);
        doc.text("Points d'attention", marginX, cursorY);

        autoTable(doc, {
          startY: cursorY + 8,
          head: [['Avertissement']],
          body: result.warnings.map((warning) => [warning]),
          styles: { fontSize: 10, cellPadding: 7 },
          headStyles: { fillColor: [145, 109, 0] },
          alternateRowStyles: { fillColor: [255, 248, 211] },
        });
      }

      const sourceLine = dataset
        ? `Source Etoilys: données DELTA v${dataset.version} (date de référence: ${dataset.sourceDate}).`
        : 'Source Etoilys: données DELTA indisponibles.';
      const sourceWrapped = doc.splitTextToSize(sourceLine, 520);
      doc.setFontSize(9);
      doc.setTextColor(110);
      const lastPage = doc.getNumberOfPages();
      doc.setPage(lastPage);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(sourceWrapped, marginX, pageHeight - 30);
      const etoilysWebsite = 'www.etoilys.fr';
      doc.setTextColor(1, 50, 176);
      doc.text(etoilysWebsite, marginX, pageHeight - 12);
      doc.link(marginX, pageHeight - 20, doc.getTextWidth(etoilysWebsite), 11, {
        url: 'https://www.etoilys.fr',
      });

      const safeCityId = lastCalculationSnapshot.cityId.replace(/[^a-zA-Z0-9_-]/g, '-');
      doc.save(`simulation-taxe-sejour-${safeCityId}-${formatFilenameDate(new Date())}.pdf`);
      showToast('PDF généré.', { type: 'success' });
    } catch {
      showToast('Impossible de générer le PDF.', { type: 'error' });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackSimulatorStartOnce();

    if (!selectedCity) {
      setErrors((previous) => ({
        ...previous,
        city: 'Sélectionnez une commune dans la liste proposée.',
      }));
      return;
    }

    const parsedValues = validateForm();
    if (!parsedValues) {
      return;
    }

    const computed = computeResult(selectedCity, parsedValues);
    const snapshot = buildCalculationSnapshot(selectedCity.id, parsedValues);

    trackSimulatorCalculated('taxe_sejour', {
      city_department: extractDepartmentBucket(selectedCity.label),
      nights_bucket: bucketNumber(parsedValues.nights, [1, 3, 7, 14]),
      nightly_price_bucket: bucketNumber(parsedValues.nightlyPriceHt, [50, 100, 150, 250]),
      occupancy_bucket: bucketNumber(
        parsedValues.personsStaying ?? parsedValues.capacity ?? 0,
        [1, 2, 4, 6, 10]
      ),
      has_exemptions: (parsedValues.exemptedPersons ?? 0) > 0,
      is_indicative: computed.isIndicative,
    });

    setResult(computed);
    setResultCityLabel(selectedCity.label);
    setLastCalculationSnapshot(snapshot);
    replaceShareQueryInUrl(snapshot);
    shouldScrollToResultRef.current = true;
  }

  return (
    <>
      <section className="simulator-ui bg-gradient-to-br from-themePrimary-1 to-primary-300 py-10 text-white md:py-12">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <h1 className="mb-4 text-white">Simulateur taxe de séjour : classé ou non classé</h1>
            <p className="text-base text-white/90">
              Comparez le montant estimatif de taxe de séjour entre un meublé non classé et un
              meublé classé de 1 à 5 étoiles, selon les données locales disponibles.
            </p>
          </div>
        </div>
      </section>

      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <div className="space-y-6">
            <div className="rounded-card border border-primary-200 bg-primary-100 p-5 leading-comfortable text-gray-700 md:p-6">
              <h2 className="mb-3 text-gray-900">Ce que compare le simulateur</h2>
              <div className="space-y-3 text-sm">
                <p>
                  La taxe de séjour peut être très différente entre un meublé non classé et un
                  meublé classé. Pour un logement classé, le tarif dépend du nombre d'étoiles. Pour
                  un logement non classé, il est généralement calculé en pourcentage du prix de la
                  nuitée.
                </p>
                <p>
                  Le simulateur compare, pour une même commune et un même séjour, le montant
                  estimatif dû pour un meublé non classé et pour un meublé classé de 1 à 5 étoiles.
                  En pratique, vous visualisez si le classement change la taxe de séjour affichée au
                  voyageur, et dans quelles proportions.
                </p>
                <p>
                  Le calcul prend en compte la période de location, le nombre de personnes, le prix
                  de la nuitée et les taxes additionnelles prévues localement.
                </p>
              </div>
            </div>

            <Card className="p-5 md:p-6" hover={false}>
              <h2 className="mb-2">Informations du séjour</h2>
              <p className="mb-5 text-sm text-textLight">
                Sélectionnez une commune puis renseignez les informations du séjour pour comparer
                les montants estimatifs.
              </p>

              {isLoading && <p className="text-textLight">Chargement des données en cours...</p>}
              {loadingError && (
                <p className="text-alert-500" role="alert">
                  {loadingError}
                </p>
              )}

              {!isLoading && !loadingError && (
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <div className="relative max-w-2xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commune <span className="ml-1 text-alert-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cityQuery}
                      onChange={(event) => handleCityInputChange(event.target.value)}
                      onFocus={handleCityInputFocus}
                      onClick={handleCityInputClick}
                      onBlur={handleCityInputBlur}
                      onKeyDown={handleCityInputKeyDown}
                      placeholder="Ex. Biarritz"
                      autoComplete="off"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={isListOpen && suggestions.length > 0}
                      aria-controls={listId}
                      aria-activedescendant={
                        highlightedIndex >= 0 ? `taxe-sejour-option-${highlightedIndex}` : undefined
                      }
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 ${
                        errors.city ? 'border-alert-400 focus:ring-alert-400' : ''
                      }`}
                    />
                    {isListOpen && suggestions.length > 0 && (
                      <ul
                        id={listId}
                        role="listbox"
                        className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-card"
                      >
                        {suggestions.map((city, index) => (
                          <li
                            id={`taxe-sejour-option-${index}`}
                            key={city.id}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            className={`cursor-pointer px-4 py-2 text-sm ${
                              highlightedIndex === index
                                ? 'bg-primary-100 text-primary-500'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectCity(city);
                            }}
                          >
                            {city.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.city && <p className="mt-2 text-sm text-alert-400">{errors.city}</p>}
                  </div>

                  {selectedCity && (
                    <>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <Input
                          label="Prix moyen de la nuitée HT"
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          placeholder="Ex. 120"
                          value={nightlyPriceHt}
                          onChange={(event) => {
                            trackSimulatorStartOnce();
                            setNightlyPriceHt(event.target.value);
                            if (errors.nightlyPriceHt) {
                              clearFormError('nightlyPriceHt');
                            }
                          }}
                          error={errors.nightlyPriceHt}
                        />

                        <div className="w-full">
                          <div className="mb-2 h-5 flex items-center">
                            <div className="inline-flex items-center gap-2">
                              <label
                                htmlFor="nights-input"
                                className="text-sm font-medium text-gray-700"
                              >
                                Nombre de nuits louées
                                <span className="ml-1 text-alert-400">*</span>
                              </label>
                              <Tooltip
                                srLabel="Précision sur le nombre de nuits louées à comparer."
                                triggerClassName="-translate-y-[2px] shrink-0 font-semibold leading-none"
                              >
                                Indiquez le nombre de nuits à comparer : une nuit, une semaine ou
                                une période complète de location, par exemple 90 ou 120 nuits.
                              </Tooltip>
                            </div>
                          </div>
                          <input
                            id="nights-input"
                            required
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            placeholder="Ex. 3"
                            value={nights}
                            onChange={(event) => {
                              trackSimulatorStartOnce();
                              setNights(event.target.value);
                              if (errors.nights) {
                                clearFormError('nights');
                              }
                            }}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 ${
                              errors.nights ? 'border-alert-400 focus:ring-alert-400' : ''
                            }`}
                          />
                          {errors.nights && (
                            <p className="mt-2 text-sm text-alert-400">{errors.nights}</p>
                          )}
                        </div>

                        {requiresCapacity && (
                          <Input
                            label="Capacité du logement (personnes)"
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            placeholder="Ex. 4"
                            value={capacity}
                            onChange={(event) => {
                              trackSimulatorStartOnce();
                              setCapacity(event.target.value);
                              if (errors.capacity) {
                                clearFormError('capacity');
                              }
                            }}
                            error={errors.capacity}
                          />
                        )}

                        {requiresOccupancy && (
                          <>
                            <Input
                              label="Personnes accueillies"
                              required
                              type="number"
                              min="1"
                              step="1"
                              inputMode="numeric"
                              placeholder="Ex. 4"
                              value={personsStaying}
                              onChange={(event) => {
                                trackSimulatorStartOnce();
                                setPersonsStaying(event.target.value);
                                if (errors.personsStaying) {
                                  clearFormError('personsStaying');
                                }
                              }}
                              error={errors.personsStaying}
                            />

                            <div className="w-full">
                              <div className="mb-2 h-5 flex items-center">
                                <div className="inline-flex items-center gap-2">
                                  <label
                                    htmlFor="exempted-persons-input"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Personnes exonérées de taxe
                                  </label>
                                  <Tooltip
                                    srLabel="Qui peut être exonéré: mineurs, salariés saisonniers de la commune, personnes hébergées en urgence ou relogées temporairement, et logements sous le seuil de loyer fixé localement."
                                    triggerClassName="-translate-y-[2px] shrink-0 font-semibold leading-none"
                                    triggerTabIndex={-1}
                                  >
                                    En général, sont exonérées: les personnes mineures, les salariés
                                    saisonniers employés dans la commune, les personnes hébergées en
                                    urgence ou relogées temporairement, et les logements dont le
                                    loyer est sous le seuil fixé localement.
                                  </Tooltip>
                                </div>
                              </div>
                              <input
                                id="exempted-persons-input"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                placeholder="Ex. 1"
                                value={exemptedPersons}
                                onChange={(event) => {
                                  trackSimulatorStartOnce();
                                  setExemptedPersons(event.target.value);
                                  if (errors.exemptedPersons) {
                                    clearFormError('exemptedPersons');
                                  }
                                }}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 ${
                                  errors.exemptedPersons
                                    ? 'border-alert-400 focus:ring-alert-400'
                                    : ''
                                }`}
                              />
                              {errors.exemptedPersons && (
                                <p className="mt-2 text-sm text-alert-400">
                                  {errors.exemptedPersons}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <Button type="submit" variant="primary" className="w-full md:w-auto">
                        Calculer
                      </Button>
                    </>
                  )}
                </form>
              )}
            </Card>

            {result && (
              <>
                <Card ref={resultBlockRef} className="p-5 md:p-6" hover={false}>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h2>Résultats</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyShareLink}
                      >
                        Copier le lien
                      </Button>
                      <Button type="button" variant="primary" size="sm" onClick={handleExportPdf}>
                        Exporter PDF
                      </Button>
                    </div>
                  </div>

                  {resultSummary && (
                    <div className="mb-6 rounded-card border border-gray-200 bg-white shadow-sm">
                      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                        <div className="p-5 md:p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                            Résultat principal
                          </p>
                          {resultSummary.bestSavings ? (
                            <>
                              <p className="mt-3 text-3xl font-semibold leading-tight text-success-500 md:text-4xl">
                                Jusqu’à {formatEuro(resultSummary.bestSavings.savingsAmount)}
                              </p>
                              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-900">
                                de taxe de séjour en moins avec un{' '}
                                <strong className="font-semibold text-gray-950">
                                  classement{' '}
                                  {formatClassifiedCategoryForSentence(
                                    resultSummary.bestSavings.category
                                  )}
                                </strong>
                                , par rapport à un{' '}
                                <strong className="font-semibold text-gray-950">
                                  meublé non classé
                                </strong>
                                .
                              </p>
                            </>
                          ) : (
                            <div className="mt-3 space-y-2">
                              <p className="text-base font-semibold leading-relaxed text-gray-900 md:text-lg">
                                Dans cette simulation, le classement ne réduit pas la taxe de séjour
                                par rapport au non classé.
                              </p>
                              <p className="text-sm leading-relaxed text-gray-700">
                                Les montants varient selon la catégorie de classement et les tarifs
                                votés localement.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-100 bg-gray-50/70 p-5 md:p-6 lg:border-l lg:border-t-0">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Hypothèses de simulation
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm leading-relaxed text-gray-700">
                            {resultSummary.facts.map((fact, index) => (
                              <span key={`${fact}-${index}`} className="inline-flex min-w-0">
                                <span className="break-words">{fact}</span>
                                {index < resultSummary.facts.length - 1 && (
                                  <span className="ml-2 text-gray-400">·</span>
                                )}
                              </span>
                            ))}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-gray-700">
                            {resultSummary.nightlyPriceLabel}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">
                            {getTariffPeriodCompactLabel(
                              result.selectedPeriod.startLabel,
                              result.selectedPeriod.endLabel
                            )}
                          </p>
                          {!isFullYearPeriod(
                            result.selectedPeriod.startLabel,
                            result.selectedPeriod.endLabel
                          ) && (
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                              En dehors de cette période, la taxe de séjour n&apos;est pas prélevée.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <ResponsiveComparisonTable
                      columns={resultColumns}
                      rows={resultRows}
                      primaryColumnKey="category"
                      tableClassName="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm"
                      desktopWrapperClassName="hidden md:block"
                      headerRowClassName="bg-primary-300 text-white"
                      headerCellClassName="p-3 font-semibold"
                      cellClassName="p-3"
                      mobileContainerClassName="md:hidden space-y-3"
                      mobileCardClassName="rounded-card border border-gray-200 bg-white p-4 shadow-sm"
                      mobileTitleClassName="text-sm font-semibold text-gray-900 mb-3"
                      mobileLabelClassName="text-xs font-medium text-gray-600"
                      mobileValueClassName="text-sm text-gray-900 text-right"
                    />

                    {result.warnings.length > 0 && (
                      <div className="rounded-card border border-warning-200 bg-warning-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Points d&apos;attention
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {result.warnings.map((warning) => (
                            <li key={warning}>- {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-card border border-gray-200 p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-3">Taxes additionnelles</h3>
                      <p className="mb-3 text-sm text-textLight">
                        Les taxes additionnelles sont incluses dans la simulation lorsqu&apos;elles
                        s&apos;appliquent.
                      </p>
                      <ul className="space-y-3">
                        {result.additionalTaxes.map((tax) => (
                          <li
                            key={tax.key}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                          >
                            <div className="text-sm text-gray-700">
                              <span>{tax.label}</span>{' '}
                              <a
                                href={tax.legalReferenceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-500"
                              >
                                ({tax.legalReferenceLabel})
                              </a>
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                tax.isApplied ? 'text-success-500' : 'text-gray-600'
                              }`}
                            >
                              {tax.isApplied ? 'OUI' : 'NON'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-sm text-textLight">
                      Cette simulation est fournie à titre informatif sur la base des délibérations
                      publiées. Elle ne constitue pas un conseil juridique ou fiscal personnalisé.
                    </p>

                    {dataset && (
                      <p className="text-xs text-textLight">
                        Source de données: DELTA v{dataset.version} (date de référence:{' '}
                        {dataset.sourceDate}).
                      </p>
                    )}
                  </div>
                </Card>

                <div className="mb-8 mt-8 rounded-card border border-primary-200 bg-primary-100 p-5 md:p-6">
                  <h2 className="mb-3">Le classement intervient aussi dans la fiscalité</h2>
                  <p className="mb-5 text-sm text-gray-700">
                    Le simulateur fiscal compare le cadre micro-BIC d’un meublé classé et d’un
                    meublé non classé.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button href="/simulateur-fiscal-classement" variant="primary">
                      Simulateur fiscal
                    </Button>
                    <Button href="/demande-classement" variant="secondary">
                      Demande de classement
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
