import { jsPDF } from 'jspdf';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  chambre,
  comparaisonResponse,
  evaluationResponse,
  petiteChambre,
} from '../../test/factuelleFixtures';
import { createSimulationClassementPdf } from '../simulationClassementPdf';
import { buildFactuellePdfInput } from '../simulationClassementFactuellePdf';
import type { SimulationClassementPdfInput } from '../simulationClassementPdf.types';
import { parseEvaluationFactuelle } from '../simulatorFactuelle.types';
import { parseComparaisonFactuelle } from '../simulatorFactuelleResultats.types';
import * as simulatorPdfShared from '../simulatorPdfShared';

async function renderedText(input: SimulationClassementPdfInput): Promise<string> {
  const texts: string[] = [];
  const capture = (payload: { text: string | string[] }) => {
    texts.push(typeof payload.text === 'string' ? payload.text : payload.text.join(' '));
  };
  const event: [string, typeof capture] = ['preProcessText', capture];
  jsPDF.API.events.push(event);
  try {
    await createSimulationClassementPdf(input);
  } finally {
    jsPDF.API.events.splice(jsPDF.API.events.indexOf(event), 1);
  }
  return texts.join(' | ');
}

const comparaison = parseComparaisonFactuelle(
  comparaisonResponse(
    {
      '4*': {
        rapport: {
          resultat: false,
          points_obligatoires_atteints: false,
          criteres_obligatoires_non_valides: [69],
        },
        onc: [68],
      },
    },
    '3*',
    [chambre, petiteChambre]
  )
);
// Chambre reconnue pièce d'habitation (2 places déclarées), petite chambre exclue (1 place déclarée).
const surfaces = parseEvaluationFactuelle(
  evaluationResponse({
    surfaces: {
      categorie: '3*',
      nombre_pieces_habitation: 1,
      surface_totale: 18,
      nombre_couchages: 2,
      minimum_global: 9,
      minimum_global_atteint: true,
      diagnostic_moyenne_surface: null,
      minima_locaux: [],
      qualifications_pieces: [
        { piece_id: 'piece-chambre', piece_habitation: true },
        { piece_id: 'piece-petite', piece_habitation: false },
      ],
    },
  })
).surfaces;

function input(categorie: string) {
  const entry = comparaison.categories.find((candidate) => candidate.categorie === categorie);
  if (!entry) throw new Error(categorie);
  return buildFactuellePdfInput({
    comparaison,
    entry,
    surfaces,
    generatedAt: new Date('2026-10-19T12:00:00Z'),
    simulationId: 'simulation-factuelle',
  });
}

beforeEach(() => {
  vi.spyOn(simulatorPdfShared, 'getEtoilysLogoPngAsset').mockResolvedValue(null);
});

afterEach(() => vi.restoreAllMocks());

describe('PDF FACTUELLE — une catégorie à la fois', () => {
  it('prend titre, rapport et réponses de l’entrée exportée sans remplacer la catégorie demandée', () => {
    const before = JSON.stringify(comparaison);
    const pdf3 = input('3*');
    const pdf4 = input('4*');

    expect(pdf3.grille?.categorie_demandee).toBe('3*');
    expect(pdf4.grille?.categorie_demandee).toBe('4*');
    expect(pdf4.rapport.resultat).toBe(false);
    expect(pdf4.factuelle?.oncNonValides).toEqual([68]);
    expect(pdf4.factuelle?.parameters).toContainEqual(['Catégorie demandée', '3 étoiles']);
    expect(pdf4.factuelle?.parameters).toContainEqual(['Studio', 'Non']);
    expect(JSON.stringify(comparaison)).toBe(before);
  });

  it('distingue couchages déclarés par pièce et couchages comptabilisés du backend', () => {
    const details = input('3*').factuelle;
    expect(details?.parameters).toContainEqual(['Couchages comptabilisés', '2']);
    expect(details?.pieces).toEqual([
      ['Chambre parentale\nChambre', '12 m²', '2', 'Oui'],
      ['Petite chambre\nChambre', '6 m²', '1', 'Non'],
    ]);
  });

  it('rend le résultat de la catégorie exportée, ONC compris, sans le présenter comme l’objectif', async () => {
    const text = await renderedText(input('4*'));
    expect(text).toContain('RÉSULTAT : 4 ÉTOILES');
    expect(text).not.toContain('OBJECTIF');
    expect(text).toContain('le classement 4 étoiles');
    expect(text).toContain('Cafetière (non compensable)');
    expect(text).toContain('Couchages déclarés');
    expect(text).toContain('Couchages comptabilisés');
  });
});
