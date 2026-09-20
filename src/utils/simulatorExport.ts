import type { SimulationClassementPdfInput } from './simulationClassementPdf.types';

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

export async function exportSimulationClassementPdf(
  input: SimulationClassementPdfInput
): Promise<void> {
  const { createSimulationClassementPdf } = await import('./simulationClassementPdf');
  const doc = await createSimulationClassementPdf(input);
  const safeId = input.simulationId.replace(/[^a-zA-Z0-9_-]/g, '-');
  doc.save(`simulation-classement-${safeId}-${formatFilenameDate(input.generatedAt)}.pdf`);
}
