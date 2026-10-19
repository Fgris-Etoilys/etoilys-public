import { Pencil, X } from 'lucide-react';
import { ResponseButton } from '../SimulationGridTab';
import {
  formatCategoriesLabel,
  type FactuelleCriterionState,
} from '../../../utils/factuelleGrille';
import type { FactuelleAnswer } from '../../../utils/simulatorFactuelleApi';

interface FactuelleCriterionAnswerProps {
  numero: number;
  state: FactuelleCriterionState;
  /** Écriture en cours, actualisation requise ou paramètre en cours d'enregistrement. */
  disabled: boolean;
  pending: boolean;
  onAnswer: (answer: FactuelleAnswer) => void;
  /** Saisie des faits : modale du bloc global ou navigation ciblée vers le premier besoin. */
  onOpenFacts: () => void;
}

/**
 * Réponse d'un critère FACTUELLE : Oui/Non manuels (NA si le modèle l'autorise), verdict automatique
 * non cliquable avec badge Auto, « Renseigner » tant que des faits manquent, dérogation NA C15/C16/C19/C26.
 */
export default function FactuelleCriterionAnswer({
  numero,
  state,
  disabled,
  pending,
  onAnswer,
  onOpenFacts,
}: FactuelleCriterionAnswerProps) {
  const locked = disabled || pending;
  const mention =
    state.mention.length > 0 ? (
      <p className="mt-2 text-xs text-muted">Pour {formatCategoriesLabel(state.mention)}</p>
    ) : null;

  if (!state.available) {
    return (
      <p className="rounded-control bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
        Ce critère n’est pas disponible pour le moment.
      </p>
    );
  }

  if (state.notApplicableOnly && !state.derogation) {
    return (
      <p className="rounded-control bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
        Ce critère n’est pas applicable à cette simulation.
      </p>
    );
  }

  if (!state.automatique) {
    const answer = state.manualAnswer;
    const choose = (next: Exclude<FactuelleAnswer, null>) => {
      if (answer !== next) onAnswer(next);
    };
    return (
      <div aria-busy={pending || undefined}>
        <div
          role="group"
          aria-label={`Réponse au critère ${numero}`}
          className="classement-response-options"
        >
          <ResponseButton
            validation="VALIDE"
            selected={answer === 'VALIDE'}
            disabled={locked}
            onClick={() => choose('VALIDE')}
          >
            Oui
          </ResponseButton>
          <ResponseButton
            validation="NON_VALIDE"
            selected={answer === 'NON_VALIDE'}
            disabled={locked}
            onClick={() => choose('NON_VALIDE')}
          >
            Non
          </ResponseButton>
          {(state.canAnswerNotApplicable || answer === 'NON_APPLICABLE') && (
            <ResponseButton
              validation="NON_APPLICABLE"
              selected={answer === 'NON_APPLICABLE'}
              disabled={locked}
              onClick={() => choose('NON_APPLICABLE')}
            >
              Non applicable
            </ResponseButton>
          )}
          {answer !== null && (
            <button
              type="button"
              className="factuelle-icon-action ui-focus"
              aria-label={`Retirer la réponse au critère ${numero}`}
              title="Retirer la réponse"
              disabled={locked}
              onClick={() => onAnswer(null)}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
        {mention}
      </div>
    );
  }

  const needsFacts = !state.derogation && state.missing.length > 0;
  return (
    <div aria-busy={pending || undefined}>
      <div
        role="group"
        aria-label={`Réponse au critère ${numero}`}
        className="classement-response-options"
      >
        {needsFacts ? (
          <button
            type="button"
            className="factuelle-secondary-action ui-focus"
            disabled={locked}
            onClick={onOpenFacts}
          >
            Renseigner
          </button>
        ) : (
          !state.derogation && (
            <>
              <ResponseButton validation="VALIDE" selected={state.verdict === 'VALIDE'} disabled>
                Oui
              </ResponseButton>
              <ResponseButton
                validation="NON_VALIDE"
                selected={state.verdict === 'NON_VALIDE'}
                disabled
              >
                Non
              </ResponseButton>
            </>
          )
        )}
        {state.canDerogate && (
          <ResponseButton
            validation="NON_APPLICABLE"
            selected={state.derogation}
            disabled={locked}
            onClick={() => onAnswer(state.derogation ? null : 'NON_APPLICABLE')}
          >
            Non applicable
          </ResponseButton>
        )}
        <span
          className="factuelle-auto-badge"
          title="Calculé à partir des informations renseignées"
        >
          Auto
        </span>
        {state.bloc && !needsFacts && (
          <button
            type="button"
            className="factuelle-icon-action ui-focus"
            aria-label={`Modifier les informations du critère ${numero}`}
            title="Modifier les informations"
            disabled={locked}
            onClick={onOpenFacts}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
      {mention}
    </div>
  );
}
