import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  helperText?: string | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, name, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? name ?? generatedId;

    const messageId = `${inputId}-message`;
    const describedBy =
      [props['aria-describedby'], error || helperText ? messageId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-2">
            {label}
            {props.required && <span className="text-alert-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`ui-field  ${error ? 'ui-field-error' : ''} ${className}`}
          {...props}
          aria-invalid={props['aria-invalid'] ?? (error ? true : undefined)}
          aria-describedby={describedBy}
        />
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

Input.displayName = 'Input';

export default Input;
