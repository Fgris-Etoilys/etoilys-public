import { describe, expect, it } from 'vitest';
import {
  availableFactuelleTypes,
  moveSanitaire,
  pieceAlerts,
  pieceCompletion,
  pieceSurfaceAlert,
  resolveFieldAnchor,
  sectionForTarget,
} from '../factuellePieces';
import { createFactuellePieceDraft } from '../factuellePieceDraft';
import {
  parseCatalogueFaits,
  parseEvaluationFactuelle,
  parseFaitsGrille,
} from '../simulatorFactuelle.types';
import {
  besoin,
  catalogueResponse,
  chambre,
  evaluationResponse,
  faitsResponse,
  petiteChambre,
  salleEau1,
  salleEau2,
  terrasse,
} from '../../test/factuelleFixtures';

const catalogue = parseCatalogueFaits(catalogueResponse);
const pieces = parseFaitsGrille(
  faitsResponse([chambre, petiteChambre, salleEau2, salleEau1, terrasse])
).logement.pieces;

describe('factuellePieces', () => {
  it('déduit la complétude des besoins backend, indépendamment de la conformité', () => {
    const evaluation = parseEvaluationFactuelle(
      evaluationResponse({
        besoins: [
          besoin({ piece_id: 'piece-chambre', champ: 'prise', manquant: false }),
          besoin({ piece_id: 'piece-petite', champ: 'ouvrant', manquant: true }),
        ],
      })
    );

    expect(pieceCompletion(evaluation, 'piece-chambre')).toBe('complete');
    expect(pieceCompletion(evaluation, 'piece-petite')).toBe('missing');
    expect(pieceCompletion(null, 'piece-chambre')).toBe('unavailable');
  });

  it('ne propose qu’un exemplaire de chaque extérieur et jamais de WC', () => {
    expect(availableFactuelleTypes(catalogue, pieces, 'exterieurs')).toEqual([
      'LOGGIA_BALCON_VERANDA',
      'PARC_OU_JARDIN',
    ]);
    expect(availableFactuelleTypes(catalogue, pieces, 'interieurs')).not.toContain('WC');
    expect(availableFactuelleTypes(catalogue, pieces, 'sanitaires')).toEqual(['SALLE_DE_BAIN']);
  });

  it('produit l’ordre complet des salles d’eau', () => {
    expect(moveSanitaire(pieces, 'piece-sdb-2', -1)).toEqual(['piece-sdb-2', 'piece-sdb-1']);
    expect(moveSanitaire(pieces, 'piece-sdb-1', -1)).toBeNull();
    expect(moveSanitaire(pieces, 'piece-sdb-2', 1)).toBeNull();
  });

  it('limite les alertes backend à la catégorie demandée', () => {
    const evaluation = parseEvaluationFactuelle(
      evaluationResponse({
        alertes_pieces: [
          {
            piece_id: 'piece-chambre',
            code: 'PLAFOND_COUCHAGES_DEPASSE',
            message: 'Plafond',
            categories_concernees: ['5*'],
          },
        ],
      })
    );

    expect(pieceAlerts(evaluation, 'piece-chambre', '3*')).toHaveLength(0);
    expect(pieceAlerts(evaluation, 'piece-chambre', '5*')).toHaveLength(1);
  });

  it('fait primer l’exclusion des pièces d’habitation et masque le minimum local sous plafond', () => {
    const surfaces = parseEvaluationFactuelle(
      evaluationResponse({
        surfaces: {
          categorie: '3*',
          minima_locaux: [
            {
              piece_id: 'piece-chambre',
              applicable: true,
              surface: 12,
              minimum: 13,
              atteint: false,
            },
          ],
          qualifications_pieces: [
            {
              piece_id: 'piece-petite',
              surface: 6,
              seuil_surface: 7,
              seuil_atteint: false,
              ouvrant: null,
              piece_habitation: false,
            },
          ],
        },
      })
    ).surfaces;
    const [principale, petite] = pieces;
    if (!principale || !petite) throw new Error('Pièces de test manquantes');

    expect(pieceSurfaceAlert(surfaces, petite, false)?.tone).toBe('warning');
    expect(pieceSurfaceAlert(surfaces, principale, false)?.tone).toBe('error');
    expect(pieceSurfaceAlert(surfaces, principale, true)).toBeNull();
  });

  it('résout la section et le champ d’une cible sans lire la clé opaque', () => {
    expect(
      sectionForTarget({ requestId: 1, piece_id: 'piece-sdb-1', champ: 'prise' }, pieces)
    ).toBe('sanitaires');
    expect(
      sectionForTarget(
        { requestId: 2, piece_id: null, champ: 'sanitaires.lavabo_eau_chaude' },
        pieces
      )
    ).toBe('sanitaires');
    expect(
      sectionForTarget(
        { requestId: 3, piece_id: null, champ: 'surface', section: 'exterieurs' },
        pieces
      )
    ).toBe('exterieurs');

    const draft = createFactuellePieceDraft('CHAMBRE', pieces[0]);
    expect(resolveFieldAnchor('couchages.nombre_places', draft)).toEqual({
      field: 'couchages.11111111-1111-4111-8111-111111111111.nombre_places',
      couchageId: '11111111-1111-4111-8111-111111111111',
    });
    expect(resolveFieldAnchor('inspection.rangements', draft).field).toBe('inspection.rangements');
  });
});
