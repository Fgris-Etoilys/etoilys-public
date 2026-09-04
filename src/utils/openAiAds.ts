const OPENAI_ADS_SCRIPT_ID = 'openai-ads-pixel-script';
const OPENAI_ADS_SCRIPT_SRC = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';

export const ADVERTISING_CONSENT_STORAGE_KEY = 'etoilys_advertising_consent';
export const ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_advertising_consent_updated_at';
const ADVERTISING_CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;
const OPENAI_ADS_DEBUG_STORAGE_KEY = 'etoilys_ads_debug';

const OPPREF_STORAGE_KEY = 'etoilys_openai_ads_oppref';
const OPPREF_CAPTURED_AT_STORAGE_KEY = 'etoilys_openai_ads_oppref_captured_at';
// Aligné sur la fenêtre d'attribution click-through configurée dans Ads Manager pour cette
// source (30 jours), pas sur la fenêtre view-through (1 jour, non pertinente pour oppref).
const OPPREF_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

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

interface OpprefPixelContext {
  // Une valeur valide (non expirée) était disponible en sessionStorage au moment de l'init,
  // qu'elle ait dû être injectée dans l'URL ou qu'elle y soit déjà présente naturellement.
  hasPendingStoredOppref: boolean;
  // Non-null uniquement si ce code a lui-même ajouté oppref à l'URL courante.
  injectedValue: string | null;
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

function canUseSessionStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function getUrlOppref(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get('oppref');
  } catch {
    return null;
  }
}

function writeOpprefToSessionStorage(value: string): void {
  if (!canUseSessionStorage()) return;
  try {
    window.sessionStorage.setItem(OPPREF_STORAGE_KEY, value);
    window.sessionStorage.setItem(OPPREF_CAPTURED_AT_STORAGE_KEY, String(Date.now()));
  } catch {
    // OpenAI Ads must never break the site.
  }
}

function clearOpprefSessionStorage(): void {
  if (!canUseSessionStorage()) return;
  try {
    window.sessionStorage.removeItem(OPPREF_STORAGE_KEY);
    window.sessionStorage.removeItem(OPPREF_CAPTURED_AT_STORAGE_KEY);
  } catch {
    // no-op
  }
}

// Expiration vérifiée paresseusement à la lecture (même pattern que le TTL de consentement
// ci-dessus). Purge les deux clés dès qu'elles sont incohérentes, incomplètes ou périmées.
function readOpprefFromSessionStorage(): string | null {
  if (!canUseSessionStorage()) return null;
  try {
    const value = window.sessionStorage.getItem(OPPREF_STORAGE_KEY);
    const capturedAtRaw = window.sessionStorage.getItem(OPPREF_CAPTURED_AT_STORAGE_KEY);

    if (!value || !capturedAtRaw) {
      clearOpprefSessionStorage();
      return null;
    }

    const capturedAt = Number(capturedAtRaw);
    if (!Number.isFinite(capturedAt) || Date.now() - capturedAt > OPPREF_MAX_AGE_MS) {
      clearOpprefSessionStorage();
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

// Appelée en tout premier dans initOpenAiAdsPixelIfConsented(), inconditionnellement, à chaque
// chargement réel de page. La valeur la plus récente remplace toujours l'ancienne ; si l'URL
// courante n'a pas de oppref, une valeur déjà stockée est laissée intacte.
function captureLandingOppref(): void {
  const urlOppref = getUrlOppref();
  if (!urlOppref) return;
  writeOpprefToSessionStorage(urlOppref);
}

// Sépare explicitement « une valeur en attente existait » de « nous avons dû l'injecter dans
// l'URL » : les deux informations gouvernent des décisions de purge différentes (section 5 du
// plan). Si oppref est déjà dans l'URL courante (Cas 1/2), rien n'est injecté.
function prepareOpprefForPixelCapture(): OpprefPixelContext {
  const stored = readOpprefFromSessionStorage();
  const hasPendingStoredOppref = stored !== null;

  if (typeof window === 'undefined' || getUrlOppref()) {
    return { hasPendingStoredOppref, injectedValue: null };
  }

  if (!stored) {
    return { hasPendingStoredOppref: false, injectedValue: null };
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set('oppref', stored);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    return { hasPendingStoredOppref: true, injectedValue: stored };
  } catch {
    return { hasPendingStoredOppref, injectedValue: null };
  }
}

// Opère toujours sur window.location.href au moment de l'appel (jamais une URL mémorisée à
// l'injection) : si l'utilisateur a navigué en SPA entre-temps, seule l'URL courante est
// modifiée, jamais restaurée à un état antérieur. Ne retire oppref que s'il correspond
// exactement à la valeur que ce code a lui-même injectée.
function removeInjectedOppref(injectedValue: string): void {
  if (typeof window === 'undefined') return;
  try {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get('oppref') !== injectedValue) {
      return;
    }
    currentUrl.searchParams.delete('oppref');
    window.history.replaceState(
      window.history.state,
      '',
      currentUrl.pathname + currentUrl.search + currentUrl.hash
    );
  } catch {
    // Le cleanup est un confort, jamais bloquant.
  }
}

function createOaiqQueueStub(): OaiqQueueFunction {
  const queue: unknown[][] = [];
  const stub = ((...args: unknown[]) => {
    queue.push(args);
  }) as OaiqQueueFunction;
  stub.q = queue;
  return stub;
}

// Cleanup uniquement sur load (succès) / error (échec) du tag <script> — aucun timeout de
// secours : un oppref réinjecté ne doit jamais être retiré avant que le SDK n'ait eu une
// vraie chance de le lire, quitte à rester visible dans l'URL plus longtemps qu'attendu si le
// script ne déclenche jamais l'un ou l'autre événement.
//
// En cas d'error, la copie sessionStorage est conservée : cela sert surtout à permettre une
// nouvelle tentative après un véritable rechargement de page (qui réexécute ce module et relance
// ensureOpenAiAdsScriptLoaded() depuis zéro). Un simple refuse -> accept dans la même session SPA
// ne relance PAS l'injection du script : isOpenAiAdsPixelInitialized reste vrai dès que cette
// fonction a été appelée une première fois, que le script ait ensuite réussi ou échoué à charger.
// Gérer ce cas précis (retenter automatiquement un script en échec sans reload) est explicitement
// hors scope pour l'instant.
function injectOpenAiAdsLoaderScript(context: OpprefPixelContext): void {
  const { hasPendingStoredOppref, injectedValue } = context;

  if (typeof window === 'undefined' || typeof document === 'undefined' || window.oaiq) {
    if (injectedValue) removeInjectedOppref(injectedValue);
    return;
  }

  window.oaiq = createOaiqQueueStub();

  if (document.getElementById(OPENAI_ADS_SCRIPT_ID)) {
    if (injectedValue) removeInjectedOppref(injectedValue);
    return;
  }

  const script = document.createElement('script');
  script.id = OPENAI_ADS_SCRIPT_ID;
  script.async = true;
  script.src = OPENAI_ADS_SCRIPT_SRC;

  if (hasPendingStoredOppref || injectedValue) {
    let settled = false;
    const onLoadSuccess = () => {
      if (settled) return;
      settled = true;
      if (injectedValue) removeInjectedOppref(injectedValue);
      if (hasPendingStoredOppref) clearOpprefSessionStorage();
    };
    const onLoadFailureUrlOnly = () => {
      if (settled) return;
      settled = true;
      if (injectedValue) removeInjectedOppref(injectedValue);
      // sessionStorage volontairement conservé : voir le commentaire de fonction ci-dessus.
    };
    script.addEventListener('load', onLoadSuccess, { once: true });
    script.addEventListener('error', onLoadFailureUrlOnly, { once: true });
  }

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Idempotent — n'injecte le script et n'appelle init qu'une seule fois par session.
 * Ne gère jamais la transition de consentement (`consent`), voir acceptAdvertisingConsent/
 * refuseAdvertisingConsent.
 */
function ensureOpenAiAdsScriptLoaded(): void {
  if (isOpenAiAdsPixelInitialized || typeof window === 'undefined') return;

  const pixelId = getOpenAiAdsPixelId();
  if (!pixelId) return;

  try {
    const opprefContext = prepareOpprefForPixelCapture();
    injectOpenAiAdsLoaderScript(opprefContext);
    window.oaiq?.('consent', true);
    window.oaiq?.('init', isOpenAiAdsDebugEnabled() ? { pixelId, debug: true } : { pixelId });
    isOpenAiAdsPixelInitialized = true;
  } catch {
    // OpenAI Ads must never break the site.
  }
}

export function initOpenAiAdsPixelIfConsented(): void {
  captureLandingOppref(); // inconditionnel, avant toute vérification de consentement

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
    // sessionStorage n'est volontairement PAS vidé ici : il doit survivre à reset() pour
    // permettre de tester la persistance à travers un hard reload (le module JS est
    // réexécuté, mais sessionStorage, propriété du navigateur, ne l'est pas).
  },
};
