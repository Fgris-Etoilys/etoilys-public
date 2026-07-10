import type { CaptureResult, Properties } from 'posthog-js';
import {
  captureVolatileAcquisitionContext,
  classifyConsentedAcquisition,
  getAudienceLandingProperties,
  normalizeAnalyticsPath,
  type VolatileAcquisitionContext,
} from './acquisition';

export { normalizeAnalyticsPath } from './acquisition';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'etoilys_analytics_consent';
export const ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_analytics_consent_updated_at';
export const COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY = 'etoilys_cookieless_audience_opt_out';
const INTERNAL_STORAGE_KEY = 'etoilys_analytics_internal';
const DEBUG_STORAGE_KEY = 'etoilys_analytics_debug';
const ANALYTICS_CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;

export type AnalyticsConsent = 'accepted' | 'refused';
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
  | 'audience_landed'
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
  'audience_landed',
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
  'acquisition_channel',
  'acquisition_source',
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
  'has_bathroom_issue',
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
]);
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_PATTERN = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;

let isPostHogInitialized = false;
let postHogMode: 'uninitialized' | 'consented' | 'cookieless' = 'uninitialized';
let lastTrackedPathname: string | null = null;
let volatileConsent: AnalyticsConsent | null = null;
let volatileConsentUpdatedAt: number | null = null;
let volatileCookielessAudienceOptOut = false;
let volatileAcquisitionContext: VolatileAcquisitionContext | null = null;
let hasCapturedAudienceLanding = false;
let hasRegisteredConsentedAcquisition = false;

type PostHogClient = typeof import('posthog-js').default;

let postHogClient: PostHogClient | null = null;
let postHogImportPromise: Promise<PostHogClient | null> | null = null;
let postHogInitializationPromise: Promise<PostHogClient | null> | null = null;

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
    // Analytics must never break the user experience.
  }
}

function readConsentUpdatedAt(): number | null {
  const value = readLocalStorage(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY);
  if (!value) {
    return null;
  }

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isConsentFresh(updatedAt: number | null): boolean {
  return updatedAt !== null && Date.now() - updatedAt <= ANALYTICS_CONSENT_MAX_AGE_MS;
}

function readConsent(): AnalyticsConsent | null {
  const value = readLocalStorage(ANALYTICS_CONSENT_STORAGE_KEY);
  const updatedAt = readConsentUpdatedAt();

  if ((value === 'accepted' || value === 'refused') && isConsentFresh(updatedAt)) {
    return value;
  }

  return isConsentFresh(volatileConsentUpdatedAt) ? volatileConsent : null;
}

function writeConsent(value: AnalyticsConsent): void {
  const updatedAt = Date.now();
  volatileConsent = value;
  volatileConsentUpdatedAt = updatedAt;
  writeLocalStorage(ANALYTICS_CONSENT_STORAGE_KEY, value);
  writeLocalStorage(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY, String(updatedAt));
}

export function getAnalyticsConsentStatus(): AnalyticsConsent | null {
  return readConsent();
}

export function isCookielessAudienceMeasurementEnabled(): boolean {
  return (
    readLocalStorage(COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY) !== 'true' &&
    !volatileCookielessAudienceOptOut
  );
}

export function setCookielessAudienceMeasurementEnabled(enabled: boolean): void {
  volatileCookielessAudienceOptOut = !enabled;
  writeLocalStorage(COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY, enabled ? 'false' : 'true');

  if (enabled && readConsent() === 'refused') {
    void initializePostHog('cookieless', { captureAudienceLanding: true });
  }
}

function getCurrentPathname(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizeAnalyticsPath(window.location.pathname);
}

function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/actualites/')) return 'article';
  if (pathname === '/actualites') return 'actualites';
  if (pathname.includes('simulateur')) return 'simulateur';
  if (pathname === '/contact' || pathname === '/demande-classement') return 'formulaire';
  if (pathname === '/confidentialite' || pathname === '/mentions-legales') return 'legal';
  return 'page';
}

function isInternalAnalyticsDisabled(): boolean {
  return readLocalStorage(INTERNAL_STORAGE_KEY) === 'true';
}

function isDebugModeEnabled(): boolean {
  return readLocalStorage(DEBUG_STORAGE_KEY) === 'true';
}

function isDetailedAnalyticsEnabled(): boolean {
  return readConsent() === 'accepted' && !isInternalAnalyticsDisabled();
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

function getPostHogToken(): string | undefined {
  return import.meta.env?.VITE_PUBLIC_POSTHOG_TOKEN;
}

function getPostHogHost(): string {
  return import.meta.env?.VITE_PUBLIC_POSTHOG_HOST || 'https://f.etoilys.fr';
}

function isLocalDevelopmentAnalyticsDisabled(): boolean {
  return (
    import.meta.env?.DEV === true &&
    import.meta.env?.MODE !== 'test' &&
    import.meta.env?.VITE_ENABLE_ANALYTICS_IN_DEV !== 'true'
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

    sanitized[key] = rawValue;
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
      if (rawValue === 'fr' || rawValue === 'en') sanitized[key] = rawValue;
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

  if (event.event === 'audience_landed') {
    event.properties = sanitizeCookielessAudienceProperties(event.properties);
    return event;
  }

  if (postHogMode !== 'consented') {
    return null;
  }

  event.properties = sanitizePostHogProperties(event.properties);
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
    .catch(() => null);

  return postHogImportPromise;
}

type PostHogTargetMode = 'consented' | 'cookieless';

async function ensurePostHogInitialized(): Promise<PostHogClient | null> {
  if (isPostHogInitialized && postHogClient) return postHogClient;
  if (postHogInitializationPromise) return postHogInitializationPromise;

  postHogInitializationPromise = (async () => {
    const posthog = await loadPostHogClient();
    const token = getPostHogToken();
    if (!posthog || !token) return null;

    const startsConsented = readConsent() === 'accepted';
    posthog.init(token, {
      api_host: getPostHogHost(),
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      capture_dead_clicks: false,
      disable_session_recording: true,
      disable_surveys: true,
      ...(isCookielessAudienceFeatureEnabled() ? ({ cookieless_mode: 'on_reject' } as const) : {}),
      opt_out_capturing_by_default: !startsConsented,
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

function registerConsentedAcquisition(posthog: PostHogClient): void {
  const context = ensureVolatileAcquisitionContext();
  if (!context) return;
  posthog.register_for_session(classifyConsentedAcquisition(context));
}

function captureCookielessAudienceLanding(posthog: PostHogClient): void {
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
  posthog.capture(
    'audience_landed',
    {
      ...getAudienceLandingProperties(context),
      $geoip_disable: true,
    },
    { send_instantly: true }
  );
}

async function initializePostHog(
  targetMode: PostHogTargetMode,
  options: { captureAudienceLanding?: boolean } = {}
): Promise<PostHogClient | null> {
  if (isLocalDevelopmentAnalyticsDisabled() || isInternalAnalyticsDisabled()) return null;
  if (targetMode === 'consented' && readConsent() !== 'accepted') return null;
  if (
    targetMode === 'cookieless' &&
    (readConsent() !== 'refused' ||
      !isCookielessAudienceFeatureEnabled() ||
      !isCookielessAudienceMeasurementEnabled())
  ) {
    return null;
  }

  const posthog = await ensurePostHogInitialized();
  if (!posthog) return null;

  if (targetMode === 'consented') {
    if (readConsent() !== 'accepted') return null;
    if (postHogMode !== 'consented') {
      posthog.opt_in_capturing({ captureEventName: false });
      postHogMode = 'consented';
    }
    if (!hasRegisteredConsentedAcquisition) {
      registerConsentedAcquisition(posthog);
      hasRegisteredConsentedAcquisition = true;
    }
    return posthog;
  }

  if (readConsent() !== 'refused') return null;
  if (postHogMode === 'consented') posthog.opt_out_capturing();
  postHogMode = 'cookieless';
  if (options.captureAudienceLanding) captureCookielessAudienceLanding(posthog);
  return posthog;
}

export function initializeAnalytics(): void {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);

    if (params.get('etoilys_internal') === '1') {
      writeLocalStorage(INTERNAL_STORAGE_KEY, 'true');
      return;
    }

    if (params.get('etoilys_analytics_debug') === '1') {
      writeLocalStorage(DEBUG_STORAGE_KEY, 'true');
    }
  }

  ensureVolatileAcquisitionContext();
  const consent = readConsent();
  if (consent === 'accepted') void initializePostHog('consented');
  if (consent === 'refused') {
    void initializePostHog('cookieless', { captureAudienceLanding: true });
  }
}

export function acceptAnalyticsConsent(): void {
  writeConsent('accepted');
  void initializePostHog('consented').then((posthog) => {
    if (posthog) {
      trackPageView(getCurrentPathname(), { force: true });
    }
  });
}

export function rejectAnalyticsConsent(): void {
  const previousConsent = readConsent();
  writeConsent('refused');
  lastTrackedPathname = null;

  if (previousConsent === 'accepted' && isPostHogInitialized && postHogClient) {
    postHogClient.opt_out_capturing();
    postHogClient.reset();
    postHogMode = 'cookieless';
    hasRegisteredConsentedAcquisition = false;
    return;
  }

  void initializePostHog('cookieless', { captureAudienceLanding: true });
}

export function trackPageView(pathname: string, options: { force?: boolean } = {}): void {
  if (!isDetailedAnalyticsEnabled()) return;

  void initializePostHog('consented').then((posthog) => {
    if (!posthog || !isDetailedAnalyticsEnabled()) {
      return;
    }

    const normalizedPathname = normalizeAnalyticsPath(pathname);
    if (!options.force && lastTrackedPathname === normalizedPathname) {
      return;
    }

    lastTrackedPathname = normalizedPathname;
    const properties: AnalyticsProperties = {
      $current_url: normalizedPathname,
      $pathname: normalizedPathname,
      source_path: normalizedPathname,
      page_type: getPageType(normalizedPathname),
    };

    if (isDebugModeEnabled()) {
      properties.debug_mode = true;
    }

    posthog.capture('$pageview', sanitizeCustomProperties(properties));
  });
}

export function trackEvent(eventName: AnalyticsEventName, properties: AnalyticsProperties): void {
  if (!isDetailedAnalyticsEnabled() || eventName === 'audience_landed') return;

  void initializePostHog('consented').then((posthog) => {
    if (!posthog || !isDetailedAnalyticsEnabled()) {
      return;
    }

    const normalizedProperties: AnalyticsProperties = {
      source_path: getCurrentPathname(),
      page_type: getPageType(getCurrentPathname()),
      ...properties,
    };

    if (isDebugModeEnabled()) {
      normalizedProperties.debug_mode = true;
    }

    posthog.capture(eventName, sanitizeCustomProperties(normalizedProperties));
  });
}

export function trackCtaClick(input: {
  ctaId: string;
  destinationPath: string;
  ctaLocation?: string;
}): void {
  trackEvent('cta_clicked', {
    cta_id: input.ctaId,
    cta_location: input.ctaLocation ?? getPageType(getCurrentPathname()),
    destination_path: normalizeAnalyticsPath(input.destinationPath),
  });
}

export function trackContactClick(contactMethod: ContactMethod): void {
  trackEvent('contact_clicked', { contact_method: contactMethod });
}

export function trackFormStarted(formName: FormName): void {
  trackEvent('form_started', { form_name: formName });
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
  hasBathroomIssue: boolean;
  hasMissingCriteria: boolean;
  missingMandatoryCount: number;
  remainingCriteriaCount: number;
}): void {
  trackEvent('simulator_result_blocked', {
    simulator: 'classement',
    result_outcome: 'needs_completion',
    has_sleeping_capacity_issue: input.hasSleepingCapacityIssue,
    has_bathroom_issue: input.hasBathroomIssue,
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
  sanitizeCookielessAudienceProperties,
  sanitizeCustomProperties,
  sanitizePostHogProperties,
  reset: () => {
    isPostHogInitialized = false;
    postHogMode = 'uninitialized';
    lastTrackedPathname = null;
    volatileConsent = null;
    volatileConsentUpdatedAt = null;
    volatileCookielessAudienceOptOut = false;
    volatileAcquisitionContext = null;
    hasCapturedAudienceLanding = false;
    hasRegisteredConsentedAcquisition = false;
    postHogClient = null;
    postHogImportPromise = null;
    postHogInitializationPromise = null;
  },
};
