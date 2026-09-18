import { describe, expect, it } from 'vitest';
import {
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
  getDepartmentInterventionArea,
  getPublishedCityEntriesForDepartment,
  getPublishedLocalPaths,
  groupActiveDepartmentsByRegion,
} from '../content/local/registry';
import type { CityAreaId, DepartmentAreaId, LocalRegistryEntry } from '../content/local/types';
import { getIndexablePaths, getPrerenderPaths, getSeoRouteConfig } from '../content/seoRoutes';
import { extractActiveAppPaths } from './routeGovernance';

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
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
  id: 'aveyron' as DepartmentAreaId,
  kind: 'department',
  name: 'Aveyron',
  path: '/classement-meuble-tourisme-aveyron',
  departmentCode: '12',
  regionId: 'occitanie',
  status: 'draft',
  coverageMode: 'sectors',
  displayOrder: 50,
  hubDescription: 'Draft department.',
  hubLinkLabel: 'Classement en Aveyron →',
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

const departmentPageConfigs = [
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
];

describe('local service areas data', () => {
  it('keeps stable published department ids in display order', () => {
    const ids = getActiveDepartmentInterventionAreas().map((area) => area.id);

    expect(ids).toEqual(['dordogne', 'gironde', 'lot-et-garonne', 'lot']);
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

  it('derives city children from parentId and published status', () => {
    expect(getPublishedCityEntriesForDepartment('dordogne').map((entry) => entry.id)).toEqual([
      'bergerac',
    ]);
    expect(getPublishedCityEntriesForDepartment('gironde').map((entry) => entry.id)).toEqual([
      'bordeaux',
    ]);

    const fixtureEntries: LocalRegistryEntry[] = [
      publishedCorsicaDepartment,
      publishedCorsicaCity,
      {
        ...publishedCorsicaCity,
        id: 'draft-city' as CityAreaId,
        status: 'draft',
        path: '/draft-city',
      },
    ];

    expect(
      getPublishedCityEntriesForDepartment('corse-du-sud' as DepartmentAreaId, fixtureEntries).map(
        (entry) => entry.path
      )
    ).toEqual(['/classement-meuble-tourisme-ajaccio']);
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
    expect(gironde.localPages.map((localPage) => localPage.id)).toEqual(['bordeaux']);
    expect(dordogne.localPages.find((localPage) => localPage.id === 'bordeaux')).toBeUndefined();
    expect(gironde.localPages.find((localPage) => localPage.id === 'bergerac')).toBeUndefined();
  });

  it('keeps structured data areaServed derived from published departments only', () => {
    expect(getClassificationAreaServed()).toBe('Dordogne, Gironde, Lot-et-Garonne et Lot');
    expect(getClassificationAreaServed([draftDepartment, publishedCorsicaDepartment])).toBe(
      'Corse-du-Sud'
    );
  });

  it('keeps department landing configs linked to registry entries', () => {
    expect(departmentPageConfigs.map((config) => config.departmentId)).toEqual([
      'dordogne',
      'gironde',
      'lot',
      'lot-et-garonne',
    ]);
    departmentPageConfigs.forEach((config) => {
      expect(getDepartmentInterventionArea(config.departmentId).id).toBe(config.departmentId);
    });
  });
});
