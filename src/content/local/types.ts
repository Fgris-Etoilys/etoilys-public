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
  afterTitle: string;
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
