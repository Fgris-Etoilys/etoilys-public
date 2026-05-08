import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface VercelRewrite {
  source: string;
  destination: string;
}

interface VercelConfig {
  rewrites: VercelRewrite[];
}

function readRepoFile(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

describe('backend routing', () => {
  it('keeps Vite dev routing split between Supabase forms and the simulator backend', () => {
    const viteConfig = readRepoFile('vite.config.ts');

    expect(viteConfig).toContain('SUPABASE_FUNCTIONS_BASE_URL');
    expect(viteConfig).toContain('ETOILYS_SIMULATOR_API_BASE_URL');
    expect(viteConfig).toContain("'/api/public/forms/contact'");
    expect(viteConfig).toContain("'/api/public/forms/classement'");
    expect(viteConfig).toContain("'/api/public/simulations'");
    expect(viteConfig).toContain("path.replace(/^\\/api/, '')");
    expect(viteConfig).toContain("proxyReq.removeHeader('origin')");
  });

  it('keeps Vercel production rewrites split between Supabase forms and simulator routes', () => {
    const vercelConfig = JSON.parse(readRepoFile('vercel.json')) as VercelConfig;
    const rewrites = new Map(
      vercelConfig.rewrites.map((rewrite) => [rewrite.source, rewrite.destination])
    );

    expect(rewrites.get('/api/public/forms/contact')).toContain('supabase.co');
    expect(rewrites.get('/api/public/forms/classement')).toContain('supabase.co');
    expect(rewrites.get('/api/public/simulations')).toBe(
      'https://api-dev.etoilys.fr/public/simulations'
    );
    expect(rewrites.get('/api/public/simulations/:path*')).toBe(
      'https://api-dev.etoilys.fr/public/simulations/:path*'
    );
  });
});
