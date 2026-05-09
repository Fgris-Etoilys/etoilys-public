import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
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
import {
  copyToClipboard,
  formatFilenameDate,
  getAutoTableFinalY,
  getEtoilysLogoPngAsset,
  normalizePdfText,
} from '../utils/simulatorExport';
import { trackSimulatorCalculated, trackSimulatorStarted } from '../utils/analytics';

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

function getSavingsClassName(value: number): string {
  if (value > 0) {
    return 'text-success-500';
  }
  if (value < 0) {
    return 'text-alert-500';
  }
  return 'text-gray-900';
}

function getSavingsLabel(value: number): string {
  if (value > 0) return 'Économie annuelle estimée';
  if (value < 0) return 'Écart fiscal estimé';
  return 'Aucun écart fiscal estimé';
}

function getSavingsCardClassName(value: number): string {
  if (value > 0) return 'border-success-200 bg-success-100';
  if (value < 0) return 'border-warning-200 bg-warning-100';
  return 'border-gray-200 bg-gray-50';
}

function getClasseAmountClassName(classeAmount: number, nonClasseAmount: number): string {
  return classeAmount < nonClasseAmount ? 'font-semibold text-success-500' : '';
}

function renderClasseAmount(classeAmount: number, nonClasseAmount: number): ReactNode {
  const className = getClasseAmountClassName(classeAmount, nonClasseAmount);

  if (!className) {
    return formatEuro(classeAmount);
  }

  return <span className={className}>{formatEuro(classeAmount)}</span>;
}

function renderRegimeStatus(scenario: ScenarioSimulationResult, variant: 'non_classe' | 'classe') {
  if (scenario.regimeStatus === 'micro-BIC') {
    return <span className="font-medium text-gray-900">micro-BIC</span>;
  }

  const tooltipText =
    variant === 'non_classe'
      ? "Si vous dépassez le seuil de 15 000 € de CA deux années consécutives, vous basculerez automatiquement au régime réel l'année suivante."
      : 'Au-delà de 83 600 € de CA, le scénario classé est également sous vigilance de sortie du cadre micro-BIC.';

  return (
    <span className="inline-flex items-center gap-2 font-medium text-warning-500">
      micro-BIC sous vigilance
      <Tooltip srLabel="Information sur la vigilance du régime">{tooltipText}</Tooltip>
    </span>
  );
}

function renderSocialContributionsCell(
  scenario: ScenarioSimulationResult,
  showNonClasseTooltip = false,
  amountClassName = ''
): ReactNode {
  const shouldShowTooltip = showNonClasseTooltip && scenario.socialContributionsAmount !== 0;

  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span className={amountClassName}>{formatEuro(scenario.socialContributionsAmount)}</span>
      {shouldShowTooltip && (
        <Tooltip srLabel="Information sur les cotisations sociales non classées" placement="top">
          <span>
            Montant estimatif fondé sur le simulateur officiel Urssaf pour la location de logement
            meublé de courte durée.
          </span>
          <a
            href={URSSAF_SOCIAL_CONTRIBUTIONS_SIMULATOR_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block font-medium text-primary-300 underline underline-offset-2"
          >
            Simulateur officiel Urssaf
          </a>
        </Tooltip>
      )}
    </span>
  );
}

function getFiscalWarningMessages(result: SimulationResult): string[] {
  const warnings: string[] = [];

  if (result.showNonClasseWarning) {
    warnings.push(
      "Au-delà de 15 000 € de chiffre d'affaires, un meublé de tourisme non classé ne reste pas durablement au micro-BIC. Si le dépassement se répète deux années de suite, le régime réel s'applique l'année suivante. En 2026, le classement permet de rester au micro-BIC jusqu'à 83 600 € de chiffre d'affaires."
    );
  }

  if (result.showOutOfScopeWarning) {
    warnings.push(
      "À partir de 83 600 €, le régime réel s'applique au-delà de ce seuil sur deux années consécutives. Le classement n'apporte alors plus d'avantage fiscal ou social dans ce comparatif."
    );
  }

  return warnings;
}

export default function SimulateurFiscalClassement() {
  const { showToast } = useToast();
  const [annualRevenueInput, setAnnualRevenueInput] = useState('');
  const [selectedTmiRate, setSelectedTmiRate] = useState<TmiRate | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastCalculationSnapshot, setLastCalculationSnapshot] =
    useState<PersistedFiscalCalculationSnapshot | null>(null);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const hasTrackedSimulatorStarted = useRef(false);

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

  const tableColumns = useMemo<ResponsiveComparisonColumn[]>(
    () => [
      {
        key: 'metric',
        label: 'Indicateur',
        mobileLabel: 'Indicateur',
        widthClassName: 'w-1/3',
        align: 'center',
      },
      {
        key: 'nonClasse',
        label: 'Non classé',
        mobileLabel: 'Non classé',
        widthClassName: 'w-1/3',
        align: 'center',
      },
      {
        key: 'classe',
        label: 'Classé',
        mobileLabel: 'Classé',
        widthClassName: 'w-1/3',
        align: 'center',
      },
    ],
    []
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
          metric: <span className="font-medium text-gray-900">Régime affiché</span>,
          nonClasse: renderRegimeStatus(result.nonClasse, 'non_classe'),
          classe: renderRegimeStatus(result.classe, 'classe'),
        },
      },
      {
        key: 'base',
        rowClassName: 'border-b border-gray-100 bg-gray-50',
        cells: {
          metric: 'Base imposable estimée',
          nonClasse: formatEuro(result.nonClasse.taxableBase),
          classe: formatEuro(result.classe.taxableBase),
        },
      },
      {
        key: 'income-tax',
        rowClassName: 'border-b border-gray-100 bg-white',
        cells: {
          metric: 'Impôt sur le revenu estimé',
          nonClasse: formatEuro(result.nonClasse.estimatedIncomeTax),
          classe: renderClasseAmount(
            result.classe.estimatedIncomeTax,
            result.nonClasse.estimatedIncomeTax
          ),
        },
      },
      {
        key: 'social-levies',
        rowClassName: 'border-b border-gray-100 bg-gray-50',
        cells: {
          metric: 'Prélèvements sociaux',
          nonClasse: formatEuro(result.nonClasse.socialLeviesAmount),
          classe: renderClasseAmount(
            result.classe.socialLeviesAmount,
            result.nonClasse.socialLeviesAmount
          ),
        },
      },
      {
        key: 'social-contributions',
        rowClassName: 'border-b border-gray-100 bg-white',
        cells: {
          metric: 'Cotisations sociales',
          nonClasse: renderSocialContributionsCell(result.nonClasse, true),
          classe: renderSocialContributionsCell(
            result.classe,
            false,
            getClasseAmountClassName(
              result.classe.socialContributionsAmount,
              result.nonClasse.socialContributionsAmount
            )
          ),
        },
      },
      {
        key: 'total',
        rowClassName: 'bg-gray-50',
        cells: {
          metric: <span className="font-medium text-gray-900">Total estimé</span>,
          nonClasse: formatEuro(result.nonClasse.estimatedTotal),
          classe: renderClasseAmount(result.classe.estimatedTotal, result.nonClasse.estimatedTotal),
        },
      },
    ];
  }, [result]);

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
      showToast('Aucun résultat à partager.', { type: 'info' });
      return;
    }

    const shareUrl = buildFiscalShareUrl(lastCalculationSnapshot);
    const isCopied = await copyToClipboard(shareUrl);
    showToast(isCopied ? 'Lien copié.' : 'Impossible de copier le lien.', {
      type: isCopied ? 'success' : 'error',
    });
  }

  async function handleExportPdf() {
    if (!result?.canDisplayMicroComparison || !lastCalculationSnapshot) {
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
      const title = 'Simulation fiscale classement 2026';
      const titleWidth = doc.getTextWidth(title);
      const centeredTitleX = (pageWidth - titleWidth) / 2;
      doc.text(title, centeredTitleX, cursorY);

      cursorY += 34;
      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text('Paramètres de simulation', marginX, cursorY);

      autoTable(doc, {
        startY: cursorY + 10,
        head: [['Paramètre', 'Valeur']],
        body: [
          ["Chiffre d'affaires annuel 2026", formatPdfEuro(lastCalculationSnapshot.annualRevenue)],
          ["Tranche marginale d'imposition", `${lastCalculationSnapshot.tmiRate} %`],
        ],
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 26;

      doc.setFontSize(11);
      doc.setTextColor(25);
      doc.text('Résultats', marginX, cursorY);

      cursorY += 8;
      const resultRowsForPdf = [
        {
          metric: 'Régime affiché',
          nonClasse: result.nonClasse.regimeStatus,
          classe: result.classe.regimeStatus,
          nonClasseAmount: null,
          classeAmount: null,
        },
        {
          metric: 'Base imposable estimée',
          nonClasse: formatPdfEuro(result.nonClasse.taxableBase),
          classe: formatPdfEuro(result.classe.taxableBase),
          nonClasseAmount: null,
          classeAmount: null,
        },
        {
          metric: 'Impôt sur le revenu estimé',
          nonClasse: formatPdfEuro(result.nonClasse.estimatedIncomeTax),
          classe: formatPdfEuro(result.classe.estimatedIncomeTax),
          nonClasseAmount: result.nonClasse.estimatedIncomeTax,
          classeAmount: result.classe.estimatedIncomeTax,
        },
        {
          metric: 'Prélèvements sociaux',
          nonClasse: formatPdfEuro(result.nonClasse.socialLeviesAmount),
          classe: formatPdfEuro(result.classe.socialLeviesAmount),
          nonClasseAmount: result.nonClasse.socialLeviesAmount,
          classeAmount: result.classe.socialLeviesAmount,
        },
        {
          metric: 'Cotisations sociales',
          nonClasse: formatPdfEuro(result.nonClasse.socialContributionsAmount),
          classe: formatPdfEuro(result.classe.socialContributionsAmount),
          nonClasseAmount: result.nonClasse.socialContributionsAmount,
          classeAmount: result.classe.socialContributionsAmount,
        },
        {
          metric: 'Total estimé',
          nonClasse: formatPdfEuro(result.nonClasse.estimatedTotal),
          classe: formatPdfEuro(result.classe.estimatedTotal),
          nonClasseAmount: result.nonClasse.estimatedTotal,
          classeAmount: result.classe.estimatedTotal,
        },
      ];

      autoTable(doc, {
        startY: cursorY,
        head: [['Indicateur', 'Non classé', 'Classé']],
        body: resultRowsForPdf.map((row) => [row.metric, row.nonClasse, row.classe]),
        styles: { fontSize: 10, cellPadding: 7 },
        headStyles: { fillColor: [49, 107, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        didParseCell: (hookData) => {
          if (hookData.section !== 'body' || hookData.column.index !== 2) {
            return;
          }

          const rowData = resultRowsForPdf[hookData.row.index];
          if (
            !rowData ||
            rowData.nonClasseAmount === null ||
            rowData.classeAmount === null ||
            rowData.classeAmount >= rowData.nonClasseAmount
          ) {
            return;
          }

          hookData.cell.styles.textColor = [0, 115, 0];
          hookData.cell.styles.fontStyle = 'bold';
        },
      });

      cursorY = (getAutoTableFinalY(doc) ?? cursorY) + 24;
      const warningMessages = getFiscalWarningMessages(result);
      if (warningMessages.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(25);
        doc.text("Points d'attention", marginX, cursorY);

        autoTable(doc, {
          startY: cursorY + 8,
          head: [['Avertissement']],
          body: warningMessages.map((warning) => [warning]),
          styles: { fontSize: 10, cellPadding: 7 },
          headStyles: { fillColor: [145, 109, 0] },
          alternateRowStyles: { fillColor: [255, 248, 211] },
        });
      }

      const sourceLine =
        'Simulation Etoilys fournie à titre indicatif. Elle ne remplace pas un avis fiscal ou comptable personnalisé.';
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

      const safeRevenue = lastCalculationSnapshot.annualRevenue
        .toString()
        .replace(/[^a-zA-Z0-9_-]/g, '-');
      doc.save(
        `simulation-fiscale-classement-${safeRevenue}-${formatFilenameDate(new Date())}.pdf`
      );
      showToast('PDF généré.', { type: 'success' });
    } catch {
      showToast('Impossible de générer le PDF.', { type: 'error' });
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
  };

  return (
    <>
      <section className="simulator-ui bg-gradient-to-br from-themePrimary-1 to-primary-300 py-10 text-white md:py-12">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-white">Simulateur fiscal classement 2026</h1>
            <p className="text-base text-white/90">
              Ce simulateur compare le régime micro-BIC d’un meublé classé et d’un meublé non classé
              à partir du chiffre d’affaires annuel et de la tranche marginale d’imposition.
            </p>
          </div>
        </div>
      </section>

      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl space-y-6">
            <Card hover={false} className="p-5 md:p-6">
              <h2 className="mb-5">Votre situation 2026</h2>
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <Input
                  label="Chiffre d'affaires annuel 2026 (en €)"
                  required
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex. 20 000"
                  helperText="Indiquez le total des sommes perçues en 2026, loyers et charges locatives incluses."
                  value={annualRevenueInput}
                  onChange={(event) => {
                    trackSimulatorStartOnce();
                    setAnnualRevenueInput(event.target.value);
                    if (errors.annualRevenue) {
                      clearFormError('annualRevenue');
                    }
                  }}
                  error={errors.annualRevenue}
                />

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      Tranche marginale d&apos;imposition de votre foyer fiscal
                      <span className="ml-1 text-alert-400">*</span>
                    </p>
                    <span className="-translate-y-px">
                      <Tooltip srLabel="Aide sur la tranche marginale d'imposition">
                        La tranche marginale d&apos;imposition correspond au taux appliqué à la
                        dernière tranche de vos revenus imposables. Vous la retrouvez sur votre avis
                        d&apos;impôt sur le revenu.
                      </Tooltip>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ALLOWED_TMI_RATES.map((rate) => {
                      const isSelected = selectedTmiRate === rate;
                      return (
                        <button
                          key={rate}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            isSelected
                              ? 'border-primary-300 bg-primary-300 text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-300'
                          }`}
                          aria-pressed={isSelected}
                          onClick={() => {
                            trackSimulatorStartOnce();
                            setSelectedTmiRate(rate);
                            if (errors.tmiRate) {
                              clearFormError('tmiRate');
                            }
                          }}
                        >
                          {rate} %
                        </button>
                      );
                    })}
                  </div>

                  {errors.tmiRate && (
                    <p className="mt-2 text-sm text-alert-400">{errors.tmiRate}</p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full md:w-auto">
                  Calculer
                </Button>
              </form>
            </Card>

            {result && (
              <>
                {result.canDisplayMicroComparison ? (
                  <Card hover={false} className="p-5 md:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h2>Comparatif 2026</h2>
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

                    <ResponsiveComparisonTable
                      columns={tableColumns}
                      rows={tableRows}
                      primaryColumnKey="metric"
                      showPrimaryColumnInMobileDetails={false}
                      tableClassName="w-full border-collapse rounded-card text-sm shadow-sm"
                      desktopWrapperClassName="hidden overflow-visible md:block"
                      headerRowClassName="bg-primary-300 text-white"
                      headerCellClassName="p-3 font-semibold"
                      cellClassName="p-3"
                      mobileContainerClassName="space-y-3 md:hidden"
                      mobileCardClassName="rounded-card border border-gray-200 bg-white p-4 shadow-sm"
                      mobileTitleClassName="mb-3 text-sm font-semibold text-gray-900"
                      mobileLabelClassName="text-xs font-medium text-gray-600"
                      mobileValueClassName="text-right text-sm text-gray-900"
                    />

                    {result.estimatedSavings !== null && (
                      <div
                        className={`mt-6 rounded-card border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${getSavingsCardClassName(result.estimatedSavings)}`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getSavingsLabel(result.estimatedSavings)}
                          </p>
                          <p className="mt-0.5 text-xs text-textLight">
                            Par rapport à un meublé non classé
                          </p>
                        </div>
                        <div className="shrink-0 sm:text-right">
                          <p
                            className={`text-lg font-bold ${getSavingsClassName(result.estimatedSavings)}`}
                          >
                            {formatEuro(result.estimatedSavings)}
                          </p>
                          {result.estimatedSavings > 0 && (
                            <p className="mt-0.5 text-xs text-textLight">
                              Soit environ{' '}
                              <span className="font-semibold text-success-500">
                                {formatEuro(result.estimatedSavings * 5)}
                              </span>{' '}
                              sur 5 ans
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      {result.showNonClasseWarning && (
                        <div className="rounded-card border border-warning-200 bg-warning-100 p-4 text-sm text-gray-700">
                          <p>
                            Au-delà de 15 000 € de chiffre d&apos;affaires, un meublé de tourisme
                            non classé ne reste pas durablement au micro-BIC. Si le dépassement se
                            répète deux années de suite, le régime réel s&apos;applique l&apos;année
                            suivante, avec plus de gestion et de formalités.
                          </p>
                          <p className="mt-3">
                            En 2026, le classement permet de rester au micro-BIC jusqu&apos;à 83 600
                            € de chiffre d&apos;affaires.
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-6 text-sm text-textLight">
                      Cette simulation est fournie à titre indicatif. Elle ne remplace pas un avis
                      fiscal ou comptable personnalisé.
                    </p>
                  </Card>
                ) : (
                  <Card hover={false} className="border-warning-200 bg-warning-100 p-5 md:p-6">
                    <div className="mb-4">
                      <h2 className="text-gray-900">
                        À partir de 83 600 €, vous êtes au régime réel
                      </h2>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        Au-delà de {CLASSE_MICRO_BIC_THRESHOLD_2026.toLocaleString('fr-FR')} € de
                        chiffre d&apos;affaires sur deux années consécutives, votre meublé doit être
                        au régime réel. Le classement n&apos;apporte alors plus d&apos;avantage
                        fiscal ou social dans ce comparatif.
                      </p>
                      <p>
                        En revanche, ses autres avantages restent applicables, comme ceux liés à la
                        taxe de séjour.
                      </p>
                    </div>
                  </Card>
                )}

                <div className="mb-8 mt-8 rounded-card border border-primary-200 bg-primary-100 p-5 md:p-6">
                  <h2 className="mb-3">Le classement intervient aussi dans la taxe de séjour</h2>
                  <p className="mb-5 text-sm text-gray-700">
                    Au-delà de la fiscalité, le classement peut aussi modifier le mode de calcul de
                    la taxe de séjour d’un meublé.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button href="/simulateur-taxe-sejour" variant="primary">
                      Simulateur taxe de séjour
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
