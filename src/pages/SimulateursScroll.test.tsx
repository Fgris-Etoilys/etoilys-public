import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import { localizedRoutes } from '../i18n/localizedRoutes';
import * as analytics from '../utils/analytics';
import * as simulatorExport from '../utils/simulatorExport';
import SimulateurFiscalClassement from './SimulateurFiscalClassement';
import SimulateurTaxeSejour from './SimulateurTaxeSejour';

const taxeSejourDataset = {
  v: 'test',
  sd: '2026-01-01',
  g: '2026-01-01T00:00:00.000Z',
  c: [
    [
      'full-forfait-64',
      'Forfait total (64)',
      'forfait total 64',
      'f',
      'f',
      0,
      [['full-year', '1 janvier', '31 décembre', 5, 4, 1, 2, 3, 4, 5]],
      [],
    ],
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
    [
      'forfaitville-64',
      'Forfaitville (64)',
      'forfaitville 64',
      'f',
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

function inputById(id: string): HTMLInputElement {
  const input = document.getElementById(id);
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Missing input: ${id}`);
  }
  return input;
}

function changeInput(id: string, value: string) {
  fireEvent.change(inputById(id), { target: { value } });
}

function submitForm(inputId: string) {
  const form = inputById(inputId).form;
  if (!form) {
    throw new Error(`Missing form for ${inputId}`);
  }
  fireEvent.submit(form);
}

async function selectCity(name = 'Testville') {
  const input = await screen.findByRole('combobox');
  fireEvent.change(input, { target: { value: name } });
  await screen.findByRole('option', { name: new RegExp(name, 'i') });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(input).toHaveAttribute('aria-activedescendant', 'taxe-sejour-option-0');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(input).toHaveValue(`${name} (64)`);
}

function openComparisonTable() {
  const table = screen.getByRole('table', { hidden: true });
  const disclosure = table.closest('details');
  if (disclosure && !disclosure.open) {
    const summary = disclosure.querySelector('summary');
    if (!summary) {
      throw new Error('Comparison disclosure has no summary');
    }
    fireEvent.click(summary);
  }
  return within(screen.getByRole('table'));
}

function expectSmoothWindowScroll() {
  expect(window.scrollTo).toHaveBeenCalledWith(
    expect.objectContaining({ behavior: 'smooth', top: expect.any(Number) })
  );
}

async function expectCopiedQuery(expected: Record<string, string>) {
  await waitFor(() => expect(simulatorExport.copyToClipboard).toHaveBeenCalled());
  const call = vi.mocked(simulatorExport.copyToClipboard).mock.lastCall;
  if (!call) {
    throw new Error('No link copied');
  }
  const url = new URL(call[0]);
  for (const [key, value] of Object.entries(expected)) {
    expect(url.searchParams.get(key)).toBe(value);
  }
  return url;
}

describe('parcours et restauration des simulateurs', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    vi.spyOn(analytics, 'trackSimulatorStarted').mockImplementation(() => undefined);
    vi.spyOn(analytics, 'trackSimulatorCalculated').mockImplementation(() => undefined);
    vi.spyOn(simulatorExport, 'copyToClipboard').mockResolvedValue(true);
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify(taxeSejourDataset), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
  });

  afterEach(() => {
    cleanup();
    window.sessionStorage.clear();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('calcule, partage et restaure le dernier calcul fiscal sans confondre les champs modifiés', async () => {
    const view = renderWithProviders(
      <SimulateurFiscalClassement />,
      '/simulateur-fiscal-classement?campaign=test#simulation'
    );

    changeInput('annual-revenue-input', '15000');
    fireEvent.click(screen.getByRole('radio', { name: '30 %' }));
    submitForm('annual-revenue-input');

    expect(await screen.findByRole('region', { name: /comparatif 2026/i })).toBeInTheDocument();
    await waitFor(expectSmoothWindowScroll);
    expect(analytics.trackSimulatorStarted).toHaveBeenCalledExactlyOnceWith('fiscal_classement');
    expect(analytics.trackSimulatorCalculated).toHaveBeenCalledExactlyOnceWith(
      'fiscal_classement',
      expect.objectContaining({ tmi_rate: 30, scope: 'micro_comparison' })
    );
    expect(window.location.search).toContain('revenue=15000');
    expect(window.location.hash).toBe('#simulation');

    changeInput('annual-revenue-input', '20000');
    fireEvent.click(screen.getByRole('button', { name: /copier le lien/i }));
    const copied = await expectCopiedQuery({ revenue: '15000', tmi: '30', campaign: 'test' });
    expect(copied.hash).toBe('#simulation');

    view.unmount();
    vi.mocked(window.scrollTo).mockClear();
    vi.mocked(simulatorExport.copyToClipboard).mockClear();
    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');

    expect(inputById('annual-revenue-input')).toHaveValue('20000');
    expect(screen.getByRole('radio', { name: '30 %' })).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: /copier le lien/i }));
    await expectCopiedQuery({ revenue: '15000', tmi: '30' });
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).toHaveBeenCalledTimes(1);
  });

  it('calcule au réel, partage et restaure occupation et exonérations', async () => {
    const view = renderWithProviders(
      <SimulateurTaxeSejour />,
      '/simulateur-taxe-sejour?campaign=test#simulation'
    );
    await selectCity();
    expect(document.getElementById('capacity-input')).not.toBeInTheDocument();
    changeInput('nightly-price-input', '100');
    changeInput('nights-input', '2');
    changeInput('persons-staying-input', '4');
    changeInput('exempted-persons-input', '1');
    submitForm('city-input');

    await waitFor(expectSmoothWindowScroll);
    expect(analytics.trackSimulatorStarted).toHaveBeenCalledExactlyOnceWith('taxe_sejour');
    expect(analytics.trackSimulatorCalculated).toHaveBeenCalledExactlyOnceWith(
      'taxe_sejour',
      expect.objectContaining({ has_exemptions: true, is_indicative: false })
    );
    const result = within(screen.getByRole('region', { name: /résultats/i }));
    expect(result.queryByText('Détail du calcul')).not.toBeInTheDocument();
    expect(result.getByText('Meublé non classé')).toBeInTheDocument();
    expect(result.getByText(/7[,.]50/)).toBeInTheDocument();
    expect(result.getByText('Selon le classement')).toBeInTheDocument();
    const categoryItems = within(
      result.getByRole('list', { name: /catégories de classement/i })
    ).getAllByRole('listitem');
    expect(categoryItems).toHaveLength(5);
    ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'].forEach((category) => {
      const item = categoryItems.find((candidate) => candidate.textContent?.includes(category));
      expect(item).toBeDefined();
      expect(item!).toHaveTextContent(/€/);
      expect(item!).toHaveTextContent(/économisés|écart|aucun|moins|plus/i);
    });
    expect(result.getByText('Taxes additionnelles')).toBeInTheDocument();
    changeInput('nightly-price-input', '120');
    fireEvent.click(screen.getByRole('button', { name: /copier le lien/i }));
    const copied = await expectCopiedQuery({
      city: 'testville-64',
      nightly: '100',
      nights: '2',
      persons: '4',
      exempted: '1',
      campaign: 'test',
    });
    expect(copied.searchParams.has('capacity')).toBe(false);
    expect(copied.hash).toBe('#simulation');

    view.unmount();
    vi.mocked(window.scrollTo).mockClear();
    vi.mocked(simulatorExport.copyToClipboard).mockClear();
    renderWithProviders(<SimulateurTaxeSejour />, '/simulateur-taxe-sejour');
    await screen.findByRole('button', { name: /copier le lien/i });
    expect(inputById('nightly-price-input')).toHaveValue(120);
    expect(inputById('persons-staying-input')).toHaveValue(4);
    expect(inputById('exempted-persons-input')).toHaveValue(1);
    fireEvent.click(screen.getByRole('button', { name: /copier le lien/i }));
    await expectCopiedQuery({ nightly: '100', persons: '4', exempted: '1' });
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).toHaveBeenCalledTimes(1);
  });

  it('relie les erreurs fiscales aux champs et ne calcule ni ne scrolle un formulaire invalide', () => {
    renderWithProviders(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement');
    submitForm('annual-revenue-input');

    expect(inputById('annual-revenue-input')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('group', { name: /imposition/i })).toHaveAttribute(
      'aria-describedby',
      'tmi-rate-error'
    );
    expect(document.getElementById('tmi-rate-error')).toHaveAttribute('role', 'alert');
    expect(screen.getByRole('radio', { name: '30 %' })).not.toBeChecked();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).not.toHaveBeenCalled();
  });

  it('localise en anglais l’erreur de recettes du simulateur fiscal', () => {
    renderWithProviders(
      <SimulateurFiscalClassement />,
      '/en/furnished-tourist-accommodation-tax-simulator'
    );
    changeInput('annual-revenue-input', 'abc');
    submitForm('annual-revenue-input');

    expect(screen.getByText('Enter valid annual rental income for 2026.')).toBeInTheDocument();
    expect(
      screen.queryByText("Saisissez un chiffre d'affaires annuel 2026 valide.")
    ).not.toBeInTheDocument();
  });

  it('relie les erreurs de commune, de nuits et d’exonérations aux champs', async () => {
    renderWithProviders(<SimulateurTaxeSejour />, '/simulateur-taxe-sejour');
    const cityInput = await screen.findByRole('combobox');
    submitForm('city-input');

    expect(cityInput).toHaveAttribute('aria-invalid', 'true');
    expect(cityInput).toHaveAttribute('aria-describedby', 'city-error');
    expect(document.getElementById('city-error')).toHaveAttribute('role', 'alert');
    await selectCity();
    changeInput('nightly-price-input', '100');
    changeInput('nights-input', '0');
    changeInput('persons-staying-input', '1');
    changeInput('exempted-persons-input', '2');
    submitForm('city-input');

    expect(inputById('nights-input')).toHaveAttribute('aria-invalid', 'true');
    expect(inputById('nights-input')).toHaveAttribute('aria-describedby', 'nights-error');
    expect(inputById('exempted-persons-input')).toHaveAttribute('aria-invalid', 'true');
    expect(inputById('exempted-persons-input')).toHaveAttribute(
      'aria-describedby',
      'exempted-persons-error'
    );
    expect(document.getElementById('exempted-persons-error')).toHaveAttribute('role', 'alert');
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).not.toHaveBeenCalled();
  });

  it('localise en anglais les erreurs des champs partagés du simulateur taxe de séjour', async () => {
    renderWithProviders(<SimulateurTaxeSejour />, '/en/tourist-tax-simulator');
    await selectCity();
    changeInput('nightly-price-input', '');
    changeInput('nights-input', '0');
    changeInput('persons-staying-input', '1');
    changeInput('exempted-persons-input', '2');
    submitForm('city-input');

    expect(
      screen.getByText('Enter a price excluding tax that is greater than zero.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Enter a whole number of nights greater than zero.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('The number of exempt guests cannot exceed the number of guests staying.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Indiquez un prix HT strictement positif.')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Indiquez un nombre de nuits entier strictement positif.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Le nombre de personnes exonérées ne peut pas dépasser le nombre de personnes accueillies.'
      )
    ).not.toBeInTheDocument();
  });

  it('localise en anglais les tooltips passés aux champs du simulateur taxe de séjour', async () => {
    renderWithProviders(<SimulateurTaxeSejour />, '/en/tourist-tax-simulator');
    await selectCity();

    const nightsTooltip = screen.getByRole('button', {
      name: 'Information about the number of rented nights to compare.',
    });
    fireEvent.mouseEnter(nightsTooltip);
    expect(
      screen.getByText(
        'Enter the number of nights to compare: one night, one week or a full rental period, for example 90 or 120 nights.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Indiquez le nombre de nuits à comparer : une nuit, une semaine ou une période complète de location, par exemple 90 ou 120 nuits.'
      )
    ).not.toBeInTheDocument();

    const exemptionsTooltip = screen.getByRole('button', {
      name: 'Who may be exempt: minors, seasonal workers employed in the municipality, people receiving emergency accommodation or temporary rehousing, and accommodation below the locally defined rent threshold.',
    });
    fireEvent.mouseEnter(exemptionsTooltip);
    expect(
      screen.getByText(
        'Exemptions generally cover minors, seasonal workers employed in the municipality, people receiving emergency accommodation or temporary rehousing, and accommodation below the locally defined rent threshold.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'En général, sont exonérées: les personnes mineures, les salariés saisonniers employés dans la commune, les personnes hébergées en urgence ou relogées temporairement, et les logements dont le loyer est sous le seuil fixé localement.'
      )
    ).not.toBeInTheDocument();
  });

  it('utilise la capacité pour le forfait et les occupants pour le non classé', async () => {
    renderWithProviders(<SimulateurTaxeSejour />, '/simulateur-taxe-sejour');
    await selectCity('Forfaitville');
    changeInput('nightly-price-input', '100');
    changeInput('nights-input', '2');
    changeInput('capacity-input', '2');
    changeInput('persons-staying-input', '4');
    changeInput('exempted-persons-input', '3');
    submitForm('city-input');

    expect(inputById('persons-staying-input')).toHaveAttribute('aria-invalid', 'true');
    expect(analytics.trackSimulatorCalculated).not.toHaveBeenCalled();
    changeInput('capacity-input', '10');
    submitForm('city-input');

    const result = within(screen.getByRole('region', { name: /résultats/i }));
    expect(result.queryByText('Détail du calcul')).not.toBeInTheDocument();
    expect(result.getByText('Meublé non classé')).toBeInTheDocument();
    expect(result.getByText(/2[,.]50/)).toBeInTheDocument();
    expect(result.getByText('Selon le classement')).toBeInTheDocument();
    expect(result.getAllByText('indicatif').length).toBeGreaterThan(0);
    const oneStar = within(
      result.getByRole('list', { name: /catégories de classement/i })
    ).getByText(/1 étoile/i);
    expect(oneStar.closest('li')).toHaveTextContent(/20[,.]00/);
    expect(result.getByText('Taxes additionnelles')).toBeInTheDocument();
    const params = new URLSearchParams(window.location.search);
    expect(params.get('capacity')).toBe('10');
    expect(params.get('persons')).toBe('4');
    expect(params.get('exempted')).toBe('3');
    expect(analytics.trackSimulatorCalculated).toHaveBeenCalledWith(
      'taxe_sejour',
      expect.objectContaining({ is_indicative: true })
    );
  });

  it('ne présente pas une référence forfaitaire indicative comme une économie nulle', async () => {
    renderWithProviders(
      <SimulateurTaxeSejour />,
      '/en/tourist-tax-simulator?city=full-forfait-64&nightly=100&nights=2&capacity=10'
    );

    await screen.findByRole('button', { name: /copy link/i });
    const result = within(screen.getByRole('region', { name: /results/i }));
    const summary = result.getByRole('status');
    expect(summary).toHaveTextContent('Limited comparison');
    expect(summary).not.toHaveTextContent('€');
    expect(within(summary).getByText('—')).toBeInTheDocument();
    expect(result.queryByText('Calculation details')).not.toBeInTheDocument();
    expect(result.getAllByText('Difference unavailable')).toHaveLength(5);
    expect(result.getByText('Additional taxes')).toBeInTheDocument();
    expect(document.getElementById('persons-staying-input')).not.toBeInTheDocument();
  });

  it('présente explicitement une absence d’écart fiscal quand les deux totaux sont nuls', () => {
    renderWithProviders(
      <SimulateurFiscalClassement />,
      '/simulateur-fiscal-classement?revenue=0.01&tmi=0'
    );

    const result = within(screen.getByRole('region', { name: /comparatif 2026/i }));
    expect(result.getByText('Aucun écart', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '0 %' })).toBeChecked();
    expect(screen.getByRole('button', { name: /exporter pdf/i })).toBeInTheDocument();
    const table = openComparisonTable();
    expect(table.getAllByRole('cell', { name: /^0,00\s€$/ }).length).toBeGreaterThanOrEqual(2);
  });

  it('restaure le lien fiscal en anglais et donne priorité au lien sur la session', () => {
    window.sessionStorage.setItem(
      'etoilys.simulateurFiscalClassement.v1',
      JSON.stringify({
        version: 1,
        form: { annualRevenueInput: '30000', selectedTmiRate: 11 },
        lastCalculation: { annualRevenue: 30000, tmiRate: 11 },
      })
    );
    renderWithProviders(
      <SimulateurFiscalClassement />,
      '/en/furnished-tourist-accommodation-tax-simulator?revenue=15000&tmi=30'
    );

    expect(inputById('annual-revenue-input')).toHaveValue('15000');
    expect(screen.getByRole('radio', { name: '30 %' })).toBeChecked();
    expect(screen.getByRole('region', { name: /2026 comparison/i })).toHaveTextContent(
      /€1,458\.00/
    );
    const table = openComparisonTable();
    expect(table.getByRole('columnheader', { name: 'Unclassified' })).toBeInTheDocument();
    expect(table.getByRole('columnheader', { name: 'Classified' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).not.toHaveBeenCalled();
  });

  it('restaure le lien taxe en anglais après chargement du dataset', async () => {
    renderWithProviders(
      <SimulateurTaxeSejour />,
      '/en/tourist-tax-simulator?city=testville-64&nightly=150&nights=1&persons=1&exempted=0'
    );

    expect(await screen.findByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(inputById('city-input')).toHaveValue('Testville (64)');
    expect(inputById('persons-staying-input')).toHaveValue(1);
    const result = within(screen.getByRole('region', { name: /results/i }));
    expect(result.queryByText('Calculation details')).not.toBeInTheDocument();
    expect(result.getByText('Unclassified accommodation')).toBeInTheDocument();
    expect(result.getAllByText(/4[,.]00/).length).toBeGreaterThan(0);
    expect(result.getByText('By star rating')).toBeInTheDocument();
    expect(
      within(result.getByRole('list', { name: /star rating categories/i })).getAllByRole('listitem')
    ).toHaveLength(5);
    expect(result.getByText('1 star')).toBeInTheDocument();
    expect(result.getByText('Additional taxes')).toBeInTheDocument();
    expect(screen.queryByRole('table', { hidden: true })).not.toBeInTheDocument();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(analytics.trackSimulatorCalculated).not.toHaveBeenCalled();
  });

  it('masque le comparatif chiffré et le PDF hors du périmètre fiscal', () => {
    renderWithProviders(
      <SimulateurFiscalClassement />,
      '/simulateur-fiscal-classement?revenue=83601&tmi=41'
    );

    expect(screen.getByRole('region', { name: /hors périmètre/i })).toBeInTheDocument();
    expect(screen.queryByRole('table', { hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /exporter pdf/i })).not.toBeInTheDocument();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('rend les liens inter-simulateurs avec les routes localisées', async () => {
    const fiscalView = renderWithProviders(
      <SimulateurFiscalClassement />,
      localizedRoutes.simulateurFiscalClassement.en!
    );
    expect(screen.getByRole('link', { name: /tourist tax simulator/i })).toHaveAttribute(
      'href',
      localizedRoutes.simulateurTaxeSejour.en
    );
    fiscalView.unmount();

    const taxView = renderWithProviders(
      <SimulateurTaxeSejour />,
      localizedRoutes.simulateurTaxeSejour.fr!
    );
    expect(await screen.findByRole('link', { name: /simulateur fiscal/i })).toHaveAttribute(
      'href',
      localizedRoutes.simulateurFiscalClassement.fr
    );
    taxView.unmount();
  });
});
