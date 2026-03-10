import SEO from '../components/ui/SEO';

export default function MentionsLegales() {
  return (
    <>
      <SEO
        title="Mentions légales"
        description="Mentions légales et informations d’édition du site Etoilys."
      />
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-4xl">
          <h1 className="mb-8">Mentions légales</h1>
          <div className="space-y-6 text-textLight leading-comfortable">
            <p>
              Le site Etoilys est édité dans le cadre d&apos;une activité de classement de meublés
              de tourisme.
            </p>
            <p>
              Les informations d&apos;identification de l&apos;éditeur, de l&apos;hébergeur et des
              modalités de contact sont mises à disposition sur cette page.
            </p>
            <p>
              Cette version est une page minimale de référence et peut être complétée avec les
              éléments juridiques définitifs.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
