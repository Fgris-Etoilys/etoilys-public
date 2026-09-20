import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '../components/ui/Button';
import { trackCtaClick } from '../utils/analytics';

vi.mock('../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

describe('Button hover text contrast classes', () => {
  beforeEach(() => {
    vi.mocked(trackCtaClick).mockClear();
  });

  it.each([
    { variant: 'primary' as const, expectedClasses: ['hover:text-white'] },
    {
      variant: 'secondary' as const,
      expectedClasses: ['hover:text-ink', 'hover:bg-surface-hover'],
    },
    { variant: 'white' as const, expectedClasses: ['hover:text-ink'] },
    { variant: 'ghost' as const, expectedClasses: ['hover:text-white'] },
  ])(
    'applies expected hover classes for $variant variant when rendered as link',
    ({ variant, expectedClasses }) => {
      render(
        <MemoryRouter>
          <Button href="/test" variant={variant}>
            Lien {variant}
          </Button>
        </MemoryRouter>
      );

      const link = screen.getByRole('link', { name: `Lien ${variant}` });
      expectedClasses.forEach((expectedClass) => {
        expect(link.className).toContain(expectedClass);
      });
    }
  );

  it('keeps an explicit analytics id independent from visual variant classes', () => {
    render(
      <MemoryRouter>
        <Button
          href="/demande-classement"
          variant="secondary"
          className="editorial-dark-button"
          analyticsId="cta_primary_demande_classement"
        >
          Demander mon classement
        </Button>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Demander mon classement' }));

    expect(screen.getByRole('link', { name: 'Demander mon classement' })).not.toHaveAttribute(
      'analyticsId'
    );
    expect(trackCtaClick).toHaveBeenCalledWith({
      ctaId: 'cta_primary_demande_classement',
      destinationPath: '/demande-classement',
    });
  });

  it('keeps the historical fallback id when analytics id is omitted', () => {
    render(
      <MemoryRouter>
        <Button href="/" variant="white">
          Accueil
        </Button>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Accueil' }));

    expect(trackCtaClick).toHaveBeenCalledWith({
      ctaId: 'cta_white_home',
      destinationPath: '/',
    });
  });

  it('does not emit CTA analytics for buttons without href', () => {
    render(<Button analyticsId="cta_test_button">Action</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Action' }));

    expect(trackCtaClick).not.toHaveBeenCalled();
  });
});
