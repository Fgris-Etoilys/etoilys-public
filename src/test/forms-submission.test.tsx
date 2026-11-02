import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { formContent } from '../i18n/formContent';
import type { Locale } from '../i18n/locales';
import {
  clickNext,
  clickSubmit,
  COMMUNE_UNIQUE,
  fieldByName,
  jsonResponse,
  mockDemandeApi,
  reachFinalStep,
  setField,
  submitBody,
  submitRequests,
  SUCCESS_BODY,
  WIZARD_VALUES,
} from './demandeClassementWizard';

const openAiAdsMock = vi.hoisted(() => ({
  trackLeadCreatedConversion: vi.fn(),
}));

vi.mock('../utils/openAiAds', () => ({
  trackLeadCreatedConversion: openAiAdsMock.trackLeadCreatedConversion,
}));

let turnstileCallback: ((token: string) => void) | null = null;
const resetTurnstile = vi.fn();
const removeTurnstile = vi.fn();

const renderTurnstile = vi.fn(
  (_container: HTMLElement, options: { callback: (token: string) => void; language: string }) => {
    turnstileCallback = options.callback;
    return 'turnstile-widget';
  }
);

const fillInput = (label: RegExp, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const fillTextarea = (name: string, value: string) => {
  const textarea = document.querySelector(`textarea[name="${name}"]`);
  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new Error(`Textarea ${name} not found`);
  }
  fireEvent.change(textarea, { target: { value } });
};

const getLastFetchBody = (): Record<string, unknown> => {
  const calls = vi.mocked(globalThis.fetch).mock.calls;
  const [, init] = calls[calls.length - 1] ?? [];
  return JSON.parse(String(init?.body)) as Record<string, unknown>;
};

const createDeferredResponse = () => {
  let resolve: (value: Response) => void = () => undefined;
  const promise = new Promise<Response>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return {
    promise,
    resolveSuccess: () =>
      resolve(
        new Response(
          JSON.stringify({
            success: true,
            message: 'ok',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      ),
  };
};

describe('localized form submissions', () => {
  beforeEach(() => {
    renderTurnstile.mockClear();
    resetTurnstile.mockClear();
    removeTurnstile.mockClear();
    openAiAdsMock.trackLeadCreatedConversion.mockReset();
    turnstileCallback = null;
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'site-key');
    window.turnstile = {
      render: renderTurnstile,
      remove: removeTurnstile,
      reset: resetTurnstile,
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: 'ok',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete window.turnstile;
  });

  it('sends preferredLanguage fr from the French contact form', async () => {
    render(
      <MemoryRouter>
        <ContactForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Jane Doe');
    fillInput(/^email/i, 'jane@example.com');
    fillTextarea('message', 'Bonjour');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer mon message/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    expect(await screen.findByRole('status')).toBeVisible();

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Bonjour',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'fr',
    });
  });

  it('sends preferredLanguage en from the English contact form', async () => {
    render(
      <MemoryRouter>
        <ContactForm locale="en" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^name/i, 'Jane Doe');
    fillInput(/^email/i, 'jane@example.com');
    fillTextarea('message', 'Hello');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /send my message/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'en',
    });
  });

  it('sends preferredLanguage nl from the Dutch contact form', async () => {
    render(
      <MemoryRouter>
        <ContactForm locale="nl" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^naam/i, 'Jane Doe');
    fillInput(/^e-mail/i, 'jane@example.com');
    fillTextarea('message', 'Hallo');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /mijn bericht versturen/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hallo',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'nl',
    });
  });

  it('disables the contact submit button while the request is pending', async () => {
    const deferred = createDeferredResponse();
    vi.mocked(globalThis.fetch).mockReturnValueOnce(deferred.promise);

    render(
      <MemoryRouter>
        <ContactForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Jane Doe');
    fillInput(/^email/i, 'jane@example.com');
    fillTextarea('message', 'Bonjour');
    fireEvent.click(screen.getByRole('checkbox'));

    const submitButton = screen.getByRole('button', { name: /envoyer mon message/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());

    await act(async () => {
      deferred.resolveSuccess();
      await deferred.promise;
    });
  });

  it('resets the contact Turnstile token after an API error and requires a new token before retry', async () => {
    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: false,
            error: 'Envoi impossible.',
            errorCode: 'NOTIFICATION_FAILED',
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: 'ok',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

    render(
      <MemoryRouter>
        <ContactForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('first-turnstile-token');
    });

    fillInput(/^nom/i, 'Jane Doe');
    fillInput(/^email/i, 'jane@example.com');
    fillTextarea('message', 'Bonjour');
    fireEvent.click(screen.getByRole('checkbox'));

    const submitButton = screen.getByRole('button', { name: /envoyer mon message/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(getLastFetchBody()).toMatchObject({ turnstileToken: 'first-turnstile-token' });
    expect(await screen.findByRole('alert')).toBeVisible();
    await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));

    fireEvent.click(submitButton);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/merci de valider la vérification anti-spam/i)).toBeVisible();

    act(() => {
      turnstileCallback?.('second-turnstile-token');
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));
    expect(getLastFetchBody()).toMatchObject({ turnstileToken: 'second-turnstile-token' });
  });

  describe('classification request', () => {
    const fillClassementWizard = async (locale: Locale, token = 'turnstile-token') => {
      await reachFinalStep(locale);
      setField('message', 'Classement');
      await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
      act(() => {
        turnstileCallback?.(token);
      });
    };

    const renderClassementForm = (locale: Locale) =>
      render(
        <MemoryRouter>
          <DemandeClassementForm locale={locale} />
        </MemoryRouter>
      );

    beforeEach(() => {
      mockDemandeApi();
    });

    it.each(['en', 'nl', 'fr'] as const)(
      'sends preferredLanguage %s from the classification request form',
      async (locale) => {
        renderClassementForm(locale);

        await fillClassementWizard(locale);
        expect(renderTurnstile).toHaveBeenLastCalledWith(
          expect.any(HTMLElement),
          expect.objectContaining({ language: locale })
        );
        clickSubmit(locale);

        await waitFor(() => expect(submitRequests()).toHaveLength(1));
        expect(submitBody()).toMatchObject({
          ...WIZARD_VALUES,
          codePostal: '24150',
          commune: COMMUNE_UNIQUE.nom,
          codeInsee: COMMUNE_UNIQUE.codeInsee,
          classementActuelDeclare: 'NC',
          message: 'Classement',
          consent: true,
          turnstileToken: 'turnstile-token',
          consentVersion: 'privacy-v1',
          preferredLanguage: locale,
        });
      }
    );

    it('disables the classification request submit button while the request is pending', async () => {
      const deferred = createDeferredResponse();
      mockDemandeApi({ submit: () => deferred.promise });
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i });
      fireEvent.click(submitButton);

      await waitFor(() => expect(submitButton).toBeDisabled());

      await act(async () => {
        deferred.resolveSuccess();
        await deferred.promise;
      });
    });

    it('resets the classification request Turnstile token after an API error and accepts a new token on retry', async () => {
      let attempts = 0;
      mockDemandeApi({
        submit: () => {
          attempts += 1;
          return attempts === 1
            ? jsonResponse(
                {
                  success: false,
                  error: 'Envoi impossible.',
                  errorCode: 'PERSISTENCE_UNAVAILABLE',
                },
                503
              )
            : jsonResponse(SUCCESS_BODY);
        },
      });
      renderClassementForm('fr');

      await fillClassementWizard('fr', 'first-turnstile-token');
      const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i });
      fireEvent.click(submitButton);

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      expect(submitBody()).toMatchObject({ turnstileToken: 'first-turnstile-token' });
      expect(await screen.findByRole('alert')).toBeVisible();
      await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));

      fireEvent.click(submitButton);

      expect(submitRequests()).toHaveLength(1);
      expect(await screen.findByText(/merci de valider la vérification anti-spam/i)).toBeVisible();

      act(() => {
        turnstileCallback?.('second-turnstile-token');
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(submitRequests()).toHaveLength(2));
      expect(submitBody()).toMatchObject({ turnstileToken: 'second-turnstile-token' });
    });

    it('triggers the OpenAI Ads lead_created conversion only after a confirmed classification request success', async () => {
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      clickSubmit('fr');

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      await waitFor(() =>
        expect(openAiAdsMock.trackLeadCreatedConversion).toHaveBeenCalledTimes(1)
      );
      expect(await screen.findByRole('status')).toBeVisible();
      expect(screen.getByRole('status')).toHaveTextContent(
        formContent.fr.demandeClassement.success
      );
    });

    it('does not trigger the OpenAI Ads conversion on frontend validation failure', () => {
      renderClassementForm('fr');

      // Aucun champ renseigné : la progression est bloquée avant tout appel API.
      clickNext('fr');

      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
    });

    it('does not trigger the OpenAI Ads conversion on a network error', async () => {
      mockDemandeApi({
        submit: () => {
          throw new Error('network down');
        },
      });
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      clickSubmit('fr');

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
      expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
    });

    it('does not trigger the OpenAI Ads conversion on an HTTP error response', async () => {
      mockDemandeApi({
        submit: () => jsonResponse({ success: false, error: 'Erreur serveur.' }, 500),
      });
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      clickSubmit('fr');

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
      expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
    });

    it('does not trigger the OpenAI Ads conversion when the API reports a business failure', async () => {
      mockDemandeApi({
        submit: () =>
          jsonResponse({
            success: false,
            error: 'Envoi impossible.',
            errorCode: 'NOTIFICATION_FAILED',
          }),
      });
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      clickSubmit('fr');

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
      expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
    });

    it('still shows the business success state and resets the form even if the OpenAI Ads helper throws', async () => {
      openAiAdsMock.trackLeadCreatedConversion.mockImplementation(() => {
        throw new Error('OpenAI Ads SDK exploded');
      });
      renderClassementForm('fr');

      await fillClassementWizard('fr');
      clickSubmit('fr');

      await waitFor(() =>
        expect(openAiAdsMock.trackLeadCreatedConversion).toHaveBeenCalledTimes(1)
      );
      expect(await screen.findByRole('status')).toHaveTextContent(
        formContent.fr.demandeClassement.success
      );
      expect(fieldByName('codePostal')).toHaveValue('');
    });
  });
});
