import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { MEDOC_ATLANTIQUE_SERVICE_COMMUNES } from '../../content/local/destinations/medocAtlantique';
import { MEDOC_ATLANTIQUE_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import {
  getDepartmentEntryByCode,
  getDepartmentInterventionArea,
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  isLocalRegistryEntryPublished,
} from '../../content/local/registry';
import { getIndexablePaths, getPrerenderPaths } from '../../content/seoRoutes';

function renderMedocAtlantiquePage() {
  window.history.pushState(
    {},
    'Lacanau et Médoc Atlantique',
    '/classement-meuble-tourisme-lacanau-medoc-atlantique'
  );
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

describe('ClassementMedocAtlantique', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders the Lacanau and Médoc Atlantique destination with V6 content', () => {
    renderMedocAtlantiquePage();

    expect(MEDOC_ATLANTIQUE_LOCAL_LANDING_PAGE_V6.scope).toBe('destination');
    expect(MEDOC_ATLANTIQUE_LOCAL_LANDING_PAGE_V6.pricing.pricingProfileId).toBe(
      'gironde-standard'
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Lacanau et dans le Médoc Atlantique',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Lacanau et dans le Médoc Atlantique')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
    expect(screen.getByText('Étang de Lacanau')).toBeInTheDocument();
    expect(screen.getByAltText('Étang de Lacanau dans le Médoc Atlantique')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.medocAtlantiqueHero.src
    );
    expect(
      screen.getByAltText('Océan Atlantique vu depuis la dune à Carcans-Plage')
    ).toHaveAttribute('src', IMAGE_MANIFEST.medocAtlantiqueExpertise.src);
    expect(
      screen.getByText('Océan Atlantique depuis la dune à Carcans-Plage.')
    ).toBeInTheDocument();

    expectHeadingSequence([
      'Classement de meublé de tourisme à Lacanau et dans le Médoc Atlantique',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous dans le Médoc Atlantique\s*\?/,
      'Combien coûte le classement d’un meublé à Lacanau et dans le Médoc Atlantique ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Lacanau et dans le Médoc Atlantique ?',
      'Sur la côte médocaine, le classement peut aussi réduire la taxe de séjour',
      'Questions fréquentes sur le classement à Lacanau et dans le Médoc Atlantique',
      'Demandez le classement de votre meublé à Lacanau et dans le Médoc Atlantique',
    ]);

    const serviceArea = screen
      .getByRole('heading', { name: /Où intervenons-nous dans le Médoc Atlantique/i })
      .closest('section');
    if (!serviceArea) throw new Error('Missing service area section');
    MEDOC_ATLANTIQUE_SERVICE_COMMUNES.forEach((commune) => {
      expect(within(serviceArea).getByText(commune)).toBeInTheDocument();
    });
    [
      'Lacanau-Océan',
      'Carcans-Maubuisson',
      'Hourtin-Plage',
      'Montalivet-les-Bains',
      'Pointe de Grave',
    ].forEach((tourismName) => {
      expect(within(serviceArea).queryByText(tourismName)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /zone d’intervention en Gironde/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );
    expect(
      screen.getByText('Votre meublé à Lacanau et dans le Médoc Atlantique')
    ).toBeInTheDocument();
    expect(screen.getByText('Studio / T1')).toBeInTheDocument();
    expect(screen.getByText('T2 / T3 / T4')).toBeInTheDocument();
    expect(screen.getByText('T5 et plus')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/180\s€\s*TTC/);
    expect(document.body).toHaveTextContent(/200\s€\s*TTC/);
    expect(document.body).toHaveTextContent(/250\s€\s*TTC/);
    expect(screen.getByText('Renouvellement : -20 %')).toBeInTheDocument();

    expect(screen.getByText('Exemple à Lacanau')).toBeInTheDocument();
    expect(screen.getByText('Taxe de séjour pour 4 adultes')).toBeInTheDocument();
    expect(screen.getByText('Logement à 200 € la nuit')).toBeInTheDocument();
    expect(screen.getByText('14,40 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('6,80 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('7,60 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/53,20 € de taxe de séjour en moins sur une semaine/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tarifs 2026 de la Communauté de communes Médoc Atlantique, taxes additionnelles comprises.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
    ).toHaveLength(2);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intervenez-vous aussi à Lacanau-Océan, Carcans-Maubuisson, Hourtin et Soulac-sur-Mer ?',
      })
    );
    expect(document.body).toHaveTextContent('Lacanau-Océan');
    expect(document.body).toHaveTextContent('Carcans-Maubuisson');
    expect(document.body).toHaveTextContent('Hourtin-Plage');
    expect(document.body).toHaveTextContent('Montalivet-les-Bains');
    expect(document.body).toHaveTextContent('Pointe de Grave');

    fireEvent.click(
      screen.getByRole('button', { name: 'Comment savoir quelle catégorie viser ?' })
    );
    expect(screen.getByRole('link', { name: 'simulateur Etoilys' })).toHaveAttribute(
      'href',
      '/simulateur'
    );
  });

  it('publishes registry, hub, SEO, sitemap and breadcrumb data', async () => {
    renderMedocAtlantiquePage();

    const entry = getLocalRegistryEntry('medoc-atlantique');
    expect(entry).toMatchObject({
      kind: 'destination',
      parentId: 'gironde',
      departmentCode: '33',
      status: 'published',
      displayOrder: 30,
      hubLabel: 'Lacanau et Médoc Atlantique',
    });
    expect(isLocalRegistryEntryPublished('medoc-atlantique')).toBe(true);
    expect(getDepartmentEntryByCode('33')?.id).toBe('gironde');
    expect(getPublishedLocalChildEntriesForDepartment('gironde').map((child) => child.id)).toEqual([
      'bordeaux',
      'bassin-arcachon',
      'medoc-atlantique',
    ]);
    expect(getDepartmentInterventionArea('gironde').localPages.map((page) => page.id)).toEqual([
      'bordeaux',
      'bassin-arcachon',
      'medoc-atlantique',
    ]);
    expect(getIndexablePaths()).toContain('/classement-meuble-tourisme-lacanau-medoc-atlantique');
    expect(getPrerenderPaths()).toContain('/classement-meuble-tourisme-lacanau-medoc-atlantique');

    await waitFor(() => {
      expect(document.title).toBe(
        'Classement meublé de tourisme Lacanau & Médoc Atlantique | Etoilys'
      );
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre meublé à Lacanau et dans le Médoc Atlantique. Visite sur place, tarifs clairs et sans frais de déplacement.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-lacanau-medoc-atlantique'
    );
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'index,follow'
    );

    const visibleBreadcrumb = screen.getByRole('navigation', { name: 'Fil d’Ariane' });
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(
      within(visibleBreadcrumb).getByRole('link', { name: 'Zones d’intervention' })
    ).toHaveAttribute('href', '/zones-intervention');
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Gironde' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );
    expect(within(visibleBreadcrumb).getByText('Lacanau et Médoc Atlantique')).toHaveAttribute(
      'aria-current',
      'page'
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
          name: 'Lacanau et Médoc Atlantique',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-lacanau-medoc-atlantique',
        },
      ]);
    });
  });
});
