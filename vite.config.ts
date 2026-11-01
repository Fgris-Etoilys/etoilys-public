import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeEtoilysApiBaseUrl = (value: string) => {
  const strippedValue = stripTrailingSlash(value);
  if (strippedValue === 'http://api-dev.etoilys.fr') {
    return 'https://api-dev.etoilys.fr';
  }
  return strippedValue;
};

const createPublicApiProxy = (target: string): ProxyOptions => ({
  target,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api(?=\/|$)/, ''),
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.removeHeader('origin');
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const etoilysApiBaseUrl = normalizeEtoilysApiBaseUrl(
    env.ETOILYS_API_BASE_URL || 'https://api-dev.etoilys.fr'
  );

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/public/forms/contact': createPublicApiProxy(etoilysApiBaseUrl),
        '/api/public/forms/classement': createPublicApiProxy(etoilysApiBaseUrl),
        '/api/public/simulations': createPublicApiProxy(etoilysApiBaseUrl),
        '/api/public/communes': createPublicApiProxy(etoilysApiBaseUrl),
      },
    },
  };
});
