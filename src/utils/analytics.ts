import posthog from 'posthog-js';
import type { CaptureResult, Properties } from 'posthog-js';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'etoilys_analytics_consent';
export const ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY = 'etoilys_analytics_consent_updated_at';
const INTERNAL_STORAGE_KEY = 'etoilys_analytics_internal';
const DEBUG_STORAGE_KEY = 'etoilys_analytics_debug';
const ANALYTICS_CONSENT_MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;

export type AnalyticsConsent = 'accepted' | 'refused';
type FormName = 'contact' | 'demande_classement';
type SimulatorName = 'taxe_sejour' | 'fiscal_classement';
type FormFailureType = 'validation' | 'api' | 'network' | 'turnstile';

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
  | 'simulator_calculated';

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

  try {
    const url = new URL(value, 'https://www.etoilys.fr');
    return url.pathname || '/';
  } catch {
    const withoutHash = value.split('#')[0] ?? '';
    const withoutQuery = withoutHash.split('?')[0] ?? '';
    return withoutQuery.startsWith('/') ? withoutQuery || '/' : '/';
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
  return import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN;
}

function getPostHogHost(): string {
  return import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
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

function initializePostHog(): boolean {
  if (!isAnalyticsEnabled()) {
    return false;
  }

  if (isPostHogInitialized) {
    if (!isPostHogCaptureEnabled) {
      posthog.opt_in_capturing();
      isPostHogCaptureEnabled = true;
    }
    return true;
  }

  const token = getPostHogToken();
  if (!token) {
    return false;
  }

  posthog.init(token, {
    api_host: getPostHogHost(),
    defaults: '2026-01-30',
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
  return true;
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
    initializePostHog();
  }
}

export function acceptAnalyticsConsent(): void {
  writeConsent('accepted');
  if (initializePostHog()) {
    trackPageView(getCurrentPathname(), { force: true });
  }
}

export function rejectAnalyticsConsent(): void {
  writeConsent('refused');
  lastTrackedPathname = null;

  if (isPostHogInitialized) {
    if (typeof posthog.opt_out_capturing === 'function') {
      posthog.opt_out_capturing();
    }

    if (typeof posthog.reset === 'function') {
      posthog.reset();
    }
  }

  isPostHogCaptureEnabled = false;
}

export function trackPageView(pathname: string, options: { force?: boolean } = {}): void {
  if (!initializePostHog()) {
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
}

export function trackEvent(eventName: AnalyticsEventName, properties: AnalyticsProperties): void {
  if (!initializePostHog()) {
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

export const analyticsInternalsForTests = {
  beforeSend,
  sanitizeProperties,
  reset: () => {
    isPostHogInitialized = false;
    isPostHogCaptureEnabled = false;
    lastTrackedPathname = null;
  },
};
