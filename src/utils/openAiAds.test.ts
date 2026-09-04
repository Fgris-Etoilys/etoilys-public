import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  acceptAdvertisingConsent,
  getAdvertisingConsentStatus,
  initOpenAiAdsPixelIfConsented,
  openAiAdsInternalsForTests,
  refuseAdvertisingConsent,
  trackLeadCreatedConversion,
} from './openAiAds';

const SCRIPT_ID = 'openai-ads-pixel-script';

function getOaiqCalls(): unknown[][] {
  return window.oaiq?.q ?? [];
}

describe('openAiAds', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_OPENAI_ADS_PIXEL_ID', 'test_pixel_id');
    openAiAdsInternalsForTests.reset();
    window.localStorage.clear();
    delete (window as { oaiq?: unknown }).oaiq;
    document.getElementById(SCRIPT_ID)?.remove();
    window.history.pushState({}, 'Test', '/test');
  });

  it('does not inject the pixel script when no consent choice is stored', () => {
    initOpenAiAdsPixelIfConsented();

    expect(window.oaiq).toBeUndefined();
    expect(document.getElementById(SCRIPT_ID)).toBeNull();
  });

  it('marks consent as refused and sends consent(false) when oaiq already exists', () => {
    const oaiqMock = vi.fn();
    window.oaiq = oaiqMock as unknown as NonNullable<Window['oaiq']>;

    refuseAdvertisingConsent();

    expect(getAdvertisingConsentStatus()).toBe('refused');
    expect(oaiqMock).toHaveBeenCalledWith('consent', false);
  });

  it('does not throw when refusing without oaiq present', () => {
    expect(() => refuseAdvertisingConsent()).not.toThrow();
    expect(getAdvertisingConsentStatus()).toBe('refused');
  });

  it('never derives advertising consent from the legacy analytics consent key', () => {
    window.localStorage.setItem('etoilys_analytics_consent', 'accepted');
    window.localStorage.setItem('etoilys_analytics_consent_updated_at', String(Date.now()));

    expect(getAdvertisingConsentStatus()).toBeNull();
    initOpenAiAdsPixelIfConsented();
    expect(window.oaiq).toBeUndefined();
  });

  it('sends consent(true) before init on first acceptance', () => {
    acceptAdvertisingConsent();

    expect(document.getElementById(SCRIPT_ID)).not.toBeNull();
    const calls = getOaiqCalls();
    expect(calls[0]).toEqual(['consent', true]);
    expect(calls[1]).toEqual(['init', { pixelId: 'test_pixel_id' }]);
  });

  it('does not re-inject the script or call init twice on repeated acceptance', () => {
    acceptAdvertisingConsent();
    acceptAdvertisingConsent();

    expect(document.querySelectorAll(`#${SCRIPT_ID}`).length).toBe(1);
    const initCalls = getOaiqCalls().filter((call) => call[0] === 'init');
    expect(initCalls.length).toBe(1);
  });

  it('decouples consent transitions from init idempotency across accept -> refuse -> accept', () => {
    acceptAdvertisingConsent();
    refuseAdvertisingConsent();
    acceptAdvertisingConsent();

    expect(document.querySelectorAll(`#${SCRIPT_ID}`).length).toBe(1);

    const calls = getOaiqCalls();
    const initCalls = calls.filter((call) => call[0] === 'init');
    const consentCalls = calls.filter((call) => call[0] === 'consent');

    expect(initCalls.length).toBe(1);
    expect(consentCalls).toEqual([
      ['consent', true],
      ['consent', false],
      ['consent', true],
    ]);
  });

  it('treats advertising consent older than 6 months as absent', () => {
    const staleTimestamp = Date.now() - 184 * 24 * 60 * 60 * 1000;
    window.localStorage.setItem('etoilys_advertising_consent', 'accepted');
    window.localStorage.setItem('etoilys_advertising_consent_updated_at', String(staleTimestamp));

    expect(getAdvertisingConsentStatus()).toBeNull();
  });

  it('does not throw when window.oaiq is unavailable at conversion time', () => {
    acceptAdvertisingConsent();
    delete (window as { oaiq?: unknown }).oaiq;

    expect(() => trackLeadCreatedConversion()).not.toThrow();
  });

  it('keeps working through the queue stub even if the real SDK script never loads', () => {
    acceptAdvertisingConsent();
    trackLeadCreatedConversion();

    expect(getOaiqCalls().some((call) => call[0] === 'measure')).toBe(true);
  });

  it('sends the exact lead_created payload with no extra fields', () => {
    acceptAdvertisingConsent();
    trackLeadCreatedConversion();

    const measureCall = getOaiqCalls().find((call) => call[0] === 'measure');
    expect(measureCall).toEqual(['measure', 'lead_created', { type: 'customer_action' }]);
  });

  it('never calls measure without accepted consent', () => {
    trackLeadCreatedConversion();
    expect(window.oaiq).toBeUndefined();

    refuseAdvertisingConsent();
    trackLeadCreatedConversion();
    expect(getOaiqCalls().some((call) => call[0] === 'measure')).toBe(false);
  });

  it('swallows exceptions thrown by window.oaiq during conversion', () => {
    acceptAdvertisingConsent();
    window.oaiq = vi.fn(() => {
      throw new Error('boom');
    }) as unknown as NonNullable<Window['oaiq']>;

    expect(() => trackLeadCreatedConversion()).not.toThrow();
  });

  it('enables debug mode via its own query param, independently of the analytics debug flag', () => {
    window.history.pushState({}, 'Test', '/test?etoilys_ads_debug=1');
    initOpenAiAdsPixelIfConsented();
    acceptAdvertisingConsent();

    const initCall = getOaiqCalls().find((call) => call[0] === 'init');
    expect(initCall).toEqual(['init', { pixelId: 'test_pixel_id', debug: true }]);
  });

  it('does not enable debug mode from the analytics-only debug flag', () => {
    window.localStorage.setItem('etoilys_analytics_debug', 'true');
    acceptAdvertisingConsent();

    const initCall = getOaiqCalls().find((call) => call[0] === 'init');
    expect(initCall).toEqual(['init', { pixelId: 'test_pixel_id' }]);
  });

  it('resets internal module state via openAiAdsInternalsForTests.reset()', () => {
    acceptAdvertisingConsent();

    openAiAdsInternalsForTests.reset();
    delete (window as { oaiq?: unknown }).oaiq;
    document.getElementById(SCRIPT_ID)?.remove();

    acceptAdvertisingConsent();
    expect(document.querySelectorAll(`#${SCRIPT_ID}`).length).toBe(1);
  });
});
