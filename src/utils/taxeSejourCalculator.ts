import {
  TAXE_MASK_DEPARTMENTAL_10,
  TAXE_MASK_IDFM_200,
  TAXE_MASK_LGV_34,
  TAXE_MASK_REGIONAL_15,
  type TaxeSejourCity,
} from '../content/taxeSejourDataset';

export interface TaxeSejourCalculationInput {
  cityId: string;
  nightlyPriceHt: number;
  capacity: number;
  nights: number;
}

export interface TaxeSejourCalculationRow {
  category: 'Non classé' | '1*' | '2*' | '3*' | '4*' | '5*';
  amount: number;
}

export interface TaxeSejourAdditionalTaxResult {
  key: 'departmental10' | 'regional15' | 'lgv34' | 'idfm200';
  label: string;
  legalReferenceLabel: string;
  legalReferenceUrl: string;
  ratePercent: number;
  isApplied: boolean;
}

export interface TaxeSejourCalculationOutput {
  rows: TaxeSejourCalculationRow[];
  additionalTaxes: TaxeSejourAdditionalTaxResult[];
  isIndicative: boolean;
  warnings: string[];
}

interface AdditionalTaxDefinition {
  key: TaxeSejourAdditionalTaxResult['key'];
  mask: number;
  label: string;
  legalReferenceLabel: string;
  legalReferenceUrl: string;
  ratePercent: number;
}

const ADDITIONAL_TAX_DEFINITIONS: AdditionalTaxDefinition[] = [
  {
    key: 'departmental10',
    mask: TAXE_MASK_DEPARTMENTAL_10,
    label: 'Taxe additionnelle départementale de 10%',
    legalReferenceLabel: 'Article L3333-1 du CGCT',
    legalReferenceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044980570',
    ratePercent: 10,
  },
  {
    key: 'regional15',
    mask: TAXE_MASK_REGIONAL_15,
    label: 'Taxe additionnelle régionale de 15% (Société des Grands Projets)',
    legalReferenceLabel: 'Article L2531-17 du CGCT',
    legalReferenceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050722130',
    ratePercent: 15,
  },
  {
    key: 'lgv34',
    mask: TAXE_MASK_LGV_34,
    label: 'Taxe additionnelle régionale de 34% (LGV)',
    legalReferenceLabel: 'Articles L4332-4 à L4332-6 du CGCT',
    legalReferenceUrl: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000039437353',
    ratePercent: 34,
  },
  {
    key: 'idfm200',
    mask: TAXE_MASK_IDFM_200,
    label: 'Taxe additionnelle régionale de 200% (Île-de-France Mobilités)',
    legalReferenceLabel: 'Article L2531-18 du CGCT',
    legalReferenceUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050722132',
    ratePercent: 200,
  },
];

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateAdditionalTaxes(taxMask: number): {
  taxes: TaxeSejourAdditionalTaxResult[];
  multiplier: number;
} {
  let multiplier = 1;
  const taxes = ADDITIONAL_TAX_DEFINITIONS.map((definition) => {
    const isApplied = (taxMask & definition.mask) !== 0;
    if (isApplied) {
      multiplier += definition.ratePercent / 100;
    }

    return {
      key: definition.key,
      label: definition.label,
      legalReferenceLabel: definition.legalReferenceLabel,
      legalReferenceUrl: definition.legalReferenceUrl,
      ratePercent: definition.ratePercent,
      isApplied,
    };
  });

  return { taxes, multiplier };
}

function assertValidInput(input: TaxeSejourCalculationInput): void {
  if (!Number.isFinite(input.nightlyPriceHt) || input.nightlyPriceHt <= 0) {
    throw new Error('Le prix de la nuit HT doit être strictement positif.');
  }
  if (
    !Number.isFinite(input.capacity) ||
    input.capacity <= 0 ||
    !Number.isInteger(input.capacity)
  ) {
    throw new Error('La capacité doit être un entier strictement positif.');
  }
  if (!Number.isFinite(input.nights) || input.nights <= 0 || !Number.isInteger(input.nights)) {
    throw new Error('Le nombre de nuits doit être un entier strictement positif.');
  }
}

export function calculateTaxeSejour(
  input: TaxeSejourCalculationInput,
  city: TaxeSejourCity
): TaxeSejourCalculationOutput {
  assertValidInput(input);

  if (input.cityId !== city.id) {
    throw new Error('Le cityId de la requête ne correspond pas à la ville sélectionnée.');
  }

  const warnings: string[] = [];
  if (city.regime === 'f') {
    warnings.push(
      'La collectivité applique un régime forfaitaire pour les meublés de tourisme. Le résultat affiché est une estimation indicative, non contractuelle.'
    );
  }
  if (city.hasMultiplePeriods) {
    warnings.push(
      'La délibération contient plusieurs périodes de taxation. Le calcul utilise la première période disponible.'
    );
  }

  const { taxes: additionalTaxes, multiplier } = calculateAdditionalTaxes(city.taxMask);
  const capacity = input.capacity;
  const nights = input.nights;

  const nonClassPerPerson = Math.min(
    city.rates.nonClassCap,
    (input.nightlyPriceHt / capacity) * (city.rates.nonClassRatePct / 100)
  );

  const rows: TaxeSejourCalculationRow[] = [
    {
      category: 'Non classé',
      amount: roundToCents(nonClassPerPerson * capacity * nights * multiplier),
    },
    {
      category: '1*',
      amount: roundToCents(city.rates.star1Rate * capacity * nights * multiplier),
    },
    {
      category: '2*',
      amount: roundToCents(city.rates.star2Rate * capacity * nights * multiplier),
    },
    {
      category: '3*',
      amount: roundToCents(city.rates.star3Rate * capacity * nights * multiplier),
    },
    {
      category: '4*',
      amount: roundToCents(city.rates.star4Rate * capacity * nights * multiplier),
    },
    {
      category: '5*',
      amount: roundToCents(city.rates.star5Rate * capacity * nights * multiplier),
    },
  ];

  return {
    rows,
    additionalTaxes,
    isIndicative: city.regime === 'f',
    warnings,
  };
}
