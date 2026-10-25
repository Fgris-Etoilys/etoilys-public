import type { GridChapter } from '../content/simulatorGrid';

/** Navigation partagée par les Grilles LEGACY et FACTUELLE : ancres, sommaire, filtre et défilement. */

export interface SectionLink {
  id: string;
  label: string;
}

export interface SectionLinkGroup {
  chapterLabel: string;
  links: SectionLink[];
}

export function scrollToElement(id: string, shouldFocus = false) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (shouldFocus && element instanceof HTMLElement) {
    element.focus({ preventScroll: true });
  }
}

function slugifySectionPart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getSectionAnchorId(chapterLabel: string, subChapterLabel: string): string {
  return `section-${slugifySectionPart(chapterLabel)}-${slugifySectionPart(subChapterLabel)}`;
}

export function buildSectionLinkGroups(chapters: GridChapter[]): SectionLinkGroup[] {
  return chapters.map((chapter) => ({
    chapterLabel: chapter.libelle,
    links: chapter.sous_chapitres.map((subChapter) => ({
      id: getSectionAnchorId(chapter.libelle, subChapter.libelle),
      label: subChapter.libelle,
    })),
  }));
}

export function getSectionIds(groups: SectionLinkGroup[]): string[] {
  return groups.flatMap((group) => group.links.map((link) => link.id));
}

export function filterGridChapters(
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
