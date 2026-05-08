import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SimulationGridTab from '../components/simulator/SimulationGridTab';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import {
  createPiece,
  deletePiece,
  getPublicSimulation,
  getSimulationLogement,
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
type ActiveTab = 'pieces' | 'grid';
type PiecePanelMode = 'closed' | 'create' | 'edit';
type FeedbackType = 'success' | 'error';

interface PieceFormState {
  name: string;
  type: PieceType;
  surface: string;
  sleepingCapacity: string;
}

interface PieceFormErrors {
  surface?: string;
  sleepingCapacity?: string;
}

interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

const DEFAULT_PIECE_FORM: PieceFormState = {
  name: '',
  type: 'CHAMBRE',
  surface: '',
  sleepingCapacity: '',
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
  const name = piece.nom?.trim();
  return name || formatPieceType(piece.type_piece);
}

function getTotalSleepingCapacity(pieces: PieceDto[]): number {
  return pieces.reduce((total, piece) => total + (piece.nombre_lits ?? 0), 0);
}

function hasPieceWithSurface(pieces: PieceDto[]): boolean {
  return pieces.some(
    (piece) =>
      typeof piece.surface === 'number' && Number.isFinite(piece.surface) && piece.surface > 0
  );
}

function buildPiecePayload(form: PieceFormState): PieceDto {
  const payload: PieceDto = {
    type_piece: form.type,
    surface: Number(form.surface),
  };

  const trimmedName = form.name.trim();
  if (trimmedName) {
    payload.nom = trimmedName;
  }

  if (canPieceHaveSleepingCapacity(form.type) && form.sleepingCapacity.trim()) {
    // Le backend porte actuellement les couchages renseignés dans nombre_lits.
    payload.nombre_lits = Number(form.sleepingCapacity);
  }

  return payload;
}

function createFormFromPiece(piece: PieceDto): PieceFormState {
  return {
    name: piece.nom ?? '',
    type: piece.type_piece,
    surface: piece.surface === undefined ? '' : String(piece.surface),
    sleepingCapacity: piece.nombre_lits === undefined ? '' : String(piece.nombre_lits),
  };
}

function PieceTypeSelect({
  value,
  onChange,
}: {
  value: PieceType;
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
          <optgroup label="Pièces intérieures">
            {INTERIOR_PIECE_TYPES.map((pieceType) => (
              <option key={pieceType} value={pieceType}>
                {formatPieceType(pieceType)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Espaces extérieurs">
            {EXTERIOR_PIECE_TYPES.map((pieceType) => (
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

export default function SimulationClassement() {
  const { simulationId } = useParams<{ simulationId: string }>();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [simulation, setSimulation] = useState<PublicSimulationDto | null>(null);
  const [logement, setLogement] = useState<LogementDto | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('pieces');
  const [piecePanelMode, setPiecePanelMode] = useState<PiecePanelMode>('closed');
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [pieceForm, setPieceForm] = useState<PieceFormState>(DEFAULT_PIECE_FORM);
  const [pieceFormErrors, setPieceFormErrors] = useState<PieceFormErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
  const [isSavingPiece, setIsSavingPiece] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingPieceId, setDeletingPieceId] = useState<string | null>(null);
  const [hasSimulationResult, setHasSimulationResult] = useState(false);
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

  useEffect(() => {
    void loadSimulation();
  }, [loadSimulation]);

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
  const grille = simulation?.grille;

  function resetPiecePanel() {
    setPiecePanelMode('closed');
    setEditingPieceId(null);
    setPieceForm(DEFAULT_PIECE_FORM);
    setPieceFormErrors({});
  }

  function openCreatePanel() {
    setFeedbackMessage(null);
    setConfirmingDeleteId(null);
    setPiecePanelMode('create');
    setEditingPieceId(null);
    setPieceForm(DEFAULT_PIECE_FORM);
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

  async function handlePieceFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!simulationId || !validatePieceForm()) {
      return;
    }

    setIsSavingPiece(true);
    setFeedbackMessage(null);

    try {
      const payload = buildPiecePayload(pieceForm);
      const nextLogement =
        piecePanelMode === 'edit' && editingPieceId
          ? await updatePiece(simulationId, editingPieceId, payload)
          : await createPiece(simulationId, payload);

      setLogement(nextLogement);
      resetPiecePanel();
      setFeedbackMessage({
        type: 'success',
        text: piecePanelMode === 'edit' ? 'La pièce a été modifiée.' : 'La pièce a été ajoutée.',
      });
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'La pièce n’a pas pu être enregistrée. Veuillez réessayer.',
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
      setLogement(nextLogement);
      setConfirmingDeleteId(null);
      if (editingPieceId === piece.id) {
        resetPiecePanel();
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

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = tabRefs.current.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = nextIndex === 0 ? 'pieces' : 'grid';
    setActiveTab(nextTab);
    tabRefs.current[nextIndex]?.focus();
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

    return (
      <Card
        key={piece.id ?? `${piece.type_piece}-${piece.nom ?? piece.surface}`}
        hover={false}
        className="p-4"
        data-testid={piece.id ? `piece-card-${piece.id}` : undefined}
      >
        <div className="space-y-4">
          <div>
            <h4>{getPieceDisplayName(piece)}</h4>
            <p className="mt-1 text-sm text-textLight">{formatPieceType(piece.type_piece)}</p>
          </div>

          <dl className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-900">Surface</dt>
              <dd>{formatSurface(piece.surface)}</dd>
            </div>
            {supportsSleepingCapacity && piece.nombre_lits !== undefined && (
              <div>
                <dt className="font-medium text-gray-900">Couchages</dt>
                <dd>{formatPeopleCount(piece.nombre_lits)}</dd>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-2">
            {piece.surface_minimum_atteinte !== undefined && (
              <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">
                {piece.surface_minimum_atteinte ? 'Surface suffisante' : 'Surface à vérifier'}
              </span>
            )}
            {supportsSleepingCapacity && piece.capacite_lits_atteinte !== undefined && (
              <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">
                {piece.capacite_lits_atteinte ? 'Couchages suffisants' : 'Couchages à vérifier'}
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            {isConfirmingDelete ? (
              <div className="space-y-3 rounded-lg border border-alert-200 bg-alert-100 p-4">
                <p className="text-sm font-medium text-alert-500">
                  Confirmer la suppression de cette pièce ?
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => setConfirmingDeleteId(null)}
                  >
                    Annuler
                  </Button>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-alert-200 bg-white px-4 py-2 text-sm font-medium text-alert-500 transition-colors duration-200 hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 sm:w-auto"
                    disabled={deletingPieceId === piece.id}
                    onClick={() => void handleDeletePiece(piece)}
                  >
                    {deletingPieceId === piece.id ? 'Suppression...' : 'Supprimer la pièce'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={!canUpdatePiece}
                  onClick={() => openEditPanel(piece)}
                >
                  Modifier
                </Button>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-alert-200 bg-white px-4 py-2 text-sm font-medium text-alert-500 transition-colors duration-200 hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  disabled={!canUpdatePiece}
                  onClick={() => {
                    setPiecePanelMode('closed');
                    setEditingPieceId(null);
                    setConfirmingDeleteId(piece.id ?? null);
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
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
                active: hasSimulationResult,
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
                { id: 'pieces' as const, label: 'Pièces du logement' },
                { id: 'grid' as const, label: 'Grille de contrôle' },
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
                  aria-controls={`simulation-panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 ${
                    activeTab === tab.id
                      ? 'bg-primary-300 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <p className="text-sm font-medium text-textLight">Surface totale renseignée</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatSurface(logement?.surface_totale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textLight">Pièces ajoutées</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{pieces.length}</p>
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

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2>Pièces du logement</h2>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto"
                  onClick={openCreatePanel}
                >
                  Ajouter une pièce
                </Button>
              </div>

              {piecePanelMode !== 'closed' && (
                <Card hover={false} className="border-primary-200 bg-primary-100 p-5 md:p-6">
                  <div className="mb-5">
                    <h3>{piecePanelMode === 'edit' ? 'Modifier la pièce' : 'Ajouter une pièce'}</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Renseignez les informations principales de la pièce.
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handlePieceFormSubmit}>
                    <Input
                      label="Nom de la pièce"
                      name="pieceName"
                      value={pieceForm.name}
                      placeholder="Ex. Chambre 1"
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updatePieceFormField('name', event.target.value)
                      }
                    />

                    <PieceTypeSelect
                      value={pieceForm.type}
                      onChange={(value) => updatePieceFormField('type', value)}
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Surface en m²"
                        name="pieceSurface"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        value={pieceForm.surface}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          updatePieceFormField('surface', event.target.value)
                        }
                        error={pieceFormErrors.surface}
                      />

                      {activePieceSupportsSleepingCapacity && (
                        <Input
                          label="Nombre de personnes pouvant dormir dans cette pièce"
                          name="pieceSleepingCapacity"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={pieceForm.sleepingCapacity}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updatePieceFormField('sleepingCapacity', event.target.value)
                          }
                          error={pieceFormErrors.sleepingCapacity}
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full sm:w-auto"
                        disabled={isSavingPiece}
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
                </Card>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-4" aria-labelledby="interior-pieces-title">
                  <h3 id="interior-pieces-title">Pièces intérieures</h3>
                  {interiorPieces.length > 0 ? (
                    interiorPieces.map(renderPieceCard)
                  ) : (
                    <Card hover={false} className="p-5">
                      <p className="text-sm text-textLight">
                        Aucune pièce intérieure n’a encore été ajoutée.
                      </p>
                    </Card>
                  )}
                </section>

                <section className="space-y-4" aria-labelledby="exterior-pieces-title">
                  <h3 id="exterior-pieces-title">Espaces extérieurs</h3>
                  {exteriorPieces.length > 0 ? (
                    exteriorPieces.map(renderPieceCard)
                  ) : (
                    <Card hover={false} className="p-5">
                      <p className="text-sm text-textLight">
                        Aucun espace extérieur n’a encore été ajouté.
                      </p>
                    </Card>
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
              <SimulationGridTab
                simulationId={simulationId ?? ''}
                responses={grille?.reponses ?? []}
                requestedCategory={grille?.categorie_demandee}
                onResponseSaved={handleResponseSaved}
                onReturnToPieces={() => setActiveTab('pieces')}
                onResultVisibleChange={setHasSimulationResult}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
