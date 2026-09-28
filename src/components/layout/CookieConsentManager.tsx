import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  acceptAnalyticsConsent,
  rejectAnalyticsConsent,
  setCookielessAudienceMeasurementEnabled,
} from '../../utils/analytics';
import { acceptAdvertisingConsent, refuseAdvertisingConsent } from '../../utils/openAiAds';
import { COOKIE_PREFERENCES_EVENT_NAME } from '../../utils/cookiePreferences';
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeConsent,
  type ConsentSnapshot,
} from '../../utils/consent';
import { cookieConsentContent } from '../../i18n/cookieConsentContent';
import { getLocaleFromPath, getLocalizedPath } from '../../i18n/routeHelpers';

interface ConsentDraft {
  analyticsEnabled: boolean;
  advertisingEnabled: boolean;
  cookielessAudienceEnabled: boolean;
}

function createDraft(snapshot: ConsentSnapshot): ConsentDraft {
  return {
    analyticsEnabled: snapshot.analytics === 'accepted',
    advertisingEnabled: snapshot.advertising === 'accepted',
    cookielessAudienceEnabled: !snapshot.cookielessAudience.userOptOut,
  };
}

function didPersist(result: { persisted: boolean } | undefined): boolean {
  return result?.persisted !== false;
}

function ToggleSwitch({
  checked,
  label,
  enabledLabel,
  disabledLabel,
  onChange,
}: {
  checked: boolean;
  label: string;
  enabledLabel: string;
  disabledLabel: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 text-ink">
      <span className="text-sm font-medium">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-muted">{checked ? enabledLabel : disabledLabel}</span>
        <input
          type="checkbox"
          aria-label={label}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="ui-focus h-5 w-5 rounded border-ink/30 [accent-color:rgb(var(--color-ink))]"
        />
      </span>
    </label>
  );
}

export default function CookieConsentManager() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = cookieConsentContent[locale];
  const privacyPath = getLocalizedPath('confidentialite', locale) ?? '/confidentialite';
  const snapshot = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const [isReady, setIsReady] = useState(false);
  const [draft, setDraft] = useState<ConsentDraft | null>(null);
  const [isDismissedForCurrentView, setIsDismissedForCurrentView] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const bannerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const isPreferencesOpen = draft !== null;
  const showInitialBanner =
    isReady &&
    !isPreferencesOpen &&
    !isDismissedForCurrentView &&
    (snapshot.analytics === null || snapshot.advertising === null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const openPreferences = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null;
    setDraft(createDraft(getConsentSnapshot()));
  }, []);

  const closePreferences = useCallback(() => {
    setDraft(null);
    triggerRef.current?.focus();
  }, []);

  const applyRejectAll = useCallback(() => {
    const results = [];
    if (snapshot.cookielessAudience.featureAvailable) {
      results.push(setCookielessAudienceMeasurementEnabled(false));
    }
    results.push(rejectAnalyticsConsent());
    results.push(refuseAdvertisingConsent());
    setDraft(null);
    setIsDismissedForCurrentView(true);
    setStatusMessage(results.every(didPersist) ? content.savedMessage : content.memoryOnlyMessage);
  }, [
    content.memoryOnlyMessage,
    content.savedMessage,
    snapshot.cookielessAudience.featureAvailable,
  ]);

  const applyAcceptAll = useCallback(() => {
    const results = [acceptAnalyticsConsent(), acceptAdvertisingConsent()];
    if (snapshot.cookielessAudience.featureAvailable) {
      results.push(setCookielessAudienceMeasurementEnabled(true));
    }
    setDraft(null);
    setIsDismissedForCurrentView(true);
    setStatusMessage(results.every(didPersist) ? content.savedMessage : content.memoryOnlyMessage);
  }, [
    content.memoryOnlyMessage,
    content.savedMessage,
    snapshot.cookielessAudience.featureAvailable,
  ]);

  const saveDraft = useCallback(() => {
    if (!draft) return;

    const currentSnapshot = getConsentSnapshot();
    const results = [];

    if (currentSnapshot.analytics !== (draft.analyticsEnabled ? 'accepted' : 'refused')) {
      if (draft.analyticsEnabled) {
        results.push(acceptAnalyticsConsent());
      } else {
        results.push(rejectAnalyticsConsent());
      }
    }

    if (currentSnapshot.advertising !== (draft.advertisingEnabled ? 'accepted' : 'refused')) {
      if (draft.advertisingEnabled) {
        results.push(acceptAdvertisingConsent());
      } else {
        results.push(refuseAdvertisingConsent());
      }
    }

    if (
      currentSnapshot.cookielessAudience.featureAvailable &&
      currentSnapshot.cookielessAudience.userOptOut === draft.cookielessAudienceEnabled
    ) {
      results.push(setCookielessAudienceMeasurementEnabled(draft.cookielessAudienceEnabled));
    }

    setDraft(null);
    setIsDismissedForCurrentView(true);
    setStatusMessage(results.every(didPersist) ? content.savedMessage : content.memoryOnlyMessage);
  }, [content.memoryOnlyMessage, content.savedMessage, draft]);

  useEffect(() => {
    const handleOpenPreferences = () => {
      openPreferences();
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT_NAME, handleOpenPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT_NAME, handleOpenPreferences);
  }, [openPreferences]);

  useEffect(() => {
    if (!showInitialBanner) return undefined;

    const previousScrollPaddingBottom = document.documentElement.style.scrollPaddingBottom;
    const previousCookieBannerOffset = document.documentElement.style.getPropertyValue(
      '--etoilys-cookie-banner-offset'
    );
    const updateCookieBannerOffset = () => {
      const bannerHeight = Math.ceil(bannerRef.current?.getBoundingClientRect().height ?? 220);
      const offset = `${bannerHeight}px`;
      document.documentElement.style.scrollPaddingBottom = offset;
      document.documentElement.style.setProperty('--etoilys-cookie-banner-offset', offset);
    };
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateCookieBannerOffset);

    updateCookieBannerOffset();
    if (bannerRef.current) {
      resizeObserver?.observe(bannerRef.current);
    }
    window.addEventListener('resize', updateCookieBannerOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCookieBannerOffset);
      document.documentElement.style.scrollPaddingBottom = previousScrollPaddingBottom;
      if (previousCookieBannerOffset) {
        document.documentElement.style.setProperty(
          '--etoilys-cookie-banner-offset',
          previousCookieBannerOffset
        );
      } else {
        document.documentElement.style.removeProperty('--etoilys-cookie-banner-offset');
      }
    };
  }, [showInitialBanner]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isPreferencesOpen) return undefined;

    if (!dialog.open) {
      dialog.showModal();
    }
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isPreferencesOpen]);

  const secondaryActionButtonClasses =
    'ui-focus inline-flex min-h-11 w-full items-center justify-center rounded-editorial border border-ink/25 bg-transparent px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface-hover hover:text-ink motion-reduce:transition-none';
  const primaryActionButtonClasses =
    'ui-focus inline-flex min-h-11 w-full items-center justify-center rounded-editorial border border-ink bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-hover hover:text-white motion-reduce:transition-none';

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>

      {showInitialBanner && (
        <section
          ref={bannerRef}
          role="region"
          aria-label={content.bannerAriaLabel}
          className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-[720px] rounded-editorial border border-ink/15 bg-surface p-4 shadow-[0_10px_30px_rgb(var(--color-ink)/0.08)] transition-all duration-200 motion-reduce:transition-none sm:p-5">
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-playfair text-lg font-semibold text-ink">
                  {content.bannerTitle}
                </p>
                <p className="text-sm leading-relaxed text-muted">{content.bannerText}</p>
                <Link to={privacyPath} className="editorial-inline-link mt-3 inline-flex text-sm">
                  {content.learnMoreLabel}
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  className={secondaryActionButtonClasses}
                  onClick={applyRejectAll}
                >
                  {content.rejectAllLabel}
                </button>
                <button
                  type="button"
                  className={secondaryActionButtonClasses}
                  onClick={(event) => openPreferences(event.currentTarget)}
                >
                  {content.customizeLabel}
                </button>
                <button
                  type="button"
                  className={primaryActionButtonClasses}
                  onClick={applyAcceptAll}
                >
                  {content.acceptAllLabel}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {draft && (
        <dialog
          ref={dialogRef}
          aria-labelledby="cookie-preferences-title"
          aria-describedby="cookie-preferences-description"
          className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/35"
          onCancel={(event) => {
            event.preventDefault();
            closePreferences();
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePreferences();
          }}
        >
          <div className="flex min-h-full items-end justify-center px-4 py-4 sm:items-center sm:py-6">
            <section className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col rounded-editorial border border-ink/15 bg-surface shadow-[0_20px_55px_rgb(var(--color-ink)/0.14)]">
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 sm:p-6">
                <div>
                  <h2 id="cookie-preferences-title" className="text-xl text-ink">
                    {content.preferencesTitle}
                  </h2>
                  <p id="cookie-preferences-description" className="mt-2 text-sm text-muted">
                    {content.preferencesIntro}
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="ui-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-editorial border border-ink/20 text-ink transition-colors duration-200 hover:bg-surface-hover motion-reduce:transition-none"
                  aria-label={content.closePreferencesLabel}
                  onClick={closePreferences}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-sm sm:p-6">
                <section className="border-b border-ink/10 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-ink">{content.necessaryTitle}</h3>
                      <p className="mt-1 text-muted">{content.necessaryText}</p>
                    </div>
                    <span className="shrink-0 rounded-editorial bg-paper px-2.5 py-1 text-xs font-medium text-ink">
                      {content.alwaysActiveLabel}
                    </span>
                  </div>
                </section>

                <section className="border-b border-ink/10 pb-4">
                  <h3 className="font-medium text-ink">{content.analyticsTitle}</h3>
                  <p className="mt-1 text-muted">{content.analyticsText}</p>
                  <p className="mt-2 text-xs text-muted">{content.analyticsTool}</p>
                  <ToggleSwitch
                    checked={draft.analyticsEnabled}
                    label={content.analyticsTitle}
                    enabledLabel={content.enabledLabel}
                    disabledLabel={content.disabledLabel}
                    onChange={(checked) =>
                      setDraft((currentDraft) =>
                        currentDraft ? { ...currentDraft, analyticsEnabled: checked } : currentDraft
                      )
                    }
                  />
                </section>

                <section className="border-b border-ink/10 pb-4">
                  <h3 className="font-medium text-ink">{content.advertisingTitle}</h3>
                  <p className="mt-1 text-muted">{content.advertisingText}</p>
                  <p className="mt-2 text-xs text-muted">{content.advertisingTool}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {content.advertisingMatchingText}
                  </p>
                  <ToggleSwitch
                    checked={draft.advertisingEnabled}
                    label={content.advertisingTitle}
                    enabledLabel={content.enabledLabel}
                    disabledLabel={content.disabledLabel}
                    onChange={(checked) =>
                      setDraft((currentDraft) =>
                        currentDraft
                          ? { ...currentDraft, advertisingEnabled: checked }
                          : currentDraft
                      )
                    }
                  />
                </section>

                {snapshot.cookielessAudience.featureAvailable && (
                  <section>
                    <h3 className="font-medium text-ink">{content.cookielessTitle}</h3>
                    <p className="mt-1 text-muted">{content.cookielessText}</p>
                    <ToggleSwitch
                      checked={draft.cookielessAudienceEnabled}
                      label={content.cookielessTitle}
                      enabledLabel={content.enabledLabel}
                      disabledLabel={content.disabledLabel}
                      onChange={(checked) =>
                        setDraft((currentDraft) =>
                          currentDraft
                            ? { ...currentDraft, cookielessAudienceEnabled: checked }
                            : currentDraft
                        )
                      }
                    />
                  </section>
                )}
              </div>

              <div className="grid shrink-0 grid-cols-1 gap-3 border-t border-ink/10 p-5 sm:grid-cols-3 sm:p-6">
                <button
                  type="button"
                  className={secondaryActionButtonClasses}
                  onClick={applyRejectAll}
                >
                  {content.rejectAllLabel}
                </button>
                <button
                  type="button"
                  className={secondaryActionButtonClasses}
                  onClick={applyAcceptAll}
                >
                  {content.acceptAllLabel}
                </button>
                <button type="button" className={primaryActionButtonClasses} onClick={saveDraft}>
                  {content.saveLabel}
                </button>
                <Link
                  to={privacyPath}
                  className="editorial-inline-link inline-flex items-center justify-center text-sm sm:col-span-3"
                  onClick={closePreferences}
                >
                  {content.privacyLinkLabel}
                </Link>
              </div>
            </section>
          </div>
        </dialog>
      )}
    </>
  );
}
