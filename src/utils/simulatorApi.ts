import { getApiUrl } from './api';
import { parseGridSummary, type GridSummary } from '../content/simulatorGrid';

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type RequestedCategory = '1*' | '2*' | '3*' | '4*' | '5*';
export type HousingType = 'INDIVIDUEL' | 'COLLECTIF';
export type SimulationStatus = 'BROUILLON' | 'VERIFICATION_EN_ECHEC' | 'VERIFIEE_CONFORME';

export interface PublicSimulationSummary {
  id: string;
  statut?: SimulationStatus;
  categorie_demandee: string;
  capacite_accueil: number;
  date_modification: string;
}

export interface PublicSimulationCreateRequest {
  categorie_demandee: RequestedCategory;
  capacite_accueil: number;
  etage: number;
  type_habitation: HousingType;
}

export type PieceType =
  | 'CUISINE'
  | 'SEJOUR'
  | 'SALLE_A_MANGER'
  | 'SALON'
  | 'CHAMBRE'
  | 'BUREAU'
  | 'CABINE'
  | 'PIECE_SANS_OUVRANT'
  | 'COULOIRS_ET_DEGAGEMENTS'
  | 'SALLE_DE_BAIN'
  | 'WC'
  | 'LOGGIA_BALCON_VERANDA'
  | 'TERRASSE_OU_JARDIN_PRIVE'
  | 'PARC_OU_JARDIN';

export type BeddingType =
  | 'PAS_DE_LITERIE'
  | 'SIMPLE_FIXE'
  | 'DOUBLE_FIXE'
  | 'TWINS'
  | 'CONVERTIBLE'
  | 'GIGOGNE'
  | 'SUPERPOSEE';

export interface PieceDto {
  id?: string;
  nom?: string;
  type_piece: PieceType;
  surface?: number;
  ouvrant?: boolean;
  prise?: boolean;
  ventilation?: boolean;
  type_literie?: BeddingType | null;
  nombre_lits?: number | null;
  format_lits?: string | null;
  rang_type?: number;
  par_defaut?: boolean;
  literie?: boolean;
  surface_minimum?: number;
  surface_minimum_atteinte?: boolean;
  capacite_lits_atteinte?: boolean;
}

export interface LogementDto {
  id?: string;
  pieces?: PieceDto[];
  nb_pieces_habitation?: number;
  surface_totale?: number;
  surface_totale_minimum?: number;
  surface_totale_majoree?: number;
}

export type CriterionValidationStatus = 'VALIDE' | 'NON_VALIDE' | 'NON_APPLICABLE';
export type CriterionStatus = 'OPTIONNEL' | 'OBLIGATOIRE' | 'ONC' | 'NON_APPLICABLE';

export interface ReponseDto {
  num_critere?: number;
  points_obtenus?: number;
  statut_validation?: CriterionValidationStatus;
  statut_critere?: CriterionStatus;
  commentaire?: string;
  commentaire_obligatoire?: string;
  commentaire_modifie?: string;
}

export interface PublicSimulationResponseRequest {
  num_critere: number;
  statut_validation: CriterionValidationStatus;
}

export interface PublicSimulationGridDto {
  id?: string;
  categorie_demandee?: string;
  capacite_accueil?: number;
  etage?: number;
  type_habitation?: string;
  reponses?: ReponseDto[];
  logement?: LogementDto;
}

export interface PublicSimulationDto {
  id?: string;
  statut?: SimulationStatus;
  date_creation?: string;
  date_modification?: string;
  grille?: PublicSimulationGridDto;
}

export interface CriteriaChecklistDto {
  tous_coches?: boolean;
  criteres_non_coches?: number[];
  nb_criteres?: number;
}

export interface RequiredCommentsDto {
  tous_fournis?: boolean;
  commentaires_obligatoires_non_fournis?: number[];
  nb_commentaires_obligatoires?: number;
}

export interface VerificationDto {
  nb_couchages_suffisants?: boolean;
  salle_de_bain_presente?: boolean;
  criteres_obligatoires_a_cocher?: CriteriaChecklistDto;
  criteres_optionnels_a_cocher?: CriteriaChecklistDto;
  commentaires_obligatoires_a_fournir?: RequiredCommentsDto;
}

export interface RapportProvisoireDto {
  points_totaux_obligatoires?: number;
  points_minimaux_obligatoires?: number;
  points_obligatoires_obtenus?: number;
  points_obligatoires_atteints?: boolean;
  points_obligatoires_a_compenser?: number;
  points_optionnels_disponibles?: number;
  points_optionnels_necessaires?: number;
  points_optionnels_a_atteindre?: number;
  points_optionnels_obtenus?: number;
  points_optionnels_atteints?: boolean;
  resultat?: boolean;
  criteres_obligatoires_non_valides?: number[];
}

export class SimulatorApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Erreur HTTP ${status}`);
    this.name = 'SimulatorApiError';
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSimulationStatus(value: unknown): value is SimulationStatus {
  return (
    value === 'BROUILLON' || value === 'VERIFICATION_EN_ECHEC' || value === 'VERIFIEE_CONFORME'
  );
}

function isPublicSimulationSummary(value: unknown): value is PublicSimulationSummary {
  if (!isRecord(value)) {
    return false;
  }

  const hasValidStatus = value.statut === undefined || isSimulationStatus(value.statut);

  return (
    typeof value.id === 'string' &&
    hasValidStatus &&
    typeof value.categorie_demandee === 'string' &&
    typeof value.capacite_accueil === 'number' &&
    Number.isInteger(value.capacite_accueil) &&
    typeof value.date_modification === 'string'
  );
}

function parsePublicSimulations(value: unknown): PublicSimulationSummary[] {
  if (!Array.isArray(value) || !value.every(isPublicSimulationSummary)) {
    throw new Error('Réponse API simulateur invalide');
  }

  return value;
}

function encodePathSegment(value: string | number): string {
  return encodeURIComponent(String(value));
}

function buildSimulatorUrl(endpoint: string): string {
  return getApiUrl(endpoint);
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const rawText = await response.text();
  if (!rawText.trim()) {
    return null;
  }

  return JSON.parse(rawText) as unknown;
}

async function requestSimulatorJson<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
  } = {}
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' });
  const requestInit: RequestInit = {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers,
  };

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    requestInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(buildSimulatorUrl(endpoint), requestInit);
  if (!response.ok) {
    throw new SimulatorApiError(response.status);
  }

  return (await readJsonResponse(response)) as T;
}

export async function listPublicSimulations(): Promise<PublicSimulationSummary[]> {
  const parsed = await requestSimulatorJson<unknown>('/public/simulations');
  return parsePublicSimulations(parsed);
}

export function createPublicSimulation(
  payload: PublicSimulationCreateRequest
): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>('/public/simulations', {
    method: 'POST',
    body: {
      categorie_demandee: payload.categorie_demandee,
      capacite_accueil: payload.capacite_accueil,
      etage: payload.etage,
      type_habitation: payload.type_habitation,
    },
  });
}

export function getPublicSimulation(id: string): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>(`/public/simulations/${encodePathSegment(id)}`);
}

export async function getSimulationGridModel(): Promise<GridSummary> {
  const parsed = await requestSimulatorJson<unknown>('/public/simulations/modele');
  return parseGridSummary(parsed);
}

export function updateRequestedCategory(
  id: string,
  category: RequestedCategory
): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>(
    `/public/simulations/${encodePathSegment(id)}/classementDemande/${encodePathSegment(category)}`,
    { method: 'PUT' }
  );
}

export function updateCapacity(id: string, capacity: number): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>(
    `/public/simulations/${encodePathSegment(id)}/capaciteAccueil/${encodePathSegment(capacity)}`,
    { method: 'PUT' }
  );
}

export function updateFloor(id: string, floor: number): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>(
    `/public/simulations/${encodePathSegment(id)}/etage/${encodePathSegment(floor)}`,
    { method: 'PUT' }
  );
}

export function updateHousingType(
  id: string,
  housingType: HousingType
): Promise<PublicSimulationDto> {
  return requestSimulatorJson<PublicSimulationDto>(
    `/public/simulations/${encodePathSegment(id)}/typeHabitation/${encodePathSegment(housingType)}`,
    { method: 'PUT' }
  );
}

export function getSimulationLogement(id: string): Promise<LogementDto> {
  return requestSimulatorJson<LogementDto>(`/public/simulations/${encodePathSegment(id)}/logement`);
}

export function createPiece(id: string, payload: PieceDto): Promise<LogementDto> {
  return requestSimulatorJson<LogementDto>(`/public/simulations/${encodePathSegment(id)}/pieces`, {
    method: 'POST',
    body: payload,
  });
}

export function updatePiece(id: string, pieceId: string, payload: PieceDto): Promise<LogementDto> {
  return requestSimulatorJson<LogementDto>(
    `/public/simulations/${encodePathSegment(id)}/pieces/${encodePathSegment(pieceId)}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
}

export function deletePiece(id: string, pieceId: string): Promise<LogementDto> {
  return requestSimulatorJson<LogementDto>(
    `/public/simulations/${encodePathSegment(id)}/pieces/${encodePathSegment(pieceId)}`,
    { method: 'DELETE' }
  );
}

export function submitResponse(
  id: string,
  payload: PublicSimulationResponseRequest
): Promise<ReponseDto> {
  return requestSimulatorJson<ReponseDto>(`/public/simulations/${encodePathSegment(id)}/reponse`, {
    method: 'POST',
    body: {
      num_critere: payload.num_critere,
      statut_validation: payload.statut_validation,
    },
  });
}

export function verifySimulation(id: string): Promise<boolean> {
  return requestSimulatorJson<boolean>(`/public/simulations/${encodePathSegment(id)}/verifier`, {
    method: 'POST',
  });
}

export function getVerification(id: string): Promise<VerificationDto> {
  return requestSimulatorJson<VerificationDto>(
    `/public/simulations/${encodePathSegment(id)}/verification`
  );
}

export function getRapport(id: string): Promise<RapportProvisoireDto> {
  return requestSimulatorJson<RapportProvisoireDto>(
    `/public/simulations/${encodePathSegment(id)}/rapport`
  );
}
