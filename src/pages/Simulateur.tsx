import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import {
  createPublicSimulation,
  deletePublicSimulation,
  getSimulatorApiErrorMessage,
  listPublicSimulations,
  type HousingType,
  type PublicSimulationSummary,
  type RequestedCategory,
  type SimulationStatus,
} from '../utils/simulatorApi';
import {
  trackClassementSimulatorDeleted,
  trackClassementSimulatorResumed,
  trackClassementSimulatorStarted,
} from '../utils/analytics';
import {
  FLOOR_OPTIONS,
  formatRequestedCategory,
  HOUSING_TYPE_OPTIONS,
  isHousingType,
  isRequestedCategory,
  REQUESTED_CATEGORY_OPTIONS,
} from '../utils/simulatorLabels';

type SimulationsStatus = 'loading' | 'success' | 'error';

interface FormErrors {
  capacity?: string;
}

interface SimulationStatusBadge {
  label: string;
  className: string;
}

const SIMULATION_STATUS_BADGES: Record<SimulationStatus, SimulationStatusBadge> = {
  BROUILLON: {
    label: 'Brouillon',
    className: 'border-primary-200 bg-primary-100 text-primary-500',
  },
  FAVORABLE: {
    label: 'Résultat favorable',
    className: 'border-success-200 bg-success-100 text-success-500',
  },
  DEFAVORABLE: {
    label: 'Résultat défavorable',
    className: 'border-alert-200 bg-alert-100 text-alert-500',
  },
  A_COMPLETER: {
    label: 'À compléter',
    className: 'border-warning-200 bg-warning-100 text-warning-500',
  },
  A_RECALCULER: {
    label: 'À recalculer',
    className: 'border-warning-200 bg-white text-warning-500',
  },
};

function formatCapacity(value: number): string {
  return `${value} ${value > 1 ? 'personnes' : 'personne'}`;
}

function formatModificationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date non disponible';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function getSimulationStatusBadge(
  value: SimulationStatus | undefined
): SimulationStatusBadge | null {
  return value ? SIMULATION_STATUS_BADGES[value] : null;
}

export default function Simulateur() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [requestedCategory, setRequestedCategory] = useState<RequestedCategory>('3*');
  const [housingType, setHousingType] = useState<HousingType>('INDIVIDUEL');
  const [floor, setFloor] = useState('0');
  const [capacity, setCapacity] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCreatingSimulation, setIsCreatingSimulation] = useState(false);
  const [simulationsStatus, setSimulationsStatus] = useState<SimulationsStatus>('loading');
  const [simulations, setSimulations] = useState<PublicSimulationSummary[]>([]);
  const [confirmingDeleteSimulationId, setConfirmingDeleteSimulationId] = useState<string | null>(
    null
  );
  const [deletingSimulationId, setDeletingSimulationId] = useState<string | null>(null);
  const startBlockRef = useRef<HTMLDivElement>(null);

  const loadSimulations = useCallback(async (ignoreResult: () => boolean = () => false) => {
    setSimulationsStatus('loading');

    try {
      const nextSimulations = await listPublicSimulations();

      if (ignoreResult()) {
        return;
      }

      setSimulations(nextSimulations);
      setSimulationsStatus('success');
    } catch {
      if (ignoreResult()) {
        return;
      }

      setSimulations([]);
      setSimulationsStatus('error');
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    void loadSimulations(() => ignore);

    return () => {
      ignore = true;
    };
  }, [loadSimulations]);

  function handleRequestedCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.target.value;
    if (isRequestedCategory(nextValue)) {
      setRequestedCategory(nextValue);
    }
  }

  function handleHousingTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.target.value;
    if (isHousingType(nextValue)) {
      setHousingType(nextValue);
    }
  }

  async function handleStartFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedCapacity = Number(capacity);
    const parsedFloor = Number(floor);

    if (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0) {
      setFormErrors({ capacity: 'Indiquez une capacité d’accueil valide.' });
      return;
    }

    setFormErrors({});
    setIsCreatingSimulation(true);

    try {
      const createdSimulation = await createPublicSimulation({
        categorie_demandee: requestedCategory,
        capacite_accueil: parsedCapacity,
        etage: parsedFloor,
        type_habitation: housingType,
      });

      if (createdSimulation.id) {
        trackClassementSimulatorStarted({
          requestedCategory,
          housingType,
          floor: parsedFloor,
          capacity: parsedCapacity,
        });
        navigate(`/simulateur/${createdSimulation.id}`);
        return;
      }

      setCapacity('');
      setFloor('0');
      setRequestedCategory('3*');
      setHousingType('INDIVIDUEL');
      await loadSimulations();
      showToast('La simulation a été créée.', { type: 'success' });
    } catch (error) {
      showToast(
        getSimulatorApiErrorMessage(
          error,
          'Impossible de créer la simulation pour le moment.',
          'createSimulation'
        ),
        { type: 'error' }
      );
    } finally {
      setIsCreatingSimulation(false);
    }
  }

  async function handleDeleteSimulation(simulationId: string) {
    setDeletingSimulationId(simulationId);

    try {
      const deletedSimulation = simulations.find((simulation) => simulation.id === simulationId);
      await deletePublicSimulation(simulationId);
      setSimulations((currentSimulations) =>
        currentSimulations.filter((simulation) => simulation.id !== simulationId)
      );
      setConfirmingDeleteSimulationId(null);
      trackClassementSimulatorDeleted({
        requestedCategory: deletedSimulation?.categorie_demandee,
        capacity: deletedSimulation?.capacite_accueil,
      });
      showToast('La simulation a été supprimée.', { type: 'success' });
    } catch (error) {
      showToast(
        getSimulatorApiErrorMessage(
          error,
          'La simulation n’a pas pu être supprimée. Veuillez réessayer.',
          'deleteSimulation'
        ),
        { type: 'error' }
      );
    } finally {
      setDeletingSimulationId(null);
    }
  }

  return (
    <>
      <section className="simulator-ui bg-gradient-to-br from-themePrimary-1 to-primary-300 py-10 text-white md:py-12">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-white">Simulateur de classement</h1>
            <p className="text-base text-white/90">
              Ce simulateur permet d’estimer le classement possible d’un meublé de tourisme à partir
              de la grille officielle de classement.
            </p>
            <p className="mt-3 text-sm text-white/85">
              Le résultat est une estimation déclarative. Il ne remplace pas une visite officielle
              de classement.
            </p>
          </div>
        </div>
      </section>

      <section className="simulator-ui bg-white py-10 md:py-12">
        <div className="container-adaptive">
          <div className="mx-auto mb-6 max-w-6xl">
            <div className="rounded-card border border-primary-200 bg-primary-100 p-5 leading-comfortable text-gray-700 md:p-6">
              <h2 className="mb-3 text-gray-900">Méthode du simulateur de classement</h2>
              <div className="space-y-3 text-sm">
                <p>
                  Ce simulateur vous donne une première estimation du classement possible de votre
                  meublé de tourisme. Il s’appuie sur la grille officielle de classement, utilisée
                  pour attribuer de 1 à 5 étoiles selon des critères liés au logement, aux
                  équipements, aux services proposés et au développement durable.
                </p>
                <p>
                  L’objectif est simple : vous aider à situer votre logement avant d’engager une
                  démarche officielle. Vous renseignez les caractéristiques du bien, puis le
                  simulateur compare vos réponses aux exigences du référentiel.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div ref={startBlockRef} className="space-y-5">
              <Card hover={false} className="border-primary-200 bg-primary-100 p-5 md:p-6">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
                  Nouvelle simulation
                </p>
                <h2 className="mb-3">Configurer votre simulation</h2>
                <p className="mb-5 text-sm text-gray-700">
                  Commencez par renseigner les informations principales du logement. <br></br>
                  Vous pourrez les ajuster en cours de simulation.
                </p>

                <form className="space-y-5" onSubmit={handleStartFormSubmit}>
                  <Select
                    id="requestedCategory"
                    name="requestedCategory"
                    label="Classement demandé"
                    options={REQUESTED_CATEGORY_OPTIONS}
                    value={requestedCategory}
                    onChange={handleRequestedCategoryChange}
                  />

                  <Select
                    id="housingType"
                    name="housingType"
                    label="Type de logement"
                    options={HOUSING_TYPE_OPTIONS}
                    value={housingType}
                    onChange={handleHousingTypeChange}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Select
                      id="floor"
                      name="floor"
                      label="Étage"
                      options={FLOOR_OPTIONS}
                      value={floor}
                      onChange={(event) => setFloor(event.target.value)}
                    />

                    <Input
                      label="Capacité d’accueil"
                      name="capacity"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      placeholder="Ex. 4"
                      value={capacity}
                      onChange={(event) => {
                        setCapacity(event.target.value);
                        if (formErrors.capacity) {
                          setFormErrors({});
                        }
                      }}
                      error={formErrors.capacity}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isCreatingSimulation}
                  >
                    {isCreatingSimulation ? 'Création en cours...' : 'Démarrer la simulation'}
                  </Button>
                </form>
              </Card>

              <div className="rounded-card border border-warning-200 bg-warning-100 p-5 leading-comfortable text-gray-700 md:p-6">
                <h2 className="mb-3 text-gray-900">Limites du simulateur de classement</h2>
                <div className="space-y-3 text-sm">
                  <p>
                    Ce simulateur ne délivre pas un classement officiel. Il vous donne une
                    estimation à partir de vos réponses, mais seul un contrôle sur place permet de
                    confirmer les critères réellement validés.
                  </p>
                  <p>
                    Lors de la visite, Etoilys vérifie concrètement les équipements, les surfaces,
                    l’état du logement et les points prévus par la grille de classement. Un détail
                    mal renseigné ou un équipement absent peut modifier le résultat final.
                  </p>
                  <p>
                    Le score affiché doit donc être lu comme une aide à la préparation, pas comme
                    une garantie d’obtention d’une catégorie d’étoiles.
                  </p>
                </div>
              </div>

              <div className="rounded-card border border-primary-200 bg-white p-5 shadow-card md:p-6">
                <h2 className="mb-3 text-gray-900">
                  Passer de l’estimation à la visite officielle
                </h2>
                <p className="mb-5 text-sm leading-comfortable text-textLight">
                  Le simulateur vous aide à préparer votre projet, mais seul un contrôle sur place
                  permet d’obtenir un classement. Etoilys peut réaliser cette visite en tant
                  qu’organisme de contrôle accrédité Cofrac Inspection n°3-2394.
                </p>
                <Button href="/demande-classement" variant="primary">
                  Demander une visite de classement
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h2 className="mb-2">Mes simulations</h2>
                <p className="text-sm text-textLight">
                  Vos simulations sont enregistrées sur ce navigateur.
                </p>
              </div>

              {simulationsStatus === 'loading' && (
                <Card hover={false} className="p-6">
                  <p className="text-sm text-gray-700">Chargement de vos simulations...</p>
                </Card>
              )}

              {simulationsStatus === 'error' && (
                <Card hover={false} className="border-alert-200 bg-alert-100 p-5">
                  <h3 className="mb-2">Chargement impossible</h3>
                  <p className="mb-4 text-sm text-alert-500">
                    Impossible de charger vos simulations pour le moment.
                  </p>
                  <Button type="button" variant="secondary" onClick={() => void loadSimulations()}>
                    Réessayer
                  </Button>
                </Card>
              )}

              {simulationsStatus === 'success' && simulations.length === 0 && (
                <Card hover={false} className="p-5 md:p-6">
                  <h3 className="mb-2">Aucune simulation enregistrée</h3>
                  <p className="text-sm text-textLight">
                    Vous n’avez pas encore de simulation enregistrée sur ce navigateur.
                  </p>
                </Card>
              )}

              {simulationsStatus === 'success' && simulations.length > 0 && (
                <div className="space-y-4">
                  {simulations.map((simulation) => {
                    const statusBadge = getSimulationStatusBadge(simulation.statut);
                    const isConfirmingDelete = confirmingDeleteSimulationId === simulation.id;
                    const isDeleting = deletingSimulationId === simulation.id;

                    return (
                      <Card key={simulation.id} hover={false} className="p-4 md:p-5">
                        <div className="mb-4 space-y-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <h3>
                              Classement demandé :{' '}
                              {formatRequestedCategory(simulation.categorie_demandee)}
                            </h3>
                            {statusBadge && (
                              <span
                                className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-medium ${statusBadge.className}`}
                              >
                                {statusBadge.label}
                              </span>
                            )}
                          </div>

                          <dl className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                            <div>
                              <dt className="font-medium text-gray-900">Capacité d’accueil</dt>
                              <dd>{formatCapacity(simulation.capacite_accueil)}</dd>
                            </div>
                            <div>
                              <dt className="font-medium text-gray-900">Dernière modification</dt>
                              <dd>{formatModificationDate(simulation.date_modification)}</dd>
                            </div>
                          </dl>
                        </div>

                        {isConfirmingDelete ? (
                          <div className="flex flex-col gap-3 border-t border-alert-200 pt-4 sm:flex-row sm:items-center">
                            <p className="text-sm font-medium text-alert-500 sm:flex-1">
                              Confirmer la suppression de cette simulation ?
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isDeleting}
                                onClick={() => setConfirmingDeleteSimulationId(null)}
                              >
                                Annuler
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-alert-200 bg-white px-4 py-2 text-sm font-medium text-alert-500 transition-colors hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isDeleting}
                                onClick={() => void handleDeleteSimulation(simulation.id)}
                              >
                                {isDeleting ? 'Suppression...' : 'Supprimer'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
                            <Button
                              type="button"
                              variant="primary"
                              href={`/simulateur/${simulation.id}`}
                              state={{ classementSimulatorEntryPoint: 'resume_card' }}
                              onClick={() =>
                                trackClassementSimulatorResumed({
                                  entryPoint: 'resume_card',
                                  requestedCategory: simulation.categorie_demandee,
                                  capacity: simulation.capacite_accueil,
                                })
                              }
                            >
                              Reprendre
                            </Button>
                            <button
                              type="button"
                              className="mt-2 inline-flex items-center justify-center rounded-lg border border-alert-200 bg-white px-4 py-2 text-sm font-medium text-alert-500 transition-colors duration-200 hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 sm:ml-auto sm:mt-0"
                              onClick={() => setConfirmingDeleteSimulationId(simulation.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
