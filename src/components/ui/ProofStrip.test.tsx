import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MapPin } from 'lucide-react';
import ProofStrip from './ProofStrip';

describe('ProofStrip', () => {
  it('renders icons, links and readable values', () => {
    render(
      <MemoryRouter>
        <ProofStrip
          items={[
            { icon: MapPin, title: 'Secteur', description: 'Dordogne' },
            { value: '5', title: 'ans', link: { href: '/procedure', label: 'Voir la procedure' } },
            { icon: MapPin, title: 'Equipe', description: 'Locale' },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('5')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('link', { name: /Voir la procedure/i })).toHaveAttribute(
      'href',
      '/procedure'
    );
    expect(document.querySelectorAll('.editorial-proof-item')).toHaveLength(3);
  });
});
