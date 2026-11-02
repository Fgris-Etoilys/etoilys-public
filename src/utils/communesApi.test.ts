import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCommunesByPostalCode } from './communesApi';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const communeDto = (index: number) => ({
  codeInsee: String(10000 + index),
  nom: `Commune ${index}`,
  codesPostaux: ['51800'],
  millesime: 2026,
  territoire: { siren: '200000172', nom: 'CC de test', type: 'CC' },
});

const communeDtos = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => communeDto(index + offset));

const search = (codePostal = '24150') =>
  fetchCommunesByPostalCode(codePostal, new AbortController().signal);

const requestedParams = (call = 0) => {
  const url = String(vi.mocked(globalThis.fetch).mock.calls[call]?.[0]);
  return new URL(url, 'http://test');
};

describe('fetchCommunesByPostalCode', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('calls the same-origin API with the maximum page size', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([]));

    await expect(search('00000')).resolves.toEqual([]);

    const url = requestedParams();
    expect(url.pathname).toBe('/api/public/communes');
    expect(url.searchParams.get('codePostal')).toBe('00000');
    expect(url.searchParams.get('taille')).toBe('50');
    expect(url.searchParams.get('page')).toBe('0');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('keeps only the name and technical code of each commune', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(communeDtos(2)));

    await expect(search()).resolves.toEqual([
      { codeInsee: '10000', nom: 'Commune 0' },
      { codeInsee: '10001', nom: 'Commune 1' },
    ]);
  });

  it('reads the next page until one is incomplete, to stay exhaustive', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(communeDtos(50)))
      .mockResolvedValueOnce(jsonResponse(communeDtos(3, 50)));

    const communes = await search('51800');

    expect(communes).toHaveLength(53);
    expect(communes[communes.length - 1]).toEqual({ codeInsee: '10052', nom: 'Commune 52' });
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(requestedParams(1).searchParams.get('page')).toBe('1');
  });

  it('checks one more page when the last one is exactly full', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(communeDtos(50)))
      .mockResolvedValueOnce(jsonResponse([]));

    await expect(search()).resolves.toHaveLength(50);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('fails rather than looping forever on an endless API', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => jsonResponse(communeDtos(50)));

    await expect(search()).rejects.toThrow();
    expect(globalThis.fetch).toHaveBeenCalledTimes(5);
  });

  it.each([401, 403, 404, 429, 500, 503])('fails on HTTP %i', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ code: 'ERROR' }, status));

    await expect(search()).rejects.toThrow();
  });

  it('fails on an invalid JSON body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<html>Bad gateway</html>'));

    await expect(search()).rejects.toThrow();
  });

  it.each([
    ['a non-array body', { communes: [] }],
    ['a commune without code', [{ nom: 'Sans code' }]],
    ['a commune without name', [{ codeInsee: '24150' }]],
    ['an empty name', [{ codeInsee: '24150', nom: '' }]],
  ])('fails on %s', async (_label, body) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(body));

    await expect(search()).rejects.toThrow();
  });

  it('fails on a network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(search()).rejects.toThrow();
  });

  const mockFetchUntilAborted = () =>
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('Aborted')));
        })
    );

  it('fails after a 10 second timeout', async () => {
    vi.useFakeTimers();
    mockFetchUntilAborted();

    const result = search();
    const assertion = expect(result).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(10_000);

    await assertion;
  });

  it('does not fail before the timeout', async () => {
    vi.useFakeTimers();
    mockFetchUntilAborted();

    const settled = vi.fn();
    void search().catch(settled);
    await vi.advanceTimersByTimeAsync(9_999);

    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalledTimes(1);
  });

  it('propagates the caller cancellation to the request', async () => {
    mockFetchUntilAborted();
    const controller = new AbortController();

    const result = fetchCommunesByPostalCode('24150', controller.signal);
    controller.abort();

    await expect(result).rejects.toThrow();
  });
});
