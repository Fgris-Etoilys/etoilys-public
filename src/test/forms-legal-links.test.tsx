import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';

describe('legal links in forms', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders privacy link in contact form', () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link', {
      name: /politique de confidentialit(?:e|é)/i,
    });
    expect(links[0]).toHaveAttribute('href', '/confidentialite');
  });

  it('renders English privacy link in contact form', () => {
    render(
      <MemoryRouter>
        <ContactForm locale="en" />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /ask us your question/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send my message/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /privacy policy/i })[0]).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });

  it('toggles contact consent from the label text without toggling when clicking the privacy link', () => {
    render(
      <MemoryRouter>
        <ContactForm locale="en" />
      </MemoryRouter>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(screen.getByText(/I agree that my data may be processed/i));
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByRole('link', { name: /privacy policy/i }));
    expect(checkbox).not.toBeChecked();
  });

  it('toggles classification request consent from the label text without toggling when clicking the privacy link', () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="en" />
      </MemoryRouter>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(screen.getByText(/I agree that my data may be processed/i));
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByRole('link', { name: /privacy policy/i }));
    expect(checkbox).not.toBeChecked();
  });

  it('renders privacy link in demande classement form', () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link', {
      name: /politique de confidentialit(?:e|é)/i,
    });
    expect(links[0]).toHaveAttribute('href', '/confidentialite');
  });

  it('renders English privacy link in demande classement form', () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="en" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /your classification request/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send my request/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });
});
