import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

function renderBordeauxPage() {
  window.history.pushState({}, 'Bordeaux', '/classement-meuble-tourisme-bordeaux');
  return render(<App />);
}

function getJsonLdScripts() {
  return [
    ...document.querySelectorAll<HTMLScriptElement>("script[type='application/ld+json']"),
  ].map((script) => JSON.parse(script.textContent ?? '{}') as Record<string, unknown>);
}

describe('ClassementBordeaux', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders the Bordeaux city page with local data and no local proof module', () => {
    renderBordeauxPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Bordeaux et dans la métropole',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Mérignac')).toBeInTheDocument();
    expect(screen.getByText('Villenave-d’Ornon')).toBeInTheDocument();
    expect(screen.getByText('10,80 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('5,76 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('5,04 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/35,28 € de taxe de séjour en moins sur une semaine/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText('240 € TTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('200 € TTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('160 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('100 € par logement').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/numéro d’enregistrement/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90 jours par année civile/i).length).toBeGreaterThan(0);
    expect(document.body).not.toHaveTextContent(
      /témoignage|partenariat local|agence Etoilys à Bordeaux/i
    );
    expect(document.body).not.toHaveTextContent(/LocalBusiness/i);
  });

  it('sets Bordeaux SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
    renderBordeauxPage();

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme à Bordeaux | Etoilys');
    });

    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre meublé de tourisme à Bordeaux et dans la métropole. Visite sur place, tarifs clairs et demande en ligne avec Etoilys.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-bordeaux'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow'
    );
    expect(document.querySelectorAll("link[data-seo-alternate='true']")).toHaveLength(0);

    await waitFor(() => {
      const breadcrumbs = getJsonLdScripts().find((script) => script['@type'] === 'BreadcrumbList');
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs?.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://www.etoilys.fr/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Zones d’intervention',
          item: 'https://www.etoilys.fr/zones-intervention',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Gironde',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-gironde',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Bordeaux',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-bordeaux',
        },
      ]);
    });
  });
});
