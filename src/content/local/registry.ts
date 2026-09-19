import type {
  CityRegistryEntry,
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentRegionGroup,
  DepartmentRegistryEntry,
  LocalInterventionPage,
  LocalRegistryEntry,
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

export const LOCAL_REGISTRY: LocalRegistryEntry[] = [
  {
    id: 'dordogne',
    kind: 'department',
    name: 'Dordogne',
    path: '/classement-meuble-tourisme-dordogne',
    departmentCode: '24',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    coverageMode: 'sectors',
    displayOrder: 10,
    hubDescription:
      'Vallées, bastides et villages de pierre dessinent les différents visages du Périgord, du Bergeracois au Périgord Noir. Gîtes, maisons de vacances et locations saisonnières y font depuis longtemps partie du paysage touristique.',
    hubLinkLabel: 'Classement en Dordogne →',
    communeIndex: {
      departmentCode: '24',
      outputFileName: 'communes-dordogne-index.v1.json',
    },
    seo: {
      lastModified: '2026-09-17',
      title: 'Classement de meublé de tourisme en Dordogne',
      description:
        'Classez votre gîte ou meublé de tourisme en Dordogne avec Etoilys, organisme accrédité Cofrac. Consultez les tarifs. Rappel sous 24 h ouvrées.',
      breadcrumbLabel: 'Dordogne',
      ogImageKey: 'dordogneLaRoqueGageac',
      lcpImageKey: 'dordogneLaRoqueGageac',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'bergerac',
    kind: 'city',
    name: 'Bergerac et le Bergeracois',
    path: '/classement-meuble-tourisme-bergerac',
    departmentCode: '24',
    regionId: 'nouvelle-aquitaine',
    parentId: 'dordogne',
    status: 'published',
    displayOrder: 10,
    hubLabel: 'Bergerac et le Bergeracois',
    seo: {
      lastModified: '2026-09-17',
      title: 'Classement meublé de tourisme à Bergerac',
      description:
        'Faites classer votre meublé de tourisme à Bergerac et dans le Bergeracois. Visite sur place, tarifs clairs et demande en ligne avec Etoilys.',
      breadcrumbLabel: 'Bergerac',
      ogImageKey: 'bergeracHero',
      lcpImageKey: 'bergeracHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'gironde',
    kind: 'department',
    name: 'Gironde',
    path: '/classement-meuble-tourisme-gironde',
    departmentCode: '33',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    coverageMode: 'department',
    displayOrder: 20,
    hubDescription:
      'Entre Bordeaux, les vignobles du Libournais et les paysages de l’Entre-deux-Mers, la Gironde mêle tourisme urbain, viticole et rural. Les meublés de tourisme y prennent des formes très différentes, de l’appartement en ville à la maison au cœur des vignes.',
    hubLinkLabel: 'Classement en Gironde →',
    communeIndex: {
      departmentCode: '33',
      outputFileName: 'communes-gironde-index.v1.json',
    },
    seo: {
      lastModified: '2026-09-17',
      title: 'Classement gîte, Airbnb et meublé de tourisme en Gironde',
      description:
        'Etoilys accompagne les propriétaires de meublés de tourisme en Gironde : classement officiel, zones d’intervention, procédure, fiscalité, taxe de séjour et demande en ligne.',
      breadcrumbLabel: 'Gironde',
      ogImageKey: 'girondeHero',
      lcpImageKey: 'girondeHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'bordeaux',
    kind: 'city',
    name: 'Bordeaux',
    path: '/classement-meuble-tourisme-bordeaux',
    departmentCode: '33',
    regionId: 'nouvelle-aquitaine',
    parentId: 'gironde',
    status: 'published',
    displayOrder: 10,
    hubLabel: 'Bordeaux et sa métropole',
    departmentLabel: 'Bordeaux et sa métropole',
    seo: {
      lastModified: '2026-09-17',
      title: 'Classement meublé de tourisme à Bordeaux',
      description:
        'Faites classer votre meublé de tourisme à Bordeaux et dans la métropole. Visite sur place, tarifs clairs et demande en ligne avec Etoilys.',
      breadcrumbLabel: 'Bordeaux',
      ogImageKey: 'bordeauxHero',
      lcpImageKey: 'bordeauxHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'lot-et-garonne',
    kind: 'department',
    name: 'Lot-et-Garonne',
    path: '/classement-meuble-tourisme-lot-et-garonne',
    departmentCode: '47',
    regionId: 'nouvelle-aquitaine',
    status: 'published',
    coverageMode: 'sectors',
    displayOrder: 30,
    hubDescription:
      'Bastides, vallées du Lot et de la Garonne et campagnes vallonnées donnent au Lot-et-Garonne un caractère profondément rural. Une destination où gîtes, maisons familiales et locations de vacances occupent naturellement une place importante.',
    hubLinkLabel: 'Classement dans le Lot-et-Garonne →',
    communeIndex: {
      departmentCode: '47',
      outputFileName: 'communes-lot-et-garonne-index.v1.json',
    },
    seo: {
      lastModified: '2026-09-17',
      title: 'Classement gîte, Airbnb et meublé de tourisme dans le Lot-et-Garonne',
      description:
        'Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme dans le Lot-et-Garonne pour leur classement officiel.',
      breadcrumbLabel: 'Lot-et-Garonne',
      ogImageKey: 'lotEtGaronneHero',
      lcpImageKey: 'lotEtGaronneHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'lot',
    kind: 'department',
    name: 'Lot',
    path: '/classement-meuble-tourisme-lot',
    departmentCode: '46',
    regionId: 'occitanie',
    status: 'published',
    coverageMode: 'department',
    displayOrder: 40,
    hubDescription:
      'Causses, falaises et vallées entourent quelques-uns des villages les plus emblématiques du Quercy, de Rocamadour à Saint-Cirq-Lapopie. Le tourisme y repose largement sur des séjours en gîte, maison de vacances ou petit meublé au cœur des villages et de la campagne.',
    hubLinkLabel: 'Classement dans le Lot →',
    communeIndex: {
      departmentCode: '46',
      outputFileName: 'communes-lot-index.v1.json',
    },
    seo: {
      lastModified: '2026-09-18',
      title: 'Classement gîte, Airbnb et meublé de tourisme dans le Lot',
      description:
        'Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme dans le Lot pour leur classement officiel.',
      breadcrumbLabel: 'Lot',
      ogImageKey: 'lotHero',
      lcpImageKey: 'lotHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
  {
    id: 'aveyron',
    kind: 'department',
    name: 'Aveyron',
    path: '/classement-meuble-tourisme-aveyron',
    departmentCode: '12',
    regionId: 'occitanie',
    status: 'published',
    coverageMode: 'department',
    displayOrder: 50,
    hubDescription:
      'De l’Aubrac aux gorges du Tarn, l’Aveyron change de visage au fil des plateaux, vallées et villages de caractère. Un territoire de grands espaces où gîtes ruraux, maisons de vacances et hébergements indépendants accompagnent naturellement le tourisme de découverte.',
    hubLinkLabel: 'Classement en Aveyron →',
    communeIndex: {
      departmentCode: '12',
      outputFileName: 'communes-aveyron-index.v1.json',
    },
    seo: {
      lastModified: '2026-09-18',
      title: 'Classement gîte, Airbnb et meublé de tourisme en Aveyron',
      description:
        'Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme en Aveyron pour leur classement officiel.',
      breadcrumbLabel: 'Aveyron',
      ogImageKey: 'aveyronHero',
      lcpImageKey: 'aveyronHero',
      lcpImageSizes: '(min-width: 1336px) 570px, (min-width: 900px) 45vw, 100vw',
    },
  },
];

export const DEPARTMENT_INTERVENTION_AREAS = LOCAL_REGISTRY.filter(
  (entry): entry is DepartmentRegistryEntry => entry.kind === 'department'
);

function compareByDisplayOrder<T extends { displayOrder: number; id: string }>(
  first: T,
  second: T
) {
  return first.displayOrder - second.displayOrder || first.id.localeCompare(second.id);
}

function isPublished(entry: LocalRegistryEntry): boolean {
  return entry.status === 'published';
}

export function isLocalRegistryEntryEffectivelyPublished(
  entry: LocalRegistryEntry,
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): boolean {
  if (!isPublished(entry)) {
    return false;
  }

  if (entry.kind === 'department') {
    return true;
  }

  const parent = entries.find((candidate) => candidate.id === entry.parentId);
  return parent?.kind === 'department' && isPublished(parent);
}

function joinFrenchList(items: string[]): string {
  if (items.length <= 2) {
    return items.join(' et ');
  }

  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

function toLocalPage(entry: CityRegistryEntry): LocalInterventionPage {
  return {
    id: entry.id,
    label: entry.name,
    hubLabel: entry.hubLabel,
    ...(entry.departmentLabel ? { departmentLabel: entry.departmentLabel } : {}),
    path: entry.path,
  };
}

function toInterventionArea(
  entry: DepartmentRegistryEntry,
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): DepartmentInterventionArea {
  return {
    id: entry.id,
    name: entry.name,
    path: entry.path,
    departmentCode: entry.departmentCode,
    regionId: entry.regionId,
    status: entry.status,
    coverageMode: entry.coverageMode,
    displayOrder: entry.displayOrder,
    description: entry.hubDescription,
    hubLinkLabel: entry.hubLinkLabel,
    localPages: getPublishedCityEntriesForDepartment(entry.id, entries).map(toLocalPage),
  };
}

export function getLocalRegistryEntry(id: string): LocalRegistryEntry | undefined {
  return LOCAL_REGISTRY.find((entry) => entry.id === id);
}

export function getLocalRegistryEntryByPath(pathname: string): LocalRegistryEntry | undefined {
  return LOCAL_REGISTRY.find((entry) => entry.path === pathname);
}

export function getDepartmentRegistryEntry(
  id: DepartmentAreaId
): DepartmentRegistryEntry | undefined {
  const entry = getLocalRegistryEntry(id);
  return entry?.kind === 'department' ? entry : undefined;
}

export function getDepartmentInterventionArea(id: DepartmentAreaId): DepartmentInterventionArea {
  const area = getDepartmentRegistryEntry(id);

  if (!area) {
    throw new Error(`Unknown department intervention area: ${id}`);
  }

  return toInterventionArea(area);
}

export function isLocalRegistryEntryPublished(id: string): boolean {
  const entry = getLocalRegistryEntry(id);
  return entry === undefined ? false : isLocalRegistryEntryEffectivelyPublished(entry);
}

export function getPublishedLocalRegistryEntries(
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): LocalRegistryEntry[] {
  return getPublishedDepartmentEntries(entries).flatMap((department) => [
    department,
    ...getPublishedCityEntriesForDepartment(department.id, entries),
  ]);
}

export function getPublishedDepartmentEntries(
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): DepartmentRegistryEntry[] {
  return entries
    .filter((entry): entry is DepartmentRegistryEntry => entry.kind === 'department')
    .filter(isPublished)
    .slice()
    .sort(compareByDisplayOrder);
}

export function getPublishedCityEntriesForDepartment(
  parentId: DepartmentAreaId,
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): CityRegistryEntry[] {
  return entries
    .filter((entry): entry is CityRegistryEntry => entry.kind === 'city')
    .filter(
      (entry) =>
        entry.parentId === parentId && isLocalRegistryEntryEffectivelyPublished(entry, entries)
    )
    .slice()
    .sort(compareByDisplayOrder);
}

export function getActiveDepartmentInterventionAreas(
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): DepartmentInterventionArea[] {
  return getPublishedDepartmentEntries(entries).map((entry) => toInterventionArea(entry, entries));
}

export function groupActiveDepartmentsByRegion(
  regions: RegionRegistryEntry[] = DEPARTMENT_REGIONS,
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): DepartmentRegionGroup[] {
  const regionsById = new Map<RegionId, RegionRegistryEntry>(
    regions.map((region) => [region.id, region])
  );
  const departmentsByRegion = new Map<RegionId, DepartmentInterventionArea[]>();

  getActiveDepartmentInterventionAreas(entries).forEach((area) => {
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
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): string {
  return joinFrenchList(getActiveDepartmentInterventionAreas(entries).map((area) => area.name));
}

export function getDepartmentEntryByCode(
  departmentCode: string,
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): DepartmentRegistryEntry | undefined {
  return entries.find(
    (entry): entry is DepartmentRegistryEntry =>
      entry.kind === 'department' && entry.departmentCode === departmentCode
  );
}

export function getPublishedLocalPaths(entries: LocalRegistryEntry[] = LOCAL_REGISTRY): string[] {
  return getPublishedLocalRegistryEntries(entries).map((entry) => entry.path);
}

export function getPublishedLocalSeoEntries(
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): LocalRegistryEntry[] {
  return getPublishedLocalRegistryEntries(entries);
}

export function getDepartmentCommuneIndexOutputs(
  entries: LocalRegistryEntry[] = LOCAL_REGISTRY
): Array<{ departmentCode: string; outputFileName: string }> {
  return getPublishedDepartmentEntries(entries)
    .map((entry) => entry.communeIndex)
    .filter((entry): entry is { departmentCode: string; outputFileName: string } => Boolean(entry));
}
