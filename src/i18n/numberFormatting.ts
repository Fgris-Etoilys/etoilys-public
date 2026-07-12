import type { Locale } from './locales';

const NUMBER_LOCALES: Readonly<Record<Locale, string>> = {
  fr: 'fr-FR',
  en: 'en-GB',
  nl: 'nl-NL',
};

export function getNumberLocale(locale: Locale): string {
  return NUMBER_LOCALES[locale];
}

export function formatEuro(value: number, locale: Locale): string {
  return value.toLocaleString(getNumberLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatInteger(value: number, locale: Locale): string {
  return value.toLocaleString(getNumberLocale(locale), {
    maximumFractionDigits: 0,
  });
}

export function formatDate(value: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getNumberLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value);
}
