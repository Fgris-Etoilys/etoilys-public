const OPENAI_ADS_SCRIPT_ID = 'openai-ads-pixel-script';
const OPENAI_ADS_SCRIPT_SRC = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';

export const ADVERTISING_CONSENT_STORAGE_KEY = 'etoilys_advertising_consent';
export const ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_advertising_consent_updated_at';
const ADVERTISING_CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;
const OPENAI_ADS_DEBUG_STORAGE_KEY = 'etoilys_ads_debug';

export type AdvertisingConsent = 'accepted' | 'refused';

interface OaiqQueueFunction {
  (...args: unknown[]): void;
  q?: unknown[][];
}

declare global {
  interface Window {
    oaiq?: OaiqQueueFunction;
  }
}

let isOpenAiAdsPixelInitialized = false;
let volatileAdvertisingConsent: AdvertisingConsent | null = null;
let volatileAdvertisingConsentUpdatedAt: number | null = null;

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readLocalStorage(key: string): string | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // OpenAI Ads must never break the site.
  }
}

function readAdvertisingConsentUpdatedAt(): number | null {
  const value = readLocalStorage(ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY);
  if (!value) {
    return null;
  }

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isAdvertisingConsentFresh(updatedAt: number | null): boolean {
  return updatedAt !== null && Date.now() - updatedAt <= ADVERTISING_CONSENT_MAX_AGE_MS;
}

function readAdvertisingConsent(): AdvertisingConsent | null {
  const value = readLocalStorage(ADVERTISING_CONSENT_STORAGE_KEY);
  const updatedAt = readAdvertisingConsentUpdatedAt();

  if ((value === 'accepted' || value === 'refused') && isAdvertisingConsentFresh(updatedAt)) {
    return value;
  }

  return isAdvertisingConsentFresh(volatileAdvertisingConsentUpdatedAt)
    ? volatileAdvertisingConsent
    : null;
}

function writeAdvertisingConsent(value: AdvertisingConsent): void {
  const updatedAt = Date.now();
  volatileAdvertisingConsent = value;
  volatileAdvertisingConsentUpdatedAt = updatedAt;
  writeLocalStorage(ADVERTISING_CONSENT_STORAGE_KEY, value);
  writeLocalStorage(ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY, String(updatedAt));
}

export function getAdvertisingConsentStatus(): AdvertisingConsent | null {
  return readAdvertisingConsent();
}

function isOpenAiAdsDebugEnabled(): boolean {
  return readLocalStorage(OPENAI_ADS_DEBUG_STORAGE_KEY) === 'true';
}

function getOpenAiAdsPixelId(): string | undefined {
  return import.meta.env?.VITE_OPENAI_ADS_PIXEL_ID;
}

function createOaiqQueueStub(): OaiqQueueFunction {
  const queue: unknown[][] = [];
  const stub = ((...args: unknown[]) => {
    queue.push(args);
  }) as OaiqQueueFunction;
  stub.q = queue;
  return stub;
}

function injectOpenAiAdsLoaderScript(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || window.oaiq) {
    return;
  }

  window.oaiq = createOaiqQueueStub();

  if (document.getElementById(OPENAI_ADS_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = OPENAI_ADS_SCRIPT_ID;
  script.async = true;
  script.src = OPENAI_ADS_SCRIPT_SRC;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Idempotent: injects the SDK and calls init at most once per session.
 * Never gates a later `consent` transition — see acceptAdvertisingConsent/refuseAdvertisingConsent.
 */
function ensureOpenAiAdsScriptLoaded(): void {
  if (isOpenAiAdsPixelInitialized || typeof window === 'undefined') {
    return;
  }

  const pixelId = getOpenAiAdsPixelId();
  if (!pixelId) {
    return;
  }

  try {
    injectOpenAiAdsLoaderScript();
    window.oaiq?.('consent', true);
    window.oaiq?.('init', isOpenAiAdsDebugEnabled() ? { pixelId, debug: true } : { pixelId });
    isOpenAiAdsPixelInitialized = true;
  } catch {
    // OpenAI Ads must never break the site.
  }
}

export function initOpenAiAdsPixelIfConsented(): void {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('etoilys_ads_debug') === '1') {
      writeLocalStorage(OPENAI_ADS_DEBUG_STORAGE_KEY, 'true');
    }
  }

  if (getAdvertisingConsentStatus() === 'accepted') {
    ensureOpenAiAdsScriptLoaded();
  }
}

export function acceptAdvertisingConsent(): void {
  writeAdvertisingConsent('accepted');

  try {
    if (isOpenAiAdsPixelInitialized) {
      window.oaiq?.('consent', true);
    } else {
      ensureOpenAiAdsScriptLoaded();
    }
  } catch {
    // OpenAI Ads must never break the site.
  }
}

export function refuseAdvertisingConsent(): void {
  writeAdvertisingConsent('refused');

  try {
    window.oaiq?.('consent', false);
  } catch {
    // OpenAI Ads must never break the site.
  }
}

export function trackLeadCreatedConversion(): void {
  if (typeof window === 'undefined' || getAdvertisingConsentStatus() !== 'accepted') {
    return;
  }

  try {
    window.oaiq?.('measure', 'lead_created', { type: 'customer_action' });
  } catch {
    // OpenAI Ads must never break the form's success flow.
  }
}

export const openAiAdsInternalsForTests = {
  reset: () => {
    isOpenAiAdsPixelInitialized = false;
    volatileAdvertisingConsent = null;
    volatileAdvertisingConsentUpdatedAt = null;
  },
};
