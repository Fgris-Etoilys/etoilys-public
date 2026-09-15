import { useLocation } from 'react-router-dom';
import { Check, CircleAlert } from 'lucide-react';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import PageCta from '../components/ui/PageCta';
import PageHero from '../components/ui/PageHero';
import SectionNav from '../components/ui/SectionNav';
import { classificationRequirementsPageContent } from '../content/pages/classificationRequirementsPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function Prerequis() {
  const locale = getLocaleFromPath(useLocation().pathname);
  const content = classificationRequirementsPageContent[locale];

  return (
    <>
      <PageHero title={content.hero.title} description={content.hero.description} size="compact">
        <SectionNav
          label={content.hero.title}
          items={[
            { id: 'checklist', label: content.navigation[0] },
            { id: 'eligibility', label: content.navigation[1] },
            { id: 'criteria', label: content.navigation[2] },
            { id: 'blocking-points', label: content.navigation[3] },
          ]}
        />
      </PageHero>

      <section id="checklist" className="editorial-section editorial-anchor bg-surface">
        <div className="container-editorial editorial-split">
          <div>
            <h2 className="editorial-heading text-ink mb-5">{content.checklist.title}</h2>
            <p className="text-muted">{content.checklist.description}</p>
          </div>
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {content.checklist.items.map((item) => (
              <li key={item} className="flex gap-4 py-4">
                <Check size={20} className="text-copper shrink-0 mt-1" aria-hidden="true" />
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="eligibility" className="editorial-section editorial-anchor bg-paper">
        <div className="container-editorial">
          <h2 className="editorial-heading text-ink max-w-3xl mb-8 sm:mb-12">
            {content.eligibility.title}
          </h2>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
            <div className="space-y-5 text-muted">
              {content.eligibility.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="editorial-positive text-muted">
              <p>
                <strong className="block text-ink mb-3">
                  {content.eligibility.highlight.lead}
                </strong>
                {content.eligibility.highlight.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="criteria" className="editorial-section editorial-anchor bg-surface">
        <div className="container-editorial editorial-split">
          <div>
            <h2 className="editorial-heading text-ink mb-5">{content.criteria.title}</h2>
            <p className="text-muted">{content.criteria.description}</p>
          </div>
          <div>
            <Accordion
              items={content.criteria.items.map((item) => ({
                question: item.title,
                answer: (
                  <div className="space-y-3">
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ),
              }))}
            />
            <p className="editorial-positive mt-6 text-sm">
              {content.criteria.summary.beforeStrong}
              <strong>{content.criteria.summary.strong}</strong>
              {content.criteria.summary.afterStrong}
            </p>
          </div>
        </div>
      </section>

      <section id="blocking-points" className="editorial-section editorial-anchor bg-paper">
        <div className="container-editorial">
          <div className="max-w-3xl mb-8 sm:mb-12">
            <h2 className="editorial-heading text-ink mb-5">{content.blockingPoints.title}</h2>
            <p className="text-muted">{content.blockingPoints.description}</p>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 border-y border-copper/25 py-7 sm:py-9">
            {content.blockingPoints.items.map((point) => (
              <li key={point} className="flex gap-3">
                <CircleAlert size={18} className="text-copper shrink-0 mt-1" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 mt-8 lg:grid-cols-2 lg:gap-16 items-start">
            <p className="text-muted">{content.blockingPoints.closing}</p>
            <p className="editorial-positive">{content.blockingPoints.resultBox}</p>
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
