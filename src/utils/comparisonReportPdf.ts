import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLocalizedPath } from '../i18n/routeHelpers';
import { simulatorReportContent } from '../i18n/simulatorReportContent';
import {
  getAutoTableFinalY,
  getEtoilysLogoPngAsset,
  getSimulatorPdfPalette,
  normalizePdfText,
  type PdfColor,
} from './simulatorPdfShared';

export type ComparisonPdfLocale = 'fr' | 'en';

interface ComparisonSummaryItem {
  label: string;
  value: string;
}

export interface ComparisonPdfReport {
  locale: ComparisonPdfLocale;
  title: string;
  subtitle: string;
  filename: string;
  simulatorUrl: string;
  summary: {
    label: string;
    value: string;
    description: string;
    comparisons: [ComparisonSummaryItem, ComparisonSummaryItem];
    notice?: string;
  };
  parameters: Array<[string, string]>;
  comparison: {
    columns: string[];
    rows: Array<{ cells: string[]; tone?: 'reference' | 'positive' | 'negative' | 'neutral' }>;
    widths: number[];
  };
  notes: Array<{ title: string; paragraphs: string[] }>;
  sources: Array<{ label: string; url: string }>;
  generatedAt?: Date;
}

type Color = PdfColor;

function validateComparisonReport(report: ComparisonPdfReport): void {
  if (report.locale !== 'fr' && report.locale !== 'en') {
    throw new Error(`Unsupported comparison PDF locale: ${String(report.locale)}`);
  }
  if (report.summary.comparisons.length !== 2) {
    throw new Error('Comparison PDF summary expects exactly two comparison values.');
  }
  if (report.comparison.columns.length === 0) {
    throw new Error('Comparison PDF table requires at least one column.');
  }
  if (report.comparison.widths.length !== report.comparison.columns.length) {
    throw new Error('Comparison PDF table widths must match the columns.');
  }
  if (!report.comparison.widths.every((width) => Number.isFinite(width) && width > 0)) {
    throw new Error('Comparison PDF table widths must be positive numbers.');
  }
  report.comparison.rows.forEach((row, index) => {
    if (row.cells.length !== report.comparison.columns.length) {
      throw new Error(`Comparison PDF row ${index + 1} does not match the columns.`);
    }
  });
}

export async function createComparisonReportPdf(report: ComparisonPdfReport): Promise<jsPDF> {
  validateComparisonReport(report);
  const copy = simulatorReportContent[report.locale];
  const palette = getSimulatorPdfPalette();
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  doc.setProperties({ title: report.title, subject: report.subtitle, author: 'Etoilys' });
  doc.setLanguage(report.locale === 'en' ? 'en-GB' : 'fr-FR');
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const bottom = height - 64;
  const logo = await getEtoilysLogoPngAsset('/logo-etoilys-editorial.svg');
  const classificationPath =
    getLocalizedPath('demandeClassement', report.locale) ?? '/demande-classement';
  const classificationUrl = `https://www.etoilys.fr${classificationPath}`;
  const date = new Intl.DateTimeFormat(report.locale === 'en' ? 'en-GB' : 'fr-FR', {
    dateStyle: 'long',
  }).format(report.generatedAt ?? new Date());
  let y = 0;

  const font = (size: number, bold = false, ink: Color = palette.ink, serif = false) => {
    doc.setFont(serif ? 'times' : 'helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...ink);
  };
  const lines = (value: string, maxWidth = contentWidth): string[] =>
    doc.splitTextToSize(normalizePdfText(value), maxWidth) as string[];
  const text = (
    value: string,
    x: number,
    top: number,
    maxWidth: number,
    size: number,
    bold = false,
    ink: Color = palette.ink,
    serif = false
  ): number => {
    font(size, bold, ink, serif);
    const wrapped = lines(value, maxWidth);
    doc.text(wrapped, x, top + size * 0.8, { lineHeightFactor: 1.35 });
    return wrapped.length * size * 1.35;
  };
  const rule = (at: number, x = margin, length = contentWidth) => {
    doc.setDrawColor(...palette.muted);
    doc.setLineWidth(0.35);
    doc.line(x, at, x + length, at);
  };
  const startPage = () => {
    doc.setFillColor(...palette.paper);
    doc.rect(0, 0, width, height, 'F');
    if (logo) {
      // The source logo includes its own safe space.
      doc.addImage(logo.dataUrl, 'PNG', margin - 11, 11, 108, 108 / logo.aspectRatio);
    } else {
      text('Etoilys', margin, 29, 160, 27, true, palette.ink, true);
    }
    font(8, false, palette.muted);
    doc.text(normalizePdfText(`${copy.generated} ${date}`), width - margin, 40, { align: 'right' });
    rule(78);
    y = 100;
  };
  const nextPage = () => {
    doc.addPage();
    startPage();
  };
  const ensure = (needed: number) => {
    if (y + needed > bottom) nextPage();
  };
  const section = (label: string) => {
    ensure(40);
    y += text(label, margin, y, contentWidth, 16, true, palette.ink, true) + 12;
  };
  const paragraph = (value: string, size = 9.5, ink = palette.muted) => {
    font(size, false, ink);
    const wrapped = lines(value);
    const leading = size * 1.35;
    for (const line of wrapped) {
      ensure(leading);
      font(size, false, ink);
      doc.text(line, margin, y + size * 0.8);
      y += leading;
    }
    y += 4;
  };
  const actions = () => {
    const boxHeight = 142;
    ensure(boxHeight);
    doc.setFillColor(...palette.ink);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'F');
    text(copy.next, margin + 20, y + 17, contentWidth - 40, 21, true, palette.paper, true);
    text(copy.nextDescription, margin + 20, y + 49, contentWidth - 40, 9.5, false, palette.paper);
    const buttonWidth = (contentWidth - 50) / 2;
    const buttonY = y + 96;
    const buttons = [
      { label: copy.classify, href: classificationUrl, primary: true },
      { label: copy.resume, href: report.simulatorUrl, primary: false },
    ];
    buttons.forEach((button, index) => {
      const x = margin + 20 + index * (buttonWidth + 10);
      doc.setFillColor(...palette.paper);
      doc.setDrawColor(...palette.paper);
      doc.setLineWidth(0.6);
      doc.roundedRect(x, buttonY, buttonWidth, 30, 2, 2, button.primary ? 'F' : 'S');
      font(9.5, true, button.primary ? palette.ink : palette.paper);
      doc.text(button.label, x + buttonWidth / 2, buttonY + 19, { align: 'center' });
      doc.link(x, buttonY, buttonWidth, 30, { url: button.href });
    });
    y += boxHeight + 18;
  };

  startPage();
  y += text(copy.report, margin, y, contentWidth, 8.5, true, palette.muted) + 9;
  y += text(report.title, margin, y, contentWidth, 30, true, palette.ink, true) + 8;
  y += text(report.subtitle, margin, y, contentWidth, 10, false, palette.muted) + 22;

  const summaryTop = y;
  const summaryInset = margin + 22;
  // Measure the summary before painting its background, including long locales and notices.
  font(11, true);
  const labelHeight = lines(report.summary.label, contentWidth - 44).length * 15;
  font(38, true);
  const valueHeight = lines(report.summary.value, contentWidth - 44).length * 48;
  font(10);
  const descriptionHeight = lines(report.summary.description, contentWidth - 44).length * 14;
  const comparisonWidth = (contentWidth - 58) / 2;
  const comparisonHeight = Math.max(
    0,
    ...report.summary.comparisons.map((item) => {
      font(9);
      const labelHeight = lines(item.label, comparisonWidth).length * 13;
      font(20, true);
      return labelHeight + lines(item.value, comparisonWidth).length * 27 + 3;
    })
  );
  font(9);
  const noticeHeight = report.summary.notice
    ? lines(report.summary.notice, contentWidth - 44).length * 13 + 13
    : 0;
  const summaryHeight =
    52 + labelHeight + valueHeight + descriptionHeight + comparisonHeight + noticeHeight;
  doc.setFillColor(...palette.sage);
  doc.roundedRect(margin, summaryTop, contentWidth, summaryHeight, 4, 4, 'F');
  y += 20;
  y += text(report.summary.label, summaryInset, y, contentWidth - 44, 11, true) + 5;
  y += text(report.summary.value, summaryInset, y, contentWidth - 44, 38, true) + 1;
  y +=
    text(report.summary.description, summaryInset, y, contentWidth - 44, 10, false, palette.muted) +
    13;
  rule(y, summaryInset, contentWidth - 44);
  y += 12;
  report.summary.comparisons.forEach((item, index) => {
    const x = summaryInset + index * (comparisonWidth + 14);
    const label = text(item.label, x, y, comparisonWidth, 9, false, palette.muted);
    text(item.value, x, y + label + 3, comparisonWidth, 20, true);
  });
  y += comparisonHeight;
  if (report.summary.notice)
    text(report.summary.notice, summaryInset, y + 8, contentWidth - 44, 9, false, palette.muted);
  y = summaryTop + summaryHeight + 22;

  section(copy.parameters);
  for (let index = 0; index < report.parameters.length; index += 2) {
    const row = report.parameters.slice(index, index + 2);
    const cellWidth = (contentWidth - 24) / 2;
    const labelHeight = Math.max(
      ...row.map(([label]) => {
        font(8.5);
        return lines(label, cellWidth).length * 12;
      })
    );
    font(10, true);
    const rowHeight =
      Math.max(...row.map(([, value]) => lines(value, cellWidth).length * 14)) + labelHeight + 12;
    ensure(rowHeight);
    row.forEach(([label, value], column) => {
      const x = margin + column * (cellWidth + 24);
      text(label, x, y, cellWidth, 8.5, false, palette.muted);
      text(value, x, y + labelHeight + 2, cellWidth, 10, true);
    });
    y += rowHeight;
  }
  y += 10;
  actions();

  nextPage();
  y += text(copy.details, margin, y, contentWidth, 29, true, palette.ink, true) + 14;
  section(copy.comparison);
  autoTable(doc, {
    startY: y,
    margin: { top: 100, right: margin, bottom: height - bottom, left: margin },
    head: [report.comparison.columns.map(normalizePdfText)],
    body: report.comparison.rows.map((row) => row.cells.map(normalizePdfText)),
    theme: 'plain',
    rowPageBreak: 'avoid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 7,
      textColor: palette.ink,
      overflow: 'linebreak',
      lineColor: palette.paper,
      lineWidth: { bottom: 2 },
    },
    headStyles: {
      fillColor: palette.ink,
      textColor: palette.paper,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fillColor: palette.surface },
    columnStyles: Object.fromEntries(
      report.comparison.widths.map((ratio, index) => [index, { cellWidth: contentWidth * ratio }])
    ),
    didParseCell: ({ section: tableSection, row, cell }) => {
      if (tableSection !== 'body') return;
      const tone = report.comparison.rows[row.index]?.tone;
      if (tone === 'reference' || tone === 'positive') {
        cell.styles.fillColor = palette.sage;
        cell.styles.fontStyle = tone === 'positive' ? 'bold' : 'normal';
      }
      if (tone === 'negative') cell.styles.textColor = palette.copper;
    },
    willDrawPage: ({ pageNumber }) => {
      if (pageNumber > 1) startPage();
    },
  });
  y = (getAutoTableFinalY(doc) ?? y) + 20;
  section(copy.method);
  for (const note of report.notes) {
    font(10, true);
    ensure(lines(note.title).length * 14 + 30);
    y += text(note.title, margin, y, contentWidth, 10, true) + 6;
    for (const value of note.paragraphs) paragraph(value);
    y += 4;
  }
  if (report.sources.length) {
    ensure(35);
    y += text(copy.sources, margin, y, contentWidth, 12, true) + 8;
    const sourceWidth = (contentWidth - 24) / 2;
    for (let index = 0; index < report.sources.length; index += 2) {
      const row = report.sources.slice(index, index + 2);
      font(9);
      const sourceHeight =
        Math.max(...row.map((source) => lines(source.label, sourceWidth).length * 13)) + 4;
      ensure(sourceHeight);
      row.forEach((source, column) => {
        const x = margin + column * (sourceWidth + 24);
        text(source.label, x, y, sourceWidth, 9, false, palette.ink);
        doc.link(x, y, sourceWidth, sourceHeight - 4, { url: source.url });
      });
      y += sourceHeight;
    }
    y += 8;
  }
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    rule(height - 45);
    text(copy.footer, margin, height - 32, contentWidth - 60, 7.5, false, palette.muted);
    font(8, false, palette.muted);
    doc.text(`${page} / ${pageCount}`, width - margin, height - 26, { align: 'right' });
  }
  return doc;
}

export async function exportComparisonReportPdf(report: ComparisonPdfReport): Promise<void> {
  const doc = await createComparisonReportPdf(report);
  doc.save(report.filename);
}
