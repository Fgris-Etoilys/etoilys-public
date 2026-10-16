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

type ArticleDateLocale = 'fr' | 'en';

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

export function formatArticleDate(isoDate: string, locale: ArticleDateLocale = 'fr'): string {
  const date = parseIsoDate(isoDate);
  if (date === null) {
    return isoDate;
  }

  return locale === 'en' ? ENGLISH_DATE_FORMATTER.format(date) : FRENCH_DATE_FORMATTER.format(date);
}
