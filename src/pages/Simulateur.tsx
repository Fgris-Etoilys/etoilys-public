import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, FolderOpen, LoaderCircle } from 'lucide-react';
import Button from '../components/ui/Button';
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
    className: 'border-ink/15 bg-paper text-ink',
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
    <section className="simulator-ui simulator-page">
      <div className="container-editorial">
        <header className="simulator-intro">
          <div>
            <p className="simulator-eyebrow">Les outils Etoilys</p>
            <h1>Simulateur de classement</h1>
            <p>
              Situez votre meublé de tourisme, identifiez les points à préparer et avancez vers
              votre classement.
            </p>
          </div>
        </header>

        <div className="simulator-workspace lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form
            className="simulator-form-panel"
            onSubmit={handleStartFormSubmit}
            aria-labelledby="new-simulation-title"
          >
            <div className="mb-6">
              <p className="simulator-eyebrow">Votre point de départ</p>
              <h2 id="new-simulation-title">Nouvelle simulation</h2>
              <p className="mt-2 text-sm text-muted">
                Quatre informations pour commencer. Vous pourrez les modifier à tout moment.
              </p>
            </div>

            <div className="space-y-5">
              <Select
                id="requestedCategory"
                name="requestedCategory"
                label="Catégorie que vous souhaitez tester"
                helperText="Choisissez un premier objectif, de 1 à 5 étoiles."
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

              <div className="simulator-field-grid">
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
                className="simulator-submit"
                disabled={isCreatingSimulation}
              >
                {isCreatingSimulation ? 'Création en cours...' : 'Démarrer la simulation'}
                {isCreatingSimulation ? (
                  <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </Button>
            </div>

            <p className="mt-5 border-t border-ink/10 pt-4 text-xs text-muted" role="note">
              Une estimation pour vous préparer. Seule une visite officielle permet de confirmer le
              classement.
            </p>
          </form>

          <section
            className="simulator-result-panel"
            aria-labelledby="saved-simulations-title"
            aria-busy={simulationsStatus === 'loading'}
          >
            <div className="mb-6">
              <div className="simulator-result-heading !mb-2">
                <h2 id="saved-simulations-title">Mes simulations</h2>
                {simulationsStatus === 'success' && simulations.length > 0 && (
                  <span className="text-xs text-muted">
                    {simulations.length} enregistrée{simulations.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                Vos simulations sont enregistrées sur ce navigateur.
              </p>
            </div>

            {simulationsStatus === 'loading' && (
              <p className="flex items-center gap-3 py-8 text-sm text-muted" role="status">
                <LoaderCircle size={20} className="motion-safe:animate-spin" aria-hidden="true" />
                Chargement de vos simulations...
              </p>
            )}

            {simulationsStatus === 'error' && (
              <div className="border-l-2 border-alert-500 bg-alert-100/50 p-5" role="alert">
                <h3 className="mb-2">Chargement impossible</h3>
                <p className="mb-4 text-sm text-alert-500">
                  Impossible de charger vos simulations pour le moment.
                </p>
                <Button type="button" variant="secondary" onClick={() => void loadSimulations()}>
                  Réessayer
                </Button>
              </div>
            )}

            {simulationsStatus === 'success' && simulations.length === 0 && (
              <div className="border-t border-ink/15 py-8">
                <FolderOpen
                  size={32}
                  strokeWidth={1.25}
                  className="mb-5 text-copper"
                  aria-hidden="true"
                />
                <h3 className="mb-3">Aucune simulation enregistrée</h3>
                <p className="max-w-sm text-sm text-muted">
                  Commencez avec les informations de votre logement. Vous retrouverez ici vos
                  simulations pour les reprendre à votre rythme.
                </p>
                <ol
                  className="mt-7 space-y-3 border-t border-ink/15 pt-5 text-sm text-muted"
                  aria-label="Le parcours de simulation"
                >
                  <li className="flex items-center gap-3">
                    <span className="text-xs text-copper" aria-hidden="true">
                      01
                    </span>
                    Décrivez les pièces du logement
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xs text-copper" aria-hidden="true">
                      02
                    </span>
                    Parcourez la grille de contrôle
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xs text-copper" aria-hidden="true">
                      03
                    </span>
                    Consultez votre estimation
                  </li>
                </ol>
              </div>
            )}

            {simulationsStatus === 'success' && simulations.length > 0 && (
              <ul className="divide-y divide-ink/15 border-t border-ink/15">
                {simulations.map((simulation) => {
                  const statusBadge = getSimulationStatusBadge(simulation.statut);
                  const isConfirmingDelete = confirmingDeleteSimulationId === simulation.id;
                  const isDeleting = deletingSimulationId === simulation.id;

                  return (
                    <li key={simulation.id} className="py-5 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <h3>{formatRequestedCategory(simulation.categorie_demandee)}</h3>
                        {statusBadge && (
                          <span
                            className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        )}
                      </div>

                      <dl className="mt-3 space-y-1 text-sm text-muted">
                        <div>
                          <dt className="sr-only">Capacité d’accueil</dt>
                          <dd>{formatCapacity(simulation.capacite_accueil)}</dd>
                        </div>
                        <div className="flex flex-wrap gap-x-1">
                          <dt>Modifiée le</dt>
                          <dd>{formatModificationDate(simulation.date_modification)}</dd>
                        </div>
                      </dl>

                      {isConfirmingDelete ? (
                        <div className="mt-4 border-t border-alert-200 pt-4" role="alert">
                          <p className="text-sm font-medium text-alert-500">
                            Confirmer la suppression de cette simulation ?
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="ui-focus inline-flex min-h-11 items-center justify-center rounded-control border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isDeleting}
                              onClick={() => setConfirmingDeleteSimulationId(null)}
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              className="ui-focus inline-flex min-h-11 items-center justify-center rounded-control border border-alert-200 bg-alert-100 px-4 py-2 text-sm font-medium text-alert-500 transition-colors hover:bg-alert-200 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isDeleting}
                              onClick={() => void handleDeleteSimulation(simulation.id)}
                            >
                              {isDeleting ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <Button
                            type="button"
                            variant="primary"
                            className="min-h-11 gap-3 px-4 py-2 text-sm"
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
                            <ArrowRight size={16} aria-hidden="true" />
                          </Button>
                          <button
                            type="button"
                            className="ui-focus min-h-11 rounded-control px-2 py-2 text-sm text-muted underline decoration-ink/25 underline-offset-4 transition-colors hover:text-alert-500"
                            onClick={() => setConfirmingDeleteSimulationId(simulation.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <details className="simulator-disclosure simulator-method">
          <summary>Comment fonctionne cette estimation ?</summary>
          <div className="grid gap-5 pt-2 md:grid-cols-2 md:gap-10">
            <div>
              <h2 className="mb-2 !text-base">Un repère avant la visite</h2>
              <p>
                Le simulateur compare vos réponses à la grille officielle de classement des meublés
                de tourisme, de 1 à 5 étoiles : logement, équipements, services et développement
                durable. Il vous aide à repérer les exigences à vérifier et les équipements à
                préparer.
              </p>
            </div>
            <div>
              <h2 className="mb-2 !text-base">Une estimation, pas un classement</h2>
              <p>
                Le résultat dépend des informations renseignées. Lors de la visite officielle,
                Etoilys vérifie les équipements, les surfaces et l’état du logement. Un équipement
                absent ou un détail mal renseigné peut modifier le résultat final.
              </p>
            </div>
          </div>
        </details>

        <section
          className="simulator-next editorial-focus-inverse"
          aria-labelledby="official-visit-title"
        >
          <div>
            <h2 id="official-visit-title">Prêt pour la visite officielle ?</h2>
            <p>
              Etoilys vous accompagne vers le classement de votre meublé, en tant qu’organisme de
              contrôle accrédité Cofrac Inspection n°3-2394.
            </p>
          </div>
          <div className="simulator-next-actions">
            <Button href="/demande-classement" variant="primary" className="simulator-next-primary">
              Organiser une visite officielle
              <ArrowUpRight size={18} aria-hidden="true" />
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
}
