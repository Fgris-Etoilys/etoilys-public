import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EN_MVP_PATHS, NL_MVP_PATHS } from './i18nMvpTestData';

const readVercelConfig = async () => (await import('../../vercel')).config;

const routeSourceToRegExp = (source: string): RegExp => new RegExp(`^${source}$`);

describe('Vercel i18n routing', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VERCEL_ENV', 'production');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('serves unknown /en paths with the localized 404 HTML and a real 404 status', async () => {
    const config = await readVercelConfig();
    const englishNotFoundRoute = config.routes?.find((route) => route.dest === '/en/404.html');

    expect(config.trailingSlash).toBe(false);
    expect(englishNotFoundRoute).toMatchObject({
      dest: '/en/404.html',
      status: 404,
    });

    const matcher = routeSourceToRegExp(englishNotFoundRoute?.src ?? '');

    expect(matcher.test('/en/route-inexistante')).toBe(true);
    expect(matcher.test('/en/actualites')).toBe(true);
    expect(matcher.test('/en')).toBe(false);
    expect(matcher.test('/en/')).toBe(false);
    expect(matcher.test('/api/public/forms/contact')).toBe(false);
    expect(matcher.test('/assets/index.js')).toBe(false);

    EN_MVP_PATHS.forEach((pathname) => {
      expect(matcher.test(pathname)).toBe(false);
      expect(matcher.test(`${pathname}/`)).toBe(false);
    });
  });

  it('serves unknown /nl paths with the localized 404 HTML and a real 404 status', async () => {
    const config = await readVercelConfig();
    const dutchNotFoundRoute = config.routes?.find((route) => route.dest === '/nl/404.html');

    expect(config.trailingSlash).toBe(false);
    expect(dutchNotFoundRoute).toMatchObject({
      dest: '/nl/404.html',
      status: 404,
    });

    const matcher = routeSourceToRegExp(dutchNotFoundRoute?.src ?? '');

    expect(matcher.test('/nl/route-inconnue')).toBe(true);
    expect(matcher.test('/nl/actualites')).toBe(true);
    expect(matcher.test('/nl')).toBe(false);
    expect(matcher.test('/nl/')).toBe(false);
    expect(matcher.test('/api/public/forms/contact')).toBe(false);
    expect(matcher.test('/assets/index.js')).toBe(false);

    NL_MVP_PATHS.forEach((pathname) => {
      expect(matcher.test(pathname)).toBe(false);
      expect(matcher.test(`${pathname}/`)).toBe(false);
    });
  });
});
