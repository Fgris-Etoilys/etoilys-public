export const SUPPORTED_LOCALES = ['fr', 'en', 'nl'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_URL_PREFIXES = {
  fr: '',
  en: '/en',
  nl: '/nl',
} as const satisfies Record<Locale, string>;

export const OG_LOCALES = {
  fr: 'fr_FR',
  en: 'en_GB',
  nl: 'nl_NL',
} as const satisfies Record<Locale, string>;

const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && SUPPORTED_LOCALE_SET.has(value);
