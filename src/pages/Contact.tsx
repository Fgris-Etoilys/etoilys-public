import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import { contactPageContent } from '../content/pages/contactPageContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function Contact() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = contactPageContent[locale];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="mb-8">{content.detailsTitle}</h2>
              <div className="space-y-6 mb-12">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">
                      {content.contactLabels.phone}
                    </h3>
                    <a
                      href="tel:+33649551540"
                      className="text-textLight hover:text-primary-300 leading-comfortable"
                    >
                      06 49 55 15 40
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">
                      {content.contactLabels.email}
                    </h3>
                    <a
                      href="mailto:contact@etoilys.fr"
                      className="text-textLight hover:text-primary-300 leading-comfortable"
                    >
                      contact@etoilys.fr
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">
                      {content.contactLabels.headOffice}
                    </h3>
                    <p className="text-textLight leading-comfortable">
                      1345 route de Dautres
                      <br />
                      24150 Mauzac et Grand Castang
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-100 rounded-card p-6">
                <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-3">
                  {content.quickResponse.title}
                </h3>
                <p className="text-textLight leading-comfortable">
                  {content.quickResponse.description}
                </p>
              </div>
            </div>

            <div>
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
