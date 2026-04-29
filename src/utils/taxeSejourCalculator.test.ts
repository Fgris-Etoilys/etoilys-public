import { describe, expect, it } from 'vitest';
import type { TaxeSejourCity } from '../content/taxeSejourDataset';
import { calculateTaxeSejour } from './taxeSejourCalculator';

const baseCity: TaxeSejourCity = {
  id: '12345',
  label: 'VILLE TEST (75)',
  searchKey: 'ville test 75',
  classifiedRegime: 'r',
  unclassifiedRegime: 'r',
  taxMask: 0,
  hasMultiplePeriods: false,
  periods: [
    {
      key: 'periode-1',
      startLabel: '01 janvier',
      endLabel: '31 décembre',
      rates: {
        nonClassRatePct: 5,
        nonClassCap: 4,
        star1Rate: 0.5,
        star2Rate: 0.8,
        star3Rate: 1,
        star4Rate: 1.5,
        star5Rate: 2,
      },
    },
  ],
  abatements: [],
};

describe('calculateTaxeSejour', () => {
  const basePeriod = baseCity.periods[0];
  if (!basePeriod) {
    throw new Error('La ville de test doit contenir une periode tarifaire.');
  }

  it('uses taxable persons derived from exempted persons for classified real calculations', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 200,
        nights: 2,
        personsStaying: 3,
        exemptedPersons: 1,
      },
      baseCity
    );

    expect(output.rows).toEqual([
      { category: 'Non classé', amount: 13.33, status: 'exact' },
      { category: '1*', amount: 2, status: 'exact' },
      { category: '2*', amount: 3.2, status: 'exact' },
      { category: '3*', amount: 4, status: 'exact' },
      { category: '4*', amount: 6, status: 'exact' },
      { category: '5*', amount: 8, status: 'exact' },
    ]);
  });

  it('treats exempted persons as optional with default 0', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 120,
        nights: 2,
        personsStaying: 2,
      },
      baseCity
    );

    const nonClassRow = output.rows.find((row) => row.category === 'Non classé');
    expect(nonClassRow?.amount).toBe(12);
  });

  it('handles fully exempt stays with zero taxable persons', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 120,
        nights: 2,
        personsStaying: 2,
        exemptedPersons: 2,
      },
      baseCity
    );

    expect(output.rows.every((row) => row.amount === 0)).toBe(true);
  });

  it('throws when exempted persons exceed persons staying', () => {
    expect(() =>
      calculateTaxeSejour(
        {
          cityId: '12345',
          nightlyPriceHt: 120,
          nights: 2,
          personsStaying: 2,
          exemptedPersons: 3,
        },
        baseCity
      )
    ).toThrowError(/exonérées/i);
  });

  it('calculates classified forfait rows with capacity and ignores exempted persons on classified lines', () => {
    const cityForfait: TaxeSejourCity = {
      ...baseCity,
      classifiedRegime: 'f',
      abatements: [{ ratePercent: 50, nightsMin: 40, nightsMax: 120 }],
    };

    const outputLowExempted = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 100,
        capacity: 10,
        nights: 60,
        personsStaying: 4,
        exemptedPersons: 0,
      },
      cityForfait
    );

    const outputHighExempted = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 100,
        capacity: 10,
        nights: 60,
        personsStaying: 4,
        exemptedPersons: 3,
      },
      cityForfait
    );

    const star1Low = outputLowExempted.rows.find((row) => row.category === '1*');
    const star1High = outputHighExempted.rows.find((row) => row.category === '1*');
    expect(star1Low?.amount).toBe(300);
    expect(star1High?.amount).toBe(300);
    expect(
      outputLowExempted.warnings.some((warning) => warning.includes("période d'ouverture"))
    ).toBe(true);
    expect(outputLowExempted.warnings.some((warning) => warning.includes('abattement local'))).toBe(
      true
    );
    expect(
      outputLowExempted.warnings.some((warning) =>
        warning.includes('Aucun abattement forfaitaire applicable')
      )
    ).toBe(false);
  });

  it('includes additional taxes in totals', () => {
    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 100,
        nights: 2,
        personsStaying: 2,
        exemptedPersons: 0,
      },
      {
        ...baseCity,
        taxMask: 1 + 4,
      }
    );

    const nonClassRow = output.rows.find((row) => row.category === 'Non classé');
    expect(nonClassRow?.amount).toBe(14.4);
    expect(output.additionalTaxes.find((tax) => tax.key === 'departmental10')?.isApplied).toBe(
      true
    );
    expect(output.additionalTaxes.find((tax) => tax.key === 'lgv34')?.isApplied).toBe(true);
  });

  it('uses the first available period when multiple periods exist', () => {
    const cityWithMultiplePeriods: TaxeSejourCity = {
      ...baseCity,
      hasMultiplePeriods: true,
      periods: [
        basePeriod,
        {
          key: 'periode-2',
          startLabel: '01 juin',
          endLabel: '31 août',
          rates: {
            ...basePeriod.rates,
            star1Rate: 0.9,
          },
        },
      ],
    };

    const output = calculateTaxeSejour(
      {
        cityId: '12345',
        nightlyPriceHt: 120,
        nights: 2,
        personsStaying: 2,
      },
      cityWithMultiplePeriods
    );
    const star1 = output.rows.find((row) => row.category === '1*');
    expect(star1?.amount).toBe(2);
  });
});
