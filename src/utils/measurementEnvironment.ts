const CANONICAL_HOSTNAME = 'www.etoilys.fr';
const INTERNAL_MEASUREMENT_STORAGE_KEY = 'etoilys_analytics_internal';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isTestMode(): boolean {
  return import.meta.env?.MODE === 'test';
}

export function isLocalDevelopmentMeasurementDisabled(enabledInDev: boolean): boolean {
  return import.meta.env?.DEV === true && !isTestMode() && !enabledInDev;
}

export function isNonCanonicalMeasurementDisabled(): boolean {
  if (!isBrowser() || isTestMode()) return false;
  if (import.meta.env?.VITE_ALLOW_MEASUREMENT_ON_NON_CANONICAL_HOST === 'true') return false;

  return window.location.hostname !== CANONICAL_HOSTNAME;
}

export function readInternalMeasurementMode(): boolean {
  if (!isBrowser()) return false;

  try {
    return window.localStorage.getItem(INTERNAL_MEASUREMENT_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function writeInternalMeasurementMode(): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(INTERNAL_MEASUREMENT_STORAGE_KEY, 'true');
  } catch {
    // Measurement guards must never break the site.
  }
}
