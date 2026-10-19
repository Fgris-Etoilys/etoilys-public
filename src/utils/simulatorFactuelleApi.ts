import { encodePathSegment, requestSimulatorJson } from './simulatorApi';
import {
  parseCatalogueFaits,
  parseFaitsGrille,
  parseMutationFaits,
  type CatalogueFaits,
  type FaitsGrille,
  type MutationFaits,
  type PieceFactuelleInput,
} from './simulatorFactuelle.types';

/** Routes publiques FACTUELLE, protégées par le cookie du navigateur propriétaire. */
function faitsEndpoint(simulationId: string, suffix = ''): string {
  return `/public/simulations/${encodePathSegment(simulationId)}/faits${suffix}`;
}

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
