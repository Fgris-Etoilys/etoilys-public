import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

interface SimulatorFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  helperText?: ReactNode;
  suffix?: ReactNode;
  labelAccessory?: ReactNode;
  errorId?: string;
  helperId?: string;
  helperClassName?: string;
  showRequiredMarker?: boolean;
}

const SimulatorField = forwardRef<HTMLInputElement, SimulatorFieldProps>(
  (
    {
      label,
      error,
      helperText,
      suffix,
      labelAccessory,
      errorId,
      helperId,
      helperClassName = 'mt-2 text-sm text-muted',
      showRequiredMarker = true,
      className = '',
      id,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? name ?? generatedId;
    const feedbackId = error
      ? (errorId ?? `${inputId}-error`)
      : helperText
        ? (helperId ?? `${inputId}-help`)
        : undefined;
    const describedBy =
      [props['aria-describedby'], feedbackId].filter(Boolean).join(' ') || undefined;
    const input = (
      <input
        ref={ref}
        id={inputId}
        name={name}
        required={required}
        className={`ui-field ${error ? 'ui-field-error' : ''} ${className}`}
        {...props}
        aria-invalid={props['aria-invalid'] ?? (error ? true : undefined)}
        aria-describedby={describedBy}
      />
    );

    return (
      <div>
        {labelAccessory ? (
          <div className="mb-2 flex items-center justify-between gap-1">
            <label htmlFor={inputId} className="text-sm font-medium text-ink">
              {label}
              {required && showRequiredMarker && (
                <span className="text-alert-400 ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {labelAccessory}
          </div>
        ) : (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink">
            {label}
            {required && showRequiredMarker && (
              <span className="text-alert-400 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {suffix ? (
          <div className="simulator-field-unit">
            {input}
            <span aria-hidden="true">{suffix}</span>
          </div>
        ) : (
          input
        )}
        {error ? (
          <p id={feedbackId} className="mt-2 text-sm text-alert-400" role="alert">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={feedbackId} className={helperClassName}>
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

SimulatorField.displayName = 'SimulatorField';

export default SimulatorField;
