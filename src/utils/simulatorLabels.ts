import type { HousingType, PieceType } from './simulatorApi';

export const INTERIOR_PIECE_TYPES: PieceType[] = [
  'CUISINE',
  'SEJOUR',
  'SALLE_A_MANGER',
  'SALON',
  'CHAMBRE',
  'BUREAU',
  'CABINE',
  'PIECE_SANS_OUVRANT',
  'COULOIRS_ET_DEGAGEMENTS',
  'SALLE_DE_BAIN',
  'WC',
];

export const EXTERIOR_PIECE_TYPES: PieceType[] = [
  'LOGGIA_BALCON_VERANDA',
  'TERRASSE_OU_JARDIN_PRIVE',
  'PARC_OU_JARDIN',
];

export const SLEEPING_CAPACITY_PIECE_TYPES: PieceType[] = [
  'SEJOUR',
  'SALLE_A_MANGER',
  'SALON',
  'CHAMBRE',
  'BUREAU',
];

export const PIECE_TYPE_LABELS: Record<PieceType, string> = {
  CUISINE: 'Cuisine',
  SEJOUR: 'Séjour',
  SALLE_A_MANGER: 'Salle à manger',
  SALON: 'Salon',
  CHAMBRE: 'Chambre',
  BUREAU: 'Bureau',
  CABINE: 'Cabine',
  PIECE_SANS_OUVRANT: 'Pièce sans ouvrant',
  COULOIRS_ET_DEGAGEMENTS: 'Couloirs et dégagements',
  SALLE_DE_BAIN: 'Salle de bain',
  WC: 'WC',
  LOGGIA_BALCON_VERANDA: 'Loggia, balcon ou véranda',
  TERRASSE_OU_JARDIN_PRIVE: 'Terrasse ou jardin privé',
  PARC_OU_JARDIN: 'Parc ou jardin',
};

export const HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  INDIVIDUEL: 'Logement individuel',
  COLLECTIF: 'Logement collectif',
};

export function formatRequestedCategory(value: string | undefined): string {
  const trimmedValue = value?.trim() ?? '';
  const normalizedValue = trimmedValue.endsWith('*') ? trimmedValue.slice(0, -1) : trimmedValue;
  const numericValue = Number(normalizedValue);

  if (Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 5) {
    return `${numericValue} ${numericValue === 1 ? 'étoile' : 'étoiles'}`;
  }

  return trimmedValue || 'Non renseigné';
}

export function formatHousingType(value: string | undefined): string {
  if (value === 'INDIVIDUEL' || value === 'COLLECTIF') {
    return HOUSING_TYPE_LABELS[value];
  }

  return value?.trim() || 'Non renseigné';
}

export function formatFloor(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return 'Non renseigné';
  }

  if (value === 0) {
    return 'RDC';
  }

  if (value === 1) {
    return '1er';
  }

  if (value >= 4) {
    return '4e ou plus';
  }

  return `${value}e`;
}

export function formatPieceType(value: PieceType): string {
  return PIECE_TYPE_LABELS[value];
}

export function canPieceHaveSleepingCapacity(value: PieceType): boolean {
  return SLEEPING_CAPACITY_PIECE_TYPES.includes(value);
}

export function isExteriorPiece(value: PieceType): boolean {
  return EXTERIOR_PIECE_TYPES.includes(value);
}
