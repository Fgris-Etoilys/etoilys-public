import type { CriteresAides } from '../content/criteresAide';

/** Aides contextuelles des critères, chargées à la demande et partagées par la Grille et les Pièces. */
let criterionHelpCache: CriteresAides | null = null;
let criterionHelpPromise: Promise<CriteresAides> | null = null;
let hasPreloadedCriterionHelpImages = false;

function preloadCriterionHelpImages(criteresAides: CriteresAides) {
  if (hasPreloadedCriterionHelpImages || typeof Image === 'undefined') {
    return;
  }

  hasPreloadedCriterionHelpImages = true;
  const imageSources = new Set(
    Object.values(criteresAides)
      .map((aide) => aide.illustration)
      .filter((illustration): illustration is string => typeof illustration === 'string')
  );

  imageSources.forEach((source) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = source;
  });
}

export function getCachedCriterionHelp(): CriteresAides | null {
  return criterionHelpCache;
}

export function loadCriterionHelp(): Promise<CriteresAides> {
  if (criterionHelpCache) {
    return Promise.resolve(criterionHelpCache);
  }

  criterionHelpPromise ??= import('../content/criteresAide').then(({ criteresAides }) => {
    criterionHelpCache = criteresAides;
    preloadCriterionHelpImages(criteresAides);
    return criteresAides;
  });

  return criterionHelpPromise;
}
