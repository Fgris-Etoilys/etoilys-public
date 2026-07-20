import '@testing-library/jest-dom/vitest';
import axeMatchers from '@chialab/vitest-axe';
import type {} from '@chialab/vitest-axe/matchers';
import { expect, vi } from 'vitest';

expect.extend(axeMatchers);

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: vi.fn(),
});
