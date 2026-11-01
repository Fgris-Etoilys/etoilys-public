import { getTransformedRoutes } from '@vercel/routing-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EN_MVP_PATHS, NL_MVP_PATHS } from './i18nMvpTestData';

const readCompiledVercelRoutes = async () => {
  const config = (await import('../../vercel')).config;
  const compiled = getTransformedRoutes(config);
  expect(compiled.error).toBeNull();
  if (!compiled.routes) throw new Error('Expected compiled Vercel routes');
  return compiled.routes;
};

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
    const routes = await readCompiledVercelRoutes();
    const englishNotFoundRoute = routes.find((route) => route.dest === '/en/404.html');

    expect(englishNotFoundRoute).toMatchObject({
      dest: '/en/404.html',
      status: 404,
    });

    const matcher = new RegExp(englishNotFoundRoute?.src ?? '');

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
    const routes = await readCompiledVercelRoutes();
    const dutchNotFoundRoute = routes.find((route) => route.dest === '/nl/404.html');

    expect(dutchNotFoundRoute).toMatchObject({
      dest: '/nl/404.html',
      status: 404,
    });

    const matcher = new RegExp(dutchNotFoundRoute?.src ?? '');

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
