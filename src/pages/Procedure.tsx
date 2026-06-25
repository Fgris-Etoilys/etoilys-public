import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Timeline from '../components/ui/Timeline';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { classificationProcessPageContent } from '../content/pages/classificationProcessPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

const REFERENTIEL_PUBLIC_PATH = '/Référentiel de classement des meublés de tourisme 2022 V2.pdf';

export default function Procedure() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = classificationProcessPageContent[locale];
  const timelineSteps = content.steps.map((step) => ({
    number: step.number,
    title: step.title,
    description: step.inspection ? (
      <>
        <p>
          {step.inspection.beforeReferenceLink}
          <a
            href={REFERENTIEL_PUBLIC_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            {step.inspection.referenceLinkLabel}
          </a>
          {step.inspection.afterReferenceLink}
        </p>
        <div className="mt-3 rounded-card border border-primary-200 bg-primary-100 px-4 py-3">
          <p className="text-sm leading-snug">{step.inspection.accreditationText}</p>
          <a
            href={COFRAC_ACCREDITATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
          >
            {step.inspection.accreditationLinkLabel}
          </a>
        </div>
      </>
    ) : (
      step.description
    ),
  }));

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
            <h2 className="mb-12 text-center">{content.stepsTitle}</h2>
            <Timeline steps={timelineSteps} />
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">{content.keyFigures.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {content.keyFigures.items.map((item) => (
                <div
                  key={item.value}
                  className="bg-white rounded-card p-6 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-3xl font-bold text-primary-300 mb-2">{item.value}</div>
                  <p className="text-sm text-textLight leading-comfortable">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-center">{content.certificate.title}</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              {content.certificate.description}
            </p>
            <div className="bg-primary-100 rounded-card p-8">
              <ul className="space-y-4">
                {content.certificate.items.map((item) => (
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
