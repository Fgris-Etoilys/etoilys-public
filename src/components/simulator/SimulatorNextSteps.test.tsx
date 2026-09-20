import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { simulatorNextStepsContent } from '../../i18n/simulatorContent';
import { trackCtaClick } from '../../utils/analytics';
import SimulatorNextSteps from './SimulatorNextSteps';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

describe('SimulatorNextSteps', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it.each([
    [
      'fr',
      'fiscal',
      '/demande-classement',
      '/simulateur-taxe-sejour',
      'cta_primary_simulateur_taxe_sejour',
    ],
    [
      'fr',
      'tourist-tax',
      '/demande-classement',
      '/simulateur-fiscal-classement',
      'cta_primary_simulateur_fiscal_classement',
    ],
    [
      'en',
      'fiscal',
      '/en/request-a-classification',
      '/en/tourist-tax-simulator',
      'cta_primary_en_tourist_tax_simulator',
    ],
    [
      'en',
      'tourist-tax',
      '/en/request-a-classification',
      '/en/furnished-tourist-accommodation-tax-simulator',
      'cta_primary_en_furnished_tourist_accommodation_tax_simulator',
    ],
  ] as const)(
    'keeps localized destinations and analytics for %s / %s',
    (locale, currentSimulator, classificationHref, otherHref, otherAnalyticsId) => {
      const content = simulatorNextStepsContent[locale];
      render(
        <MemoryRouter>
          <SimulatorNextSteps locale={locale} currentSimulator={currentSimulator} />
        </MemoryRouter>
      );

      const panel = screen.getByRole('region', { name: content.title });
      const links = within(panel).getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAccessibleName(content.classificationLabel);
      expect(links[0]).toHaveAttribute('href', classificationHref);
      expect(links[1]).toHaveAccessibleName(content.otherSimulatorLabel[currentSimulator]);
      expect(links[1]).toHaveAttribute('href', otherHref);

      const classification = links[0];
      const otherSimulator = links[1];
      if (!classification || !otherSimulator) throw new Error('Missing simulator next-step links');
      fireEvent.click(classification);
      fireEvent.click(otherSimulator);
      expect(trackCtaClick).toHaveBeenNthCalledWith(1, {
        ctaId:
          locale === 'fr'
            ? 'cta_secondary_demande_classement'
            : 'cta_secondary_en_request_a_classification',
        destinationPath: classificationHref,
      });
      expect(trackCtaClick).toHaveBeenNthCalledWith(2, {
        ctaId: otherAnalyticsId,
        destinationPath: otherHref,
      });
    }
  );
});
