import { useLocation } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import { faqPageContent } from '../content/pages/faqPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function FAQ() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = faqPageContent[locale];

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
          <div className="max-w-3xl mx-auto space-y-10">
            {content.sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-themePrimary-1 mb-5 pb-2 border-b border-primary-200">
                  {section.title}
                </h4>
                <Accordion items={section.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">{content.finalCta.title}</h2>
            <p className="text-lg text-textLight mb-8 leading-comfortable">
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
