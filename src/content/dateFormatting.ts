import type { Locale } from '../i18n/locales';

const FRENCH_DATE_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const ENGLISH_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const DUTCH_DATE_FORMATTER = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const ARTICLE_DATE_FORMATTERS = {
  fr: FRENCH_DATE_FORMATTER,
  en: ENGLISH_DATE_FORMATTER,
  nl: DUTCH_DATE_FORMATTER,
} as const satisfies Record<Locale, Intl.DateTimeFormat>;

function parseIsoDate(isoDate: string): Date | null {
  const [year, month, day] = isoDate.split('-').map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

export function formatFrenchDate(isoDate: string): string {
  return formatArticleDate(isoDate, 'fr');
}

export function formatArticleDate(isoDate: string, locale: Locale = 'fr'): string {
  const date = parseIsoDate(isoDate);
  if (date === null) {
    return isoDate;
  }

  return ARTICLE_DATE_FORMATTERS[locale].format(date);
}
