import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Check, CheckCircle2, FileDown, X } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { ResultScoreCard } from '../SimulationGridTab';
import type { GridSummary } from '../../../content/simulatorGrid';
import type { FactuelleSnapshot } from '../../../hooks/useFactuelleSimulation';
import type { FactuelleResultState } from '../../../hooks/useFactuelleResult';
import { getFactuellePieceName } from '../../../utils/factuellePieces';
import {
  criterionSource,
  formatCategoriesLabel,
  formatCategory,
  resolveFactuelleSource,
  type FactuelleSource,
} from '../../../utils/factuelleGrille';
import {
  criteresNonValides,
  pointsBloquants,
  syntheseCategorie,
  usefulCategories,
  type CritereNonValide,
} from '../../../utils/factuelleResultats';
import type { EvaluationFactuelle } from '../../../utils/simulatorFactuelle.types';
import type {
  BlocageFactuel,
  ComparaisonCategorie,
  ComparaisonFactuelle,
  VerificationFactuelle,
} from '../../../utils/simulatorFactuelleResultats.types';

interface FactuelleResultPanelProps {
  result: Extract<FactuelleResultState, { status: 'blocked' | 'fresh' }>;
  snapshot: FactuelleSnapshot;
  /** Modèle de la catégorie demandée : libellés des critères à compléter. */
  grid: GridSummary | null;
  onOpenSource: (source: FactuelleSource) => void;
  onShowCriteria: (numbers: number[]) => void;
  onReturnToPieces: () => void;
  onReturnToGrid: () => void;
  onExportPdf: (entry: ComparaisonCategorie) => void;
}

const PARAMETER_LABELS: Record<string, string> = {
  categorie_demandee: 'Catégorie demandée',
  capacite_accueil: 'Capacité d’accueil',
  etage: 'Étage',
  type_habitation: 'Type d’habitation',
  studio: 'Studio',
};

const VISIBLE_CRITERIA = 5;

/** Libellé de l'accès à la source d'un critère non validé, selon sa destination. */
const SOURCE_LABELS: Record<FactuelleSource['kind'], string> = {
  critere: 'Voir dans la grille',
  global: 'Voir dans la grille',
  piece: 'Voir dans les pièces',
  parametre: 'Voir les paramètres',
};

function formatPoints(points: number): string {
  return `${points} ${points > 1 ? 'points' : 'point'}`;
}

function formatStars(category: string): string {
  const stars = Number(category.charAt(0));
  return `${stars} ${stars > 1 ? 'étoiles' : 'étoile'}`;
}

function UsefulFor({ categories }: { categories: string[] }) {
  return categories.length > 0 ? (
    <span className="text-xs text-muted"> Utile pour {formatCategoriesLabel(categories)}.</span>
  ) : null;
}

function BlocagesPanel({
  verification,
  snapshot,
  grid,
  onOpenSource,
  onShowCriteria,
}: {
  verification: VerificationFactuelle;
  snapshot: FactuelleSnapshot;
  grid: GridSummary | null;
  onOpenSource: (source: FactuelleSource) => void;
  onShowCriteria: (numbers: number[]) => void;
}) {
  const pieces = snapshot.faits.logement.pieces;
  const capacity = snapshot.faits.parametres.capacite_accueil;
  const counted = snapshot.evaluation?.surfaces?.nombre_couchages ?? null;

  function context(blocage: BlocageFactuel): string | null {
    if (blocage.destination === 'PARAMETRES') {
      return PARAMETER_LABELS[blocage.champ] ?? null;
    }
    const piece = pieces.find((candidate) => candidate.id === blocage.piece_id);
    if (piece) {
      return getFactuellePieceName(piece);
    }
    if (
      blocage.code === 'COUCHAGES_CAPACITE_INCOHERENTS' &&
      counted !== null &&
      capacity !== null
    ) {
      return `Actuellement, ${counted} ${counted > 1 ? 'couchages comptés' : 'couchage compté'} pour une capacité d’accueil de ${capacity}.`;
    }
    return null;
  }

  return (
    <div className="classement-result space-y-5">
      <div
        className="rounded-editorial border border-warning-200 bg-warning-100/60 p-5 text-sm font-medium leading-relaxed text-ink md:p-6"
        role="alert"
      >
        Des informations restent à compléter avant d’afficher les résultats des cinq catégories.
      </div>

      <Card hover={false} className="p-5 md:p-7">
        <h3 className="mb-4 text-lg font-semibold text-ink">Informations à compléter</h3>
        <div className="divide-y divide-ink/10">
          {pointsBloquants(verification.blocages).map((point) => {
            if (point.kind === 'criteres') {
              const numbers = point.criteres.map((critere) => critere.numero);
              const hidden = point.criteres.length - VISIBLE_CRITERIA;
              return (
                <div key="criteres" className="space-y-3 py-4 first:pt-0 last:pb-0">
                  <p className="text-sm text-gray-700">
                    {numbers.length}{' '}
                    {numbers.length > 1
                      ? 'critères doivent être complétés'
                      : 'critère doit être complété'}{' '}
                    :
                  </p>
                  <ul className="space-y-2">
                    {point.criteres.slice(0, VISIBLE_CRITERIA).map(({ numero, blocage }) => (
                      <li key={numero} className="text-sm">
                        <button
                          type="button"
                          className="editorial-inline-link ui-focus text-left font-medium"
                          onClick={() => onOpenSource(resolveFactuelleSource(blocage))}
                        >
                          Critère {numero}
                          {grid?.criteriaByNumber.get(numero)
                            ? ` — ${grid.criteriaByNumber.get(numero)?.libelle}`
                            : ''}
                        </button>
                        <UsefulFor categories={usefulCategories(blocage)} />
                      </li>
                    ))}
                  </ul>
                  {hidden > 0 && (
                    <p className="text-sm text-muted">
                      et {hidden} {hidden > 1 ? 'autres critères' : 'autre critère'}.
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="min-h-11 w-full sm:w-auto"
                    onClick={() => onShowCriteria(numbers)}
                  >
                    Afficher dans la grille
                  </Button>
                </div>
              );
            }

            const { blocage } = point;
            const detail = context(blocage);
            return (
              <div
                key={blocage.cle}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
              >
                <p className="text-sm text-gray-700">
                  {blocage.message}
                  {detail && <span className="block text-muted">{detail}</span>}
                  <UsefulFor categories={usefulCategories(blocage)} />
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="min-h-11 w-full shrink-0 lg:w-auto"
                  onClick={() => onOpenSource(resolveFactuelleSource(blocage))}
                >
                  {blocage.code.endsWith('_MANQUANT') || blocage.code.endsWith('_MANQUANTE')
                    ? 'Renseigner'
                    : 'Modifier'}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function CategorySelectors({
  comparaison,
  consulted,
  onSelect,
}: {
  comparaison: ComparaisonFactuelle;
  consulted: string;
  onSelect: (category: string) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = comparaison.categories.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    const entry = next === null ? undefined : comparaison.categories[next];
    if (!entry || next === null) return;
    event.preventDefault();
    onSelect(entry.categorie);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Résultat par catégorie"
      className="factuelle-category-selectors"
    >
      {comparaison.categories.map((entry, index) => {
        const synthese = syntheseCategorie(entry);
        const selected = entry.categorie === consulted;
        return (
          <button
            key={entry.categorie}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="factuelle-category-selector ui-focus"
            data-success={synthese.atteint || undefined}
            onClick={() => onSelect(entry.categorie)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-base font-semibold text-ink">
                {formatCategory(entry.categorie)}
              </span>
              {entry.categorie === comparaison.categorie_demandee && (
                <span className="factuelle-auto-badge">Demandée</span>
              )}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium ${
                synthese.atteint ? 'text-success-500' : 'text-alert-500'
              }`}
            >
              {synthese.atteint ? (
                <Check aria-hidden="true" className="h-4 w-4" />
              ) : (
                <X aria-hidden="true" className="h-4 w-4" />
              )}
              {synthese.atteint ? 'Classement atteint' : 'Classement non atteint'}
            </span>
            {synthese.details.length > 0 && (
              <span className="text-xs leading-relaxed text-muted">
                {synthese.details.join(' • ')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function InvalidCriteria({
  title,
  criteria,
  evaluation,
  onShowCriteria,
  onOpenSource,
}: {
  title: string;
  criteria: CritereNonValide[];
  evaluation: EvaluationFactuelle | null;
  onShowCriteria: (numbers: number[]) => void;
  onOpenSource: (source: FactuelleSource) => void;
}) {
  return (
    <div className="classement-result-diagnostic">
      <h4 className="text-lg font-semibold text-ink">{title}</h4>
      <div className="mt-5 divide-y divide-ink/10">
        {criteria.map((criterion) => {
          // Automatique : ses faits, même connus et quelle que soit la catégorie consultée.
          const source = criterionSource(criterion.numero, evaluation);
          return (
            <div
              key={criterion.numero}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-copper">
                  Critère {criterion.numero}
                  {criterion.nonCompensable && (
                    <span className="ml-2 normal-case tracking-normal text-alert-500">
                      · Non compensable
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-gray-900">
                  {criterion.libelle}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 lg:shrink-0">
                <span className="text-sm font-medium text-muted">
                  {criterion.points === undefined
                    ? 'Points non disponibles'
                    : formatPoints(criterion.points)}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="min-h-11 whitespace-nowrap"
                  onClick={() =>
                    source.kind === 'critere'
                      ? onShowCriteria([criterion.numero])
                      : onOpenSource(source)
                  }
                >
                  {SOURCE_LABELS[source.kind]}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Détail en lecture seule de la catégorie consultée : points, compensation et critères non validés. */
function CategoryDetail({
  entry,
  evaluation,
  onExportPdf,
  onShowCriteria,
  onOpenSource,
  onReturnToPieces,
  onReturnToGrid,
}: {
  entry: ComparaisonCategorie;
  evaluation: EvaluationFactuelle | null;
  onExportPdf: (entry: ComparaisonCategorie) => void;
  onShowCriteria: (numbers: number[]) => void;
  onOpenSource: (source: FactuelleSource) => void;
  onReturnToPieces: () => void;
  onReturnToGrid: () => void;
}) {
  const { rapport } = entry;
  const success = rapport.resultat;
  const label = formatStars(entry.categorie);
  const invalid = criteresNonValides(entry);

  return (
    <div className="classement-result">
      <div
        className={`classement-result-verdict ${success ? 'bg-surface-sage' : 'bg-surface-warm'}`}
        role="status"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col">
            <p className="simulator-eyebrow">Résultat de la simulation</p>
            <h3 className="max-w-2xl font-playfair text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl">
              {success
                ? `Le classement ${label} semble atteint`
                : `Le classement ${label} ne semble pas encore atteint`}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Ce résultat est une estimation basée sur vos réponses. Seule une visite officielle
              permet de confirmer le classement.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold ${
                success ? 'text-success-500' : 'text-alert-500'
              }`}
            >
              {success && <CheckCircle2 size={15} aria-hidden="true" />}
              {success ? 'Classement atteint' : 'Classement non atteint'}
            </span>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="min-h-11 w-full gap-2 sm:w-auto"
              onClick={() => onExportPdf(entry)}
            >
              <FileDown aria-hidden="true" className="h-4 w-4" />
              Télécharger le résultat {formatCategory(entry.categorie)}
            </Button>
          </div>
        </div>
      </div>

      <div className="classement-result-scores">
        <ResultScoreCard
          title="Points obligatoires"
          obtained={rapport.points_obligatoires_obtenus}
          available={rapport.points_totaux_obligatoires}
          target={rapport.points_minimaux_obligatoires}
          reached={rapport.points_obligatoires_atteints}
        />
        <ResultScoreCard
          title="Points à la carte"
          obtained={rapport.points_optionnels_obtenus}
          available={rapport.points_optionnels_disponibles}
          target={rapport.points_optionnels_a_atteindre}
          reached={rapport.points_optionnels_atteints}
        />
      </div>

      {rapport.points_obligatoires_a_compenser > 0 && (
        <p className="px-5 pt-5 text-sm text-muted md:px-7">
          Compensation : {formatPoints(rapport.points_obligatoires_a_compenser)} obligatoires à
          compenser, déjà inclus dans l’objectif à la carte.
        </p>
      )}

      {invalid.obligatoires.length > 0 && (
        <InvalidCriteria
          title="Critères obligatoires non validés"
          criteria={invalid.obligatoires}
          evaluation={evaluation}
          onShowCriteria={onShowCriteria}
          onOpenSource={onOpenSource}
        />
      )}
      {!rapport.points_optionnels_atteints && invalid.aLaCarte.length > 0 && (
        <InvalidCriteria
          title="Critères à la carte non validés"
          criteria={invalid.aLaCarte}
          evaluation={evaluation}
          onShowCriteria={onShowCriteria}
          onOpenSource={onOpenSource}
        />
      )}

      <div className="flex flex-col gap-3 border-t border-ink/10 px-5 py-5 sm:flex-row md:px-7">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onReturnToGrid}
        >
          Modifier mes réponses
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onReturnToPieces}
        >
          Retour aux pièces
        </Button>
      </div>
    </div>
  );
}

function ComparaisonPanel({
  comparaison,
  evaluation,
  onExportPdf,
  onShowCriteria,
  onOpenSource,
  onReturnToPieces,
  onReturnToGrid,
}: {
  comparaison: ComparaisonFactuelle;
  evaluation: EvaluationFactuelle | null;
  onExportPdf: (entry: ComparaisonCategorie) => void;
  onShowCriteria: (numbers: number[]) => void;
  onOpenSource: (source: FactuelleSource) => void;
  onReturnToPieces: () => void;
  onReturnToGrid: () => void;
}) {
  // Navigation en lecture seule : la catégorie demandée se modifie uniquement dans les paramètres.
  const [consulted, setConsulted] = useState<string>(comparaison.categorie_demandee);
  // Nouveau calcul : la catégorie demandée redevient la catégorie consultée par défaut.
  const [shown, setShown] = useState(comparaison);
  if (shown !== comparaison) {
    setShown(comparaison);
    setConsulted(comparaison.categorie_demandee);
  }
  const entry =
    comparaison.categories.find((candidate) => candidate.categorie === consulted) ??
    comparaison.categories[0];

  return (
    <>
      <section className="space-y-3" aria-label="Résultats des cinq catégories">
        <CategorySelectors
          comparaison={comparaison}
          consulted={entry?.categorie ?? consulted}
          onSelect={setConsulted}
        />
      </section>
      {entry && (
        <CategoryDetail
          entry={entry}
          evaluation={evaluation}
          onExportPdf={onExportPdf}
          onShowCriteria={onShowCriteria}
          onOpenSource={onOpenSource}
          onReturnToPieces={onReturnToPieces}
          onReturnToGrid={onReturnToGrid}
        />
      )}
      <div className="simulator-next editorial-focus-inverse">
        <div>
          <h2>Prêt pour une visite officielle ?</h2>
          <p>
            Faites votre demande en ligne et bénéficiez des avantages du classement officiel dès
            maintenant.
          </p>
        </div>
        <div className="simulator-next-actions">
          <Button href="/demande-classement" variant="primary" className="simulator-next-primary">
            Demande de classement
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
          <Button href="/faq" variant="secondary" className="simulator-next-secondary">
            Consulter la FAQ
          </Button>
        </div>
      </div>
    </>
  );
}

/** Résultat FACTUELLE : blocages actionnables, ou cinq synthèses et un seul détail consulté. */
export default function FactuelleResultPanel({
  result,
  snapshot,
  grid,
  onOpenSource,
  onShowCriteria,
  onReturnToPieces,
  onReturnToGrid,
  onExportPdf,
}: FactuelleResultPanelProps) {
  return (
    <>
      {/* Titre de section pour la hiérarchie des titres ; le verdict reste visuellement en tête. */}
      <h2 className="sr-only">Résultat de la simulation</h2>
      {result.status === 'blocked' ? (
        <BlocagesPanel
          verification={result.verification}
          snapshot={snapshot}
          grid={grid}
          onOpenSource={onOpenSource}
          onShowCriteria={onShowCriteria}
        />
      ) : (
        <ComparaisonPanel
          comparaison={result.comparaison}
          evaluation={snapshot.evaluation}
          onExportPdf={onExportPdf}
          onShowCriteria={onShowCriteria}
          onOpenSource={onOpenSource}
          onReturnToPieces={onReturnToPieces}
          onReturnToGrid={onReturnToGrid}
        />
      )}
    </>
  );
}
