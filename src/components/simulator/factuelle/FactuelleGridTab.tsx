import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, X } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useToast } from '../../ui/Toast';
import CriterionHelpDialog from '../CriterionHelpDialog';
import { GridChapterSection, GridCriterionFrame, GridTableOfContents } from '../SimulationGridTab';
import FactuelleCriterionAnswer from './FactuelleCriterionAnswer';
import FactuelleGlobalDialog from './FactuelleGlobalDialog';
import type { FactuelleModalMessage } from './FactuellePieceModal';
import { getCriterionAnchorId, type GridSummary } from '../../../content/simulatorGrid';
import { useActiveGridSection } from '../../../hooks/useActiveGridSection';
import { useCriterionHelp } from '../../../hooks/useCriterionHelp';
import type {
  FactuelleSimulationState,
  FactuelleSnapshot,
} from '../../../hooks/useFactuelleSimulation';
import { trackClassementSimulatorHelpOpened } from '../../../utils/analytics';
import {
  factuelleCriterionState,
  factuelleProgressSummary,
  firstMissingCriterion,
  GLOBAL_CRITERIA,
  missingCriterionNumbers,
  resolveFactuelleSource,
  type FactuelleCriterionState,
  type FactuelleGridTarget,
  type FactuelleSource,
} from '../../../utils/factuelleGrille';
import { mapGlobalFieldErrors, type GlobalPayload } from '../../../utils/factuelleGlobaux';
import { getSimulatorApiErrorMessage, SimulatorApiError } from '../../../utils/simulatorApi';
import {
  answerCriterion,
  saveGlobalBlock,
  type FactuelleAnswer,
} from '../../../utils/simulatorFactuelleApi';
import type {
  BlocGlobal,
  ChangementCascade,
  EvaluationFactuelle,
} from '../../../utils/simulatorFactuelle.types';
import {
  buildSectionLinkGroups,
  filterGridChapters,
  getSectionIds,
  scrollToElement,
} from '../../../utils/simulatorGridNavigation';

export interface FactuelleAnswerSaved {
  criterionNumber: number;
  criterionStatus: string | undefined;
  validationStatus: Exclude<FactuelleAnswer, null>;
  evaluation: EvaluationFactuelle | null;
}

interface FactuelleGridTabProps {
  factuelle: FactuelleSimulationState;
  snapshot: FactuelleSnapshot;
  grid: GridSummary;
  /** Sauvegarde d'un paramètre en cours : aucune écriture n'est proposée sur un état ancien. */
  contextBusy: boolean;
  /** Critères signalés par le résultat consulté (filtre temporaire). */
  criterionFilterNumbers: number[];
  target: FactuelleGridTarget | null;
  onTargetHandled: () => void;
  onClearCriterionFilter: () => void;
  /** Besoin hors Grille (pièce, paramètre) : navigation ciblée par la page. */
  onOpenSource: (source: FactuelleSource) => void;
  /** Faits modifiés ou issue incertaine : les résultats affichés deviennent à recalculer. */
  onFactsChanged: () => void;
  onAnswerSaved: (saved: FactuelleAnswerSaved) => void;
  resultActionLabel: string;
  isCheckingResult: boolean;
  onCheckResult: () => void;
}

interface GlobalModalState {
  key: number;
  bloc: BlocGlobal;
  numero: number;
  champ: string | null;
}

const BLOCKED_MESSAGE = 'Une autre modification est en cours. Réessayez dans un instant.';
const ANSWER_FALLBACK = 'La réponse n’a pas pu être enregistrée. Veuillez réessayer.';
const GLOBAL_FALLBACK = 'Les informations n’ont pas pu être enregistrées. Veuillez réessayer.';

function uncertainGlobalMessage(reconciled: boolean): FactuelleModalMessage {
  return reconciled
    ? {
        tone: 'warning',
        text: 'L’enregistrement n’a pas pu être confirmé. Les informations ont été actualisées : vérifiez-les avant de réessayer ; votre saisie est conservée.',
      }
    : {
        tone: 'error',
        text: 'L’enregistrement n’a pas pu être confirmé. Actualisez la simulation avant de réessayer ; votre saisie est conservée.',
      };
}

/** Grille FACTUELLE : chapitres et aides du simulateur, cotations et besoins du backend uniquement. */
export default function FactuelleGridTab({
  factuelle,
  snapshot,
  grid,
  contextBusy,
  criterionFilterNumbers,
  target,
  onTargetHandled,
  onClearCriterionFilter,
  onOpenSource,
  onFactsChanged,
  onAnswerSaved,
  resultActionLabel,
  isCheckingResult,
  onCheckResult,
}: FactuelleGridTabProps) {
  const { showToast } = useToast();
  const { faits, catalogue, evaluation } = snapshot;
  const category = faits.parametres.categorie_demandee;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalKeyRef = useRef(0);
  const [search, setSearch] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [modal, setModal] = useState<GlobalModalState | null>(null);
  const [modalMessage, setModalMessage] = useState<FactuelleModalMessage | null>(null);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});
  const [focusCriterion, setFocusCriterion] = useState<{ numero: number; nonce: number } | null>(
    null
  );
  const { help, open: openHelp, close: closeHelp } = useCriterionHelp(grid);
  const sectionLinkGroups = useMemo(() => buildSectionLinkGroups(grid.chapitres), [grid]);
  const sectionIds = useMemo(() => getSectionIds(sectionLinkGroups), [sectionLinkGroups]);
  const [activeSectionId, setActiveSectionId] = useActiveGridSection(sectionIds);
  const missingNumbers = useMemo(() => missingCriterionNumbers(evaluation), [evaluation]);
  const criteres = useMemo(
    () => new Map((evaluation?.criteres ?? []).map((critere) => [critere.num_critere, critere])),
    [evaluation]
  );
  const progress = useMemo(
    () => factuelleProgressSummary(grid, evaluation, category),
    [category, evaluation, grid]
  );
  const resultFilterActive = criterionFilterNumbers.length > 0;
  const filterActive = resultFilterActive || onlyMissing;
  const filterNumbers = resultFilterActive ? criterionFilterNumbers : missingNumbers;
  const chapters = useMemo(
    () => filterGridChapters(grid.chapitres, search, filterNumbers, filterActive),
    [filterActive, filterNumbers, grid, search]
  );
  const pending = factuelle.pending;
  const locked =
    pending !== null || contextBusy || factuelle.needsRefresh || factuelle.isRefreshing;
  const isGridComplete = progress.remainingCount === 0;

  function openGlobal(bloc: BlocGlobal, numero: number, champ: string | null) {
    modalKeyRef.current += 1;
    setModalMessage(null);
    setModalErrors({});
    setModal({ key: modalKeyRef.current, bloc, numero, champ });
  }

  function revealCriterion(numero: number) {
    setSearch('');
    setOnlyMissing(false);
    if (resultFilterActive && !criterionFilterNumbers.includes(numero)) {
      onClearCriterionFilter();
    }
    setFocusCriterion((current) => ({ numero, nonce: (current?.nonce ?? 0) + 1 }));
  }

  const handleTarget = useEffectEvent((next: FactuelleGridTarget) => {
    if (next.bloc) {
      openGlobal(next.bloc, next.numero, next.champ ?? null);
    } else {
      revealCriterion(next.numero);
    }
    onTargetHandled();
  });

  useEffect(() => {
    if (target) handleTarget(target);
  }, [target]);

  useEffect(() => {
    if (!focusCriterion) return;
    const timer = window.setTimeout(() => {
      const card = document.getElementById(getCriterionAnchorId(focusCriterion.numero));
      card?.scrollIntoView?.({ block: 'center' });
      (card?.querySelector<HTMLElement>('button:not(:disabled)') ?? card)?.focus({
        preventScroll: true,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [focusCriterion]);

  function announceCascades(changements: ChangementCascade[]) {
    // Message backend bref, sans lien ni bouton, uniquement après une sauvegarde réussie.
    changements.forEach((changement) => showToast(changement.message, { type: 'info' }));
  }

  async function answer(numero: number, state: FactuelleCriterionState, value: FactuelleAnswer) {
    const outcome = await factuelle.mutate({ kind: 'criterion', criterionNumber: numero }, (id) =>
      answerCriterion(id, numero, value)
    );
    switch (outcome.status) {
      case 'success':
        onFactsChanged();
        announceCascades(outcome.result.changements_cascade);
        if (value !== null) {
          onAnswerSaved({
            criterionNumber: numero,
            criterionStatus: state.status,
            validationStatus: value,
            evaluation: outcome.result.evaluation,
          });
        }
        return;
      case 'refused':
        showToast(getSimulatorApiErrorMessage(outcome.error, ANSWER_FALLBACK), { type: 'error' });
        return;
      case 'uncertain':
        onFactsChanged();
        showToast(
          outcome.reconciled
            ? 'La réponse n’a pas pu être confirmée. La grille a été actualisée : vérifiez-la avant de réessayer.'
            : 'La réponse n’a pas pu être confirmée. Actualisez la simulation avant de continuer.',
          { type: 'error' }
        );
        return;
      case 'blocked':
        showToast(BLOCKED_MESSAGE, { type: 'info' });
        return;
      case 'stale':
        return;
    }
  }

  function openFacts(numero: number, state: FactuelleCriterionState) {
    if (state.bloc) {
      openGlobal(state.bloc, numero, state.missing[0]?.champ ?? null);
      return;
    }
    const first = state.missing[0];
    if (first) {
      onOpenSource(resolveFactuelleSource(first));
    }
  }

  async function saveGlobal(built: GlobalPayload) {
    setModalMessage(null);
    setModalErrors({});
    const outcome = await factuelle.mutate({ kind: 'global', bloc: built.bloc }, (id) =>
      saveGlobalBlock(id, built.bloc, built.payload)
    );
    switch (outcome.status) {
      case 'success':
        setModal(null);
        onFactsChanged();
        showToast('Les informations ont été enregistrées.', { type: 'success' });
        announceCascades(outcome.result.changements_cascade);
        return;
      case 'refused':
        setModalMessage({
          tone: 'error',
          text: getSimulatorApiErrorMessage(outcome.error, GLOBAL_FALLBACK),
        });
        if (outcome.error instanceof SimulatorApiError) {
          setModalErrors(mapGlobalFieldErrors(built, outcome.error.fieldErrors));
        }
        return;
      case 'uncertain':
        onFactsChanged();
        setModalMessage(uncertainGlobalMessage(outcome.reconciled));
        return;
      case 'blocked':
        setModalMessage({ tone: 'warning', text: BLOCKED_MESSAGE });
        return;
      case 'stale':
        return;
    }
  }

  function closeModal() {
    if (pending?.kind === 'global') return;
    setModal(null);
    setModalMessage(null);
    setModalErrors({});
  }

  function openCriterionHelp(numero: number, status: string | undefined) {
    trackClassementSimulatorHelpOpened({ criterionNumber: numero, criterionStatus: status });
    openHelp(numero);
  }

  function handleContinueGrid() {
    const numero = firstMissingCriterion(grid, missingNumbers);
    if (numero === null) {
      scrollToElement('grid-criteria-start');
      return;
    }
    revealCriterion(numero);
  }

  if (faits.parametres.parametres_manquants.length > 0) {
    return (
      <div className="simulator-warning" role="status">
        <p className="font-semibold">
          Renseignez d’abord les paramètres de la simulation pour compléter la grille.
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="factuelle-message-error" role="alert">
        <p>La grille ne peut pas être affichée pour le moment.</p>
        <button
          type="button"
          className="factuelle-secondary-action ui-focus mt-3"
          disabled={factuelle.isRefreshing}
          onClick={() => void factuelle.refresh()}
        >
          {factuelle.isRefreshing ? 'Actualisation...' : 'Actualiser la simulation'}
        </button>
      </div>
    );
  }

  const modalNeeds = modal
    ? evaluation.besoins.filter(
        (besoin) =>
          besoin.manquant &&
          besoin.destination === 'GRILLE' &&
          besoin.num_critere !== null &&
          GLOBAL_CRITERIA[besoin.num_critere] === modal.bloc
      )
    : [];

  return (
    <div id="grid-top" className="classement-grid space-y-7">
      <div className="classement-grid-summary">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <span className="simulator-eyebrow block">ÉTAPE 2 — GRILLE DE CONTRÔLE</span>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-ink">
              Complétez la grille de contrôle
            </h2>
            <p className="text-sm leading-comfortable text-muted">
              Renseignez les critères selon les équipements, services et caractéristiques réellement
              présents dans votre logement.
            </p>
            <div className="mt-4 flex items-start gap-3 text-ink">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-copper" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-ink">Besoin d’aide sur un critère ?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Cliquez sur l’icône livre pour afficher des explications complémentaires.
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:flex-col lg:flex-nowrap">
            {!isGridComplete && (
              <Button
                type="button"
                variant="primary"
                className="min-h-11 w-full shrink-0 gap-3 sm:w-auto"
                onClick={handleContinueGrid}
              >
                Continuer la grille
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )}
            <Button
              type="button"
              variant={isGridComplete ? 'primary' : 'secondary'}
              className={`min-h-11 w-full shrink-0 sm:w-auto ${isGridComplete ? '' : 'bg-white'}`}
              disabled={isCheckingResult || locked}
              onClick={onCheckResult}
            >
              {isCheckingResult ? 'Calcul en cours...' : resultActionLabel}
            </Button>
          </div>
        </div>
        <div className="classement-grid-progress">
          <dl className="flex flex-wrap items-end justify-between gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Critères renseignés</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">
                {progress.answeredCount} / {progress.totalCount}
              </dd>
            </div>
            <div className="text-right">
              <dt className="text-xs text-muted">Critères à compléter</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">
                {progress.remainingCount}
              </dd>
            </div>
          </dl>
          <progress
            className="classement-grid-progress-bar"
            aria-label="Progression de la grille"
            value={progress.answeredCount}
            max={progress.totalCount || 1}
          />
        </div>
      </div>

      {factuelle.needsRefresh && (
        <div className="factuelle-message-error" role="alert">
          <p>La simulation doit être actualisée avant toute nouvelle modification.</p>
          <button
            type="button"
            className="factuelle-secondary-action ui-focus mt-3"
            disabled={factuelle.isRefreshing}
            onClick={() => void factuelle.refresh()}
          >
            {factuelle.isRefreshing ? 'Actualisation...' : 'Actualiser la simulation'}
          </button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-9">
        <GridTableOfContents
          groups={sectionLinkGroups}
          activeSectionId={activeSectionId}
          onSectionSelect={(sectionId) => {
            setActiveSectionId(sectionId);
            scrollToElement(sectionId);
          }}
        />

        <div className="min-w-0 space-y-6">
          <div className="classement-grid-search">
            <Input
              ref={searchInputRef}
              label="Rechercher un critère"
              name="gridSearch"
              value={search}
              placeholder="Ex. Critère 23 ou télévision"
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="ui-focus inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control px-3 text-sm text-ink hover:bg-surface"
                onClick={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Effacer la recherche"
              >
                <X size={16} aria-hidden="true" />
                Effacer
              </button>
            )}
          </div>

          {filterActive ? (
            <div
              className="flex flex-col gap-3 border-l-2 border-copper bg-surface-warm p-4 text-sm text-ink sm:flex-row sm:items-center sm:justify-between"
              role="status"
            >
              <p>
                La grille affiche uniquement {filterNumbers.length}{' '}
                {resultFilterActive
                  ? filterNumbers.length > 1
                    ? 'critères signalés dans le résultat'
                    : 'critère signalé dans le résultat'
                  : filterNumbers.length > 1
                    ? 'critères à compléter'
                    : 'critère à compléter'}
                .
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="min-h-11 w-full bg-white sm:w-auto"
                onClick={() => {
                  setOnlyMissing(false);
                  onClearCriterionFilter();
                  searchInputRef.current?.focus();
                }}
              >
                Afficher toute la grille
              </Button>
            </div>
          ) : (
            missingNumbers.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="min-h-11 w-full bg-white sm:w-auto"
                onClick={() => setOnlyMissing(true)}
              >
                Afficher les critères à compléter ({missingNumbers.length})
              </Button>
            )
          )}

          <div id="grid-criteria-start">
            <GridChapterSection
              chapters={chapters}
              renderCriterion={(criterion) => {
                const state = factuelleCriterionState(
                  criterion,
                  criteres.get(criterion.num_critere),
                  evaluation,
                  category
                );
                return (
                  <GridCriterionFrame
                    criterion={criterion}
                    status={state.status}
                    onOpenHelp={() => openCriterionHelp(criterion.num_critere, state.status)}
                  >
                    <FactuelleCriterionAnswer
                      numero={criterion.num_critere}
                      state={state}
                      disabled={locked}
                      pending={pending?.criterionNumber === criterion.num_critere}
                      onAnswer={(value) => void answer(criterion.num_critere, state, value)}
                      onOpenFacts={() => openFacts(criterion.num_critere, state)}
                    />
                  </GridCriterionFrame>
                );
              }}
            />
          </div>

          <div className="flex flex-col justify-end gap-3 border-t border-ink/15 pt-6 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              aria-label="Calculer depuis le bas de la grille"
              disabled={isCheckingResult || locked}
              onClick={onCheckResult}
            >
              {isCheckingResult ? 'Calcul en cours...' : resultActionLabel}
            </Button>
          </div>
        </div>
      </div>

      {modal && (
        <FactuelleGlobalDialog
          key={modal.key}
          bloc={modal.bloc}
          numero={modal.numero}
          champ={modal.champ}
          globaux={faits.faits_globaux}
          catalogue={catalogue}
          capacity={faits.parametres.capacite_accueil}
          needs={modalNeeds}
          saving={pending?.kind === 'global'}
          submitBlocked={locked}
          message={modalMessage}
          serverErrors={modalErrors}
          needsRefresh={factuelle.needsRefresh}
          isRefreshing={factuelle.isRefreshing}
          helpOpen={help !== null}
          onRefresh={() => void factuelle.refresh()}
          onClose={closeModal}
          onSubmit={(built) => void saveGlobal(built)}
          onOpenHelp={(numero) => openCriterionHelp(numero, undefined)}
        />
      )}

      <CriterionHelpDialog
        criterion={help?.criterion ?? null}
        aide={help?.aide ?? null}
        isLoading={help?.isLoading ?? false}
        onClose={closeHelp}
      />
    </div>
  );
}
