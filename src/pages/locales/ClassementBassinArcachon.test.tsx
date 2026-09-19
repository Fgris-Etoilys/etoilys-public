import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { BASSIN_ARCACHON_SERVICE_COMMUNES } from '../../content/local/destinations/bassinArcachon';

function renderBassinArcachonPage() {
  window.history.pushState({}, 'Bassin d’Arcachon', '/classement-meuble-tourisme-bassin-arcachon');
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

describe('ClassementBassinArcachon', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders the Bassin d’Arcachon destination with V6 surfaces and local content', () => {
    renderBassinArcachonPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme sur le Bassin d’Arcachon',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('sur le Bassin d’Arcachon')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getByText('Cabanes tchanquées, île aux Oiseaux')).toBeInTheDocument();
    expect(
      screen.getByAltText('Cabanes tchanquées sur l’île aux Oiseaux dans le Bassin d’Arcachon')
    ).toHaveAttribute('src', IMAGE_MANIFEST.bassinArcachonHero.src);
    expect(
      screen.getByAltText('Entrée du bassin d’Arcachon depuis la dune du Pilat')
    ).toHaveAttribute('src', IMAGE_MANIFEST.bassinArcachonDunePilat.src);
    expect(
      screen.getByText('Entrée du bassin d’Arcachon depuis la dune du Pilat.')
    ).toBeInTheDocument();

    expectHeadingSequence([
      'Classement de meublé de tourisme sur le Bassin d’Arcachon',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous sur le Bassin d’Arcachon\s*\?/,
      'Combien coûte le classement d’un meublé sur le Bassin d’Arcachon ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement sur le Bassin d’Arcachon ?',
      'Sur le Bassin, les étoiles peuvent aussi alléger la taxe de séjour',
      'Questions fréquentes sur le classement sur le Bassin d’Arcachon',
      'Demandez le classement de votre meublé sur le Bassin d’Arcachon',
    ]);

    BASSIN_ARCACHON_SERVICE_COMMUNES.forEach((commune) => {
      expect(screen.getByText(commune)).toBeInTheDocument();
    });
    const serviceArea = screen
      .getByRole('heading', { name: /Où intervenons-nous sur le Bassin d’Arcachon/i })
      .closest('section');
    if (!serviceArea) throw new Error('Missing service area section');
    expect(within(serviceArea).queryByText('Pyla-sur-Mer')).not.toBeInTheDocument();
    expect(within(serviceArea).queryByText('Cap Ferret')).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: /zone d’intervention en Gironde/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );
    expect(screen.getByText('Studio / T1')).toBeInTheDocument();
    expect(screen.getByText('T2 / T3 / T4')).toBeInTheDocument();
    expect(screen.getByText('T5 et plus')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/180\s€\s*TTC/);
    expect(document.body).toHaveTextContent(/200\s€\s*TTC/);
    expect(document.body).toHaveTextContent(/250\s€\s*TTC/);
    expect(screen.getByText('Renouvellement : -20 %')).toBeInTheDocument();

    expect(screen.getByText('Exemple à Arcachon')).toBeInTheDocument();
    expect(screen.getByText('Taxe de séjour pour 6 adultes')).toBeInTheDocument();
    expect(screen.getByText('Logement à 250 € la nuit')).toBeInTheDocument();
    expect(screen.getByText('13,86 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('7,78 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('6,08 € de taxe de séjour en moins par nuit, soit une baisse d’environ 44 %')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/42,56 € de taxe de séjour en moins sur une semaine/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tarifs 2026 d’Arcachon, taxes additionnelles comprises.')
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
    ).toHaveLength(2);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intervenez-vous aussi au Cap Ferret, à Pyla-sur-Mer et dans les autres communes du Bassin ?',
      })
    );
    expect(document.body).toHaveTextContent('Cazaux');
    expect(document.body).toHaveTextContent('Claouey');

    fireEvent.click(
      screen.getByRole('button', { name: 'Comment savoir quelle catégorie viser ?' })
    );
    expect(screen.getByRole('link', { name: 'simulateur Etoilys' })).toHaveAttribute(
      'href',
      '/simulateur'
    );

    const main = screen.getByRole('main');
    expect(
      within(main).getAllByRole('link', { name: 'Demander mon classement' }).length
    ).toBeGreaterThanOrEqual(2);
  });

  it('sets Bassin d’Arcachon SEO metadata and hierarchical breadcrumb JSON-LD', async () => {
    renderBassinArcachonPage();

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme Bassin d’Arcachon | Etoilys');
    });

    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre meublé de tourisme sur le Bassin d’Arcachon. Visite dans les 12 communes, tarifs clairs et sans frais de déplacement.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-bassin-arcachon'
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
          name: 'Bassin d’Arcachon',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-bassin-arcachon',
        },
      ]);
    });
  });
});
