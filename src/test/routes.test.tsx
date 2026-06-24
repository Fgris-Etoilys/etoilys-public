import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

function expectPageHeading(...patterns: RegExp[]) {
  const heading = screen.getByRole('heading', { level: 1 });
  for (const pattern of patterns) {
    expect(heading).toHaveTextContent(pattern);
  }
}

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
    expectPageHeading(/simulateur/i, /classement/i);
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
    expectPageHeading(/simulateur fiscal/i, /classé|non classé/i);
  });

  it('renders local service areas hub page', () => {
    renderAt('/zones-intervention');
    expectPageHeading(/zones d’intervention/i);
  });

  it('renders Dordogne local landing page', () => {
    renderAt('/classement-meuble-tourisme-dordogne');
    expectPageHeading(/classement/i, /dordogne/i);
  });

  it('renders Gironde local landing page', () => {
    renderAt('/classement-meuble-tourisme-gironde');
    expectPageHeading(/classement/i, /gironde/i);
  });

  it('renders Lot-et-Garonne local landing page', () => {
    renderAt('/classement-meuble-tourisme-lot-et-garonne');
    expectPageHeading(/classement/i, /lot-et-garonne/i);
  });

  it('exposes service areas in classement navigation and footer', () => {
    renderAt('/');

    fireEvent.click(screen.getByLabelText(/ouvrir ou fermer le menu/i));
    fireEvent.click(screen.getByRole('button', { name: /le classement menu/i }));

    expect(
      screen
        .getAllByRole('link', { name: /zones d’intervention/i })
        .some((link) => link.getAttribute('href') === '/zones-intervention')
    ).toBe(true);

    expect(screen.getByRole('link', { name: /classement en dordogne/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-dordogne'
    );

    expect(screen.getByRole('link', { name: /classement en gironde/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );

    expect(screen.getByRole('link', { name: /classement en lot-et-garonne/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot-et-garonne'
    );
  });

  it('renders not found page for unknown route', () => {
    renderAt('/url-inexistante');
    expect(screen.getByRole('heading', { name: /page non trouvée/i })).toBeInTheDocument();
  });
});
