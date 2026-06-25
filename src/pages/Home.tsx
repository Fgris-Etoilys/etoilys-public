import { Link, useLocation } from 'react-router-dom';
import { Shield, Zap, Clock, Calculator, Users, Globe, type LucideIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import ArticleCard from '../components/ui/ArticleCard';
import SmartImage from '../components/ui/SmartImage';
import Card from '../components/ui/Card';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
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
  zap: Zap,
  clock: Clock,
  calculator: Calculator,
  users: Users,
  globe: Globe,
} as const satisfies Record<HomeIconKey, LucideIcon>;

function renderFeatureDescription(feature: HomeFeature) {
  if (!feature.link) {
    return feature.description;
  }

  const href = feature.link.href === 'cofrac' ? COFRAC_ACCREDITATION_URL : feature.link.href;

  return (
    <>
      {feature.description}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary-400 underline hover:text-primary-500"
      >
        {feature.link.label}
      </a>
      .
    </>
  );
}

export default function Home() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content: HomePageContent = homePageContent[locale];
  const latestArticles = actualitesArticlesByRecency.slice(0, 2);

  return (
    <>
      <section className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="homeHero"
            alt={content.hero.imageAlt}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-adaptive relative z-10 py-24 text-center">
          <h1 className="mb-6 text-white">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-comfortable">
            {content.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={content.hero.primaryCta.href} variant="primary" size="lg">
              {content.hero.primaryCta.label}
            </Button>
            <Button
              href={content.hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              className="bg-white/10 border-white text-white hover:!bg-white/20 hover:text-white"
            >
              {content.hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">{content.features.title}</h2>
            <p className="text-lg text-themePrimary-1 max-w-2xl mx-auto leading-comfortable">
              {content.features.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.features.items.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={homeFeatureIcons[feature.icon]}
                title={feature.title}
                description={renderFeatureDescription(feature)}
                iconColor="bicolor"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">{content.benefits.title}</h2>
            <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
              {content.benefits.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.benefits.items.map((advantage) => (
              <FeatureCard
                key={advantage.title}
                icon={homeFeatureIcons[advantage.icon]}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button href={content.benefits.cta.href} variant="primary">
              {content.benefits.cta.label}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">{content.procedure.title}</h2>
              <div className="space-y-4 text-textLight leading-comfortable">
                {content.procedure.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8">
                <Button href={content.procedure.cta.href} variant="primary">
                  {content.procedure.cta.label}
                </Button>
              </div>
            </div>
            <div className="relative">
              <SmartImage
                assetKey="homeProcedure"
                alt={content.procedure.imageAlt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-card shadow-card-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {content.news && (
        <section className="py-section bg-accent-1">
          <div className="container-adaptive">
            <div className="text-center mb-16">
              <h2 className="mb-4">{content.news.title}</h2>
              <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
                {content.news.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={article.title}
                  title={article.title}
                  excerpt={article.excerpt}
                  imageKey={article.imageKey}
                  href={article.href}
                  date={article.date}
                />
              ))}
            </div>
            <div className="text-center">
              <Button href={content.news.cta.href} variant="secondary">
                {content.news.cta.label}
              </Button>
            </div>
          </div>
        </section>
      )}

      {content.serviceLinks && (
        <section className="py-section bg-accent-1">
          <div className="container-adaptive">
            <div className="text-center mb-16">
              <h2 className="mb-4">{content.serviceLinks.title}</h2>
              <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
                {content.serviceLinks.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.serviceLinks.links.map((link) => (
                <Card key={link.href} hover={false} className="h-full bg-white">
                  <Link
                    to={link.href}
                    className="block h-full p-6 transition-colors duration-200 hover:bg-primary-100/50"
                  >
                    <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    <p className="text-sm leading-comfortable text-textLight">{link.description}</p>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">{content.finalCta.title}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            {content.finalCta.description}
          </p>
          <Button
            href={content.finalCta.cta.href}
            variant="secondary"
            size="lg"
            className="border-white text-white hover:!bg-white/20 hover:text-white"
          >
            {content.finalCta.cta.label}
          </Button>
        </div>
      </section>
    </>
  );
}
