import PageHero from '../components/ui/PageHero';
import InterventionAreaCards from '../components/local/InterventionAreaCards';
import Button from '../components/ui/Button';
import { groupActiveDepartmentsByRegion } from '../content/local/registry';

export default function ZonesIntervention() {
  const departmentGroups = groupActiveDepartmentsByRegion();

  return (
    <>
      <PageHero
        eyebrow="Zones d’intervention"
        eyebrowMarked
        title="Zones d’intervention pour le classement des meublés de tourisme"
        description="Retrouvez les départements dans lesquels Etoilys propose des visites de classement, puis consultez les secteurs d’intervention et les tarifs."
        size="compact"
      />

      <section className="bg-surface py-section">
        <div className="container-editorial">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <h2 className="mb-4">Trouvez votre département</h2>
            </div>

            <div className="space-y-10">
              {departmentGroups.map((group) => (
                <section key={group.region.id} aria-labelledby={`region-${group.region.id}`}>
                  <h3
                    id={`region-${group.region.id}`}
                    className="mb-5 flex items-center gap-4 text-2xl font-playfair font-semibold text-ink"
                  >
                    <span className="h-5 w-0.5 rounded-full bg-copper" aria-hidden="true" />
                    <span>{group.region.label}</span>
                    <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
                  </h3>
                  <InterventionAreaCards areas={group.departments} departmentHeadingLevel={4} />
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-md border border-ink/10 bg-paper p-6 md:p-8">
              <h2 className="mb-4 text-h3">Votre département n’apparaît pas ?</h2>
              <p className="mb-6 text-muted leading-comfortable">
                Indiquez-nous la commune de votre logement. Nous vous confirmerons les possibilités
                d’intervention avant tout engagement.
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
          </div>
        </div>
      </section>
    </>
  );
}
