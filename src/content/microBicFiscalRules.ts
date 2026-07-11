export type MicroBicAccommodationKind = 'nonClasse' | 'classe';

export type MicroBicPeriodKey = 'revenus2025Declares2026' | 'revenus2026Declares2027';

export interface MicroBicAccommodationRule {
  microBicThreshold: number;
  abattementRate: number;
}

export interface MicroBicFiscalPeriodRule {
  incomeYear: number;
  declarationYear: number;
  labelFr: string;
  labelEn: string;
  nonClasse: MicroBicAccommodationRule;
  classe: MicroBicAccommodationRule;
}

export const MICRO_BIC_FISCAL_RULES: Record<MicroBicPeriodKey, MicroBicFiscalPeriodRule> = {
  revenus2025Declares2026: {
    incomeYear: 2025,
    declarationYear: 2026,
    labelFr: 'revenus 2025 déclarés en 2026',
    labelEn: '2025 income declared in 2026',
    nonClasse: {
      microBicThreshold: 15_000,
      abattementRate: 0.3,
    },
    classe: {
      microBicThreshold: 77_700,
      abattementRate: 0.5,
    },
  },
  revenus2026Declares2027: {
    incomeYear: 2026,
    declarationYear: 2027,
    labelFr: 'revenus 2026 déclarés en 2027',
    labelEn: '2026 income declared in 2027',
    nonClasse: {
      microBicThreshold: 15_000,
      abattementRate: 0.3,
    },
    classe: {
      microBicThreshold: 83_600,
      abattementRate: 0.5,
    },
  },
} as const;

export const CURRENT_MICRO_BIC_PERIOD_KEY: MicroBicPeriodKey = 'revenus2026Declares2027';
export const CURRENT_MICRO_BIC_RULES = MICRO_BIC_FISCAL_RULES[CURRENT_MICRO_BIC_PERIOD_KEY];

export const LEGACY_CLASSE_MICRO_BIC_PARAMETERS = {
  incomeYear: 2024,
  microBicThreshold: 188_700,
  abattementRate: 0.71,
  noteFr:
    'Anciens paramètres applicables avant la réforme des meublés de tourisme, à citer uniquement comme repère historique explicite.',
} as const;

export const MICRO_BIC_OFFICIAL_SOURCE_URLS = [
  'https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau',
  'https://entreprendre.service-public.gouv.fr/vosdroits/F39451',
  'https://entreprendre.service-public.gouv.fr/vosdroits/F32805',
] as const;

export function formatFiscalEuro(value: number, locale: 'fr-FR' | 'en-US' = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
