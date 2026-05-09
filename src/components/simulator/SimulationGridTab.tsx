import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import {
  getCriterionAnchorId,
  getCriterionByNumber,
  getCriterionStatusForCategory,
  isSurfaceCriterion,
  type GridChapter,
  type GridCriterion,
  type GridSummary,
} from '../../content/simulatorGrid';
import {
  getRapport,
  getVerification,
  submitResponse,
  verifySimulation,
  type CriterionStatus,
  type CriterionValidationStatus,
  type RapportProvisoireDto,
  type ReponseDto,
  type VerificationDto,
} from '../../utils/simulatorApi';

interface SimulationGridTabProps {
  grid: GridSummary;
  simulationId: string;
  responses: ReponseDto[];
  requestedCategory?: string;
  onResponseSaved: (response: ReponseDto) => void;
  onReturnToPieces: () => void;
  onResultVisibleChange: (visible: boolean) => void;
}

interface ProgressSummary {
  totalToTreat: number;
  answeredCount: number;
  requiredUnanswered: GridCriterion[];
  optionalAnsweredCount: number;
  unansweredToTreat: GridCriterion[];
}

interface SectionLink {
  id: string;
  label: string;
}

interface SectionLinkGroup {
  chapterLabel: string;
  links: SectionLink[];
}

const STATUS_LABELS: Record<CriterionStatus, string> = {
  OBLIGATOIRE: 'Obligatoire',
  OPTIONNEL: 'Optionnel',
  NON_APPLICABLE: 'Non applicable',
  ONC: 'Obligatoire non compensable',
};

const SURFACE_CRITERION_MESSAGE =
  'Ce critère est validé automatiquement à partir des surfaces renseignées dans les pièces du logement.';
const RESPONSE_SAVE_MAX_ATTEMPTS = 3;
const RESPONSE_SAVE_RETRY_DELAY_MS = 150;
const RESPONSE_SAVE_ERROR_MESSAGE =
  'La réponse n’a pas pu être enregistrée. Vérifiez votre connexion puis réessayez.';

function isAnswered(response: ReponseDto | undefined): boolean {
  return response?.statut_validation !== undefined;
}

function isRequiredStatus(status: CriterionStatus | undefined): boolean {
  return status === 'OBLIGATOIRE' || status === 'ONC';
}

function getResponsesByCriterionNumber(responses: ReponseDto[]): Map<number, ReponseDto> {
  return new Map(
    responses
      .filter(
        (response): response is ReponseDto & { num_critere: number } =>
          typeof response.num_critere === 'number'
      )
      .map((response) => [response.num_critere, response])
  );
}

function getEffectiveCriterionStatus(
  criterion: GridCriterion,
  response: ReponseDto | undefined,
  requestedCategory: string | undefined
): CriterionStatus | undefined {
  return response?.statut_critere ?? getCriterionStatusForCategory(criterion, requestedCategory);
}

function formatPoints(points: number): string {
  return `${points} ${points > 1 ? 'points' : 'point'}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getCriterionStatusBadgeClassName(status: CriterionStatus | undefined): string {
  switch (status) {
    case 'OPTIONNEL':
      return 'border-primary-200 bg-primary-100 text-primary-500';
    case 'OBLIGATOIRE':
      return 'border-alert-200 bg-alert-100 text-alert-500';
    case 'ONC':
      return 'border-alert-400 bg-alert-400 text-white';
    case 'NON_APPLICABLE':
      return 'border-gray-200 bg-gray-100 text-gray-700';
    default:
      return 'border-gray-200 bg-white text-gray-700';
  }
}

function mergeOptimisticResponses(
  confirmedResponsesByCriterionNumber: Map<number, ReponseDto>,
  optimisticResponsesByCriterionNumber: Map<number, ReponseDto>
): Map<number, ReponseDto> {
  const mergedResponses = new Map(confirmedResponsesByCriterionNumber);
  optimisticResponsesByCriterionNumber.forEach((response, criterionNumber) => {
    mergedResponses.set(criterionNumber, response);
  });
  return mergedResponses;
}

function scrollToElement(id: string, shouldFocus = false) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (shouldFocus && element instanceof HTMLElement) {
    element.focus({ preventScroll: true });
  }
}

function slugifySectionPart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getSectionAnchorId(chapterLabel: string, subChapterLabel: string): string {
  return `section-${slugifySectionPart(chapterLabel)}-${slugifySectionPart(subChapterLabel)}`;
}

function buildSectionLinkGroups(chapters: GridChapter[]): SectionLinkGroup[] {
  return chapters.map((chapter) => ({
    chapterLabel: chapter.libelle,
    links: chapter.sous_chapitres.map((subChapter) => ({
      id: getSectionAnchorId(chapter.libelle, subChapter.libelle),
      label: subChapter.libelle,
    })),
  }));
}

function filterGridChapters(chapters: GridChapter[], query: string): GridChapter[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-FR');
  if (!normalizedQuery) {
    return chapters;
  }

  return chapters
    .map((chapter) => {
      const sous_chapitres = chapter.sous_chapitres
        .map((subChapter) => {
          const rubriques = subChapter.rubriques
            .map((rubrique) => {
              const criteres = rubrique.criteres.filter(
                (criterion) =>
                  String(criterion.num_critere).includes(normalizedQuery) ||
                  criterion.libelle.toLocaleLowerCase('fr-FR').includes(normalizedQuery)
              );

              return { ...rubrique, criteres };
            })
            .filter((rubrique) => rubrique.criteres.length > 0);

          return { ...subChapter, rubriques };
        })
        .filter((subChapter) => subChapter.rubriques.length > 0);

      return { ...chapter, sous_chapitres };
    })
    .filter((chapter) => chapter.sous_chapitres.length > 0);
}

function isCriterionToTreat(
  criterion: GridCriterion,
  response: ReponseDto | undefined,
  requestedCategory: string | undefined
): boolean {
  const status = getEffectiveCriterionStatus(criterion, response, requestedCategory);
  return status !== 'NON_APPLICABLE' && !isSurfaceCriterion(criterion);
}

function buildProgressSummary(
  grid: GridSummary,
  responsesByCriterionNumber: Map<number, ReponseDto>,
  requestedCategory: string | undefined
): ProgressSummary {
  const criteria = [...grid.criteriaByNumber.values()];
  const criteriaToTreat = criteria.filter((criterion) =>
    isCriterionToTreat(
      criterion,
      responsesByCriterionNumber.get(criterion.num_critere),
      requestedCategory
    )
  );
  const unansweredToTreat = criteriaToTreat.filter(
    (criterion) => !isAnswered(responsesByCriterionNumber.get(criterion.num_critere))
  );
  const requiredUnanswered = unansweredToTreat.filter((criterion) =>
    isRequiredStatus(
      getEffectiveCriterionStatus(
        criterion,
        responsesByCriterionNumber.get(criterion.num_critere),
        requestedCategory
      )
    )
  );
  const optionalAnsweredCount = criteriaToTreat.filter((criterion) => {
    const response = responsesByCriterionNumber.get(criterion.num_critere);
    const status = getEffectiveCriterionStatus(criterion, response, requestedCategory);
    return status === 'OPTIONNEL' && isAnswered(response);
  }).length;

  return {
    totalToTreat: criteriaToTreat.length,
    answeredCount: criteriaToTreat.length - unansweredToTreat.length,
    requiredUnanswered,
    optionalAnsweredCount,
    unansweredToTreat,
  };
}

function criterionLabelForNumber(grid: GridSummary, number: number): string {
  const criterion = getCriterionByNumber(grid, number);
  return criterion ? `Critère ${number} - ${criterion.libelle}` : `Critère ${number}`;
}

function GridTableOfContents({ groups }: { groups: SectionLinkGroup[] }) {
  return (
    <>
      <div className="lg:hidden">
        <label
          htmlFor="grid-section-select"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Aller à une section
        </label>
        <select
          id="grid-section-select"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          defaultValue=""
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            if (event.target.value) {
              scrollToElement(event.target.value);
              event.target.value = '';
            }
          }}
        >
          <option value="" disabled>
            Choisir une section
          </option>
          {groups.map((group) => (
            <optgroup key={group.chapterLabel} label={group.chapterLabel}>
              {group.links.map((link) => (
                <option key={link.id} value={link.id}>
                  {link.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <aside className="hidden lg:block">
        <Card hover={false} className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col p-4">
          <h3 className="mb-3">Sommaire</h3>
          <nav
            aria-label="Sommaire de la grille"
            className="table-of-contents-scrollbar -mx-1 flex-1 space-y-5 overflow-y-auto px-1 pr-2"
          >
            {groups.map((group) => (
              <div key={group.chapterLabel} className="space-y-2">
                <p className="px-2 text-xs font-semibold uppercase tracking-wide text-themePrimary-1">
                  {group.chapterLabel}
                </p>
                <div className="ml-2 space-y-1 border-l border-primary-200 pl-3">
                  {group.links.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-primary-100 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      onClick={() => scrollToElement(link.id)}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => scrollToElement('grid-top')}
          >
            Remonter en haut
          </Button>
        </Card>
      </aside>
    </>
  );
}

function GridProgressPanel({
  progress,
  onShowUnanswered,
}: {
  progress: ProgressSummary;
  onShowUnanswered: () => void;
}) {
  return (
    <Card hover={false} className="p-4 md:p-5">
      <h3 className="mb-3">Progression</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-textLight">Critères renseignés</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {progress.answeredCount} / {progress.totalToTreat}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-textLight">Obligatoires non renseignés</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {progress.requiredUnanswered.length}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-textLight">Optionnels renseignés</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {progress.optionalAnsweredCount}
          </p>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onShowUnanswered}
            disabled={progress.unansweredToTreat.length === 0}
          >
            Voir les critères non renseignés
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ResponseButton({
  children,
  validation,
  selected,
  disabled = false,
  onClick,
}: {
  children: string;
  validation: CriterionValidationStatus;
  selected: boolean;
  disabled?: boolean;
  onClick?: (() => void) | undefined;
}) {
  const selectedClassNames: Record<CriterionValidationStatus, string> = {
    VALIDE: 'border-success-400 bg-success-400 text-white hover:bg-success-500',
    NON_VALIDE: 'border-alert-400 bg-alert-400 text-white hover:bg-alert-500',
    NON_APPLICABLE: 'border-primary-300 bg-primary-300 text-white hover:bg-primary-400',
  };
  const idleClassNames: Record<CriterionValidationStatus, string> = {
    VALIDE:
      'border-gray-300 bg-white text-gray-800 hover:border-success-200 hover:bg-success-100 hover:text-success-500',
    NON_VALIDE:
      'border-gray-300 bg-white text-gray-800 hover:border-alert-200 hover:bg-alert-100 hover:text-alert-500',
    NON_APPLICABLE:
      'border-gray-300 bg-white text-gray-800 hover:border-primary-200 hover:bg-primary-100 hover:text-primary-500',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      className={`min-h-10 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-default ${
        selected ? selectedClassNames[validation] : idleClassNames[validation]
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CriterionResponseButtons({
  criterion,
  response,
  canAnswerNotApplicable,
  readOnly = false,
  onSave,
}: {
  criterion: GridCriterion;
  response: ReponseDto | undefined;
  canAnswerNotApplicable: boolean;
  readOnly?: boolean;
  onSave: (criterion: GridCriterion, validation: CriterionValidationStatus) => void;
}) {
  const shouldShowNotApplicableButton =
    canAnswerNotApplicable || response?.statut_validation === 'NON_APPLICABLE';

  return (
    <div
      role="group"
      aria-label={`Réponse au critère ${criterion.num_critere}`}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ResponseButton
        validation="VALIDE"
        selected={response?.statut_validation === 'VALIDE'}
        disabled={readOnly}
        onClick={readOnly ? undefined : () => onSave(criterion, 'VALIDE')}
      >
        Oui
      </ResponseButton>
      <ResponseButton
        validation="NON_VALIDE"
        selected={response?.statut_validation === 'NON_VALIDE'}
        disabled={readOnly}
        onClick={readOnly ? undefined : () => onSave(criterion, 'NON_VALIDE')}
      >
        Non
      </ResponseButton>
      {shouldShowNotApplicableButton && (
        <ResponseButton
          validation="NON_APPLICABLE"
          selected={response?.statut_validation === 'NON_APPLICABLE'}
          disabled={readOnly}
          onClick={readOnly ? undefined : () => onSave(criterion, 'NON_APPLICABLE')}
        >
          Non applicable
        </ResponseButton>
      )}
    </div>
  );
}

function GridCriterionCard({
  criterion,
  response,
  requestedCategory,
  onSave,
}: {
  criterion: GridCriterion;
  response: ReponseDto | undefined;
  requestedCategory: string | undefined;
  onSave: (criterion: GridCriterion, validation: CriterionValidationStatus) => void;
}) {
  const status = getEffectiveCriterionStatus(criterion, response, requestedCategory);
  const isBusinessNotApplicable = status === 'NON_APPLICABLE';
  const isSurfaceReadOnly = isSurfaceCriterion(criterion);
  const isReadOnly = isBusinessNotApplicable || isSurfaceReadOnly;
  const canAnswerNotApplicable = criterion.peut_etre_non_applicable && !isBusinessNotApplicable;

  return (
    <Card
      id={getCriterionAnchorId(criterion.num_critere)}
      hover={false}
      className="scroll-mt-28 p-4"
      tabIndex={-1}
      data-testid={`criterion-card-${criterion.num_critere}`}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
              Critère {criterion.num_critere}
            </p>
            <h6 className="mt-2 text-base font-semibold leading-snug text-gray-900 md:text-[17px]">
              {criterion.libelle}
            </h6>
          </div>
          <div className="flex w-full flex-wrap gap-2 md:w-80 md:shrink-0 md:justify-end">
            <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">
              {formatPoints(criterion.points)}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${getCriterionStatusBadgeClassName(status)}`}
            >
              {status ? STATUS_LABELS[status] : 'Statut non renseigné'}
            </span>
          </div>
        </div>

        {isSurfaceReadOnly && (
          <>
            <p className="rounded-lg border border-primary-200 bg-primary-100 p-3 text-sm text-primary-500">
              {SURFACE_CRITERION_MESSAGE}
            </p>
            <CriterionResponseButtons
              criterion={criterion}
              response={response}
              canAnswerNotApplicable={canAnswerNotApplicable}
              readOnly
              onSave={onSave}
            />
          </>
        )}

        {isBusinessNotApplicable && !isSurfaceReadOnly && (
          <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            Ce critère n’est pas applicable à cette simulation.
          </p>
        )}

        {!isReadOnly && (
          <CriterionResponseButtons
            criterion={criterion}
            response={response}
            canAnswerNotApplicable={canAnswerNotApplicable}
            onSave={onSave}
          />
        )}
      </div>
    </Card>
  );
}

function GridChapterSection({
  chapters,
  responsesByCriterionNumber,
  requestedCategory,
  onSave,
}: {
  chapters: GridChapter[];
  responsesByCriterionNumber: Map<number, ReponseDto>;
  requestedCategory: string | undefined;
  onSave: (criterion: GridCriterion, validation: CriterionValidationStatus) => void;
}) {
  if (chapters.length === 0) {
    return (
      <Card hover={false} className="p-5">
        <p className="text-sm text-textLight">Aucun critère ne correspond à votre recherche.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      {chapters.map((chapter, chapterIndex) => (
        <section
          key={chapter.libelle}
          className="space-y-6 border-t border-gray-200 pt-8 first:border-t-0 first:pt-0"
          aria-labelledby={`chapter-${chapterIndex + 1}-title`}
        >
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
              Chapitre
            </p>
            <h3
              id={`chapter-${chapterIndex + 1}-title`}
              className="mt-1 text-xl font-semibold leading-snug text-gray-950"
            >
              {chapter.libelle}
            </h3>
          </div>

          <div className="space-y-8">
            {chapter.sous_chapitres.map((subChapter, subChapterIndex) => (
              <section
                key={subChapter.libelle}
                id={getSectionAnchorId(chapter.libelle, subChapter.libelle)}
                className="scroll-mt-28 space-y-5"
                aria-labelledby={`section-${chapterIndex + 1}-${subChapterIndex + 1}-title`}
              >
                <div className="border-l-4 border-primary-200 pl-3">
                  <h4
                    id={`section-${chapterIndex + 1}-${subChapterIndex + 1}-title`}
                    className="text-base font-semibold leading-snug text-gray-900 md:text-lg"
                  >
                    {subChapter.libelle}
                  </h4>
                </div>

                {subChapter.rubriques.map((rubrique) => (
                  <div key={`${subChapter.libelle}-${rubrique.libelle}`} className="space-y-3">
                    {rubrique.libelle.trim() && (
                      <h5 className="text-sm font-semibold uppercase tracking-wide text-textLight">
                        {rubrique.libelle}
                      </h5>
                    )}
                    {rubrique.criteres.map((criterion) => (
                      <GridCriterionCard
                        key={criterion.num_critere}
                        criterion={criterion}
                        response={responsesByCriterionNumber.get(criterion.num_critere)}
                        requestedCategory={requestedCategory}
                        onSave={onSave}
                      />
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CriteriaList({
  grid,
  title,
  criterionNumbers,
  onGoToCriterion,
}: {
  grid: GridSummary;
  title: string;
  criterionNumbers: number[];
  onGoToCriterion: (number: number) => void;
}) {
  if (criterionNumbers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4>{title}</h4>
      <div className="space-y-2">
        {criterionNumbers.map((number) => (
          <button
            key={number}
            type="button"
            className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
            onClick={() => onGoToCriterion(number)}
          >
            {criterionLabelForNumber(grid, number)}
          </button>
        ))}
      </div>
    </div>
  );
}

function SimulationVerificationIssues({
  grid,
  verification,
  onGoToCriterion,
}: {
  grid: GridSummary;
  verification: VerificationDto;
  onGoToCriterion: (number: number) => void;
}) {
  const requiredNumbers = verification.criteres_obligatoires_a_cocher?.criteres_non_coches ?? [];
  const optionalNumbers = verification.criteres_optionnels_a_cocher?.criteres_non_coches ?? [];
  const hasBlockers = verification.nb_couchages_suffisants === false || requiredNumbers.length > 0;

  return (
    <Card hover={false} className="border-alert-200 bg-alert-100 p-4 md:p-5">
      <h3 className="mb-3 text-gray-900">Il reste des éléments à compléter</h3>
      <p className="mb-4 text-sm text-alert-500">
        {hasBlockers
          ? 'Des points bloquants restent à traiter avant le calcul du résultat.'
          : 'Aucun point bloquant n’est remonté dans cette vérification.'}
      </p>

      <div className="space-y-6">
        {hasBlockers && (
          <div className="space-y-4">
            <h4>Points bloquants</h4>
            {verification.nb_couchages_suffisants === false && (
              <p className="rounded-lg bg-white p-3 text-sm text-alert-500">
                Les couchages renseignés ne semblent pas suffisants pour la capacité d’accueil
                demandée.
              </p>
            )}
            <CriteriaList
              grid={grid}
              title="Certains critères obligatoires n’ont pas encore été renseignés."
              criterionNumbers={requiredNumbers}
              onGoToCriterion={onGoToCriterion}
            />
          </div>
        )}

        {optionalNumbers.length > 0 && (
          <div className="space-y-4 rounded-lg border border-warning-200 bg-warning-100 p-4">
            <h4>Critères optionnels</h4>
            <p className="text-sm text-gray-700">
              Ces critères peuvent améliorer votre score, mais ne sont pas tous obligatoires.
            </p>
            <CriteriaList
              grid={grid}
              title="Critères optionnels non renseignés"
              criterionNumbers={optionalNumbers}
              onGoToCriterion={onGoToCriterion}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function SimulationResultPanel({
  grid,
  rapport,
  onGoToCriterion,
  onReturnToPieces,
}: {
  grid: GridSummary;
  rapport: RapportProvisoireDto;
  onGoToCriterion: (number: number) => void;
  onReturnToPieces: () => void;
}) {
  const success = rapport.resultat === true;
  const invalidRequiredCriteria = rapport.criteres_obligatoires_non_valides ?? [];

  return (
    <Card
      hover={false}
      className={`p-4 md:p-5 ${success ? 'border-success-200 bg-success-100' : 'border-alert-200 bg-alert-100'}`}
    >
      <h3 className="mb-3 text-gray-900">Résultat de la simulation</h3>
      <p className={`text-sm font-semibold ${success ? 'text-success-500' : 'text-alert-500'}`}>
        {success
          ? 'Votre logement semble atteindre le classement demandé.'
          : 'Votre logement ne semble pas encore atteindre le classement demandé.'}
      </p>
      <p className="mt-3 text-sm text-gray-700">
        Ce résultat est une estimation basée sur vos réponses. Seule une visite officielle permet de
        confirmer le classement.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm font-medium text-textLight">Points obligatoires</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {rapport.points_obligatoires_obtenus ?? 0} / {rapport.points_minimaux_obligatoires ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            {rapport.points_obligatoires_atteints ? 'Minimum atteint' : 'Minimum non atteint'}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm font-medium text-textLight">Points optionnels</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {rapport.points_optionnels_obtenus ?? 0} / {rapport.points_optionnels_necessaires ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            {rapport.points_optionnels_atteints ? 'Objectif atteint' : 'Objectif non atteint'}
          </p>
        </div>
      </div>

      {invalidRequiredCriteria.length > 0 && (
        <div className="mt-6">
          <CriteriaList
            grid={grid}
            title="Critères obligatoires non validés"
            criterionNumbers={invalidRequiredCriteria}
            onGoToCriterion={onGoToCriterion}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => scrollToElement('grid-criteria-start')}
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
    </Card>
  );
}

export default function SimulationGridTab({
  grid,
  simulationId,
  responses,
  requestedCategory,
  onResponseSaved,
  onReturnToPieces,
  onResultVisibleChange,
}: SimulationGridTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [optimisticResponsesByCriterionNumber, setOptimisticResponsesByCriterionNumber] = useState(
    () => new Map<number, ReponseDto>()
  );
  const [responseSaveErrorMessage, setResponseSaveErrorMessage] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationDto | null>(null);
  const [rapport, setRapport] = useState<RapportProvisoireDto | null>(null);
  const [isCheckingResult, setIsCheckingResult] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const nextSaveRequestIdRef = useRef(0);
  const latestSaveRequestIdsByCriterionNumberRef = useRef(new Map<number, number>());

  const confirmedResponsesByCriterionNumber = useMemo(
    () => getResponsesByCriterionNumber(responses),
    [responses]
  );
  const responsesByCriterionNumber = useMemo(
    () =>
      mergeOptimisticResponses(
        confirmedResponsesByCriterionNumber,
        optimisticResponsesByCriterionNumber
      ),
    [confirmedResponsesByCriterionNumber, optimisticResponsesByCriterionNumber]
  );
  const sectionLinkGroups = useMemo(() => buildSectionLinkGroups(grid.chapitres), [grid]);
  const filteredChapters = useMemo(
    () => filterGridChapters(grid.chapitres, searchQuery),
    [grid, searchQuery]
  );
  const progress = useMemo(
    () => buildProgressSummary(grid, responsesByCriterionNumber, requestedCategory),
    [grid, requestedCategory, responsesByCriterionNumber]
  );

  function goToCriterion(number: number) {
    scrollToElement(getCriterionAnchorId(number), true);
  }

  function handleShowUnanswered() {
    const firstUnanswered = progress.unansweredToTreat[0];
    if (firstUnanswered) {
      goToCriterion(firstUnanswered.num_critere);
    }
  }

  async function handleSaveResponse(
    criterion: GridCriterion,
    validation: CriterionValidationStatus
  ) {
    const criterionNumber = criterion.num_critere;
    const requestId = nextSaveRequestIdRef.current + 1;
    nextSaveRequestIdRef.current = requestId;
    latestSaveRequestIdsByCriterionNumberRef.current.set(criterionNumber, requestId);

    const confirmedResponse = confirmedResponsesByCriterionNumber.get(criterionNumber);
    const optimisticResponse: ReponseDto = {
      ...(confirmedResponse ?? {}),
      num_critere: criterionNumber,
      statut_validation: validation,
    };

    setOptimisticResponsesByCriterionNumber((currentResponses) => {
      const nextResponses = new Map(currentResponses);
      nextResponses.set(criterionNumber, optimisticResponse);
      return nextResponses;
    });
    setResponseSaveErrorMessage(null);
    setVerification(null);
    setRapport(null);
    onResultVisibleChange(false);

    for (let attempt = 1; attempt <= RESPONSE_SAVE_MAX_ATTEMPTS; attempt += 1) {
      try {
        const savedResponse = await submitResponse(simulationId, {
          num_critere: criterionNumber,
          statut_validation: validation,
        });

        if (latestSaveRequestIdsByCriterionNumberRef.current.get(criterionNumber) !== requestId) {
          return;
        }

        onResponseSaved({
          ...savedResponse,
          num_critere: savedResponse.num_critere ?? criterionNumber,
          statut_validation: savedResponse.statut_validation ?? validation,
        });
        setOptimisticResponsesByCriterionNumber((currentResponses) => {
          const nextResponses = new Map(currentResponses);
          nextResponses.delete(criterionNumber);
          return nextResponses;
        });
        return;
      } catch {
        if (latestSaveRequestIdsByCriterionNumberRef.current.get(criterionNumber) !== requestId) {
          return;
        }

        if (attempt < RESPONSE_SAVE_MAX_ATTEMPTS) {
          await delay(RESPONSE_SAVE_RETRY_DELAY_MS);
        }
      }
    }

    if (latestSaveRequestIdsByCriterionNumberRef.current.get(criterionNumber) !== requestId) {
      return;
    }

    setOptimisticResponsesByCriterionNumber((currentResponses) => {
      const nextResponses = new Map(currentResponses);
      nextResponses.delete(criterionNumber);
      return nextResponses;
    });
    setResponseSaveErrorMessage(RESPONSE_SAVE_ERROR_MESSAGE);
  }

  async function handleCheckResult() {
    setIsCheckingResult(true);
    setResultError(null);
    setResponseSaveErrorMessage(null);
    setVerification(null);

    try {
      const isValid = await verifySimulation(simulationId);
      if (!isValid) {
        const nextVerification = await getVerification(simulationId);
        setVerification(nextVerification);
        setRapport(null);
        onResultVisibleChange(false);
        return;
      }

      const nextRapport = await getRapport(simulationId);
      setRapport(nextRapport);
      setVerification(null);
      onResultVisibleChange(true);
    } catch {
      setResultError('Le résultat n’a pas pu être calculé pour le moment. Veuillez réessayer.');
      onResultVisibleChange(false);
    } finally {
      setIsCheckingResult(false);
    }
  }

  return (
    <div id="grid-top" className="space-y-6">
      <Card hover={false} className="p-4 md:p-5">
        <h2 className="mb-3">Grille de contrôle</h2>
        <p className="max-w-3xl text-sm text-textLight">
          Les réponses portent sur les équipements réellement présents dans le logement.
        </p>
      </Card>

      <GridProgressPanel progress={progress} onShowUnanswered={handleShowUnanswered} />

      {responseSaveErrorMessage && (
        <div
          className="rounded-card border border-alert-200 bg-alert-100 p-4 text-sm text-alert-500"
          role="alert"
          aria-live="assertive"
        >
          {responseSaveErrorMessage}
        </div>
      )}

      {verification && (
        <SimulationVerificationIssues
          grid={grid}
          verification={verification}
          onGoToCriterion={goToCriterion}
        />
      )}

      {rapport && (
        <SimulationResultPanel
          grid={grid}
          rapport={rapport}
          onGoToCriterion={goToCriterion}
          onReturnToPieces={onReturnToPieces}
        />
      )}

      {resultError && (
        <div className="rounded-card border border-alert-200 bg-alert-100 p-4 text-sm text-alert-500">
          {resultError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <GridTableOfContents groups={sectionLinkGroups} />

        <div className="space-y-6">
          <Input
            label="Rechercher un critère"
            name="gridSearch"
            value={searchQuery}
            placeholder="Ex. Critère 23 ou télévision"
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div id="grid-criteria-start">
            <GridChapterSection
              chapters={filteredChapters}
              responsesByCriterionNumber={responsesByCriterionNumber}
              requestedCategory={requestedCategory}
              onSave={(criterion, validation) => void handleSaveResponse(criterion, validation)}
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={isCheckingResult}
              onClick={() => void handleCheckResult()}
            >
              {isCheckingResult ? 'Calcul du résultat...' : 'Voir le résultat de ma simulation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
