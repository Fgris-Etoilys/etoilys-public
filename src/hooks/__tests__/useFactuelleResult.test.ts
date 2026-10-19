import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFactuelleSimulation } from '../useFactuelleSimulation';
import { useFactuelleResult } from '../useFactuelleResult';
import { parseMutationFaits } from '../../utils/simulatorFactuelle.types';
import {
  blocage,
  catalogueResponse,
  chambre,
  comparaisonResponse,
  FACTUELLE_SIMULATION_ID as ID,
  factuelleSimulationResponse,
  faitsResponse,
  mutationResponse,
  verificationResponse,
} from '../../test/factuelleFixtures';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const BASE = `/api/public/simulations/${ID}`;

type Handler = () => Response | Promise<Response>;

/** Réponses par « MÉTHODE url », relues à chaque appel ; les appels sont journalisés. */
function mockFetch(routes: Record<string, Handler>) {
  const calls: string[] = [];
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input)}`;
    calls.push(key);
    const handler = routes[key];
    if (!handler) throw new TypeError(`Unexpected fetch call: ${key}`);
    return handler();
  });
  return calls;
}

const reads: Record<string, Handler> = {
  [`GET ${BASE}`]: () => jsonResponse(factuelleSimulationResponse()),
  [`GET ${BASE}/faits`]: () => jsonResponse(faitsResponse()),
  [`GET ${BASE}/faits/catalogue`]: () => jsonResponse(catalogueResponse),
};

function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function renderLoaded() {
  const hook = renderHook(() => {
    const factuelle = useFactuelleSimulation(ID);
    return { factuelle, result: useFactuelleResult(ID, factuelle) };
  });
  await act(async () => {
    await hook.result.current.factuelle.load(ID, null);
  });
  return hook;
}

describe('useFactuelleResult et concurrence FACTUELLE', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('vérifie sous le verrou des écritures puis lit la comparaison', async () => {
    const verifier = deferred<Response>();
    const calls = mockFetch({
      ...reads,
      [`POST ${BASE}/verifier`]: () => verifier.promise,
      [`GET ${BASE}/comparaison`]: () => jsonResponse(comparaisonResponse()),
    });
    const { result } = await renderLoaded();
    const operation = vi.fn();

    let check: Promise<unknown> | undefined;
    act(() => {
      check = result.current.result.check();
    });
    let blocked: unknown;
    await act(async () => {
      blocked = await result.current.factuelle.mutate({ kind: 'create' }, operation);
    });
    expect(blocked).toEqual({ status: 'blocked' });
    expect(operation).not.toHaveBeenCalled();
    expect(result.current.result.state.status).toBe('checking');

    await act(async () => {
      verifier.resolve(jsonResponse(true));
      await check;
    });
    expect(result.current.result.state.status).toBe('fresh');
    expect(result.current.factuelle.pending).toBeNull();
    expect(calls.filter((call) => !call.includes('/faits'))).toEqual([
      `POST ${BASE}/verifier`,
      `GET ${BASE}/comparaison`,
    ]);
  });

  it('affiche les blocages quand la vérification officielle est incomplète', async () => {
    mockFetch({
      ...reads,
      [`POST ${BASE}/verifier`]: () => jsonResponse(false),
      [`GET ${BASE}/verification`]: () =>
        jsonResponse(verificationResponse([blocage({ code: 'PRQ_NON_RESPECTE' })])),
    });
    const { result } = await renderLoaded();

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.result.check();
    });
    expect(outcome).toMatchObject({ kind: 'blocked' });
    expect(result.current.result.state).toMatchObject({
      status: 'blocked',
      verification: { blocages: [{ code: 'PRQ_NON_RESPECTE' }] },
    });
  });

  it('relit une seule fois la vérification après un 409 GRILLE_FACTUELLE_INCOMPLETE', async () => {
    const calls = mockFetch({
      ...reads,
      [`POST ${BASE}/verifier`]: () => jsonResponse(true),
      [`GET ${BASE}/comparaison`]: () =>
        jsonResponse({ code: 'GRILLE_FACTUELLE_INCOMPLETE', message: 'Incomplet' }, 409),
      [`GET ${BASE}/verification`]: () => jsonResponse(verificationResponse()),
    });
    const { result } = await renderLoaded();

    await act(async () => {
      await result.current.result.check();
    });
    expect(result.current.result.state.status).toBe('blocked');
    expect(calls.filter((call) => call.endsWith('/verification'))).toHaveLength(1);
  });

  it('ignore une reprise arrivée après une invalidation', async () => {
    const comparaison = deferred<Response>();
    mockFetch({ ...reads, [`GET ${BASE}/comparaison`]: () => comparaison.promise });
    const { result } = await renderLoaded();

    let hydrate: Promise<unknown> | undefined;
    act(() => {
      hydrate = result.current.result.hydrate(ID, 'FAVORABLE');
    });
    act(() => result.current.result.invalidate());
    await act(async () => {
      comparaison.resolve(jsonResponse(comparaisonResponse()));
      await hydrate;
    });
    expect(result.current.result.state.status).toBe('none');
  });

  it('refuse toute écriture pendant une relecture canonique et relit le catalogue', async () => {
    const simulation = deferred<Response>();
    const calls = mockFetch({ ...reads, [`GET ${BASE}`]: () => simulation.promise });
    const { result } = await renderLoaded();
    const operation = vi.fn();

    let refresh: Promise<unknown> | undefined;
    act(() => {
      refresh = result.current.factuelle.refresh();
    });
    let blocked: unknown;
    await act(async () => {
      blocked = await result.current.factuelle.mutate({ kind: 'global', bloc: 'c18' }, operation);
    });
    expect(blocked).toEqual({ status: 'blocked' });
    expect(operation).not.toHaveBeenCalled();

    await act(async () => {
      simulation.resolve(jsonResponse(factuelleSimulationResponse()));
      await refresh;
    });
    expect(calls.filter((call) => call.endsWith('/faits/catalogue'))).toHaveLength(2);
  });

  it('relit le catalogue après un changement de capacité, pas après un autre paramètre', async () => {
    const calls = mockFetch(reads);
    const { result } = await renderLoaded();
    const catalogueReads = () => calls.filter((call) => call.endsWith('/faits/catalogue')).length;

    await act(async () => {
      await result.current.factuelle.mutateParameters(async () =>
        factuelleSimulationResponse(undefined, { etage: 2 })
      );
    });
    expect(catalogueReads()).toBe(1);

    await act(async () => {
      await result.current.factuelle.mutateParameters(async () =>
        factuelleSimulationResponse(undefined, { capacite_accueil: 6 })
      );
    });
    expect(catalogueReads()).toBe(2);
    expect(result.current.factuelle.snapshot?.faits.parametres.capacite_accueil).toBe(6);
  });

  it('transmet les changements de cascade de la réponse de mutation', async () => {
    mockFetch(reads);
    const { result } = await renderLoaded();
    const cascade = {
      critere_source: 69,
      critere_cible: 68,
      type: 'VALIDATION',
      message: 'Critère 68 validé automatiquement.',
    };

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current.factuelle.mutate(
        { kind: 'criterion', criterionNumber: 69 },
        async () =>
          parseMutationFaits(
            mutationResponse([chambre], undefined, { changements_cascade: [cascade] })
          )
      );
    });
    expect(outcome).toMatchObject({
      status: 'success',
      result: { changements_cascade: [cascade] },
    });
  });
});
