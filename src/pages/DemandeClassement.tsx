import { useLocation } from 'react-router-dom';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import PageHero from '../components/ui/PageHero';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { requestClassificationPageContent } from '../content/pages/requestClassificationPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function DemandeClassement() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = requestClassificationPageContent[locale];

  return (
    <>
      <PageHero title={content.hero.title} description={content.hero.description}>
        <p className="text-muted">{content.hero.phoneNote}</p>
      </PageHero>

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <DemandeClassementForm locale={locale} />
            </div>

            <div>
              <div className="sticky top-[calc(var(--etoilys-header-height,81px)+24px)]">
                <div className="bg-paper rounded-editorial p-6 sm:p-8 mb-6">
                  <h2 className="text-2xl text-ink mb-6">{content.sidebar.title}</h2>
                  <ul className="space-y-4 text-muted leading-comfortable">
                    {content.sidebar.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-copper font-bold flex-shrink-0" aria-hidden="true">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <img
                    src="/Inspection_RVB.jpg"
                    alt={content.accreditation.imageAlt}
                    width={1440}
                    height={2399}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-auto flex-shrink-0"
                  />
                  <p className="text-sm text-muted leading-snug">
                    {content.accreditation.numberLabel}
                    <br />
                    {content.accreditation.scopePrefix}
                    <br />
                    <a
                      href={COFRAC_ACCREDITATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-inline-link"
                    >
                      {content.accreditation.scopeLinkLabel}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
