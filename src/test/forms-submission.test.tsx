import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';

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

  it('sends preferredLanguage en from the English classification request form', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="en" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^last name/i, 'Doe');
    fillInput(/^first name/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^phone/i, '+33 6 12 34 56 78');
    fillInput(/^accommodation address/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classification');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /send my request/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Doe',
      prenom: 'Jane',
      email: 'jane@example.com',
      telephone: '+33 6 12 34 56 78',
      adresse: '1 rue de test, 24150 Mauzac',
      message: 'Classification',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'en',
    });
  });

  it('sends preferredLanguage nl from the Dutch classification request form', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="nl" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    expect(renderTurnstile).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ language: 'nl' })
    );
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^achternaam/i, 'Doe');
    fillInput(/^voornaam/i, 'Jane');
    fillInput(/^e-mail/i, 'jane@example.com');
    fillInput(/^telefoon/i, '+33 6 12 34 56 78');
    fillInput(/^adres van de vakantiewoning/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classificatie');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /mijn aanvraag versturen/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Doe',
      prenom: 'Jane',
      email: 'jane@example.com',
      telephone: '+33 6 12 34 56 78',
      adresse: '1 rue de test, 24150 Mauzac',
      message: 'Classificatie',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'nl',
    });
  });

  it('sends preferredLanguage fr from the French classification request form', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());

    expect(getLastFetchBody()).toMatchObject({
      nom: 'Doe',
      prenom: 'Jane',
      email: 'jane@example.com',
      telephone: '+33 6 12 34 56 78',
      adresse: '1 rue de test, 24150 Mauzac',
      message: 'Classement',
      consent: true,
      turnstileToken: 'turnstile-token',
      consentVersion: 'privacy-v1',
      preferredLanguage: 'fr',
    });
  });

  it('disables the classification request submit button while the request is pending', async () => {
    const deferred = createDeferredResponse();
    vi.mocked(globalThis.fetch).mockReturnValueOnce(deferred.promise);

    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));

    const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());

    await act(async () => {
      deferred.resolveSuccess();
      await deferred.promise;
    });
  });

  it('resets the classification request Turnstile token after an API error and accepts a new token on retry', async () => {
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
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('first-turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));

    const submitButton = screen.getByRole('button', { name: /envoyer ma demande/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(getLastFetchBody()).toMatchObject({ turnstileToken: 'first-turnstile-token' });
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

  it('triggers the OpenAI Ads lead_created conversion only after a confirmed classification request success', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    await waitFor(() => expect(openAiAdsMock.trackLeadCreatedConversion).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/envoyée avec succès/i)).toBeVisible();
  });

  it('does not trigger the OpenAI Ads conversion on frontend validation failure', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    // No fields filled in and no Turnstile token provided: submit should be blocked before any API call.
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });

  it('does not trigger the OpenAI Ads conversion on a network error', async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error('network down'));

    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
    expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });

  it('does not trigger the OpenAI Ads conversion on an HTTP error response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, error: 'Erreur serveur.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
    expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });

  it('does not trigger the OpenAI Ads conversion when the API reports a business failure', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: 'Envoi impossible.',
          errorCode: 'NOTIFICATION_FAILED',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(resetTurnstile).toHaveBeenCalledWith('turnstile-widget'));
    expect(openAiAdsMock.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });

  it('still shows the business success state and resets the form even if the OpenAI Ads helper throws', async () => {
    openAiAdsMock.trackLeadCreatedConversion.mockImplementation(() => {
      throw new Error('OpenAI Ads SDK exploded');
    });

    render(
      <MemoryRouter>
        <DemandeClassementForm locale="fr" />
      </MemoryRouter>
    );

    await waitFor(() => expect(renderTurnstile).toHaveBeenCalled());
    act(() => {
      turnstileCallback?.('turnstile-token');
    });

    fillInput(/^nom/i, 'Doe');
    fillInput(/^prénom/i, 'Jane');
    fillInput(/^email/i, 'jane@example.com');
    fillInput(/^téléphone/i, '+33 6 12 34 56 78');
    fillInput(/^adresse/i, '1 rue de test, 24150 Mauzac');
    fillTextarea('message', 'Classement');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /envoyer ma demande/i }));

    await waitFor(() => expect(openAiAdsMock.trackLeadCreatedConversion).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/envoyée avec succès/i)).toBeVisible();

    const nameInput = screen.getByLabelText(/^nom/i) as HTMLInputElement;
    expect(nameInput.value).toBe('');
  });
});
