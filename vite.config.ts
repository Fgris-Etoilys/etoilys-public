import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const functionsBaseUrl = stripTrailingSlash(
    env.SUPABASE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:54321/functions/v1'
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
      },
    },
  };
});
