import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import SimulateurFiscalClassement from './SimulateurFiscalClassement';
import SimulateurTaxeSejour from './SimulateurTaxeSejour';

const taxeSejourDataset = {
  v: 'test',
  sd: '2026-01-01',
  g: '2026-01-01T00:00:00.000Z',
  c: [
    [
      'testville-64',
      'Testville (64)',
      'testville 64',
      'r',
      'r',
      0,
      [['full-year', '1 janvier', '31 décembre', 5, 4, 1, 2, 3, 4, 5]],
      [],
    ],
  ],
};

function renderWithProviders(children: ReactNode, path: string) {
  window.history.pushState({}, 'Test page', path);
  return render(
    <BrowserRouter>
      <ToastProvider>{children}</ToastProvider>
    </BrowserRouter>
  );
}

function mockTaxeSejourDatasetFetch() {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(taxeSejourDataset), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

describe('scroll automatique des simulateurs', () => {
  afterEach(() => {
    cleanup();
    window.sessionStorage.clear();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('centre le bloc de résultats du simulateur fiscal après un calcul valide', async () => {
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');

    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');

    fireEvent.change(screen.getByPlaceholderText(/20 000/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: '30 %' }));
    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    expect(await screen.findByRole('heading', { name: /comparatif 2026/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('centre le bloc de résultats du simulateur taxe de séjour après un calcul valide', async () => {
    mockTaxeSejourDatasetFetch();
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');

    renderWithProviders(<SimulateurTaxeSejour />, '/simulateur-taxe-sejour');

    const cityInput = await screen.findByPlaceholderText(/biarritz/i);
    fireEvent.change(cityInput, { target: { value: 'Testville' } });
    fireEvent.mouseDown(await screen.findByRole('option', { name: /testville/i }));

    fireEvent.change(screen.getByPlaceholderText(/120/i), { target: { value: '100' } });
    fireEvent.change(screen.getByPlaceholderText(/3/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/4/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    expect(await screen.findByRole('heading', { name: /résultats/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });

  it('ne déclenche pas de scroll quand la validation échoue', () => {
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');

    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');

    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
