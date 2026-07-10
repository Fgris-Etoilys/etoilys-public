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
  });

  afterEach(cleanup);

  it('shows the initial French privacy preferences banner', () => {
    renderCookieConsentManager();

    expect(screen.getByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
    expect(screen.getByText(/aucun cookie analytique n’est utilisé/i)).toBeInTheDocument();
    expect(screen.getByText(/mesure limitée, sans cookie/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refuser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accepter' })).toBeInTheDocument();
  });

  it('shows the localized English banner and privacy link', () => {
    renderCookieConsentManager('/en/contact');

    expect(screen.getByRole('region', { name: 'Cookie management' })).toBeInTheDocument();
    expect(screen.getByText(/no analytics cookies will be used/i)).toBeInTheDocument();
    expect(screen.getByText(/cookieless measurement of the landing page/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });

  it('hides the banner after refusal', () => {
    renderCookieConsentManager();
    fireEvent.click(screen.getByRole('button', { name: 'Refuser' }));

    expect(analyticsMock.rejectAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('hides the banner after acceptance', () => {
    renderCookieConsentManager();
    fireEvent.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('shows both independent controls in preferences', () => {
    analyticsMock.consentStatus = 'accepted';
    renderCookieConsentManager();

    act(() => openCookiePreferencesModal());

    expect(screen.getByRole('dialog', { name: 'Préférences cookies' })).toBeInTheDocument();
    expect(screen.getByText('Analytics détaillés')).toBeInTheDocument();
    expect(screen.getByText('Audience minimale après refus')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Autoriser la mesure d’audience minimale après un refus',
      })
    ).toBeChecked();
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
