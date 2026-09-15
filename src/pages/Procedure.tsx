import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import PageCta from '../components/ui/PageCta';
import PageHero from '../components/ui/PageHero';
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
    meta: step.meta,
    description: step.inspection ? (
      <>
        <p>
          {step.inspection.beforeReferenceLink}
          <a
            href={REFERENTIEL_PUBLIC_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-inline-link"
          >
            {step.inspection.referenceLinkLabel}
          </a>
          {step.inspection.afterReferenceLink}
        </p>
        <div className="mt-3 rounded-editorial border border-ink/15 bg-paper px-4 py-3">
          <p className="text-sm leading-snug">{step.inspection.accreditationText}</p>
          <a
            href={COFRAC_ACCREDITATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex min-h-11 text-sm editorial-inline-link"
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
      <PageHero title={content.hero.title} description={content.hero.description} size="compact" />

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <h2 className="editorial-heading text-ink mb-8 sm:mb-12">{content.stepsTitle}</h2>
            <Timeline steps={timelineSteps} />
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial editorial-split">
          <div>
            <h2 className="editorial-heading text-ink mb-4">{content.certificate.title}</h2>
            <p className="text-muted leading-comfortable">{content.certificate.description}</p>
          </div>
          <div className="bg-surface border border-ink/10 rounded-editorial p-6 sm:p-8">
            <ul className="space-y-4">
              {content.certificate.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle
                    className="text-copper flex-shrink-0 mt-0.5"
                    size={18}
                    aria-hidden="true"
                  />
                  <span className="text-ink leading-comfortable">{item}</span>
                </li>
              ))}
            </ul>
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
