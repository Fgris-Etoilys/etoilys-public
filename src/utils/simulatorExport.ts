import { getCriterionByNumber, type GridSummary } from '../content/simulatorGrid';
import { formatFloor, formatHousingType, formatRequestedCategory } from './simulatorLabels';
import type { LogementDto, PublicSimulationGridDto, RapportProvisoireDto } from './simulatorApi';

export interface PdfLogoAsset {
  dataUrl: string;
  aspectRatio: number;
}

interface PdfDocument {
  addImage(imageData: string, format: string, x: number, y: number, w: number, h: number): void;
  addPage(): void;
  getNumberOfPages(): number;
  getTextWidth(text: string): number;
  internal: {
    pageSize: {
      getHeight(): number;
      getWidth(): number;
    };
  };
  link(x: number, y: number, w: number, h: number, options: { url: string }): void;
  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string
  ): void;
  save(filename: string): void;
  setDrawColor(ch1: string): void;
  setDrawColor(ch1: number, ch2: number, ch3: number, ch4?: number): void;
  setFillColor(ch1: string): void;
  setFillColor(ch1: number, ch2: number, ch3: number, ch4?: number): void;
  setFont(fontName: string, fontStyle?: string): void;
  setFontSize(size: number): void;
  setPage(pageNumber: number): void;
  setLineWidth(width: number): void;
  setTextColor(ch1: string): void;
  setTextColor(ch1: number, ch2: number, ch3: number, ch4?: number): void;
  splitTextToSize(text: string, maxWidth: number): string[];
  text(text: string | string[], x: number, y: number, options?: { align?: string }): void;
}

interface PdfAutoTableFunction {
  (
    document: PdfDocument,
    options: {
      startY?: number;
      head?: string[][];
      body?: string[][];
      styles?: Record<string, unknown>;
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
      columnStyles?: Record<string | number, Record<string, unknown>>;
      didDrawCell?: (hookData: {
        section: string;
        column: { index: number };
        cell: {
          x: number;
          y: number;
          width: number;
          height: number;
          raw: unknown;
        };
      }) => void;
    }
  ): void;
}

interface SimulationClassementPdfInput {
  grid: GridSummary;
  rapport: RapportProvisoireDto;
  grille: PublicSimulationGridDto | undefined;
  logement: LogementDto | null;
  totalSleepingCapacity: number;
  generatedAt: Date;
  simulationId: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function formatPdfSurface(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return 'Non renseignée';
  }

  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} m²`;
}

function formatPdfPeopleCount(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return 'Non renseigné';
  }

  return `${value} ${value > 1 ? 'personnes' : 'personne'}`;
}

function formatPdfSleepingCount(value: number): string {
  return `${value} ${value > 1 ? 'couchages' : 'couchage'}`;
}

function formatPdfPoints(points: number | undefined): string {
  const safePoints = points ?? 0;
  return `${safePoints} ${safePoints > 1 ? 'points' : 'point'}`;
}

function formatPdfScore(obtained: number | undefined, target: number | undefined): string {
  return `${obtained ?? 0} / ${target ?? 0} requis`;
}

function getMissingPoints(target: number | undefined, obtained: number | undefined): number {
  return Math.max(0, (target ?? 0) - (obtained ?? 0));
}

function getProgressPercentage(obtained: number | undefined, target: number | undefined): number {
  const safeObtained = obtained ?? 0;
  const safeTarget = target ?? 0;

  if (safeTarget <= 0) {
    return safeObtained > 0 ? 100 : 0;
  }

  return Math.min(100, Math.max(0, (safeObtained / safeTarget) * 100));
}

function formatRequestedCategoryLabel(requestedCategory: string | undefined): string {
  const match = requestedCategory?.match(/^([1-5])\*$/);
  if (!match) {
    return 'demandé';
  }

  const starCount = Number(match[1]);
  return `${starCount} ${starCount > 1 ? 'étoiles' : 'étoile'}`;
}

function formatSimulationPdfFilename(simulationId: string, generatedAt: Date): string {
  const safeSimulationId = simulationId.replace(/[^a-zA-Z0-9_-]/g, '-');
  return `simulation-classement-${safeSimulationId}-${formatFilenameDate(generatedAt)}.pdf`;
}

function ensurePdfSpace(document: PdfDocument, cursorY: number, requiredHeight: number): number {
  const pageHeight = document.internal.pageSize.getHeight();
  const bottomMargin = 56;

  if (cursorY + requiredHeight <= pageHeight - bottomMargin) {
    return cursorY;
  }

  document.addPage();
  return 40;
}

async function addPdfHeader(document: PdfDocument, title: string): Promise<number> {
  let cursorY = 40;
  const marginX = 40;
  const pageWidth = document.internal.pageSize.getWidth();
  const logoAsset = await getEtoilysLogoPngAsset();

  if (logoAsset) {
    const maxLogoWidth = 180;
    const maxLogoHeight = 44;
    let logoWidth = maxLogoWidth;
    let logoHeight = logoWidth / logoAsset.aspectRatio;
    if (logoHeight > maxLogoHeight) {
      logoHeight = maxLogoHeight;
      logoWidth = logoHeight * logoAsset.aspectRatio;
    }

    const logoY = 24;
    document.addImage(logoAsset.dataUrl, 'PNG', marginX, logoY, logoWidth, logoHeight);
    document.link(marginX, logoY, logoWidth, logoHeight, {
      url: 'https://www.etoilys.fr',
    });
    cursorY = Math.max(cursorY, logoY + logoHeight + 18);
  }

  document.setFontSize(18);
  document.setTextColor(49, 107, 255);
  document.setFont('helvetica', 'bold');
  document.text(title, pageWidth / 2, cursorY, { align: 'center' });
  document.setFont('helvetica', 'normal');

  return cursorY + 34;
}

function addPdfFooter(document: PdfDocument, sourceLine: string) {
  const marginX = 40;
  const pageHeight = document.internal.pageSize.getHeight();
  const pageCount = document.getNumberOfPages();
  const sourceWrapped = document.splitTextToSize(sourceLine, 520);

  for (let page = 1; page <= pageCount; page += 1) {
    document.setPage(page);
    document.setFontSize(9);
    document.setTextColor(110, 110, 110);
    document.text(sourceWrapped, marginX, pageHeight - 32);

    const etoilysWebsite = 'www.etoilys.fr';
    document.setTextColor(1, 50, 176);
    document.text(etoilysWebsite, marginX, pageHeight - 12);
    document.link(marginX, pageHeight - 20, document.getTextWidth(etoilysWebsite), 11, {
      url: 'https://www.etoilys.fr',
    });
  }
}

function addSectionTitle(document: PdfDocument, title: string, cursorY: number): number {
  const nextCursorY = ensurePdfSpace(document, cursorY, 22);
  document.setFontSize(11);
  document.setFont('helvetica', 'bold');
  document.setTextColor(25, 25, 25);
  document.text(title, 40, nextCursorY);
  document.setFont('helvetica', 'normal');
  return nextCursorY + 10;
}

function addParagraph(document: PdfDocument, text: string, cursorY: number): number {
  const marginX = 40;
  const wrappedText = document.splitTextToSize(normalizePdfText(text), 515);
  const blockHeight = wrappedText.length * 13 + 4;
  const nextCursorY = ensurePdfSpace(document, cursorY, blockHeight);

  document.setFontSize(10);
  document.setTextColor(75, 85, 99);
  document.text(wrappedText, marginX, nextCursorY);
  return nextCursorY + blockHeight;
}

function addParameterCard(
  document: PdfDocument,
  {
    label,
    value,
    x,
    y,
    width,
    height,
  }: {
    label: string;
    value: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  document.setDrawColor(229, 231, 235);
  document.setFillColor(255, 255, 255);
  document.roundedRect(x, y, width, height, 8, 8, 'FD');

  document.setFontSize(8);
  document.setTextColor(86, 111, 143);
  document.setFont('helvetica', 'bold');
  document.text(label, x + 12, y + 17);

  document.setFontSize(10);
  document.setTextColor(17, 24, 39);
  document.text(document.splitTextToSize(value, width - 24), x + 12, y + 38);
  document.setFont('helvetica', 'normal');
}

function addPdfPill(
  document: PdfDocument,
  {
    text,
    centerX,
    centerY,
  }: {
    text: string;
    centerX: number;
    centerY: number;
  }
) {
  const width = Math.max(58, document.getTextWidth(text) + 20);
  const height = 18;
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  document.setDrawColor(187, 206, 255);
  document.setFillColor(233, 243, 255);
  document.roundedRect(x, y, width, height, 9, 9, 'FD');
  document.setFontSize(8);
  document.setFont('helvetica', 'bold');
  document.setTextColor(1, 50, 176);
  document.text(text, centerX, centerY + 3, { align: 'center' });
  document.setFont('helvetica', 'normal');
}

function addScoreCard(
  document: PdfDocument,
  {
    title,
    obtained,
    available,
    target,
    reached,
    x,
    y,
    width,
  }: {
    title: string;
    obtained: number | undefined;
    available: number | undefined;
    target: number | undefined;
    reached: boolean | undefined;
    x: number;
    y: number;
    width: number;
  }
) {
  const height = 96;
  const progress = getProgressPercentage(obtained, target);
  const missingPoints = getMissingPoints(target, obtained);
  const hasReachedGoal = missingPoints === 0;
  const successColor: [number, number, number] = [0, 158, 0];
  const alertColor: [number, number, number] = [190, 7, 35];
  const activeColor = hasReachedGoal || reached ? successColor : alertColor;
  const badgeText = hasReachedGoal
    ? 'Objectif atteint'
    : `Il manque ${formatPdfPoints(missingPoints)}`;

  document.setDrawColor(229, 231, 235);
  document.setFillColor(255, 255, 255);
  document.roundedRect(x, y, width, height, 8, 8, 'FD');

  document.setFontSize(9);
  document.setTextColor(86, 111, 143);
  document.text(title, x + 14, y + 22);

  document.setFontSize(18);
  document.setTextColor(17, 24, 39);
  document.setFont('helvetica', 'bold');
  document.text(formatPdfScore(obtained, target), x + 14, y + 47);
  document.setFont('helvetica', 'normal');

  if (available !== undefined) {
    document.setFontSize(9);
    document.setTextColor(86, 111, 143);
    document.text(`${formatPdfPoints(available)} maximum disponibles`, x + 14, y + 63);
  }

  document.setFontSize(9);
  document.setTextColor(activeColor[0], activeColor[1], activeColor[2]);
  document.text(badgeText, x + width - 14, y + 22, { align: 'right' });

  const barX = x + 14;
  const barY = y + 75;
  const barWidth = width - 28;
  const barHeight = 8;
  document.setDrawColor(229, 231, 235);
  document.setFillColor(229, 231, 235);
  document.roundedRect(barX, barY, barWidth, barHeight, 4, 4, 'FD');
  document.setFillColor(activeColor[0], activeColor[1], activeColor[2]);
  document.roundedRect(barX, barY, (barWidth * progress) / 100, barHeight, 4, 4, 'F');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below.
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export function formatFilenameDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

export function normalizePdfText(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, ' ');
}

export function getAutoTableFinalY(document: unknown): number | null {
  if (!isRecord(document)) {
    return null;
  }

  const lastAutoTable = document.lastAutoTable;
  if (!isRecord(lastAutoTable)) {
    return null;
  }

  const finalY = lastAutoTable.finalY;
  return typeof finalY === 'number' && Number.isFinite(finalY) ? finalY : null;
}

export async function getEtoilysLogoPngAsset(): Promise<PdfLogoAsset | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  try {
    const response = await fetch('/logo-etoilys.svg', { cache: 'force-cache' });
    if (!response.ok) {
      return null;
    }

    const svgContent = await response.text();
    const svgBase64 = window.btoa(unescape(encodeURIComponent(svgContent)));
    const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Logo load failed'));
      img.src = svgDataUrl;
    });

    const naturalWidth = Math.max(1, image.naturalWidth || 800);
    const naturalHeight = Math.max(1, image.naturalHeight || 220);
    const aspectRatio = naturalWidth / naturalHeight;

    const width = 800;
    const height = Math.max(120, Math.round(width / aspectRatio));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return { dataUrl: canvas.toDataURL('image/png'), aspectRatio };
  } catch {
    return null;
  }
}

export async function exportSimulationClassementPdf({
  grid,
  rapport,
  grille,
  logement,
  totalSleepingCapacity,
  generatedAt,
  simulationId,
}: SimulationClassementPdfInput): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default as PdfAutoTableFunction;
  const document = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  const pageWidth = document.internal.pageSize.getWidth();
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = await addPdfHeader(document, 'Synthèse de votre simulation de classement');

  const success = rapport.resultat === true;
  const requestedCategoryLabel = formatRequestedCategoryLabel(grille?.categorie_demandee);
  const missingMandatoryPoints = getMissingPoints(
    rapport.points_minimaux_obligatoires,
    rapport.points_obligatoires_obtenus
  );
  const invalidRequiredCriteria = rapport.criteres_obligatoires_non_valides ?? [];
  const invalidRequiredCriterionRows = invalidRequiredCriteria.map((criterionNumber) => {
    const criterion = getCriterionByNumber(grid, criterionNumber);
    return [
      `Critère ${criterionNumber}`,
      criterion?.libelle ?? 'Intitulé non disponible dans la grille',
      criterion?.points === undefined
        ? 'Points non disponibles'
        : formatPdfPoints(criterion.points),
    ];
  });

  cursorY = addSectionTitle(document, 'Paramètres de la simulation', cursorY);
  const simulationParameterCards: Array<[string, string]> = [
    ['Classement demandé', formatRequestedCategory(grille?.categorie_demandee)],
    ['Type de logement', formatHousingType(grille?.type_habitation)],
    ['Étage', formatFloor(grille?.etage)],
    ['Capacité indiquée', formatPdfPeopleCount(grille?.capacite_accueil)],
  ];
  const housingInformationCards: Array<[string, string]> = [
    ['Surface totale renseignée', formatPdfSurface(logement?.surface_totale)],
    [
      "Pièces d'habitation",
      logement?.nb_pieces_habitation === undefined
        ? 'Non renseigné'
        : String(logement.nb_pieces_habitation),
    ],
    ['Couchages renseignés', formatPdfSleepingCount(totalSleepingCapacity)],
  ];
  const parameterGap = 12;
  const parameterCardWidth = (contentWidth - parameterGap * 3) / 4;
  const parameterCardHeight = 64;
  const parameterCardsY = cursorY + 4;

  simulationParameterCards.forEach(([label, value], index) => {
    addParameterCard(document, {
      label,
      value,
      x: marginX + index * (parameterCardWidth + parameterGap),
      y: parameterCardsY,
      width: parameterCardWidth,
      height: parameterCardHeight,
    });
  });
  cursorY = parameterCardsY + parameterCardHeight + 26;

  cursorY = addSectionTitle(document, 'Informations du logement', cursorY);
  const housingCardWidth = (contentWidth - parameterGap * 2) / 3;
  const housingCardsY = cursorY + 4;

  housingInformationCards.forEach(([label, value], index) => {
    addParameterCard(document, {
      label,
      value,
      x: marginX + index * (housingCardWidth + parameterGap),
      y: housingCardsY,
      width: housingCardWidth,
      height: parameterCardHeight,
    });
  });
  cursorY = housingCardsY + parameterCardHeight + 24;

  cursorY = ensurePdfSpace(document, cursorY, 116);
  document.setDrawColor(success ? 154 : 248, success ? 226 : 177, success ? 153 : 177);
  document.setFillColor(success ? 229 : 255, success ? 252 : 231, success ? 229 : 226);
  document.roundedRect(marginX, cursorY, contentWidth, 96, 8, 8, 'FD');
  document.setFontSize(9);
  document.setTextColor(86, 111, 143);
  document.text('Résultat de la simulation', marginX + 16, cursorY + 24);
  document.setFontSize(15);
  document.setFont('helvetica', 'bold');
  document.setTextColor(success ? 0 : 140, success ? 115 : 0, success ? 0 : 0);
  document.text(
    success
      ? `Le classement ${requestedCategoryLabel} semble atteint`
      : `Le classement ${requestedCategoryLabel} ne semble pas encore atteint`,
    marginX + 16,
    cursorY + 48
  );
  document.setFont('helvetica', 'normal');
  document.setFontSize(10);
  document.setTextColor(75, 85, 99);
  document.text(
    document.splitTextToSize(
      'Ce résultat est une estimation basée sur vos réponses. Seule une visite officielle permet de confirmer le classement.',
      contentWidth - 32
    ),
    marginX + 16,
    cursorY + 70
  );
  cursorY += 120;

  cursorY = ensurePdfSpace(document, cursorY, 112);
  const cardGap = 16;
  const scoreCardWidth = (contentWidth - cardGap) / 2;
  addScoreCard(document, {
    title: 'Points obligatoires',
    obtained: rapport.points_obligatoires_obtenus,
    available: rapport.points_totaux_obligatoires,
    target: rapport.points_minimaux_obligatoires,
    reached: rapport.points_obligatoires_atteints,
    x: marginX,
    y: cursorY,
    width: scoreCardWidth,
  });
  addScoreCard(document, {
    title: 'Points optionnels',
    obtained: rapport.points_optionnels_obtenus,
    available: rapport.points_optionnels_disponibles,
    target: rapport.points_optionnels_a_atteindre,
    reached: rapport.points_optionnels_atteints,
    x: marginX + scoreCardWidth + cardGap,
    y: cursorY,
    width: scoreCardWidth,
  });
  cursorY += 122;

  if (!success) {
    document.addPage();
    cursorY = 40;
    cursorY = addSectionTitle(document, 'Critères obligatoires non validés', cursorY);
    cursorY += 8;
    if (rapport.points_obligatoires_atteints === false && missingMandatoryPoints > 0) {
      cursorY = addParagraph(
        document,
        `Il manque ${formatPdfPoints(missingMandatoryPoints)} obligatoires pour atteindre le classement ${requestedCategoryLabel}.`,
        cursorY
      );
      cursorY = addParagraph(
        document,
        'Les points manquants peuvent être obtenus en validant certains critères listés ci-dessous.',
        cursorY
      );
    } else {
      cursorY = addParagraph(
        document,
        'Certains critères doivent encore être vérifiés pour confirmer le résultat.',
        cursorY
      );
    }

    if (invalidRequiredCriterionRows.length > 0) {
      autoTable(document, {
        startY: cursorY + 4,
        head: [['Critère', 'Libellé', 'Points associés']],
        body: invalidRequiredCriterionRows,
        styles: {
          fontSize: 9,
          cellPadding: 7,
          lineColor: [229, 231, 235],
          lineWidth: 0.3,
          valign: 'top',
        },
        headStyles: {
          fillColor: [49, 107, 255],
          fontStyle: 'bold',
          textColor: [255, 255, 255],
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          0: { cellWidth: 88, halign: 'left' },
          1: { cellWidth: contentWidth - 188, halign: 'left' },
          2: { cellWidth: 100, halign: 'center', textColor: [249, 250, 251] },
        },
        didDrawCell: (hookData) => {
          if (hookData.section !== 'body' || hookData.column.index !== 2) {
            return;
          }

          const rawText = typeof hookData.cell.raw === 'string' ? hookData.cell.raw : '';
          if (!rawText) {
            return;
          }

          addPdfPill(document, {
            text: rawText,
            centerX: hookData.cell.x + hookData.cell.width / 2,
            centerY: hookData.cell.y + hookData.cell.height / 2,
          });
        },
      });
      cursorY = (getAutoTableFinalY(document) ?? cursorY) + 24;
    }
  }

  cursorY = ensurePdfSpace(document, cursorY, 110);
  document.setDrawColor(187, 206, 255);
  document.setFillColor(233, 243, 255);
  document.roundedRect(marginX, cursorY, contentWidth, 100, 8, 8, 'FD');
  document.setFontSize(12);
  document.setTextColor(17, 24, 39);
  document.setFont('helvetica', 'bold');
  document.text('Prêt pour une visite officielle ?', marginX + 16, cursorY + 24);
  document.setFont('helvetica', 'normal');
  document.setFontSize(10);
  document.setTextColor(75, 85, 99);
  document.text(
    document.splitTextToSize(
      'Faites votre demande en ligne et bénéficiez des avantages du classement officiel dès maintenant.',
      contentWidth - 32
    ),
    marginX + 16,
    cursorY + 43
  );
  const ctaText = 'Demande de classement';
  const ctaX = marginX + 16;
  const ctaY = cursorY + 66;
  const ctaWidth = document.getTextWidth(ctaText) + 28;
  const ctaHeight = 24;
  document.setDrawColor(49, 107, 255);
  document.setFillColor(49, 107, 255);
  document.roundedRect(ctaX, ctaY, ctaWidth, ctaHeight, 8, 8, 'FD');
  document.setFontSize(9);
  document.setFont('helvetica', 'bold');
  document.setTextColor(255, 255, 255);
  document.text(ctaText, ctaX + ctaWidth / 2, ctaY + 15, { align: 'center' });
  document.setFont('helvetica', 'normal');
  document.link(ctaX, ctaY, ctaWidth, ctaHeight, {
    url: 'https://www.etoilys.fr/demande-classement',
  });

  addPdfFooter(
    document,
    'Simulation Etoilys fournie à titre indicatif. Seule une visite officielle permet de confirmer le classement.'
  );
  document.save(formatSimulationPdfFilename(simulationId, generatedAt));
}
