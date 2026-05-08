import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  createPublicSimulation,
  listPublicSimulations,
  type HousingType,
  type PublicSimulationSummary,
  type RequestedCategory,
} from '../utils/simulatorApi';
import { formatRequestedCategory } from '../utils/simulatorLabels';

type SimulationsStatus = 'loading' | 'success' | 'error';

interface FormErrors {
  capacity?: string;
}

const CLASSEMENT_OPTIONS: Array<{ value: RequestedCategory; label: string }> = [
  { value: '1*', label: '1 étoile' },
  { value: '2*', label: '2 étoiles' },
  { value: '3*', label: '3 étoiles' },
  { value: '4*', label: '4 étoiles' },
  { value: '5*', label: '5 étoiles' },
];

const TYPE_HABITATION_OPTIONS: Array<{ value: HousingType; label: string }> = [
  { value: 'INDIVIDUEL', label: 'Logement individuel' },
  { value: 'COLLECTIF', label: 'Logement collectif' },
];

const FLOOR_OPTIONS = [
  { value: '0', label: 'RDC' },
  { value: '1', label: '1er' },
  { value: '2', label: '2e' },
  { value: '3', label: '3e' },
  { value: '4', label: '4e ou plus' },
];

function isRequestedCategory(value: string): value is RequestedCategory {
  return CLASSEMENT_OPTIONS.some((option) => option.value === value);
}

function isHousingType(value: string): value is HousingType {
  return TYPE_HABITATION_OPTIONS.some((option) => option.value === value);
}

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

export default function Simulateur() {
  const navigate = useNavigate();
  const [requestedCategory, setRequestedCategory] = useState<RequestedCategory>('3*');
  const [housingType, setHousingType] = useState<HousingType>('INDIVIDUEL');
  const [floor, setFloor] = useState('0');
  const [capacity, setCapacity] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCreatingSimulation, setIsCreatingSimulation] = useState(false);
  const [simulationsStatus, setSimulationsStatus] = useState<SimulationsStatus>('loading');
  const [simulations, setSimulations] = useState<PublicSimulationSummary[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const startBlockRef = useRef<HTMLDivElement>(null);

  const loadSimulations = useCallback(async (ignoreResult: () => boolean = () => false) => {
    setSimulationsStatus('loading');
    setActionFeedback(null);

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
    setActionFeedback(null);

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
        navigate(`/simulateur/${createdSimulation.id}`);
        return;
      }

      setCapacity('');
      setFloor('0');
      setRequestedCategory('3*');
      setHousingType('INDIVIDUEL');
      await loadSimulations();
      setActionFeedback('La simulation a été créée.');
    } catch {
      setActionFeedback('Impossible de créer la simulation pour le moment.');
    } finally {
      setIsCreatingSimulation(false);
    }
  }

  function handleUnavailableSimulationAction(actionLabel: string) {
    setActionFeedback(`${actionLabel} sera disponible avec l’écran complet du simulateur.`);
  }

  return (
    <>
      <section className="bg-gradient-to-br from-themePrimary-1 to-primary-300 py-section text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Simulateur de classement</h1>
            <p className="text-xl leading-comfortable text-white/90">
              Ce simulateur permet d’estimer le classement possible d’un meublé de tourisme à partir
              de la grille officielle de classement.
            </p>
            <p className="mt-4 text-base leading-comfortable text-white/85">
              Le résultat est une estimation déclarative. Il ne remplace pas une visite officielle
              de classement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div ref={startBlockRef}>
              <Card hover={false} className="border-primary-200 bg-primary-100 p-6 md:p-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
                  Démarrer une nouvelle simulation
                </p>
                <h2 className="mb-4 text-h4">Paramètres de départ</h2>
                <p className="mb-6 text-base leading-comfortable text-gray-700">
                  Ces informations préparent la simulation. La saisie complète de la grille sera
                  ajoutée dans une prochaine étape.
                </p>

                <form className="space-y-5" onSubmit={handleStartFormSubmit}>
                  <Select
                    id="requestedCategory"
                    name="requestedCategory"
                    label="Classement demandé"
                    options={CLASSEMENT_OPTIONS}
                    value={requestedCategory}
                    onChange={handleRequestedCategoryChange}
                  />

                  <Select
                    id="housingType"
                    name="housingType"
                    label="Type de logement"
                    options={TYPE_HABITATION_OPTIONS}
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
                    size="lg"
                    className="w-full"
                    disabled={isCreatingSimulation}
                  >
                    {isCreatingSimulation
                      ? 'Création en cours...'
                      : 'Créer une nouvelle simulation'}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-3">Mes simulations</h2>
                <p className="text-base leading-comfortable text-textLight">
                  Les simulations affichées sont celles associées à ce navigateur.
                </p>
              </div>

              {actionFeedback && (
                <div
                  className="rounded-card border border-primary-200 bg-primary-100 p-4 text-sm text-primary-500"
                  role="status"
                >
                  {actionFeedback}
                </div>
              )}

              {simulationsStatus === 'loading' && (
                <Card hover={false} className="p-6">
                  <p className="text-base text-gray-700">Chargement de vos simulations...</p>
                </Card>
              )}

              {simulationsStatus === 'error' && (
                <Card hover={false} className="border-alert-200 bg-alert-100 p-6">
                  <h3 className="mb-2 text-xl font-playfair font-semibold text-gray-900">
                    Chargement impossible
                  </h3>
                  <p className="mb-5 text-base leading-comfortable text-alert-500">
                    Impossible de charger vos simulations pour le moment.
                  </p>
                  <Button type="button" variant="secondary" onClick={() => void loadSimulations()}>
                    Réessayer
                  </Button>
                </Card>
              )}

              {simulationsStatus === 'success' && simulations.length === 0 && (
                <Card hover={false} className="p-6 md:p-8">
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    Aucune simulation enregistrée
                  </h3>
                  <p className="mb-6 text-base leading-comfortable text-textLight">
                    Vous n’avez pas encore de simulation enregistrée sur ce navigateur.
                  </p>
                </Card>
              )}

              {simulationsStatus === 'success' && simulations.length > 0 && (
                <div className="space-y-4">
                  {simulations.map((simulation) => (
                    <Card key={simulation.id} hover={false} className="p-5 md:p-6">
                      <div className="mb-5 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="text-xl font-playfair font-semibold text-gray-900">
                            Classement demandé :{' '}
                            {formatRequestedCategory(simulation.categorie_demandee)}
                          </h3>
                          {simulation.statut && (
                            <span className="inline-flex w-fit rounded-full border border-primary-200 bg-primary-100 px-3 py-1 text-sm font-medium text-primary-500">
                              Statut : {simulation.statut}
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

                      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
                        <Button
                          type="button"
                          variant="primary"
                          href={`/simulateur/${simulation.id}`}
                        >
                          Reprendre
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            handleUnavailableSimulationAction('Modifier les paramètres')
                          }
                        >
                          Modifier les paramètres
                        </Button>
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center justify-center rounded-lg border border-alert-200 bg-white px-4 py-2 text-sm font-medium text-alert-500 transition-colors duration-200 hover:bg-alert-100 focus:outline-none focus:ring-2 focus:ring-alert-400 focus:ring-offset-2 sm:ml-auto sm:mt-0"
                          onClick={() => handleUnavailableSimulationAction('Supprimer')}
                        >
                          Supprimer
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
