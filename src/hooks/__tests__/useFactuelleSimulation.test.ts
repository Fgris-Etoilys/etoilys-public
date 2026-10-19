import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useFactuelleSimulation } from '../useFactuelleSimulation';
import { SimulatorApiError } from '../../utils/simulatorApi';
import { parseMutationFaits } from '../../utils/simulatorFactuelle.types';
import {
  catalogueResponse,
  chambre,
  evaluationResponse,
  FACTUELLE_SIMULATION_ID,
  faitsResponse,
  mutationResponse,
  piece,
} from '../../test/factuelleFixtures';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function mockFetchByUrl(handler: (url: string, init?: RequestInit) => Promise<Response>) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation((input, init) => handler(String(input), init));
}

async function renderLoaded(simulationId = FACTUELLE_SIMULATION_ID) {
  const hook = renderHook(({ id }) => useFactuelleSimulation(id), {
    initialProps: { id: simulationId },
  });
  await act(async () => {
    await hook.result.current.load(simulationId, null);
  });
  return hook;
}

const nouvelleCuisine = piece({ id: 'piece-cuisine', type_piece: 'CUISINE', surface: 8 });

describe('useFactuelleSimulation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('charge faits et catalogue sans relire l’évaluation', async () => {
    const fetchMock = mockFetchByUrl(async (url) =>
      url.endsWith('/faits/catalogue')
        ? jsonResponse(catalogueResponse)
        : jsonResponse(faitsResponse())
    );
    const { result } = await renderLoaded();

    expect(result.current.snapshot?.faits.logement.pieces).toHaveLength(1);
    expect(fetchMock.mock.calls.map(([url]) => String(url)).sort()).toEqual([
      `/api/public/simulations/${FACTUELLE_SIMULATION_ID}/faits`,
      `/api/public/simulations/${FACTUELLE_SIMULATION_ID}/faits/catalogue`,
    ]);
  });

  it('refuse une seconde écriture pendant qu’une première est en cours', async () => {
    mockFetchByUrl(async (url) =>
      url.endsWith('/faits/catalogue')
        ? jsonResponse(catalogueResponse)
        : jsonResponse(faitsResponse())
    );
    const { result } = await renderLoaded();
    let resolveFirst: ((value: ReturnType<typeof parseMutationFaits>) => void) | undefined;
    const operation = vi.fn(
      () =>
        new Promise<ReturnType<typeof parseMutationFaits>>((resolve) => {
          resolveFirst = resolve;
        })
    );

    let first: Promise<unknown> | undefined;
    act(() => {
      first = result.current.mutate({ kind: 'create' }, operation);
    });
    let second: unknown;
    await act(async () => {
      second = await result.current.mutate({ kind: 'create' }, operation);
    });
    const parametersRun = vi.fn();
    let parameters: unknown;
    await act(async () => {
      parameters = await result.current.runExclusive(async () => parametersRun());
    });

    expect(second).toEqual({ status: 'blocked' });
    expect(parameters).toBeNull();
    expect(parametersRun).not.toHaveBeenCalled();
    expect(operation).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFirst?.(parseMutationFaits(mutationResponse([chambre, nouvelleCuisine])));
      await first;
    });
    expect(result.current.pending).toBeNull();
    expect(result.current.snapshot?.faits.logement.pieces).toHaveLength(2);
  });

  it('ne relit rien après un refus certain du backend', async () => {
    const fetchMock = mockFetchByUrl(async (url) =>
      url.endsWith('/faits/catalogue')
        ? jsonResponse(catalogueResponse)
        : jsonResponse(faitsResponse())
    );
    const { result } = await renderLoaded();
    fetchMock.mockClear();

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutate({ kind: 'update', pieceId: 'piece-chambre' }, () =>
        Promise.reject(new SimulatorApiError(400, { code: 'INVALID_REQUEST' }))
      );
    });

    expect(outcome).toMatchObject({ status: 'refused' });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.needsRefresh).toBe(false);
  });

  it('relit l’état canonique sans rejouer une création incertaine et signale les nouvelles pièces', async () => {
    const fetchMock = mockFetchByUrl(async (url) => {
      if (url.endsWith('/faits/catalogue')) return jsonResponse(catalogueResponse);
      if (url.endsWith('/faits/evaluation')) return jsonResponse(evaluationResponse());
      return jsonResponse(
        faitsResponse(fetchMock.mock.calls.length > 2 ? [chambre, nouvelleCuisine] : [chambre])
      );
    });
    const { result } = await renderLoaded();
    const create = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));

    let outcome: { status: string; newPieces?: Array<{ id: string }> | null } | undefined;
    await act(async () => {
      outcome = (await result.current.mutate({ kind: 'create' }, create)) as typeof outcome;
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(outcome?.status).toBe('uncertain');
    expect(outcome?.newPieces?.map((entry) => entry.id)).toEqual(['piece-cuisine']);
    expect(result.current.needsRefresh).toBe(false);
    expect(result.current.snapshot?.faits.logement.pieces).toHaveLength(2);
  });

  it('bloque les écritures tant que la relecture après une issue incertaine échoue', async () => {
    let failReads = false;
    mockFetchByUrl(async (url) => {
      if (url.endsWith('/faits/catalogue')) return jsonResponse(catalogueResponse);
      if (failReads) return Promise.reject(new TypeError('Failed to fetch'));
      if (url.endsWith('/faits/evaluation')) return jsonResponse(evaluationResponse());
      return jsonResponse(faitsResponse());
    });
    const { result } = await renderLoaded();
    failReads = true;

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutate({ kind: 'create' }, () =>
        Promise.reject(new SimulatorApiError(502))
      );
    });
    expect(outcome).toMatchObject({ status: 'uncertain', newPieces: null });
    expect(result.current.needsRefresh).toBe(true);

    const blocked = vi.fn();
    let next: unknown;
    await act(async () => {
      next = await result.current.mutate({ kind: 'create' }, blocked);
    });
    expect(next).toEqual({ status: 'blocked' });
    expect(blocked).not.toHaveBeenCalled();

    failReads = false;
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.needsRefresh).toBe(false);
  });

  it('ignore une réponse arrivée après un changement de simulation', async () => {
    mockFetchByUrl(async (url) =>
      url.endsWith('/faits/catalogue')
        ? jsonResponse(catalogueResponse)
        : jsonResponse(faitsResponse())
    );
    const hook = await renderLoaded();
    let resolveLate: ((value: ReturnType<typeof parseMutationFaits>) => void) | undefined;
    let pendingMutation: Promise<unknown> | undefined;
    act(() => {
      pendingMutation = hook.result.current.mutate(
        { kind: 'create' },
        () =>
          new Promise((resolve) => {
            resolveLate = resolve;
          })
      );
    });

    hook.rerender({ id: 'autre-simulation' });
    let outcome: unknown;
    await act(async () => {
      resolveLate?.(parseMutationFaits(mutationResponse([chambre, nouvelleCuisine])));
      outcome = await pendingMutation;
    });

    expect(outcome).toEqual({ status: 'stale' });
    expect(hook.result.current.snapshot).toBeNull();
    await waitFor(() => expect(hook.result.current.pending).toBeNull());
  });
});
