import { getAllArticleStructuredData, getArticleStructuredData } from './articleStructuredData';
import { getSeoRouteConfig } from './seoRoutes';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function dateToTime(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00.000Z`).getTime();
}

export function isValidIsoDateOnly(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const timestamp = dateToTime(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().startsWith(value);
}

export function assertValidLastModified(value: string, context: string): void {
  if (!isValidIsoDateOnly(value)) {
    throw new Error(`${context} has an invalid lastmod date: ${value}`);
  }

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  if (dateToTime(value) > todayUtc) {
    throw new Error(`${context} has a future lastmod date: ${value}`);
  }
}

export function maxIsoDate(first: string, second: string): string {
  return dateToTime(first) >= dateToTime(second) ? first : second;
}

function getLatestArticleModifiedDate(): string {
  const dates = getAllArticleStructuredData().map((article) => article.dateModified);

  if (dates.length === 0) {
    throw new Error('No article metadata available to compute /actualites lastmod.');
  }

  return dates.reduce(maxIsoDate);
}

export function getSitemapLastModified(pathname: string): string {
  const article = getArticleStructuredData(pathname);

  if (article !== null) {
    assertValidLastModified(article.datePublished, `${pathname} datePublished`);
    assertValidLastModified(article.dateModified, `${pathname} dateModified`);

    if (dateToTime(article.dateModified) < dateToTime(article.datePublished)) {
      throw new Error(`${pathname} dateModified must be greater than or equal to datePublished.`);
    }

    return article.dateModified;
  }

  const route = getSeoRouteConfig(pathname);

  if (route.lastModified === undefined) {
    throw new Error(`${pathname} is indexable but has no controlled lastModified date.`);
  }

  assertValidLastModified(route.lastModified, pathname);

  if (pathname === '/actualites') {
    return maxIsoDate(route.lastModified, getLatestArticleModifiedDate());
  }

  return route.lastModified;
}
