import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CityAreaId, DepartmentAreaId, LocalRegistryEntry } from '../content/local/types';

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
  id: 'fixture-published-department' as DepartmentAreaId,
  kind: 'department',
  name: 'Département publié',
  path: '/classement-meuble-tourisme-fixture-published',
  departmentCode: '2A',
  regionId: 'occitanie',
  status: 'published',
  coverageMode: 'sectors',
  displayOrder: 90,
  hubDescription: 'Fixture publiée.',
  hubLinkLabel: 'Classement fixture publié →',
  seo: fixtureSeo,
};

const draftDepartment: LocalRegistryEntry = {
  ...publishedDepartment,
  id: 'fixture-draft-department' as DepartmentAreaId,
  name: 'Département brouillon',
  path: '/classement-meuble-tourisme-fixture-draft',
  status: 'draft',
};

const publishedCity: LocalRegistryEntry = {
  id: 'fixture-published-city' as CityAreaId,
  kind: 'city',
  name: 'Ville publiée',
  path: '/classement-meuble-tourisme-fixture-city',
  departmentCode: '2A',
  regionId: 'occitanie',
  parentId: publishedDepartment.id,
  status: 'published',
  displayOrder: 10,
  hubLabel: 'Ville publiée',
  departmentLabel: 'Ville publiée depuis le registre',
  seo: {
    ...fixtureSeo,
    breadcrumbLabel: 'Ville publiée',
  },
};

const draftCity: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-draft-city' as CityAreaId,
  name: 'Ville brouillon',
  path: '/classement-meuble-tourisme-fixture-draft-city',
  status: 'draft',
};

const publishedCityWithDraftParent: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-city-with-draft-parent' as CityAreaId,
  path: '/classement-meuble-tourisme-fixture-draft-parent-city',
  parentId: draftDepartment.id,
};

const publishedCityWithoutParent: LocalRegistryEntry = {
  ...publishedCity,
  id: 'fixture-city-without-parent' as CityAreaId,
  path: '/classement-meuble-tourisme-fixture-orphan-city',
  parentId: 'fixture-missing-parent' as DepartmentAreaId,
};

describe('local publication SEO module load', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('computes indexable and prerenderable local routes from effective publication only', async () => {
    vi.resetModules();
    const registry = await import('../content/local/registry');
    registry.LOCAL_REGISTRY.push(
      publishedDepartment,
      draftDepartment,
      publishedCity,
      draftCity,
      publishedCityWithDraftParent,
      publishedCityWithoutParent
    );

    const seoRoutes = await import('../content/seoRoutes');
    const indexablePaths = seoRoutes.getIndexablePaths();
    const prerenderPaths = seoRoutes.getPrerenderPaths();

    expect(indexablePaths).toContain(publishedDepartment.path);
    expect(indexablePaths).toContain(publishedCity.path);
    expect(prerenderPaths).toContain(publishedDepartment.path);
    expect(prerenderPaths).toContain(publishedCity.path);
    expect(indexablePaths).not.toContain(draftDepartment.path);
    expect(indexablePaths).not.toContain(draftCity.path);
    expect(indexablePaths).not.toContain(publishedCityWithDraftParent.path);
    expect(indexablePaths).not.toContain(publishedCityWithoutParent.path);
    expect(prerenderPaths).not.toContain(draftDepartment.path);
    expect(seoRoutes.getSeoRouteConfig(draftDepartment.path).isNotFound).toBe(true);
    expect(seoRoutes.getSeoRouteConfig(draftCity.path).isNotFound).toBe(true);
    expect(seoRoutes.getSeoRouteConfig(publishedCityWithDraftParent.path).isNotFound).toBe(true);

    expect(seoRoutes.getBreadcrumbItems(publishedCity.path).map((item) => item.name)).toEqual([
      'Accueil',
      'Zones d’intervention',
      'Fixture',
      'Ville publiée',
    ]);
  });
});
