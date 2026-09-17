export type PricingProfileId =
  | 'dordogne-standard'
  | 'gironde-standard'
  | 'lot-et-garonne-standard'
  | 'bordeaux-standard';

export interface PricingAmount {
  label: string;
  amount: string;
  qualifier: 'TTC' | 'HT';
}

export interface PartnerPricing {
  amount: string;
  qualifier: 'TTC' | 'HT';
  conditions?: string;
}

export interface MultiPropertyPricingRow {
  key: string;
  label: string;
  amount: string;
}

export interface PricingProfile {
  id: PricingProfileId;
  standard: PricingAmount;
  partner?: PartnerPricing;
  multiProperty?: {
    rows: MultiPropertyPricingRow[];
  };
  note?: string;
}

const standardProfileValues = {
  standard: {
    label: 'Tarif public',
    amount: '240 €',
    qualifier: 'TTC',
  },
  partner: {
    amount: '200 €',
    qualifier: 'TTC',
  },
  multiProperty: {
    rows: [
      {
        key: 'first',
        label: 'Premier logement',
        amount: '240 €',
      },
      {
        key: 'second',
        label: 'Deuxième logement',
        amount: '160 €',
      },
      {
        key: 'third-and-next',
        label: 'Troisième logement et suivants',
        amount: '100 € par logement',
      },
    ],
  },
  note: 'Les tarifs ci-dessous sont tout compris, sans frais de déplacement. Le montant applicable est confirmé avant tout engagement.',
} as const satisfies Omit<PricingProfile, 'id'>;

function createStandardPricingProfile(id: PricingProfileId): PricingProfile {
  return {
    id,
    standard: { ...standardProfileValues.standard },
    partner: { ...standardProfileValues.partner },
    multiProperty: {
      rows: standardProfileValues.multiProperty.rows.map((row) => ({ ...row })),
    },
    note: standardProfileValues.note,
  };
}

export const PRICING_PROFILES: Record<PricingProfileId, PricingProfile> = {
  'dordogne-standard': createStandardPricingProfile('dordogne-standard'),
  'gironde-standard': createStandardPricingProfile('gironde-standard'),
  'lot-et-garonne-standard': createStandardPricingProfile('lot-et-garonne-standard'),
  'bordeaux-standard': createStandardPricingProfile('bordeaux-standard'),
};

export function getPricingProfile(profileId: PricingProfileId): PricingProfile {
  return PRICING_PROFILES[profileId];
}
