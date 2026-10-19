import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useFactuelleSimulation } from '../useFactuelleSimulation';
import { SimulatorApiError, type PublicSimulationDto } from '../../utils/simulatorApi';
import { parseMutationFaits } from '../../utils/simulatorFactuelle.types';
import {
  catalogueResponse,
  chambre,
  evaluationResponse,
  FACTUELLE_SIMULATION_ID,
  factuelleSimulationResponse,
  faitsResponse,
  mutationResponse,
  piece,
} from '../../test/factuelleFixtures';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const SIMULATION_URL = `/api/public/simulations/${FACTUELLE_SIMULATION_ID}`;

/** Lectures : simulation, faits et catalogue ; `pieces()` permet de faire évoluer les faits relus. */
function mockReads(
  pieces: () => Record<string, unknown>[] = () => [chambre],
  simulation = factuelleSimulationResponse()
) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    if (url.endsWith('/faits/catalogue')) return jsonResponse(catalogueResponse);
    if (url.endsWith('/faits')) return jsonResponse(faitsResponse(pieces()));
    if (url === SIMULATION_URL) return jsonResponse(simulation);
    throw new TypeError(`Unexpected fetch call: ${url}`);
  });
}

async function renderLoaded(onSimulationReconciled?: (simulation: PublicSimulationDto) => void) {
  const hook = renderHook(({ id }) => useFactuelleSimulation(id, onSimulationReconciled), {
    initialProps: { id: FACTUELLE_SIMULATION_ID },
  });
  await act(async () => {
    await hook.result.current.load(FACTUELLE_SIMULATION_ID, null);
  });
  return hook;
}

function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const nouvelleCuisine = piece({ id: 'piece-cuisine', type_piece: 'CUISINE', surface: 8 });

describe('useFactuelleSimulation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('charge faits et catalogue sans relire l’évaluation', async () => {
    const fetchMock = mockReads();
    const { result } = await renderLoaded();

    expect(result.current.snapshot?.faits.logement.pieces).toHaveLength(1);
    expect(fetchMock.mock.calls.map(([url]) => String(url)).sort()).toEqual([
      `${SIMULATION_URL}/faits`,
      `${SIMULATION_URL}/faits/catalogue`,
    ]);
  });

  it('refuse une seconde écriture, pièce ou paramètre, pendant qu’une première est en cours', async () => {
    mockReads();
    const { result } = await renderLoaded();
    const first = deferred<ReturnType<typeof parseMutationFaits>>();
    const operation = vi.fn(() => first.promise);
    const parameterOperation = vi.fn();

    let pendingMutation: Promise<unknown> | undefined;
    act(() => {
      pendingMutation = result.current.mutate({ kind: 'create' }, operation);
    });
    let second: unknown;
    let parameters: unknown;
    await act(async () => {
      second = await result.current.mutate({ kind: 'create' }, operation);
      parameters = await result.current.mutateParameters(parameterOperation);
    });

    expect(second).toEqual({ status: 'blocked' });
    expect(parameters).toEqual({ status: 'blocked' });
    expect(parameterOperation).not.toHaveBeenCalled();
    expect(operation).toHaveBeenCalledTimes(1);

    await act(async () => {
      first.resolve(parseMutationFaits(mutationResponse([chambre, nouvelleCuisine])));
      await pendingMutation;
    });
    expect(result.current.pending).toBeNull();
    expect(result.current.snapshot?.faits.logement.pieces).toHaveLength(2);
  });

  it('signale sans attendre de rendu une écriture ou une relecture en cours', async () => {
    mockReads();
    const { result } = await renderLoaded();
    const write = deferred<ReturnType<typeof parseMutationFaits>>();
    expect(result.current.isBusy()).toBe(false);

    let mutation: Promise<unknown> | undefined;
    act(() => {
      mutation = result.current.mutate({ kind: 'create' }, () => write.promise);
    });
    expect(result.current.isBusy()).toBe(true);
    await act(async () => {
      write.resolve(parseMutationFaits(mutationResponse([chambre])));
      await mutation;
    });
    expect(result.current.isBusy()).toBe(false);

    let refresh: Promise<unknown> | undefined;
    act(() => {
      refresh = result.current.refresh();
    });
    expect(result.current.isBusy()).toBe(true);
    await act(async () => {
      await refresh;
    });
    expect(result.current.isBusy()).toBe(false);
  });

  it('ne relit rien après un refus certain du backend', async () => {
    const fetchMock = mockReads();
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

  it('relit simulation et faits sans rejouer une création incertaine', async () => {
    let created = false;
    mockReads(() => (created ? [chambre, nouvelleCuisine] : [chambre]));
    const { result } = await renderLoaded();
    const create = vi.fn(() => {
      created = true;
      return Promise.reject(new TypeError('Failed to fetch'));
    });

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutate({ kind: 'create' }, create);
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(outcome).toMatchObject({ status: 'uncertain', reconciled: true });
    expect(result.current.needsRefresh).toBe(false);
    expect(result.current.snapshot?.faits.logement.pieces.map((entry) => entry.id)).toEqual([
      'piece-chambre',
      'piece-cuisine',
    ]);
  });

  it('bloque les écritures tant que la relecture après une issue incertaine échoue', async () => {
    let failReads = false;
    const fetchMock = mockReads();
    const reads = fetchMock.getMockImplementation();
    fetchMock.mockImplementation(async (input, init) => {
      if (failReads) throw new TypeError('Failed to fetch');
      return reads ? reads(input, init) : jsonResponse(null);
    });
    const { result } = await renderLoaded();
    failReads = true;

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutate({ kind: 'create' }, () =>
        Promise.reject(new SimulatorApiError(502))
      );
    });
    expect(outcome).toMatchObject({ status: 'uncertain', reconciled: false });
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

  it('ignore une écriture de pièce terminée après un changement de simulation', async () => {
    mockReads();
    const hook = await renderLoaded();
    const late = deferred<ReturnType<typeof parseMutationFaits>>();
    let pendingMutation: Promise<unknown> | undefined;
    act(() => {
      pendingMutation = hook.result.current.mutate({ kind: 'create' }, () => late.promise);
    });

    hook.rerender({ id: 'autre-simulation' });
    let outcome: unknown;
    await act(async () => {
      late.resolve(parseMutationFaits(mutationResponse([chambre, nouvelleCuisine])));
      outcome = await pendingMutation;
    });

    expect(outcome).toEqual({ status: 'stale' });
    expect(hook.result.current.snapshot).toBeNull();
    await waitFor(() => expect(hook.result.current.pending).toBeNull());
  });

  it('applique paramètres et évaluation renvoyés par un PUT de paramètre', async () => {
    mockReads();
    const { result } = await renderLoaded();
    const saved = factuelleSimulationResponse(
      evaluationResponse({
        surfaces: { categorie: '4*', minima_locaux: [], qualifications_pieces: [] },
      }),
      { categorie_demandee: '4*' }
    );

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutateParameters(async () => saved);
    });

    expect(outcome).toEqual({ status: 'success', simulation: saved });
    expect(result.current.snapshot?.faits.parametres.categorie_demandee).toBe('4*');
    expect(result.current.snapshot?.evaluation?.surfaces?.categorie).toBe('4*');
  });

  it('ignore un PUT de paramètre lancé sur une autre simulation', async () => {
    mockReads();
    const hook = await renderLoaded();
    const late = deferred<PublicSimulationDto>();
    let pendingMutation: Promise<unknown> | undefined;
    act(() => {
      pendingMutation = hook.result.current.mutateParameters(() => late.promise);
    });

    hook.rerender({ id: 'autre-simulation' });
    await act(async () => {
      await hook.result.current.load('autre-simulation', null);
    });
    const otherSnapshot = hook.result.current.snapshot;
    let outcome: unknown;
    await act(async () => {
      late.resolve(factuelleSimulationResponse(evaluationResponse(), { capacite_accueil: 9 }));
      outcome = await pendingMutation;
    });

    expect(outcome).toEqual({ status: 'stale' });
    expect(hook.result.current.snapshot).toBe(otherSnapshot);
    expect(hook.result.current.snapshot?.faits.parametres.capacite_accueil).toBe(2);
  });

  it('réconcilie simulation et paramètres après un PUT de paramètre incertain, sans le rejouer', async () => {
    const serverSimulation = factuelleSimulationResponse(evaluationResponse(), {
      capacite_accueil: 3,
    });
    mockReads(() => [chambre], serverSimulation);
    const onSimulationReconciled = vi.fn();
    const { result } = await renderLoaded(onSimulationReconciled);
    const operation = vi.fn(() => Promise.reject(new SimulatorApiError(503)));

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.mutateParameters(operation);
    });

    expect(operation).toHaveBeenCalledTimes(1);
    expect(outcome).toMatchObject({ status: 'uncertain', reconciled: true });
    expect(onSimulationReconciled).toHaveBeenCalledWith(serverSimulation);
    expect(result.current.needsRefresh).toBe(false);
    expect(result.current.pending).toBeNull();
  });
});
