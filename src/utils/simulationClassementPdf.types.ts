import type { GridSummary } from '../content/simulatorGrid';
import type { LogementDto, PublicSimulationGridDto, RapportProvisoireDto } from './simulatorApi';

export interface SimulationClassementPdfInput {
  grid: GridSummary;
  rapport: RapportProvisoireDto;
  grille: PublicSimulationGridDto | undefined;
  logement: LogementDto | null;
  totalSleepingCapacity: number;
  generatedAt: Date;
  simulationId: string;
}
