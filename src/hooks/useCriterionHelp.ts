import { useCallback, useState } from 'react';
import type { CritereAide } from '../content/criteresAide';
import type { GridCriterion, GridSummary } from '../content/simulatorGrid';
import { getCachedCriterionHelp, loadCriterionHelp } from '../utils/criterionHelp';

export interface CriterionHelpState {
  criterion: GridCriterion;
  aide: CritereAide | null;
  isLoading: boolean;
}

/** Aide contextuelle d'un critère (FACTUELLE) : cache partagé, chargement différé, réponse tardive ignorée. */
export function useCriterionHelp(gridSummary: GridSummary | null) {
  const [help, setHelp] = useState<CriterionHelpState | null>(null);

  const open = useCallback(
    (criterionNumber: number) => {
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
    },
    [gridSummary]
  );

  const close = useCallback(() => setHelp(null), []);

  return { help, open, close };
}
