import { describe, expect, it } from 'vitest';
import type { TaxeSejourCity } from '../content/taxeSejourDataset';
import { calculateTaxeSejour } from './taxeSejourCalculator';

const baseCity: TaxeSejourCity = {
  id: '12345',
  label: 'VILLE TEST (75)',
  searchKey: 'ville test 75',
  regime: 'r',
  hasMultiplePeriods: false,
  taxMask: 0,
  rates: {
    nonClassRatePct: 5,
    nonClassCap: 4,
    star1Rate: 0.5,
    star2Rate: 0.8,
    star3Rate: 1,
    star4Rate: 1.5,
    star5Rate: 2,
  },
};

describe('calculateTaxeSejour', () => {
  it('calculates totals for one night and capacity', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 200,
        capacity: 4,
        nights: 1,
      },
      baseCity
    );

    expect(output.rows).toEqual([
      { category: 'Non classé', amount: 10 },
      { category: '1*', amount: 2 },
      { category: '2*', amount: 3.2 },
      { category: '3*', amount: 4 },
      { category: '4*', amount: 6 },
      { category: '5*', amount: 8 },
    ]);
    expect(output.isIndicative).toBe(false);
    expect(output.warnings).toHaveLength(0);
  });

  it('multiplies totals by the number of nights', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 200,
        capacity: 4,
        nights: 3,
      },
      baseCity
    );

    const nonClassRow = output.rows.find((row) => row.category === 'Non classé');
    const star3Row = output.rows.find((row) => row.category === '3*');
    expect(nonClassRow?.amount).toBe(30);
    expect(star3Row?.amount).toBe(12);
  });

  it('includes additional taxes in totals', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 100,
        capacity: 2,
        nights: 2,
      },
      {
        ...baseCity,
        taxMask: 1 + 4, // 10% + 34%
      }
    );

    const nonClassRow = output.rows.find((row) => row.category === 'Non classé');
    expect(nonClassRow?.amount).toBe(14.4);
    expect(output.additionalTaxes.find((tax) => tax.key === 'departmental10')?.isApplied).toBe(
      true
    );
    expect(output.additionalTaxes.find((tax) => tax.key === 'lgv34')?.isApplied).toBe(true);
  });

  it('adds indicative warning for forfaitaire regime', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 120,
        capacity: 2,
        nights: 1,
      },
      {
        ...baseCity,
        regime: 'f',
      }
    );

    expect(output.isIndicative).toBe(true);
    expect(output.warnings[0]).toContain('régime forfaitaire');
  });
});
