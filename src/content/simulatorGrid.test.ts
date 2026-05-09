import { describe, expect, it } from 'vitest';
import {
  buildGridSummary,
  getCriterionByNumber,
  getCriterionStatusForCategory,
  isSurfaceCriterion,
  parseGridStructure,
  type GridStructure,
} from './simulatorGrid';

const validGridStructure: GridStructure = {
  chapitres: [
    {
      libelle: 'Chapitre test',
      sous_chapitres: [
        {
          libelle: 'Sous-chapitre test',
          rubriques: [
            {
              libelle: 'Rubrique test',
              criteres: [
                {
                  num_critere: 1,
                  libelle: 'Surface totale minimum',
                  points: 5,
                  peut_etre_non_applicable: false,
                  categories: [
                    { nom: '1*', statut: 'OBLIGATOIRE' },
                    { nom: '3*', statut: 'OBLIGATOIRE' },
                  ],
                },
                {
                  num_critere: 2,
                  libelle: 'Équipement optionnel',
                  points: 1,
                  peut_etre_non_applicable: true,
                  categories: [{ nom: '3*', statut: 'OPTIONNEL' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe('simulatorGrid', () => {
  it('valide une structure de grille backend compatible', () => {
    expect(parseGridStructure(validGridStructure)).toBe(validGridStructure);
  });

  it('construit un index de critères par numéro', () => {
    const summary = buildGridSummary(validGridStructure);

    expect(summary.chapitres).toBe(validGridStructure.chapitres);
    expect(summary.criteriaCount).toBe(2);
    expect(summary.criteriaByNumber.size).toBe(2);
    expect(getCriterionByNumber(summary, 1)?.libelle).toBe('Surface totale minimum');
  });

  it('retrouve le statut par catégorie demandée', () => {
    const summary = buildGridSummary(validGridStructure);
    const criterion = getCriterionByNumber(summary, 1);

    expect(criterion).toBeDefined();
    if (!criterion) {
      return;
    }

    expect(getCriterionStatusForCategory(criterion, '3*')).toBe('OBLIGATOIRE');
    expect(isSurfaceCriterion(criterion)).toBe(true);
  });

  it('rejette une structure invalide', () => {
    expect(() => parseGridStructure({ chapitres: [{ libelle: 'Chapitre sans contenu' }] })).toThrow(
      'Structure de grille simulateur invalide'
    );
  });
});
