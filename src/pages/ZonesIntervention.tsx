import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LOCAL_AREAS } from '../content/localServiceAreas';

const carteFranceExpansion = '/images/carte-france-expansion-card.webp';

export default function ZonesIntervention() {
  return (
    <>
      <section className="bg-gradient-to-br from-themePrimary-1 to-primary-300 py-16 text-white md:py-24 lg:py-28">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Zones d&rsquo;intervention
            </p>
            <h1 className="mb-6 text-white">
              Où Etoilys intervient pour classer votre meublé de tourisme ?
            </h1>
            <p className="max-w-3xl text-xl leading-comfortable text-white/90">
              Etoilys accompagne les propriétaires de meublés de tourisme dans plusieurs secteurs du
              Sud-Ouest. Retrouvez les pages locales disponibles et déposez une demande pour
              vérifier les possibilités d’intervention dans votre secteur.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/demande-classement" variant="white" size="lg">
                Faire une demande de classement
              </Button>
              <Button href="/classement-meuble-tourisme-dordogne" variant="ghost" size="lg">
                Consulter la page Dordogne
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <h2 className="mb-4">Nos zones d’intervention actuelles</h2>
              <p className="text-textLight leading-comfortable">
                Retrouvez les pages locales disponibles et les secteurs dans lesquels Etoilys peut
                réaliser votre visite de classement.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {LOCAL_AREAS.map((area) => (
                <Card
                  key={area.name}
                  hover={area.status === 'available'}
                  className="flex min-h-[320px] flex-col p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                      {area.name}
                    </h3>
                  </div>
                  <p className="mb-6 text-sm leading-comfortable text-textLight">
                    {area.description}
                  </p>
                  <div className="mt-auto">
                    {area.href ? (
                      <Button href={area.href} variant="primary">
                        Consulter la page {area.name}
                      </Button>
                    ) : (
                      <Button href="/demande-classement" variant="secondary">
                        Faire une demande
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-card border border-primary-200 bg-primary-100">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.45fr)]">
                <div className="p-6 md:p-8">
                  <h2 className="mb-4 text-h3">Votre département n’apparaît pas encore ?</h2>
                  <p className="mb-6 text-textLight leading-comfortable">
                    Etoilys développe progressivement son réseau d’inspecteurs pour accompagner
                    davantage de propriétaires sur le territoire. Si votre logement se situe hors
                    des zones déjà présentées, vous pouvez déposer une demande : nous vous
                    confirmerons les possibilités d’intervention avant toute validation.
                  </p>
                  <p className="mb-6 text-sm font-medium leading-comfortable text-gray-900">
                    Vous êtes inspecteur ou souhaitez rejoindre le réseau Etoilys ? Contactez-nous
                    pour échanger sur les secteurs à développer.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button href="/demande-classement" variant="primary">
                      Faire une demande de classement
                    </Button>
                    <Button href="/contact" variant="secondary">
                      Nous contacter
                    </Button>
                  </div>
                </div>
                <div className="min-h-[280px] bg-white/45 lg:min-h-full">
                  <img
                    src={carteFranceExpansion}
                    alt="Carte de France illustrant le développement des zones d’intervention Etoilys"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
