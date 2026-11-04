import { describe, expect, it } from 'vitest';
import { getCountryOptions, ISO_COUNTRY_CODES } from './countries';
import type { Locale } from '../i18n/locales';

describe('ISO_COUNTRY_CODES', () => {
  it('lists the 249 unique alpha-2 codes accepted by the backend', () => {
    expect(ISO_COUNTRY_CODES).toHaveLength(249);
    expect(new Set(ISO_COUNTRY_CODES).size).toBe(249);
    ISO_COUNTRY_CODES.forEach((code) => expect(code).toMatch(/^[A-Z]{2}$/));
  });
});

describe('getCountryOptions', () => {
  it.each<[Locale, string, string]>([
    ['fr', 'France', 'Royaume-Uni'],
    ['en', 'France', 'United Kingdom'],
    ['nl', 'Frankrijk', 'Verenigd Koninkrijk'],
  ])('translates and sorts the countries: %s', (locale, france, unitedKingdom) => {
    const options = getCountryOptions(locale);
    const labels = options.map(({ label }) => label);

    expect(options).toHaveLength(ISO_COUNTRY_CODES.length);
    expect(options.find(({ value }) => value === 'FR')?.label).toBe(france);
    expect(options.find(({ value }) => value === 'GB')?.label).toBe(unitedKingdom);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, locale)));
  });
});
