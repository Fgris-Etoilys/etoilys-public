import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import structureGrilleRaw from '../../docs/structureGrille.json?raw';

const SIMULATION_ID = 'simulation-id';
const gridModelResponse = JSON.parse(structureGrilleRaw) as unknown;

const simulationResponse = {
  id: SIMULATION_ID,
  statut: 'brouillon',
  grille: {
    categorie_demandee: '3*',
    capacite_accueil: 4,
    type_habitation: 'INDIVIDUEL',
    etage: 1,
  },
};

const simulationWithUnknownRequestedCategory = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    categorie_demandee: 'inconnue',
  },
};

const simulationWithValidatedOptionalResponse = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    reponses: [
      {
        num_critere: 5,
        statut_validation: 'VALIDE',
        statut_critere: 'OPTIONNEL',
      },
    ],
  },
};

const simulationWithUpdatedRequestedCategory = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    categorie_demandee: '4*',
    reponses: [
      {
        num_critere: 5,
        statut_validation: 'VALIDE',
        statut_critere: 'OBLIGATOIRE',
      },
    ],
  },
};

const simulationWithUpdatedCapacity = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    capacite_accueil: 6,
  },
};

const simulationWithUpdatedFloor = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    etage: 2,
  },
};

const simulationWithUpdatedHousingType = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    type_habitation: 'COLLECTIF',
  },
};

const simulationWithAutomaticSurfaceResponses = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    reponses: [
      {
        num_critere: 1,
        statut_validation: 'VALIDE',
        statut_critere: 'OBLIGATOIRE',
      },
      {
        num_critere: 2,
        statut_validation: 'NON_VALIDE',
        statut_critere: 'OPTIONNEL',
      },
    ],
  },
};

const emptyLogementResponse = {
  id: 'logement-id',
  pieces: [],
  nb_pieces_habitation: 0,
  surface_totale: 0,
};

const logementWithPiecesResponse = {
  id: 'logement-id',
  nb_pieces_habitation: 1,
  surface_totale: 32,
  pieces: [
    {
      id: 'piece-1',
      nom: 'Chambre 1',
      type_piece: 'CHAMBRE',
      surface: 12,
      ouvrant: true,
      prise: false,
      ventilation: false,
      type_literie: null,
      nombre_lits: 2,
      format_lits: null,
      literie: false,
      surface_minimum_atteinte: true,
      capacite_lits_atteinte: false,
    },
    {
      id: 'piece-2',
      type_piece: 'TERRASSE_OU_JARDIN_PRIVE',
      surface: 8,
      surface_minimum_atteinte: false,
    },
  ],
};

const logementWithCorridorsResponse = {
  ...logementWithPiecesResponse,
  pieces: [
    ...logementWithPiecesResponse.pieces,
    {
      id: 'piece-corridors',
      nom: 'Couloirs et dégagements n°1',
      type_piece: 'COULOIRS_ET_DEGAGEMENTS',
      surface: 4,
    },
  ],
};

const logementWithAllExteriorTypesResponse = {
  ...logementWithPiecesResponse,
  pieces: [
    logementWithPiecesResponse.pieces[0],
    {
      id: 'piece-loggia',
      type_piece: 'LOGGIA_BALCON_VERANDA',
      surface: 3,
    },
    {
      id: 'piece-terrace',
      type_piece: 'TERRASSE_OU_JARDIN_PRIVE',
      surface: 8,
    },
    {
      id: 'piece-park',
      type_piece: 'PARC_OU_JARDIN',
      surface: 20,
    },
  ],
};

const logementWithNullSleepingCapacityResponse = {
  ...logementWithPiecesResponse,
  pieces: [
    ...logementWithPiecesResponse.pieces,
    {
      id: 'piece-null-sleeping-capacity',
      nom: 'Séjour n°1',
      type_piece: 'SEJOUR',
      surface: 8,
      nombre_lits: null,
    },
  ],
};

const logementWithClosedOpeningResponse = {
  ...logementWithPiecesResponse,
  pieces: [
    {
      ...logementWithPiecesResponse.pieces[0],
      ouvrant: false,
    },
    logementWithPiecesResponse.pieces[1],
  ],
};

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const mockFetchJsonSequence = (responses: Array<{ body: unknown; status?: number }>) => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  responses.forEach((response) => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(response.body, response.status ?? 200));
  });
  return fetchMock;
};

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

describe('SimulationClassement', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('charge la simulation et le logement', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/classement demandé/i)).toHaveValue('3*');
      expect(screen.getByLabelText(/capacité d’accueil/i)).toHaveValue(4);
      expect(screen.getByLabelText(/type d’habitation/i)).toHaveValue('INDIVIDUEL');
      expect(screen.getByLabelText(/étage/i)).toHaveValue('1');
    });
    expect(screen.getByText(/3 étoiles/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4 personnes/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/surface totale renseignée/i)).toBeInTheDocument();
    expect(screen.queryByText(/pièces ajoutées/i)).not.toBeInTheDocument();
    expect(screen.getByText(/32 m²/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pièces intérieures/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /espaces extérieurs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /chambre 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /terrasse ou jardin privé/i })).toBeInTheDocument();
    expect(
      within(screen.getByTestId('piece-card-piece-1')).queryByText(/^chambre$/i)
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId('piece-card-piece-1')).getByText(/12 m²/i)
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('piece-card-piece-1')).getByText(/2 personnes/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('piece-card-piece-1')).toHaveClass('min-h-52');
    expect(screen.getByTestId('piece-card-piece-1')).toHaveClass('h-full');
    expect(screen.getByTestId('piece-card-piece-1').className).not.toContain('aspect-square');
    expect(screen.getByRole('button', { name: /modifier chambre 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supprimer chambre 1/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ajouter une pièce intérieure/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ajouter un espace extérieur/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter une pièce intérieure/i })).toHaveClass(
      'min-h-52'
    );
    expect(
      screen.getByRole('button', { name: /ajouter une pièce intérieure/i }).className
    ).not.toContain('aspect-square');
    expect(screen.queryByRole('button', { name: /^ajouter une pièce$/i })).not.toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/public/simulations/${SIMULATION_ID}`,
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/public/simulations/${SIMULATION_ID}/logement`,
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
  });

  it('met à jour le classement immédiatement et hydrate la grille sans recalculer le résultat absent', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: simulationWithUpdatedRequestedCategory },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    const requestedCategorySelect = await screen.findByLabelText(/classement demandé/i);
    fireEvent.change(requestedCategorySelect, { target: { value: '4*' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(4);
    });
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/classementDemande/4*`
    );
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({
      method: 'PUT',
      credentials: 'include',
    });
    expect(fetchMock.mock.calls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(requestedCategorySelect).toHaveValue('4*');
    expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    expect(within(optionalCriterion).getByRole('button', { name: /^oui$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('met à jour la capacité seulement au blur', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: simulationWithUpdatedCapacity },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    const capacityInput = await screen.findByLabelText(/capacité d’accueil/i);
    fireEvent.change(capacityInput, { target: { value: '6' } });

    await waitFor(() => {
      expect(capacityInput).toHaveValue(6);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fireEvent.blur(capacityInput);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(4);
    });
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/capaciteAccueil/6`
    );
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({
      method: 'PUT',
      credentials: 'include',
    });
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();
  });

  it('recalcule le résultat existant après modification d’un paramètre', async () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: true },
      {
        body: {
          resultat: true,
          points_totaux_obligatoires: 180,
          points_obligatoires_obtenus: 160,
          points_minimaux_obligatoires: 140,
          points_obligatoires_atteints: true,
          points_optionnels_disponibles: 45,
          points_optionnels_obtenus: 20,
          points_optionnels_a_atteindre: 155,
          points_optionnels_atteints: true,
          criteres_obligatoires_non_valides: [],
        },
      },
      { body: simulationWithUpdatedFloor },
      { body: logementWithPiecesResponse },
      { body: false },
      {
        body: {
          nb_couchages_suffisants: true,
          criteres_obligatoires_a_cocher: {
            criteres_non_coches: [95],
          },
          criteres_optionnels_a_cocher: {
            criteres_non_coches: [],
          },
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
    scrollToMock.mockClear();

    fireEvent.change(screen.getByLabelText(/étage/i), { target: { value: '2' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(9);
    });
    expect(fetchMock.mock.calls[5]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/etage/2`);
    expect(fetchMock.mock.calls[6]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(fetchMock.mock.calls[7]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/verifier`);
    expect(fetchMock.mock.calls[8]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verification`
    );
    expect(await screen.findByText(/problèmes à corriger/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('conserve le paramètre et désactive le résultat si un refetch secondaire échoue', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: true },
      {
        body: {
          resultat: true,
          points_totaux_obligatoires: 180,
          points_obligatoires_obtenus: 160,
          points_minimaux_obligatoires: 140,
          points_obligatoires_atteints: true,
          points_optionnels_disponibles: 45,
          points_optionnels_obtenus: 20,
          points_optionnels_a_atteindre: 155,
          points_optionnels_atteints: true,
          criteres_obligatoires_non_valides: [],
        },
      },
      { body: simulationWithUpdatedHousingType },
      { body: { error: 'Server error' }, status: 500 },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();

    const housingTypeSelect = screen.getByLabelText(/type d’habitation/i);
    fireEvent.change(housingTypeSelect, { target: { value: 'COLLECTIF' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /certaines données de la simulation n’ont pas pu être actualisées/i
    );
    expect(fetchMock.mock.calls[5]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/typeHabitation/COLLECTIF`
    );
    expect(fetchMock.mock.calls[6]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(housingTypeSelect).toHaveValue('COLLECTIF');
    expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();
  });

  it('affiche une erreur claire si le chargement échoue', async () => {
    mockFetchJsonSequence([
      { body: { error: 'Server error' }, status: 500 },
      { body: emptyLogementResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(await screen.findByText(/impossible de charger cette simulation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /revenir aux simulations/i })).toBeInTheDocument();
  });

  it('ouvre le formulaire depuis les chips d’ajout de pièces', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    expect(screen.queryByLabelText(/nom de la pièce/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^ajouter une pièce$/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));

    const interiorDialog = screen.getByRole('dialog', { name: /ajouter une pièce/i });
    expect(interiorDialog).toBeInTheDocument();
    expect(screen.queryByLabelText(/nom de la pièce/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de personnes pouvant dormir/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('CHAMBRE');
    expect(screen.getByRole('switch', { name: /ouvrant vers l’extérieur/i })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.queryByRole('option', { name: /^cabine$/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /terrasse ou jardin privé/i })
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/type de pièce/i), {
      target: { value: 'CUISINE' },
    });

    expect(screen.queryByLabelText(/nombre de personnes pouvant dormir/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('switch', { name: /ouvrant vers l’extérieur/i })
    ).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ajouter un espace extérieur/i }));

    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('TERRASSE_OU_JARDIN_PRIVE');
    expect(screen.queryByRole('option', { name: /^chambre$/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre de personnes pouvant dormir/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('switch', { name: /ouvrant vers l’extérieur/i })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('masque les types de pièces non proposés en création', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithCorridorsResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    expect(screen.getByRole('heading', { name: /^couloirs et dégagements$/i })).toBeInTheDocument();
    expect(screen.queryByText(/couloirs et dégagements n°1/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));

    expect(screen.queryByRole('option', { name: /^cabine$/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /couloirs et dégagements/i })
    ).not.toBeInTheDocument();
  });

  it('affiche le toggle ouvrant uniquement pour les pièces intérieures concernées', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));

    const typeSelect = screen.getByLabelText(/type de pièce/i);
    const exteriorOpeningSwitch = () =>
      screen.queryByRole('switch', { name: /ouvrant vers l’extérieur/i });

    for (const pieceType of ['CHAMBRE', 'SEJOUR', 'SALON', 'SALLE_A_MANGER', 'BUREAU']) {
      fireEvent.change(typeSelect, { target: { value: pieceType } });
      expect(exteriorOpeningSwitch()).toBeInTheDocument();
    }

    for (const pieceType of [
      'CUISINE',
      'COULOIRS_ET_DEGAGEMENTS',
      'WC',
      'SALLE_DE_BAIN',
      'PIECE_SANS_OUVRANT',
    ]) {
      fireEvent.change(typeSelect, { target: { value: pieceType } });
      expect(exteriorOpeningSwitch()).not.toBeInTheDocument();
    }
  });

  it('garde une grille de champs alignée quand une erreur de saisie est affichée', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.click(screen.getByRole('button', { name: /ajouter cette pièce/i }));

    const surfaceErrorSlot = screen.getByTestId('pieceSurface-error-slot');
    expect(surfaceErrorSlot).toHaveClass('min-h-[1.25rem]');
    expect(await screen.findByText(/indiquez une surface valide/i)).toBe(surfaceErrorSlot);
    expect(screen.getByTestId('piece-form-fields-grid')).not.toHaveClass('sm:items-start');
  });

  it('limite les espaces extérieurs à un exemplaire par type', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithPiecesResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /terrasse ou jardin privé/i });
    fireEvent.click(screen.getByRole('button', { name: /ajouter un espace extérieur/i }));

    expect(screen.getByRole('dialog', { name: /ajouter une pièce/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('LOGGIA_BALCON_VERANDA');
    expect(
      screen.queryByRole('option', { name: /terrasse ou jardin privé/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: /loggia, balcon ou véranda/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /parc ou jardin/i })).toBeInTheDocument();
  });

  it('conserve le type courant en édition d’un espace extérieur', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithPiecesResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /terrasse ou jardin privé/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-2')).getByRole('button', {
        name: /modifier terrasse ou jardin privé/i,
      })
    );

    expect(screen.getByRole('dialog', { name: /modifier la pièce/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('TERRASSE_OU_JARDIN_PRIVE');
    expect(screen.getByRole('option', { name: /terrasse ou jardin privé/i })).toBeInTheDocument();
  });

  it('masque l’ajout d’espace extérieur quand tous les types existent', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithAllExteriorTypesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /terrasse ou jardin privé/i });

    expect(
      screen.getByRole('button', { name: /ajouter une pièce intérieure/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /ajouter un espace extérieur/i })
    ).not.toBeInTheDocument();
  });

  it('n’affiche pas les couchages quand ils ne sont pas renseignés', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithNullSleepingCapacityResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    const roomWithoutSleepingCapacity = await screen.findByTestId(
      'piece-card-piece-null-sleeping-capacity'
    );

    expect(screen.queryByText(/null personne/i)).not.toBeInTheDocument();
    expect(within(roomWithoutSleepingCapacity).queryByText(/couchages/i)).not.toBeInTheDocument();
  });

  it('ajoute une pièce avec le nombre de couchages mappé sur nombre_lits', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
      {
        body: {
          ...emptyLogementResponse,
          surface_totale: 12,
          pieces: [
            {
              id: 'piece-created',
              nom: 'Chambre bleue',
              type_piece: 'CHAMBRE',
              surface: 12,
              nombre_lits: 2,
            },
          ],
        },
      },
      { body: simulationWithAutomaticSurfaceResponses },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ajouter cette pièce/i }));

    expect(await screen.findByText(/la pièce a été ajoutée/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /chambre bleue/i })).toBeInTheDocument();

    const createCall = fetchMock.mock.calls[2];
    expect(createCall?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/pieces`);
    expect(createCall?.[1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        type_piece: 'CHAMBRE',
        surface: 12,
        nombre_lits: 2,
        literie: true,
        ouvrant: true,
      }),
    });
    const createPayload = JSON.parse(String(createCall?.[1]?.body)) as Record<string, unknown>;
    expect(createPayload).not.toHaveProperty('nom');

    expect(fetchMock.mock.calls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}`);

    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const surfaceCriterion = await screen.findByTestId('criterion-card-1');
    expect(within(surfaceCriterion).getByRole('button', { name: /^oui$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('affiche immédiatement un avertissement si la surface renseignée est insuffisante', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '3' },
    });

    expect(screen.queryByText(/surface d’au moins 10 m²/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '8' } });

    expect(screen.getByText(/surface d’au moins 10 m²/i)).toBeInTheDocument();
  });

  it('enregistre une pièce avec surface insuffisante et affiche une alerte sur la carte', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
      {
        body: {
          ...emptyLogementResponse,
          pieces: [
            {
              id: 'piece-created',
              nom: 'Chambre bleue',
              type_piece: 'CHAMBRE',
              surface: 8,
              nombre_lits: 3,
            },
          ],
        },
      },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ajouter cette pièce/i }));

    expect(await screen.findByText(/la pièce a été ajoutée/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const createdPieceCard = screen.getByTestId('piece-card-piece-created');
    const alertButton = within(createdPieceCard).getByRole('button', {
      name: /alerte sur chambre bleue/i,
    });
    fireEvent.mouseEnter(alertButton);
    expect(
      await within(createdPieceCard).findByText(
        'Cette pièce doit avoir une surface d’au moins 10 m² pour 3 couchages. Supprimez des couchages ou bien le critère n°1 sera invalidé.'
      )
    ).toBeInTheDocument();
  });

  it('bloque la création avant appel API si la pièce dépasse la capacité de couchages', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '18' } });
    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '5' },
    });
    const submitButton = screen.getByRole('button', { name: /ajouter cette pièce/i });

    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);

    expect(screen.getByRole('dialog', { name: /ajouter une pièce/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Le nombre maximal de couchages autorisés dans cette pièce est dépassé. Supprimez des couchages.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/la pièce a été ajoutée/i)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('enregistre une modification avec surface insuffisante et affiche une alerte sur la carte', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      {
        body: {
          ...logementWithPiecesResponse,
          pieces: [
            {
              ...logementWithPiecesResponse.pieces[0],
              type_piece: 'CHAMBRE',
              surface: 8,
              nombre_lits: 3,
            },
            logementWithPiecesResponse.pieces[1],
          ],
        },
      },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(await screen.findByText(/la pièce a été modifiée/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(fetchMock.mock.calls[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/pieces/piece-1`
    );

    const updatedPieceCard = screen.getByTestId('piece-card-piece-1');
    expect(
      within(updatedPieceCard).getByRole('button', { name: /alerte sur chambre 1/i })
    ).toBeInTheDocument();
  });

  it('affiche une alerte de carte depuis les indicateurs backend si la catégorie est inexploitable', async () => {
    mockFetchJsonSequence([
      { body: simulationWithUnknownRequestedCategory },
      {
        body: {
          ...logementWithPiecesResponse,
          pieces: [
            {
              ...logementWithPiecesResponse.pieces[0],
              surface: 8,
              nombre_lits: 2,
              surface_minimum: 12,
              surface_minimum_atteinte: false,
              capacite_lits_atteinte: false,
            },
          ],
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    const pieceCard = screen.getByTestId('piece-card-piece-1');
    const alertButton = within(pieceCard).getByRole('button', { name: /alerte sur chambre 1/i });

    fireEvent.mouseEnter(alertButton);
    expect(
      await within(pieceCard).findByText(/surface d’au moins 12 m² pour 2 couchages/i)
    ).toBeInTheDocument();
  });

  it('envoie ouvrant à false quand le toggle est désactivé', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
      {
        body: {
          ...emptyLogementResponse,
          surface_totale: 12,
          pieces: [
            {
              id: 'piece-created',
              nom: 'Chambre bleue',
              type_piece: 'CHAMBRE',
              surface: 12,
              ouvrant: false,
            },
          ],
        },
      },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('switch', { name: /ouvrant vers l’extérieur/i }));
    fireEvent.click(screen.getByRole('button', { name: /ajouter cette pièce/i }));

    expect(await screen.findByText(/la pièce a été ajoutée/i)).toBeInTheDocument();

    const createCall = fetchMock.mock.calls[2];
    expect(createCall?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/pieces`);
    expect(createCall?.[1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        type_piece: 'CHAMBRE',
        surface: 12,
        ouvrant: false,
      }),
    });
  });

  it('modifie une pièce existante', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      {
        body: {
          ...logementWithPiecesResponse,
          pieces: [
            {
              id: 'piece-1',
              nom: 'Chambre principale',
              type_piece: 'CHAMBRE',
              surface: 13,
              nombre_lits: 2,
            },
          ],
        },
      },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );

    expect(screen.getByRole('dialog', { name: /modifier la pièce/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/nom de la pièce/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(await screen.findByText(/la pièce a été modifiée/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /chambre principale/i })).toBeInTheDocument();

    const updateCall = fetchMock.mock.calls[2];
    expect(updateCall?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/pieces/piece-1`);
    expect(updateCall?.[1]).toMatchObject({
      method: 'PUT',
      credentials: 'include',
    });
    const updatePayload = JSON.parse(String(updateCall?.[1]?.body)) as Record<string, unknown>;
    expect(updatePayload).toEqual({
      nom: 'Chambre 1',
      type_piece: 'CHAMBRE',
      surface: 13,
      ouvrant: true,
      prise: false,
      ventilation: false,
      type_literie: null,
      nombre_lits: 2,
      format_lits: null,
      literie: true,
    });
  });

  it('bloque l’édition en 5 étoiles si la pièce dépasse 3 couchages', async () => {
    const fetchMock = mockFetchJsonSequence([
      {
        body: {
          ...simulationResponse,
          grille: {
            ...simulationResponse.grille,
            categorie_demandee: '5*',
          },
        },
      },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );

    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '4' },
    });
    const submitButton = screen.getByRole('button', { name: /enregistrer les modifications/i });

    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);

    expect(await screen.findByRole('dialog', { name: /modifier la pièce/i })).toBeInTheDocument();
    expect(screen.getByText(/nombre maximal de couchages autorisés/i)).toBeInTheDocument();
    expect(screen.queryByText(/la pièce a été modifiée/i)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reprend la valeur ouvrant existante en édition', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithClosedOpeningResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );

    expect(screen.getByRole('switch', { name: /ouvrant vers l’extérieur/i })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('envoie nombre_lits à null quand les couchages sont vidés en édition', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: logementWithPiecesResponse },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );

    fireEvent.change(screen.getByLabelText(/nombre de personnes pouvant dormir/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(await screen.findByText(/la pièce a été modifiée/i)).toBeInTheDocument();

    const updateCall = fetchMock.mock.calls[2];
    const updatePayload = JSON.parse(String(updateCall?.[1]?.body)) as Record<string, unknown>;
    expect(updatePayload).toMatchObject({ nombre_lits: null });
  });

  it('affiche un message spécifique si l’enregistrement retourne un conflit', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: { code: 'CONFLICT', message: 'Ressource déjà existante' }, status: 409 },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /modifier chambre 1/i,
      })
    );
    fireEvent.click(screen.getByRole('button', { name: /enregistrer les modifications/i }));

    expect(
      await screen.findByText(
        /une pièce similaire existe déjà ou les informations envoyées sont incomplètes/i
      )
    ).toBeInTheDocument();
  });

  it('confirme puis supprime une pièce', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: { ...logementWithPiecesResponse, pieces: [] } },
      { body: simulationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /supprimer chambre 1/i,
      })
    );
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /^supprimer$/i,
      })
    );

    expect(await screen.findByText(/la pièce a été supprimée/i)).toBeInTheDocument();

    const deleteCall = fetchMock.mock.calls[2];
    expect(deleteCall?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/pieces/piece-1`);
    expect(deleteCall?.[1]).toMatchObject({
      method: 'DELETE',
      credentials: 'include',
    });
  });

  it('affiche un message clair si la suppression est refusée', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: { error: 'Cannot delete default piece' }, status: 409 },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /supprimer chambre 1/i,
      })
    );
    fireEvent.click(
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', {
        name: /^supprimer$/i,
      })
    );

    expect(
      await screen.findByText(/elle est peut-être nécessaire à la simulation/i)
    ).toBeInTheDocument();
  });

  it('bloque le passage à la grille sans pièce avec surface', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(
      await screen.findByText(/ajoutez au moins une pièce avec sa surface/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/133 critères à compléter/i)).not.toBeInTheDocument();
  });

  it('permet de réessayer si le modèle de grille ne charge pas', async () => {
    mockFetchJsonSequence([
      { body: simulationWithAutomaticSurfaceResponses },
      { body: logementWithPiecesResponse },
      { body: { error: 'Server error' }, status: 500 },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(
      await screen.findByRole('heading', { name: /grille de contrôle indisponible/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(
      await screen.findByRole('heading', { name: /^grille de contrôle$/i })
    ).toBeInTheDocument();
  });

  it('active la grille de contrôle et permet de revenir aux pièces', async () => {
    mockFetchJsonSequence([
      { body: simulationWithAutomaticSurfaceResponses },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(
      await screen.findByRole('heading', { name: /^grille de contrôle$/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.queryByText(/réponse actuelle/i)).not.toBeInTheDocument();

    const tableOfContents = screen.getByRole('navigation', { name: /sommaire de la grille/i });
    expect(
      within(tableOfContents).getAllByText(/chapitre 1 : équipements et aménagements/i)
    ).toHaveLength(1);
    expect(
      within(tableOfContents).getByRole('button', { name: /1\.1 aménagement général/i })
    ).toBeInTheDocument();
    expect(tableOfContents).toHaveClass('table-of-contents-scrollbar');

    const sectionSelect = screen.getByLabelText(/aller à une section/i);
    const optionGroups = Array.from(sectionSelect.querySelectorAll('optgroup'));
    expect(optionGroups.map((group) => group.label)).toContain(
      'Chapitre 1 : Équipements et aménagements'
    );
    expect(optionGroups[0]?.querySelector('option')?.textContent).toMatch(
      /1\.1 aménagement général/i
    );

    const surfaceCriterion = screen.getByTestId('criterion-card-1');
    expect(within(surfaceCriterion).getByText(/validé automatiquement/i)).toBeInTheDocument();
    expect(
      within(surfaceCriterion).getByRole('heading', { name: /surface totale minimum/i })
    ).toHaveClass('text-base');
    const surfaceYesButton = within(surfaceCriterion).getByRole('button', { name: /^oui$/i });
    const surfaceNoButton = within(surfaceCriterion).getByRole('button', { name: /^non$/i });
    expect(surfaceYesButton).toBeDisabled();
    expect(surfaceNoButton).toBeDisabled();
    expect(surfaceYesButton).toHaveAttribute('aria-pressed', 'true');
    expect(surfaceNoButton).toHaveAttribute('aria-pressed', 'false');

    const optionalSurfaceCriterion = screen.getByTestId('criterion-card-2');
    const optionalSurfaceNoButton = within(optionalSurfaceCriterion).getByRole('button', {
      name: /^non$/i,
    });
    expect(optionalSurfaceNoButton).toBeDisabled();
    expect(optionalSurfaceNoButton).toHaveAttribute('aria-pressed', 'true');

    const notApplicableCriterion = screen.getByTestId('criterion-card-23');
    expect(
      within(notApplicableCriterion).getByText(/ce critère n’est pas applicable/i)
    ).toBeInTheDocument();
    expect(
      within(notApplicableCriterion).queryByRole('button', { name: /non applicable/i })
    ).not.toBeInTheDocument();

    const optionalCriterion = screen.getByTestId('criterion-card-5');
    const optionalYesButton = within(optionalCriterion).getByRole('button', { name: /^oui$/i });
    const optionalNoButton = within(optionalCriterion).getByRole('button', { name: /^non$/i });
    const optionalNotApplicableButton = within(optionalCriterion).getByRole('button', {
      name: /^non applicable/i,
    });
    expect(optionalNotApplicableButton).toBeInTheDocument();
    expect(optionalYesButton).toHaveClass('hover:bg-success-100');
    expect(optionalNoButton).toHaveClass('hover:bg-alert-100');
    expect(optionalNotApplicableButton).toHaveClass('hover:bg-primary-100');
    expect(optionalYesButton).toHaveClass('focus-visible:ring-2');
    expect(optionalYesButton.className).not.toContain('focus:ring-2');

    const oncCriterion = screen.getByTestId('criterion-card-95');
    expect(within(oncCriterion).getByText(/obligatoire non compensable/i)).toBeInTheDocument();
    expect(within(oncCriterion).getByRole('button', { name: /^oui/i })).toBeInTheDocument();
    expect(within(oncCriterion).getByRole('button', { name: /^non$/i })).toBeInTheDocument();
    expect(
      within(oncCriterion).queryByRole('button', { name: /non applicable/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /pièces du logement/i }));
    expect(screen.getByRole('button', { name: /ajouter une pièce/i })).toBeInTheDocument();
  });

  it('enregistre une réponse de critère avec un payload public minimal', async () => {
    let resolveSaveResponse: ((response: Response) => void) | undefined;
    const pendingSaveResponse = new Promise<Response>((resolve) => {
      resolveSaveResponse = resolve;
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock
      .mockResolvedValueOnce(createJsonResponse(simulationResponse))
      .mockResolvedValueOnce(createJsonResponse(logementWithPiecesResponse))
      .mockResolvedValueOnce(createJsonResponse(gridModelResponse))
      .mockReturnValueOnce(pendingSaveResponse);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    fireEvent.click(within(optionalCriterion).getByRole('button', { name: /^oui/i }));

    const selectedYesButton = within(optionalCriterion).getByRole('button', { name: /^oui$/i });
    expect(selectedYesButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText(/réponse enregistrée/i)).not.toBeInTheDocument();
    expect(
      within(optionalCriterion).queryByRole('button', { name: /oui sélectionné/i })
    ).not.toBeInTheDocument();

    const responseCall = fetchMock.mock.calls[3];
    expect(responseCall?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/reponse`);
    expect(responseCall?.[1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        num_critere: 5,
        statut_validation: 'VALIDE',
      }),
    });
    expect(String(responseCall?.[1]?.body)).not.toContain('commentaire');

    if (!resolveSaveResponse) {
      throw new Error('La promesse de sauvegarde du test n’a pas été initialisée.');
    }
    resolveSaveResponse(
      createJsonResponse({
        num_critere: 5,
        statut_validation: 'VALIDE',
        statut_critere: 'OPTIONNEL',
        commentaire: 'non affiché',
      })
    );
    await waitFor(() => {
      expect(screen.queryByText(/réponse enregistrée/i)).not.toBeInTheDocument();
    });
  });

  it('rollback la réponse optimiste après 3 échecs d’enregistrement', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationWithValidatedOptionalResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: { error: 'Network error' }, status: 500 },
      { body: { error: 'Network error' }, status: 500 },
      { body: { error: 'Network error' }, status: 500 },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    const yesButton = within(optionalCriterion).getByRole('button', { name: /^oui$/i });
    const noButton = within(optionalCriterion).getByRole('button', { name: /^non$/i });

    expect(yesButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(noButton);

    expect(noButton).toHaveAttribute('aria-pressed', 'true');
    expect(yesButton).toHaveAttribute('aria-pressed', 'false');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/vérifiez votre connexion puis réessayez/i);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(6);
    });
    expect(within(optionalCriterion).getByRole('button', { name: /^oui$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(optionalCriterion).getByRole('button', { name: /^non$/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('distingue les blocages et les critères optionnels lors de la vérification', async () => {
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: false },
      {
        body: {
          nb_couchages_suffisants: false,
          criteres_obligatoires_a_cocher: {
            criteres_non_coches: [95],
          },
          criteres_optionnels_a_cocher: {
            criteres_non_coches: [5],
          },
          commentaires_obligatoires_a_fournir: {
            commentaires_obligatoires_non_fournis: [7],
          },
        },
      },
      {
        body: {
          num_critere: 5,
          statut_validation: 'VALIDE',
          statut_critere: 'OPTIONNEL',
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByRole('tab', { name: /résultat/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
    expect(
      await screen.findByText(/un ou plusieurs problèmes ont été détectés/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/2 critères n’ont pas encore été renseignés/i)).toBeInTheDocument();
    expect(
      screen.getByText(/permettent actuellement d’accueillir 2 personnes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/indiquée est de 4 personnes/i)).toBeInTheDocument();
    expect(screen.queryByText(/commentaire/i)).not.toBeInTheDocument();
    expect(fetchMock.mock.calls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/verifier`);
    expect(fetchMock.mock.calls[4]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verification`
    );

    fireEvent.click(screen.getByRole('button', { name: /afficher dans la grille/i }));

    expect(await screen.findByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
    expect(
      screen.getByText(/uniquement 2 critères signalés dans le résultat/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-5')).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-95')).toBeInTheDocument();
    expect(screen.queryByTestId('criterion-card-6')).not.toBeInTheDocument();

    fireEvent.click(
      within(screen.getByTestId('criterion-card-5')).getByRole('button', { name: /^oui$/i })
    );

    expect(
      await screen.findByText(/uniquement 2 critères signalés dans le résultat/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-5')).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-95')).toBeInTheDocument();
    expect(screen.queryByTestId('criterion-card-6')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /afficher toute la grille/i }));
    expect(await screen.findByTestId('criterion-card-6')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();
  });

  it('affiche le rapport mocké sans appeler les endpoints de résultat', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const mockResultButton = await screen.findByRole('button', { name: /simuler le résultat/i });
    expect(mockResultButton).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    fireEvent.click(mockResultButton);

    expect(await screen.findByRole('tab', { name: /résultat/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByText(/classement 3 étoiles ne semble pas encore atteint/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/121 \/ 137/i)).toBeInTheDocument();
    expect(screen.getByText(/106 \/ 161/i)).toBeInTheDocument();
    expect(screen.getByText(/57 points à atteindre/i)).toBeInTheDocument();
    expect(screen.queryByText(/48 points/i)).not.toBeInTheDocument();
    expect(screen.getByText(/critère 41/i)).toBeInTheDocument();
    expect(screen.getByText(/un wc avec cuvette/i)).toBeInTheDocument();
    expect(fetchMock.mock.calls).toHaveLength(3);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/rapport'))).toBe(false);
  });

  it('affiche le rapport de succès dans l’onglet résultat et permet de revenir à la grille', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: true },
      {
        body: {
          resultat: true,
          points_totaux_obligatoires: 180,
          points_obligatoires_obtenus: 160,
          points_minimaux_obligatoires: 140,
          points_obligatoires_atteints: true,
          points_optionnels_disponibles: 45,
          points_optionnels_obtenus: 20,
          points_optionnels_necessaires: 15,
          points_optionnels_a_atteindre: 155,
          points_optionnels_atteints: true,
          criteres_obligatoires_non_valides: [],
        },
      },
      {
        body: {
          num_critere: 5,
          statut_validation: 'VALIDE',
          statut_critere: 'OPTIONNEL',
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByRole('tab', { name: /résultat/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(await screen.findByText(/résultat de la simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();
    expect(screen.getByText(/estimation basée sur vos réponses/i)).toBeInTheDocument();
    expect(screen.getByText(/160 \/ 180/i)).toBeInTheDocument();
    expect(screen.getByText(/140 points à atteindre/i)).toBeInTheDocument();
    expect(screen.getByText(/20 \/ 45/i)).toBeInTheDocument();
    expect(screen.getByText(/155 points à atteindre/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^validé$/i)).toHaveLength(2);
    expect(screen.queryByText(/seuil obligatoire atteint/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/objectif optionnel atteint/i)).not.toBeInTheDocument();
    expect(screen.getByText(/20 points obtenus sur 45 points disponibles/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Seuil minimal$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Points nécessaires$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Points disponibles$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Objectif à atteindre$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/critères obligatoires non validés/i)).not.toBeInTheDocument();
    expect(fetchMock.mock.calls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/verifier`);
    expect(fetchMock.mock.calls[4]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/rapport`);
    expect(screen.getByRole('button', { name: /modifier mes réponses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retour aux pièces/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /modifier mes réponses/i }));

    expect(await screen.findByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /grille de contrôle/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    const optionalCriterion = screen.getByTestId('criterion-card-5');
    fireEvent.click(within(optionalCriterion).getByRole('button', { name: /^oui$/i }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /résultat/i })).toBeDisabled();
    });
  });

  it('affiche le rapport d’échec avec les critères obligatoires non validés', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: true },
      {
        body: {
          resultat: false,
          points_totaux_obligatoires: 194,
          points_minimaux_obligatoires: 185,
          points_obligatoires_obtenus: 120,
          points_obligatoires_atteints: false,
          points_obligatoires_a_compenser: 65,
          points_optionnels_disponibles: 113,
          points_optionnels_necessaires: 23,
          points_optionnels_a_atteindre: 208,
          points_optionnels_obtenus: 10,
          points_optionnels_atteints: false,
          criteres_obligatoires_non_valides: [95],
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByRole('tab', { name: /résultat/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByText(/classement 3 étoiles ne semble pas encore atteint/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/120 \/ 194/i)).toBeInTheDocument();
    expect(screen.getByText(/10 \/ 113/i)).toBeInTheDocument();
    expect(screen.getByText(/208 points à atteindre/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^non validé$/i)).toHaveLength(2);
    expect(screen.queryByText(/seuil obligatoire non atteint/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/objectif optionnel non atteint/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /il vous manque 65 points obligatoires pour atteindre le seuil minimum requis en 3 étoiles/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /critères obligatoires non validés/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/voici les critères obligatoires non validés pour votre simulation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/critère 95/i)).toBeInTheDocument();
    expect(screen.getByText(/les sanitaires .* sont propres et en bon état/i)).toBeInTheDocument();
    expect(screen.getByText('5 points')).toBeInTheDocument();
    expect(fetchMock.mock.calls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/verifier`);
    expect(fetchMock.mock.calls[4]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/rapport`);

    fireEvent.click(screen.getByRole('button', { name: /voir dans la grille/i }));

    expect(await screen.findByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.getByText(/uniquement 1 critère signalé dans le résultat/i)).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-95')).toBeInTheDocument();
    expect(screen.queryByTestId('criterion-card-5')).not.toBeInTheDocument();
  });
});
