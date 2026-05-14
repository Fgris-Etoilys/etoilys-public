import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '../App';

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

const mockFetchJson = (body: unknown) => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
};

const mockFetchJsonSequence = (responses: unknown[]) => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  responses.forEach((body) => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
};

describe('routing', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders legal privacy page', () => {
    renderAt('/confidentialite');
    expect(
      screen.getByRole('heading', { name: /politique de confidentialit/i })
    ).toBeInTheDocument();
  });

  it('renders legal mentions page', () => {
    renderAt('/mentions-legales');
    expect(screen.getByRole('heading', { name: /mentions légales/i })).toBeInTheDocument();
  });

  it('renders contact page', () => {
    renderAt('/contact');
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders public classement simulator page', () => {
    mockFetchJson([]);
    renderAt('/simulateur');
    expect(
      screen.getByRole('heading', { level: 1, name: /simulateur de classement/i })
    ).toBeInTheDocument();
  });

  it('renders public classement simulation detail page', async () => {
    mockFetchJsonSequence([
      {
        id: 'simulation-id',
        grille: {
          categorie_demandee: '3*',
          capacite_accueil: 4,
          type_habitation: 'INDIVIDUEL',
          etage: 0,
        },
      },
      { id: 'logement-id', pieces: [] },
    ]);

    renderAt('/simulateur/simulation-id');

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
  });

  it('renders fiscal simulator page', () => {
    renderAt('/simulateur-fiscal-classement');
    expect(
      screen.getByRole('heading', { name: /simulateur fiscal classement 2026/i })
    ).toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    renderAt('/url-inexistante');
    expect(screen.getByRole('heading', { name: /page non trouvée/i })).toBeInTheDocument();
  });
});
