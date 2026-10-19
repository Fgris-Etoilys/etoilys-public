import { PIECE_TYPE_LABELS } from './simulatorLabels';
import { supportsCouchages, type FactuellePieceDraft } from './factuellePieceDraft';
import type {
  BesoinFait,
  CatalogueFaits,
  CouchageProfil,
  CouchageType,
  EvaluationFactuelle,
  FactuellePieceSection,
  FactuellePieceTarget,
  FactuellePieceType,
  InspectionBooleanField,
  PieceFactuelle,
  SanitaireProtection,
  SurfacesFactuelles,
} from './simulatorFactuelle.types';

/** Présentation seulement : aucun verdict ni règle réglementaire n'est calculé ici. */

export const FACTUELLE_SECTIONS: {
  id: FactuellePieceSection;
  label: string;
  shortLabel: string;
}[] = [
  { id: 'interieurs', label: 'Pièces intérieures', shortLabel: 'Intérieur' },
  { id: 'sanitaires', label: 'Salles d’eau', shortLabel: 'Salles d’eau' },
  { id: 'exterieurs', label: 'Extérieurs', shortLabel: 'Extérieur' },
];

export const COUCHAGE_TYPE_LABELS: Record<CouchageType, string> = {
  SIMPLE_FIXE: 'Lit simple fixe',
  DOUBLE_FIXE: 'Lit double fixe',
  TWINS: 'Lits twins',
  CONVERTIBLE: 'Canapé convertible',
  GIGOGNE: 'Gigogne',
  SUPERPOSEE: 'Lits superposés',
  ESCAMOTABLE: 'Lit escamotable',
  AUTRE_APPOINT: 'Autre couchage d’appoint',
};

export const COUCHAGE_PROFIL_LABELS: Record<CouchageProfil, string> = {
  UNE_PLACE: '1 place',
  DEUX_PLACES: '2 places',
};

export const SANITAIRE_PROTECTION_LABELS: Record<SanitaireProtection, string> = {
  CONFORME_SANS_RIDEAU: 'Protection conforme sans rideau',
  RIDEAU_SEUL: 'Rideau seul',
  INSUFFISANTE: 'Protection insuffisante',
};

export const GIGOGNE_HELP =
  'Gigogne désigne uniquement la partie mobile, un couchage d’appoint. Renseignez la partie fixe séparément comme lit simple ou double.';

export const SANITAIRES_ORDER_HELP =
  'L’ordre détermine les salles d’eau utilisées pour certains critères. Placez d’abord celles à prendre en compte. Les sèche-cheveux sont comptés dans tout le logement.';

type InspectionField = Exclude<InspectionBooleanField, 'couchage'>;

/** Libellé, bloc d'affichage et numéro de critère de l'aide existante de chaque constat. */
export const INSPECTION_PRESENTATION: Record<
  InspectionField,
  { label: string; section: 'piece' | 'couchages' | 'sanitaires'; help: number }
> = {
  eclairages_fonctionnent: { label: 'Éclairages en bon état de marche', section: 'piece', help: 4 },
  rangements: { label: 'Placards ou rangements', section: 'piece', help: 23 },
  occultation_opaque: { label: 'Occultation opaque', section: 'couchages', help: 14 },
  double_vitrage: { label: 'Double vitrage', section: 'couchages', help: 15 },
  matelas_haute_densite: { label: 'Matelas haute densité', section: 'couchages', help: 29 },
  aleses_et_taies_oreillers: {
    label: 'Alèses et taies d’oreillers',
    section: 'couchages',
    help: 32,
  },
  eclairage_tete_lit: { label: 'Éclairage en tête de lit', section: 'couchages', help: 33 },
  interrupteur_central_pres_lit: {
    label: 'Interrupteur central près du lit',
    section: 'couchages',
    help: 34,
  },
  prise_libre_pres_lit: { label: 'Prise libre près du lit', section: 'couchages', help: 35 },
  table_chevet: { label: 'Table de chevet', section: 'couchages', help: 36 },
  deux_points_lumineux: { label: 'Deux points lumineux', section: 'sanitaires', help: 46 },
  produits_accueil: { label: 'Produits d’accueil', section: 'sanitaires', help: 47 },
  produits_accueil_ecologiques: {
    label: 'Produits d’accueil écologiques',
    section: 'sanitaires',
    help: 131,
  },
  prise_proche_miroir: { label: 'Prise près du miroir', section: 'sanitaires', help: 48 },
  pateres: { label: 'Patères', section: 'sanitaires', help: 49 },
  seche_serviette_electrique: {
    label: 'Sèche-serviettes électrique',
    section: 'sanitaires',
    help: 50,
  },
  miroir: { label: 'Miroir', section: 'sanitaires', help: 51 },
  tablette_sous_miroir: { label: 'Tablette sous le miroir', section: 'sanitaires', help: 53 },
  rangement_supplementaire: {
    label: 'Rangements supplémentaires',
    section: 'sanitaires',
    help: 54,
  },
};

const INSPECTION_FIELDS = Object.keys(INSPECTION_PRESENTATION) as InspectionField[];
const EXTERIOR_TYPES: readonly FactuellePieceType[] = [
  'LOGGIA_BALCON_VERANDA',
  'TERRASSE_OU_JARDIN_PRIVE',
  'PARC_OU_JARDIN',
];
/** Types limités à un exemplaire par logement (contrat backend). */
const SINGLE_TYPES: readonly FactuellePieceType[] = [...EXTERIOR_TYPES, 'COULOIRS_ET_DEGAGEMENTS'];

export function formatFactuellePieceType(type: FactuellePieceType): string {
  return type === 'SALLE_DE_BAIN' ? 'Salle d’eau' : PIECE_TYPE_LABELS[type];
}

export function getFactuellePieceName(piece: Pick<PieceFactuelle, 'nom' | 'type_piece'>): string {
  return piece.nom?.trim() || formatFactuellePieceType(piece.type_piece);
}

export function factuellePieceSection(type: FactuellePieceType): FactuellePieceSection {
  if (type === 'SALLE_DE_BAIN') {
    return 'sanitaires';
  }

  return EXTERIOR_TYPES.includes(type) ? 'exterieurs' : 'interieurs';
}

/** Types proposés à la création dans une section ; un type unique déjà présent n'est plus proposé. */
export function availableFactuelleTypes(
  catalogue: CatalogueFaits,
  pieces: Pick<PieceFactuelle, 'type_piece'>[],
  section: FactuellePieceSection
): FactuellePieceType[] {
  return catalogue.types_pieces.filter(
    (type) =>
      factuellePieceSection(type) === section &&
      (!SINGLE_TYPES.includes(type) || !pieces.some((piece) => piece.type_piece === type))
  );
}

export function piecesOfSection(
  pieces: PieceFactuelle[],
  section: FactuellePieceSection
): PieceFactuelle[] {
  const sectionPieces = pieces.filter(
    (piece) => factuellePieceSection(piece.type_piece) === section
  );
  return section === 'sanitaires' ? orderedSanitaires(sectionPieces) : sectionPieces;
}

export function pieceNeeds(evaluation: EvaluationFactuelle | null, pieceId: string): BesoinFait[] {
  return (
    evaluation?.besoins.filter(
      (besoin) => besoin.destination === 'PIECE' && besoin.piece_id === pieceId
    ) ?? []
  );
}

/** Complétude issue des besoins backend (union des cinq catégories), distincte de la conformité. */
export function pieceCompletion(
  evaluation: EvaluationFactuelle | null,
  pieceId: string
): 'complete' | 'missing' | 'unavailable' {
  if (!evaluation) {
    return 'unavailable';
  }

  return pieceNeeds(evaluation, pieceId).some((besoin) => besoin.manquant) ? 'missing' : 'complete';
}

/** Alertes backend de la pièce pour la catégorie demandée. */
export function pieceAlerts(
  evaluation: EvaluationFactuelle | null,
  pieceId: string,
  category: string | null
) {
  return (
    evaluation?.alertes_pieces.filter(
      (alerte) =>
        alerte.piece_id === pieceId &&
        category !== null &&
        alerte.categories_concernees.includes(category)
    ) ?? []
  );
}

export function surfacesForCategory(
  evaluation: EvaluationFactuelle | null,
  category: string | null
): SurfacesFactuelles | null {
  const surfaces = evaluation?.surfaces ?? null;
  return surfaces && surfaces.categorie === category ? surfaces : null;
}

const SANITARY_INSPECTION_FIELDS = new Set(
  INSPECTION_FIELDS.filter((field) => INSPECTION_PRESENTATION[field].section === 'sanitaires').map(
    (field) => `inspection.${field}`
  )
);

/** Salle d'eau utilisée par les critères sanitaires de la catégorie demandée, d'après les besoins enregistrés. */
export function sanitaireUsedInGrid(
  evaluation: EvaluationFactuelle | null,
  pieceId: string,
  category: string | null
): boolean | null {
  if (!evaluation || !category) {
    return null;
  }

  return pieceNeeds(evaluation, pieceId).some(
    (besoin) =>
      besoin.categories_utilisatrices.includes(category) &&
      (besoin.champ.startsWith('sanitaires.') || SANITARY_INSPECTION_FIELDS.has(besoin.champ))
  );
}

export function orderedSanitaires(pieces: PieceFactuelle[]): PieceFactuelle[] {
  return pieces
    .filter((piece) => piece.type_piece === 'SALLE_DE_BAIN')
    .sort(
      (first, second) =>
        (first.rang_type ?? Number.MAX_SAFE_INTEGER) - (second.rang_type ?? Number.MAX_SAFE_INTEGER)
    );
}

/** Ordre complet attendu par `PUT /ordre-sanitaires`, ou `null` si le déplacement est impossible. */
export function moveSanitaire(
  pieces: PieceFactuelle[],
  pieceId: string,
  direction: -1 | 1
): string[] | null {
  const ids = orderedSanitaires(pieces).map((piece) => piece.id);
  const from = ids.indexOf(pieceId);
  const to = from + direction;
  const moved = ids[from];
  const replaced = ids[to];
  if (from < 0 || moved === undefined || replaced === undefined) {
    return null;
  }

  ids[from] = replaced;
  ids[to] = moved;
  return ids;
}

/** Champs affichés selon le type et les réponses directes, jamais selon les besoins recalculés. */
export function visibleInspectionFields(
  draft: Pick<FactuellePieceDraft, 'type_piece' | 'couchages'>,
  block: 'piece' | 'couchages'
): InspectionField[] {
  const type = draft.type_piece;
  const sanitary = type === 'SALLE_DE_BAIN';
  return INSPECTION_FIELDS.filter((field) => {
    const section = INSPECTION_PRESENTATION[field].section;
    if (block === 'couchages') {
      return section === 'couchages' && draft.couchages.length > 0;
    }
    if (field === 'eclairages_fonctionnent') {
      return supportsCouchages(type) || type === 'CUISINE' || sanitary;
    }
    if (field === 'rangements') {
      return supportsCouchages(type);
    }
    return section === 'sanitaires' && sanitary;
  });
}

/** Section d'une cible de navigation : celle de la pièce, sinon celle indiquée ou déduite du champ. */
export function sectionForTarget(
  target: FactuellePieceTarget,
  pieces: PieceFactuelle[]
): FactuellePieceSection {
  const piece = pieces.find((candidate) => candidate.id === target.piece_id);
  if (piece) {
    return factuellePieceSection(piece.type_piece);
  }
  if (target.section) {
    return target.section;
  }
  if (
    target.champ.startsWith('sanitaires.') ||
    target.champ === 'inspection.seche_cheveux' ||
    SANITARY_INSPECTION_FIELDS.has(target.champ)
  ) {
    return 'sanitaires';
  }

  return 'interieurs';
}

/** Nom du champ rendu (`data-factuelle-field`) pour un `champ` backend, sans lire la clé opaque `cle`. */
export function resolveFieldAnchor(
  champ: string,
  draft: Pick<FactuellePieceDraft, 'couchages'>
): { field: string; couchageId: string | null } {
  const bedAttribute = ['type', 'profil', 'nombre_places', 'largeur_cm', 'longueur_cm'].find(
    (attribute) => champ === `couchages.${attribute}`
  );
  if (bedAttribute) {
    const row =
      draft.couchages.find((couchage) => {
        const value = couchage[bedAttribute as keyof typeof couchage];
        return value === null || value === '';
      }) ?? draft.couchages[0];
    return row
      ? { field: `couchages.${row.id}.${bedAttribute}`, couchageId: row.id }
      : { field: 'couchages', couchageId: null };
  }
  if (champ === 'couchages' || champ === 'inspection.couchage') {
    return { field: 'couchages', couchageId: null };
  }

  return { field: champ, couchageId: null };
}

/** Repères de navigation calculés à l'ouverture : `missing` (besoin backend manquant) ou `context` (champ ciblé). */
export type FieldHighlights = Readonly<Record<string, 'missing' | 'context'>>;

export function fieldHighlight(
  highlights: FieldHighlights | undefined,
  field: string,
  answered: boolean
): 'missing' | 'context' | undefined {
  const state = highlights?.[field];
  // Le repère rouge disparaît dès qu'une réponse est saisie, y compris Non ou zéro.
  return state === 'missing' && answered ? undefined : state;
}

const formatNumber = (value: number) => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });

/**
 * Alerte de surface d'une carte, uniquement depuis les résultats explicites du backend.
 * L'exclusion des pièces d'habitation prime ; le minimum local est masqué si le plafond de couchages est signalé.
 */
export function pieceSurfaceAlert(
  surfaces: SurfacesFactuelles | null,
  piece: PieceFactuelle,
  hidesLocalMinimum: boolean
): { tone: 'warning' | 'error'; text: string } | null {
  if (!surfaces) {
    return null;
  }

  const hasCouchages = piece.couchages.length > 0 || piece.inspection?.couchage === true;
  const qualification = surfaces.qualifications_pieces.find((entry) => entry.piece_id === piece.id);
  const withoutOpening = hasCouchages && qualification?.ouvrant === false;
  const belowThreshold = qualification?.seuil_atteint === false;
  if (belowThreshold || withoutOpening) {
    const reasons = [
      belowThreshold &&
        (qualification?.seuil_surface == null
          ? 'surface trop faible'
          : `moins de ${formatNumber(qualification.seuil_surface)} m²`),
      withoutOpening && 'sans ouvrant sur l’extérieur',
    ]
      .filter(Boolean)
      .join(' et ');
    const places = piece.total_places;
    const couchages = hasCouchages
      ? places === 1
        ? ' Son couchage n’est pas compté.'
        : ` Ses ${places ? `${places} ` : ''}couchages ne sont pas comptés.`
      : '';
    return {
      tone: 'warning',
      text: `${reasons.charAt(0).toUpperCase()}${reasons.slice(1)} : pas comptée comme pièce d’habitation.${couchages}`,
    };
  }

  const local = hidesLocalMinimum
    ? undefined
    : surfaces.minima_locaux.find(
        (entry) => entry.piece_id === piece.id && entry.applicable !== false
      );
  if (local?.atteint === false) {
    const places = piece.total_places;
    return {
      tone: 'error',
      text: `Surface insuffisante${places ? ` pour ${places} ${places > 1 ? 'personnes' : 'personne'}` : ''}${
        local.minimum === null ? '' : ` · minimum ${formatNumber(local.minimum)} m²`
      }`,
    };
  }

  return null;
}
