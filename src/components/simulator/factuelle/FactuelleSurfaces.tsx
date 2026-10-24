import { AlertCircle } from 'lucide-react';
import { getFactuellePieceName } from '../../../utils/factuellePieces';
import type { PieceFactuelle, SurfacesFactuelles } from '../../../utils/simulatorFactuelle.types';

const formatNumber = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
const formatSurface = (value: number | null) =>
  value === null ? '—' : `${formatNumber(value)} m²`;

/** Récapitulatif canonique `evaluation.surfaces` ; aucune valeur n'est recalculée ici. */
export function FactuelleSurfaceSummary({
  surfaces,
  capacity,
}: {
  surfaces: SurfacesFactuelles | null;
  capacity: number | null;
}) {
  const insufficient = surfaces?.minimum_global_atteint === false;

  return (
    <section className="classement-home-summary" aria-label="Résumé du logement">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted">Surface totale</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatSurface(surfaces?.surface_totale ?? null)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Surface minimum</p>
          <p
            className={`mt-1 text-sm font-semibold ${insufficient ? 'text-alert-400' : 'text-gray-900'}`}
          >
            {formatSurface(surfaces?.minimum_global ?? null)}
            {insufficient && <span className="sr-only"> (non atteinte)</span>}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Pièces d’habitation</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {surfaces?.nombre_pieces_habitation ?? '—'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted">Couchages comptés</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {surfaces?.nombre_couchages ?? '—'}
            {capacity !== null && (
              <span className="font-normal text-muted"> / capacité {capacity}</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Diagnostic collectif (moyenne des pièces d'habitation) : jamais présenté comme un minimum individuel. */
export function FactuelleSurfaceGroup({
  surfaces,
  pieces,
}: {
  surfaces: SurfacesFactuelles | null;
  pieces: PieceFactuelle[];
}) {
  const diagnostic = surfaces?.diagnostic_moyenne_surface;
  if (!diagnostic || diagnostic.applicable === false || diagnostic.atteint === true) {
    return null;
  }

  const insufficient = diagnostic.atteint === false;
  const average =
    diagnostic.surface_moyenne === null ? null : formatSurface(diagnostic.surface_moyenne);
  const minimum =
    diagnostic.minimum_moyen === null ? null : formatSurface(diagnostic.minimum_moyen);
  const detail =
    insufficient && minimum ? `${average ?? '—'} pour un minimum de ${minimum}` : average;
  const members = diagnostic.piece_ids.map((id, index) => {
    const piece = pieces.find((candidate) => candidate.id === id);
    return { key: id ?? `inconnue-${index}`, name: piece ? getFactuellePieceName(piece) : 'Pièce' };
  });

  return (
    <div
      className={insufficient ? 'factuelle-message-error' : 'factuelle-message-warning'}
      role="status"
    >
      <p className="flex items-start gap-2">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">
            {insufficient ? 'Surface moyenne insuffisante' : 'Surface moyenne à compléter'}
          </span>
          {detail ? ` : ${detail}` : ''}
        </span>
      </p>
      {members.length > 0 && (
        <p className="mt-2 text-xs">
          Pièces concernées : {members.map((member) => member.name).join(', ')}
        </p>
      )}
    </div>
  );
}
