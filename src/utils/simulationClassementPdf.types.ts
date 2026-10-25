import type { GridSummary } from '../content/simulatorGrid';
import type { LogementDto, PublicSimulationGridDto, RapportProvisoireDto } from './simulatorApi';

/**
 * Compléments FACTUELLE, figés au clic depuis l'entrée consultée de `/comparaison` : paramètres et
 * pièces décrits avec les totaux canoniques backend (couchages déclarés ≠ comptabilisés).
 */
export interface SimulationClassementFactuellePdfDetails {
  parameters: Array<[string, string]>;
  /** Pièce / espace, surface, couchages déclarés, pièce d'habitation reconnue. */
  pieces: string[][];
  /** ONC non validés de la catégorie exportée, ajoutés aux critères obligatoires non validés. */
  oncNonValides: number[];
}

export interface SimulationClassementPdfInput {
  grid: GridSummary;
  rapport: RapportProvisoireDto;
  /** En FACTUELLE : projection de la catégorie exportée (titre, statuts, réponses de la même entrée). */
  grille: PublicSimulationGridDto | undefined;
  logement: LogementDto | null;
  totalSleepingCapacity: number;
  generatedAt: Date;
  simulationId: string;
  factuelle?: SimulationClassementFactuellePdfDetails;
}
