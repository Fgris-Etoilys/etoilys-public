import { type KeyboardEvent, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Euro } from 'lucide-react';
import Card from '../ui/Card';
import { getActiveDepartmentInterventionAreas } from '../../content/local/registry';
import { getPricingProfile, type PricingProfileId } from '../../content/local/pricing';
import type {
  DepartmentAreaId,
  DepartmentInterventionArea,
  DepartmentPricingLocality,
  DepartmentPricingResolutionConfig,
} from '../../content/local/types';
import {
  buildLocalitySearchSuggestions,
  normalizeLocalitySearchTerm,
  type LocalitySearchItem,
} from '../../utils/localitySearch';
import { LocalTariffsBlock } from './LocalLandingSections';

const MAX_LOCALITY_SUGGESTIONS = 8;

interface DepartmentPricingSectionProps {
  currentDepartmentId: DepartmentAreaId;
  config: DepartmentPricingResolutionConfig;
}

interface PricingSearchItem extends LocalitySearchItem {
  locality: DepartmentPricingLocality;
}

type PricingResolution =
  | {
      kind: 'covered';
      label: string;
      pricingProfileId: PricingProfileId;
    }
  | {
      kind: 'covered-other-department';
      department: DepartmentInterventionArea;
    }
  | {
      kind: 'uncovered-department';
      departmentCode: string;
    }
  | {
      kind: 'unknown-locality';
    };

function isPostalCodeQuery(query: string): boolean {
  return /^\d+$/.test(query.trim());
}

function getDepartmentCodeFromPostalCode(postalCode: string): string {
  return postalCode.slice(0, 2);
}

function buildSearchItems(localities: readonly DepartmentPricingLocality[]): PricingSearchItem[] {
  return localities.map((locality) => ({
    id: locality.id,
    label: locality.postalCode ? `${locality.label} / ${locality.postalCode}` : locality.label,
    searchKey: normalizeLocalitySearchTerm(`${locality.label} ${locality.postalCode ?? ''}`),
    locality,
  }));
}

export default function DepartmentPricingSection({
  currentDepartmentId,
  config,
}: DepartmentPricingSectionProps) {
  const [query, setQuery] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [resolution, setResolution] = useState<PricingResolution | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const listId = 'department-pricing-locality-listbox';
  const departments = useMemo(() => getActiveDepartmentInterventionAreas(), []);
  const currentDepartment = departments.find((department) => department.id === currentDepartmentId);
  const searchItems = useMemo(() => buildSearchItems(config.searchLocalities), [config]);
  const suggestions = useMemo(
    () => buildLocalitySearchSuggestions(searchItems, query, MAX_LOCALITY_SUGGESTIONS),
    [query, searchItems]
  );
  const resolvedPricingProfile =
    resolution?.kind === 'covered' ? getPricingProfile(resolution.pricingProfileId) : null;

  function resolvePostalCode(postalCode: string): PricingResolution {
    const departmentCode = getDepartmentCodeFromPostalCode(postalCode);

    if (currentDepartment?.departmentCode === departmentCode) {
      return {
        kind: 'covered',
        label: postalCode,
        pricingProfileId: config.overrides[postalCode] ?? config.defaultPricingProfileId,
      };
    }

    const otherDepartment = departments.find(
      (department) =>
        department.departmentCode === departmentCode && department.id !== currentDepartmentId
    );

    if (otherDepartment) {
      return {
        kind: 'covered-other-department',
        department: otherDepartment,
      };
    }

    return {
      kind: 'uncovered-department',
      departmentCode,
    };
  }

  function resolveLocality(locality: DepartmentPricingLocality): PricingResolution {
    return {
      kind: 'covered',
      label: locality.postalCode ? `${locality.label} / ${locality.postalCode}` : locality.label,
      pricingProfileId:
        locality.pricingProfileId ??
        (locality.postalCode ? config.overrides[locality.postalCode] : undefined) ??
        config.defaultPricingProfileId,
    };
  }

  function selectSuggestion(item: PricingSearchItem) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setQuery(item.label);
    setResolution(resolveLocality(item.locality));
    setIsListOpen(false);
    setHighlightedIndex(-1);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setHighlightedIndex(-1);
    setResolution(null);

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setIsListOpen(false);
      return;
    }

    if (isPostalCodeQuery(trimmedValue)) {
      setIsListOpen(false);
      if (trimmedValue.length === 5) {
        setResolution(resolvePostalCode(trimmedValue));
      }
      return;
    }

    const exactMatch = searchItems.find(
      (item) =>
        normalizeLocalitySearchTerm(item.locality.label) ===
        normalizeLocalitySearchTerm(trimmedValue)
    );
    if (exactMatch) {
      setResolution(resolveLocality(exactMatch.locality));
      setIsListOpen(true);
      return;
    }

    const hasSuggestion = buildLocalitySearchSuggestions(searchItems, trimmedValue, 1).length > 0;
    if (!hasSuggestion) {
      setResolution({ kind: 'unknown-locality' });
    }
    setIsListOpen(true);
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

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      const highlightedSuggestion = suggestions[highlightedIndex];
      if (highlightedSuggestion) {
        selectSuggestion(highlightedSuggestion);
      }
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
              Le code postal à 5 chiffres est la référence tarifaire en Dordogne pour cette V1. La
              recherche par commune s’appuie sur les communes de référence disponibles et ne prétend
              pas couvrir toutes les communes administratives du département.
            </p>
            {isPostalCodeQuery(query) && query.trim().length > 0 && query.trim().length < 5 && (
              <p className="mt-2 text-sm text-textLight">
                Continuez la saisie du code postal sur 5 chiffres pour obtenir le tarif.
              </p>
            )}
          </Card>

          {resolution?.kind === 'covered-other-department' && (
            <Card hover={false} className="mb-8 border-primary-200 bg-primary-100 p-6">
              <p className="text-textLight leading-comfortable">
                Ce code postal se situe en {resolution.department.name}. Etoilys intervient
                également dans ce département.
              </p>
              <Link
                to={resolution.department.path}
                className="mt-4 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
              >
                Voir les tarifs en {resolution.department.name}
              </Link>
            </Card>
          )}

          {resolution?.kind === 'uncovered-department' && (
            <Card hover={false} className="mb-8 border-gray-200 bg-gray-50 p-6">
              <p className="text-textLight leading-comfortable">
                Etoilys n’est pas encore implanté dans ce département.
              </p>
            </Card>
          )}

          {resolution?.kind === 'unknown-locality' && (
            <Card hover={false} className="mb-8 border-gray-200 bg-gray-50 p-6">
              <p className="text-textLight leading-comfortable">
                Saisissez un code postal à 5 chiffres pour obtenir le tarif applicable.
              </p>
            </Card>
          )}

          {resolution?.kind === 'covered' && resolvedPricingProfile && (
            <div className="rounded-card border border-gray-200 bg-white p-6 shadow-card">
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-primary-500">
                Tarif applicable pour {resolution.label}
              </p>
              <LocalTariffsBlock pricingProfile={resolvedPricingProfile} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
