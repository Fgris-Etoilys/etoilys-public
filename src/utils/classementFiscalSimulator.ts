import { CURRENT_MICRO_BIC_RULES } from '../content/microBicFiscalRules';

export type TmiRate = 0 | 11 | 30 | 41 | 45;

export type RegimeStatus = 'micro-BIC' | 'micro-BIC sous vigilance';
export type SimulationScope = 'micro_comparison' | 'outside_micro_scope';

export interface SimulationInput {
  annualRevenue: number;
  tmiRate: TmiRate;
}

export interface ScenarioSimulationResult {
  microBicThreshold: number;
  abattementRate: number;
  taxableBase: number;
  estimatedIncomeTax: number;
  socialLeviesAmount: number;
  socialContributionsAmount: number;
  estimatedTotal: number;
  regimeStatus: RegimeStatus;
  exceedsMicroBicThreshold: boolean;
}

export interface SimulationResult {
  annualRevenue: number;
  tmiRate: TmiRate;
  nonClasse: ScenarioSimulationResult;
  classe: ScenarioSimulationResult;
  estimatedSavings: number | null;
  scope: SimulationScope;
  canDisplayMicroComparison: boolean;
  showNonClasseWarning: boolean;
  showSocialWarning: boolean;
  showClasseWarning: boolean;
  showOutOfScopeWarning: boolean;
}

export const NON_CLASSE_MICRO_BIC_THRESHOLD_2026 =
  CURRENT_MICRO_BIC_RULES.nonClasse.microBicThreshold;
export const NON_CLASSE_ABATTEMENT_RATE_2026 = CURRENT_MICRO_BIC_RULES.nonClasse.abattementRate;
export const CLASSE_MICRO_BIC_THRESHOLD_2026 = CURRENT_MICRO_BIC_RULES.classe.microBicThreshold;
export const CLASSE_ABATTEMENT_RATE_2026 = CURRENT_MICRO_BIC_RULES.classe.abattementRate;
export const SOCIAL_THRESHOLD_2026 = 23_000;
export const SOCIAL_LEVIES_RATE_2026 = 0.186;
export const NON_CLASSE_SOCIAL_CONTRIBUTIONS_RATE_2026 = 0.19004;
export const CLASSE_MICRO_SOCIAL_RATE_2026 = 0.06;
export const ALLOWED_TMI_RATES: readonly TmiRate[] = [0, 11, 30, 41, 45];

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function isAllowedTmiRate(value: number): value is TmiRate {
  switch (value) {
    case 0:
    case 11:
    case 30:
    case 41:
    case 45:
      return true;
    default:
      return false;
  }
}

function computeBaseAndIncomeTax(
  annualRevenue: number,
  tmiRate: TmiRate,
  abattementRate: number
): { taxableBase: number; estimatedIncomeTax: number } {
  const taxableBase = roundCurrency(annualRevenue * (1 - abattementRate));
  const estimatedIncomeTax = roundCurrency(taxableBase * (tmiRate / 100));
  return { taxableBase, estimatedIncomeTax };
}

function computeSocialAmounts(
  annualRevenue: number,
  taxableBase: number,
  socialContributionsRate: number
): { socialLeviesAmount: number; socialContributionsAmount: number } {
  if (annualRevenue <= SOCIAL_THRESHOLD_2026) {
    return {
      socialLeviesAmount: roundCurrency(taxableBase * SOCIAL_LEVIES_RATE_2026),
      socialContributionsAmount: 0,
    };
  }

  return {
    socialLeviesAmount: 0,
    socialContributionsAmount: roundCurrency(annualRevenue * socialContributionsRate),
  };
}

function computeNonClasseScenario(
  annualRevenue: number,
  tmiRate: TmiRate
): ScenarioSimulationResult {
  const { taxableBase, estimatedIncomeTax } = computeBaseAndIncomeTax(
    annualRevenue,
    tmiRate,
    NON_CLASSE_ABATTEMENT_RATE_2026
  );
  const exceedsMicroBicThreshold = annualRevenue > NON_CLASSE_MICRO_BIC_THRESHOLD_2026;
  const { socialLeviesAmount, socialContributionsAmount } = computeSocialAmounts(
    annualRevenue,
    taxableBase,
    NON_CLASSE_SOCIAL_CONTRIBUTIONS_RATE_2026
  );

  return {
    microBicThreshold: NON_CLASSE_MICRO_BIC_THRESHOLD_2026,
    abattementRate: NON_CLASSE_ABATTEMENT_RATE_2026,
    taxableBase,
    estimatedIncomeTax,
    socialLeviesAmount,
    socialContributionsAmount,
    estimatedTotal: roundCurrency(
      estimatedIncomeTax + socialLeviesAmount + socialContributionsAmount
    ),
    regimeStatus: exceedsMicroBicThreshold ? 'micro-BIC sous vigilance' : 'micro-BIC',
    exceedsMicroBicThreshold,
  };
}

function computeClasseScenario(annualRevenue: number, tmiRate: TmiRate): ScenarioSimulationResult {
  const { taxableBase, estimatedIncomeTax } = computeBaseAndIncomeTax(
    annualRevenue,
    tmiRate,
    CLASSE_ABATTEMENT_RATE_2026
  );
  const exceedsMicroBicThreshold = annualRevenue > CLASSE_MICRO_BIC_THRESHOLD_2026;
  const { socialLeviesAmount, socialContributionsAmount } = computeSocialAmounts(
    annualRevenue,
    taxableBase,
    CLASSE_MICRO_SOCIAL_RATE_2026
  );

  return {
    microBicThreshold: CLASSE_MICRO_BIC_THRESHOLD_2026,
    abattementRate: CLASSE_ABATTEMENT_RATE_2026,
    taxableBase,
    estimatedIncomeTax,
    socialLeviesAmount,
    socialContributionsAmount,
    estimatedTotal: roundCurrency(
      estimatedIncomeTax + socialLeviesAmount + socialContributionsAmount
    ),
    regimeStatus: exceedsMicroBicThreshold ? 'micro-BIC sous vigilance' : 'micro-BIC',
    exceedsMicroBicThreshold,
  };
}

export function simulateClassementFiscal(input: SimulationInput): SimulationResult {
  if (!Number.isFinite(input.annualRevenue) || input.annualRevenue <= 0) {
    throw new Error("Le chiffre d'affaires annuel doit être un nombre positif.");
  }

  if (!isAllowedTmiRate(input.tmiRate)) {
    throw new Error("La tranche marginale d'imposition est invalide.");
  }

  const annualRevenue = roundCurrency(input.annualRevenue);
  const nonClasse = computeNonClasseScenario(annualRevenue, input.tmiRate);
  const classe = computeClasseScenario(annualRevenue, input.tmiRate);
  const isOutsideMicroScope = annualRevenue > CLASSE_MICRO_BIC_THRESHOLD_2026;

  return {
    annualRevenue,
    tmiRate: input.tmiRate,
    nonClasse,
    classe,
    estimatedSavings: isOutsideMicroScope
      ? null
      : roundCurrency(nonClasse.estimatedTotal - classe.estimatedTotal),
    scope: isOutsideMicroScope ? 'outside_micro_scope' : 'micro_comparison',
    canDisplayMicroComparison: !isOutsideMicroScope,
    showNonClasseWarning: nonClasse.exceedsMicroBicThreshold,
    showSocialWarning: annualRevenue > SOCIAL_THRESHOLD_2026,
    showClasseWarning: classe.exceedsMicroBicThreshold,
    showOutOfScopeWarning: isOutsideMicroScope,
  };
}
