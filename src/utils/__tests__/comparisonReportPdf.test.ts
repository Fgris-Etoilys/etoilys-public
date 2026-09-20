import { jsPDF } from 'jspdf';
import { expect, it, vi } from 'vitest';
import { createComparisonReportPdf, type ComparisonPdfReport } from '../comparisonReportPdf';
import * as simulatorPdfShared from '../simulatorPdfShared';

interface TextDraw {
  text: string;
  page: number;
  top: number;
  bottom: number;
}

it('preserves report data and localized links while paginating long notes without overlapping text', async () => {
  const logo = vi.spyOn(simulatorPdfShared, 'getEtoilysLogoPngAsset').mockResolvedValue(null);
  let draws: TextDraw[] = [];
  const captureText = function (
    this: jsPDF,
    payload: {
      text: string | string[];
      y: number;
      options: { lineHeightFactor?: number };
    }
  ) {
    const lines = typeof payload.text === 'string' ? [payload.text] : payload.text;
    const size = this.getFontSize() / this.internal.scaleFactor;
    const leading = size * (payload.options.lineHeightFactor ?? this.getLineHeightFactor());
    draws.push({
      text: lines.join(' '),
      page: this.getCurrentPageInfo().pageNumber,
      top: payload.y - size * 0.8,
      bottom: payload.y + (lines.length - 1) * leading + size * 0.2,
    });
  };
  const captureEvent: [string, typeof captureText] = ['preProcessText', captureText];
  jsPDF.API.events.push(captureEvent);

  try {
    // The test environment has no site stylesheet: PDF generation must use token fallbacks.
    expect(getComputedStyle(document.documentElement).getPropertyValue('--color-ink')).toBe('');
    const noteTokens = Array.from(
      { length: 600 },
      (_, index) => `NOTE_${String(index).padStart(4, '0')}`
    );

    for (const locale of ['fr', 'en'] as const) {
      draws = [];
      const report: ComparisonPdfReport = {
        locale,
        title: `COMPARISON_${locale.toUpperCase()}`,
        subtitle: 'Report data fixture',
        filename: `comparison-${locale}.pdf`,
        simulatorUrl: `https://www.etoilys.fr${
          locale === 'fr'
            ? '/simulateur-fiscal-classement'
            : '/en/furnished-tourist-accommodation-tax-simulator'
        }?revenue=15000&tmi=30`,
        summary: {
          label: 'Annual difference',
          value: '1458.00 EUR',
          description: 'Comparison at unchanged income.',
          comparisons: [
            { label: 'Unclassified', value: '5103.00 EUR' },
            { label: 'Classified', value: '3645.00 EUR' },
          ],
          notice: 'Indicative estimate',
        },
        parameters: [
          ['Revenue', '15000.00 EUR'],
          ['Tax rate', '30 %'],
        ],
        comparison: {
          columns: ['Scenario', 'Total', 'Difference'],
          rows: [
            { cells: ['Reference', '5103.00 EUR', 'Reference'], tone: 'reference' },
            { cells: ['Lower total', '3645.00 EUR', '1458.00 EUR'], tone: 'positive' },
            { cells: ['Higher total', '5303.00 EUR', '200.00 EUR'], tone: 'negative' },
            { cells: ['Same total', '5103.00 EUR', '0.00 EUR'], tone: 'neutral' },
          ],
          widths: [0.4, 0.3, 0.3],
        },
        notes: [{ title: 'Long method note', paragraphs: [noteTokens.join(' ')] }],
        sources: [{ label: 'Official source', url: 'https://www.impots.gouv.fr' }],
        generatedAt: new Date('2026-09-19T12:00:00Z'),
      };

      const doc = await createComparisonReportPdf(report);
      const pdf = doc.output();
      const renderedText = draws.map(({ text }) => text).join(' ');
      expect(pdf).toMatch(/^%PDF-/);
      expect(pdf).not.toMatch(/\b(?:NaN|Infinity|undefined)\b/);
      for (const value of [
        report.title,
        report.summary.value,
        ...report.parameters.flat(),
        ...report.comparison.columns,
        ...report.comparison.rows.flatMap(({ cells }) => cells),
      ]) {
        expect(renderedText).toContain(value);
      }
      const classificationUrl = `https://www.etoilys.fr${
        locale === 'fr' ? '/demande-classement' : '/en/request-a-classification'
      }`;
      const links = Array.from(pdf.matchAll(/\/URI \(([^)]+)\)/g), (match) => match[1]);
      for (const url of [
        classificationUrl,
        report.simulatorUrl,
        ...report.sources.map(({ url }) => url),
      ]) {
        expect(links).toContain(url);
      }

      const notes = draws.filter(({ text }) => text.includes('NOTE_'));
      expect(doc.getNumberOfPages()).toBeGreaterThan(2);
      expect(new Set(notes.map(({ page }) => page)).size).toBeGreaterThan(1);
      expect(
        notes
          .map(({ text }) => text)
          .join(' ')
          .match(/NOTE_\d+/g)
      ).toEqual(noteTokens);
      for (const note of notes) {
        expect(note.top).toBeGreaterThan(0);
        expect(note.bottom).toBeLessThan(doc.internal.pageSize.getHeight());
        for (const other of draws.filter((draw) => draw !== note && draw.page === note.page)) {
          expect(
            note.top < other.bottom && note.bottom > other.top,
            `Note overlaps page ${note.page} text: ${other.text}`
          ).toBe(false);
        }
      }
    }
  } finally {
    jsPDF.API.events.splice(jsPDF.API.events.indexOf(captureEvent), 1);
    logo.mockRestore();
  }
});

it('rejects unsupported locales and incoherent table shapes before rendering', async () => {
  const baseReport: ComparisonPdfReport = {
    locale: 'fr',
    title: 'Contrat PDF',
    subtitle: 'Validation',
    filename: 'contrat.pdf',
    simulatorUrl: 'https://www.etoilys.fr/simulateur-taxe-sejour',
    summary: {
      label: 'Synthèse',
      value: '100,00 €',
      description: 'Description',
      comparisons: [
        { label: 'Non classé', value: '100,00 €' },
        { label: 'Classé', value: '80,00 €' },
      ],
    },
    parameters: [['Commune', 'Testville']],
    comparison: {
      columns: ['Catégorie', 'Montant'],
      widths: [0.5, 0.5],
      rows: [{ cells: ['Non classé', '100,00 €'] }],
    },
    notes: [],
    sources: [],
  };

  await expect(
    createComparisonReportPdf({ ...baseReport, locale: 'nl' } as unknown as ComparisonPdfReport)
  ).rejects.toThrow(/Unsupported comparison PDF locale/);
  await expect(
    createComparisonReportPdf({
      ...baseReport,
      comparison: { ...baseReport.comparison, widths: [1] },
    })
  ).rejects.toThrow(/widths/);
  await expect(
    createComparisonReportPdf({
      ...baseReport,
      comparison: { ...baseReport.comparison, rows: [{ cells: ['Non classé'] }] },
    })
  ).rejects.toThrow(/row 1/);
});
