import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { getCanonicalUrl, getSeoRouteConfig, getSeoTitle } from '../../content/seoRoutes';

const DORDOGNE_PATH = '/classement-meuble-tourisme-dordogne';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

function expectSingleLayoutAndSeo(path: string, local: boolean) {
  expect(screen.getAllByRole('banner')).toHaveLength(1);
  expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('banner')).toHaveClass('fixed');
  expect(screen.getByRole('contentinfo').classList.contains('dd-footer')).toBe(local);
  expect(document.querySelector('.dordogne-shell') !== null).toBe(local);
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    'href',
    getCanonicalUrl(path)
  );
  expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
    'content',
    getSeoRouteConfig(path).description
  );
  expect(document.title).toBe(getSeoTitle(getSeoRouteConfig(path).title));
  expect(document.querySelectorAll('#structured-data-global')).toHaveLength(1);
  expect(document.querySelectorAll('#structured-data-breadcrumbs')).toHaveLength(1);
}

describe('Dordogne layout isolation', () => {
  it.each([DORDOGNE_PATH, `${DORDOGNE_PATH}/`])(
    'keeps a single local layout and central SEO at %s, then restores the default layout on navigation',
    async (path) => {
      window.history.replaceState({}, '', path);
      render(<App />);
      expectSingleLayoutAndSeo(path, true);
      expect(screen.getByRole('main')).toHaveAttribute('id', 'dordogne-content');
      const sizes = getSeoRouteConfig(path).lcpImageSizes;
      const heroAsset = IMAGE_MANIFEST.dordogneLaRoqueGageac;
      expect(document.querySelector('.dd-hero-photo img')).toHaveAttribute('src', heroAsset.src);
      expect(document.querySelector('link[data-seo-lcp-preload]')).toHaveAttribute(
        'href',
        heroAsset.src
      );
      expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
        'content',
        `https://www.etoilys.fr${heroAsset.src}`
      );
      const sectionIds = Array.from(document.querySelectorAll('.dd-landing > section')).map(
        (section) => section.getAttribute('aria-labelledby')
      );
      const tariffIndex = sectionIds.indexOf('dd-tariff-title');
      expect(sectionIds.slice(tariffIndex, tariffIndex + 4)).toEqual([
        'dd-tariff-title',
        'dd-process-title',
        'dd-expertise-title',
        'dd-faq-title',
      ]);
      expect(document.querySelector('.dd-hero-photo source[type="image/avif"]')).toHaveAttribute(
        'sizes',
        sizes
      );
      expect(document.querySelector('link[data-seo-lcp-preload]')).toHaveAttribute(
        'imagesizes',
        sizes
      );
      expect(document.querySelectorAll('link[hreflang]')).toHaveLength(0);
      expect(screen.getByRole('button', { name: /^Le classement$/ })).toBeInTheDocument();

      const contactLink = screen.getByRole('contentinfo').querySelector('a[href="/contact"]');
      if (!contactLink) throw new Error('The local footer must provide the contact route');
      fireEvent.click(contactLink);
      await waitFor(() => expect(window.location.pathname).toBe('/contact'));
      expectSingleLayoutAndSeo('/contact', false);
      expect(document.querySelector('link[data-seo-lcp-preload]')).toBeNull();
      expect(screen.getByRole('main')).not.toHaveAttribute('id', 'dordogne-content');
    }
  );

  it('does not apply the local layout to a path that only starts with the Dordogne route', () => {
    window.history.replaceState({}, '', `${DORDOGNE_PATH}-other`);
    render(<App />);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    expect(document.querySelector('.dordogne-shell')).toBeNull();
    expect(document.querySelector('.dd-header')).toBeNull();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,follow'
    );
  });
});
