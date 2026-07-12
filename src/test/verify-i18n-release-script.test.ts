import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('verify:i18n-release script', () => {
  it('covers Dutch MVP release checks', () => {
    const script = readFileSync('scripts/verify-i18n-release.ts', 'utf8');

    expect(script).toContain('NL_INDEXABLE_ROUTE_IDS');
    expect(script).toContain('DUTCH_EXPECTED_TEXT_BY_ROUTE_ID');
    expect(script).toContain('/nl/route-inconnue');
    expect(script).toContain("expectRedirect('/nl/', 308, '/nl')");
    expect(script).toContain(
      "expectLocalizedPage(pathname, 'nl', DUTCH_EXPECTED_TEXT_BY_ROUTE_ID[routeId])"
    );
  });
});
