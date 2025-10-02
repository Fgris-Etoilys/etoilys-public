import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../ui/Button';

const footerLinks = {
  services: [
    { name: 'Classement meublé de tourisme', href: '/classement' },
    { name: 'Pourquoi faire classer son meublé', href: '/pourquoi-classer' },
    { name: 'La procédure de classement', href: '/procedure' },
    { name: 'Simulateur de classement', href: '/simulateur' },
  ],
  entreprise: [
    { name: 'Notre équipe', href: '/equipe' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Recrutement', href: '/recrutement' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'CGU', href: '/cgu' },
  ],
};

export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t border-gray-200'>
      <div className='container-adaptive py-section'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12'>
          <div className='lg:col-span-2'>
            <Link to='/' className='flex items-center gap-2 mb-4'>
              <Star className='h-8 w-8 text-primary-300 fill-current' />
              <span className='text-2xl font-playfair font-bold text-gray-900'>
                Etoilys
              </span>
            </Link>
            <p className='text-textLight mb-6 leading-comfortable'>
              Spécialiste du classement des meublés de tourisme. Nous accompagnons les propriétaires dans leur démarche de valorisation et de reconnaissance de la qualité de leur hébergement.
            </p>
            <div className='space-y-3 text-sm text-textLight'>
              <div className='flex items-start gap-2'>
                <MapPin className='h-5 w-5 text-primary-300 flex-shrink-0 mt-0.5' />
                <span>123 Rue du Tourisme, 75001 Paris</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-5 w-5 text-primary-300 flex-shrink-0' />
                <a href='tel:+33123456789' className='hover:text-primary-300'>
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-5 w-5 text-primary-300 flex-shrink-0' />
                <a href='mailto:contact@etoilys.fr' className='hover:text-primary-300'>
                  contact@etoilys.fr
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-4'>
              Services
            </h3>
            <ul className='space-y-3'>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-sm text-textLight hover:text-primary-300 transition-colors duration-200'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-4'>
              Entreprise
            </h3>
            <ul className='space-y-3'>
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-sm text-textLight hover:text-primary-300 transition-colors duration-200'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-4'>
              Informations légales
            </h3>
            <ul className='space-y-3 mb-6'>
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-sm text-textLight hover:text-primary-300 transition-colors duration-200'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href='/demande-classement' variant='primary' size='sm'>
              Demande de classement
            </Button>
          </div>
        </div>

        <div className='pt-8 border-t border-gray-200'>
          <p className='text-sm text-textLight text-center'>
            © {new Date().getFullYear()} Etoilys. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
