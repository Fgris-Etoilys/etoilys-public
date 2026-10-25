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
  configurations_four_micro_ondes: [
    'AUCUN',
    'FOUR_SEUL',
    'MICRO_ONDES_SEUL',
    'COMBINE_SEUL',
    'APPAREILS_DISTINCTS',
  ],
  types_chauffage: [
    { id: 'ELECTRIQUE_FIXE', libelle: 'Électrique fixe' },
    { id: 'POMPE_A_CHALEUR', libelle: 'Pompe à chaleur' },
    { id: 'AUTRE', libelle: 'Autre' },
  ],
  mesures_energie: [
    { id: 'VITRAGE', libelle: 'Double ou triple vitrage' },
    { id: 'POMPE_A_CHALEUR', libelle: 'Pompe à chaleur' },
    { id: 'ISOLATION', libelle: 'Isolation' },
  ],
  mesures_eau: [{ id: 'MOUSSEURS', libelle: 'Mousseurs' }],
  inventaires: [
    {
      num_critere: 63,
      items: [
        { id: 'ASSIETTES_PLATES', libelle: 'Assiettes plates', groupe: null, minimum: 4 },
        { id: 'VERRES_EAU', libelle: 'Verres à eau', groupe: null, minimum: 4 },
      ],
    },
  ],
};

const CATEGORIES = ['1*', '2*', '3*', '4*', '5*'];

/** Cotation d'un critère dans les cinq catégories (statut réglementaire par catégorie). */
export function critere(
  numero: number,
  overrides: Json = {},
  statuts: string[] = CATEGORIES.map(() => 'OBLIGATOIRE')
): Json {
  return {
    num_critere: numero,
    automatique: false,
    statut_validation: null,
    points_obtenus: null,
    reponse_manuelle: null,
    justificatif_attendu: false,
    source_cascade: null,
    commentaire_gere_par_faits: false,
    categories: CATEGORIES.map((categorie, index) => ({
      categorie,
      statut_critere: statuts[index] ?? 'OBLIGATOIRE',
      points: 2,
      statut_validation: overrides.statut_validation ?? null,
      points_obtenus: null,
    })),
    ...overrides,
  };
}

/** Rapport favorable par défaut ; `points_optionnels_a_atteindre` inclut la compensation. */
export function rapport(overrides: Json = {}): Json {
  return {
    points_totaux_obligatoires: 100,
    points_minimaux_obligatoires: 90,
    points_obligatoires_obtenus: 95,
    points_obligatoires_atteints: true,
    points_obligatoires_a_compenser: 0,
    points_optionnels_disponibles: 60,
    points_optionnels_necessaires: 10,
    points_optionnels_a_atteindre: 10,
    points_optionnels_obtenus: 12,
    points_optionnels_atteints: true,
    resultat: true,
    criteres_obligatoires_non_valides: [],
    criteres_optionnels_non_valides: [],
    ...overrides,
  };
}

/** Modèle réduit, libellés résolus pour la catégorie de l'entrée. */
export function modele(): Json {
  const criterion = (num_critere: number, libelle: string) => ({
    num_critere,
    libelle,
    points: 2,
    peut_etre_non_applicable: false,
    categories: CATEGORIES.map((nom) => ({ nom, statut: 'OBLIGATOIRE' })),
  });
  return {
    chapitres: [
      {
        libelle: 'Équipements',
        sous_chapitres: [
          {
            libelle: 'Cuisine',
            rubriques: [
              {
                libelle: '',
                criteres: [
                  criterion(68, 'Cafetière'),
                  criterion(69, 'Machine à expresso'),
                  criterion(101, 'Mise à disposition d’un livret d’accueil'),
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

/** Cinq entrées 1★→5★ ; `entries` remplace le rapport ou les ONC d'une catégorie. */
export function comparaisonResponse(
  entries: Record<string, { rapport?: Json; onc?: number[] }> = {},
  categorieDemandee = '3*',
  pieces: Json[] = [chambre]
): Json {
  return {
    categorie_demandee: categorieDemandee,
    faits: faitsResponse(pieces, { categorie_demandee: categorieDemandee }),
    surface_totale: 12,
    categories: CATEGORIES.map((categorie) => ({
      categorie,
      rapport: rapport(entries[categorie]?.rapport),
      criteres_onc_non_valides: entries[categorie]?.onc ?? [],
      reponses: [
        {
          num_critere: 68,
          points_obtenus: 2,
          statut_validation: 'VALIDE',
          statut_critere: 'OBLIGATOIRE',
        },
      ],
      modele: modele(),
      verification: {},
    })),
  };
}

export function blocage(overrides: Json & { code: string }): Json {
  return {
    cle: `blocage:${overrides.code}:${String(overrides.num_critere ?? overrides.piece_id ?? '')}`,
    message: 'Le fait nécessaire au calcul doit être renseigné.',
    destination: 'GRILLE',
    champ: 'reponse_manuelle',
    piece_id: null,
    num_critere: null,
    categories_utilisatrices: CATEGORIES,
    ...overrides,
  };
}

/** `VerificationDto` public : champs historiques et bloc `factuelle`. */
export function verificationResponse(blocages: Json[] = [], comparaisonDisponible = false): Json {
  return {
    nb_couchages_suffisants: true,
    salle_de_bain_presente: true,
    commentaires_obligatoires_a_fournir: {
      tous_fournis: true,
      commentaires_obligatoires_non_fournis: [],
      nb_commentaires_obligatoires: 0,
    },
    factuelle: { comparaison_disponible: comparaisonDisponible, blocages },
  };
}

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

export function faitsResponse(
  pieces: Json[] = [chambre],
  parametres: Json = {},
  globaux: Json = {}
): Json {
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
    faits_globaux: globaux,
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

export function mutationResponse(
  pieces: Json[],
  evaluation: Json = evaluationResponse(),
  extra: { globaux?: Json; changements_cascade?: Json[] } = {}
): Json {
  return {
    faits: faitsResponse(pieces, {}, extra.globaux),
    evaluation,
    criteres_personnalisation_remplacee: [],
    changements_cascade: extra.changements_cascade ?? [],
  };
}
