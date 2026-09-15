import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import AppRoutes from '../AppRoutes';
import { localizedRoutes } from '../i18n/localizedRoutes';
import { trackCtaClick } from '../utils/analytics';

vi.mock('../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

afterEach(cleanup);

describe('core pages', () => {
  const paths = ['home', 'classement', 'avantages', 'prerequis', 'procedure', 'faq'] as const;

  it.each(paths.flatMap((id) => Object.values(localizedRoutes[id])))(
    'keeps one H1 and localized conversion links on %s',
    (pathname) => {
      const { container } = render(
        <MemoryRouter initialEntries={[pathname]}>
          <AppRoutes />
        </MemoryRouter>
      );
      const main = within(container).getByRole('main');
      expect(within(main).getAllByRole('heading', { level: 1 })).toHaveLength(1);
      const locale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/nl') ? 'nl' : 'fr';
      expect(
        main.querySelector(`a[href="${localizedRoutes.demandeClassement[locale]}"]`)
      ).not.toBeNull();
    }
  );

  it.each(Object.values(localizedRoutes.avantages))(
    'provides labelled mobile comparisons and semantic desktop tables on %s',
    (pathname) => {
      const { container } = render(
        <MemoryRouter initialEntries={[pathname]}>
          <AppRoutes />
        </MemoryRouter>
      );
      const main = within(container).getByRole('main');
      const desktop = main.querySelectorAll('[data-responsive-comparison-variant="desktop"]');
      expect(desktop).toHaveLength(2);
      desktop.forEach((area) => {
        const table = within(area as HTMLElement).getByRole('table');
        expect(table).toHaveAccessibleName();
        expect(table.querySelector('colgroup')).not.toBeNull();
        const rows = table.querySelectorAll('tbody tr');
        const cards = area.parentElement?.querySelectorAll(
          '[data-responsive-comparison-variant="mobile"] article'
        );
        expect(cards).toHaveLength(rows.length);
        rows.forEach((row, index) => {
          expect(row.querySelector('th')).toHaveAttribute('scope', 'row');
          const card = cards?.[index];
          expect(card).toBeTruthy();
          row.querySelectorAll('th, td').forEach((cell) => {
            expect(card?.textContent).toContain(cell.textContent);
          });
        });
      });
    }
  );

  it.each(
    (['avantages', 'prerequis', 'faq'] as const).flatMap((id) => Object.values(localizedRoutes[id]))
  )('connects each section link to a unique target on %s', (pathname) => {
    const { container } = render(
      <MemoryRouter initialEntries={[pathname]}>
        <AppRoutes />
      </MemoryRouter>
    );
    const main = within(container).getByRole('main');
    const links = main.querySelectorAll('nav a[href^="#"]');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      const id = link.getAttribute('href')?.slice(1);
      expect(main.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
    });
  });

  it.each([
    [
      '/',
      '/demande-classement',
      'cta_primary_demande_classement',
      'cta_secondary_demande_classement',
    ],
    [
      '/en',
      '/en/request-a-classification',
      'cta_primary_en_request_a_classification',
      'cta_secondary_en_request_a_classification',
    ],
    [
      '/nl',
      '/nl/classificatie-aanvragen',
      'cta_primary_nl_classificatie_aanvragen',
      'cta_secondary_nl_classificatie_aanvragen',
    ],
  ])(
    'preserves the hero and final CTA analytics on %s',
    (pathname, destination, heroId, finalId) => {
      const { container } = render(
        <MemoryRouter initialEntries={[pathname]}>
          <Home />
        </MemoryRouter>
      );
      const hero = container.querySelector('section:first-child');
      const final = container.querySelector('section:last-child');
      const heroLink = hero?.querySelector(`a[href="${destination}"]`);
      const finalLink = final?.querySelector(`a[href="${destination}"]`);
      expect(heroLink).toBeTruthy();
      expect(finalLink).toBeTruthy();
      if (!heroLink || !finalLink) throw new Error('Missing conversion link');
      fireEvent.click(heroLink);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: heroId,
        destinationPath: destination,
      });
      fireEvent.click(finalLink);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: finalId,
        destinationPath: destination,
      });
    }
  );

  it.each([
    ['/', '/les-avantages-du-classement#reconnaissance'],
    ['/en', '/en/benefits-of-furnished-tourist-accommodation-classification#reconnaissance'],
    ['/nl', '/nl/voordelen-classificatie-vakantiewoning#reconnaissance'],
  ])('links Home feature cards to the recognition anchor on %s', (pathname, href) => {
    const { container } = render(
      <MemoryRouter initialEntries={[pathname]}>
        <AppRoutes />
      </MemoryRouter>
    );
    const link = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
    expect(link).not.toBeNull();
    if (!link) throw new Error('Missing recognition link');

    fireEvent.click(link);

    expect(container.querySelector('#reconnaissance')).not.toBeNull();
  });
});
