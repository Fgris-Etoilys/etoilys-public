import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';
import Layout from '../components/layout/Layout';
import CityLandingPage from '../components/local/CityLandingPage';
import DepartmentLandingPage from '../components/local/DepartmentLandingPage';
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

function departmentConfig(
  departmentId: DepartmentAreaId,
  communeLinks?: LocalLandingPageV6DepartmentConfig['serviceArea']['communeLinks']
): LocalLandingPageV6DepartmentConfig {
  const serviceArea = { ...DORDOGNE_LOCAL_LANDING_PAGE_V6.serviceArea };
  delete serviceArea.communeLinks;

  return {
    ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
    departmentId,
    serviceArea: {
      ...serviceArea,
      sectors: [
        {
          name: 'Secteur fixture',
          visibleCommunes: ['Commune témoin', 'Draftville'],
          collapsedCommunes: [],
        },
      ],
      ...(communeLinks ? { communeLinks } : {}),
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

  it('keeps draft city links out of the hub and renders communes as plain text', async () => {
    await withRegistryEntries([publishedDepartment, draftCity], async () => {
      render(
        <MemoryRouter>
          <ZonesIntervention />
        </MemoryRouter>
      );

      expect(document.querySelector(`a[href="${draftCity.path}"]`)).toBeNull();

      cleanup();
      render(
        <MemoryRouter>
          <DepartmentLandingPage
            config={departmentConfig(publishedDepartment.id, {
              Draftville: { localEntryId: draftCity.id, label: 'Draftville →' },
            })}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Draftville')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Draftville/ })).not.toBeInTheDocument();
      expect(document.querySelector(`a[href="${draftCity.path}"]`)).toBeNull();
    });
  });

  it('renders published local child links from the registry without a manual URL in config', async () => {
    await withRegistryEntries(
      [publishedDepartment, publishedCity, publishedDestination],
      async () => {
        const config = departmentConfig(publishedDepartment.id);

        expect(config.serviceArea.communeLinks).toBeUndefined();
        render(
          <MemoryRouter>
            <DepartmentLandingPage config={config} />
          </MemoryRouter>
        );

        expect(
          screen.getByRole('link', { name: 'Ville publiée depuis le registre' })
        ).toHaveAttribute('href', publishedCity.path);
        expect(
          screen.getByRole('link', { name: 'Destination publiée depuis le registre' })
        ).toHaveAttribute('href', publishedDestination.path);
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
});
