export type PricingProfileId =
  | 'aude-standard'
  | 'aveyron-standard'
  | 'dordogne-standard'
  | 'gironde-standard'
  | 'lot-standard'
  | 'lot-et-garonne-standard'
  | 'bordeaux-standard'
  | 'sarlat-perigord-noir';

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

/** Ligne sans montant prédéfini : affichée sans unité monétaire ni qualificatif TTC/HT. */
export interface PricingQuoteTierRow {
  key: string;
  label: string;
  quote: 'Sur devis';
}

export type PricingTierListRow = PricingTierRow | PricingQuoteTierRow;

export interface PreferentialTieredPricing {
  title: string;
  description: string;
  tiers: PricingTierListRow[];
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
  standardTitle?: string;
  tiers: PricingTierListRow[];
  preferential?: PreferentialTieredPricing;
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

// Aude : tarif public et tarif adhérents OT partenaires, sans paliers multi-logements ; un tarif
// dégressif reste possible sur demande, sans montant prédéfini.
const audePricingProfile: PricingProfile = {
  id: 'aude-standard',
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
  note: standardProfileValues.note,
};

const girondeStandardProfileValues = {
  kind: 'tiered',
  standardTitle: 'Tarif standard',
  tiers: [
    {
      key: 'studio-t1-t4',
      label: 'Studio, T1 à T4',
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
  preferential: {
    title: 'Tarif préférentiel',
    description:
      'Renouvellement · 4 meublés ou plus pour un même propriétaire · professionnels du tourisme',
    tiers: [
      {
        key: 'preferential-studio-t1-t4',
        label: 'Studio, T1 à T4',
        amount: '180 €',
        qualifier: 'TTC',
      },
      {
        key: 'preferential-t5-plus',
        label: 'T5 et plus',
        amount: '230 €',
        qualifier: 'TTC',
      },
    ],
  },
  note: standardProfileValues.note,
} as const satisfies Omit<TieredPricingProfile, 'id'>;

function createGirondePricingProfile(
  id: Extract<PricingProfileId, 'gironde-standard' | 'bordeaux-standard'>
): PricingProfile {
  return {
    id,
    kind: girondeStandardProfileValues.kind,
    standardTitle: girondeStandardProfileValues.standardTitle,
    tiers: girondeStandardProfileValues.tiers.map((tier) => ({ ...tier })),
    preferential: {
      ...girondeStandardProfileValues.preferential,
      tiers: girondeStandardProfileValues.preferential.tiers.map((tier) => ({ ...tier })),
    },
    note: girondeStandardProfileValues.note,
  };
}

// Sarlat et le Périgord Noir : grille par rang de logement, au tarif direct ou au tarif réservé aux
// adhérents d’un office de tourisme partenaire d’Etoilys ; devis à partir du sixième logement.
const sarlatPerigordNoirPricingProfile: PricingProfile = {
  id: 'sarlat-perigord-noir',
  kind: 'tiered',
  standardTitle: 'Tarif direct',
  tiers: [
    { key: 'first', label: '1er logement', amount: '200 €', qualifier: 'TTC' },
    { key: 'second', label: '2e logement', amount: '150 €', qualifier: 'TTC' },
    {
      key: 'third-to-fifth',
      label: '3e, 4e et 5e logement (chacun)',
      amount: '120 €',
      qualifier: 'TTC',
    },
    { key: 'sixth-and-next', label: 'À partir du 6e logement', quote: 'Sur devis' },
  ],
  preferential: {
    title: 'Tarif partenaire office de tourisme',
    description:
      'Réservé aux propriétaires adhérents d’un office de tourisme partenaire d’Etoilys.',
    tiers: [
      { key: 'partner-first', label: '1er logement', amount: '160 €', qualifier: 'TTC' },
      { key: 'partner-second', label: '2e logement', amount: '120 €', qualifier: 'TTC' },
      {
        key: 'partner-third-to-fifth',
        label: '3e, 4e et 5e logement (chacun)',
        amount: '100 €',
        qualifier: 'TTC',
      },
      { key: 'partner-sixth-and-next', label: 'À partir du 6e logement', quote: 'Sur devis' },
    ],
  },
  note: standardProfileValues.note,
};

export const PRICING_PROFILES: Record<PricingProfileId, PricingProfile> = {
  'aude-standard': audePricingProfile,
  'aveyron-standard': createStandardPricingProfile('aveyron-standard'),
  'dordogne-standard': createStandardPricingProfile('dordogne-standard'),
  'gironde-standard': createGirondePricingProfile('gironde-standard'),
  'lot-standard': lotPricingProfile,
  'lot-et-garonne-standard': createStandardPricingProfile('lot-et-garonne-standard'),
  'bordeaux-standard': createGirondePricingProfile('bordeaux-standard'),
  'sarlat-perigord-noir': sarlatPerigordNoirPricingProfile,
};

export function getPricingProfile(profileId: PricingProfileId): PricingProfile {
  return PRICING_PROFILES[profileId];
}
