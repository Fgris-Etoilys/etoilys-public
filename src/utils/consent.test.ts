import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ADVERTISING_CONSENT_STORAGE_KEY,
  ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
  COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY,
  consentInternalsForTests,
  getConsentSnapshot,
  getConsentStatus,
  setConsentPreferences,
  subscribeConsent,
} from './consent';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('consent store', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    consentInternalsForTests.reset();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('persists purpose choices on the existing storage keys', () => {
    setConsentPreferences({ analytics: 'accepted', advertising: 'refused' });

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY)).toEqual(
      expect.any(String)
    );
    expect(window.localStorage.getItem(ADVERTISING_CONSENT_STORAGE_KEY)).toBe('refused');
    expect(window.localStorage.getItem(ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY)).toEqual(
      expect.any(String)
    );
    expect(getConsentSnapshot()).toMatchObject({
      analytics: 'accepted',
      advertising: 'refused',
    });
  });

  it('keeps a new refusal effective in memory when persistence fails', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'accepted');
    window.localStorage.setItem(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY, String(Date.now()));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable');
    });

    const result = setConsentPreferences({ analytics: 'refused' });

    expect(result.persisted).toBe(false);
    expect(getConsentStatus('analytics')).toBe('refused');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('accepted');
  });

  it('does not throw when the localStorage getter is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage blocked');
      },
    });

    expect(() => getConsentSnapshot()).not.toThrow();
    expect(() => setConsentPreferences({ analytics: 'accepted' })).not.toThrow();

    if (descriptor) {
      Object.defineProperty(window, 'localStorage', descriptor);
    }
  });

  it('treats expired and future timestamps as missing choices', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'accepted');
    window.localStorage.setItem(
      ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
      String(Date.now() - 184 * DAY_MS)
    );
    window.localStorage.setItem(ADVERTISING_CONSENT_STORAGE_KEY, 'accepted');
    window.localStorage.setItem(
      ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY,
      String(Date.now() + DAY_MS)
    );

    expect(getConsentSnapshot()).toMatchObject({
      analytics: null,
      advertising: null,
    });
  });

  it('notifies subscribers after a same-document update', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);

    setConsentPreferences({ analytics: 'accepted' });

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('exposes cookieless audience only when the feature is available and not opted out', () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');
    setConsentPreferences({ analytics: 'accepted', cookielessAudienceOptOut: false });

    expect(getConsentSnapshot().cookielessAudience).toEqual({
      featureAvailable: true,
      userOptOut: false,
      effectiveEnabled: true,
    });

    setConsentPreferences({ cookielessAudienceOptOut: true });

    expect(window.localStorage.getItem(COOKIELESS_AUDIENCE_OPT_OUT_STORAGE_KEY)).toBe('true');
    expect(getConsentSnapshot().cookielessAudience.effectiveEnabled).toBe(false);
  });
});
