import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';

let turnstileCallback: ((token: string) => void) | null = null;

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

describe('localized form submissions', () => {
  beforeEach(() => {
    renderTurnstile.mockClear();
    turnstileCallback = null;
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'site-key');
    window.turnstile = {
      render: renderTurnstile,
      remove: vi.fn(),
      reset: vi.fn(),
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          submissionId: 'submission-id',
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
});
