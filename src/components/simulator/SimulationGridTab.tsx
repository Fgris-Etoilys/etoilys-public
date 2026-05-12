import { useEffect, useMemo, useRef, useState } from 'react';
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
  submitResponse,
  type CriterionStatus,
  type CriterionValidationStatus,
  type RapportProvisoireDto,
  type ReponseDto,
  type VerificationDto,
} from '../../utils/simulatorApi';

export type SimulationResultState =
  | { kind: 'verification'; verification: VerificationDto }
  | { kind: 'rapport'; rapport: RapportProvisoireDto };

interface SimulationGridTabProps {
  grid: GridSummary;
  simulationId: string;
  responses: ReponseDto[];
  requestedCategory?: string;
  criterionFilterNumbers: number[];
  progressSummary: SimulationGridProgressSummary;
  resultActionLabel: string;
  isCheckingResult: boolean;
  onResponseSaved: (response: ReponseDto) => void;
  onClearCriterionFilter: () => void;
  onCheckResult: () => void;
  onResultReset: () => void;
}

export interface SimulationGridProgressSummary {
  answeredCount: number;
  totalCount: number;
  remainingCount: number;
  missingMandatoryCount: number;
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
  'Ce critère est calculé automatiquement à partir des surfaces renseignées dans les pièces du logement.';
const RESPONSE_SAVE_MAX_ATTEMPTS = 3;
const RESPONSE_SAVE_RETRY_DELAY_MS = 150;
const RESPONSE_SAVE_ERROR_MESSAGE =
  'La réponse n’a pas pu être enregistrée. Vérifiez votre connexion puis réessayez.';

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

function isAnsweredResponse(response: ReponseDto | undefined): boolean {
  return (
    response?.statut_validation === 'VALIDE' ||
    response?.statut_validation === 'NON_VALIDE' ||
    response?.statut_validation === 'NON_APPLICABLE'
  );
}

function getFirstAnswerableRemainingCriterionNumber({
  chapters,
  responsesByCriterionNumber,
  requestedCategory,
}: {
  chapters: GridChapter[];
  responsesByCriterionNumber: Map<number, ReponseDto>;
  requestedCategory: string | undefined;
}): number | null {
  for (const chapter of chapters) {
    for (const subChapter of chapter.sous_chapitres) {
      for (const rubrique of subChapter.rubriques) {
        for (const criterion of rubrique.criteres) {
          const response = responsesByCriterionNumber.get(criterion.num_critere);
          const status = getEffectiveCriterionStatus(criterion, response, requestedCategory);

          if (
            status !== 'NON_APPLICABLE' &&
            !isSurfaceCriterion(criterion) &&
            !isAnsweredResponse(response)
          ) {
            return criterion.num_critere;
          }
        }
      }
    }
  }

  return null;
}

function formatPoints(points: number): string {
  return `${points} ${points > 1 ? 'points' : 'point'}`;
}

function formatMandatoryPoints(points: number): string {
  return `${points} ${points > 1 ? 'points obligatoires' : 'point obligatoire'}`;
}

function formatReportPoints(points: number | undefined): string {
  const safePoints = points ?? 0;
  return `${safePoints} ${safePoints > 1 ? 'points' : 'point'}`;
}

function formatReportScore(obtained: number | undefined, target: number | undefined): string {
  return `${obtained ?? 0} / ${target ?? 0}`;
}

function getMissingPoints(target: number | undefined, obtained: number | undefined): number {
  return Math.max(0, (target ?? 0) - (obtained ?? 0));
}

function formatRequestedCategoryLabel(requestedCategory: string | undefined): string {
  const match = requestedCategory?.match(/^([1-5])\*$/);
  if (!match) {
    return 'demandé';
  }

  const starCount = Number(match[1]);
  return `${starCount} ${starCount > 1 ? 'étoiles' : 'étoile'}`;
}

function getProgressPercentage(obtained: number | undefined, target: number | undefined): number {
  const safeObtained = obtained ?? 0;
  const safeTarget = target ?? 0;

  if (safeTarget <= 0) {
    return safeObtained > 0 ? 100 : 0;
  }

  return Math.min(100, Math.max(0, (safeObtained / safeTarget) * 100));
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

function getSectionIds(groups: SectionLinkGroup[]): string[] {
  return groups.flatMap((group) => group.links.map((link) => link.id));
}

function filterGridChapters(
  chapters: GridChapter[],
  query: string,
  criterionFilterNumbers: number[],
  isCriterionFilterActive: boolean
): GridChapter[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr-FR');
  const filteredCriterionNumbers = new Set(criterionFilterNumbers);

  if (!normalizedQuery && !isCriterionFilterActive) {
    return chapters;
  }

  return chapters
    .map((chapter) => {
      const sous_chapitres = chapter.sous_chapitres
        .map((subChapter) => {
          const rubriques = subChapter.rubriques
            .map((rubrique) => {
              const criteres = rubrique.criteres.filter((criterion) => {
                const matchesCriterionFilter =
                  !isCriterionFilterActive || filteredCriterionNumbers.has(criterion.num_critere);
                const matchesSearch =
                  !normalizedQuery ||
                  String(criterion.num_critere).includes(normalizedQuery) ||
                  criterion.libelle.toLocaleLowerCase('fr-FR').includes(normalizedQuery);

                return matchesCriterionFilter && matchesSearch;
              });

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

function getReportCriterionDetails(grid: GridSummary, number: number) {
  const criterion = getCriterionByNumber(grid, number);

  return {
    number,
    label: criterion?.libelle ?? 'Intitulé non disponible dans la grille',
    points: criterion?.points,
  };
}

function RatioBar({
  isValid,
  reached,
  total,
}: {
  isValid: boolean | undefined;
  reached: number | undefined;
  total: number | undefined;
}) {
  const fillProgress = getProgressPercentage(reached, total);

  return (
    <div
      className="h-3 w-full rounded-full bg-gray-200"
      aria-label={`${formatReportPoints(reached)} obtenus sur ${formatReportPoints(total)}`}
      aria-valuemax={total ?? 0}
      aria-valuemin={0}
      aria-valuenow={Math.min(reached ?? 0, total ?? 0)}
      role="progressbar"
    >
      <div
        className={`h-3 rounded-full ${isValid ? 'bg-success-400' : 'bg-alert-400'} transition-[width] duration-700 ease-out`}
        style={{ width: `${fillProgress}%` }}
      />
    </div>
  );
}

function ResultScoreCard({
  title,
  obtained,
  available,
  target,
  reached,
}: {
  title: string;
  obtained: number | undefined;
  available: number | undefined;
  target: number | undefined;
  reached: boolean | undefined;
}) {
  const missingPoints = getMissingPoints(target, obtained);
  const hasReachedGoal = missingPoints === 0;

  return (
    <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-textLight">{title}</p>
          <p className="mt-2 text-3xl font-semibold leading-none text-gray-900">
            {formatReportScore(obtained, target)}
          </p>
          {available !== undefined && (
            <p className="mt-2 text-sm text-textLight">
              {formatReportPoints(available)} disponibles au total
            </p>
          )}
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold ${
            hasReachedGoal
              ? 'border-success-200 bg-success-100 text-success-500'
              : 'border-alert-200 bg-alert-100 text-alert-500'
          }`}
        >
          {hasReachedGoal ? 'Objectif atteint' : `Il manque ${formatReportPoints(missingPoints)}`}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        <RatioBar isValid={hasReachedGoal || reached} reached={obtained} total={target} />
      </div>
    </div>
  );
}

function GridTableOfContents({
  groups,
  activeSectionId,
  onSectionSelect,
}: {
  groups: SectionLinkGroup[];
  activeSectionId: string | null;
  onSectionSelect: (id: string) => void;
}) {
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
          value={activeSectionId ?? ''}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            if (event.target.value) {
              onSectionSelect(event.target.value);
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
                  {group.links.map((link) => {
                    const isActive = activeSectionId === link.id;

                    return (
                      <button
                        key={link.id}
                        type="button"
                        aria-current={isActive ? 'true' : undefined}
                        className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                          isActive
                            ? 'bg-primary-100 font-semibold text-primary-500'
                            : 'text-gray-700 hover:bg-primary-100 hover:text-primary-500'
                        }`}
                        onClick={() => onSectionSelect(link.id)}
                      >
                        {link.label}
                      </button>
                    );
                  })}
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

function AutomaticCriterionStatus({ response }: { response: ReponseDto | undefined }) {
  const isValid = response?.statut_validation === 'VALIDE';

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        isValid ? 'border-success-200 bg-success-100' : 'border-alert-200 bg-alert-100'
      }`}
    >
      <span className="font-medium text-gray-900">Statut actuel : </span>
      <span className={`font-semibold ${isValid ? 'text-success-500' : 'text-alert-500'}`}>
        {isValid ? 'Validé' : 'Non validé'}
      </span>
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
            <AutomaticCriterionStatus response={response} />
            <p className="rounded-lg border border-primary-200 bg-primary-100 p-3 text-sm text-primary-500">
              {SURFACE_CRITERION_MESSAGE}
            </p>
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
            <h3
              id={`chapter-${chapterIndex + 1}-title`}
              className="text-xl font-semibold leading-snug text-gray-950"
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

export function SimulationVerificationIssues({
  verification,
  sleepingCapacityCount,
  requestedCapacity,
  onShowCriteria,
  onReturnToPieces,
}: {
  verification: VerificationDto;
  sleepingCapacityCount: number;
  requestedCapacity: number | undefined;
  onShowCriteria: (numbers: number[]) => void;
  onReturnToPieces: () => void;
}) {
  const requiredNumbers = verification.criteres_obligatoires_a_cocher?.criteres_non_coches ?? [];
  const optionalNumbers = verification.criteres_optionnels_a_cocher?.criteres_non_coches ?? [];
  const criterionNumbers = [...new Set([...requiredNumbers, ...optionalNumbers])];
  const hasSleepingCapacityIssue = verification.nb_couchages_suffisants === false;
  const hasBathroomIssue = verification.salle_de_bain_presente === false;

  function formatPeopleCount(value: number): string {
    return `${value} ${value > 1 ? 'personnes' : 'personne'}`;
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-card border border-alert-200 bg-alert-100 p-4 text-sm font-semibold text-alert-500 md:p-5"
        role="alert"
      >
        Un ou plusieurs problèmes ont été détectés et doivent être corrigés avant de pouvoir générer
        le rapport.
      </div>

      <Card hover={false} className="p-4 md:p-5">
        <h3 className="mb-4 text-gray-900">Problèmes à corriger</h3>
        <div className="divide-y divide-gray-200">
          {criterionNumbers.length > 0 && (
            <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                {criterionNumbers.length}{' '}
                {criterionNumbers.length > 1
                  ? 'critères n’ont pas encore été renseignés'
                  : 'critère n’a pas encore été renseigné'}
                .
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => onShowCriteria(criterionNumbers)}
              >
                Afficher dans la grille
              </Button>
            </div>
          )}

          {hasSleepingCapacityIssue && (
            <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-gray-700">
                Les pièces que vous avez renseignées permettent actuellement d’accueillir{' '}
                {formatPeopleCount(sleepingCapacityCount)}, alors que la capacité d’accueil indiquée
                est de{' '}
                {requestedCapacity === undefined
                  ? 'la simulation'
                  : formatPeopleCount(requestedCapacity)}
                . Vérifiez les couchages saisis dans les pièces ou corrigez la capacité d’accueil.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full shrink-0 lg:w-auto"
                onClick={onReturnToPieces}
              >
                Retour aux pièces
              </Button>
            </div>
          )}

          {hasBathroomIssue && (
            <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-gray-700">
                Aucune salle de bain n’est renseignée dans les pièces du logement.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full shrink-0 lg:w-auto"
                onClick={onReturnToPieces}
              >
                Retour aux pièces
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export function SimulationResultPanel({
  grid,
  rapport,
  requestedCategory,
  onShowCriteria,
  onReturnToPieces,
  onReturnToGrid,
}: {
  grid: GridSummary;
  rapport: RapportProvisoireDto;
  requestedCategory?: string;
  onShowCriteria: (numbers: number[]) => void;
  onReturnToPieces: () => void;
  onReturnToGrid: () => void;
}) {
  const success = rapport.resultat === true;
  const requestedCategoryLabel = formatRequestedCategoryLabel(requestedCategory);
  const invalidRequiredCriteria = rapport.criteres_obligatoires_non_valides ?? [];
  const invalidRequiredCriterionDetails = invalidRequiredCriteria.map((number) =>
    getReportCriterionDetails(grid, number)
  );
  const missingMandatoryPoints = getMissingPoints(
    rapport.points_minimaux_obligatoires,
    rapport.points_obligatoires_obtenus
  );
  const shouldShowDiagnostic = !success;
  const hasDiagnosticMissingPoints =
    rapport.points_obligatoires_atteints === false && missingMandatoryPoints > 0;
  const requestedClassificationLabel = `le classement ${requestedCategoryLabel}`;
  const resultToneClassNames = success
    ? {
        shell: 'border-success-200 bg-success-100',
        title: 'text-success-500',
        badge: 'border-success-200 bg-white text-success-500',
      }
    : {
        shell: 'border-alert-200 bg-alert-100',
        title: 'text-alert-500',
        badge: 'border-alert-200 bg-white text-alert-500',
      };
  const verdictRole = success ? 'status' : 'alert';

  return (
    <Card hover={false} className={`p-4 md:p-5 ${resultToneClassNames.shell}`}>
      <div
        className="rounded-card border border-white/70 bg-white p-4 shadow-sm md:p-5"
        role={verdictRole}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-textLight">
              Résultat de la simulation
            </p>
            <h3 className={`mt-2 text-xl font-semibold ${resultToneClassNames.title}`}>
              {success
                ? `Le classement ${requestedCategoryLabel} semble atteint`
                : `Le classement ${requestedCategoryLabel} ne semble pas encore atteint`}
            </h3>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-semibold ${resultToneClassNames.badge}`}
          >
            {success ? 'Classement atteint' : 'Classement non atteint'}
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm text-gray-700">
          Ce résultat est une estimation basée sur vos réponses. Seule une visite officielle permet
          de confirmer le classement.
        </p>
        {!success && (
          <p className="mt-3 max-w-3xl text-sm font-medium text-gray-800">
            Vous pouvez améliorer le résultat en vérifiant les critères prioritaires ci-dessous.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ResultScoreCard
          title="Points obligatoires"
          obtained={rapport.points_obligatoires_obtenus}
          available={rapport.points_totaux_obligatoires}
          target={rapport.points_minimaux_obligatoires}
          reached={rapport.points_obligatoires_atteints}
        />
        <ResultScoreCard
          title="Points optionnels"
          obtained={rapport.points_optionnels_obtenus}
          available={rapport.points_optionnels_disponibles}
          target={rapport.points_optionnels_a_atteindre}
          reached={rapport.points_optionnels_atteints}
        />
      </div>

      {shouldShowDiagnostic && (
        <div className="mt-5 rounded-card border border-warning-200 bg-white p-4 shadow-sm md:p-5">
          <h4 className="text-base font-semibold text-gray-900">Critères à corriger en priorité</h4>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Voici les critères obligatoires qui ne sont pas encore validés dans votre simulation.
            </p>
            {rapport.points_obligatoires_atteints === false && missingMandatoryPoints > 0 && (
              <p>
                Il vous manque {formatMandatoryPoints(missingMandatoryPoints)} pour atteindre{' '}
                {requestedClassificationLabel}.
              </p>
            )}
            {!hasDiagnosticMissingPoints && (
              <p>Certains critères doivent encore être vérifiés pour confirmer le résultat.</p>
            )}
            {invalidRequiredCriterionDetails.length > 0 && (
              <p>
                Les points manquants peuvent être obtenus en validant certains critères listés
                ci-dessous.
              </p>
            )}
          </div>

          {invalidRequiredCriterionDetails.length > 0 && (
            <div className="mt-4 divide-y divide-gray-200">
              {invalidRequiredCriterionDetails.map((criterion) => (
                <div
                  key={criterion.number}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
                      Critère {criterion.number}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug text-gray-900">
                      {criterion.label}
                    </p>
                  </div>

                  <div className="grid grid-cols-[7rem_minmax(9rem,1fr)] items-center gap-3 lg:w-[16rem] lg:shrink-0">
                    <span className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                      {criterion.points === undefined
                        ? 'Points non disponibles'
                        : formatPoints(criterion.points)}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => onShowCriteria([criterion.number])}
                    >
                      Voir dans la grille
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
    </Card>
  );
}

export default function SimulationGridTab({
  grid,
  simulationId,
  responses,
  requestedCategory,
  criterionFilterNumbers,
  progressSummary,
  resultActionLabel,
  isCheckingResult,
  onResponseSaved,
  onClearCriterionFilter,
  onCheckResult,
  onResultReset,
}: SimulationGridTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [optimisticResponsesByCriterionNumber, setOptimisticResponsesByCriterionNumber] = useState(
    () => new Map<number, ReponseDto>()
  );
  const [responseSaveErrorMessage, setResponseSaveErrorMessage] = useState<string | null>(null);
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
  const sectionIds = useMemo(() => getSectionIds(sectionLinkGroups), [sectionLinkGroups]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sectionIds[0] ?? null);
  const displayedCriterionFilterNumbers = criterionFilterNumbers;
  const isCriterionFilterActive = criterionFilterNumbers.length > 0;
  const filteredChapters = useMemo(
    () =>
      filterGridChapters(
        grid.chapitres,
        searchQuery,
        displayedCriterionFilterNumbers,
        isCriterionFilterActive
      ),
    [displayedCriterionFilterNumbers, grid, isCriterionFilterActive, searchQuery]
  );
  const firstRemainingCriterionNumber = useMemo(
    () =>
      getFirstAnswerableRemainingCriterionNumber({
        chapters: grid.chapitres,
        responsesByCriterionNumber,
        requestedCategory,
      }),
    [grid.chapitres, requestedCategory, responsesByCriterionNumber]
  );
  const isGridComplete = progressSummary.remainingCount === 0;

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveSectionId(null);
      return;
    }

    setActiveSectionId((currentSectionId) =>
      currentSectionId && sectionIds.includes(currentSectionId) ? currentSectionId : sectionIds[0]
    );
  }, [sectionIds]);

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio
          )[0];

        if (activeEntry?.target.id) {
          setActiveSectionId(activeEntry.target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  function handleSectionSelect(sectionId: string) {
    setActiveSectionId(sectionId);
    scrollToElement(sectionId);
  }

  function handleContinueGrid() {
    const targetId =
      firstRemainingCriterionNumber === null
        ? 'grid-criteria-start'
        : getCriterionAnchorId(firstRemainingCriterionNumber);

    if (searchQuery.trim()) {
      setSearchQuery('');
    }

    if (isCriterionFilterActive) {
      onClearCriterionFilter();
    }

    window.setTimeout(() => scrollToElement(targetId, true), 0);
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
    onResultReset();

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

  return (
    <div id="grid-top" className="space-y-6">
      <Card hover={false} className="border-primary-300 bg-primary-100 p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500">
              ÉTAPE 2 — GRILLE DE CONTRÔLE
            </span>
            <h2 className="mb-3 mt-4 text-gray-900">Complétez la grille de contrôle</h2>
            <p className="text-sm leading-comfortable text-primary-500">
              Renseignez les critères de contrôle selon les équipements, services et
              caractéristiques réellement présents dans votre logement.
            </p>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-primary-200 bg-white p-3">
                <dt className="font-medium text-primary-500">Critères renseignés</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {progressSummary.answeredCount} / {progressSummary.totalCount}
                </dd>
              </div>
              <div className="rounded-lg border border-primary-200 bg-white p-3">
                <dt className="font-medium text-primary-500">Critères restants</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {progressSummary.remainingCount}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:flex-col">
            {!isGridComplete && (
              <Button
                type="button"
                variant="primary"
                className="w-full shrink-0 lg:w-auto"
                onClick={handleContinueGrid}
              >
                Continuer la grille
              </Button>
            )}
            <Button
              type="button"
              variant={isGridComplete ? 'primary' : 'secondary'}
              className={`w-full shrink-0 lg:w-auto ${isGridComplete ? '' : 'bg-white'}`}
              disabled={isCheckingResult}
              onClick={onCheckResult}
            >
              {isCheckingResult ? 'Calcul en cours...' : resultActionLabel}
            </Button>
          </div>
        </div>
      </Card>

      {responseSaveErrorMessage && (
        <div
          className="rounded-card border border-alert-200 bg-alert-100 p-4 text-sm text-alert-500"
          role="alert"
          aria-live="assertive"
        >
          {responseSaveErrorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <GridTableOfContents
          groups={sectionLinkGroups}
          activeSectionId={activeSectionId}
          onSectionSelect={handleSectionSelect}
        />

        <div className="space-y-6">
          <Input
            label="Rechercher un critère"
            name="gridSearch"
            value={searchQuery}
            placeholder="Ex. Critère 23 ou télévision"
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          {isCriterionFilterActive && (
            <div
              className="flex flex-col gap-3 rounded-card border border-primary-200 bg-primary-100 p-4 text-sm text-primary-500 sm:flex-row sm:items-center sm:justify-between"
              role="status"
            >
              <p>
                La grille affiche uniquement {displayedCriterionFilterNumbers.length}{' '}
                {displayedCriterionFilterNumbers.length > 1
                  ? 'critères signalés dans le résultat'
                  : 'critère signalé dans le résultat'}
                .
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full border-primary-300 bg-white sm:w-auto"
                onClick={onClearCriterionFilter}
              >
                Afficher toute la grille
              </Button>
            </div>
          )}

          <div id="grid-criteria-start">
            <GridChapterSection
              chapters={filteredChapters}
              responsesByCriterionNumber={responsesByCriterionNumber}
              requestedCategory={requestedCategory}
              onSave={(criterion, validation) => void handleSaveResponse(criterion, validation)}
            />
          </div>

          <div className="flex flex-col justify-end gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              aria-label="Calculer depuis le bas de la grille"
              disabled={isCheckingResult}
              onClick={onCheckResult}
            >
              {isCheckingResult ? 'Calcul en cours...' : resultActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
