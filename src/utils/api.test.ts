import { afterEach, describe, expect, it, vi } from 'vitest';
import { RATE_LIMIT_ERROR_MESSAGE, submitToApi } from './api';

describe('submitToApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retourne un message explicite sur une réponse HTTP 429 sans body JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<html>Too many requests</html>', {
        status: 429,
        headers: { 'Content-Type': 'text/html' },
      })
    );

    await expect(submitToApi('/public/forms/contact', { message: 'test' })).resolves.toEqual({
      success: false,
      error: RATE_LIMIT_ERROR_MESSAGE,
    });
  });
});
