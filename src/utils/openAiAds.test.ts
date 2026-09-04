import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
const OPPREF_KEY = 'etoilys_openai_ads_oppref';
const OPPREF_CAPTURED_AT_KEY = 'etoilys_openai_ads_oppref_captured_at';
const DAY_MS = 24 * 60 * 60 * 1000;

function getOaiqCalls(): unknown[][] {
  return window.oaiq?.q ?? [];
}

function dispatchScriptEvent(type: 'load' | 'error'): void {
  const script = document.getElementById(SCRIPT_ID);
  script?.dispatchEvent(new Event(type));
}

describe('openAiAds', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_OPENAI_ADS_PIXEL_ID', 'test_pixel_id');
    openAiAdsInternalsForTests.reset();
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete (window as { oaiq?: unknown }).oaiq;
    document.getElementById(SCRIPT_ID)?.remove();
    window.history.pushState({}, 'Test', '/test');
  });

  describe('advertising consent and pixel initialization', () => {
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
      const staleTimestamp = Date.now() - 184 * DAY_MS;
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

  describe('oppref preservation via sessionStorage', () => {
    it('stores oppref from the URL into sessionStorage on first load', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();

      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBe('ABC');
      const capturedAt = Number(window.sessionStorage.getItem(OPPREF_CAPTURED_AT_KEY));
      expect(Date.now() - capturedAt).toBeLessThan(1000);
    });

    it('does not store anything when the URL has no oppref', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne');
      initOpenAiAdsPixelIfConsented();

      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBeNull();
    });

    it('overwrites a previously stored oppref with a fresh one on a new real page load (Cas 9)', () => {
      window.history.pushState({}, 'Test', '/landing-a?oppref=A');
      initOpenAiAdsPixelIfConsented();
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBe('A');

      window.history.pushState({}, 'Test', '/landing-b?oppref=B');
      initOpenAiAdsPixelIfConsented();
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBe('B');
    });

    it('still uses an oppref stored 29 days ago', () => {
      window.sessionStorage.setItem(OPPREF_KEY, 'OLD_BUT_VALID');
      window.sessionStorage.setItem(OPPREF_CAPTURED_AT_KEY, String(Date.now() - 29 * DAY_MS));
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      expect(window.location.search).toContain('oppref=OLD_BUT_VALID');
    });

    it('purges and ignores an oppref stored more than 30 days ago (Cas 10)', () => {
      window.sessionStorage.setItem(OPPREF_KEY, 'TOO_OLD');
      window.sessionStorage.setItem(OPPREF_CAPTURED_AT_KEY, String(Date.now() - 31 * DAY_MS));
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      expect(window.location.search).not.toContain('oppref');
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBeNull();
      expect(window.sessionStorage.getItem(OPPREF_CAPTURED_AT_KEY)).toBeNull();
    });

    it('purges both keys when they are incomplete/inconsistent at read time', () => {
      window.sessionStorage.setItem(OPPREF_KEY, 'ORPHANED');
      // OPPREF_CAPTURED_AT_KEY intentionally missing
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      expect(window.location.search).not.toContain('oppref');
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBeNull();
    });

    it('makes oppref available again when consent is accepted after navigating away from the landing page (Cas 3)', () => {
      window.history.pushState(
        {},
        'Test',
        '/classement-meuble-tourisme-dordogne?oppref=ABC&utm_source=chatgpt_ads'
      );
      initOpenAiAdsPixelIfConsented(); // capture, no consent yet

      // Simulate the SPA navigation that drops the query string (Button.tsx behavior)
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      expect(window.location.search).toContain('oppref=ABC');
    });

    it('purges sessionStorage on load even when oppref was already naturally present in the URL (Cas 1/2)', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      const urlBeforeAccept = window.location.href;

      acceptAdvertisingConsent();
      expect(window.location.href).toBe(urlBeforeAccept);

      dispatchScriptEvent('load');

      expect(window.location.href).toBe(urlBeforeAccept);
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBeNull();
    });

    it('cleans the URL and purges storage after a successful load when oppref was injected (Cas 3)', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();
      expect(window.location.search).toContain('oppref=ABC');

      dispatchScriptEvent('load');

      expect(window.location.search).not.toContain('oppref');
      expect(window.location.pathname).toBe('/demande-classement');
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBeNull();
    });

    it('cleans the URL but keeps sessionStorage after a failed load (Cas 3, error)', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();
      dispatchScriptEvent('error');

      expect(window.location.search).not.toContain('oppref');
      expect(window.sessionStorage.getItem(OPPREF_KEY)).toBe('ABC');
    });

    it('never cleans up automatically without a load or error event (no fallback timeout)', () => {
      vi.useFakeTimers();
      try {
        window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
        initOpenAiAdsPixelIfConsented();
        window.history.pushState({}, 'Test', '/demande-classement');

        acceptAdvertisingConsent();
        expect(window.location.search).toContain('oppref=ABC');

        vi.advanceTimersByTime(DAY_MS);

        expect(window.location.search).toContain('oppref=ABC');
        expect(window.sessionStorage.getItem(OPPREF_KEY)).toBe('ABC');
      } finally {
        vi.useRealTimers();
      }
    });

    it('cleanup removes only the oppref parameter, preserving other params and the hash', () => {
      window.history.pushState(
        {},
        'Test',
        '/classement-meuble-tourisme-dordogne?oppref=ABC&utm_source=chatgpt_ads'
      );
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement?utm_source=chatgpt_ads#section');

      acceptAdvertisingConsent();
      dispatchScriptEvent('load');

      expect(window.location.search).toContain('utm_source=chatgpt_ads');
      expect(window.location.search).not.toContain('oppref');
      expect(window.location.hash).toBe('#section');
    });

    it('cleanup never restores a previous pathname if the user navigated away before load fires', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();
      expect(window.location.pathname).toBe('/demande-classement');

      // User navigates away (SPA) to another route before the script's load event fires
      window.history.pushState({}, 'Test', '/confirmation');

      dispatchScriptEvent('load');

      expect(window.location.pathname).toBe('/confirmation');
      expect(window.location.search).not.toContain('oppref');
    });

    it('cleanup does not remove an oppref value that differs from the one it injected', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      // A genuinely different oppref now appears in the current URL (e.g. a fresh ad click)
      window.history.replaceState({}, 'Test', '/demande-classement?oppref=DIFFERENT');

      dispatchScriptEvent('load');

      expect(window.location.search).toContain('oppref=DIFFERENT');
    });

    it('reuses an oppref that survived in sessionStorage across a simulated hard reload (Cas 5)', () => {
      window.sessionStorage.setItem(OPPREF_KEY, 'SURVIVED');
      window.sessionStorage.setItem(OPPREF_CAPTURED_AT_KEY, String(Date.now()));

      // Simulates the JS module re-executing on a real reload, WITHOUT clearing sessionStorage.
      openAiAdsInternalsForTests.reset();

      window.history.pushState({}, 'Test', '/demande-classement'); // no oppref in the URL anymore

      acceptAdvertisingConsent();

      expect(window.location.search).toContain('oppref=SURVIVED');
    });

    it('does nothing to the URL or the script when consent is refused (Cas 6)', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      refuseAdvertisingConsent();

      expect(window.location.search).not.toContain('oppref');
      expect(document.getElementById(SCRIPT_ID)).toBeNull();
    });

    it('only injects the URL once across accept -> refuse -> accept (Cas 7)', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();
      expect(replaceStateSpy).toHaveBeenCalledTimes(1);

      refuseAdvertisingConsent();
      acceptAdvertisingConsent();

      expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    });

    it('never mutates history when there is no oppref anywhere (Cas 8)', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      acceptAdvertisingConsent();

      expect(replaceStateSpy).not.toHaveBeenCalled();
    });

    it('does not crash and still initializes the pixel if history.replaceState throws', () => {
      window.history.pushState({}, 'Test', '/classement-meuble-tourisme-dordogne?oppref=ABC');
      initOpenAiAdsPixelIfConsented();
      window.history.pushState({}, 'Test', '/demande-classement');

      vi.spyOn(window.history, 'replaceState').mockImplementation(() => {
        throw new Error('boom');
      });

      expect(() => acceptAdvertisingConsent()).not.toThrow();
      const calls = getOaiqCalls();
      expect(calls).toContainEqual(['consent', true]);
      expect(calls).toContainEqual(['init', { pixelId: 'test_pixel_id' }]);
    });

    it('never imports analytics.ts or acquisition.ts, keeping OpenAI Ads independent from PostHog', () => {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const source = readFileSync(path.join(currentDir, 'openAiAds.ts'), 'utf-8');

      expect(source).not.toMatch(/from ['"]\.\/analytics['"]/);
      expect(source).not.toMatch(/from ['"]\.\/acquisition['"]/);
    });
  });
});
