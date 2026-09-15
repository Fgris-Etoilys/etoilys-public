import { useLocation } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import PageHero from '../components/ui/PageHero';
import SectionNav from '../components/ui/SectionNav';
import { faqPageContent } from '../content/pages/faqPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function FAQ() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = faqPageContent[locale];

  return (
    <>
      <PageHero title={content.hero.title} description={content.hero.description} size="compact">
        <SectionNav
          label={content.hero.title}
          items={content.sections.map((section, index) => ({
            id: `faq-${index + 1}`,
            label: section.title,
          }))}
        />
      </PageHero>

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="space-y-14 sm:space-y-20">
            {content.sections.map((section, index) => (
              <div
                key={section.title}
                id={`faq-${index + 1}`}
                className="editorial-split editorial-anchor"
              >
                <h2 className="text-[28px] sm:text-[32px] text-ink tracking-tight">
                  {section.title}
                </h2>
                <Accordion items={section.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-paper">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="editorial-heading text-ink mb-6">{content.finalCta.title}</h2>
            <p className="text-lg text-muted mb-8 leading-comfortable">
              {content.finalCta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content.finalCta.links.map((link) => (
                <Button key={link.href} href={link.href} variant={link.variant}>
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
