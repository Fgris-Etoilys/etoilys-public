import type { GridCriterion, GridSummary } from '../content/simulatorGrid';
import type { CriterionStatus } from './simulatorApi';
import type {
  BesoinFait,
  BlocGlobal,
  CritereFactuel,
  EvaluationFactuelle,
  FactuellePieceSection,
  FactuellePieceTarget,
} from './simulatorFactuelle.types';

/** Présentation de la Grille FACTUELLE : aucun verdict, besoin ni point n'est calculé ici. */

/** Critères dont les faits se saisissent dans une modale de bloc global. */
export const GLOBAL_CRITERIA: Partial<Record<number, BlocGlobal>> = {
  16: 'chauffage',
  18: 'c18',
  19: 'c19',
  25: 'c25',
  26: 'c26',
  57: 'cuisson',
  58: 'cuisson',
  59: 'four_micro_ondes',
  60: 'four_micro_ondes',
  63: 'c63',
  64: 'c64',
  65: 'c65',
  101: 'c101',
  123: 'mesures_energie',
  124: 'mesures_energie',
  126: 'mesures_eau',
  127: 'mesures_eau',
};

export const GLOBAL_BLOCK_TITLES: Record<BlocGlobal, string> = {
  c18: 'Lave-linge',
  c19: 'Sèche-linge',
  c25: 'Places à table',
  c26: 'Assises du salon',
  cuisson: 'Plaques de cuisson',
  four_micro_ondes: 'Four et micro-ondes',
  chauffage: 'Chauffage',
  mesures_energie: 'Économies d’énergie',
  mesures_eau: 'Économies d’eau',
  c63: 'Vaisselle',
  c64: 'Verres',
  c65: 'Ustensiles de cuisine',
  c101: 'Livret d’accueil',
};

/**
 * Dérogation NA manuelle d'un automatique : miroir de `SaisieCritere.autoriseNaAutomatique`
 * (contrat backend « Commandes de cotation »), qu'aucun champ de l'évaluation n'expose.
 * Le backend reste juge : un refus est affiché normalement.
 */
export const AUTOMATIC_NA_CRITERIA: readonly number[] = [15, 16, 19, 26];

/** Salles d'eau et extérieurs : section Pièces d'un besoin sans pièce désignée. */
const SANITAIRE_CRITERIA = [39, 40, 44, 46, 47, 48, 49, 50, 51, 53, 54, 55, 131];
const EXTERIEUR_CRITERIA = [82, 83, 84];

export function formatCategory(category: string): string {
  return `${category.charAt(0)}★`;
}

/** « la catégorie 5★ » ou « les catégories 4★, 5★ ». */
export function formatCategoriesLabel(categories: readonly string[]): string {
  return `${categories.length > 1 ? 'les catégories' : 'la catégorie'} ${categories
    .map(formatCategory)
    .join(', ')}`;
}

export interface FactuelleCriterionState {
  /** Critère absent de l'évaluation : aucune action n'est proposée. */
  available: boolean;
  /** Statut réglementaire de la catégorie demandée. */
  status: CriterionStatus | undefined;
  automatique: boolean;
  bloc: BlocGlobal | undefined;
  /** Verdict calculé de la catégorie demandée (automatique). */
  verdict: 'VALIDE' | 'NON_VALIDE' | null;
  /** Réponse manuelle enregistrée (manuel), y compris NA quand le modèle l'autorise. */
  manualAnswer: 'VALIDE' | 'NON_VALIDE' | 'NON_APPLICABLE' | null;
  /** Dérogation NA active sur un automatique C15/C16/C19/C26. */
  derogation: boolean;
  canDerogate: boolean;
  canAnswerNotApplicable: boolean;
  /** NA dans la catégorie demandée sans rien à saisir ailleurs : aucune action proposée. */
  notApplicableOnly: boolean;
  /** Besoins manquants (union des cinq catégories) ; le premier sert à la navigation ciblée. */
  missing: BesoinFait[];
  /** Catégories à rappeler sous la réponse (« Pour la catégorie 2★ »). */
  mention: string[];
}

function asAnswer(
  value: CritereFactuel['reponse_manuelle']
): FactuelleCriterionState['manualAnswer'] {
  return value === 'VALIDE' || value === 'NON_VALIDE' || value === 'NON_APPLICABLE' ? value : null;
}

/** Catégories des besoins manquants lorsqu'aucun ne concerne la catégorie demandée, sinon liste vide. */
function missingCategoriesElsewhere(missing: BesoinFait[], category: string | null): string[] {
  const categories = new Set(missing.flatMap((besoin) => besoin.categories_utilisatrices));
  return category === null || categories.has(category) ? [] : [...categories].sort();
}

/** Projection d'un critère depuis l'évaluation canonique, à parité avec la Grille BO. */
export function factuelleCriterionState(
  criterion: GridCriterion,
  critere: CritereFactuel | undefined,
  evaluation: EvaluationFactuelle,
  category: string | null
): FactuelleCriterionState {
  const numero = criterion.num_critere;
  const status = critere?.categories.find((entry) => entry.categorie === category)?.statut_critere;
  const automatique = critere?.automatique ?? false;
  const missing = evaluation.besoins.filter(
    (besoin) => besoin.manquant && besoin.num_critere === numero
  );
  const derogation = automatique && critere?.reponse_manuelle === 'NON_APPLICABLE';
  const regulatoryNa = status === 'NON_APPLICABLE';
  const applicableElsewhere = (critere?.categories ?? [])
    .filter((entry) => entry.statut_critere !== 'NON_APPLICABLE')
    .map((entry) => entry.categorie)
    .sort();
  const missingElsewhere = missingCategoriesElsewhere(missing, category);
  const notApplicableOnly = automatique
    ? derogation || (regulatoryNa && missing.length === 0)
    : regulatoryNa && applicableElsewhere.length === 0;
  const verdict =
    critere?.statut_validation === 'VALIDE' || critere?.statut_validation === 'NON_VALIDE'
      ? critere.statut_validation
      : null;

  return {
    available: critere !== undefined,
    status,
    automatique,
    bloc: GLOBAL_CRITERIA[numero],
    verdict,
    manualAnswer: automatique ? null : asAnswer(critere?.reponse_manuelle ?? null),
    derogation,
    canDerogate: automatique && AUTOMATIC_NA_CRITERIA.includes(numero),
    canAnswerNotApplicable: !automatique && criterion.peut_etre_non_applicable,
    notApplicableOnly,
    missing,
    mention: automatique
      ? missingElsewhere
      : regulatoryNa && !notApplicableOnly
        ? applicableElsewhere
        : [],
  };
}

/** Numéros des critères ayant au moins un besoin manquant (union des cinq catégories). */
export function missingCriterionNumbers(evaluation: EvaluationFactuelle | null): number[] {
  const numbers = new Set<number>();
  evaluation?.besoins.forEach((besoin) => {
    if (besoin.manquant && besoin.num_critere !== null) {
      numbers.add(besoin.num_critere);
    }
  });
  return [...numbers].sort((first, second) => first - second);
}

/** Résumé de progression (analytics et en-tête) dérivé des seuls besoins backend. */
export function factuelleProgressSummary(
  grid: GridSummary | null,
  evaluation: EvaluationFactuelle | null,
  category: string | null
) {
  const missing = new Set(missingCriterionNumbers(evaluation));
  const criteres = new Map(evaluation?.criteres.map((critere) => [critere.num_critere, critere]));
  let totalCount = 0;
  let missingMandatoryCount = 0;
  grid?.criteriaByNumber.forEach((_criterion, numero) => {
    const categories = criteres.get(numero)?.categories ?? [];
    if (categories.every((entry) => entry.statut_critere === 'NON_APPLICABLE')) {
      return;
    }
    totalCount += 1;
    const status = categories.find((entry) => entry.categorie === category)?.statut_critere;
    if (missing.has(numero) && (status === 'OBLIGATOIRE' || status === 'ONC')) {
      missingMandatoryCount += 1;
    }
  });
  const remainingCount = Math.min(missing.size, totalCount);

  return {
    answeredCount: totalCount - remainingCount,
    totalCount,
    remainingCount,
    missingMandatoryCount,
  };
}

/** Navigation vers la Grille : modale du bloc ou carte du critère ; `requestId` distingue deux demandes. */
export interface FactuelleGridTarget {
  requestId: number;
  numero: number;
  bloc?: BlocGlobal | undefined;
  champ?: string | null | undefined;
}

/** Premier critère à compléter dans l'ordre de la Grille. */
export function firstMissingCriterion(grid: GridSummary, missing: number[]): number | null {
  const numbers = new Set(missing);
  for (const chapter of grid.chapitres) {
    for (const subChapter of chapter.sous_chapitres) {
      for (const rubrique of subChapter.rubriques) {
        const criterion = rubrique.criteres.find((entry) => numbers.has(entry.num_critere));
        if (criterion) return criterion.num_critere;
      }
    }
  }
  return null;
}

/** Coordonnées d'une saisie : besoin de l'évaluation ou blocage de la vérification. */
export interface FactuelleSourceCoordinates {
  destination: BesoinFait['destination'];
  champ: string;
  piece_id: string | null;
  num_critere: number | null;
}

export type FactuelleSource =
  | { kind: 'parametre'; champ: string }
  | { kind: 'global'; bloc: BlocGlobal; numero: number; champ: string }
  | { kind: 'piece'; target: Omit<FactuellePieceTarget, 'requestId'> }
  | { kind: 'critere'; numero: number };

function sectionWithoutPiece(numero: number | null): FactuellePieceSection | undefined {
  if (numero === null) {
    return undefined;
  }
  if (SANITAIRE_CRITERIA.includes(numero)) {
    return 'sanitaires';
  }
  return EXTERIEUR_CRITERIA.includes(numero) ? 'exterieurs' : undefined;
}

/** Destination exacte d'une saisie, sans jamais analyser la clé opaque `cle`. */
export function resolveFactuelleSource(coordinates: FactuelleSourceCoordinates): FactuelleSource {
  const numero = coordinates.num_critere;
  if (coordinates.destination === 'PARAMETRES') {
    return { kind: 'parametre', champ: coordinates.champ };
  }
  if (coordinates.destination === 'PIECE') {
    const section = coordinates.piece_id === null ? sectionWithoutPiece(numero) : undefined;
    return {
      kind: 'piece',
      target: {
        piece_id: coordinates.piece_id,
        champ: coordinates.champ,
        num_critere: numero,
        ...(section ? { section } : {}),
      },
    };
  }
  const bloc = numero === null ? undefined : GLOBAL_CRITERIA[numero];
  if (bloc && numero !== null) {
    return { kind: 'global', bloc, numero, champ: coordinates.champ };
  }
  return { kind: 'critere', numero: numero ?? 0 };
}
