import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

describe('Header', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 82,
      left: 0,
      right: 1440,
      x: 0,
      y: 0,
      width: 1440,
      height: 82,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    cleanup();
    document.documentElement.style.removeProperty('--etoilys-header-height');
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('exposes the measured fixed header height as a CSS variable', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(document.documentElement.style.getPropertyValue('--etoilys-header-height')).toBe('82px');
  });
});
