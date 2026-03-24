import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '../components/ui/Button';

describe('Button hover text contrast classes', () => {
  it.each([
    { variant: 'primary' as const, expectedClasses: ['hover:text-white'] },
    {
      variant: 'secondary' as const,
      expectedClasses: ['hover:text-primary-300', 'hover:bg-white', 'hover:shadow-sm'],
    },
    { variant: 'white' as const, expectedClasses: ['hover:text-primary-300'] },
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
});
