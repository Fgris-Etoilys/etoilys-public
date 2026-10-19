import { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bath,
  BedDouble,
  ChefHat,
  CheckCircle2,
  Computer,
  DoorOpen,
  Footprints,
  Loader2,
  Pencil,
  Ruler,
  Sofa,
  Trash2,
  Trees,
  Tv,
  Utensils,
} from 'lucide-react';
import {
  formatFactuellePieceType,
  getFactuellePieceName,
  pieceCompletion,
  pieceAlert,
  sanitaireUsedInGrid,
} from '../../../utils/factuellePieces';
import type {
  EvaluationFactuelle,
  FactuellePieceType,
  PieceFactuelle,
} from '../../../utils/simulatorFactuelle.types';

const PIECE_ICONS: Record<FactuellePieceType, typeof BedDouble> = {
  CUISINE: ChefHat,
  SEJOUR: Sofa,
  SALLE_A_MANGER: Utensils,
  SALON: Tv,
  CHAMBRE: BedDouble,
  BUREAU: Computer,
  PIECE_SANS_OUVRANT: DoorOpen,
  COULOIRS_ET_DEGAGEMENTS: Footprints,
  SALLE_DE_BAIN: Bath,
  LOGGIA_BALCON_VERANDA: DoorOpen,
  TERRASSE_OU_JARDIN_PRIVE: Trees,
  PARC_OU_JARDIN: Trees,
};

const formatNumber = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });

interface FactuellePieceCardProps {
  piece: PieceFactuelle;
  evaluation: EvaluationFactuelle | null;
  category: string | null;
  /** Rang dans l'ordre des salles d'eau. */
  priority?: { index: number; count: number } | undefined;
  /** Écriture en cours sur cette pièce. */
  busy: boolean;
  /** Une autre écriture est en cours ou une actualisation est requise. */
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onMove: (direction: -1 | 1) => void;
}

export default function FactuellePieceCard({
  piece,
  evaluation,
  category,
  priority,
  busy,
  disabled,
  onEdit,
  onDelete,
  onMove,
}: FactuellePieceCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const name = getFactuellePieceName(piece);
  const Icon = PIECE_ICONS[piece.type_piece];
  const completion = pieceCompletion(evaluation, piece.id);
  const alert = pieceAlert(evaluation, piece, category);
  const sanitaryUsage = priority ? sanitaireUsedInGrid(evaluation, piece.id, category) : null;
  const hasCouchages = piece.couchages.length > 0;

  return (
    <div
      className="classement-piece"
      data-testid={`factuelle-piece-${piece.id}`}
      data-factuelle-piece={piece.id}
      aria-busy={busy}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="classement-piece-heading min-w-0 flex-1">
            <span className="classement-piece-icon">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0">{name}</span>
          </h3>
          {busy ? (
            <span role="status" className="shrink-0 text-muted">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              <span className="sr-only">Enregistrement en cours</span>
            </span>
          ) : (
            completion === 'complete' && (
              <CheckCircle2
                role="img"
                aria-label="Pièce renseignée"
                className="h-5 w-5 shrink-0 text-success-500"
              />
            )
          )}
        </div>
        {piece.nom?.trim() && (
          <p className="mt-1 pl-[52px] text-xs text-muted">
            {formatFactuellePieceType(piece.type_piece)}
          </p>
        )}

        <dl className="classement-piece-facts">
          {piece.type_piece !== 'SALLE_DE_BAIN' && (
            <div>
              <dt className="flex items-center gap-2">
                <Ruler aria-hidden="true" className="h-4 w-4" />
                Surface
              </dt>
              <dd>{piece.surface === null ? '—' : `${formatNumber(piece.surface)} m²`}</dd>
            </div>
          )}
          {hasCouchages && (
            <div>
              <dt className="flex items-center gap-2">
                <BedDouble aria-hidden="true" className="h-4 w-4" />
                Couchages
              </dt>
              <dd>{piece.total_places ?? '—'}</dd>
            </div>
          )}
          {priority && (
            <div>
              <dt>Priorité</dt>
              <dd>
                {priority.index + 1}
                {sanitaryUsage !== null && (
                  <span className="ml-2 align-middle text-xs font-normal text-muted">
                    {sanitaryUsage ? 'Prise en compte' : 'Supplémentaire'}
                  </span>
                )}
              </dd>
            </div>
          )}
        </dl>

        {completion === 'missing' && (
          <p className="flex items-center gap-1 text-sm text-warning-500">
            <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />À compléter
          </p>
        )}
        {alert && (
          <p
            className={`mt-2 text-sm ${alert.tone === 'error' ? 'text-alert-400' : 'text-warning-500'}`}
            role="note"
          >
            {alert.text}
          </p>
        )}
      </div>

      {isConfirmingDelete ? (
        <div className="mt-4 space-y-2 border-t border-alert-200 pt-3" role="alert">
          <p className="text-xs font-medium text-alert-500">Confirmer la suppression ?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="ui-focus min-h-11 rounded-control border border-ink/15 px-3 text-sm text-ink hover:bg-paper"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="ui-focus min-h-11 rounded-control border border-alert-200 bg-alert-100 px-3 text-sm text-alert-500 disabled:opacity-50"
              disabled={disabled}
              onClick={() => void onDelete()}
            >
              {busy ? '...' : 'Supprimer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="classement-piece-actions">
          <div className="flex items-center">
            <button
              type="button"
              className="ui-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm text-ink hover:bg-paper disabled:opacity-50"
              aria-label={`Modifier ${name}`}
              disabled={disabled}
              onClick={onEdit}
            >
              <Pencil aria-hidden="true" className="h-4 w-4" />
              Modifier
            </button>
            {priority && (
              <>
                <button
                  type="button"
                  className="factuelle-icon-action ui-focus"
                  aria-label={`Monter ${name}`}
                  title="Monter"
                  disabled={disabled || priority.index === 0}
                  onClick={() => onMove(-1)}
                >
                  <ArrowUp aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="factuelle-icon-action ui-focus"
                  aria-label={`Descendre ${name}`}
                  title="Descendre"
                  disabled={disabled || priority.index === priority.count - 1}
                  onClick={() => onMove(1)}
                >
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="ui-focus inline-flex h-11 w-11 items-center justify-center rounded-control text-muted hover:bg-alert-100 hover:text-alert-500 disabled:opacity-50"
            aria-label={`Supprimer ${name}`}
            disabled={disabled}
            onClick={() => setIsConfirmingDelete(true)}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
