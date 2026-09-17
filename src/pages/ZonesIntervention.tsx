import Button from '../components/ui/Button';
import PageHero from '../components/ui/PageHero';
import InterventionAreaCards from '../components/local/InterventionAreaCards';
import { groupActiveDepartmentsByRegion } from '../content/local/registry';

const carteFranceExpansion = '/images/carte-france-expansion-card.webp';

export default function ZonesIntervention() {
  const departmentGroups = groupActiveDepartmentsByRegion();

  return (
    <>
      <PageHero
        eyebrow="Zones d’intervention"
        eyebrowMarked
        title="Zones d’intervention pour le classement des meublés de tourisme"
        description="Etoilys réalise des visites de classement dans plusieurs départements, avec un réseau d’inspecteurs qui s’étend progressivement à de nouveaux territoires. Retrouvez ci-dessous les secteurs actuellement couverts."
        size="compact"
      />

      <section className="bg-surface py-section">
        <div className="container-editorial">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <h2 className="mb-4">Nos zones d’intervention actuelles</h2>
              <p className="text-muted leading-comfortable">
                Retrouvez les pages locales disponibles et les secteurs dans lesquels Etoilys peut
                réaliser votre visite de classement.
              </p>
            </div>

            <div className="space-y-12">
              {departmentGroups.map((group) => (
                <section key={group.region.id} aria-labelledby={`region-${group.region.id}`}>
                  <h3
                    id={`region-${group.region.id}`}
                    className="mb-5 text-2xl font-playfair font-semibold text-ink"
                  >
                    {group.region.label}
                  </h3>
                  <InterventionAreaCards areas={group.departments} departmentHeadingLevel={4} />
                </section>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-md border border-ink/10 bg-surface">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.45fr)]">
                <div className="p-6 md:p-8">
                  <h2 className="mb-4 text-h3">Votre département n’apparaît pas encore ?</h2>
                  <p className="mb-6 text-muted leading-comfortable">
                    Etoilys développe progressivement son réseau d’inspecteurs pour accompagner
                    davantage de propriétaires sur le territoire. Si votre logement se situe hors
                    des zones déjà présentées, vous pouvez déposer une demande : nous vous
                    confirmerons les possibilités d’intervention avant toute validation.
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
