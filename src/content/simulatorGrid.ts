import structureGrilleRaw from '../../docs/structureGrille.json?raw';
import type { CriterionStatus, RequestedCategory } from '../utils/simulatorApi';

export interface GridCategoryStatus {
  nom: RequestedCategory;
  statut: CriterionStatus;
}

export interface GridCriterion {
  num_critere: number;
  libelle: string;
  points: number;
  peut_etre_non_applicable: boolean;
  categories: GridCategoryStatus[];
}

export interface GridRubrique {
  libelle: string;
  criteres: GridCriterion[];
}

export interface GridSubChapter {
  libelle: string;
  rubriques: GridRubrique[];
}

export interface GridChapter {
  libelle: string;
  sous_chapitres: GridSubChapter[];
}

export interface GridStructure {
  chapitres: GridChapter[];
}

export interface GridSummary {
  chapitres: GridChapter[];
  criteriaByNumber: Map<number, GridCriterion>;
  criteriaCount: number;
}

const REQUESTED_CATEGORIES: RequestedCategory[] = ['1*', '2*', '3*', '4*', '5*'];
const CRITERION_STATUSES: CriterionStatus[] = ['OPTIONNEL', 'OBLIGATOIRE', 'ONC', 'NON_APPLICABLE'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRequestedCategory(value: unknown): value is RequestedCategory {
  return typeof value === 'string' && REQUESTED_CATEGORIES.includes(value as RequestedCategory);
}

function isCriterionStatus(value: unknown): value is CriterionStatus {
  return typeof value === 'string' && CRITERION_STATUSES.includes(value as CriterionStatus);
}

function isGridCategoryStatus(value: unknown): value is GridCategoryStatus {
  return isRecord(value) && isRequestedCategory(value.nom) && isCriterionStatus(value.statut);
}

function isGridCriterion(value: unknown): value is GridCriterion {
  return (
    isRecord(value) &&
    typeof value.num_critere === 'number' &&
    Number.isInteger(value.num_critere) &&
    typeof value.libelle === 'string' &&
    typeof value.points === 'number' &&
    typeof value.peut_etre_non_applicable === 'boolean' &&
    Array.isArray(value.categories) &&
    value.categories.every(isGridCategoryStatus)
  );
}

function isGridRubrique(value: unknown): value is GridRubrique {
  return (
    isRecord(value) &&
    typeof value.libelle === 'string' &&
    Array.isArray(value.criteres) &&
    value.criteres.every(isGridCriterion)
  );
}

function isGridSubChapter(value: unknown): value is GridSubChapter {
  return (
    isRecord(value) &&
    typeof value.libelle === 'string' &&
    Array.isArray(value.rubriques) &&
    value.rubriques.every(isGridRubrique)
  );
}

function isGridChapter(value: unknown): value is GridChapter {
  return (
    isRecord(value) &&
    typeof value.libelle === 'string' &&
    Array.isArray(value.sous_chapitres) &&
    value.sous_chapitres.every(isGridSubChapter)
  );
}

function isGridStructure(value: unknown): value is GridStructure {
  return isRecord(value) && Array.isArray(value.chapitres) && value.chapitres.every(isGridChapter);
}

function loadGridStructure(): GridStructure {
  const parsed = JSON.parse(structureGrilleRaw) as unknown;
  if (!isGridStructure(parsed)) {
    throw new Error('Structure de grille simulateur invalide');
  }
  return parsed;
}

function buildCriteriaByNumber(chapitres: GridChapter[]): Map<number, GridCriterion> {
  const criteriaByNumber = new Map<number, GridCriterion>();

  chapitres.forEach((chapter) => {
    chapter.sous_chapitres.forEach((subChapter) => {
      subChapter.rubriques.forEach((rubrique) => {
        rubrique.criteres.forEach((criterion) => {
          criteriaByNumber.set(criterion.num_critere, criterion);
        });
      });
    });
  });

  return criteriaByNumber;
}

const structure = loadGridStructure();
const criteriaByNumber = buildCriteriaByNumber(structure.chapitres);

export const simulatorGrid: GridSummary = {
  chapitres: structure.chapitres,
  criteriaByNumber,
  criteriaCount: criteriaByNumber.size,
};

export function getCriterionByNumber(number: number): GridCriterion | undefined {
  return criteriaByNumber.get(number);
}

export function getCriterionStatusForCategory(
  criterion: GridCriterion,
  category: string | undefined
): CriterionStatus | undefined {
  return criterion.categories.find((entry) => entry.nom === category)?.statut;
}

export function getCriterionAnchorId(number: number): string {
  return `critere-${number}`;
}

export function isSurfaceCriterion(criterion: GridCriterion): boolean {
  return criterion.libelle.toLocaleLowerCase('fr-FR').includes('surface');
}
