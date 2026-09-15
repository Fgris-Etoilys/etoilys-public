import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ImageAssetKey } from '../imageManifest';
import type { PricingProfileId } from './pricing';

export type DepartmentAreaId = 'dordogne' | 'gironde' | 'lot-et-garonne';

export type RegionId = 'nouvelle-aquitaine' | 'occitanie';

export type DepartmentPublicationStatus = 'published' | 'draft';

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
  displayOrder: number;
  description: string;
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
  answer: string;
}

export interface LocalSource {
  label: string;
  href: string;
}

export interface DepartmentBenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DepartmentSector {
  name: string;
  communes?: string[];
  visibleCommunes?: string[];
  collapsedCommunes?: string[];
}

export interface DepartmentHeroConfig {
  assetKey: ImageAssetKey;
  alt: string;
  eyebrow: string;
  h1: string;
  paragraphs: string[];
  imageClassName: string;
  overlayClassName: string;
}

export interface DepartmentTourismConfig {
  title: string;
  introParagraphs: string[];
  image: {
    assetKey: ImageAssetKey;
    alt: string;
  };
  cardTitle: string;
  rows: LocalTableRow[];
  sourceNote: string;
  afterTitle?: string;
  afterParagraphs: string[];
}

export interface DepartmentServiceAreaConfig {
  title: string;
  intro: string;
  sectors: DepartmentSector[];
  sectorLinks?: Record<string, { label: string; href: string }>;
  communeLinks?: Record<string, { href: string; label?: string }>;
  outro: string;
}

export interface DepartmentProcedureConfig {
  title: string;
  intro: string;
  image: {
    assetKey: ImageAssetKey;
    alt: string;
  };
  steps: LocalProcedureStep[];
  simulatorPrompt: {
    title: string;
    description: string;
  };
}

export interface DepartmentTariffConfig {
  title: string;
  paragraphs: string[];
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

export interface DepartmentFinalCtaConfig {
  title: string;
  paragraphs: string[];
}

export interface DepartmentLandingPageConfig {
  departmentId: DepartmentAreaId;
  layoutVersion?: 'v5';
  hero: DepartmentHeroConfig;
  benefits: {
    title: string;
    paragraphs: string[];
    items: DepartmentBenefitItem[];
    cofracDescription: string;
  };
  tourism: DepartmentTourismConfig;
  serviceArea: DepartmentServiceAreaConfig;
  procedure: DepartmentProcedureConfig;
  tariff: DepartmentTariffConfig;
  pricing?: DepartmentPricingResolutionConfig;
  faq: {
    title: string;
    items: LocalFaqItem[];
    sectionClassName: string;
  };
  finalCta: DepartmentFinalCtaConfig;
  sources: LocalSource[];
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
    caption?: ReactNode;
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
    href: string;
  };
}

export interface LocalV6DepartmentServiceArea {
  title: string;
  intro: string;
  sectors: readonly DepartmentSector[];
  communeLinks?: Record<string, { href: string; label?: string }>;
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
  paragraphs: readonly string[];
  exampleLabel: string;
  exampleTitle: string;
  exampleSubtitle: string;
  comparison: readonly LocalTableRow[];
  savingsHeadline: string;
  savingsDetail: string;
  sourceNote: string;
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
    caption?: string;
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
  faq: LocalV6Faq;
  finalCta: LocalV6FinalCta;
}

export interface LocalLandingPageV6CityConfig extends LocalLandingPageV6Base {
  scope: 'city';
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
