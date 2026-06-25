export const SUPPORTED_LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && SUPPORTED_LOCALE_SET.has(value);
