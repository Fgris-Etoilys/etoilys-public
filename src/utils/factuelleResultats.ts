import type {
  BlocageFactuel,
  ComparaisonCategorie,
  RapportFactuel,
} from './simulatorFactuelleResultats.types';

/**
 * Lecture des rapports de `/comparaison` : chaque synthèse et chaque détail reprennent la même entrée,
 * sans second calcul réglementaire. La cible à la carte inclut déjà la compensation.
 */

/** Écarts du rapport d'une catégorie, partagés par le sélecteur, le détail et le PDF. */
export function pointsManquants(rapport: RapportFactuel) {
  return {
    obligatoires: Math.max(
      0,
      rapport.points_minimaux_obligatoires - rapport.points_obligatoires_obtenus
    ),
    aLaCarte: Math.max(
      0,
      rapport.points_optionnels_a_atteindre - rapport.points_optionnels_obtenus
    ),
  };
}

export function formatPointsObligatoiresManquants(count: number): string {
  return count > 1 ? `${count} pts obligatoires manquants` : `${count} pt obligatoire manquant`;
}

export function formatPointsALaCarteManquants(count: number): string {
  return count > 1 ? `${count} pts à la carte manquants` : `${count} pt à la carte manquant`;
}

export function formatCriteresNonCompensables(count: number): string {
  return count > 1
    ? `${count} critères non compensables non validés`
    : `${count} critère non compensable non validé`;
}

/** Synthèse d'un sélecteur : verdict et déficits non nuls du rapport de la même catégorie. */
export function syntheseCategorie(entry: ComparaisonCategorie): {
  atteint: boolean;
  details: string[];
} {
  if (entry.rapport.resultat) {
    return { atteint: true, details: [] };
  }
  const manquants = pointsManquants(entry.rapport);
  const onc = entry.criteres_onc_non_valides.length;
  return {
    atteint: false,
    details: [
      ...(manquants.obligatoires > 0
        ? [formatPointsObligatoiresManquants(manquants.obligatoires)]
        : []),
      ...(manquants.aLaCarte > 0 ? [formatPointsALaCarteManquants(manquants.aLaCarte)] : []),
      // Un ONC non validé rend le résultat défavorable même sans déficit chiffré.
      ...(onc > 0 ? [formatCriteresNonCompensables(onc)] : []),
    ],
  };
}

export interface CritereNonValide {
  numero: number;
  libelle: string;
  points: number | undefined;
  nonCompensable: boolean;
}

/** Critères non validés de l'entrée consultée : obligatoires (ONC compris) et à la carte. */
export function criteresNonValides(entry: ComparaisonCategorie): {
  obligatoires: CritereNonValide[];
  aLaCarte: CritereNonValide[];
} {
  const onc = new Set(entry.criteres_onc_non_valides);
  const describe = (numero: number): CritereNonValide => {
    const criterion = entry.modele.criteriaByNumber.get(numero);
    return {
      numero,
      libelle: criterion?.libelle ?? 'Intitulé non disponible dans la grille',
      points: criterion?.points,
      nonCompensable: onc.has(numero),
    };
  };
  const obligatoires = [
    ...new Set([...entry.rapport.criteres_obligatoires_non_valides, ...onc]),
  ].sort((first, second) => first - second);

  return {
    obligatoires: obligatoires.map(describe),
    aLaCarte: [...new Set(entry.rapport.criteres_optionnels_non_valides)]
      .sort((first, second) => first - second)
      .map(describe),
  };
}

const CRITERION_BLOCKING_CODES = new Set(['FAIT_MANQUANT', 'REPONSE_MANQUANTE']);

export type PointBloquant =
  | { kind: 'criteres'; criteres: { numero: number; blocage: BlocageFactuel }[] }
  | { kind: 'blocage'; blocage: BlocageFactuel };

/**
 * Un seul point « critères à compléter » (numéros distincts triés, premier blocage de chacun pour la
 * navigation exacte) ; les autres blocages restent individuels, à leur place dans l'ordre backend.
 */
export function pointsBloquants(blocages: readonly BlocageFactuel[]): PointBloquant[] {
  const points: PointBloquant[] = [];
  let group: Extract<PointBloquant, { kind: 'criteres' }> | null = null;
  for (const blocage of blocages) {
    if (!CRITERION_BLOCKING_CODES.has(blocage.code) || blocage.num_critere === null) {
      points.push({ kind: 'blocage', blocage });
      continue;
    }
    if (!group) {
      group = { kind: 'criteres', criteres: [] };
      points.push(group);
    }
    const numero = blocage.num_critere;
    if (!group.criteres.some((critere) => critere.numero === numero)) {
      group.criteres.push({ numero, blocage });
    }
  }
  group?.criteres.sort((first, second) => first.numero - second.numero);
  return points;
}

/** « Utile pour » masqué lorsque le blocage concerne les cinq catégories. */
export function usefulCategories(blocage: Pick<BlocageFactuel, 'categories_utilisatrices'>) {
  return blocage.categories_utilisatrices.length >= 5 ? [] : blocage.categories_utilisatrices;
}
