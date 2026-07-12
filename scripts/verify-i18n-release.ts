import { EN_INDEXABLE_ROUTE_IDS, NL_INDEXABLE_ROUTE_IDS } from '../src/i18n/contentReadiness.ts';
import { localizedRoutes } from '../src/i18n/localizedRoutes.ts';

const baseUrl = (process.env.I18N_RELEASE_BASE_URL ?? 'https://www.etoilys.fr').replace(/\/+$/, '');

const DUTCH_EXPECTED_TEXT_BY_ROUTE_ID = {
  home: 'vakantiewoning',
  classement: 'vakantiewoning',
  avantages: 'vakantiewoning',
  prerequis: 'vakantiewoning',
  procedure: 'vakantiewoning',
  faq: 'vakantiewoning',
  contact: 'vakantiewoning',
  demandeClassement: 'vakantiewoning',
  confidentialite: 'persoonsgegevens',
} as const satisfies Record<(typeof NL_INDEXABLE_ROUTE_IDS)[number], string>;

interface CheckResult {
  label: string;
  ok: boolean;
  detail: string;
}

function absoluteUrl(pathname: string): string {
  return `${baseUrl}${pathname}`;
}

async function fetchManual(pathname: string): Promise<Response> {
  return fetch(absoluteUrl(pathname), { redirect: 'manual' });
}

async function expectStatus(pathname: string, expectedStatus: number): Promise<CheckResult> {
  const response = await fetchManual(pathname);
  return {
    label: `${pathname} status`,
    ok: response.status === expectedStatus,
    detail: `expected ${expectedStatus}, got ${response.status}`,
  };
}

async function expectLocalizedNotFound(
  pathname: string,
  expectedLang: 'fr' | 'en' | 'nl',
  expectedText: string
): Promise<CheckResult[]> {
  const response = await fetchManual(pathname);
  const html = await response.text();
  const hasLang = new RegExp(`<html[^>]+lang=["']${expectedLang}["']`, 'i').test(html);
  const hasText = html.includes(expectedText);
  const hasNoindex = /<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(html);
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasAlternate = /<link[^>]+rel=["']alternate["']/i.test(html);
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);

  return [
    {
      label: `${pathname} HTTP 404`,
      ok: response.status === 404,
      detail: `expected 404, got ${response.status}`,
    },
    {
      label: `${pathname} lang=${expectedLang}`,
      ok: hasLang,
      detail: `expected html lang ${expectedLang}`,
    },
    {
      label: `${pathname} localized body`,
      ok: hasText,
      detail: `expected body to contain "${expectedText}"`,
    },
    {
      label: `${pathname} noindex`,
      ok: hasNoindex,
      detail: 'expected noindex,follow robots meta',
    },
    {
      label: `${pathname} no canonical/hreflang/JSON-LD`,
      ok: !hasCanonical && !hasAlternate && !hasJsonLd,
      detail: `canonical=${hasCanonical}, alternate=${hasAlternate}, jsonLd=${hasJsonLd}`,
    },
  ];
}

async function expectLocalizedPage(
  pathname: string,
  expectedLang: 'fr' | 'en' | 'nl',
  expectedText: string
): Promise<CheckResult[]> {
  const response = await fetchManual(pathname);
  const html = await response.text();
  const hasLang = new RegExp(`<html[^>]+lang=["']${expectedLang}["']`, 'i').test(html);
  const hasText = html.includes(expectedText);
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasAlternate = /<link[^>]+rel=["']alternate["']/i.test(html);

  return [
    {
      label: `${pathname} HTTP 200`,
      ok: response.status === 200,
      detail: `expected 200, got ${response.status}`,
    },
    {
      label: `${pathname} lang=${expectedLang}`,
      ok: hasLang,
      detail: `expected html lang ${expectedLang}`,
    },
    {
      label: `${pathname} localized body`,
      ok: hasText,
      detail: `expected body to contain "${expectedText}"`,
    },
    {
      label: `${pathname} canonical/hreflang`,
      ok: hasCanonical && hasAlternate,
      detail: `canonical=${hasCanonical}, alternate=${hasAlternate}`,
    },
  ];
}

async function expectRedirect(pathname: string, expectedStatus: number, expectedLocation: string) {
  const response = await fetchManual(pathname);
  const location = response.headers.get('location') ?? '';

  return {
    label: `${pathname} redirect`,
    ok: response.status === expectedStatus && location.endsWith(expectedLocation),
    detail: `expected ${expectedStatus} to ${expectedLocation}, got ${response.status} to ${location}`,
  };
}

async function main() {
  const checks: CheckResult[] = [];

  checks.push(...(await expectLocalizedNotFound('/en/route-inexistante', 'en', 'Page not found')));
  checks.push(...(await expectLocalizedNotFound('/route-inexistante', 'fr', 'Page non trouvée')));
  checks.push(
    ...(await expectLocalizedNotFound('/nl/route-inconnue', 'nl', 'Pagina niet gevonden'))
  );
  checks.push(await expectStatus('/en', 200));
  checks.push(await expectRedirect('/en/', 308, '/en'));
  checks.push(await expectStatus('/nl', 200));
  checks.push(await expectRedirect('/nl/', 308, '/nl'));

  for (const routeId of EN_INDEXABLE_ROUTE_IDS) {
    checks.push(await expectStatus(localizedRoutes[routeId].en, 200));
  }

  for (const routeId of NL_INDEXABLE_ROUTE_IDS) {
    const pathname = localizedRoutes[routeId].nl;
    checks.push(await expectStatus(pathname, 200));
    checks.push(
      ...(await expectLocalizedPage(pathname, 'nl', DUTCH_EXPECTED_TEXT_BY_ROUTE_ID[routeId]))
    );
  }

  const failures = checks.filter((check) => !check.ok);
  checks.forEach((check) => {
    const marker = check.ok ? 'OK' : 'FAIL';
    console.log(`${marker} ${check.label} - ${check.detail}`);
  });

  if (failures.length > 0) {
    throw new Error(`${failures.length} i18n release checks failed for ${baseUrl}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
