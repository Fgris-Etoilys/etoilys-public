import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CookieConsentManager from './CookieConsentManager';
import { openCookiePreferencesModal } from '../../utils/cookiePreferences';
import {
  ADVERTISING_CONSENT_STORAGE_KEY,
  ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY,
  consentInternalsForTests,
  setConsentPreferences,
} from '../../utils/consent';

const analyticsMock = vi.hoisted(() => ({
  acceptAnalyticsConsent: vi.fn(),
  rejectAnalyticsConsent: vi.fn(),
  setCookielessAudienceMeasurementEnabled: vi.fn(),
}));

vi.mock('../../utils/analytics', async () => {
  const consent =
    await vi.importActual<typeof import('../../utils/consent')>('../../utils/consent');
  return {
    acceptAnalyticsConsent: analyticsMock.acceptAnalyticsConsent.mockImplementation(() => {
      return consent.setConsentPreferences({ analytics: 'accepted' });
    }),
    rejectAnalyticsConsent: analyticsMock.rejectAnalyticsConsent.mockImplementation(() => {
      return consent.setConsentPreferences({ analytics: 'refused' });
    }),
    setCookielessAudienceMeasurementEnabled:
      analyticsMock.setCookielessAudienceMeasurementEnabled.mockImplementation(
        (enabled: boolean) => {
          return consent.setConsentPreferences({ cookielessAudienceOptOut: !enabled });
        }
      ),
  };
});

const openAiAdsMock = vi.hoisted(() => ({
  acceptAdvertisingConsent: vi.fn(),
  refuseAdvertisingConsent: vi.fn(),
}));

vi.mock('../../utils/openAiAds', async () => {
  const consent =
    await vi.importActual<typeof import('../../utils/consent')>('../../utils/consent');
  return {
    acceptAdvertisingConsent: openAiAdsMock.acceptAdvertisingConsent.mockImplementation(() => {
      return consent.setConsentPreferences({ advertising: 'accepted' });
    }),
    refuseAdvertisingConsent: openAiAdsMock.refuseAdvertisingConsent.mockImplementation(() => {
      return consent.setConsentPreferences({ advertising: 'refused' });
    }),
  };
});

function ensureDialogPolyfill() {
  HTMLDialogElement.prototype.showModal ??= function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function close() {
    this.removeAttribute('open');
  };
}

function renderCookieConsentManager(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <CookieConsentManager />
    </MemoryRouter>
  );
}

function storeConsent(analytics: 'accepted' | 'refused', advertising: 'accepted' | 'refused') {
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, analytics);
  window.localStorage.setItem(ANALYTICS_CONSENT_UPDATED_AT_STORAGE_KEY, String(Date.now()));
  window.localStorage.setItem(ADVERTISING_CONSENT_STORAGE_KEY, advertising);
  window.localStorage.setItem(ADVERTISING_CONSENT_UPDATED_AT_STORAGE_KEY, String(Date.now()));
}

describe('CookieConsentManager', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    consentInternalsForTests.reset();
    window.localStorage.clear();
    ensureDialogPolyfill();
    analyticsMock.acceptAnalyticsConsent.mockClear();
    analyticsMock.rejectAnalyticsConsent.mockClear();
    analyticsMock.setCookielessAudienceMeasurementEnabled.mockClear();
    openAiAdsMock.acceptAdvertisingConsent.mockClear();
    openAiAdsMock.refuseAdvertisingConsent.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders no banner before the client consent resolution pass', () => {
    const html = renderToString(
      <MemoryRouter>
        <CookieConsentManager />
      </MemoryRouter>
    );

    expect(html).not.toContain('Vos choix de cookies');
    expect(html).not.toContain('Gestion des cookies');
  });

  it('hydrates with stored consent without flashing the banner or logging hydration errors', async () => {
    storeConsent('accepted', 'refused');
    const html = renderToString(
      <MemoryRouter>
        <CookieConsentManager />
      </MemoryRouter>
    );
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const roots: Root[] = [];

    await act(async () => {
      roots.push(
        hydrateRoot(
          container,
          <MemoryRouter>
            <CookieConsentManager />
          </MemoryRouter>
        )
      );
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    roots[0]?.unmount();
    container.remove();
  });

  it('shows the French banner after resolution for a new visitor', async () => {
    renderCookieConsentManager();

    expect(await screen.findByRole('region', { name: 'Gestion des cookies' })).toBeInTheDocument();
    expect(screen.getByText('Vos choix de cookies')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tout refuser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personnaliser' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tout accepter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'En savoir plus' })).toHaveAttribute(
      'href',
      '/confidentialite'
    );
  });

  it('shows localized English banner copy and privacy link', async () => {
    renderCookieConsentManager('/en/contact');

    expect(await screen.findByRole('region', { name: 'Cookie management' })).toBeInTheDocument();
    expect(screen.getByText('Your cookie choices')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });

  it('applies reject all to analytics and advertising', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Tout refuser' }));

    expect(analyticsMock.rejectAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.refuseAdvertisingConsent).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
    });
  });

  it('applies accept all to analytics and advertising', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Tout accepter' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.acceptAdvertisingConsent).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Gestion des cookies' })).not.toBeInTheDocument();
    });
  });

  it('does not persist preference switch changes before saving', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Personnaliser' }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Améliorer le site' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mesurer nos publicités' }));

    expect(analyticsMock.acceptAnalyticsConsent).not.toHaveBeenCalled();
    expect(openAiAdsMock.acceptAdvertisingConsent).not.toHaveBeenCalled();
  });

  it('saves independent analytics yes / advertising no preferences', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Personnaliser' }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Améliorer le site' }));
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer mes choix' }));

    expect(analyticsMock.acceptAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.refuseAdvertisingConsent).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('saves independent analytics no / advertising yes preferences', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Personnaliser' }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mesurer nos publicités' }));
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer mes choix' }));

    expect(analyticsMock.rejectAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(openAiAdsMock.acceptAdvertisingConsent).toHaveBeenCalledTimes(1);
  });

  it('cancels the draft when closing preferences', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Personnaliser' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Améliorer le site' }));

    fireEvent.click(screen.getByRole('button', { name: 'Fermer les préférences' }));

    expect(analyticsMock.acceptAnalyticsConsent).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides cookieless audience controls while the feature is inactive', async () => {
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Personnaliser' }));

    expect(
      screen.queryByText('Statistiques de fréquentation sans cookies')
    ).not.toBeInTheDocument();
  });

  it('reject all also opts out of cookieless audience when available', async () => {
    vi.stubEnv('VITE_ENABLE_COOKIELESS_AUDIENCE', 'true');
    renderCookieConsentManager();
    fireEvent.click(await screen.findByRole('button', { name: 'Tout refuser' }));

    expect(analyticsMock.setCookielessAudienceMeasurementEnabled).toHaveBeenCalledWith(false);
  });

  it('opens preferences from the footer event with the current stored choices', async () => {
    setConsentPreferences({ analytics: 'accepted', advertising: 'refused' });
    renderCookieConsentManager();

    act(() => openCookiePreferencesModal());

    expect(screen.getByRole('dialog', { name: 'Vos préférences de cookies' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Améliorer le site' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Mesurer nos publicités' })).not.toBeChecked();
  });
});
