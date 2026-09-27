import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { VALLEE_DORDOGNE_SERVICE_COMMUNES } from '../../content/local/destinations/valleeDordogne';
import { VALLEE_DORDOGNE_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import {
  getDepartmentEntryByCode,
  getDepartmentInterventionArea,
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  isLocalRegistryEntryPublished,
} from '../../content/local/registry';
import { getIndexablePaths, getPrerenderPaths } from '../../content/seoRoutes';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

function renderValleeDordognePage() {
  window.history.pushState(
    {},
    'Vallée de la Dordogne',
    '/classement-meuble-tourisme-vallee-dordogne'
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

describe('ClassementValleeDordogne', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the Vallée de la Dordogne destination with V6 content', () => {
    renderValleeDordognePage();

    expect(VALLEE_DORDOGNE_LOCAL_LANDING_PAGE_V6.scope).toBe('destination');
    expect(VALLEE_DORDOGNE_LOCAL_LANDING_PAGE_V6.pricing.pricingProfileId).toBe('lot-standard');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme dans la Vallée de la Dordogne',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('dans la Vallée de la Dordogne')).toHaveClass('text-copper');
    expect(
      screen.getByText(
        'Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement dans la Vallée de la Dordogne ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et des tarifs clairs.'
      )
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();

    expect(screen.getByText('Dordogne entre Lacave et Pinsac')).toBeInTheDocument();
    expect(screen.getByAltText('Dordogne entre Lacave et Pinsac dans le Lot')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.valleeDordogneHero.src
    );
    expect(
      screen.getByAltText('Château de Belcastel à Lacave dans la Vallée de la Dordogne')
    ).toHaveAttribute('src', IMAGE_MANIFEST.valleeDordogneBelcastel.src);
    expect(screen.getByText('Belcastel, Lacave, Vallée de la Dordogne.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Krzysztof Golik / Wikimedia Commons' })
    ).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Dordogne_River_01.jpg');
    expect(screen.getByRole('link', { name: 'Sonja Van Acolyen / Unsplash' })).toHaveAttribute(
      'href',
      'https://unsplash.com/fr/photos/un-chateau-perche-au-sommet-dune-falaise-entouree-darbres-MQH_rzprHhI'
    );

    expectHeadingSequence([
      'Classement de meublé de tourisme dans la Vallée de la Dordogne',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous dans la Vallée de la Dordogne\s*\?/,
      'Combien coûte le classement d’un meublé dans la Vallée de la Dordogne ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement dans la Vallée de la Dordogne ?',
      'Dans la Vallée de la Dordogne, le classement peut aussi réduire la taxe de séjour',
      'Questions fréquentes sur le classement dans la Vallée de la Dordogne',
      'Demandez le classement de votre meublé dans la Vallée de la Dordogne',
    ]);

    const serviceArea = screen
      .getByRole('heading', { name: /Où intervenons-nous dans la Vallée de la Dordogne/i })
      .closest('section');
    if (!serviceArea) throw new Error('Missing service area section');
    expect(serviceArea).toHaveTextContent(
      'Dans le Lot, nous intervenons dans toute la Vallée de la Dordogne'
    );
    VALLEE_DORDOGNE_SERVICE_COMMUNES.forEach((commune) => {
      expect(within(serviceArea).getByText(commune)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /zone d’intervention dans le Lot/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot'
    );

    expect(screen.getByText('Votre meublé dans la Vallée de la Dordogne')).toBeInTheDocument();
    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/200\s€\s*TTC/);
    expect(document.body).not.toHaveTextContent(/240\s€\s*TTC/);

    expect(screen.getByText('Exemple à Rocamadour')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(
      'De Rocamadour à Souillac, en passant par Gramat, Martel et Saint-Céré'
    );
    expect(document.body).toHaveTextContent(
      'À Rocamadour, pour une réservation à 150 € la nuit hors taxe de séjour et quatre personnes'
    );
    expect(screen.getByText('Taxe de séjour pour 4 personnes')).toBeInTheDocument();
    expect(screen.getByText('Logement à 150 € la nuit')).toBeInTheDocument();
    expect(screen.getByText('10,80 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('5,18 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('5,62 € de taxe de séjour en moins par nuit, soit une baisse d’environ 52 %')
    ).toBeInTheDocument();
    expect(screen.getByText(/39,34 € de taxe de séjour en moins sur 7 nuits/i)).toBeInTheDocument();
    expect(
      screen.getByText('Tarifs 2026 applicables à Rocamadour, taxes additionnelles comprises.')
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
    ).toHaveLength(2);

    expect(document.body).not.toHaveTextContent(
      'Une destination touristique, une page rattachée au Lot'
    );
    expect(document.body).not.toHaveTextContent(
      'Etoilys intervient également dans les autres secteurs de la Vallée de la Dordogne.'
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intervenez-vous à Rocamadour, Souillac, Gramat, Martel et Saint-Céré ?',
      })
    );
    expect(document.body).toHaveTextContent(
      'Oui. Etoilys réalise des visites de classement dans toute la Vallée de la Dordogne. Dans le Lot, nous intervenons notamment à Rocamadour, Souillac, Gramat, Martel, Saint-Céré, Padirac, Carennac, Autoire, Loubressac et Bretenoux.'
    );

    const main = screen.getByRole('main');
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    expect(conversionLinks.length).toBeGreaterThanOrEqual(2);
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Vallée de la Dordogne conversion links');
    heroCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());
    finalCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());

    fireEvent.click(heroCta);
    expect(trackCtaClick).toHaveBeenLastCalledWith({
      ctaId: 'cta_white_demande_classement',
      destinationPath: '/demande-classement',
    });
    fireEvent.click(finalCta);
    expect(trackCtaClick).toHaveBeenLastCalledWith({
      ctaId: 'cta_white_demande_classement',
      destinationPath: '/demande-classement',
    });
  });

  it('publishes registry, hub, SEO, sitemap and breadcrumb data', async () => {
    renderValleeDordognePage();

    const entry = getLocalRegistryEntry('vallee-dordogne');
    expect(entry).toMatchObject({
      kind: 'destination',
      parentId: 'lot',
      departmentCode: '46',
      status: 'published',
      displayOrder: 20,
      hubLabel: 'Vallée de la Dordogne',
    });
    expect(isLocalRegistryEntryPublished('vallee-dordogne')).toBe(true);
    expect(getDepartmentEntryByCode('46')?.id).toBe('lot');
    expect(getPublishedLocalChildEntriesForDepartment('lot').map((child) => child.id)).toEqual([
      'cahors-vallee-lot',
      'vallee-dordogne',
    ]);
    expect(getDepartmentInterventionArea('lot').localPages.map((page) => page.id)).toEqual([
      'cahors-vallee-lot',
      'vallee-dordogne',
    ]);
    expect(getIndexablePaths()).toContain('/classement-meuble-tourisme-vallee-dordogne');
    expect(getPrerenderPaths()).toContain('/classement-meuble-tourisme-vallee-dordogne');

    await waitFor(() => {
      expect(document.title).toBe('Classement meublé de tourisme Vallée de la Dordogne | Etoilys');
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Faites classer votre meublé de tourisme dans la Vallée de la Dordogne. Visite sur place dans le Lot, tarifs clairs et demande en ligne avec Etoilys.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-vallee-dordogne'
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
    expect(within(visibleBreadcrumb).getByRole('link', { name: 'Lot' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot'
    );
    expect(within(visibleBreadcrumb).getByText('Vallée de la Dordogne')).toHaveAttribute(
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
          name: 'Lot',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-lot',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Vallée de la Dordogne',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-vallee-dordogne',
        },
      ]);
    });
  });
});
