import { describe, expect, it } from 'vitest';
import { DEPARTMENT_INTERVENTION_AREAS, type DepartmentAreaId } from '../content/localServiceAreas';
import { getIndexablePaths } from '../content/seoRoutes';
import { extractActiveAppPaths } from './routeGovernance';

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe('local service areas data', () => {
  it('keeps stable department ids in display order', () => {
    const ids = DEPARTMENT_INTERVENTION_AREAS.map((area) => area.id);

    expect(ids).toEqual<DepartmentAreaId[]>(['dordogne', 'gironde', 'lot-et-garonne']);
  });

  it('keeps department paths unique and publicly routable', () => {
    const activeAppPaths = new Set(extractActiveAppPaths());
    const indexablePaths = new Set(getIndexablePaths());
    const departmentPaths = DEPARTMENT_INTERVENTION_AREAS.map((area) => area.path);

    expectUnique(departmentPaths);
    departmentPaths.forEach((path) => {
      expect(activeAppPaths.has(path), `${path} must be declared in AppRoutes.tsx`).toBe(true);
      expect(indexablePaths.has(path), `${path} must be indexable in seoRoutes.ts`).toBe(true);
    });
  });

  it('allows departments to declare local pages only when they exist', () => {
    DEPARTMENT_INTERVENTION_AREAS.forEach((area) => {
      expect(Array.isArray(area.localPages)).toBe(true);
    });
  });

  it('keeps local page paths unique and backed by public indexable routes when declared', () => {
    const activeAppPaths = new Set(extractActiveAppPaths());
    const indexablePaths = new Set(getIndexablePaths());
    const localPagePaths = DEPARTMENT_INTERVENTION_AREAS.flatMap((area) =>
      area.localPages.map((localPage) => localPage.path)
    );

    expectUnique(localPagePaths);
    localPagePaths.forEach((path) => {
      expect(activeAppPaths.has(path), `${path} must be declared in AppRoutes.tsx`).toBe(true);
      expect(indexablePaths.has(path), `${path} must be indexable in seoRoutes.ts`).toBe(true);
    });
  });
});
