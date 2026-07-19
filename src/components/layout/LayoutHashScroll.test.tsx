import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';

function renderAt(pathname: string) {
  window.history.pushState({}, 'Hash route test', pathname);
  return render(<App />);
}

describe('Layout hash scrolling', () => {
  afterEach(() => {
    cleanup();
    window.history.pushState({}, 'Test', '/');
    vi.restoreAllMocks();
  });

  it('scrolls to the target section when the route contains a hash', async () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo');
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    scrollToMock.mockClear();
    scrollIntoViewMock.mockClear();

    renderAt(
      '/actualites/preparer-visite-classement-meuble-tourisme#adapter-les-equipements-a-la-capacite-du-logement'
    );

    expect(scrollToMock).not.toHaveBeenCalledWith(0, 0);
    await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalled());
  });
});
