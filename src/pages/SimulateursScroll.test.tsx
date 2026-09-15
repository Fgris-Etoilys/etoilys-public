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

function expectSmoothWindowScroll(scrollToMock: ReturnType<typeof vi.spyOn>) {
  expect(scrollToMock).toHaveBeenCalledWith(
    expect.objectContaining({
      behavior: 'smooth',
      top: expect.any(Number),
    })
  );
}

function getNormalizedText(container: HTMLElement): string {
  return container.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

describe('scroll automatique des simulateurs', () => {
  afterEach(() => {
    cleanup();
    window.sessionStorage.clear();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('centre le bloc de résultats du simulateur fiscal après un calcul valide', async () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');

    fireEvent.change(screen.getByPlaceholderText(/20 000/i), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: '30 %' }));
    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    expect(await screen.findByRole('heading', { name: /comparatif 2026/i })).toBeInTheDocument();
    await waitFor(() => {
      expectSmoothWindowScroll(scrollToMock);
    });
  });

  it('centre le bloc de résultats du simulateur taxe de séjour après un calcul valide', async () => {
    mockTaxeSejourDatasetFetch();
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

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
      expectSmoothWindowScroll(scrollToMock);
    });
  });

  it('ne déclenche pas de scroll quand la validation échoue', () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');

    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    const tmiGroup = screen.getByRole('group');
    expect(tmiGroup).toHaveAttribute('aria-describedby', 'tmi-rate-error');
    expect(document.getElementById('tmi-rate-error')).toBeVisible();
    expect(screen.getByRole('button', { name: '30 %' })).toHaveClass('ui-focus');
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('wires custom taxe sejour field errors', async () => {
    mockTaxeSejourDatasetFetch();

    renderWithProviders(<SimulateurTaxeSejour />, '/simulateur-taxe-sejour');

    const cityInput = await screen.findByRole('combobox', { name: /commune/i });
    const form = cityInput.closest('form');
    if (!form) {
      throw new Error('Taxe sejour form was not rendered');
    }

    fireEvent.submit(form);

    expect(cityInput).toHaveAttribute('id', 'city-input');
    expect(cityInput).toHaveAttribute('aria-invalid', 'true');
    expect(cityInput).toHaveAttribute('aria-describedby', 'city-error');
    expect(document.getElementById('city-error')).toHaveAttribute('role', 'alert');

    fireEvent.change(cityInput, { target: { value: 'Testville' } });
    fireEvent.mouseDown(await screen.findByRole('option', { name: /testville/i }));

    const nightsInput = document.getElementById('nights-input');
    const exemptedInput = document.getElementById('exempted-persons-input');
    if (!(nightsInput instanceof HTMLInputElement)) {
      throw new Error('Nights input was not rendered');
    }
    if (!(exemptedInput instanceof HTMLInputElement)) {
      throw new Error('Exempted persons input was not rendered');
    }

    fireEvent.change(screen.getByPlaceholderText(/120/i), { target: { value: '100' } });
    fireEvent.change(nightsInput, { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText(/4/i), { target: { value: '1' } });
    fireEvent.change(exemptedInput, { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /calculer/i }));

    expect(nightsInput).toHaveAttribute('aria-invalid', 'true');
    expect(nightsInput).toHaveAttribute('aria-describedby', 'nights-error');
    expect(document.getElementById('nights-error')).toHaveAttribute('role', 'alert');
    expect(exemptedInput).toHaveAttribute('aria-invalid', 'true');
    expect(exemptedInput).toHaveAttribute('aria-describedby', 'exempted-persons-error');
    expect(document.getElementById('exempted-persons-error')).toHaveAttribute('role', 'alert');
  });

  it('localise les résultats calculés du simulateur fiscal en anglais', async () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const view = renderWithProviders(
      <SimulateurFiscalClassement />,
      '/en/furnished-tourist-accommodation-tax-simulator'
    );

    fireEvent.change(screen.getByPlaceholderText(/20,000/i), { target: { value: '30000' } });
    fireEvent.click(screen.getByRole('button', { name: '30 %' }));
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByRole('heading', { name: /2026 comparison/i })).toBeInTheDocument();

    const text = getNormalizedText(view.container);
    expect(text).toContain(
      'estimated annual saving with classified furnished tourist accommodation, compared with unclassified furnished tourist accommodation.'
    );
    expect(text).toContain('Metric');
    expect(text).toContain('Regime shown');
    expect(text).toContain('Estimated taxable base');
    expect(text).not.toContain('avec un');
    expect(text).not.toContain('Indicateur');
    expect(text).not.toContain('Régime affiché');
    expectSmoothWindowScroll(scrollToMock);
  });

  it('localise les résultats calculés du simulateur taxe de séjour en anglais', async () => {
    mockTaxeSejourDatasetFetch();
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const view = renderWithProviders(<SimulateurTaxeSejour />, '/en/tourist-tax-simulator');

    const cityInput = await screen.findByPlaceholderText(/biarritz/i);
    fireEvent.change(cityInput, { target: { value: 'Testville' } });
    fireEvent.mouseDown(await screen.findByRole('option', { name: /testville/i }));

    fireEvent.change(screen.getByPlaceholderText(/120/i), { target: { value: '150' } });
    fireEvent.change(screen.getByPlaceholderText(/3/i), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText(/4/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByRole('heading', { name: /results/i })).toBeInTheDocument();

    const text = getNormalizedText(view.container);
    expect(text).toContain('less tourist tax with a');
    expect(text).toContain('Category');
    expect(text).toContain('Saving / additional cost');
    expect(text).toContain('Total tourist tax');
    expect(text).toContain('Unclassified');
    expect(text).toContain('Comparison reference');
    expect(text).toMatch(/€[\d,.]+ saved \(-\d+ %\)/);
    expect(text).toContain('Period: from 1 January to 31 December');
    expect(text).not.toContain('économisés');
    expect(text).not.toContain('de tourist tax');
    expect(text).not.toContain('Période');
    expect(text).not.toContain('Catégorie');
    expect(text).not.toContain('Référence de comparaison');
    expectSmoothWindowScroll(scrollToMock);
  });
});
