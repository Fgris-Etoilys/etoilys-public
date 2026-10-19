import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import structureGrilleRaw from '../../docs/data/structureGrille.json?raw';
import {
  besoin,
  blocage,
  catalogueResponse,
  chambre,
  comparaisonResponse,
  critere,
  evaluationResponse,
  FACTUELLE_SIMULATION_ID as ID,
  factuelleSimulationResponse,
  faitsResponse,
  mutationResponse,
  petiteChambre,
  piece,
  salleEau1,
  salleEau2,
  verificationResponse,
} from '../test/factuelleFixtures';
import { expectNoA11yViolations } from '../test/a11y';
import { exportSimulationClassementPdf } from '../utils/simulatorExport';

vi.setConfig({ testTimeout: 15_000 });

vi.mock('../utils/simulatorExport', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/simulatorExport')>();
  return { ...actual, exportSimulationClassementPdf: vi.fn().mockResolvedValue(undefined) };
});

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
// `/verifier` et `/verification` sont partagés avec FACTUELLE depuis 432 ; ces routes restent LEGACY.
const LEGACY_ROUTES = /\/(logement|pieces|reponse|rapport)(\/|$)/;

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

describe('SimulationClassement — Grille et résultats FACTUELLE', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
    vi.mocked(exportSimulationClassementPdf).mockClear();
  });

  async function openGrid() {
    fireEvent.click(await screen.findByRole('tab', { name: /grille de contrôle/i }));
    return screen.findByRole('heading', { name: /complétez la grille de contrôle/i });
  }

  const card = (numero: number) => screen.getByTestId(`criterion-card-${numero}`);

  it('enregistre une réponse manuelle et annonce la cascade backend dans un toast sans action', async () => {
    const evaluation = evaluationResponse({
      criteres: [critere(68), critere(69)],
      besoins: [besoin({ champ: 'reponse_manuelle', num_critere: 69, destination: 'GRILLE' })],
    });
    const message =
      'Critère 68 validé automatiquement : la machine à expresso satisfait également le critère « Cafetière ».';
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`PUT ${BASE}/faits/criteres/69/reponse`]: {
        body: mutationResponse(
          [chambre],
          evaluationResponse({
            criteres: [
              critere(68, { source_cascade: 69 }),
              critere(69, { reponse_manuelle: 'VALIDE' }),
            ],
          }),
          {
            changements_cascade: [
              { critere_source: 69, critere_cible: 68, type: 'VALIDATION', message },
            ],
          }
        ),
      },
    });
    renderSimulation();
    await openGrid();

    fireEvent.click(within(card(69)).getByRole('button', { name: 'Oui' }));

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(calls.find(({ method }) => method === 'PUT')).toMatchObject({
      url: `${BASE}/faits/criteres/69/reponse`,
      body: { statut_validation: 'VALIDE' },
    });
    await waitFor(() =>
      expect(within(card(69)).getByRole('button', { name: 'Oui' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    );
    const toast = screen.getByText(message).parentElement as HTMLElement;
    expect(within(toast).queryByRole('link')).not.toBeInTheDocument();
  });

  it('présente un automatique non cliquable, ouvre sa modale et n’écrit qu’à l’enregistrement', async () => {
    const evaluation = evaluationResponse({
      criteres: [critere(101, { automatique: true })],
      besoins: [besoin({ champ: 'c101.situation', num_critere: 101, destination: 'GRILLE' })],
    });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`PUT ${BASE}/faits/c101`]: {
        body: mutationResponse(
          [chambre],
          evaluationResponse({
            criteres: [critere(101, { automatique: true, statut_validation: 'VALIDE' })],
          }),
          { globaux: { c101: { situation: 'PRESENT_BILINGUE' } } }
        ),
      },
    });
    renderSimulation();
    await openGrid();
    const callsBefore = calls.length;

    expect(within(card(101)).getByText('Auto')).toBeInTheDocument();
    fireEvent.click(within(card(101)).getByRole('button', { name: 'Renseigner' }));
    let dialog = await screen.findByRole('dialog', { name: 'Livret d’accueil' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Présent, bilingue' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Annuler' }));
    expect(calls).toHaveLength(callsBefore);

    fireEvent.click(within(card(101)).getByRole('button', { name: 'Renseigner' }));
    dialog = await screen.findByRole('dialog', { name: 'Livret d’accueil' });
    expect(within(dialog).getByRole('button', { name: 'Présent, bilingue' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await expectNoA11yViolations(dialog);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Présent, bilingue' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Enregistrer' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(calls.slice(callsBefore)).toEqual([
      { method: 'PUT', url: `${BASE}/faits/c101`, body: { situation: 'PRESENT_BILINGUE' } },
    ]);
    const verdict = within(card(101)).getByRole('button', { name: 'Oui' });
    expect(verdict).toBeDisabled();
    expect(verdict).toHaveAttribute('aria-pressed', 'true');
  });

  it('active la dérogation NA d’un automatique C16 sans le rendre répondable Oui/Non', async () => {
    const evaluation = evaluationResponse({
      criteres: [critere(16, { automatique: true, statut_validation: 'VALIDE' })],
    });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`PUT ${BASE}/faits/criteres/16/reponse`]: {
        body: mutationResponse(
          [chambre],
          evaluationResponse({
            criteres: [
              critere(16, {
                automatique: true,
                statut_validation: 'NON_APPLICABLE',
                reponse_manuelle: 'NON_APPLICABLE',
              }),
            ],
          })
        ),
      },
    });
    renderSimulation();
    await openGrid();

    expect(within(card(16)).getByRole('button', { name: 'Oui' })).toBeDisabled();
    fireEvent.click(within(card(16)).getByRole('button', { name: 'Non applicable' }));

    await waitFor(() =>
      expect(within(card(16)).getByRole('button', { name: 'Non applicable' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    );
    expect(calls.find(({ method }) => method === 'PUT')?.body).toEqual({
      statut_validation: 'NON_APPLICABLE',
    });
    expect(within(card(16)).queryByRole('button', { name: 'Oui' })).not.toBeInTheDocument();
  });

  it('bloque les cinq résultats et ouvre le champ exact depuis chaque blocage', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`POST ${BASE}/verifier`]: { body: false },
      [`GET ${BASE}/verification`]: {
        body: verificationResponse([
          blocage({
            code: 'REPONSE_MANQUANTE',
            num_critere: 69,
            categories_utilisatrices: ['4*', '5*'],
          }),
          blocage({
            code: 'STUDIO_PIECES_HABITATION_INCOHERENTES',
            message:
              'Le logement est déclaré comme studio, mais 2 pièces d’habitation sont renseignées. Corrigez le paramètre Studio ou les pièces.',
            destination: 'PIECE',
            champ: 'type_piece',
          }),
          blocage({
            code: 'PRQ_NON_RESPECTE',
            message: 'La pièce d’habitation unique doit mesurer au moins 12 m².',
            destination: 'PIECE',
            champ: 'surface',
            piece_id: 'piece-chambre',
          }),
        ]),
      },
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('tab', { name: /^résultat/i }));
    fireEvent.click(screen.getByRole('button', { name: /voir le résultat de ma simulation/i }));

    expect(await screen.findByText(/informations à compléter/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /critère 69 — machine à expresso/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/utile pour les catégories 4★, 5★/i)).toBeInTheDocument();
    expect(screen.getByText(/déclaré comme studio/i)).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    const prq = screen.getByText(/doit mesurer au moins 12 m²/i).closest('div');
    fireEvent.click(within(prq as HTMLElement).getByRole('button', { name: 'Modifier' }));
    expect(
      await screen.findByRole('dialog', { name: /modifier — chambre parentale/i })
    ).toBeInTheDocument();

    expect(calls.map(({ method, url }) => `${method} ${url}`)).toEqual(
      expect.arrayContaining([`POST ${BASE}/verifier`, `GET ${BASE}/verification`])
    );
    expect(calls.some(({ url }) => LEGACY_ROUTES.test(url.replace(BASE, '')))).toBe(false);
  });

  it('compare les cinq catégories, consulte et exporte une catégorie sans aucune écriture', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`POST ${BASE}/verifier`]: { body: true },
      [`GET ${BASE}/comparaison`]: {
        body: comparaisonResponse({
          '4*': {
            rapport: {
              resultat: false,
              points_minimaux_obligatoires: 98,
              points_obligatoires_atteints: false,
              points_obligatoires_a_compenser: 3,
              points_optionnels_a_atteindre: 14,
              points_optionnels_atteints: false,
              criteres_obligatoires_non_valides: [69],
            },
          },
        }),
      },
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('tab', { name: /^résultat/i }));
    fireEvent.click(screen.getByRole('button', { name: /voir le résultat de ma simulation/i }));

    const selectors = await screen.findByRole('radiogroup', { name: /résultat par catégorie/i });
    const radios = within(selectors).getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(within(selectors).getByRole('radio', { name: /3★/ })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    const four = within(selectors).getByRole('radio', { name: /4★/ });
    expect(four).toHaveTextContent('Classement non atteint');
    expect(four).toHaveTextContent('3 pts obligatoires manquants • 2 pts à la carte manquants');
    await expectNoA11yViolations(screen.getByRole('tabpanel'));
    const callsAfterResult = calls.length;

    fireEvent.click(four);
    expect(
      screen.getByRole('heading', { name: 'Le classement 4 étoiles ne semble pas encore atteint' })
    ).toBeInTheDocument();
    expect(screen.getByText('Il manque 3 points')).toBeInTheDocument();
    expect(screen.getByText('Il manque 2 points')).toBeInTheDocument();
    expect(screen.getByText(/3 points obligatoires à compenser/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Télécharger le résultat 4★' }));
    await waitFor(() => expect(exportSimulationClassementPdf).toHaveBeenCalledTimes(1));
    fireEvent.click(within(selectors).getByRole('radio', { name: /3★/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Télécharger le résultat 3★' }));
    await waitFor(() => expect(exportSimulationClassementPdf).toHaveBeenCalledTimes(2));

    const exported = vi
      .mocked(exportSimulationClassementPdf)
      .mock.calls.map(([input]) => input.grille?.categorie_demandee);
    expect(exported).toEqual(['4*', '3*']);
    expect(calls).toHaveLength(callsAfterResult);
    expect(screen.getByText(/objectif · 3 étoiles/i)).toBeInTheDocument();
  });

  it('rend le résultat à recalculer après une mutation réelle', async () => {
    const evaluation = evaluationResponse({ criteres: [critere(68)] });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`POST ${BASE}/verifier`]: { body: true },
      [`GET ${BASE}/comparaison`]: { body: comparaisonResponse() },
      [`PUT ${BASE}/faits/criteres/68/reponse`]: {
        body: mutationResponse(
          [chambre],
          evaluationResponse({ criteres: [critere(68, { reponse_manuelle: 'NON_VALIDE' })] })
        ),
      },
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('tab', { name: /^résultat/i }));
    fireEvent.click(screen.getByRole('button', { name: /voir le résultat de ma simulation/i }));
    expect(await screen.findByRole('radiogroup')).toBeInTheDocument();

    await openGrid();
    fireEvent.click(within(card(68)).getByRole('button', { name: 'Non' }));
    await waitFor(() => expect(calls.some(({ method }) => method === 'PUT')).toBe(true));
    fireEvent.click(screen.getByRole('tab', { name: /^résultat/i }));

    expect(
      await screen.findByRole('heading', { name: 'Résultat à recalculer' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('relit la comparaison enregistrée à la reprise sans relancer la vérification', async () => {
    const { calls } = mockApi({
      [`GET ${BASE}`]: {
        body: { ...factuelleSimulationResponse(), statut: 'DEFAVORABLE' },
      },
      [`GET ${BASE}/faits`]: { body: faitsResponse([chambre]) },
      [`GET ${BASE}/faits/catalogue`]: { body: catalogueResponse },
      [`GET ${BASE}/comparaison`]: {
        body: comparaisonResponse({ '3*': { rapport: { resultat: false } } }),
      },
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('tab', { name: /^résultat/i }));

    expect(await screen.findByRole('radiogroup')).toBeInTheDocument();
    expect(calls.some(({ method }) => method !== 'GET')).toBe(false);
  });

  it('modifie Studio depuis les paramètres par sa route dédiée', async () => {
    const { calls } = mockApi({
      ...factuelleRoutes([chambre]),
      [`PUT ${BASE}/studio`]: {
        body: factuelleSimulationResponse(evaluationResponse(), { studio: true }),
      },
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('button', { name: /modifier les paramètres/i }));
    fireEvent.change(screen.getByLabelText('Studio'), { target: { value: 'true' } });

    await waitFor(() => expect(screen.getByLabelText('Studio')).toHaveValue('true'));
    expect(calls.find(({ method }) => method === 'PUT')).toMatchObject({
      url: `${BASE}/studio`,
      body: { studio: true },
    });
  });

  /** Réponse retenue jusqu'à `release()` : observe l'interface pendant l'écriture ou la relecture. */
  function heldRoute(response: RouteResponse) {
    let release: () => void = () => undefined;
    const gate = new Promise<void>((done) => {
      release = done;
    });
    return { route: () => gate.then(() => response), release: () => release() };
  }

  async function showComparaison() {
    fireEvent.click(await screen.findByRole('tab', { name: /^résultat/i }));
    fireEvent.click(screen.getByRole('button', { name: /voir le résultat de ma simulation/i }));
    return screen.findByRole('radiogroup', { name: /résultat par catégorie/i });
  }

  it('refuse un chauffage « Autre » sans précision et rattache les fieldErrors backend au champ', async () => {
    const evaluation = evaluationResponse({
      criteres: [critere(16, { automatique: true })],
      besoins: [besoin({ champ: 'chauffage.etat', num_critere: 16, destination: 'GRILLE' })],
    });
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`PUT ${BASE}/faits/chauffage`]: {
        status: 400,
        body: {
          code: 'INVALID_REQUEST',
          message: 'Requête invalide',
          fieldErrors: { autre: 'La précision est trop longue.' },
        },
      },
    });
    renderSimulation();
    await openGrid();

    fireEvent.click(within(card(16)).getByRole('button', { name: 'Renseigner' }));
    const dialog = await screen.findByRole('dialog', { name: 'Chauffage' });
    fireEvent.click(within(dialog).getByRole('checkbox', { name: 'Autre' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sauvegarder' }));

    expect(within(dialog).getByText('Précisez l’autre système de chauffage.')).toBeInTheDocument();
    expect(calls.some(({ method }) => method === 'PUT')).toBe(false);

    const precision = within(dialog).getByRole('textbox', { name: 'Autre' });
    fireEvent.change(precision, { target: { value: 'Poêle à bois' } });
    expect(within(dialog).queryByText('Précisez l’autre système de chauffage.')).toBeNull();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sauvegarder' }));

    expect(await within(dialog).findByText('La précision est trop longue.')).toBeInTheDocument();
    expect(precision).toHaveAttribute('aria-invalid', 'true');
    await waitFor(() => expect(precision).toHaveFocus());
    expect(calls.filter(({ method }) => method === 'PUT')).toEqual([
      {
        method: 'PUT',
        url: `${BASE}/faits/chauffage`,
        body: { etat: 'INSTALLATIONS', types: ['AUTRE'], autre: 'Poêle à bois' },
      },
    ]);
  });

  it('mène un automatique non validé du rapport à ses faits connus, depuis une autre catégorie', async () => {
    // C37 et C101 : NA en 3★ (demandée), non validés en 4★ (consultée), faits déjà renseignés.
    const naEn3 = ['OBLIGATOIRE', 'OBLIGATOIRE', 'NON_APPLICABLE', 'OBLIGATOIRE', 'OBLIGATOIRE'];
    const evaluation = evaluationResponse({
      criteres: [
        critere(37, { automatique: true, statut_validation: 'NON_VALIDE' }, naEn3),
        critere(101, { automatique: true, statut_validation: 'NON_VALIDE' }, naEn3),
      ],
      besoins: [
        besoin({ champ: 'surface', piece_id: 'piece-chambre', num_critere: 37, manquant: false }),
        besoin({
          champ: 'c101.situation',
          num_critere: 101,
          destination: 'GRILLE',
          manquant: false,
        }),
      ],
    });
    const nonValides = {
      rapport: {
        resultat: false,
        points_obligatoires_atteints: false,
        criteres_obligatoires_non_valides: [37, 101],
      },
    };
    const { calls } = mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`POST ${BASE}/verifier`]: { body: true },
      [`GET ${BASE}/comparaison`]: { body: comparaisonResponse({ '4*': nonValides }) },
    });
    renderSimulation();

    let selectors = await showComparaison();
    fireEvent.click(within(selectors).getByRole('radio', { name: /4★/ }));
    const pieceRow = screen.getByText('Critère 37').closest('div')?.parentElement as HTMLElement;
    fireEvent.click(within(pieceRow).getByRole('button', { name: 'Voir dans les pièces' }));
    expect(
      await screen.findByRole('dialog', { name: /modifier — chambre parentale/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

    fireEvent.click(screen.getByRole('tab', { name: /^résultat/i }));
    selectors = await screen.findByRole('radiogroup', { name: /résultat par catégorie/i });
    fireEvent.click(within(selectors).getByRole('radio', { name: /4★/ }));
    const globalRow = screen.getByText('Critère 101').closest('div')?.parentElement as HTMLElement;
    fireEvent.click(within(globalRow).getByRole('button', { name: 'Voir dans la grille' }));
    expect(await screen.findByRole('dialog', { name: 'Livret d’accueil' })).toBeInTheDocument();
    expect(calls.some(({ method }) => method === 'PUT')).toBe(false);
  });

  it('suspend le résultat pendant un PUT de paramètre, le rétablit après un refus et l’invalide après un succès', async () => {
    const refusal = heldRoute({ status: 400, body: { code: 'INVALID_REQUEST' } });
    const success = heldRoute({
      body: factuelleSimulationResponse(evaluationResponse(), { studio: true }),
    });
    mockApi({
      ...factuelleRoutes([chambre]),
      [`POST ${BASE}/verifier`]: { body: true },
      [`GET ${BASE}/comparaison`]: { body: comparaisonResponse() },
      [`PUT ${BASE}/studio`]: [refusal.route, success.route],
    });
    renderSimulation();
    await showComparaison();

    fireEvent.click(screen.getByRole('button', { name: /modifier les paramètres/i }));
    fireEvent.change(screen.getByLabelText('Studio'), { target: { value: 'true' } });
    expect(
      await screen.findByRole('heading', { name: 'Mise à jour en cours' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /télécharger le résultat/i })).toBeNull();

    // Refus certain : rien n'a été écrit, l'ancien résultat reste valide.
    await act(async () => refusal.release());
    expect(await screen.findByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Télécharger le résultat 3★' })).toBeEnabled();

    fireEvent.change(screen.getByLabelText('Studio'), { target: { value: 'true' } });
    expect(
      await screen.findByRole('heading', { name: 'Mise à jour en cours' })
    ).toBeInTheDocument();
    await act(async () => success.release());
    expect(
      await screen.findByRole('heading', { name: 'Résultat à recalculer' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(exportSimulationClassementPdf).not.toHaveBeenCalled();
  });

  it('verrouille Renseigner et le crayon des automatiques pendant une autre écriture', async () => {
    const evaluation = evaluationResponse({
      criteres: [
        critere(68),
        critere(18, { automatique: true, statut_validation: 'VALIDE' }),
        critere(101, { automatique: true }),
      ],
      besoins: [besoin({ champ: 'c101.situation', num_critere: 101, destination: 'GRILLE' })],
    });
    const answer = heldRoute({ body: mutationResponse([chambre], evaluation) });
    mockApi({
      ...factuelleRoutes([chambre], evaluation),
      [`PUT ${BASE}/faits/criteres/68/reponse`]: answer.route,
    });
    renderSimulation();
    await openGrid();
    const renseigner = within(card(101)).getByRole('button', { name: 'Renseigner' });
    const crayon = within(card(18)).getByRole('button', {
      name: 'Modifier les informations du critère 18',
    });
    expect(renseigner).toBeEnabled();
    expect(crayon).toBeEnabled();

    fireEvent.click(within(card(68)).getByRole('button', { name: 'Oui' }));
    await waitFor(() => expect(renseigner).toBeDisabled());
    expect(crayon).toBeDisabled();

    await act(async () => answer.release());
    await waitFor(() => expect(renseigner).toBeEnabled());
    expect(crayon).toBeEnabled();
  });

  it('désactive les paramètres pendant une relecture canonique', async () => {
    const reload = heldRoute({ body: factuelleSimulationResponse() });
    mockApi({
      ...factuelleRoutes([chambre]),
      // Évaluation indisponible au chargement : la Grille propose une relecture.
      [`GET ${BASE}`]: [
        { body: factuelleSimulationResponse(evaluationResponse(), { evaluation: null }) },
        reload.route,
      ],
    });
    renderSimulation();
    fireEvent.click(await screen.findByRole('tab', { name: /grille de contrôle/i }));
    fireEvent.click(await screen.findByRole('button', { name: 'Actualiser la simulation' }));
    fireEvent.click(screen.getByRole('button', { name: /modifier les paramètres/i }));

    expect(screen.getByLabelText('Studio')).toBeDisabled();
    await act(async () => reload.release());
    await waitFor(() => expect(screen.getByLabelText('Studio')).toBeEnabled());
  });
});
