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

  it('active la grille de contrôle et permet de revenir aux pièces', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithPiecesResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    expect(
      await screen.findByRole('heading', { name: /^grille de contrôle$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/critères renseignés/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rechercher un critère/i)).toBeInTheDocument();

    const surfaceCriterion = screen.getByTestId('criterion-card-1');
    expect(
      within(surfaceCriterion).getByText(/ce point est alimenté par les pièces du logement/i)
    ).toBeInTheDocument();
    expect(
      within(surfaceCriterion).queryByRole('button', { name: /^oui/i })
    ).not.toBeInTheDocument();

    const notApplicableCriterion = screen.getByTestId('criterion-card-23');
    expect(
      within(notApplicableCriterion).getByText(/ce critère n’est pas applicable/i)
    ).toBeInTheDocument();
    expect(
      within(notApplicableCriterion).queryByRole('button', { name: /non applicable/i })
    ).not.toBeInTheDocument();

    const optionalCriterion = screen.getByTestId('criterion-card-5');
    expect(
      within(optionalCriterion).getByRole('button', { name: /^non applicable/i })
    ).toBeInTheDocument();

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
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      {
        body: {
          num_critere: 5,
          statut_validation: 'VALIDE',
          statut_critere: 'OPTIONNEL',
          commentaire: 'non affiché',
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    fireEvent.click(screen.getByRole('button', { name: /passer à la grille de contrôle/i }));

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    fireEvent.click(within(optionalCriterion).getByRole('button', { name: /^oui/i }));

    expect(await screen.findByText(/réponse enregistrée/i)).toBeInTheDocument();
    expect(
      within(optionalCriterion).getByRole('button', { name: /oui sélectionné/i })
    ).toBeInTheDocument();

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
