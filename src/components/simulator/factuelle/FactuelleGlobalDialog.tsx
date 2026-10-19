import { useEffect, useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import SimulatorDialog from '../SimulatorDialog';
import type { FactuelleModalMessage } from './FactuellePieceModal';
import {
  ChauffageForm,
  CommunForm,
  CuissonForm,
  FourForm,
  InventaireForm,
  LivretAccueilForm,
  MesuresForm,
  SalonAssisesForm,
  TableAssisesForm,
} from './FactuelleGlobalForms';
import { GLOBAL_BLOCK_TITLES } from '../../../utils/factuelleGrille';
import {
  buildGlobalPayload,
  createGlobalDraft,
  inventaireCatalogue,
  isGlobalSaveNoop,
  type GlobalDraft,
  type GlobalPayload,
} from '../../../utils/factuelleGlobaux';
import type { FieldHighlights } from '../../../utils/factuellePieces';
import type {
  BesoinFait,
  BlocGlobal,
  CatalogueFaits,
  FaitsGlobaux,
} from '../../../utils/simulatorFactuelle.types';

/** Nouveaux blocs 443 : « Annuler / Sauvegarder » ; blocs historiques : « Enregistrer ». */
const SAUVEGARDER_BLOCS: readonly BlocGlobal[] = [
  'chauffage',
  'mesures_energie',
  'mesures_eau',
  'c63',
  'c64',
  'c65',
];

interface FactuelleGlobalDialogProps {
  bloc: BlocGlobal;
  /** Critère ayant ouvert la modale : aide contextuelle affichée. */
  numero: number;
  /** Champ ciblé (besoin ou blocage) : défilement et focus à l'ouverture. */
  champ: string | null;
  globaux: FaitsGlobaux;
  catalogue: CatalogueFaits;
  capacity: number | null;
  /** Besoins manquants des critères du bloc, repérés à l'ouverture. */
  needs: BesoinFait[];
  saving: boolean;
  submitBlocked: boolean;
  message: FactuelleModalMessage | null;
  needsRefresh: boolean;
  isRefreshing: boolean;
  helpOpen: boolean;
  onRefresh: () => void;
  onClose: () => void;
  onSubmit: (payload: GlobalPayload) => void;
  onOpenHelp: (criterionNumber: number) => void;
}

/** `champ` backend (ex. `c25.appreciation_commune`) rattaché à un champ rendu, dans les deux sens. */
function matchesField(field: string, champ: string): boolean {
  return field === champ || champ.startsWith(`${field}.`) || field.startsWith(`${champ}.`);
}

function buildHighlights(needs: BesoinFait[], champ: string | null): FieldHighlights {
  const highlights: Record<string, 'missing' | 'context'> = {};
  for (const need of needs) {
    highlights[need.champ] = 'missing';
    // Les blocs à liste (`cuisson`, `chauffage`, mesures, inventaires) sont repérés sur leur conteneur.
    highlights[need.champ.split('.')[0] ?? need.champ] ??= 'missing';
  }
  if (champ) {
    highlights[champ] ??= 'context';
  }
  return highlights;
}

/** Une petite modale par bloc de faits globaux ; brouillon local, une seule mutation à l'enregistrement. */
export default function FactuelleGlobalDialog({
  bloc,
  numero,
  champ,
  globaux,
  catalogue,
  capacity,
  needs,
  saving,
  submitBlocked,
  message,
  needsRefresh,
  isRefreshing,
  helpOpen,
  onRefresh,
  onClose,
  onSubmit,
  onOpenHelp,
}: FactuelleGlobalDialogProps) {
  const [draft, setDraft] = useState<GlobalDraft>(() => createGlobalDraft(bloc, globaux));
  // Corps des faits enregistrés à l'ouverture : une sauvegarde identique n'envoie rien.
  const [initial] = useState(() => buildGlobalPayload(createGlobalDraft(bloc, globaux), catalogue));
  const [highlights] = useState(() => buildHighlights(needs, champ));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusRequest, setFocusRequest] = useState<{ field: string; nonce: number } | null>(() =>
    champ ? { field: champ, nonce: 0 } : null
  );
  const disabled = saving;

  useEffect(() => {
    if (!focusRequest) return;
    const fields = Array.from(
      document.querySelectorAll<HTMLElement>('[data-dialog-body] [data-factuelle-field]')
    );
    const element =
      fields.find((candidate) => candidate.dataset.factuelleField === focusRequest.field) ??
      fields.find((candidate) =>
        matchesField(candidate.dataset.factuelleField ?? '', focusRequest.field)
      );
    if (!element) return;
    element.scrollIntoView?.({ block: 'center' });
    element
      .querySelector<HTMLElement>(
        'input:not(:disabled), select:not(:disabled), button:not(:disabled)'
      )
      ?.focus({ preventScroll: true });
  }, [focusRequest]);

  function submit() {
    if (saving || submitBlocked) return;
    const built = buildGlobalPayload(draft, catalogue);
    if (!built.ok) {
      setErrors(built.errors);
      const first = Object.keys(built.errors)[0];
      if (first) {
        setFocusRequest((current) => ({ field: first, nonce: (current?.nonce ?? 0) + 1 }));
      }
      return;
    }
    setErrors({});
    if (isGlobalSaveNoop(built, initial, globaux, capacity)) {
      onClose();
      return;
    }
    onSubmit(built);
  }

  const common = { disabled, highlights };
  const inventory =
    draft.bloc === 'c63' || draft.bloc === 'c64' || draft.bloc === 'c65'
      ? inventaireCatalogue(catalogue, draft.bloc)
      : undefined;

  return (
    <SimulatorDialog
      title={GLOBAL_BLOCK_TITLES[bloc]}
      eyebrow="Grille de contrôle"
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
            disabled={saving || submitBlocked}
          >
            {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {saving
              ? 'Enregistrement...'
              : SAUVEGARDER_BLOCS.includes(bloc)
                ? 'Sauvegarder'
                : 'Enregistrer'}
          </button>
        </>
      }
    >
      <button
        type="button"
        className="ui-focus inline-flex min-h-11 items-center gap-1.5 self-start rounded-control px-2 text-xs font-medium text-copper hover:bg-paper"
        aria-label={`Afficher l’aide du critère ${numero}`}
        onClick={() => onOpenHelp(numero)}
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Aide
      </button>

      {(draft.bloc === 'c18' || draft.bloc === 'c19') && (
        <CommunForm
          bloc={draft.bloc}
          value={draft.value}
          onChange={(value) => setDraft({ bloc: draft.bloc, value })}
          {...common}
        />
      )}
      {draft.bloc === 'c25' && (
        <TableAssisesForm
          value={draft.value}
          onChange={(value) => setDraft({ bloc: 'c25', value })}
          {...common}
        />
      )}
      {draft.bloc === 'c26' && (
        <SalonAssisesForm
          value={draft.value}
          onChange={(value) => setDraft({ bloc: 'c26', value })}
          {...common}
        />
      )}
      {draft.bloc === 'c101' && (
        <LivretAccueilForm
          value={draft.value}
          onChange={(value) => setDraft({ bloc: 'c101', value })}
          {...common}
        />
      )}
      {draft.bloc === 'cuisson' && (
        <CuissonForm
          value={draft.value}
          catalogue={catalogue}
          errors={errors}
          onChange={(value) => setDraft({ bloc: 'cuisson', value })}
          {...common}
        />
      )}
      {draft.bloc === 'four_micro_ondes' && (
        <FourForm
          value={draft.value}
          catalogue={catalogue}
          onChange={(value) => setDraft({ bloc: 'four_micro_ondes', value })}
          {...common}
        />
      )}
      {draft.bloc === 'chauffage' && (
        <ChauffageForm
          value={draft.value}
          catalogue={catalogue}
          onChange={(value) => setDraft({ bloc: 'chauffage', value })}
          {...common}
        />
      )}
      {(draft.bloc === 'mesures_energie' || draft.bloc === 'mesures_eau') && (
        <MesuresForm
          field={draft.bloc}
          value={draft.value}
          options={
            draft.bloc === 'mesures_energie' ? catalogue.mesures_energie : catalogue.mesures_eau
          }
          onChange={(value) => setDraft({ bloc: draft.bloc, value })}
          {...common}
        />
      )}
      {(draft.bloc === 'c63' || draft.bloc === 'c64' || draft.bloc === 'c65') &&
        (inventory ? (
          <InventaireForm
            field={draft.bloc}
            value={draft.value}
            inventaire={inventory}
            onChange={(value) => setDraft({ bloc: draft.bloc, value })}
            {...common}
          />
        ) : (
          <p className="factuelle-message-error" role="alert">
            L’inventaire est indisponible.
          </p>
        ))}

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
            {isRefreshing ? 'Actualisation...' : 'Actualiser la simulation'}
          </button>
        )}
      </div>
    </SimulatorDialog>
  );
}
