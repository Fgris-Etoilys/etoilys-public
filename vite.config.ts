import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeSimulatorApiBaseUrl = (value: string) => {
  const strippedValue = stripTrailingSlash(value);
  if (strippedValue === 'http://api-dev.etoilys.fr') {
    return 'https://api-dev.etoilys.fr';
  }
  return strippedValue;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const functionsBaseUrl = stripTrailingSlash(
    env.SUPABASE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:54321/functions/v1'
  );
  const simulatorApiBaseUrl = normalizeSimulatorApiBaseUrl(
    env.ETOILYS_SIMULATOR_API_BASE_URL || 'https://api-dev.etoilys.fr'
  );

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/public/forms/contact': {
          target: functionsBaseUrl,
          changeOrigin: true,
          rewrite: () => '/public-forms-contact',
        },
        '/api/public/forms/classement': {
          target: functionsBaseUrl,
          changeOrigin: true,
          rewrite: () => '/public-forms-classement',
        },
        '/api/public/simulations': {
          target: simulatorApiBaseUrl,
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
