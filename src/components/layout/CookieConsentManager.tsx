import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  acceptAnalyticsConsent,
  getAnalyticsConsentStatus,
  rejectAnalyticsConsent,
  type AnalyticsConsent,
} from '../../utils/analytics';
import { COOKIE_PREFERENCES_EVENT_NAME } from '../../utils/cookiePreferences';
import { type Locale } from '../../i18n/locales';
import { getLocaleFromPath, getLocalizedPath } from '../../i18n/routeHelpers';

const cookieConsentContent = {
  fr: {
    bannerAriaLabel: 'Gestion des cookies',
    bannerTitle: 'Cookies et mesure d’audience',
    bannerText:
      'Nous utilisons PostHog pour mesurer l’audience du site et comprendre l’utilisation de nos pages, formulaires et simulateurs. Ces données nous aident à améliorer le site Etoilys. Aucun nom, email, téléphone, adresse ou message n’est envoyé volontairement à PostHog. Vous pouvez accepter, refuser ou modifier votre choix à tout moment.',
    privacyLinkLabel: 'Politique de confidentialité',
    rejectLabel: 'Refuser',
    acceptLabel: 'Accepter',
    preferencesTitle: 'Préférences cookies',
    preferencesDescription: 'Vous pouvez modifier votre choix à tout moment.',
    closePreferencesLabel: 'Fermer les préférences cookies',
    purposeLabel: 'Finalité',
    purposeValue: 'Mesure d’audience et amélioration du site',
    toolLabel: 'Outil',
    currentStatusLabel: 'Statut actuel',
    statusLabels: {
      accepted: 'accepté',
      refused: 'refusé',
      unset: 'non défini',
    },
  },
  en: {
    bannerAriaLabel: 'Cookie management',
    bannerTitle: 'Cookies and audience measurement',
    bannerText:
      'Etoilys uses PostHog to measure website audience and understand how pages and forms are used. This data helps improve the Etoilys website. No name, email address, phone number, postal address or message is voluntarily sent to PostHog. You can accept, refuse or change your choice at any time.',
    privacyLinkLabel: 'Privacy policy',
    rejectLabel: 'Refuse',
    acceptLabel: 'Accept',
    preferencesTitle: 'Cookie preferences',
    preferencesDescription: 'You can change your choice at any time.',
    closePreferencesLabel: 'Close cookie preferences',
    purposeLabel: 'Purpose',
    purposeValue: 'Audience measurement and website improvement',
    toolLabel: 'Tool',
    currentStatusLabel: 'Current status',
    statusLabels: {
      accepted: 'accepted',
      refused: 'refused',
      unset: 'not set',
    },
  },
} as const satisfies Record<
  Locale,
  {
    bannerAriaLabel: string;
    bannerTitle: string;
    bannerText: string;
    privacyLinkLabel: string;
    rejectLabel: string;
    acceptLabel: string;
    preferencesTitle: string;
    preferencesDescription: string;
    closePreferencesLabel: string;
    purposeLabel: string;
    purposeValue: string;
    toolLabel: string;
    currentStatusLabel: string;
    statusLabels: Record<AnalyticsConsent | 'unset', string>;
  }
>;

function getStatusLabel(
  status: AnalyticsConsent | null,
  statusLabels: Record<AnalyticsConsent | 'unset', string>
): string {
  if (status === 'accepted') return statusLabels.accepted;
  if (status === 'refused') return statusLabels.refused;
  return statusLabels.unset;
}

export default function CookieConsentManager() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = cookieConsentContent[locale];
  const privacyPath = getLocalizedPath('confidentialite', locale) ?? '/confidentialite';
  const [consentStatus, setConsentStatus] = useState<AnalyticsConsent | null>(() =>
    getAnalyticsConsentStatus()
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const showInitialBanner = consentStatus === null && !isPreferencesOpen;

  const refreshConsentStatus = useCallback(() => {
    setConsentStatus(getAnalyticsConsentStatus());
  }, []);

  const handleAccept = useCallback(() => {
    acceptAnalyticsConsent();
    setConsentStatus('accepted');
    setIsPreferencesOpen(false);
  }, []);

  const handleReject = useCallback(() => {
    rejectAnalyticsConsent();
    setConsentStatus('refused');
    setIsPreferencesOpen(false);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      refreshConsentStatus();
      setIsPreferencesOpen(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT_NAME, openPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT_NAME, openPreferences);
  }, [refreshConsentStatus]);

  useEffect(() => {
    if (!showInitialBanner) {
      return undefined;
    }

    const previousScrollPaddingBottom = document.documentElement.style.scrollPaddingBottom;
    document.documentElement.style.scrollPaddingBottom = '220px';

    return () => {
      document.documentElement.style.scrollPaddingBottom = previousScrollPaddingBottom;
    };
  }, [showInitialBanner]);

  useEffect(() => {
    if (!isPreferencesOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreferencesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreferencesOpen]);

  const actionButtonClasses =
    'inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-primary-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200 hover:border-primary-300 hover:bg-primary-100/40 hover:text-primary-400 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 sm:min-w-32 motion-reduce:transition-none';

  return (
    <>
      {showInitialBanner && (
        <section
          role="region"
          aria-label={content.bannerAriaLabel}
          className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-4xl rounded-card border border-primary-200/60 bg-white p-4 shadow-card transition-all duration-300 motion-reduce:transition-none sm:p-5 lg:shadow-card-hover">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
              <div className="max-w-2xl">
                <p className="mb-3 text-base font-playfair font-semibold text-gray-900">
                  {content.bannerTitle}
                </p>
                <p className="max-w-2xl text-sm leading-relaxed text-textLight">
                  {content.bannerText}
                </p>
                <Link
                  to={privacyPath}
                  className="mt-4 inline-flex text-sm font-medium text-primary-400 hover:text-primary-500"
                >
                  {content.privacyLinkLabel}
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:shrink-0">
                <button type="button" className={actionButtonClasses} onClick={handleReject}>
                  {content.rejectLabel}
                </button>
                <button type="button" className={actionButtonClasses} onClick={handleAccept}>
                  {content.acceptLabel}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {isPreferencesOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-gray-900/35 px-4 py-6 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPreferencesOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            aria-describedby="cookie-preferences-description"
            className="w-full max-w-lg rounded-card border border-gray-200 bg-white p-5 shadow-card sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="cookie-preferences-title" className="text-xl text-gray-900">
                  {content.preferencesTitle}
                </h2>
                <p id="cookie-preferences-description" className="mt-2 text-sm text-textLight">
                  {content.preferencesDescription}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-primary-300 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 motion-reduce:transition-none"
                aria-label={content.closePreferencesLabel}
                onClick={() => setIsPreferencesOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-gray-900">{content.purposeLabel}</dt>
                  <dd className="mt-1 text-textLight">{content.purposeValue}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">{content.toolLabel}</dt>
                  <dd className="mt-1 text-textLight">PostHog</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">{content.currentStatusLabel}</dt>
                  <dd className="mt-1 text-textLight">
                    {getStatusLabel(consentStatus, content.statusLabels)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" className={actionButtonClasses} onClick={handleReject}>
                {content.rejectLabel}
              </button>
              <button type="button" className={actionButtonClasses} onClick={handleAccept}>
                {content.acceptLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
