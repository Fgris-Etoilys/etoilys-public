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

function expectHeadingSequence(expectedHeadings: Array<string | RegExp>) {
  const headings = screen.getAllByRole('heading').map((heading) => heading.textContent ?? '');
  let cursor = -1;

  expectedHeadings.forEach((expectedHeading) => {
    const nextIndex = headings.findIndex((heading, index) => {
      if (index <= cursor) return false;
      return typeof expectedHeading === 'string'
        ? heading === expectedHeading
        : expectedHeading.test(heading);
    });

    expect(
      nextIndex,
      `Missing heading after index ${cursor}: ${String(expectedHeading)}`
    ).toBeGreaterThan(cursor);
    cursor = nextIndex;
  });
}

function expectHeadingSectionClass(headingName: string | RegExp, className: string | RegExp) {
  const heading = screen.getByRole('heading', { name: headingName });
  const section = heading.closest('section');

  expect(section).not.toBeNull();
  if (typeof className === 'string') {
    expect(section).toHaveClass(className);
    return;
  }

  expect(section?.className).toEqual(expect.stringMatching(className));
}

describe('ClassementBordeaux', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders the Bordeaux city page with local data and V4 common sections', () => {
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
    expect(screen.getAllByText(/changement d’usage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/compensation/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: 'Consulter le guide propriétaire de la Ville de Bordeaux' })
    ).toHaveAttribute(
      'href',
      'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires'
    );
    expect(document.body).not.toHaveTextContent(
      /témoignage|partenariat local|agence Etoilys à Bordeaux/i
    );
    expect(document.body).not.toHaveTextContent(/LocalBusiness/i);
  });

  it('renders Bordeaux in the V4 section order with the local warning after the service area', () => {
    renderBordeauxPage();

    expectHeadingSequence([
      'Classement de meublé de tourisme à Bordeaux et dans la métropole',
      'Pourquoi classer votre meublé ?',
      'Votre classement directement dans votre logement',
      'Avant de louer à Bordeaux, trois règles locales à vérifier',
      'Combien coûte le classement d’un meublé à Bordeaux ?',
      'Votre classement en 3 étapes',
      'Pourquoi choisir Etoilys pour votre classement à Bordeaux ?',
      'Un exemple concret à Bordeaux : l’effet du classement sur la taxe de séjour',
      'Questions fréquentes sur le classement à Bordeaux',
      'Vous souhaitez faire classer votre meublé à Bordeaux ?',
    ]);

    expect(screen.queryByText(/Cette liste n’est pas exhaustive/i)).not.toBeInTheDocument();
    expectHeadingSectionClass('Pourquoi classer votre meublé ?', 'bg-white');
    expectHeadingSectionClass('Votre classement directement dans votre logement', 'bg-primary-100');
    expectHeadingSectionClass(
      'Avant de louer à Bordeaux, trois règles locales à vérifier',
      'bg-primary-100'
    );
    expectHeadingSectionClass('Combien coûte le classement d’un meublé à Bordeaux ?', 'bg-white');
    expectHeadingSectionClass('Votre classement en 3 étapes', 'bg-primary-100');
    expectHeadingSectionClass(
      'Pourquoi choisir Etoilys pour votre classement à Bordeaux ?',
      'bg-white'
    );
    expectHeadingSectionClass(
      'Un exemple concret à Bordeaux : l’effet du classement sur la taxe de séjour',
      'bg-primary-100'
    );
    expectHeadingSectionClass('Questions fréquentes sur le classement à Bordeaux', 'bg-white');
    expectHeadingSectionClass('Vous souhaitez faire classer votre meublé à Bordeaux ?', /from-/);
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
