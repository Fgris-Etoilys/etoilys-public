import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import structureGrilleRaw from '../../docs/data/structureGrille.json?raw';
import {
  besoin,
  catalogueResponse,
  chambre,
  evaluationResponse,
  FACTUELLE_SIMULATION_ID as ID,
  factuelleSimulationResponse,
  faitsResponse,
  mutationResponse,
  petiteChambre,
  piece,
  salleEau1,
  salleEau2,
} from '../test/factuelleFixtures';
import { expectNoA11yViolations } from '../test/a11y';

vi.setConfig({ testTimeout: 15_000 });

vi.mock('../utils/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/analytics')>();
  const noop = () => undefined;
  return {
    ...actual,
    getAnalyticsConsentStatus: () => null,
    isCookielessAudienceMeasurementEnabled: () => true,
    trackClassementSimulatorPieceDeleted: vi.fn(),
    trackClassementSimulatorPieceSaved: vi.fn(),
    trackClassementSimulatorResumed: noop,
    trackClassementSimulatorStepViewed: noop,
    trackClassementSimulatorGridProgressReached: noop,
    trackPageView: noop,
    trackCtaClick: noop,
  };
});

const BASE = `/api/public/simulations/${ID}`;
const LEGACY_ROUTES = /\/(logement|pieces|reponse|verifier|verification|rapport)(\/|$)/;

type RouteResponse = { body: unknown; status?: number };
type Route = RouteResponse | (() => RouteResponse | Promise<RouteResponse>);
type Calls = Array<{ method: string; url: string; body: unknown }>;

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Réponses par « MÉTHODE url » ; le modèle de grille est toujours servi. */
function mockApi(routes: Record<string, Route | Route[]>) {
  const calls: Calls = [];
  const queues = new Map(
    Object.entries(routes).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value])
  );
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    if (url.includes('/public/simulations/modele')) {
      return jsonResponse(JSON.parse(structureGrilleRaw));
    }
    calls.push({ method, url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    const entry = queues.get(`${method} ${url}`);
    const route = Array.isArray(entry) ? entry.shift() : entry;
    if (!route) {
      throw new TypeError(`Unexpected fetch call: ${method} ${url}`);
    }
    const { body, status } = typeof route === 'function' ? await route() : route;
    if (status === 0) {
      throw new TypeError('Failed to fetch');
    }
    return jsonResponse(body, status ?? 200);
  });
  return { calls, fetchMock };
}

function factuelleRoutes(pieces = [chambre], evaluation = evaluationResponse()) {
  return {
    [`GET ${BASE}`]: { body: factuelleSimulationResponse(evaluation) },
    [`GET ${BASE}/faits`]: { body: faitsResponse(pieces) },
    [`GET ${BASE}/faits/catalogue`]: { body: catalogueResponse },
  };
}

const renderSimulation = () => {
  window.history.pushState({}, 'Test page', `/simulateur/${ID}`);
  return render(<App />);
};

async function openEdit(name: RegExp) {
  fireEvent.click(await screen.findByRole('button', { name }));
  return screen.findByRole('dialog');
}

describe('SimulationClassement — Pièces FACTUELLE', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('charge une simulation FACTUELLE sans appeler aucune route LEGACY, y compris en Grille et Résultat', async () => {
    const { calls } = mockApi(factuelleRoutes([chambre, salleEau1]));
    renderSimulation();

    expect(await screen.findByRole('heading', { name: 'Chambre parentale' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /pièces intérieures\s*1/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: /salles d’eau\s*1/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /pièce renseignée/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /grille de contrôle/i }));
    fireEvent.click(screen.getByRole('tab', { name: /^résultat/i }));
    await waitFor(() => expect(screen.getByRole('tabpanel')).toBeInTheDocument());

    expect(calls.map(({ method, url }) => `${method} ${url}`).sort()).toEqual([
      `GET ${BASE}`,
      `GET ${BASE}/faits`,
      `GET ${BASE}/faits/catalogue`,
    ]);
    expect(calls.some(({ url }) => LEGACY_ROUTES.test(url.replace(BASE, '')))).toBe(false);
  });

  it('garde le parcours LEGACY quand le mode est absent', async () => {
    const { calls } = mockApi({
      [`GET ${BASE}`]: {
        body: { id: ID, statut: 'BROUILLON', grille: { categorie_demandee: '3*' } },
      },
      [`GET ${BASE}/logement`]: { body: { pieces: [] } },
    });
    renderSimulation();

    expect(
      await screen.findByRole('button', { name: /ajouter une pièce intérieure/i })
    ).toBeInTheDocument();
    expect(calls.map(({ url }) => url)).toEqual([BASE, `${BASE}/logement`]);
  });

  it('refuse un mode inconnu sans aucun autre appel', async () => {
    const { calls } = mockApi({
      [`GET ${BASE}`]: {
        body: factuelleSimulationResponse(evaluationResponse(), { mode_grille: 'AUTRE' }),
      },
    });
    renderSimulation();

    expect(
      await screen.findByRole('heading', { name: /simulation indisponible/i })
    ).toBeInTheDocument();
    expect(calls).toHaveLength(1);
  });

  it('édite un brouillon local et n’envoie qu’un PUT, sans retirer les couchages hors pièce d’habitation', async () => {
    const updated = { ...petiteChambre, surface: 5, ouvrant: false };
    const { calls } = mockApi({
      ...factuelleRoutes([chambre, petiteChambre]),
      [`PUT ${BASE}/faits/pieces/piece-petite`]: { body: mutationResponse([chambre, updated]) },
    });
    renderSimulation();

    let dialog = await openEdit(/modifier petite chambre/i);
    const callsAtOpening = calls.length;
    fireEvent.change(within(dialog).getByLabelText(/surface/i), { target: { value: '' } });
    fireEvent.change(within(dialog).getByLabelText(/surface/i), { target: { value: '5' } });
    const ouvrant = within(dialog).getByRole('group', { name: /ouvrant/i });
    fireEvent.click(within(ouvrant).getByRole('button', { name: 'Non' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Annuler' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(calls).toHaveLength(callsAtOpening);

    dialog = await openEdit(/modifier petite chambre/i);
    expect(within(dialog).getByLabelText(/surface/i)).toHaveValue('6');
    fireEvent.change(within(dialog).getByLabelText(/surface/i), { target: { value: '5' } });
    fireEvent.click(
      within(within(dialog).getByRole('group', { name: /ouvrant/i })).getByRole('button', {
        name: 'Non',
      })
    );
    expect(calls).toHaveLength(callsAtOpening);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sauvegarder' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const writes = calls.filter(({ method }) => method !== 'GET');
    expect(writes).toHaveLength(1);
    expect(writes[0]).toMatchObject({
      method: 'PUT',
      body: {
        surface: 5,
        ouvrant: false,
        couchages: [expect.objectContaining({ id: '22222222-2222-4222-8222-222222222222' })],
      },
    });
  });

  it('conserve la fenêtre et le brouillon après un refus, et ne réessaie que sur demande', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`PUT ${BASE}/faits/pieces/piece-chambre`]: [
        {
          body: {
            code: 'INVALID_REQUEST',
            message: 'Requête invalide',
            fieldErrors: { surface: 'doit être inférieur à 10000' },
          },
          status: 400,
        },
        { body: mutationResponse([chambre]) },
      ],
    });
    renderSimulation();

    const dialog = await openEdit(/modifier chambre parentale/i);
    fireEvent.change(within(dialog).getByLabelText(/surface/i), { target: { value: '13' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sauvegarder' }));

    expect(await within(dialog).findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(within(dialog).getByLabelText(/surface/i)).toHaveValue('13');
    expect(within(dialog).getByLabelText(/surface/i)).toHaveAttribute('aria-invalid', 'true');
    expect(within(dialog).getByText('doit être inférieur à 10000')).toBeInTheDocument();
    expect(calls.filter(({ method }) => method === 'PUT')).toHaveLength(1);

    fireEvent.click(within(dialog).getByRole('button', { name: 'Sauvegarder' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(calls.filter(({ method }) => method === 'PUT')).toHaveLength(2);
  });

  it('relit l’état sans rejouer une création incertaine et impose une vérification avant un nouvel ajout', async () => {
    const cuisine = piece({
      id: 'piece-cuisine',
      type_piece: 'CUISINE',
      nom: 'Cuisine ouverte',
      surface: 8,
    });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`GET ${BASE}/faits`]: [
        { body: faitsResponse([chambre]) },
        { body: faitsResponse([chambre, cuisine]) },
      ],
      [`POST ${BASE}/faits/pieces`]: [
        { body: null, status: 0 },
        { body: mutationResponse([chambre, cuisine]) },
      ],
    });
    renderSimulation();

    fireEvent.click(await screen.findByRole('button', { name: /ajouter une pièce/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/^type$/i), { target: { value: 'CUISINE' } });
    fireEvent.change(within(dialog).getByLabelText(/surface/i), { target: { value: '8' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Ajouter' }));

    expect(await within(dialog).findByText(/cuisine ouverte/i)).toBeInTheDocument();
    expect(calls.filter(({ method }) => method === 'POST')).toHaveLength(1);
    expect(calls.filter(({ method, url }) => method === 'GET' && url === BASE)).toHaveLength(2);
    expect(within(dialog).getByLabelText(/surface/i)).toHaveValue('8');

    const addButton = within(dialog).getByRole('button', { name: 'Ajouter' });
    expect(addButton).toBeDisabled();
    fireEvent.click(addButton);
    expect(calls.filter(({ method }) => method === 'POST')).toHaveLength(1);

    fireEvent.click(within(dialog).getByRole('button', { name: /j’ai vérifié la liste/i }));
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(calls.filter(({ method }) => method === 'POST')).toHaveLength(2);
  });

  it('affiche l’alerte de plafond seulement pour la catégorie demandée', async () => {
    const alerte = (categories: string[]) =>
      evaluationResponse({
        alertes_pieces: [
          {
            piece_id: 'piece-chambre',
            code: 'PLAFOND_COUCHAGES_DEPASSE',
            message:
              'Le nombre maximal de couchages autorisés dans cette pièce est dépassé. Le critère 1 est invalidé.',
            categories_concernees: categories,
          },
        ],
      });
    mockApi(factuelleRoutes([chambre], alerte(['5*'])));
    const view = renderSimulation();
    await screen.findByRole('heading', { name: 'Chambre parentale' });
    expect(screen.queryByText(/nombre maximal de couchages/i)).not.toBeInTheDocument();
    view.unmount();
    vi.restoreAllMocks();

    mockApi(factuelleRoutes([chambre], alerte(['3*', '4*', '5*'])));
    renderSimulation();
    expect(await screen.findByText(/nombre maximal de couchages/i)).toBeInTheDocument();
  });

  it('distingue complétude et conformité et réordonne les salles d’eau par leur liste complète', async () => {
    const evaluation = evaluationResponse({
      besoins: [besoin({ piece_id: 'piece-sdb-2', champ: 'sanitaires.lavabo_eau_chaude' })],
    });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre, salleEau1, salleEau2], evaluation),
      [`PUT ${BASE}/faits/ordre-sanitaires`]: {
        body: mutationResponse(
          [chambre, { ...salleEau1, rang_type: 2 }, { ...salleEau2, rang_type: 1 }],
          evaluation
        ),
      },
    });
    renderSimulation();

    fireEvent.click(await screen.findByRole('tab', { name: /salles d’eau/i }));
    const secondCard = screen.getByTestId('factuelle-piece-piece-sdb-2');
    expect(within(secondCard).getByText(/à compléter/i)).toBeInTheDocument();
    expect(
      within(secondCard).queryByRole('img', { name: /pièce renseignée/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /monter salle d’eau du haut/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /monter salle d’eau du bas/i }));
    await waitFor(() =>
      expect(calls.find(({ method }) => method === 'PUT')?.body).toEqual({
        piece_ids: ['piece-sdb-2', 'piece-sdb-1'],
      })
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /monter salle d’eau du bas/i })).toBeDisabled()
    );
  });

  it('enregistre un paramètre sans relire le logement LEGACY', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`PUT ${BASE}/capaciteAccueil/3`]: {
        body: factuelleSimulationResponse(evaluationResponse(), { capacite_accueil: 3 }),
      },
    });
    renderSimulation();

    fireEvent.click(await screen.findByRole('button', { name: /modifier les paramètres/i }));
    const capacity = screen.getByLabelText(/capacité d’accueil/i);
    fireEvent.change(capacity, { target: { value: '3' } });
    fireEvent.blur(capacity);

    await waitFor(() => expect(calls.some(({ method }) => method === 'PUT')).toBe(true));
    await waitFor(() => expect(capacity).toBeEnabled());
    expect(calls.some(({ url }) => LEGACY_ROUTES.test(url.replace(BASE, '')))).toBe(false);
  });

  it('ignore la réponse d’un PUT de paramètre lancé avant un changement de simulation', async () => {
    const otherId = 'simulation-b';
    const otherBase = `/api/public/simulations/${otherId}`;
    let releasePut: (response: RouteResponse) => void = () => undefined;
    mockApi({
      ...factuelleRoutes([chambre]),
      [`PUT ${BASE}/capaciteAccueil/3`]: () =>
        new Promise<RouteResponse>((resolve) => {
          releasePut = resolve;
        }),
      [`GET ${otherBase}`]: {
        body: {
          ...factuelleSimulationResponse(evaluationResponse(), { capacite_accueil: 6 }),
          id: otherId,
        },
      },
      [`GET ${otherBase}/faits`]: {
        body: faitsResponse([petiteChambre], { capacite_accueil: 6 }),
      },
      [`GET ${otherBase}/faits/catalogue`]: { body: catalogueResponse },
    });
    renderSimulation();

    fireEvent.click(await screen.findByRole('button', { name: /modifier les paramètres/i }));
    const capacity = screen.getByLabelText(/capacité d’accueil/i);
    fireEvent.change(capacity, { target: { value: '3' } });
    fireEvent.blur(capacity);

    act(() => {
      window.history.pushState({}, 'Test page', `/simulateur/${otherId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(await screen.findByRole('heading', { name: 'Petite chambre' })).toBeInTheDocument();

    await act(async () => {
      releasePut({
        body: factuelleSimulationResponse(evaluationResponse(), { capacite_accueil: 3 }),
      });
    });

    await waitFor(() => expect(screen.getByLabelText(/capacité d’accueil/i)).toBeEnabled());
    expect(screen.getByLabelText(/capacité d’accueil/i)).toHaveValue(6);
    expect(screen.queryByText(/paramètres ont été enregistrés/i)).not.toBeInTheDocument();
  });

  it('réconcilie les paramètres depuis le backend après un PUT incertain, sans le rejouer', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`PUT ${BASE}/capaciteAccueil/3`]: { body: null, status: 0 },
    });
    renderSimulation();

    fireEvent.click(await screen.findByRole('button', { name: /modifier les paramètres/i }));
    const capacity = screen.getByLabelText(/capacité d’accueil/i);
    fireEvent.change(capacity, { target: { value: '3' } });
    fireEvent.blur(capacity);

    await waitFor(() =>
      expect(calls.filter(({ method, url }) => method === 'GET' && url === BASE)).toHaveLength(2)
    );
    await waitFor(() => expect(capacity).toBeEnabled());
    expect(capacity).toHaveValue(2);
    expect(calls.filter(({ method }) => method === 'PUT')).toHaveLength(1);
    expect(calls.some(({ url }) => LEGACY_ROUTES.test(url.replace(BASE, '')))).toBe(false);
  });

  it('affiche la moyenne globalisée telle que calculée, avec une pièce d’habitation sans couchage', async () => {
    const bureau = piece({ id: 'piece-bureau', type_piece: 'BUREAU', nom: 'Bureau', surface: 7 });
    mockApi(
      factuelleRoutes(
        [chambre, bureau],
        evaluationResponse({
          surfaces: {
            categorie: '3*',
            nombre_pieces_habitation: 2,
            surface_totale: 19,
            nombre_couchages: 2,
            minimum_global: 18,
            minimum_global_atteint: true,
            diagnostic_moyenne_surface: {
              applicable: true,
              piece_ids: ['piece-chambre', 'piece-bureau'],
              surface_moyenne: 8.5,
              minimum_moyen: 9,
              atteint: false,
            },
            minima_locaux: [],
            qualifications_pieces: [],
          },
        })
      )
    );
    renderSimulation();

    const diagnostic = (await screen.findByText(/surface moyenne insuffisante/i)).closest(
      '[role="status"]'
    );
    expect(diagnostic).toHaveTextContent('8,5 m²');
    expect(diagnostic).toHaveTextContent('9 m²');
    expect(diagnostic).toHaveTextContent(/Chambre parentale, Bureau/);
    expect(screen.getByRole('heading', { name: 'Bureau' })).toBeInTheDocument();
  });

  it('ajoute un couchage depuis le catalogue avec l’aide gigogne, sans appel réseau', async () => {
    const { calls } = mockApi(factuelleRoutes([chambre]));
    renderSimulation();

    const dialog = await openEdit(/modifier chambre parentale/i);
    const callsAtOpening = calls.length;
    fireEvent.click(within(dialog).getByRole('button', { name: /ajouter un couchage/i }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Gigogne' }));

    expect(within(dialog).getByRole('button', { name: /aide : gigogne/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('group', { name: /nombre de couchages/i })).toHaveTextContent(
      '1'
    );
    expect(calls).toHaveLength(callsAtOpening);
    await expectNoA11yViolations(dialog);
  });
});
