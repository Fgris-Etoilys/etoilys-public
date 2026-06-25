import { useLocation } from 'react-router-dom';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { requestClassificationPageContent } from '../content/pages/requestClassificationPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function DemandeClassement() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = requestClassificationPageContent[locale];

  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">{content.hero.title}</h1>
            <p className="text-xl text-white/90 leading-comfortable">{content.hero.description}</p>
            <p className="mt-4 text-white/80">{content.hero.phoneNote}</p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <DemandeClassementForm locale={locale} />
            </div>

            <div>
              <div className="sticky top-24">
                <div className="bg-primary-100 rounded-card p-8 mb-6">
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-6">
                    {content.sidebar.title}
                  </h3>
                  <ul className="space-y-4 text-textLight leading-comfortable">
                    {content.sidebar.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
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
                  <p className="text-sm text-gray-600 leading-snug">
                    {content.accreditation.numberLabel}
                    <br />
                    {content.accreditation.scopePrefix}
                    <br />
                    <a
                      href={COFRAC_ACCREDITATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-300 hover:underline"
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
