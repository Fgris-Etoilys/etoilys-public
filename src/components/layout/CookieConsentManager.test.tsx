import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CookieConsentManager from './CookieConsentManager';
import { openCookiePreferencesModal } from '../../utils/cookiePreferences';

const analyticsMock = vi.hoisted(() => ({
  consentStatus: null as 'accepted' | 'refused' | null,
  acceptAnalyticsConsent: vi.fn(),
  rejectAnalyticsConsent: vi.fn(),
  getAnalyticsConsentStatus: vi.fn(() => analyticsMock.consentStatus),
}));

vi.mock('../../utils/analytics', () => ({
  acceptAnalyticsConsent: analyticsMock.acceptAnalyticsConsent,
  rejectAnalyticsConsent: analyticsMock.rejectAnalyticsConsent,
  getAnalyticsConsentStatus: analyticsMock.getAnalyticsConsentStatus,
}));

function renderCookieConsentManager() {
  return render(
    <MemoryRouter>
      <CookieConsentManager />
    </MemoryRouter>
  );
}

describe('CookieConsentManager', () => {
  beforeEach(() => {
    analyticsMock.consentStatus = null;
    analyticsMock.acceptAnalyticsConsent.mockClear();
    analyticsMock.rejectAnalyticsConsent.mockClear();
    analyticsMock.getAnalyticsConsentStatus.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows the initial banner when consent is not set', () => {
    renderCookieConsentManager();

    expect(screen.getByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
    expect(
      screen.getByText(/Nous utilisons PostHog pour mesurer l’audience du site/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refuser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accepter' })).toBeInTheDocument();
  });

  it('hides the banner after a first-time refusal', () => {
    renderCookieConsentManager();

    fireEvent.click(screen.getByRole('button', { name: 'Refuser' }));

    expect(analyticsMock.rejectAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('hides the banner after a first-time acceptance without rereading storage', () => {
    renderCookieConsentManager();

    fireEvent.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
  });

  it('opens the preferences modal from the shared event', () => {
    analyticsMock.consentStatus = 'accepted';
    renderCookieConsentManager();

    act(() => {
      openCookiePreferencesModal();
    });

    expect(screen.getByRole('dialog', { name: 'Préférences cookies' })).toBeInTheDocument();
    expect(screen.getByText('Mesure d’audience et amélioration du site')).toBeInTheDocument();
    expect(screen.getByText('PostHog')).toBeInTheDocument();
    expect(screen.getByText('accepté')).toBeInTheDocument();
  });

  it('allows changing consent from the preferences modal', () => {
    analyticsMock.consentStatus = 'refused';
    renderCookieConsentManager();

    act(() => {
      openCookiePreferencesModal();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
