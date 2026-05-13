import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Bath,
  BedDouble,
  ChefHat,
  CheckCircle2,
  ChevronDown,
  Computer,
  DoorOpen,
  Footprints,
  Loader2,
  Pencil,
  Plus,
  Ruler,
  Sofa,
  Toilet,
  Trash2,
  Trees,
  Tv,
  Utensils,
} from 'lucide-react';
import SimulationGridTab, {
  SimulationResultPanel,
  SimulationVerificationIssues,
  type SimulationGridProgressSummary,
  type SimulationResultState,
} from '../components/simulator/SimulationGridTab';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Tooltip from '../components/ui/Tooltip';
import { useToast } from '../components/ui/Toast';
import { getCriterionStatusForCategory, type GridSummary } from '../content/simulatorGrid';
import { exportSimulationClassementPdf } from '../utils/simulatorExport';
import {
  createPiece,
  deletePiece,
  getRapport,
  getSimulationGridModel,
  getPublicSimulation,
  getSimulationLogement,
  getVerification,
  SimulatorApiError,
  updateCapacity,
  updateFloor,
  updateHousingType,
  updatePiece,
  updateRequestedCategory,
  verifySimulation,
  type HousingType,
  type LogementDto,
  type PieceDto,
  type PieceType,
  type PublicSimulationDto,
  type ReponseDto,
  type RequestedCategory,
  type SimulationStatus,
} from '../utils/simulatorApi';
import {
  canPieceHaveSleepingCapacity,
  EXTERIOR_PIECE_TYPES,
  FLOOR_OPTIONS,
  formatFloor,
  formatHousingType,
  formatPieceType,
  formatRequestedCategory,
  HOUSING_TYPE_OPTIONS,
  INTERIOR_PIECE_TYPES,
  isHousingType,
  isRequestedCategory,
  isSimulationFloor,
  isExteriorPiece,
  REQUESTED_CATEGORY_OPTIONS,
} from '../utils/simulatorLabels';

type LoadStatus = 'loading' | 'success' | 'error';
type GridModelStatus = 'idle' | 'loading' | 'success' | 'error';
type ActiveTab = 'pieces' | 'grid' | 'result';
type ResultStatus = 'none' | 'fresh' | 'stale' | 'checking' | 'error';
type PiecePanelMode = 'closed' | 'create' | 'edit';
type PieceTypeScope = 'interior' | 'exterior';

interface PieceFormState {
  type: PieceType;
  surface: string;
  sleepingCapacity: string;
  hasExteriorOpening: boolean;
}

interface PieceFormErrors {
  surface?: string;
  sleepingCapacity?: string;
}

interface SimulationParametersForm {
  requestedCategory: RequestedCategory;
  capacity: string;
  housingType: HousingType;
  floor: string;
}

interface SimulationParametersErrors {
  capacity?: string;
}

interface PieceValidationIssue {
  message: string;
  blocking: boolean;
}

const DEFAULT_PIECE_FORM: PieceFormState = {
  type: 'CHAMBRE',
  surface: '',
  sleepingCapacity: '',
  hasExteriorOpening: true,
};

const DEFAULT_SIMULATION_PARAMETERS_FORM: SimulationParametersForm = {
  requestedCategory: '3*',
  capacity: '',
  housingType: 'INDIVIDUEL',
  floor: '0',
};

const PARAMETER_REFRESH_ERROR_MESSAGE =
  'Les paramètres ont été enregistrés, mais certaines données de la simulation n’ont pas pu être actualisées. Réessayez avant de consulter le résultat.';

function isPieceType(value: string): value is PieceType {
  return [...INTERIOR_PIECE_TYPES, ...EXTERIOR_PIECE_TYPES].includes(value as PieceType);
}

function createSimulationParametersForm(
  grille: PublicSimulationDto['grille'] | undefined
): SimulationParametersForm {
  const requestedCategory = grille?.categorie_demandee;
  const housingType = grille?.type_habitation;
  const floor = grille?.etage === undefined ? undefined : String(grille.etage);

  return {
    requestedCategory:
      requestedCategory && isRequestedCategory(requestedCategory) ? requestedCategory : '3*',
    capacity:
      typeof grille?.capacite_accueil === 'number' && Number.isFinite(grille.capacite_accueil)
        ? String(grille.capacite_accueil)
        : '',
    housingType: housingType && isHousingType(housingType) ? housingType : 'INDIVIDUEL',
    floor: floor && isSimulationFloor(floor) ? floor : '0',
  };
}

function parseCapacity(value: string): number | null {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function formatSurface(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return 'Surface non renseignée';
  }

  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m²`;
}

function formatPeopleCount(value: number): string {
  return `${value} ${value > 1 ? 'personnes' : 'personne'}`;
}

function formatSleepingCount(value: number): string {
  return `${value} ${value > 1 ? 'couchages' : 'couchage'}`;
}

function formatSurfaceCompact(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return 'surface non renseignée';
  }

  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m²`;
}

function getPieceDisplayName(piece: PieceDto): string {
  if (piece.type_piece === 'COULOIRS_ET_DEGAGEMENTS') {
    return formatPieceType(piece.type_piece);
  }

  const name = piece.nom?.trim();
  return name || formatPieceType(piece.type_piece);
}

const PIECE_TYPE_ICONS: Record<PieceType, typeof BedDouble> = {
  CUISINE: ChefHat,
  SEJOUR: Sofa,
  SALLE_A_MANGER: Utensils,
  SALON: Tv,
  CHAMBRE: BedDouble,
  BUREAU: Computer,
  CABINE: BedDouble,
  PIECE_SANS_OUVRANT: DoorOpen,
  COULOIRS_ET_DEGAGEMENTS: Footprints,
  SALLE_DE_BAIN: Bath,
  WC: Toilet,
  LOGGIA_BALCON_VERANDA: DoorOpen,
  TERRASSE_OU_JARDIN_PRIVE: Trees,
  PARC_OU_JARDIN: Trees,
};

const EXTERIOR_OPENING_PIECE_TYPES: PieceType[] = [
  'SEJOUR',
  'SALLE_A_MANGER',
  'SALON',
  'CHAMBRE',
  'BUREAU',
];
const PIECE_CAPACITY_EXCEEDED_MESSAGE =
  'Le nombre maximal de couchages autorisés dans cette pièce est dépassé. Supprimez des couchages.';
const SURFACE_BASE_BY_CATEGORY = {
  1: 7,
  2: 7,
  3: 7,
  4: 10,
  5: 12,
} as const;

type RequestedCategoryNumber = keyof typeof SURFACE_BASE_BY_CATEGORY;

function getTotalSleepingCapacity(pieces: PieceDto[]): number {
  return pieces.reduce((total, piece) => total + (getValidSleepingCapacity(piece) ?? 0), 0);
}

function getValidSleepingCapacity(piece: PieceDto): number | undefined {
  const sleepingCapacity = piece.nombre_lits;
  return typeof sleepingCapacity === 'number' && Number.isFinite(sleepingCapacity)
    ? sleepingCapacity
    : undefined;
}

function parseRequestedCategoryNumber(value: string | undefined): RequestedCategoryNumber | null {
  const normalizedValue = value?.trim().replace(/\*$/, '') ?? '';
  const numericValue = Number(normalizedValue);

  if (
    Number.isInteger(numericValue) &&
    numericValue >= 1 &&
    numericValue <= 5 &&
    numericValue in SURFACE_BASE_BY_CATEGORY
  ) {
    return numericValue as RequestedCategoryNumber;
  }

  return null;
}

function getPieceMinimumSurface(
  requestedCategory: RequestedCategoryNumber,
  sleepingCapacity: number
): number {
  return SURFACE_BASE_BY_CATEGORY[requestedCategory] + Math.max((sleepingCapacity - 2) * 3, 0);
}

function formatValidationSurface(value: number): string {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

function getSurfaceValidationMessage(surfaceMinimum: number, sleepingCapacity: number): string {
  return `Cette pièce doit avoir une surface d’au moins ${formatValidationSurface(surfaceMinimum)} m² pour ${sleepingCapacity} couchages. Supprimez des couchages ou bien le critère n°1 sera invalidé.`;
}

function getFrontPieceValidationIssue({
  surface,
  sleepingCapacity,
  requestedCategory,
}: {
  surface: number | undefined;
  sleepingCapacity: number | undefined;
  requestedCategory: string | undefined;
}): PieceValidationIssue | null {
  const parsedCategory = parseRequestedCategoryNumber(requestedCategory);
  if (!parsedCategory || sleepingCapacity === undefined || sleepingCapacity <= 0) {
    return null;
  }

  const maximumSleepingCapacity = parsedCategory === 5 ? 3 : 4;
  if (sleepingCapacity > maximumSleepingCapacity) {
    return {
      message: PIECE_CAPACITY_EXCEEDED_MESSAGE,
      blocking: true,
    };
  }

  if (surface === undefined || surface <= 0) {
    return null;
  }

  const surfaceMinimum = getPieceMinimumSurface(parsedCategory, sleepingCapacity);
  if (surface < surfaceMinimum) {
    return {
      message: getSurfaceValidationMessage(surfaceMinimum, sleepingCapacity),
      blocking: false,
    };
  }

  return null;
}

function parsePositiveFiniteNumber(value: string): number | undefined {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}

function parsePositiveInteger(value: string): number | undefined {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}

function canPieceHaveExteriorOpening(value: PieceType): boolean {
  return EXTERIOR_OPENING_PIECE_TYPES.includes(value);
}

function getPieceCompletionWarnings({
  pieces,
  totalSleepingCapacity,
  requestedCapacity,
}: {
  pieces: PieceDto[];
  totalSleepingCapacity: number;
  requestedCapacity: number | undefined;
}): string[] {
  const warnings: string[] = [];

  if (pieces.length === 0) {
    warnings.push('Aucune pièce n’a encore été ajoutée.');
  }

  if (totalSleepingCapacity <= 0) {
    warnings.push('Aucun couchage n’est renseigné.');
  }

  if (
    typeof requestedCapacity === 'number' &&
    Number.isFinite(requestedCapacity) &&
    requestedCapacity > 0 &&
    totalSleepingCapacity > 0 &&
    totalSleepingCapacity < requestedCapacity
  ) {
    warnings.push(
      `Les couchages renseignés (${totalSleepingCapacity}) sont inférieurs à la capacité d’accueil (${requestedCapacity}).`
    );
  }

  if (!pieces.some((piece) => piece.type_piece === 'SALLE_DE_BAIN')) {
    warnings.push('Aucune salle de bain n’est renseignée.');
  }

  return warnings;
}

function buildGridProgressSummary(
  grid: GridSummary | null,
  responses: ReponseDto[],
  requestedCategory: string | undefined
): SimulationGridProgressSummary {
  if (!grid) {
    return {
      answeredCount: 0,
      totalCount: 0,
      remainingCount: 0,
      missingMandatoryCount: 0,
    };
  }

  const responsesByCriterionNumber = new Map(
    responses
      .filter(
        (response): response is ReponseDto & { num_critere: number } =>
          typeof response.num_critere === 'number'
      )
      .map((response) => [response.num_critere, response])
  );

  let totalCount = 0;
  let answeredCount = 0;
  let missingMandatoryCount = 0;

  grid.criteriaByNumber.forEach((criterion) => {
    const response = responsesByCriterionNumber.get(criterion.num_critere);
    const status =
      response?.statut_critere ?? getCriterionStatusForCategory(criterion, requestedCategory);

    if (status === 'NON_APPLICABLE') {
      return;
    }

    totalCount += 1;
    if (isAnsweredResponse(response)) {
      answeredCount += 1;
      return;
    }

    if (status === 'OBLIGATOIRE' || status === 'ONC') {
      missingMandatoryCount += 1;
    }
  });

  return {
    answeredCount,
    totalCount,
    remainingCount: Math.max(totalCount - answeredCount, 0),
    missingMandatoryCount,
  };
}

function isAnsweredResponse(response: ReponseDto | undefined): boolean {
  return (
    response?.statut_validation === 'VALIDE' ||
    response?.statut_validation === 'NON_VALIDE' ||
    response?.statut_validation === 'NON_APPLICABLE'
  );
}

function getResultStatusLabel(
  status: ResultStatus,
  resultState: SimulationResultState | null
): string {
  if (status === 'checking') {
    return 'Calcul en cours';
  }

  if (status === 'error') {
    return 'Erreur de calcul';
  }

  if (status === 'stale') {
    return 'À recalculer';
  }

  if (status === 'fresh') {
    if (resultState?.kind === 'rapport' && resultState.rapport.resultat === true) {
      return 'Classement atteint';
    }

    return 'Calcul à jour';
  }

  return 'Aucun résultat';
}

function getSimulationStatusFromResult(result: SimulationResultState): SimulationStatus {
  if (result.kind === 'verification') {
    return 'A_COMPLETER';
  }

  return result.rapport.resultat === true ? 'FAVORABLE' : 'DEFAVORABLE';
}

function buildPiecePayload(form: PieceFormState, existingPiece?: PieceDto): PieceDto {
  const payload: PieceDto = existingPiece
    ? {
        type_piece: form.type,
        surface: Number(form.surface),
        prise: existingPiece.prise ?? false,
        ventilation: existingPiece.ventilation ?? false,
        type_literie: existingPiece.type_literie ?? null,
        format_lits: existingPiece.format_lits ?? null,
        literie: existingPiece.literie ?? false,
      }
    : {
        type_piece: form.type,
        surface: Number(form.surface),
      };

  if (existingPiece?.nom !== undefined) {
    payload.nom = existingPiece.nom;
  }

  if (canPieceHaveSleepingCapacity(form.type) && form.sleepingCapacity.trim()) {
    // Le backend porte actuellement les couchages renseignés dans nombre_lits.
    payload.nombre_lits = Number(form.sleepingCapacity);
    payload.literie = true;
  } else if (existingPiece && canPieceHaveSleepingCapacity(form.type)) {
    payload.nombre_lits = null;
  }

  if (canPieceHaveExteriorOpening(form.type)) {
    payload.ouvrant = form.hasExteriorOpening;
  }

  return payload;
}

function createFormFromPiece(piece: PieceDto): PieceFormState {
  return {
    type: piece.type_piece,
    surface: piece.surface === undefined ? '' : String(piece.surface),
    sleepingCapacity:
      getValidSleepingCapacity(piece) === undefined ? '' : String(getValidSleepingCapacity(piece)),
    hasExteriorOpening: piece.ouvrant ?? true,
  };
}

function getBackendPieceValidationIssue(piece: PieceDto): PieceValidationIssue | null {
  if (piece.capacite_lits_atteinte === true) {
    return {
      message: PIECE_CAPACITY_EXCEEDED_MESSAGE,
      blocking: true,
    };
  }

  if (piece.surface_minimum_atteinte === false) {
    const surfaceMinimum = piece.surface_minimum ?? 0;
    const sleepingCapacity = piece.nombre_lits ?? 0;
    return {
      message: getSurfaceValidationMessage(surfaceMinimum, sleepingCapacity),
      blocking: false,
    };
  }

  return null;
}

function getPieceValidationIssue(
  piece: PieceDto,
  requestedCategory: string | undefined
): PieceValidationIssue | null {
  const frontIssue = getFrontPieceValidationIssue({
    surface: piece.surface,
    sleepingCapacity: getValidSleepingCapacity(piece),
    requestedCategory,
  });

  if (frontIssue || parseRequestedCategoryNumber(requestedCategory)) {
    return frontIssue;
  }

  return getBackendPieceValidationIssue(piece);
}

function getPieceFormValidationIssue(
  form: PieceFormState,
  requestedCategory: string | undefined
): PieceValidationIssue | null {
  if (
    !canPieceHaveSleepingCapacity(form.type) ||
    !form.surface.trim() ||
    !form.sleepingCapacity.trim()
  ) {
    return null;
  }

  return getFrontPieceValidationIssue({
    surface: parsePositiveFiniteNumber(form.surface),
    sleepingCapacity: parsePositiveInteger(form.sleepingCapacity),
    requestedCategory,
  });
}

function PieceTypeSelect({
  value,
  options,
  groupLabel,
  onChange,
}: {
  value: PieceType;
  options: PieceType[];
  groupLabel: string;
  onChange: (value: PieceType) => void;
}) {
  return (
    <div className="w-full">
      <label htmlFor="pieceType" className="mb-2 block text-sm font-medium text-gray-700">
        Type de pièce
      </label>
      <div className="relative">
        <select
          id="pieceType"
          name="pieceType"
          value={value}
          onChange={(event) => {
            if (isPieceType(event.target.value)) {
              onChange(event.target.value);
            }
          }}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <optgroup label={groupLabel}>
            {options.map((pieceType) => (
              <option key={pieceType} value={pieceType}>
                {formatPieceType(pieceType)}
              </option>
            ))}
          </optgroup>
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}

function SimulationGridModelState({
  status,
  onRetry,
}: {
  status: GridModelStatus;
  onRetry: () => void;
}) {
  if (status === 'loading' || status === 'idle') {
    return (
      <Card hover={false} className="p-5 md:p-6">
        <p className="text-sm text-gray-700">Chargement de la grille de contrôle...</p>
      </Card>
    );
  }

  return (
    <Card hover={false} className="border-alert-200 bg-alert-100 p-5 md:p-6">
      <h2 className="mb-3 text-gray-900">Grille de contrôle indisponible</h2>
      <p className="mb-5 text-sm text-alert-500">
        Impossible de charger la grille de contrôle pour le moment.
      </p>
      <Button type="button" variant="secondary" onClick={onRetry}>
        Réessayer
      </Button>
    </Card>
  );
}

export default function SimulationClassement() {
  const { simulationId } = useParams<{ simulationId: string }>();
  const { showToast } = useToast();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [simulation, setSimulation] = useState<PublicSimulationDto | null>(null);
  const [logement, setLogement] = useState<LogementDto | null>(null);
  const [gridModelStatus, setGridModelStatus] = useState<GridModelStatus>('idle');
  const [gridSummary, setGridSummary] = useState<GridSummary | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('pieces');
  const [piecePanelMode, setPiecePanelMode] = useState<PiecePanelMode>('closed');
  const [pieceTypeScope, setPieceTypeScope] = useState<PieceTypeScope>('interior');
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [pieceForm, setPieceForm] = useState<PieceFormState>(DEFAULT_PIECE_FORM);
  const [pieceFormErrors, setPieceFormErrors] = useState<PieceFormErrors>({});
  const [parameterForm, setParameterForm] = useState<SimulationParametersForm>(
    DEFAULT_SIMULATION_PARAMETERS_FORM
  );
  const [parameterErrors, setParameterErrors] = useState<SimulationParametersErrors>({});
  const [isSavingParameters, setIsSavingParameters] = useState(false);
  const [isSavingPiece, setIsSavingPiece] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingPieceId, setDeletingPieceId] = useState<string | null>(null);
  const [resultState, setResultState] = useState<SimulationResultState | null>(null);
  const [resultStatus, setResultStatus] = useState<ResultStatus>('none');
  const [resultErrorMessage, setResultErrorMessage] = useState<string | null>(null);
  const [isAutoRecalculatingResult, setIsAutoRecalculatingResult] = useState(false);
  const [areParametersExpanded, setAreParametersExpanded] = useState(false);
  const [criterionFilterNumbers, setCriterionFilterNumbers] = useState<number[]>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const latestParameterSaveRequestIdRef = useRef(0);

  const loadSimulation = useCallback(async () => {
    if (!simulationId) {
      setLoadStatus('error');
      return;
    }

    setLoadStatus('loading');
    setResultState(null);
    setResultStatus('none');
    setResultErrorMessage(null);
    setIsAutoRecalculatingResult(false);

    let nextSimulation: PublicSimulationDto;
    let nextLogement: LogementDto;
    try {
      [nextSimulation, nextLogement] = await Promise.all([
        getPublicSimulation(simulationId),
        getSimulationLogement(simulationId),
      ]);
    } catch {
      setSimulation(null);
      setLogement(null);
      setLoadStatus('error');
      return;
    }

    setSimulation(nextSimulation);
    setLogement(nextLogement);

    try {
      if (nextSimulation.statut === 'FAVORABLE' || nextSimulation.statut === 'DEFAVORABLE') {
        const rapport = await getRapport(simulationId);
        setResultState({ kind: 'rapport', rapport });
        setResultStatus('fresh');
      } else if (nextSimulation.statut === 'A_COMPLETER') {
        const verification = await getVerification(simulationId);
        setResultState({ kind: 'verification', verification });
        setResultStatus('fresh');
      } else if (nextSimulation.statut === 'A_RECALCULER') {
        setResultStatus('stale');
      }
    } catch {
      setResultStatus('error');
      setResultErrorMessage(
        'Le résultat enregistré n’a pas pu être chargé pour le moment. Veuillez réessayer.'
      );
    } finally {
      setLoadStatus('success');
    }
  }, [simulationId]);

  const loadGridModel = useCallback(async () => {
    setGridModelStatus('loading');

    try {
      const nextGridSummary = await getSimulationGridModel();
      setGridSummary(nextGridSummary);
      setGridModelStatus('success');
    } catch {
      setGridSummary(null);
      setGridModelStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadSimulation();
  }, [loadSimulation]);

  useEffect(() => {
    if (loadStatus === 'success' && gridModelStatus === 'idle') {
      void loadGridModel();
    }
  }, [gridModelStatus, loadGridModel, loadStatus]);

  const pieces = useMemo(() => logement?.pieces ?? [], [logement?.pieces]);
  const interiorPieces = useMemo(
    () => pieces.filter((piece) => !isExteriorPiece(piece.type_piece)),
    [pieces]
  );
  const exteriorPieces = useMemo(
    () => pieces.filter((piece) => isExteriorPiece(piece.type_piece)),
    [pieces]
  );
  const totalSleepingCapacity = useMemo(() => getTotalSleepingCapacity(pieces), [pieces]);
  const activePieceSupportsSleepingCapacity = canPieceHaveSleepingCapacity(pieceForm.type);
  const activePieceCanHaveExteriorOpening = canPieceHaveExteriorOpening(pieceForm.type);
  const grille = simulation?.grille;
  const hasSimulationResult = resultState !== null || resultStatus === 'stale';
  const isCheckingResult = resultStatus === 'checking';
  const resultActionLabel = hasSimulationResult
    ? 'Relancer la simulation'
    : 'Voir le résultat de ma simulation';
  const resultStatusLabel = getResultStatusLabel(resultStatus, resultState);
  const isResultBusinessSuccess =
    resultStatus === 'fresh' &&
    resultState?.kind === 'rapport' &&
    resultState.rapport.resultat === true;
  const isResultCalculatedWithoutSuccess =
    resultStatus === 'fresh' &&
    !(resultState?.kind === 'rapport' && resultState.rapport.resultat === true);
  const gridProgressSummary = useMemo(
    () => buildGridProgressSummary(gridSummary, grille?.reponses ?? [], grille?.categorie_demandee),
    [gridSummary, grille?.categorie_demandee, grille?.reponses]
  );
  const gridStepSummary =
    gridModelStatus === 'success'
      ? `${gridProgressSummary.answeredCount} critères sur ${gridProgressSummary.totalCount} renseignés`
      : gridModelStatus === 'error'
        ? 'Critères indisponibles'
        : 'Chargement des critères...';
  const pieceCompletionWarnings = useMemo(
    () =>
      getPieceCompletionWarnings({
        pieces,
        totalSleepingCapacity,
        requestedCapacity: grille?.capacite_accueil,
      }),
    [grille?.capacite_accueil, pieces, totalSleepingCapacity]
  );
  const parametersSummary = [
    formatRequestedCategory(grille?.categorie_demandee),
    grille?.capacite_accueil
      ? formatPeopleCount(grille.capacite_accueil)
      : 'Capacité non renseignée',
    formatHousingType(grille?.type_habitation),
    formatFloor(grille?.etage),
  ].join(' · ');

  useEffect(() => {
    if (isSavingParameters) {
      return;
    }

    setParameterForm(createSimulationParametersForm(grille));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    grille?.capacite_accueil,
    grille?.categorie_demandee,
    grille?.etage,
    grille?.type_habitation,
    isSavingParameters,
  ]);

  async function handleExportPdf() {
    if (
      !simulationId ||
      resultStatus !== 'fresh' ||
      !gridSummary ||
      resultState?.kind !== 'rapport'
    ) {
      showToast('Aucun résultat à exporter.', { type: 'info' });
      return;
    }

    try {
      await exportSimulationClassementPdf({
        grid: gridSummary,
        rapport: resultState.rapport,
        grille,
        logement,
        totalSleepingCapacity,
        generatedAt: new Date(),
        simulationId,
      });
      showToast('PDF généré.', { type: 'success' });
    } catch {
      showToast('Impossible de générer le PDF.', { type: 'error' });
    }
  }

  const pieceValidationIssue = useMemo(
    () => getPieceFormValidationIssue(pieceForm, grille?.categorie_demandee),
    [grille?.categorie_demandee, pieceForm]
  );
  const editingPiece = useMemo(
    () => pieces.find((piece) => piece.id === editingPieceId),
    [editingPieceId, pieces]
  );
  const hasCorridorsPiece = useMemo(
    () => pieces.some((piece) => piece.type_piece === 'COULOIRS_ET_DEGAGEMENTS'),
    [pieces]
  );
  const existingExteriorPieceTypes = useMemo(
    () => new Set(exteriorPieces.map((piece) => piece.type_piece)),
    [exteriorPieces]
  );
  const selectableInteriorPieceTypes = useMemo(
    () =>
      INTERIOR_PIECE_TYPES.filter((pieceType) => {
        if (pieceType === 'CABINE') {
          return false;
        }

        if (pieceType !== 'COULOIRS_ET_DEGAGEMENTS') {
          return true;
        }

        return !hasCorridorsPiece || editingPiece?.type_piece === 'COULOIRS_ET_DEGAGEMENTS';
      }),
    [editingPiece?.type_piece, hasCorridorsPiece]
  );
  const availableExteriorPieceTypesForCreation = useMemo(
    () => EXTERIOR_PIECE_TYPES.filter((pieceType) => !existingExteriorPieceTypes.has(pieceType)),
    [existingExteriorPieceTypes]
  );
  const selectableExteriorPieceTypes = useMemo(
    () =>
      EXTERIOR_PIECE_TYPES.filter(
        (pieceType) =>
          !existingExteriorPieceTypes.has(pieceType) || editingPiece?.type_piece === pieceType
      ),
    [editingPiece?.type_piece, existingExteriorPieceTypes]
  );
  const selectablePieceTypes =
    pieceTypeScope === 'interior' ? selectableInteriorPieceTypes : selectableExteriorPieceTypes;
  const selectablePieceTypeGroupLabel =
    pieceTypeScope === 'interior' ? 'Pièces intérieures' : 'Espaces extérieurs';
  const exteriorCreateDefaultType = availableExteriorPieceTypesForCreation.includes(
    'TERRASSE_OU_JARDIN_PRIVE'
  )
    ? 'TERRASSE_OU_JARDIN_PRIVE'
    : (availableExteriorPieceTypesForCreation[0] ?? 'TERRASSE_OU_JARDIN_PRIVE');

  useEffect(() => {
    if (piecePanelMode === 'closed') {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscapeKey(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setPiecePanelMode('closed');
        setPieceTypeScope('interior');
        setEditingPieceId(null);
        setPieceForm(DEFAULT_PIECE_FORM);
        setPieceFormErrors({});
      }
    }

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [piecePanelMode]);

  function resetPiecePanel() {
    setPiecePanelMode('closed');
    setPieceTypeScope('interior');
    setEditingPieceId(null);
    setPieceForm(DEFAULT_PIECE_FORM);
    setPieceFormErrors({});
  }

  function openCreatePanel(
    defaultType: PieceType = DEFAULT_PIECE_FORM.type,
    scope: PieceTypeScope = 'interior'
  ) {
    setConfirmingDeleteId(null);
    setPiecePanelMode('create');
    setPieceTypeScope(scope);
    setEditingPieceId(null);
    setPieceForm({ ...DEFAULT_PIECE_FORM, type: defaultType });
    setPieceFormErrors({});
  }

  function openEditPanel(piece: PieceDto) {
    if (!piece.id) {
      showToast('Cette pièce ne peut pas être modifiée pour le moment.', { type: 'error' });
      return;
    }

    setConfirmingDeleteId(null);
    setPiecePanelMode('edit');
    setPieceTypeScope(isExteriorPiece(piece.type_piece) ? 'exterior' : 'interior');
    setEditingPieceId(piece.id);
    setPieceForm(createFormFromPiece(piece));
    setPieceFormErrors({});
  }

  function validatePieceForm(): boolean {
    const nextErrors: PieceFormErrors = {};
    const parsedSurface = Number(pieceForm.surface);
    const parsedSleepingCapacity = Number(pieceForm.sleepingCapacity);

    if (!Number.isFinite(parsedSurface) || parsedSurface <= 0) {
      nextErrors.surface = 'Indiquez une surface valide.';
    }

    if (
      activePieceSupportsSleepingCapacity &&
      pieceForm.sleepingCapacity.trim() &&
      (!Number.isInteger(parsedSleepingCapacity) || parsedSleepingCapacity <= 0)
    ) {
      nextErrors.sleepingCapacity = 'Indiquez un nombre de personnes valide.';
    }

    setPieceFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function markResultStale({
    clearCriterionFilter = true,
  }: { clearCriterionFilter?: boolean } = {}) {
    setResultErrorMessage(null);
    setIsAutoRecalculatingResult(false);
    if (clearCriterionFilter) {
      setCriterionFilterNumbers([]);
    }
    if (resultState || resultStatus === 'fresh' || resultStatus === 'stale') {
      setSimulation((currentSimulation) =>
        currentSimulation ? { ...currentSimulation, statut: 'A_RECALCULER' } : currentSimulation
      );
    }
    setResultStatus((currentStatus) => {
      if (resultState || currentStatus === 'fresh' || currentStatus === 'stale') {
        return 'stale';
      }

      return 'none';
    });
  }

  function showSimulationResult(result: SimulationResultState) {
    setResultState(result);
    setResultStatus('fresh');
    setResultErrorMessage(null);
    setIsAutoRecalculatingResult(false);
    setCriterionFilterNumbers([]);
    setSimulation((currentSimulation) =>
      currentSimulation
        ? { ...currentSimulation, statut: getSimulationStatusFromResult(result) }
        : currentSimulation
    );
    setActiveTab('result');
    window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Certains environnements de test ne prennent pas en charge window.scrollTo.
      }
    });
  }

  function showCriteriaInGrid(numbers: number[]) {
    setCriterionFilterNumbers([...new Set(numbers)].sort((first, second) => first - second));
    setActiveTab('grid');
    window.setTimeout(() => {
      document.getElementById('grid-criteria-start')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  function returnToFullGrid() {
    setCriterionFilterNumbers([]);
    setActiveTab('grid');
  }

  async function runSimulationCheck({ parameterRequestId }: { parameterRequestId?: number } = {}) {
    if (!simulationId) {
      return;
    }

    const isCurrentParameterRequest = () =>
      parameterRequestId === undefined ||
      latestParameterSaveRequestIdRef.current === parameterRequestId;

    if (parameterRequestId === undefined) {
      setIsAutoRecalculatingResult(false);
    }
    setResultStatus('checking');
    setResultErrorMessage(null);

    let didAttemptGridLoad = false;

    try {
      if (gridModelStatus !== 'success') {
        didAttemptGridLoad = true;
        setGridModelStatus('loading');
        const nextGridSummary = await getSimulationGridModel();
        if (!isCurrentParameterRequest()) {
          return;
        }
        setGridSummary(nextGridSummary);
        setGridModelStatus('success');
        didAttemptGridLoad = false;
      }

      const isValid = await verifySimulation(simulationId);
      if (!isCurrentParameterRequest()) {
        return;
      }
      if (!isValid) {
        const verification = await getVerification(simulationId);
        if (!isCurrentParameterRequest()) {
          return;
        }
        showSimulationResult({
          kind: 'verification',
          verification,
        });
        return;
      }

      const rapport = await getRapport(simulationId);
      if (!isCurrentParameterRequest()) {
        return;
      }
      showSimulationResult({
        kind: 'rapport',
        rapport,
      });
    } catch {
      if (!isCurrentParameterRequest()) {
        return;
      }
      setResultStatus('error');
      setIsAutoRecalculatingResult(false);
      if (didAttemptGridLoad) {
        setGridSummary(null);
        setGridModelStatus('error');
      }
      setResultErrorMessage(
        'Le résultat n’a pas pu être calculé pour le moment. Vérifiez votre connexion puis réessayez.'
      );
    }
  }

  async function applyParameterMutation(
    mutation: () => Promise<PublicSimulationDto>,
    {
      autoRecalculateResult = false,
    }: {
      autoRecalculateResult?: boolean;
    } = {}
  ): Promise<void> {
    if (!simulationId) {
      return;
    }

    const requestId = latestParameterSaveRequestIdRef.current + 1;
    latestParameterSaveRequestIdRef.current = requestId;
    const previousResultStatus = resultStatus;

    setIsSavingParameters(true);
    setParameterErrors({});
    if (autoRecalculateResult) {
      setIsAutoRecalculatingResult(true);
      setResultStatus('checking');
      setResultErrorMessage(null);
    }
    showToast('Enregistrement des paramètres...', { type: 'info', durationMs: 1500 });

    let hasCommittedParameter = false;

    try {
      const nextSimulation = await mutation();
      if (latestParameterSaveRequestIdRef.current !== requestId) {
        return;
      }

      hasCommittedParameter = true;
      setSimulation(nextSimulation);
      setParameterForm(createSimulationParametersForm(nextSimulation.grille));

      const nextLogement = await getSimulationLogement(simulationId);
      if (latestParameterSaveRequestIdRef.current !== requestId) {
        return;
      }

      setLogement(nextLogement);
      if (autoRecalculateResult) {
        showToast('Les paramètres ont été enregistrés.', { type: 'success' });
        await runSimulationCheck({ parameterRequestId: requestId });
        return;
      }

      markResultStale();
      showToast('Les paramètres ont été enregistrés.', { type: 'success' });
    } catch {
      if (latestParameterSaveRequestIdRef.current !== requestId) {
        return;
      }

      if (hasCommittedParameter) {
        markResultStale();
        showToast(PARAMETER_REFRESH_ERROR_MESSAGE, { type: 'error' });
        return;
      }

      if (autoRecalculateResult) {
        setIsAutoRecalculatingResult(false);
        setResultStatus(previousResultStatus);
      }
      setParameterForm(createSimulationParametersForm(grille));
      showToast('Les paramètres n’ont pas pu être enregistrés. Veuillez réessayer.', {
        type: 'error',
      });
    } finally {
      if (latestParameterSaveRequestIdRef.current === requestId) {
        setIsSavingParameters(false);
      }
    }
  }

  function handleRequestedCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextCategory = event.target.value;
    if (!isRequestedCategory(nextCategory)) {
      return;
    }

    setParameterForm((currentForm) => ({ ...currentForm, requestedCategory: nextCategory }));

    if (nextCategory === grille?.categorie_demandee) {
      return;
    }

    void applyParameterMutation(() => updateRequestedCategory(simulationId ?? '', nextCategory), {
      autoRecalculateResult: activeTab === 'result',
    });
  }

  function handleHousingTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextHousingType = event.target.value;
    if (!isHousingType(nextHousingType)) {
      return;
    }

    setParameterForm((currentForm) => ({ ...currentForm, housingType: nextHousingType }));

    if (nextHousingType === grille?.type_habitation) {
      return;
    }

    void applyParameterMutation(() => updateHousingType(simulationId ?? '', nextHousingType), {
      autoRecalculateResult: activeTab === 'result',
    });
  }

  function handleFloorChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextFloor = event.target.value;
    if (!isSimulationFloor(nextFloor)) {
      return;
    }

    setParameterForm((currentForm) => ({ ...currentForm, floor: nextFloor }));

    const parsedFloor = Number(nextFloor);
    if (parsedFloor === grille?.etage) {
      return;
    }

    void applyParameterMutation(() => updateFloor(simulationId ?? '', parsedFloor), {
      autoRecalculateResult: activeTab === 'result',
    });
  }

  function handleCapacityChange(event: ChangeEvent<HTMLInputElement>) {
    setParameterForm((currentForm) => ({ ...currentForm, capacity: event.target.value }));
    setParameterErrors({});
  }

  function handleCapacityBlur() {
    const parsedCapacity = parseCapacity(parameterForm.capacity);

    if (parsedCapacity === null) {
      setParameterErrors({ capacity: 'Indiquez une capacité d’accueil valide.' });
      showToast('La capacité d’accueil doit être un nombre entier positif.', { type: 'error' });
      return;
    }

    setParameterForm((currentForm) => ({ ...currentForm, capacity: String(parsedCapacity) }));
    setParameterErrors({});

    if (parsedCapacity === grille?.capacite_accueil) {
      return;
    }

    void applyParameterMutation(() => updateCapacity(simulationId ?? '', parsedCapacity), {
      autoRecalculateResult: activeTab === 'result',
    });
  }

  async function applyPieceMutationResult(nextLogement: LogementDto): Promise<boolean> {
    setLogement(nextLogement);
    markResultStale();

    if (!simulationId) {
      return false;
    }

    try {
      const nextSimulation = await getPublicSimulation(simulationId);
      setSimulation(nextSimulation);
      return true;
    } catch {
      return false;
    }
  }

  async function handlePieceFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!simulationId || !validatePieceForm()) {
      return;
    }

    if (pieceValidationIssue?.blocking) {
      return;
    }

    setIsSavingPiece(true);

    try {
      const isEditingPiece = piecePanelMode === 'edit' && editingPieceId;
      const payload = buildPiecePayload(pieceForm, isEditingPiece ? editingPiece : undefined);
      const nextLogement = isEditingPiece
        ? await updatePiece(simulationId, editingPieceId, payload)
        : await createPiece(simulationId, payload);
      const hasRefreshedSimulation = await applyPieceMutationResult(nextLogement);
      resetPiecePanel();

      if (!hasRefreshedSimulation) {
        showToast(
          'La pièce a été enregistrée, mais la grille de contrôle n’a pas pu être actualisée. Réessayez avant de consulter le résultat.',
          { type: 'error' }
        );
        return;
      }

      showToast(
        piecePanelMode === 'edit' ? 'La pièce a été modifiée.' : 'La pièce a été ajoutée.',
        {
          type: 'success',
        }
      );
    } catch (error) {
      showToast(
        error instanceof SimulatorApiError && error.status === 409
          ? 'Une pièce similaire existe déjà ou les informations envoyées sont incomplètes.'
          : 'La pièce n’a pas pu être enregistrée. Veuillez réessayer.',
        { type: 'error' }
      );
    } finally {
      setIsSavingPiece(false);
    }
  }

  async function handleDeletePiece(piece: PieceDto) {
    if (!simulationId || !piece.id) {
      showToast('Cette pièce ne peut pas être supprimée pour le moment.', { type: 'error' });
      return;
    }

    setDeletingPieceId(piece.id);

    try {
      const nextLogement = await deletePiece(simulationId, piece.id);
      const hasRefreshedSimulation = await applyPieceMutationResult(nextLogement);
      setConfirmingDeleteId(null);
      if (editingPieceId === piece.id) {
        resetPiecePanel();
      }

      if (!hasRefreshedSimulation) {
        showToast(
          'La pièce a été supprimée, mais la grille de contrôle n’a pas pu être actualisée. Réessayez avant de consulter le résultat.',
          { type: 'error' }
        );
        return;
      }

      showToast('La pièce a été supprimée.', { type: 'success' });
    } catch {
      showToast(
        'Cette pièce n’a pas pu être supprimée. Elle est peut-être nécessaire à la simulation.',
        { type: 'error' }
      );
    } finally {
      setDeletingPieceId(null);
    }
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabId: ActiveTab) {
    const enabledTabs: ActiveTab[] = ['pieces', 'grid', 'result'];
    const currentIndex = enabledTabs.indexOf(tabId);
    if (currentIndex < 0) {
      return;
    }

    const lastIndex = enabledTabs.length - 1;
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = enabledTabs[nextIndex] ?? 'pieces';
    const nextTabRefIndex = ['pieces', 'grid', 'result'].indexOf(nextTab);
    setActiveTab(nextTab);
    tabRefs.current[nextTabRefIndex]?.focus();
  }

  function handleGoToGrid() {
    setActiveTab('grid');
  }

  function handleResponseSaved(savedResponse: ReponseDto) {
    markResultStale({ clearCriterionFilter: false });
    setSimulation((currentSimulation) => {
      if (!currentSimulation?.grille || savedResponse.num_critere === undefined) {
        return currentSimulation;
      }

      const currentResponses = currentSimulation.grille.reponses ?? [];
      const responseIndex = currentResponses.findIndex(
        (response) => response.num_critere === savedResponse.num_critere
      );
      const nextResponses =
        responseIndex >= 0
          ? currentResponses.map((response, index) =>
              index === responseIndex ? savedResponse : response
            )
          : [...currentResponses, savedResponse];

      return {
        ...currentSimulation,
        grille: {
          ...currentSimulation.grille,
          reponses: nextResponses,
        },
      };
    });
  }

  function updatePieceFormField<K extends keyof PieceFormState>(
    field: K,
    value: PieceFormState[K]
  ) {
    setPieceForm((current) => {
      if (field === 'type' && !canPieceHaveSleepingCapacity(value as PieceType)) {
        return { ...current, [field]: value, sleepingCapacity: '' };
      }

      return { ...current, [field]: value };
    });
    setPieceFormErrors({});
  }

  function renderPieceCard(piece: PieceDto) {
    const supportsSleepingCapacity = canPieceHaveSleepingCapacity(piece.type_piece);
    const isConfirmingDelete = confirmingDeleteId === piece.id;
    const canUpdatePiece = Boolean(piece.id);
    const pieceDisplayName = getPieceDisplayName(piece);
    const PieceIcon = PIECE_TYPE_ICONS[piece.type_piece];
    const sleepingCapacity = getValidSleepingCapacity(piece);
    const validationIssue = getPieceValidationIssue(piece, grille?.categorie_demandee);

    return (
      <div
        key={piece.id ?? `${piece.type_piece}-${piece.nom ?? piece.surface}`}
        className="flex h-full min-h-52 flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-card"
        data-testid={piece.id ? `piece-card-${piece.id}` : undefined}
      >
        <div className="min-w-0 space-y-3">
          <h4 className="flex min-h-[2.75rem] items-start gap-2 text-sm font-semibold leading-snug text-gray-900">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-500">
              <PieceIcon aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="line-clamp-2 min-w-0">{pieceDisplayName}</span>
            {validationIssue && (
              <Tooltip
                srLabel={`Alerte sur ${pieceDisplayName}`}
                placement="top"
                className="ml-auto mt-0.5 shrink-0"
                triggerClassName="h-6 w-6 border-alert-200 bg-alert-100 text-alert-400"
                trigger={<AlertCircle aria-hidden="true" className="h-4 w-4" />}
              >
                {validationIssue.message}
              </Tooltip>
            )}
          </h4>

          <dl className="space-y-2 rounded-md bg-gray-50 p-3 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-primary-500">
                <Ruler aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <dt className="font-medium text-gray-900">Surface</dt>
                <dd>{formatSurface(piece.surface)}</dd>
              </div>
            </div>
            {supportsSleepingCapacity && sleepingCapacity !== undefined && (
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-primary-500">
                  <BedDouble aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <dt className="font-medium text-gray-900">Couchages</dt>
                  <dd>{formatPeopleCount(sleepingCapacity)}</dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        {isConfirmingDelete ? (
          <div className="mt-3 space-y-2 rounded-md border border-alert-200 bg-alert-100 p-2">
            <p className="text-xs font-medium text-alert-500">Confirmer la suppression ?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
                onClick={() => setConfirmingDeleteId(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-alert-200 bg-white px-2 py-1.5 text-xs font-medium text-alert-500 transition-colors hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2"
                disabled={deletingPieceId === piece.id}
                onClick={() => void handleDeletePiece(piece)}
              >
                {deletingPieceId === piece.id ? '...' : 'Supprimer'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-end gap-1">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Modifier ${pieceDisplayName}`}
              disabled={!canUpdatePiece}
              onClick={() => openEditPanel(piece)}
            >
              <Pencil aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-alert-100 hover:text-alert-500 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Supprimer ${pieceDisplayName}`}
              disabled={!canUpdatePiece}
              onClick={() => {
                setPiecePanelMode('closed');
                setEditingPieceId(null);
                setConfirmingDeleteId(piece.id ?? null);
              }}
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderAddPieceChip(label: string, defaultType: PieceType, scope: PieceTypeScope) {
    const ariaLabel = scope === 'interior' ? `${label} intérieure` : label;

    return (
      <button
        type="button"
        className="flex h-full min-h-52 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary-200 bg-primary-100 p-4 text-primary-500 transition-colors hover:border-primary-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        aria-label={ariaLabel}
        onClick={() => openCreatePanel(defaultType, scope)}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 bg-white">
          <Plus aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="text-center text-sm font-semibold">{label}</span>
      </button>
    );
  }

  function renderPieceGrid(
    piecesToRender: PieceDto[],
    addLabel: string,
    defaultType: PieceType,
    scope: PieceTypeScope,
    showAddPieceChip = true
  ) {
    return (
      <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {piecesToRender.map(renderPieceCard)}
        {showAddPieceChip && renderAddPieceChip(addLabel, defaultType, scope)}
      </div>
    );
  }

  function renderModalInputField({
    label,
    name,
    type,
    inputMode,
    min,
    step,
    value,
    error,
    onChange,
  }: {
    label: string;
    name: string;
    type: 'number';
    inputMode: 'decimal' | 'numeric';
    min: string;
    step?: string;
    value: string;
    error: string | undefined;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }) {
    return (
      <div className="grid min-h-[7.25rem] grid-rows-[2.5rem_3rem_1.25rem] gap-y-2">
        <label
          htmlFor={name}
          className="flex items-end text-sm font-medium leading-tight text-gray-700"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          min={min}
          step={step}
          value={value}
          onChange={onChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={`${name}-error`}
          className={`h-12 w-full rounded-lg border border-gray-300 px-4 py-2 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300 ${
            error ? 'border-alert-400 focus:ring-alert-400' : ''
          }`}
        />
        <p
          id={`${name}-error`}
          className="min-h-[1.25rem] text-sm leading-tight text-alert-400"
          data-testid={`${name}-error-slot`}
        >
          {error ?? ''}
        </p>
      </div>
    );
  }

  function renderExteriorOpeningToggle() {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Ouvrant vers l’extérieur</p>
            <p className="mt-1 text-sm text-textLight">
              Indique si la pièce dispose d’une ouverture donnant vers l’extérieur.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={pieceForm.hasExteriorOpening}
            aria-label="Ouvrant vers l’extérieur"
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 ${
              pieceForm.hasExteriorOpening ? 'bg-primary-300' : 'bg-gray-300'
            }`}
            onClick={() =>
              updatePieceFormField('hasExteriorOpening', !pieceForm.hasExteriorOpening)
            }
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                pieceForm.hasExteriorOpening ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  function renderPieceModal() {
    if (piecePanelMode === 'closed' || typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div
        className="fixed inset-0 z-[80] flex min-h-dvh items-center justify-center overflow-y-auto bg-gray-900/35 px-4 py-6"
        data-testid="piece-modal-overlay"
        onClick={resetPiecePanel}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="piece-modal-title"
          className="w-full max-w-lg rounded-card border border-gray-200 bg-white p-5 shadow-card md:p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5">
            <h3 id="piece-modal-title">
              {piecePanelMode === 'edit' ? 'Modifier la pièce' : 'Ajouter une pièce'}
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Renseignez les informations principales de la pièce.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handlePieceFormSubmit}>
            <PieceTypeSelect
              value={pieceForm.type}
              options={selectablePieceTypes}
              groupLabel={selectablePieceTypeGroupLabel}
              onChange={(value) => updatePieceFormField('type', value)}
            />

            <div className="grid gap-5 sm:grid-cols-2" data-testid="piece-form-fields-grid">
              {renderModalInputField({
                label: 'Surface en m²',
                name: 'pieceSurface',
                type: 'number',
                inputMode: 'decimal',
                min: '0',
                step: '0.1',
                value: pieceForm.surface,
                error: pieceFormErrors.surface,
                onChange: (event) => updatePieceFormField('surface', event.target.value),
              })}

              {activePieceSupportsSleepingCapacity &&
                renderModalInputField({
                  label: 'Nombre de personnes pouvant dormir dans cette pièce',
                  name: 'pieceSleepingCapacity',
                  type: 'number',
                  inputMode: 'numeric',
                  min: '1',
                  value: pieceForm.sleepingCapacity,
                  error: pieceFormErrors.sleepingCapacity,
                  onChange: (event) => updatePieceFormField('sleepingCapacity', event.target.value),
                })}
            </div>

            {activePieceCanHaveExteriorOpening && renderExteriorOpeningToggle()}

            {pieceValidationIssue && (
              <div
                className="flex items-start gap-2 rounded-lg border border-alert-200 bg-alert-100 p-3 text-sm text-alert-500"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-alert-400"
                />
                <p>{pieceValidationIssue.message}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isSavingPiece || pieceValidationIssue?.blocking === true}
              >
                {isSavingPiece
                  ? 'Enregistrement...'
                  : piecePanelMode === 'edit'
                    ? 'Enregistrer les modifications'
                    : 'Ajouter cette pièce'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={resetPiecePanel}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>,
      document.body
    );
  }

  if (loadStatus === 'loading') {
    return (
      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <Card hover={false} className="mx-auto max-w-3xl p-5 md:p-6">
            <p className="text-sm text-gray-700">Chargement de votre simulation...</p>
          </Card>
        </div>
      </section>
    );
  }

  if (loadStatus === 'error') {
    return (
      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <Card
            hover={false}
            className="mx-auto max-w-3xl border-alert-200 bg-alert-100 p-5 md:p-6"
          >
            <h1 className="mb-3 text-gray-900">Simulation indisponible</h1>
            <p className="mb-5 text-sm text-alert-500">
              Impossible de charger cette simulation pour le moment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => void loadSimulation()}>
                Réessayer
              </Button>
              <Button href="/simulateur" variant="primary">
                Revenir aux simulations
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/simulateur"
                className="text-sm font-medium text-primary-300 transition-colors hover:text-primary-400"
              >
                Retour aux simulations
              </Link>
            </div>

            <div>
              <h1 className="mb-3 text-gray-900">Ma simulation de classement</h1>
              <p className="max-w-3xl text-sm text-textLight">
                Complétez les pièces du logement, renseignez la grille de contrôle, puis consultez
                le résultat de votre simulation.
              </p>
            </div>

            <Card hover={false} className="relative z-10 p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Paramètres de simulation</p>
                  <p className="mt-1 text-sm text-textLight">{parametersSummary}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {isSavingParameters && (
                    <span className="inline-flex w-fit rounded-full border border-primary-200 bg-primary-100 px-3 py-1 text-sm font-medium text-primary-500">
                      Enregistrement...
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-2 bg-white"
                    aria-expanded={areParametersExpanded}
                    aria-controls="simulation-parameters-panel"
                    onClick={() => setAreParametersExpanded((isExpanded) => !isExpanded)}
                  >
                    {areParametersExpanded ? 'Masquer les paramètres' : 'Modifier les paramètres'}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-300 ${
                        areParametersExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {areParametersExpanded && (
                <div
                  id="simulation-parameters-panel"
                  className="mt-5 border-t border-gray-100 pb-5 pt-5 transition-all duration-300 ease-in-out md:pb-6"
                >
                  <p className="mb-4 rounded-lg border border-primary-200 bg-primary-100 px-4 py-3 text-sm text-primary-500">
                    Ces paramètres peuvent modifier les critères applicables et le résultat de la
                    simulation.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Select
                      id="simulationRequestedCategory"
                      name="simulationRequestedCategory"
                      label="Classement demandé"
                      options={REQUESTED_CATEGORY_OPTIONS}
                      value={parameterForm.requestedCategory}
                      disabled={isSavingParameters}
                      onChange={handleRequestedCategoryChange}
                    />

                    <Input
                      label="Capacité d’accueil"
                      name="simulationCapacity"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={parameterForm.capacity}
                      disabled={isSavingParameters}
                      onChange={handleCapacityChange}
                      onBlur={handleCapacityBlur}
                      error={parameterErrors.capacity}
                    />

                    <Select
                      id="simulationHousingType"
                      name="simulationHousingType"
                      label="Type d’habitation"
                      options={HOUSING_TYPE_OPTIONS}
                      value={parameterForm.housingType}
                      disabled={isSavingParameters}
                      onChange={handleHousingTypeChange}
                    />

                    <Select
                      id="simulationFloor"
                      name="simulationFloor"
                      label="Étage"
                      options={FLOOR_OPTIONS}
                      value={parameterForm.floor}
                      disabled={isSavingParameters}
                      onChange={handleFloorChange}
                    />
                  </div>
                </div>
              )}
            </Card>

            <div
              role="tablist"
              aria-label="Étapes de la simulation"
              className="grid gap-3 md:grid-cols-3"
            >
              {[
                {
                  id: 'pieces' as const,
                  step: '1',
                  label: 'Pièces du logement',
                  summary: `${pieces.length} ${pieces.length > 1 ? 'pièces' : 'pièce'} · ${formatSurfaceCompact(
                    logement?.surface_totale
                  )} · ${formatSleepingCount(totalSleepingCapacity)}`,
                },
                {
                  id: 'grid' as const,
                  step: '2',
                  label: 'Grille de contrôle',
                  summary: gridStepSummary,
                },
                {
                  id: 'result' as const,
                  step: '3',
                  label: 'Résultat',
                  summary: resultStatusLabel,
                },
              ].map((tab, index) => {
                const isActive = activeTab === tab.id;
                const isComplete =
                  (tab.id === 'pieces' && pieceCompletionWarnings.length === 0) ||
                  (tab.id === 'grid' &&
                    gridProgressSummary.totalCount > 0 &&
                    gridProgressSummary.remainingCount === 0) ||
                  (tab.id === 'result' && isResultBusinessSuccess);
                const showNeutralResultStatus =
                  tab.id === 'result' && isResultCalculatedWithoutSuccess;

                return (
                  <button
                    key={tab.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`simulation-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`simulation-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`min-h-20 rounded-card border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 md:p-4 ${
                      isActive
                        ? 'border-primary-300 bg-primary-100/70'
                        : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-100/40'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-textLight">
                        Étape {tab.step}
                      </span>
                      {isComplete && (
                        <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-success-400" />
                      )}
                      {showNeutralResultStatus && (
                        <span className="inline-flex rounded-full border border-primary-200 bg-white px-2 py-0.5 text-xs font-semibold text-primary-500">
                          À jour
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block text-sm font-semibold text-gray-900">
                      {tab.label}
                    </span>
                    <span className="mt-1.5 block text-xs leading-5 text-textLight">
                      {tab.summary}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'pieces' && (
              <div
                id="simulation-panel-pieces"
                role="tabpanel"
                aria-labelledby="simulation-tab-pieces"
                className="space-y-6"
              >
                <Card hover={false} className="border-primary-300 bg-primary-100 p-5 md:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <span className="inline-flex rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500">
                        ÉTAPE 1 — PIÈCES DU LOGEMENT
                      </span>
                      <h2 className="mb-3 mt-4 text-gray-900">
                        Renseignez les pièces de votre logement
                      </h2>
                      <p className="text-sm leading-comfortable text-primary-500">
                        Ajoutez les pièces de votre logement avec leur surface et les couchages
                        éventuels.
                      </p>
                      <p className="mt-3 flex items-start gap-2 text-sm font-medium text-primary-500">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>Vous pourrez modifier ces informations à tout moment.</span>
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:flex-col">
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full gap-2 sm:w-auto"
                        onClick={() => openCreatePanel('CHAMBRE', 'interior')}
                      >
                        <Plus aria-hidden="true" className="h-5 w-5" />
                        Ajouter une pièce
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full bg-white sm:w-auto"
                        onClick={handleGoToGrid}
                      >
                        Passer à la grille de contrôle
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card hover={false} className="p-5 md:p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Résumé du logement</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-textLight">
                        Surface totale renseignée
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatSurface(logement?.surface_totale)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textLight">Pièces d’habitation</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {logement?.nb_pieces_habitation ?? 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textLight">Capacité indiquée</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {grille?.capacite_accueil
                          ? formatPeopleCount(grille.capacite_accueil)
                          : 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textLight">Couchages renseignés</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatPeopleCount(totalSleepingCapacity)}
                      </p>
                    </div>
                  </div>
                </Card>

                <h2>Pièces du logement</h2>

                <div className="space-y-8">
                  <section className="space-y-4" aria-labelledby="interior-pieces-title">
                    <h3 id="interior-pieces-title">Pièces intérieures</h3>
                    {renderPieceGrid(interiorPieces, 'Ajouter une pièce', 'CHAMBRE', 'interior')}
                  </section>

                  <section
                    className="space-y-4 border-t border-gray-200 pt-8"
                    aria-labelledby="exterior-pieces-title"
                  >
                    <h3 id="exterior-pieces-title">Espaces extérieurs</h3>
                    {renderPieceGrid(
                      exteriorPieces,
                      'Ajouter un espace extérieur',
                      exteriorCreateDefaultType,
                      'exterior',
                      availableExteriorPieceTypesForCreation.length > 0
                    )}
                  </section>

                  {pieceCompletionWarnings.length > 0 ? (
                    <div className="rounded-card border border-warning-200 bg-warning-100 p-4 text-sm text-warning-500">
                      <p className="font-semibold">
                        Vous pouvez passer à la grille de contrôle, mais certaines informations du
                        logement restent à compléter.
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {pieceCompletionWarnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-card border border-success-200 bg-success-100 p-4 text-sm text-success-500">
                      <p className="font-semibold">Vous pouvez passer à la grille de contrôle.</p>
                      <p className="mt-2">
                        Lorsque vous avez terminé de renseigner les pièces de votre logement, vous
                        pouvez commencer à compléter la grille. Vous pourrez revenir modifier les
                        pièces à tout moment.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full bg-white sm:w-auto"
                      onClick={handleGoToGrid}
                    >
                      Passer à la grille de contrôle
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grid' && (
              <div id="simulation-panel-grid" role="tabpanel" aria-labelledby="simulation-tab-grid">
                {gridModelStatus === 'success' && gridSummary ? (
                  <SimulationGridTab
                    grid={gridSummary}
                    simulationId={simulationId ?? ''}
                    responses={grille?.reponses ?? []}
                    requestedCategory={grille?.categorie_demandee}
                    criterionFilterNumbers={criterionFilterNumbers}
                    progressSummary={gridProgressSummary}
                    resultActionLabel={resultActionLabel}
                    isCheckingResult={isCheckingResult}
                    onResponseSaved={handleResponseSaved}
                    onClearCriterionFilter={() => setCriterionFilterNumbers([])}
                    onCheckResult={() => void runSimulationCheck()}
                    onResultReset={() => markResultStale({ clearCriterionFilter: false })}
                  />
                ) : (
                  <SimulationGridModelState
                    status={gridModelStatus}
                    onRetry={() => void loadGridModel()}
                  />
                )}
              </div>
            )}

            {activeTab === 'result' && (
              <div
                id="simulation-panel-result"
                role="tabpanel"
                aria-labelledby="simulation-tab-result"
                className="scroll-mt-28 space-y-6"
              >
                {resultStatus === 'none' && (
                  <Card hover={false} className="p-5 md:p-6">
                    <h2 className="mb-3">Aucun résultat pour le moment</h2>
                    <p className="max-w-3xl text-sm text-textLight">
                      Complétez les pièces et la grille, puis lancez la simulation pour voir si le
                      classement demandé semble atteint.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      className="mt-5 w-full sm:w-auto"
                      disabled={isCheckingResult}
                      onClick={() => void runSimulationCheck()}
                    >
                      Voir le résultat de ma simulation
                    </Button>
                  </Card>
                )}

                {resultStatus === 'stale' && (
                  <Card hover={false} className="border-warning-200 bg-warning-100 p-5 md:p-6">
                    <h2 className="mb-3 text-gray-900">Résultat à recalculer</h2>
                    <p className="max-w-3xl text-sm text-warning-500">
                      Votre simulation a été modifiée depuis le dernier calcul. Relancez la
                      simulation pour obtenir un résultat à jour.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      className="mt-5 w-full sm:w-auto"
                      disabled={isCheckingResult}
                      onClick={() => void runSimulationCheck()}
                    >
                      Relancer la simulation
                    </Button>
                  </Card>
                )}

                {resultStatus === 'checking' && (
                  <Card hover={false} className="border-primary-200 bg-primary-100 p-5 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-300">
                        <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                      </span>
                      <div>
                        <h2 className="mb-3 text-gray-900">
                          {isAutoRecalculatingResult ? 'Recalcul en cours' : 'Calcul en cours'}
                        </h2>
                        <p className="max-w-3xl text-sm text-primary-500">
                          {isAutoRecalculatingResult
                            ? 'Les paramètres modifiés sont pris en compte. Le résultat se met à jour automatiquement.'
                            : 'Le résultat de votre simulation est en cours de calcul. Cette étape peut prendre quelques secondes.'}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {resultStatus === 'error' && (
                  <Card hover={false} className="border-alert-200 bg-alert-100 p-5 md:p-6">
                    <h2 className="mb-3 text-gray-900">Erreur de calcul</h2>
                    <p className="max-w-3xl text-sm text-alert-500">
                      {resultErrorMessage ??
                        'Le résultat n’a pas pu être calculé pour le moment. Veuillez réessayer.'}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-5 w-full bg-white sm:w-auto"
                      disabled={isCheckingResult}
                      onClick={() => void runSimulationCheck()}
                    >
                      {resultActionLabel}
                    </Button>
                  </Card>
                )}

                {resultStatus === 'fresh' &&
                  gridSummary &&
                  resultState?.kind === 'verification' && (
                    <SimulationVerificationIssues
                      verification={resultState.verification}
                      sleepingCapacityCount={totalSleepingCapacity}
                      requestedCapacity={grille?.capacite_accueil}
                      onShowCriteria={showCriteriaInGrid}
                      onReturnToPieces={() => setActiveTab('pieces')}
                    />
                  )}

                {resultStatus === 'fresh' && gridSummary && resultState?.kind === 'rapport' && (
                  <SimulationResultPanel
                    grid={gridSummary}
                    rapport={resultState.rapport}
                    requestedCategory={grille?.categorie_demandee}
                    onExportPdf={() => void handleExportPdf()}
                    onShowCriteria={showCriteriaInGrid}
                    onReturnToPieces={() => setActiveTab('pieces')}
                    onReturnToGrid={returnToFullGrid}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {renderPieceModal()}
    </>
  );
}
