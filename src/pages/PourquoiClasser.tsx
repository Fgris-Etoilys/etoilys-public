import { useLocation } from 'react-router-dom';
import {
  Award,
  Calculator,
  CheckCircle,
  Globe,
  Percent,
  PiggyBank,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import Card from '../components/ui/Card';
import SmartImage from '../components/ui/SmartImage';
import {
  classificationBenefitsPageContent,
  type BenefitsIconKey,
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
} as const satisfies Record<BenefitsIconKey, LucideIcon>;

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
        className="underline hover:text-gray-700"
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
          <h2 className="mb-12 text-center">{content.mainBenefits.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.mainBenefits.items.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={benefitIcons[benefit.icon]}
                title={benefit.title}
                description={benefit.description}
                iconColor="bicolor"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.fiscalComparison.title}</h2>
            <p className="text-center text-textLight mb-12 leading-comfortable">
              {content.fiscalComparison.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.fiscalComparison.items.map((item) => (
                <Card key={item.title} hover={false} className={item.color}>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <div className="text-4xl font-bold text-primary-300 mb-4">{item.allowance}</div>
                    <p className="text-sm text-textLight">{item.allowanceLabel}</p>
                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <p className="text-sm text-gray-700 leading-comfortable">{item.example}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 bg-success-100 border border-success-200 rounded-card p-6 text-center">
              <div className="text-4xl font-bold text-success-400 mb-1">
                {content.fiscalComparison.result.value}
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {content.fiscalComparison.result.label}
              </p>
              <p className="text-sm text-gray-600">{content.fiscalComparison.result.description}</p>
            </div>
            <div className="mt-6 text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">{content.fiscalComparison.footnote.intro}</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                {content.fiscalComparison.footnote.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Source:{' '}
                <a
                  href={content.fiscalComparison.footnote.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-700"
                >
                  {content.fiscalComparison.footnote.sourceLabel}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.touristTax.title}</h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              {content.touristTax.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-100 rounded-card p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">
                  {content.touristTax.unclassified.title}
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-center text-3xl font-bold text-alert-400 mb-1">
                    {content.touristTax.unclassified.value}
                  </p>
                  <p className="text-center text-sm text-gray-700">
                    {content.touristTax.unclassified.label}
                  </p>
                  <p className="text-center text-xs text-gray-600 mt-3">
                    {content.touristTax.unclassified.note}
                  </p>
                </div>
              </div>
              <div className="bg-success-100 rounded-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">
                  {content.touristTax.classified.title}
                </h3>
                <p className="text-center text-sm font-medium text-gray-700 mb-3">
                  {content.touristTax.classified.intro}
                </p>
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-success-200">
                      <th className="text-center py-1 text-gray-600 font-medium">
                        {content.touristTax.classified.headerCategory}
                      </th>
                      <th className="text-center py-1 text-gray-600 font-medium">
                        {content.touristTax.classified.headerRange}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {content.touristTax.classified.ranges.map((range, index) => (
                      <tr
                        key={range.label}
                        className={
                          index === content.touristTax.classified.ranges.length - 1
                            ? undefined
                            : 'border-b border-success-200/50'
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

            <div className="bg-primary-100 rounded-card p-6 mb-6">
              <p className="font-semibold text-gray-800 mb-4">{content.touristTax.example.title}</p>
              <p className="text-xs text-gray-500 mb-4">{content.touristTax.example.note}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-primary-200">
                      {content.touristTax.example.headers.map((header, index) => (
                        <th
                          key={`${header}-${index}`}
                          className={`text-center py-2 font-medium ${
                            index === 2 ? 'text-success-500' : 'text-gray-600'
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {content.touristTax.example.rows.map((row, index) => {
                      const isTotal = index >= content.touristTax.example.rows.length - 2;
                      const isPrimaryTotal = index === content.touristTax.example.rows.length - 2;
                      return (
                        <tr
                          key={row.label}
                          className={`${
                            isPrimaryTotal
                              ? 'font-semibold border-t-2 border-primary-300'
                              : isTotal
                                ? 'font-bold'
                                : 'border-b border-primary-200/50'
                          }`}
                        >
                          <td className="py-2 text-center">{row.label}</td>
                          <td className="text-center">{row.unclassified}</td>
                          <td className="text-center text-success-600">{row.classified}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-success-400">
                  {content.touristTax.example.totalValue}
                </span>
                <span className="text-sm text-gray-600 ml-2">
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

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.socialRegime.title}</h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              {content.socialRegime.description}
            </p>
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-sm bg-white rounded-card overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary-200 text-gray-800">
                    {content.socialRegime.headers.map((header) => (
                      <th key={header} className="text-left px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {content.socialRegime.rows.map((row) => (
                    <tr key={row.situation} className="text-gray-700">
                      <td className="px-4 py-3">{row.situation}</td>
                      <td
                        className={`px-4 py-3 ${
                          row.highlight === 'classified' ? 'bg-success-100' : ''
                        }`}
                      >
                        {row.classified}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          row.highlight === 'unclassified' ? 'bg-alert-100 font-medium' : ''
                        }`}
                      >
                        {row.unclassified}
                      </td>
                      <td className="px-4 py-3">{row.takeaway}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mb-8 px-1">{content.socialRegime.footnote}</p>

            <div className="bg-success-100 border border-success-200 rounded-card p-6 mb-6 text-center">
              <p className="text-gray-800 leading-comfortable">{content.socialRegime.callout}</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              {content.socialRegime.sources.map((source, index) => (
                <span key={source.href}>
                  {index > 0 && ' · '}
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-700"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <h2 className="mb-8 text-center">{content.officialSign.title}</h2>
          <p className="text-textLight leading-comfortable mb-6 text-center max-w-2xl mx-auto">
            {content.officialSign.description}
          </p>

          <div className="flex flex-nowrap justify-center items-start pb-10">
            {panonceaux.map(({ src, label }, i) => (
              <div
                key={label[locale]}
                className={`relative group -mx-4 sm:-mx-5 transition-transform duration-200 hover:-translate-y-3 ${
                  i % 2 === 1 ? 'translate-y-10' : ''
                }`}
                style={{ zIndex: i === 2 ? 10 : 5 - Math.abs(2 - i) }}
              >
                <img
                  src={src}
                  alt={`${content.officialSign.panonceauAltPrefix} ${label[locale]}`}
                  width={842}
                  height={1191}
                  loading="lazy"
                  decoding="async"
                  className="w-44 sm:w-56 object-contain drop-shadow-lg"
                />
              </div>
            ))}
          </div>
          <div className="text-center mb-12">
            <a
              href={content.officialSign.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-primary-300 hover:text-primary-400"
            >
              {content.officialSign.sourceLabel}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.officialSign.items.map((item) => (
              <div key={item.title} className="flex gap-3">
                <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                  <p className="text-sm text-textLight">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <h2 className="mb-10 text-center">{content.tourismReference.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <SmartImage
                assetKey="pourquoiReferencement"
                alt={content.tourismReference.imageAlt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-card shadow-card-hover w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                {content.tourismReference.items.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                      <p className="text-sm text-textLight leading-comfortable">
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

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">{content.finalCta.title}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            {content.finalCta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {content.finalCta.links.map((link) => (
              <Button key={link.href} href={link.href} variant={link.variant} size="lg">
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
