import { afterEach, describe, expect, it } from 'vitest';
import type { ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Checkbox from './Checkbox';

afterEach(cleanup);

const SelectWithOptions = (props: Omit<ComponentProps<typeof Select>, 'options'>) => (
  <Select {...props} options={[{ value: 'one', label: 'One' }]} />
);

describe('shared form controls', () => {
  it.each([Input, Textarea, SelectWithOptions])(
    'associates labels and feedback without changing caller attributes',
    (Control) => {
      const props = {
        label: 'Field',
        'aria-describedby': 'external',
      };
      const { rerender } = render(
        <>
          <span id="external">External help</span>
          <Control {...props} helperText="Help" />
        </>
      );
      expect(screen.getByLabelText('Field')).toHaveAccessibleDescription('External help Help');
      rerender(
        <>
          <span id="external">External help</span>
          <Control {...props} id="explicit" error="Error" helperText="Help" />
        </>
      );
      const field = screen.getByLabelText('Field');
      expect(field).toHaveAttribute('id', 'explicit');
      expect(field).toHaveAttribute('aria-invalid', 'true');
      expect(field).toHaveAccessibleDescription('External help Error');
      expect(screen.queryByText('Help')).not.toBeInTheDocument();
      rerender(<Control {...props} id="explicit" aria-invalid="grammar" disabled />);
      expect(screen.getByLabelText('Field')).toHaveAttribute('aria-invalid', 'grammar');
      expect(screen.getByLabelText('Field')).toHaveAttribute('aria-describedby', 'external');
      expect(screen.getByLabelText('Field')).toBeDisabled();
    }
  );

  it('keeps name-derived input IDs and associates checkbox errors', () => {
    render(
      <>
        <Input label="Name" name="customer" error="Name required" />
        <Checkbox label="Consent" error="Required" />
      </>
    );
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'customer');
    expect(screen.getByText('Name required')).toHaveAttribute('role', 'alert');
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Name required');
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAccessibleDescription('Required');
    expect(screen.getByText('Required')).toHaveAttribute('role', 'alert');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getByText('Consent'));
    expect(checkbox).toBeChecked();
  });
});
