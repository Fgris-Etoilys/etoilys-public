export interface LocalitySearchItem {
  id: string;
  label: string;
  searchKey?: string;
}

export interface PreparedLocalitySearch<TItem extends LocalitySearchItem> {
  item: TItem;
  normalizedName: string;
  normalizedNameTokens: string[];
  searchKey: string;
}

interface ScoredSuggestion<TItem extends LocalitySearchItem> {
  item: TItem;
  tier: number;
  position: number;
  length: number;
}

export function normalizeLocalitySearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`-]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function stripTrailingDepartmentCode(label: string): string {
  return label.replace(/\s*\([0-9A-Z]{2,3}\)\s*$/i, '').trim();
}

export function prepareLocalitySearch<TItem extends LocalitySearchItem>(
  items: readonly TItem[]
): PreparedLocalitySearch<TItem>[] {
  return items.map((item) => {
    const normalizedName = normalizeLocalitySearchTerm(stripTrailingDepartmentCode(item.label));

    return {
      item,
      normalizedName,
      normalizedNameTokens: normalizedName.split(' ').filter(Boolean),
      searchKey: item.searchKey ?? normalizeLocalitySearchTerm(item.label),
    };
  });
}

function isEditDistanceAtMostOneWithSwap(query: string, candidate: string): boolean {
  if (query === candidate) {
    return true;
  }

  const queryLength = query.length;
  const candidateLength = candidate.length;
  const lengthDifference = Math.abs(queryLength - candidateLength);
  if (lengthDifference > 1) {
    return false;
  }

  if (queryLength === candidateLength) {
    const mismatchIndexes: number[] = [];
    for (let index = 0; index < queryLength; index += 1) {
      if (query[index] !== candidate[index]) {
        mismatchIndexes.push(index);
        if (mismatchIndexes.length > 2) {
          return false;
        }
      }
    }

    if (mismatchIndexes.length === 1) {
      return true;
    }

    if (mismatchIndexes.length === 2) {
      const firstIndex = mismatchIndexes[0];
      const secondIndex = mismatchIndexes[1];
      if (firstIndex === undefined || secondIndex === undefined) {
        return false;
      }
      return (
        secondIndex === firstIndex + 1 &&
        query[firstIndex] === candidate[secondIndex] &&
        query[secondIndex] === candidate[firstIndex]
      );
    }

    return false;
  }

  const longer = queryLength > candidateLength ? query : candidate;
  const shorter = queryLength > candidateLength ? candidate : query;

  let longerIndex = 0;
  let shorterIndex = 0;
  let mismatchCount = 0;

  while (longerIndex < longer.length && shorterIndex < shorter.length) {
    if (longer[longerIndex] === shorter[shorterIndex]) {
      longerIndex += 1;
      shorterIndex += 1;
      continue;
    }

    mismatchCount += 1;
    if (mismatchCount > 1) {
      return false;
    }
    longerIndex += 1;
  }

  return true;
}

function getFuzzyScore<TItem extends LocalitySearchItem>(
  query: string,
  localitySearch: PreparedLocalitySearch<TItem>
): number | null {
  const candidates = [localitySearch.normalizedName, ...localitySearch.normalizedNameTokens];
  let bestScore: number | null = null;

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (Math.abs(candidate.length - query.length) > 1) {
      continue;
    }
    if (candidate[0] !== query[0]) {
      continue;
    }
    if (!isEditDistanceAtMostOneWithSwap(query, candidate)) {
      continue;
    }

    const score =
      Math.abs(candidate.length - query.length) +
      (candidate === localitySearch.normalizedName ? 0 : 1);
    if (bestScore === null || score < bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}

export function buildLocalitySearchSuggestions<TItem extends LocalitySearchItem>(
  items: readonly TItem[],
  query: string,
  maxSuggestions: number
): TItem[] {
  return searchPreparedLocalities(prepareLocalitySearch(items), query, maxSuggestions);
}

export function searchPreparedLocalities<TItem extends LocalitySearchItem>(
  preparedItems: readonly PreparedLocalitySearch<TItem>[],
  query: string,
  maxSuggestions: number
): TItem[] {
  const normalizedQuery = normalizeLocalitySearchTerm(query);
  if (!normalizedQuery) {
    return [];
  }

  const strictMatches: ScoredSuggestion<TItem>[] = [];

  for (const prepared of preparedItems) {
    const { item, normalizedName, normalizedNameTokens, searchKey } = prepared;
    const searchIndex = searchKey.indexOf(normalizedQuery);
    if (searchIndex < 0) {
      continue;
    }

    if (normalizedName === normalizedQuery) {
      strictMatches.push({ item, tier: 0, position: 0, length: normalizedName.length });
      continue;
    }

    const tokenExactIndex = normalizedNameTokens.findIndex((token) => token === normalizedQuery);
    if (tokenExactIndex >= 0) {
      strictMatches.push({
        item,
        tier: 1,
        position: Math.abs(normalizedName.length - normalizedQuery.length),
        length: normalizedName.length,
      });
      continue;
    }

    if (normalizedName.startsWith(normalizedQuery)) {
      strictMatches.push({ item, tier: 2, position: 0, length: normalizedName.length });
      continue;
    }

    const tokenStartsWithIndex = normalizedNameTokens.findIndex((token) =>
      token.startsWith(normalizedQuery)
    );
    if (tokenStartsWithIndex >= 0) {
      strictMatches.push({
        item,
        tier: 3,
        position: tokenStartsWithIndex,
        length: normalizedName.length,
      });
      continue;
    }

    const cityNameContainsIndex = normalizedName.indexOf(normalizedQuery);
    if (cityNameContainsIndex >= 0) {
      strictMatches.push({
        item,
        tier: 4,
        position: cityNameContainsIndex,
        length: normalizedName.length,
      });
      continue;
    }

    strictMatches.push({
      item,
      tier: 5,
      position: searchIndex,
      length: normalizedName.length,
    });
  }

  strictMatches.sort(
    (left, right) =>
      left.tier - right.tier ||
      left.position - right.position ||
      left.length - right.length ||
      left.item.label.localeCompare(right.item.label, 'fr')
  );

  const picked: TItem[] = [];
  const pickedIds = new Set<string>();
  for (const match of strictMatches) {
    if (!pickedIds.has(match.item.id)) {
      picked.push(match.item);
      pickedIds.add(match.item.id);
    }
    if (picked.length >= maxSuggestions) {
      return picked;
    }
  }

  if (normalizedQuery.length < 4) {
    return picked;
  }

  const fuzzyMatches: ScoredSuggestion<TItem>[] = [];
  for (const prepared of preparedItems) {
    if (pickedIds.has(prepared.item.id)) {
      continue;
    }

    const score = getFuzzyScore(normalizedQuery, prepared);
    if (score === null) {
      continue;
    }

    fuzzyMatches.push({
      item: prepared.item,
      tier: 6,
      position: score,
      length: prepared.normalizedName.length,
    });
  }

  fuzzyMatches.sort(
    (left, right) =>
      left.position - right.position ||
      left.length - right.length ||
      left.item.label.localeCompare(right.item.label, 'fr')
  );

  for (const match of fuzzyMatches) {
    picked.push(match.item);
    if (picked.length >= maxSuggestions) {
      break;
    }
  }

  return picked;
}
