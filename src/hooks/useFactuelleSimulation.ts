import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getPublicSimulation,
  SimulatorApiError,
  type PublicSimulationDto,
} from '../utils/simulatorApi';
import { getFaits, getFaitsCatalogue } from '../utils/simulatorFactuelleApi';
import {
  parseEvaluationFactuelle,
  type BlocGlobal,
  type CatalogueFaits,
  type EvaluationFactuelle,
  type FaitsGrille,
  type MutationFaits,
} from '../utils/simulatorFactuelle.types';

export interface FactuelleSnapshot {
  faits: FaitsGrille;
  catalogue: CatalogueFaits;
  /** `null` : évaluation indisponible ; aucune complétude ni diagnostic n'est alors affiché. */
  evaluation: EvaluationFactuelle | null;
}

export type FactuelleMutationKind =
  | 'parameters'
  | 'create'
  | 'update'
  | 'delete'
  | 'reorder'
  /** Réponse manuelle ou dérogation NA d'un critère. */
  | 'criterion'
  /** Bloc de faits globaux de la Grille. */
  | 'global'
  /** `POST /verifier` et lectures du résultat : aucune autre écriture pendant le contrôle. */
  | 'verify';

export interface FactuellePendingMutation {
  kind: FactuelleMutationKind;
  pieceId?: string;
  criterionNumber?: number;
  bloc?: BlocGlobal;
}

export type FactuelleMutationOutcome =
  | { status: 'success'; result: MutationFaits }
  /** Refus certain du backend (4xx) : rien n'a été écrit. */
  | { status: 'refused'; error: unknown }
  /**
   * Issue inconnue (réseau, 5xx, réponse illisible) : l'état canonique est relu, jamais l'écriture rejouée.
   * `reconciled` : la relecture a réussi ; sinon les écritures restent bloquées jusqu'à une actualisation.
   */
  | { status: 'uncertain'; error: unknown; reconciled: boolean }
  /** Une autre mutation est en cours ou une actualisation est requise. */
  | { status: 'blocked' }
  /** La simulation ou le contexte a changé pendant l'appel : réponse ignorée. */
  | { status: 'stale' };

export type FactuelleParametersOutcome =
  | { status: 'success'; simulation: PublicSimulationDto }
  | Exclude<FactuelleMutationOutcome, { status: 'success' }>;

/** Opération exclusive sans faits en retour (vérification) : une erreur n'entraîne aucune relecture. */
export type FactuelleExclusiveOutcome<T> =
  | { status: 'success'; value: T }
  | { status: 'failed'; error: unknown }
  | { status: 'blocked' }
  | { status: 'stale' };

function isCertainRefusal(error: unknown): boolean {
  return error instanceof SimulatorApiError && error.status >= 400 && error.status < 500;
}

/** Évaluation fournie par GET simulation ou un PUT de paramètre ; une forme invalide donne `null`. */
export function readEvaluation(value: unknown): EvaluationFactuelle | null {
  if (value == null) {
    return null;
  }

  try {
    return parseEvaluationFactuelle(value);
  } catch {
    return null;
  }
}

/**
 * État FACTUELLE d'une simulation publique. Toutes les écritures (pièces, Grille, paramètres) et la
 * vérification passent par un verrou unique, refusé aussi pendant une relecture canonique ; une réponse
 * arrivée après un changement de simulation est ignorée.
 * `onSimulationReconciled` reçoit la simulation relue (paramètres, statut) après une actualisation.
 */
export function useFactuelleSimulation(
  simulationId: string | undefined,
  onSimulationReconciled?: (simulation: PublicSimulationDto) => void
) {
  const [snapshot, setSnapshot] = useState<FactuelleSnapshot | null>(null);
  const [pending, setPending] = useState<FactuellePendingMutation | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const sessionRef = useRef(0);
  const simulationIdRef = useRef(simulationId);
  const snapshotRef = useRef<FactuelleSnapshot | null>(null);
  const lockRef = useRef(false);
  const needsRefreshRef = useRef(false);
  const refreshingRef = useRef(false);
  const onSimulationReconciledRef = useRef(onSimulationReconciled);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    onSimulationReconciledRef.current = onSimulationReconciled;
  });

  useEffect(() => {
    sessionRef.current += 1;
    simulationIdRef.current = simulationId;
    lockRef.current = false;
    needsRefreshRef.current = false;
    refreshingRef.current = false;
    setSnapshot(null);
    setPending(null);
    setNeedsRefresh(false);
    setIsRefreshing(false);
  }, [simulationId]);

  const markNeedsRefresh = useCallback((value: boolean) => {
    needsRefreshRef.current = value;
    setNeedsRefresh(value);
  }, []);

  /** Chargement initial : faits et catalogue en parallèle, évaluation déjà reçue avec la simulation. */
  const load = useCallback(
    async (id: string, evaluation: EvaluationFactuelle | null): Promise<boolean> => {
      const session = sessionRef.current;
      const [faits, catalogue] = await Promise.all([getFaits(id), getFaitsCatalogue(id)]);
      if (session !== sessionRef.current || simulationIdRef.current !== id) {
        return false;
      }

      const next = { faits, catalogue, evaluation };
      // Disponible dès le retour : la page peut relire le résultat enregistré avant le rendu suivant.
      snapshotRef.current = next;
      setSnapshot(next);
      markNeedsRefresh(false);
      return true;
    },
    [markNeedsRefresh]
  );

  /**
   * Relecture canonique (simulation avec paramètres et évaluation, faits, catalogue dont les minima
   * dépendent de la capacité), sans aucune écriture. Aucune écriture ne démarre pendant la relecture.
   */
  const refresh = useCallback(async (): Promise<FactuelleSnapshot | null> => {
    const id = simulationIdRef.current;
    const current = snapshotRef.current;
    if (!id || !current || refreshingRef.current) {
      return null;
    }

    const session = sessionRef.current;
    refreshingRef.current = true;
    setIsRefreshing(true);
    try {
      const [simulation, faits, catalogue] = await Promise.all([
        getPublicSimulation(id),
        getFaits(id),
        getFaitsCatalogue(id),
      ]);
      if (session !== sessionRef.current) {
        return null;
      }

      const next = { faits, catalogue, evaluation: readEvaluation(simulation.grille?.evaluation) };
      snapshotRef.current = next;
      setSnapshot(next);
      markNeedsRefresh(false);
      onSimulationReconciledRef.current?.(simulation);
      return next;
    } catch {
      if (session === sessionRef.current) {
        markNeedsRefresh(true);
      }
      return null;
    } finally {
      if (session === sessionRef.current) {
        refreshingRef.current = false;
        setIsRefreshing(false);
      }
    }
  }, [markNeedsRefresh]);

  /**
   * Prend le verrou d'écriture ; `false` si une mutation est déjà en cours, une actualisation requise
   * ou une relecture en cours.
   */
  const acquire = useCallback((mutation: FactuellePendingMutation): boolean => {
    if (
      lockRef.current ||
      needsRefreshRef.current ||
      refreshingRef.current ||
      !snapshotRef.current
    ) {
      return false;
    }

    lockRef.current = true;
    setPending(mutation);
    return true;
  }, []);

  /** Écriture, vérification ou relecture en cours, lue sans attendre le rendu suivant. */
  const isBusy = useCallback(() => lockRef.current || refreshingRef.current, []);

  const release = useCallback((session: number) => {
    if (session !== sessionRef.current) {
      return;
    }

    lockRef.current = false;
    setPending(null);
  }, []);

  const mutate = useCallback(
    async (
      mutation: FactuellePendingMutation,
      operation: (id: string) => Promise<MutationFaits>
    ): Promise<FactuelleMutationOutcome> => {
      const id = simulationIdRef.current;
      if (!id || !acquire(mutation)) {
        return { status: 'blocked' };
      }

      const session = sessionRef.current;
      try {
        const result = await operation(id);
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }

        setSnapshot((current) =>
          current ? { ...current, faits: result.faits, evaluation: result.evaluation } : current
        );
        return { status: 'success', result };
      } catch (error) {
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }
        if (isCertainRefusal(error)) {
          return { status: 'refused', error };
        }

        markNeedsRefresh(true);
        const reloaded = await refresh();
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }
        return { status: 'uncertain', error, reconciled: reloaded !== null };
      } finally {
        release(session);
      }
    },
    [acquire, markNeedsRefresh, refresh, release]
  );

  /**
   * PUT d'un paramètre, sous le même verrou que les pièces. La réponse porte l'évaluation recalculée ;
   * une issue incertaine relit simulation et faits sans rejouer l'écriture. Après un changement de
   * capacité, le catalogue (minima des inventaires C63/C64) est relu avant de libérer le verrou.
   */
  const mutateParameters = useCallback(
    async (operation: () => Promise<PublicSimulationDto>): Promise<FactuelleParametersOutcome> => {
      const id = simulationIdRef.current;
      if (!id || !acquire({ kind: 'parameters' })) {
        return { status: 'blocked' };
      }

      const session = sessionRef.current;
      try {
        const simulation = await operation();
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }

        const grille = simulation.grille;
        const evaluation = readEvaluation(grille?.evaluation);
        const capacityChanged =
          (grille?.capacite_accueil ?? null) !==
          snapshotRef.current?.faits.parametres.capacite_accueil;
        let catalogue: CatalogueFaits | null = null;
        if (capacityChanged) {
          try {
            catalogue = await getFaitsCatalogue(id);
          } catch {
            // Paramètre enregistré, minima à relire : les écritures attendent une actualisation.
            markNeedsRefresh(true);
          }
          if (session !== sessionRef.current) {
            return { status: 'stale' };
          }
        }
        setSnapshot((current) =>
          current
            ? {
                ...current,
                catalogue: catalogue ?? current.catalogue,
                faits: {
                  ...current.faits,
                  parametres: {
                    ...current.faits.parametres,
                    categorie_demandee: grille?.categorie_demandee ?? null,
                    capacite_accueil: grille?.capacite_accueil ?? null,
                    etage: grille?.etage ?? null,
                    type_habitation: grille?.type_habitation ?? null,
                    studio: grille?.studio ?? null,
                    parametres_manquants: grille?.parametres_manquants ?? [],
                  },
                },
                evaluation,
              }
            : current
        );
        if (!evaluation) {
          void refresh();
        }
        return { status: 'success', simulation };
      } catch (error) {
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }
        if (isCertainRefusal(error)) {
          return { status: 'refused', error };
        }

        markNeedsRefresh(true);
        const reloaded = await refresh();
        if (session !== sessionRef.current) {
          return { status: 'stale' };
        }
        return { status: 'uncertain', error, reconciled: reloaded !== null };
      } finally {
        release(session);
      }
    },
    [acquire, markNeedsRefresh, refresh, release]
  );

  /**
   * Opération sous le verrou sans faits en retour (`POST /verifier` puis lecture du résultat) :
   * aucune écriture concurrente, réponse tardive ignorée, jamais de rejeu.
   */
  const exclusive = useCallback(
    async <T>(
      mutation: FactuellePendingMutation,
      operation: (id: string) => Promise<T>
    ): Promise<FactuelleExclusiveOutcome<T>> => {
      const id = simulationIdRef.current;
      if (!id || !acquire(mutation)) {
        return { status: 'blocked' };
      }

      const session = sessionRef.current;
      try {
        const value = await operation(id);
        return session === sessionRef.current ? { status: 'success', value } : { status: 'stale' };
      } catch (error) {
        return session === sessionRef.current ? { status: 'failed', error } : { status: 'stale' };
      } finally {
        release(session);
      }
    },
    [acquire, release]
  );

  return {
    snapshot,
    pending,
    needsRefresh,
    isRefreshing,
    isBusy,
    load,
    refresh,
    mutate,
    mutateParameters,
    exclusive,
  };
}

export type FactuelleSimulationState = ReturnType<typeof useFactuelleSimulation>;
