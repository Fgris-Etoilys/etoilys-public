import {
  INSPECTION_BOOLEAN_FIELDS,
  type CatalogueFaits,
  type CouchageCatalogue,
  type CouchageFactuel,
  type CouchageType,
  type EquipementSanitaireFactuel,
  type FactuellePieceType,
  type InspectionFactuelle,
  type PieceFactuelle,
  type PieceFactuelleInput,
  type SanitairesFactuels,
} from './simulatorFactuelle.types';

/** Types admettant des lignes de couchage ; la qualification en pièce d'habitation relève du backend. */
export const COUCHAGE_PIECE_TYPES: readonly FactuellePieceType[] = [
  'SEJOUR',
  'SALLE_A_MANGER',
  'SALON',
  'CHAMBRE',
  'BUREAU',
];

export function supportsCouchages(type: FactuellePieceType): boolean {
  return COUCHAGE_PIECE_TYPES.includes(type);
}

type NumericDraft<T, K extends keyof T> = Omit<T, K> & Record<K, string>;

export interface CouchageDraft extends Omit<
  NumericDraft<CouchageFactuel, 'nombre_places' | 'largeur_cm' | 'longueur_cm'>,
  'type'
> {
  type: CouchageType | null;
  /** Choix local du format (`LxL` ou `libre`), jamais envoyé ; `undefined` pour une ligne relue. */
  format?: string | null;
}

export type EquipementDraft = NumericDraft<
  EquipementSanitaireFactuel,
  'largeur_cm' | 'longueur_cm'
>;

type InspectionBooleanDraft = Omit<InspectionFactuelle, 'couchage' | 'seche_cheveux'>;

export interface FactuellePieceDraft extends Omit<
  PieceFactuelleInput,
  'nom' | 'surface' | 'nombre_oreillers' | 'inspection' | 'sanitaires' | 'couchages'
> {
  nom: string;
  surface: string;
  nombre_oreillers: string;
  inspection: InspectionBooleanDraft & { seche_cheveux: string };
  sanitaires: Omit<SanitairesFactuels, 'douche' | 'baignoire'> & {
    douche: EquipementDraft;
    baignoire: EquipementDraft;
  };
  couchages: CouchageDraft[];
}

export type FactuelleFieldErrors = Record<string, string>;
export type PieceBuildResult =
  | { ok: false; errors: FactuelleFieldErrors }
  | { ok: true; payload: PieceFactuelleInput };

const MAX_INTEGER = 2147483647;
const textNumber = (value: number | null | undefined) => (value == null ? '' : String(value));

function equipementDraft(value?: EquipementSanitaireFactuel | null): EquipementDraft {
  return {
    protection: value?.protection ?? null,
    dimensions_superieures: value?.dimensions_superieures ?? null,
    largeur_cm: textNumber(value?.largeur_cm),
    longueur_cm: textNumber(value?.longueur_cm),
  };
}

/** Brouillon initialisé une fois depuis les faits chargés ; `null`, `false` et `true` sont préservés. */
export function createFactuellePieceDraft(
  type: FactuellePieceType,
  piece?: PieceFactuelle
): FactuellePieceDraft {
  const booleanFields = INSPECTION_BOOLEAN_FIELDS.filter((field) => field !== 'couchage');
  const inspection = Object.fromEntries(
    booleanFields.map((field) => [field, piece?.inspection?.[field] ?? null])
  ) as InspectionBooleanDraft;
  const sanitary = type === 'SALLE_DE_BAIN';

  return {
    nom: piece?.nom ?? '',
    type_piece: type,
    surface: textNumber(piece?.surface),
    ouvrant: piece?.ouvrant ?? null,
    prise: piece?.prise ?? null,
    ventilation: piece?.ventilation ?? null,
    commun: piece?.commun ?? null,
    nombre_oreillers: textNumber(piece?.nombre_oreillers),
    tous_lits_couette: piece?.tous_lits_couette ?? null,
    deux_couvertures_par_lit_sans_couette: piece?.deux_couvertures_par_lit_sans_couette ?? null,
    // Un compteur à zéro est une réponse : la salle d'eau démarre à zéro sèche-cheveux.
    inspection: {
      ...inspection,
      seche_cheveux: textNumber(piece?.inspection?.seche_cheveux ?? (sanitary ? 0 : null)),
    },
    sanitaires: {
      lavabo_eau_chaude: piece?.sanitaires?.lavabo_eau_chaude ?? null,
      presence_douche: piece?.sanitaires?.presence_douche ?? null,
      presence_baignoire_avec_douchette:
        piece?.sanitaires?.presence_baignoire_avec_douchette ?? null,
      baignoire_sabot: piece?.sanitaires?.baignoire_sabot ?? false,
      douche: equipementDraft(piece?.sanitaires?.douche),
      baignoire: equipementDraft(piece?.sanitaires?.baignoire),
    },
    couchages: (piece?.couchages ?? []).map((couchage) => ({
      ...couchage,
      nombre_places: textNumber(couchage.nombre_places),
      largeur_cm: textNumber(couchage.largeur_cm),
      longueur_cm: textNumber(couchage.longueur_cm),
    })),
  };
}

/** Identifiant de ligne attendu par le backend (UUID v4), y compris hors contexte sécurisé. */
export function newCouchageId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function couchageTypes(catalogue: CatalogueFaits): CouchageType[] {
  return Array.from(new Set(catalogue.couchages.map((option) => option.type)));
}

/** Choisir un type réinitialise ses choix dépendants ; profil et places sont préremplis si le type n'a qu'un profil. */
export function withCouchageType(
  id: string,
  type: CouchageType,
  catalogue: CatalogueFaits
): CouchageDraft {
  const options = catalogue.couchages.filter((option) => option.type === type);
  const single = options.length === 1 ? options[0] : undefined;
  return {
    id,
    type,
    profil: single?.profil ?? null,
    nombre_places: single ? String(single.nombre_places_initial) : '',
    largeur_cm: '',
    longueur_cm: '',
    format: null,
  };
}

/** Entrée du catalogue d'une ligne ; un type à profil unique n'attend pas de choix. */
export function couchageOption(
  row: CouchageDraft,
  catalogue: CatalogueFaits
): CouchageCatalogue | undefined {
  const options = catalogue.couchages.filter((option) => option.type === row.type);
  return (
    options.find((option) => option.profil === row.profil) ??
    (row.profil === null && options.length === 1 ? options[0] : undefined)
  );
}

export function formatValue(format: { largeur_cm: number; longueur_cm: number }): string {
  return `${format.largeur_cm}x${format.longueur_cm}`;
}

/** Format affiché : choix local, sinon format standard retrouvé, sinon dimensions libres d'une ligne relue. */
export function couchageFormatChoice(
  row: CouchageDraft,
  option: CouchageCatalogue | undefined
): string {
  if (row.format !== undefined) {
    return row.format ?? '';
  }

  const current = option?.formats.find(
    (format) =>
      String(format.largeur_cm) === row.largeur_cm && String(format.longueur_cm) === row.longueur_cm
  );
  if (current) {
    return formatValue(current);
  }

  return row.largeur_cm || row.longueur_cm ? 'libre' : '';
}

type NumericOptions = {
  required?: string | undefined;
  integer?: boolean | undefined;
  positive?: boolean | undefined;
};

function parseNumeric(
  errors: FactuelleFieldErrors,
  raw: string,
  field: string,
  options: NumericOptions = {}
): number | null {
  if (!raw.trim()) {
    if (options.required) {
      errors[field] = options.required;
    }
    return null;
  }

  const value = Number(raw.replace(',', '.'));
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    (options.positive && value === 0) ||
    (options.integer && (!Number.isSafeInteger(value) || value > MAX_INTEGER))
  ) {
    errors[field] = options.integer
      ? 'Renseignez un nombre entier valide.'
      : 'Renseignez une valeur valide.';
    return null;
  }

  return value;
}

/** Une ligne de couchage est toujours complète : type, profil, places, largeur et longueur. */
export function buildFactuelleCouchage(
  row: CouchageDraft,
  catalogue: CatalogueFaits
): { couchage: CouchageFactuel | null; errors: FactuelleFieldErrors } {
  const errors: FactuelleFieldErrors = {};
  const field = `couchages.${row.id}`;
  if (row.type === null || !catalogue.couchages.some((option) => option.type === row.type)) {
    errors[`${field}.type`] = 'Choisissez un type de couchage.';
    return { couchage: null, errors };
  }

  const option = couchageOption(row, catalogue);
  if (!option) {
    errors[`${field}.profil`] = 'Choisissez un profil.';
    return { couchage: null, errors };
  }

  const places = parseNumeric(errors, row.nombre_places, `${field}.nombre_places`, {
    integer: true,
    positive: true,
    required: 'Renseignez le nombre de couchages.',
  });
  if (
    places !== null &&
    (places < option.nombre_places_minimum ||
      (places - option.nombre_places_minimum) % option.pas_nombre_places !== 0)
  ) {
    errors[`${field}.nombre_places`] =
      `Minimum ${option.nombre_places_minimum}, par pas de ${option.pas_nombre_places}.`;
  }

  const free = couchageFormatChoice(row, option) === 'libre' && option.dimensions_libres;
  const largeur = parseNumeric(errors, row.largeur_cm, `${field}.largeur_cm`, {
    positive: true,
    required: free ? 'Renseignez la largeur.' : undefined,
  });
  const longueur = parseNumeric(errors, row.longueur_cm, `${field}.longueur_cm`, {
    positive: true,
    required: free ? 'Renseignez la longueur.' : undefined,
  });
  if (!free && (!row.largeur_cm.trim() || !row.longueur_cm.trim())) {
    errors[`${field}.largeur_cm`] ??= 'Choisissez un format.';
  }
  if (
    !option.dimensions_libres &&
    largeur !== null &&
    longueur !== null &&
    !option.formats.some(
      (format) => format.largeur_cm === largeur && format.longueur_cm === longueur
    )
  ) {
    errors[`${field}.largeur_cm`] = 'Choisissez un format proposé.';
  }

  return {
    couchage: {
      id: row.id,
      type: option.type,
      profil: option.profil,
      nombre_places: places,
      largeur_cm: largeur,
      longueur_cm: longueur,
    },
    errors,
  };
}

/**
 * Payload complet POST/PUT. Tous les couchages saisis sont transmis, même hors pièce d'habitation :
 * leur prise en compte relève du backend. Seuls les couchages et les douche/baignoire présentes
 * doivent être complets ; les autres faits se sauvegardent partiellement.
 */
export function buildFactuellePieceInput(
  draft: FactuellePieceDraft,
  catalogue: CatalogueFaits
): PieceBuildResult {
  const errors: FactuelleFieldErrors = {};
  const numeric = (raw: string, field: string, options?: NumericOptions) =>
    parseNumeric(errors, raw, field, options);
  const sanitary = draft.type_piece === 'SALLE_DE_BAIN';

  if (!catalogue.types_pieces.includes(draft.type_piece)) {
    errors.type_piece = 'Choisissez un type de pièce.';
  }
  if (draft.nom.trim().length > 255) {
    errors.nom = 'Le nom est limité à 255 caractères.';
  }
  if (draft.couchages.length > 0 && !supportsCouchages(draft.type_piece)) {
    errors.couchages =
      'Ce type de pièce ne peut pas contenir de couchages. Changez le type ou retirez les couchages.';
  }

  const surface = sanitary
    ? 0
    : numeric(draft.surface, 'surface', { required: 'Renseignez la surface.' });
  const couchages = draft.couchages.flatMap((row) => {
    const built = buildFactuelleCouchage(row, catalogue);
    Object.assign(errors, built.errors);
    return built.couchage ? [built.couchage] : [];
  });
  if (
    couchages.reduce((total, couchage) => total + (couchage.nombre_places ?? 0), 0) > MAX_INTEGER
  ) {
    errors.couchages = 'Le total des couchages est trop élevé.';
  }

  // Une configuration identique se saisit sur une seule ligne ; aucune fusion implicite.
  const configurations = new Set<string>();
  for (const couchage of couchages) {
    if (couchage.profil === null || couchage.largeur_cm === null || couchage.longueur_cm === null) {
      continue;
    }
    const key = `${couchage.type}:${couchage.profil}:${couchage.largeur_cm}:${couchage.longueur_cm}`;
    if (configurations.has(key)) {
      errors[`couchages.${couchage.id}.nombre_places`] =
        'Regroupez ces couchages sur la même ligne.';
    }
    configurations.add(key);
  }

  function equipment(
    value: EquipementDraft,
    field: string,
    present: boolean | null
  ): EquipementSanitaireFactuel {
    if (present === true && value.protection === null) {
      errors[`${field}.protection`] = 'Choisissez une protection.';
    }
    if (present === true && value.dimensions_superieures === null) {
      errors[`${field}.dimensions_superieures`] = 'Indiquez si les dimensions sont supérieures.';
    }
    const measured = present === true && value.dimensions_superieures === true;
    return {
      protection: value.protection,
      dimensions_superieures: value.dimensions_superieures,
      largeur_cm: numeric(value.largeur_cm, `${field}.largeur_cm`, {
        positive: true,
        required: measured ? 'Renseignez la largeur.' : undefined,
      }),
      longueur_cm: numeric(value.longueur_cm, `${field}.longueur_cm`, {
        positive: true,
        required: measured ? 'Renseignez la longueur.' : undefined,
      }),
    };
  }

  const sanitaires = sanitary
    ? {
        ...draft.sanitaires,
        douche: equipment(
          draft.sanitaires.douche,
          'sanitaires.douche',
          draft.sanitaires.presence_douche
        ),
        baignoire: equipment(
          draft.sanitaires.baignoire,
          'sanitaires.baignoire',
          draft.sanitaires.presence_baignoire_avec_douchette
        ),
      }
    : null;
  const inspection: InspectionFactuelle = {
    ...draft.inspection,
    couchage: couchages.length > 0,
    seche_cheveux: numeric(draft.inspection.seche_cheveux, 'inspection.seche_cheveux', {
      integer: true,
    }),
  };
  const payload: PieceFactuelleInput = {
    nom: draft.nom.trim() || null,
    type_piece: draft.type_piece,
    surface,
    ouvrant: draft.ouvrant,
    prise: draft.prise,
    ventilation: draft.ventilation,
    commun: draft.type_piece === 'PARC_OU_JARDIN' ? draft.commun : null,
    inspection,
    nombre_oreillers: numeric(draft.nombre_oreillers, 'nombre_oreillers', { integer: true }),
    tous_lits_couette: draft.tous_lits_couette,
    deux_couvertures_par_lit_sans_couette: draft.deux_couvertures_par_lit_sans_couette,
    sanitaires,
    couchages,
  };

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, payload };
}

/**
 * Rattache les `fieldErrors` backend (chemins Java camelCase, ex. `couchages[0].nombrePlaces`)
 * aux champs du formulaire ; l'index d'une ligne de couchage est résolu par le payload envoyé.
 */
export function mapServerFieldErrors(
  fieldErrors: Record<string, string> | undefined,
  payload: PieceFactuelleInput
): FactuelleFieldErrors {
  const errors: FactuelleFieldErrors = {};
  for (const [path, message] of Object.entries(fieldErrors ?? {})) {
    const field = path
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^couchages\[(\d+)\]/, (_, index: string) => {
        const id = payload.couchages[Number(index)]?.id;
        return id ? `couchages.${id}` : 'couchages';
      });
    errors[field] = message;
  }
  return errors;
}

/**
 * Avertissement informatif : dimensions déclarées supérieures mais mesures au plus égales au seuil
 * (douche > 6 400 cm², baignoire > 12 750 cm²). Le backend décide de la cotation.
 */
export function sanitaryDimensionsUnconfirmed(
  equipment: EquipementDraft,
  kind: 'douche' | 'baignoire'
): boolean {
  if (equipment.dimensions_superieures !== true) {
    return false;
  }

  const width = Number(equipment.largeur_cm.replace(',', '.'));
  const length = Number(equipment.longueur_cm.replace(',', '.'));
  if (
    !equipment.largeur_cm.trim() ||
    !equipment.longueur_cm.trim() ||
    !Number.isFinite(width) ||
    !Number.isFinite(length) ||
    width <= 0 ||
    length <= 0
  ) {
    return false;
  }

  return width * length <= (kind === 'douche' ? 6400 : 12750);
}
