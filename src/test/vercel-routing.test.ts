import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { EN_MVP_PATHS } from './i18nMvpTestData';

interface VercelRoute {
  src: string;
  dest?: string;
  status?: number;
}

interface VercelConfig {
  routes?: VercelRoute[];
  trailingSlash?: boolean;
}

const readVercelConfig = (): VercelConfig =>
  JSON.parse(readFileSync(path.resolve(process.cwd(), 'vercel.json'), 'utf8')) as VercelConfig;

const routeSourceToRegExp = (source: string): RegExp => new RegExp(`^${source}$`);

describe('Vercel i18n routing', () => {
  it('serves unknown /en paths with the localized 404 HTML and a real 404 status', () => {
    const config = readVercelConfig();
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
});
