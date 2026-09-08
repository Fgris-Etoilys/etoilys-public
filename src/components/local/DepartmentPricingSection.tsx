import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Euro } from 'lucide-react';
import Card from '../ui/Card';
import {
  COMMUNE_INDEX_URL,
  parseCommuneIndexDataset,
  type CommuneIndexEntry,
} from '../../content/local/communeIndex';
import { getActiveDepartmentInterventionAreas } from '../../content/local/registry';
import { getPricingProfile, type PricingProfileId } from '../../content/local/pricing';
import type {
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentPricingResolutionConfig,
} from '../../content/local/types';
import {
  normalizeLocalitySearchTerm,
  prepareLocalitySearch,
  searchPreparedLocalities,
  type LocalitySearchItem,
  type PreparedLocalitySearch,
} from '../../utils/localitySearch';
import { LocalTariffsBlock } from './LocalLandingSections';

const MAX_LOCALITY_SUGGESTIONS = 8;

interface DepartmentPricingSectionProps {
  currentDepartmentId: DepartmentAreaId;
  config: DepartmentPricingResolutionConfig;
}

interface PricingSearchItem extends LocalitySearchItem {
  commune: CommuneIndexEntry;
}

type PricingResolution =
  | {
      kind: 'covered';
      label: string;
      pricingProfileId: PricingProfileId;
    }
  | {
      kind: 'covered-other-department';
      label: string;
      department: DepartmentInterventionArea;
    }
  | {
      kind: 'uncovered-department';
      label: string;
    };

function isFiveDigitQuery(query: string): boolean {
  return /^\d{5}$/.test(query.trim());
}

function buildSearchItems(communes: readonly CommuneIndexEntry[]): PricingSearchItem[] {
  return communes.map((commune) => ({
    id: commune.id,
    label: commune.label,
    searchKey: normalizeLocalitySearchTerm(
      `${commune.label} ${commune.departmentCode} ${commune.postalCodes?.join(' ') ?? ''}`
    ),
    commune,
  }));
}

function mergeSuggestions(
  primary: readonly PricingSearchItem[],
  secondary: readonly PricingSearchItem[]
): PricingSearchItem[] {
  const suggestions: PricingSearchItem[] = [];
  const pickedIds = new Set<string>();

  for (const item of [...primary, ...secondary]) {
    if (pickedIds.has(item.id)) {
      continue;
    }
    suggestions.push(item);
    pickedIds.add(item.id);
    if (suggestions.length >= MAX_LOCALITY_SUGGESTIONS) {
      break;
    }
  }

  return suggestions;
}

export default function DepartmentPricingSection({
  currentDepartmentId,
  config,
}: DepartmentPricingSectionProps) {
  const [communes, setCommunes] = useState<CommuneIndexEntry[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [resolution, setResolution] = useState<PricingResolution | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const listId = 'department-pricing-locality-listbox';
  const departments = useMemo(() => getActiveDepartmentInterventionAreas(), []);
  const currentDepartment = departments.find((department) => department.id === currentDepartmentId);
  const currentDepartmentCode = currentDepartment?.departmentCode;
  const searchItems = useMemo(() => buildSearchItems(communes), [communes]);
  const searchIndex = useMemo(() => prepareLocalitySearch(searchItems), [searchItems]);
  const currentDepartmentSearchIndex = useMemo(
    () =>
      searchIndex.filter((entry) => entry.item.commune.departmentCode === currentDepartmentCode),
    [currentDepartmentCode, searchIndex]
  );

  function buildSuggestionsFromIndex(
    value: string,
    primaryIndex: readonly PreparedLocalitySearch<PricingSearchItem>[],
    fullIndex: readonly PreparedLocalitySearch<PricingSearchItem>[]
  ): PricingSearchItem[] {
    if (!normalizeLocalitySearchTerm(value)) {
      return [];
    }

    const localSuggestions = searchPreparedLocalities(
      primaryIndex,
      value,
      MAX_LOCALITY_SUGGESTIONS
    );
    const nationalSuggestions = searchPreparedLocalities(
      fullIndex,
      value,
      MAX_LOCALITY_SUGGESTIONS * 3
    );

    return mergeSuggestions(localSuggestions, nationalSuggestions);
  }

  const suggestions = useMemo(
    () => buildSuggestionsFromIndex(query, currentDepartmentSearchIndex, searchIndex),
    [currentDepartmentSearchIndex, query, searchIndex]
  );
  const resolvedPricingProfile =
    resolution?.kind === 'covered' ? getPricingProfile(resolution.pricingProfileId) : null;

  useEffect(() => {
    const controller = new AbortController();

    if (typeof fetch !== 'function') {
      setLoadingError("L'index des communes n'a pas pu être chargé.");
      return;
    }

    fetch(COMMUNE_INDEX_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("L'index des communes n'a pas pu être chargé.");
        }
        return response.json();
      })
      .then((payload: unknown) => {
        setCommunes(parseCommuneIndexDataset(payload));
        setLoadingError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLoadingError(
          error instanceof Error ? error.message : "L'index des communes n'a pas pu être chargé."
        );
      });

    return () => {
      controller.abort();
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function resolveCommune(commune: CommuneIndexEntry): PricingResolution {
    if (commune.departmentCode === currentDepartmentCode) {
      const postalCodeOverride = commune.postalCodes
        ?.map((postalCode) => config.overrides[postalCode])
        .find(Boolean);

      return {
        kind: 'covered',
        label: commune.label,
        pricingProfileId:
          config.overrides[commune.id] ?? postalCodeOverride ?? config.defaultPricingProfileId,
      };
    }

    const otherDepartment = departments.find(
      (department) =>
        department.departmentCode === commune.departmentCode &&
        department.id !== currentDepartmentId
    );

    if (otherDepartment) {
      return {
        kind: 'covered-other-department',
        label: commune.label,
        department: otherDepartment,
      };
    }

    return {
      kind: 'uncovered-department',
      label: commune.label,
    };
  }

  function selectSuggestion(item: PricingSearchItem) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setQuery(item.label);
    setResolution(resolveCommune(item.commune));
    setIsListOpen(false);
    setHighlightedIndex(-1);
  }

  function resolveSinglePostalCodeMatch(
    value: string,
    nextSuggestions: readonly PricingSearchItem[]
  ) {
    if (!isFiveDigitQuery(value)) {
      return false;
    }

    const postalMatches = nextSuggestions.filter((item) =>
      item.commune.postalCodes?.includes(value.trim())
    );
    if (postalMatches.length !== 1) {
      return false;
    }

    const [postalMatch] = postalMatches;
    if (!postalMatch) {
      return false;
    }

    setResolution(resolveCommune(postalMatch.commune));
    setIsListOpen(false);
    setHighlightedIndex(-1);
    return true;
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setResolution(null);

    const nextSuggestions = buildSuggestionsFromIndex(
      value,
      currentDepartmentSearchIndex,
      searchIndex
    );
    if (resolveSinglePostalCodeMatch(value, nextSuggestions)) {
      return;
    }

    setIsListOpen(nextSuggestions.length > 0);
    setHighlightedIndex(nextSuggestions.length > 0 ? 0 : -1);
  }

  useEffect(() => {
    if (!query.trim() || resolution) {
      return;
    }

    if (resolveSinglePostalCodeMatch(query, suggestions)) {
      return;
    }

    if (suggestions.length > 0) {
      setIsListOpen(true);
      setHighlightedIndex(0);
    }
  }, [query, resolution, suggestions]);

  function handleInputBlur() {
    closeTimerRef.current = window.setTimeout(() => {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }, 120);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isListOpen && suggestions.length > 0 && event.key === 'ArrowDown') {
      setIsListOpen(true);
      setHighlightedIndex(0);
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter' && suggestions.length > 0) {
      event.preventDefault();
      const selectedSuggestion = suggestions[Math.max(highlightedIndex, 0)];
      if (selectedSuggestion) {
        selectSuggestion(selectedSuggestion);
      }
      return;
    }

    if (!isListOpen || suggestions.length === 0) {
      if (event.key === 'Escape') {
        setIsListOpen(false);
        setHighlightedIndex(-1);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      setHighlightedIndex((previous) => Math.min(previous + 1, suggestions.length - 1));
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      setHighlightedIndex((previous) => Math.max(previous - 1, 0));
      event.preventDefault();
      return;
    }

    if (event.key === 'Escape') {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <section className="bg-white py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-400">
            <Euro className="h-4 w-4" aria-hidden="true" />
            Tarifs
          </div>
          <h2 className="mb-5">{config.title}</h2>
          <p className="mb-8 max-w-5xl text-textLight leading-comfortable">{config.intro}</p>

          <Card hover={false} className="mb-8 p-6">
            <div className="relative max-w-2xl">
              <label
                htmlFor="department-pricing-locality"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {config.inputLabel}
              </label>
              <input
                id="department-pricing-locality"
                type="text"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setIsListOpen(true);
                    setHighlightedIndex(0);
                  }
                }}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                placeholder={config.placeholder}
                autoComplete="off"
                inputMode="search"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isListOpen && suggestions.length > 0}
                aria-controls={listId}
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `department-pricing-option-${highlightedIndex}`
                    : undefined
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              {isListOpen && suggestions.length > 0 && (
                <ul
                  id={listId}
                  role="listbox"
                  className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-card"
                >
                  {suggestions.map((item, index) => (
                    <li
                      id={`department-pricing-option-${index}`}
                      key={item.id}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      className={`cursor-pointer px-4 py-2 text-sm ${
                        highlightedIndex === index
                          ? 'bg-primary-100 text-primary-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectSuggestion(item);
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-sm leading-comfortable text-textLight">
              Vous ne trouvez pas votre commune ? Saisissez son code postal à 5 chiffres.
            </p>
            {loadingError && <p className="mt-2 text-sm text-red-600">{loadingError}</p>}
          </Card>

          {resolution?.kind === 'covered-other-department' && (
            <Card hover={false} className="mb-8 border-primary-200 bg-primary-100 p-6">
              <p className="text-textLight leading-comfortable">
                {resolution.label} se situe en {resolution.department.name}. Etoilys intervient
                également dans ce département.
              </p>
              <Link
                to={resolution.department.path}
                className="mt-4 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
              >
                Voir la page {resolution.department.name}
              </Link>
            </Card>
          )}

          {resolution?.kind === 'uncovered-department' && (
            <Card hover={false} className="mb-8 border-gray-200 bg-gray-50 p-6">
              <p className="text-textLight leading-comfortable">
                {resolution.label} se situe dans un département où Etoilys n’est pas encore
                implanté.
              </p>
            </Card>
          )}

          {resolution?.kind === 'covered' && resolvedPricingProfile && (
            <div className="rounded-card border border-gray-200 bg-white p-6 shadow-card">
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-primary-500">
                Tarif applicable à {resolution.label}
              </p>
              <LocalTariffsBlock pricingProfile={resolvedPricingProfile} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
