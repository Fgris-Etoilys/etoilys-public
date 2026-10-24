import { encodePathSegment, requestSimulatorJson } from './simulatorApi';
import {
  parseCatalogueFaits,
  parseFaitsGrille,
  parseMutationFaits,
  type BlocGlobal,
  type CatalogueFaits,
  type FaitsGrille,
  type GlobalBlockPayloads,
  type MutationFaits,
  type PieceFactuelleInput,
} from './simulatorFactuelle.types';
import {
  parseComparaisonFactuelle,
  parseVerificationFactuelle,
  type ComparaisonFactuelle,
  type VerificationFactuelle,
} from './simulatorFactuelleResultats.types';

/** Routes publiques FACTUELLE, protégées par le cookie du navigateur propriétaire. */
function simulationEndpoint(simulationId: string, suffix: string): string {
  return `/public/simulations/${encodePathSegment(simulationId)}${suffix}`;
}

function faitsEndpoint(simulationId: string, suffix = ''): string {
  return simulationEndpoint(simulationId, `/faits${suffix}`);
}

const GLOBAL_BLOCK_ROUTES: Record<BlocGlobal, string> = {
  c18: '/c18',
  c19: '/c19',
  c25: '/c25',
  c26: '/c26',
  c101: '/c101',
  cuisson: '/cuisson',
  four_micro_ondes: '/four-micro-ondes',
  chauffage: '/chauffage',
  mesures_energie: '/mesures-energie',
  mesures_eau: '/mesures-eau',
  c63: '/inventaires/63',
  c64: '/inventaires/64',
  c65: '/inventaires/65',
};

/** Statut accepté par la route de réponse : `null` retire la réponse ou la dérogation NA. */
export type FactuelleAnswer = 'VALIDE' | 'NON_VALIDE' | 'NON_APPLICABLE' | null;

export function getFaits(simulationId: string): Promise<FaitsGrille> {
  return requestSimulatorJson<unknown>(faitsEndpoint(simulationId)).then(parseFaitsGrille);
}

export function getFaitsCatalogue(simulationId: string): Promise<CatalogueFaits> {
  return requestSimulatorJson<unknown>(faitsEndpoint(simulationId, '/catalogue')).then(
    parseCatalogueFaits
  );
}

export function createFactuellePiece(
  simulationId: string,
  payload: PieceFactuelleInput
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(faitsEndpoint(simulationId, '/pieces'), {
    method: 'POST',
    body: payload,
  }).then(parseMutationFaits);
}

export function updateFactuellePiece(
  simulationId: string,
  pieceId: string,
  payload: PieceFactuelleInput
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(
    faitsEndpoint(simulationId, `/pieces/${encodePathSegment(pieceId)}`),
    { method: 'PUT', body: payload }
  ).then(parseMutationFaits);
}

export function deleteFactuellePiece(
  simulationId: string,
  pieceId: string
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(
    faitsEndpoint(simulationId, `/pieces/${encodePathSegment(pieceId)}`),
    { method: 'DELETE' }
  ).then(parseMutationFaits);
}

/** La liste doit contenir toutes les salles d'eau, chacune une seule fois. */
export function reorderSanitaires(
  simulationId: string,
  pieceIds: string[]
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(faitsEndpoint(simulationId, '/ordre-sanitaires'), {
    method: 'PUT',
    body: { piece_ids: pieceIds },
  }).then(parseMutationFaits);
}

/** Réponse manuelle d'un critère, ou dérogation NA d'un automatique C15/C16/C19/C26. */
export function answerCriterion(
  simulationId: string,
  criterionNumber: number,
  answer: FactuelleAnswer
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(
    faitsEndpoint(simulationId, `/criteres/${encodePathSegment(criterionNumber)}/reponse`),
    { method: 'PUT', body: { statut_validation: answer } }
  ).then(parseMutationFaits);
}

/** Remplace un seul bloc de faits globaux ; les autres restent inchangés. */
export function saveGlobalBlock<B extends BlocGlobal>(
  simulationId: string,
  bloc: B,
  payload: GlobalBlockPayloads[B]
): Promise<MutationFaits> {
  return requestSimulatorJson<unknown>(faitsEndpoint(simulationId, GLOBAL_BLOCK_ROUTES[bloc]), {
    method: 'PUT',
    body: payload,
  }).then(parseMutationFaits);
}

/** Diagnostic global, disponible même avec des paramètres incomplets ; aucune écriture. */
export function getFactuelleVerification(simulationId: string): Promise<VerificationFactuelle> {
  return requestSimulatorJson<unknown>(simulationEndpoint(simulationId, '/verification')).then(
    parseVerificationFactuelle
  );
}

/** Cinq rapports 1★–5★ après réussite du contrôle global ; lecture sans mutation. */
export function getComparaison(simulationId: string): Promise<ComparaisonFactuelle> {
  return requestSimulatorJson<unknown>(simulationEndpoint(simulationId, '/comparaison')).then(
    parseComparaisonFactuelle
  );
}
