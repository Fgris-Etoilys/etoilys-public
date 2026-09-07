export type {
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentLandingPageConfig,
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
  DORDOGNE_DEPARTMENT_PAGE,
  DORDOGNE_FAQ,
  DORDOGNE_LOCAL_CHECK_ROWS,
  DORDOGNE_MICRO_BIC_ROWS,
  DORDOGNE_PROCEDURE_STEPS,
  DORDOGNE_SERVICE_SECTORS,
  DORDOGNE_SOURCES,
  DORDOGNE_STATISTICS,
  DORDOGNE_TOURISM_ROWS,
} from './local/departments/dordogne';

export {
  GIRONDE_DEPARTMENT_PAGE,
  GIRONDE_FAQ,
  GIRONDE_PROCEDURE_STEPS,
  GIRONDE_SERVICE_SECTORS,
  GIRONDE_SOURCES,
  GIRONDE_TOURISM_ROWS,
} from './local/departments/gironde';

export {
  LOT_ET_GARONNE_DEPARTMENT_PAGE,
  LOT_ET_GARONNE_FAQ,
  LOT_ET_GARONNE_PROCEDURE_STEPS,
  LOT_ET_GARONNE_SERVICE_SECTORS,
  LOT_ET_GARONNE_SOURCES,
  LOT_ET_GARONNE_TOURISM_ROWS,
} from './local/departments/lot-et-garonne';

export {
  BERGERAC_FAQ,
  BERGERAC_PROCEDURE_STEPS,
  BERGERAC_SERVICE_COMMUNES,
} from './local/cities/bergerac';
