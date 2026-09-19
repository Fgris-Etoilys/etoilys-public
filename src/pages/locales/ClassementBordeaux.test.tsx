import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';

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

describe('ClassementBordeaux', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders Bordeaux with V6 surfaces and preserves tax plus local notice', () => {
    renderBordeauxPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Bordeaux et dans la métropole',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Bordeaux et dans la métropole')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getByText('Place de la Bourse, Bordeaux')).toBeInTheDocument();
    expect(screen.getByAltText('Place de la Bourse et miroir d’eau à Bordeaux')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.bordeauxHero.src
    );
    expect(screen.getByAltText('Jardin Public à Bordeaux')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.bordeauxExpertise.src
    );
    expect(screen.getByText('Jardin Public, Bordeaux.')).toBeInTheDocument();

    expectHeadingSequence([
      'Classement de meublé de tourisme à Bordeaux et dans la métropole',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous autour de Bordeaux\s*\?/,
      'Combien coûte le classement d’un meublé à Bordeaux ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Bordeaux ?',
      'À Bordeaux, mieux se différencier peut aussi coûter moins cher à vos voyageurs',
      'À Bordeaux, quelques règles locales à connaître',
      'Questions fréquentes sur le classement à Bordeaux',
      'Demandez le classement de votre meublé à Bordeaux',
    ]);
    expect(
      screen.getByRole('heading', { level: 2, name: /Où intervenons-nous autour de Bordeaux\s*\?/ })
        .textContent
    ).toContain('Bordeaux\u00a0?');

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

    const notice = screen
      .getByRole('heading', { name: 'À Bordeaux, quelques règles locales à connaître' })
      .closest('.editorial-notice');
    expect(notice).not.toBeNull();
    expect(
      within(notice as HTMLElement).getByText(/numéro d’enregistrement obligatoire/i)
    ).toBeInTheDocument();
    expect(
      within(notice as HTMLElement).getByText(/90 jours par année civile/i)
    ).toBeInTheDocument();
    expect(
      within(notice as HTMLElement).getByText(/changement d’usage applicable/i)
    ).toBeInTheDocument();
    expect(
      within(notice as HTMLElement).getByRole('link', {
        name: /Consulter le guide propriétaire de la Ville de Bordeaux/i,
      })
    ).toHaveAttribute(
      'href',
      'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires'
    );
    expect(
      screen
        .getByRole('heading', {
          name: 'À Bordeaux, mieux se différencier peut aussi coûter moins cher à vos voyageurs',
        })
        .closest('section')
    ).toHaveClass('bg-surface-neutral');
    expect(
      screen
        .getByRole('heading', { name: 'À Bordeaux, quelques règles locales à connaître' })
        .closest('section')
    ).toHaveClass('bg-paper');
    expect(
      screen
        .getByRole('heading', { name: 'Questions fréquentes sur le classement à Bordeaux' })
        .closest('section')
    ).toHaveClass('bg-surface-neutral');

    fireEvent.click(
      screen.getByRole('button', { name: 'Comment savoir quelle catégorie viser ?' })
    );
    expect(screen.getByRole('link', { name: 'simulateur Etoilys' })).toHaveAttribute(
      'href',
      '/simulateur'
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Quels sont les effets du classement sur la fiscalité ?' })
    );
    expect(screen.getByRole('link', { name: 'simulateur fiscal' })).toHaveAttribute(
      'href',
      '/simulateur-fiscal-classement'
    );

    expect(document.body).not.toHaveTextContent(/LocalBusiness|agence Etoilys à Bordeaux/i);
  });

  it('sets Bordeaux SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
    renderBordeauxPage();

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme à Bordeaux | Etoilys');
    });

    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-bordeaux'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow'
    );

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
