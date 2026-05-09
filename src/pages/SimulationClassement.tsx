import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Bath,
  BedDouble,
  ChefHat,
  ChevronDown,
  Computer,
  DoorOpen,
  Footprints,
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
  type SimulationResultState,
} from '../components/simulator/SimulationGridTab';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tooltip from '../components/ui/Tooltip';
import type { GridSummary } from '../content/simulatorGrid';
import {
  createPiece,
  deletePiece,
  getSimulationGridModel,
  getPublicSimulation,
  getSimulationLogement,
  SimulatorApiError,
  updatePiece,
  type LogementDto,
  type PieceDto,
  type PieceType,
  type PublicSimulationDto,
  type ReponseDto,
} from '../utils/simulatorApi';
import {
  canPieceHaveSleepingCapacity,
  EXTERIOR_PIECE_TYPES,
  formatFloor,
  formatHousingType,
  formatPieceType,
  formatRequestedCategory,
  INTERIOR_PIECE_TYPES,
  isExteriorPiece,
} from '../utils/simulatorLabels';

type LoadStatus = 'loading' | 'success' | 'error';
type GridModelStatus = 'idle' | 'loading' | 'success' | 'error';
type ActiveTab = 'pieces' | 'grid' | 'result';
type PiecePanelMode = 'closed' | 'create' | 'edit';
type PieceTypeScope = 'interior' | 'exterior';
type FeedbackType = 'success' | 'error';

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

interface FeedbackMessage {
  type: FeedbackType;
  text: string;
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

function isPieceType(value: string): value is PieceType {
  return [...INTERIOR_PIECE_TYPES, ...EXTERIOR_PIECE_TYPES].includes(value as PieceType);
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

function hasPieceWithSurface(pieces: PieceDto[]): boolean {
  return pieces.some(
    (piece) =>
      typeof piece.surface === 'number' && Number.isFinite(piece.surface) && piece.surface > 0
  );
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
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
  const [isSavingPiece, setIsSavingPiece] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingPieceId, setDeletingPieceId] = useState<string | null>(null);
  const [resultState, setResultState] = useState<SimulationResultState | null>(null);
  const [criterionFilterNumbers, setCriterionFilterNumbers] = useState<number[]>([]);
  const resultPanelRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const loadSimulation = useCallback(async () => {
    if (!simulationId) {
      setLoadStatus('error');
      return;
    }

    setLoadStatus('loading');
    setFeedbackMessage(null);

    try {
      const [nextSimulation, nextLogement] = await Promise.all([
        getPublicSimulation(simulationId),
        getSimulationLogement(simulationId),
      ]);

      setSimulation(nextSimulation);
      setLogement(nextLogement);
      setLoadStatus('success');
    } catch {
      setSimulation(null);
      setLogement(null);
      setLoadStatus('error');
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
    if (activeTab === 'grid' && gridModelStatus === 'idle') {
      void loadGridModel();
    }
  }, [activeTab, gridModelStatus, loadGridModel]);

  useEffect(() => {
    if (activeTab !== 'result' || resultState === null) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      resultPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, resultState]);

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
  const hasSimulationResult = resultState !== null;
  const activePieceSupportsSleepingCapacity = canPieceHaveSleepingCapacity(pieceForm.type);
  const activePieceCanHaveExteriorOpening = canPieceHaveExteriorOpening(pieceForm.type);
  const grille = simulation?.grille;
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
    setFeedbackMessage(null);
    setConfirmingDeleteId(null);
    setPiecePanelMode('create');
    setPieceTypeScope(scope);
    setEditingPieceId(null);
    setPieceForm({ ...DEFAULT_PIECE_FORM, type: defaultType });
    setPieceFormErrors({});
  }

  function openEditPanel(piece: PieceDto) {
    if (!piece.id) {
      setFeedbackMessage({
        type: 'error',
        text: 'Cette pièce ne peut pas être modifiée pour le moment.',
      });
      return;
    }

    setFeedbackMessage(null);
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

  function resetSimulationResult() {
    setResultState(null);
    setCriterionFilterNumbers([]);
    setActiveTab((currentTab) => (currentTab === 'result' ? 'grid' : currentTab));
  }

  function resetResultOnly() {
    setResultState(null);
    setActiveTab((currentTab) => (currentTab === 'result' ? 'grid' : currentTab));
  }

  function showSimulationResult(result: SimulationResultState) {
    setResultState(result);
    setCriterionFilterNumbers([]);
    setActiveTab('result');
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

  async function applyPieceMutationResult(nextLogement: LogementDto): Promise<boolean> {
    setLogement(nextLogement);
    resetSimulationResult();

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
    setFeedbackMessage(null);

    try {
      const isEditingPiece = piecePanelMode === 'edit' && editingPieceId;
      const payload = buildPiecePayload(pieceForm, isEditingPiece ? editingPiece : undefined);
      const nextLogement = isEditingPiece
        ? await updatePiece(simulationId, editingPieceId, payload)
        : await createPiece(simulationId, payload);
      const hasRefreshedSimulation = await applyPieceMutationResult(nextLogement);
      resetPiecePanel();

      if (!hasRefreshedSimulation) {
        setFeedbackMessage({
          type: 'error',
          text: 'La pièce a été enregistrée, mais la grille de contrôle n’a pas pu être actualisée. Réessayez avant de consulter le résultat.',
        });
        return;
      }

      setFeedbackMessage({
        type: 'success',
        text: piecePanelMode === 'edit' ? 'La pièce a été modifiée.' : 'La pièce a été ajoutée.',
      });
    } catch (error) {
      setFeedbackMessage({
        type: 'error',
        text:
          error instanceof SimulatorApiError && error.status === 409
            ? 'Une pièce similaire existe déjà ou les informations envoyées sont incomplètes.'
            : 'La pièce n’a pas pu être enregistrée. Veuillez réessayer.',
      });
    } finally {
      setIsSavingPiece(false);
    }
  }

  async function handleDeletePiece(piece: PieceDto) {
    if (!simulationId || !piece.id) {
      setFeedbackMessage({
        type: 'error',
        text: 'Cette pièce ne peut pas être supprimée pour le moment.',
      });
      return;
    }

    setDeletingPieceId(piece.id);
    setFeedbackMessage(null);

    try {
      const nextLogement = await deletePiece(simulationId, piece.id);
      const hasRefreshedSimulation = await applyPieceMutationResult(nextLogement);
      setConfirmingDeleteId(null);
      if (editingPieceId === piece.id) {
        resetPiecePanel();
      }

      if (!hasRefreshedSimulation) {
        setFeedbackMessage({
          type: 'error',
          text: 'La pièce a été supprimée, mais la grille de contrôle n’a pas pu être actualisée. Réessayez avant de consulter le résultat.',
        });
        return;
      }

      setFeedbackMessage({ type: 'success', text: 'La pièce a été supprimée.' });
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'Cette pièce n’a pas pu être supprimée. Elle est peut-être nécessaire à la simulation.',
      });
    } finally {
      setDeletingPieceId(null);
    }
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabId: ActiveTab) {
    const enabledTabs: ActiveTab[] = hasSimulationResult
      ? ['pieces', 'grid', 'result']
      : ['pieces', 'grid'];
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
    if (!hasPieceWithSurface(pieces)) {
      setFeedbackMessage({
        type: 'error',
        text: 'Ajoutez au moins une pièce avec sa surface avant de passer à la grille de contrôle.',
      });
      setActiveTab('pieces');
      return;
    }

    setFeedbackMessage(null);
    setActiveTab('grid');
  }

  function handleResponseSaved(savedResponse: ReponseDto) {
    resetResultOnly();
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
    return (
      <button
        type="button"
        className="flex h-full min-h-52 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary-200 bg-primary-100 p-4 text-primary-500 transition-colors hover:border-primary-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        aria-label={label}
        onClick={() => openCreatePanel(defaultType, scope)}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 bg-white">
          <Plus aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="text-center text-sm font-semibold">Ajouter une pièce</span>
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
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }) {
    return (
      <div className="grid min-h-[6.75rem] grid-rows-[auto_auto_1.25rem]">
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
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
          className={`w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300 ${
            error ? 'border-alert-400 focus:ring-alert-400' : ''
          }`}
        />
        <p
          id={`${name}-error`}
          className="mt-2 min-h-[1.25rem] text-sm leading-tight text-alert-400"
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
    <section className="simulator-ui bg-white py-10 md:py-12">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/simulateur"
              className="text-sm font-medium text-primary-300 transition-colors hover:text-primary-400"
            >
              Revenir à la liste des simulations
            </Link>
          </div>

          <div>
            <h1 className="mb-3 text-gray-900">Ma simulation de classement</h1>
            <p className="max-w-3xl text-sm text-textLight">
              Cette étape sert à décrire les pièces du logement avant la grille de contrôle.
            </p>
          </div>

          <Card hover={false} className="p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-textLight">Classement demandé</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatRequestedCategory(grille?.categorie_demandee)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-textLight">Capacité d’accueil</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {grille?.capacite_accueil
                    ? formatPeopleCount(grille.capacite_accueil)
                    : 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-textLight">Type d’habitation</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatHousingType(grille?.type_habitation)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-textLight">Étage</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatFloor(grille?.etage)}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-3" aria-label="Parcours de la simulation">
            {[
              { step: '1', label: 'Pièces du logement', active: activeTab === 'pieces' },
              { step: '2', label: 'Grille de contrôle', active: activeTab === 'grid' },
              {
                step: '3',
                label: 'Résultat',
                active: activeTab === 'result',
                inactive: !hasSimulationResult,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-card border p-4 ${
                  item.active
                    ? 'border-primary-300 bg-primary-100 text-primary-500'
                    : 'border-gray-200 bg-white text-gray-700'
                } ${item.inactive ? 'opacity-60' : ''}`}
                aria-current={item.active ? 'step' : undefined}
              >
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Étape {item.step}
                </span>
                <p className="mt-1 text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="border-b border-gray-200">
            <div role="tablist" aria-label="Étapes de la simulation" className="flex gap-2">
              {[
                { id: 'pieces' as const, label: 'Pièces du logement', disabled: false },
                { id: 'grid' as const, label: 'Grille de contrôle', disabled: false },
                { id: 'result' as const, label: 'Résultat', disabled: !hasSimulationResult },
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`simulation-tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-disabled={tab.disabled ? 'true' : undefined}
                  aria-controls={`simulation-panel-${tab.id}`}
                  tabIndex={activeTab === tab.id && !tab.disabled ? 0 : -1}
                  disabled={tab.disabled}
                  className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 ${
                    activeTab === tab.id
                      ? 'bg-primary-300 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                  } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-100`}
                  onClick={() => {
                    if (!tab.disabled) {
                      setActiveTab(tab.id);
                    }
                  }}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {feedbackMessage && (
            <div
              className={`rounded-card border p-4 text-sm ${
                feedbackMessage.type === 'error'
                  ? 'border-alert-200 bg-alert-100 text-alert-500'
                  : 'border-primary-200 bg-primary-100 text-primary-500'
              }`}
              role="status"
            >
              {feedbackMessage.text}
            </div>
          )}

          {activeTab === 'pieces' && (
            <div
              id="simulation-panel-pieces"
              role="tabpanel"
              aria-labelledby="simulation-tab-pieces"
              className="space-y-6"
            >
              <Card hover={false} className="p-5 md:p-6">
                <h2 className="mb-4">Résumé du logement</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-textLight">Surface totale renseignée</p>
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
                    <p className="text-sm font-medium text-textLight">Capacité demandée</p>
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
                {pieces.length === 0 && (
                  <p className="mt-5 rounded-lg bg-primary-100 p-4 text-sm text-primary-500">
                    Aucune pièce n’a encore été ajoutée à cette simulation.
                  </p>
                )}
              </Card>

              <h2>Pièces du logement</h2>

              {piecePanelMode !== 'closed' && (
                <div
                  className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/35 px-4 py-6"
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

                      <div
                        className="grid gap-5 sm:grid-cols-2"
                        data-testid="piece-form-fields-grid"
                      >
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
                            onChange: (event) =>
                              updatePieceFormField('sleepingCapacity', event.target.value),
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
                </div>
              )}

              <div className="space-y-8">
                <section className="space-y-4" aria-labelledby="interior-pieces-title">
                  <h3 id="interior-pieces-title">Pièces intérieures</h3>
                  {renderPieceGrid(
                    interiorPieces,
                    'Ajouter une pièce intérieure',
                    'CHAMBRE',
                    'interior'
                  )}
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
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={handleGoToGrid}
                >
                  Passer à la grille de contrôle
                </Button>
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
                  onResponseSaved={handleResponseSaved}
                  onClearCriterionFilter={() => setCriterionFilterNumbers([])}
                  onResultReady={showSimulationResult}
                  onResultReset={resetResultOnly}
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
              ref={resultPanelRef}
              id="simulation-panel-result"
              role="tabpanel"
              aria-labelledby="simulation-tab-result"
              className="scroll-mt-28 space-y-6"
            >
              {gridSummary && resultState?.kind === 'verification' && (
                <SimulationVerificationIssues
                  verification={resultState.verification}
                  sleepingCapacityCount={totalSleepingCapacity}
                  requestedCapacity={grille?.capacite_accueil}
                  onShowCriteria={showCriteriaInGrid}
                  onReturnToPieces={() => setActiveTab('pieces')}
                />
              )}

              {gridSummary && resultState?.kind === 'rapport' && (
                <SimulationResultPanel
                  grid={gridSummary}
                  rapport={resultState.rapport}
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
  );
}
