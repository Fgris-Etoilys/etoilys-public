import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  acceptAnalyticsConsent,
  getAnalyticsConsentStatus,
  rejectAnalyticsConsent,
  type AnalyticsConsent,
} from '../../utils/analytics';
import { COOKIE_PREFERENCES_EVENT_NAME } from '../../utils/cookiePreferences';

const BANNER_TEXT =
  'Nous utilisons PostHog pour mesurer l’audience du site et comprendre l’utilisation de nos pages, formulaires et simulateurs. Ces données nous aident à améliorer le site Etoilys. Aucun nom, email, téléphone, adresse ou message n’est envoyé volontairement à PostHog. Vous pouvez accepter, refuser ou modifier votre choix à tout moment.';

function getStatusLabel(status: AnalyticsConsent | null): string {
  if (status === 'accepted') return 'accepté';
  if (status === 'refused') return 'refusé';
  return 'non défini';
}

export default function CookieConsentManager() {
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
    refreshConsentStatus();
    setIsPreferencesOpen(false);
  }, [refreshConsentStatus]);

  const handleReject = useCallback(() => {
    rejectAnalyticsConsent();
    refreshConsentStatus();
    setIsPreferencesOpen(false);
  }, [refreshConsentStatus]);

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
          aria-label="Gestion des cookies"
          className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-4xl rounded-card border border-primary-200/60 bg-white p-4 shadow-card transition-all duration-300 motion-reduce:transition-none sm:p-5 lg:shadow-card-hover">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
              <div className="max-w-2xl">
                <p className="mb-3 text-base font-playfair font-semibold text-gray-900">
                  Cookies et mesure d’audience
                </p>
                <p className="max-w-2xl text-sm leading-relaxed text-textLight">{BANNER_TEXT}</p>
                <Link
                  to="/confidentialite"
                  className="mt-4 inline-flex text-sm font-medium text-primary-400 hover:text-primary-500"
                >
                  Politique de confidentialité
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:shrink-0">
                <button type="button" className={actionButtonClasses} onClick={handleReject}>
                  Refuser
                </button>
                <button type="button" className={actionButtonClasses} onClick={handleAccept}>
                  Accepter
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
                  Préférences cookies
                </h2>
                <p id="cookie-preferences-description" className="mt-2 text-sm text-textLight">
                  Vous pouvez modifier votre choix à tout moment.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-primary-300 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 motion-reduce:transition-none"
                aria-label="Fermer les préférences cookies"
                onClick={() => setIsPreferencesOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <dl className="grid gap-3">
                <div>
                  <dt className="font-medium text-gray-900">Finalité</dt>
                  <dd className="mt-1 text-textLight">Mesure d’audience et amélioration du site</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Outil</dt>
                  <dd className="mt-1 text-textLight">PostHog</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Statut actuel</dt>
                  <dd className="mt-1 text-textLight">{getStatusLabel(consentStatus)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" className={actionButtonClasses} onClick={handleReject}>
                Refuser
              </button>
              <button type="button" className={actionButtonClasses} onClick={handleAccept}>
                Accepter
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
