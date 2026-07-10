import { getLocaleFromPath } from '../i18n/routeHelpers';
import type { Locale } from '../i18n/locales';

export type AcquisitionChannel =
  | 'direct'
  | 'generative_ai'
  | 'organic_search'
  | 'paid_search'
  | 'social'
  | 'email'
  | 'referral'
  | 'campaign';

export type AiReferrer = 'chatgpt' | 'perplexity' | 'claude' | 'gemini' | 'copilot' | 'other';

export interface VolatileAcquisitionContext {
  landingPage: string;
  locale: Locale;
  utmSource: string | null;
  utmMedium: string | null;
  initialReferrer: string | null;
}

export interface ConsentedAcquisitionProperties {
  acquisition_channel: AcquisitionChannel;
  acquisition_source: string;
  landing_page: string;
  locale: Locale;
  ai_referrer?: AiReferrer;
}

export interface AudienceLandingProperties {
  landing_page: string;
  locale: Locale;
}

const SOURCE_MAX_LENGTH = 64;
const SOURCE_ALLOWED_PATTERN = /[^a-z0-9._-]+/g;
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_PATTERN = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
const PAID_SEARCH_MEDIA = new Set(['cpc', 'ppc', 'paid_search', 'paidsearch']);
const SOCIAL_MEDIA = new Set(['social', 'social_media', 'organic_social', 'paid_social']);
const EMAIL_MEDIA = new Set(['email', 'e-mail', 'newsletter']);

const AI_SOURCE_ALIASES: Readonly<Record<string, AiReferrer>> = {
  chatgpt: 'chatgpt',
  'chatgpt.com': 'chatgpt',
  openai: 'chatgpt',
  'chat.openai.com': 'chatgpt',
  perplexity: 'perplexity',
  'perplexity.ai': 'perplexity',
  claude: 'claude',
  'claude.ai': 'claude',
  anthropic: 'claude',
  gemini: 'gemini',
  'gemini.google.com': 'gemini',
  bard: 'gemini',
  copilot: 'copilot',
  'copilot.microsoft.com': 'copilot',
  bing_chat: 'copilot',
  bing_copilot: 'copilot',
  poe: 'other',
  'poe.com': 'other',
  mistral: 'other',
  deepseek: 'other',
  grok: 'other',
};

const SEARCH_PROVIDERS: ReadonlyArray<readonly [string, string]> = [
  ['google.', 'google'],
  ['bing.com', 'bing'],
  ['duckduckgo.com', 'duckduckgo'],
  ['qwant.com', 'qwant'],
  ['ecosia.org', 'ecosia'],
  ['search.yahoo.', 'yahoo'],
  ['search.brave.com', 'brave'],
];

const SOCIAL_PROVIDERS: ReadonlyArray<readonly [string, string]> = [
  ['facebook.com', 'facebook'],
  ['instagram.com', 'instagram'],
  ['linkedin.com', 'linkedin'],
  ['t.co', 'x'],
  ['x.com', 'x'],
  ['twitter.com', 'x'],
  ['youtube.com', 'youtube'],
  ['tiktok.com', 'tiktok'],
  ['pinterest.', 'pinterest'],
];

function isSensitiveString(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

export function normalizeAnalyticsPath(value: string | null | undefined): string {
  if (!value) return '/';

  const normalizeDynamicPathname = (pathname: string): string => {
    const normalizedPathname = pathname || '/';
    return /^\/simulateur\/[^/]+\/?$/.test(normalizedPathname)
      ? '/simulateur/:simulationId'
      : normalizedPathname;
  };

  try {
    const url = new URL(value, 'https://www.etoilys.fr');
    return normalizeDynamicPathname(url.pathname);
  } catch {
    const withoutHash = value.split('#')[0] ?? '';
    const withoutQuery = withoutHash.split('?')[0] ?? '';
    return normalizeDynamicPathname(withoutQuery.startsWith('/') ? withoutQuery || '/' : '/');
  }
}

export function normalizeAcquisitionSource(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmedValue = value.trim().toLowerCase();
  if (!trimmedValue || isSensitiveString(trimmedValue)) return null;

  const normalizedValue = trimmedValue
    .replace(SOURCE_ALLOWED_PATTERN, '_')
    .replace(/^[_\-.]+|[_\-.]+$/g, '')
    .slice(0, SOURCE_MAX_LENGTH);

  return normalizedValue || null;
}

function normalizeHostname(hostname: string): string {
  return hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.$/, '');
}

function hostnameMatches(hostname: string, expected: string): boolean {
  const normalizedHostname = normalizeHostname(hostname);
  const normalizedExpected = normalizeHostname(expected);
  return (
    normalizedHostname === normalizedExpected ||
    normalizedHostname.endsWith(`.${normalizedExpected}`)
  );
}

function getProviderFromHostname(
  hostname: string,
  providers: ReadonlyArray<readonly [string, string]>
): string | null {
  const normalizedHostname = normalizeHostname(hostname);

  for (const [domainPattern, provider] of providers) {
    if (domainPattern.endsWith('.')) {
      const domainStem = domainPattern.slice(0, -1).replace(/\./g, '\\.');
      const localizedDomainPattern = new RegExp(
        `(?:^|\\.)${domainStem}\\.[a-z0-9-]{2,}(?:\\.[a-z]{2})?$`
      );
      if (localizedDomainPattern.test(normalizedHostname)) {
        return provider;
      }
      continue;
    }

    if (hostnameMatches(normalizedHostname, domainPattern)) return provider;
  }

  return null;
}

function getAiReferrerFromSource(source: string | null): AiReferrer | null {
  if (!source) return null;
  return AI_SOURCE_ALIASES[source] ?? null;
}

function getAiReferrerFromUrl(url: URL): AiReferrer | null {
  const hostname = normalizeHostname(url.hostname);

  if (hostnameMatches(hostname, 'chatgpt.com') || hostname === 'chat.openai.com') return 'chatgpt';
  if (hostnameMatches(hostname, 'perplexity.ai')) return 'perplexity';
  if (hostnameMatches(hostname, 'claude.ai')) return 'claude';
  if (hostname === 'gemini.google.com' || hostname === 'bard.google.com') return 'gemini';
  if (hostnameMatches(hostname, 'copilot.microsoft.com')) return 'copilot';
  if (
    hostnameMatches(hostname, 'bing.com') &&
    (/^\/(chat|copilot)(\/|$)/.test(url.pathname) || url.searchParams.has('showconv'))
  ) {
    return 'copilot';
  }
  if (
    hostnameMatches(hostname, 'poe.com') ||
    hostname === 'chat.mistral.ai' ||
    hostnameMatches(hostname, 'deepseek.com') ||
    hostnameMatches(hostname, 'grok.com') ||
    hostnameMatches(hostname, 'you.com')
  ) {
    return 'other';
  }

  return null;
}

function safeParseUrl(value: string | null): URL | null {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function captureVolatileAcquisitionContext(input: {
  locationHref: string;
  referrer: string | null;
}): VolatileAcquisitionContext {
  const locationUrl = new URL(input.locationHref, 'https://www.etoilys.fr');

  return {
    landingPage: normalizeAnalyticsPath(locationUrl.pathname),
    locale: getLocaleFromPath(locationUrl.pathname),
    utmSource: locationUrl.searchParams.get('utm_source'),
    utmMedium: locationUrl.searchParams.get('utm_medium'),
    initialReferrer: input.referrer || null,
  };
}

export function getAudienceLandingProperties(
  context: VolatileAcquisitionContext
): AudienceLandingProperties {
  return {
    landing_page: context.landingPage,
    locale: context.locale,
  };
}

export function classifyConsentedAcquisition(
  context: VolatileAcquisitionContext
): ConsentedAcquisitionProperties {
  const utmSource = normalizeAcquisitionSource(context.utmSource);
  const utmMedium = normalizeAcquisitionSource(context.utmMedium);
  const utmAiReferrer = getAiReferrerFromSource(utmSource);

  if (utmSource) {
    if (utmAiReferrer) {
      return {
        acquisition_channel: 'generative_ai',
        acquisition_source: utmSource,
        ai_referrer: utmAiReferrer,
        landing_page: context.landingPage,
        locale: context.locale,
      };
    }

    if (utmMedium && PAID_SEARCH_MEDIA.has(utmMedium)) {
      return {
        acquisition_channel: 'paid_search',
        acquisition_source: utmSource,
        landing_page: context.landingPage,
        locale: context.locale,
      };
    }

    if ((utmMedium && EMAIL_MEDIA.has(utmMedium)) || utmSource === 'email') {
      return {
        acquisition_channel: 'email',
        acquisition_source: utmSource,
        landing_page: context.landingPage,
        locale: context.locale,
      };
    }

    if (
      (utmMedium && SOCIAL_MEDIA.has(utmMedium)) ||
      SOCIAL_PROVIDERS.some(([, provider]) => provider === utmSource)
    ) {
      return {
        acquisition_channel: 'social',
        acquisition_source: utmSource,
        landing_page: context.landingPage,
        locale: context.locale,
      };
    }

    return {
      acquisition_channel: 'campaign',
      acquisition_source: utmSource,
      landing_page: context.landingPage,
      locale: context.locale,
    };
  }

  const referrerUrl = safeParseUrl(context.initialReferrer);
  if (!referrerUrl || hostnameMatches(referrerUrl.hostname, 'etoilys.fr')) {
    return {
      acquisition_channel: 'direct',
      acquisition_source: 'direct',
      landing_page: context.landingPage,
      locale: context.locale,
    };
  }

  const aiReferrer = getAiReferrerFromUrl(referrerUrl);
  if (aiReferrer) {
    return {
      acquisition_channel: 'generative_ai',
      acquisition_source: aiReferrer,
      ai_referrer: aiReferrer,
      landing_page: context.landingPage,
      locale: context.locale,
    };
  }

  const searchProvider = getProviderFromHostname(referrerUrl.hostname, SEARCH_PROVIDERS);
  if (searchProvider) {
    return {
      acquisition_channel: 'organic_search',
      acquisition_source: searchProvider,
      landing_page: context.landingPage,
      locale: context.locale,
    };
  }

  const socialProvider = getProviderFromHostname(referrerUrl.hostname, SOCIAL_PROVIDERS);
  if (socialProvider) {
    return {
      acquisition_channel: 'social',
      acquisition_source: socialProvider,
      landing_page: context.landingPage,
      locale: context.locale,
    };
  }

  return {
    acquisition_channel: 'referral',
    acquisition_source: normalizeHostname(referrerUrl.hostname).slice(0, SOURCE_MAX_LENGTH),
    landing_page: context.landingPage,
    locale: context.locale,
  };
}
