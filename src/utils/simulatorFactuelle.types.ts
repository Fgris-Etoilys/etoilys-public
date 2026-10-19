/**
 * Contrats publics FACTUELLE (ETOILYS-430/431/432), alignés sur `docs/data/swagger.json`.
 * Les parseurs vérifient la forme utile au front et conservent les champs additifs du serveur.
 */

export const FACTUELLE_PIECE_TYPES = [
  'CUISINE',
  'SEJOUR',
  'SALLE_A_MANGER',
  'SALON',
  'CHAMBRE',
  'BUREAU',
  'PIECE_SANS_OUVRANT',
  'COULOIRS_ET_DEGAGEMENTS',
  'SALLE_DE_BAIN',
  'LOGGIA_BALCON_VERANDA',
  'TERRASSE_OU_JARDIN_PRIVE',
  'PARC_OU_JARDIN',
] as const;
export type FactuellePieceType = (typeof FACTUELLE_PIECE_TYPES)[number];

export const COUCHAGE_TYPES = [
  'SIMPLE_FIXE',
  'DOUBLE_FIXE',
  'TWINS',
  'CONVERTIBLE',
  'GIGOGNE',
  'SUPERPOSEE',
  'ESCAMOTABLE',
  'AUTRE_APPOINT',
] as const;
export type CouchageType = (typeof COUCHAGE_TYPES)[number];

export const COUCHAGE_PROFILS = ['UNE_PLACE', 'DEUX_PLACES'] as const;
export type CouchageProfil = (typeof COUCHAGE_PROFILS)[number];

export const SANITAIRE_PROTECTIONS = [
  'CONFORME_SANS_RIDEAU',
  'RIDEAU_SEUL',
  'INSUFFISANTE',
] as const;
export type SanitaireProtection = (typeof SANITAIRE_PROTECTIONS)[number];

export const INSPECTION_BOOLEAN_FIELDS = [
  'couchage',
  'eclairages_fonctionnent',
  'rangements',
  'occultation_opaque',
  'double_vitrage',
  'matelas_haute_densite',
  'aleses_et_taies_oreillers',
  'eclairage_tete_lit',
  'interrupteur_central_pres_lit',
  'prise_libre_pres_lit',
  'table_chevet',
  'deux_points_lumineux',
  'produits_accueil',
  'produits_accueil_ecologiques',
  'prise_proche_miroir',
  'pateres',
  'seche_serviette_electrique',
  'miroir',
  'tablette_sous_miroir',
  'rangement_supplementaire',
] as const;
export type InspectionBooleanField = (typeof INSPECTION_BOOLEAN_FIELDS)[number];
export type InspectionFactuelle = Record<InspectionBooleanField, boolean | null> & {
  seche_cheveux: number | null;
};

export interface CouchageFactuel {
  id: string;
  type: CouchageType;
  profil: CouchageProfil | null;
  nombre_places: number | null;
  largeur_cm: number | null;
  longueur_cm: number | null;
}

export interface EquipementSanitaireFactuel {
  protection: SanitaireProtection | null;
  dimensions_superieures: boolean | null;
  largeur_cm: number | null;
  longueur_cm: number | null;
}

export interface SanitairesFactuels {
  lavabo_eau_chaude: boolean | null;
  presence_douche: boolean | null;
  presence_baignoire_avec_douchette: boolean | null;
  baignoire_sabot: boolean | null;
  douche: EquipementSanitaireFactuel | null;
  baignoire: EquipementSanitaireFactuel | null;
}

/** Corps complet de POST/PUT `/faits/pieces` : les inconnues restent explicites (`null`). */
export interface PieceFactuelleInput {
  nom: string | null;
  type_piece: FactuellePieceType;
  surface: number | null;
  ouvrant: boolean | null;
  prise: boolean | null;
  ventilation: boolean | null;
  commun: boolean | null;
  inspection: InspectionFactuelle | null;
  nombre_oreillers: number | null;
  tous_lits_couette: boolean | null;
  deux_couvertures_par_lit_sans_couette: boolean | null;
  sanitaires: SanitairesFactuels | null;
  couchages: CouchageFactuel[];
}

export interface PieceFactuelle extends PieceFactuelleInput {
  id: string;
  rang_type: number | null;
  total_places: number | null;
}

export interface ParametresFaits {
  mode_grille: 'FACTUELLE';
  categorie_demandee: string | null;
  capacite_accueil: number | null;
  etage: number | null;
  type_habitation: string | null;
  studio: boolean | null;
  parametres_manquants: string[];
}

export interface FaitsGrille {
  grille_id: string;
  parametres: ParametresFaits;
  logement: { id: string; pieces: PieceFactuelle[] };
  /** Blocs globaux de la Grille, consommés par ETOILYS-437. */
  faits_globaux: Record<string, unknown>;
}

export interface CouchageCatalogue {
  type: CouchageType;
  profil: CouchageProfil;
  nombre_places_initial: number;
  nombre_places_minimum: number;
  pas_nombre_places: number;
  dimensions_libres: boolean;
  formats: { largeur_cm: number; longueur_cm: number }[];
}

export interface CatalogueFaits {
  types_pieces: FactuellePieceType[];
  couchages: CouchageCatalogue[];
  protections_sanitaires: SanitaireProtection[];
}

export interface BesoinFait {
  /** Clé opaque : jamais analysée par le front. */
  cle: string;
  piece_id: string | null;
  num_critere: number | null;
  champ: string;
  categories_utilisatrices: string[];
  destination: 'PARAMETRES' | 'PIECE' | 'GRILLE';
  actions: string[];
  manquant: boolean;
}

export interface SurfacesFactuelles {
  categorie: string | null;
  nombre_pieces_habitation: number | null;
  surface_totale: number | null;
  nombre_couchages: number | null;
  minimum_global: number | null;
  minimum_global_atteint: boolean | null;
  diagnostic_moyenne_surface: {
    applicable: boolean | null;
    piece_ids: (string | null)[];
    surface_moyenne: number | null;
    minimum_moyen: number | null;
    atteint: boolean | null;
  } | null;
  minima_locaux: {
    piece_id: string | null;
    applicable: boolean | null;
    surface: number | null;
    minimum: number | null;
    atteint: boolean | null;
  }[];
  qualifications_pieces: {
    piece_id: string | null;
    surface: number | null;
    seuil_surface: number | null;
    seuil_atteint: boolean | null;
    ouvrant: boolean | null;
    piece_habitation: boolean | null;
  }[];
}

export interface AlertePieceFactuelle {
  piece_id: string | null;
  code: string;
  message: string;
  categories_concernees: string[];
}

export interface EvaluationFactuelle {
  besoins: BesoinFait[];
  /** Cotations par critère, consommées par ETOILYS-437. */
  criteres: unknown[];
  couchages: { id: string; places_principales: number | null; places_appoint: number | null }[];
  alertes_pieces: AlertePieceFactuelle[];
  /** `null` : récapitulatif indisponible, jamais un total nul. */
  surfaces: SurfacesFactuelles | null;
}

export interface MutationFaits {
  faits: FaitsGrille;
  evaluation: EvaluationFactuelle | null;
  changements_cascade: unknown[];
}

export type FactuellePieceSection = 'interieurs' | 'sanitaires' | 'exterieurs';

/** Navigation vers un champ de Pièces ; `requestId` distingue deux demandes successives identiques. */
export interface FactuellePieceTarget {
  requestId: number;
  piece_id: string | null;
  champ: string;
  num_critere?: number | null;
  section?: FactuellePieceSection;
}

const INVALID_RESPONSE_MESSAGE = 'Réponse API simulateur invalide';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArrayOf<T>(value: unknown, guard: (entry: unknown) => entry is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function isOneOf<T extends string>(values: readonly T[]) {
  return (value: unknown): value is T => typeof value === 'string' && values.includes(value as T);
}

const isFactuellePieceType = isOneOf(FACTUELLE_PIECE_TYPES);
const isCouchageType = isOneOf(COUCHAGE_TYPES);
const isCouchageProfil = isOneOf(COUCHAGE_PROFILS);
const isSanitaireProtection = isOneOf(SANITAIRE_PROTECTIONS);

function isCouchage(value: unknown): value is CouchageFactuel {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isCouchageType(value.type) &&
    (value.profil === null || isCouchageProfil(value.profil)) &&
    isNullableNumber(value.nombre_places) &&
    isNullableNumber(value.largeur_cm) &&
    isNullableNumber(value.longueur_cm)
  );
}

function isPiece(value: unknown): value is PieceFactuelle {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isFactuellePieceType(value.type_piece) &&
    isNullableNumber(value.surface ?? null) &&
    isNullableNumber(value.rang_type ?? null) &&
    isNullableNumber(value.total_places ?? null) &&
    isArrayOf(value.couchages, isCouchage)
  );
}

function normalizePiece(piece: PieceFactuelle): PieceFactuelle {
  return {
    ...piece,
    nom: piece.nom ?? null,
    surface: piece.surface ?? null,
    ouvrant: piece.ouvrant ?? null,
    prise: piece.prise ?? null,
    ventilation: piece.ventilation ?? null,
    commun: piece.commun ?? null,
    inspection: piece.inspection ?? null,
    nombre_oreillers: piece.nombre_oreillers ?? null,
    tous_lits_couette: piece.tous_lits_couette ?? null,
    deux_couvertures_par_lit_sans_couette: piece.deux_couvertures_par_lit_sans_couette ?? null,
    sanitaires: piece.sanitaires ?? null,
    rang_type: piece.rang_type ?? null,
    total_places: piece.total_places ?? null,
  };
}

function parseParametres(value: unknown): ParametresFaits {
  if (!isRecord(value) || value.mode_grille !== 'FACTUELLE') {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  const categorie = value.categorie_demandee ?? null;
  const capacite = value.capacite_accueil ?? null;
  const etage = value.etage ?? null;
  const typeHabitation = value.type_habitation ?? null;
  const studio = value.studio ?? null;
  const manquants = value.parametres_manquants ?? [];
  if (
    !isNullableString(categorie) ||
    !isNullableNumber(capacite) ||
    !isNullableNumber(etage) ||
    !isNullableString(typeHabitation) ||
    !(studio === null || typeof studio === 'boolean') ||
    !isArrayOf(manquants, isString)
  ) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  return {
    ...value,
    mode_grille: 'FACTUELLE',
    categorie_demandee: categorie,
    capacite_accueil: capacite,
    etage,
    type_habitation: typeHabitation,
    studio,
    parametres_manquants: manquants,
  };
}

export function parseFaitsGrille(value: unknown): FaitsGrille {
  const logement = isRecord(value) ? value.logement : undefined;
  if (
    !isRecord(value) ||
    !isString(value.grille_id) ||
    !isRecord(logement) ||
    !isString(logement.id) ||
    !isArrayOf(logement.pieces, isPiece)
  ) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  return {
    ...value,
    grille_id: value.grille_id,
    parametres: parseParametres(value.parametres),
    logement: { ...logement, id: logement.id, pieces: logement.pieces.map(normalizePiece) },
    faits_globaux: isRecord(value.faits_globaux) ? value.faits_globaux : {},
  };
}

function isCouchageCatalogue(value: unknown): value is CouchageCatalogue {
  return (
    isRecord(value) &&
    isCouchageType(value.type) &&
    isCouchageProfil(value.profil) &&
    Number.isInteger(value.nombre_places_initial) &&
    Number.isInteger(value.nombre_places_minimum) &&
    Number.isInteger(value.pas_nombre_places) &&
    (value.pas_nombre_places as number) > 0 &&
    typeof value.dimensions_libres === 'boolean' &&
    isArrayOf(
      value.formats,
      (format): format is { largeur_cm: number; longueur_cm: number } =>
        isRecord(format) &&
        typeof format.largeur_cm === 'number' &&
        typeof format.longueur_cm === 'number'
    )
  );
}

export function parseCatalogueFaits(value: unknown): CatalogueFaits {
  if (
    !isRecord(value) ||
    !Array.isArray(value.types_pieces) ||
    !isArrayOf(value.couchages, isCouchageCatalogue) ||
    !Array.isArray(value.protections_sanitaires)
  ) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  return {
    ...value,
    // WC et types inconnus ne sont pas proposés en FACTUELLE.
    types_pieces: value.types_pieces.filter(isFactuellePieceType),
    couchages: value.couchages,
    protections_sanitaires: value.protections_sanitaires.filter(isSanitaireProtection),
  };
}

function isBesoin(value: unknown): value is BesoinFait {
  return (
    isRecord(value) &&
    isString(value.cle) &&
    isNullableString(value.piece_id ?? null) &&
    isNullableNumber(value.num_critere ?? null) &&
    isString(value.champ) &&
    isArrayOf(value.categories_utilisatrices, isString) &&
    (value.destination === 'PARAMETRES' ||
      value.destination === 'PIECE' ||
      value.destination === 'GRILLE') &&
    typeof value.manquant === 'boolean'
  );
}

function isAlertePiece(value: unknown): value is AlertePieceFactuelle {
  return (
    isRecord(value) &&
    isNullableString(value.piece_id ?? null) &&
    isString(value.code) &&
    isString(value.message) &&
    isArrayOf(value.categories_concernees, isString)
  );
}

function isSurfaces(value: unknown): value is SurfacesFactuelles {
  return (
    isRecord(value) &&
    isNullableString(value.categorie ?? null) &&
    Array.isArray(value.minima_locaux) &&
    value.minima_locaux.every(isRecord) &&
    Array.isArray(value.qualifications_pieces) &&
    value.qualifications_pieces.every(isRecord) &&
    (value.diagnostic_moyenne_surface == null ||
      (isRecord(value.diagnostic_moyenne_surface) &&
        Array.isArray(value.diagnostic_moyenne_surface.piece_ids)))
  );
}

export function parseEvaluationFactuelle(value: unknown): EvaluationFactuelle {
  const alertes = isRecord(value) ? (value.alertes_pieces ?? []) : undefined;
  const surfaces = isRecord(value) ? (value.surfaces ?? null) : undefined;
  if (
    !isRecord(value) ||
    !isArrayOf(value.besoins, isBesoin) ||
    !isArrayOf(alertes, isAlertePiece) ||
    !(surfaces === null || isSurfaces(surfaces))
  ) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  return {
    ...value,
    besoins: value.besoins.map((besoin) => ({
      ...besoin,
      piece_id: besoin.piece_id ?? null,
      num_critere: besoin.num_critere ?? null,
      actions: Array.isArray(besoin.actions) ? besoin.actions : [],
    })),
    criteres: Array.isArray(value.criteres) ? value.criteres : [],
    couchages: Array.isArray(value.couchages) ? value.couchages : [],
    alertes_pieces: alertes,
    surfaces,
  };
}

export function parseMutationFaits(value: unknown): MutationFaits {
  if (!isRecord(value)) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }

  return {
    ...value,
    faits: parseFaitsGrille(value.faits),
    evaluation: value.evaluation == null ? null : parseEvaluationFactuelle(value.evaluation),
    changements_cascade: Array.isArray(value.changements_cascade) ? value.changements_cascade : [],
  };
}
