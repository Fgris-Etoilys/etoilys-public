import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  acceptAnalyticsConsent,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
  COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY,
  analyticsInternalsForTests,
  getAnalyticsConsentStatus,
  initializeAnalytics,
  normalizeAnalyticsPath,
  rejectAnalyticsConsent,
  setCookielessAudienceMeasurementEnabled,
  trackClassementSimulatorStarted,
  trackEvent,
  trackPageView,
} from './analytics';

const posthogMock = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  optInDirect: vi.fn(),
  optOut: vi.fn(),
  registerForSession: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('posthog-js', () => ({
  default: {
    init: posthogMock.init,
    capture: posthogMock.capture,
    opt_in_capturing: posthogMock.optInDirect,
    opt_out_capturing: posthogMock.optOut,
    register_for_session: posthogMock.registerForSession,
    reset: posthogMock.reset,
  },
}));

async function flushAnalyticsImports() {
  await vi.dynamicImportSettled();
  await Promise.resolve();
  await Promise.resolve();
}

describe('analytics', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    posthogMock.init.mockReset();
    posthogMock.capture.mockReset();
    posthogMock.optInDirect.mockReset();
    posthogMock.optOut.mockReset();
    posthogMock.registerForSession.mockReset();
    posthogMock.reset.mockReset();
    analyticsInternalsForTests.reset();
    vi.stubEnv('VITE_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://f.etoilys.fr');
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'false');
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

  it('does not initialize PostHog without a choice even when cookieless is enabled', () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');

    initializeAnalytics();

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

  it('captures one minimal event after an explicit refusal when the feature is enabled', async () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');
    window.history.pushState({}, 'Test', '/contact?utm_source=chatgpt.com#form');

    rejectAnalyticsConsent();
    await flushAnalyticsImports();
    initializeAnalytics();
    await flushAnalyticsImports();

    expect(posthogMock.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({
        cookieless_mode: 'on_reject',
        opt_out_capturing_by_default: true,
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
      })
    );
    expect(posthogMock.capture).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledWith(
      'audience_landed',
      {
        landing_page: '/contact',
        locale: 'fr',
        $geoip_disable: true,
      },
      { send_instantly: true }
    );
  });

  it('does not capture minimal audience after the independent opposition', async () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');
    setCookielessAudienceMeasurementEnabled(false);

    rejectAnalyticsConsent();
    await flushAnalyticsImports();

    expect(window.localStorage.getItem(COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY)).toBe('true');
    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('removes automatic acquisition properties from the cookieless payload', () => {
    const sanitized = analyticsInternalsForTests.sanitizeCookielessAudienceProperties({
      token: 'phc_test',
      distinct_id: 'server-hash',
      $cookieless_mode: true,
      $geoip_disable: true,
      landing_page: '/contact?utm_source=chatgpt',
      locale: 'fr',
      $current_url: 'https://www.etoilys.fr/contact?utm_source=chatgpt',
      $referrer: 'https://chatgpt.com/',
      utm_source: 'chatgpt',
      acquisition_channel: 'generative_ai',
      $browser: 'Chrome',
      $screen_width: 1920,
    });

    expect(sanitized).toEqual({
      token: 'phc_test',
      distinct_id: 'server-hash',
      $cookieless_mode: true,
      $geoip_disable: true,
      landing_page: '/contact',
      locale: 'fr',
    });
  });

  it('keeps Dutch locale in the cookieless audience payload', () => {
    const sanitized = analyticsInternalsForTests.sanitizeCookielessAudienceProperties({
      landing_page: '/nl/contact?utm_source=chatgpt',
      locale: 'nl',
    });

    expect(sanitized).toEqual({
      landing_page: '/nl/contact',
      locale: 'nl',
    });
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

  it('fails closed when the PostHog SDK cannot be initialized', async () => {
    posthogMock.init.mockImplementationOnce(() => {
      throw new Error('SDK unavailable');
    });

    acceptAnalyticsConsent();
    await flushAnalyticsImports();

    expect(posthogMock.init).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });

  it('keeps consent functional for the session when localStorage is unavailable', async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable');
    });

    acceptAnalyticsConsent();
    await flushAnalyticsImports();

    expect(getAnalyticsConsentStatus()).toBe('accepted');
    expect(posthogMock.init).toHaveBeenCalledTimes(1);

    rejectAnalyticsConsent();
    expect(getAnalyticsConsentStatus()).toBe('refused');

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
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

  it('initializes only after accepted consent and captures the current pageview manually', async () => {
    acceptAnalyticsConsent();
    await flushAnalyticsImports();

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
    expect(posthogMock.optInDirect).toHaveBeenCalledWith({ captureEventName: false });
    expect(posthogMock.registerForSession).toHaveBeenCalledWith(
      expect.objectContaining({
        acquisition_channel: 'direct',
        landing_page: '/test',
        locale: 'fr',
      })
    );
    expect(posthogMock.capture).toHaveBeenCalledWith(
      '$pageview',
      expect.objectContaining({
        $current_url: '/test',
        $pathname: '/test',
        source_path: '/test',
      })
    );
  });

  it('registers volatile UTM attribution only after consent', async () => {
    window.history.pushState(
      {},
      'Test',
      '/demande-classement?utm_source=chatgpt.com&utm_medium=referral'
    );
    initializeAnalytics();

    expect(posthogMock.registerForSession).not.toHaveBeenCalled();

    acceptAnalyticsConsent();
    await flushAnalyticsImports();

    expect(posthogMock.registerForSession).toHaveBeenCalledWith({
      acquisition_channel: 'generative_ai',
      acquisition_source: 'chatgpt.com',
      ai_referrer: 'chatgpt',
      landing_page: '/demande-classement',
      locale: 'fr',
    });
  });

  it('adds debug_mode only after consent when debug mode is enabled', async () => {
    window.history.pushState({}, 'Test', '/?etoilys_analytics_debug=1');
    initializeAnalytics();
    trackPageView('/contact');
    expect(posthogMock.capture).not.toHaveBeenCalled();

    acceptAnalyticsConsent();
    await flushAnalyticsImports();

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

  it('opts out and resets PostHog when accepted consent is withdrawn', async () => {
    acceptAnalyticsConsent();
    await flushAnalyticsImports();
    rejectAnalyticsConsent();
    trackPageView('/contact');
    trackEvent('cta_clicked', {
      cta_id: 'cta_primary_contact',
      destination_path: '/contact',
    });
    await flushAnalyticsImports();

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('refused');
    expect(posthogMock.optOut).toHaveBeenCalledTimes(1);
    expect(posthogMock.reset).toHaveBeenCalledTimes(1);
    expect(posthogMock.capture).toHaveBeenCalledTimes(1);
  });

  it('allows accepting again after a previous refusal and captures the current page once', async () => {
    acceptAnalyticsConsent();
    await flushAnalyticsImports();
    rejectAnalyticsConsent();
    posthogMock.capture.mockClear();

    acceptAnalyticsConsent();
    trackEvent('cta_clicked', {
      cta_id: 'cta_primary_contact',
      destination_path: '/contact',
    });
    await flushAnalyticsImports();

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(posthogMock.optInDirect).toHaveBeenCalledTimes(2);
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

  it('sanitizes URL and sensitive custom properties before capture', () => {
    const sanitized = analyticsInternalsForTests.sanitizeCustomProperties({
      source_path: '/contact?email=test@example.com#form',
      $current_url: 'https://www.etoilys.fr/contact?x=1',
      $referrer: 'https://www.google.com/search?q=etoilys',
      form_name: 'contact',
      invalid_fields: ['email', 'message'],
      email: 'test@example.com',
      message: 'contenu libre',
    });

    expect(sanitized).toEqual({
      source_path: '/contact',
      $current_url: '/contact',
      $referrer: '/search',
      form_name: 'contact',
      invalid_fields: ['email', 'message'],
    });
  });

  it('preserves PostHog authentication and system properties after detailed consent', () => {
    const sanitized = analyticsInternalsForTests.sanitizePostHogProperties({
      token: 'phc_test',
      distinct_id: 'anonymous-id',
      $session_id: 'session-id',
      $lib: 'web',
      $session_entry_url: 'https://www.etoilys.fr/contact?utm_source=test',
      $session_entry_referrer: 'https://www.google.com/search?q=etoilys',
      $session_entry_pathname: '/contact?utm_source=test',
      $referring_domain: 'www.google.com',
      source_path: '/contact?email=test@example.com#form',
      $current_url: 'https://www.etoilys.fr/contact?x=1',
      $referrer: 'https://www.google.com/search?q=etoilys',
      $utm_source: 'chatgpt.com',
      $initial_utm_medium: 'referral',
      form_name: 'contact',
      invalid_fields: ['email', 'message'],
      email: 'test@example.com',
      message: 'contenu libre',
    });

    expect(sanitized).toEqual({
      token: 'phc_test',
      distinct_id: 'anonymous-id',
      $session_id: 'session-id',
      $lib: 'web',
      $session_entry_url: '/contact',
      $session_entry_referrer: '/search',
      $session_entry_pathname: '/contact',
      $referring_domain: 'www.google.com',
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

  it('captures classement simulator events with bucketed non-identifying properties', async () => {
    acceptAnalyticsConsent();
    await flushAnalyticsImports();
    posthogMock.capture.mockClear();

    trackClassementSimulatorStarted({
      requestedCategory: '4*',
      housingType: 'COLLECTIF',
      floor: 4,
      capacity: 7,
    });
    await flushAnalyticsImports();

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
