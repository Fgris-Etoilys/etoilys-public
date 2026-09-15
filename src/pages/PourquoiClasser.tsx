import { useLocation } from 'react-router-dom';
import { Award, Calculator, CheckCircle, Globe, Percent, PiggyBank, Ticket } from 'lucide-react';
import Button from '../components/ui/Button';
import PageCta from '../components/ui/PageCta';
import PageHero from '../components/ui/PageHero';
import Accordion from '../components/ui/Accordion';
import FeatureCard from '../components/ui/FeatureCard';
import SectionNav from '../components/ui/SectionNav';
import ResponsiveComparisonTable from '../components/ui/ResponsiveComparisonTable';
import Card from '../components/ui/Card';
import SmartImage from '../components/ui/SmartImage';
import {
  classificationBenefitsPageContent,
  type ClassificationBenefitsPageContent,
} from '../content/pages/classificationBenefitsPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

const benefitIcons = {
  award: Award,
  calculator: Calculator,
  globe: Globe,
  percent: Percent,
  piggyBank: PiggyBank,
  ticket: Ticket,
};

const panonceaux = [
  {
    src: '/panonceaux/panonceau-1-etoile.png',
    label: {
      fr: '1 étoile',
      en: '1 star',
      nl: '1 ster',
    },
  },
  {
    src: '/panonceaux/panonceau-2-etoiles.png',
    label: {
      fr: '2 étoiles',
      en: '2 stars',
      nl: '2 sterren',
    },
  },
  {
    src: '/panonceaux/panonceau-3-etoiles.png',
    label: {
      fr: '3 étoiles',
      en: '3 stars',
      nl: '3 sterren',
    },
  },
  {
    src: '/panonceaux/panonceau-4-etoiles.png',
    label: {
      fr: '4 étoiles',
      en: '4 stars',
      nl: '4 sterren',
    },
  },
  {
    src: '/panonceaux/panonceau-5-etoiles.png',
    label: {
      fr: '5 étoiles',
      en: '5 stars',
      nl: '5 sterren',
    },
  },
] as const;

function renderTourismDescription(description: string) {
  const linkLabel = 'DATAtourisme';

  if (!description.includes(linkLabel)) {
    return description;
  }

  const [beforeLink, afterLink] = description.split(linkLabel);

  return (
    <>
      {beforeLink}
      <a
        href="https://www.datatourisme.fr/"
        target="_blank"
        rel="noopener noreferrer"
        className="editorial-inline-link"
      >
        {linkLabel}
      </a>
      {afterLink}
    </>
  );
}

export default function PourquoiClasser() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content: ClassificationBenefitsPageContent = classificationBenefitsPageContent[locale];

  return (
    <>
      <PageHero title={content.hero.title} description={content.hero.description}>
        <SectionNav
          label={content.hero.title}
          items={[
            { id: 'fiscalite', label: content.navigation[0] },
            { id: 'taxe-sejour', label: content.navigation[1] },
            { id: 'reconnaissance', label: content.navigation[2] },
          ]}
        />
      </PageHero>

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <h2 className="editorial-heading text-ink max-w-3xl mb-8 sm:mb-12">
            {content.mainBenefits.title}
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {content.mainBenefits.items
              .filter((benefit) => benefit.linkHref)
              .map((benefit) => (
                <FeatureCard
                  key={benefit.title}
                  icon={benefitIcons[benefit.icon]}
                  title={benefit.title}
                  description={benefit.description}
                  linkHref={benefit.linkHref}
                  linkLabel={benefit.linkLabel}
                />
              ))}
          </div>
          <div className="mt-10 sm:mt-12 max-w-4xl">
            <Accordion
              items={content.mainBenefits.items
                .filter((benefit) => !benefit.linkHref)
                .map((benefit) => ({
                  question: benefit.title,
                  answer: benefit.description,
                }))}
            />
          </div>
        </div>
      </section>

      <section id="fiscalite" className="editorial-section editorial-anchor bg-paper">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <h2 className="editorial-heading text-ink mb-6">{content.fiscalComparison.title}</h2>
            <p className="text-muted mb-10 leading-comfortable">
              {content.fiscalComparison.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.fiscalComparison.items.map((item) => (
                <Card
                  key={item.title}
                  hover={false}
                  className={
                    item.color === 'bg-success-100' ? '!bg-ink/5 !border-ink/25' : '!bg-surface'
                  }
                >
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-roboto font-semibold text-ink mb-4">
                      {item.title}
                    </h3>
                    <div className="text-5xl font-playfair text-ink mb-4">{item.allowance}</div>
                    <p className="text-sm text-muted">{item.allowanceLabel}</p>
                    <div className="mt-6 pt-6 border-t border-ink/20">
                      <p className="text-sm text-muted leading-comfortable">{item.example}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 editorial-positive text-center">
              <div className="text-4xl font-playfair text-ink mb-2">
                {content.fiscalComparison.result.value}
              </div>
              <p className="text-sm font-semibold text-muted mb-3">
                {content.fiscalComparison.result.label}
              </p>
              <p className="text-sm text-muted">{content.fiscalComparison.result.description}</p>
            </div>
            <div className="mt-6 text-sm text-muted leading-relaxed">
              <p className="mb-2">{content.fiscalComparison.footnote.intro}</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                {content.fiscalComparison.footnote.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                {content.fiscalComparison.footnote.sourcePrefix}{' '}
                <a
                  href={content.fiscalComparison.footnote.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-inline-link"
                >
                  {content.fiscalComparison.footnote.sourceLabel}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="taxe-sejour" className="editorial-section editorial-anchor bg-surface">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <h2 className="editorial-heading text-ink mb-6">{content.touristTax.title}</h2>
            <p className="text-muted leading-comfortable mb-10">{content.touristTax.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-paper rounded-editorial p-6 flex flex-col">
                <h3 className="font-semibold text-ink mb-4 text-center">
                  {content.touristTax.unclassified.title}
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-center text-3xl font-bold text-copper mb-1">
                    {content.touristTax.unclassified.value}
                  </p>
                  <p className="text-center text-sm text-muted">
                    {content.touristTax.unclassified.label}
                  </p>
                  <p className="text-center text-sm text-muted mt-3">
                    {content.touristTax.unclassified.note}
                  </p>
                </div>
              </div>
              <div className="bg-ink/5 rounded-editorial p-6">
                <h3 className="font-semibold text-ink mb-4 text-center">
                  {content.touristTax.classified.title}
                </h3>
                <p className="text-center text-sm font-medium text-muted mb-3">
                  {content.touristTax.classified.intro}
                </p>
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="text-center py-1 text-muted font-medium">
                        {content.touristTax.classified.headerCategory}
                      </th>
                      <th className="text-center py-1 text-muted font-medium">
                        {content.touristTax.classified.headerRange}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    {content.touristTax.classified.ranges.map((range, index) => (
                      <tr
                        key={range.label}
                        className={
                          index === content.touristTax.classified.ranges.length - 1
                            ? undefined
                            : 'border-b border-ink/15'
                        }
                      >
                        <td className="py-1 text-center">{range.label}</td>
                        <td className="text-center">{range.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-editorial sm:bg-paper sm:p-6 mb-6">
              <p id="tourist-tax-example-title" className="font-semibold text-ink mb-4">
                {content.touristTax.example.title}
              </p>
              <p className="text-sm text-muted mb-4">{content.touristTax.example.note}</p>
              <ResponsiveComparisonTable
                appearance="editorial"
                caption={content.touristTax.example.title}
                primaryColumnKey="label"
                columns={[
                  {
                    key: 'label',
                    label: content.touristTax.example.headers[0],
                    widthClassName: 'w-1/3',
                  },
                  {
                    key: 'unclassified',
                    label: content.touristTax.example.headers[1],
                    widthClassName: 'w-1/3',
                  },
                  {
                    key: 'classified',
                    label: content.touristTax.example.headers[2],
                    widthClassName: 'w-1/3',
                    cellClassName: 'bg-ink/5 font-medium',
                  },
                ]}
                rows={content.touristTax.example.rows.map((row) => ({
                  key: row.label,
                  cells: {
                    label: row.label,
                    unclassified: row.unclassified,
                    classified: row.classified,
                  },
                }))}
              />
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-ink">
                  {content.touristTax.example.totalValue}
                </span>
                <span className="text-sm text-muted ml-2">
                  {content.touristTax.example.totalLabel}
                </span>
              </div>
            </div>

            {content.touristTax.cta && (
              <div className="mt-6 text-center">
                <Button href={content.touristTax.cta.href} variant="primary">
                  {content.touristTax.cta.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <h2 id="social-regime-title" className="editorial-heading text-ink mb-6">
              {content.socialRegime.title}
            </h2>
            <p className="text-muted leading-comfortable mb-10">
              {content.socialRegime.description}
            </p>
            <ResponsiveComparisonTable
              appearance="editorial"
              className="mb-4"
              caption={content.socialRegime.title}
              primaryColumnKey="situation"
              columns={[
                {
                  key: 'situation',
                  label: content.socialRegime.headers[0],
                  widthClassName: 'w-1/4',
                },
                {
                  key: 'classified',
                  label: content.socialRegime.headers[1],
                  widthClassName: 'w-1/4',
                  cellClassName: 'bg-ink/5',
                },
                {
                  key: 'unclassified',
                  label: content.socialRegime.headers[2],
                  widthClassName: 'w-1/4',
                },
                {
                  key: 'takeaway',
                  label: content.socialRegime.headers[3],
                  widthClassName: 'w-1/4',
                },
              ]}
              rows={content.socialRegime.rows.map((row) => ({
                key: row.situation,
                cells: {
                  situation: row.situation,
                  classified: (
                    <span
                      className={row.highlight === 'classified' ? 'font-semibold text-ink' : ''}
                    >
                      {row.classified}
                    </span>
                  ),
                  unclassified: (
                    <span
                      className={
                        row.highlight === 'unclassified' ? 'font-semibold text-copper' : ''
                      }
                    >
                      {row.unclassified}
                    </span>
                  ),
                  takeaway: row.takeaway,
                },
              }))}
            />
            <p className="text-sm text-muted mb-8 px-1">{content.socialRegime.footnote}</p>

            <div className="bg-ink/5 border border-ink/15 rounded-editorial p-6 mb-6 text-center">
              <p className="text-ink leading-comfortable">{content.socialRegime.callout}</p>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {content.socialRegime.sources.map((source, index) => (
                <span key={source.href}>
                  {index > 0 && ' · '}
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-inline-link"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section id="reconnaissance" className="editorial-section editorial-anchor bg-surface">
        <div className="container-editorial">
          <h2 className="editorial-heading text-ink mb-8 text-center">
            {content.officialSign.title}
          </h2>
          <p className="text-muted leading-comfortable mb-6 text-center max-w-2xl mx-auto">
            {content.officialSign.description}
          </p>

          <div className="mx-auto max-w-3xl grid grid-cols-3 sm:grid-cols-5 items-start gap-3 sm:gap-6 pb-8">
            {panonceaux.map(({ src, label }) => (
              <div key={label[locale]} className="min-w-0">
                <img
                  src={src}
                  alt={`${content.officialSign.panonceauAltPrefix} ${label[locale]}`}
                  width={842}
                  height={1191}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
          <div className="text-center mb-12">
            <a
              href={content.officialSign.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-inline-link"
            >
              {content.officialSign.sourceLabel}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.officialSign.items.map((item) => (
              <div key={item.title} className="flex gap-3">
                <CheckCircle className="text-ink flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-ink mb-1">{item.title}</p>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <SmartImage
                assetKey="pourquoiReferencement"
                alt={content.tourismReference.imageAlt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-editorial shadow-sm w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="editorial-heading text-ink mb-8">{content.tourismReference.title}</h2>
              <div className="space-y-6">
                {content.tourismReference.items.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="text-ink flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-semibold text-ink mb-1">{item.title}</p>
                      <p className="text-sm text-muted leading-comfortable">
                        {renderTourismDescription(item.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCta title={content.finalCta.title} description={content.finalCta.description}>
        {content.finalCta.links.map((link) => (
          <Button key={link.href} href={link.href} variant={link.variant} size="lg">
            {link.label}
          </Button>
        ))}
      </PageCta>
    </>
  );
}
