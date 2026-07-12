import { Link, useLocation } from 'react-router-dom';
import { Star, Calculator, Users, Globe, ShieldCheck, type LucideIcon } from 'lucide-react';
import Button from '../components/ui/Button';
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
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">{content.hero.title}</h1>
            <p className="text-xl text-white/90 leading-comfortable">{content.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.definition.title}</h2>
            <div className="prose prose-lg max-w-none text-textLight leading-comfortable space-y-4">
              <p>
                {content.definition.paragraph1.beforeCodeLink}
                <a
                  href={CODE_DU_TOURISME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  {content.definition.paragraph1.codeLinkLabel}
                </a>
                {content.definition.paragraph1.betweenLinks}
                <a
                  href={ARRETE_CLASSEMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  {content.definition.paragraph1.orderLinkLabel}
                </a>
                {content.definition.paragraph1.afterOrderLink}
              </p>
              <p>{content.definition.paragraph2}</p>
              <div className="rounded-card border border-primary-200 bg-primary-100 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary-300" />
                  <div>
                    <h3 className="mb-2 text-lg font-playfair font-semibold text-gray-900">
                      {content.definition.accreditation.title}
                    </h3>
                    <p className="text-sm leading-comfortable text-textLight">
                      {content.definition.accreditation.description}
                    </p>
                    <a
                      href={COFRAC_ACCREDITATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
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
                  className="text-primary-300 hover:underline"
                >
                  {content.definition.paragraph3.referenceLinkLabel}
                </a>
                {content.definition.paragraph3.beforeRequirementsLink}
                <Link to={requirementsPath} className="text-primary-300 hover:underline">
                  {content.definition.paragraph3.requirementsLinkLabel}
                </Link>
                {content.definition.paragraph3.afterRequirementsLink}
              </p>
            </div>
            <div className="bg-accent-1 border border-accent-2 rounded-card p-4 mt-6">
              <p className="text-sm text-textLight leading-comfortable">
                <span className="font-semibold text-gray-900">{content.definition.note.label}</span>
                {content.definition.note.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <h2 className="mb-12 text-center">{content.levelsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.levels.map((level) => (
              <div
                key={level.title}
                className="bg-white p-8 rounded-card border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: level.stars }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-warning fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  {level.title}
                </h3>
                <p className="text-textLight leading-comfortable">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">{content.advantages.title}</h2>
            <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
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
        <section className="py-section bg-primary-100">
          <div className="container-adaptive">
            <div className="mx-auto max-w-4xl rounded-card border border-primary-200 bg-white p-8 text-center shadow-card">
              <h2 className="mb-4 text-h3">{content.localIntervention.title}</h2>
              <p className="mx-auto mb-6 max-w-2xl text-textLight leading-comfortable">
                {content.localIntervention.description}
              </p>
              <Button href={content.localIntervention.ctaHref} variant="primary">
                {content.localIntervention.ctaLabel}
              </Button>
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
            href={content.finalCta.primaryHref}
            variant="secondary"
            size="lg"
            className="border-white text-white hover:!bg-white/20 hover:text-white"
          >
            {content.finalCta.primaryLabel}
          </Button>
        </div>
      </section>
    </>
  );
}
