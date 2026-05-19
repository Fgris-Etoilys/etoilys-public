import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  acceptAnalyticsConsent,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
  analyticsInternalsForTests,
  getAnalyticsConsentStatus,
  initializeAnalytics,
  normalizeAnalyticsPath,
  rejectAnalyticsConsent,
  trackClassementSimulatorStarted,
  trackEvent,
  trackPageView,
} from './analytics';

const posthogMock = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  optIn: vi.fn(),
  optInDirect: vi.fn(),
  optOut: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('posthog-js', () => ({
  default: {
    init: posthogMock.init,
    capture: posthogMock.capture,
    opt_in_capturing: posthogMock.optInDirect,
    opt_out_capturing: posthogMock.optOut,
    reset: posthogMock.reset,
  },
}));

function triggerLoadedCallback() {
  const config = posthogMock.init.mock.calls[0]?.[1];
  config?.loaded?.({ opt_in_capturing: posthogMock.optIn });
}

describe('analytics', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    posthogMock.init.mockReset();
    posthogMock.capture.mockReset();
    posthogMock.optIn.mockReset();
    posthogMock.optInDirect.mockReset();
    posthogMock.optOut.mockReset();
    posthogMock.reset.mockReset();
    analyticsInternalsForTests.reset();
    vi.stubEnv('VITE_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://f.etoilys.fr');
    window.localStorage.clear();
    window.history.pushState({}, 'Test', '/test?secret=value#hash');
  });

  it('does not initialize PostHog without accepted consent', () => {
    initializeAnalytics();
    trackEvent('cta_clicked', {
      cta_id: 'cta_primary_demande_classement',
      destination_path: '/demande-classement',
    });

    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('does not initialize PostHog when consent is refused', () => {
    rejectAnalyticsConsent();
    initializeAnalytics();
    trackPageView('/contact');

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('refused');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY)).toEqual(
      expect.any(String)
    );
    expect(posthogMock.init).not.toHaveBeenCalled();
  });

  it('does not initialize PostHog in local dev unless explicitly enabled', () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('VITE_ENABLE_ANALYTICS_IN_DEV', 'false');

    acceptAnalyticsConsent();
    trackPageView('/contact');

    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('disables analytics completely in internal mode', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'accepted');
    window.history.pushState({}, 'Test', '/?etoilys_internal=1');

    initializeAnalytics();
    acceptAnalyticsConsent();
    trackPageView('/contact');

    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('initializes only after accepted consent and captures the current pageview manually', () => {
    acceptAnalyticsConsent();
    triggerLoadedCallback();

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY)).toEqual(
      expect.any(String)
    );
    expect(posthogMock.init).toHaveBeenCalledTimes(1);
    expect(posthogMock.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({
        api_host: 'https://f.etoilys.fr',
        ui_host: 'https://eu.posthog.com',
        defaults: '2026-01-30',
        person_profiles: 'identified_only',
        opt_out_capturing_persistence_type: 'localStorage',
      })
    );
    expect(posthogMock.optIn).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledWith(
      '$pageview',
      expect.objectContaining({
        $current_url: '/test',
        $pathname: '/test',
        source_path: '/test',
      })
    );
  });

  it('adds debug_mode only after consent when debug mode is enabled', () => {
    window.history.pushState({}, 'Test', '/?etoilys_analytics_debug=1');
    initializeAnalytics();
    trackPageView('/contact');
    expect(posthogMock.capture).not.toHaveBeenCalled();

    acceptAnalyticsConsent();

    expect(posthogMock.capture).toHaveBeenCalledWith(
      '$pageview',
      expect.objectContaining({ debug_mode: true })
    );
  });

  it('treats consent as missing when the timestamp is older than 6 months', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'accepted');
    window.localStorage.setItem(
      ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
      String(Date.now() - 184 * 24 * 60 * 60 * 1000)
    );

    initializeAnalytics();
    trackPageView('/contact');

    expect(getAnalyticsConsentStatus()).toBeNull();
    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('opts out and resets PostHog when accepted consent is withdrawn', () => {
    acceptAnalyticsConsent();
    rejectAnalyticsConsent();
    trackPageView('/contact');
    trackEvent('cta_clicked', {
      cta_id: 'cta_primary_contact',
      destination_path: '/contact',
    });

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('refused');
    expect(posthogMock.optOut).toHaveBeenCalledTimes(1);
    expect(posthogMock.reset).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledTimes(1);
  });

  it('allows accepting again after a previous refusal and captures the current page once', () => {
    acceptAnalyticsConsent();
    rejectAnalyticsConsent();
    posthogMock.capture.mockClear();

    acceptAnalyticsConsent();
    trackEvent('cta_clicked', {
      cta_id: 'cta_primary_contact',
      destination_path: '/contact',
    });

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(posthogMock.optInDirect).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledWith(
      '$pageview',
      expect.objectContaining({ source_path: '/test' })
    );
    expect(posthogMock.capture).toHaveBeenCalledWith(
      'cta_clicked',
      expect.objectContaining({ cta_id: 'cta_primary_contact' })
    );
  });

  it('normalizes paths without query strings or hashes', () => {
    expect(normalizeAnalyticsPath('https://www.etoilys.fr/contact?x=1#section')).toBe('/contact');
    expect(normalizeAnalyticsPath('/demande-classement?utm=test')).toBe('/demande-classement');
    expect(normalizeAnalyticsPath('/simulateur/c3f43f31-59fd-4b4e-9272-7f1321d8cabc')).toBe(
      '/simulateur/:simulationId'
    );
    expect(
      normalizeAnalyticsPath(
        'https://www.etoilys.fr/simulateur/c3f43f31-59fd-4b4e-9272-7f1321d8cabc?utm=test#grid'
      )
    ).toBe('/simulateur/:simulationId');
  });

  it('sanitizes URL and sensitive properties before sending', () => {
    const sanitized = analyticsInternalsForTests.beforeSend({
      event: 'form_submit_failed',
      uuid: 'test-form-submit-failed',
      properties: {
        source_path: '/contact?email=test@example.com#form',
        $current_url: 'https://www.etoilys.fr/contact?x=1',
        $referrer: 'https://www.google.com/search?q=etoilys',
        form_name: 'contact',
        invalid_fields: ['email', 'message'],
        email: 'test@example.com',
        message: 'contenu libre',
      },
    });

    expect(sanitized?.properties).toEqual({
      source_path: '/contact',
      $current_url: '/contact',
      $referrer: '/search',
      form_name: 'contact',
      invalid_fields: ['email', 'message'],
    });
  });

  it('drops events outside the v1 contract', () => {
    expect(
      analyticsInternalsForTests.beforeSend({
        event: '$autocapture',
        uuid: 'test-autocapture',
        properties: {},
      })
    ).toBeNull();
  });

  it('captures classement simulator events with bucketed non-identifying properties', () => {
    acceptAnalyticsConsent();
    posthogMock.capture.mockClear();

    trackClassementSimulatorStarted({
      requestedCategory: '4*',
      housingType: 'COLLECTIF',
      floor: 4,
      capacity: 7,
    });

    expect(posthogMock.capture).toHaveBeenCalledWith(
      'simulator_started',
      expect.objectContaining({
        simulator: 'classement',
        entry_point: 'new',
        requested_category: '4*',
        housing_type: 'COLLECTIF',
        floor_bucket: '3+',
        capacity_bucket: '7-10',
      })
    );
  });
});
