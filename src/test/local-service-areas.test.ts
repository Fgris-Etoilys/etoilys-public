import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  AVEYRON_LOCAL_LANDING_PAGE_V6,
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
} from '../content/local/v6Pages';
import {
  DEPARTMENT_REGIONS,
  getActiveDepartmentInterventionAreas,
  getClassificationAreaServed,
  getDepartmentEntryByCode,
  getDepartmentRegistryEntry,
  getDepartmentInterventionArea,
  getPublishedCityEntriesForDepartment,
  getPublishedLocalChildEntriesForDepartment,
  getPublishedLocalRegistryEntries,
  getPublishedLocalPaths,
  groupActiveDepartmentsByRegion,
} from '../content/local/registry';
import type {
  CityAreaId,
  DepartmentAreaId,
  DestinationAreaId,
  LocalRegistryEntry,
} from '../content/local/types';
import {
  buildLocalSeoRoutes,
  getIndexablePaths,
  getPrerenderPaths,
  getSeoRouteConfig,
} from '../content/seoRoutes';
import { extractActiveAppPaths } from './routeGovernance';

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
}

function normalizeCommuneName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .trim();
}

function readCommuneIndexLabels(outputFileName: string) {
  const payload = JSON.parse(readFileSync(`public/data/${outputFileName}`, 'utf8')) as {
    c: Array<{ label: string }>;
  };

  return new Set(payload.c.map((commune) => normalizeCommuneName(commune.label)));
}

const fixtureSeo = {
  lastModified: '2026-09-18',
  title: 'Fixture',
  description: 'Fixture.',
  breadcrumbLabel: 'Fixture',
  ogImageKey: 'homeHero',
  lcpImageKey: 'homeHero',
  lcpImageSizes: '100vw',
} as const;

const draftDepartment: LocalRegistryEntry = {
  id: 'fixture-draft-department' as DepartmentAreaId,
  kind: 'department',
  name: 'Département brouillon',
  path: '/classement-meuble-tourisme-fixture-draft',
  departmentCode: '12',
  regionId: 'occitanie',
  status: 'draft',
  coverageMode: 'sectors',
  displayOrder: 50,
  hubDescription: 'Draft department.',
  hubLinkLabel: 'Classement fixture brouillon →',
  seo: fixtureSeo,
};

const publishedCorsicaDepartment: LocalRegistryEntry = {
  id: 'corse-du-sud' as DepartmentAreaId,
  kind: 'department',
  name: 'Corse-du-Sud',
  path: '/classement-meuble-tourisme-corse-du-sud',
  departmentCode: '2A',
  regionId: 'occitanie',
  status: 'published',
  coverageMode: 'on-request',
  displayOrder: 60,
  hubDescription: 'Fixture department.',
  hubLinkLabel: 'Classement en Corse-du-Sud →',
  seo: fixtureSeo,
};

const publishedCorsicaCity: LocalRegistryEntry = {
  id: 'ajaccio' as CityAreaId,
  kind: 'city',
  name: 'Ajaccio',
  path: '/classement-meuble-tourisme-ajaccio',
  departmentCode: '2A',
  regionId: 'occitanie',
  parentId: 'corse-du-sud' as DepartmentAreaId,
  status: 'published',
  displayOrder: 10,
  hubLabel: 'Ajaccio',
  seo: fixtureSeo,
};

const draftCorsicaCity: LocalRegistryEntry = {
  ...publishedCorsicaCity,
  id: 'draft-city' as CityAreaId,
  status: 'draft',
  path: '/draft-city',
};

const publishedCorsicaDestination: LocalRegistryEntry = {
  id: 'golfe-ajaccio' as DestinationAreaId,
  kind: 'destination',
  name: 'Golfe d’Ajaccio',
  path: '/classement-meuble-tourisme-golfe-ajaccio',
  departmentCode: '2A',
  regionId: 'occitanie',
  parentId: 'corse-du-sud' as DepartmentAreaId,
  status: 'published',
  displayOrder: 20,
  hubLabel: 'Golfe d’Ajaccio',
  seo: fixtureSeo,
};

const publishedCityWithDraftParent: LocalRegistryEntry = {
  ...publishedCorsicaCity,
  id: 'rodez' as CityAreaId,
  name: 'Rodez',
  path: '/classement-meuble-tourisme-rodez',
  parentId: draftDepartment.id,
};

const publishedCityWithoutParent: LocalRegistryEntry = {
  ...publishedCorsicaCity,
  id: 'orphan-city' as CityAreaId,
  name: 'Ville orpheline',
  path: '/classement-meuble-tourisme-ville-orpheline',
  parentId: 'missing-department' as DepartmentAreaId,
};

const departmentPageConfigs = [
  AVEYRON_LOCAL_LANDING_PAGE_V6,
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
];

const strictCommuneIndexDepartmentPageConfigs = [AVEYRON_LOCAL_LANDING_PAGE_V6];

describe('local service areas data', () => {
  it('keeps stable published department ids in display order', () => {
    const ids = getActiveDepartmentInterventionAreas().map((area) => area.id);

    expect(ids).toEqual(['dordogne', 'gironde', 'lot-et-garonne', 'lot', 'aveyron']);
  });

  it('keeps published local paths unique, routable, indexable and prerenderable', () => {
    const activeAppPaths = new Set(extractActiveAppPaths());
    const indexablePaths = new Set(getIndexablePaths());
    const prerenderPaths = new Set(getPrerenderPaths());
    const paths = getPublishedLocalPaths();

    expectUnique(paths);
    paths.forEach((path) => {
      expect(activeAppPaths.has(path), `${path} must be declared in AppRoutes.tsx`).toBe(true);
      expect(indexablePaths.has(path), `${path} must be indexable in seoRoutes.ts`).toBe(true);
      expect(prerenderPaths.has(path), `${path} must be prerenderable`).toBe(true);
    });
  });

  it('derives local children from parentId and published status', () => {
    expect(getPublishedCityEntriesForDepartment('dordogne').map((entry) => entry.id)).toEqual([
      'bergerac',
    ]);
    expect(getPublishedCityEntriesForDepartment('gironde').map((entry) => entry.id)).toEqual([
      'bordeaux',
    ]);
    expect(getPublishedLocalChildEntriesForDepartment('gironde').map((entry) => entry.id)).toEqual([
      'bordeaux',
      'bassin-arcachon',
      'medoc-atlantique',
    ]);

    const fixtureEntries: LocalRegistryEntry[] = [
      publishedCorsicaDepartment,
      publishedCorsicaCity,
      publishedCorsicaDestination,
      draftCorsicaCity,
    ];

    expect(
      getPublishedCityEntriesForDepartment('corse-du-sud' as DepartmentAreaId, fixtureEntries).map(
        (entry) => entry.path
      )
    ).toEqual(['/classement-meuble-tourisme-ajaccio']);
    expect(
      getPublishedLocalChildEntriesForDepartment(
        'corse-du-sud' as DepartmentAreaId,
        fixtureEntries
      ).map((entry) => entry.path)
    ).toEqual(['/classement-meuble-tourisme-ajaccio', '/classement-meuble-tourisme-golfe-ajaccio']);
  });

  it('applies effective publication to local children across helpers and local SEO', () => {
    const fixtureEntries: LocalRegistryEntry[] = [
      draftDepartment,
      publishedCorsicaDepartment,
      publishedCorsicaCity,
      publishedCorsicaDestination,
      draftCorsicaCity,
      publishedCityWithDraftParent,
      publishedCityWithoutParent,
    ];
    const publicPaths = getPublishedLocalPaths(fixtureEntries);
    const publicSeoPaths = Object.keys(buildLocalSeoRoutes(fixtureEntries));
    const publicEntries = getPublishedLocalRegistryEntries(fixtureEntries).map((entry) => entry.id);

    expect(publicEntries).toEqual(['corse-du-sud', 'ajaccio', 'golfe-ajaccio']);
    expect(publicPaths).toEqual([
      '/classement-meuble-tourisme-corse-du-sud',
      '/classement-meuble-tourisme-ajaccio',
      '/classement-meuble-tourisme-golfe-ajaccio',
    ]);
    expect(publicSeoPaths).toEqual(publicPaths);
    expect(publicPaths).not.toContain('/classement-meuble-tourisme-rodez');
    expect(publicPaths).not.toContain('/classement-meuble-tourisme-ville-orpheline');
    expect(publicPaths).not.toContain('/draft-city');
  });

  it('groups published departments by region without rendering empty regions or drafts', () => {
    const fixtureEntries: LocalRegistryEntry[] = [draftDepartment, publishedCorsicaDepartment];
    const groups = groupActiveDepartmentsByRegion(DEPARTMENT_REGIONS, fixtureEntries);

    expect(groups.map((group) => group.region.label)).toEqual(['Occitanie']);
    expect(groups.flatMap((group) => group.departments.map((area) => area.name))).toEqual([
      'Corse-du-Sud',
    ]);
    expect(groups.every((group) => group.departments.length > 0)).toBe(true);
  });

  it('keeps department code lookup limited to departments and accepts opaque codes', () => {
    const fixtureEntries: LocalRegistryEntry[] = [
      publishedCorsicaDepartment,
      publishedCorsicaCity,
      publishedCorsicaDestination,
      {
        ...publishedCorsicaDepartment,
        id: 'guadeloupe' as DepartmentAreaId,
        departmentCode: '971',
      },
      { ...publishedCorsicaDepartment, id: 'ain' as DepartmentAreaId, departmentCode: '01' },
      {
        ...publishedCorsicaDepartment,
        id: 'haute-corse' as DepartmentAreaId,
        departmentCode: '2B',
      },
    ];

    expect(getDepartmentEntryByCode('2A', fixtureEntries)?.id).toBe('corse-du-sud');
    expect(getDepartmentEntryByCode('971', fixtureEntries)?.kind).toBe('department');
    expect(getDepartmentEntryByCode('01', fixtureEntries)?.kind).toBe('department');
    expect(getDepartmentEntryByCode('2B', fixtureEntries)?.kind).toBe('department');
    expect(getDepartmentEntryByCode('99', fixtureEntries)).toBeUndefined();
    expect(getDepartmentEntryByCode('33')?.id).toBe('gironde');
  });

  it('excludes drafts from public outputs and lets unknown paths use NotFound SEO', () => {
    expect(getPublishedLocalPaths([draftDepartment])).toEqual([]);
    expect(getSeoRouteConfig(draftDepartment.path).isNotFound).toBe(true);
    expect(getIndexablePaths()).not.toContain(draftDepartment.path);
    expect(getPrerenderPaths()).not.toContain(draftDepartment.path);
  });

  it('keeps local page paths derived under their department', () => {
    const dordogne = getDepartmentInterventionArea('dordogne');
    const gironde = getDepartmentInterventionArea('gironde');

    expect(dordogne.localPages.map((localPage) => localPage.id)).toEqual(['bergerac']);
    expect(gironde.localPages.map((localPage) => localPage.id)).toEqual([
      'bordeaux',
      'bassin-arcachon',
      'medoc-atlantique',
    ]);
    expect(dordogne.localPages.find((localPage) => localPage.id === 'bordeaux')).toBeUndefined();
    expect(gironde.localPages.find((localPage) => localPage.id === 'bergerac')).toBeUndefined();
  });

  it('keeps structured data areaServed derived from published departments only', () => {
    expect(getClassificationAreaServed()).toBe('Dordogne, Gironde, Lot-et-Garonne, Lot et Aveyron');
    expect(getClassificationAreaServed([draftDepartment, publishedCorsicaDepartment])).toBe(
      'Corse-du-Sud'
    );
  });

  it('keeps department landing configs linked to registry entries', () => {
    expect(departmentPageConfigs.map((config) => config.departmentId)).toEqual([
      'aveyron',
      'dordogne',
      'gironde',
      'lot',
      'lot-et-garonne',
    ]);
    departmentPageConfigs.forEach((config) => {
      expect(getDepartmentInterventionArea(config.departmentId).id).toBe(config.departmentId);
    });
    expect(getDepartmentInterventionArea('gironde').coverageMode).toBe('department');
  });

  it('keeps department sector communes present in their generated commune indexes', () => {
    strictCommuneIndexDepartmentPageConfigs.forEach((config) => {
      const registryEntry = getDepartmentRegistryEntry(config.departmentId);
      const communeIndex = registryEntry?.communeIndex;
      expect(communeIndex).toBeDefined();
      if (!communeIndex) {
        throw new Error(`${config.departmentId} must declare a commune index`);
      }

      const indexedCommunes = readCommuneIndexLabels(communeIndex.outputFileName);
      const sectorCommunes = config.serviceArea.sectors.flatMap((sector) => [
        ...(sector.communes ?? []),
        ...(sector.visibleCommunes ?? []),
        ...(sector.collapsedCommunes ?? []),
      ]);
      const missingCommunes = sectorCommunes.filter(
        (commune) => !indexedCommunes.has(normalizeCommuneName(commune))
      );

      expect(missingCommunes, `${config.departmentId} sector communes`).toEqual([]);
    });
  });
});
