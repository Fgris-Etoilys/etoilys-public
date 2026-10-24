/**
 * Contrats publics FACTUELLE de vérification globale et de comparaison 1★–5★ (ETOILYS-432),
 * alignés sur `docs/data/swagger.json`. Aucun calcul réglementaire n'est réalisé ici.
 */

import { parseGridSummary, type GridSummary } from '../content/simulatorGrid';
import type { CriterionStatus, RequestedCategory } from './simulatorApi';
import {
  invalidResponse,
  isArrayOf,
  isCriterionStatus,
  isInteger,
  isNullableNumber,
  isOneOf,
  isRecord,
  isStatutValidationFactuel,
  isString,
  parseFaitsGrille,
  type BesoinFait,
  type FaitsGrille,
  type StatutValidationFactuel,
} from './simulatorFactuelle.types';

export const CATEGORIES_ETOILES = [
  '1*',
  '2*',
  '3*',
  '4*',
  '5*',
] as const satisfies readonly RequestedCategory[];

const isCategorieEtoiles = isOneOf<RequestedCategory>(CATEGORIES_ETOILES);

/** Blocage actionnable : les coordonnées non pertinentes sont nulles ; `cle` reste opaque. */
export interface BlocageFactuel {
  cle: string;
  code: string;
  message: string;
  destination: BesoinFait['destination'];
  champ: string;
  piece_id: string | null;
  num_critere: number | null;
  categories_utilisatrices: string[];
}

export interface VerificationFactuelle {
  comparaison_disponible: boolean;
  blocages: BlocageFactuel[];
}

/** `RapportProvisoireDto` d'une catégorie ; `points_optionnels_a_atteindre` inclut déjà la compensation. */
export interface RapportFactuel {
  points_totaux_obligatoires: number;
  points_minimaux_obligatoires: number;
  points_obligatoires_obtenus: number;
  points_obligatoires_atteints: boolean;
  points_obligatoires_a_compenser: number;
  points_optionnels_disponibles: number;
  points_optionnels_necessaires: number;
  points_optionnels_a_atteindre: number;
  points_optionnels_obtenus: number;
  points_optionnels_atteints: boolean;
  resultat: boolean;
  criteres_obligatoires_non_valides: number[];
  criteres_optionnels_non_valides: number[];
}

/** Réponse projetée pour une catégorie ; aucun commentaire n'est exposé. */
export interface ReponseComparaison {
  num_critere: number;
  points_obtenus: number | null;
  statut_validation: StatutValidationFactuel | null;
  statut_critere: CriterionStatus;
}

export interface ComparaisonCategorie {
  categorie: RequestedCategory;
  rapport: RapportFactuel;
  criteres_onc_non_valides: number[];
  reponses: ReponseComparaison[];
  /** Modèle de la catégorie : libellés, points et statuts résolus pour cette entrée. */
  modele: GridSummary;
}

export interface ComparaisonFactuelle {
  /** Demande réelle : ne remplace jamais `categorie` d'une entrée consultée ou exportée. */
  categorie_demandee: RequestedCategory;
  faits: FaitsGrille;
  surface_totale: number | null;
  /** Exactement cinq entrées ordonnées de 1★ à 5★. */
  categories: ComparaisonCategorie[];
}

function isBlocage(value: unknown): value is BlocageFactuel {
  return (
    isRecord(value) &&
    isString(value.cle) &&
    isString(value.code) &&
    isString(value.message) &&
    (value.destination === 'PARAMETRES' ||
      value.destination === 'PIECE' ||
      value.destination === 'GRILLE') &&
    isString(value.champ) &&
    (value.piece_id == null || isString(value.piece_id)) &&
    (value.num_critere == null || isInteger(value.num_critere)) &&
    isArrayOf(value.categories_utilisatrices, isString)
  );
}

/** Bloc `factuelle` du `VerificationDto` ; son absence rend la réponse incompatible. */
export function parseVerificationFactuelle(value: unknown): VerificationFactuelle {
  const factuelle = isRecord(value) ? value.factuelle : undefined;
  if (
    !isRecord(factuelle) ||
    typeof factuelle.comparaison_disponible !== 'boolean' ||
    !isArrayOf(factuelle.blocages, isBlocage)
  ) {
    invalidResponse();
  }

  return {
    ...factuelle,
    comparaison_disponible: factuelle.comparaison_disponible,
    blocages: factuelle.blocages.map((blocage) => ({
      ...blocage,
      piece_id: blocage.piece_id ?? null,
      num_critere: blocage.num_critere ?? null,
    })),
  };
}

const RAPPORT_INTEGERS = [
  'points_totaux_obligatoires',
  'points_minimaux_obligatoires',
  'points_obligatoires_obtenus',
  'points_obligatoires_a_compenser',
  'points_optionnels_disponibles',
  'points_optionnels_necessaires',
  'points_optionnels_a_atteindre',
  'points_optionnels_obtenus',
] as const;

function isRapport(value: unknown): value is RapportFactuel {
  return (
    isRecord(value) &&
    RAPPORT_INTEGERS.every((key) => isInteger(value[key])) &&
    typeof value.points_obligatoires_atteints === 'boolean' &&
    typeof value.points_optionnels_atteints === 'boolean' &&
    typeof value.resultat === 'boolean' &&
    isArrayOf(value.criteres_obligatoires_non_valides, isInteger) &&
    (value.criteres_optionnels_non_valides == null ||
      isArrayOf(value.criteres_optionnels_non_valides, isInteger))
  );
}

function isReponseComparaison(value: unknown): value is ReponseComparaison {
  return (
    isRecord(value) &&
    isInteger(value.num_critere) &&
    isNullableNumber(value.points_obtenus ?? null) &&
    (value.statut_validation == null || isStatutValidationFactuel(value.statut_validation)) &&
    isCriterionStatus(value.statut_critere)
  );
}

function parseComparaisonCategorie(value: unknown): ComparaisonCategorie {
  if (
    !isRecord(value) ||
    !isCategorieEtoiles(value.categorie) ||
    !isRapport(value.rapport) ||
    !isArrayOf(value.criteres_onc_non_valides, isInteger) ||
    !isArrayOf(value.reponses, isReponseComparaison)
  ) {
    invalidResponse();
  }

  return {
    ...value,
    categorie: value.categorie,
    rapport: {
      ...value.rapport,
      criteres_optionnels_non_valides: value.rapport.criteres_optionnels_non_valides ?? [],
    },
    criteres_onc_non_valides: value.criteres_onc_non_valides,
    reponses: value.reponses.map((reponse) => ({
      ...reponse,
      points_obtenus: reponse.points_obtenus ?? null,
      statut_validation: reponse.statut_validation ?? null,
    })),
    modele: parseGridSummary(value.modele),
  };
}

/** Contrat 432 : exactement cinq rapports ordonnés de 1★ à 5★, jamais de rapport partiel. */
export function parseComparaisonFactuelle(value: unknown): ComparaisonFactuelle {
  if (
    !isRecord(value) ||
    !isCategorieEtoiles(value.categorie_demandee) ||
    !isNullableNumber(value.surface_totale ?? null) ||
    !Array.isArray(value.categories)
  ) {
    invalidResponse();
  }

  const categories = value.categories.map(parseComparaisonCategorie);
  if (
    categories.length !== CATEGORIES_ETOILES.length ||
    categories.some((entry, index) => entry.categorie !== CATEGORIES_ETOILES[index])
  ) {
    invalidResponse();
  }

  return {
    ...value,
    categorie_demandee: value.categorie_demandee,
    faits: parseFaitsGrille(value.faits),
    surface_totale: (value.surface_totale as number | null | undefined) ?? null,
    categories,
  };
}
