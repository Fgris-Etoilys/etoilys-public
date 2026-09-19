import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Link2,
  LoaderCircle,
  Scale,
  Search,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
import { prepareLocalitySearch, searchPreparedLocalities } from '../utils/localitySearch';
import LocalizedContent from '../i18n/LocalizedContent';
import { translateText } from '../i18n/textTranslation';
import { touristTaxSimulatorEnglishTranslations } from '../i18n/simulatorContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';
import { formatDate, formatEuro as formatLocalizedEuro } from '../i18n/numberFormatting';
import type { Locale } from '../i18n/locales';

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

function formatEuro(value: number, locale: Locale): string {
  return formatLocalizedEuro(value, locale);
}

function formatPdfEuro(value: number, locale: Locale): string {
  return normalizePdfText(formatEuro(value, locale));
}

function localizeTouristTaxSimulatorText(value: string, locale: Locale): string {
  return locale === 'en' ? translateText(value, touristTaxSimulatorEnglishTranslations) : value;
}

function formatDatasetDate(value: string, locale: Locale): string {
  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year) {
    return value;
  }
  return formatDate(new Date(Date.UTC(year, month - 1, day)), locale);
}

function formatDeltaPercent(delta: number, nonClasseReference: number): string {
  if (nonClasseReference === 0) {
    return 'n/a';
  }

  const percent = Math.round((delta / nonClasseReference) * 100);
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent} %`;
}

function getReadableDeltaLabel(delta: number, locale: Locale): string {
  if (locale === 'en') {
    return delta < 0 ? 'saved' : 'more';
  }
  return delta < 0 ? 'économisés' : 'de plus';
}

function formatReadableDeltaWithPercent(
  delta: number,
  nonClasseReference: number,
  locale: Locale
): string {
  if (delta === 0) {
    return localizeTouristTaxSimulatorText('Aucun écart', locale);
  }

  const formattedAmount = formatEuro(Math.abs(delta), locale);
  const formattedPercent = formatDeltaPercent(delta, nonClasseReference);
  const deltaLabel = getReadableDeltaLabel(delta, locale);

  return `${formattedAmount} ${deltaLabel} (${formattedPercent})`;
}

function formatPdfReadableDeltaWithPercent(
  delta: number,
  nonClasseReference: number,
  locale: Locale
): string {
  return normalizePdfText(formatReadableDeltaWithPercent(delta, nonClasseReference, locale));
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

function getNightsLabel(nights: number, locale: Locale): string {
  if (locale === 'en') {
    return `${nights} ${nights > 1 ? 'nights' : 'night'}`;
  }
  return `${nights} ${nights > 1 ? 'nuits' : 'nuit'}`;
}

function getRentedNightsLabel(nights: number, locale: Locale): string {
  if (locale === 'en') {
    return `${nights} ${nights > 1 ? 'nights rented' : 'night rented'}`;
  }
  return `${nights} ${nights > 1 ? 'nuits louées' : 'nuit louée'}`;
}

function formatPeopleLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count > 1 ? plural : singular}`;
}

function formatClassifiedCategoryForSentence(category: string, locale: Locale): string {
  const match = category.match(/^([1-5])\*$/);
  if (!match) {
    return category;
  }

  const stars = Number(match[1]);
  if (locale === 'en') {
    return `${stars} ${stars > 1 ? 'stars' : 'star'}`;
  }
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
  snapshot: PersistedCalculationSnapshot,
  locale: Locale
): string {
  const parts =
    locale === 'en'
      ? [`Simulation for ${cityLabel}`, `over ${getNightsLabel(snapshot.nights, locale)}`]
      : [`Simulation réalisée pour ${cityLabel}`, `sur ${getNightsLabel(snapshot.nights, locale)}`];

  if (snapshot.personsStaying !== undefined) {
    const personsLabel =
      locale === 'en'
        ? formatPeopleLabel(snapshot.personsStaying, 'guest staying', 'guests staying')
        : formatPeopleLabel(
            snapshot.personsStaying,
            'personne accueillie',
            'personnes accueillies'
          );
    const exemptedLabel =
      locale === 'en'
        ? formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exempt', 'exempt')
        : formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exonérée', 'exonérées');
    parts.push(
      locale === 'en'
        ? `with ${personsLabel}, including ${exemptedLabel}`
        : `avec ${personsLabel} dont ${exemptedLabel}`
    );
  } else if (snapshot.capacity !== undefined) {
    const capacityLabel =
      locale === 'en'
        ? formatPeopleLabel(snapshot.capacity, 'person capacity', 'person capacity')
        : formatPeopleLabel(snapshot.capacity, 'personne', 'personnes');
    parts.push(
      locale === 'en'
        ? `with a stated capacity of ${capacityLabel}`
        : `avec une capacité renseignée de ${capacityLabel}`
    );
  }

  parts.push(
    locale === 'en'
      ? `at an average price of ${formatEuro(snapshot.nightlyPriceHt, locale)} excluding tax / night`
      : `au prix moyen de ${formatEuro(snapshot.nightlyPriceHt, locale)} HT / nuit`
  );

  return `${parts.join(', ')}.`;
}

function getSimulationAssumptionFacts(
  cityLabel: string,
  snapshot: PersistedCalculationSnapshot,
  locale: Locale
): string[] {
  const facts = [cityLabel, getRentedNightsLabel(snapshot.nights, locale)];

  if (snapshot.personsStaying !== undefined) {
    facts.push(
      locale === 'en'
        ? formatPeopleLabel(snapshot.personsStaying, 'guest staying', 'guests staying')
        : formatPeopleLabel(snapshot.personsStaying, 'personne accueillie', 'personnes accueillies')
    );
    facts.push(
      locale === 'en'
        ? formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exempt', 'exempt')
        : formatPeopleLabel(snapshot.exemptedPersons ?? 0, 'exonérée', 'exonérées')
    );
  } else if (snapshot.capacity !== undefined) {
    facts.push(
      locale === 'en'
        ? formatPeopleLabel(snapshot.capacity, 'person capacity', 'person capacity')
        : formatPeopleLabel(snapshot.capacity, 'personne de capacité', 'personnes de capacité')
    );
  }

  return facts;
}

const ENGLISH_TARIFF_MONTHS: Readonly<Record<string, string>> = {
  janvier: 'January',
  février: 'February',
  mars: 'March',
  avril: 'April',
  mai: 'May',
  juin: 'June',
  juillet: 'July',
  août: 'August',
  septembre: 'September',
  octobre: 'October',
  novembre: 'November',
  décembre: 'December',
};

function formatTariffDateLabel(label: string, locale: Locale): string {
  const normalizedLabel = label.trim().replace(/\s+/g, ' ');
  const firstDayMatch = normalizedLabel.match(/^0?1\s+(.+)$/i);
  const regularDayMatch = normalizedLabel.match(/^0?([1-9]|[12]\d|3[01])\s+(.+)$/i);

  if (locale === 'en') {
    const day = firstDayMatch?.[0] ? 1 : Number(regularDayMatch?.[1]);
    const month = firstDayMatch?.[1] ?? regularDayMatch?.[2];
    if (day && month) {
      return `${day} ${ENGLISH_TARIFF_MONTHS[month.toLowerCase()] ?? month}`;
    }
    return normalizedLabel;
  }

  if (firstDayMatch?.[1]) {
    return `1er ${firstDayMatch[1]}`;
  }

  return normalizedLabel.replace(/^0([2-9])\s+/, '$1 ');
}

function getTariffPeriodSentence(startLabel: string, endLabel: string, locale: Locale): string {
  const formattedStart = formatTariffDateLabel(startLabel, locale);
  const formattedEnd = formatTariffDateLabel(endLabel, locale);
  if (locale === 'en') {
    return `Tariff period considered: from ${formattedStart} to ${formattedEnd}.`;
  }
  return `Période tarifaire considérée : du ${formattedStart} au ${formattedEnd}.`;
}

function getTariffPeriodCompactLabel(startLabel: string, endLabel: string, locale: Locale): string {
  const formattedStart = formatTariffDateLabel(startLabel, locale);
  const formattedEnd = formatTariffDateLabel(endLabel, locale);
  if (locale === 'en') {
    return `Period: from ${formattedStart} to ${formattedEnd}`;
  }
  return `Période : du ${formattedStart} au ${formattedEnd}`;
}

function isFullYearPeriod(startLabel: string, endLabel: string): boolean {
  const normalizedStart = startLabel.trim().toLowerCase();
  const normalizedEnd = endLabel.trim().toLowerCase();
  const isJanuaryStart = /^(0?1|1er)\s+janvier$/.test(normalizedStart);
  const isDecemberEnd = /^31\s+d[ée]cembre$/.test(normalizedEnd);
  return isJanuaryStart && isDecemberEnd;
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

export default function SimulateurTaxeSejour() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const localize = useCallback(
    (value: string): string =>
      locale === 'en' ? translateText(value, touristTaxSimulatorEnglishTranslations) : value,
    [locale]
  );
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

  const isReferenceIndicative =
    result?.rows.some((row) => row.category === 'Non classé' && row.status === 'indicatif') ??
    false;

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
        label: localize('Catégorie'),
        mobileLabel: localize('Catégorie'),
        align: 'center',
        widthClassName: 'w-1/4',
      },
      {
        key: 'delta',
        label: localize('Économie / surcoût'),
        mobileLabel: localize('Écart vs non classé'),
        align: 'center',
        widthClassName: 'w-5/12',
      },
      {
        key: 'amount',
        label: localize('Taxe de séjour totale'),
        mobileLabel: localize('Taxe de séjour totale'),
        align: 'center',
        widthClassName: 'w-1/3',
      },
    ],
    [localize]
  );

  const resultRows = useMemo<ResponsiveComparisonRow[]>(() => {
    if (!result) {
      return [];
    }

    const nonClassReference = nonClasseAmount ?? 0;

    return result.rows.map((row, index) => {
      const delta = row.amount - nonClassReference;
      const isReferenceRow = row.category === 'Non classé';
      const mobileCardClassName = isReferenceRow ? 'border-ink/15 bg-paper' : null;
      const comparisonRow: ResponsiveComparisonRow = {
        key: row.category,
        rowClassName: isReferenceRow
          ? 'border-b border-ink/15 bg-paper'
          : index % 2 === 0
            ? 'bg-white border-b border-gray-100'
            : 'bg-gray-50',
        cells: {
          category: (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="font-semibold">{localize(row.category)}</span>
              {row.status === 'indicatif' && (
                <span className="text-xs font-semibold text-warning-500">
                  {localize('indicatif')}
                </span>
              )}
            </div>
          ),
          amount: (
            <span
              className={
                row.category === 'Non classé'
                  ? 'font-semibold text-ink'
                  : 'font-semibold text-gray-900'
              }
            >
              {formatEuro(row.amount, locale)}
            </span>
          ),
          delta: isReferenceRow ? (
            <span className="inline-block max-w-[13rem] text-right font-medium text-gray-600 md:max-w-none md:text-center">
              {localize('Référence de comparaison')}
            </span>
          ) : (
            <span
              className={`inline-block max-w-[13rem] text-right font-semibold md:max-w-none md:text-center ${getDeltaClassName(
                delta
              )}`}
            >
              {formatReadableDeltaWithPercent(delta, nonClassReference, locale)}
            </span>
          ),
        },
      };

      if (mobileCardClassName) {
        comparisonRow.mobileCardClassName = mobileCardClassName;
      }

      return comparisonRow;
    });
  }, [localize, locale, result, nonClasseAmount]);

  const resultSummary = useMemo(() => {
    if (!lastCalculationSnapshot) {
      return null;
    }

    return {
      facts: getSimulationAssumptionFacts(resultCityLabel, lastCalculationSnapshot, locale),
      nightlyPriceLabel:
        locale === 'en'
          ? `Average price: ${formatEuro(lastCalculationSnapshot.nightlyPriceHt, locale)} excluding tax / night`
          : `Prix moyen : ${formatEuro(lastCalculationSnapshot.nightlyPriceHt, locale)} HT / nuit`,
      bestSavings,
    };
  }, [bestSavings, lastCalculationSnapshot, locale, resultCityLabel]);

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
          locale === 'en'
            ? 'The tourist tax simulator data could not be loaded.'
            : error instanceof Error
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
  }, [locale]);

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

  const citySearchIndex = useMemo(
    () => (dataset ? prepareLocalitySearch(dataset.cities) : []),
    [dataset]
  );

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [] as TaxeSejourCity[];
    }

    return searchPreparedLocalities(citySearchIndex, normalizedQuery, MAX_CITY_SUGGESTIONS);
  }, [citySearchIndex, normalizedQuery]);

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
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
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
      showToast(localize('Aucun résultat à partager.'), { type: 'info' });
      return;
    }

    const shareUrl = buildShareUrl(lastCalculationSnapshot);
    const isCopied = await copyToClipboard(shareUrl);
    showToast(localize(isCopied ? 'Lien copié.' : 'Impossible de copier le lien.'), {
      type: isCopied ? 'success' : 'error',
    });
  }

  async function handleExportPdf() {
    if (!result || !lastCalculationSnapshot) {
      showToast(localize('Aucun résultat à exporter.'), { type: 'info' });
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
      const title = localize('Simulation taxe de séjour');
      const titleWidth = doc.getTextWidth(title);
      const centeredTitleX = (pageWidth - titleWidth) / 2;
      doc.text(title, centeredTitleX, cursorY);

      cursorY += 34;
      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text(localize('Paramètres de simulation'), marginX, cursorY);

      const simulationParametersRows: string[][] = [
        [localize('Commune'), resultCityLabel],
        [
          localize('Prix par nuit HT'),
          formatPdfEuro(lastCalculationSnapshot.nightlyPriceHt, locale),
        ],
        [localize('Durée du séjour'), getNightsLabel(lastCalculationSnapshot.nights, locale)],
      ];
      if (lastCalculationSnapshot.capacity !== undefined) {
        simulationParametersRows.push([
          localize('Capacité du logement'),
          String(lastCalculationSnapshot.capacity),
        ]);
      }
      if (lastCalculationSnapshot.personsStaying !== undefined) {
        simulationParametersRows.push([
          localize('Personnes accueillies'),
          String(lastCalculationSnapshot.personsStaying),
        ]);
      }
      if (lastCalculationSnapshot.exemptedPersons !== undefined) {
        simulationParametersRows.push([
          localize('Personnes exonérées'),
          String(lastCalculationSnapshot.exemptedPersons),
        ]);
      }

      autoTable(doc, {
        startY: cursorY + 10,
        head: [[localize('Paramètre'), localize('Valeur')]],
        body: simulationParametersRows,
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 26;

      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text(localize('Résultats'), marginX, cursorY);

      cursorY += 18;
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const resultSummaryLines =
        bestSavings !== null
          ? [
              locale === 'en'
                ? `Up to ${formatPdfEuro(
                    bestSavings.savingsAmount,
                    locale
                  )} less tourist tax with a ${formatClassifiedCategoryForSentence(
                    bestSavings.category,
                    locale
                  )} classification, compared with unclassified furnished tourist accommodation.`
                : `Jusqu’à ${formatPdfEuro(
                    bestSavings.savingsAmount,
                    locale
                  )} de taxe de séjour en moins avec un classement ${formatClassifiedCategoryForSentence(
                    bestSavings.category,
                    locale
                  )}, par rapport à un meublé non classé.`,
              getSimulationAssumptionsSentence(resultCityLabel, lastCalculationSnapshot, locale),
              getTariffPeriodSentence(
                result.selectedPeriod.startLabel,
                result.selectedPeriod.endLabel,
                locale
              ),
            ]
          : [
              localize(
                'Dans cette simulation, le classement ne réduit pas la taxe de séjour par rapport au non classé. Les montants varient selon la catégorie de classement et les tarifs votés localement.'
              ),
              getSimulationAssumptionsSentence(resultCityLabel, lastCalculationSnapshot, locale),
              getTariffPeriodSentence(
                result.selectedPeriod.startLabel,
                result.selectedPeriod.endLabel,
                locale
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
          category: localize(row.category),
          rawCategory: row.category,
          amount: row.amount,
          deltaText:
            row.category === 'Non classé'
              ? localize('Référence de comparaison')
              : formatPdfReadableDeltaWithPercent(deltaRaw, nonClassReference, locale),
          deltaRaw,
        };
      });

      autoTable(doc, {
        startY: cursorY,
        head: [
          [
            localize('Catégorie'),
            localize('Économie / surcoût'),
            localize('Taxe de séjour totale'),
          ],
        ],
        body: resultRowsForPdf.map((row) => [
          row.category,
          row.deltaText,
          formatPdfEuro(row.amount, locale),
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
      doc.text(localize('Taxes additionnelles'), marginX, cursorY);
      cursorY += 8;

      autoTable(doc, {
        startY: cursorY,
        head: [[localize('Taxes additionnelles'), localize('Appliquée')]],
        body: result.additionalTaxes.map((tax) => [
          localize(tax.label),
          tax.isApplied ? localize('Oui') : localize('Non'),
        ]),
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 24;

      if (result.warnings.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(25);
        doc.text(localize("Points d'attention"), marginX, cursorY);

        autoTable(doc, {
          startY: cursorY + 8,
          head: [[localize('Avertissement')]],
          body: result.warnings.map((warning) => [localize(warning)]),
          styles: { fontSize: 10, cellPadding: 7 },
          headStyles: { fillColor: [145, 109, 0] },
          alternateRowStyles: { fillColor: [255, 248, 211] },
        });
      }

      const sourceLine = dataset
        ? locale === 'en'
          ? `Etoilys source: DELTA v${dataset.version} data (reference date: ${dataset.sourceDate}). Official sources are available in French.`
          : `Source Etoilys: données DELTA v${dataset.version} (date de référence: ${dataset.sourceDate}).`
        : localize('Source Etoilys: données DELTA indisponibles.');
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
      showToast(localize('PDF généré.'), { type: 'success' });
    } catch {
      showToast(localize('Impossible de générer le PDF.'), { type: 'error' });
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
    <LocalizedContent locale={locale} translations={touristTaxSimulatorEnglishTranslations}>
      <section className="simulator-ui simulator-page">
        <div className="container-editorial">
          <header className="simulator-intro">
            <div>
              <p className="simulator-eyebrow">Les outils Etoilys · 2026</p>
              <h1>Simulateur taxe de séjour</h1>
              <p>Un même séjour, cinq classements. Comparez ce qui change pour vos voyageurs.</p>
            </div>
            <Button
              href={
                locale === 'en'
                  ? '/en/furnished-tourist-accommodation-tax-simulator'
                  : '/simulateur-fiscal-classement'
              }
              variant="primary"
              className="simulator-tool-link"
            >
              Simulateur fiscal <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
          </header>

          <div className="simulator-workspace">
            <div className="simulator-form-panel">
              <div className="mb-6">
                <p className="simulator-eyebrow">Votre simulation</p>
                <h2>Informations du séjour</h2>
                <p className="mt-2 text-sm text-muted">
                  Commencez par la commune de votre logement.
                </p>
              </div>

              {isLoading && (
                <p className="flex items-center gap-2 text-sm text-muted" role="status">
                  <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />
                  Chargement des données en cours...
                </p>
              )}
              {loadingError && (
                <p className="simulator-warning" role="alert">
                  {loadingError}
                </p>
              )}

              {!isLoading && !loadingError && (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="relative">
                    <label htmlFor="city-input" className="mb-2 block text-sm font-medium text-ink">
                      Commune{' '}
                      <span className="text-alert-400" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <div className="relative">
                      <Search
                        size={19}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      />
                      <input
                        id="city-input"
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
                        aria-invalid={errors.city ? 'true' : undefined}
                        aria-describedby={errors.city ? 'city-error' : 'city-status'}
                        aria-activedescendant={
                          highlightedIndex >= 0
                            ? 'taxe-sejour-option-' + highlightedIndex
                            : undefined
                        }
                        className={
                          'ui-field !pl-11 !pr-11 ' + (errors.city ? 'ui-field-error' : '')
                        }
                      />
                      {selectedCity && (
                        <Check
                          size={19}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    {isListOpen && suggestions.length > 0 && (
                      <ul
                        id={listId}
                        role="listbox"
                        aria-label="Communes proposées"
                        className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-editorial border border-ink/15 bg-white shadow-[0_8px_24px_rgb(var(--color-ink)/0.08)]"
                      >
                        {suggestions.map((city, index) => (
                          <li
                            id={'taxe-sejour-option-' + index}
                            key={city.id}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            className={
                              'flex min-h-11 cursor-pointer items-center px-4 py-3 text-sm ' +
                              (highlightedIndex === index
                                ? 'bg-surface-sage text-ink'
                                : 'text-ink hover:bg-paper')
                            }
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
                    {errors.city && (
                      <p id="city-error" className="mt-2 text-sm text-alert-400" role="alert">
                        {errors.city}
                      </p>
                    )}
                    <p id="city-status" className="mt-2 text-xs text-muted" role="status">
                      {selectedCity
                        ? 'Commune sélectionnée · tarifs locaux chargés'
                        : isListOpen && normalizedQuery && suggestions.length === 0
                          ? 'Aucune commune trouvée. Essayez un autre nom.'
                          : 'Saisissez un nom puis sélectionnez une commune dans la liste.'}
                    </p>
                  </div>

                  {selectedCity && (
                    <>
                      <fieldset className="simulator-fieldset mt-6">
                        <legend>Le séjour</legend>
                        <div className="simulator-field-grid">
                          <div>
                            <label
                              htmlFor="nightly-price-input"
                              className="mb-2 block text-sm font-medium text-ink"
                            >
                              Prix par nuit HT{' '}
                              <span className="text-alert-400" aria-hidden="true">
                                *
                              </span>
                            </label>
                            <div className="simulator-field-unit">
                              <input
                                id="nightly-price-input"
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                placeholder="Ex. 120"
                                value={nightlyPriceHt}
                                aria-invalid={errors.nightlyPriceHt ? 'true' : undefined}
                                aria-describedby={
                                  errors.nightlyPriceHt ? 'nightly-price-error' : undefined
                                }
                                onChange={(event) => {
                                  trackSimulatorStartOnce();
                                  setNightlyPriceHt(event.target.value);
                                  if (errors.nightlyPriceHt) clearFormError('nightlyPriceHt');
                                }}
                                className={
                                  'ui-field ' + (errors.nightlyPriceHt ? 'ui-field-error' : '')
                                }
                              />
                              <span aria-hidden="true">€</span>
                            </div>
                            {errors.nightlyPriceHt && (
                              <p
                                id="nightly-price-error"
                                className="mt-2 text-sm text-alert-400"
                                role="alert"
                              >
                                {errors.nightlyPriceHt}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between gap-1">
                              <label
                                htmlFor="nights-input"
                                className="text-sm font-medium text-ink"
                              >
                                Nuits{' '}
                                <span className="text-alert-400" aria-hidden="true">
                                  *
                                </span>
                              </label>
                              <Tooltip
                                srLabel="Précision sur le nombre de nuits louées à comparer."
                                className="-my-3"
                                triggerClassName="min-h-11 min-w-11 !border-0 !bg-transparent !text-sm"
                              >
                                Indiquez le nombre de nuits à comparer : une nuit, une semaine ou
                                une période complète de location, par exemple 90 ou 120 nuits.
                              </Tooltip>
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
                              aria-invalid={errors.nights ? 'true' : undefined}
                              aria-describedby={errors.nights ? 'nights-error' : undefined}
                              onChange={(event) => {
                                trackSimulatorStartOnce();
                                setNights(event.target.value);
                                if (errors.nights) clearFormError('nights');
                              }}
                              className={'ui-field ' + (errors.nights ? 'ui-field-error' : '')}
                            />
                            {errors.nights && (
                              <p
                                id="nights-error"
                                className="mt-2 text-sm text-alert-400"
                                role="alert"
                              >
                                {errors.nights}
                              </p>
                            )}
                          </div>
                        </div>
                      </fieldset>

                      {(requiresCapacity || requiresOccupancy) && (
                        <fieldset className="simulator-fieldset">
                          <legend>{requiresOccupancy ? 'Les voyageurs' : 'Le logement'}</legend>
                          <div className="simulator-field-grid">
                            {requiresCapacity && (
                              <Input
                                id="capacity-input"
                                label="Capacité du logement"
                                required
                                type="number"
                                min="1"
                                step="1"
                                inputMode="numeric"
                                placeholder="Ex. 4"
                                helperText="Nombre de personnes maximum"
                                value={capacity}
                                onChange={(event) => {
                                  trackSimulatorStartOnce();
                                  setCapacity(event.target.value);
                                  if (errors.capacity) clearFormError('capacity');
                                }}
                                error={errors.capacity ? localize(errors.capacity) : undefined}
                              />
                            )}
                            {requiresOccupancy && (
                              <>
                                <Input
                                  id="persons-staying-input"
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
                                    if (errors.personsStaying) clearFormError('personsStaying');
                                  }}
                                  error={
                                    errors.personsStaying
                                      ? localize(errors.personsStaying)
                                      : undefined
                                  }
                                />
                                <div>
                                  <div className="mb-2 flex items-center justify-between gap-1">
                                    <label
                                      htmlFor="exempted-persons-input"
                                      className="text-sm font-medium text-ink"
                                    >
                                      Personnes exonérées
                                    </label>
                                    <Tooltip
                                      srLabel="Qui peut être exonéré: mineurs, salariés saisonniers de la commune, personnes hébergées en urgence ou relogées temporairement, et logements sous le seuil de loyer fixé localement."
                                      className="-my-3"
                                      triggerClassName="min-h-11 min-w-11 !border-0 !bg-transparent !text-sm"
                                    >
                                      En général, sont exonérées: les personnes mineures, les
                                      salariés saisonniers employés dans la commune, les personnes
                                      hébergées en urgence ou relogées temporairement, et les
                                      logements dont le loyer est sous le seuil fixé localement.
                                    </Tooltip>
                                  </div>
                                  <input
                                    id="exempted-persons-input"
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    placeholder="Ex. 1"
                                    value={exemptedPersons}
                                    aria-invalid={errors.exemptedPersons ? 'true' : undefined}
                                    aria-describedby={
                                      errors.exemptedPersons
                                        ? 'exempted-persons-error'
                                        : 'exempted-persons-hint'
                                    }
                                    onChange={(event) => {
                                      trackSimulatorStartOnce();
                                      setExemptedPersons(event.target.value);
                                      if (errors.exemptedPersons) clearFormError('exemptedPersons');
                                    }}
                                    className={
                                      'ui-field ' + (errors.exemptedPersons ? 'ui-field-error' : '')
                                    }
                                  />
                                  {errors.exemptedPersons ? (
                                    <p
                                      id="exempted-persons-error"
                                      className="mt-2 text-sm text-alert-400"
                                      role="alert"
                                    >
                                      {errors.exemptedPersons}
                                    </p>
                                  ) : (
                                    <p
                                      id="exempted-persons-hint"
                                      className="mt-2 text-xs text-muted"
                                    >
                                      Parmi les personnes accueillies · facultatif
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </fieldset>
                      )}
                    </>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    className="simulator-submit mt-6"
                    disabled={!selectedCity}
                  >
                    Calculer <ArrowRight size={18} aria-hidden="true" />
                  </Button>
                  <p className="mt-3 text-xs text-muted">* Champs obligatoires</p>
                </form>
              )}
            </div>

            <div
              ref={resultBlockRef}
              id="tourist-tax-result"
              role="region"
              aria-labelledby="tourist-tax-result-heading"
              className={'simulator-result-panel ' + (!result ? 'simulator-result-empty' : '')}
            >
              {result ? (
                <>
                  <div className="simulator-result-heading">
                    <h2 id="tourist-tax-result-heading">Résultats</h2>
                    <div className="simulator-result-toolbar" aria-label="Actions du résultat">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyShareLink}
                      >
                        <Link2 size={16} aria-hidden="true" /> Copier le lien
                      </Button>
                      <Button type="button" variant="primary" size="sm" onClick={handleExportPdf}>
                        <Download size={16} aria-hidden="true" /> Exporter PDF
                      </Button>
                    </div>
                  </div>

                  {resultSummary && (
                    <>
                      <div className="simulator-result-hero" role="status">
                        {result.isIndicative && (
                          <p className="mb-2 text-xs font-medium text-warning-500">
                            Comparaison indicative
                          </p>
                        )}
                        <p className="simulator-eyebrow">
                          {isReferenceIndicative
                            ? 'Comparaison limitée'
                            : resultSummary.bestSavings
                              ? 'Économie maximale sur ce séjour'
                              : 'Aucune économie sur ce séjour'}
                        </p>
                        <p className="simulator-result-value">
                          {isReferenceIndicative
                            ? '—'
                            : formatEuro(resultSummary.bestSavings?.savingsAmount ?? 0, locale)}
                        </p>
                        <p className="simulator-result-description">
                          {isReferenceIndicative
                            ? localize(
                                'Le montant non classé est indicatif. L’écart entre catégories ne peut pas être établi.'
                              )
                            : resultSummary.bestSavings
                              ? localize(
                                  'de taxe de séjour en moins avec un classement {category}, par rapport à un meublé non classé.'
                                ).replace(
                                  '{category}',
                                  formatClassifiedCategoryForSentence(
                                    resultSummary.bestSavings.category,
                                    locale
                                  )
                                )
                              : localize(
                                  'Dans cette simulation, le classement ne réduit pas la taxe de séjour par rapport au non classé.'
                                )}
                        </p>
                      </div>
                      {result.warnings.length > 0 && (
                        <aside className="simulator-warning">
                          <h3 className="mb-2 !text-sm !font-semibold">Points d&apos;attention</h3>
                          <ul className="space-y-2 text-sm">
                            {result.warnings.map((warning) => (
                              <li key={warning}>{warning}</li>
                            ))}
                          </ul>
                        </aside>
                      )}
                      <dl className="simulator-comparison">
                        <div>
                          <dt>Meublé non classé</dt>
                          <dd>
                            {isReferenceIndicative ? '—' : formatEuro(nonClasseAmount ?? 0, locale)}
                            <span className="mt-1 block text-xs font-normal text-muted">
                              Référence de comparaison
                            </span>
                          </dd>
                        </div>
                        {resultSummary.bestSavings && (
                          <div>
                            <dt>
                              Classé{' '}
                              {formatClassifiedCategoryForSentence(
                                resultSummary.bestSavings.category,
                                locale
                              )}
                            </dt>
                            <dd>
                              {formatEuro(
                                (nonClasseAmount ?? 0) - resultSummary.bestSavings.savingsAmount,
                                locale
                              )}
                              <span className="mt-1 block text-xs font-normal text-muted">
                                Taxe de séjour totale
                              </span>
                            </dd>
                          </div>
                        )}
                      </dl>
                      <ul className="simulator-facts" aria-label="Hypothèses de simulation">
                        {resultSummary.facts.map((fact, index) => (
                          <li key={fact + index}>{fact}</li>
                        ))}
                        {lastCalculationSnapshot?.capacity !== undefined &&
                          lastCalculationSnapshot.personsStaying !== undefined && (
                            <li>Capacité : {lastCalculationSnapshot.capacity}</li>
                          )}
                      </ul>
                      <p className="mt-2 text-xs text-muted">{resultSummary.nightlyPriceLabel}</p>
                      <p className="mt-2 text-xs text-muted">
                        {getTariffPeriodCompactLabel(
                          result.selectedPeriod.startLabel,
                          result.selectedPeriod.endLabel,
                          locale
                        )}
                      </p>
                      {!isFullYearPeriod(
                        result.selectedPeriod.startLabel,
                        result.selectedPeriod.endLabel
                      ) && (
                        <p className="mt-1 text-xs text-muted">
                          En dehors de cette période, la taxe de séjour n&apos;est pas prélevée.
                        </p>
                      )}
                    </>
                  )}

                  <div className="mt-7">
                    <h3 className="!text-base !font-semibold">Selon le classement</h3>
                    <p className="mt-1 text-xs text-muted">
                      Montant total et écart par rapport au non classé.
                    </p>
                    <ul className="simulator-category-list" aria-label="Catégories de classement">
                      {result.rows
                        .filter((row) => row.category !== 'Non classé')
                        .map((row) => (
                          <li key={row.category}>
                            <div>
                              <span className="font-medium">
                                {formatClassifiedCategoryForSentence(row.category, locale)}
                              </span>
                              {row.status === 'indicatif' && (
                                <span className="ml-2 text-xs text-warning-500">indicatif</span>
                              )}
                            </div>
                            <div className="min-w-0 text-right">
                              <p className="font-semibold tabular-nums text-ink">
                                {formatEuro(row.amount, locale)}
                              </p>
                              <p
                                className={
                                  'mt-1 text-xs ' +
                                  (isReferenceIndicative
                                    ? 'text-muted'
                                    : getDeltaClassName(row.amount - (nonClasseAmount ?? 0)))
                                }
                              >
                                {isReferenceIndicative
                                  ? localize('Écart non disponible')
                                  : formatReadableDeltaWithPercent(
                                      row.amount - (nonClasseAmount ?? 0),
                                      nonClasseAmount ?? 0,
                                      locale
                                    )}
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <details className="simulator-disclosure">
                    <summary>Détail du calcul</summary>
                    <ResponsiveComparisonTable
                      appearance="editorial"
                      caption="Résultat détaillé de la simulation de taxe de séjour"
                      columns={resultColumns}
                      rows={resultRows}
                      primaryColumnKey="category"
                    />
                  </details>
                  <details className="simulator-disclosure">
                    <summary>Taxes additionnelles</summary>
                    <p className="mb-4 text-sm text-muted">
                      Les taxes additionnelles sont incluses dans la simulation lorsqu&apos;elles
                      s&apos;appliquent.
                    </p>
                    <ul className="space-y-4">
                      {result.additionalTaxes.map((tax) => (
                        <li
                          key={tax.key}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <div>
                            <span>{tax.label}</span>{' '}
                            <a
                              href={tax.legalReferenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="editorial-inline-link"
                            >
                              ({tax.legalReferenceLabel})
                            </a>
                          </div>
                          <span className="shrink-0 font-semibold">
                            {tax.isApplied ? 'Oui' : 'Non'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              ) : (
                <div>
                  <Scale
                    size={36}
                    strokeWidth={1.25}
                    className="mb-5 text-ink/70"
                    aria-hidden="true"
                  />
                  <p className="simulator-eyebrow">Classé ou non classé</p>
                  <h2 id="tourist-tax-result-heading">Ce que le classement change</h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                    Renseignez votre séjour pour comparer la taxe de séjour, du non classé au 5
                    étoiles.
                  </p>
                  <div className="mt-7 flex gap-4 border-t border-ink/15 pt-5 text-xs text-muted">
                    <span>1 séjour</span>
                    <span>6 catégories</span>
                    <span>Tarifs locaux</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <details className="simulator-disclosure simulator-method">
            <summary>Méthode, hypothèses et sources</summary>
            <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
              <p>
                La taxe de séjour peut être très différente entre un meublé non classé et un meublé
                classé. Pour un logement classé, le tarif dépend du nombre d'étoiles. Pour un
                logement non classé, il est généralement calculé en pourcentage du prix de la
                nuitée.
              </p>
              <p>
                Le calcul prend en compte la période de location, le nombre de personnes, le prix de
                la nuitée et les taxes additionnelles prévues localement.
              </p>
              <p>
                Cette simulation est fournie à titre informatif sur la base des délibérations
                publiées. Elle ne constitue pas un conseil juridique ou fiscal personnalisé.
              </p>
              {dataset && (
                <p>
                  Données de taxe de séjour 2026 · Mise à jour de référence :{' '}
                  {formatDatasetDate(dataset.sourceDate, locale)} · DELTA v{dataset.version}
                </p>
              )}
              <p>Les sources officielles sont disponibles en français.</p>
            </div>
          </details>

          {result && (
            <div className="simulator-next">
              <p>Le classement intervient aussi dans la fiscalité</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Button
                  href={
                    locale === 'en'
                      ? '/en/furnished-tourist-accommodation-tax-simulator'
                      : '/simulateur-fiscal-classement'
                  }
                  variant="primary"
                  className="simulator-tool-link"
                >
                  Simulateur fiscal <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
                <Button
                  href={locale === 'en' ? '/en/request-a-classification' : '/demande-classement'}
                  variant="secondary"
                  className="simulator-tool-link"
                >
                  Demande de classement <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </LocalizedContent>
  );
}
