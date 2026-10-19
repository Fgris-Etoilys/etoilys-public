import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import CriterionHelpDialog from '../CriterionHelpDialog';
import FactuellePieceCard from './FactuellePieceCard';
import FactuellePieceModal, { type FactuelleModalMessage } from './FactuellePieceModal';
import { FactuelleSurfaceGroup, FactuelleSurfaceSummary } from './FactuelleSurfaces';
import { useToast } from '../../ui/Toast';
import type { CritereAide } from '../../../content/criteresAide';
import type { GridCriterion, GridSummary } from '../../../content/simulatorGrid';
import type {
  FactuelleMutationOutcome,
  FactuelleSimulationState,
  FactuelleSnapshot,
} from '../../../hooks/useFactuelleSimulation';
import {
  trackClassementSimulatorPieceDeleted,
  trackClassementSimulatorPieceSaved,
} from '../../../utils/analytics';
import { getCachedCriterionHelp, loadCriterionHelp } from '../../../utils/criterionHelp';
import {
  availableFactuelleTypes,
  FACTUELLE_SECTIONS,
  getFactuellePieceName,
  moveSanitaire,
  pieceNeeds,
  piecesOfSection,
  SANITAIRES_ORDER_HELP,
  sectionForTarget,
  surfacesForCategory,
} from '../../../utils/factuellePieces';
import { getSimulatorApiErrorMessage } from '../../../utils/simulatorApi';
import {
  createFactuellePiece,
  deleteFactuellePiece,
  reorderSanitaires,
  updateFactuellePiece,
} from '../../../utils/simulatorFactuelleApi';
import type {
  BesoinFait,
  FactuellePieceSection,
  FactuellePieceTarget,
  FactuellePieceType,
  PieceFactuelle,
  PieceFactuelleInput,
} from '../../../utils/simulatorFactuelle.types';

interface FactuellePiecesTabProps {
  factuelle: FactuelleSimulationState;
  snapshot: FactuelleSnapshot;
  gridSummary: GridSummary | null;
  /** Sauvegarde d'un paramètre en cours : aucune écriture de pièce n'est proposée. */
  contextBusy: boolean;
  target: FactuellePieceTarget | null;
  onTargetHandled: () => void;
  /** Faits modifiés ou issue incertaine : les résultats affichés deviennent à recalculer. */
  onFactsChanged: () => void;
}

interface ModalState {
  key: number;
  piece: PieceFactuelle | null;
  initialType: FactuellePieceType;
  needs: BesoinFait[];
  targetField?: string | undefined;
}

interface HelpState {
  criterion: GridCriterion;
  aide: CritereAide | null;
  isLoading: boolean;
}

const ADD_LABELS: Record<FactuellePieceSection, string> = {
  interieurs: 'Ajouter une pièce',
  sanitaires: 'Ajouter une salle d’eau',
  exterieurs: 'Ajouter un extérieur',
};

const SAVE_FALLBACK = 'La pièce n’a pas pu être enregistrée. Veuillez réessayer.';
const BLOCKED_MESSAGE = 'Une autre modification est en cours. Réessayez dans un instant.';

function defaultType(types: FactuellePieceType[]): FactuellePieceType | undefined {
  return types.includes('CHAMBRE') ? 'CHAMBRE' : types[0];
}

/** Message d'une création ou modification dont l'issue n'a pas pu être confirmée. */
function uncertainSaveMessage(
  outcome: Extract<FactuelleMutationOutcome, { status: 'uncertain' }>,
  isCreation: boolean
): FactuelleModalMessage {
  if (outcome.newPieces === null) {
    return {
      tone: 'error',
      text: 'L’enregistrement n’a pas pu être confirmé. Actualisez les pièces avant de réessayer ; votre saisie est conservée.',
    };
  }
  if (isCreation && outcome.newPieces.length > 0) {
    const names = outcome.newPieces.map(getFactuellePieceName).join(', ');
    return {
      tone: 'warning',
      text: `L’enregistrement n’a pas pu être confirmé. Pièces apparues depuis : ${names}. Vérifiez la liste avant de réessayer ; votre saisie est conservée.`,
    };
  }

  return {
    tone: 'warning',
    text: 'L’enregistrement n’a pas pu être confirmé. Les pièces ont été actualisées : vérifiez-les avant de réessayer ; votre saisie est conservée.',
  };
}

export default function FactuellePiecesTab({
  factuelle,
  snapshot,
  gridSummary,
  contextBusy,
  target,
  onTargetHandled,
  onFactsChanged,
}: FactuellePiecesTabProps) {
  const { showToast } = useToast();
  const { faits, catalogue, evaluation } = snapshot;
  const pieces = faits.logement.pieces;
  const category = faits.parametres.categorie_demandee;
  const [section, setSection] = useState<FactuellePieceSection>('interieurs');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [modalMessage, setModalMessage] = useState<FactuelleModalMessage | null>(null);
  const [help, setHelp] = useState<HelpState | null>(null);
  const [focusAdd, setFocusAdd] = useState(0);
  const modalKeyRef = useRef(0);
  const tabRefs = useRef<Partial<Record<FactuellePieceSection, HTMLButtonElement | null>>>({});
  const addRefs = useRef<Partial<Record<FactuellePieceSection, HTMLButtonElement | null>>>({});

  const pending = factuelle.pending;
  const locked = pending !== null || contextBusy || factuelle.needsRefresh;
  const sectionPieces = piecesOfSection(pieces, section);
  const creatableTypes = availableFactuelleTypes(catalogue, pieces, section);

  function openModal(
    piece: PieceFactuelle | null,
    initialType: FactuellePieceType,
    needs: BesoinFait[],
    targetField?: string
  ) {
    modalKeyRef.current += 1;
    setModalMessage(null);
    setModal({ key: modalKeyRef.current, piece, initialType, needs, targetField });
  }

  function openEdit(piece: PieceFactuelle, targetField?: string, criterionNumber?: number | null) {
    const needs = pieceNeeds(evaluation, piece.id).filter(
      (need) => need.manquant && (criterionNumber == null || need.num_critere === criterionNumber)
    );
    openModal(piece, piece.type_piece, needs, targetField);
  }

  const handleTarget = useEffectEvent((next: FactuellePieceTarget) => {
    const nextSection = sectionForTarget(next, pieces);
    setSection(nextSection);
    const piece = pieces.find((candidate) => candidate.id === next.piece_id);
    if (piece) {
      openEdit(piece, next.champ, next.num_critere);
    } else {
      // Besoin sans pièce existante : l'action d'ajout de la bonne section reçoit le focus.
      setModal(null);
      setFocusAdd((current) => current + 1);
    }
    onTargetHandled();
  });

  useEffect(() => {
    if (target) handleTarget(target);
  }, [target]);

  useEffect(() => {
    if (focusAdd === 0) return;
    const button = addRefs.current[section];
    button?.scrollIntoView?.({ block: 'center' });
    button?.focus({ preventScroll: true });
  }, [focusAdd, section]);

  function closeModal() {
    if (pending && (pending.kind === 'create' || pending.kind === 'update')) return;
    setModal(null);
    setModalMessage(null);
  }

  async function submitPiece(payload: PieceFactuelleInput) {
    if (!modal) return;
    const piece = modal.piece;
    setModalMessage(null);
    const outcome = await factuelle.mutate(
      piece ? { kind: 'update', pieceId: piece.id } : { kind: 'create' },
      (id) =>
        piece ? updateFactuellePiece(id, piece.id, payload) : createFactuellePiece(id, payload)
    );

    switch (outcome.status) {
      case 'success':
        setModal(null);
        onFactsChanged();
        trackClassementSimulatorPieceSaved({
          pieceAction: piece ? 'updated' : 'created',
          pieceType: payload.type_piece,
          pieceScope: section === 'exterieurs' ? 'exterior' : 'interior',
          pieceCount: outcome.result.faits.logement.pieces.length,
        });
        showToast(piece ? 'La pièce a été modifiée.' : 'La pièce a été ajoutée.', {
          type: 'success',
        });
        return;
      case 'refused':
        setModalMessage({
          tone: 'error',
          text: getSimulatorApiErrorMessage(outcome.error, SAVE_FALLBACK, 'savePiece'),
        });
        return;
      case 'uncertain':
        onFactsChanged();
        setModalMessage(uncertainSaveMessage(outcome, piece === null));
        return;
      case 'blocked':
        setModalMessage({ tone: 'warning', text: BLOCKED_MESSAGE });
        return;
      case 'stale':
        return;
    }
  }

  async function deletePiece(piece: PieceFactuelle) {
    const outcome = await factuelle.mutate({ kind: 'delete', pieceId: piece.id }, (id) =>
      deleteFactuellePiece(id, piece.id)
    );
    if (outcome.status === 'success') {
      onFactsChanged();
      trackClassementSimulatorPieceDeleted({
        pieceType: piece.type_piece,
        pieceScope: section === 'exterieurs' ? 'exterior' : 'interior',
        pieceCount: outcome.result.faits.logement.pieces.length,
      });
      showToast('La pièce a été supprimée.', { type: 'success' });
    } else if (outcome.status === 'refused') {
      showToast(
        getSimulatorApiErrorMessage(
          outcome.error,
          'Cette pièce n’a pas pu être supprimée. Veuillez réessayer.',
          'deletePiece'
        ),
        { type: 'error' }
      );
    } else if (outcome.status === 'uncertain') {
      onFactsChanged();
      showToast('La suppression n’a pas pu être confirmée. Vérifiez la liste des pièces.', {
        type: 'error',
      });
    } else if (outcome.status === 'blocked') {
      showToast(BLOCKED_MESSAGE, { type: 'info' });
    }
  }

  async function movePiece(piece: PieceFactuelle, direction: -1 | 1) {
    const order = moveSanitaire(pieces, piece.id, direction);
    if (!order) return;
    const outcome = await factuelle.mutate({ kind: 'reorder', pieceId: piece.id }, (id) =>
      reorderSanitaires(id, order)
    );
    if (outcome.status === 'success') {
      onFactsChanged();
      showToast('L’ordre des salles d’eau a été enregistré.', { type: 'success' });
    } else if (outcome.status === 'refused') {
      showToast(
        getSimulatorApiErrorMessage(
          outcome.error,
          'L’ordre n’a pas pu être enregistré.',
          'savePiece'
        ),
        { type: 'error' }
      );
    } else if (outcome.status === 'uncertain') {
      onFactsChanged();
      showToast('L’ordre n’a pas pu être confirmé. Vérifiez la liste des salles d’eau.', {
        type: 'error',
      });
    } else if (outcome.status === 'blocked') {
      showToast(BLOCKED_MESSAGE, { type: 'info' });
    }
  }

  function openHelp(criterionNumber: number) {
    const criterion: GridCriterion = gridSummary?.criteriaByNumber.get(criterionNumber) ?? {
      num_critere: criterionNumber,
      libelle: `Critère ${criterionNumber}`,
      points: 0,
      peut_etre_non_applicable: false,
      categories: [],
    };
    const cache = getCachedCriterionHelp();
    setHelp({
      criterion,
      aide: cache?.[String(criterionNumber)] ?? null,
      isLoading: cache === null,
    });
    if (cache) return;
    void loadCriterionHelp()
      .then((aides) => aides[String(criterionNumber)] ?? null)
      .catch(() => null)
      .then((aide) =>
        setHelp((current) =>
          current?.criterion.num_critere === criterionNumber
            ? { criterion, aide, isLoading: false }
            : current
        )
      );
  }

  function handleSectionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = FACTUELLE_SECTIONS.length - 1;
    const nextIndex =
      event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    const next = nextIndex === null ? undefined : FACTUELLE_SECTIONS[nextIndex];
    if (!next) return;
    event.preventDefault();
    setSection(next.id);
    tabRefs.current[next.id]?.focus();
  }

  const missingParameters = faits.parametres.parametres_manquants;
  if (missingParameters.length > 0) {
    return (
      <div className="simulator-warning" role="status">
        <p className="font-semibold">
          Renseignez d’abord les paramètres de la simulation pour décrire les pièces.
        </p>
      </div>
    );
  }

  const surfaces = surfacesForCategory(evaluation, category);
  const sanitaires = piecesOfSection(pieces, 'sanitaires');

  return (
    <>
      {surfaces && (
        <FactuelleSurfaceSummary surfaces={surfaces} capacity={faits.parametres.capacite_accueil} />
      )}

      <div className="classement-piece-sections">
        {factuelle.needsRefresh && (
          <div className="factuelle-message-error" role="alert">
            <p>Les pièces doivent être actualisées avant toute nouvelle modification.</p>
            <button
              type="button"
              className="factuelle-secondary-action ui-focus mt-3"
              disabled={factuelle.isRefreshing}
              onClick={() => void factuelle.refresh()}
            >
              {factuelle.isRefreshing ? 'Actualisation...' : 'Actualiser les pièces'}
            </button>
          </div>
        )}

        <div role="tablist" aria-label="Sections du logement" className="factuelle-section-tabs">
          {FACTUELLE_SECTIONS.map((item, index) => {
            const selected = section === item.id;
            const count = piecesOfSection(pieces, item.id).length;
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[item.id] = element;
                }}
                type="button"
                role="tab"
                id={`factuelle-section-${item.id}`}
                aria-selected={selected}
                aria-controls="factuelle-section-panel"
                tabIndex={selected ? 0 : -1}
                className="factuelle-section-tab ui-focus"
                onClick={() => setSection(item.id)}
                onKeyDown={(event) => handleSectionKeyDown(event, index)}
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="factuelle-section-count">{count}</span>
              </button>
            );
          })}
        </div>

        <section
          id="factuelle-section-panel"
          role="tabpanel"
          aria-labelledby={`factuelle-section-${section}`}
          className="space-y-4"
        >
          {section === 'sanitaires' && (
            <p className="text-sm text-muted">{SANITAIRES_ORDER_HELP}</p>
          )}
          {section === 'interieurs' && (
            <FactuelleSurfaceGroup surfaces={surfaces} pieces={pieces} />
          )}

          <div className="classement-pieces-grid">
            {sectionPieces.map((piece) => {
              const priorityIndex =
                piece.type_piece === 'SALLE_DE_BAIN'
                  ? sanitaires.findIndex((candidate) => candidate.id === piece.id)
                  : -1;
              return (
                <FactuellePieceCard
                  key={piece.id}
                  piece={piece}
                  evaluation={evaluation}
                  category={category}
                  priority={
                    priorityIndex >= 0
                      ? { index: priorityIndex, count: sanitaires.length }
                      : undefined
                  }
                  busy={pending?.pieceId === piece.id}
                  disabled={locked}
                  onEdit={() => openEdit(piece)}
                  onDelete={() => deletePiece(piece)}
                  onMove={(direction) => void movePiece(piece, direction)}
                />
              );
            })}
            {creatableTypes.length > 0 && (
              <button
                ref={(element) => {
                  addRefs.current[section] = element;
                }}
                type="button"
                className="classement-piece-add ui-focus"
                disabled={locked}
                onClick={() => {
                  const type = defaultType(creatableTypes);
                  if (type) openModal(null, type, []);
                }}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white">
                  <Plus aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="text-center text-sm font-semibold">{ADD_LABELS[section]}</span>
              </button>
            )}
          </div>
        </section>
      </div>

      {modal && (
        <FactuellePieceModal
          key={modal.key}
          piece={modal.piece}
          initialType={modal.initialType}
          types={modal.piece ? [modal.piece.type_piece] : creatableTypes}
          catalogue={catalogue}
          needs={modal.needs}
          targetField={modal.targetField}
          saving={
            pending !== null &&
            (pending.kind === 'create' || pending.kind === 'update') &&
            pending.pieceId === modal.piece?.id
          }
          submitBlocked={locked}
          message={modalMessage}
          needsRefresh={factuelle.needsRefresh}
          isRefreshing={factuelle.isRefreshing}
          helpOpen={help !== null}
          onRefresh={() => void factuelle.refresh()}
          onClose={closeModal}
          onSubmit={(payload) => void submitPiece(payload)}
          onOpenHelp={openHelp}
        />
      )}

      <CriterionHelpDialog
        criterion={help?.criterion ?? null}
        aide={help?.aide ?? null}
        isLoading={help?.isLoading ?? false}
        onClose={() => setHelp(null)}
      />
    </>
  );
}
