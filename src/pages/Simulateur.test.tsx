import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import Simulateur from './Simulateur';

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const mockFetchJson = (body: unknown, status = 200) => {
  const fetchMock = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(createJsonResponse(body, status));

  return fetchMock;
};

const mockFetchJsonSequence = (responses: Array<{ body: unknown; status?: number }>) => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  responses.forEach((response) => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(response.body, response.status ?? 200));
  });
  return fetchMock;
};

const renderSimulateur = () => {
  window.history.pushState({}, 'Simulateur', '/simulateur');
  return render(
    <BrowserRouter>
      <ToastProvider>
        <Simulateur />
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Simulateur public de classement', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('affiche l’état de chargement des simulations', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(() => undefined));

    renderSimulateur();

    expect(screen.getByText(/chargement de vos simulations/i)).toBeInTheDocument();
  });

  it('charge les simulations via le client simulateur same-origin', async () => {
    const fetchMock = mockFetchJson([]);

    renderSimulateur();

    await screen.findByText(/vous n’avez pas encore de simulation enregistrée sur ce navigateur/i);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/public/simulations',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('affiche une erreur simple et un bouton de nouvel essai', async () => {
    mockFetchJson({ error: 'Server error' }, 500);

    renderSimulateur();

    expect(
      await screen.findByText(/impossible de charger vos simulations pour le moment/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument();
  });

  it('affiche l’état vide quand aucune simulation n’est enregistrée', async () => {
    mockFetchJson([]);

    renderSimulateur();

    expect(
      await screen.findByText(/vous n’avez pas encore de simulation enregistrée sur ce navigateur/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /créer ma première simulation/i })
    ).not.toBeInTheDocument();
  });

  it('crée une simulation avec les valeurs attendues par le backend puis ouvre la simulation', async () => {
    const fetchMock = mockFetchJsonSequence([
      { body: [] },
      { body: { id: 'created-simulation-id' } },
    ]);

    renderSimulateur();

    await screen.findByText(/vous n’avez pas encore de simulation enregistrée sur ce navigateur/i);

    fireEvent.change(screen.getByLabelText(/classement demandé/i), { target: { value: '4*' } });
    fireEvent.change(screen.getByLabelText(/type de logement/i), {
      target: { value: 'COLLECTIF' },
    });
    fireEvent.change(screen.getByLabelText(/étage/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/capacité d’accueil/i), {
      target: { value: '6' },
    });
    fireEvent.click(screen.getByRole('button', { name: /démarrer la simulation/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/simulateur/created-simulation-id');
    });

    const createCall = fetchMock.mock.calls[1];
    expect(createCall?.[0]).toBe('/api/public/simulations');
    expect(createCall?.[1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        categorie_demandee: '4*',
        capacite_accueil: 6,
        etage: 2,
        type_habitation: 'COLLECTIF',
      }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('affiche les simulations existantes sous forme de cartes', async () => {
    mockFetchJson([
      {
        id: 'c3f43f31-59fd-4b4e-9272-7f1321d8cabc',
        statut: 'BROUILLON',
        categorie_demandee: '3*',
        capacite_accueil: 4,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    expect(await screen.findByText(/classement demandé : 3 étoiles/i)).toBeInTheDocument();
    expect(screen.getByText(/4 personnes/i)).toBeInTheDocument();
    expect(screen.getByText(/^brouillon$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reprendre/i })).toHaveAttribute(
      'href',
      '/simulateur/c3f43f31-59fd-4b4e-9272-7f1321d8cabc'
    );
    expect(
      screen.queryByRole('button', { name: /modifier les paramètres/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument();
  });

  it('affiche un libellé UX pour un résultat défavorable', async () => {
    mockFetchJson([
      {
        id: 'simulation-defavorable',
        statut: 'DEFAVORABLE',
        categorie_demandee: '4*',
        capacite_accueil: 6,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    expect(await screen.findByText(/^résultat défavorable$/i)).toBeInTheDocument();
    expect(screen.queryByText('DEFAVORABLE')).not.toBeInTheDocument();
  });

  it('affiche un libellé UX pour un résultat favorable', async () => {
    mockFetchJson([
      {
        id: 'simulation-favorable',
        statut: 'FAVORABLE',
        categorie_demandee: '4*',
        capacite_accueil: 6,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    expect(await screen.findByText(/^résultat favorable$/i)).toBeInTheDocument();
    expect(screen.queryByText('FAVORABLE')).not.toBeInTheDocument();
  });

  it('affiche un libellé UX pour une simulation à compléter', async () => {
    mockFetchJson([
      {
        id: 'simulation-a-completer',
        statut: 'A_COMPLETER',
        categorie_demandee: '4*',
        capacite_accueil: 6,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    expect(await screen.findByText(/^à compléter$/i)).toBeInTheDocument();
    expect(screen.queryByText('A_COMPLETER')).not.toBeInTheDocument();
  });

  it('affiche un libellé UX pour une simulation à recalculer', async () => {
    mockFetchJson([
      {
        id: 'simulation-a-recalculer',
        statut: 'A_RECALCULER',
        categorie_demandee: '4*',
        capacite_accueil: 6,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    expect(await screen.findByText(/^à recalculer$/i)).toBeInTheDocument();
    expect(screen.queryByText('A_RECALCULER')).not.toBeInTheDocument();
  });

  it('ne déclenche aucun appel de suppression', async () => {
    const fetchMock = mockFetchJson([
      {
        id: 'c3f43f31-59fd-4b4e-9272-7f1321d8cabc',
        statut: 'BROUILLON',
        categorie_demandee: '2*',
        capacite_accueil: 2,
        date_modification: '2026-05-07T10:30:00.000Z',
      },
    ]);

    renderSimulateur();

    const deleteButton = await screen.findByRole('button', { name: /supprimer/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/supprimer sera disponible/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(requestInit).toMatchObject({ method: 'GET' });
  });
});
