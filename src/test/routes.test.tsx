import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { EN_MVP_PATHS, NL_MVP_PATHS } from './i18nMvpTestData';

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
    expect(document.documentElement.lang).toBe('fr');
    expect(document.querySelector("link[rel='canonical']")).not.toBeInTheDocument();
    expect(document.querySelector("link[rel='alternate']")).not.toBeInTheDocument();
    expect(document.querySelector("script[type='application/ld+json']")).not.toBeInTheDocument();
  });

  it('renders localized English not found page for unknown /en routes', () => {
    renderAt('/en/route-inexistante');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/en');
    expect(screen.getByRole('link', { name: /contact etoilys/i })).toHaveAttribute(
      'href',
      '/en/contact'
    );
    expect(document.documentElement.lang).toBe('en');
    expect(document.querySelector("link[rel='canonical']")).not.toBeInTheDocument();
    expect(document.querySelector("link[rel='alternate']")).not.toBeInTheDocument();
    expect(document.querySelector("script[type='application/ld+json']")).not.toBeInTheDocument();
  });

  it('renders localized Dutch not found page for unknown /nl routes', () => {
    renderAt('/nl/route-inconnue');
    expect(screen.getByRole('heading', { name: /pagina niet gevonden/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terug naar home/i })).toHaveAttribute('href', '/nl');
    expect(screen.getByRole('link', { name: /contact met etoilys/i })).toHaveAttribute(
      'href',
      '/nl/contact'
    );
    expect(document.documentElement.lang).toBe('nl');
    expect(document.querySelector("link[rel='canonical']")).not.toBeInTheDocument();
    expect(document.querySelector("link[rel='alternate']")).not.toBeInTheDocument();
    expect(document.querySelector("script[type='application/ld+json']")).not.toBeInTheDocument();
  });

  it.each(EN_MVP_PATHS)('renders technical English MVP route %s', (pathname) => {
    renderAt(pathname);
    expect(screen.queryByRole('heading', { name: /page non trouv/i })).not.toBeInTheDocument();
  });

  it.each(NL_MVP_PATHS)('renders technical Dutch MVP route %s', (pathname) => {
    renderAt(pathname);
    expect(
      screen.queryByRole('heading', { name: /pagina niet gevonden/i })
    ).not.toBeInTheDocument();
  });

  it.each([
    '/en/actualites',
    '/en/simulateur',
    '/en/simulateur-taxe-sejour',
    '/en/zones-intervention',
    '/en/recrutement',
    '/en/mentions-legales',
    '/en/legal-notice',
  ])('keeps English route outside the MVP unavailable: %s', (pathname) => {
    renderAt(pathname);
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it.each([
    '/nl/simulators',
    '/nl/actualites',
    '/nl/recrutement',
    '/nl/mentions-legales',
    '/nl/classification-simulator',
    '/nl/tourist-tax-simulator',
  ])('keeps Dutch route outside the MVP unavailable: %s', (pathname) => {
    renderAt(pathname);
    expect(screen.getByRole('heading', { name: /pagina niet gevonden/i })).toBeInTheDocument();
  });

  it('sets html lang and alternate links on completed English MVP routes', () => {
    renderAt('/en/benefits-of-furnished-tourist-accommodation-classification');

    expect(document.documentElement.lang).toBe('en');
    expect(document.querySelector('link[hreflang="fr"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/les-avantages-du-classement'
    );
    expect(document.querySelector('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/en/benefits-of-furnished-tourist-accommodation-classification'
    );
    expect(document.querySelector('link[hreflang="nl"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/nl/voordelen-classificatie-vakantiewoning'
    );
    expect(document.querySelector('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/les-avantages-du-classement'
    );
  });

  it('sets html lang and alternate links on completed Dutch MVP routes', () => {
    renderAt('/nl/voordelen-classificatie-vakantiewoning');

    expect(screen.getAllByText(/^Bron:/).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe('nl');
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'nl_NL'
    );
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      'Etoilys - Classificatie van vakantiewoningen in Frankrijk'
    );
    expect(document.querySelector('link[hreflang="fr"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/les-avantages-du-classement'
    );
    expect(document.querySelector('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/en/benefits-of-furnished-tourist-accommodation-classification'
    );
    expect(document.querySelector('link[hreflang="nl"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/nl/voordelen-classificatie-vakantiewoning'
    );
    expect(document.querySelector('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/les-avantages-du-classement'
    );
  });
});
