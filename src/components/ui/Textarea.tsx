import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | undefined;
  helperText?: string | undefined;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
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
          <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-2">
            {label}
            {props.required && <span className="text-alert-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`ui-field resize-none ${error ? 'ui-field-error' : ''} ${className}`}
          {...props}
          id={inputId}
          aria-invalid={props['aria-invalid'] ?? (error ? true : undefined)}
          aria-describedby={describedBy}
        />
        {error && (
          <p id={messageId} className="mt-2 text-sm text-alert-400" role="alert">
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

Textarea.displayName = 'Textarea';

export default Textarea;
