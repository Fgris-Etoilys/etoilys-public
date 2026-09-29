export const ANALYTICS_CONSENT_STORAGE_KEY = 'etoilys_analytics_consent';
export const ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_analytics_consent_updated_at';
export const ADVERTISING_CONSENT_STORAGE_KEY = 'etoilys_advertising_consent';
export const ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_advertising_consent_updated_at';
export const COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY = 'etoilys_cookieless_audience_opt_out';

const CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;

export type ConsentChoice = 'accepted' | 'refused';
export type ConsentPurpose = 'analytics' | 'advertising';

interface VolatilePurposeConsent {
  status: ConsentChoice;
  updatedAt: number;
}

export interface CookielessAudienceSnapshot {
  featureAvailable: boolean;
  userOptOut: boolean;
  effectiveEnabled: boolean;
}

export interface ConsentSnapshot {
  analytics: ConsentChoice | null;
  advertising: ConsentChoice | null;
  cookielessAudience: CookielessAudienceSnapshot;
  lastWriteSucceeded: boolean;
}

export interface ConsentUpdate {
  analytics?: ConsentChoice | undefined;
  advertising?: ConsentChoice | undefined;
  cookielessAudienceOptOut?: boolean | undefined;
}

export interface ConsentWriteResult {
  changed: boolean;
  persisted: boolean;
  snapshot: ConsentSnapshot;
}

type ConsentListener = () => void;

const SERVER_SNAPSHOT: ConsentSnapshot = Object.freeze({
  analytics: null,
  advertising: null,
  cookielessAudience: Object.freeze({
    featureAvailable: false,
    userOptOut: false,
    effectiveEnabled: false,
  }),
  lastWriteSucceeded: true,
});

let volatileAnalyticsConsent: VolatilePurposeConsent | null = null;
let volatileAdvertisingConsent: VolatilePurposeConsent | null = null;
let volatileCookielessAudienceOptOut: boolean | null = null;
let cachedSnapshot: ConsentSnapshot = SERVER_SNAPSHOT;
let lastWriteSucceeded = true;
let listeners: ConsentListener[] = [];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getBrowserLocalStorage(): Storage | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getBrowserSessionStorage(): Storage | null {
  if (!isBrowser()) return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readLocalStorage(key: string): string | null {
  const storage = getBrowserLocalStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): boolean {
  const storage = getBrowserLocalStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === 'accepted' || value === 'refused';
}

function readTimestamp(key: string): number | null {
  const value = readLocalStorage(key);
  if (!value) return null;
  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isFresh(updatedAt: number | null): boolean {
  return (
    updatedAt !== null && updatedAt <= Date.now() && Date.now() - updatedAt <= CONSENT_MAX_AGE_MS
  );
}

function readStoredPurposeConsent(valueKey: string, updatedAtKey: string): ConsentChoice | null {
  const value = readLocalStorage(valueKey);
  const updatedAt = readTimestamp(updatedAtKey);

  if (isConsentChoice(value) && isFresh(updatedAt)) {
    return value;
  }

  return null;
}

function readPurposeConsent(
  volatileConsent: VolatilePurposeConsent | null,
  valueKey: string,
  updatedAtKey: string
): ConsentChoice | null {
  if (volatileConsent && isFresh(volatileConsent.updatedAt)) {
    return volatileConsent.status;
  }

  return readStoredPurposeConsent(valueKey, updatedAtKey);
}

function readCookielessAudienceOptOut(): boolean {
  if (volatileCookielessAudienceOptOut !== null) {
    return volatileCookielessAudienceOptOut;
  }

  return readLocalStorage(COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY) === 'true';
}

export function isCookielessAudienceFeatureAvailable(): boolean {
  return import.meta.env?.VITE_ENABLE_COOKIELESS_AUDIENCE === 'true';
}

function buildSnapshot(): ConsentSnapshot {
  const analytics = readPurposeConsent(
    volatileAnalyticsConsent,
    ANALYTICS_CONSENT_STORAGE_KEY,
    ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY
  );
  const advertising = readPurposeConsent(
    volatileAdvertisingConsent,
    ADVERTISING_CONSENT_STORAGE_KEY,
    ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY
  );
  const featureAvailable = isCookielessAudienceFeatureAvailable();
  const userOptOut = readCookielessAudienceOptOut();

  return {
    analytics,
    advertising,
    cookielessAudience: {
      featureAvailable,
      userOptOut,
      effectiveEnabled: featureAvailable && !userOptOut,
    },
    lastWriteSucceeded,
  };
}

function areSnapshotsEqual(left: ConsentSnapshot, right: ConsentSnapshot): boolean {
  return (
    left.analytics === right.analytics &&
    left.advertising === right.advertising &&
    left.lastWriteSucceeded === right.lastWriteSucceeded &&
    left.cookielessAudience.featureAvailable === right.cookielessAudience.featureAvailable &&
    left.cookielessAudience.userOptOut === right.cookielessAudience.userOptOut &&
    left.cookielessAudience.effectiveEnabled === right.cookielessAudience.effectiveEnabled
  );
}

export function getServerConsentSnapshot(): ConsentSnapshot {
  return SERVER_SNAPSHOT;
}

export function getConsentSnapshot(): ConsentSnapshot {
  if (!isBrowser()) return SERVER_SNAPSHOT;

  const nextSnapshot = buildSnapshot();
  if (areSnapshotsEqual(cachedSnapshot, nextSnapshot)) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  return cachedSnapshot;
}

function notifyConsentListeners(): void {
  cachedSnapshot = buildSnapshot();
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: ConsentListener): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((currentListener) => currentListener !== listener);
  };
}

function persistPurposeConsent(
  valueKey: string,
  updatedAtKey: string,
  status: ConsentChoice
): boolean {
  const updatedAt = Date.now();
  const valueWritten = writeLocalStorage(valueKey, status);
  const updatedAtWritten = writeLocalStorage(updatedAtKey, String(updatedAt));
  return valueWritten && updatedAtWritten;
}

export function setConsentPreferences(update: ConsentUpdate): ConsentWriteResult {
  const previousSnapshot = getConsentSnapshot();
  const updatedAt = Date.now();
  let changed = false;
  let persisted = true;

  if (update.analytics !== undefined && previousSnapshot.analytics !== update.analytics) {
    volatileAnalyticsConsent = { status: update.analytics, updatedAt };
    persisted =
      persistPurposeConsent(
        ANALYTICS_CONSENT_STORAGE_KEY,
        ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
        update.analytics
      ) && persisted;
    changed = true;
  }

  if (update.advertising !== undefined && previousSnapshot.advertising !== update.advertising) {
    volatileAdvertisingConsent = { status: update.advertising, updatedAt };
    persisted =
      persistPurposeConsent(
        ADVERTISING_CONSENT_STORAGE_KEY,
        ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY,
        update.advertising
      ) && persisted;
    changed = true;
  }

  if (
    update.cookielessAudienceOptOut !== undefined &&
    previousSnapshot.cookielessAudience.userOptOut !== update.cookielessAudienceOptOut
  ) {
    volatileCookielessAudienceOptOut = update.cookielessAudienceOptOut;
    persisted =
      writeLocalStorage(
        COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY,
        update.cookielessAudienceOptOut ? 'true' : 'false'
      ) && persisted;
    changed = true;
  }

  if (!changed) {
    return { changed: false, persisted: lastWriteSucceeded, snapshot: previousSnapshot };
  }

  lastWriteSucceeded = persisted;
  notifyConsentListeners();

  return {
    changed: true,
    persisted,
    snapshot: getConsentSnapshot(),
  };
}

export function getConsentStatus(purpose: ConsentPurpose): ConsentChoice | null {
  return getConsentSnapshot()[purpose];
}

export function setCookielessAudienceOptOut(optOut: boolean): ConsentWriteResult {
  return setConsentPreferences({ cookielessAudienceOptOut: optOut });
}

export const consentInternalsForTests = {
  reset: () => {
    volatileAnalyticsConsent = null;
    volatileAdvertisingConsent = null;
    volatileCookielessAudienceOptOut = null;
    cachedSnapshot = SERVER_SNAPSHOT;
    lastWriteSucceeded = true;
    listeners = [];
  },
};
