import { describe, expect, it } from 'vitest';
import { simulateClassementFiscal } from './classementFiscalSimulator';

describe('simulateClassementFiscal', () => {
  it('keeps a complete micro comparison at 15 000 €', () => {
    const result = simulateClassementFiscal({ annualRevenue: 15_000, tmiRate: 30 });

    expect(result.scope).toBe('micro_comparison');
    expect(result.canDisplayMicroComparison).toBe(true);
    expect(result.showNonClasseWarning).toBe(false);
    expect(result.showSocialWarning).toBe(false);
    expect(result.showClasseWarning).toBe(false);

    expect(result.nonClasse.taxableBase).toBe(10_500);
    expect(result.nonClasse.estimatedIncomeTax).toBe(3_150);
    expect(result.nonClasse.socialLeviesAmount).toBe(1_953);
    expect(result.nonClasse.socialContributionsAmount).toBe(0);
    expect(result.nonClasse.estimatedTotal).toBe(5_103);

    expect(result.classe.taxableBase).toBe(7_500);
    expect(result.classe.estimatedIncomeTax).toBe(2_250);
    expect(result.classe.socialLeviesAmount).toBe(1_395);
    expect(result.classe.socialContributionsAmount).toBe(0);
    expect(result.classe.estimatedTotal).toBe(3_645);

    expect(result.estimatedSavings).toBe(1_458);
    expect(result.showOutOfScopeWarning).toBe(false);
  });

  it('keeps warning above 15 000 € with coherent social logic at 15 001 €', () => {
    const result = simulateClassementFiscal({ annualRevenue: 15_001, tmiRate: 11 });

    expect(result.scope).toBe('micro_comparison');
    expect(result.canDisplayMicroComparison).toBe(true);
    expect(result.showNonClasseWarning).toBe(true);
    expect(result.showClasseWarning).toBe(false);
    expect(result.showSocialWarning).toBe(false);

    expect(result.nonClasse.taxableBase).toBe(10_500.7);
    expect(result.nonClasse.estimatedIncomeTax).toBe(1_155.08);
    expect(result.nonClasse.socialLeviesAmount).toBe(1_953.13);
    expect(result.nonClasse.socialContributionsAmount).toBe(0);

    expect(result.classe.taxableBase).toBe(7_500.5);
    expect(result.classe.estimatedIncomeTax).toBe(825.06);
    expect(result.classe.socialLeviesAmount).toBe(1_395.09);
    expect(result.classe.socialContributionsAmount).toBe(0);
  });

  it('applies social levies at 18,6 % for both scenarios at 23 000 €', () => {
    const result = simulateClassementFiscal({ annualRevenue: 23_000, tmiRate: 30 });

    expect(result.scope).toBe('micro_comparison');
    expect(result.canDisplayMicroComparison).toBe(true);

    expect(result.nonClasse.taxableBase).toBe(16_100);
    expect(result.nonClasse.estimatedIncomeTax).toBe(4_830);
    expect(result.nonClasse.socialLeviesAmount).toBe(2_994.6);
    expect(result.nonClasse.socialContributionsAmount).toBe(0);
    expect(result.nonClasse.estimatedTotal).toBe(7_824.6);

    expect(result.classe.taxableBase).toBe(11_500);
    expect(result.classe.estimatedIncomeTax).toBe(3_450);
    expect(result.classe.socialLeviesAmount).toBe(2_139);
    expect(result.classe.socialContributionsAmount).toBe(0);
    expect(result.classe.estimatedTotal).toBe(5_589);

    expect(result.estimatedSavings).toBe(2_235.6);
    expect(result.showSocialWarning).toBe(false);
  });

  it('uses calculated social contributions for both scenarios above 23 000 €', () => {
    const result = simulateClassementFiscal({ annualRevenue: 23_001, tmiRate: 11 });

    expect(result.scope).toBe('micro_comparison');
    expect(result.canDisplayMicroComparison).toBe(true);

    expect(result.nonClasse.taxableBase).toBe(16_100.7);
    expect(result.nonClasse.estimatedIncomeTax).toBe(1_771.08);
    expect(result.nonClasse.socialLeviesAmount).toBe(0);
    expect(result.nonClasse.socialContributionsAmount).toBe(4_371.11);
    expect(result.nonClasse.estimatedTotal).toBe(6_142.19);

    expect(result.classe.taxableBase).toBe(11_500.5);
    expect(result.classe.estimatedIncomeTax).toBe(1_265.06);
    expect(result.classe.socialLeviesAmount).toBe(0);
    expect(result.classe.socialContributionsAmount).toBe(1_380.06);
    expect(result.classe.estimatedTotal).toBe(2_645.12);

    expect(result.estimatedSavings).toBe(3_497.07);
    expect(result.showSocialWarning).toBe(true);
  });

  it('keeps the micro comparison available at 83 600 € with calculated social contributions', () => {
    const result = simulateClassementFiscal({ annualRevenue: 83_600, tmiRate: 41 });

    expect(result.scope).toBe('micro_comparison');
    expect(result.canDisplayMicroComparison).toBe(true);
    expect(result.showClasseWarning).toBe(false);
    expect(result.showNonClasseWarning).toBe(true);
    expect(result.showSocialWarning).toBe(true);

    expect(result.nonClasse.taxableBase).toBe(58_520);
    expect(result.nonClasse.estimatedIncomeTax).toBe(23_993.2);
    expect(result.nonClasse.socialLeviesAmount).toBe(0);
    expect(result.nonClasse.socialContributionsAmount).toBe(15_887.34);
    expect(result.nonClasse.estimatedTotal).toBe(39_880.54);

    expect(result.classe.taxableBase).toBe(41_800);
    expect(result.classe.estimatedIncomeTax).toBe(17_138);
    expect(result.classe.socialLeviesAmount).toBe(0);
    expect(result.classe.socialContributionsAmount).toBe(5_016);
    expect(result.classe.estimatedTotal).toBe(22_154);

    expect(result.estimatedSavings).toBe(17_726.54);
  });

  it('marks results above 83 600 € as outside the simple micro comparison scope', () => {
    const result = simulateClassementFiscal({ annualRevenue: 83_601, tmiRate: 41 });

    expect(result.scope).toBe('outside_micro_scope');
    expect(result.canDisplayMicroComparison).toBe(false);
    expect(result.estimatedSavings).toBeNull();
    expect(result.showOutOfScopeWarning).toBe(true);
    expect(result.showClasseWarning).toBe(true);
    expect(result.showNonClasseWarning).toBe(true);
    expect(result.showSocialWarning).toBe(true);

    expect(result.nonClasse.estimatedIncomeTax).toBe(23_993.49);
    expect(result.nonClasse.socialLeviesAmount).toBe(0);
    expect(result.nonClasse.socialContributionsAmount).toBe(15_887.53);
    expect(result.nonClasse.estimatedTotal).toBe(39_881.02);

    expect(result.classe.socialLeviesAmount).toBe(0);
    expect(result.classe.socialContributionsAmount).toBe(5_016.06);
    expect(result.classe.estimatedTotal).toBe(22_154.26);
  });
});
