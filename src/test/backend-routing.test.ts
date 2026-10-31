// @vitest-environment node
import { EventEmitter } from 'node:events';
import type { ClientRequest } from 'node:http';
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

const vercelApiPaths = [
  '/public/forms/contact',
  '/public/forms/classement',
  '/public/simulations',
  '/public/simulations/:path*',
  '/public/communes',
  '/public/communes/:codeInsee',
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
    const config = await getVercelConfig(environment);
    const apiRewrites = config.rewrites.filter(({ source }) => source.startsWith('/api'));

    expect(apiRewrites).toEqual(
      vercelApiPaths.map((path) => ({ source: `/api${path}`, destination: `${origin}${path}` }))
    );
    expect(config.rewrites).toHaveLength(vercelApiPaths.length + 1);
    expect(config.rewrites).toContainEqual({
      source: '/simulateur/:simulationId',
      destination: '/simulation-noindex.html',
    });
  });

  it.each([undefined, '', 'unknown'])('rejects VERCEL_ENV=%s at load time', async (environment) => {
    await expect(getVercelConfig(environment)).rejects.toThrow(/VERCEL_ENV/);
  });

  it('keeps the SEO build settings and security headers', async () => {
    const config = await getVercelConfig('production');

    expect(config).toMatchObject({
      buildCommand: 'npm run build:seo',
      outputDirectory: 'dist',
      trailingSlash: false,
    });
    expect(config.headers).toEqual([
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      {
        source: '/documents/clients/(.*)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/email-signatures/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, noimageindex, nosnippet, noarchive' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]);
  });
});
