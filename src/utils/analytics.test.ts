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
    posthogMock.init.mockReset();
    posthogMock.capture.mockReset();
    posthogMock.optIn.mockReset();
    posthogMock.optInDirect.mockReset();
    posthogMock.optOut.mockReset();
    posthogMock.reset.mockReset();
    analyticsInternalsForTests.reset();
    vi.stubEnv('VITE_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://eu.i.posthog.com');
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
  });

  it('sanitizes URL and sensitive properties before sending', () => {
    const sanitized = analyticsInternalsForTests.beforeSend({
      event: 'form_submit_failed',
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
        properties: {},
      })
    ).toBeNull();
  });
});
