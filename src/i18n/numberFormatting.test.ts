import { describe, expect, it } from 'vitest';
import { simulateClassementFiscal } from '../utils/classementFiscalSimulator';
import { formatEuro } from './numberFormatting';

describe('localized simulator number formatting', () => {
  it('keeps raw fiscal values identical before locale-specific formatting', () => {
    const resultForFrenchPresentation = simulateClassementFiscal({
      annualRevenue: 20_000,
      tmiRate: 30,
    });
    const resultForEnglishPresentation = simulateClassementFiscal({
      annualRevenue: 20_000,
      tmiRate: 30,
    });

    expect(resultForEnglishPresentation).toEqual(resultForFrenchPresentation);
    expect(resultForFrenchPresentation.classe.estimatedTotal).toBe(
      resultForEnglishPresentation.classe.estimatedTotal
    );
  });

  it('formats the same euro amount with fr-FR and en-GB without conversion or rounding drift', () => {
    const rawAmount = 1234.567;

    expect(formatEuro(rawAmount, 'fr')).toBe('1\u202f234,57\u00a0€');
    expect(formatEuro(rawAmount, 'en')).toBe('€1,234.57');
  });
});
