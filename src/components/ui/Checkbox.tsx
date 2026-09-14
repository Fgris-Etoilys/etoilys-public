import { InputHTMLAttributes, forwardRef, ReactNode, useId } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string | undefined;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, required, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    const messageId = `${checkboxId}-message`;
    const describedBy =
      [props['aria-describedby'], error ? messageId : undefined].filter(Boolean).join(' ') ||
      undefined;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`ui-focus mt-1 h-5 w-5 rounded border-ink/30 accent-ink transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'ui-field-error' : ''} ${className}`}
            required={required}
            {...props}
            aria-invalid={props['aria-invalid'] ?? (error ? true : undefined)}
            aria-describedby={describedBy}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm text-ink leading-comfortable cursor-pointer flex-1"
          >
            {label}
            {required && <span className="text-alert-400 ml-1">*</span>}
          </label>
        </div>
        {error && (
          <p id={messageId} className="mt-2 text-sm text-alert-400 ml-8">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
