import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import { IMAGE_MANIFEST } from '../../content/imageManifest';
import { getCanonicalUrl, getSeoRouteConfig, getSeoTitle } from '../../content/seoRoutes';
import { trackCtaClick } from '../../utils/analytics';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

const DORDOGNE_PATH = '/classement-meuble-tourisme-dordogne';

afterEach(() => {
  cleanup();
  vi.mocked(trackCtaClick).mockClear();
  window.history.replaceState({}, '', '/');
});

function expectSingleLayoutAndSeo(path: string) {
  expect(document.querySelectorAll('header.site-header')).toHaveLength(1);
  expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(document.querySelector('header.site-header')).toHaveClass('fixed');
  expect(screen.getByRole('contentinfo')).toHaveClass('site-footer');
  expect(document.querySelector('.dordogne-shell')).toBeNull();
  expect(document.querySelector('.dd-landing')).toBeNull();
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

describe('Shared site layout', () => {
  it.each([DORDOGNE_PATH, `${DORDOGNE_PATH}/`])(
    'keeps a single shared layout and central SEO at %s and after navigation',
    async (path) => {
      window.history.replaceState({}, '', path);
      render(<App />);
      expectSingleLayoutAndSeo(path);
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
      const sizes = getSeoRouteConfig(path).lcpImageSizes;
      const heroAsset = IMAGE_MANIFEST.dordogneLaRoqueGageac;
      expect(document.querySelector('.editorial-hero-media-photo img')).toHaveAttribute(
        'src',
        heroAsset.src
      );
      expect(document.querySelector('link[data-seo-lcp-preload]')).toHaveAttribute(
        'href',
        heroAsset.src
      );
      expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
        'content',
        `https://www.etoilys.fr${heroAsset.src}`
      );
      const sectionIds = Array.from(document.querySelectorAll('.local-v6-landing > section'))
        .map((section) => section.getAttribute('aria-labelledby'))
        .filter(Boolean);
      expect(sectionIds).toEqual([
        'local-v6-benefits-title',
        'local-v6-service-area-title',
        'local-v6-pricing-title',
        'local-v6-process-title',
        'local-v6-expertise-title',
        'local-v6-territorial-title',
        'local-v6-faq-title',
      ]);
      expect(
        document.querySelector('.editorial-hero-media-photo source[type="image/avif"]')
      ).toHaveAttribute('sizes', sizes);
      expect(document.querySelector('link[data-seo-lcp-preload]')).toHaveAttribute(
        'imagesizes',
        sizes
      );
      expect(document.querySelectorAll('link[hreflang]')).toHaveLength(0);
      expect(screen.getByRole('button', { name: /^Le classement$/ })).toBeInTheDocument();
      expect(document.querySelectorAll('.editorial-eyebrow-marked')).toHaveLength(1);
      const proofValue = document.querySelector('.editorial-proof-value');
      expect(proofValue).toHaveTextContent('5');
      expect(proofValue).not.toHaveAttribute('aria-hidden');
      const main = screen.getByRole('main');
      const conversionLinks = within(main).getAllByRole('link', {
        name: /Demander mon classement/i,
      });
      const heroCta = conversionLinks[0];
      const finalCta = conversionLinks[conversionLinks.length - 1];
      if (!heroCta || !finalCta) throw new Error('Missing Dordogne conversion links');
      expect(heroCta).toHaveClass('bg-ink', 'text-white', 'hover:text-white');
      heroCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());
      finalCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());
      fireEvent.click(heroCta);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: 'cta_primary_demande_classement',
        destinationPath: '/demande-classement',
      });
      fireEvent.click(finalCta);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: 'cta_primary_demande_classement',
        destinationPath: '/demande-classement',
      });
      const faqButtons = Array.from(
        document.querySelectorAll('.local-v6-faq button[aria-expanded]')
      );
      expect(faqButtons.length).toBeGreaterThan(1);
      const [firstFaqButton, secondFaqButton] = faqButtons;
      if (!firstFaqButton || !secondFaqButton) throw new Error('Missing shared FAQ buttons');
      fireEvent.click(firstFaqButton);
      expect(firstFaqButton).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(secondFaqButton);
      expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondFaqButton).toHaveAttribute('aria-expanded', 'true');

      const contactLink = screen.getByRole('contentinfo').querySelector('a[href="/contact"]');
      if (!contactLink) throw new Error('The local footer must provide the contact route');
      fireEvent.click(contactLink);
      await waitFor(() => expect(window.location.pathname).toBe('/contact'));
      expectSingleLayoutAndSeo('/contact');
      expect(document.querySelector('link[data-seo-lcp-preload]')).toBeNull();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
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
