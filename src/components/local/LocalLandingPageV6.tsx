import { useState } from 'react';
import { ArrowUpRight, Calculator, Check, MapPin, Receipt, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ClassificationHeroNote from '../ui/ClassificationHeroNote';
import EditorialHeroMedia from '../ui/EditorialHeroMedia';
import FeatureCard from '../ui/FeatureCard';
import HeroReassurance from '../ui/HeroReassurance';
import PageCta from '../ui/PageCta';
import PageHero from '../ui/PageHero';
import ProofStrip from '../ui/ProofStrip';
import SmartImage from '../ui/SmartImage';
import Timeline from '../ui/Timeline';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import { getPricingProfile } from '../../content/local/pricing';
import type {
  DepartmentSector,
  LocalLandingPageV6Config,
  LocalV6Action,
  LocalV6CityServiceArea,
  LocalV6DepartmentServiceArea,
  LocalV6EditorialNotice,
  LocalV6Hero,
  LocalV6TaxModule,
} from '../../content/local/types';
import DepartmentPricingSection, { LocalPricingProfileSummary } from './DepartmentPricingSection';

const classificationBenefits = [
  {
    icon: Calculator,
    title: 'Une fiscalité micro-BIC plus favorable',
    description:
      'Profitez d’un abattement fiscal plus élevé et d’un plafond de recettes supérieur à ceux d’un meublé non classé.',
    linkHref: '/simulateur-fiscal-classement',
    linkLabel: 'Sous conditions : estimer mon avantage',
  },
  {
    icon: Receipt,
    title: 'Une taxe de séjour maîtrisée',
    description:
      'Un tarif fixé selon vos étoiles, indépendant du prix de la nuitée. Une taxe qui peut être moins élevée pour vos voyageurs, selon le barème local.',
    linkHref: '/simulateur-taxe-sejour',
    linkLabel: 'Comparer pour ma location',
  },
  {
    icon: Star,
    title: 'Un repère officiel de qualité',
    description: 'Des étoiles reconnues pour valoriser votre logement et rassurer vos voyageurs.',
    linkHref: '/les-avantages-du-classement',
    linkLabel: 'Découvrir les avantages du classement',
  },
] as const;

const expertiseReasons = [
  {
    icon: Star,
    title: '100 % spécialisés dans le classement des meublés de tourisme',
    description:
      'Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos inspecteurs connaissent en profondeur la réglementation, la grille officielle et les points qui font réellement la différence pour atteindre la catégorie visée.',
  },
  {
    icon: Calculator,
    title: 'Des outils pour préparer votre visite',
    description:
      'Notre simulateur vous aide à estimer la catégorie visée et à repérer les points à préparer.',
    link: {
      href: '/simulateur',
      label: 'Estimer mon classement',
    },
  },
  {
    icon: ShieldCheck,
    title: 'Un organisme accrédité Cofrac',
    description:
      'Etoilys réalise les visites officielles de classement dans le cadre de son accréditation Cofrac Inspection n° 3-2394.',
    link: {
      href: COFRAC_ACCREDITATION_URL,
      label: 'Consulter notre accréditation',
    },
  },
] as const;

const COMMON_LOCAL_V6_FAQ_ITEMS = [
  {
    question: 'Comment me préparer à une visite de classement ?',
    answer: (
      <>
        Quelques vérifications avant le rendez-vous permettent de préparer sereinement la visite :
        équipements, informations utiles et principaux critères de la grille.{' '}
        <Link to="/actualites/preparer-visite-classement-meuble-tourisme">
          Voir notre guide pour préparer la visite de classement
        </Link>
      </>
    ),
  },
  {
    question: 'Que faire une fois le classement obtenu ?',
    answer: (
      <>
        Une fois votre classement obtenu, quelques démarches restent à effectuer, notamment pour
        l’affichage, la déclaration, la taxe de séjour et vos annonces.{' '}
        <Link to="/actualites/que-faire-apres-classement-meuble-tourisme">
          Voir les démarches à effectuer après le classement
        </Link>
      </>
    ),
  },
] as const;

export default function LocalLandingPageV6({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <div className="local-v6-landing">
      <LocalV6Hero config={config} />
      <ProofStrip items={config.proofItems} />
      <LocalV6BenefitsSection />
      {config.scope === 'department' ? (
        <LocalV6DepartmentServiceAreaSection serviceArea={config.serviceArea} />
      ) : (
        <LocalV6CityServiceAreaSection serviceArea={config.serviceArea} />
      )}
      <LocalV6PricingSection config={config} />
      <LocalV6ProcedureSection config={config} />
      <LocalV6ExpertiseSection config={config} />
      {config.localModule && <LocalV6TaxModuleSection module={config.localModule} />}
      {config.localNotice && <LocalV6EditorialNoticeSection notice={config.localNotice} />}
      <LocalV6FaqSection config={config} />
      <LocalV6FinalCta config={config} />
    </div>
  );
}

function LocalV6Hero({ config }: { config: LocalLandingPageV6Config }) {
  const { hero } = config;

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      eyebrowMarked
      title={<HighlightedTitle title={hero.title} highlightedText={hero.highlightedTitleText} />}
      description={hero.description}
      media={<LocalV6HeroMedia hero={hero} />}
    >
      <div className="flex flex-col items-start gap-0">
        <LocalV6ActionLink action={hero.primaryAction} />
        {hero.secondaryAction && <LocalV6ActionLink action={hero.secondaryAction} />}
      </div>
      <HeroReassurance items={hero.reassuranceItems} />
    </PageHero>
  );
}

function LocalV6HeroMedia({ hero }: { hero: LocalV6Hero }) {
  return (
    <div className="local-v6-hero-media">
      <EditorialHeroMedia
        assetKey={hero.image.assetKey}
        alt={hero.image.alt}
        priority
        {...(hero.image.sizes ? { sizes: hero.image.sizes } : {})}
        imageClassName={hero.image.className}
        caption={hero.image.caption}
        note={<ClassificationHeroNote {...hero.image.note} />}
        index={hero.image.index}
      />
      {hero.image.credit && (
        <p className="local-v6-hero-credit">
          Photo :{' '}
          <a
            href={hero.image.credit.sourceHref}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="editorial-inline-link"
          >
            {hero.image.credit.sourceLabel}
          </a>{' '}
          -{' '}
          <a
            href={hero.image.credit.licenseHref}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="editorial-inline-link"
          >
            {hero.image.credit.licenseLabel}
          </a>
        </p>
      )}
    </div>
  );
}

function HighlightedTitle({
  title,
  highlightedText,
}: {
  title: string;
  highlightedText?: string | undefined;
}) {
  if (!highlightedText || !title.endsWith(highlightedText)) {
    return <>{title}</>;
  }

  return (
    <>
      {title.slice(0, -highlightedText.length)}
      <span className="text-copper">{highlightedText}</span>
    </>
  );
}

function LocalV6ActionLink({ action }: { action: LocalV6Action }) {
  if (action.href.startsWith('#')) {
    return (
      <a href={action.href} className={action.className ?? 'editorial-link ui-focus'}>
        {action.label}
      </a>
    );
  }

  return (
    <Button
      href={action.href}
      size="lg"
      variant={action.variant}
      className={`editorial-hero-cta ${action.className ?? ''}`}
    >
      {action.label}
    </Button>
  );
}

function LocalV6BenefitsSection() {
  return (
    <section
      id="le-classement"
      className="editorial-section bg-paper"
      aria-labelledby="local-v6-benefits-title"
    >
      <div className="container-editorial">
        <div className="local-v6-section-intro">
          <p className="editorial-eyebrow">LE CLASSEMENT, POUR VOUS</p>
          <h2 className="editorial-heading" id="local-v6-benefits-title">
            Pourquoi faire classer votre meublé de tourisme ?
          </h2>
        </div>
        <div className="editorial-feature-grid">
          {classificationBenefits.map((benefit) => (
            <FeatureCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LocalV6DepartmentServiceAreaSection({
  serviceArea,
}: {
  serviceArea: LocalV6DepartmentServiceArea;
}) {
  return (
    <section
      id="communes"
      className="local-v6-service-area"
      aria-labelledby="local-v6-service-area-title"
    >
      <div className="container-editorial">
        <LocalV6SectionEyebrow icon={MapPin}>Intervention locale</LocalV6SectionEyebrow>
        <h2 className="editorial-heading" id="local-v6-service-area-title">
          {serviceArea.title}
        </h2>
        <p>{serviceArea.intro}</p>
        <LocalV6DepartmentSectorList
          sectors={serviceArea.sectors}
          {...(serviceArea.communeLinks ? { communeLinks: serviceArea.communeLinks } : {})}
        />
        {serviceArea.parentLink && (
          <Link to={serviceArea.parentLink.href} className="editorial-link ui-focus">
            {serviceArea.parentLink.label} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}

function LocalV6DepartmentSectorList({
  sectors,
  communeLinks,
}: {
  sectors: readonly DepartmentSector[];
  communeLinks?: Record<string, { href: string; label?: string }>;
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
    <div className="local-v6-sector-list">
      {sectors.map((sector) => {
        const visibleCommunes = sector.visibleCommunes ?? sector.communes ?? [];
        const collapsedCommunes = sector.collapsedCommunes ?? [];
        const isExpanded = expandedSectors.has(sector.name);
        const collapsedListId = `department-sector-${sector.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-collapsed`;

        return (
          <div key={sector.name} className="local-v6-sector-row">
            <h3>{sector.name}</h3>
            <p>
              {visibleCommunes.map((commune, index) => (
                <LocalV6CommuneName
                  key={commune}
                  commune={commune}
                  link={communeLinks?.[commune]}
                  prefix={index > 0 ? ' · ' : undefined}
                />
              ))}
              {collapsedCommunes.length > 0 && (
                <span id={collapsedListId} className={isExpanded ? '' : 'hidden'}>
                  {collapsedCommunes.map((commune) => (
                    <LocalV6CommuneName
                      key={commune}
                      commune={commune}
                      link={communeLinks?.[commune]}
                      prefix=" · "
                    />
                  ))}
                </span>
              )}
            </p>
            {collapsedCommunes.length > 0 && (
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={collapsedListId}
                onClick={() => toggleSector(sector.name)}
              >
                {isExpanded
                  ? `Masquer les ${collapsedCommunes.length} communes`
                  : `+${collapsedCommunes.length} communes`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LocalV6CityServiceAreaSection({ serviceArea }: { serviceArea: LocalV6CityServiceArea }) {
  return (
    <section className="local-v6-service-area" aria-labelledby="local-v6-service-area-title">
      <div className="container-editorial">
        <LocalV6SectionEyebrow icon={MapPin}>Intervention locale</LocalV6SectionEyebrow>
        <h2 className="editorial-heading" id="local-v6-service-area-title">
          {serviceArea.title}
        </h2>
        <p>{serviceArea.intro}</p>
        <ul className="local-v6-commune-list">
          {serviceArea.communes.map((commune) => (
            <li key={commune}>{commune}</li>
          ))}
        </ul>
        <Link to={serviceArea.parentLink.href} className="editorial-link ui-focus">
          {serviceArea.parentLink.label} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function LocalV6CommuneName({
  commune,
  link,
  prefix,
}: {
  commune: string;
  link?: { href: string; label?: string } | undefined;
  prefix?: string | undefined;
}) {
  return (
    <>
      {prefix}
      {link ? (
        <Link to={link.href} className="editorial-inline-link">
          {link.label ?? commune}
        </Link>
      ) : (
        <span>{commune}</span>
      )}
    </>
  );
}

function LocalV6PricingSection({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <section
      id="tarifs"
      className="editorial-section bg-paper"
      aria-labelledby="local-v6-pricing-title"
    >
      <div className="container-editorial local-v6-tariff-section">
        <div className="local-v6-tariff-copy">
          <p className="editorial-eyebrow">VOTRE LOGEMENT, VOTRE TARIF</p>
          <h2 className="editorial-heading" id="local-v6-pricing-title">
            {config.pricing.title}
          </h2>
          {config.pricing.intro && <p>{config.pricing.intro}</p>}
          <ul className="local-v6-checks">
            {config.pricing.checklist.map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link to={config.pricing.procedureLink.href} className="editorial-link ui-focus">
            {config.pricing.procedureLink.label} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {config.scope === 'department' ? (
          <DepartmentPricingSection config={config.pricing.picker} presentation="panel" />
        ) : (
          <div className="local-v6-pricing">
            <LocalPricingProfileSummary
              pricingProfile={getPricingProfile(config.pricing.pricingProfileId)}
              localityLabel={config.city}
              presentation="direct"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function LocalV6ProcedureSection({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <section
      id="etapes"
      className="editorial-process-section bg-surface-warm"
      aria-labelledby="local-v6-process-title"
    >
      <div className="container-editorial">
        <div className="editorial-process-heading">
          <div>
            <p className="editorial-eyebrow">{config.procedure.eyebrow}</p>
            <h2 className="editorial-heading" id="local-v6-process-title">
              {config.procedure.title}
            </h2>
          </div>
          {config.procedure.link.variant ? (
            <Button
              href={config.procedure.link.href}
              variant={config.procedure.link.variant}
              className={`local-v6-procedure-link ${config.procedure.link.className ?? ''}`}
            >
              {config.procedure.link.label} <ArrowUpRight size={17} aria-hidden="true" />
            </Button>
          ) : (
            <Link to={config.procedure.link.href} className="editorial-link ui-focus">
              {config.procedure.link.label} <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          )}
        </div>
        <Timeline layout="horizontal" steps={config.procedure.steps} />
        <p className="local-v6-process-note">{config.procedure.note}</p>
      </div>
    </section>
  );
}

function LocalV6ExpertiseSection({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <section
      className="editorial-expertise-section bg-surface-sage"
      aria-labelledby="local-v6-expertise-title"
    >
      <div className="container-editorial editorial-media-split">
        <figure className="editorial-expertise-photo local-v6-stone-photo">
          <SmartImage
            assetKey={config.expertise.image.assetKey}
            alt={config.expertise.image.alt}
            sizes={config.expertise.image.sizes}
            className={config.expertise.image.className}
          />
          {(config.expertise.image.caption || config.expertise.image.credit) && (
            <figcaption>
              {config.expertise.image.caption}
              {config.expertise.image.credit && (
                <span className="local-v6-stone-credit">
                  Photo :{' '}
                  <a
                    href={config.expertise.image.credit.sourceHref}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {config.expertise.image.credit.sourceLabel}
                  </a>{' '}
                  -{' '}
                  <a
                    href={config.expertise.image.credit.licenseHref}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {config.expertise.image.credit.licenseLabel}
                  </a>
                </span>
              )}
            </figcaption>
          )}
        </figure>
        <div>
          <h2 className="editorial-heading" id="local-v6-expertise-title">
            {config.expertise.title}
          </h2>
          <ul className="editorial-expertise-arguments">
            {expertiseReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <li key={reason.title}>
                  <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                    {'link' in reason &&
                      (reason.link.href.startsWith('/') ? (
                        <Link to={reason.link.href} className="editorial-link ui-focus">
                          {reason.link.label} <ArrowUpRight size={17} aria-hidden="true" />
                        </Link>
                      ) : (
                        <a
                          href={reason.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-link ui-focus"
                        >
                          {reason.link.label} <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LocalV6TaxModuleSection({ module }: { module: LocalV6TaxModule }) {
  return (
    <section
      className="editorial-section local-v6-tax-section bg-surface-neutral"
      aria-labelledby="local-v6-tax-title"
    >
      <div className="container-editorial local-v6-tax-grid">
        <div className="local-v6-tax-copy">
          <h2 className="editorial-heading" id="local-v6-tax-title">
            <HighlightedTitle title={module.title} highlightedText={module.highlightedTitleText} />
          </h2>
          <div className="space-y-5 text-muted">
            {module.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Button
            href="/simulateur-taxe-sejour"
            variant="primary"
            className="mt-6 hidden lg:inline-flex"
          >
            Comparer la taxe de séjour de mon logement
          </Button>
        </div>
        <Card hover={false} className="overflow-hidden">
          <div className="bg-ink p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
              {module.exampleLabel}
            </p>
            <p className="mt-2 text-2xl font-playfair font-semibold">{module.exampleTitle}</p>
            <p className="mt-1 text-base font-semibold text-white/90">{module.exampleSubtitle}</p>
          </div>
          <div className="space-y-4 p-6">
            {module.comparison.map((item) => (
              <div
                key={item.key}
                className="flex flex-col gap-1 rounded-editorial border border-ink/10 bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="font-medium text-ink">{item.label}</p>
                <p className="text-xl font-bold text-ink">{item.value}</p>
              </div>
            ))}
            <div className="editorial-positive">
              <p className="text-2xl font-bold text-ink">{module.savingsHeadline}</p>
              <p className="mt-2 text-sm font-medium text-ink">{module.savingsDetail}</p>
            </div>
            <p className="text-xs leading-comfortable text-muted">{module.sourceNote}</p>
          </div>
        </Card>
        <Button href="/simulateur-taxe-sejour" variant="primary" className="lg:hidden">
          Comparer la taxe de séjour de mon logement
        </Button>
      </div>
    </section>
  );
}

function LocalV6EditorialNoticeSection({ notice }: { notice: LocalV6EditorialNotice }) {
  return (
    <section
      className="editorial-section local-v6-notice-section bg-surface-neutral"
      aria-labelledby="local-v6-notice-title"
    >
      <div className="container-editorial">
        <div className="editorial-notice local-v6-notice">
          <h2 className="editorial-heading" id="local-v6-notice-title">
            {notice.title}
          </h2>
          <div className="space-y-5 text-muted">
            {notice.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {notice.items && (
              <ul>
                {notice.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {notice.conclusion && <p>{notice.conclusion}</p>}
          </div>
          {notice.source && (
            <a
              href={notice.source.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="editorial-link ui-focus"
            >
              {notice.source.label} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function LocalV6FaqSection({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <section className="editorial-section bg-paper" aria-labelledby="local-v6-faq-title">
      <div className="container-editorial local-v6-faq">
        <div>
          <p className="editorial-eyebrow">{config.faq.eyebrow}</p>
          <h2 className="editorial-heading" id="local-v6-faq-title">
            {config.faq.title}
          </h2>
          <p>{config.faq.intro}</p>
          <Link to={config.faq.contactLink.href} className="editorial-link ui-focus">
            {config.faq.contactLink.label} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div>
          <Accordion
            items={[...config.faq.items, ...COMMON_LOCAL_V6_FAQ_ITEMS]}
            density="compact"
          />
        </div>
      </div>
    </section>
  );
}

function LocalV6FinalCta({ config }: { config: LocalLandingPageV6Config }) {
  return (
    <PageCta
      density="compact"
      eyebrow={config.finalCta.eyebrow}
      title={config.finalCta.title}
      description={config.finalCta.description}
    >
      <LocalV6ActionLink action={config.finalCta.primaryAction} />
      <span className="text-center text-[11px]">{config.finalCta.hint}</span>
    </PageCta>
  );
}

function LocalV6SectionEyebrow({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: string;
}) {
  return (
    <p className="local-v6-section-eyebrow">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </p>
  );
}
