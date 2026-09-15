import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../../App';
import Layout from './Layout';

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

  it('scrolls to a hash target after cross-route and same-route Link navigation', async () => {
    const scrollIntoViewMock = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Link to="/les-avantages-du-classement#reconnaissance">Go to recognition</Link>
              }
            />
            <Route
              path="les-avantages-du-classement"
              element={
                <>
                  <Link to="/les-avantages-du-classement#details">Same page hash</Link>
                  <section id="reconnaissance">Recognition</section>
                  <section id="details">Details</section>
                </>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    document
      .querySelector<HTMLAnchorElement>('a[href="/les-avantages-du-classement#reconnaissance"]')
      ?.click();
    await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalledTimes(1));

    document
      .querySelector<HTMLAnchorElement>('a[href="/les-avantages-du-classement#details"]')
      ?.click();
    await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalledTimes(2));
  });

  it('retries hash scrolling once on the next animation frame when the target is late', async () => {
    const target = document.createElement('section');
    const scrollIntoViewMock = vi.spyOn(target, 'scrollIntoView');
    const getElementById = document.getElementById.bind(document);
    let recognitionCalls = 0;
    const getElementByIdMock = vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id !== 'reconnaissance') {
        return getElementById(id);
      }
      recognitionCalls += 1;
      return recognitionCalls === 1 ? null : target;
    });
    const requestAnimationFrameMock = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
    const cancelAnimationFrameMock = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderAt('/les-avantages-du-classement#reconnaissance');

    await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalledTimes(1));
    expect(getElementByIdMock.mock.calls.filter(([id]) => id === 'reconnaissance')).toHaveLength(2);
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    unmount();
    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
  });
});
