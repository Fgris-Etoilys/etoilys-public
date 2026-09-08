import type {
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentRegionGroup,
  RegionId,
  RegionRegistryEntry,
} from './types';

export const DEPARTMENT_REGIONS: RegionRegistryEntry[] = [
  {
    id: 'nouvelle-aquitaine',
    label: 'Nouvelle-Aquitaine',
    displayOrder: 10,
  },
  {
    id: 'occitanie',
    label: 'Occitanie',
    displayOrder: 20,
  },
];

export const DEPARTMENT_INTERVENTION_AREAS: DepartmentInterventionArea[] = [
  {
    id: 'dordogne',
    name: 'Dordogne',
    path: '/classement-meuble-tourisme-dordogne',
    departmentCode: '24',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    displayOrder: 10,
    description:
      'Etoilys intervient dans une large partie du département, notamment dans le Bergeracois, le Périgord Noir, le Grand Périgueux et les vallées de la Dordogne et de la Vézère.',
    localPages: [
      {
        id: 'bergerac',
        label: 'Bergerac et le Bergeracois',
        path: '/classement-meuble-tourisme-bergerac',
      },
    ],
  },
  {
    id: 'gironde',
    name: 'Gironde',
    path: '/classement-meuble-tourisme-gironde',
    departmentCode: '33',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    displayOrder: 20,
    description:
      'Les visites sont organisées notamment autour de Bordeaux, du Libournais, de l’Entre-deux-Mers, de la Haute-Gironde et de la vallée de la Garonne.',
    localPages: [
      {
        id: 'bordeaux',
        label: 'Bordeaux et sa métropole',
        departmentLabel: 'Bordeaux et sa métropole',
        path: '/classement-meuble-tourisme-bordeaux',
      },
    ],
  },
  {
    id: 'lot-et-garonne',
    name: 'Lot-et-Garonne',
    path: '/classement-meuble-tourisme-lot-et-garonne',
    departmentCode: '47',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    displayOrder: 30,
    description:
      'Etoilys intervient autour d’Agen, Villeneuve-sur-Lot, Marmande et dans les principaux secteurs touristiques du département.',
    localPages: [],
  },
];

function compareByDisplayOrder<T extends { displayOrder: number; id: string }>(
  first: T,
  second: T
) {
  return first.displayOrder - second.displayOrder || first.id.localeCompare(second.id);
}

function isPublishedDepartment(area: DepartmentInterventionArea): boolean {
  return area.status === 'published';
}

function joinFrenchList(items: string[]): string {
  if (items.length <= 2) {
    return items.join(' et ');
  }

  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

export function getDepartmentInterventionArea(id: DepartmentAreaId): DepartmentInterventionArea {
  const area = DEPARTMENT_INTERVENTION_AREAS.find((departmentArea) => departmentArea.id === id);

  if (!area) {
    throw new Error(`Unknown department intervention area: ${id}`);
  }

  return area;
}

export function getActiveDepartmentInterventionAreas(
  areas: DepartmentInterventionArea[] = DEPARTMENT_INTERVENTION_AREAS
): DepartmentInterventionArea[] {
  return areas.filter(isPublishedDepartment).slice().sort(compareByDisplayOrder);
}

export function groupActiveDepartmentsByRegion(
  regions: RegionRegistryEntry[] = DEPARTMENT_REGIONS,
  areas: DepartmentInterventionArea[] = DEPARTMENT_INTERVENTION_AREAS
): DepartmentRegionGroup[] {
  const regionsById = new Map<RegionId, RegionRegistryEntry>(
    regions.map((region) => [region.id, region])
  );
  const departmentsByRegion = new Map<RegionId, DepartmentInterventionArea[]>();

  getActiveDepartmentInterventionAreas(areas).forEach((area) => {
    const region = regionsById.get(area.regionId);

    if (!region) {
      throw new Error(`Unknown region for department ${area.id}: ${area.regionId}`);
    }

    departmentsByRegion.set(area.regionId, [
      ...(departmentsByRegion.get(area.regionId) ?? []),
      area,
    ]);
  });

  return regions
    .slice()
    .sort(compareByDisplayOrder)
    .map((region) => ({
      region,
      departments: departmentsByRegion.get(region.id) ?? [],
    }))
    .filter((group) => group.departments.length > 0);
}

export function getClassificationAreaServed(
  areas: DepartmentInterventionArea[] = DEPARTMENT_INTERVENTION_AREAS
): string {
  return joinFrenchList(getActiveDepartmentInterventionAreas(areas).map((area) => area.name));
}
