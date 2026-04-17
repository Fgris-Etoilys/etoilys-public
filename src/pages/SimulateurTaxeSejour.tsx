import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import {
  loadTaxeSejourDataset,
  normalizeTaxeSejourSearchTerm,
  type TaxeSejourCity,
  type TaxeSejourDataset,
} from '../content/taxeSejourDataset';
import {
  calculateTaxeSejour,
  type TaxeSejourCalculationOutput,
} from '../utils/taxeSejourCalculator';

interface FormErrors {
  city?: string;
  nightlyPriceHt?: string;
  capacity?: string;
  nights?: string;
}

interface PreparedCitySearch {
  city: TaxeSejourCity;
  normalizedCityName: string;
  normalizedNameTokens: string[];
}

interface ScoredSuggestion {
  city: TaxeSejourCity;
  tier: number;
  position: number;
  length: number;
}

const MAX_CITY_SUGGESTIONS = 8;

function formatEuro(value: number): string {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDelta(value: number): string {
  if (value === 0) {
    return '0,00 €';
  }

  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
}

function getDeltaClassName(delta: number): string {
  if (delta < 0) {
    return 'text-success-500';
  }
  if (delta > 0) {
    return 'text-alert-500';
  }
  return 'text-gray-600';
}

function getNightsLabel(nights: number): string {
  return `${nights} ${nights > 1 ? 'nuits' : 'nuit'}`;
}

function extractCityNameWithoutDepartment(label: string): string {
  return label.replace(/\s*\([0-9A-Z]{2,3}\)\s*$/i, '').trim();
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
      const [firstIndex, secondIndex] = mismatchIndexes;
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

function getFuzzyScore(query: string, citySearch: PreparedCitySearch): number | null {
  const candidates = [citySearch.normalizedCityName, ...citySearch.normalizedNameTokens];
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
      (candidate === citySearch.normalizedCityName ? 0 : 1);
    if (bestScore === null || score < bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}

export default function SimulateurTaxeSejour() {
  const [dataset, setDataset] = useState<TaxeSejourDataset | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cityQuery, setCityQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [nightlyPriceHt, setNightlyPriceHt] = useState('');
  const [capacity, setCapacity] = useState('');
  const [nights, setNights] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [result, setResult] = useState<TaxeSejourCalculationOutput | null>(null);
  const [resultCityLabel, setResultCityLabel] = useState('');
  const [resultNights, setResultNights] = useState(1);

  const nonClasseAmount = useMemo(() => {
    if (!result) {
      return null;
    }
    return result.rows.find((row) => row.category === 'Non classé')?.amount ?? null;
  }, [result]);

  const closeTimerRef = useRef<number | null>(null);
  const listId = 'taxe-sejour-city-listbox';

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    loadTaxeSejourDataset(controller.signal)
      .then((nextDataset) => {
        setDataset(nextDataset);
        setLoadingError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setLoadingError(
          error instanceof Error
            ? error.message
            : 'Le chargement du simulateur taxe de séjour a échoué.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const selectedCity = useMemo(() => {
    if (!dataset || !selectedCityId) {
      return null;
    }
    return dataset.cities.find((city) => city.id === selectedCityId) ?? null;
  }, [dataset, selectedCityId]);

  const normalizedQuery = useMemo(() => normalizeTaxeSejourSearchTerm(cityQuery), [cityQuery]);

  const preparedCitySearch = useMemo(() => {
    if (!dataset) {
      return [] as PreparedCitySearch[];
    }

    return dataset.cities.map((city) => {
      const normalizedCityName = normalizeTaxeSejourSearchTerm(
        extractCityNameWithoutDepartment(city.label)
      );

      return {
        city,
        normalizedCityName,
        normalizedNameTokens: normalizedCityName.split(' ').filter(Boolean),
      };
    });
  }, [dataset]);

  const suggestions = useMemo(() => {
    if (!dataset || !normalizedQuery) {
      return [] as TaxeSejourCity[];
    }

    const strictMatches: ScoredSuggestion[] = [];
    for (const prepared of preparedCitySearch) {
      const { city, normalizedCityName, normalizedNameTokens } = prepared;
      const searchIndex = city.searchKey.indexOf(normalizedQuery);
      if (searchIndex < 0) {
        continue;
      }

      if (normalizedCityName === normalizedQuery) {
        strictMatches.push({
          city,
          tier: 0,
          position: 0,
          length: normalizedCityName.length,
        });
        continue;
      }

      if (normalizedCityName.startsWith(normalizedQuery)) {
        strictMatches.push({
          city,
          tier: 2,
          position: 0,
          length: normalizedCityName.length,
        });
        continue;
      }

      const tokenPrefixIndex = normalizedNameTokens.findIndex((token) => token === normalizedQuery);
      if (tokenPrefixIndex >= 0) {
        strictMatches.push({
          city,
          tier: 1,
          position: Math.abs(normalizedCityName.length - normalizedQuery.length),
          length: normalizedCityName.length,
        });
        continue;
      }

      const tokenStartsWithIndex = normalizedNameTokens.findIndex((token) =>
        token.startsWith(normalizedQuery)
      );
      if (tokenStartsWithIndex >= 0) {
        strictMatches.push({
          city,
          tier: 3,
          position: tokenStartsWithIndex,
          length: normalizedCityName.length,
        });
        continue;
      }

      const cityNameContainsIndex = normalizedCityName.indexOf(normalizedQuery);
      if (cityNameContainsIndex >= 0) {
        strictMatches.push({
          city,
          tier: 4,
          position: cityNameContainsIndex,
          length: normalizedCityName.length,
        });
        continue;
      }

      strictMatches.push({
        city,
        tier: 5,
        position: searchIndex,
        length: normalizedCityName.length,
      });
    }

    strictMatches.sort(
      (left, right) =>
        left.tier - right.tier ||
        left.position - right.position ||
        left.length - right.length ||
        left.city.label.localeCompare(right.city.label, 'fr')
    );

    const picked: TaxeSejourCity[] = [];
    const pickedIds = new Set<string>();
    for (const match of strictMatches) {
      if (!pickedIds.has(match.city.id)) {
        picked.push(match.city);
        pickedIds.add(match.city.id);
      }
      if (picked.length >= MAX_CITY_SUGGESTIONS) {
        return picked;
      }
    }

    if (normalizedQuery.length < 4) {
      return picked;
    }

    const fuzzyMatches: ScoredSuggestion[] = [];
    for (const prepared of preparedCitySearch) {
      if (pickedIds.has(prepared.city.id)) {
        continue;
      }

      const fuzzyScore = getFuzzyScore(normalizedQuery, prepared);
      if (fuzzyScore === null) {
        continue;
      }

      fuzzyMatches.push({
        city: prepared.city,
        tier: 6 + fuzzyScore,
        position: 0,
        length: prepared.normalizedCityName.length,
      });
    }

    fuzzyMatches.sort(
      (left, right) =>
        left.tier - right.tier ||
        left.length - right.length ||
        left.city.label.localeCompare(right.city.label, 'fr')
    );

    for (const match of fuzzyMatches) {
      picked.push(match.city);
      if (picked.length >= MAX_CITY_SUGGESTIONS) {
        break;
      }
    }

    return picked;
  }, [dataset, normalizedQuery, preparedCitySearch]);

  function clearCityError() {
    if (!errors.city) {
      return;
    }
    setErrors((previous) => ({ ...previous, city: undefined }));
  }

  function selectCity(city: TaxeSejourCity) {
    setCityQuery(city.label);
    setSelectedCityId(city.id);
    setIsListOpen(false);
    setHighlightedIndex(-1);
    clearCityError();
  }

  function handleCityInputChange(nextValue: string) {
    setCityQuery(nextValue);
    setSelectedCityId(null);
    setIsListOpen(true);
    setHighlightedIndex(-1);
    clearCityError();
  }

  function handleCityInputBlur() {
    closeTimerRef.current = window.setTimeout(() => {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }, 120);
  }

  function handleCityInputFocus() {
    if (suggestions.length > 0) {
      setIsListOpen(true);
    }
  }

  function handleCityInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isListOpen && suggestions.length > 0 && event.key === 'ArrowDown') {
      setIsListOpen(true);
      setHighlightedIndex(0);
      event.preventDefault();
      return;
    }

    if (!isListOpen || suggestions.length === 0) {
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
      selectCity(suggestions[highlightedIndex]);
      return;
    }

    if (event.key === 'Escape') {
      setIsListOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function validateForm(): {
    parsedNightlyPriceHt: number;
    parsedCapacity: number;
    parsedNights: number;
  } | null {
    const nextErrors: FormErrors = {};
    const parsedNightlyPriceHt = Number(nightlyPriceHt.replace(',', '.'));
    const parsedCapacity = Number(capacity);
    const parsedNights = Number(nights);

    if (!selectedCity) {
      nextErrors.city = 'Sélectionnez une commune dans la liste de suggestions.';
    }

    if (!Number.isFinite(parsedNightlyPriceHt) || parsedNightlyPriceHt <= 0) {
      nextErrors.nightlyPriceHt = 'Saisissez un prix HT strictement positif.';
    }

    if (
      !Number.isFinite(parsedCapacity) ||
      parsedCapacity <= 0 ||
      !Number.isInteger(parsedCapacity)
    ) {
      nextErrors.capacity = 'Saisissez une capacité entière strictement positive.';
    }

    if (!Number.isFinite(parsedNights) || parsedNights <= 0 || !Number.isInteger(parsedNights)) {
      nextErrors.nights = 'Saisissez un nombre de nuits entier strictement positif.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    return {
      parsedNightlyPriceHt,
      parsedCapacity,
      parsedNights,
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCity) {
      setErrors((previous) => ({
        ...previous,
        city: 'Sélectionnez une commune dans la liste de suggestions.',
      }));
      return;
    }

    const parsedValues = validateForm();
    if (!parsedValues) {
      return;
    }

    const computed = calculateTaxeSejour(
      {
        cityId: selectedCity.id,
        nightlyPriceHt: parsedValues.parsedNightlyPriceHt,
        capacity: parsedValues.parsedCapacity,
        nights: parsedValues.parsedNights,
      },
      selectedCity
    );

    setResult(computed);
    setResultCityLabel(selectedCity.label);
    setResultNights(parsedValues.parsedNights);
  }

  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-white">Simulateur taxe de séjour</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Simulation informative du montant de taxe de séjour par catégorie de classement, à
              partir des délibérations locales disponibles.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="space-y-10">
            <Card className="p-8" hover={false}>
              <h2 className="text-h4 mb-2">Paramètres de simulation</h2>
              {dataset && (
                <p className="text-sm text-textLight mb-6">
                  Source DELTA v{dataset.version} (date source: {dataset.sourceDate}).
                </p>
              )}

              {isLoading && <p className="text-textLight">Chargement des données en cours...</p>}
              {loadingError && (
                <p className="text-alert-500" role="alert">
                  {loadingError}
                </p>
              )}

              {!isLoading && !loadingError && (
                <form
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville <span className="text-alert-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(event) => handleCityInputChange(event.target.value)}
                      onFocus={handleCityInputFocus}
                      onBlur={handleCityInputBlur}
                      onKeyDown={handleCityInputKeyDown}
                      placeholder="Ex: Biarritz"
                      autoComplete="off"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={isListOpen && suggestions.length > 0}
                      aria-controls={listId}
                      aria-activedescendant={
                        highlightedIndex >= 0 ? `taxe-sejour-option-${highlightedIndex}` : undefined
                      }
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 ${
                        errors.city ? 'border-alert-400 focus:ring-alert-400' : ''
                      }`}
                    />
                    {isListOpen && suggestions.length > 0 && (
                      <ul
                        id={listId}
                        role="listbox"
                        className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-card"
                      >
                        {suggestions.map((city, index) => (
                          <li
                            id={`taxe-sejour-option-${index}`}
                            key={city.id}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            className={`cursor-pointer px-4 py-2 text-sm ${
                              highlightedIndex === index
                                ? 'bg-primary-100 text-primary-500'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectCity(city);
                            }}
                          >
                            {city.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.city && <p className="mt-2 text-sm text-alert-400">{errors.city}</p>}
                  </div>

                  <Input
                    label="Capacité d'accueil"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    placeholder="Ex: 4"
                    value={capacity}
                    onChange={(event) => {
                      setCapacity(event.target.value);
                      if (errors.capacity) {
                        setErrors((previous) => ({ ...previous, capacity: undefined }));
                      }
                    }}
                    error={errors.capacity}
                    required
                  />

                  <Input
                    label="Prix de la nuit HT (EUR)"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Ex: 120"
                    value={nightlyPriceHt}
                    onChange={(event) => {
                      setNightlyPriceHt(event.target.value);
                      if (errors.nightlyPriceHt) {
                        setErrors((previous) => ({ ...previous, nightlyPriceHt: undefined }));
                      }
                    }}
                    error={errors.nightlyPriceHt}
                    required
                  />

                  <Input
                    label="Nombre de nuits"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    placeholder="Ex: 3"
                    value={nights}
                    onChange={(event) => {
                      setNights(event.target.value);
                      if (errors.nights) {
                        setErrors((previous) => ({ ...previous, nights: undefined }));
                      }
                    }}
                    error={errors.nights}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:col-span-2 xl:col-span-4"
                  >
                    Calculer
                  </Button>
                </form>
              )}
            </Card>

            {result && (
              <Card className="p-8" hover={false}>
                <h2 className="text-h4 mb-2">Résultats</h2>
                <p className="text-sm text-textLight mb-6">
                  Montants estimés pour {getNightsLabel(resultNights)}, avec taxes additionnelles
                  incluses si applicables.
                </p>

                <div className="space-y-6">
                  <p className="text-sm text-gray-700">
                    Commune sélectionnée: <strong>{resultCityLabel}</strong>
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                      <thead>
                        <tr className="bg-primary-300 text-white">
                          <th className="p-3 text-left font-semibold">Catégorie</th>
                          <th className="p-3 text-right font-semibold">
                            Montant total ({getNightsLabel(resultNights)})
                          </th>
                          <th className="p-3 text-right font-semibold">Écart vs non classé</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, index) => (
                          <tr
                            key={row.category}
                            className={
                              index % 2 === 0 ? 'bg-white border-b border-gray-100' : 'bg-gray-50'
                            }
                          >
                            <td className="p-3 text-gray-700">{row.category}</td>
                            <td
                              className={`p-3 text-right font-semibold ${
                                row.category === 'Non classé' ? 'text-primary-500' : 'text-gray-900'
                              }`}
                            >
                              {formatEuro(row.amount)}
                            </td>
                            <td className="p-3 text-right">
                              {row.category === 'Non classé' ? (
                                <span className="font-semibold text-primary-500">Référence</span>
                              ) : (
                                <span
                                  className={`font-semibold ${getDeltaClassName(
                                    row.amount - (nonClasseAmount ?? 0)
                                  )}`}
                                >
                                  {formatDelta(row.amount - (nonClasseAmount ?? 0))}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-card border border-gray-200 p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Taxes additionnelles</h3>
                    <ul className="space-y-3">
                      {result.additionalTaxes.map((tax) => (
                        <li
                          key={tax.key}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                        >
                          <div className="text-sm text-gray-700">
                            <span>{tax.label}</span>{' '}
                            <a
                              href={tax.legalReferenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-500"
                            >
                              ({tax.legalReferenceLabel})
                            </a>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              tax.isApplied ? 'text-success-500' : 'text-gray-600'
                            }`}
                          >
                            {tax.isApplied ? 'OUI' : 'NON'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="rounded-card border border-warning-200 bg-warning-100 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Avertissements de calcul</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {result.warnings.map((warning) => (
                          <li key={warning}>- {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-sm text-textLight leading-comfortable">
                    Cette simulation est fournie à titre informatif sur la base des délibérations
                    publiées. Elle ne constitue pas une consultation juridique ou fiscale
                    personnalisée.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
