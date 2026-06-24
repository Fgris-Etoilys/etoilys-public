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
      status: 429,
      error: RATE_LIMIT_ERROR_MESSAGE,
    });
  });

  it('maps backend error codes to localized English messages', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: 'Donnees invalides.',
          errorCode: 'VALIDATION_FAILED',
          fieldErrors: {
            email: 'L email n est pas valide.',
          },
          fieldErrorCodes: {
            email: 'INVALID_EMAIL',
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await expect(
      submitToApi('/public/forms/contact', { message: 'test' }, { locale: 'en' })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: 'Some fields need to be corrected.',
      errorCode: 'VALIDATION_FAILED',
      fieldErrors: {
        email: 'L email n est pas valide.',
      },
      fieldErrorCodes: {
        email: 'INVALID_EMAIL',
      },
    });
  });

  it('uses localized rate-limit and Turnstile messages', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: false,
            error: 'Trop de tentatives. Merci de reessayer plus tard.',
            errorCode: 'RATE_LIMITED',
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: false,
            error: 'Verification anti-spam invalide.',
            errorCode: 'TURNSTILE_INVALID',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

    await expect(
      submitToApi('/public/forms/contact', { message: 'test' }, { locale: 'en' })
    ).resolves.toMatchObject({
      success: false,
      status: 429,
      error: 'Too many requests were sent in a short time. Please try again in a few minutes.',
      errorCode: 'RATE_LIMITED',
    });

    await expect(
      submitToApi('/public/forms/contact', { message: 'test' }, { locale: 'en' })
    ).resolves.toMatchObject({
      success: false,
      status: 403,
      error: 'The anti-spam verification failed. Please try again.',
      errorCode: 'TURNSTILE_INVALID',
    });
  });

  it('uses localized generic errors for unexpected network failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Erreur réseau brute'));

    await expect(
      submitToApi('/public/forms/contact', { message: 'test' }, { locale: 'en' })
    ).resolves.toEqual({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    });
  });
});
