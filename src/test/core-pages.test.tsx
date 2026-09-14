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
    'makes comparison scroll areas keyboard accessible on %s',
    (pathname) => {
      const { container } = render(
        <MemoryRouter initialEntries={[pathname]}>
          <AppRoutes />
        </MemoryRouter>
      );
      const main = within(container).getByRole('main');
      const scrollAreas = within(main).getAllByRole('region');
      expect(scrollAreas).toHaveLength(2);
      scrollAreas.forEach((area) => {
        expect(area).toHaveAttribute('tabindex', '0');
        expect(area).toHaveAccessibleName();
        expect(within(area).getByRole('table')).toBeInTheDocument();
      });
    }
  );

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
});
