import type {
  AssisesSalonFaits,
  AssisesTableFaits,
  BlocGlobal,
  CatalogueFaits,
  ChauffageFaits,
  EquipementCommunFaits,
  FaitsGlobaux,
  FourMicroOndesFaits,
  GlobalBlockPayloads,
  InventaireCatalogue,
  LivretAccueilFaits,
  MesuresFaits,
  TechnologieCuisson,
} from './simulatorFactuelle.types';

/**
 * Brouillons locaux des modales de faits globaux : initialisés depuis les faits enregistrés,
 * modifiés sans réseau, convertis en un seul corps de PUT. Aucune cotation n'est calculée ici.
 */

export interface LigneCuissonDraft {
  id: string;
  technologie: TechnologieCuisson | null;
  nombre: string;
}

export interface CuissonDraft {
  presence: boolean | null;
  lignes: LigneCuissonDraft[];
}

export interface MesuresDraft {
  aucune: boolean;
  mesures: string[];
  autresOuvert: boolean;
  autres: string[];
}

export interface GlobalDrafts {
  c18: EquipementCommunFaits;
  c19: EquipementCommunFaits;
  c25: AssisesTableFaits;
  c26: AssisesSalonFaits;
  c101: LivretAccueilFaits;
  cuisson: CuissonDraft;
  four_micro_ondes: FourMicroOndesFaits;
  chauffage: ChauffageFaits;
  mesures_energie: MesuresDraft;
  mesures_eau: MesuresDraft;
  c63: Record<string, boolean>;
  c64: Record<string, boolean>;
  c65: Record<string, boolean>;
}

export type GlobalDraft = { [B in BlocGlobal]: { bloc: B; value: GlobalDrafts[B] } }[BlocGlobal];

export type GlobalPayload = {
  [B in BlocGlobal]: { bloc: B; payload: GlobalBlockPayloads[B] };
}[BlocGlobal];

export type GlobalDraftResult =
  | ({ ok: true } & GlobalPayload)
  | { ok: false; errors: Record<string, string> };

export const COMMUN_CHOICES = [
  { value: 'non', label: 'Non' },
  { value: 'privatif', label: 'Oui, privatif' },
  { value: 'commun', label: 'Oui, commun' },
] as const;
export type CommunChoice = (typeof COMMUN_CHOICES)[number]['value'];

export const LIVRET_ACCUEIL_LABELS = {
  ABSENT: 'Absent',
  PRESENT_NON_BILINGUE: 'Présent, non bilingue',
  PRESENT_BILINGUE: 'Présent, bilingue',
} as const;

export const TECHNOLOGIE_CUISSON_LABELS: Record<TechnologieCuisson, string> = {
  INDUCTION: 'Induction',
  VITROCERAMIQUE: 'Vitrocéramique',
  GAZ: 'Gaz',
  ELECTRIQUE_CLASSIQUE: 'Électrique classique',
};

export const CONFIGURATION_FOUR_LABELS: Record<
  NonNullable<FourMicroOndesFaits['configuration']>,
  string
> = {
  AUCUN: 'Aucun appareil',
  FOUR_SEUL: 'Four seul',
  MICRO_ONDES_SEUL: 'Micro-ondes seul',
  COMBINE_SEUL: 'Combiné seul',
  APPAREILS_DISTINCTS: 'Appareils distincts',
};

export const COMBINE_HELP =
  'À partir de 3★, un appareil combiné compte pour un seul de ces deux équipements.';

export function communChoice(value: EquipementCommunFaits): CommunChoice | null {
  if (value.appreciation_commune === false) {
    return 'non';
  }
  if (value.appreciation_commune === true && value.commun !== null) {
    return value.commun ? 'commun' : 'privatif';
  }
  return null;
}

export function communFromChoice(choice: CommunChoice | null): EquipementCommunFaits {
  if (choice === null) {
    return { appreciation_commune: null, commun: null };
  }
  return choice === 'non'
    ? { appreciation_commune: false, commun: null }
    : { appreciation_commune: true, commun: choice === 'commun' };
}

/** « 8 verres à eau » : minimum exigé du catalogue puis libellé. */
export function inventaireLabel(item: InventaireCatalogue['items'][number]): string {
  return item.minimum === null
    ? item.libelle
    : `${item.minimum} ${item.libelle.charAt(0).toLocaleLowerCase('fr-FR')}${item.libelle.slice(1)}`;
}

/** Groupes consécutifs du catalogue, dans son ordre (C65 : Cuisson, Préparation, Petits ustensiles). */
export function inventaireGroups(items: InventaireCatalogue['items']) {
  return items.reduce<{ groupe: string | null; items: InventaireCatalogue['items'] }[]>(
    (groups, item) => {
      const last = groups[groups.length - 1];
      if (last && last.groupe === item.groupe) {
        last.items.push(item);
      } else {
        groups.push({ groupe: item.groupe, items: [item] });
      }
      return groups;
    },
    []
  );
}

export function inventaireCatalogue(
  catalogue: CatalogueFaits,
  bloc: 'c63' | 'c64' | 'c65'
): InventaireCatalogue | undefined {
  const numero = Number(bloc.slice(1));
  return catalogue.inventaires.find((inventaire) => inventaire.num_critere === numero);
}

function newLineId(): string {
  return crypto.randomUUID();
}

export function emptyCuissonLine(): LigneCuissonDraft {
  return { id: newLineId(), technologie: null, nombre: '' };
}

function mesuresDraft(value: FaitsGlobaux['mesures_energie']): MesuresDraft {
  return {
    aucune: value?.aucune_mesure === true,
    mesures: value?.mesures ?? [],
    autresOuvert: (value?.autres.length ?? 0) > 0,
    autres: value?.autres ?? [],
  };
}

/** Brouillon fidèle aux faits enregistrés ; aucun état initial n'est inventé. */
export function createGlobalDraft(bloc: BlocGlobal, globaux: FaitsGlobaux): GlobalDraft {
  switch (bloc) {
    case 'c18':
    case 'c19':
      return { bloc, value: { ...globaux[bloc] } };
    case 'c25':
      return { bloc, value: { ...globaux.c25 } };
    case 'c26':
      return { bloc, value: { ...globaux.c26 } };
    case 'c101':
      return { bloc, value: { situation: globaux.c101.situation } };
    case 'cuisson':
      return {
        bloc,
        value: {
          presence: globaux.cuisson.presence_plaques,
          lignes: globaux.cuisson.lignes.map((ligne) => ({
            id: ligne.id,
            technologie: ligne.technologie,
            nombre: ligne.nombre_foyers === null ? '' : String(ligne.nombre_foyers),
          })),
        },
      };
    case 'four_micro_ondes':
      return {
        bloc,
        value: {
          configuration: globaux.four_micro_ondes.configuration,
          choix_combine: globaux.four_micro_ondes.choix_combine,
        },
      };
    case 'chauffage':
      return {
        bloc,
        value: {
          etat: globaux.chauffage?.etat ?? null,
          types: globaux.chauffage?.types ?? [],
          autre: globaux.chauffage?.autre ?? null,
        },
      };
    case 'mesures_energie':
    case 'mesures_eau':
      return { bloc, value: mesuresDraft(globaux[bloc]) };
    case 'c63':
    case 'c64':
    case 'c65':
      return { bloc, value: { ...(globaux[bloc]?.items ?? {}) } };
  }
}

function catalogueOrder(selected: string[], order: { id: string }[]): string[] {
  return order.map((option) => option.id).filter((id) => selected.includes(id));
}

function mesuresResult(
  bloc: 'mesures_energie' | 'mesures_eau',
  value: MesuresDraft,
  order: { id: string }[]
): GlobalDraftResult {
  const selected = value.aucune ? [] : catalogueOrder(value.mesures, order);
  const lines = value.aucune || !value.autresOuvert ? [] : value.autres.map((line) => line.trim());
  const errors = Object.fromEntries(
    lines.flatMap((line, index) => (line ? [] : [[`${bloc}.autres.${index}`, AUTRE_MESURE_VIDE]]))
  );
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  const payload: MesuresFaits = {
    // Non renseigné ≠ zéro : sans sélection ni « Aucune mesure », le constat reste inconnu.
    aucune_mesure: value.aucune ? true : selected.length > 0 || lines.length > 0 ? false : null,
    mesures: selected,
    autres: lines,
  };
  return { ok: true, bloc, payload };
}

/** Toutes les cases du catalogue : une case décochée est une réponse négative connue. */
function inventairePayload(
  items: Record<string, boolean>,
  inventaire: InventaireCatalogue | undefined
): { items: Record<string, boolean> } | null {
  return inventaire
    ? {
        items: Object.fromEntries(
          inventaire.items.map((item) => [item.id, items[item.id] === true])
        ),
      }
    : null;
}

const INVENTAIRE_INDISPONIBLE = 'L’inventaire est indisponible.';
const CHOIX_COMBINE_MANQUANT = 'Choisissez l’équipement retenu : four ou micro-ondes.';
const AUTRE_CHAUFFAGE_VIDE = 'Précisez l’autre système de chauffage.';
const AUTRE_MESURE_VIDE = 'Précisez la mesure ou retirez la ligne.';
const NOMBRE_FOYERS_PATTERN = /^\d+$/;

/**
 * Corps unique du PUT. Seules les structures incomplètes évidentes empêchent l'envoi : ligne de
 * plaque, combiné seul sans équipement retenu, chauffage « Autre » sans précision, ligne « Autres »
 * vide. Aucune règle de cotation n'est appliquée ici.
 */
export function buildGlobalPayload(
  draft: GlobalDraft,
  catalogue: CatalogueFaits
): GlobalDraftResult {
  switch (draft.bloc) {
    case 'c18':
      return { ok: true, bloc: 'c18', payload: draft.value };
    case 'c19':
      return { ok: true, bloc: 'c19', payload: draft.value };
    case 'c101':
      return { ok: true, bloc: 'c101', payload: draft.value };
    case 'c25':
      return {
        ok: true,
        bloc: 'c25',
        payload: {
          appreciation_commune: draft.value.appreciation_commune,
          besoin_assises_sans_dossier:
            draft.value.appreciation_commune === false
              ? null
              : draft.value.besoin_assises_sans_dossier,
        },
      };
    case 'c26':
      return {
        ok: true,
        bloc: 'c26',
        payload: {
          appreciation_commune: draft.value.appreciation_commune,
          assises_uniquement_convertibles:
            draft.value.appreciation_commune === false
              ? null
              : draft.value.assises_uniquement_convertibles,
        },
      };
    case 'cuisson': {
      const { presence, lignes } = draft.value;
      if (presence === false) {
        return { ok: true, bloc: 'cuisson', payload: { presence_plaques: false, lignes: [] } };
      }
      const errors: Record<string, string> = {};
      for (const ligne of lignes) {
        if (ligne.technologie === null) {
          errors[`cuisson.${ligne.id}.technologie`] = 'Sélectionnez un type de plaque.';
        }
        if (!NOMBRE_FOYERS_PATTERN.test(ligne.nombre.trim())) {
          errors[`cuisson.${ligne.id}.nombre_foyers`] = 'Indiquez un nombre de foyers entier.';
        }
      }
      if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
      }
      return {
        ok: true,
        bloc: 'cuisson',
        payload: {
          presence_plaques: lignes.length > 0 ? true : presence,
          lignes: lignes.map((ligne) => ({
            id: ligne.id,
            technologie: ligne.technologie,
            nombre_foyers: Number(ligne.nombre.trim()),
          })),
        },
      };
    }
    case 'four_micro_ondes': {
      const { configuration, choix_combine } = draft.value;
      if (configuration === 'COMBINE_SEUL' && choix_combine === null) {
        return { ok: false, errors: { 'four_micro_ondes.choix_combine': CHOIX_COMBINE_MANQUANT } };
      }
      return {
        ok: true,
        bloc: 'four_micro_ondes',
        payload: {
          configuration,
          choix_combine: configuration === 'COMBINE_SEUL' ? choix_combine : null,
        },
      };
    }
    case 'chauffage': {
      const { etat, types, autre } = draft.value;
      const negative = etat === 'AUCUN' || etat === 'MOBILES_UNIQUEMENT';
      const ordered = negative ? [] : catalogueOrder(types, catalogue.types_chauffage);
      const precision = autre?.trim() ?? '';
      if (ordered.includes('AUTRE') && !precision) {
        return { ok: false, errors: { 'chauffage.autre': AUTRE_CHAUFFAGE_VIDE } };
      }
      return {
        ok: true,
        bloc: 'chauffage',
        payload: {
          etat: negative ? etat : ordered.length > 0 ? 'INSTALLATIONS' : null,
          types: ordered,
          autre: ordered.includes('AUTRE') ? precision : null,
        },
      };
    }
    case 'mesures_energie':
      return mesuresResult('mesures_energie', draft.value, catalogue.mesures_energie);
    case 'mesures_eau':
      return mesuresResult('mesures_eau', draft.value, catalogue.mesures_eau);
    case 'c63': {
      const payload = inventairePayload(draft.value, inventaireCatalogue(catalogue, 'c63'));
      return payload
        ? { ok: true, bloc: 'c63', payload }
        : { ok: false, errors: { c63: INVENTAIRE_INDISPONIBLE } };
    }
    case 'c64': {
      const payload = inventairePayload(draft.value, inventaireCatalogue(catalogue, 'c64'));
      return payload
        ? { ok: true, bloc: 'c64', payload }
        : { ok: false, errors: { c64: INVENTAIRE_INDISPONIBLE } };
    }
    case 'c65': {
      const payload = inventairePayload(draft.value, inventaireCatalogue(catalogue, 'c65'));
      return payload
        ? { ok: true, bloc: 'c65', payload }
        : { ok: false, errors: { c65: INVENTAIRE_INDISPONIBLE } };
    }
  }
}

/**
 * Sauvegarde sans effet : aucune mutation n'est envoyée. Un inventaire jamais enregistré est
 * toujours envoyé (cases décochées = réponse négative) ; C63/C64 aussi quand la capacité actuelle
 * diffère de celle du dernier constat, même cases inchangées.
 */
export function isGlobalSaveNoop(
  result: Extract<GlobalDraftResult, { ok: true }>,
  initial: GlobalDraftResult,
  globaux: FaitsGlobaux,
  capacity: number | null
): boolean {
  if (!initial.ok || JSON.stringify(result.payload) !== JSON.stringify(initial.payload)) {
    return false;
  }
  if (result.bloc === 'c63' || result.bloc === 'c64' || result.bloc === 'c65') {
    const saved = globaux[result.bloc];
    return saved !== null && (result.bloc === 'c65' || saved.capacite_constatee === capacity);
  }
  return true;
}

/** Champ de la modale visé par un chemin backend du bloc (snake_case), sinon le conteneur du bloc. */
function globalErrorField(built: GlobalPayload, path: string): string {
  switch (built.bloc) {
    case 'cuisson': {
      const match = /^lignes\[(\d+)\]\.(technologie|nombre_foyers)$/.exec(path);
      const id = match ? built.payload.lignes[Number(match[1])]?.id : undefined;
      return match && id ? `cuisson.${id}.${match[2]}` : 'cuisson';
    }
    case 'mesures_energie':
    case 'mesures_eau': {
      const match = /^autres\[(\d+)\]$/.exec(path);
      return match ? `${built.bloc}.autres.${match[1]}` : built.bloc;
    }
    case 'chauffage':
      return path === 'autre' ? 'chauffage.autre' : 'chauffage';
    case 'c25':
    case 'c26':
    case 'c101':
    case 'four_micro_ondes':
      return `${built.bloc}.${path}`;
    default:
      // C18/C19 et inventaires : un seul conteneur de réponse.
      return built.bloc;
  }
}

/**
 * Rattache les `fieldErrors` backend (chemins Java camelCase relatifs au corps du bloc, ex.
 * `lignes[0].nombreFoyers`, `autres[1]`) aux champs de la modale ; l'index d'une plaque est résolu
 * par le corps envoyé.
 */
export function mapGlobalFieldErrors(
  built: GlobalPayload,
  fieldErrors: Record<string, string> | undefined
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [path, message] of Object.entries(fieldErrors ?? {})) {
    const field = globalErrorField(
      built,
      path.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    );
    errors[field] ??= message;
  }
  return errors;
}
