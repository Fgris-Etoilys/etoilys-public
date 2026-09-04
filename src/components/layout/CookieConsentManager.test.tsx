import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CookieConsentManager from './CookieConsentManager';
import { openCookiePreferencesModal } from '../../utils/cookiePreferences';

const analyticsMock = vi.hoisted(() => ({
  consentStatus: null as 'accepted' | 'refused' | null,
  minimalAudienceEnabled: true,
  acceptAnalyticsConsent: vi.fn(),
  rejectAnalyticsConsent: vi.fn(),
  getAnalyticsConsentStatus: vi.fn(() => analyticsMock.consentStatus),
  isCookielessAudienceMeasurementEnabled: vi.fn(() => analyticsMock.minimalAudienceEnabled),
  setCookielessAudienceMeasurementEnabled: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
  acceptAnalyticsConsent: analyticsMock.acceptAnalyticsConsent,
  rejectAnalyticsConsent: analyticsMock.rejectAnalyticsConsent,
  getAnalyticsConsentStatus: analyticsMock.getAnalyticsConsentStatus,
  isCookielessAudienceMeasurementEnabled: analyticsMock.isCookielessAudienceMeasurementEnabled,
  setCookielessAudienceMeasurementEnabled: analyticsMock.setCookielessAudienceMeasurementEnabled,
}));

const openAiAdsMock = vi.hoisted(() => ({
  advertisingConsentStatus: null as 'accepted' | 'refused' | null,
  acceptAdvertisingConsent: vi.fn(),
  refuseAdvertisingConsent: vi.fn(),
  getAdvertisingConsentStatus: vi.fn(() => openAiAdsMock.advertisingConsentStatus),
}));

vi.mock('../../utils/openAiAds', () => ({
  acceptAdvertisingConsent: openAiAdsMock.acceptAdvertisingConsent,
  refuseAdvertisingConsent: openAiAdsMock.refuseAdvertisingConsent,
  getAdvertisingConsentStatus: openAiAdsMock.getAdvertisingConsentStatus,
}));

function renderCookieConsentManager(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <CookieConsentManager />
    </MemoryRouter>
  );
}

describe('CookieConsentManager', () => {
  beforeEach(() => {
    analyticsMock.consentStatus = null;
    analyticsMock.minimalAudienceEnabled = true;
    analyticsMock.acceptAnalyticsConsent.mockClear();
    analyticsMock.rejectAnalyticsConsent.mockClear();
    analyticsMock.getAnalyticsConsentStatus.mockClear();
    analyticsMock.isCookielessAudienceMeasurementEnabled.mockClear();
    analyticsMock.setCookielessAudienceMeasurementEnabled.mockClear();

    openAiAdsMock.advertisingConsentStatus = null;
    openAiAdsMock.acceptAdvertisingConsent.mockClear();
    openAiAdsMock.refuseAdvertisingConsent.mockClear();
    openAiAdsMock.getAdvertisingConsentStatus.mockClear();
  });

  afterEach(cleanup);

  it('shows the initial French privacy preferences banner', () => {
    renderCookieConsentManager();

    expect(screen.getByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
    expect(
      screen.getByText(/aucun cookie analytique ni publicitaire n’est utilisé/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/mesure limitée, sans cookie/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenAI Ads/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refuser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accepter' })).toBeInTheDocument();
  });

  it('shows the localized English banner and privacy link', () => {
    renderCookieConsentManager('/en/contact');

    expect(screen.getByRole('region', { name: 'Cookie management' })).toBeInTheDocument();
    expect(
      screen.getByText(/no analytics or advertising cookies will be used/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/cookieless measurement of the landing page/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });

  it('hides the banner after refusal and refuses both purposes', () => {
    renderCookieConsentManager();
    fireEvent.click(screen.getByRole('button', { name: 'Refuser' }));

    expect(analyticsMock.rejectAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.refuseAdvertisingConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('hides the banner after acceptance and accepts both purposes', () => {
    renderCookieConsentManager();
    fireEvent.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.acceptAdvertisingConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('reopens the banner when analytics consent is set but advertising consent is still unset', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = null;
    renderCookieConsentManager();

    expect(screen.getByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
  });

  it('hides the banner once both analytics and advertising consent are set', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = 'refused';
    renderCookieConsentManager();

    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('shows the three independent purpose blocks in preferences', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = null;
    renderCookieConsentManager();

    act(() => openCookiePreferencesModal());

    expect(screen.getByRole('dialog', { name: 'Préférences cookies' })).toBeInTheDocument();
    expect(screen.getByText('Analytics détaillés')).toBeInTheDocument();
    expect(screen.getByText('Mesure publicitaire (OpenAI Ads)')).toBeInTheDocument();
    expect(screen.getByText('Audience minimale après refus')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Autoriser la mesure d’audience minimale après un refus',
      })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Autoriser la mesure publicitaire OpenAI Ads' })
    ).not.toBeChecked();
  });

  it('does not check the advertising box when only analytics consent was previously accepted', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = null;
    renderCookieConsentManager();
    act(() => openCookiePreferencesModal());

    expect(screen.getByText(/Consentement publicitaire : non défini/)).toBeInTheDocument();
  });

  it('accepting the advertising checkbox only affects advertising consent', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = null;
    renderCookieConsentManager();
    act(() => openCookiePreferencesModal());

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Autoriser la mesure publicitaire OpenAI Ads' })
    );

    expect(openAiAdsMock.acceptAdvertisingConsent).toHaveBeenCalledTimes(1);
    expect(analyticsMock.acceptAnalyticsConsent).not.toHaveBeenCalled();
  });

  it('unchecking the advertising checkbox after acceptance refuses only advertising consent', () => {
    analyticsMock.consentStatus = 'accepted';
    openAiAdsMock.advertisingConsentStatus = 'accepted';
    renderCookieConsentManager();
    act(() => openCookiePreferencesModal());

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Autoriser la mesure publicitaire OpenAI Ads' })
    );

    expect(openAiAdsMock.refuseAdvertisingConsent).toHaveBeenCalledTimes(1);
    expect(analyticsMock.rejectAnalyticsConsent).not.toHaveBeenCalled();
  });

  it('allows opting out of cookieless minimal measurement independently', () => {
    analyticsMock.consentStatus = 'refused';
    renderCookieConsentManager();
    act(() => openCookiePreferencesModal());

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Autoriser la mesure d’audience minimale après un refus',
      })
    );

    expect(analyticsMock.setCookielessAudienceMeasurementEnabled).toHaveBeenCalledWith(false);
  });

  it('allows changing detailed consent from preferences', () => {
    analyticsMock.consentStatus = 'refused';
    renderCookieConsentManager();
    act(() => openCookiePreferencesModal());
    fireEvent.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
