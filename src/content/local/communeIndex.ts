export interface CommuneIndexEntry {
  id: string;
  label: string;
  departmentCode: string;
}

interface RawCommuneIndexDataset {
  c?: unknown;
}

function isCommuneIndexEntry(value: unknown): value is CommuneIndexEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CommuneIndexEntry>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.departmentCode === 'string'
  );
}

export function parseCommuneIndexDataset(value: unknown): CommuneIndexEntry[] {
  const dataset = value as RawCommuneIndexDataset;
  if (!dataset || !Array.isArray(dataset.c) || !dataset.c.every(isCommuneIndexEntry)) {
    throw new Error("L'index des communes n'a pas pu être chargé.");
  }

  return dataset.c;
}
