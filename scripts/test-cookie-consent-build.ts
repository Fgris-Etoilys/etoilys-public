import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { chromium, type Page } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4174;
const BASE_URL = `http://${HOST}:${PORT}`;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPreview(): Promise<void> {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await wait(250);
  }
  throw new Error('Vite preview did not become available in time.');
}

function startPreview(): ChildProcessWithoutNullStreams {
  return spawn(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      'preview',
      '--host',
      HOST,
      '--port',
      String(PORT),
      '--strictPort',
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, BROWSER: 'none' },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 1) {
    throw new Error(`Unexpected horizontal overflow: ${overflow}px.`);
  }
}

async function assertBannerVisible(page: Page): Promise<void> {
  const banner = page.getByRole('region', { name: /cookies|cookie/i });
  await banner.waitFor({ state: 'visible', timeout: 5_000 });
}

async function assertBannerDoesNotCoverSubmit(page: Page): Promise<void> {
  const bannerBox = await page.getByRole('region', { name: /cookies|cookie/i }).boundingBox();
  const submit = page.locator('button[type="submit"]').first();
  const submitBox = (await submit.count()) > 0 ? await submit.boundingBox() : null;

  if (!bannerBox || !submitBox) return;

  const overlaps =
    bannerBox.x < submitBox.x + submitBox.width &&
    bannerBox.x + bannerBox.width > submitBox.x &&
    bannerBox.y < submitBox.y + submitBox.height &&
    bannerBox.y + bannerBox.height > submitBox.y;

  if (overlaps) {
    throw new Error('Cookie banner overlaps a submit button.');
  }
}

async function runChecks(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    await context.addInitScript(() => {
      localStorage.setItem('etoilys_analytics_consent', 'accepted');
      localStorage.setItem('etoilys_analytics_consent_updated_at', String(Date.now()));
      localStorage.setItem('etoilys_advertising_consent', 'refused');
      localStorage.setItem('etoilys_advertising_consent_updated_at', String(Date.now()));
    });
    await context.route('**/*.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      await route.continue();
    });

    const hydratedPage = await context.newPage();
    await hydratedPage.goto(BASE_URL, { waitUntil: 'commit' });
    await hydratedPage.waitForTimeout(150);
    if (await hydratedPage.getByRole('region', { name: /cookies|cookie/i }).isVisible()) {
      throw new Error('Cookie banner flashed before hydration with stored consent.');
    }
    await hydratedPage.waitForLoadState('networkidle');
    if (await hydratedPage.getByRole('region', { name: /cookies|cookie/i }).isVisible()) {
      throw new Error('Cookie banner is visible after hydration with stored consent.');
    }
    await hydratedPage.reload({ waitUntil: 'networkidle' });
    if (await hydratedPage.getByRole('region', { name: /cookies|cookie/i }).isVisible()) {
      throw new Error('Cookie banner is visible after F5 with stored consent.');
    }
    await context.close();

    const viewports = [
      { width: 320, height: 720 },
      { width: 375, height: 812 },
      { width: 812, height: 375 },
    ];

    for (const viewport of viewports) {
      const viewportContext = await browser.newContext({ viewport });
      const page = await viewportContext.newPage();
      await page.goto(`${BASE_URL}/demande-classement`, { waitUntil: 'networkidle' });
      await assertBannerVisible(page);
      await assertNoHorizontalOverflow(page);
      await assertBannerDoesNotCoverSubmit(page);
      await viewportContext.close();
    }

    const zoomContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const zoomPage = await zoomContext.newPage();
    await zoomPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await zoomPage.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    await assertBannerVisible(zoomPage);
    await assertNoHorizontalOverflow(zoomPage);
    await zoomContext.close();
  } finally {
    await browser.close();
  }
}

const preview = startPreview();
preview.stdout.on('data', (chunk) => process.stdout.write(chunk));
preview.stderr.on('data', (chunk) => process.stderr.write(chunk));

try {
  await waitForPreview();
  await runChecks();
} finally {
  preview.kill();
}
