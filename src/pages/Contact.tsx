import { ArrowUpRight, Clock3, Mail, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import { contactPageContent } from '../content/pages/contactPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function Contact() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const content = contactPageContent[locale];

  return (
    <section className="inquiry-page">
      <div className="container-editorial inquiry-contact-layout">
        <div className="inquiry-intro">
          <p className="editorial-eyebrow editorial-eyebrow-marked">{content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
          <p className="inquiry-description">{content.hero.description}</p>
          <p className="inquiry-response">
            <Clock3 size={16} aria-hidden="true" />
            {content.quickResponse}
          </p>
        </div>

        <div className="inquiry-contact-methods" role="group" aria-label={content.detailsTitle}>
          <a href="tel:+33649551540" className="inquiry-contact-link ui-focus">
            <Phone size={20} aria-hidden="true" />
            <span>
              <span className="inquiry-contact-label">{content.contactLabels.phone}</span>
              <span>06 49 55 15 40</span>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href="mailto:contact@etoilys.fr" className="inquiry-contact-link ui-focus">
            <Mail size={20} aria-hidden="true" />
            <span>
              <span className="inquiry-contact-label">{content.contactLabels.email}</span>
              <span>contact@etoilys.fr</span>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="inquiry-form-surface">
          <ContactForm locale={locale} />
        </div>

        <address className="inquiry-address">
          <span className="inquiry-contact-label">{content.contactLabels.headOffice}</span>
          1345 route de Dautres
          <br />
          24150 Mauzac et Grand Castang
        </address>
      </div>
    </section>
  );
}
