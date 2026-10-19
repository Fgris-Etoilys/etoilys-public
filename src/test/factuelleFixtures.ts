/**
 * Données FACTUELLE de test, calquées sur les contrats publics de `docs/data/swagger.json`
 * et sur le catalogue de `CatalogueFaits.courant()` du backend.
 */

type Json = Record<string, unknown>;

export const FACTUELLE_SIMULATION_ID = 'simulation-factuelle';

function formats(value: string) {
  return value.split(' ').map((format) => {
    const [largeur, longueur] = format.split('x').map(Number);
    return { largeur_cm: largeur, longueur_cm: longueur };
  });
}

const simples = formats('80x190 80x200 90x190 90x200 100x200 120x190 120x200');
const doubles = formats('140x190 140x200 160x190 160x200 180x200 200x200');
const individuels = formats('80x190 80x200 90x190 90x200');
const convertibles = formats('120x190 130x190 130x200 140x190 140x200 160x190 160x200 180x200');

function ligne(
  type: string,
  profil: string,
  initial: number,
  minimum: number,
  pas: number,
  list: unknown[]
) {
  return {
    type,
    profil,
    nombre_places_initial: initial,
    nombre_places_minimum: minimum,
    pas_nombre_places: pas,
    dimensions_libres: true,
    formats: list,
  };
}

export const catalogueResponse = {
  types_pieces: [
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
  ],
  couchages: [
    ligne('SIMPLE_FIXE', 'UNE_PLACE', 1, 1, 1, simples),
    ligne('DOUBLE_FIXE', 'DEUX_PLACES', 2, 2, 2, doubles),
    ligne('TWINS', 'UNE_PLACE', 2, 2, 2, formats('80x190 80x200 90x190 90x200 100x200')),
    ligne('GIGOGNE', 'UNE_PLACE', 1, 1, 1, individuels),
    ligne('SUPERPOSEE', 'UNE_PLACE', 2, 1, 1, individuels),
    ligne('SUPERPOSEE', 'DEUX_PLACES', 2, 2, 2, doubles),
    ligne('CONVERTIBLE', 'UNE_PLACE', 1, 1, 1, individuels),
    ligne('CONVERTIBLE', 'DEUX_PLACES', 2, 2, 2, convertibles),
    ligne('ESCAMOTABLE', 'UNE_PLACE', 1, 1, 1, simples),
    ligne('ESCAMOTABLE', 'DEUX_PLACES', 2, 2, 2, [...formats('130x190'), ...doubles]),
    ligne('AUTRE_APPOINT', 'UNE_PLACE', 1, 1, 1, individuels),
    ligne('AUTRE_APPOINT', 'DEUX_PLACES', 2, 2, 2, convertibles),
  ],
  technologies_cuisson: ['INDUCTION', 'VITROCERAMIQUE', 'GAZ', 'ELECTRIQUE_CLASSIQUE'],
  protections_sanitaires: ['CONFORME_SANS_RIDEAU', 'RIDEAU_SEUL', 'INSUFFISANTE'],
  configurations_four_micro_ondes: [],
  types_chauffage: [],
  mesures_energie: [],
  mesures_eau: [],
  inventaires: [],
};

export function piece(overrides: Json & { id: string; type_piece: string }): Json {
  return {
    nom: null,
    surface: 12,
    ouvrant: true,
    prise: null,
    ventilation: null,
    rang_type: 1,
    commun: null,
    inspection: null,
    nombre_oreillers: null,
    tous_lits_couette: null,
    deux_couvertures_par_lit_sans_couette: null,
    sanitaires: null,
    couchages: [],
    total_places: 0,
    ...overrides,
  };
}

export const chambre = piece({
  id: 'piece-chambre',
  nom: 'Chambre parentale',
  type_piece: 'CHAMBRE',
  surface: 12,
  couchages: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      type: 'DOUBLE_FIXE',
      profil: 'DEUX_PLACES',
      nombre_places: 2,
      largeur_cm: 160,
      longueur_cm: 200,
    },
  ],
  inspection: { couchage: true },
  total_places: 2,
});

export const petiteChambre = piece({
  id: 'piece-petite',
  nom: 'Petite chambre',
  type_piece: 'CHAMBRE',
  surface: 6,
  ouvrant: null,
  couchages: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      type: 'SIMPLE_FIXE',
      profil: 'UNE_PLACE',
      nombre_places: 1,
      largeur_cm: 90,
      longueur_cm: 190,
    },
  ],
  inspection: { couchage: true },
  total_places: 1,
});

export const salleEau1 = piece({
  id: 'piece-sdb-1',
  nom: 'Salle d’eau du haut',
  type_piece: 'SALLE_DE_BAIN',
  surface: 0,
  rang_type: 1,
  ouvrant: null,
});

export const salleEau2 = piece({
  id: 'piece-sdb-2',
  nom: 'Salle d’eau du bas',
  type_piece: 'SALLE_DE_BAIN',
  surface: 0,
  rang_type: 2,
  ouvrant: null,
});

export const terrasse = piece({
  id: 'piece-terrasse',
  type_piece: 'TERRASSE_OU_JARDIN_PRIVE',
  surface: 10,
  ouvrant: null,
});

export function faitsResponse(pieces: Json[] = [chambre], parametres: Json = {}): Json {
  return {
    grille_id: 'grille-factuelle',
    parametres: {
      mode_grille: 'FACTUELLE',
      categorie_demandee: '3*',
      capacite_accueil: 2,
      etage: 0,
      type_habitation: 'INDIVIDUEL',
      studio: false,
      parametres_manquants: [],
      ...parametres,
    },
    logement: { id: 'logement-factuel', pieces },
    faits_globaux: {},
  };
}

export function besoin(overrides: Json & { champ: string }): Json {
  return {
    cle: `x:${String(overrides.piece_id ?? 'grille')}:${overrides.champ}`,
    piece_id: null,
    num_critere: null,
    categories_utilisatrices: ['1*', '2*', '3*', '4*', '5*'],
    destination: 'PIECE',
    actions: ['RENSEIGNER'],
    manquant: true,
    ...overrides,
  };
}

export function evaluationResponse(overrides: Json = {}): Json {
  return {
    besoins: [],
    criteres: [],
    couchages: [],
    alertes_pieces: [],
    surfaces: {
      categorie: '3*',
      nombre_pieces_habitation: 1,
      surface_totale: 12,
      nombre_couchages: 2,
      minimum_global: 9,
      minimum_global_atteint: true,
      diagnostic_moyenne_surface: null,
      minima_locaux: [],
      qualifications_pieces: [],
    },
    ...overrides,
  };
}

export function factuelleSimulationResponse(
  evaluation: Json = evaluationResponse(),
  grille: Json = {}
) {
  return {
    id: FACTUELLE_SIMULATION_ID,
    statut: 'BROUILLON' as const,
    grille: {
      categorie_demandee: '3*',
      capacite_accueil: 2,
      type_habitation: 'INDIVIDUEL',
      etage: 0,
      mode_grille: 'FACTUELLE',
      studio: false,
      parametres_manquants: [],
      evaluation,
      criteres_personnalisation_remplacee: [],
      ...grille,
    },
  };
}

export function mutationResponse(pieces: Json[], evaluation: Json = evaluationResponse()): Json {
  return {
    faits: faitsResponse(pieces),
    evaluation,
    criteres_personnalisation_remplacee: [],
    changements_cascade: [],
  };
}
