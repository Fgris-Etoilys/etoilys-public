import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | undefined;
  helperText?: string | undefined;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const messageId = `${inputId}-message`;
    const describedBy =
      [props['aria-describedby'], error || helperText ? messageId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink">
            {label}
            {props.required && <span className="ml-1 text-alert-400">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`ui-field appearance-none pl-4 pr-12 text-base ${error ? 'ui-field-error' : ''} ${className}`}
            {...props}
            id={inputId}
            aria-invalid={props['aria-invalid'] ?? (error ? true : undefined)}
            aria-describedby={describedBy}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
          />
        </div>
        {error && (
          <p id={messageId} className="mt-2 text-sm text-alert-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={messageId} className="mt-2 text-sm text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
