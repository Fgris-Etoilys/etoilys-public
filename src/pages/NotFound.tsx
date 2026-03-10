import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page non trouvée"
        description="La page demandée n'existe pas ou n'est plus disponible."
      />
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-3xl text-center">
          <p className="text-sm font-medium text-primary-300 mb-4">Erreur 404</p>
          <h1 className="mb-6">Page non trouvée</h1>
          <p className="text-textLight leading-comfortable mb-8">
            La page demandée n&apos;est pas disponible. Vous pouvez revenir à l&apos;accueil ou
            accéder à la page de contact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/" variant="primary">
              Retour à l&apos;accueil
            </Button>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-primary-300 text-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              Contacter Etoilys
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
