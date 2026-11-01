// @vitest-environment node
import { EventEmitter } from 'node:events';
import type { ClientRequest } from 'node:http';
import { getTransformedRoutes, isHandler } from '@vercel/routing-utils';
import { loadEnv, type ProxyOptions } from 'vite';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import viteConfig from '../../vite.config';

vi.mock(import('vite'), async (importOriginal) => ({
  ...(await importOriginal()),
  loadEnv: vi.fn<typeof loadEnv>(),
}));

const localApiSources = [
  '/api/public/forms/contact',
  '/api/public/forms/classement',
  '/api/public/simulations',
  '/api/public/communes',
];

const vercelApiRoutes = [
  { src: '^/api/public/forms/contact$', path: '/public/forms/contact' },
  { src: '^/api/public/forms/classement$', path: '/public/forms/classement' },
  { src: '^/api/public/simulations$', path: '/public/simulations' },
  { src: '^/api/public/simulations/(.*)$', path: '/public/simulations/$1' },
  { src: '^/api/public/communes$', path: '/public/communes' },
  { src: '^/api/public/communes/([^/]+)$', path: '/public/communes/$1' },
];

async function getViteProxies(env: Record<string, string> = {}) {
  vi.mocked(loadEnv).mockReturnValue(env);
  const config = await viteConfig({ mode: 'development', command: 'serve' });
  const proxies = config.server?.proxy;
  if (!proxies) throw new Error('Expected Vite API proxies');
  return proxies;
}

function getProxyOptions(
  proxies: Record<string, string | ProxyOptions>,
  source: string
): ProxyOptions {
  const options = proxies[source];
  if (!options || typeof options === 'string') {
    throw new Error(`Expected proxy options for ${source}`);
  }
  return options;
}

async function getVercelConfig(environment: string | undefined) {
  vi.stubEnv('VERCEL_ENV', environment);
  return (await import('../../vercel')).config;
}

async function getCompiledVercelConfig(environment: string) {
  const config = await getVercelConfig(environment);
  const compiled = getTransformedRoutes(config);
  expect(compiled.error).toBeNull();
  if (!compiled.routes) throw new Error('Expected compiled Vercel routes');
  const routes = compiled.routes.map((route) => {
    if (isHandler(route)) throw new Error('Expected a route with a source pattern');
    return route;
  });
  return { config, routes };
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.mocked(loadEnv).mockReset();
});

describe('Vite local backend routing', () => {
  it.each<{ name: string; env: Record<string, string>; target: string }>([
    { name: 'staging by default', env: {}, target: 'https://api-dev.etoilys.fr' },
    {
      name: 'the common API override',
      env: { ETOILYS_API_BASE_URL: 'http://localhost:3000' },
      target: 'http://localhost:3000',
    },
    {
      name: 'the common API override without trailing slashes',
      env: { ETOILYS_API_BASE_URL: 'https://api.example.test///' },
      target: 'https://api.example.test',
    },
    {
      name: 'HTTPS for the staging API',
      env: { ETOILYS_API_BASE_URL: 'http://api-dev.etoilys.fr///' },
      target: 'https://api-dev.etoilys.fr',
    },
    {
      name: 'staging when only the obsolete simulator variable is set',
      env: { ETOILYS_SIMULATOR_API_BASE_URL: 'https://obsolete.example.test' },
      target: 'https://api-dev.etoilys.fr',
    },
  ])('routes all four explicit API families to $name', async ({ env, target }) => {
    const proxies = await getViteProxies(env);

    expect(Object.keys(proxies)).toEqual(localApiSources);
    for (const source of localApiSources) {
      expect(getProxyOptions(proxies, source)).toMatchObject({
        target,
        changeOrigin: true,
      });
    }
  });

  it.each([
    {
      source: '/api/public/forms/contact',
      path: '/api/public/forms/contact?lang=en',
      destination: '/public/forms/contact?lang=en',
    },
    {
      source: '/api/public/forms/classement',
      path: '/api/public/forms/classement?lang=nl',
      destination: '/public/forms/classement?lang=nl',
    },
    {
      source: '/api/public/simulations',
      path: '/api/public/simulations/simulation-id/answers?redirect=%2Fapi',
      destination: '/public/simulations/simulation-id/answers?redirect=%2Fapi',
    },
    {
      source: '/api/public/communes',
      path: '/api/public/communes?codePostal=33000',
      destination: '/public/communes?codePostal=33000',
    },
    {
      source: '/api/public/communes',
      path: '/api/public/communes/33063',
      destination: '/public/communes/33063',
    },
  ])('preserves the path and query after /api for $path', async ({ source, path, destination }) => {
    const proxies = await getViteProxies();
    const options = getProxyOptions(proxies, source);

    expect(options.rewrite?.(path)).toBe(destination);
  });

  it.each(localApiSources)('removes Origin on outgoing requests for %s', async (source) => {
    const proxies = await getViteProxies();
    const options = getProxyOptions(proxies, source);
    const proxy = new EventEmitter<{ proxyReq: [Pick<ClientRequest, 'removeHeader'>] }>();
    const removeHeader = vi.fn<ClientRequest['removeHeader']>();
    type ConfiguredProxy = Parameters<NonNullable<ProxyOptions['configure']>>[0];

    // The hook only registers an event listener; no HTTP server or request is needed.
    options.configure?.(proxy as ConfiguredProxy, options);

    expect(proxy.listenerCount('proxyReq')).toBe(1);
    proxy.emit('proxyReq', { removeHeader });
    expect(removeHeader).toHaveBeenCalledExactlyOnceWith('origin');
  });
});

describe('Vercel backend routing', () => {
  it.each([
    { environment: 'production', origin: 'https://api-prod.etoilys.fr' },
    { environment: 'preview', origin: 'https://api-dev.etoilys.fr' },
    { environment: 'development', origin: 'https://api-dev.etoilys.fr' },
  ])('isolates all public APIs in $environment', async ({ environment, origin }) => {
    const { routes } = await getCompiledVercelConfig(environment);
    const apiRoutes = routes.filter(({ dest }) => dest?.startsWith('https://'));

    expect(apiRoutes).toEqual(
      vercelApiRoutes.map(({ src, path }) => ({ src, dest: `${origin}${path}` }))
    );
    expect(routes).toContainEqual({
      src: '^/simulateur/([^/]+)$',
      dest: '/simulation-noindex.html',
    });
  });

  it.each([undefined, '', 'unknown'])('rejects VERCEL_ENV=%s at load time', async (environment) => {
    await expect(getVercelConfig(environment)).rejects.toThrow(/VERCEL_ENV/);
  });

  it('uses only the legacy routes schema accepted by the Vercel compiler', async () => {
    const { config, routes } = await getCompiledVercelConfig('production');

    // getTransformedRoutes normalizes routes but does not reject mixed routing formats.
    for (const property of ['rewrites', 'headers', 'redirects', 'cleanUrls', 'trailingSlash']) {
      expect(config).not.toHaveProperty(property);
    }
    expect(routes).toHaveLength(13);
    for (const route of config.routes) {
      expect(route).toHaveProperty('src');
      expect(route).not.toHaveProperty('source');
      expect(route).not.toHaveProperty('destination');
      expect(route).not.toHaveProperty('statusCode');
    }
  });

  it('keeps the SEO build settings and applies every header before terminal routes', async () => {
    const { config, routes } = await getCompiledVercelConfig('production');

    expect(config).toMatchObject({
      buildCommand: 'npm run build:seo',
      outputDirectory: 'dist',
    });
    expect(routes.slice(0, 3)).toEqual([
      {
        src: '^/(.*)$',
        headers: {
          'Strict-Transport-Security': 'max-age=31536000',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        },
        continue: true,
      },
      {
        src: '^/documents/clients/(.*)$',
        headers: { 'X-Robots-Tag': 'noindex' },
        continue: true,
      },
      {
        src: '^/email-signatures/(.*)$',
        headers: {
          'X-Robots-Tag': 'noindex, noimageindex, nosnippet, noarchive',
          'Cache-Control': 'public, max-age=86400',
        },
        continue: true,
      },
    ]);
    expect(routes.slice(3).every((route) => route.continue !== true)).toBe(true);
  });

  it('removes trailing slashes with a permanent redirect before 404s and rewrites', async () => {
    const { routes } = await getCompiledVercelConfig('production');
    const redirect = routes[3];
    if (!redirect) throw new Error('Expected trailing slash redirect');

    expect(redirect).toEqual({
      src: '^/(.*)/$',
      headers: { Location: '/$1' },
      status: 308,
    });
    const matcher = new RegExp(redirect.src);
    for (const pathname of ['/en/contact/', '/en/unknown/', '/api/public/simulations/id/']) {
      expect(matcher.test(pathname)).toBe(true);
      expect(pathname.replace(matcher, redirect.headers?.Location ?? '')).toBe(
        pathname.slice(0, -1)
      );
    }
    expect(matcher.test('/')).toBe(false);
    expect(matcher.test('/en/contact')).toBe(false);
  });

  it.each([
    ['/api/public/forms/contact', '/public/forms/contact'],
    ['/api/public/forms/classement', '/public/forms/classement'],
    ['/api/public/simulations', '/public/simulations'],
    ['/api/public/simulations/simulation-id/answers', '/public/simulations/simulation-id/answers'],
    ['/api/public/communes', '/public/communes'],
    ['/api/public/communes/33063', '/public/communes/33063'],
  ])('preserves the backend path for %s', async (pathname, destinationPath) => {
    const { routes } = await getCompiledVercelConfig('preview');
    const matches = routes.filter(
      ({ src, dest }) => dest?.startsWith('https://') && new RegExp(src).test(pathname)
    );

    expect(matches).toHaveLength(1);
    const [route] = matches;
    if (!route?.dest) throw new Error('Expected matching API destination');
    expect(pathname.replace(new RegExp(route.src), route.dest)).toBe(
      `https://api-dev.etoilys.fr${destinationPath}`
    );
  });

  it.each([
    '/api/private',
    '/api/public/forms/contact/extra',
    '/api/public/forms/classement-extra',
    '/api/public/simulations-extra',
    '/api/public/communes-extra',
    '/api/public/communes/33063/extra',
  ])('does not introduce a generic API proxy for %s', async (pathname) => {
    const { routes } = await getCompiledVercelConfig('preview');
    expect(
      routes.some(({ src, dest }) => dest?.startsWith('https://') && new RegExp(src).test(pathname))
    ).toBe(false);
  });

  it('rewrites only a single nonempty simulator identifier to its dedicated HTML', async () => {
    const { routes } = await getCompiledVercelConfig('preview');
    const simulator = routes.find(({ dest }) => dest === '/simulation-noindex.html');
    expect(simulator).toBeDefined();
    const matcher = new RegExp(simulator?.src ?? '');

    expect('/simulateur/simulation-id'.replace(matcher, simulator?.dest ?? '')).toBe(
      '/simulation-noindex.html'
    );
    for (const pathname of ['/simulateur', '/simulateur/', '/simulateur/id/answers']) {
      expect(matcher.test(pathname)).toBe(false);
    }
  });
});
