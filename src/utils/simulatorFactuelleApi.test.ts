import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createFactuellePiece,
  deleteFactuellePiece,
  getFaits,
  getFaitsCatalogue,
  reorderSanitaires,
  updateFactuellePiece,
} from './simulatorFactuelleApi';
import { resolveGridMode } from './simulatorApi';
import type { PieceFactuelleInput } from './simulatorFactuelle.types';
import {
  catalogueResponse,
  chambre,
  FACTUELLE_SIMULATION_ID as ID,
  faitsResponse,
  mutationResponse,
} from '../test/factuelleFixtures';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const payload: PieceFactuelleInput = {
  nom: null,
  type_piece: 'CUISINE',
  surface: 8,
  ouvrant: null,
  prise: null,
  ventilation: null,
  commun: null,
  inspection: null,
  nombre_oreillers: null,
  tous_lits_couette: null,
  deux_couvertures_par_lit_sans_couette: null,
  sanitaires: null,
  couchages: [],
};

describe('simulatorFactuelleApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('utilise les routes publiques FACTUELLE avec le cookie du navigateur', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input) =>
        String(input).endsWith('/catalogue')
          ? jsonResponse(catalogueResponse)
          : String(input).endsWith('/faits')
            ? jsonResponse(faitsResponse())
            : jsonResponse(mutationResponse([chambre]))
      );

    await getFaits(ID);
    await getFaitsCatalogue(ID);
    await createFactuellePiece(ID, payload);
    await updateFactuellePiece(ID, 'piece-chambre', payload);
    await deleteFactuellePiece(ID, 'piece-chambre');
    await reorderSanitaires(ID, ['b', 'a']);

    const calls = fetchMock.mock.calls.map(([url, init]) => ({
      url: String(url),
      method: init?.method,
      credentials: init?.credentials,
      body: init?.body === undefined ? undefined : JSON.parse(String(init.body)),
    }));
    const base = `/api/public/simulations/${ID}/faits`;
    expect(calls).toEqual([
      { url: base, method: 'GET', credentials: 'include', body: undefined },
      { url: `${base}/catalogue`, method: 'GET', credentials: 'include', body: undefined },
      { url: `${base}/pieces`, method: 'POST', credentials: 'include', body: payload },
      { url: `${base}/pieces/piece-chambre`, method: 'PUT', credentials: 'include', body: payload },
      {
        url: `${base}/pieces/piece-chambre`,
        method: 'DELETE',
        credentials: 'include',
        body: undefined,
      },
      {
        url: `${base}/ordre-sanitaires`,
        method: 'PUT',
        credentials: 'include',
        body: { piece_ids: ['b', 'a'] },
      },
    ]);
  });

  it('rejette des faits qui ne sont pas FACTUELLE', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(faitsResponse([], { mode_grille: 'LEGACY' }))
    );

    await expect(getFaits(ID)).rejects.toThrow('Réponse API simulateur invalide');
  });

  it('considère un mode absent comme LEGACY et un mode inconnu comme inutilisable', () => {
    expect(resolveGridMode({ grille: {} })).toBe('LEGACY');
    expect(resolveGridMode({ grille: { mode_grille: 'LEGACY' } })).toBe('LEGACY');
    expect(resolveGridMode({ grille: { mode_grille: 'FACTUELLE' } })).toBe('FACTUELLE');
    expect(resolveGridMode({ grille: { mode_grille: 'AUTRE' } })).toBeNull();
  });
});
