import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Checkbox from './Checkbox';
import RadioGroup from './RadioGroup';

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

  it('exposes a focusable radio group without any default choice', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        label="Choice"
        name="choice"
        value=""
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
        onChange={onChange}
        error="Choice required"
        required
      />
    );

    const group = screen.getByRole('radiogroup', { name: /Choice/ });
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAttribute('data-replay-block', 'true');
    expect(group).toHaveAccessibleDescription('Choice required');
    expect(screen.getByText('Choice required')).toHaveAttribute('role', 'alert');
    group.focus();
    expect(group).toHaveFocus();

    expect(screen.getByRole('radio', { name: 'One' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Two' })).not.toBeChecked();
    fireEvent.click(screen.getByText('Two'));
    expect(onChange).toHaveBeenCalledWith('two');
  });
});
