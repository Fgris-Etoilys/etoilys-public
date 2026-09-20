import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SimulatorField from './SimulatorField';

afterEach(cleanup);

describe('SimulatorField', () => {
  it('associates label, helper, suffix and accessible errors without changing caller IDs', () => {
    const { rerender } = render(
      <SimulatorField
        id="nightly-price-input"
        label="Prix par nuit HT"
        required
        suffix="€"
        helperId="nightly-price-help"
        helperText="Montant hors taxe."
      />
    );

    const field = screen.getByLabelText(/Prix par nuit HT/);
    expect(field).toHaveAttribute('id', 'nightly-price-input');
    expect(field).toHaveAccessibleDescription('Montant hors taxe.');
    expect(screen.getByText('€')).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <SimulatorField
        id="nightly-price-input"
        label="Prix par nuit HT"
        errorId="nightly-price-error"
        error="Montant requis."
      />
    );

    expect(screen.getByLabelText('Prix par nuit HT')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Prix par nuit HT')).toHaveAccessibleDescription(
      'Montant requis.'
    );
    expect(screen.getByText('Montant requis.')).toHaveAttribute('role', 'alert');
  });
});
