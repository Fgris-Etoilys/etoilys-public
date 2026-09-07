import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Euro,
  FileCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ResponsiveComparisonTable from '../ui/ResponsiveComparisonTable';
import SmartImage from '../ui/SmartImage';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import type { ImageAssetKey } from '../../content/imageManifest';
import type { PricingProfile } from '../../content/local/pricing';
import type { DepartmentSector, LocalProcedureStep } from '../../content/local/types';

interface HeroImageCredit {
  sourceLabel: string;
  sourceHref: string;
  licenseLabel: string;
  licenseHref: string;
}

interface LocalHeroContent {
  assetKey: ImageAssetKey;
  alt: string;
  eyebrow: string;
  h1: string;
  intro: string;
  imageClassName?: string;
  overlayClassName?: string;
  credit?: HeroImageCredit;
}

interface ReasonCard {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}

interface CityServiceAreaContent {
  title: string;
  intro: string;
  communes: string[];
  outro: string[];
  parentLink: {
    label: string;
    href: string;
  };
}

interface DepartmentServiceAreaContent {
  title: string;
  intro: string;
  sectors: DepartmentSector[];
  sectorLinks?: Record<string, { label: string; href: string }>;
  outro: string;
}

interface LocalFaqSectionProps {
  title: string;
  items: { question: string; answer: ReactNode }[];
  variant?: 'v3' | 'v4';
  sectionClassName?: string;
}

const localClassificationBenefits: ReasonCard[] = [
  {
    icon: Euro,
    title: 'Fiscalité micro-BIC',
    description:
      'Au régime micro-BIC, un meublé classé bénéficie d’un plafond plus élevé et d’un abattement plus favorable qu’un meublé non classé.',
  },
  {
    icon: FileCheck,
    title: 'Taxe de séjour',
    description:
      'Un meublé classé passe à un tarif fixe selon son nombre d’étoiles. Selon la commune, cela peut réduire sensiblement la taxe de séjour payée par vos voyageurs.',
  },
  {
    icon: Award,
    title: 'Gagnez en visibilité auprès des voyageurs',
    description:
      'Les étoiles offrent un repère officiel reconnu, rassurent au moment de réserver et aident votre annonce à se démarquer pour attirer davantage de voyageurs.',
  },
];

const etoilysV4Reasons: ReasonCard[] = [
  {
    icon: Sparkles,
    title: 'Des outils pour mieux préparer la catégorie visée',
    description:
      'Avant la visite, le simulateur Etoilys vous permet de vérifier les principaux critères de la catégorie visée et d’identifier les points à préparer. Vous abordez ainsi la visite avec une vision beaucoup plus claire du niveau attendu.',
  },
  {
    icon: Award,
    title: '100 % spécialisés dans le classement des meublés de tourisme',
    description:
      'Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos inspecteurs connaissent en profondeur la réglementation, la grille officielle et les points qui font réellement la différence pour atteindre la catégorie visée.',
  },
  {
    icon: ShieldCheck,
    title: 'Organisme accrédité Cofrac Inspection',
    description: (
      <>
        Etoilys est accrédité Cofrac Inspection n°3-2394 pour réaliser les visites officielles de
        classement des meublés de tourisme.{' '}
        <a
          href={COFRAC_ACCREDITATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-300 underline hover:text-primary-400"
        >
          Consulter la portée d’accréditation Cofrac
        </a>
        .
      </>
    ),
  },
];

const multiPropertyTariffColumns = [
  {
    key: 'logement',
    label: 'Logement visité',
    widthClassName: 'w-3/5',
  },
  {
    key: 'tarif',
    label: 'Tarif TTC',
    widthClassName: 'w-2/5',
    align: 'right' as const,
  },
];

export function LocalHeroSection({
  hero,
  primaryCtaLabel = 'Demander mon classement',
  secondaryCtaLabel = 'Estimer la catégorie de mon logement',
}: {
  hero: LocalHeroContent;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
}) {
  return (
    <section className="relative min-h-[720px] overflow-hidden py-section text-white">
      <div className="absolute inset-0">
        <SmartImage
          assetKey={hero.assetKey}
          alt={hero.alt}
          priority
          sizes="100vw"
          className={hero.imageClassName ?? 'h-full w-full object-cover object-center'}
        />
        <div className={hero.overlayClassName ?? 'absolute inset-0 bg-black/60'} />
      </div>
      <div className="container-adaptive relative flex min-h-[560px] items-center">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
            {hero.eyebrow}
          </p>
          <h1 className="mb-6 text-white">{hero.h1}</h1>
          <p className="max-w-3xl text-xl leading-comfortable text-white/90">{hero.intro}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="/demande-classement" variant="white" size="lg">
              {primaryCtaLabel}
            </Button>
            <Button href="/simulateur" variant="ghost" size="lg">
              {secondaryCtaLabel}
            </Button>
          </div>
          <p className="mt-5 flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium leading-relaxed text-white/90">
            <HeroProof>Demande en 30 secondes</HeroProof>
            <span aria-hidden="true" className="text-white/45">
              ·
            </span>
            <HeroProof>Visite en moyenne sous deux semaines</HeroProof>
            <span aria-hidden="true" className="text-white/45">
              ·
            </span>
            <HeroProof>Aucun frais de déplacement</HeroProof>
          </p>
        </div>
      </div>
      {hero.credit && (
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <p className="container-adaptive text-xs leading-comfortable text-white/70">
            Photo :{' '}
            <a
              href={hero.credit.sourceHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline hover:text-white"
            >
              {hero.credit.sourceLabel}
            </a>{' '}
            -{' '}
            <a
              href={hero.credit.licenseHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline hover:text-white"
            >
              {hero.credit.licenseLabel}
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

function HeroProof({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-200" aria-hidden="true" />
      {children}
    </span>
  );
}

export function LocalWhyClassifySection() {
  return (
    <section className="bg-white py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-4xl">
            <h2 className="mb-5">Pourquoi classer votre meublé ?</h2>
            <p className="text-textLight leading-comfortable">
              Dans un marché de la location saisonnière de plus en plus concurrentiel, le classement
              ne se résume pas à ses avantages fiscaux : il permet aussi de mieux différencier votre
              logement et de renforcer son attractivité auprès des voyageurs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {localClassificationBenefits.map((benefit) => (
              <ReasonCardItem key={benefit.title} reason={benefit} />
            ))}
          </div>
          <Link
            to="/les-avantages-du-classement"
            className="mt-8 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
          >
            Voir tous les avantages du classement
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LocalCityServiceAreaSection({
  serviceArea,
}: {
  serviceArea: CityServiceAreaContent;
}) {
  return (
    <section className="bg-primary-100 py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-400 shadow-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Intervention locale
          </div>
          <h2 className="mb-5">{serviceArea.title}</h2>
          <div className="space-y-5 text-textLight leading-comfortable">
            <p>{serviceArea.intro}</p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceArea.communes.map((commune) => (
                <li
                  key={commune}
                  className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-500 shadow-sm"
                >
                  {commune}
                </li>
              ))}
            </ul>
            {serviceArea.outro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            to={serviceArea.parentLink.href}
            className="mt-6 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
          >
            {serviceArea.parentLink.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LocalDepartmentServiceAreaSection({
  serviceArea,
}: {
  serviceArea: DepartmentServiceAreaContent;
}) {
  const [expandedSectors, setExpandedSectors] = useState<ReadonlySet<string>>(new Set());

  function toggleSector(sectorName: string) {
    setExpandedSectors((previous) => {
      const next = new Set(previous);
      if (next.has(sectorName)) {
        next.delete(sectorName);
      } else {
        next.add(sectorName);
      }
      return next;
    });
  }

  return (
    <section className="bg-primary-100 py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-400 shadow-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Intervention locale
          </div>
          <h2 className="mb-5">{serviceArea.title}</h2>
          <p className="max-w-5xl text-textLight leading-comfortable">{serviceArea.intro}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {serviceArea.sectors.map((sector) => {
              const visibleCommunes = sector.visibleCommunes ?? sector.communes ?? [];
              const collapsedCommunes = sector.collapsedCommunes ?? [];
              const sectorLink = serviceArea.sectorLinks?.[sector.name];
              const isExpanded = expandedSectors.has(sector.name);
              const collapsedListId = `department-sector-${sector.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')}-collapsed`;

              return (
                <Card key={sector.name} hover={false} className="p-6">
                  <h3 className="mb-4 text-xl font-playfair font-semibold text-gray-900">
                    {sector.name}
                  </h3>
                  <ul className="flex flex-wrap gap-2 text-sm leading-comfortable text-textLight">
                    {visibleCommunes.map((commune) => (
                      <li
                        key={commune}
                        className="rounded-full border border-primary-200 bg-white px-3 py-1.5 font-medium text-primary-500"
                      >
                        {commune}
                      </li>
                    ))}
                  </ul>

                  {collapsedCommunes.length > 0 && (
                    <>
                      <ul
                        id={collapsedListId}
                        className={`mt-3 flex flex-wrap gap-2 text-sm leading-comfortable text-textLight ${
                          isExpanded ? '' : 'hidden'
                        }`}
                      >
                        {collapsedCommunes.map((commune) => (
                          <li
                            key={commune}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5"
                          >
                            {commune}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={collapsedListId}
                        onClick={() => toggleSector(sector.name)}
                        className="mt-4 inline-flex text-sm font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
                      >
                        {isExpanded ? 'Voir moins de communes' : 'Voir plus de communes'}
                      </button>
                    </>
                  )}

                  {sectorLink && (
                    <Link
                      to={sectorLink.href}
                      className="mt-4 block text-sm font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400"
                    >
                      {sectorLink.label}
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>

          <p className="mt-8 max-w-4xl text-sm text-textLight leading-comfortable">
            {serviceArea.outro}
          </p>
        </div>
      </div>
    </section>
  );
}

export function LocalTariffsSection({
  title,
  pricingProfile,
  intro,
}: {
  title: string;
  pricingProfile: PricingProfile;
  intro?: ReactNode;
}) {
  const rows =
    pricingProfile.multiProperty?.rows.map((row) => ({
      key: row.key,
      cells: {
        logement: row.label,
        tarif: row.amount,
      },
    })) ?? [];

  return (
    <section className="bg-white py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-400">
            <Euro className="h-4 w-4" aria-hidden="true" />
            Tarifs
          </div>
          <h2 className="mb-5">{title}</h2>
          <div className="mb-8 max-w-5xl text-textLight leading-comfortable">
            {intro ?? <p>{pricingProfile.note}</p>}
          </div>
          <LocalTariffsBlock pricingProfile={pricingProfile} rows={rows} />
        </div>
      </div>
    </section>
  );
}

export function LocalTariffsBlock({
  pricingProfile,
  rows,
}: {
  pricingProfile: PricingProfile;
  rows?: Array<{ key: string; cells: { logement: string; tarif: string } }>;
}) {
  const resolvedRows =
    rows ??
    pricingProfile.multiProperty?.rows.map((row) => ({
      key: row.key,
      cells: {
        logement: row.label,
        tarif: row.amount,
      },
    })) ??
    [];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TariffCard title={pricingProfile.standard.label}>
          <p className="mb-2 text-3xl font-bold text-primary-400">
            {pricingProfile.standard.amount} {pricingProfile.standard.qualifier}
          </p>
          {pricingProfile.standard.description && (
            <p className="text-sm leading-comfortable text-textLight">
              {pricingProfile.standard.description}
            </p>
          )}
        </TariffCard>

        {pricingProfile.partner && (
          <TariffCard title={pricingProfile.partner.label}>
            <p className="mb-2 text-3xl font-bold text-primary-400">
              {pricingProfile.partner.amount} {pricingProfile.partner.qualifier}
            </p>
            {pricingProfile.partner.conditions && (
              <p className="text-sm leading-comfortable text-textLight">
                {pricingProfile.partner.conditions}
              </p>
            )}
          </TariffCard>
        )}
      </div>

      {pricingProfile.multiProperty && (
        <div className="mt-8">
          <h3 className="mb-4 text-2xl font-playfair font-semibold text-gray-900">
            {pricingProfile.multiProperty.title}
          </h3>
          <ResponsiveComparisonTable
            columns={multiPropertyTariffColumns}
            rows={resolvedRows}
            primaryColumnKey="logement"
            caption={pricingProfile.multiProperty.caption}
            tableClassName="w-full table-fixed overflow-hidden rounded-card border border-gray-200 bg-white text-sm shadow-card"
            headerRowClassName="bg-primary-400 text-white"
            headerCellClassName="p-4 font-semibold"
            cellClassName="border-t border-gray-100 p-4 align-top"
            mobileCardClassName="rounded-card border border-gray-200 bg-white p-4 shadow-card"
            mobileTitleClassName="mb-3 text-base font-semibold text-gray-900"
            mobileValueClassName="text-base font-bold text-primary-400 text-right"
          />
        </div>
      )}

      {pricingProfile.travelFees && (
        <p className="mt-5 text-sm font-medium text-gray-900">{pricingProfile.travelFees}</p>
      )}

      <div className="mt-6 flex justify-center">
        <Button href="/demande-classement" variant="primary">
          Demander mon classement
        </Button>
      </div>
    </>
  );
}

function TariffCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card hover={false} className="p-6">
      <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">{title}</h3>
      {children}
    </Card>
  );
}

export function LocalProcedureSection({
  title,
  steps,
}: {
  title: string;
  steps: readonly LocalProcedureStep[];
}) {
  return (
    <section className="bg-primary-100 py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6">{title}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number} hover={false} className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-300 text-lg font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm text-textLight leading-comfortable">{step.description}</p>
              </Card>
            ))}
          </div>
          <Button href="/procedure" variant="secondary" className="mt-8">
            Découvrir la procédure complète
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LocalEtoilysReasonsSection({ title }: { title: string }) {
  return (
    <section className="bg-white py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8">{title}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {etoilysV4Reasons.map((reason) => (
              <ReasonCardItem key={reason.title} reason={reason} />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/demande-classement" variant="primary">
              Demander mon classement
            </Button>
            <Link
              to="/les-avantages-du-classement"
              className="inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
            >
              Voir les avantages du classement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonCardItem({ reason }: { reason: ReasonCard }) {
  const Icon = reason.icon;

  return (
    <Card hover={false} className="p-6">
      <Icon className="mb-4 h-8 w-8 text-primary-300" aria-hidden="true" />
      <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">{reason.title}</h3>
      <p className="text-sm text-textLight leading-comfortable">{reason.description}</p>
    </Card>
  );
}

export function LocalFaqSection({
  title,
  items,
  variant = 'v4',
  sectionClassName,
}: LocalFaqSectionProps) {
  const resolvedSectionClassName =
    sectionClassName ?? (variant === 'v4' ? 'bg-white py-section' : 'bg-primary-100 py-section');

  return (
    <section className={resolvedSectionClassName}>
      <div className="container-adaptive">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center">{title}</h2>
          <Accordion items={items} />
          <div className="mt-8 text-center">
            <Button href="/faq" variant="secondary">
              Consulter toutes les questions fréquentes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LocalFinalCtaSection({
  title,
  paragraphs,
  primaryLabel = 'Déposer ma demande de classement',
  secondaryHref = '/contact',
  secondaryLabel = 'Poser une question',
}: {
  title: string;
  paragraphs: readonly string[];
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-primary-300 to-themePrimary-2 py-section text-white">
      <div className="container-adaptive text-center">
        <h2 className="mb-6 text-white">{title}</h2>
        <div className="mx-auto mb-8 max-w-2xl space-y-5 text-xl leading-comfortable text-white/90">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/demande-classement" variant="white" size="lg">
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="ghost" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
