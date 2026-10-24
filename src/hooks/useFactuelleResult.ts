import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSimulatorApiErrorMessage,
  SimulatorApiError,
  verifySimulation,
  type SimulationStatus,
} from '../utils/simulatorApi';
import { getComparaison, getFactuelleVerification } from '../utils/simulatorFactuelleApi';
import type {
  ComparaisonFactuelle,
  VerificationFactuelle,
} from '../utils/simulatorFactuelleResultats.types';
import type { FactuelleSimulationState } from './useFactuelleSimulation';

export type FactuelleResultState =
  | { status: 'none' }
  | { status: 'checking' }
  /** Contrôle global non satisfait : blocages actionnables, aucun rapport partiel. */
  | { status: 'blocked'; verification: VerificationFactuelle }
  | { status: 'fresh'; comparaison: ComparaisonFactuelle }
  | { status: 'stale' }
  | { status: 'error'; message: string };

type Readout =
  | { kind: 'blocked'; verification: VerificationFactuelle }
  | { kind: 'comparaison'; comparaison: ComparaisonFactuelle };

/**
 * Issue d'un contrôle : lecture obtenue, `busy` (écriture en cours ou actualisation requise, rien
 * n'a été envoyé), `error`, ou `null` si la réponse est arrivée après une invalidation.
 */
export type FactuelleCheckOutcome = Readout | { kind: 'busy' } | { kind: 'error' } | null;

const CALCULATE_ERROR =
  'Le résultat n’a pas pu être calculé pour le moment. Vérifiez votre connexion puis réessayez.';
const LOAD_ERROR =
  'Le résultat enregistré n’a pas pu être chargé pour le moment. Veuillez réessayer.';

function isIncomplete(error: unknown): boolean {
  return (
    error instanceof SimulatorApiError &&
    error.status === 409 &&
    error.code === 'GRILLE_FACTUELLE_INCOMPLETE'
  );
}

/** `/comparaison`, ou une seule relecture de `/verification` si le contrôle global a changé entre-temps. */
async function readComparaison(id: string): Promise<Readout> {
  try {
    return { kind: 'comparaison', comparaison: await getComparaison(id) };
  } catch (error) {
    if (!isIncomplete(error)) {
      throw error;
    }
    return { kind: 'blocked', verification: await getFactuelleVerification(id) };
  }
}

/** Catégorie demandée de la comparaison : elle seule porte FAVORABLE / DEFAVORABLE. */
export function requestedOutcome(comparaison: ComparaisonFactuelle): 'favorable' | 'defavorable' {
  const entry = comparaison.categories.find(
    (candidate) => candidate.categorie === comparaison.categorie_demandee
  );
  return entry?.rapport.resultat === true ? 'favorable' : 'defavorable';
}

/**
 * Résultat FACTUELLE : `POST /verifier` puis `/verification` ou `/comparaison`, sous le verrou unique des
 * écritures. Toute mutation invalide le résultat ; une lecture arrivée après une invalidation ou un
 * changement de simulation est ignorée. Consulter ou exporter une catégorie n'écrit rien.
 */
export function useFactuelleResult(
  simulationId: string | undefined,
  factuelle: Pick<FactuelleSimulationState, 'exclusive'>
) {
  const [state, setState] = useState<FactuelleResultState>({ status: 'none' });
  const generationRef = useRef(0);
  const exclusive = factuelle.exclusive;

  useEffect(() => {
    generationRef.current += 1;
    setState({ status: 'none' });
  }, [simulationId]);

  const apply = useCallback((readout: Readout) => {
    setState(
      readout.kind === 'blocked'
        ? { status: 'blocked', verification: readout.verification }
        : { status: 'fresh', comparaison: readout.comparaison }
    );
  }, []);

  /** Mutation réelle : un résultat affiché devient à recalculer. */
  const invalidate = useCallback(() => {
    generationRef.current += 1;
    setState((current) =>
      current.status === 'fresh' || current.status === 'blocked' || current.status === 'stale'
        ? { status: 'stale' }
        : { status: 'none' }
    );
  }, []);

  /** Reprise : relit le résultat enregistré selon le statut, sans écriture ni changement de date. */
  const hydrate = useCallback(
    async (id: string, statut: SimulationStatus | undefined) => {
      const generation = generationRef.current + 1;
      generationRef.current = generation;
      if (statut === 'A_RECALCULER') {
        setState({ status: 'stale' });
        return;
      }
      if (statut !== 'FAVORABLE' && statut !== 'DEFAVORABLE' && statut !== 'A_COMPLETER') {
        setState({ status: 'none' });
        return;
      }

      try {
        const readout: Readout =
          statut === 'A_COMPLETER'
            ? { kind: 'blocked', verification: await getFactuelleVerification(id) }
            : await readComparaison(id);
        if (generation === generationRef.current) {
          apply(readout);
        }
      } catch (error) {
        if (generation === generationRef.current) {
          setState({
            status: 'error',
            message: getSimulatorApiErrorMessage(error, LOAD_ERROR, 'loadResult'),
          });
        }
      }
    },
    [apply]
  );

  const check = useCallback(async (): Promise<FactuelleCheckOutcome> => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const previous = state;
    setState({ status: 'checking' });

    const outcome = await exclusive({ kind: 'verify' }, async (id) => {
      const complete = await verifySimulation(id);
      return complete
        ? readComparaison(id)
        : ({
            kind: 'blocked',
            verification: await getFactuelleVerification(id),
          } satisfies Readout);
    });
    if (generation !== generationRef.current || outcome.status === 'stale') {
      return null;
    }

    switch (outcome.status) {
      case 'success':
        apply(outcome.value);
        return outcome.value;
      case 'failed':
        setState({
          status: 'error',
          message: getSimulatorApiErrorMessage(outcome.error, CALCULATE_ERROR, 'calculateResult'),
        });
        return { kind: 'error' };
      case 'blocked':
        // Écriture en cours ou actualisation requise : le résultat précédent reste affiché.
        setState(previous);
        return { kind: 'busy' };
    }
  }, [apply, exclusive, state]);

  return { state, check, hydrate, invalidate };
}

export type FactuelleResult = ReturnType<typeof useFactuelleResult>;
