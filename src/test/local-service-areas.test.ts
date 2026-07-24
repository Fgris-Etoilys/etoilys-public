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

  it('uses specific department descriptions for the intervention hub', () => {
    expect(DEPARTMENT_INTERVENTION_AREAS.map((area) => area.description)).toEqual([
      'Etoilys intervient dans une large partie du département, notamment dans le Bergeracois, le Périgord Noir, le Grand Périgueux et les vallées de la Dordogne et de la Vézère.',
      'Les visites sont organisées notamment autour de Bordeaux, du Libournais, de l’Entre-deux-Mers, de la Haute-Gironde et de la vallée de la Garonne.',
      'Etoilys intervient autour d’Agen, Villeneuve-sur-Lot, Marmande et dans les principaux secteurs touristiques du département.',
    ]);
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

  it('registers city pages under their department only', () => {
    const dordogne = DEPARTMENT_INTERVENTION_AREAS.find((area) => area.id === 'dordogne');
    const gironde = DEPARTMENT_INTERVENTION_AREAS.find((area) => area.id === 'gironde');

    expect(dordogne?.localPages).toEqual([
      {
        id: 'bergerac',
        label: 'Bergerac et le Bergeracois',
        path: '/classement-meuble-tourisme-bergerac',
      },
    ]);
    expect(gironde?.localPages).toEqual([
      {
        id: 'bordeaux',
        label: 'Bordeaux et sa métropole',
        departmentLabel: 'Bordeaux et sa métropole',
        path: '/classement-meuble-tourisme-bordeaux',
      },
    ]);
    expect(dordogne?.localPages.find((localPage) => localPage.id === 'bordeaux')).toBeUndefined();
    expect(gironde?.localPages.find((localPage) => localPage.id === 'bergerac')).toBeUndefined();
  });
});
