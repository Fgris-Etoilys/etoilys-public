import type { SimulationClassementPdfInput } from './simulationClassementPdf.types';
import { supportsCouchages } from './factuellePieceDraft';
import { formatFactuellePieceType } from './factuellePieces';
import type { ReponseDto } from './simulatorApi';
import type { SurfacesFactuelles } from './simulatorFactuelle.types';
import type {
  ComparaisonCategorie,
  ComparaisonFactuelle,
  ReponseComparaison,
} from './simulatorFactuelleResultats.types';
import { formatFloor, formatHousingType, formatRequestedCategory } from './simulatorLabels';
import { formatPdfNumber } from './simulatorPdfShared';

function toReponseDto(reponse: ReponseComparaison): ReponseDto {
  const dto: ReponseDto = {
    num_critere: reponse.num_critere,
    statut_critere: reponse.statut_critere,
  };
  if (reponse.points_obtenus !== null) {
    dto.points_obtenus = reponse.points_obtenus;
  }
  if (
    reponse.statut_validation === 'VALIDE' ||
    reponse.statut_validation === 'NON_VALIDE' ||
    reponse.statut_validation === 'NON_APPLICABLE'
  ) {
    dto.statut_validation = reponse.statut_validation;
  }
  return dto;
}

function formatPieceHabitation(value: boolean | null | undefined): string {
  if (value === undefined) return '-';
  return value === true ? 'Oui' : value === false ? 'Non' : 'À confirmer';
}

/**
 * Entrée PDF d'une catégorie FACTUELLE, figée au clic : titre, modèle, réponses, statuts, points et
 * rapport proviennent de la même entrée de `/comparaison` ; la catégorie demandée reste un paramètre.
 * Couchages déclarés (par pièce) et comptabilisés (pièces d'habitation) : totaux canoniques backend,
 * indépendants des étoiles, sans recalcul local.
 */
export function buildFactuellePdfInput({
  comparaison,
  entry,
  surfaces,
  generatedAt,
  simulationId,
}: {
  comparaison: ComparaisonFactuelle;
  entry: ComparaisonCategorie;
  surfaces: SurfacesFactuelles | null;
  generatedAt: Date;
  simulationId: string;
}): SimulationClassementPdfInput {
  const { parametres, logement } = comparaison.faits;
  const qualifications = new Map(
    (surfaces?.qualifications_pieces ?? []).map((qualification) => [
      qualification.piece_id,
      qualification.piece_habitation,
    ])
  );

  return {
    grid: entry.modele,
    rapport: entry.rapport,
    grille: {
      categorie_demandee: entry.categorie,
      reponses: entry.reponses.map(toReponseDto),
    },
    logement: null,
    // Non lu : les paramètres FACTUELLE ci-dessous remplacent le récapitulatif LEGACY.
    totalSleepingCapacity: 0,
    generatedAt,
    simulationId,
    factuelle: {
      parameters: [
        ['Catégorie demandée', formatRequestedCategory(comparaison.categorie_demandee)],
        ['Type de logement', formatHousingType(parametres.type_habitation ?? undefined)],
        ['Étage', formatFloor(parametres.etage ?? undefined)],
        [
          'Studio',
          parametres.studio === null ? 'Non renseigné' : parametres.studio ? 'Oui' : 'Non',
        ],
        ['Capacité d’accueil', formatPdfNumber(parametres.capacite_accueil, ' pers.')],
        ['Couchages comptabilisés', formatPdfNumber(surfaces?.nombre_couchages)],
        ['Surface totale', formatPdfNumber(comparaison.surface_totale, ' m²')],
        ['Pièces d’habitation', formatPdfNumber(surfaces?.nombre_pieces_habitation)],
      ],
      pieces: logement.pieces.map((piece) => [
        [piece.nom?.trim(), formatFactuellePieceType(piece.type_piece)].filter(Boolean).join('\n'),
        piece.type_piece === 'SALLE_DE_BAIN' ? '-' : formatPdfNumber(piece.surface, ' m²'),
        supportsCouchages(piece.type_piece) ? formatPdfNumber(piece.total_places) : '-',
        formatPieceHabitation(qualifications.get(piece.id)),
      ]),
      oncNonValides: entry.criteres_onc_non_valides,
    },
  };
}
