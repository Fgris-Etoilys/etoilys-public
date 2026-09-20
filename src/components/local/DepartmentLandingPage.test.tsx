import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import LocalLandingPageV6, { COMMON_LOCAL_V6_FAQ_ITEMS } from './LocalLandingPageV6';
import type {
  DepartmentAreaId,
  LocalLandingPageV6Config,
  LocalLandingPageV6DepartmentConfig,
  LocalRegistryEntry,
} from '../../content/local/types';
import {
  getLocalRegistryEntry,
  getPublishedLocalChildEntriesForDepartment,
  LOCAL_REGISTRY,
} from '../../content/local/registry';
import { trackCtaClick } from '../../utils/analytics';
import {
  DEPARTMENT_LOCAL_V6_FAQ_ITEMS,
  AVEYRON_LOCAL_LANDING_PAGE_V6,
  BASSIN_ARCACHON_LOCAL_LANDING_PAGE_V6,
  BERGERAC_LOCAL_LANDING_PAGE_V6,
  BORDEAUX_LOCAL_LANDING_PAGE_V6,
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
  LOCAL_V6_DEPARTMENT_HERO_INDEXES,
  LOT_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
} from '../../content/local/v6Pages';

const departmentConfigs = [
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
  AVEYRON_LOCAL_LANDING_PAGE_V6,
] as const;

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

const COMMUNE_INDEX_FIXTURE = {
  c: [
    { id: '24352', label: 'Ribérac', departmentCode: '24' },
    { id: '33063', label: 'Bordeaux', departmentCode: '33' },
    { id: '46042', label: 'Cahors', departmentCode: '46' },
    { id: '47001', label: 'Agen', departmentCode: '47' },
  ],
};

const draftDepartmentRegistryFixture: LocalRegistryEntry = {
  id: 'fixture-draft-department' as DepartmentAreaId,
  kind: 'department',
  name: 'Département brouillon',
  path: '/classement-meuble-tourisme-fixture-draft',
  departmentCode: '99',
  regionId: 'occitanie',
  status: 'draft',
  coverageMode: 'sectors',
  displayOrder: 99,
  hubDescription: 'Fixture non publiée.',
  hubLinkLabel: 'Classement fixture →',
  seo: {
    lastModified: '2026-09-18',
    title: 'Fixture brouillon',
    description: 'Fixture brouillon.',
    breadcrumbLabel: 'Fixture',
    ogImageKey: 'homeHero',
    lcpImageKey: 'homeHero',
    lcpImageSizes: '100vw',
  },
};

function renderDepartmentPage(config: LocalLandingPageV6DepartmentConfig) {
  return render(
    <MemoryRouter>
      <DepartmentLandingPage config={config} />
    </MemoryRouter>
  );
}

function renderLocalPage(config: LocalLandingPageV6Config) {
  return render(
    <MemoryRouter>
      <LocalLandingPageV6 config={config} />
    </MemoryRouter>
  );
}

function readPageSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'pages', 'locales', fileName), 'utf8');
}

function readWrapperSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'components', 'local', fileName), 'utf8');
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function expectHeadingSequence(expectedHeadings: string[]) {
  const headings = screen
    .getAllByRole('heading')
    .map((heading) => normalizeText(heading.textContent ?? ''));
  let cursor = -1;

  expectedHeadings.forEach((expectedHeading) => {
    const nextIndex = headings.findIndex(
      (heading, index) => index > cursor && heading === normalizeText(expectedHeading)
    );

    expect(nextIndex, `Missing heading after index ${cursor}: ${expectedHeading}`).toBeGreaterThan(
      cursor
    );
    cursor = nextIndex;
  });
}

describe('DepartmentLandingPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => COMMUNE_INDEX_FIXTURE,
      }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.mocked(trackCtaClick).mockClear();
  });

  it('keeps route pages as thin wrappers around V6 configs', () => {
    expect(readWrapperSource('DepartmentLandingPage.tsx')).not.toMatch(/layoutVersion ===|v5|v4/);
    expect(readPageSource('ClassementDordogne.tsx')).toContain(
      '<DepartmentLandingPage config={DORDOGNE_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementGironde.tsx')).toContain(
      '<DepartmentLandingPage config={GIRONDE_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementLot.tsx')).toContain(
      '<DepartmentLandingPage config={LOT_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementLotEtGaronne.tsx')).toContain(
      '<DepartmentLandingPage config={LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6}'
    );
  });

  it('renders NotFound instead of a local landing when the registry entry is not published', () => {
    LOCAL_REGISTRY.push(draftDepartmentRegistryFixture);
    try {
      renderDepartmentPage({
        ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
        departmentId: draftDepartmentRegistryFixture.id,
      });
    } finally {
      LOCAL_REGISTRY.splice(LOCAL_REGISTRY.indexOf(draftDepartmentRegistryFixture), 1);
    }

    expect(screen.getByRole('heading', { name: /page non trouvée/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: DORDOGNE_LOCAL_LANDING_PAGE_V6.hero.title,
      })
    ).not.toBeInTheDocument();
  });

  it.each([
    [
      DORDOGNE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme en Dordogne',
      'Quel tarif pour classer votre meublé en Dordogne ?',
      '/data/communes-dordogne-index.v1.json',
    ],
    [
      GIRONDE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme en Gironde',
      'Quel tarif pour classer votre meublé en Gironde ?',
      '/data/communes-gironde-index.v1.json',
    ],
    [
      LOT_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme dans le Lot',
      'Quel tarif pour classer votre meublé dans le Lot ?',
      '/data/communes-lot-index.v1.json',
    ],
    [
      LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme dans le Lot-et-Garonne',
      'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
      '/data/communes-lot-et-garonne-index.v1.json',
    ],
  ])(
    'renders %s with V6 surfaces and its own commune index',
    async (config, h1, pricingTitle, indexUrl) => {
      renderDepartmentPage(config);

      expect(screen.getByRole('heading', { level: 1, name: h1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect(screen.getByRole('heading', { name: pricingTitle })).toBeInTheDocument();
      expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Commune' })).toBeInTheDocument();

      fireEvent.focus(screen.getByRole('combobox', { name: 'Commune' }));
      expect(fetch).toHaveBeenCalledWith(indexUrl, { signal: expect.any(AbortSignal) });
    }
  );

  it('keeps collapsed sector communes rendered and toggled accessibly', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(document.body).toHaveTextContent('Gardonne');
    const toggle = screen.getAllByRole('button', { name: '+6 communes' })[0];
    if (!toggle) throw new Error('Missing sector toggle');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveTextContent('Masquer les 6 communes');
  });

  it.each(departmentConfigs)(
    'groups published children below sectors for $departmentId',
    (config) => {
      renderDepartmentPage(config);
      const children = getPublishedLocalChildEntriesForDepartment(config.departmentId);
      const sectors = document.querySelector<HTMLElement>('.local-v6-sector-list');
      if (!sectors) throw new Error('Missing department sectors');
      expect(sectors.querySelectorAll('a')).toHaveLength(0);
      const navigation = screen.queryByRole('navigation', { name: 'Pages locales du département' });

      if (children.length === 0) {
        expect(navigation).not.toBeInTheDocument();
        return;
      }
      if (!navigation) throw new Error('Missing local pages navigation');
      expect(
        screen.getAllByRole('navigation', { name: 'Pages locales du département' })
      ).toHaveLength(1);
      expect(within(navigation).getByRole('list')).toHaveClass('local-v6-commune-list');
      const links = within(navigation).getAllByRole('link');
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        children.map((child) => child.path)
      );
      links.forEach((link) =>
        expect(link.getAttribute('rel')?.split(/\s+/) ?? []).not.toContain('nofollow')
      );
      expect(
        sectors.compareDocumentPosition(navigation) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
  );

  it.each([false, true])('keeps communes as plain text when collapsed is %s', (collapsed) => {
    renderDepartmentPage({
      ...GIRONDE_LOCAL_LANDING_PAGE_V6,
      serviceArea: {
        ...GIRONDE_LOCAL_LANDING_PAGE_V6.serviceArea,
        sectors: [
          {
            name: 'Fixture sector',
            visibleCommunes: collapsed ? ['Libourne'] : ['Bordeaux'],
            collapsedCommunes: collapsed ? ['Bordeaux'] : [],
          },
        ],
      },
    });
    const sectors = document.querySelector<HTMLElement>('.local-v6-sector-list');
    if (!sectors) throw new Error('Missing department sectors');
    expect(sectors).toHaveTextContent('Bordeaux');
    expect(sectors.querySelectorAll('a')).toHaveLength(0);
    if (collapsed) {
      fireEvent.click(within(sectors).getByRole('button'));
      expect(sectors.querySelectorAll('a')).toHaveLength(0);
    }
    const navigation = screen.getByRole('navigation', { name: 'Pages locales du département' });
    expect(
      navigation.querySelectorAll('a[href="/classement-meuble-tourisme-bordeaux"]')
    ).toHaveLength(1);
  });

  it('renders Lot sectors as representative coverage for the whole department', () => {
    renderDepartmentPage(LOT_LOCAL_LANDING_PAGE_V6);

    expect(document.body).toHaveTextContent('Nos inspecteurs interviennent dans tout le Lot');
    expect(document.body).toHaveTextContent('votre commune reste couverte');
    [
      'Cahors et la Vallée du Lot',
      'Rocamadour et la Vallée de la Dordogne',
      'Figeac et la Vallée du Célé',
      'Saint-Cirq-Lapopie et les Causses du Quercy',
      'Gourdon, la Bouriane et le Quercy Blanc',
    ].forEach((sectorName) => {
      expect(screen.getByRole('heading', { level: 3, name: sectorName })).toBeInTheDocument();
    });
    [
      'Cahors',
      'Puy-l’Évêque',
      'Rocamadour',
      'Saint-Céré',
      'Capdenac-le-Haut',
      'Bagnac-sur-Célé',
      'Cœur de Causse',
      'Castelnau-Montratier',
    ].forEach((commune) => {
      expect(document.body).toHaveTextContent(commune);
    });
  });

  it('uses the shared department hero copy and localized image captions', () => {
    [
      DORDOGNE_LOCAL_LANDING_PAGE_V6,
      GIRONDE_LOCAL_LANDING_PAGE_V6,
      LOT_LOCAL_LANDING_PAGE_V6,
      LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
    ].forEach((config) => {
      expect(config.hero.description).toBe(LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION);
      expect(config.hero.image.index).toBe(LOCAL_V6_DEPARTMENT_HERO_INDEXES[config.departmentId]);
    });

    const { unmount } = renderDepartmentPage(GIRONDE_LOCAL_LANDING_PAGE_V6);
    expect(screen.getByText('Saint-Émilion, Gironde')).toBeInTheDocument();
    expect(screen.getByText('33 / LA GIRONDE')).toBeInTheDocument();
    expect(screen.getByAltText('Front de mer et promenade à Arcachon')).toBeInTheDocument();
    expect(screen.getByText('Front de mer d’Arcachon.')).toBeInTheDocument();
    unmount();

    const lotRender = renderDepartmentPage(LOT_LOCAL_LANDING_PAGE_V6);
    expect(screen.getByText('Saint-Cirq-Lapopie, Lot')).toBeInTheDocument();
    expect(screen.getByText('46 / LE LOT')).toBeInTheDocument();
    expect(screen.getByAltText('Cité religieuse de Rocamadour dans le Lot')).toBeInTheDocument();
    expect(screen.getByText('Rocamadour, Lot.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Franck-fnba / Wikimedia Commons' })).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Rocamadour_2025-114909.jpg'
    );
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by-sa/4.0/'
    );
    lotRender.unmount();

    renderDepartmentPage(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6);
    expect(screen.getByText('Nérac, Lot-et-Garonne')).toBeInTheDocument();
    expect(screen.getByText('47 / LOT-ET-GARONNE')).toBeInTheDocument();
    expect(
      screen.getByAltText('Tour horloge et maisons de pierre à Monflanquin')
    ).toBeInTheDocument();
    expect(screen.getByText('Monflanquin, Lot-et-Garonne.')).toBeInTheDocument();
  });

  it('keeps department FAQ shared, deduplicated and free of retired tariff copy', () => {
    const girondeQuestions = GIRONDE_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question);
    const lotQuestions = LOT_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question);
    const lotEtGaronneQuestions = LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.faq.items.map(
      (item) => item.question
    );

    expect(new Set(girondeQuestions).size).toBe(girondeQuestions.length);
    expect(new Set(lotQuestions).size).toBe(lotQuestions.length);
    expect(new Set(lotEtGaronneQuestions).size).toBe(lotEtGaronneQuestions.length);
    expect(girondeQuestions[0]).toBe('Intervenez-vous dans toute la Gironde ?');
    expect(girondeQuestions).not.toContain(
      'Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?'
    );
    expect(lotQuestions[0]).toBe('Intervenez-vous dans ma commune dans le Lot ?');
    expect(lotEtGaronneQuestions[0]).toBe(
      'Intervenez-vous dans ma commune dans le Lot-et-Garonne ?'
    );

    renderDepartmentPage(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6);
    expect(document.body).not.toHaveTextContent(/Aucun tarif fixe/i);
  });

  it('renders Gironde as full department coverage without retired partial coverage copy', () => {
    renderDepartmentPage(GIRONDE_LOCAL_LANDING_PAGE_V6);

    expect(
      screen.getByRole('heading', { level: 2, name: /Où intervenons-nous en Gironde/ })
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent('Etoilys intervient désormais dans toute la Gironde');
    expect(
      screen.getByRole('button', { name: 'Intervenez-vous dans toute la Gironde ?' })
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/zone concentrée autour du Libournais/i);
    expect(document.body).not.toHaveTextContent(/étudiées selon la localisation du logement/i);
  });

  it('switches FAQ background when a local notice exists without a local tax module', () => {
    renderDepartmentPage({
      ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
      localNotice: {
        title: 'Notice locale de test',
        paragraphs: ['Texte de notice.'],
      },
    });

    expect(
      screen.getByRole('heading', { name: 'Notice locale de test' }).closest('section')
    ).toHaveClass('bg-paper');
    expect(
      screen
        .getByRole('heading', { name: 'Questions fréquentes sur le classement en Dordogne' })
        .closest('section')
    ).toHaveClass('bg-surface-neutral');
  });

  it('keeps FAQ on paper when no local module or notice exists', () => {
    const config = { ...DORDOGNE_LOCAL_LANDING_PAGE_V6 };
    delete config.localModule;
    renderDepartmentPage(config);

    expect(document.getElementById('local-v6-territorial-title')).not.toBeInTheDocument();

    expect(
      screen
        .getByRole('heading', { name: 'Questions fréquentes sur le classement en Dordogne' })
        .closest('section')
    ).toHaveClass('bg-paper');
  });

  it.each([
    GIRONDE_LOCAL_LANDING_PAGE_V6,
    LOT_LOCAL_LANDING_PAGE_V6,
    LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
  ])('keeps migrated department CTA analytics on white buttons', (config) => {
    renderDepartmentPage(config);
    const conversionLinks = screen.getAllByRole('link', { name: 'Demander mon classement' });
    const heroCta = conversionLinks[0];
    const finalCta = conversionLinks[conversionLinks.length - 1];
    if (!heroCta || !finalCta) throw new Error('Missing conversion links');
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

  it.each(departmentConfigs)(
    'keeps the full V6 department section order for $departmentId',
    (config) => {
      if (!config.localModule) throw new Error('Missing department module');
      renderDepartmentPage(config);

      expectHeadingSequence([
        config.hero.title,
        'Pourquoi faire classer votre meublé de tourisme ?',
        config.serviceArea.title,
        config.pricing.title,
        config.procedure.title,
        config.expertise.title,
        config.localModule.title,
        config.faq.title,
        config.finalCta.title,
      ]);
    }
  );

  it.each(departmentConfigs)(
    'renders the territorial module accessibly for $departmentId',
    (config) => {
      const module = config.localModule;
      if (!module) throw new Error('Missing department module');
      renderDepartmentPage(config);

      const section = screen.getByRole('region', {
        name: (name) => normalizeText(name) === normalizeText(module.title),
      });
      expect(within(section).getAllByRole('heading', { level: 2 })).toHaveLength(1);
      expect(section.querySelector('p')).not.toBeEmptyDOMElement();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect([2, 3]).toContain(module.items.length);
      const items = within(section).getAllByRole('listitem');
      expect(items).toHaveLength(module.items.length);
      items.forEach((item, index) => {
        expect(within(item).getAllByRole('heading', { level: 3 })).toHaveLength(1);
        expect(item.querySelector('p')).not.toBeEmptyDOMElement();
        const link = module.items[index]?.link;
        if (!link) {
          expect(within(item).queryByRole('link')).not.toBeInTheDocument();
          return;
        }
        const renderedLink = within(item).getByRole('link', { name: link.label });
        expect(renderedLink).toHaveAttribute(
          'href',
          'localEntryId' in link ? getLocalRegistryEntry(link.localEntryId)?.path : link.href
        );
        const relations = renderedLink.getAttribute('rel')?.split(/\s+/) ?? [];
        if ('href' in link) {
          expect(relations).toContain('nofollow');
          if (renderedLink.getAttribute('target') === '_blank') {
            expect(relations).toContain('noopener');
          }
        } else {
          expect(relations).not.toContain('nofollow');
        }
      });
      expect(section.querySelector('details')).toBeNull();
      expect(document.getElementById('local-v6-tax-title')).not.toBeInTheDocument();
    }
  );

  it.each(departmentConfigs)(
    'includes the territorial module in server HTML for $departmentId',
    (config) => {
      const module = config.localModule;
      if (!module) throw new Error('Missing department module');
      const html = renderToString(
        <StaticRouter location={getLocalRegistryEntry(config.departmentId)?.path ?? '/'}>
          <DepartmentLandingPage config={config} />
        </StaticRouter>
      );
      const document = new DOMParser().parseFromString(html, 'text/html');
      const section = document.querySelector(
        'section[aria-labelledby="local-v6-territorial-title"]'
      );

      expect(document.querySelectorAll('h1')).toHaveLength(1);
      expect(section?.querySelectorAll('h2')).toHaveLength(1);
      expect(section?.querySelectorAll('li h3')).toHaveLength(module.items.length);
      expect(section?.querySelectorAll('li p')).toHaveLength(module.items.length);
      expect(section?.querySelectorAll('a')).toHaveLength(
        module.items.filter((item) => item.link).length
      );
    }
  );

  it('renders a two-item territorial module without an empty third item', () => {
    renderDepartmentPage({
      ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
      localModule: {
        type: 'territorial-service',
        title: 'Fixture territory',
        intro: 'Fixture introduction.',
        items: [
          { title: 'First fixture', body: 'First body.' },
          { title: 'Second fixture', body: 'Second body.' },
        ],
      },
    });

    const section = screen.getByRole('region', { name: 'Fixture territory' });
    expect(within(section).getAllByRole('listitem')).toHaveLength(2);
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(within(section).queryByRole('link')).not.toBeInTheDocument();
  });

  it.each([
    [DORDOGNE_LOCAL_LANDING_PAGE_V6.departmentId, DORDOGNE_LOCAL_LANDING_PAGE_V6],
    [GIRONDE_LOCAL_LANDING_PAGE_V6.departmentId, GIRONDE_LOCAL_LANDING_PAGE_V6],
    [LOT_LOCAL_LANDING_PAGE_V6.departmentId, LOT_LOCAL_LANDING_PAGE_V6],
    [LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.departmentId, LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6],
  ])('renders department FAQ items before the two automatic V6 items for %s', (_, config) => {
    renderDepartmentPage(config);

    const faqSection = screen.getByRole('heading', { name: config.faq.title }).closest('section');
    if (!faqSection) throw new Error('Missing FAQ section');
    const renderedQuestions = [...faqSection.querySelectorAll('button')].map((button) =>
      normalizeText(button.textContent ?? '')
    );
    const configQuestions = config.faq.items.map((item) => item.question);
    const automaticQuestions = COMMON_LOCAL_V6_FAQ_ITEMS.map((item) => item.question);

    expect(renderedQuestions).toEqual([...configQuestions, ...automaticQuestions]);
    automaticQuestions.forEach((question) => {
      expect(
        renderedQuestions.filter((renderedQuestion) => renderedQuestion === question)
      ).toHaveLength(1);
    });
  });

  it('keeps the department base FAQ order and appends local extras before V6 automatic items', () => {
    const baseQuestions = DEPARTMENT_LOCAL_V6_FAQ_ITEMS.map((item) => item.question);

    expect(DORDOGNE_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question)).toEqual([
      'Intervenez-vous dans ma commune en Dordogne ?',
      ...baseQuestions,
    ]);
    expect(GIRONDE_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question)).toEqual([
      'Intervenez-vous dans toute la Gironde ?',
      ...baseQuestions,
    ]);
    expect(LOT_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question)).toEqual([
      'Intervenez-vous dans ma commune dans le Lot ?',
      ...baseQuestions,
    ]);
    expect(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question)).toEqual([
      'Intervenez-vous dans ma commune dans le Lot-et-Garonne ?',
      ...baseQuestions,
    ]);
  });

  it.each([
    [
      'Dordogne',
      DORDOGNE_LOCAL_LANDING_PAGE_V6,
      ['La Roque-Gageac, Dordogne', 'Les pierres du Périgord.'],
    ],
    [
      'Bergerac',
      BERGERAC_LOCAL_LANDING_PAGE_V6,
      ['Quai Cyrano, Bergerac', 'Église Saint-Jacques, Bergerac.'],
    ],
    [
      'Gironde',
      GIRONDE_LOCAL_LANDING_PAGE_V6,
      ['Saint-Émilion, Gironde', 'Front de mer d’Arcachon.'],
    ],
    [
      'Bordeaux',
      BORDEAUX_LOCAL_LANDING_PAGE_V6,
      ['Place de la Bourse, Bordeaux', 'Jardin Public, Bordeaux.'],
    ],
    [
      'Bassin d’Arcachon',
      BASSIN_ARCACHON_LOCAL_LANDING_PAGE_V6,
      [
        'Cabanes tchanquées, île aux Oiseaux',
        'Entrée du bassin d’Arcachon depuis la dune du Pilat.',
      ],
    ],
    ['Lot', LOT_LOCAL_LANDING_PAGE_V6, ['Saint-Cirq-Lapopie, Lot', 'Rocamadour, Lot.']],
    [
      'Lot-et-Garonne',
      LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
      ['Nérac, Lot-et-Garonne', 'Monflanquin, Lot-et-Garonne.'],
    ],
  ])('renders required local V6 media captions for %s', (_, config, captions) => {
    renderLocalPage(config);

    captions.forEach((caption) => {
      expect(screen.getByText(caption)).toBeInTheDocument();
    });
  });
});
