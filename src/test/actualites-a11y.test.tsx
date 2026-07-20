import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import App from '../App';
import { expectNoA11yViolations } from './a11y';

function renderAt(pathname: string) {
  window.history.pushState({}, 'Actualites a11y test', pathname);
  return render(<App />);
}

describe('actualites accessibility smoke tests', () => {
  afterEach(() => {
    cleanup();
    window.history.pushState({}, 'Actualites a11y test cleanup', '/');
  });

  it('has no automated axe violations on the actualites list page', async () => {
    const { container } = renderAt('/actualites');

    await expectNoA11yViolations(container);
  });

  it('has no automated axe violations on an article with table, sources, toc and related content', async () => {
    const { container } = renderAt('/actualites/dpe-meubles-tourisme-2026-2034');

    await expectNoA11yViolations(container);
  });
});
