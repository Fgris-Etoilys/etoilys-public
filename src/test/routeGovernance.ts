import { readFileSync } from 'node:fs';
import path from 'node:path';

export function normalizeGovernancePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

export function extractActiveAppPaths(): string[] {
  const appSource = readFileSync(path.resolve(process.cwd(), 'src', 'AppRoutes.tsx'), 'utf8');
  const noLineComments = appSource.replace(/\/\/.*$/gm, '');
  const noBlockComments = noLineComments.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const matches = [...noBlockComments.matchAll(/<Route\s+path="([^"]+)"/g)];
  const paths = matches
    .map((match) => match[1])
    .filter((routePath): routePath is string => routePath !== undefined)
    .filter((routePath) => routePath !== '*')
    .map((routePath) =>
      normalizeGovernancePath(routePath.startsWith('/') ? routePath : `/${routePath}`)
    );

  return ['/'].concat(paths);
}
