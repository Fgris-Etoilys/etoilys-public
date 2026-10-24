import { describe, expect, it } from 'vitest';
import { blocage, comparaisonResponse } from '../../test/factuelleFixtures';
import {
  criteresNonValides,
  pointsBloquants,
  pointsManquants,
  syntheseCategorie,
  usefulCategories,
} from '../factuelleResultats';
import { parseComparaisonFactuelle } from '../simulatorFactuelleResultats.types';
import type { BlocageFactuel } from '../simulatorFactuelleResultats.types';

describe('résultats FACTUELLE — synthèses et détail', () => {
  const comparaison = parseComparaisonFactuelle(
    comparaisonResponse({
      '4*': {
        rapport: {
          resultat: false,
          points_minimaux_obligatoires: 98,
          points_obligatoires_obtenus: 95,
          points_obligatoires_atteints: false,
          points_obligatoires_a_compenser: 3,
          points_optionnels_a_atteindre: 14,
          points_optionnels_obtenus: 12,
          points_optionnels_atteints: false,
          criteres_obligatoires_non_valides: [69],
          criteres_optionnels_non_valides: [101],
        },
      },
      '5*': { rapport: { resultat: false }, onc: [68] },
    })
  );
  const entry = (categorie: string) => {
    const found = comparaison.categories.find((candidate) => candidate.categorie === categorie);
    if (!found) throw new Error(categorie);
    return found;
  };

  it('reprend exactement les écarts du rapport, compensation déjà incluse dans la cible à la carte', () => {
    expect(pointsManquants(entry('4*').rapport)).toEqual({ obligatoires: 3, aLaCarte: 2 });
    expect(syntheseCategorie(entry('4*'))).toEqual({
      atteint: false,
      details: ['3 pts obligatoires manquants', '2 pts à la carte manquants'],
    });
    expect(syntheseCategorie(entry('3*'))).toEqual({ atteint: true, details: [] });
  });

  it('signale un ONC bloquant même sans déficit chiffré', () => {
    expect(syntheseCategorie(entry('5*'))).toEqual({
      atteint: false,
      details: ['1 critère non compensable non validé'],
    });
    expect(criteresNonValides(entry('5*')).obligatoires).toEqual([
      { numero: 68, libelle: 'Cafetière', points: 2, nonCompensable: true },
    ]);
  });

  it('liste les critères non validés de l’entrée consultée avec ses libellés', () => {
    expect(criteresNonValides(entry('4*'))).toEqual({
      obligatoires: [
        { numero: 69, libelle: 'Machine à expresso', points: 2, nonCompensable: false },
      ],
      aLaCarte: [
        {
          numero: 101,
          libelle: 'Mise à disposition d’un livret d’accueil',
          points: 2,
          nonCompensable: false,
        },
      ],
    });
  });

  it('refuse une comparaison qui ne contient pas exactement cinq catégories ordonnées', () => {
    const response = comparaisonResponse();
    const categories = response.categories as unknown[];
    expect(() =>
      parseComparaisonFactuelle({ ...response, categories: categories.slice(1) })
    ).toThrow();
    expect(() =>
      parseComparaisonFactuelle({ ...response, categories: [...categories].reverse() })
    ).toThrow();
  });
});

describe('résultats FACTUELLE — blocages', () => {
  const blocages = [
    blocage({ code: 'REPONSE_MANQUANTE', num_critere: 69, categories_utilisatrices: ['4*', '5*'] }),
    blocage({ code: 'COUCHAGES_CAPACITE_INCOHERENTS', destination: 'PIECE', champ: 'couchages' }),
    blocage({ code: 'FAIT_MANQUANT', num_critere: 23, destination: 'PIECE', piece_id: 'p1' }),
    blocage({ code: 'FAIT_MANQUANT', num_critere: 23, destination: 'PIECE', piece_id: 'p2' }),
  ] as unknown as BlocageFactuel[];

  it('regroupe les critères à compléter et garde les autres blocages dans l’ordre backend', () => {
    const points = pointsBloquants(blocages);
    expect(points).toHaveLength(2);
    expect(points[0]).toMatchObject({ kind: 'criteres' });
    expect(points[0]?.kind === 'criteres' && points[0].criteres.map((c) => c.numero)).toEqual([
      23, 69,
    ]);
    expect(points[1]).toMatchObject({
      kind: 'blocage',
      blocage: { code: 'COUCHAGES_CAPACITE_INCOHERENTS' },
    });
  });

  it('masque « Utile pour » lorsque les cinq catégories sont concernées', () => {
    expect(usefulCategories(blocages[0]!)).toEqual(['4*', '5*']);
    expect(usefulCategories(blocages[1]!)).toEqual([]);
  });
});
