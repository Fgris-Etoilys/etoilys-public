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
    analyticsMock.acceptAnalyticsConsent.mockClear();
    analyticsMock.rejectAnalyticsConsent.mockClear();
    analyticsMock.getAnalyticsConsentStatus.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows the initial French banner when consent is not set', () => {
    renderCookieConsentManager();

    expect(screen.getByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
    expect(screen.getByText(/PostHog/i)).toBeInTheDocument();
    expect(screen.getByText(/mesurer l’audience/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refuser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accepter' })).toBeInTheDocument();
  });

  it('shows localized English banner and privacy link on English routes', () => {
    renderCookieConsentManager('/en/contact');

    expect(screen.getByRole('region', { name: 'Cookie management' })).toBeInTheDocument();
    expect(screen.getByText(/pages and forms are used/i)).toBeInTheDocument();
    expect(screen.queryByText(/simulateurs|simulators/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
    expect(screen.getByRole('button', { name: 'Refuse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
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
    expect(screen.getByText(/audience/i)).toBeInTheDocument();
    expect(screen.getByText(/PostHog/i)).toBeInTheDocument();
    expect(screen.getByText(/accepté/i)).toBeInTheDocument();
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
