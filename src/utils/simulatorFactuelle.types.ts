/**
 * Contrats publics FACTUELLE (ETOILYS-430/431/432/443), alignés sur `docs/data/swagger.json`.
 * Les parseurs vérifient la forme utile au front et conservent les champs additifs du serveur.
 */

import type { CriterionStatus } from './simulatorApi';

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

export const TECHNOLOGIES_CUISSON = [
  'INDUCTION',
  'VITROCERAMIQUE',
  'GAZ',
  'ELECTRIQUE_CLASSIQUE',
] as const;
export type TechnologieCuisson = (typeof TECHNOLOGIES_CUISSON)[number];

export const CONFIGURATIONS_FOUR_MICRO_ONDES = [
  'AUCUN',
  'FOUR_SEUL',
  'MICRO_ONDES_SEUL',
  'COMBINE_SEUL',
  'APPAREILS_DISTINCTS',
] as const;
export type ConfigurationFourMicroOndes = (typeof CONFIGURATIONS_FOUR_MICRO_ONDES)[number];

export const CHOIX_COMBINE = ['FOUR', 'MICRO_ONDES'] as const;
export type ChoixCombine = (typeof CHOIX_COMBINE)[number];

export const ETATS_CHAUFFAGE = ['INSTALLATIONS', 'AUCUN', 'MOBILES_UNIQUEMENT'] as const;
export type EtatChauffage = (typeof ETATS_CHAUFFAGE)[number];

export const SITUATIONS_LIVRET_ACCUEIL = [
  'ABSENT',
  'PRESENT_NON_BILINGUE',
  'PRESENT_BILINGUE',
] as const;
export type SituationLivretAccueil = (typeof SITUATIONS_LIVRET_ACCUEIL)[number];

/** C18/C19 : Non (`appreciation_commune: false`), Oui privatif ou Oui commun. */
export interface EquipementCommunFaits {
  appreciation_commune: boolean | null;
  commun: boolean | null;
}

export interface AssisesTableFaits {
  appreciation_commune: boolean | null;
  besoin_assises_sans_dossier: boolean | null;
}

export interface AssisesSalonFaits {
  appreciation_commune: boolean | null;
  assises_uniquement_convertibles: boolean | null;
}

export interface LigneCuissonFaits {
  id: string;
  technologie: TechnologieCuisson | null;
  nombre_foyers: number | null;
}

/** C57/C58 : `presence_plaques: false` avec une liste vide = absence connue. */
export interface CuissonFaits {
  presence_plaques: boolean | null;
  lignes: LigneCuissonFaits[];
}

/** C59/C60 : `appreciation_four` / `appreciation_micro_ondes` sont dépréciés et jamais envoyés. */
export interface FourMicroOndesFaits {
  configuration: ConfigurationFourMicroOndes | null;
  choix_combine: ChoixCombine | null;
}

/** C16 : `appreciation_commune` et `motif_inspection` (BO) ne sont jamais envoyés par le public. */
export interface ChauffageFaits {
  etat: EtatChauffage | null;
  types: string[];
  autre: string | null;
}

export interface MesuresFaits {
  aucune_mesure: boolean | null;
  mesures: string[];
  autres: string[];
}

/** `capacite_constatee` est fixée par le serveur à chaque sauvegarde de C63/C64 (null pour C65). */
export interface InventaireFaits {
  items: Record<string, boolean>;
  capacite_constatee: number | null;
}

export interface LivretAccueilFaits {
  situation: SituationLivretAccueil | null;
}

/** Blocs globaux de la Grille ; un bloc `null` est inconnu, jamais une absence. */
export interface FaitsGlobaux {
  c18: EquipementCommunFaits;
  c19: EquipementCommunFaits;
  c25: AssisesTableFaits;
  c26: AssisesSalonFaits;
  cuisson: CuissonFaits;
  four_micro_ondes: FourMicroOndesFaits;
  chauffage: ChauffageFaits | null;
  mesures_energie: MesuresFaits | null;
  mesures_eau: MesuresFaits | null;
  c63: InventaireFaits | null;
  c64: InventaireFaits | null;
  c65: InventaireFaits | null;
  c101: LivretAccueilFaits;
}

export type BlocGlobal = keyof FaitsGlobaux;

/** Corps des PUT de blocs globaux (`/faits/{bloc}`), chacun remplaçant un seul bloc. */
export interface GlobalBlockPayloads {
  c18: EquipementCommunFaits;
  c19: EquipementCommunFaits;
  c25: AssisesTableFaits;
  c26: AssisesSalonFaits;
  cuisson: CuissonFaits;
  four_micro_ondes: FourMicroOndesFaits;
  chauffage: ChauffageFaits;
  mesures_energie: MesuresFaits;
  mesures_eau: MesuresFaits;
  c63: { items: Record<string, boolean> };
  c64: { items: Record<string, boolean> };
  c65: { items: Record<string, boolean> };
  c101: LivretAccueilFaits;
}

export interface FaitsGrille {
  grille_id: string;
  parametres: ParametresFaits;
  logement: { id: string; pieces: PieceFactuelle[] };
  faits_globaux: FaitsGlobaux;
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

export interface CatalogueOption {
  id: string;
  libelle: string;
}

/** Items d'un inventaire C63/C64/C65 ; minima de la capacité actuelle, null pour C63/C64 sans capacité. */
export interface InventaireCatalogue {
  num_critere: number;
  items: { id: string; libelle: string; groupe: string | null; minimum: number | null }[];
}

export interface CatalogueFaits {
  types_pieces: FactuellePieceType[];
  couchages: CouchageCatalogue[];
  protections_sanitaires: SanitaireProtection[];
  technologies_cuisson: TechnologieCuisson[];
  configurations_four_micro_ondes: ConfigurationFourMicroOndes[];
  /** Listes ordonnées par le backend (énergie : VITRAGE, POMPE_A_CHALEUR, …, ISOLATION). */
  types_chauffage: CatalogueOption[];
  mesures_energie: CatalogueOption[];
  mesures_eau: CatalogueOption[];
  inventaires: InventaireCatalogue[];
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

export const STATUTS_VALIDATION_FACTUELS = [
  'VALIDE',
  'NON_VALIDE',
  'NON_APPLICABLE',
  'JUSTIFICATIF_ATTENDU',
] as const;
export type StatutValidationFactuel = (typeof STATUTS_VALIDATION_FACTUELS)[number];

/** Cotation d'une catégorie : `null` = inconnu, jamais Non ni zéro. */
export interface CotationCategorie {
  categorie: string;
  statut_critere: CriterionStatus;
  points: number | null;
  statut_validation: StatutValidationFactuel | null;
  points_obtenus: number | null;
}

/**
 * Cotation d'un critère. `statut_validation` / `points_obtenus` portent la catégorie demandée ;
 * `reponse_manuelle` vaut `NON_APPLICABLE` quand une dérogation NA d'un automatique est active.
 * Le public ne reçoit aucun commentaire.
 */
export interface CritereFactuel {
  num_critere: number;
  automatique: boolean;
  statut_validation: StatutValidationFactuel | null;
  points_obtenus: number | null;
  reponse_manuelle: StatutValidationFactuel | null;
  justificatif_attendu: boolean;
  source_cascade: number | null;
  categories: CotationCategorie[];
}

export interface EvaluationFactuelle {
  besoins: BesoinFait[];
  criteres: CritereFactuel[];
  couchages: { id: string; places_principales: number | null; places_appoint: number | null }[];
  alertes_pieces: AlertePieceFactuelle[];
  /** `null` : récapitulatif indisponible, jamais un total nul. */
  surfaces: SurfacesFactuelles | null;
}

/** Effet visible d'une cascade C69 → C68 / C90 → C89, à afficher une seule fois après succès. */
export interface ChangementCascade {
  critere_source: number;
  critere_cible: number;
  type: 'VALIDATION' | 'REMISE_A_RENSEIGNER';
  message: string;
}

export interface MutationFaits {
  faits: FaitsGrille;
  evaluation: EvaluationFactuelle | null;
  changements_cascade: ChangementCascade[];
}

export type FactuellePieceSection = 'interieurs' | 'sanitaires' | 'exterieurs';

/** Navigation vers un champ de Pièces ; `requestId` distingue deux demandes successives identiques. */
export interface FactuellePieceTarget {
  requestId: number;
  piece_id: string | null;
  champ: string;
  num_critere?: number | null;
  section?: FactuellePieceSection;
  /** Plusieurs pièces concernées : leur section s'affiche, focus sur la carte, sans fenêtre. */
  cardOnly?: boolean;
}

export const INVALID_RESPONSE_MESSAGE = 'Réponse API simulateur invalide';

export function invalidResponse(): never {
  throw new Error(INVALID_RESPONSE_MESSAGE);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArrayOf<T>(value: unknown, guard: (entry: unknown) => entry is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

export function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function isNullableBoolean(value: unknown): value is boolean | null {
  return value === null || typeof value === 'boolean';
}

export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

export function isOneOf<T extends string>(values: readonly T[]) {
  return (value: unknown): value is T => typeof value === 'string' && values.includes(value as T);
}

const isFactuellePieceType = isOneOf(FACTUELLE_PIECE_TYPES);
const isCouchageType = isOneOf(COUCHAGE_TYPES);
const isCouchageProfil = isOneOf(COUCHAGE_PROFILS);
const isSanitaireProtection = isOneOf(SANITAIRE_PROTECTIONS);
const isTechnologieCuisson = isOneOf(TECHNOLOGIES_CUISSON);
const isConfigurationFourMicroOndes = isOneOf(CONFIGURATIONS_FOUR_MICRO_ONDES);
const isChoixCombine = isOneOf(CHOIX_COMBINE);
const isEtatChauffage = isOneOf(ETATS_CHAUFFAGE);
const isSituationLivretAccueil = isOneOf(SITUATIONS_LIVRET_ACCUEIL);
export const isStatutValidationFactuel = isOneOf(STATUTS_VALIDATION_FACTUELS);
export const isCriterionStatus = isOneOf<CriterionStatus>([
  'OPTIONNEL',
  'OBLIGATOIRE',
  'ONC',
  'NON_APPLICABLE',
]);

/** Valeur nullable : absente ou `null` donne `null`, sinon elle doit satisfaire le garde. */
function nullable<T>(value: unknown, guard: (entry: unknown) => entry is T): T | null {
  const current = value ?? null;
  if (current === null) {
    return null;
  }
  return guard(current) ? current : invalidResponse();
}

function list<T>(value: unknown, guard: (entry: unknown) => entry is T): T[] {
  if (value == null) {
    return [];
  }
  return isArrayOf(value, guard) ? value : invalidResponse();
}

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

/** Bloc de booléens nullable ; un bloc absent est inconnu (toutes les valeurs à `null`). */
function parseBooleanBlock<T extends object>(
  value: unknown,
  keys: readonly (keyof T & string)[]
): T {
  if (value != null && !isRecord(value)) {
    invalidResponse();
  }
  const block: Record<string, unknown> = { ...(value ?? {}) };
  for (const key of keys) {
    block[key] = nullable(block[key], isNullableBoolean);
  }
  return block as T;
}

function isLigneCuisson(value: unknown): value is LigneCuissonFaits {
  return (
    isRecord(value) &&
    isString(value.id) &&
    (value.technologie == null || isTechnologieCuisson(value.technologie)) &&
    isNullableNumber(value.nombre_foyers ?? null)
  );
}

function parseCuisson(value: unknown): CuissonFaits {
  if (value != null && !isRecord(value)) {
    invalidResponse();
  }
  return {
    ...value,
    presence_plaques: nullable(value?.presence_plaques, isNullableBoolean),
    lignes: list(value?.lignes, isLigneCuisson).map((ligne) => ({
      ...ligne,
      technologie: ligne.technologie ?? null,
      nombre_foyers: ligne.nombre_foyers ?? null,
    })),
  };
}

function parseFourMicroOndes(value: unknown): FourMicroOndesFaits {
  if (value != null && !isRecord(value)) {
    invalidResponse();
  }
  return {
    ...value,
    configuration: nullable(value?.configuration, isConfigurationFourMicroOndes),
    choix_combine: nullable(value?.choix_combine, isChoixCombine),
  };
}

function parseChauffage(value: unknown): ChauffageFaits | null {
  if (value == null) {
    return null;
  }
  if (!isRecord(value)) {
    invalidResponse();
  }
  return {
    ...value,
    etat: nullable(value.etat, isEtatChauffage),
    types: list(value.types, isString),
    autre: nullable(value.autre, isString),
  };
}

function parseMesures(value: unknown): MesuresFaits | null {
  if (value == null) {
    return null;
  }
  if (!isRecord(value)) {
    invalidResponse();
  }
  return {
    ...value,
    aucune_mesure: nullable(value.aucune_mesure, isNullableBoolean),
    mesures: list(value.mesures, isString),
    autres: list(value.autres, isString),
  };
}

function parseInventaire(value: unknown): InventaireFaits | null {
  if (value == null) {
    return null;
  }
  const items = isRecord(value) ? value.items : undefined;
  if (
    !isRecord(value) ||
    !isRecord(items) ||
    !Object.values(items).every((entry) => typeof entry === 'boolean')
  ) {
    invalidResponse();
  }
  return {
    ...value,
    items: items as Record<string, boolean>,
    capacite_constatee: nullable(value.capacite_constatee, isInteger),
  };
}

function parseLivretAccueil(value: unknown): LivretAccueilFaits {
  if (value != null && !isRecord(value)) {
    invalidResponse();
  }
  return { ...value, situation: nullable(value?.situation, isSituationLivretAccueil) };
}

/** Blocs globaux ; un bloc absent (backend antérieur) reste inconnu, un type inattendu est refusé. */
export function parseFaitsGlobaux(value: unknown): FaitsGlobaux {
  if (value != null && !isRecord(value)) {
    invalidResponse();
  }
  const globaux = value ?? {};
  return {
    ...globaux,
    c18: parseBooleanBlock<EquipementCommunFaits>(globaux.c18, ['appreciation_commune', 'commun']),
    c19: parseBooleanBlock<EquipementCommunFaits>(globaux.c19, ['appreciation_commune', 'commun']),
    c25: parseBooleanBlock<AssisesTableFaits>(globaux.c25, [
      'appreciation_commune',
      'besoin_assises_sans_dossier',
    ]),
    c26: parseBooleanBlock<AssisesSalonFaits>(globaux.c26, [
      'appreciation_commune',
      'assises_uniquement_convertibles',
    ]),
    cuisson: parseCuisson(globaux.cuisson),
    four_micro_ondes: parseFourMicroOndes(globaux.four_micro_ondes),
    chauffage: parseChauffage(globaux.chauffage),
    mesures_energie: parseMesures(globaux.mesures_energie),
    mesures_eau: parseMesures(globaux.mesures_eau),
    c63: parseInventaire(globaux.c63),
    c64: parseInventaire(globaux.c64),
    c65: parseInventaire(globaux.c65),
    c101: parseLivretAccueil(globaux.c101),
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
    faits_globaux: parseFaitsGlobaux(value.faits_globaux),
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

function isCatalogueOption(value: unknown): value is CatalogueOption {
  return isRecord(value) && isString(value.id) && isString(value.libelle);
}

function isInventaireCatalogue(value: unknown): value is InventaireCatalogue {
  return (
    isRecord(value) &&
    isInteger(value.num_critere) &&
    isArrayOf(
      value.items,
      (item): item is InventaireCatalogue['items'][number] =>
        isRecord(item) &&
        isString(item.id) &&
        isString(item.libelle) &&
        isNullableString(item.groupe ?? null) &&
        isNullableNumber(item.minimum ?? null)
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
    technologies_cuisson: list(value.technologies_cuisson, isString).filter(isTechnologieCuisson),
    configurations_four_micro_ondes: list(value.configurations_four_micro_ondes, isString).filter(
      isConfigurationFourMicroOndes
    ),
    types_chauffage: list(value.types_chauffage, isCatalogueOption),
    mesures_energie: list(value.mesures_energie, isCatalogueOption),
    mesures_eau: list(value.mesures_eau, isCatalogueOption),
    inventaires: list(value.inventaires, isInventaireCatalogue).map((inventaire) => ({
      ...inventaire,
      items: inventaire.items.map((item) => ({
        ...item,
        groupe: item.groupe ?? null,
        minimum: item.minimum ?? null,
      })),
    })),
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

function isCotationCategorie(value: unknown): value is CotationCategorie {
  return (
    isRecord(value) &&
    isString(value.categorie) &&
    isCriterionStatus(value.statut_critere) &&
    isNullableNumber(value.points ?? null) &&
    (value.statut_validation == null || isStatutValidationFactuel(value.statut_validation)) &&
    isNullableNumber(value.points_obtenus ?? null)
  );
}

function parseCritereFactuel(value: unknown): CritereFactuel {
  if (
    !isRecord(value) ||
    !isInteger(value.num_critere) ||
    typeof value.automatique !== 'boolean' ||
    !isArrayOf(value.categories, isCotationCategorie)
  ) {
    invalidResponse();
  }

  return {
    ...value,
    num_critere: value.num_critere,
    automatique: value.automatique,
    statut_validation: nullable(value.statut_validation, isStatutValidationFactuel),
    points_obtenus: nullable(value.points_obtenus, isNullableNumber),
    reponse_manuelle: nullable(value.reponse_manuelle, isStatutValidationFactuel),
    justificatif_attendu: value.justificatif_attendu === true,
    source_cascade: nullable(value.source_cascade, isInteger),
    categories: value.categories.map((categorie) => ({
      ...categorie,
      points: categorie.points ?? null,
      statut_validation: categorie.statut_validation ?? null,
      points_obtenus: categorie.points_obtenus ?? null,
    })),
  };
}

function isChangementCascade(value: unknown): value is ChangementCascade {
  return (
    isRecord(value) &&
    isInteger(value.critere_source) &&
    isInteger(value.critere_cible) &&
    (value.type === 'VALIDATION' || value.type === 'REMISE_A_RENSEIGNER') &&
    isString(value.message)
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
    criteres: (Array.isArray(value.criteres) ? value.criteres : []).map(parseCritereFactuel),
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
    changements_cascade: list(value.changements_cascade, isChangementCascade),
  };
}
