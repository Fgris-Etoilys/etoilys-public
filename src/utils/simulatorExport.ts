import type { SimulationClassementPdfInput } from './simulationClassementPdf';

export interface PdfLogoAsset {
  dataUrl: string;
  aspectRatio: number;
}

export type PdfColor = [number, number, number];

// Shared by the three simulators. Fallbacks support PDF generation without a stylesheet.
export function getSimulatorPdfPalette() {
  const color = (token: string, fallback: PdfColor): PdfColor => {
    if (typeof document === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${token}`)
      .trim()
      .split(/\s+/)
      .map(Number);
    return value.length === 3 && value.every(Number.isFinite) ? (value as PdfColor) : fallback;
  };
  return {
    ink: color('ink', [23, 61, 73]),
    muted: color('muted', [83, 99, 103]),
    paper: color('paper', [246, 243, 235]),
    surface: color('surface', [255, 254, 250]),
    sage: color('surface-sage', [234, 236, 228]),
    warm: color('surface-warm', [234, 231, 220]),
    copper: color('copper', [166, 94, 54]),
  };
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
  if (typeof document !== 'object' || document === null || !('lastAutoTable' in document)) {
    return null;
  }
  const table = document.lastAutoTable;
  if (typeof table !== 'object' || table === null || !('finalY' in table)) return null;
  return typeof table.finalY === 'number' && Number.isFinite(table.finalY) ? table.finalY : null;
}

export async function getEtoilysLogoPngAsset(
  source = '/logo-etoilys-editorial.svg'
): Promise<PdfLogoAsset | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  try {
    const response = await fetch(source, { cache: 'force-cache' });
    if (!response.ok) return null;
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
    if (!context) return null;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return { dataUrl: canvas.toDataURL('image/png'), aspectRatio };
  } catch {
    return null;
  }
}

export async function exportSimulationClassementPdf(
  input: SimulationClassementPdfInput
): Promise<void> {
  const { createSimulationClassementPdf } = await import('./simulationClassementPdf');
  const doc = await createSimulationClassementPdf(input);
  const safeId = input.simulationId.replace(/[^a-zA-Z0-9_-]/g, '-');
  doc.save(`simulation-classement-${safeId}-${formatFilenameDate(input.generatedAt)}.pdf`);
}
