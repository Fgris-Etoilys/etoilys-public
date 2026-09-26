import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes, StaticRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import Layout from '../components/layout/Layout';
import CityLandingPage from '../components/local/CityLandingPage';
import DepartmentLandingPage from '../components/local/DepartmentLandingPage';
import LocalLandingPageV6 from '../components/local/LocalLandingPageV6';
import ZonesIntervention from '../pages/ZonesIntervention';
import {
  BERGERAC_LOCAL_LANDING_PAGE_V6,
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
} from '../content/local/v6Pages';
import { LOCAL_REGISTRY } from '../content/local/registry';
import type {
  CityAreaId,
  DepartmentAreaId,
  DestinationAreaId,
  LocalChildAreaId,
  LocalLandingPageV6CityConfig,
  LocalLandingPageV6DepartmentConfig,
  LocalRegistryEntry,
} from '../content/local/types';

const fixtureSeo = {
  lastModified: '2026-09-18',
  title: 'Fixture locale',
  description: 'Fixture locale.',
  breadcrumbLabel: 'Fixture',
  ogImageKey: 'homeHero',
  lcpImageKey: 'homeHero',
  lcpImageSizes: '100vw',
} as const;

const publishedDepartment: LocalRegistryEntry = {
  id: 'fixture-rendered-department' as DepartmentAreaId,
  kind: 'department',
  name: 'Département rendu',
  path: '/classement-meuble-tourisme-fixture-rendered',
  departmentCode: '2B',
  regionId: 'occitanie',
  status: 'published',
  coverageMode: 'sectors',
  displayOrder: 91,
  hubDescription: 'Fixture publiée.',
  hubLinkLabel: 'Classement fixture rendu →',
  seo: fixtureSeo,
};

const draftDepartment: LocalRegistryEntry = {
  ...publishedDepartment,
  id: 'fixture-rendered-draft-department' as DepartmentAreaId,
  name: 'Département brouillon rendu',
  path: '/classement-meuble-tourisme-fixture-rendered-draft',
  status: 'draft',
};

const publishedCity: LocalRegistryEntry = {
  id: 'fixture-rendered-city' as CityAreaId,
  kind: 'city',
  name: 'Ville publiée rendue',
  path: '/classement-meuble-tourisme-fixture-rendered-city',
  departmentCode: '2B',
  regionId: 'occitanie',
  parentId: publishedDepartment.id,
  status: 'published',
  displayOrder: 10,
  hubLabel: 'Ville publiée rendue',
  departmentLabel: 'Ville publiée depuis le registre',
  seo: {
    ...fixtureSeo,
    breadcrumbLabel: 'Ville publiée',
  },
};

const publishedDestination: LocalRegistryEntry = {
  id: 'fixture-rendered-destination' as DestinationAreaId,
  kind: 'destination',
  name: 'Destination publiée rendue',
  path: '/classement-meuble-tourisme-fixture-rendered-destination',
  departmentCode: '2B',
  regionId: 'occitanie',
  parentId: publishedDepartment.id,
  status: 'published',
  displayOrder: 20,
  hubLabel: 'Destination publiée rendue',
  departmentLabel: 'Destination publiée depuis le registre',
  seo: {
    ...fixtureSeo,
    breadcrumbLabel: 'Destination publiée',
  },
};

const draftCity: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-rendered-draft-city' as CityAreaId,
  name: 'Draftville',
  path: '/classement-meuble-tourisme-draftville',
  status: 'draft',
  hubLabel: 'Draftville',
};

const otherPublishedDepartment: LocalRegistryEntry = {
  ...publishedDepartment,
  id: 'fixture-other-published-department' as DepartmentAreaId,
  path: '/classement-meuble-tourisme-other-department',
};

const cityInOtherDepartment: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-other-department-city' as CityAreaId,
  path: '/classement-meuble-tourisme-other-department-city',
  parentId: otherPublishedDepartment.id,
};

const cityWithDraftParent: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-rendered-city-draft-parent' as CityAreaId,
  path: '/classement-meuble-tourisme-fixture-rendered-draft-parent-city',
  parentId: draftDepartment.id,
};

const cityWithoutParent: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-rendered-city-without-parent' as CityAreaId,
  path: '/classement-meuble-tourisme-fixture-rendered-orphan-city',
  parentId: 'fixture-rendered-missing-parent' as DepartmentAreaId,
};

function removeRegistryEntries(entries: readonly LocalRegistryEntry[]) {
  entries.forEach((entry) => {
    const index = LOCAL_REGISTRY.indexOf(entry);
    if (index >= 0) {
      LOCAL_REGISTRY.splice(index, 1);
    }
  });
}

async function withRegistryEntries<T>(
  entries: readonly LocalRegistryEntry[],
  callback: () => T | Promise<T>
): Promise<T> {
  LOCAL_REGISTRY.push(...entries);
  try {
    return await callback();
  } finally {
    removeRegistryEntries(entries);
  }
}

function clearSeoHead() {
  document.head
    .querySelectorAll(
      [
        "meta[name='description']",
        "meta[name='robots']",
        "meta[property^='og:']",
        "meta[name^='twitter:']",
        "link[rel='canonical']",
        "link[data-seo-alternate='true']",
        "link[data-seo-lcp-preload='true']",
        "script[type='application/ld+json']",
      ].join(',')
    )
    .forEach((element) => element.remove());
}

function departmentConfig(departmentId: DepartmentAreaId): LocalLandingPageV6DepartmentConfig {
  return {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
    departmentId,
    serviceArea: {
      ...DORDOGNE_LOCAL_LANDING_PAGE_V6.serviceArea,
      sectors: [
        {
          name: 'Secteur fixture',
          visibleCommunes: ['Commune témoin', 'Draftville'],
          collapsedCommunes: [],
        },
      ],
    },
  };
}

function cityConfig(localEntryId: CityAreaId): LocalLandingPageV6CityConfig {
  return {
    ...BERGERAC_LOCAL_LANDING_PAGE_V6,
    localEntryId,
    serviceArea: {
      ...BERGERAC_LOCAL_LANDING_PAGE_V6.serviceArea,
      parentLink: {
        ...BERGERAC_LOCAL_LANDING_PAGE_V6.serviceArea.parentLink,
        localEntryId: publishedDepartment.id as DepartmentAreaId,
      },
    },
  };
}

function renderInsideLayout(pathname: string, element: ReactElement) {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={pathname.replace(/^\//, '')} element={element} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

async function expectNotFoundSeo() {
  expect(screen.getByRole('heading', { name: /page non trouvée/i })).toBeInTheDocument();
  await waitFor(() =>
    expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
      'content',
      'noindex,follow'
    )
  );
  expect(document.querySelector("link[rel='canonical']")).not.toBeInTheDocument();
  expect(document.querySelectorAll("script[type='application/ld+json']")).toHaveLength(0);
  expect(screen.queryByRole('navigation', { name: /fil d.ariane/i })).not.toBeInTheDocument();
}

describe('local publication rendering', () => {
  afterEach(() => {
    cleanup();
    clearSeoHead();
  });

  it('keeps draft departments out of the hub and renders declared routes as NotFound SEO', async () => {
    await withRegistryEntries([draftDepartment], async () => {
      render(
        <MemoryRouter>
          <ZonesIntervention />
        </MemoryRouter>
      );

      expect(screen.queryByText(draftDepartment.name)).not.toBeInTheDocument();

      cleanup();
      clearSeoHead();
      renderInsideLayout(
        draftDepartment.path,
        <DepartmentLandingPage config={departmentConfig(draftDepartment.id)} />
      );

      await expectNotFoundSeo();
    });
  });

  it.each([draftCity, cityWithDraftParent, cityWithoutParent])(
    'omits navigation for non-public child $id',
    async (child) => {
      await withRegistryEntries([publishedDepartment, draftDepartment, child], async () => {
        render(
          <MemoryRouter>
            <ZonesIntervention />
          </MemoryRouter>
        );

        expect(document.querySelector(`a[href="${child.path}"]`)).toBeNull();

        cleanup();
        render(
          <MemoryRouter>
            <DepartmentLandingPage config={departmentConfig(publishedDepartment.id)} />
          </MemoryRouter>
        );

        expect(document.querySelector('.local-v6-sector-list')).toHaveTextContent('Draftville');
        expect(screen.queryByRole('link', { name: /Draftville/ })).not.toBeInTheDocument();
        expect(document.querySelector(`a[href="${child.path}"]`)).toBeNull();
        expect(
          screen.queryByRole('navigation', { name: 'Pages locales du département' })
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/nos pages locales/i)).not.toBeInTheDocument();
      });
    }
  );

  it('renders published local child links from the registry without a manual URL in config', async () => {
    await withRegistryEntries(
      [publishedDepartment, publishedDestination, draftCity, publishedCity, cityWithoutParent],
      async () => {
        const config = departmentConfig(publishedDepartment.id);

        render(
          <MemoryRouter>
            <DepartmentLandingPage config={config} />
          </MemoryRouter>
        );

        const navigation = screen.getByRole('navigation', { name: 'Pages locales du département' });
        expect(within(navigation).getByRole('list')).toHaveClass('local-v6-commune-list');
        expect(within(navigation).getByText(/nos pages locales/i)).toBeVisible();
        const links = within(navigation).getAllByRole('link');
        expect(links.map((link) => link.getAttribute('href'))).toEqual([
          publishedCity.path,
          publishedDestination.path,
        ]);
        links.forEach((link) =>
          expect(link.getAttribute('rel')?.split(/\s+/) ?? []).not.toContain('nofollow')
        );
        expect(navigation.querySelector(`a[href="${draftCity.path}"]`)).toBeNull();

        const html = renderToString(
          <StaticRouter location={publishedDepartment.path}>
            <DepartmentLandingPage config={config} />
          </StaticRouter>
        );
        const serverDocument = new DOMParser().parseFromString(html, 'text/html');
        const serverNavigation = serverDocument.querySelector('section#communes nav');
        expect(serverNavigation?.querySelector('p')?.textContent).toMatch(/nos pages locales/i);
        expect(
          [...(serverNavigation?.querySelectorAll('a') ?? [])].map((link) =>
            link.getAttribute('href')
          )
        ).toEqual([publishedCity.path, publishedDestination.path]);
        expect(serverDocument.querySelectorAll('.local-v6-sector-list a')).toHaveLength(0);
      }
    );
  });

  it('renders non-public city routes as NotFound when draft or attached to no public parent', async () => {
    await withRegistryEntries(
      [publishedDepartment, draftDepartment, draftCity, cityWithDraftParent, cityWithoutParent],
      async () => {
        renderInsideLayout(draftCity.path, <CityLandingPage config={cityConfig(draftCity.id)} />);
        await expectNotFoundSeo();

        cleanup();
        clearSeoHead();
        renderInsideLayout(
          cityWithDraftParent.path,
          <CityLandingPage config={cityConfig(cityWithDraftParent.id)} />
        );
        await expectNotFoundSeo();

        cleanup();
        clearSeoHead();
        renderInsideLayout(
          cityWithoutParent.path,
          <CityLandingPage config={cityConfig(cityWithoutParent.id)} />
        );
        await expectNotFoundSeo();
      }
    );
  });

  it.each([
    { state: 'published city', id: publishedCity.id, href: publishedCity.path },
    {
      state: 'published destination',
      id: publishedDestination.id,
      href: publishedDestination.path,
    },
    { state: 'draft child', id: draftCity.id, href: null },
    { state: 'draft parent', id: cityWithDraftParent.id, href: null },
    { state: 'missing parent', id: cityWithoutParent.id, href: null },
    { state: 'missing child', id: 'fixture-missing-child' as LocalChildAreaId, href: null },
    {
      state: 'published child of another published department',
      id: cityInOtherDepartment.id,
      href: null,
    },
  ])('resolves a territorial link with $state in client and server HTML', async ({ id, href }) => {
    await withRegistryEntries(
      [
        publishedDepartment,
        draftDepartment,
        publishedCity,
        publishedDestination,
        draftCity,
        cityWithDraftParent,
        cityWithoutParent,
        otherPublishedDepartment,
        cityInOtherDepartment,
      ],
      () => {
        const config: LocalLandingPageV6DepartmentConfig = {
          // Exercise the renderer directly so a draft parent is not masked by the route guard.
          ...departmentConfig(
            id === cityWithDraftParent.id ? draftDepartment.id : publishedDepartment.id
          ),
          localModule: {
            type: 'territorial-service',
            title: 'Fixture territorial module',
            intro: 'Fixture introduction.',
            items: [
              {
                title: 'Fixture linked item',
                body: 'Fixture body remains available.',
                link: { label: 'Fixture local link', localEntryId: id },
              },
              { title: 'Fixture unlinked item', body: 'Fixture second body.' },
            ],
          },
        };
        render(
          <MemoryRouter>
            <LocalLandingPageV6 config={config} />
          </MemoryRouter>
        );
        const section = screen.getByRole('region', { name: 'Fixture territorial module' });
        const link = within(section).queryByRole('link', { name: 'Fixture local link' });
        expect(within(section).getByText('Fixture body remains available.')).toBeInTheDocument();
        expect(within(section).getAllByRole('listitem')).toHaveLength(2);
        if (href) {
          expect(link).toHaveAttribute('href', href);
          expect(link?.getAttribute('rel')?.split(/\s+/) ?? []).not.toContain('nofollow');
        } else {
          expect(link).not.toBeInTheDocument();
        }

        const html = renderToString(
          <StaticRouter location={publishedDepartment.path}>
            <LocalLandingPageV6 config={config} />
          </StaticRouter>
        );
        const document = new DOMParser().parseFromString(html, 'text/html');
        const serverSection = document.querySelector(
          'section[aria-labelledby="local-v6-territorial-title"]'
        );
        expect(serverSection?.textContent).toContain('Fixture body remains available.');
        expect(serverSection?.querySelector('a')?.getAttribute('href') ?? null).toBe(href);
      }
    );
  });
});
