const FRENCH_DATE_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatFrenchDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return isoDate;
  }

  return FRENCH_DATE_FORMATTER.format(new Date(Date.UTC(year, month - 1, day)));
}
