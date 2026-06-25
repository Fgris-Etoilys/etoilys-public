import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { classificationRequirementsPageContent } from '../content/pages/classificationRequirementsPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function Prerequis() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = classificationRequirementsPageContent[locale];

  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">{content.hero.title}</h1>
            <p className="text-xl text-white/90 leading-comfortable mb-5">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8">{content.eligibility.title}</h2>
            <div className="space-y-5 text-textLight leading-comfortable mb-8">
              {content.eligibility.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="bg-primary-100 rounded-card p-6">
              <p className="text-gray-800 leading-comfortable">
                <span className="font-semibold">{content.eligibility.highlight.lead}</span>
                {content.eligibility.highlight.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.criteria.title}</h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              {content.criteria.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {content.criteria.items.map((critere) => (
                <div key={critere.title} className="flex gap-3">
                  <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">{critere.title}</p>
                    <div className="space-y-2">
                      {critere.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm text-textLight leading-comfortable">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-primary-200 rounded-card p-6 text-center">
              <p className="text-gray-800 leading-comfortable">
                {content.criteria.summary.beforeStrong}
                <span className="font-semibold">{content.criteria.summary.strong}</span>
                {content.criteria.summary.afterStrong}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.blockingPoints.title}</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              {content.blockingPoints.description}
            </p>
            <div className="bg-warning-100 border border-warning-200 rounded-card p-6 mb-6">
              <ul className="space-y-3">
                {content.blockingPoints.items.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-warning-500 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-800 leading-comfortable">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-textLight leading-comfortable text-center mb-6">
              {content.blockingPoints.closing}
            </p>
            <div className="bg-success-100 border border-success-200 rounded-card p-6">
              <p className="text-gray-800 leading-comfortable">
                {content.blockingPoints.resultBox}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">{content.checklist.title}</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              {content.checklist.description}
            </p>
            <div className="bg-white rounded-card p-8 max-w-2xl mx-auto">
              <ul className="space-y-4">
                {content.checklist.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-800 leading-comfortable">{item}</span>
                  </li>
                ))}
              </ul>
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
