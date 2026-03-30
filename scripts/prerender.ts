import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { getPrerenderPaths } from '../src/content/seoRoutes.ts';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PRERENDER_PORT ?? 4173);
const BASE_URL = `http://${HOST}:${PORT}`;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServerReady(timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting for server startup.
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for Vite preview on ${BASE_URL}`);
}

function startPreviewServer(): ChildProcessWithoutNullStreams {
  const viteBin = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(
    process.execPath,
    [viteBin, 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: 'pipe',
    }
  );

  child.stdout.on('data', (data) => process.stdout.write(data));
  child.stderr.on('data', (data) => process.stderr.write(data));

  return child;
}

function resolveOutputPath(distDir: string, routePath: string): string {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }

  const trimmed = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, trimmed, 'index.html');
}

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const routes = getPrerenderPaths();
  const previewProcess = startPreviewServer();

  try {
    await waitForServerReady();

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const routePath of routes) {
      const url = `${BASE_URL}${routePath}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(300);

      let html = await page.content();
      if (!html.toLowerCase().startsWith('<!doctype html>')) {
        html = `<!DOCTYPE html>\n${html}`;
      }

      const outputPath = resolveOutputPath(distDir, routePath);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, 'utf8');
      console.log(`Prerendered: ${routePath} -> ${outputPath}`);
    }

    await browser.close();
  } finally {
    previewProcess.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
