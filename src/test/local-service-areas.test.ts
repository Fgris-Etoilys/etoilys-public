import { describe, expect, it } from 'vitest';
import {
  DEPARTMENT_INTERVENTION_AREAS,
  DEPARTMENT_REGIONS,
  DORDOGNE_DEPARTMENT_PAGE,
  GIRONDE_DEPARTMENT_PAGE,
  LOT_ET_GARONNE_DEPARTMENT_PAGE,
  getActiveDepartmentInterventionAreas,
  getClassificationAreaServed,
  groupActiveDepartmentsByRegion,
  type DepartmentAreaId,
  type DepartmentInterventionArea,
} from '../content/localServiceAreas';
import { getIndexablePaths } from '../content/seoRoutes';
import { extractActiveAppPaths } from './routeGovernance';

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
}

const departmentPageConfigs = [
  DORDOGNE_DEPARTMENT_PAGE,
  GIRONDE_DEPARTMENT_PAGE,
  LOT_ET_GARONNE_DEPARTMENT_PAGE,
];

describe('local service areas data', () => {
  it('keeps stable published department ids in display order', () => {
    const ids = getActiveDepartmentInterventionAreas().map((area) => area.id);

    expect(ids).toEqual(['dordogne', 'gironde', 'lot-et-garonne']);
  });

  it('keeps department paths unique and publicly routable when published', () => {
    const activeAppPaths = new Set(extractActiveAppPaths());
    const indexablePaths = new Set(getIndexablePaths());
    const departmentPaths = getActiveDepartmentInterventionAreas().map((area) => area.path);

    expectUnique(departmentPaths);
    departmentPaths.forEach((path) => {
      expect(activeAppPaths.has(path), `${path} must be declared in AppRoutes.tsx`).toBe(true);
      expect(indexablePaths.has(path), `${path} must be indexable in seoRoutes.ts`).toBe(true);
    });
  });

  it('requires every department to declare a known region, status and deterministic order', () => {
    const regionIds = new Set(DEPARTMENT_REGIONS.map((region) => region.id));
    const displayOrders = DEPARTMENT_INTERVENTION_AREAS.map((area) => area.displayOrder);

    expectUnique(DEPARTMENT_REGIONS.map((region) => region.id));
    expectUnique(DEPARTMENT_INTERVENTION_AREAS.map((area) => area.id));
    expectUnique(displayOrders.map(String));
    DEPARTMENT_INTERVENTION_AREAS.forEach((area) => {
      expect(regionIds.has(area.regionId)).toBe(true);
      expect(['published', 'draft']).toContain(area.status);
      expect(Array.isArray(area.localPages)).toBe(true);
    });
  });

  it('derives region groups and areaServed from published departments only', () => {
    const fixtureAreas: DepartmentInterventionArea[] = [
      ...DEPARTMENT_INTERVENTION_AREAS,
      {
        id: 'aveyron' as DepartmentAreaId,
        name: 'Aveyron',
        path: '/classement-meuble-tourisme-aveyron',
        regionId: 'occitanie',
        status: 'draft',
        displayOrder: 40,
        description: 'Draft department.',
        localPages: [],
      },
    ];

    expect(getActiveDepartmentInterventionAreas(fixtureAreas).map((area) => area.name)).toEqual([
      'Dordogne',
      'Gironde',
      'Lot-et-Garonne',
    ]);
    expect(groupActiveDepartmentsByRegion(DEPARTMENT_REGIONS, fixtureAreas)).toHaveLength(1);
    expect(getClassificationAreaServed()).toBe('Dordogne, Gironde et Lot-et-Garonne');
  });

  it('groups published departments by region without rendering empty regions', () => {
    const fixtureAreas: DepartmentInterventionArea[] = [
      {
        id: 'lot' as DepartmentAreaId,
        name: 'Lot',
        path: '/classement-meuble-tourisme-lot',
        regionId: 'occitanie',
        status: 'published',
        displayOrder: 40,
        description: 'Published department.',
        localPages: [],
      },
      {
        id: 'aveyron' as DepartmentAreaId,
        name: 'Aveyron',
        path: '/classement-meuble-tourisme-aveyron',
        regionId: 'occitanie',
        status: 'published',
        displayOrder: 50,
        description: 'Published department.',
        localPages: [],
      },
      ...DEPARTMENT_INTERVENTION_AREAS,
    ];
    const groups = groupActiveDepartmentsByRegion(DEPARTMENT_REGIONS, fixtureAreas);

    expect(groups.map((group) => group.region.label)).toEqual(['Nouvelle-Aquitaine', 'Occitanie']);
    expect(groups.flatMap((group) => group.departments.map((area) => area.name))).toEqual([
      'Dordogne',
      'Gironde',
      'Lot-et-Garonne',
      'Lot',
      'Aveyron',
    ]);
    expect(groups.every((group) => group.departments.length > 0)).toBe(true);
  });

  it('keeps local page paths unique and backed by public indexable routes when declared', () => {
    const activeAppPaths = new Set(extractActiveAppPaths());
    const indexablePaths = new Set(getIndexablePaths());
    const localPagePaths = getActiveDepartmentInterventionAreas().flatMap((area) =>
      area.localPages.map((localPage) => localPage.path)
    );

    expectUnique(localPagePaths);
    localPagePaths.forEach((path) => {
      expect(activeAppPaths.has(path), `${path} must be declared in AppRoutes.tsx`).toBe(true);
      expect(indexablePaths.has(path), `${path} must be indexable in seoRoutes.ts`).toBe(true);
    });
  });

  it('keeps department landing configs linked to registry entries', () => {
    const registryIds = new Set(DEPARTMENT_INTERVENTION_AREAS.map((area) => area.id));

    expect(departmentPageConfigs.map((config) => config.departmentId)).toEqual([
      'dordogne',
      'gironde',
      'lot-et-garonne',
    ]);
    departmentPageConfigs.forEach((config) => {
      expect(registryIds.has(config.departmentId)).toBe(true);
    });
  });

  it('registers city pages under their department only', () => {
    const dordogne = DEPARTMENT_INTERVENTION_AREAS.find((area) => area.id === 'dordogne');
    const gironde = DEPARTMENT_INTERVENTION_AREAS.find((area) => area.id === 'gironde');

    expect(dordogne?.localPages.map((localPage) => localPage.id)).toEqual(['bergerac']);
    expect(gironde?.localPages.map((localPage) => localPage.id)).toEqual(['bordeaux']);
    expect(dordogne?.localPages.find((localPage) => localPage.id === 'bordeaux')).toBeUndefined();
    expect(gironde?.localPages.find((localPage) => localPage.id === 'bergerac')).toBeUndefined();
  });
});
