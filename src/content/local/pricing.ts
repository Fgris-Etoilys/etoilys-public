export type PricingProfileId = 'dordogne-standard' | 'bordeaux-standard';

export interface PricingAmount {
  label: string;
  amount: string;
  qualifier: 'TTC' | 'HT';
  description?: string;
}

export interface PartnerPricing {
  label: string;
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
    title: string;
    caption: string;
    rows: MultiPropertyPricingRow[];
  };
  travelFees?: string;
  note?: string;
}

const standardProfileValues = {
  standard: {
    label: 'Tarif public',
    amount: '240 €',
    qualifier: 'TTC',
  },
  partner: {
    label: 'Adhérent à un office de tourisme partenaire',
    amount: '200 €',
    qualifier: 'TTC',
  },
  multiProperty: {
    title: 'Tarifs dégressifs pour plusieurs logements sur le même secteur',
    caption: 'Tarifs dégressifs Etoilys pour plusieurs logements',
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

export const PRICING_PROFILES: Record<PricingProfileId, PricingProfile> = {
  'dordogne-standard': {
    id: 'dordogne-standard',
    ...standardProfileValues,
  },
  'bordeaux-standard': {
    id: 'bordeaux-standard',
    ...standardProfileValues,
  },
};

export function getPricingProfile(profileId: PricingProfileId): PricingProfile {
  return PRICING_PROFILES[profileId];
}
