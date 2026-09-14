import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import CookiePreferencesButton from '../ui/CookiePreferencesButton';
import { layoutContent } from '../../i18n/layoutContent';

export function DordogneFooter() {
  const content = layoutContent.fr.footer;
  return (
    <footer className="dd-footer">
      <div className="dd-container">
        <div className="dd-footer-main">
          <div className="dd-footer-brand">
            <Link to={content.homeHref} className="dd-logo" aria-label="Etoilys, accueil">
              <img
                src="/Logo complet - site web copy.svg"
                alt="Etoilys"
                width="1025"
                height="576"
                loading="lazy"
              />
            </Link>
            <p>
              Le classement officiel.
              <br />
              Un interlocuteur près de chez vous.
            </p>
            <a href="tel:+33649551540" className="dd-phone">
              <Phone size={18} aria-hidden="true" />
              06 49 55 15 40
            </a>
            <a href="mailto:contact@etoilys.fr">contact@etoilys.fr</a>
            <address className="dd-address">
              1345 route de Dautres
              <br />
              24150 Mauzac et Grand Castang
            </address>
          </div>
          <nav className="dd-footer-links" aria-label="Liens utiles">
            {content.columns.map((column) => (
              <div key={column.title}>
                <p className="dd-footer-label">{column.title}</p>
                {column.links.map((link) => (
                  <Link key={link.href} to={link.href}>
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="dd-footer-bottom">
          <span>
            © {new Date().getFullYear()} Etoilys — {content.copyright}
          </span>
          <CookiePreferencesButton>{content.cookiePreferencesLabel}</CookiePreferencesButton>
          <Link to="/contact">
            Contact <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
