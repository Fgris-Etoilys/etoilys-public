import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';

const SIMULATION_ID = 'simulation-id';

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
      capacite_lits_atteinte: true,
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
    expect(screen.getByText(/3 étoiles/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4 personnes/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/surface totale renseignée/i)).toBeInTheDocument();
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
        ouvrant: true,
      }),
    });
    const createPayload = JSON.parse(String(createCall?.[1]?.body)) as Record<string, unknown>;
    expect(createPayload).not.toHaveProperty('nom');
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
      literie: false,
    });
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

  it('active la grille de contrôle et permet de revenir aux pièces', async () => {
    mockFetchJsonSequence([
      { body: simulationWithAutomaticSurfaceResponses },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(
      await screen.findByRole('heading', { name: /^grille de contrôle$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/critères renseignés/i)).toBeInTheDocument();
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

    const responseCall = fetchMock.mock.calls[2];
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
      expect(fetchMock).toHaveBeenCalledTimes(5);
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
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
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
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByRole('heading', { name: /points bloquants/i })).toBeInTheDocument();
    expect(
      screen.getByText(/couchages renseignés ne semblent pas suffisants/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /critère 95/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^critères optionnels$/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /ces critères peuvent améliorer votre score, mais ne sont pas tous obligatoires/i
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/commentaire/i)).not.toBeInTheDocument();
  });

  it('affiche le rapport sans remplacer la grille', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: true },
      {
        body: {
          resultat: true,
          points_obligatoires_obtenus: 160,
          points_minimaux_obligatoires: 140,
          points_obligatoires_atteints: true,
          points_optionnels_obtenus: 20,
          points_optionnels_necessaires: 15,
          points_optionnels_atteints: true,
          criteres_obligatoires_non_valides: [],
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/résultat de la simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/estimation basée sur vos réponses/i)).toBeInTheDocument();
    expect(screen.getByText(/160 \/ 140/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /modifier mes réponses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retour aux pièces/i })).toBeInTheDocument();
  });
});
