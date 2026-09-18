import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ImageAssetKey } from '../imageManifest';
import type { PricingProfileId } from './pricing';

export type DepartmentAreaId = 'dordogne' | 'gironde' | 'lot' | 'lot-et-garonne';

export type CityAreaId = 'bergerac' | 'bordeaux';

export type LocalAreaId = DepartmentAreaId | CityAreaId;

export type RegionId = 'nouvelle-aquitaine' | 'occitanie';

export type DepartmentPublicationStatus = 'published' | 'draft';

export type LocalAreaKind = 'department' | 'city';

export type LocalCoverageMode = 'department' | 'sectors' | 'on-request';

export interface LocalSeoMetadata {
  title: string;
  description: string;
  lastModified: string;
  breadcrumbLabel: string;
  ogImageKey: ImageAssetKey;
  lcpImageKey: ImageAssetKey;
  lcpImageSizes: string;
}

interface LocalRegistryEntryBase {
  id: LocalAreaId;
  kind: LocalAreaKind;
  name: string;
  path: string;
  departmentCode: string;
  regionId: RegionId;
  status: DepartmentPublicationStatus;
  displayOrder: number;
  seo: LocalSeoMetadata;
}

export interface DepartmentRegistryEntry extends LocalRegistryEntryBase {
  id: DepartmentAreaId;
  kind: 'department';
  coverageMode: LocalCoverageMode;
  hubDescription: string;
  hubLinkLabel: string;
  communeIndex?: {
    departmentCode: string;
    outputFileName: string;
  };
}

export interface CityRegistryEntry extends LocalRegistryEntryBase {
  id: CityAreaId;
  kind: 'city';
  parentId: DepartmentAreaId;
  hubLabel: string;
  departmentLabel?: string;
}

export type LocalRegistryEntry = DepartmentRegistryEntry | CityRegistryEntry;

export interface LocalInterventionPage {
  id: string;
  label: string;
  hubLabel?: string;
  departmentLabel?: string;
  path: string;
}

export interface RegionRegistryEntry {
  id: RegionId;
  label: string;
  displayOrder: number;
}

export interface DepartmentInterventionArea {
  id: DepartmentAreaId;
  name: string;
  path: string;
  departmentCode: string;
  regionId: RegionId;
  status: DepartmentPublicationStatus;
  coverageMode: LocalCoverageMode;
  displayOrder: number;
  description: string;
  hubLinkLabel: string;
  localPages: LocalInterventionPage[];
}

export interface DepartmentRegionGroup {
  region: RegionRegistryEntry;
  departments: DepartmentInterventionArea[];
}

export interface LocalStatistic {
  value: string;
  label: string;
}

export interface LocalTableRow {
  key: string;
  label: string;
  value: string;
}

export interface LocalProcedureStep {
  number: number;
  title: string;
  description: string;
}

export interface LocalFaqItem {
  question: string;
  answer: ReactNode;
}

export interface LocalSource {
  label: string;
  href: string;
}

export interface DepartmentSector {
  name: string;
  communes?: string[];
  visibleCommunes?: string[];
  collapsedCommunes?: string[];
}

export interface DepartmentPricingResolutionConfig {
  title: string;
  intro: string;
  inputLabel: string;
  placeholder: string;
  communeIndexUrl: string;
  defaultPricingProfileId: PricingProfileId;
  overrides: Record<string, PricingProfileId>;
}

export type LocalV6ButtonVariant = 'primary' | 'secondary' | 'white' | 'ghost';

export interface LocalV6Action {
  label: ReactNode;
  href: string;
  variant: LocalV6ButtonVariant;
  className?: string;
}

export interface LocalV6HeroImageCredit {
  sourceLabel: string;
  sourceHref: string;
  licenseLabel: string;
  licenseHref: string;
}

export interface LocalV6Hero {
  eyebrow: string;
  title: string;
  highlightedTitleText?: string;
  description: string;
  image: {
    assetKey: ImageAssetKey;
    alt: string;
    sizes?: string;
    className: string;
    caption: ReactNode;
    note: {
      lead: string;
      title: string;
      caption: string;
    };
    index?: ReactNode;
    credit?: LocalV6HeroImageCredit;
  };
  primaryAction: LocalV6Action;
  secondaryAction?: LocalV6Action;
  reassuranceItems: readonly string[];
}

export interface LocalV6ProofItem {
  icon?: LucideIcon;
  value?: ReactNode;
  title: string;
  description?: ReactNode;
  link?: {
    href: string;
    label: string;
  };
}

export interface LocalV6CityServiceArea {
  title: string;
  intro: string;
  communes: readonly string[];
  parentLink: {
    label: string;
    localEntryId: DepartmentAreaId;
  };
}

export interface LocalV6DepartmentServiceArea {
  title: string;
  intro: string;
  sectors: readonly DepartmentSector[];
  communeLinks?: Record<string, { localEntryId: CityAreaId; label?: string }>;
  parentLink?: {
    label: string;
    href: string;
  };
}

export interface LocalV6DirectPricing {
  mode: 'direct';
  title: string;
  intro?: string;
  checklist: readonly string[];
  procedureLink: {
    href: string;
    label: string;
  };
  pricingProfileId: PricingProfileId;
}

export interface LocalV6PickerPricing {
  mode: 'picker';
  title: string;
  intro: string;
  checklist: readonly string[];
  procedureLink: {
    href: string;
    label: string;
  };
  picker: DepartmentPricingResolutionConfig;
}

export interface LocalV6TaxModule {
  type: 'tax-comparison';
  title: string;
  highlightedTitleText?: string;
  paragraphs: readonly string[];
  exampleLabel: string;
  exampleTitle: string;
  exampleSubtitle: string;
  comparison: readonly LocalTableRow[];
  savingsHeadline: string;
  savingsDetail: string;
  sourceNote: string;
}

export interface LocalV6EditorialNotice {
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
  conclusion?: string;
  source?: {
    label: string;
    href: string;
  };
}

export interface LocalV6Procedure {
  title: string;
  eyebrow: string;
  steps: readonly LocalProcedureStep[];
  link: {
    href: string;
    label: string;
    variant?: LocalV6ButtonVariant;
    className?: string;
  };
  note: string;
}

export interface LocalV6Expertise {
  title: string;
  image: {
    assetKey: ImageAssetKey;
    alt: string;
    sizes: string;
    className: string;
    caption: string;
    credit?: LocalV6HeroImageCredit;
  };
}

export interface LocalV6Faq {
  eyebrow: string;
  title: string;
  intro: string;
  contactLink: {
    href: string;
    label: string;
  };
  items: readonly { question: string; answer: ReactNode }[];
}

export interface LocalV6FinalCta {
  eyebrow: string;
  title: string;
  description: ReactNode;
  primaryAction: LocalV6Action;
  hint: string;
}

interface LocalLandingPageV6Base {
  layoutVersion: 'v6';
  hero: LocalV6Hero;
  proofItems: readonly [LocalV6ProofItem, LocalV6ProofItem, LocalV6ProofItem];
  procedure: LocalV6Procedure;
  expertise: LocalV6Expertise;
  localNotice?: LocalV6EditorialNotice;
  faq: LocalV6Faq;
  finalCta: LocalV6FinalCta;
}

export interface LocalLandingPageV6CityConfig extends LocalLandingPageV6Base {
  scope: 'city';
  localEntryId: CityAreaId;
  city: string;
  serviceArea: LocalV6CityServiceArea;
  pricing: LocalV6DirectPricing;
  localModule?: LocalV6TaxModule;
}

export interface LocalLandingPageV6DepartmentConfig extends LocalLandingPageV6Base {
  scope: 'department';
  departmentId: DepartmentAreaId;
  serviceArea: LocalV6DepartmentServiceArea;
  pricing: LocalV6PickerPricing;
  localModule?: LocalV6TaxModule;
}

export type LocalLandingPageV6Config =
  | LocalLandingPageV6CityConfig
  | LocalLandingPageV6DepartmentConfig;
