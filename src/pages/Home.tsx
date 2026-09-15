import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Star,
  Clock,
  Calculator,
  Users,
  Globe,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import PageCta from '../components/ui/PageCta';
import PageHero from '../components/ui/PageHero';
import EditorialHeroMedia from '../components/ui/EditorialHeroMedia';
import ClassificationHeroNote from '../components/ui/ClassificationHeroNote';
import HeroReassurance from '../components/ui/HeroReassurance';
import ProofStrip from '../components/ui/ProofStrip';
import FeatureCard from '../components/ui/FeatureCard';
import ArticleCard from '../components/ui/ArticleCard';
import SmartImage from '../components/ui/SmartImage';
import Timeline from '../components/ui/Timeline';
import { getSeoRouteConfig } from '../content/seoRoutes';
import { actualitesArticlesByRecency } from '../content/actualitesArticles';
import {
  homePageContent,
  type HomeFeature,
  type HomeIconKey,
  type HomePageContent,
} from '../content/pages/homePageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

const homeFeatureIcons = {
  shield: Shield,
  star: Star,
  clock: Clock,
  calculator: Calculator,
  users: Users,
  globe: Globe,
} as const satisfies Record<HomeIconKey, LucideIcon>;

function renderFeatureLink(link: NonNullable<HomeFeature['link']>) {
  const className = 'editorial-link ui-focus inline-flex items-center gap-2 text-sm';
  const label = (
    <>
      {link.label}
      <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
    </>
  );

  return link.href.startsWith('/') ? (
    <Link to={link.href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}

export default function Home() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content: HomePageContent = homePageContent[locale];
  const latestArticles = actualitesArticlesByRecency.slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        eyebrowMarked
        title={
          <>
            {content.hero.title.lead}{' '}
            <span className="text-copper">{content.hero.title.accent}</span>
          </>
        }
        description={content.hero.description}
        media={
          <EditorialHeroMedia
            assetKey="homeHero"
            alt={content.hero.imageAlt}
            sizes={getSeoRouteConfig(location.pathname).lcpImageSizes ?? '100vw'}
            priority
            note={
              <ClassificationHeroNote
                title={content.hero.photoNote.title}
                description={content.hero.photoNote.description}
              />
            }
          />
        }
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            href={content.hero.primaryCta.href}
            variant="primary"
            size="lg"
            className="editorial-hero-cta"
          >
            {content.hero.primaryCta.label}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Button>
          <Button
            href={content.hero.secondaryCta.href}
            variant="secondary"
            size="lg"
            className="!border-0 !bg-transparent !px-0 !py-2 !text-base underline decoration-ink/30 underline-offset-4"
          >
            {content.hero.secondaryCta.label}
          </Button>
        </div>
        <HeroReassurance items={content.hero.reassurance} />
      </PageHero>

      <ProofStrip
        items={content.proofStrip.map((proof) => ({
          icon: homeFeatureIcons[proof.icon],
          title: proof.title,
          description: proof.description,
          ...(proof.link ? { link: proof.link } : {}),
        }))}
      />

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <div className="mb-10 max-w-3xl">
            <p className="editorial-eyebrow mb-4">{content.benefits.eyebrow}</p>
            <h2 className="editorial-heading text-ink mb-4">{content.benefits.title}</h2>
            <p className="text-lg text-muted max-w-2xl leading-comfortable">
              {content.benefits.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.benefits.items.map((advantage) => (
              <FeatureCard
                key={advantage.title}
                icon={homeFeatureIcons[advantage.icon]}
                title={advantage.title}
                description={advantage.description}
                linkHref={advantage.link?.href}
                linkLabel={advantage.link?.label}
              />
            ))}
          </div>
          <div className="mt-8">
            <Button href={content.benefits.cta.href} variant="primary">
              {content.benefits.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-surface">
        <div className="container-editorial editorial-media-split">
          <div className="editorial-expertise-photo">
            <SmartImage
              assetKey="articleDpeMeublesTourisme"
              alt={content.features.imageAlt}
              sizes="(min-width: 1336px) 490px, (min-width: 900px) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="editorial-eyebrow mb-4">{content.features.eyebrow}</p>
            <h2 className="editorial-heading text-ink mb-5">{content.features.title}</h2>
            <p className="mb-8 text-muted leading-comfortable">{content.features.description}</p>
            <ul className="space-y-7">
              {content.features.items.map((feature) => {
                const Icon = homeFeatureIcons[feature.icon];
                return (
                  <li key={feature.title} className="flex gap-4">
                    <Icon
                      size={24}
                      strokeWidth={1.4}
                      className="mt-1 shrink-0 text-copper"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="mb-2 font-roboto text-lg font-semibold leading-snug text-ink">
                        {feature.title}
                      </h3>
                      <p className="text-muted leading-comfortable">{feature.description}</p>
                      {feature.link && (
                        <div className="mt-3">{renderFeatureLink(feature.link)}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <div className="mb-10 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="editorial-eyebrow mb-4">{content.procedure.eyebrow}</p>
              <h2 className="editorial-heading text-ink">{content.procedure.title}</h2>
            </div>
            <Button href={content.procedure.cta.href} variant="primary" className="shrink-0">
              {content.procedure.cta.label}
            </Button>
          </div>
          <Timeline
            layout="horizontal"
            steps={content.procedure.steps.map((step, index) => ({ ...step, number: index + 1 }))}
          />
        </div>
      </section>

      {content.news && (
        <section className="editorial-section bg-surface">
          <div className="container-editorial">
            <div className="editorial-split mb-10">
              <h2 className="editorial-heading text-ink mb-4">{content.news.title}</h2>
              <p className="text-lg text-muted max-w-2xl leading-comfortable">
                {content.news.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={article.title}
                  title={article.title}
                  excerpt={article.excerpt}
                  imageKey={article.imageKey}
                  imageSizes="(min-width: 1336px) 604px, (min-width: 768px) 50vw, 100vw"
                  href={article.href}
                  date={article.date}
                />
              ))}
            </div>
            <div>
              <Button href={content.news.cta.href} variant="secondary">
                {content.news.cta.label}
              </Button>
            </div>
          </div>
        </section>
      )}

      {content.serviceLinks && (
        <section className="editorial-section bg-surface">
          <div className="container-editorial">
            <div className="max-w-3xl mb-10">
              <h2 className="editorial-heading text-ink mb-4">{content.serviceLinks.title}</h2>
              <p className="text-lg text-muted max-w-2xl leading-comfortable">
                {content.serviceLinks.description}
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {content.serviceLinks.links.map((link) => (
                <li key={link.href} className="border-t border-ink/20">
                  <Link
                    to={link.href}
                    className="ui-focus group block h-full py-6 text-ink hover:text-ink"
                  >
                    <h3 className="mb-3 flex items-start justify-between gap-4 text-lg font-roboto font-semibold text-ink group-hover:underline underline-offset-4">
                      {link.title}
                      <ArrowUpRight
                        size={18}
                        className="mt-1 shrink-0 text-copper"
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="text-sm leading-comfortable text-muted">{link.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <PageCta title={content.finalCta.title} description={content.finalCta.description}>
        <Button
          href={content.finalCta.cta.href}
          variant="secondary"
          size="lg"
          className="editorial-inverse-button"
        >
          {content.finalCta.cta.label}
        </Button>
      </PageCta>
    </>
  );
}
