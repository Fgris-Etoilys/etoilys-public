import { describe, expect, it } from 'vitest';
import type { GridCriterion } from '../../content/simulatorGrid';
import { besoin, critere, evaluationResponse } from '../../test/factuelleFixtures';
import {
  criterionSource,
  factuelleCriterionState,
  missingCriterionNumbers,
  resolveFactuelleSource,
} from '../factuelleGrille';
import { parseEvaluationFactuelle } from '../simulatorFactuelle.types';

function model(numero: number, peutEtreNonApplicable = false): GridCriterion {
  return {
    num_critere: numero,
    libelle: `Critère ${numero}`,
    points: 2,
    peut_etre_non_applicable: peutEtreNonApplicable,
    categories: [],
  };
}

function state(critereJson: Record<string, unknown>, besoins: Record<string, unknown>[] = []) {
  const evaluation = parseEvaluationFactuelle(
    evaluationResponse({ criteres: [critereJson], besoins })
  );
  const numero = critereJson.num_critere as number;
  return factuelleCriterionState(
    model(numero, numero === 37),
    evaluation.criteres[0],
    evaluation,
    '3*'
  );
}

describe('Grille FACTUELLE — projection des critères', () => {
  it('garde un manuel NA en 3★ répondable lorsqu’il est utile en 1★–2★', () => {
    const result = state(
      critere(23, {}, [
        'OBLIGATOIRE',
        'OBLIGATOIRE',
        'NON_APPLICABLE',
        'NON_APPLICABLE',
        'NON_APPLICABLE',
      ])
    );
    expect(result.notApplicableOnly).toBe(false);
    expect(result.mention).toEqual(['1*', '2*']);
  });

  it('n’affiche aucune action pour un critère NA dans les cinq catégories', () => {
    const result = state(critere(37, {}, Array(5).fill('NON_APPLICABLE')));
    expect(result.notApplicableOnly).toBe(true);
    expect(result.mention).toEqual([]);
  });

  it('demande les faits d’un automatique manquant ailleurs en rappelant les catégories', () => {
    const result = state(critere(44, { automatique: true }), [
      besoin({
        champ: 'sanitaires.douche',
        num_critere: 44,
        categories_utilisatrices: ['4*', '5*'],
      }),
    ]);
    expect(result.missing).toHaveLength(1);
    expect(result.mention).toEqual(['4*', '5*']);
  });

  it('expose la dérogation NA des seuls automatiques C15/C16/C19/C26', () => {
    const derogee = state(critere(16, { automatique: true, reponse_manuelle: 'NON_APPLICABLE' }));
    expect(derogee).toMatchObject({ canDerogate: true, derogation: true, bloc: 'chauffage' });
    expect(state(critere(57, { automatique: true })).canDerogate).toBe(false);
  });

  it('ne propose NA à un manuel que si le modèle l’autorise', () => {
    expect(state(critere(37)).canAnswerNotApplicable).toBe(true);
    expect(state(critere(68)).canAnswerNotApplicable).toBe(false);
  });

  it('liste les critères à compléter de l’union des cinq catégories', () => {
    const evaluation = parseEvaluationFactuelle(
      evaluationResponse({
        besoins: [
          besoin({ champ: 'reponse_manuelle', num_critere: 69, destination: 'GRILLE' }),
          besoin({ champ: 'inspection.rangements', num_critere: 23, manquant: false }),
          besoin({ champ: 'studio', destination: 'PARAMETRES' }),
        ],
      })
    );
    expect(missingCriterionNumbers(evaluation)).toEqual([69]);
  });
});

describe('Grille FACTUELLE — navigation exacte', () => {
  it('route chaque destination sans analyser la clé opaque', () => {
    expect(
      resolveFactuelleSource({
        destination: 'PARAMETRES',
        champ: 'studio',
        piece_id: null,
        num_critere: null,
      })
    ).toEqual({ kind: 'parametre', champ: 'studio' });
    expect(
      resolveFactuelleSource({
        destination: 'GRILLE',
        champ: 'c101.situation',
        piece_id: null,
        num_critere: 101,
      })
    ).toEqual({ kind: 'global', bloc: 'c101', numero: 101, champ: 'c101.situation' });
    expect(
      resolveFactuelleSource({
        destination: 'GRILLE',
        champ: 'reponse_manuelle',
        piece_id: null,
        num_critere: 69,
      })
    ).toEqual({ kind: 'critere', numero: 69 });
    expect(
      resolveFactuelleSource({
        destination: 'PIECE',
        champ: 'surface',
        piece_id: 'p1',
        num_critere: null,
      })
    ).toEqual({ kind: 'piece', target: { piece_id: 'p1', champ: 'surface', num_critere: null } });
    expect(
      resolveFactuelleSource({
        destination: 'PIECE',
        champ: 'sanitaires',
        piece_id: null,
        num_critere: 44,
      })
    ).toEqual({
      kind: 'piece',
      target: { piece_id: null, champ: 'sanitaires', num_critere: 44, section: 'sanitaires' },
    });
  });

  it('mène un automatique non validé à ses faits déjà connus, sans choisir parmi plusieurs pièces', () => {
    const known = (champ: string, piece_id: string | null, num_critere: number) =>
      besoin({ champ, piece_id, num_critere, manquant: false });
    const evaluation = parseEvaluationFactuelle(
      evaluationResponse({
        criteres: [
          critere(69),
          critere(101, { automatique: true, statut_validation: 'NON_VALIDE' }),
          critere(37, { automatique: true }),
          critere(41, { automatique: true }),
          critere(120, { automatique: true }),
        ],
        besoins: [
          known('c101.situation', null, 101),
          known('inspection.occultation', 'p1', 37),
          known('inspection.prise', 'p1', 41),
          known('inspection.prise', 'p2', 41),
        ],
      })
    );

    // Manuel : la réponse se donne dans la Grille.
    expect(criterionSource(69, evaluation)).toEqual({ kind: 'critere', numero: 69 });
    // Bloc global : sa modale, sans champ manquant à cibler.
    expect(criterionSource(101, evaluation)).toEqual({
      kind: 'global',
      bloc: 'c101',
      numero: 101,
      champ: null,
    });
    // Une seule pièce : sa fenêtre, sur le fait connu.
    expect(criterionSource(37, evaluation)).toEqual({
      kind: 'piece',
      target: { piece_id: 'p1', champ: 'inspection.occultation', num_critere: 37 },
    });
    // Plusieurs pièces : la section de la première, sans ouvrir de fenêtre.
    expect(criterionSource(41, evaluation)).toEqual({
      kind: 'piece',
      target: { piece_id: 'p1', champ: 'inspection.prise', num_critere: 41, cardOnly: true },
    });
    // Automatique sans besoin : la carte du critère, faute de source connue.
    expect(criterionSource(120, evaluation)).toEqual({ kind: 'critere', numero: 120 });
    expect(criterionSource(37, null)).toEqual({ kind: 'critere', numero: 37 });
  });

  it('cible d’abord la pièce dont un fait manque encore', () => {
    const evaluation = parseEvaluationFactuelle(
      evaluationResponse({
        criteres: [critere(41, { automatique: true })],
        besoins: [
          besoin({ champ: 'inspection.prise', piece_id: 'p1', num_critere: 41, manquant: false }),
          besoin({ champ: 'inspection.prise', piece_id: 'p2', num_critere: 41 }),
        ],
      })
    );
    expect(criterionSource(41, evaluation)).toEqual({
      kind: 'piece',
      target: { piece_id: 'p2', champ: 'inspection.prise', num_critere: 41 },
    });
  });
});
