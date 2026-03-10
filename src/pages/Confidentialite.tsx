import SEO from '../components/ui/SEO';

export default function Confidentialite() {
  return (
    <>
      <SEO
        title="Politique de confidentialité"
        description="Informations sur le traitement des données personnelles dans le cadre des services Etoilys."
      />
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-4xl">
          <h1 className="mb-8">Politique de confidentialité</h1>
          <div className="space-y-6 text-textLight leading-comfortable">
            <p>
              Cette page décrit le cadre de traitement des données personnelles collectées via les
              formulaires et interactions du site Etoilys.
            </p>
            <p>
              Les données collectées sont utilisées pour traiter les demandes liées aux services
              proposés, assurer le suivi des échanges et répondre aux obligations légales
              applicables.
            </p>
            <p>
              Pour toute question relative au traitement des données personnelles, merci de
              contacter l&apos;équipe via la page Contact.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
