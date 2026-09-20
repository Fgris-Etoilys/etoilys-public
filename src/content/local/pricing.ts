export type PricingProfileId =
  | 'aveyron-standard'
  | 'dordogne-standard'
  | 'gironde-standard'
  | 'lot-standard'
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

export interface PricingOffer {
  title: string;
  description: string;
}

export interface PricingTierRow {
  key: string;
  label: string;
  amount: string;
  qualifier: 'TTC' | 'HT';
}

export interface FlatPricingProfile {
  kind: 'flat';
  id: PricingProfileId;
  standard: PricingAmount;
  partner?: PartnerPricing;
  multiProperty?: {
    rows: MultiPropertyPricingRow[];
  };
  offer?: PricingOffer;
  note?: string;
}

export interface TieredPricingProfile {
  kind: 'tiered';
  id: PricingProfileId;
  tiers: PricingTierRow[];
  offer?: PricingOffer;
  note?: string;
}

export type PricingProfile = FlatPricingProfile | TieredPricingProfile;

const standardProfileValues = {
  kind: 'flat',
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
} as const satisfies Omit<FlatPricingProfile, 'id'>;

function createStandardPricingProfile(id: PricingProfileId): PricingProfile {
  return {
    id,
    kind: standardProfileValues.kind,
    standard: { ...standardProfileValues.standard },
    partner: { ...standardProfileValues.partner },
    multiProperty: {
      rows: standardProfileValues.multiProperty.rows.map((row) => ({ ...row })),
    },
    note: standardProfileValues.note,
  };
}

const lotPricingProfile: PricingProfile = {
  id: 'lot-standard',
  kind: 'flat',
  standard: {
    label: 'Tarif public',
    amount: '200 €',
    qualifier: 'TTC',
  },
  multiProperty: {
    rows: [
      {
        key: 'first',
        label: 'Premier logement',
        amount: '200 €',
      },
      {
        key: 'second-and-next',
        label: 'Deuxième logement et suivants',
        amount: '160 € par logement',
      },
    ],
  },
  note: standardProfileValues.note,
};

const girondeStandardProfileValues = {
  kind: 'tiered',
  tiers: [
    {
      key: 'studio-t1',
      label: 'Studio / T1',
      amount: '180 €',
      qualifier: 'TTC',
    },
    {
      key: 't2-t3-t4',
      label: 'T2 / T3 / T4',
      amount: '200 €',
      qualifier: 'TTC',
    },
    {
      key: 't5-plus',
      label: 'T5 et plus',
      amount: '250 €',
      qualifier: 'TTC',
    },
  ],
  offer: {
    title: 'Renouvellement : -20 %',
    description:
      'Pour les logements dont le classement initial a été réalisé par Etoilys ou Gironde Tourisme.',
  },
  note: standardProfileValues.note,
} as const satisfies Omit<TieredPricingProfile, 'id'>;

function createGirondePricingProfile(
  id: Extract<PricingProfileId, 'gironde-standard' | 'bordeaux-standard'>
): PricingProfile {
  return {
    id,
    kind: girondeStandardProfileValues.kind,
    tiers: girondeStandardProfileValues.tiers.map((tier) => ({ ...tier })),
    offer: { ...girondeStandardProfileValues.offer },
    note: girondeStandardProfileValues.note,
  };
}

export const PRICING_PROFILES: Record<PricingProfileId, PricingProfile> = {
  'aveyron-standard': createStandardPricingProfile('aveyron-standard'),
  'dordogne-standard': createStandardPricingProfile('dordogne-standard'),
  'gironde-standard': createGirondePricingProfile('gironde-standard'),
  'lot-standard': lotPricingProfile,
  'lot-et-garonne-standard': createStandardPricingProfile('lot-et-garonne-standard'),
  'bordeaux-standard': createGirondePricingProfile('bordeaux-standard'),
};

export function getPricingProfile(profileId: PricingProfileId): PricingProfile {
  return PRICING_PROFILES[profileId];
}
