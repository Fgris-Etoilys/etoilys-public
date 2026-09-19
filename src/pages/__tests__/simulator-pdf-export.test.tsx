import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../../components/ui/Toast';
import { formatEuro } from '../../i18n/numberFormatting';
import { exportComparisonReportPdf } from '../../utils/comparisonReportPdf';
import SimulateurFiscalClassement from '../SimulateurFiscalClassement';
import SimulateurTaxeSejour from '../SimulateurTaxeSejour';

vi.mock('../../utils/comparisonReportPdf', () => ({ exportComparisonReportPdf: vi.fn() }));

const dataset = {
  v: 'pdf-test',
  sd: '01/01/2026',
  g: '2026-01-01T00:00:00.000Z',
  c: [
    [
      'real-64',
      'Testville (64)',
      'testville 64',
      'r',
      'r',
      1,
      [['summer', '1 avril', '30 septembre', 5, 4, 1, 2, 3, 4, 5]],
      [],
    ],
    [
      'forfait-64',
      'Forfaitville (64)',
      'forfaitville 64',
      'f',
      'f',
      0,
      [['year', '1 janvier', '31 décembre', 5, 4, 1, 2, 3, 4, 5]],
      [],
    ],
  ],
};

function renderAt(page: ReactNode, path: string) {
  window.history.replaceState({}, '', path);
  return render(
    <BrowserRouter>
      <ToastProvider>{page}</ToastProvider>
    </BrowserRouter>
  );
}

function reportSent() {
  const report = vi.mocked(exportComparisonReportPdf).mock.lastCall?.[0];
  if (!report) throw new Error('No PDF report sent');
  return report;
}

beforeEach(() => {
  vi.mocked(exportComparisonReportPdf).mockReset().mockResolvedValue(undefined);
  vi.spyOn(globalThis, 'fetch').mockImplementation(
    async () => new Response(JSON.stringify(dataset))
  );
});

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('simulator PDF adapters', () => {
  it('exports the calculated fiscal snapshot in English and restores the button after loading', async () => {
    let finishExport!: () => void;
    vi.mocked(exportComparisonReportPdf).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishExport = resolve;
        })
    );
    renderAt(
      <SimulateurFiscalClassement />,
      '/en/furnished-tourist-accommodation-tax-simulator?revenue=15000&tmi=30'
    );
    fireEvent.change(screen.getByLabelText('Annual rental income for 2026'), {
      target: { value: '20000' },
    });
    fireEvent.click(screen.getByRole('radio', { name: '41 %' }));
    const button = screen.getByRole('button', { name: 'Export PDF' });
    fireEvent.click(button);

    await waitFor(() => expect(exportComparisonReportPdf).toHaveBeenCalledTimes(1));
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveTextContent('Creating PDF');
    const report = reportSent();
    expect(report.locale).toBe('en');
    expect(report.parameters).toContainEqual(['Annual rental income for 2026', '€15,000.00']);
    expect(report.parameters).toContainEqual(['Marginal income tax rate', '30 %']);
    expect(report.summary.value).toBe('€1,458.00');
    expect(report.summary.comparisons.map(({ value }) => value)).toEqual([
      '€5,103.00',
      '€3,645.00',
    ]);
    expect(report.comparison.rows).toHaveLength(6);
    expect(report.comparison.rows[5]?.cells).toEqual([
      'Estimated total',
      '€5,103.00',
      '€3,645.00',
      '€1,458.00 saved',
    ]);
    expect(report.filename).toMatch(/^simulation-fiscale-classement-15000-.*\.pdf$/);
    expect(report.simulatorUrl).toBe(
      'https://www.etoilys.fr/en/furnished-tourist-accommodation-tax-simulator?revenue=15000&tmi=30'
    );
    expect(JSON.stringify(report)).not.toMatch(
      /Recettes locatives|Tranche marginale|Soit environ|sur 5 ans/
    );

    await act(async () => finishExport());
    await waitFor(() => expect(button).toBeEnabled());
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button).toHaveTextContent('Export PDF');
    expect(await screen.findByText('PDF generated.')).toBeInTheDocument();
  });

  it('retains the French tourist-tax snapshot, exemptions, period, additional taxes and dataset date', async () => {
    renderAt(
      <SimulateurTaxeSejour />,
      '/simulateur-taxe-sejour?city=real-64&nightly=100&nights=2&persons=4&exempted=1'
    );
    const button = await screen.findByRole('button', { name: 'Exporter PDF' });
    fireEvent.change(screen.getByRole('spinbutton', { name: /Prix par nuit HT/ }), {
      target: { value: '120' },
    });
    fireEvent.click(button);
    await waitFor(() => expect(exportComparisonReportPdf).toHaveBeenCalledTimes(1));

    const report = reportSent();
    expect(report.locale).toBe('fr');
    expect(report.parameters).toContainEqual(['Prix par nuit HT', formatEuro(100, 'fr')]);
    expect(report.parameters).toContainEqual(['Personnes accueillies', '4']);
    expect(report.parameters).toContainEqual(['Personnes exonérées', '1']);
    expect(report.parameters).toContainEqual(['Période tarifaire', '1er avril — 30 septembre']);
    expect(report.summary.value).toBe(formatEuro(1.65, 'fr'));
    expect(report.comparison.rows).toHaveLength(6);
    expect(report.comparison.rows[0]?.cells[1]).toBe(formatEuro(8.25, 'fr'));
    expect(report.comparison.rows[1]?.cells[1]).toBe(formatEuro(6.6, 'fr'));
    expect(report.notes.find(({ title }) => title === 'Taxes additionnelles')?.paragraphs).toEqual([
      'Taxe additionnelle départementale de 10% : Oui',
      'Taxe additionnelle régionale de 15% (Société des Grands Projets) : Non',
      'Taxe additionnelle régionale de 34% (LGV) : Non',
      'Taxe additionnelle régionale de 200% (Île-de-France Mobilités) : Non',
    ]);
    expect(report.notes.flatMap(({ paragraphs }) => paragraphs).join(' ')).toContain(
      'DELTA vpdf-test'
    );
    expect(report.notes.flatMap(({ paragraphs }) => paragraphs).join(' ')).toContain(
      '1 janvier 2026'
    );
    expect(report.simulatorUrl).toBe(
      'https://www.etoilys.fr/simulateur-taxe-sejour?city=real-64&nightly=100&nights=2&persons=4&exempted=1'
    );
    expect(report.filename).toMatch(/^simulation-taxe-sejour-real-64-.*\.pdf$/);
    await waitFor(() => expect(button).toBeEnabled());
  });

  it('exports an indicative flat-rate comparison in English and enables retry after a renderer error', async () => {
    vi.mocked(exportComparisonReportPdf).mockRejectedValueOnce(new Error('PDF failed'));
    renderAt(
      <SimulateurTaxeSejour />,
      '/en/tourist-tax-simulator?city=forfait-64&nightly=100&nights=2&capacity=10'
    );
    const button = await screen.findByRole('button', { name: 'Export PDF' });
    fireEvent.click(button);
    expect(await screen.findByText('The PDF could not be generated.')).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('aria-busy', 'false');

    const report = reportSent();
    expect(report.parameters).toContainEqual(['Accommodation capacity', '10']);
    expect(report.parameters.some(([label]) => label === 'Guests staying')).toBe(false);
    expect(report.summary.label).toBe('Limited comparison');
    expect(report.summary.value).toBe('—');
    expect(report.summary.comparisons[0]?.value).toBe('Not calculated');
    expect(report.summary.notice).toContain('Indicative comparison');
    expect(report.comparison.rows[0]?.cells).toEqual([
      'Unclassified (indicative)',
      'Not calculated',
      'Comparison reference',
    ]);
    expect(
      report.comparison.rows.slice(1).every(({ cells }) => cells[2] === 'Difference unavailable')
    ).toBe(true);
    expect(report.comparison.rows[1]?.cells).toEqual([
      '1 star (indicative)',
      '€20.00',
      'Difference unavailable',
    ]);
    expect(report.notes.find(({ title }) => title === 'Points to note')?.paragraphs).toHaveLength(
      2
    );
    expect(JSON.stringify(report)).not.toMatch(
      /Non classé|économisés|Régime forfaitaire|Aucun écart/
    );
    expect(report.simulatorUrl).toBe(
      'https://www.etoilys.fr/en/tourist-tax-simulator?city=forfait-64&nightly=100&nights=2&capacity=10'
    );

    fireEvent.click(button);
    await waitFor(() => expect(exportComparisonReportPdf).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('PDF generated.')).toBeInTheDocument();
  });

  it('preserves a zero tax difference at TMI 0 and never offers a PDF for an out-of-scope fiscal result', async () => {
    const view = renderAt(
      <SimulateurFiscalClassement />,
      '/en/furnished-tourist-accommodation-tax-simulator?revenue=0.01&tmi=0'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Export PDF' }));
    await waitFor(() => expect(exportComparisonReportPdf).toHaveBeenCalledTimes(1));
    expect(reportSent().summary.value).toBe('No difference');
    expect(reportSent().parameters).toContainEqual(['Marginal income tax rate', '0 %']);
    expect(reportSent().comparison.rows[5]?.cells).toEqual([
      'Estimated total',
      '€0.00',
      '€0.00',
      'No difference',
    ]);
    view.unmount();

    renderAt(<SimulateurFiscalClassement />, '/simulateur-fiscal-classement?revenue=83601&tmi=41');
    expect(screen.getByRole('region', { name: /hors périmètre/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Exporter PDF|Création du PDF/ })
    ).not.toBeInTheDocument();
    expect(exportComparisonReportPdf).toHaveBeenCalledTimes(1);
  });
});
