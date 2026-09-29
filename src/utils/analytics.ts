import type { CaptureResult, Properties } from 'posthog-js';
import {
  captureVolatileAcquisitionContext,
  classifyConsentedAcquisition,
  getAudienceLandingProperties,
  normalizeAnalyticsPath,
  type ConsentedAcquisitionProperties,
  type VolatileAcquisitionContext,
} from './acquisition';
import {
  getBrowserLocalStorage,
  getConsentSnapshot,
  getConsentStatus,
  setConsentPreferences,
  setCookielessAudienceOptOut,
  type ConsentChoice,
  type ConsentWriteResult,
} from './consent';
import { isSupportedLocale } from '../i18n/locales';
import { getLocaleFromPath, getRouteIdFromPath } from '../i18n/routeHelpers';
import {
  isLocalDevelopmentMeasurementDisabled,
  isNonCanonicalMeasurementDisabled,
  readInternalMeasurementMode,
  writeInternalMeasurementMode,
} from './measurementEnvironment';

export { normalizeAnalyticsPath } from './acquisition';
export {
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
  COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY,
} from './consent';
const DEBUG_STORAGE_KEY = 'etoilys_analytics_debug';
const SESSION_ACQUISITION_STORAGE_KEY = 'etoilys_analytics_session_acquisition';

export type AnalyticsConsent = ConsentChoice;
type FormName = 'contact' | 'demande_classement';
type SimulatorName = 'taxe_sejour' | 'fiscal_classement' | 'classement';
type FormFailureType = 'validation' | 'api' | 'network' | 'turnstile';
type ContactMethod = 'phone' | 'email';
type ClassementSimulatorEntryPoint = 'new' | 'resume_card' | 'direct';
type ClassementSimulatorStep = 'pieces' | 'grid' | 'result';
type ClassementSimulatorPieceAction = 'created' | 'updated';
type ClassementSimulatorPieceScope = 'interior' | 'exterior';
type ClassementSimulatorResultOutcome = 'favorable' | 'defavorable' | 'needs_completion';

type AnalyticsValue = string | number | boolean | string[];
type AnalyticsProperties = Record<string, AnalyticsValue>;

export type AnalyticsEventName =
  | 'contact_clicked'
  | 'cta_clicked'
  | 'form_started'
  | 'form_validation_failed'
  | 'form_submit_attempted'
  | 'form_submit_succeeded'
  | 'form_submit_failed'
  | 'simulator_started'
  | 'simulator_calculated'
  | 'simulator_resumed'
  | 'simulator_deleted'
  | 'simulator_step_viewed'
  | 'simulator_piece_saved'
  | 'simulator_piece_deleted'
  | 'simulator_grid_response_saved'
  | 'simulator_grid_progress_reached'
  | 'simulator_result_requested'
  | 'simulator_result_blocked'
  | 'simulator_pdf_exported'
  | 'simulator_help_opened';

const ALLOWED_EVENT_NAMES = new Set<string>([
  '$pageview',
  '$autocapture',
  'contact_clicked',
  'cta_clicked',
  'form_started',
  'form_validation_failed',
  'form_submit_attempted',
  'form_submit_succeeded',
  'form_submit_failed',
  'simulator_started',
  'simulator_calculated',
  'simulator_resumed',
  'simulator_deleted',
  'simulator_step_viewed',
  'simulator_piece_saved',
  'simulator_piece_deleted',
  'simulator_grid_response_saved',
  'simulator_grid_progress_reached',
  'simulator_result_requested',
  'simulator_result_blocked',
  'simulator_pdf_exported',
  'simulator_help_opened',
]);

const DETAILED_AUTOCAPTURE_ALLOWED_PROPERTIES = new Set<string>([
  '$browser',
  '$browser_version',
  '$ce_version',
  '$current_url',
  '$device_type',
  '$el_text',
  '$event_type',
  '$host',
  '$lib',
  '$lib_version',
  '$os',
  '$os_version',
  '$pathname',
  '$referrer',
  '$screen_height',
  '$screen_width',
  '$viewport_height',
  '$viewport_width',
  'classes',
  'distinct_id',
  'elements_chain',
  'href',
  'tag_name',
  'title',
  'token',
]);
const ALLOWED_CUSTOM_PROPERTIES = new Set<string>([
  '$current_url',
  '$pathname',
  '$referrer',
  'source_path',
  'destination_path',
  'page_type',
  'debug_mode',
  'landing_page',
  'locale',
  'event_locale',
  'acquisition_channel',
  'acquisition_source',
  'traffic_type',
  'campaign_name',
  'campaign_content',
  'ai_referrer',
  'contact_method',
  'form_name',
  'simulator',
  'cta_id',
  'cta_location',
  'invalid_fields',
  'invalid_field_count',
  'failure_type',
  'field_error_keys',
  'city_department',
  'nights_bucket',
  'nightly_price_bucket',
  'occupancy_bucket',
  'has_exemptions',
  'is_indicative',
  'revenue_bucket',
  'tmi_rate',
  'scope',
  'social_threshold_exceeded',
  'non_classe_threshold_exceeded',
  'savings_bucket',
  'requested_category',
  'housing_type',
  'floor_bucket',
  'capacity_bucket',
  'entry_point',
  'step',
  'piece_action',
  'piece_type',
  'piece_scope',
  'piece_count_bucket',
  'criterion_number',
  'criterion_status',
  'validation_status',
  'progress_bucket',
  'remaining_criteria_bucket',
  'missing_mandatory_bucket',
  'result_outcome',
  'has_sleeping_capacity_issue',
  'has_missing_criteria',
]);

const POSTHOG_REQUIRED_PROPERTY_KEYS = new Set(['token', 'distinct_id']);
const COOKIELESS_AUDIENCE_TECHNICAL_PROPERTY_KEYS = new Set([
  'token',
  'distinct_id',
  '$lib',
  '$lib_version',
  '$cookieless_mode',
  '$geoip_disable',
]);
const COOKIELESS_AUDIENCE_PROPERTY_KEYS = new Set([
  ...COOKIELESS_AUDIENCE_TECHNICAL_PROPERTY_KEYS,
  'landing_page',
  'locale',
]);
const CUSTOM_URL_PROPERTY_KEYS = new Set([
  '$current_url',
  '$pathname',
  '$referrer',
  'source_path',
  'destination_path',
  'href',
]);
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_PATTERN = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
const DETAILED_AUTOCAPTURE_IGNORELIST = [
  '.ph-no-autocapture',
  '[data-ph-no-autocapture]',
  '.ph-no-capture',
  '.ph-block',
  '.inquiry-form',
  '.inquiry-fields',
  '.inquiry-turnstile',
  '.simulator-form-panel',
  '.simulator-result-value',
  '.simulator-comparison',
  '.simulator-facts',
  '.classement-result-scores',
  '.classement-result-diagnostic',
  '[data-analytics-sensitive="true"]',
  '[data-replay-block="true"]',
];
const SESSION_REPLAY_BLOCK_SELECTOR = [
  '.ph-block',
  '.inquiry-turnstile',
  '.cf-turnstile',
  '[data-replay-block="true"]',
].join(',');
const SESSION_REPLAY_MASK_TEXT_SELECTOR = [
  '.simulator-result-value',
  '.simulator-comparison',
  '.simulator-facts',
  '.classement-result-scores',
  '.classement-result-diagnostic',
  '[data-analytics-sensitive="true"]',
  '[data-replay-mask="true"]',
].join(',');

let isPostHogInitialized = false;
let isCookielessAudiencePostHogInitialized = false;
let postHogMode: 'uninitialized' | 'consented' = 'uninitialized';
let lastTrackedPathname: string | null = null;
let volatileAcquisitionContext: VolatileAcquisitionContext | null = null;
let hasCapturedAudienceLanding = false;
let registeredConsentedAcquisitionSessionId: string | null = null;
let sessionAcquisitionUnsubscribe: (() => void) | null = null;

type PostHogClient = typeof import('posthog-js').default;

interface PersistedSessionAcquisition {
  sessionId: string;
  acquisition: ConsentedAcquisitionProperties;
}

let postHogClient: PostHogClient | null = null;
let cookielessAudiencePostHogClient: PostHogClient | null = null;
let postHogImportPromise: Promise<PostHogClient | null> | null = null;
let postHogInitializationPromise: Promise<PostHogClient | null> | null = null;
let cookielessAudienceInitializationPromise: Promise<PostHogClient | null> | null = null;

function readLocalStorage(key: string): string | null {
  const storage = getBrowserLocalStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  const storage = getBrowserLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch {
    // Analytics must never break the user experience.
  }
}

function removeLocalStorage(key: string): void {
  const storage = getBrowserLocalStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // Analytics must never break the user experience.
  }
}

function readConsent(): AnalyticsConsent | null {
  return getConsentStatus('analytics');
}

export function getAnalyticsConsentStatus(): AnalyticsConsent | null {
  return readConsent();
}

export function isCookielessAudienceMeasurementEnabled(): boolean {
  return getConsentSnapshot().cookielessAudience.effectiveEnabled;
}

export function setCookielessAudienceMeasurementEnabled(enabled: boolean): ConsentWriteResult {
  return setCookielessAudienceOptOut(!enabled);
}

function getCurrentPathname(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizeAnalyticsPath(window.location.pathname);
}

function getPageType(pathname: string): string {
  const normalizedPathname = normalizeAnalyticsPath(pathname);
  const routeId = getRouteIdFromPath(normalizedPathname);

  if (routeId === 'home') return 'home';
  if (routeId === 'contact' || routeId === 'demandeClassement') return 'formulaire';
  if (routeId === 'confidentialite' || normalizedPathname === '/mentions-legales') return 'legal';
  if (routeId === 'simulateurTaxeSejour' || routeId === 'simulateurFiscalClassement') {
    return 'simulateur';
  }

  if (normalizedPathname === '/actualites') return 'actualites';
  if (normalizedPathname.startsWith('/actualites/')) return 'article';
  if (normalizedPathname === '/simulateur' || normalizedPathname === '/simulateur/:simulationId') {
    return 'simulateur';
  }
  if (
    normalizedPathname === '/zones-intervention' ||
    normalizedPathname.startsWith('/classement-meuble-tourisme-')
  ) {
    return 'local';
  }
  return 'page';
}

function isInternalAnalyticsDisabled(): boolean {
  return readInternalMeasurementMode();
}

function isDebugModeEnabled(): boolean {
  return readLocalStorage(DEBUG_STORAGE_KEY) === 'true';
}

function isDetailedAnalyticsEnabled(): boolean {
  return readConsent() === 'accepted' && !isAnalyticsEnvironmentDisabled();
}

function isCookielessAudienceFeatureEnabled(): boolean {
  return import.meta.env?.VITE_ENABLE_COOKIELESS_AUDIENCE === 'true';
}

function ensureVolatileAcquisitionContext(): VolatileAcquisitionContext | null {
  if (volatileAcquisitionContext || typeof window === 'undefined') {
    return volatileAcquisitionContext;
  }

  volatileAcquisitionContext = captureVolatileAcquisitionContext({
    locationHref: window.location.href,
    referrer: typeof document === 'undefined' ? null : document.referrer,
  });

  return volatileAcquisitionContext;
}

function getCurrentEventContext(pathname = getCurrentPathname()): {
  sourcePath: string;
  pageType: string;
  eventLocale: string;
} {
  const sourcePath = normalizeAnalyticsPath(pathname);
  return {
    sourcePath,
    pageType: getPageType(sourcePath),
    eventLocale: getLocaleFromPath(sourcePath),
  };
}

function isAcquisitionChannel(value: unknown): boolean {
  return (
    value === 'direct' ||
    value === 'generative_ai' ||
    value === 'organic_search' ||
    value === 'paid_search' ||
    value === 'social' ||
    value === 'email' ||
    value === 'referral' ||
    value === 'campaign'
  );
}

function isTrafficType(value: unknown): boolean {
  return value === 'paid' || value === 'organic' || value === 'unknown';
}

function isAiReferrer(value: unknown): boolean {
  return (
    value === undefined ||
    value === 'chatgpt' ||
    value === 'perplexity' ||
    value === 'claude' ||
    value === 'gemini' ||
    value === 'copilot' ||
    value === 'other'
  );
}

function isConsentedAcquisitionProperties(value: unknown): value is ConsentedAcquisitionProperties {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const hasRequiredFields =
    isAcquisitionChannel(record.acquisition_channel) &&
    typeof record.acquisition_source === 'string' &&
    isTrafficType(record.traffic_type) &&
    typeof record.landing_page === 'string' &&
    isSupportedLocale(record.locale) &&
    isAiReferrer(record.ai_referrer);

  const optionalCampaignFieldsAreValid =
    (record.campaign_name === undefined || typeof record.campaign_name === 'string') &&
    (record.campaign_content === undefined || typeof record.campaign_content === 'string');

  return hasRequiredFields && optionalCampaignFieldsAreValid;
}

function readPersistedSessionAcquisition(sessionId: string): ConsentedAcquisitionProperties | null {
  const rawValue = readLocalStorage(SESSION_ACQUISITION_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<PersistedSessionAcquisition>;
    if (parsed.sessionId === sessionId && isConsentedAcquisitionProperties(parsed.acquisition)) {
      return parsed.acquisition;
    }
  } catch {
    removeLocalStorage(SESSION_ACQUISITION_STORAGE_KEY);
  }

  return null;
}

function writePersistedSessionAcquisition(
  sessionId: string,
  acquisition: ConsentedAcquisitionProperties
): void {
  writeLocalStorage(SESSION_ACQUISITION_STORAGE_KEY, JSON.stringify({ sessionId, acquisition }));
}

function getPostHogToken(): string | undefined {
  return import.meta.env?.VITE_PUBLIC_POSTHOG_TOKEN;
}

function getPostHogHost(): string {
  return import.meta.env?.VITE_PUBLIC_POSTHOG_HOST || 'https://f.etoilys.fr';
}

function isLocalDevelopmentAnalyticsDisabled(): boolean {
  return isLocalDevelopmentMeasurementDisabled(
    import.meta.env?.VITE_ENABLE_ANALYTICS_IN_DEV === 'true'
  );
}

function isAnalyticsEnvironmentDisabled(): boolean {
  return (
    isLocalDevelopmentAnalyticsDisabled() ||
    isInternalAnalyticsDisabled() ||
    isNonCanonicalMeasurementDisabled()
  );
}

function hasSensitiveString(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function sanitizeArray(value: string[]): string[] {
  return value
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && !hasSensitiveString(entry));
}

function isPostHogUrlProperty(key: string): boolean {
  return (
    key === '$current_url' ||
    key === '$referrer' ||
    key.endsWith('_url') ||
    key.endsWith('_referrer') ||
    key.endsWith('_pathname')
  );
}

function sanitizeCustomProperties(properties: Properties | null | undefined): Properties {
  const sanitized: Properties = {};

  if (!properties) {
    return sanitized;
  }

  for (const [key, rawValue] of Object.entries(properties)) {
    if (!ALLOWED_CUSTOM_PROPERTIES.has(key)) {
      continue;
    }

    if (CUSTOM_URL_PROPERTY_KEYS.has(key)) {
      sanitized[key] = normalizeAnalyticsPath(typeof rawValue === 'string' ? rawValue : undefined);
      continue;
    }

    if (typeof rawValue === 'string') {
      if (hasSensitiveString(rawValue)) {
        continue;
      }
      sanitized[key] = rawValue;
      continue;
    }

    if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
      sanitized[key] = rawValue;
      continue;
    }

    if (Array.isArray(rawValue) && rawValue.every((entry) => typeof entry === 'string')) {
      const nextValue = sanitizeArray(rawValue);
      if (nextValue.length > 0) {
        sanitized[key] = nextValue;
      }
    }
  }

  return sanitized;
}

function sanitizePostHogProperties(properties: Properties | null | undefined): Properties {
  const sanitized: Properties = {};

  if (!properties) {
    return sanitized;
  }

  for (const [key, rawValue] of Object.entries(properties)) {
    if (/^\$?(?:initial_)?utm_(?:source|medium|campaign|content|term)$/.test(key)) {
      continue;
    }

    if (ALLOWED_CUSTOM_PROPERTIES.has(key)) {
      Object.assign(sanitized, sanitizeCustomProperties({ [key]: rawValue }));
      continue;
    }

    const isPostHogProperty =
      key.startsWith('$') || POSTHOG_REQUIRED_PROPERTY_KEYS.has(key) || key === 'title';
    if (!isPostHogProperty) {
      continue;
    }

    if (isPostHogUrlProperty(key)) {
      sanitized[key] = normalizeAnalyticsPath(typeof rawValue === 'string' ? rawValue : undefined);
      continue;
    }

    if (typeof rawValue === 'string') {
      if (hasSensitiveString(rawValue)) {
        continue;
      }
      sanitized[key] = rawValue;
      continue;
    }

    if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
      sanitized[key] = rawValue;
    }
  }

  return sanitized;
}

function sanitizeAutocaptureProperties(properties: Properties | null | undefined): Properties {
  const sanitized: Properties = {};

  if (!properties) {
    return sanitized;
  }

  for (const [key, rawValue] of Object.entries(properties)) {
    if (!DETAILED_AUTOCAPTURE_ALLOWED_PROPERTIES.has(key)) {
      continue;
    }

    if (CUSTOM_URL_PROPERTY_KEYS.has(key)) {
      sanitized[key] = normalizeAnalyticsPath(typeof rawValue === 'string' ? rawValue : undefined);
      continue;
    }

    if (typeof rawValue === 'string') {
      if (hasSensitiveString(rawValue)) {
        continue;
      }
      sanitized[key] = rawValue;
      continue;
    }

    if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
      sanitized[key] = rawValue;
      continue;
    }

    if (Array.isArray(rawValue) && rawValue.every((entry) => typeof entry === 'string')) {
      const nextValue = sanitizeArray(rawValue);
      if (nextValue.length > 0) {
        sanitized[key] = nextValue;
      }
    }
  }

  return sanitized;
}

function sanitizeCookielessAudienceProperties(
  properties: Properties | null | undefined
): Properties {
  const sanitized: Properties = {};
  if (!properties) return sanitized;

  for (const [key, rawValue] of Object.entries(properties)) {
    if (!COOKIELESS_AUDIENCE_PROPERTY_KEYS.has(key)) continue;

    if (key === 'landing_page') {
      sanitized[key] = normalizeAnalyticsPath(typeof rawValue === 'string' ? rawValue : undefined);
      continue;
    }

    if (key === 'locale') {
      if (isSupportedLocale(rawValue)) sanitized[key] = rawValue;
      continue;
    }

    sanitized[key] = rawValue;
  }

  return sanitized;
}

function beforeSend(event: CaptureResult | null): CaptureResult | null {
  if (!event || !ALLOWED_EVENT_NAMES.has(event.event)) {
    return null;
  }

  if (postHogMode !== 'consented') {
    return null;
  }

  event.properties =
    event.event === '$autocapture'
      ? sanitizeAutocaptureProperties(event.properties)
      : sanitizePostHogProperties(event.properties);
  return event;
}

function cookielessAudienceBeforeSend(event: CaptureResult | null): CaptureResult | null {
  if (!event || event.event !== 'audience_landed') {
    return null;
  }

  event.properties = sanitizeCookielessAudienceProperties(event.properties);
  return event;
}

function loadPostHogClient(): Promise<PostHogClient | null> {
  if (postHogClient) {
    return Promise.resolve(postHogClient);
  }

  postHogImportPromise ??= import('posthog-js')
    .then((module) => {
      postHogClient = module.default;
      return postHogClient;
    })
    .catch(() => {
      postHogImportPromise = null;
      return null;
    });

  return postHogImportPromise;
}

async function ensurePostHogInitialized(): Promise<PostHogClient | null> {
  if (isPostHogInitialized && postHogClient) return postHogClient;
  if (postHogInitializationPromise) return postHogInitializationPromise;

  postHogInitializationPromise = (async () => {
    const posthog = await loadPostHogClient();
    const token = getPostHogToken();
    if (!posthog || !token) return null;

    posthog.init(token, {
      api_host: getPostHogHost(),
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: {
        dom_event_allowlist: ['click'],
        element_allowlist: ['a', 'button'],
        css_selector_allowlist: ['a', 'button', '[role="button"]', '[data-ph-autocapture="true"]'],
        css_selector_ignorelist: DETAILED_AUTOCAPTURE_IGNORELIST,
        element_attribute_ignorelist: [
          'value',
          'placeholder',
          'data-value',
          'data-email',
          'data-phone',
          'data-message',
        ],
        capture_copied_text: false,
      },
      capture_dead_clicks: false,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        blockSelector: SESSION_REPLAY_BLOCK_SELECTOR,
        maskTextSelector: SESSION_REPLAY_MASK_TEXT_SELECTOR,
      },
      disable_surveys: true,
      opt_out_capturing_by_default: readConsent() !== 'accepted',
      opt_out_capturing_persistence_type: 'localStorage',
      before_send: beforeSend,
    });

    isPostHogInitialized = true;
    return posthog;
  })().catch(() => null);

  const initializedClient = await postHogInitializationPromise;
  if (!initializedClient) postHogInitializationPromise = null;
  return initializedClient;
}

async function ensureCookielessAudiencePostHogInitialized(): Promise<PostHogClient | null> {
  if (isCookielessAudiencePostHogInitialized && cookielessAudiencePostHogClient) {
    return cookielessAudiencePostHogClient;
  }
  if (cookielessAudienceInitializationPromise) return cookielessAudienceInitializationPromise;

  cookielessAudienceInitializationPromise = (async () => {
    const posthog = await loadPostHogClient();
    const token = getPostHogToken();
    if (!posthog || !token) return null;

    const cookielessClient = posthog.init(
      token,
      {
        api_host: getPostHogHost(),
        ui_host: 'https://eu.posthog.com',
        defaults: '2026-01-30',
        persistence: 'memory',
        person_profiles: 'never',
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        capture_dead_clicks: false,
        disable_session_recording: true,
        disable_surveys: true,
        save_referrer: false,
        save_campaign_params: false,
        cookieless_mode: 'always',
        opt_out_capturing_by_default: false,
        before_send: cookielessAudienceBeforeSend,
      },
      'etoilys_cookieless_audience'
    );

    cookielessAudiencePostHogClient = cookielessClient;
    isCookielessAudiencePostHogInitialized = true;
    return cookielessClient;
  })().catch(() => null);

  const initializedClient = await cookielessAudienceInitializationPromise;
  if (!initializedClient) cookielessAudienceInitializationPromise = null;
  return initializedClient;
}

function registerConsentedAcquisitionForSession(posthog: PostHogClient, sessionId: string): void {
  const context = ensureVolatileAcquisitionContext();
  if (!context) return;

  if (registeredConsentedAcquisitionSessionId === sessionId) return;

  const acquisition =
    readPersistedSessionAcquisition(sessionId) ?? classifyConsentedAcquisition(context);

  posthog.register_for_session(acquisition);
  writePersistedSessionAcquisition(sessionId, acquisition);
  registeredConsentedAcquisitionSessionId = sessionId;
}

function subscribeToPostHogSessionAcquisition(posthog: PostHogClient): void {
  if (sessionAcquisitionUnsubscribe) return;

  try {
    sessionAcquisitionUnsubscribe = posthog.onSessionId((sessionId) => {
      if (!sessionId || postHogMode !== 'consented' || !isDetailedAnalyticsEnabled()) return;
      registerConsentedAcquisitionForSession(posthog, sessionId);
    });
  } catch {
    sessionAcquisitionUnsubscribe = null;
  }
}

function clearSessionAcquisitionRegistration(): void {
  sessionAcquisitionUnsubscribe?.();
  sessionAcquisitionUnsubscribe = null;
  registeredConsentedAcquisitionSessionId = null;
}

function captureCookielessAudienceLanding(): void {
  if (
    hasCapturedAudienceLanding ||
    !isCookielessAudienceFeatureEnabled() ||
    !isCookielessAudienceMeasurementEnabled()
  ) {
    return;
  }

  const context = ensureVolatileAcquisitionContext();
  if (!context) return;

  hasCapturedAudienceLanding = true;
  void ensureCookielessAudiencePostHogInitialized().then((posthog) => {
    if (!posthog || !isCookielessAudienceMeasurementEnabled()) return;

    posthog.capture(
      'audience_landed',
      {
        ...getAudienceLandingProperties(context),
        $geoip_disable: true,
      },
      { send_instantly: true }
    );
  });
}

async function initializePostHog(): Promise<PostHogClient | null> {
  if (isAnalyticsEnvironmentDisabled()) return null;
  if (readConsent() !== 'accepted') return null;

  const posthog = await ensurePostHogInitialized();
  if (!posthog) return null;

  if (readConsent() !== 'accepted') return null;
  if (postHogMode !== 'consented') {
    posthog.opt_in_capturing({ captureEventName: false });
    postHogMode = 'consented';
  }
  subscribeToPostHogSessionAcquisition(posthog);
  return posthog;
}

export function initializeAnalytics(): void {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);

    if (params.get('etoilys_internal') === '1') {
      writeInternalMeasurementMode();
      return;
    }

    if (params.get('etoilys_analytics_debug') === '1') {
      writeLocalStorage(DEBUG_STORAGE_KEY, 'true');
    }
  }

  ensureVolatileAcquisitionContext();
  captureCookielessAudienceLanding();
  if (readConsent() === 'accepted') void initializePostHog();
}

export function acceptAnalyticsConsent(): ConsentWriteResult {
  const previousConsent = readConsent();
  const result = setConsentPreferences({ analytics: 'accepted' });
  if (previousConsent === 'accepted') return result;

  void initializePostHog().then((posthog) => {
    if (posthog) {
      trackPageView(getCurrentPathname(), { force: true });
    }
  });
  return result;
}

export function rejectAnalyticsConsent(): ConsentWriteResult {
  const previousConsent = readConsent();
  const result = setConsentPreferences({ analytics: 'refused' });
  lastTrackedPathname = null;
  clearSessionAcquisitionRegistration();
  removeLocalStorage(SESSION_ACQUISITION_STORAGE_KEY);

  if (previousConsent === 'accepted' && isPostHogInitialized && postHogClient) {
    postHogClient.opt_out_capturing();
    postHogClient.reset();
    postHogMode = 'uninitialized';
  }
  return result;
}

export function trackPageView(pathname: string, options: { force?: boolean } = {}): boolean {
  if (!isDetailedAnalyticsEnabled()) return false;

  const eventContext = getCurrentEventContext(pathname);
  if (!options.force && lastTrackedPathname === eventContext.sourcePath) {
    return false;
  }

  lastTrackedPathname = eventContext.sourcePath;

  void initializePostHog().then((posthog) => {
    if (!posthog || !isDetailedAnalyticsEnabled()) {
      return;
    }

    const properties: AnalyticsProperties = {
      $current_url: eventContext.sourcePath,
      $pathname: eventContext.sourcePath,
      source_path: eventContext.sourcePath,
      page_type: eventContext.pageType,
      event_locale: eventContext.eventLocale,
    };

    if (isDebugModeEnabled()) {
      properties.debug_mode = true;
    }

    posthog.capture('$pageview', sanitizeCustomProperties(properties));
  });

  return true;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties
): boolean {
  if (!isDetailedAnalyticsEnabled()) return false;

  const eventContext = getCurrentEventContext();

  void initializePostHog().then((posthog) => {
    if (!posthog || !isDetailedAnalyticsEnabled()) {
      return;
    }

    const normalizedProperties: AnalyticsProperties = {
      ...properties,
      source_path: eventContext.sourcePath,
      page_type: eventContext.pageType,
      event_locale: eventContext.eventLocale,
    };

    if (isDebugModeEnabled()) {
      normalizedProperties.debug_mode = true;
    }

    posthog.capture(eventName, sanitizeCustomProperties(normalizedProperties));
  });

  return true;
}

export function trackCtaClick(input: {
  ctaId: string;
  destinationPath: string;
  ctaLocation?: string;
}): boolean {
  const eventContext = getCurrentEventContext();
  return trackEvent('cta_clicked', {
    cta_id: input.ctaId,
    cta_location: input.ctaLocation ?? eventContext.pageType,
    destination_path: normalizeAnalyticsPath(input.destinationPath),
  });
}

export function trackContactClick(contactMethod: ContactMethod): boolean {
  return trackEvent('contact_clicked', { contact_method: contactMethod });
}

export function trackFormStarted(formName: FormName): boolean {
  return trackEvent('form_started', { form_name: formName });
}

export function trackFormValidationFailed(formName: FormName, invalidFields: string[]): void {
  trackEvent('form_validation_failed', {
    form_name: formName,
    invalid_fields: invalidFields,
    invalid_field_count: invalidFields.length,
    failure_type: invalidFields.includes('turnstileToken') ? 'turnstile' : 'validation',
  });
}

export function trackFormSubmitAttempted(formName: FormName): void {
  trackEvent('form_submit_attempted', { form_name: formName });
}

export function trackFormSubmitSucceeded(formName: FormName): void {
  trackEvent('form_submit_succeeded', { form_name: formName });
}

export function trackFormSubmitFailed(
  formName: FormName,
  failureType: FormFailureType,
  fieldErrorKeys: string[] = []
): void {
  trackEvent('form_submit_failed', {
    form_name: formName,
    failure_type: failureType,
    field_error_keys: fieldErrorKeys,
  });
}

export function trackSimulatorStarted(simulator: SimulatorName): void {
  trackEvent('simulator_started', { simulator });
}

export function trackSimulatorCalculated(
  simulator: SimulatorName,
  properties: AnalyticsProperties
): void {
  trackEvent('simulator_calculated', {
    simulator,
    ...properties,
  });
}

function getNumberBucket(
  value: number | null | undefined,
  buckets: Array<{ max: number; label: string }>,
  fallback = 'unknown'
): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return buckets.find((bucket) => value <= bucket.max)?.label ?? `${buckets.length}+`;
}

function getCapacityBucket(value: number | null | undefined): string {
  return getNumberBucket(value, [
    { max: 1, label: '1' },
    { max: 2, label: '2' },
    { max: 4, label: '3-4' },
    { max: 6, label: '5-6' },
    { max: 10, label: '7-10' },
    { max: Number.POSITIVE_INFINITY, label: '11+' },
  ]);
}

function getFloorBucket(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'unknown';
  }

  if (value <= 0) return '0';
  if (value === 1) return '1';
  if (value === 2) return '2';
  return '3+';
}

function getPieceCountBucket(value: number | null | undefined): string {
  return getNumberBucket(value, [
    { max: 0, label: '0' },
    { max: 1, label: '1' },
    { max: 3, label: '2-3' },
    { max: 5, label: '4-5' },
    { max: 8, label: '6-8' },
    { max: Number.POSITIVE_INFINITY, label: '9+' },
  ]);
}

function getCriteriaCountBucket(value: number | null | undefined): string {
  return getNumberBucket(value, [
    { max: 0, label: '0' },
    { max: 5, label: '1-5' },
    { max: 20, label: '6-20' },
    { max: 50, label: '21-50' },
    { max: Number.POSITIVE_INFINITY, label: '51+' },
  ]);
}

function getClassementSimulatorContext(input: {
  requestedCategory?: string | undefined;
  housingType?: string | undefined;
  floor?: number | null | undefined;
  capacity?: number | null | undefined;
}): AnalyticsProperties {
  const properties: AnalyticsProperties = {};

  if (input.requestedCategory) {
    properties.requested_category = input.requestedCategory;
  }

  if (input.housingType) {
    properties.housing_type = input.housingType;
  }

  properties.floor_bucket = getFloorBucket(input.floor);
  properties.capacity_bucket = getCapacityBucket(input.capacity);

  return properties;
}

export function trackClassementSimulatorStarted(input: {
  requestedCategory: string;
  housingType: string;
  floor: number;
  capacity: number;
}): void {
  trackEvent('simulator_started', {
    simulator: 'classement',
    entry_point: 'new',
    ...getClassementSimulatorContext(input),
  });
}

export function trackClassementSimulatorResumed(input: {
  entryPoint: ClassementSimulatorEntryPoint;
  requestedCategory?: string | undefined;
  capacity?: number | null | undefined;
}): void {
  trackEvent('simulator_resumed', {
    simulator: 'classement',
    entry_point: input.entryPoint,
    ...getClassementSimulatorContext({
      requestedCategory: input.requestedCategory,
      capacity: input.capacity,
    }),
  });
}

export function trackClassementSimulatorDeleted(input: {
  requestedCategory?: string | undefined;
  capacity?: number | null | undefined;
}): void {
  trackEvent('simulator_deleted', {
    simulator: 'classement',
    ...getClassementSimulatorContext(input),
  });
}

export function trackClassementSimulatorStepViewed(input: {
  step: ClassementSimulatorStep;
  requestedCategory?: string | undefined;
  capacity?: number | null | undefined;
}): void {
  trackEvent('simulator_step_viewed', {
    simulator: 'classement',
    step: input.step,
    ...getClassementSimulatorContext(input),
  });
}

export function trackClassementSimulatorPieceSaved(input: {
  pieceAction: ClassementSimulatorPieceAction;
  pieceType: string;
  pieceScope: ClassementSimulatorPieceScope;
  pieceCount: number;
}): void {
  trackEvent('simulator_piece_saved', {
    simulator: 'classement',
    piece_action: input.pieceAction,
    piece_type: input.pieceType,
    piece_scope: input.pieceScope,
    piece_count_bucket: getPieceCountBucket(input.pieceCount),
  });
}

export function trackClassementSimulatorPieceDeleted(input: {
  pieceType?: string | undefined;
  pieceScope?: ClassementSimulatorPieceScope | undefined;
  pieceCount: number;
}): void {
  const properties: AnalyticsProperties = {
    simulator: 'classement',
    piece_count_bucket: getPieceCountBucket(input.pieceCount),
  };

  if (input.pieceType) {
    properties.piece_type = input.pieceType;
  }

  if (input.pieceScope) {
    properties.piece_scope = input.pieceScope;
  }

  trackEvent('simulator_piece_deleted', properties);
}

export function trackClassementSimulatorGridResponseSaved(input: {
  criterionNumber: number;
  criterionStatus?: string | undefined;
  validationStatus: string;
  progressBucket: number;
  remainingCriteriaCount: number;
  missingMandatoryCount: number;
}): void {
  const properties: AnalyticsProperties = {
    simulator: 'classement',
    criterion_number: input.criterionNumber,
    validation_status: input.validationStatus,
    progress_bucket: input.progressBucket,
    remaining_criteria_bucket: getCriteriaCountBucket(input.remainingCriteriaCount),
    missing_mandatory_bucket: getCriteriaCountBucket(input.missingMandatoryCount),
  };

  if (input.criterionStatus) {
    properties.criterion_status = input.criterionStatus;
  }

  trackEvent('simulator_grid_response_saved', properties);
}

export function trackClassementSimulatorGridProgressReached(input: {
  progressBucket: number;
  remainingCriteriaCount: number;
  missingMandatoryCount: number;
}): void {
  trackEvent('simulator_grid_progress_reached', {
    simulator: 'classement',
    progress_bucket: input.progressBucket,
    remaining_criteria_bucket: getCriteriaCountBucket(input.remainingCriteriaCount),
    missing_mandatory_bucket: getCriteriaCountBucket(input.missingMandatoryCount),
  });
}

export function trackClassementSimulatorResultRequested(input: {
  progressBucket: number;
  remainingCriteriaCount: number;
  missingMandatoryCount: number;
}): void {
  trackEvent('simulator_result_requested', {
    simulator: 'classement',
    progress_bucket: input.progressBucket,
    remaining_criteria_bucket: getCriteriaCountBucket(input.remainingCriteriaCount),
    missing_mandatory_bucket: getCriteriaCountBucket(input.missingMandatoryCount),
  });
}

export function trackClassementSimulatorResultBlocked(input: {
  hasSleepingCapacityIssue: boolean;
  hasMissingCriteria: boolean;
  missingMandatoryCount: number;
  remainingCriteriaCount: number;
}): void {
  trackEvent('simulator_result_blocked', {
    simulator: 'classement',
    result_outcome: 'needs_completion',
    has_sleeping_capacity_issue: input.hasSleepingCapacityIssue,
    has_missing_criteria: input.hasMissingCriteria,
    missing_mandatory_bucket: getCriteriaCountBucket(input.missingMandatoryCount),
    remaining_criteria_bucket: getCriteriaCountBucket(input.remainingCriteriaCount),
  });
}

export function trackClassementSimulatorCalculated(input: {
  resultOutcome: Exclude<ClassementSimulatorResultOutcome, 'needs_completion'>;
  progressBucket: number;
  remainingCriteriaCount: number;
  missingMandatoryCount: number;
}): void {
  trackSimulatorCalculated('classement', {
    result_outcome: input.resultOutcome,
    progress_bucket: input.progressBucket,
    remaining_criteria_bucket: getCriteriaCountBucket(input.remainingCriteriaCount),
    missing_mandatory_bucket: getCriteriaCountBucket(input.missingMandatoryCount),
  });
}

export function trackClassementSimulatorPdfExported(input: {
  resultOutcome: Exclude<ClassementSimulatorResultOutcome, 'needs_completion'>;
}): void {
  trackEvent('simulator_pdf_exported', {
    simulator: 'classement',
    result_outcome: input.resultOutcome,
  });
}

export function trackClassementSimulatorHelpOpened(input: {
  criterionNumber: number;
  criterionStatus?: string | undefined;
}): void {
  const properties: AnalyticsProperties = {
    simulator: 'classement',
    criterion_number: input.criterionNumber,
  };

  if (input.criterionStatus) {
    properties.criterion_status = input.criterionStatus;
  }

  trackEvent('simulator_help_opened', properties);
}

export const analyticsInternalsForTests = {
  beforeSend,
  cookielessAudienceBeforeSend,
  sanitizeAutocaptureProperties,
  sanitizeCookielessAudienceProperties,
  sanitizeCustomProperties,
  sanitizePostHogProperties,
  reset: () => {
    isPostHogInitialized = false;
    isCookielessAudiencePostHogInitialized = false;
    postHogMode = 'uninitialized';
    lastTrackedPathname = null;
    volatileAcquisitionContext = null;
    hasCapturedAudienceLanding = false;
    clearSessionAcquisitionRegistration();
    postHogClient = null;
    cookielessAudiencePostHogClient = null;
    postHogImportPromise = null;
    postHogInitializationPromise = null;
    cookielessAudienceInitializationPromise = null;
  },
};
