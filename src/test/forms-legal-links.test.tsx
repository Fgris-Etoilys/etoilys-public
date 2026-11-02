import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { formContent } from '../i18n/formContent';
import {
  completeCoordonneesStep,
  completeLogementStep,
  installTurnstileMock,
  mockDemandeApi,
} from './demandeClassementWizard';

describe('legal links in forms', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
    installTurnstileMock();
    mockDemandeApi();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete window.turnstile;
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

    expect(
      screen.getByRole('heading', { level: 2, name: formContent.en.contact.title })
    ).toBeInTheDocument();
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

  it('toggles classification request consent from the label text without toggling when clicking the privacy link', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="en" />
      </MemoryRouter>
    );
    await completeLogementStep('en');
    completeCoordonneesStep('en');

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(screen.getByText(/I agree that my data may be processed/i));
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByRole('link', { name: /privacy policy/i }));
    expect(checkbox).not.toBeChecked();
  });

  it('renders privacy link in demande classement form', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm />
      </MemoryRouter>
    );
    await completeLogementStep('fr');
    completeCoordonneesStep('fr');

    const links = screen.getAllByRole('link', {
      name: /politique de confidentialit(?:e|é)/i,
    });
    expect(links[0]).toHaveAttribute('href', '/confidentialite');
  });

  it('renders English privacy link in demande classement form', async () => {
    render(
      <MemoryRouter>
        <DemandeClassementForm locale="en" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: formContent.en.demandeClassement.title })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/accommodation postcode/i)).toBeRequired();

    await completeLogementStep('en');
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    completeCoordonneesStep('en');

    expect(screen.getByRole('button', { name: /send my request/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/en/privacy-policy'
    );
  });
});
