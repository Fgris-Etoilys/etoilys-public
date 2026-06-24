export const SUPPORTED_LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export const EN_CONTENT_READY = false;

const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && SUPPORTED_LOCALE_SET.has(value);

export const isIndexableByLocale = (locale: Locale): boolean =>
  locale === DEFAULT_LOCALE || (locale === 'en' && EN_CONTENT_READY);
