import { ArrowUpRight, Clock3, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { requestClassificationPageContent } from '../content/pages/requestClassificationPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function DemandeClassement() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const content = requestClassificationPageContent[locale];

  return (
    <section className="inquiry-page">
      <div className="container-editorial">
        <header className="inquiry-intro inquiry-request-intro">
          <div>
            <p className="editorial-eyebrow editorial-eyebrow-marked">{content.hero.eyebrow}</p>
            <h1>{content.hero.title}</h1>
            <p className="inquiry-description">{content.hero.description}</p>
          </div>
          <a href="tel:+33649551540" className="inquiry-phone ui-focus">
            <Phone size={18} aria-hidden="true" />
            <span>
              <span>{content.hero.phoneNote}</span>06 49 55 15 40
            </span>
          </a>
        </header>

        <div className="inquiry-request-layout">
          <div className="inquiry-form-surface">
            <DemandeClassementForm locale={locale} />
          </div>

          <aside className="inquiry-after" aria-labelledby="after-request-title">
            <div className="inquiry-after-copy">
              <p className="inquiry-response">
                <Clock3 size={16} aria-hidden="true" />
                {content.afterRequest.responseTime}
              </p>
              <h2 id="after-request-title">{content.afterRequest.title}</h2>
              <p>{content.afterRequest.description}</p>
              <p className="inquiry-after-note">{content.afterRequest.note}</p>
            </div>

            <div className="inquiry-accreditation">
              <img
                src="/Inspection_RVB.jpg"
                alt={content.accreditation.imageAlt}
                width={1440}
                height={2399}
                loading="lazy"
                decoding="async"
                className="h-24 w-auto shrink-0"
              />
              <div>
                <p className="font-medium text-ink">{content.accreditation.numberLabel}</p>
                <p>{content.accreditation.scopePrefix}</p>
                <a
                  href={COFRAC_ACCREDITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link ui-focus"
                >
                  {content.accreditation.scopeLinkLabel}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
