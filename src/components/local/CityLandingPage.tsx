import Button from '../ui/Button';
import Card from '../ui/Card';
import { getPricingProfile } from '../../content/local/pricing';
import type { CityLandingPageConfig } from '../../content/cityLandingPages';
import { renderLocalMarkdownLinks } from './renderLocalMarkdownLinks';
import {
  LocalCityServiceAreaSection,
  LocalEtoilysReasonsSection,
  LocalFaqSection,
  LocalFinalCtaSection,
  LocalHeroSection,
  LocalProcedureSection,
  LocalTariffsSection,
  LocalWhyClassifySection,
} from './LocalLandingSections';

interface CityLandingPageProps {
  config: CityLandingPageConfig;
}

export default function CityLandingPage({ config }: CityLandingPageProps) {
  const localWarningPlacement = config.localWarningPlacement ?? 'afterServiceArea';
  const hasAfterTaxLocalWarning =
    localWarningPlacement === 'afterTax' && config.localWarning !== undefined;
  const faqItems = config.faq.items.map((item) => ({
    ...item,
    answer: renderLocalMarkdownLinks(item.answer),
  }));
  const pricingProfile = getPricingProfile(config.pricingProfileId);

  return (
    <>
      <LocalHeroSection hero={config.hero} />
      <LocalWhyClassifySection />
      <LocalCityServiceAreaSection serviceArea={config.serviceArea} />
      {localWarningPlacement === 'afterServiceArea' && <LocalWarningSection config={config} />}
      <LocalTariffsSection
        title={`Combien coûte le classement d’un meublé à ${config.city} ?`}
        pricingProfile={pricingProfile}
      />
      <LocalProcedureSection title={config.procedure.title} steps={config.procedure.steps} />
      <LocalEtoilysReasonsSection
        title={`Pourquoi choisir Etoilys pour votre classement à ${config.city} ?`}
      />
      <TaxSection config={config} hasFollowingLocalWarning={hasAfterTaxLocalWarning} />
      {localWarningPlacement === 'afterTax' && <LocalWarningSection config={config} />}
      <LocalFaqSection title={config.faq.title} items={faqItems} />
      <LocalFinalCtaSection title={config.finalCta.title} paragraphs={config.finalCta.paragraphs} />
    </>
  );
}

function TaxSection({
  config,
  hasFollowingLocalWarning = false,
}: {
  config: CityLandingPageConfig;
  hasFollowingLocalWarning?: boolean;
}) {
  const sectionClassName = hasFollowingLocalWarning
    ? 'bg-primary-100 pb-10 pt-section'
    : 'bg-primary-100 py-section';

  return (
    <section className={sectionClassName}>
      <div className="container-adaptive">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-center">
          <div>
            <h2 className="mb-5">{config.tax.title}</h2>
            <div className="space-y-5 text-textLight leading-comfortable">
              {config.tax.paragraphs.map((paragraph) => (
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

          <div>
            <Card hover={false} className="overflow-hidden">
              <div className="bg-primary-400 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
                  {config.tax.exampleLabel}
                </p>
                <p className="mt-2 text-2xl font-playfair font-semibold">
                  {config.tax.exampleTitle}
                </p>
                <p className="mt-1 text-base font-semibold text-white/90">
                  {config.tax.exampleSubtitle}
                </p>
              </div>
              <div className="space-y-4 p-6">
                {config.tax.comparison.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 rounded-card border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-xl font-bold text-primary-400">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-card border border-success-200 bg-success-100 p-5">
                  <p className="text-2xl font-bold text-success-500">
                    {config.tax.savingsHeadline}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {config.tax.savingsDetail}
                  </p>
                </div>
                <p className="text-xs leading-comfortable text-gray-500">{config.tax.sourceNote}</p>
              </div>
            </Card>
            <Button href="/simulateur-taxe-sejour" variant="primary" className="mt-6 lg:hidden">
              Comparer la taxe de séjour de mon logement
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocalWarningSection({ config }: { config: CityLandingPageConfig }) {
  if (!config.localWarning) {
    return null;
  }

  return (
    <section className="bg-primary-100 pb-section pt-0">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <Card hover={false} className="border-warning-200 bg-warning-100 p-6 md:p-8">
            <h2 className="mb-5 text-h3">{config.localWarning.title}</h2>
            <div className="space-y-5 text-textLight leading-comfortable">
              <p>{config.localWarning.intro}</p>
              <ul className="ml-5 list-disc space-y-2">
                {config.localWarning.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{config.localWarning.conclusion}</p>
            </div>
            {config.localWarning.source && (
              <a
                href={config.localWarning.source.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="mt-5 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
              >
                {config.localWarning.source.label}
              </a>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
