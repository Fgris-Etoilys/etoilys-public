import { useCallback, useEffect, useRef, useState } from 'react';
import { SimulatorApiError } from '../utils/simulatorApi';
import { getFaits, getFaitsCatalogue, getFaitsEvaluation } from '../utils/simulatorFactuelleApi';
import {
  parseEvaluationFactuelle,
  type CatalogueFaits,
  type EvaluationFactuelle,
  type FaitsGrille,
  type MutationFaits,
  type PieceFactuelle,
} from '../utils/simulatorFactuelle.types';

export interface FactuelleSnapshot {
  faits: FaitsGrille;
  catalogue: CatalogueFaits;
  /** `null` : évaluation indisponible ; aucune complétude ni diagnostic n'est alors affiché. */
  evaluation: EvaluationFactuelle | null;
}

export type FactuelleMutationKind = 'parameters' | 'create' | 'update' | 'delete' | 'reorder';

export interface FactuellePendingMutation {
  kind: FactuelleMutationKind;
  pieceId?: string;
}

export type FactuelleMutationOutcome =
  | { status: 'success'; result: MutationFaits }
  /** Refus certain du backend (4xx) : rien n'a été écrit. */
  | { status: 'refused'; error: unknown }
  /**
   * Issue inconnue (réseau, 5xx, réponse illisible) : l'état canonique est relu, jamais l'écriture rejouée.
   * `newPieces` liste les pièces apparues depuis l'envoi d'une création (`null` si la relecture a échoué).
   */
  | { status: 'uncertain'; error: unknown; newPieces: PieceFactuelle[] | null }
  /** Une autre mutation est en cours ou une actualisation est requise. */
  | { status: 'blocked' }
  /** La simulation ou le contexte a changé pendant l'appel : réponse ignorée. */
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
 * État FACTUELLE d'une simulation publique. Toutes les écritures (pièces et paramètres) passent par
 * un verrou unique ; une réponse arrivée après un changement de simulation est ignorée.
 */
export function useFactuelleSimulation(simulationId: string | undefined) {
  const [snapshot, setSnapshot] = useState<FactuelleSnapshot | null>(null);
  const [pending, setPending] = useState<FactuellePendingMutation | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const sessionRef = useRef(0);
  const simulationIdRef = useRef(simulationId);
  const snapshotRef = useRef<FactuelleSnapshot | null>(null);
  const lockRef = useRef(false);
  const needsRefreshRef = useRef(false);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    sessionRef.current += 1;
    simulationIdRef.current = simulationId;
    lockRef.current = false;
    needsRefreshRef.current = false;
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

      setSnapshot({ faits, catalogue, evaluation });
      markNeedsRefresh(false);
      return true;
    },
    [markNeedsRefresh]
  );

  /** Relecture canonique (faits + évaluation), sans aucune écriture. */
  const refresh = useCallback(async (): Promise<FactuelleSnapshot | null> => {
    const id = simulationIdRef.current;
    const current = snapshotRef.current;
    if (!id || !current) {
      return null;
    }

    const session = sessionRef.current;
    setIsRefreshing(true);
    try {
      const [faits, evaluation] = await Promise.all([getFaits(id), getFaitsEvaluation(id)]);
      if (session !== sessionRef.current) {
        return null;
      }

      const next = { ...current, faits, evaluation };
      setSnapshot(next);
      markNeedsRefresh(false);
      return next;
    } catch {
      if (session === sessionRef.current) {
        markNeedsRefresh(true);
      }
      return null;
    } finally {
      if (session === sessionRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [markNeedsRefresh]);

  /** Prend le verrou d'écriture ; `false` si une mutation est déjà en cours ou une actualisation requise. */
  const acquire = useCallback((mutation: FactuellePendingMutation): boolean => {
    if (lockRef.current || needsRefreshRef.current || !snapshotRef.current) {
      return false;
    }

    lockRef.current = true;
    setPending(mutation);
    return true;
  }, []);

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
      const previousIds = new Set(
        snapshotRef.current?.faits.logement.pieces.map((piece) => piece.id)
      );
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
        const newPieces = reloaded
          ? reloaded.faits.logement.pieces.filter((piece) => !previousIds.has(piece.id))
          : null;
        return {
          status: 'uncertain',
          error,
          newPieces: mutation.kind === 'create' ? newPieces : [],
        };
      } finally {
        release(session);
      }
    },
    [acquire, markNeedsRefresh, refresh, release]
  );

  /** Paramètre enregistré : la réponse porte l'évaluation recalculée, sans relecture des faits. */
  const applyParameters = useCallback(
    (parametres: Partial<FaitsGrille['parametres']>, evaluation: EvaluationFactuelle | null) => {
      setSnapshot((current) =>
        current
          ? {
              ...current,
              faits: {
                ...current.faits,
                parametres: { ...current.faits.parametres, ...parametres },
              },
              evaluation,
            }
          : current
      );
    },
    []
  );

  /** Verrou partagé avec les mutations de paramètres de la page. */
  const runExclusive = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T | null> => {
      if (!acquire({ kind: 'parameters' })) {
        return null;
      }

      const session = sessionRef.current;
      try {
        return await operation();
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
    load,
    refresh,
    mutate,
    applyParameters,
    runExclusive,
  };
}

export type FactuelleSimulationState = ReturnType<typeof useFactuelleSimulation>;
