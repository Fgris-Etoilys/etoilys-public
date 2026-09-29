import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { FIGEAC_GRAND_FIGEAC_SERVICE_COMMUNES } from '../../content/local/destinations/figeacGrandFigeac';
import { FIGEAC_GRAND_FIGEAC_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
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

function renderFigeacGrandFigeacPage() {
  window.history.pushState({}, 'Figeac et Grand-Figeac', '/classement-meuble-tourisme-figeac');
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

describe('ClassementFigeacGrandFigeac', () => {
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    vi.mocked(trackCtaClick).mockClear();
  });

  it('renders the Figeac and Grand-Figeac destination with V6 content', () => {
    renderFigeacGrandFigeacPage();

    expect(FIGEAC_GRAND_FIGEAC_LOCAL_LANDING_PAGE_V6.scope).toBe('destination');
    expect(FIGEAC_GRAND_FIGEAC_LOCAL_LANDING_PAGE_V6.pricing.pricingProfileId).toBe('lot-standard');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de meublé de tourisme à Figeac et dans le Grand-Figeac',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('à Figeac et dans le Grand-Figeac')).toHaveClass('text-copper');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();

    expect(document.body).toHaveTextContent('Figeac · Grand-Figeac lotois');
    expect(document.body).toHaveTextContent(
      'dans les vallées du Lot et du Célé ou dans la partie lotoise du Grand-Figeac'
    );
    expect(screen.getByText('Place des Écritures, Figeac')).toBeInTheDocument();
    expect(screen.getByAltText('Place des Écritures à Figeac dans le Lot')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.figeacGrandFigeacHero.src
    );
    expect(screen.getByAltText('Rivière Lot à Cajarc dans le bassin de Figeac')).toHaveAttribute(
      'src',
      IMAGE_MANIFEST.figeacGrandFigeacCajarc.src
    );
    expect(screen.getByText('Le Lot à Cajarc, dans le bassin de Figeac.')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'GO69 / Wikimedia Commons' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Krzysztof Golik / Wikimedia Commons' })
    ).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Lot_River_in_Cajarc_01.jpg');

    expectHeadingSequence([
      'Classement de meublé de tourisme à Figeac et dans le Grand-Figeac',
      'Pourquoi faire classer votre meublé de tourisme ?',
      /Où intervenons-nous dans le bassin de Figeac\s*\?/,
      'Combien coûte le classement d’un meublé à Figeac et dans le Grand-Figeac ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement à Figeac et dans le Grand-Figeac ?',
      'Un exemple concret à Figeac : l’effet du classement sur la taxe de séjour',
      'Questions fréquentes sur le classement à Figeac et dans le Grand-Figeac',
      'Demandez le classement de votre meublé à Figeac et dans le Grand-Figeac',
    ]);

    const serviceArea = screen
      .getByRole('heading', { name: /Où intervenons-nous dans le bassin de Figeac/i })
      .closest('section');
    if (!serviceArea) throw new Error('Missing service area section');
    expect(serviceArea).toHaveTextContent('Dans le Lot');
    expect(serviceArea).toHaveTextContent('bassin lotois du Grand-Figeac');
    expect(serviceArea).toHaveTextContent('vallées du Lot et du Célé');
    FIGEAC_GRAND_FIGEAC_SERVICE_COMMUNES.forEach((commune) => {
      expect(within(serviceArea).getByText(commune)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /zone d’intervention dans le Lot/i })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot'
    );

    expect(screen.getByText('Votre meublé à Figeac et dans le Grand-Figeac')).toBeInTheDocument();
    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(document.body).toHaveTextContent(/200\s€\s*TTC/);
    expect(document.body).not.toHaveTextContent(/240\s€\s*TTC/);

    expect(screen.getByText('Exemple à Figeac')).toBeInTheDocument();
    expect(screen.getByText('Taxe de séjour pour 4 personnes')).toBeInTheDocument();
    expect(screen.getByText('Logement à 150 € la nuit')).toBeInTheDocument();
    expect(screen.getByText('10,80 € par nuit')).toBeInTheDocument();
    expect(screen.getByText('4,90 € par nuit')).toBeInTheDocument();
    expect(
      screen.getByText('5,90 € de taxe de séjour en moins par nuit, soit une baisse d’environ 55 %')
    ).toBeInTheDocument();
    expect(screen.getByText(/41,30 € de taxe de séjour en moins sur 7 nuits/i)).toBeInTheDocument();
    expect(
      screen.getByText('Tarifs 2026 applicables à Figeac, taxes additionnelles comprises.')
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Comparer la taxe de séjour de mon logement' })
    ).toHaveLength(2);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intervenez-vous à Figeac, Cajarc, Marcilhac-sur-Célé et Lacapelle-Marival ?',
      })
    );
    expect(document.body).toHaveTextContent('Capdenac-le-Haut');
    expect(document.body).toHaveTextContent('Sauliac-sur-Célé');
    expect(document.body).not.toHaveTextContent('page Vallée du Célé');

    const main = screen.getByRole('main');
    const conversionLinks = within(main).getAllByRole('link', { name: 'Demander mon classement' });
    expect(conversionLinks.length).toBeGreaterThanOrEqual(2);
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing Figeac conversion links');
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
    renderFigeacGrandFigeacPage();

    const entry = getLocalRegistryEntry('figeac-grand-figeac');
    expect(entry).toMatchObject({
      kind: 'destination',
      parentId: 'lot',
      departmentCode: '46',
      status: 'published',
      displayOrder: 30,
      hubLabel: 'Figeac et le Grand-Figeac',
    });
    expect(isLocalRegistryEntryPublished('figeac-grand-figeac')).toBe(true);
    expect(getDepartmentEntryByCode('46')?.id).toBe('lot');
    expect(getPublishedLocalChildEntriesForDepartment('lot').map((child) => child.id)).toEqual([
      'cahors-vallee-lot',
      'vallee-dordogne',
      'figeac-grand-figeac',
    ]);
    expect(getDepartmentInterventionArea('lot').localPages.map((page) => page.id)).toEqual([
      'cahors-vallee-lot',
      'vallee-dordogne',
      'figeac-grand-figeac',
    ]);
    expect(getIndexablePaths()).toContain('/classement-meuble-tourisme-figeac');
    expect(getPrerenderPaths()).toContain('/classement-meuble-tourisme-figeac');

    await waitFor(() => {
      expect(document.title).toBe(
        'Classement meublé de tourisme à Figeac et dans le Grand-Figeac | Etoilys'
      );
    });
    expect(document.querySelector("meta[name='description']")).toHaveAttribute(
      'content',
      'Classement de meublé de tourisme à Figeac et dans la partie lotoise du Grand-Figeac : visite sur place, tarif Lot et demande en ligne.'
    );
    expect(document.querySelector("link[rel='canonical']")).toHaveAttribute(
      'href',
      'https://www.etoilys.fr/classement-meuble-tourisme-figeac'
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
    expect(within(visibleBreadcrumb).getByText('Figeac et Grand-Figeac')).toHaveAttribute(
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
          name: 'Figeac et Grand-Figeac',
          item: 'https://www.etoilys.fr/classement-meuble-tourisme-figeac',
        },
      ]);
    });
  });
});
