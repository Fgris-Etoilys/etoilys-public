import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import App from '../App';

describe('critical image cwv guards', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders home route images with explicit dimensions and without critical external hosts', () => {
    window.history.pushState({}, 'Home route', '/');
    const { container } = render(<App />);
    const images = Array.from(container.querySelectorAll('img'));

    expect(images.length).toBeGreaterThan(0);

    images.forEach((image) => {
      expect(image.getAttribute('width')).toBeTruthy();
      expect(image.getAttribute('height')).toBeTruthy();
      expect(image.getAttribute('src')?.includes('images.pexels.com')).toBe(false);
    });
  });
});
