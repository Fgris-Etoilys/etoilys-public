import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import structureGrilleRaw from '../../docs/structureGrille.json?raw';

const analyticsMock = vi.hoisted(() => ({
  acceptAnalyticsConsent: vi.fn(),
  getAnalyticsConsentStatus: vi.fn(() => null),
  rejectAnalyticsConsent: vi.fn(),
  trackClassementSimulatorCalculated: vi.fn(),
  trackClassementSimulatorGridProgressReached: vi.fn(),
  trackClassementSimulatorGridResponseSaved: vi.fn(),
  trackClassementSimulatorHelpOpened: vi.fn(),
  trackClassementSimulatorPdfExported: vi.fn(),
  trackClassementSimulatorPieceDeleted: vi.fn(),
  trackClassementSimulatorPieceSaved: vi.fn(),
  trackClassementSimulatorResumed: vi.fn(),
  trackClassementSimulatorResultBlocked: vi.fn(),
  trackClassementSimulatorResultRequested: vi.fn(),
  trackClassementSimulatorStepViewed: vi.fn(),
  trackCtaClick: vi.fn(),
  trackPageView: vi.fn(),
}));

vi.mock('../utils/analytics', () => ({
  acceptAnalyticsConsent: analyticsMock.acceptAnalyticsConsent,
  getAnalyticsConsentStatus: analyticsMock.getAnalyticsConsentStatus,
  rejectAnalyticsConsent: analyticsMock.rejectAnalyticsConsent,
  normalizeAnalyticsPath: (value: string | null | undefined) => {
    if (!value) return '/';
    const pathname = new URL(value, 'https://www.etoilys.fr').pathname;
    return /^\/simulateur\/[^/]+\/?$/.test(pathname) ? '/simulateur/:simulationId' : pathname;
  },
  trackClassementSimulatorCalculated: analyticsMock.trackClassementSimulatorCalculated,
  trackClassementSimulatorGridProgressReached:
    analyticsMock.trackClassementSimulatorGridProgressReached,
  trackClassementSimulatorGridResponseSaved:
    analyticsMock.trackClassementSimulatorGridResponseSaved,
  trackClassementSimulatorHelpOpened: analyticsMock.trackClassementSimulatorHelpOpened,
  trackClassementSimulatorPdfExported: analyticsMock.trackClassementSimulatorPdfExported,
  trackClassementSimulatorPieceDeleted: analyticsMock.trackClassementSimulatorPieceDeleted,
  trackClassementSimulatorPieceSaved: analyticsMock.trackClassementSimulatorPieceSaved,
  trackClassementSimulatorResumed: analyticsMock.trackClassementSimulatorResumed,
  trackClassementSimulatorResultBlocked: analyticsMock.trackClassementSimulatorResultBlocked,
  trackClassementSimulatorResultRequested: analyticsMock.trackClassementSimulatorResultRequested,
  trackClassementSimulatorStepViewed: analyticsMock.trackClassementSimulatorStepViewed,
  trackCtaClick: analyticsMock.trackCtaClick,
  trackPageView: analyticsMock.trackPageView,
}));

const SIMULATION_ID = 'simulation-id';
const gridModelResponse = JSON.parse(structureGrilleRaw) as unknown;

const gridCriteria = (() => {
  const structure = gridModelResponse as {
    chapitres?: Array<{
      sous_chapitres?: Array<{
        rubriques?: Array<{
          criteres?: Array<{
            num_critere: number;
            categories?: Array<{ nom: string; statut: string }>;
          }>;
        }>;
      }>;
    }>;
  };

  return (
    structure.chapitres?.flatMap(
      (chapter) =>
        chapter.sous_chapitres?.flatMap(
          (subChapter) => subChapter.rubriques?.flatMap((rubrique) => rubrique.criteres ?? []) ?? []
        ) ?? []
    ) ?? []
  );
})();

const applicableCriteriaFor3Stars = gridCriteria.filter(
  (criterion) =>
    criterion.categories?.find((category) => category.nom === '3*')?.statut !== 'NON_APPLICABLE'
);

const simulationResponse = {
  id: SIMULATION_ID,
  statut: 'BROUILLON',
  grille: {
    categorie_demandee: '3*',
    capacite_accueil: 4,
    type_habitation: 'INDIVIDUEL',
    etage: 1,
  },
};

const draftSimulationResponse = {
  ...simulationResponse,
  statut: 'BROUILLON',
};

const favorableSimulationResponse = {
  ...simulationResponse,
  statut: 'FAVORABLE',
};

const defavorableSimulationResponse = {
  ...simulationResponse,
  statut: 'DEFAVORABLE',
};

const completionRequiredSimulationResponse = {
  ...simulationResponse,
  statut: 'A_COMPLETER',
};

const recalculationRequiredSimulationResponse = {
  ...simulationResponse,
  statut: 'A_RECALCULER',
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

const simulationWithBackendPrefilledUnansweredResponses = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    reponses: applicableCriteriaFor3Stars.map((criterion) => ({
      num_critere: criterion.num_critere,
      points_obtenus: 0,
      statut_validation:
        criterion.num_critere === 1 ? 'VALIDE' : criterion.num_critere === 2 ? 'NON_VALIDE' : null,
      statut_critere: criterion.categories?.find((category) => category.nom === '3*')?.statut,
    })),
  },
};

const simulationWithCompleteGridResponses = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    reponses: applicableCriteriaFor3Stars.map((criterion) => ({
      num_critere: criterion.num_critere,
      points_obtenus: criterion.num_critere,
      statut_validation: 'VALIDE',
      statut_critere: criterion.categories?.find((category) => category.nom === '3*')?.statut,
    })),
  },
};

const simulationWithInvalidBackendResponseAndValidNoResponse = {
  ...simulationResponse,
  grille: {
    ...simulationResponse.grille,
    reponses: [
      {
        num_critere: 1,
        points_obtenus: 0,
        statut_validation: 'VALIDE',
        statut_critere: 'OBLIGATOIRE',
      },
      {
        num_critere: 2,
        points_obtenus: 0,
        statut_validation: 'NON_VALIDE',
        statut_critere: 'OPTIONNEL',
      },
      {
        num_critere: 5,
        points_obtenus: 0,
        statut_validation: 'NON_VALIDE',
        statut_critere: 'OPTIONNEL',
      },
      {
        num_critere: 6,
        points_obtenus: 0,
        statut_validation: '',
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

const completeLogementResponse = {
  id: 'logement-id',
  nb_pieces_habitation: 2,
  surface_totale: 42,
  pieces: [
    {
      id: 'piece-complete-bedroom',
      nom: 'Chambre 1',
      type_piece: 'CHAMBRE',
      surface: 24,
      ouvrant: true,
      prise: true,
      ventilation: true,
      type_literie: null,
      nombre_lits: 4,
      format_lits: null,
      literie: true,
      surface_minimum_atteinte: true,
      capacite_lits_atteinte: true,
    },
    {
      id: 'piece-complete-bathroom',
      nom: 'Salle de bain 1',
      type_piece: 'SALLE_DE_BAIN',
      surface: 6,
      ouvrant: true,
      prise: true,
      ventilation: true,
      type_literie: null,
      nombre_lits: null,
      format_lits: null,
      literie: false,
      surface_minimum_atteinte: true,
      capacite_lits_atteinte: true,
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

const successfulRapportResponse = {
  resultat: true,
  points_totaux_obligatoires: 180,
  points_obligatoires_obtenus: 160,
  points_minimaux_obligatoires: 140,
  points_obligatoires_atteints: true,
  points_optionnels_disponibles: 175,
  points_optionnels_obtenus: 160,
  points_optionnels_necessaires: 15,
  points_optionnels_a_atteindre: 155,
  points_optionnels_atteints: true,
  criteres_obligatoires_non_valides: [],
};

const failedVerificationResponse = {
  nb_couchages_suffisants: false,
  salle_de_bain_presente: false,
  criteres_obligatoires_a_cocher: {
    criteres_non_coches: [95],
  },
  criteres_optionnels_a_cocher: {
    criteres_non_coches: [5],
  },
  commentaires_obligatoires_a_fournir: {
    commentaires_obligatoires_non_fournis: [7],
  },
};

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const mockFetchJsonSequence = (responses: Array<{ body: unknown; status?: number }>) => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  const queuedResponses = [...responses];

  fetchMock.mockImplementation((input) => {
    const url = String(input);

    if (url.includes('/public/simulations/modele')) {
      const nextResponse = queuedResponses[0];
      if (
        nextResponse &&
        (nextResponse.status ?? 200) >= 400 &&
        typeof nextResponse.body === 'object' &&
        nextResponse.body !== null &&
        'error' in nextResponse.body
      ) {
        queuedResponses.shift();
        return Promise.resolve(createJsonResponse(nextResponse.body, nextResponse.status ?? 500));
      }

      if (
        nextResponse &&
        typeof nextResponse.body === 'object' &&
        nextResponse.body !== null &&
        'chapitres' in nextResponse.body
      ) {
        queuedResponses.shift();
        return Promise.resolve(createJsonResponse(nextResponse.body, nextResponse.status ?? 200));
      }

      return Promise.resolve(createJsonResponse(gridModelResponse));
    }

    const response = queuedResponses.shift();
    if (!response) {
      return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
    }

    return Promise.resolve(createJsonResponse(response.body, response.status ?? 200));
  });

  return fetchMock;
};

const getNonModelFetchCalls = (fetchMock: ReturnType<typeof mockFetchJsonSequence>) =>
  fetchMock.mock.calls.filter(([url]) => !String(url).includes('/public/simulations/modele'));

const getModelFetchCalls = (fetchMock: ReturnType<typeof mockFetchJsonSequence>) =>
  fetchMock.mock.calls.filter(([url]) => String(url).includes('/public/simulations/modele'));

const renderAt = (path: string, state?: unknown) => {
  window.history.pushState(state === undefined ? {} : { usr: state }, 'Test page', path);
  return render(<App />);
};

const clickGoToGrid = () => {
  const [primaryGoToGridButton] = screen.getAllByRole('button', {
    name: /passer à la grille de contrôle/i,
  });

  if (!primaryGoToGridButton) {
    throw new Error('Bouton de passage à la grille introuvable.');
  }

  fireEvent.click(primaryGoToGridButton);
};

const expandSimulationParameters = async () => {
  const toggle = await screen.findByRole('button', { name: /modifier les paramètres/i });
  fireEvent.click(toggle);
};

describe('SimulationClassement', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    Object.values(analyticsMock).forEach((mock) => mock.mockClear());
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
      expect(getModelFetchCalls(fetchMock).map(([url]) => String(url))).toContain(
        '/api/public/simulations/modele?classementDemande=3*'
      );
    });
    expect(screen.getByText(/ÉTAPE 1.*PIÈCES DU LOGEMENT/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /renseignez les pièces de votre logement/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Ajoutez les pièces de votre logement avec leur surface et les couchages éventuels/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Vous pourrez modifier ces informations à tout moment/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^ajouter une pièce$/i })).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /passer à la grille de contrôle/i }).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /modifier les paramètres/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    await expandSimulationParameters();
    expect(screen.getByRole('button', { name: /masquer les paramètres/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(
      screen.getByText(
        /ces paramètres peuvent modifier les critères applicables et le résultat de la simulation/i
      )
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/classement demandé/i)).toHaveValue('3*');
      expect(screen.getByLabelText(/capacité d’accueil/i)).toHaveValue(4);
      expect(screen.getByLabelText(/type d’habitation/i)).toHaveValue('INDIVIDUEL');
      expect(screen.getByLabelText(/étage/i)).toHaveValue('1');
    });
    expect(screen.getAllByText(/3 étoiles/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/4 personnes/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/surface totale renseignée/i)).toBeInTheDocument();
    expect(screen.queryByText(/pièces ajoutées/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/32 m²/i)[0]).toBeInTheDocument();
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
    expect(screen.getByText(/^Ajouter un espace extérieur$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter une pièce intérieure/i })).toHaveClass(
      'min-h-52'
    );
    expect(
      screen.getByRole('button', { name: /ajouter une pièce intérieure/i }).className
    ).not.toContain('aspect-square');
    fireEvent.click(screen.getByRole('button', { name: /^ajouter une pièce$/i }));
    expect(screen.getByRole('dialog', { name: /ajouter une pièce/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('CHAMBRE');

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/public/simulations/${SIMULATION_ID}`,
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/public/simulations/${SIMULATION_ID}/logement`,
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
    expect(analyticsMock.trackClassementSimulatorResumed).toHaveBeenCalledWith({
      entryPoint: 'direct',
      requestedCategory: '3*',
      capacity: 4,
    });
  });

  it('ne retracke pas une reprise déjà trackée depuis une carte', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: logementWithPiecesResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`, {
      classementSimulatorEntryPoint: 'resume_card',
    });

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    expect(analyticsMock.trackClassementSimulatorResumed).not.toHaveBeenCalled();
  });

  it('affiche un bloc de passage à la grille quand aucun warning de pièce n’est présent', async () => {
    mockFetchJsonSequence([{ body: simulationResponse }, { body: completeLogementResponse }]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByText(/^Vous pouvez passer à la grille de contrôle\.$/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Lorsque vous avez terminé de renseigner les pièces de votre logement, vous pouvez commencer à compléter la grille\. Vous pourrez revenir modifier les pièces à tout moment\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/certaines informations du logement restent à compléter/i)
    ).not.toBeInTheDocument();
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

    await expandSimulationParameters();
    const requestedCategorySelect = await screen.findByLabelText(/classement demandé/i);
    fireEvent.change(requestedCategorySelect, { target: { value: '4*' } });

    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(4);
    });
    const nonModelCalls = getNonModelFetchCalls(fetchMock);
    expect(nonModelCalls[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/classementDemande/4*`
    );
    expect(nonModelCalls[2]?.[1]).toMatchObject({
      method: 'PUT',
      credentials: 'include',
    });
    expect(nonModelCalls[3]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(requestedCategorySelect).toHaveValue('4*');
    await waitFor(() => {
      const modelUrls = getModelFetchCalls(fetchMock).map(([url]) => String(url));
      expect(modelUrls).toContain('/api/public/simulations/modele?classementDemande=3*');
      expect(modelUrls).toContain('/api/public/simulations/modele?classementDemande=4*');
    });
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();

    clickGoToGrid();

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    expect(within(optionalCriterion).getByRole('button', { name: /^oui$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('compte seulement les critères réellement renseignés quand le backend préremplit la grille', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationWithBackendPrefilledUnansweredResponses },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    const totalApplicableCriteria = applicableCriteriaFor3Stars.length;
    expect(
      await screen.findByText(
        new RegExp(`2 critères sur ${totalApplicableCriteria} renseignés`, 'i')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`^2 / ${totalApplicableCriteria}$`, 'i'))
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        new RegExp(`^${totalApplicableCriteria} / ${totalApplicableCriteria}$`, 'i')
      )
    ).not.toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
  });

  it('compte NON_VALIDE comme renseigné mais ignore les validations backend non exploitables', async () => {
    mockFetchJsonSequence([
      { body: simulationWithInvalidBackendResponseAndValidNoResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    const totalApplicableCriteria = applicableCriteriaFor3Stars.length;
    expect(
      await screen.findByText(
        new RegExp(`3 critères sur ${totalApplicableCriteria} renseignés`, 'i')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`^3 / ${totalApplicableCriteria}$`, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(String(totalApplicableCriteria - 3))).toBeInTheDocument();
  });

  it('met à jour la capacité seulement au blur', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: simulationWithUpdatedCapacity },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await expandSimulationParameters();
    const capacityInput = await screen.findByLabelText(/capacité d’accueil/i);
    fireEvent.change(capacityInput, { target: { value: '6' } });

    await waitFor(() => {
      expect(capacityInput).toHaveValue(6);
    });
    expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);

    fireEvent.blur(capacityInput);

    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(4);
    });
    const nonModelCalls = getNonModelFetchCalls(fetchMock);
    expect(nonModelCalls[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/capaciteAccueil/6`
    );
    expect(nonModelCalls[2]?.[1]).toMatchObject({
      method: 'PUT',
      credentials: 'include',
    });
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();
  });

  it('recalcule automatiquement le résultat après modification d’un paramètre depuis l’onglet résultat', async () => {
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
    clickGoToGrid();
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
    scrollToMock.mockClear();

    await expandSimulationParameters();
    fireEvent.change(screen.getByLabelText(/étage/i), { target: { value: '2' } });

    expect(screen.getByRole('heading', { name: /recalcul en cours/i })).toBeInTheDocument();
    expect(screen.getByText(/les paramètres modifiés sont pris en compte/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(8);
    });
    const nonModelCalls = getNonModelFetchCalls(fetchMock);
    expect(nonModelCalls[4]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/etage/2`);
    expect(nonModelCalls[5]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(nonModelCalls[6]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/verifier`);
    expect(nonModelCalls[7]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/rapport`);
    expect(
      await screen.findByText(/classement 3 étoiles ne semble pas encore atteint/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /résultat à recalculer/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('recharge le modèle de grille du nouveau classement avant un recalcul automatique', async () => {
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
      { body: simulationWithUpdatedRequestedCategory },
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
    clickGoToGrid();
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();

    await expandSimulationParameters();
    fireEvent.change(screen.getByLabelText(/classement demandé/i), { target: { value: '4*' } });

    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(8);
    });

    const allUrls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(allUrls).toContain('/api/public/simulations/modele?classementDemande=3*');
    expect(allUrls).toContain('/api/public/simulations/modele?classementDemande=4*');
    expect(allUrls.lastIndexOf('/api/public/simulations/modele?classementDemande=4*')).toBeLessThan(
      allUrls.lastIndexOf(`/api/public/simulations/${SIMULATION_ID}/verifier`)
    );
    expect(
      await screen.findByText(/classement 4 étoiles ne semble pas encore atteint/i)
    ).toBeInTheDocument();
  });

  it('marque le résultat existant à recalculer après modification d’un paramètre hors onglet résultat', async () => {
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
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /grille de contrôle/i }));

    await expandSimulationParameters();
    fireEvent.change(screen.getByLabelText(/étage/i), { target: { value: '2' } });

    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(6);
    });
    const nonModelCalls = getNonModelFetchCalls(fetchMock);
    expect(nonModelCalls[4]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/etage/2`);
    expect(nonModelCalls[5]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(nonModelCalls.slice(4).some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(nonModelCalls.slice(4).some(([url]) => String(url).includes('/rapport'))).toBe(false);

    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));
    expect(
      await screen.findByRole('heading', { name: /résultat à recalculer/i })
    ).toBeInTheDocument();
  }, 10000);

  it('conserve le paramètre et garde le résultat accessible si un refetch secondaire échoue', async () => {
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
    clickGoToGrid();
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(await screen.findByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();

    await expandSimulationParameters();
    const housingTypeSelect = screen.getByLabelText(/type d’habitation/i);
    fireEvent.change(housingTypeSelect, { target: { value: 'COLLECTIF' } });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /certaines données de la simulation n’ont pas pu être actualisées/i
    );
    const nonModelCalls = getNonModelFetchCalls(fetchMock);
    expect(nonModelCalls[4]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/typeHabitation/COLLECTIF`
    );
    expect(nonModelCalls[5]?.[0]).toBe(`/api/public/simulations/${SIMULATION_ID}/logement`);
    expect(housingTypeSelect).toHaveValue('COLLECTIF');
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();
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
    expect(screen.getByRole('button', { name: /^ajouter une pièce$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));

    const interiorDialog = screen.getByRole('dialog', { name: /ajouter une pièce/i });
    const modalOverlay = screen.getByTestId('piece-modal-overlay');
    expect(interiorDialog).toBeInTheDocument();
    expect(modalOverlay).toHaveClass('fixed', 'inset-0', 'z-[80]', 'min-h-dvh');
    expect(document.body.style.overflow).toBe('hidden');
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
    expect(document.body.style.overflow).toBe('');
    fireEvent.click(screen.getByRole('button', { name: /ajouter un espace extérieur/i }));

    expect(screen.getByLabelText(/type de pièce/i)).toHaveValue('TERRASSE_OU_JARDIN_PRIVE');
    expect(screen.queryByRole('option', { name: /^chambre$/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre de personnes pouvant dormir/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('switch', { name: /ouvrant vers l’extérieur/i })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
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

    expect(screen.getByLabelText(/surface en m²/i)).toHaveClass('h-12');
    expect(screen.getByLabelText(/nombre de personnes pouvant dormir/i)).toHaveClass('h-12');
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

    const createCall = getNonModelFetchCalls(fetchMock)[2];
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

    expect(getNonModelFetchCalls(fetchMock)[3]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}`
    );

    clickGoToGrid();

    const surfaceCriterion = await screen.findByTestId('criterion-card-1');
    expect(within(surfaceCriterion).getByText(/^validé$/i)).toHaveClass('text-success-500');
    expect(
      within(surfaceCriterion).queryByRole('button', { name: /^oui$/i })
    ).not.toBeInTheDocument();
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
    expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
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
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
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

    const createCall = getNonModelFetchCalls(fetchMock)[2];
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

    const updateCall = getNonModelFetchCalls(fetchMock)[2];
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
    expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
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

    const updateCall = getNonModelFetchCalls(fetchMock)[2];
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

  it('affiche un message spécifique si le type de pièce est refusé par le backend', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: { code: 'PIECE_TYPE_NOT_ALLOWED', message: 'Type refusé' }, status: 400 },
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
      await screen.findByText(/ce type de pièce n’est pas autorisé pour cette simulation/i)
    ).toBeInTheDocument();
  });

  it('affiche un message spécifique si une limite de type de pièce est atteinte', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
      { body: { code: 'TOO_MANY_CORRIDORS', message: 'Limite atteinte' }, status: 409 },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    fireEvent.click(screen.getByRole('button', { name: /ajouter une pièce intérieure/i }));
    fireEvent.change(screen.getByLabelText(/surface en m²/i), { target: { value: '12' } });
    fireEvent.click(screen.getByRole('button', { name: /ajouter cette pièce/i }));

    expect(
      await screen.findByText(/la limite de couloirs et dégagements est déjà atteinte/i)
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

    const deleteCall = getNonModelFetchCalls(fetchMock)[2];
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

  it('permet le passage à la grille sans pièce complète avec un warning doux', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: emptyLogementResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    const emptyPiecesWarning = await screen.findByText(/aucune pièce n’a encore été ajoutée/i);
    const piecesHeading = screen.getByRole('heading', { name: /pièces du logement/i });
    const goToGridButtons = screen.getAllByRole('button', {
      name: /passer à la grille de contrôle/i,
    });

    expect(goToGridButtons).toHaveLength(2);
    expect(
      Boolean(
        piecesHeading.compareDocumentPosition(emptyPiecesWarning) & Node.DOCUMENT_POSITION_FOLLOWING
      )
    ).toBe(true);
    expect(
      Boolean(
        emptyPiecesWarning.compareDocumentPosition(goToGridButtons[1]!) &
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    ).toBe(true);
    expect(screen.queryByText(/aucune surface de pièce/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/aucune cuisine/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/aucun WC/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/aucune pièce d’habitation/i)).not.toBeInTheDocument();

    clickGoToGrid();

    expect(
      screen.queryByText(/certaines informations semblent incomplètes/i)
    ).not.toBeInTheDocument();
    expect(await screen.findByLabelText(/rechercher un critère/i)).toBeInTheDocument();
  });

  it('permet de réessayer si le modèle de grille ne charge pas', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationWithAutomaticSurfaceResponses },
      { body: logementWithPiecesResponse },
      { body: { error: 'Server error' }, status: 500 },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    expect(
      await screen.findByRole('heading', { name: /grille de contrôle indisponible/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(
      await screen.findByRole('heading', { name: /complétez la grille de contrôle/i })
    ).toBeInTheDocument();
    expect(
      getModelFetchCalls(fetchMock).filter(
        ([url]) => String(url) === '/api/public/simulations/modele?classementDemande=3*'
      )
    ).toHaveLength(2);
  });

  it('affiche une erreur sans retry si la catégorie demandée est invalide', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationWithUnknownRequestedCategory },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    expect(
      await screen.findByRole('heading', { name: /grille de contrôle indisponible/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/chargement de la grille de contrôle/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /réessayer/i })).not.toBeInTheDocument();
    expect(getModelFetchCalls(fetchMock)).toHaveLength(0);
  });

  it('active la grille de contrôle et permet de revenir aux pièces', async () => {
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    const fetchMock = mockFetchJsonSequence([
      { body: simulationWithAutomaticSurfaceResponses },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    expect(
      await screen.findByRole('heading', { name: /complétez la grille de contrôle/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/ÉTAPE 2.*GRILLE DE CONTRÔLE/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Renseignez les critères de contrôle selon les équipements, services et caractéristiques réellement présents/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cliquez sur l’icône livre pour afficher des explications complémentaires/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Besoin d’aide sur un critère/i)).toBeInTheDocument();
    expect(screen.getByText(/Critères renseignés/i)).toBeInTheDocument();
    expect(screen.getByText(/Critères restants/i)).toBeInTheDocument();
    expect(screen.queryByText(/Obligatoires non renseignés/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuer la grille/i })).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /voir le résultat de ma simulation/i })[0]
    ).toHaveClass('bg-transparent');
    expect(screen.getByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.queryByText(/réponse actuelle/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continuer la grille/i }));
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
    expect(
      scrollIntoViewMock.mock.contexts.some(
        (element) => element instanceof HTMLElement && element.dataset.testid === 'criterion-card-3'
      )
    ).toBe(true);

    const tableOfContents = screen.getByRole('navigation', { name: /sommaire de la grille/i });
    expect(
      within(tableOfContents).getAllByText(/chapitre 1 : équipements et aménagements/i)
    ).toHaveLength(1);
    const firstSectionButton = within(tableOfContents).getByRole('button', {
      name: /1\.1 aménagement général/i,
    });
    expect(firstSectionButton).toBeInTheDocument();
    expect(firstSectionButton).toHaveAttribute('aria-current', 'true');
    expect(firstSectionButton).toHaveClass('bg-primary-100');
    expect(tableOfContents).toHaveClass('table-of-contents-scrollbar');

    const firstManualCriterion = screen.getByTestId('criterion-card-3');
    fireEvent.click(
      within(firstManualCriterion).getByRole('button', {
        name: /afficher l’aide du critère 3/i,
      })
    );

    const helpDialog = await screen.findByRole('dialog', { name: /aide - critère 3/i });
    expect(helpDialog).toBeInTheDocument();
    expect(
      within(helpDialog).getByText(/Prise de courant libre dans chaque pièce/i)
    ).toBeInTheDocument();
    expect(within(helpDialog).getByText(/Méthodologie d'évaluation/i)).toBeInTheDocument();
    expect(
      within(helpDialog).getByText(/Si cette même prise libre est située dans la chambre/i)
    ).toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);

    fireEvent.click(within(helpDialog).getByRole('button', { name: /fermer l’aide du critère/i }));
    expect(screen.queryByRole('dialog', { name: /aide - critère 3/i })).not.toBeInTheDocument();

    const sectionSelect = screen.getByLabelText(/aller à une section/i);
    const optionGroups = Array.from(sectionSelect.querySelectorAll('optgroup'));
    expect(optionGroups.map((group) => group.label)).toContain(
      'Chapitre 1 : Équipements et aménagements'
    );
    expect(optionGroups[0]?.querySelector('option')?.textContent).toMatch(
      /1\.1 aménagement général/i
    );

    const surfaceCriterion = screen.getByTestId('criterion-card-1');
    expect(within(surfaceCriterion).getByText(/calculé automatiquement/i)).toBeInTheDocument();
    expect(
      within(surfaceCriterion).getByRole('heading', { name: /surface totale minimum/i })
    ).toHaveClass('text-base');
    expect(within(surfaceCriterion).getByText(/statut actuel/i)).toBeInTheDocument();
    expect(within(surfaceCriterion).getByText(/^validé$/i)).toHaveClass('text-success-500');
    expect(
      within(surfaceCriterion).queryByRole('button', { name: /^oui$/i })
    ).not.toBeInTheDocument();
    expect(
      within(surfaceCriterion).queryByRole('button', { name: /^non$/i })
    ).not.toBeInTheDocument();

    const optionalSurfaceCriterion = screen.getByTestId('criterion-card-2');
    expect(within(optionalSurfaceCriterion).getByText(/statut actuel/i)).toBeInTheDocument();
    expect(within(optionalSurfaceCriterion).getByText(/^non validé$/i)).toHaveClass(
      'text-alert-500'
    );
    expect(
      within(optionalSurfaceCriterion).queryByRole('button', { name: /^non$/i })
    ).not.toBeInTheDocument();

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
    expect(screen.getAllByRole('button', { name: /ajouter une pièce/i })[0]).toBeInTheDocument();
  }, 10000);

  it('garde le résultat en CTA principal unique dans le bloc grille quand la grille est complète', async () => {
    mockFetchJsonSequence([
      { body: simulationWithCompleteGridResponses },
      { body: completeLogementResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    expect(
      await screen.findByRole('heading', { name: /complétez la grille de contrôle/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continuer la grille/i })).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /voir le résultat de ma simulation/i })[0]
    ).toHaveClass('bg-primary-400');
    expect(screen.getByText(/^0$/i)).toBeInTheDocument();
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
    clickGoToGrid();

    const optionalCriterion = await screen.findByTestId('criterion-card-5');
    fireEvent.click(within(optionalCriterion).getByRole('button', { name: /^oui/i }));

    const selectedYesButton = within(optionalCriterion).getByRole('button', { name: /^oui$/i });
    expect(selectedYesButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText(/réponse enregistrée/i)).not.toBeInTheDocument();
    expect(
      within(optionalCriterion).queryByRole('button', { name: /oui sélectionné/i })
    ).not.toBeInTheDocument();

    const responseCall = getNonModelFetchCalls(fetchMock)[2];
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
    expect(analyticsMock.trackClassementSimulatorGridResponseSaved).toHaveBeenCalledTimes(1);
    expect(analyticsMock.trackClassementSimulatorGridResponseSaved).toHaveBeenCalledWith(
      expect.objectContaining({
        criterionNumber: 5,
        criterionStatus: 'OPTIONNEL',
        validationStatus: 'VALIDE',
      })
    );
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
    clickGoToGrid();

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
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(5);
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
          salle_de_bain_presente: false,
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
    clickGoToGrid();
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
    expect(
      screen.queryByRole('heading', { name: /prêt pour une visite officielle/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/2 critères n’ont pas encore été renseignés/i)).toBeInTheDocument();
    expect(
      screen.getByText(/permettent actuellement d’accueillir 2 personnes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/indiquée est de 4 personnes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/aucune salle de bain n’est renseignée dans les pièces du logement/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/commentaire/i)).not.toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verifier`
    );
    expect(getNonModelFetchCalls(fetchMock)[3]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verification`
    );
    expect(analyticsMock.trackClassementSimulatorResultBlocked).toHaveBeenCalledWith(
      expect.objectContaining({
        hasSleepingCapacityIssue: true,
        hasBathroomIssue: true,
        hasMissingCriteria: true,
      })
    );
    expect(analyticsMock.trackClassementSimulatorCalculated).not.toHaveBeenCalled();

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
    expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /afficher toute la grille/i }));
    expect(await screen.findByTestId('criterion-card-6')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));
    expect(
      await screen.findByRole('heading', { name: /résultat à recalculer/i })
    ).toBeInTheDocument();
  });

  it('ne propose pas de simulation de résultat mockée dans la grille', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();

    expect(screen.queryByRole('button', { name: /simuler le résultat/i })).not.toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
    });
    expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
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
          points_optionnels_disponibles: 175,
          points_optionnels_obtenus: 160,
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
    clickGoToGrid();
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
    const resultTab = screen.getByRole('tab', { name: /résultat/i });
    expect(within(resultTab).getByText(/classement atteint/i)).toBeInTheDocument();
    expect(resultTab.querySelector('.text-success-400')).not.toBeNull();
    expect(screen.getByText(/^160 \/ 140 requis$/i)).toBeInTheDocument();
    expect(screen.getByText(/^160 \/ 155 requis$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^objectif atteint$/i)).toHaveLength(2);
    expect(screen.queryByText(/seuil obligatoire atteint/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/objectif optionnel atteint/i)).not.toBeInTheDocument();
    expect(screen.getByText(/175 points maximum disponibles/i)).toBeInTheDocument();
    expect(screen.queryByText(/points obtenus sur .* points disponibles/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Seuil minimal$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Points obtenus$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Points nécessaires$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Points disponibles$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Objectif à atteindre$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/critères à corriger en priorité/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /prêt pour une visite officielle/i })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: /demande de classement/i })
        .some((link) => link.getAttribute('href') === '/demande-classement')
    ).toBe(true);
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verifier`
    );
    expect(getNonModelFetchCalls(fetchMock)[3]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/rapport`
    );
    expect(analyticsMock.trackClassementSimulatorResultRequested).toHaveBeenCalledTimes(1);
    expect(analyticsMock.trackClassementSimulatorCalculated).toHaveBeenCalledWith(
      expect.objectContaining({ resultOutcome: 'favorable' })
    );
    expect(analyticsMock.trackClassementSimulatorResultBlocked).not.toHaveBeenCalled();
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
      expect(screen.getByRole('tab', { name: /résultat/i })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));
    expect(
      await screen.findByRole('heading', { name: /résultat à recalculer/i })
    ).toBeInTheDocument();
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
    clickGoToGrid();
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
    const resultTab = screen.getByRole('tab', { name: /résultat/i });
    expect(within(resultTab).getByText(/calcul à jour/i)).toBeInTheDocument();
    expect(resultTab.querySelector('.text-success-400')).toBeNull();
    expect(
      screen.getByRole('heading', { name: /critères obligatoires non validés/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/^120 \/ 185 requis$/i)).toBeInTheDocument();
    expect(screen.getByText(/^10 \/ 208 requis$/i)).toBeInTheDocument();
    expect(screen.getByText(/113 points maximum disponibles/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /prêt pour une visite officielle/i })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: /demande de classement/i })
        .some((link) => link.getAttribute('href') === '/demande-classement')
    ).toBe(true);
    expect(screen.getByText(/^il manque 65 points$/i)).toBeInTheDocument();
    expect(screen.getByText(/^il manque 198 points$/i)).toBeInTheDocument();
    expect(
      screen
        .getByText(/^120 \/ 185 requis$/i)
        .compareDocumentPosition(
          screen.getByRole('heading', { name: /critères obligatoires non validés/i })
        ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.queryByText(/^non validé$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/seuil obligatoire non atteint/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/objectif optionnel non atteint/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /il vous manque 65 points obligatoires pour atteindre le classement 3 étoiles/i
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/il vous manque 198 points optionnels pour atteindre l’objectif requis/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/les points manquants peuvent être obtenus en validant certains critères/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/ces critères peuvent empêcher l’obtention du classement demandé/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/critère 95/i)).toBeInTheDocument();
    expect(screen.getByText(/les sanitaires .* sont propres et en bon état/i)).toBeInTheDocument();
    expect(screen.getByText(/^5 points$/i)).toBeInTheDocument();
    expect(screen.queryByText(/peut rapporter/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/-\d+ points/i)).not.toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verifier`
    );
    expect(getNonModelFetchCalls(fetchMock)[3]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/rapport`
    );
    expect(analyticsMock.trackClassementSimulatorCalculated).toHaveBeenCalledWith(
      expect.objectContaining({ resultOutcome: 'defavorable' })
    );
    expect(analyticsMock.trackClassementSimulatorResultBlocked).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /voir dans la grille/i }));

    expect(await screen.findByLabelText(/rechercher un critère/i)).toBeInTheDocument();
    expect(screen.getByText(/uniquement 1 critère signalé dans le résultat/i)).toBeInTheDocument();
    expect(screen.getByTestId('criterion-card-95')).toBeInTheDocument();
    expect(screen.queryByTestId('criterion-card-5')).not.toBeInTheDocument();
  });

  it('affiche un diagnostic fallback sans nombre négatif quand aucun point ne manque', async () => {
    mockFetchJsonSequence([
      { body: simulationResponse },
      { body: logementWithPiecesResponse },
      { body: gridModelResponse },
      { body: true },
      {
        body: {
          resultat: false,
          points_totaux_obligatoires: 194,
          points_minimaux_obligatoires: 185,
          points_obligatoires_obtenus: 190,
          points_obligatoires_atteints: false,
          points_optionnels_disponibles: 220,
          points_optionnels_a_atteindre: 208,
          points_optionnels_obtenus: 215,
          points_optionnels_atteints: false,
          criteres_obligatoires_non_valides: [],
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    await screen.findByRole('heading', { name: /chambre 1/i });
    clickGoToGrid();
    fireEvent.click(
      await screen.findByRole('button', { name: /voir le résultat de ma simulation/i })
    );

    expect(
      await screen.findByRole('heading', { name: /critères obligatoires non validés/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/certains critères doivent encore être vérifiés pour confirmer le résultat/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^objectif atteint$/i)).toHaveLength(2);
    expect(screen.queryByText(/-\d+ points/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/il vous manque/i)).not.toBeInTheDocument();
  });

  it('hydrate automatiquement le rapport existant d’une simulation favorable', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: favorableSimulationResponse },
      { body: logementWithPiecesResponse },
      { body: successfulRapportResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(3);
    });

    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));

    expect(await screen.findByText(/résultat de la simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/classement 3 étoiles semble atteint/i)).toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/rapport`
    );
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
    expect(analyticsMock.trackClassementSimulatorCalculated).not.toHaveBeenCalled();
  });

  it('hydrate automatiquement le rapport existant d’une simulation défavorable', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: defavorableSimulationResponse },
      { body: logementWithPiecesResponse },
      {
        body: {
          ...successfulRapportResponse,
          resultat: false,
          points_obligatoires_atteints: false,
          points_optionnels_atteints: false,
          criteres_obligatoires_non_valides: [95],
        },
      },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(3);
    });

    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));

    expect(await screen.findByText(/résultat de la simulation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/classement 3 étoiles ne semble pas encore atteint/i)
    ).toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/rapport`
    );
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verification'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
  });

  it('n’hydrate aucun résultat automatiquement pour une simulation en brouillon', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: draftSimulationResponse },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));

    expect(await screen.findByRole('heading', { name: /aucun résultat pour le moment/i }));
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
    });
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/rapport'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verification'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
  });

  it('n’hydrate aucun résultat automatiquement pour une simulation à recalculer', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: recalculationRequiredSimulationResponse },
      { body: logementWithPiecesResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));

    expect(await screen.findByRole('heading', { name: /résultat à recalculer/i }));
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(2);
    });
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/rapport'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verification'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
  });

  it('hydrate automatiquement la vérification existante d’une simulation à compléter', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: completionRequiredSimulationResponse },
      { body: logementWithPiecesResponse },
      { body: failedVerificationResponse },
    ]);

    renderAt(`/simulateur/${SIMULATION_ID}`);

    expect(
      await screen.findByRole('heading', { name: /ma simulation de classement/i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getNonModelFetchCalls(fetchMock)).toHaveLength(3);
    });

    fireEvent.click(screen.getByRole('tab', { name: /résultat/i }));

    expect(
      await screen.findByText(/un ou plusieurs problèmes ont été détectés/i)
    ).toBeInTheDocument();
    expect(getNonModelFetchCalls(fetchMock)[2]?.[0]).toBe(
      `/api/public/simulations/${SIMULATION_ID}/verification`
    );
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/rapport'))).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('/verifier'))).toBe(false);
  });
});
