import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import CookiePreferencesButton from '../ui/CookiePreferencesButton';

export function DordogneHeader() {
  return (
    <header className="dd-header">
      <a href="#dordogne-content" className="dd-skip">
        Aller au contenu
      </a>
      <div className="dd-container dd-header-inner">
        <Link to="/" aria-label="Etoilys, accueil" className="dd-logo">
          <img src="/Logo complet - site web copy.svg" alt="Etoilys" width="1025" height="576" />
        </Link>
        <span className="dd-header-note">
          Le classement des meublés
          <br />
          de tourisme, tout simplement.
        </span>
        <nav aria-label="Navigation Dordogne" className="dd-nav">
          <a href="#le-classement">Les avantages</a>
          <a href="#tarifs">Les tarifs</a>
          <a href="#etapes">La visite</a>
        </nav>
        <Button href="/demande-classement" className="dd-button dd-header-cta">
          Demander mon classement <ArrowUpRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

export function DordogneFooter() {
  return (
    <footer className="dd-footer">
      <div className="dd-container">
        <div className="dd-footer-main">
          <div>
            <Link to="/" className="dd-logo" aria-label="Etoilys, accueil">
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
          </div>
          <div>
            <p className="dd-footer-label">Parlons de votre logement</p>
            <a href="tel:+33649551540" className="dd-phone">
              <Phone size={18} aria-hidden="true" />
              06 49 55 15 40
            </a>
            <a href="mailto:contact@etoilys.fr">contact@etoilys.fr</a>
            <p className="dd-address">
              1345 route de Dautres
              <br />
              24150 Mauzac et Grand Castang
            </p>
          </div>
          <nav aria-label="Liens utiles">
            <p className="dd-footer-label">Pour aller plus loin</p>
            <Link to="/prerequis-au-classement">
              Les prérequis au classement <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/simulateur">
              Le simulateur de classement <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/zones-intervention">
              Nos zones d’intervention <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/classement-meuble-tourisme-bergerac">
              Le classement à Bergerac <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </nav>
        </div>
        <div className="dd-footer-bottom">
          <span>© {new Date().getFullYear()} Etoilys</span>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/confidentialite">Confidentialité</Link>
          <CookiePreferencesButton>Gérer mes cookies</CookiePreferencesButton>
          <Link to="/contact">
            Contact <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
