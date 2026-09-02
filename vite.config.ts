import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeEtoilysApiBaseUrl = (value: string) => {
  const strippedValue = stripTrailingSlash(value);
  if (strippedValue === 'http://api-dev.etoilys.fr') {
    return 'https://api-dev.etoilys.fr';
  }
  return strippedValue;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const etoilysApiBaseUrl = normalizeEtoilysApiBaseUrl(
    env.ETOILYS_API_BASE_URL || env.ETOILYS_SIMULATOR_API_BASE_URL || 'https://api-dev.etoilys.fr'
  );

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/public/forms/contact': {
          target: etoilysApiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/public/forms/classement': {
          target: etoilysApiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/public/simulations': {
          target: etoilysApiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
      },
    },
  };
});
