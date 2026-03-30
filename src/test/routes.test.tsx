import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '../App';

const renderAt = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  return render(<App />);
};

describe('routing', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders legal privacy page', () => {
    renderAt('/confidentialite');
    expect(
      screen.getByRole('heading', { name: /politique de confidentialit/i })
    ).toBeInTheDocument();
  });

  it('renders legal mentions page', () => {
    renderAt('/mentions-legales');
    expect(screen.getByRole('heading', { name: /mentions légales/i })).toBeInTheDocument();
  });

  it('renders contact page', () => {
    renderAt('/contact');
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    renderAt('/url-inexistante');
    expect(screen.getByRole('heading', { name: /page non trouvée/i })).toBeInTheDocument();
  });
});
