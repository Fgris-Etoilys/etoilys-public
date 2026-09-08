import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Euro } from 'lucide-react';
import Card from '../ui/Card';
import {
  COMMUNE_INDEX_URL,
  parseCommuneIndexDataset,
  type CommuneIndexEntry,
} from '../../content/local/communeIndex';
import { getPricingProfile, type PricingProfileId } from '../../content/local/pricing';
import type { DepartmentPricingResolutionConfig } from '../../content/local/types';
import {
  normalizeLocalitySearchTerm,
  prepareLocalitySearch,
  searchPreparedLocalities,
  type LocalitySearchItem,
} from '../../utils/localitySearch';
import { LocalTariffsBlock } from './LocalLandingSections';

const MAX_LOCALITY_SUGGESTIONS = 8;

interface DepartmentPricingSectionProps {
  config: DepartmentPricingResolutionConfig;
}

interface PricingSearchItem extends LocalitySearchItem {
  commune: CommuneIndexEntry;
}

interface PricingResolution {
  label: string;
  pricingProfileId: PricingProfileId;
}

function buildSearchItems(communes: readonly CommuneIndexEntry[]): PricingSearchItem[] {
  return communes.map((commune) => ({
    id: commune.id,
    label: commune.label,
    searchKey: normalizeLocalitySearchTerm(`${commune.label} ${commune.departmentCode}`),
    commune,
  }));
}

export default function DepartmentPricingSection({ config }: DepartmentPricingSectionProps) {
  const [communes, setCommunes] = useState<CommuneIndexEntry[] | null>(null);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [resolution, setResolution] = useState<PricingResolution | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const listId = 'department-pricing-locality-listbox';

  const searchItems = useMemo(() => buildSearchItems(communes ?? []), [communes]);
  const searchIndex = useMemo(() => prepareLocalitySearch(searchItems), [searchItems]);
  const suggestions = useMemo(() => {
    if (!normalizeLocalitySearchTerm(query)) {
      return [];
    }

    return searchPreparedLocalities(searchIndex, query, MAX_LOCALITY_SUGGESTIONS);
  }, [query, searchIndex]);
  const resolvedPricingProfile = resolution ? getPricingProfile(resolution.pricingProfileId) : null;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!query.trim() || resolution) {
      return;
    }

    setIsListOpen(suggestions.length > 0);
    setHighlightedIndex(suggestions.length > 0 ? 0 : -1);
  }, [query, resolution, suggestions]);

  function requestCommunes() {
    if (communes || isLoadingCommunes || controllerRef.current) {
      return;
    }

    if (typeof fetch !== 'function') {
      setLoadingError("L'index des communes n'a pas pu être chargé.");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setIsLoadingCommunes(true);

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
      })
      .finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
        setIsLoadingCommunes(false);
      });
  }

  function resolveCommune(commune: CommuneIndexEntry): PricingResolution {
    return {
      label: commune.label,
      pricingProfileId: config.overrides[commune.id] ?? config.defaultPricingProfileId,
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

  function handleQueryChange(value: string) {
    setQuery(value);
    setResolution(null);
    requestCommunes();
    setIsListOpen(false);
    setHighlightedIndex(-1);
  }

  function handleInputFocus() {
    requestCommunes();
    if (suggestions.length > 0) {
      setIsListOpen(true);
      setHighlightedIndex(0);
    }
  }

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
                onFocus={handleInputFocus}
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
                aria-busy={isLoadingCommunes}
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
              Votre meublé se situe dans un autre département ?{' '}
              <Link
                to="/zones-intervention"
                className="font-medium text-primary-300 underline hover:text-primary-400"
              >
                Découvrez toutes nos zones d’intervention.
              </Link>
            </p>
            {loadingError && <p className="mt-2 text-sm text-red-600">{loadingError}</p>}
          </Card>

          {resolution && resolvedPricingProfile && (
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
