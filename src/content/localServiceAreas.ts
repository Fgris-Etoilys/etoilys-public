export type {
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentPublicationStatus,
  DepartmentRegionGroup,
  LocalFaqItem,
  LocalInterventionPage,
  LocalProcedureStep,
  LocalSource,
  LocalStatistic,
  LocalTableRow,
  RegionId,
  RegionRegistryEntry,
} from './local/types';

export {
  DEPARTMENT_INTERVENTION_AREAS,
  DEPARTMENT_REGIONS,
  getActiveDepartmentInterventionAreas,
  getClassificationAreaServed,
  getDepartmentInterventionArea,
  groupActiveDepartmentsByRegion,
} from './local/registry';

export {
  DORDOGNE_LOCAL_CHECK_ROWS,
  DORDOGNE_MICRO_BIC_ROWS,
  DORDOGNE_SERVICE_SECTORS,
  DORDOGNE_SOURCES,
  DORDOGNE_STATISTICS,
  DORDOGNE_TOURISM_ROWS,
} from './local/departments/dordogne';

export {
  GIRONDE_SERVICE_SECTORS,
  GIRONDE_SOURCES,
  GIRONDE_TOURISM_ROWS,
} from './local/departments/gironde';

export { LOT_SERVICE_SECTORS } from './local/departments/lot';

export {
  LOT_ET_GARONNE_SERVICE_SECTORS,
  LOT_ET_GARONNE_SOURCES,
  LOT_ET_GARONNE_TOURISM_ROWS,
} from './local/departments/lot-et-garonne';

export {
  BERGERAC_FAQ,
  BERGERAC_PROCEDURE_STEPS,
  BERGERAC_SERVICE_COMMUNES,
} from './local/cities/bergerac';
