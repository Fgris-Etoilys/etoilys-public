import { useEffect, useId, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SimulatorDialog from '../SimulatorDialog';
import {
  buildFactuelleCouchage,
  buildFactuellePieceInput,
  createFactuellePieceDraft,
  supportsCouchages,
  type FactuelleFieldErrors,
  type FactuellePieceDraft,
} from '../../../utils/factuellePieceDraft';
import {
  factuellePieceSection,
  formatFactuellePieceType,
  getFactuellePieceName,
  INSPECTION_PRESENTATION,
  resolveFieldAnchor,
  visibleInspectionFields,
} from '../../../utils/factuellePieces';
import type {
  BesoinFait,
  CatalogueFaits,
  FactuellePieceType,
  PieceFactuelle,
  PieceFactuelleInput,
} from '../../../utils/simulatorFactuelle.types';
import {
  BooleanChoice,
  Counter,
  FactuelleSection,
  NumberField,
  TextField,
  type FieldHighlights,
} from './FactuelleFields';
import { FactuelleCouchages } from './FactuelleCouchages';
import { FactuelleSanitaires } from './FactuelleSanitaires';

export interface FactuelleModalMessage {
  tone: 'error' | 'warning';
  text: string;
}

interface FactuellePieceModalProps {
  /** `null` : création. */
  piece: PieceFactuelle | null;
  initialType: FactuellePieceType;
  /** Types proposés en création ; en modification le type est immuable. */
  types: FactuellePieceType[];
  catalogue: CatalogueFaits;
  /** Besoins manquants de la pièce, repérés en rouge à l'ouverture. */
  needs: BesoinFait[];
  /** Champ ciblé depuis la vérification ou la Grille. */
  targetField?: string | undefined;
  saving: boolean;
  /** Autre écriture en cours ou actualisation requise : la saisie reste possible, pas l'enregistrement. */
  submitBlocked: boolean;
  message: FactuelleModalMessage | null;
  /** Erreurs de champ renvoyées par le backend pour la dernière tentative. */
  serverErrors: FactuelleFieldErrors;
  /** Pièces apparues depuis une création non confirmée : vérification explicite avant un nouvel ajout. */
  creationReview: PieceFactuelle[];
  onAcknowledgeReview: () => void;
  needsRefresh: boolean;
  isRefreshing: boolean;
  helpOpen: boolean;
  onRefresh: () => void;
  onClose: () => void;
  onSubmit: (payload: PieceFactuelleInput) => void;
  onOpenHelp: (criterionNumber: number) => void;
}

function couchageIdOf(field: string): string | null {
  const match = /^couchages\.([^.]+)\./.exec(field);
  return match?.[1] ?? null;
}

function buildHighlights(
  needs: BesoinFait[],
  targetField: string | undefined,
  draft: FactuellePieceDraft
): FieldHighlights {
  const highlights: Record<string, 'missing' | 'context'> = {};
  for (const need of needs) {
    if (need.manquant) {
      highlights[resolveFieldAnchor(need.champ, draft).field] = 'missing';
    }
  }
  if (targetField) {
    const anchor = resolveFieldAnchor(targetField, draft).field;
    highlights[anchor] ??= 'context';
  }
  return highlights;
}

/** Une seule fenêtre par pièce ; brouillon local, une seule mutation à l'enregistrement. */
export default function FactuellePieceModal({
  piece,
  initialType,
  types,
  catalogue,
  needs,
  targetField,
  saving,
  submitBlocked,
  message,
  serverErrors,
  creationReview,
  onAcknowledgeReview,
  needsRefresh,
  isRefreshing,
  helpOpen,
  onRefresh,
  onClose,
  onSubmit,
  onOpenHelp,
}: FactuellePieceModalProps) {
  const typeSelectId = useId();
  const [draft, setDraft] = useState(() =>
    createFactuellePieceDraft(piece?.type_piece ?? initialType, piece ?? undefined)
  );
  const [highlights] = useState(() => buildHighlights(needs, targetField, draft));
  const initialFocusField = targetField
    ? resolveFieldAnchor(targetField, draft).field
    : Object.keys(highlights)[0];
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    initialFocusField ? couchageIdOf(initialFocusField) : null
  );
  const [attempted, setAttempted] = useState(false);
  const [rowCheckId, setRowCheckId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ field: string; nonce: number } | null>(() =>
    initialFocusField ? { field: initialFocusField, nonce: 0 } : null
  );

  const built = useMemo(() => buildFactuellePieceInput(draft, catalogue), [draft, catalogue]);
  const checkedRow = draft.couchages.find((row) => row.id === rowCheckId);
  const errors: FactuelleFieldErrors = {
    ...serverErrors,
    ...(checkedRow ? buildFactuelleCouchage(checkedRow, catalogue).errors : {}),
    ...(attempted && !built.ok ? built.errors : {}),
  };

  useEffect(() => {
    if (!focusRequest) return;
    const element = document.querySelector<HTMLElement>(
      `[data-dialog-body] [data-factuelle-field="${focusRequest.field}"]`
    );
    if (!element) return;
    element.scrollIntoView?.({ block: 'center' });
    const control =
      element.querySelector<HTMLElement>(
        'input:not(:disabled), select:not(:disabled), button[aria-pressed]:not(:disabled)'
      ) ??
      element.querySelector<HTMLElement>('button:not(:disabled)') ??
      element;
    control.focus({ preventScroll: true });
  }, [focusRequest, expandedId]);

  useEffect(() => {
    const first = Object.keys(serverErrors)[0];
    if (!first) return;
    const rowId = couchageIdOf(first);
    if (rowId) setExpandedId(rowId);
    setFocusRequest((current) => ({ field: first, nonce: (current?.nonce ?? 0) + 1 }));
  }, [serverErrors]);

  function requestFocus(field: string) {
    const rowId = couchageIdOf(field);
    if (rowId) {
      setExpandedId(rowId);
    }
    setFocusRequest((current) => ({ field, nonce: (current?.nonce ?? 0) + 1 }));
  }

  function update(partial: Partial<FactuellePieceDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  const reviewRequired = creationReview.length > 0;

  function submit() {
    if (saving || submitBlocked || reviewRequired) return;
    setAttempted(true);
    if (!built.ok) {
      const firstError = Object.keys(built.errors)[0];
      if (firstError) requestFocus(firstError);
      return;
    }
    onSubmit(built.payload);
  }

  const type = draft.type_piece;
  const sanitary = type === 'SALLE_DE_BAIN';
  const exterior = factuellePieceSection(type) === 'exterieurs';
  const reveal = (field: string) => highlights[field] !== undefined;
  const inspectionFields = visibleInspectionFields(draft, 'piece');
  const hiddenTargeted = (
    Object.keys(INSPECTION_PRESENTATION) as (keyof typeof INSPECTION_PRESENTATION)[]
  )
    .filter((field) => INSPECTION_PRESENTATION[field].section !== 'couchages')
    .filter((field) => !inspectionFields.includes(field) && reveal(`inspection.${field}`));
  const showPrise = supportsCouchages(type) || sanitary || reveal('prise');
  const showVentilation = reveal('ventilation');
  const showSecheCheveux = sanitary || reveal('inspection.seche_cheveux');
  const showConstats =
    inspectionFields.length + hiddenTargeted.length > 0 ||
    showPrise ||
    showVentilation ||
    showSecheCheveux;
  const title = piece ? `Modifier — ${getFactuellePieceName(piece)}` : 'Ajouter une pièce';

  return (
    <SimulatorDialog
      title={title}
      eyebrow="Votre logement"
      closeLabel="Fermer sans enregistrer"
      closeOnOverlayClick={false}
      paused={helpOpen}
      onClose={onClose}
      onSubmit={submit}
      footer={
        <>
          <button type="button" className="factuelle-dialog-cancel ui-focus" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            className="factuelle-dialog-submit ui-focus"
            disabled={saving || submitBlocked || reviewRequired}
          >
            {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {saving ? 'Enregistrement...' : piece ? 'Sauvegarder' : 'Ajouter'}
          </button>
        </>
      }
    >
      <FactuelleSection title="Caractéristiques">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="factuelle-field min-w-0" data-factuelle-field="type_piece">
            <span className="factuelle-label">
              <label htmlFor={typeSelectId}>Type</label>
            </span>
            <select
              id={typeSelectId}
              className="ui-field h-11 px-3"
              value={type}
              disabled={piece !== null}
              data-dialog-initial-focus={piece === null && !initialFocusField ? '' : undefined}
              onChange={(event) => {
                const next = types.find((entry) => entry === event.target.value);
                if (next) update({ type_piece: next });
              }}
            >
              {(piece ? [piece.type_piece] : types).map((entry) => (
                <option key={entry} value={entry}>
                  {formatFactuellePieceType(entry)}
                </option>
              ))}
            </select>
            {errors.type_piece && <p className="factuelle-error">{errors.type_piece}</p>}
          </div>
          {!exterior && (
            <TextField
              field="nom"
              label="Nom (facultatif)"
              value={draft.nom}
              maxLength={255}
              error={errors.nom}
              onChange={(nom) => update({ nom })}
            />
          )}
          {!sanitary && (
            <NumberField
              field="surface"
              label="Surface (m²)"
              value={draft.surface}
              error={errors.surface}
              highlights={highlights}
              onChange={(surface) => update({ surface })}
            />
          )}
          {supportsCouchages(type) && (
            <BooleanChoice
              field="ouvrant"
              label="Ouvrant sur l’extérieur"
              value={draft.ouvrant}
              highlights={highlights}
              onChange={(ouvrant) => update({ ouvrant })}
            />
          )}
          {type === 'PARC_OU_JARDIN' && (
            <BooleanChoice
              field="commun"
              label="Commun à d’autres logements ?"
              value={draft.commun}
              highlights={highlights}
              onChange={(commun) => update({ commun })}
            />
          )}
        </div>
      </FactuelleSection>

      {showConstats && (
        <FactuelleSection title="Constats et équipements">
          <div className="grid gap-4 sm:grid-cols-2">
            {showPrise && (
              <BooleanChoice
                field="prise"
                label="Prise libre"
                value={draft.prise}
                highlights={highlights}
                onHelp={() => onOpenHelp(3)}
                onChange={(prise) => update({ prise })}
              />
            )}
            {showVentilation && (
              <BooleanChoice
                field="ventilation"
                label="Ventilation"
                value={draft.ventilation}
                highlights={highlights}
                onChange={(ventilation) => update({ ventilation })}
              />
            )}
            {[...inspectionFields, ...hiddenTargeted].map((field) => (
              <BooleanChoice
                key={field}
                field={`inspection.${field}`}
                label={INSPECTION_PRESENTATION[field].label}
                value={draft.inspection[field]}
                highlights={highlights}
                onHelp={() => onOpenHelp(INSPECTION_PRESENTATION[field].help)}
                onChange={(value) =>
                  update({ inspection: { ...draft.inspection, [field]: value } })
                }
              />
            ))}
            {showSecheCheveux && (
              <Counter
                field="inspection.seche_cheveux"
                label="Nombre de sèche-cheveux"
                value={draft.inspection.seche_cheveux}
                error={errors['inspection.seche_cheveux']}
                highlights={highlights}
                onChange={(seche_cheveux) =>
                  update({ inspection: { ...draft.inspection, seche_cheveux } })
                }
              />
            )}
          </div>
        </FactuelleSection>
      )}

      <FactuelleCouchages
        draft={draft}
        catalogue={catalogue}
        errors={errors}
        highlights={highlights}
        expandedId={expandedId}
        onExpand={(id) => {
          setExpandedId(id);
          setRowCheckId(null);
        }}
        onRowIncomplete={(field) => {
          setRowCheckId(couchageIdOf(field));
          requestFocus(field);
        }}
        onFocusField={requestFocus}
        onChange={update}
        onOpenHelp={onOpenHelp}
      />

      {sanitary && (
        <FactuelleSanitaires
          draft={draft}
          catalogue={catalogue}
          errors={errors}
          highlights={highlights}
          onChange={update}
          onOpenHelp={onOpenHelp}
        />
      )}

      <div aria-live="polite" className="space-y-3">
        {message && (
          <p
            role="alert"
            className={
              message.tone === 'error' ? 'factuelle-message-error' : 'factuelle-message-warning'
            }
          >
            {message.text}
          </p>
        )}
        {needsRefresh && (
          <button
            type="button"
            className="factuelle-secondary-action ui-focus"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            {isRefreshing ? 'Actualisation...' : 'Actualiser les pièces'}
          </button>
        )}
        {reviewRequired && (
          <div className="factuelle-message-warning" role="alert">
            <p>
              Pièces apparues depuis l’envoi :{' '}
              {creationReview.map(getFactuellePieceName).join(', ')}. Vérifiez la liste avant un
              nouvel ajout.
            </p>
            <button
              type="button"
              className="factuelle-secondary-action ui-focus mt-3"
              onClick={onAcknowledgeReview}
            >
              J’ai vérifié la liste
            </button>
          </div>
        )}
      </div>
    </SimulatorDialog>
  );
}
