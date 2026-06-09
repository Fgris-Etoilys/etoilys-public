import type { CaptureResult, Properties } from 'posthog-js';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'etoilys_analytics_consent';
export const ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_analytics_consent_updated_at';
const INTERNAL_STORAGE_KEY = 'etoilys_analytics_internal';
const DEBUG_STORAGE_KEY = 'etoilys_analytics_debug';
const ANALYTICS_CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;

export type AnalyticsConsent = 'accepted' | 'refused';
type FormName = 'contact' | 'demande_classement';
type SimulatorName = 'taxe_sejour' | 'fiscal_classement' | 'classement';
type FormFailureType = 'validation' | 'api' | 'network' | 'turnstile';
type ClassementSimulatorEntryPoint = 'new' | 'resume_card' | 'direct';
type ClassementSimulatorStep = 'pieces' | 'grid' | 'result';
type ClassementSimulatorPieceAction = 'created' | 'updated';
type ClassementSimulatorPieceScope = 'interior' | 'exterior';
type ClassementSimulatorResultOutcome = 'favorable' | 'defavorable' | 'needs_completion';

type AnalyticsValue = string | number | boolean | string[];
type AnalyticsProperties = Record<string, AnalyticsValue>;

export type AnalyticsEventName =
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

const ALLOWED_POSTHOG_PROPERTIES = new Set<string>([
  '$browser',
  '$browser_language',
  '$browser_language_prefix',
  '$browser_version',
  '$config_defaults',
  '$device',
  '$device_type',
  '$geoip_country_code',
  '$geoip_country_name',
  '$host',
  '$lib',
  '$lib_version',
  '$os',
  '$os_version',
  '$pathname',
  '$referring_domain',
  '$screen_height',
  '$screen_width',
  '$search_engine',
  '$timezone',
  '$timezone_offset',
  '$viewport_height',
  '$viewport_width',
]);

const URL_PROPERTY_KEYS = new Set(['$current_url', '$referrer', 'source_path', 'destination_path']);
const SENSITIVE_PROPERTY_PATTERN =
  /(email|mail|phone|telephone|téléphone|tel|nom|prenom|prénom|name|adresse|address|message|content|contenu|token|turnstile|captcha)/i;
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_PATTERN = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;

let isPostHogInitialized = false;
let isPostHogCaptureEnabled = false;
let lastTrackedPathname: string | null = null;

type PostHogClient = typeof import('posthog-js').default;

let postHogClient: PostHogClient | null = null;
let postHogImportPromise: Promise<PostHogClient | null> | null = null;

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
  if (value !== 'accepted' && value !== 'refused') {
    return null;
  }

  return isConsentFresh(readConsentUpdatedAt()) ? value : null;
}

function writeConsent(value: AnalyticsConsent): void {
  writeLocalStorage(ANALYTICS_CONSENT_STORAGE_KEY, value);
  writeLocalStorage(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY, String(Date.now()));
}

export function getAnalyticsConsentStatus(): AnalyticsConsent | null {
  return readConsent();
}

export function normalizeAnalyticsPath(value: string | null | undefined): string {
  if (!value) {
    return '/';
  }

  const normalizeDynamicPathname = (pathname: string): string => {
    const normalizedPathname = pathname || '/';
    if (/^\/simulateur\/[^/]+\/?$/.test(normalizedPathname)) {
      return '/simulateur/:simulationId';
    }

    return normalizedPathname;
  };

  try {
    const url = new URL(value, 'https://www.etoilys.fr');
    return normalizeDynamicPathname(url.pathname);
  } catch {
    const withoutHash = value.split('#')[0] ?? '';
    const withoutQuery = withoutHash.split('?')[0] ?? '';
    return normalizeDynamicPathname(withoutQuery.startsWith('/') ? withoutQuery || '/' : '/');
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

function isAnalyticsEnabled(): boolean {
  return readConsent() === 'accepted' && !isInternalAnalyticsDisabled();
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

function sanitizeProperties(properties: Properties | null | undefined): Properties {
  const sanitized: Properties = {};

  if (!properties) {
    return sanitized;
  }

  for (const [key, rawValue] of Object.entries(properties)) {
    if (!ALLOWED_CUSTOM_PROPERTIES.has(key) && !ALLOWED_POSTHOG_PROPERTIES.has(key)) {
      continue;
    }

    if (!ALLOWED_CUSTOM_PROPERTIES.has(key) && SENSITIVE_PROPERTY_PATTERN.test(key)) {
      continue;
    }

    if (URL_PROPERTY_KEYS.has(key)) {
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

function beforeSend(event: CaptureResult | null): CaptureResult | null {
  if (!event || !ALLOWED_EVENT_NAMES.has(event.event)) {
    return null;
  }

  event.properties = sanitizeProperties(event.properties);
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

async function initializePostHog(): Promise<PostHogClient | null> {
  if (isLocalDevelopmentAnalyticsDisabled()) {
    return null;
  }

  if (!isAnalyticsEnabled()) {
    return null;
  }

  const posthog = await loadPostHogClient();
  if (!posthog || !isAnalyticsEnabled()) {
    return null;
  }

  if (isPostHogInitialized) {
    if (!isPostHogCaptureEnabled) {
      posthog.opt_in_capturing();
      isPostHogCaptureEnabled = true;
    }
    return posthog;
  }

  const token = getPostHogToken();
  if (!token) {
    return null;
  }

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
    opt_out_capturing_by_default: true,
    opt_out_capturing_persistence_type: 'localStorage',
    before_send: beforeSend,
    loaded: (client) => {
      client.opt_in_capturing();
      isPostHogCaptureEnabled = true;
    },
  });

  isPostHogInitialized = true;
  isPostHogCaptureEnabled = true;
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

  if (readConsent() === 'accepted') {
    void initializePostHog();
  }
}

export function acceptAnalyticsConsent(): void {
  writeConsent('accepted');
  void initializePostHog().then((posthog) => {
    if (posthog) {
      trackPageView(getCurrentPathname(), { force: true });
    }
  });
}

export function rejectAnalyticsConsent(): void {
  writeConsent('refused');
  lastTrackedPathname = null;

  if (isPostHogInitialized && postHogClient) {
    if (typeof postHogClient.opt_out_capturing === 'function') {
      postHogClient.opt_out_capturing();
    }

    if (typeof postHogClient.reset === 'function') {
      postHogClient.reset();
    }
  }

  isPostHogCaptureEnabled = false;
}

export function trackPageView(pathname: string, options: { force?: boolean } = {}): void {
  void initializePostHog().then((posthog) => {
    if (!posthog) {
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

    posthog.capture('$pageview', properties);
  });
}

export function trackEvent(eventName: AnalyticsEventName, properties: AnalyticsProperties): void {
  void initializePostHog().then((posthog) => {
    if (!posthog) {
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

    posthog.capture(eventName, normalizedProperties);
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
  sanitizeProperties,
  reset: () => {
    isPostHogInitialized = false;
    isPostHogCaptureEnabled = false;
    lastTrackedPathname = null;
    postHogClient = null;
    postHogImportPromise = null;
  },
};
