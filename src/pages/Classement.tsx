import { Link, useLocation } from 'react-router-dom';
import { Star, Calculator, Users, Globe, ShieldCheck, type LucideIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import PageCta from '../components/ui/PageCta';
import PageHero from '../components/ui/PageHero';
import FeatureCard from '../components/ui/FeatureCard';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { classificationPageContent } from '../content/pages/classificationPageContent';
import { getLocaleFromPath, getLocalizedPath } from '../i18n/routeHelpers';

const CODE_DU_TOURISME_URL = 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025576926';
const ARRETE_CLASSEMENT_URL = 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044413389';
const REFERENTIEL_CLASSEMENT_URL =
  'https://www.classement.atout-france.fr/documents/20142/50558/R%C3%A9f%C3%A9rentiel+de+classement+des+meubl%C3%A9s+de+tourisme+2022+V2.pdf/544f474f-0496-d5e8-a191-13b66d4582cc?version=1.0&download=true';

const advantageIcons = {
  calculator: Calculator,
  users: Users,
  globe: Globe,
} as const satisfies Record<string, LucideIcon>;

export default function Classement() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = classificationPageContent[locale];
  const requirementsPath = getLocalizedPath('prerequis', locale) ?? '/prerequis-au-classement';

  return (
    <>
      <PageHero title={content.hero.title} description={content.hero.description}>
        <dl className="editorial-facts">
          {content.essentials.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="editorial-split">
            <h2 className="editorial-heading text-ink">{content.definition.title}</h2>
            <div className="text-muted leading-comfortable space-y-5">
              <p>
                {content.definition.paragraph1.beforeCodeLink}
                <a
                  href={CODE_DU_TOURISME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-inline-link"
                >
                  {content.definition.paragraph1.codeLinkLabel}
                </a>
                {content.definition.paragraph1.betweenLinks}
                <a
                  href={ARRETE_CLASSEMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-inline-link"
                >
                  {content.definition.paragraph1.orderLinkLabel}
                </a>
                {content.definition.paragraph1.afterOrderLink}
              </p>
              <p>{content.definition.paragraph2}</p>
              <div className="rounded-editorial border border-ink/15 bg-paper p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-ink" />
                  <div>
                    <h3 className="mb-2 text-lg font-roboto font-semibold text-ink">
                      {content.definition.accreditation.title}
                    </h3>
                    <p className="text-sm leading-comfortable text-muted">
                      {content.definition.accreditation.description}
                    </p>
                    <a
                      href={COFRAC_ACCREDITATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-11 text-sm editorial-inline-link"
                    >
                      {content.definition.accreditation.linkLabel}
                    </a>
                  </div>
                </div>
              </div>
              <p>
                {content.definition.paragraph3.beforeReferenceLink}
                <a
                  href={REFERENTIEL_CLASSEMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-inline-link"
                >
                  {content.definition.paragraph3.referenceLinkLabel}
                </a>
                {content.definition.paragraph3.beforeRequirementsLink}
                <Link to={requirementsPath} className="editorial-inline-link">
                  {content.definition.paragraph3.requirementsLinkLabel}
                </Link>
                {content.definition.paragraph3.afterRequirementsLink}
              </p>
              <div className="editorial-notice">
                <p className="text-sm text-muted leading-comfortable">
                  <span className="font-semibold text-ink">{content.definition.note.label}</span>
                  {content.definition.note.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <h2 className="editorial-heading text-ink mb-10">{content.levelsTitle}</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {content.levels.map((level) => (
              <li key={level.title} className="border-t border-ink/25 pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: level.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-copper"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-roboto font-semibold text-ink mb-3">{level.title}</h3>
                <p className="text-muted leading-comfortable">{level.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-ink mb-4">{content.advantages.title}</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-comfortable">
              {content.advantages.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.advantages.items.map((advantage) => (
              <FeatureCard
                key={advantage.title}
                icon={advantageIcons[advantage.icon]}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </div>
          {content.advantages.ctaHref && content.advantages.ctaLabel && (
            <div className="text-center mt-12">
              <Button href={content.advantages.ctaHref} variant="primary">
                {content.advantages.ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </section>

      {content.localIntervention && (
        <section className="editorial-section bg-paper">
          <div className="container-editorial">
            <div className="mx-auto max-w-4xl rounded-editorial border border-ink/15 bg-surface p-8 text-center shadow-sm">
              <h2 className="editorial-heading text-ink mb-4 text-h3">
                {content.localIntervention.title}
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-muted leading-comfortable">
                {content.localIntervention.description}
              </p>
              <Button href={content.localIntervention.ctaHref} variant="primary">
                {content.localIntervention.ctaLabel}
              </Button>
            </div>
          </div>
        </section>
      )}

      <PageCta title={content.finalCta.title} description={content.finalCta.description}>
        <Button
          href={content.finalCta.primaryHref}
          variant="secondary"
          size="lg"
          className="editorial-inverse-button"
        >
          {content.finalCta.primaryLabel}
        </Button>
      </PageCta>
    </>
  );
}
