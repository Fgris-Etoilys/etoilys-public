import SEO from '../components/ui/SEO';

export default function Cgu() {
  return (
    <>
      <SEO
        title="Conditions générales d’utilisation"
        description="Conditions générales d’utilisation du site Etoilys."
      />
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-4xl">
          <h1 className="mb-8">Conditions générales d&apos;utilisation</h1>
          <div className="space-y-6 text-textLight leading-comfortable">
            <p>
              L&apos;utilisation du site implique l&apos;acceptation des règles de consultation,
              d&apos;accès aux contenus et d&apos;utilisation des formulaires de contact ou de
              demande.
            </p>
            <p>
              Les contenus sont fournis à titre informatif, dans le cadre des services présentés par
              Etoilys.
            </p>
            <p>
              Cette page constitue une base minimale et peut être complétée pour intégrer les
              clauses juridiques finales.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
