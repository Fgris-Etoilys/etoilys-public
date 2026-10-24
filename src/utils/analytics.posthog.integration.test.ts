import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

type PostHogClient = typeof import('posthog-js').default;
type AnalyticsModule = typeof import('./analytics');
type ConsentModule = typeof import('./consent');
type SdkRequest = Parameters<PostHogClient['_send_request']>[0];

const TOKEN = 'phc_consent_integration';
const SESSION_ACQUISITION_STORAGE_KEY = 'etoilys_analytics_session_acquisition';
const EVENT_PROPERTIES = {
  cta_id: 'cta_primary_contact',
  destination_path: '/contact',
};

interface RequestAttempt {
  client: PostHogClient;
  options: SdkRequest;
}

let analytics: AnalyticsModule;
let sdk: PostHogClient;
let sdkInit: MockInstance<PostHogClient['init']>;
let sdkCapture: MockInstance<PostHogClient['capture']>;
let requestAttempts: RequestAttempt[];
let namedClients: Map<string, PostHogClient>;
let namedCaptures: Map<string, MockInstance<PostHogClient['capture']>>;
let beaconDescriptor: PropertyDescriptor | undefined;
let analyticsModules: AnalyticsModule[];
let consentModules: ConsentModule[];

function blockSdkRequests(client: PostHogClient): void {
  const recordRequest = (options: SdkRequest): void => {
    requestAttempts.push({ client, options });
  };
  vi.spyOn(client, '_send_request').mockImplementation(recordRequest);
}

async function settleAnalytics(): Promise<void> {
  await vi.dynamicImportSettled();
  await Promise.resolve();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
}

function detailedEventRequests(): RequestAttempt[] {
  return requestAttempts.filter(
    ({ client, options }) =>
      client === sdk && (options.url.includes('/e/') || options.url.includes('/batch/'))
  );
}

function pageviewCalls(): number {
  return sdkCapture.mock.calls.filter(([eventName]) => eventName === '$pageview').length;
}

describe('analytics with the installed PostHog browser SDK', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_PUBLIC_POSTHOG_TOKEN', TOKEN);
    vi.stubEnv('VITE_PUBLIC_POSTHOG_HOST', 'https://f.etoilys.fr');
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'false');
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.pushState({}, 'Test', '/contact');

    // The installed SDK is real. Block its transport at both the SDK and browser levels.
    requestAttempts = [];
    namedClients = new Map();
    namedCaptures = new Map();
    analyticsModules = [];
    consentModules = [];
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => new Response('{}', { status: 200 }))
    );
    vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {});
    beaconDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'sendBeacon');
    Object.defineProperty(window.navigator, 'sendBeacon', {
      configurable: true,
      value: vi.fn(() => true),
    });

    sdk = (await import('posthog-js')).default;
    blockSdkRequests(sdk);
    const realInit = sdk.init.bind(sdk);
    sdkInit = vi.spyOn(sdk, 'init').mockImplementation((token, config, name) => {
      const client = realInit(token, config, name);
      if (name) {
        blockSdkRequests(client);
        namedClients.set(name, client);
        namedCaptures.set(name, vi.spyOn(client, 'capture'));
      }
      return client;
    });
    sdkCapture = vi.spyOn(sdk, 'capture');
    analytics = await import('./analytics');
    analyticsModules.push(analytics);
    consentModules.push(await import('./consent'));
  });

  afterEach(() => {
    sdk.opt_out_capturing();
    analyticsModules.forEach((current) => current.analyticsInternalsForTests.reset());
    consentModules.forEach((current) => current.consentInternalsForTests.reset());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    if (beaconDescriptor) {
      Object.defineProperty(window.navigator, 'sendBeacon', beaconDescriptor);
    } else {
      Reflect.deleteProperty(window.navigator, 'sendBeacon');
    }
  });

  it('keeps detailed capture off without consent, then preserves explicit denial after cleanup', async () => {
    analytics.initializeAnalytics();
    expect(analytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(false);
    await settleAnalytics();
    expect(sdkInit).not.toHaveBeenCalled();
    expect(sdkCapture).not.toHaveBeenCalled();

    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    expect(sdkInit).toHaveBeenCalledWith(TOKEN, expect.any(Object));
    expect(sdk.has_opted_in_capturing()).toBe(true);
    expect(sdk.is_capturing()).toBe(true);
    expect(pageviewCalls()).toBe(1);

    const firstDistinctId = sdk.get_distinct_id();
    const firstSessionId = sdk.get_session_id();
    const firstDeviceId = sdk.get_property('$device_id');
    expect(firstDistinctId).toBeTruthy();
    expect(firstSessionId).toBeTruthy();
    expect(firstDeviceId).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_ACQUISITION_STORAGE_KEY)).not.toBeNull();
    sdk.register({ stale_test_property: 'old-session' });

    expect(analytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(true);
    await settleAnalytics();
    expect(sdkCapture).toHaveBeenCalledWith(
      'cta_clicked',
      expect.objectContaining(EVENT_PROPERTIES)
    );
    expect(sdk.capture('cta_clicked', EVENT_PROPERTIES, { send_instantly: true })).toEqual(
      expect.objectContaining({ event: 'cta_clicked' })
    );
    expect(detailedEventRequests().length).toBeGreaterThan(0);

    analytics.rejectAnalyticsConsent();
    expect(window.localStorage.getItem(analytics.ANALYTICS_CONSENT_STORAGE_KEY)).toBe('refused');
    expect(sdk.get_explicit_consent_status()).toBe('denied');
    expect(sdk.has_opted_out_capturing()).toBe(true);
    expect(sdk.is_capturing()).toBe(false);
    expect(sdk.get_distinct_id()).not.toBe(firstDistinctId);
    expect(sdk.get_session_id()).not.toBe(firstSessionId);
    expect(sdk.get_property('stale_test_property')).toBeUndefined();
    expect(sdk.get_property('$device_id')).toBe(firstDeviceId);
    expect(window.localStorage.getItem(SESSION_ACQUISITION_STORAGE_KEY)).toBeNull();

    const capturedBeforeRejectedAction = sdkCapture.mock.calls.length;
    const requestsBeforeRejectedAction = detailedEventRequests().length;
    expect(analytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(false);
    expect(sdk.capture('cta_clicked', EVENT_PROPERTIES, { send_instantly: true })).toBeUndefined();
    await settleAnalytics();
    expect(sdkCapture).toHaveBeenCalledTimes(capturedBeforeRejectedAction + 1);
    expect(detailedEventRequests()).toHaveLength(requestsBeforeRejectedAction);
  });

  it('resumes after an explicit new acceptance with one new pageview', async () => {
    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    expect(pageviewCalls()).toBe(1);
    analytics.rejectAnalyticsConsent();
    expect(sdk.get_explicit_consent_status()).toBe('denied');

    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    expect(sdk.get_explicit_consent_status()).toBe('granted');
    expect(sdk.is_capturing()).toBe(true);
    expect(pageviewCalls()).toBe(2);

    analytics.trackPageView('/contact');
    await settleAnalytics();
    expect(pageviewCalls()).toBe(2);
  });

  it('does not reactivate detailed capture after a simulated reload', async () => {
    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    analytics.rejectAnalyticsConsent();
    expect(sdk.get_explicit_consent_status()).toBe('denied');

    vi.resetModules();
    const reloadedAnalytics = await import('./analytics');
    analyticsModules.push(reloadedAnalytics);
    consentModules.push(await import('./consent'));
    reloadedAnalytics.initializeAnalytics();
    expect(reloadedAnalytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(false);
    await settleAnalytics();
    expect(sdkInit).toHaveBeenCalledTimes(1);

    // An isolated SDK instance represents the browser SDK on a fresh page load.
    const { PostHog } = await import('posthog-js');
    const freshSdk = new PostHog();
    blockSdkRequests(freshSdk);
    freshSdk.init(TOKEN, {
      api_host: 'https://f.etoilys.fr',
      capture_pageview: false,
      autocapture: false,
      disable_session_recording: true,
      opt_out_capturing_by_default: false,
      opt_out_capturing_persistence_type: 'localStorage',
    });
    expect(freshSdk.get_explicit_consent_status()).toBe('denied');
    expect(freshSdk.has_opted_out_capturing()).toBe(true);
    expect(freshSdk.is_capturing()).toBe(false);
    freshSdk.opt_out_capturing();
  });

  it('reproduces the old opt-out then reset defect in an isolated real SDK client', async () => {
    const { PostHog } = await import('posthog-js');
    const oldOrderClient = new PostHog();
    blockSdkRequests(oldOrderClient);
    oldOrderClient.init('phc_old_order_regression', {
      api_host: 'https://f.etoilys.fr',
      capture_pageview: false,
      autocapture: false,
      disable_session_recording: true,
      opt_out_capturing_by_default: false,
      opt_out_capturing_persistence_type: 'localStorage',
    });

    oldOrderClient.opt_out_capturing();
    expect(oldOrderClient.get_explicit_consent_status()).toBe('denied');
    oldOrderClient.reset();
    expect(oldOrderClient.get_explicit_consent_status()).toBe('pending');
    expect(oldOrderClient.has_opted_out_capturing()).toBe(false);
    expect(oldOrderClient.is_capturing()).toBe(true);
    oldOrderClient.opt_out_capturing();
  });

  it('does not revive capture when acceptance is immediately revoked during import', async () => {
    analytics.acceptAnalyticsConsent();
    analytics.rejectAnalyticsConsent();
    await settleAnalytics();

    expect(analytics.getAnalyticsConsentStatus()).toBe('refused');
    expect(analytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(false);
    expect(pageviewCalls()).toBe(0);
    if (sdkInit.mock.calls.length > 0) {
      expect(sdk.is_capturing()).toBe(false);
    }
  });

  it('stops an active detailed client after a simulated other-tab refusal', async () => {
    analytics.initializeAnalytics();
    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    expect(sdk.is_capturing()).toBe(true);

    window.localStorage.setItem(analytics.ANALYTICS_CONSENT_STORAGE_KEY, 'refused');
    window.localStorage.setItem(
      analytics.ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
      String(Date.now())
    );
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: analytics.ANALYTICS_CONSENT_STORAGE_KEY,
        oldValue: 'accepted',
        newValue: 'refused',
        storageArea: window.localStorage,
        url: window.location.href,
      })
    );
    await settleAnalytics();

    expect(analytics.getAnalyticsConsentStatus()).toBe('refused');
    expect(sdk.get_explicit_consent_status()).toBe('denied');
    expect(sdk.is_capturing()).toBe(false);
    expect(analytics.trackEvent('cta_clicked', EVENT_PROPERTIES)).toBe(false);
  });

  it('keeps the named cookieless audience client independent of detailed consent', async () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');
    analytics.initializeAnalytics();
    await settleAnalytics();

    const audience = namedClients.get('etoilys_cookieless_audience');
    const audienceCapture = namedCaptures.get('etoilys_cookieless_audience');
    expect(audience).toBeDefined();
    expect(audience?.config.cookieless_mode).toBe('always');
    expect(audience?.is_capturing()).toBe(true);
    expect(audienceCapture).toHaveBeenCalledWith(
      'audience_landed',
      expect.objectContaining({ landing_page: '/contact' }),
      { send_instantly: true }
    );
    expect(sdkInit.mock.calls.filter(([, , name]) => !name)).toHaveLength(0);

    analytics.acceptAnalyticsConsent();
    await settleAnalytics();
    analytics.rejectAnalyticsConsent();
    expect(sdk.is_capturing()).toBe(false);
    expect(audience?.is_capturing()).toBe(true);
    expect(audienceCapture).toHaveBeenCalledTimes(1);
  });
});
