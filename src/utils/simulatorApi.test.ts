import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createPiece,
  createPublicSimulation,
  deletePiece,
  getPublicSimulation,
  getRapport,
  getSimulationLogement,
  getVerification,
  listPublicSimulations,
  submitResponse,
  updatePiece,
  updateRequestedCategory,
  verifySimulation,
} from './simulatorApi';

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const mockFetchJson = (body: unknown, status = 200) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse(body, status));

describe('simulatorApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('liste les simulations publiques via le backend simulateur same-origin', async () => {
    const fetchMock = mockFetchJson([
      {
        id: 'c3f43f31-59fd-4b4e-9272-7f1321d8cabc',
        statut: 'brouillon',
        categorie_demandee: '3*',
        capacite_accueil: 4,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    await expect(listPublicSimulations()).resolves.toHaveLength(1);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers;
    expect(headers).toBeInstanceOf(Headers);
    expect((headers as Headers).get('Accept')).toBe('application/json');
  });

  it('charge une simulation publique complète', async () => {
    const fetchMock = mockFetchJson({ id: 'simulation-id', grille: {} });

    await getPublicSimulation('simulation-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('charge le logement de la simulation', async () => {
    const fetchMock = mockFetchJson({ id: 'logement-id', pieces: [] });

    await getSimulationLogement('simulation-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/logement',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('crée une simulation avec un POST JSON', async () => {
    const fetchMock = mockFetchJson({ id: 'simulation-id' });

    await createPublicSimulation({
      categorie_demandee: '3*',
      capacite_accueil: 4,
      etage: 1,
      type_habitation: 'INDIVIDUEL',
    });

    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/public/simulations');
    expect(requestInit).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        categorie_demandee: '3*',
        capacite_accueil: 4,
        etage: 1,
        type_habitation: 'INDIVIDUEL',
      }),
    });
    expect((requestInit?.headers as Headers).get('Content-Type')).toBe('application/json');
  });

  it('met à jour les paramètres par endpoint dédié', async () => {
    const fetchMock = mockFetchJson({ id: 'simulation-id' });

    await updateRequestedCategory('simulation-id', '4*');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/classementDemande/4*',
      expect.objectContaining({
        method: 'PUT',
        credentials: 'include',
      })
    );
  });

  it('crée une pièce avec un POST JSON', async () => {
    const fetchMock = mockFetchJson({ id: 'logement-id', pieces: [] });

    await createPiece('simulation-id', {
      type_piece: 'CHAMBRE',
      surface: 12,
      nombre_lits: 2,
    });

    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/public/simulations/simulation-id/pieces');
    expect(requestInit).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        type_piece: 'CHAMBRE',
        surface: 12,
        nombre_lits: 2,
      }),
    });
  });

  it('met à jour une pièce avec un PUT JSON', async () => {
    const fetchMock = mockFetchJson({ id: 'logement-id', pieces: [] });

    await updatePiece('simulation-id', 'piece-id', {
      type_piece: 'SALON',
      surface: 18,
    });

    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/public/simulations/simulation-id/pieces/piece-id'
    );
    expect(requestInit).toMatchObject({
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        type_piece: 'SALON',
        surface: 18,
      }),
    });
  });

  it('ne définit une suppression que pour les pièces', async () => {
    const fetchMock = mockFetchJson({ id: 'logement-id', pieces: [] });

    await deletePiece('simulation-id', 'piece-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/pieces/piece-id',
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'include',
      })
    );
  });

  it('enregistre une réponse de critère avec un payload minimal', async () => {
    const fetchMock = mockFetchJson({
      num_critere: 23,
      statut_validation: 'VALIDE',
      statut_critere: 'OBLIGATOIRE',
      commentaire: 'ignoré côté UI',
    });

    await submitResponse('simulation-id', {
      num_critere: 23,
      statut_validation: 'VALIDE',
    });

    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/public/simulations/simulation-id/reponse');
    expect(requestInit).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        num_critere: 23,
        statut_validation: 'VALIDE',
      }),
    });
    expect(String(requestInit?.body)).not.toContain('commentaire');
  });

  it('lance la vérification et retourne un booléen', async () => {
    const fetchMock = mockFetchJson(true);

    await expect(verifySimulation('simulation-id')).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/verifier',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('charge les problèmes de vérification', async () => {
    const fetchMock = mockFetchJson({ nb_couchages_suffisants: false });

    await getVerification('simulation-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/verification',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('charge le rapport provisoire', async () => {
    const fetchMock = mockFetchJson({ resultat: true });

    await getRapport('simulation-id');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations/simulation-id/rapport',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });
});
