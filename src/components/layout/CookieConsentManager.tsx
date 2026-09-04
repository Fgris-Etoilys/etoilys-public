import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  acceptAnalyticsConsent,
  getAnalyticsConsentStatus,
  isCookielessAudienceMeasurementEnabled,
  rejectAnalyticsConsent,
  setCookielessAudienceMeasurementEnabled,
  type AnalyticsConsent,
} from '../../utils/analytics';
import {
  acceptAdvertisingConsent,
  getAdvertisingConsentStatus,
  refuseAdvertisingConsent,
  type AdvertisingConsent,
} from '../../utils/openAiAds';
import { COOKIE_PREFERENCES_EVENT_NAME } from '../../utils/cookiePreferences';
import { type Locale } from '../../i18n/locales';
import { getLocaleFromPath, getLocalizedPath } from '../../i18n/routeHelpers';

const cookieConsentContent = {
  fr: {
    bannerAriaLabel: 'Gestion des cookies',
    bannerTitle: 'Vos préférences de confidentialité',
    bannerText:
      'Etoilys utilise PostHog pour mesurer l’utilisation du site et améliorer ses pages, formulaires et simulateurs, ainsi qu’OpenAI Ads pour mesurer l’efficacité de ses campagnes publicitaires. Avec votre accord, nous mesurons également l’origine des visites et les actions réalisées sur le site.\n\nSi vous refusez, aucun cookie analytique ni publicitaire n’est utilisé. Une mesure limitée, sans cookie, de la page d’entrée et de la langue peut toutefois rester active. Vous pouvez aussi la désactiver dans les préférences et modifier votre choix à tout moment.',
    privacyLinkLabel: 'Politique de confidentialité',
    rejectLabel: 'Refuser',
    acceptLabel: 'Accepter',
    preferencesTitle: 'Préférences cookies',
    preferencesDescription:
      'Le consentement détaillé, la mesure publicitaire et la mesure minimale après refus sont des réglages distincts.',
    closePreferencesLabel: 'Fermer les préférences cookies',
    detailedPurposeLabel: 'Analytics détaillés',
    detailedPurposeValue:
      'Pages consultées, acquisition, formulaires, contacts, simulateurs et conversions, uniquement après acceptation.',
    advertisingPurposeLabel: 'Mesure publicitaire (OpenAI Ads)',
    advertisingPurposeValue:
      'Envoi d’un événement de conversion à OpenAI Ads uniquement lorsqu’une demande de classement est réellement envoyée avec succès. Le site n’y ajoute explicitement aucune donnée brute du formulaire ; si la correspondance avancée automatique d’OpenAI Ads est active pour cette source, elle peut toutefois transmettre séparément des informations client hachées détectées sur la page.',
    advertisingToggleLabel: 'Autoriser la mesure publicitaire OpenAI Ads',
    currentAdvertisingStatusLabel: 'Consentement publicitaire',
    minimalPurposeLabel: 'Audience minimale après refus',
    minimalPurposeValue:
      'Au maximum un événement sans cookie par chargement, limité à la page d’entrée sans paramètres et à la langue. Le flag de production reste désactivé tant que les contrôles préalables ne sont pas terminés.',
    minimalToggleLabel: 'Autoriser la mesure d’audience minimale après un refus',
    toolLabel: 'Outil',
    currentStatusLabel: 'Consentement détaillé',
    statusLabels: {
      accepted: 'accepté',
      refused: 'refusé',
      unset: 'non défini',
    },
  },
  en: {
    bannerAriaLabel: 'Cookie management',
    bannerTitle: 'Your privacy preferences',
    bannerText:
      'Etoilys uses PostHog to understand how the website is used and improve its pages, forms and simulators, as well as OpenAI Ads to measure the effectiveness of its advertising campaigns. With your consent, we also measure where visits come from and the actions taken on the website.\n\nIf you decline, no analytics or advertising cookies will be used. A limited, cookieless measurement of the landing page and language may still remain active. You can also disable it in the preferences and change your choice at any time.',
    privacyLinkLabel: 'Privacy policy',
    rejectLabel: 'Refuse',
    acceptLabel: 'Accept',
    preferencesTitle: 'Cookie preferences',
    preferencesDescription:
      'Detailed consent, advertising measurement and minimal measurement after refusal are separate settings.',
    closePreferencesLabel: 'Close cookie preferences',
    detailedPurposeLabel: 'Detailed analytics',
    detailedPurposeValue:
      'Viewed pages, acquisition, forms, contact links, simulators and conversions, only after acceptance.',
    advertisingPurposeLabel: 'Advertising measurement (OpenAI Ads)',
    advertisingPurposeValue:
      'Sends a conversion event to OpenAI Ads only when a classification request is actually submitted successfully. The site does not explicitly add any raw form data to it; OpenAI Ads’ automatic advanced matching, if active for this source, may separately send hashed customer information it detects on the page.',
    advertisingToggleLabel: 'Allow OpenAI Ads advertising measurement',
    currentAdvertisingStatusLabel: 'Advertising consent',
    minimalPurposeLabel: 'Minimal audience measurement after refusal',
    minimalPurposeValue:
      'At most one cookieless event per page load, limited to the landing page without parameters and the language. The production flag remains disabled until the prerequisite checks are complete.',
    minimalToggleLabel: 'Allow minimal audience measurement after refusal',
    toolLabel: 'Tool',
    currentStatusLabel: 'Detailed consent',
    statusLabels: {
      accepted: 'accepted',
      refused: 'refused',
      unset: 'not set',
    },
  },
  nl: {
    bannerAriaLabel: 'Cookiebeheer',
    bannerTitle: 'Uw privacyvoorkeuren',
    bannerText:
      'Etoilys gebruikt PostHog om te begrijpen hoe de website wordt gebruikt en om pagina’s, formulieren en diensten te verbeteren, evenals OpenAI Ads om de effectiviteit van advertentiecampagnes te meten. Met uw toestemming meten wij ook waar bezoeken vandaan komen en welke acties op de website worden uitgevoerd.\n\nAls u weigert, worden er geen analytische of advertentiecookies gebruikt. Een beperkte meting zonder cookies van de landingspagina en de taal kan wel actief blijven. U kunt die ook uitschakelen in de voorkeuren en uw keuze op elk moment wijzigen.',
    privacyLinkLabel: 'Privacybeleid',
    rejectLabel: 'Weigeren',
    acceptLabel: 'Accepteren',
    preferencesTitle: 'Cookievoorkeuren',
    preferencesDescription:
      'Gedetailleerde toestemming, advertentiemeting en minimale meting na weigering zijn aparte instellingen.',
    closePreferencesLabel: 'Cookievoorkeuren sluiten',
    detailedPurposeLabel: 'Gedetailleerde analytics',
    detailedPurposeValue:
      'Bekeken pagina’s, acquisitie, formulieren, contactlinks, simulatoren en conversies, alleen na acceptatie.',
    advertisingPurposeLabel: 'Advertentiemeting (OpenAI Ads)',
    advertisingPurposeValue:
      'Verzendt een conversiegebeurtenis naar OpenAI Ads alleen wanneer een classificatieaanvraag daadwerkelijk succesvol is verzonden. De site voegt hier expliciet geen ruwe formuliergegevens aan toe; de automatische advanced matching van OpenAI Ads kan, indien actief voor deze bron, afzonderlijk gehashte klantgegevens verzenden die op de pagina worden gedetecteerd.',
    advertisingToggleLabel: 'Advertentiemeting via OpenAI Ads toestaan',
    currentAdvertisingStatusLabel: 'Advertentietoestemming',
    minimalPurposeLabel: 'Minimale bezoekersmeting na weigering',
    minimalPurposeValue:
      'Maximaal één gebeurtenis zonder cookie per paginaweergave, beperkt tot de landingspagina zonder parameters en de taal. Deze beperkte meting kan afzonderlijk worden uitgeschakeld in de cookievoorkeuren.',
    minimalToggleLabel: 'Minimale bezoekersmeting na een weigering toestaan',
    toolLabel: 'Tool',
    currentStatusLabel: 'Gedetailleerde toestemming',
    statusLabels: {
      accepted: 'geaccepteerd',
      refused: 'geweigerd',
      unset: 'niet ingesteld',
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
    detailedPurposeLabel: string;
    detailedPurposeValue: string;
    advertisingPurposeLabel: string;
    advertisingPurposeValue: string;
    advertisingToggleLabel: string;
    currentAdvertisingStatusLabel: string;
    minimalPurposeLabel: string;
    minimalPurposeValue: string;
    minimalToggleLabel: string;
    toolLabel: string;
    currentStatusLabel: string;
    statusLabels: Record<AnalyticsConsent | AdvertisingConsent | 'unset', string>;
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
  const [advertisingConsentStatus, setAdvertisingConsentStatus] =
    useState<AdvertisingConsent | null>(() => getAdvertisingConsentStatus());
  const [isMinimalAudienceEnabled, setIsMinimalAudienceEnabled] = useState(() =>
    isCookielessAudienceMeasurementEnabled()
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const bannerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const showInitialBanner =
    (consentStatus === null || advertisingConsentStatus === null) && !isPreferencesOpen;

  const refreshPreferences = useCallback(() => {
    setConsentStatus(getAnalyticsConsentStatus());
    setAdvertisingConsentStatus(getAdvertisingConsentStatus());
    setIsMinimalAudienceEnabled(isCookielessAudienceMeasurementEnabled());
  }, []);

  const handleAccept = useCallback(() => {
    acceptAnalyticsConsent();
    acceptAdvertisingConsent();
    setConsentStatus('accepted');
    setAdvertisingConsentStatus('accepted');
    setIsPreferencesOpen(false);
  }, []);

  const handleReject = useCallback(() => {
    rejectAnalyticsConsent();
    refuseAdvertisingConsent();
    setConsentStatus('refused');
    setAdvertisingConsentStatus('refused');
    setIsPreferencesOpen(false);
  }, []);

  const handleAdvertisingConsentChange = useCallback((enabled: boolean) => {
    if (enabled) {
      acceptAdvertisingConsent();
    } else {
      refuseAdvertisingConsent();
    }
    setAdvertisingConsentStatus(enabled ? 'accepted' : 'refused');
  }, []);

  const handleMinimalAudienceChange = useCallback((enabled: boolean) => {
    setCookielessAudienceMeasurementEnabled(enabled);
    setIsMinimalAudienceEnabled(enabled);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      refreshPreferences();
      setIsPreferencesOpen(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT_NAME, openPreferences);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT_NAME, openPreferences);
  }, [refreshPreferences]);

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
    if (!isPreferencesOpen) return undefined;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPreferencesOpen(false);
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
          ref={bannerRef}
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
            if (event.target === event.currentTarget) setIsPreferencesOpen(false);
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

            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">{content.detailedPurposeLabel}</p>
                <p className="mt-1 text-textLight">{content.detailedPurposeValue}</p>
                <p className="mt-2 text-textLight">
                  {content.currentStatusLabel} :{' '}
                  {getStatusLabel(consentStatus, content.statusLabels)}
                </p>
                <p className="mt-1 text-textLight">{content.toolLabel} : PostHog</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium text-gray-900">{content.advertisingPurposeLabel}</p>
                <p className="mt-1 text-textLight">{content.advertisingPurposeValue}</p>
                <label className="mt-3 flex cursor-pointer items-start gap-3 text-gray-800">
                  <input
                    type="checkbox"
                    checked={advertisingConsentStatus === 'accepted'}
                    onChange={(event) => handleAdvertisingConsentChange(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-400 focus:ring-primary-300"
                  />
                  <span>{content.advertisingToggleLabel}</span>
                </label>
                <p className="mt-2 text-textLight">
                  {content.currentAdvertisingStatusLabel} :{' '}
                  {getStatusLabel(advertisingConsentStatus, content.statusLabels)}
                </p>
                <p className="mt-1 text-textLight">{content.toolLabel} : OpenAI Ads</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium text-gray-900">{content.minimalPurposeLabel}</p>
                <p className="mt-1 text-textLight">{content.minimalPurposeValue}</p>
                <label className="mt-3 flex cursor-pointer items-start gap-3 text-gray-800">
                  <input
                    type="checkbox"
                    checked={isMinimalAudienceEnabled}
                    onChange={(event) => handleMinimalAudienceChange(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-400 focus:ring-primary-300"
                  />
                  <span>{content.minimalToggleLabel}</span>
                </label>
              </div>
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
