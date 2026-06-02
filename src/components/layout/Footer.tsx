import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import CookiePreferencesButton from '../ui/CookiePreferencesButton';

const footerLinks = {
  services: [
    { name: 'Classement meublé de tourisme', href: '/classement' },
    { name: 'Les avantages du classement', href: '/les-avantages-du-classement' },
    { name: 'Prérequis au classement', href: '/prerequis-au-classement' },
    { name: 'La procédure de classement', href: '/procedure' },
    { name: 'Simulateur de classement', href: '/simulateur' },
    { name: 'Simulateur taxe de séjour', href: '/simulateur-taxe-sejour' },
    { name: 'Simulateur fiscal classement 2026', href: '/simulateur-fiscal-classement' },
  ],
  zones: [
    { name: 'Zones d’intervention', href: '/zones-intervention' },
    { name: 'Classement en Dordogne', href: '/classement-meuble-tourisme-dordogne' },
    { name: 'Classement en Gironde', href: '/classement-meuble-tourisme-gironde' },
  ],
  entreprise: [
    // { name: 'Notre équipe', href: '/equipe' }, // TODO: réactiver quand la page sera prête
    { name: 'Actualités', href: '/actualites' },
    // { name: 'Recrutement', href: '/recrutement' }, // TODO: réactiver quand la page sera prête
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container-adaptive pb-16 pt-section">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2 lg:-mt-6">
            <Link to="/" className="mb-4 flex items-center">
              <img
                src="/Logo complet - site web copy.svg"
                alt="Etoilys"
                width={1025}
                height={576}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto"
              />
            </Link>
            <p className="mb-6 leading-comfortable text-textLight">
              Spécialiste du classement des meublés de tourisme. Etoilys intervient dans le cadre de
              la procédure officielle de classement.
            </p>
            <div className="space-y-3 text-sm text-textLight">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary-300" />
                <a href="tel:+33649551540" className="hover:text-primary-300">
                  06 49 55 15 40
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary-300" />
                <a href="mailto:contact@etoilys.fr" className="hover:text-primary-300">
                  contact@etoilys.fr
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-300" />
                <span>1345 route de Dautres, 24150 Mauzac et Grand Castang</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-playfair font-semibold text-gray-900">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-textLight transition-colors duration-200 hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-playfair font-semibold text-gray-900">
              Zones d’intervention
            </h3>
            <ul className="space-y-3">
              {footerLinks.zones.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-textLight transition-colors duration-200 hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-playfair font-semibold text-gray-900">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-textLight transition-colors duration-200 hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-playfair font-semibold text-gray-900">
              Informations légales
            </h3>
            <ul className="mb-6 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-textLight transition-colors duration-200 hover:text-primary-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className="text-left text-sm text-textLight transition-colors duration-200 hover:text-primary-300">
                  Gérer mes cookies
                </CookiePreferencesButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-textLight">
            © {new Date().getFullYear()} Etoilys. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
