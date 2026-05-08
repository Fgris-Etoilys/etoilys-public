import { describe, expect, it } from 'vitest';
import {
  getCriterionByNumber,
  getCriterionStatusForCategory,
  isSurfaceCriterion,
  simulatorGrid,
} from './simulatorGrid';

describe('simulatorGrid', () => {
  it('charge la structure officielle de la grille', () => {
    expect(simulatorGrid.chapitres).toHaveLength(3);
    expect(simulatorGrid.criteriaCount).toBe(133);
    expect(simulatorGrid.criteriaByNumber.size).toBe(133);
  });

  it('conserve la hiérarchie chapitres, sous-chapitres, rubriques et critères', () => {
    const firstChapter = simulatorGrid.chapitres[0];

    expect(firstChapter?.sous_chapitres.length).toBeGreaterThan(0);
    expect(firstChapter?.sous_chapitres[0]?.rubriques.length).toBeGreaterThan(0);
    expect(firstChapter?.sous_chapitres[0]?.rubriques[0]?.criteres[0]?.num_critere).toBe(1);
  });

  it('retrouve le statut par catégorie demandée', () => {
    const criterion = getCriterionByNumber(1);

    expect(criterion).toBeDefined();
    if (!criterion) {
      return;
    }

    expect(getCriterionStatusForCategory(criterion, '3*')).toBe('OBLIGATOIRE');
    expect(isSurfaceCriterion(criterion)).toBe(true);
  });
});
