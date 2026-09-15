import { ArrowRight, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CookiePreferencesButton from '../ui/CookiePreferencesButton';
import { layoutContent } from '../../i18n/layoutContent';

import { getLocaleFromPath, getLocalizedPath } from '../../i18n/routeHelpers';

export default function Footer() {
  const locale = getLocaleFromPath(useLocation().pathname);
  const content = layoutContent[locale].footer;
  const contactHref = getLocalizedPath('contact', locale);
  return (
    <footer className="site-footer">
      <div className="container-editorial">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link to={content.homeHref} className="footer-logo ui-focus">
              <img
                src="/logo-etoilys-editorial.svg"
                alt="Etoilys"
                width="1025"
                height="576"
                loading="lazy"
              />
            </Link>
            <p>
              {content.brandTagline[0]}
              <br />
              {content.brandTagline[1]}
            </p>
            <a href="tel:+33649551540" className="footer-phone ui-focus">
              <Phone size={18} aria-hidden="true" />
              06 49 55 15 40
            </a>
            <a href="mailto:contact@etoilys.fr" className="ui-focus">
              contact@etoilys.fr
            </a>
            <address className="footer-address">
              1345 route de Dautres
              <br />
              24150 Mauzac et Grand Castang
            </address>
          </div>
          <nav className="site-footer-links" aria-label={content.linksLabel}>
            {content.columns.map((column) => (
              <div key={column.title}>
                <h3 className="site-footer-label">{column.title}</h3>
                {column.links.map((link) => (
                  <Link key={link.href} to={link.href} className="ui-focus">
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>
            © {new Date().getFullYear()} Etoilys — {content.copyright}
          </span>
          <CookiePreferencesButton className="ui-focus">
            {content.cookiePreferencesLabel}
          </CookiePreferencesButton>
          {contactHref && (
            <Link to={contactHref} className="ui-focus">
              {content.contactLabel} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
