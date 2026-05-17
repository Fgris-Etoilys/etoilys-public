import { getApiUrl, RATE_LIMIT_ERROR_MESSAGE } from './api';
import { parseGridSummary, type GridSummary } from '../content/simulatorGrid';

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type RequestedCategory = '1*' | '2*' | '3*' | '4*' | '5*';
export type HousingType = 'INDIVIDUEL' | 'COLLECTIF';
export type SimulationStatus =
  | 'BROUILLON'
  | 'FAVORABLE'
  | 'DEFAVORABLE'
  | 'A_COMPLETER'
  | 'A_RECALCULER';

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

export type SimulatorApiErrorCode =
  | 'LOGEMENT_NOT_MODIFIABLE'
  | 'PIECE_TYPE_NOT_ALLOWED'
  | 'TOO_MANY_CORRIDORS'
  | 'TOO_MANY_LOGGIAS'
  | 'TOO_MANY_PRIVATE_GARDENS'
  | 'TOO_MANY_PARKS'
  | 'TOO_MANY_PUBLIC_SIMULATIONS'
  | 'INVALID_REQUEST'
  | 'INVALID_STATE'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT';

type SimulatorErrorContext =
  | 'createSimulation'
  | 'deleteSimulation'
  | 'saveParameters'
  | 'calculateResult'
  | 'loadResult'
  | 'savePiece'
  | 'deletePiece';

interface SimulatorApiErrorDetails {
  code?: string | undefined;
  apiMessage?: string | undefined;
  fieldErrors?: Record<string, string> | undefined;
}

export class SimulatorApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly apiMessage: string | undefined;
  readonly fieldErrors: Record<string, string> | undefined;

  constructor(status: number, details: SimulatorApiErrorDetails = {}) {
    super(`Erreur HTTP ${status}`);
    this.name = 'SimulatorApiError';
    this.status = status;
    this.code = details.code;
    this.apiMessage = details.apiMessage;
    this.fieldErrors = details.fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldErrors(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

function parseSimulatorApiErrorDetails(value: unknown): SimulatorApiErrorDetails {
  if (!isRecord(value)) {
    return {};
  }

  return {
    code: typeof value.code === 'string' ? value.code : undefined,
    apiMessage: typeof value.message === 'string' ? value.message : undefined,
    fieldErrors: isFieldErrors(value.fieldErrors) ? value.fieldErrors : undefined,
  };
}

function isSimulationStatus(value: unknown): value is SimulationStatus {
  return (
    value === 'BROUILLON' ||
    value === 'FAVORABLE' ||
    value === 'DEFAVORABLE' ||
    value === 'A_COMPLETER' ||
    value === 'A_RECALCULER'
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

function isPublicSimulationDto(value: unknown): value is PublicSimulationDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.id === undefined || typeof value.id === 'string') &&
    (value.statut === undefined || isSimulationStatus(value.statut)) &&
    (value.date_creation === undefined || typeof value.date_creation === 'string') &&
    (value.date_modification === undefined || typeof value.date_modification === 'string') &&
    (value.grille === undefined || isRecord(value.grille))
  );
}

function parsePublicSimulation(value: unknown): PublicSimulationDto {
  if (!isPublicSimulationDto(value)) {
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

async function readJsonResponseSafe(response: Response): Promise<unknown> {
  try {
    return await readJsonResponse(response);
  } catch {
    return null;
  }
}

function getGenericSimulatorErrorMessage(
  code: string | undefined,
  context: SimulatorErrorContext | undefined,
  fallbackMessage: string
): string {
  switch (code) {
    case 'INVALID_REQUEST':
      return 'Les informations envoyées sont incomplètes ou invalides.';
    case 'INVALID_STATE':
      return 'L’état actuel de la simulation ne permet pas cette action.';
    case 'NOT_FOUND':
      return context === 'deleteSimulation'
        ? 'Cette simulation n’est plus disponible.'
        : 'La simulation demandée n’est plus disponible.';
    case 'UNAUTHORIZED':
    case 'FORBIDDEN':
      return 'Cette action n’est pas autorisée pour cette simulation.';
    case 'CONFLICT':
      if (context === 'savePiece') {
        return 'Une pièce similaire existe déjà ou les informations envoyées sont incomplètes.';
      }
      if (context === 'deletePiece') {
        return 'Cette pièce n’a pas pu être supprimée. Elle est peut-être nécessaire à la simulation.';
      }
      return 'Cette action entre en conflit avec l’état actuel de la simulation.';
    default:
      return fallbackMessage;
  }
}

export function getSimulatorApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
  context?: SimulatorErrorContext
): string {
  if (!(error instanceof SimulatorApiError)) {
    return fallbackMessage;
  }

  if (error.status === 429) {
    return RATE_LIMIT_ERROR_MESSAGE;
  }

  switch (error.code) {
    case 'TOO_MANY_PUBLIC_SIMULATIONS':
      return 'Le nombre maximal de simulations enregistrées sur ce navigateur est atteint. Supprimez une simulation existante avant d’en créer une nouvelle.';
    case 'LOGEMENT_NOT_MODIFIABLE':
      if (context === 'deleteSimulation') {
        return 'Cette simulation ne peut pas être supprimée pour le moment.';
      }
      if (context === 'savePiece' || context === 'deletePiece') {
        return 'Le logement de cette simulation ne peut pas être modifié pour le moment.';
      }
      return 'Cette simulation ne peut pas être modifiée pour le moment.';
    case 'PIECE_TYPE_NOT_ALLOWED':
      return 'Ce type de pièce n’est pas autorisé pour cette simulation.';
    case 'TOO_MANY_CORRIDORS':
      return 'La limite de couloirs et dégagements est déjà atteinte pour cette simulation.';
    case 'TOO_MANY_LOGGIAS':
      return 'La limite de loggias, balcons ou vérandas est déjà atteinte pour cette simulation.';
    case 'TOO_MANY_PRIVATE_GARDENS':
      return 'La limite de terrasses ou jardins privatifs est déjà atteinte pour cette simulation.';
    case 'TOO_MANY_PARKS':
      return 'La limite de parcs ou jardins est déjà atteinte pour cette simulation.';
    default:
      return getGenericSimulatorErrorMessage(error.code, context, fallbackMessage);
  }
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
    const parsedErrorBody = await readJsonResponseSafe(response);
    throw new SimulatorApiError(response.status, parseSimulatorApiErrorDetails(parsedErrorBody));
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
  return requestSimulatorJson<unknown>('/public/simulations', {
    method: 'POST',
    body: {
      categorie_demandee: payload.categorie_demandee,
      capacite_accueil: payload.capacite_accueil,
      etage: payload.etage,
      type_habitation: payload.type_habitation,
    },
  }).then(parsePublicSimulation);
}

export function getPublicSimulation(id: string): Promise<PublicSimulationDto> {
  return requestSimulatorJson<unknown>(`/public/simulations/${encodePathSegment(id)}`).then(
    parsePublicSimulation
  );
}

export function deletePublicSimulation(id: string): Promise<void> {
  return requestSimulatorJson<unknown>(`/public/simulations/${encodePathSegment(id)}`, {
    method: 'DELETE',
  }).then(() => undefined);
}

export async function getSimulationGridModel(): Promise<GridSummary> {
  const parsed = await requestSimulatorJson<unknown>('/public/simulations/modele');
  return parseGridSummary(parsed);
}

export function updateRequestedCategory(
  id: string,
  category: RequestedCategory
): Promise<PublicSimulationDto> {
  return requestSimulatorJson<unknown>(
    `/public/simulations/${encodePathSegment(id)}/classementDemande/${encodePathSegment(category)}`,
    { method: 'PUT' }
  ).then(parsePublicSimulation);
}

export function updateCapacity(id: string, capacity: number): Promise<PublicSimulationDto> {
  return requestSimulatorJson<unknown>(
    `/public/simulations/${encodePathSegment(id)}/capaciteAccueil/${encodePathSegment(capacity)}`,
    { method: 'PUT' }
  ).then(parsePublicSimulation);
}

export function updateFloor(id: string, floor: number): Promise<PublicSimulationDto> {
  return requestSimulatorJson<unknown>(
    `/public/simulations/${encodePathSegment(id)}/etage/${encodePathSegment(floor)}`,
    { method: 'PUT' }
  ).then(parsePublicSimulation);
}

export function updateHousingType(
  id: string,
  housingType: HousingType
): Promise<PublicSimulationDto> {
  return requestSimulatorJson<unknown>(
    `/public/simulations/${encodePathSegment(id)}/typeHabitation/${encodePathSegment(housingType)}`,
    { method: 'PUT' }
  ).then(parsePublicSimulation);
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
