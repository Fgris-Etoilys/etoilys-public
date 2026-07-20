import axe from 'axe-core';
import { expect } from 'vitest';

export async function expectNoA11yViolations(container: Element | Document = document.body) {
  const results = await axe.run(container);

  expect(results).toHaveNoViolations();
}
