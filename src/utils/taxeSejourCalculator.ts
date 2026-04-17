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
  nights: number;
  capacity?: number;
  personsStaying?: number;
  exemptedPersons?: number;
}

export interface TaxeSejourCalculationRow {
  category: 'Non classé' | '1*' | '2*' | '3*' | '4*' | '5*';
  amount: number;
  status: 'exact' | 'indicatif';
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
  selectedPeriod: {
    key: string;
    startLabel: string;
    endLabel: string;
  };
}

interface AdditionalTaxDefinition {
  key: TaxeSejourAdditionalTaxResult['key'];
  mask: number;
  label: string;
  legalReferenceLabel: string;
  legalReferenceUrl: string;
  ratePercent: number;
}

interface OccupancyContext {
  personsStaying: number;
  taxablePersons: number;
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

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0 || !Number.isInteger(value)) {
    throw new Error(`${label} doit être un entier strictement positif.`);
  }
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    throw new Error(`${label} doit être un entier positif ou nul.`);
  }
}

function resolveDefaultPeriod(city: TaxeSejourCity) {
  const defaultPeriod = city.periods[0];
  if (!defaultPeriod) {
    throw new Error('Aucune période tarifaire disponible pour la commune sélectionnée.');
  }
  return defaultPeriod;
}

function resolveOccupancy(input: TaxeSejourCalculationInput): OccupancyContext {
  const personsStaying = input.personsStaying;
  if (personsStaying === undefined) {
    throw new Error('Le nombre de personnes accueillies est requis pour ce calcul.');
  }
  assertPositiveInteger(personsStaying, 'Le nombre de personnes accueillies');

  const exemptedPersons = input.exemptedPersons ?? 0;
  assertNonNegativeInteger(exemptedPersons, 'Le nombre de personnes exonérées');

  if (exemptedPersons > personsStaying) {
    throw new Error(
      'Le nombre de personnes exonérées ne peut pas dépasser le nombre de personnes accueillies.'
    );
  }

  return {
    personsStaying,
    taxablePersons: personsStaying - exemptedPersons,
  };
}

function calculateClassifiedReal(
  ratePerPersonPerNight: number,
  taxablePersons: number,
  nights: number
): number {
  return ratePerPersonPerNight * taxablePersons * nights;
}

function calculateClassifiedForfait(
  ratePerCapacityUnitPerNight: number,
  capacity: number,
  nights: number
): number {
  return ratePerCapacityUnitPerNight * capacity * nights;
}

function calculateUnclassifiedProportional(
  nightlyPriceHt: number,
  personsStaying: number,
  taxablePersons: number,
  nights: number,
  nonClassRatePct: number,
  nonClassCap: number
): number {
  const costPerPerson = nightlyPriceHt / personsStaying;
  const perPersonAmount = Math.min(nonClassCap, costPerPerson * (nonClassRatePct / 100));
  return perPersonAmount * taxablePersons * nights;
}

export function calculateTaxeSejour(
  input: TaxeSejourCalculationInput,
  city: TaxeSejourCity
): TaxeSejourCalculationOutput {
  if (input.cityId !== city.id) {
    throw new Error('Le cityId de la requête ne correspond pas à la ville sélectionnée.');
  }

  if (!Number.isFinite(input.nightlyPriceHt) || input.nightlyPriceHt <= 0) {
    throw new Error('Le prix de la nuit HT doit être strictement positif.');
  }
  assertPositiveInteger(input.nights, 'Le nombre de nuits');

  const warnings: string[] = [];
  const selectedPeriod = resolveDefaultPeriod(city);

  const needsOccupancy = city.classifiedRegime === 'r' || city.unclassifiedRegime === 'r';
  const occupancy = needsOccupancy ? resolveOccupancy(input) : null;

  if (city.classifiedRegime === 'f') {
    if (input.capacity === undefined) {
      throw new Error('La capacité d’accueil est requise pour le calcul forfaitaire des classés.');
    }
    assertPositiveInteger(input.capacity, 'La capacité d’accueil');
  }

  const { taxes: additionalTaxes, multiplier } = calculateAdditionalTaxes(city.taxMask);
  const rows: TaxeSejourCalculationRow[] = [];

  if (city.unclassifiedRegime === 'r') {
    const nonClassBase = calculateUnclassifiedProportional(
      input.nightlyPriceHt,
      (occupancy as OccupancyContext).personsStaying,
      (occupancy as OccupancyContext).taxablePersons,
      input.nights,
      selectedPeriod.rates.nonClassRatePct,
      selectedPeriod.rates.nonClassCap
    );
    rows.push({
      category: 'Non classé',
      amount: roundToCents(nonClassBase * multiplier),
      status: 'exact',
    });
  } else {
    rows.push({
      category: 'Non classé',
      amount: 0,
      status: 'indicatif',
    });
    warnings.push(
      "Le régime forfaitaire n'est pas pleinement géré pour la ligne Non classé; le montant affiché reste indicatif."
    );
  }

  const categoryRates = [
    { category: '1*' as const, rate: selectedPeriod.rates.star1Rate },
    { category: '2*' as const, rate: selectedPeriod.rates.star2Rate },
    { category: '3*' as const, rate: selectedPeriod.rates.star3Rate },
    { category: '4*' as const, rate: selectedPeriod.rates.star4Rate },
    { category: '5*' as const, rate: selectedPeriod.rates.star5Rate },
  ];

  if (city.classifiedRegime === 'f') {
    warnings.push(
      "Régime forfaitaire (indicatif): le calcul légal repose sur la période d'ouverture / de mise en location et la capacité d'accueil du logement. Un abattement local peut aussi exister. Il n'est pas intégré ici, car le simulateur vise une comparaison simplifiée sur un séjour type et non un calcul fiscal annuel exact."
    );
  }

  for (const rowRate of categoryRates) {
    const baseAmount =
      city.classifiedRegime === 'r'
        ? calculateClassifiedReal(
            rowRate.rate,
            (occupancy as OccupancyContext).taxablePersons,
            input.nights
          )
        : calculateClassifiedForfait(rowRate.rate, input.capacity as number, input.nights);

    rows.push({
      category: rowRate.category,
      amount: roundToCents(baseAmount * multiplier),
      status: city.classifiedRegime === 'f' ? 'indicatif' : 'exact',
    });
  }

  return {
    rows,
    additionalTaxes,
    isIndicative: rows.some((row) => row.status === 'indicatif'),
    warnings,
    selectedPeriod: {
      key: selectedPeriod.key,
      startLabel: selectedPeriod.startLabel,
      endLabel: selectedPeriod.endLabel,
    },
  };
}
