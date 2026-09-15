import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import PageHero from '../components/ui/PageHero';
import { contactPageContent } from '../content/pages/contactPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function Contact() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = contactPageContent[locale];

  return (
    <>
      <PageHero size="compact" title={content.hero.title} description={content.hero.description} />

      <section className="editorial-section bg-surface">
        <div className="container-editorial">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="min-w-0">
              <h2 className="mb-8 text-2xl text-ink">{content.detailsTitle}</h2>
              <div className="space-y-6 mb-12">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-editorial border border-ink/15 bg-paper flex items-center justify-center">
                      <Phone className="h-6 w-6 text-copper" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink mb-2">
                      {content.contactLabels.phone}
                    </h3>
                    <a
                      href="tel:+33649551540"
                      className="editorial-inline-link leading-comfortable"
                    >
                      06 49 55 15 40
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-editorial border border-ink/15 bg-paper flex items-center justify-center">
                      <Mail className="h-6 w-6 text-copper" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink mb-2">
                      {content.contactLabels.email}
                    </h3>
                    <a
                      href="mailto:contact@etoilys.fr"
                      className="editorial-inline-link leading-comfortable"
                    >
                      contact@etoilys.fr
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-editorial border border-ink/15 bg-paper flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-copper" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink mb-2">
                      {content.contactLabels.headOffice}
                    </h3>
                    <p className="text-muted leading-comfortable">
                      1345 route de Dautres
                      <br />
                      24150 Mauzac et Grand Castang
                    </p>
                  </div>
                </div>
              </div>

              <div className="editorial-notice">
                <h3 className="text-lg text-ink mb-3">{content.quickResponse.title}</h3>
                <p className="text-muted leading-comfortable">
                  {content.quickResponse.description}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
