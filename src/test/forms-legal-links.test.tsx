import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';

describe('legal links in forms', () => {
  it('renders privacy link in contact form', () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link', {
      name: /politique de confidentialité/i,
    });
    expect(links[0]).toHaveAttribute('href', '/confidentialite');
  });

  it('renders privacy link in demande classement form', () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link', {
      name: /politique de confidentialité/i,
    });
    expect(links[0]).toHaveAttribute('href', '/confidentialite');
  });
});
