import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Euro } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { parseCommuneIndexDataset, type CommuneIndexEntry } from '../../content/local/communeIndex';
import {
  getPricingProfile,
  type PricingProfile,
  type PricingProfileId,
} from '../../content/local/pricing';
import type { DepartmentPricingResolutionConfig } from '../../content/local/types';
import {
  normalizeLocalitySearchTerm,
  prepareLocalitySearch,
  searchPreparedLocalities,
  type LocalitySearchItem,
} from '../../utils/localitySearch';

const MAX_LOCALITY_SUGGESTIONS = 8;

interface DepartmentPricingSectionProps {
  config: DepartmentPricingResolutionConfig;
  presentation?: 'section' | 'panel';
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

export default function DepartmentPricingSection({
  config,
  presentation = 'section',
}: DepartmentPricingSectionProps) {
  const [communes, setCommunes] = useState<CommuneIndexEntry[] | null>(null);
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [resolution, setResolution] = useState<PricingResolution | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const isInputFocusedRef = useRef(false);
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
  const Heading = presentation === 'panel' ? 'h3' : 'h2';

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!query.trim() || resolution || !isInputFocusedRef.current) {
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

    fetch(config.communeIndexUrl, { signal: controller.signal })
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
    isInputFocusedRef.current = true;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    requestCommunes();
    if (suggestions.length > 0) {
      setIsListOpen(true);
      setHighlightedIndex(0);
    }
  }

  function handleInputBlur() {
    isInputFocusedRef.current = false;
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

  const content = (
    <>
      <div className="local-v6-pricing-eyebrow">
        <Euro className="h-4 w-4" aria-hidden="true" />
        Tarifs
      </div>
      <Heading className={presentation === 'panel' ? 'local-v6-pricing-title' : 'mb-5'}>
        {presentation === 'panel' ? 'Sélectionnez votre commune' : config.title}
      </Heading>
      <p
        className={
          presentation === 'panel'
            ? 'local-v6-pricing-intro'
            : 'mb-8 max-w-5xl text-textLight leading-comfortable'
        }
      >
        {config.intro}
      </p>

      <Card
        hover={false}
        className={presentation === 'panel' ? 'local-v6-pricing-search' : 'mb-8 p-6'}
      >
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
              highlightedIndex >= 0 ? `department-pricing-option-${highlightedIndex}` : undefined
            }
            aria-busy={isLoadingCommunes}
            className="ui-field"
          />
          {isListOpen && suggestions.length > 0 && (
            <ul
              id={listId}
              role="listbox"
              className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-editorial border border-ink/15 bg-white shadow-[0_12px_30px_rgb(var(--color-ink)/0.12)]"
            >
              {suggestions.map((item, index) => (
                <li
                  id={`department-pricing-option-${index}`}
                  key={item.id}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  className={`cursor-pointer px-4 py-3 text-sm ${
                    highlightedIndex === index
                      ? 'bg-surface-neutral text-ink'
                      : 'text-ink hover:bg-surface-hover'
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
        <p className="mt-3 text-sm leading-comfortable text-muted">
          Votre meublé se situe dans un autre département ?{' '}
          <Link to="/zones-intervention" className="editorial-inline-link">
            Découvrez toutes nos zones d’intervention.
          </Link>
        </p>
        {isLoadingCommunes && (
          <p className="local-v6-pricing-feedback" role="status">
            Chargement des communes…
          </p>
        )}
        {loadingError && !isLoadingCommunes && (
          <p className="local-v6-pricing-feedback local-v6-pricing-error" role="alert">
            {loadingError}{' '}
            <button type="button" onClick={requestCommunes}>
              Réessayer
            </button>
          </p>
        )}
        {communes &&
          !resolution &&
          normalizeLocalitySearchTerm(query) &&
          suggestions.length === 0 && (
            <p className="local-v6-pricing-feedback" role="status">
              Commune introuvable dans notre liste.{' '}
              <Link to="/demande-classement" className="editorial-inline-link">
                Indiquez votre adresse dans une demande
              </Link>{' '}
              pour vérifier les possibilités d’intervention.
            </p>
          )}
      </Card>

      {resolution && resolvedPricingProfile && (
        <LocalPricingProfileSummary
          pricingProfile={resolvedPricingProfile}
          localityLabel={resolution.label}
        />
      )}
      {!resolution && (
        <p className="local-v6-pricing-hint">
          Sélectionnez une commune pour découvrir le tarif de votre visite.
        </p>
      )}
    </>
  );

  if (presentation === 'panel') {
    return <div className="local-v6-pricing">{content}</div>;
  }

  return (
    <section className="bg-white py-section">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">{content}</div>
      </div>
    </section>
  );
}

export function LocalPricingProfileSummary({
  pricingProfile,
  localityLabel,
  presentation = 'picker',
}: {
  pricingProfile: PricingProfile;
  localityLabel?: string;
  presentation?: 'direct' | 'picker';
}) {
  return (
    <div
      className={`local-v6-pricing-result ${
        presentation === 'direct' ? 'local-v6-pricing-result-direct' : ''
      }`}
      aria-live="polite"
    >
      {localityLabel && <p className="local-v6-pricing-locality">Votre meublé à {localityLabel}</p>}
      {presentation === 'picker' && pricingProfile.note && (
        <p className="local-v6-pricing-note">{pricingProfile.note}</p>
      )}
      <div className="local-v6-pricing-public">
        <span>{pricingProfile.standard.label}</span>
        <p className="local-v6-pricing-amount">
          {pricingProfile.standard.amount} <small>{pricingProfile.standard.qualifier}</small>
        </p>
      </div>
      {pricingProfile.partner && (
        <div className="local-v6-pricing-partner">
          <strong>
            {pricingProfile.partner.amount} {pricingProfile.partner.qualifier}
          </strong>
          <p>
            Si vous êtes adhérent à un office de tourisme partenaire d’Etoilys.
            {pricingProfile.partner.conditions && <> {pricingProfile.partner.conditions}</>}
          </p>
        </div>
      )}
      {pricingProfile.multiProperty && (
        <details className="local-v6-pricing-multiple">
          <summary>Plusieurs logements dans le même secteur ?</summary>
          <dl>
            {pricingProfile.multiProperty.rows.map((row) => (
              <div key={row.key}>
                <dt>{row.label}</dt>
                <dd>{row.amount} TTC</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      <p className="local-v6-pricing-note">
        La possibilité d’intervention est confirmée avec vous avant de fixer la visite.
      </p>
      <Button href="/demande-classement" className="local-v6-pricing-cta">
        Demander mon classement
      </Button>
    </div>
  );
}
