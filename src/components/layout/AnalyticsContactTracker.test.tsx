import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AnalyticsContactTracker from './AnalyticsContactTracker';

const analyticsMock = vi.hoisted(() => ({
  trackContactClick: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
  trackContactClick: analyticsMock.trackContactClick,
}));

function ContactLinks() {
  const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <AnalyticsContactTracker />
      <a href="tel:+33649551540" onClick={preventNavigation}>
        Téléphoner à Etoilys
      </a>
      <a href="mailto:contact@etoilys.fr?subject=Contact" onClick={preventNavigation}>
        Écrire à Etoilys
      </a>
      <a href="tel:+15592887060" onClick={preventNavigation}>
        Téléphoner à Vercel
      </a>
      <a href="mailto:tiers@example.com" onClick={preventNavigation}>
        Écrire à un tiers
      </a>
    </>
  );
}

describe('AnalyticsContactTracker', () => {
  afterEach(() => {
    cleanup();
    analyticsMock.trackContactClick.mockReset();
  });

  it('tracks only Etoilys phone and email links', () => {
    render(<ContactLinks />);

    fireEvent.click(screen.getByRole('link', { name: 'Téléphoner à Etoilys' }));
    fireEvent.click(screen.getByRole('link', { name: 'Écrire à Etoilys' }));
    fireEvent.click(screen.getByRole('link', { name: 'Téléphoner à Vercel' }));
    fireEvent.click(screen.getByRole('link', { name: 'Écrire à un tiers' }));

    expect(analyticsMock.trackContactClick).toHaveBeenNthCalledWith(1, 'phone');
    expect(analyticsMock.trackContactClick).toHaveBeenNthCalledWith(2, 'email');
    expect(analyticsMock.trackContactClick).toHaveBeenCalledTimes(2);
  });
});
