import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
      nombre_lits: 2,
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
    expect(screen.getByRole('heading', { name: /chambre 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /terrasse ou jardin privé/i })).toBeInTheDocument();

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

  it('ouvre le formulaire seulement après clic sur Ajouter une pièce', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: emptyLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    expect(screen.queryByLabelText(/nom de la pièce/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce/i }));

    expect(screen.getByLabelText(/nom de la pièce/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de personnes pouvant dormir/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/type de pièce/i), {
      target: { value: 'CUISINE' },
    });

    expect(screen.queryByLabelText(/nombre de personnes pouvant dormir/i)).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce/i }));
    fireEvent.change(screen.getByLabelText(/nom de la pièce/i), {
      target: { value: 'Chambre bleue' },
    });
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
        nom: 'Chambre bleue',
        nombre_lits: 2,
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
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', { name: /modifier/i })
    );

    fireEvent.change(screen.getByLabelText(/nom de la pièce/i), {
      target: { value: 'Chambre principale' },
    });
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
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', { name: /supprimer/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /supprimer la pièce/i }));

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
      within(screen.getByTestId('piece-card-piece-1')).getByRole('button', { name: /supprimer/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /supprimer la pièce/i }));

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

  it('active la grille placeholder et permet de revenir aux pièces', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithPiecesResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(await screen.findByText(/133 critères à compléter/i)).toBeInTheDocument();
    expect(screen.getByText(/résultat estimatif en fin de simulation/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /revenir aux pièces/i }));
    expect(screen.getByRole('button', { name: /ajouter une pièce/i })).toBeInTheDocument();
  });
});
