import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Download, Link2 } from 'lucide-react';
import Button from '../components/ui/Button';
import SimulatorNextSteps from '../components/simulator/SimulatorNextSteps';
import SimulatorField from '../components/simulator/SimulatorField';
import ResponsiveComparisonTable, {
  type ResponsiveComparisonColumn,
  type ResponsiveComparisonRow,
} from '../components/ui/ResponsiveComparisonTable';
import Tooltip from '../components/ui/Tooltip';
import { useToast } from '../components/ui/Toast';
import {
  ALLOWED_TMI_RATES,
  CLASSE_MICRO_BIC_THRESHOLD_2026,
  SOCIAL_THRESHOLD_2026,
  simulateClassementFiscal,
  type ScenarioSimulationResult,
  type SimulationResult,
  type TmiRate,
} from '../utils/classementFiscalSimulator';
import { copyToClipboard, formatFilenameDate } from '../utils/simulatorExport';
import type { ComparisonPdfReport } from '../utils/comparisonReportPdf';
import { trackSimulatorCalculated, trackSimulatorStarted } from '../utils/analytics';
import LocalizedContent from '../i18n/LocalizedContent';
import { translateText } from '../i18n/textTranslation';
import { fiscalSimulatorEnglishTranslations } from '../i18n/simulatorContent';
import { getLocaleFromPath, getLocalizedPath } from '../i18n/routeHelpers';
import { formatDate, formatEuro as formatLocalizedEuro } from '../i18n/numberFormatting';
import type { Locale } from '../i18n/locales';
import { MICRO_BIC_OFFICIAL_SOURCE_URLS } from '../content/microBicFiscalRules';

interface FormErrors {
  annualRevenue?: string;
  tmiRate?: string;
}

interface PersistedFiscalFormState {
  annualRevenueInput: string;
  selectedTmiRate: TmiRate | null;
}

interface PersistedFiscalCalculationSnapshot {
  annualRevenue: number;
  tmiRate: TmiRate;
}

interface PersistedFiscalSimulatorState {
  version: 1;
  form: PersistedFiscalFormState;
  lastCalculation: PersistedFiscalCalculationSnapshot | null;
}

interface ShareableFiscalCalculationQuery {
  revenue: string;
  tmi: string;
}

const FISCAL_SIMULATOR_STORAGE_KEY = 'etoilys.simulateurFiscalClassement.v1';
const FISCAL_SHARE_QUERY_KEYS = ['revenue', 'tmi'] as const;
const RESULT_SCROLL_OFFSET_PX = 96;
const URSSAF_SOCIAL_CONTRIBUTIONS_SIMULATOR_URL =
  'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/cotisations-economie-collaborati.html';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTmiRate(value: unknown): value is TmiRate {
  switch (value) {
    case 0:
    case 11:
    case 30:
    case 41:
    case 45:
      return true;
    default:
      return false;
  }
}

function parsePersistedFiscalForm(value: unknown): PersistedFiscalFormState | null {
  if (!isRecord(value)) {
    return null;
  }

  const selectedTmiRateValue = value.selectedTmiRate;
  const hasValidTmiRate = selectedTmiRateValue === null || isTmiRate(selectedTmiRateValue);
  if (!hasValidTmiRate || typeof value.annualRevenueInput !== 'string') {
    return null;
  }

  return {
    annualRevenueInput: value.annualRevenueInput,
    selectedTmiRate: selectedTmiRateValue,
  };
}

function parsePersistedFiscalCalculationSnapshot(
  value: unknown
): PersistedFiscalCalculationSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.annualRevenue !== 'number' ||
    !Number.isFinite(value.annualRevenue) ||
    value.annualRevenue <= 0 ||
    !isTmiRate(value.tmiRate)
  ) {
    return null;
  }

  return {
    annualRevenue: value.annualRevenue,
    tmiRate: value.tmiRate,
  };
}

function readPersistedFiscalSimulatorState(): PersistedFiscalSimulatorState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(FISCAL_SIMULATOR_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawValue);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return null;
    }

    const form = parsePersistedFiscalForm(parsed.form);
    if (!form) {
      return null;
    }

    let lastCalculation: PersistedFiscalCalculationSnapshot | null = null;
    if (parsed.lastCalculation !== null && parsed.lastCalculation !== undefined) {
      lastCalculation = parsePersistedFiscalCalculationSnapshot(parsed.lastCalculation);
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

function parseShareableFiscalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parseShareableFiscalCalculationSnapshot(
  search: string
): PersistedFiscalCalculationSnapshot | null {
  const params = new URLSearchParams(search);
  const query: ShareableFiscalCalculationQuery = {
    revenue: params.get('revenue') ?? '',
    tmi: params.get('tmi') ?? '',
  };

  const annualRevenue = parseShareableFiscalNumber(query.revenue);
  const tmiRate = Number(query.tmi);
  if (annualRevenue === null || !isTmiRate(tmiRate)) {
    return null;
  }

  return {
    annualRevenue,
    tmiRate,
  };
}

function buildFiscalShareQueryParams(
  snapshot: PersistedFiscalCalculationSnapshot
): URLSearchParams {
  const params = new URLSearchParams();
  params.set('revenue', snapshot.annualRevenue.toString());
  params.set('tmi', snapshot.tmiRate.toString());
  return params;
}

function replaceFiscalShareQueryInUrl(snapshot: PersistedFiscalCalculationSnapshot | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  for (const key of FISCAL_SHARE_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  if (snapshot) {
    const shareParams = buildFiscalShareQueryParams(snapshot);
    shareParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function buildFiscalShareUrl(snapshot: PersistedFiscalCalculationSnapshot): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  for (const key of FISCAL_SHARE_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  const shareParams = buildFiscalShareQueryParams(snapshot);
  shareParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

function formatEuro(value: number, locale: Locale): string {
  return formatLocalizedEuro(value, locale);
}

function localizeFiscalSimulatorText(value: string, locale: Locale): string {
  return locale === 'en' ? translateText(value, fiscalSimulatorEnglishTranslations) : value;
}

function parseAnnualRevenue(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
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

function getClasseAmountClassName(classeAmount: number, nonClasseAmount: number): string {
  return classeAmount < nonClasseAmount ? 'font-semibold text-success-500' : '';
}

function renderClasseAmount(
  classeAmount: number,
  nonClasseAmount: number,
  locale: Locale
): ReactNode {
  const className = getClasseAmountClassName(classeAmount, nonClasseAmount);

  if (!className) {
    return formatEuro(classeAmount, locale);
  }

  return <span className={className}>{formatEuro(classeAmount, locale)}</span>;
}

function getFiscalDeltaClassName(delta: number): string {
  if (delta > 0) {
    return 'text-success-500';
  }
  if (delta < 0) {
    return 'text-alert-500';
  }
  return 'text-gray-600';
}

function formatFiscalDelta(
  nonClasseAmount: number,
  classeAmount: number,
  locale: Locale,
  favorableSuffix = 'économisés',
  unfavorableSuffix = 'de plus'
): string {
  const delta = nonClasseAmount - classeAmount;
  if (delta === 0) {
    return localizeFiscalSimulatorText('Aucun écart', locale);
  }

  const suffix = localizeFiscalSimulatorText(
    delta > 0 ? favorableSuffix : unfavorableSuffix,
    locale
  );
  return `${formatEuro(Math.abs(delta), locale)} ${suffix}`;
}

function renderFiscalDelta(
  nonClasseAmount: number,
  classeAmount: number,
  locale: Locale,
  favorableSuffix = 'économisés',
  unfavorableSuffix = 'de plus'
): ReactNode {
  const delta = nonClasseAmount - classeAmount;
  return (
    <span
      className={`inline-block max-w-[13rem] text-right font-semibold md:max-w-none md:text-center ${getFiscalDeltaClassName(
        delta
      )}`}
    >
      {formatFiscalDelta(nonClasseAmount, classeAmount, locale, favorableSuffix, unfavorableSuffix)}
    </span>
  );
}

function getFiscalSummaryMainText(estimatedSavings: number, locale: Locale): string {
  if (estimatedSavings > 0) {
    return formatEuro(estimatedSavings, locale);
  }
  if (estimatedSavings < 0) {
    return formatEuro(Math.abs(estimatedSavings), locale);
  }
  return 'Aucun écart';
}

function getFiscalSummaryDescription(estimatedSavings: number, locale: Locale): string {
  if (estimatedSavings > 0) {
    return localizeFiscalSimulatorText("d'économie annuelle estimée", locale);
  }
  if (estimatedSavings < 0) {
    return localizeFiscalSimulatorText('de surcoût annuel estimé', locale);
  }
  return localizeFiscalSimulatorText('fiscal annuel estimé', locale);
}

function renderRegimeStatus(
  scenario: ScenarioSimulationResult,
  variant: 'non_classe' | 'classe',
  locale: Locale
) {
  if (scenario.regimeStatus === 'micro-BIC') {
    return <span className="font-medium text-gray-900">micro-BIC</span>;
  }

  const tooltipText =
    variant === 'non_classe'
      ? 'Pour les revenus 2026 déclarés en 2027, le seuil micro-BIC d’un meublé non classé est fixé à 15 000 € de chiffre d’affaires. Après deux années consécutives de dépassement, le régime réel s’applique l’année suivante.'
      : 'Pour les revenus 2026 déclarés en 2027, le seuil micro-BIC d’un meublé classé est fixé à 83 600 € de chiffre d’affaires. Après deux années consécutives de dépassement, le régime réel s’applique l’année suivante.';

  return (
    <span className="inline-flex items-center gap-2 font-medium text-warning-500">
      {localizeFiscalSimulatorText('micro-BIC sous vigilance', locale)}
      <Tooltip
        srLabel={localizeFiscalSimulatorText('Information sur la vigilance du régime', locale)}
      >
        {localizeFiscalSimulatorText(tooltipText, locale)}
      </Tooltip>
    </span>
  );
}

function renderSocialContributionsCell(
  scenario: ScenarioSimulationResult,
  locale: Locale,
  showNonClasseTooltip = false,
  amountClassName = ''
): ReactNode {
  const shouldShowTooltip = showNonClasseTooltip && scenario.socialContributionsAmount !== 0;

  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span className={amountClassName}>
        {formatEuro(scenario.socialContributionsAmount, locale)}
      </span>
      {shouldShowTooltip && (
        <Tooltip
          srLabel={localizeFiscalSimulatorText(
            'Information sur les cotisations sociales non classées',
            locale
          )}
          placement="top"
        >
          <span>
            {localizeFiscalSimulatorText(
              'Montant estimatif fondé sur le simulateur officiel Urssaf pour la location de logement meublé de courte durée.',
              locale
            )}
          </span>
          <a
            href={URSSAF_SOCIAL_CONTRIBUTIONS_SIMULATOR_URL}
            target="_blank"
            rel="noreferrer"
            className="editorial-inline-link mt-2 block font-medium"
          >
            {localizeFiscalSimulatorText('Simulateur officiel Urssaf', locale)}
          </a>
        </Tooltip>
      )}
    </span>
  );
}

function getFiscalWarningMessages(result: SimulationResult, locale: Locale): string[] {
  const warnings: string[] = [];

  if (result.showNonClasseWarning) {
    warnings.push(
      localizeFiscalSimulatorText(
        'Pour les revenus 2026 déclarés en 2027, le seuil micro-BIC est fixé à 15 000 € de chiffre d’affaires pour un meublé non classé, contre 83 600 € pour un meublé classé. Après deux années consécutives de dépassement du seuil applicable, le régime réel s’applique l’année suivante.',
        locale
      )
    );
  }

  if (result.showOutOfScopeWarning) {
    warnings.push(
      localizeFiscalSimulatorText(
        'Pour les revenus 2026 déclarés en 2027, le seuil micro-BIC d’un meublé classé est fixé à 83 600 €. Si vos recettes dépassent ce montant pendant deux années consécutives, le régime réel s’applique l’année suivante et ce simulateur ne couvre plus votre situation.',
        locale
      )
    );
  }

  return warnings;
}

export default function SimulateurFiscalClassement() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const contentLocale = locale === 'en' ? 'en' : 'fr';
  const touristTaxSimulatorPath =
    getLocalizedPath('simulateurTaxeSejour', contentLocale) ?? '/simulateur-taxe-sejour';
  const localize = useCallback(
    (value: string): string =>
      locale === 'en' ? translateText(value, fiscalSimulatorEnglishTranslations) : value,
    [locale]
  );
  const { showToast } = useToast();
  const [annualRevenueInput, setAnnualRevenueInput] = useState('');
  const [selectedTmiRate, setSelectedTmiRate] = useState<TmiRate | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastCalculationSnapshot, setLastCalculationSnapshot] =
    useState<PersistedFiscalCalculationSnapshot | null>(null);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const hasTrackedSimulatorStarted = useRef(false);
  const resultBlockRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResultRef = useRef(false);

  function trackSimulatorStartOnce() {
    if (hasTrackedSimulatorStarted.current) {
      return;
    }

    trackSimulatorStarted('fiscal_classement');
    hasTrackedSimulatorStarted.current = true;
  }

  useEffect(() => {
    const querySnapshot =
      typeof window === 'undefined'
        ? null
        : parseShareableFiscalCalculationSnapshot(window.location.search);
    if (querySnapshot) {
      setAnnualRevenueInput(querySnapshot.annualRevenue.toString());
      setSelectedTmiRate(querySnapshot.tmiRate);
      setLastCalculationSnapshot(querySnapshot);
      setResult(simulateClassementFiscal(querySnapshot));
      setIsStorageHydrated(true);
      return;
    }

    const persistedState = readPersistedFiscalSimulatorState();

    if (persistedState) {
      setAnnualRevenueInput(persistedState.form.annualRevenueInput);
      setSelectedTmiRate(persistedState.form.selectedTmiRate);
      setLastCalculationSnapshot(persistedState.lastCalculation);

      if (persistedState.lastCalculation) {
        try {
          setResult(
            simulateClassementFiscal({
              annualRevenue: persistedState.lastCalculation.annualRevenue,
              tmiRate: persistedState.lastCalculation.tmiRate,
            })
          );
        } catch {
          setLastCalculationSnapshot(null);
        }
      }
    }

    setIsStorageHydrated(true);
  }, []);

  useEffect(() => {
    if (!isStorageHydrated || typeof window === 'undefined') {
      return;
    }

    const persistedState: PersistedFiscalSimulatorState = {
      version: 1,
      form: {
        annualRevenueInput,
        selectedTmiRate,
      },
      lastCalculation: lastCalculationSnapshot,
    };

    try {
      window.sessionStorage.setItem(FISCAL_SIMULATOR_STORAGE_KEY, JSON.stringify(persistedState));
    } catch {
      // Ignorer silencieusement les erreurs de quota/session.
    }
  }, [annualRevenueInput, isStorageHydrated, lastCalculationSnapshot, selectedTmiRate]);

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

  const tableColumns = useMemo<ResponsiveComparisonColumn[]>(
    () => [
      {
        key: 'metric',
        label: localize('Indicateur'),
        mobileLabel: localize('Indicateur'),
        widthClassName: 'w-[28%]',
        align: 'center',
      },
      {
        key: 'nonClasse',
        label: localize('Non classé'),
        mobileLabel: localize('Non classé'),
        widthClassName: 'w-[22%]',
        align: 'center',
      },
      {
        key: 'classe',
        label: localize('Classé'),
        mobileLabel: localize('Classé'),
        widthClassName: 'w-[22%]',
        align: 'center',
      },
      {
        key: 'delta',
        label: localize('Écart'),
        mobileLabel: localize('Écart'),
        widthClassName: 'w-[28%]',
        align: 'center',
      },
    ],
    [localize]
  );

  const tableRows = useMemo<ResponsiveComparisonRow[]>(() => {
    if (!result) {
      return [];
    }

    return [
      {
        key: 'regime',
        rowClassName: 'border-b border-gray-100 bg-white',
        cells: {
          metric: <span className="font-medium text-gray-900">{localize('Régime affiché')}</span>,
          nonClasse: renderRegimeStatus(result.nonClasse, 'non_classe', locale),
          classe: renderRegimeStatus(result.classe, 'classe', locale),
          delta: (
            <span className="font-medium text-gray-600">{localize('Comparaison des régimes')}</span>
          ),
        },
      },
      {
        key: 'base',
        rowClassName: 'border-b border-gray-100 bg-gray-50',
        cells: {
          metric: localize('Base imposable estimée'),
          nonClasse: formatEuro(result.nonClasse.taxableBase, locale),
          classe: formatEuro(result.classe.taxableBase, locale),
          delta: renderFiscalDelta(
            result.nonClasse.taxableBase,
            result.classe.taxableBase,
            locale,
            'de base imposable en moins',
            'de base imposable en plus'
          ),
        },
      },
      {
        key: 'income-tax',
        rowClassName: 'border-b border-gray-100 bg-white',
        cells: {
          metric: localize('Impôt sur le revenu estimé'),
          nonClasse: formatEuro(result.nonClasse.estimatedIncomeTax, locale),
          classe: formatEuro(result.classe.estimatedIncomeTax, locale),
          delta: renderFiscalDelta(
            result.nonClasse.estimatedIncomeTax,
            result.classe.estimatedIncomeTax,
            locale
          ),
        },
      },
      {
        key: 'social-levies',
        rowClassName: 'border-b border-gray-100 bg-gray-50',
        cells: {
          metric: localize('Prélèvements sociaux'),
          nonClasse: formatEuro(result.nonClasse.socialLeviesAmount, locale),
          classe: formatEuro(result.classe.socialLeviesAmount, locale),
          delta: renderFiscalDelta(
            result.nonClasse.socialLeviesAmount,
            result.classe.socialLeviesAmount,
            locale
          ),
        },
      },
      {
        key: 'social-contributions',
        rowClassName: 'border-b border-gray-100 bg-white',
        cells: {
          metric: localize('Cotisations sociales'),
          nonClasse: renderSocialContributionsCell(result.nonClasse, locale, true),
          classe: renderSocialContributionsCell(result.classe, locale),
          delta: renderFiscalDelta(
            result.nonClasse.socialContributionsAmount,
            result.classe.socialContributionsAmount,
            locale
          ),
        },
      },
      {
        key: 'total',
        rowClassName: 'bg-gray-50',
        cells: {
          metric: <span className="font-medium text-gray-900">{localize('Total estimé')}</span>,
          nonClasse: formatEuro(result.nonClasse.estimatedTotal, locale),
          classe: renderClasseAmount(
            result.classe.estimatedTotal,
            result.nonClasse.estimatedTotal,
            locale
          ),
          delta: renderFiscalDelta(
            result.nonClasse.estimatedTotal,
            result.classe.estimatedTotal,
            locale
          ),
        },
      },
    ];
  }, [locale, localize, result]);

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

  async function handleCopyShareLink() {
    if (!result?.canDisplayMicroComparison || !lastCalculationSnapshot) {
      showToast(localize('Aucun résultat à partager.'), { type: 'info' });
      return;
    }

    const shareUrl = buildFiscalShareUrl(lastCalculationSnapshot);
    const isCopied = await copyToClipboard(shareUrl);
    showToast(localize(isCopied ? 'Lien copié.' : 'Impossible de copier le lien.'), {
      type: isCopied ? 'success' : 'error',
    });
  }

  async function handleExportPdf() {
    if (isExportingPdf) return;
    if (
      !result?.canDisplayMicroComparison ||
      result.estimatedSavings === null ||
      !lastCalculationSnapshot
    ) {
      showToast(localize('Aucun résultat à exporter.'), { type: 'info' });
      return;
    }

    setIsExportingPdf(true);
    try {
      const generatedAt = new Date();
      const shareUrl = new URL(buildFiscalShareUrl(lastCalculationSnapshot));
      const simulatorUrl = new URL(
        shareUrl.pathname + shareUrl.search,
        'https://www.etoilys.fr'
      ).toString();
      const safeRevenue = lastCalculationSnapshot.annualRevenue
        .toString()
        .replace(/[^a-zA-Z0-9_-]/g, '-');
      const warningMessages = getFiscalWarningMessages(result, locale);
      if (result.showSocialWarning) {
        warningMessages.push(
          localize(
            'Au-delà de 23 000 € de recettes, cette estimation utilise des cotisations sociales plutôt que des prélèvements sociaux. Consultez le détail du calcul.'
          )
        );
      }
      const amountRows = [
        ['Base imposable estimée', result.nonClasse.taxableBase, result.classe.taxableBase],
        [
          'Impôt sur le revenu estimé',
          result.nonClasse.estimatedIncomeTax,
          result.classe.estimatedIncomeTax,
        ],
        [
          'Prélèvements sociaux',
          result.nonClasse.socialLeviesAmount,
          result.classe.socialLeviesAmount,
        ],
        [
          'Cotisations sociales',
          result.nonClasse.socialContributionsAmount,
          result.classe.socialContributionsAmount,
        ],
        ['Total estimé', result.nonClasse.estimatedTotal, result.classe.estimatedTotal],
      ] as const;
      const report: ComparisonPdfReport = {
        locale: contentLocale,
        title: localize('Simulation fiscale classement 2026'),
        subtitle: localize('Revenus 2026 déclarés en 2027 · comparaison micro-BIC'),
        filename: `simulation-fiscale-classement-${safeRevenue}-${formatFilenameDate(generatedAt)}.pdf`,
        simulatorUrl,
        generatedAt,
        summary: {
          label: localize('L’effet du classement'),
          value: localize(getFiscalSummaryMainText(result.estimatedSavings, locale)),
          description: `${getFiscalSummaryDescription(result.estimatedSavings, locale)} ${localize('avec un meublé classé, par rapport à un meublé non classé.')}`,
          comparisons: [
            {
              label: localize('Non classé'),
              value: formatEuro(result.nonClasse.estimatedTotal, locale),
            },
            { label: localize('Classé'), value: formatEuro(result.classe.estimatedTotal, locale) },
          ],
          ...(result.showNonClasseWarning
            ? {
                notice: localize(
                  'Le régime micro-BIC non classé est sous vigilance. Consultez les points d’attention.'
                ),
              }
            : {}),
        },
        parameters: [
          [
            localize('Recettes locatives annuelles 2026'),
            formatEuro(lastCalculationSnapshot.annualRevenue, locale),
          ],
          [localize("Tranche marginale d'imposition"), `${lastCalculationSnapshot.tmiRate} %`],
          [
            localize('Mise à jour des paramètres'),
            formatDate(new Date(Date.UTC(2026, 6, 11)), locale),
          ],
        ],
        comparison: {
          columns: ['Indicateur', 'Non classé', 'Classé', 'Écart'].map(localize),
          widths: [0.3, 0.22, 0.22, 0.26],
          rows: [
            {
              cells: [
                localize('Régime affiché'),
                localize(result.nonClasse.regimeStatus),
                localize(result.classe.regimeStatus),
                localize('Comparaison des régimes'),
              ],
              tone: 'neutral',
            },
            ...amountRows.map(([label, nonClasse, classe], index) => ({
              cells: [
                localize(label),
                formatEuro(nonClasse, locale),
                formatEuro(classe, locale),
                index === 0
                  ? formatFiscalDelta(
                      nonClasse,
                      classe,
                      locale,
                      'de base imposable en moins',
                      'de base imposable en plus'
                    )
                  : formatFiscalDelta(nonClasse, classe, locale),
              ],
              tone: (label === 'Total estimé'
                ? nonClasse > classe
                  ? 'positive'
                  : nonClasse < classe
                    ? 'negative'
                    : 'reference'
                : 'neutral') as 'positive' | 'negative' | 'reference' | 'neutral',
            })),
          ],
        },
        notes: [
          ...(warningMessages.length
            ? [{ title: localize("Points d'attention"), paragraphs: warningMessages }]
            : []),
          {
            title: localize('Hypothèses de simulation'),
            paragraphs: [
              localize(
                'La comparaison repose sur les principaux paramètres officiels : seuil de recettes et abattement forfaitaire. Pour les revenus 2026 déclarés en 2027, le seuil micro-BIC est fixé à 15 000 € avec un abattement de 30 % pour un meublé non classé, contre 83 600 € et 50 % pour un meublé classé.'
              ),
              localize(
                'Totaux annuels estimés, impôt et prélèvements ou cotisations sociales inclus.'
              ),
              ...(result.estimatedSavings > 0
                ? [
                    localize(
                      'À situation identique, l’écart représente environ {amount} sur 5 ans.'
                    ).replace('{amount}', formatEuro(result.estimatedSavings * 5, locale)),
                  ]
                : []),
              localize(
                'Simulation Etoilys fournie à titre indicatif. Elle ne remplace pas un avis fiscal ou comptable personnalisé.'
              ),
            ],
          },
        ],
        sources: [
          {
            label: localize('Fiscalité des meublés de tourisme — impots.gouv.fr'),
            url: MICRO_BIC_OFFICIAL_SOURCE_URLS[0],
          },
          {
            label: localize('Seuils et abattements — Service Public'),
            url: MICRO_BIC_OFFICIAL_SOURCE_URLS[1],
          },
          {
            label: localize('Location meublée — Service Public'),
            url: MICRO_BIC_OFFICIAL_SOURCE_URLS[2],
          },
          {
            label: localize('Simulateur officiel Urssaf'),
            url: URSSAF_SOCIAL_CONTRIBUTIONS_SIMULATOR_URL,
          },
        ],
      };
      const { exportComparisonReportPdf } = await import('../utils/comparisonReportPdf');
      await exportComparisonReportPdf(report);
      showToast(localize('PDF généré.'), { type: 'success' });
    } catch {
      showToast(localize('Impossible de générer le PDF.'), { type: 'error' });
    } finally {
      setIsExportingPdf(false);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackSimulatorStartOnce();

    const nextErrors: FormErrors = {};
    const parsedAnnualRevenue = parseAnnualRevenue(annualRevenueInput);

    if (parsedAnnualRevenue === null) {
      nextErrors.annualRevenue = "Saisissez un chiffre d'affaires annuel 2026 valide.";
    }

    if (selectedTmiRate === null) {
      nextErrors.tmiRate = "Sélectionnez une tranche marginale d'imposition.";
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0 ||
      parsedAnnualRevenue === null ||
      selectedTmiRate === null
    ) {
      setResult(null);
      setLastCalculationSnapshot(null);
      replaceFiscalShareQueryInUrl(null);
      return;
    }

    const nextSnapshot: PersistedFiscalCalculationSnapshot = {
      annualRevenue: parsedAnnualRevenue,
      tmiRate: selectedTmiRate,
    };
    const nextResult = simulateClassementFiscal(nextSnapshot);

    trackSimulatorCalculated('fiscal_classement', {
      revenue_bucket: bucketNumber(parsedAnnualRevenue, [15000, 23000, 50000, 83600]),
      tmi_rate: selectedTmiRate,
      scope: nextResult.scope,
      social_threshold_exceeded: parsedAnnualRevenue > SOCIAL_THRESHOLD_2026,
      non_classe_threshold_exceeded: nextResult.nonClasse.exceedsMicroBicThreshold,
      savings_bucket:
        nextResult.estimatedSavings === null
          ? 'not_applicable'
          : bucketNumber(Math.abs(nextResult.estimatedSavings), [250, 500, 1000, 2500, 5000]),
    });

    setLastCalculationSnapshot(nextSnapshot);
    setResult(nextResult);
    replaceFiscalShareQueryInUrl(nextSnapshot);
    shouldScrollToResultRef.current = true;
  };

  return (
    <LocalizedContent locale={locale} translations={fiscalSimulatorEnglishTranslations}>
      <section className="simulator-ui simulator-page">
        <div className="container-editorial">
          <header className="simulator-intro">
            <div>
              <p className="simulator-eyebrow">Outils de simulation</p>
              <h1>Simulateur fiscal : classé ou non classé</h1>
              <p>
                Deux informations pour estimer ce que le classement change à votre fiscalité
                micro-BIC en 2026.
              </p>
            </div>
            <Button
              href={touristTaxSimulatorPath}
              variant="primary"
              className="simulator-tool-link"
            >
              Simulateur taxe de séjour
              <ArrowUpRight aria-hidden="true" size={16} />
            </Button>
          </header>

          <div className="simulator-workspace">
            <form className="simulator-form-panel" onSubmit={handleSubmit} noValidate>
              <div className="mb-7">
                <h2>Votre situation 2026</h2>
                <p className="mt-2 text-sm text-muted">Deux champs à renseigner.</p>
              </div>

              <div className="space-y-7">
                <SimulatorField
                  id="annual-revenue-input"
                  name="annualRevenue"
                  label="Recettes locatives annuelles 2026"
                  required
                  showRequiredMarker={false}
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex. 20 000"
                  value={annualRevenueInput}
                  suffix="€"
                  error={errors.annualRevenue ? localize(errors.annualRevenue) : undefined}
                  errorId="annual-revenue-error"
                  helperId="annual-revenue-help"
                  helperText="Total perçu en 2026, loyers et charges inclus, en euros."
                  onChange={(event) => {
                    trackSimulatorStartOnce();
                    setAnnualRevenueInput(event.target.value);
                    if (errors.annualRevenue) {
                      clearFormError('annualRevenue');
                    }
                  }}
                />

                <fieldset
                  id="tmi-rate-group"
                  className="simulator-fieldset"
                  aria-describedby={errors.tmiRate ? 'tmi-rate-error' : undefined}
                >
                  <legend>Votre tranche marginale d&apos;imposition</legend>
                  <div className="simulator-rate-options">
                    {ALLOWED_TMI_RATES.map((rate) => (
                      <label key={rate}>
                        <input
                          className="sr-only ui-focus"
                          type="radio"
                          name="tmiRate"
                          value={rate}
                          checked={selectedTmiRate === rate}
                          required
                          aria-invalid={errors.tmiRate ? true : undefined}
                          onChange={() => {
                            trackSimulatorStartOnce();
                            setSelectedTmiRate(rate);
                            if (errors.tmiRate) {
                              clearFormError('tmiRate');
                            }
                          }}
                        />
                        <span>
                          {rate} %
                          {selectedTmiRate === rate && <Check aria-hidden="true" size={12} />}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.tmiRate && (
                    <p id="tmi-rate-error" role="alert" className="mt-2 text-sm text-alert-400">
                      {errors.tmiRate}
                    </p>
                  )}
                  <details className="simulator-disclosure mt-2">
                    <summary>Où trouver mon taux ?</summary>
                    <p>
                      Votre tranche marginale d’imposition est le taux appliqué à la partie la plus
                      élevée de vos revenus. Vous pouvez la retrouver sur votre avis d’impôt.
                    </p>
                  </details>
                </fieldset>

                <Button type="submit" variant="primary" className="simulator-submit">
                  Calculer
                  <ArrowRight aria-hidden="true" size={18} />
                </Button>
              </div>
            </form>

            <div
              id="fiscal-result"
              ref={resultBlockRef}
              className="simulator-result-panel"
              role="region"
              aria-labelledby="fiscal-result-title"
            >
              {!result ? (
                <div className="simulator-result-empty">
                  <p className="simulator-eyebrow">Classé / non classé</p>
                  <h2 id="fiscal-result-title">Votre comparaison, en un regard</h2>
                  <p>
                    Renseignez vos recettes et votre taux pour comparer les montants annuels et
                    découvrir l’écart estimé.
                  </p>
                  <div className="simulator-comparison" aria-hidden="true">
                    <div>
                      <span>Non classé</span>
                      <span className="block text-2xl">—</span>
                    </div>
                    <div>
                      <span>Classé</span>
                      <span className="block text-2xl">—</span>
                    </div>
                  </div>
                  <p className="text-xs">Revenus 2026 · régime micro-BIC</p>
                </div>
              ) : result.canDisplayMicroComparison ? (
                <>
                  <div className="simulator-result-heading">
                    <h2 id="fiscal-result-title">Comparatif 2026</h2>
                    <div className="simulator-result-toolbar">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyShareLink}
                      >
                        <Link2 aria-hidden="true" size={16} />
                        Copier le lien
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleExportPdf}
                        disabled={isExportingPdf}
                        aria-busy={isExportingPdf}
                      >
                        <Download aria-hidden="true" size={16} />
                        {isExportingPdf ? 'Création du PDF…' : 'Exporter PDF'}
                      </Button>
                    </div>
                  </div>

                  {result.estimatedSavings !== null && (
                    <div className="simulator-result-hero">
                      <p className="simulator-eyebrow">L’effet du classement</p>
                      <p className="simulator-result-value">
                        {localize(getFiscalSummaryMainText(result.estimatedSavings, locale))}
                      </p>
                      <p className="simulator-result-description">
                        {getFiscalSummaryDescription(result.estimatedSavings, locale)}{' '}
                        {localize('avec un meublé classé, par rapport à un meublé non classé.')}
                      </p>
                    </div>
                  )}

                  <dl className="simulator-comparison">
                    <div>
                      <dt>Non classé</dt>
                      <dd>{formatEuro(result.nonClasse.estimatedTotal, locale)}</dd>
                    </div>
                    <div>
                      <dt>Classé</dt>
                      <dd>{formatEuro(result.classe.estimatedTotal, locale)}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs text-muted">
                    Totaux annuels estimés, impôt et prélèvements ou cotisations sociales inclus.
                  </p>

                  {(result.showNonClasseWarning || result.showSocialWarning) && (
                    <div className="simulator-warning mt-6" role="note">
                      {getFiscalWarningMessages(result, locale).map((warning) => (
                        <p key={warning}>{warning}</p>
                      ))}
                      {result.showSocialWarning && (
                        <p>
                          Au-delà de 23 000 € de recettes, cette estimation utilise des cotisations
                          sociales plutôt que des prélèvements sociaux. Consultez le détail du
                          calcul.
                        </p>
                      )}
                    </div>
                  )}

                  {lastCalculationSnapshot && (
                    <>
                      <dl className="simulator-facts">
                        <div>
                          <dt>Recettes locatives 2026</dt>
                          <dd>{formatEuro(lastCalculationSnapshot.annualRevenue, locale)}</dd>
                        </div>
                        <div>
                          <dt>Tranche marginale d’imposition</dt>
                          <dd>{lastCalculationSnapshot.tmiRate} %</dd>
                        </div>
                      </dl>
                      {(parseAnnualRevenue(annualRevenueInput) !==
                        lastCalculationSnapshot.annualRevenue ||
                        selectedTmiRate !== lastCalculationSnapshot.tmiRate) && (
                        <p className="simulator-warning" role="status">
                          Vos paramètres ont changé. Relancez le calcul pour actualiser ce résultat.
                        </p>
                      )}
                    </>
                  )}

                  <details className="simulator-disclosure">
                    <summary>Voir le détail du calcul</summary>
                    <ResponsiveComparisonTable
                      appearance="editorial"
                      caption="Comparatif fiscal entre meublé classé et non classé"
                      columns={tableColumns}
                      rows={tableRows}
                      primaryColumnKey="metric"
                      showPrimaryColumnInMobileDetails={false}
                      desktopWrapperClassName="simulator-comparison-table-desktop"
                      mobileContainerClassName="simulator-comparison-table-mobile space-y-0"
                      headerCellClassName="p-3 font-semibold break-words"
                      cellClassName="border-b border-ink/15 p-3 align-top break-words text-muted"
                      mobileCardClassName="border-b border-ink/15 py-4"
                      mobileTitleClassName="mb-3 font-roboto text-base font-semibold text-ink"
                    />
                  </details>
                  <p className="mt-5 text-xs text-muted">
                    Cette simulation est fournie à titre indicatif. Elle ne remplace pas un avis
                    fiscal ou comptable personnalisé.
                  </p>
                </>
              ) : (
                <div className="simulator-result-hero">
                  <p className="simulator-eyebrow">Limite du simulateur</p>
                  <h2 id="fiscal-result-title">Comparaison hors périmètre</h2>
                  <p className="simulator-result-description">
                    Vos recettes dépassent le seuil du micro-BIC classé pour les revenus 2026
                    déclarés en 2027.
                  </p>
                  <div className="simulator-warning mt-6" role="note">
                    <p>
                      {localize(
                        'Au-delà de {threshold} de recettes sur deux années consécutives, le régime réel s’applique l’année suivante. Ce simulateur ne permet alors plus de comparer votre situation.'
                      ).replace('{threshold}', formatEuro(CLASSE_MICRO_BIC_THRESHOLD_2026, locale))}
                    </p>
                  </div>
                  <p className="mt-5 text-sm text-muted">
                    En revanche, ses autres avantages restent applicables, comme ceux liés à la taxe
                    de séjour.
                  </p>
                </div>
              )}
              <p className="sr-only" role="status">
                {result ? 'Simulation calculée.' : ''}
              </p>
            </div>
          </div>

          <details className="simulator-disclosure simulator-method">
            <summary>Méthode, hypothèses et sources</summary>
            <div className="grid gap-7 pb-3 md:grid-cols-2">
              <div className="space-y-3">
                <h2 className="font-roboto text-base font-semibold">Le cadre de la comparaison</h2>
                <p>
                  Ce simulateur compare le régime micro-BIC d’un meublé classé et d’un meublé non
                  classé pour les revenus 2026 déclarés en 2027, à partir de vos recettes annuelles
                  et de votre tranche marginale d’imposition.
                </p>
                <p>
                  La comparaison repose sur les principaux paramètres officiels : seuil de recettes
                  et abattement forfaitaire. Pour les revenus 2026 déclarés en 2027, le seuil
                  micro-BIC est fixé à 15 000 € avec un abattement de 30 % pour un meublé non
                  classé, contre 83 600 € et 50 % pour un meublé classé.
                </p>
                <p>
                  Le résultat sert à comparer classé et non classé au micro-BIC. Il ne remplace pas
                  une analyse comptable ou fiscale complète, notamment si vous relevez du régime
                  réel, si vos recettes dépassent les seuils ou si votre situation personnelle
                  comporte des particularités.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="font-roboto text-base font-semibold">Sources de référence</h2>
                <p>
                  Paramètres fiscaux : revenus 2026 déclarés en 2027 · Mise à jour :{' '}
                  {formatDate(new Date(Date.UTC(2026, 6, 11)), locale)}
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={MICRO_BIC_OFFICIAL_SOURCE_URLS[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="editorial-inline-link"
                    >
                      Fiscalité des meublés de tourisme — impots.gouv.fr
                    </a>
                  </li>
                  <li>
                    <a
                      href={MICRO_BIC_OFFICIAL_SOURCE_URLS[2]}
                      target="_blank"
                      rel="noreferrer"
                      className="editorial-inline-link"
                    >
                      Location meublée — Service Public
                    </a>
                  </li>
                  <li>
                    <a
                      href={URSSAF_SOCIAL_CONTRIBUTIONS_SIMULATOR_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="editorial-inline-link"
                    >
                      Simulateur officiel Urssaf
                    </a>
                  </li>
                </ul>
                <p className="text-xs">Sources officielles disponibles en français.</p>
              </div>
            </div>
          </details>

          {result && <SimulatorNextSteps locale={locale} currentSimulator="fiscal" />}
        </div>
      </section>
    </LocalizedContent>
  );
}
