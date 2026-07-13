import { InputHTMLAttributes, forwardRef, ReactNode, useId } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string | undefined;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, required, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`mt-1 h-5 w-5 rounded border-gray-300 text-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-offset-0 transition-all duration-200 cursor-pointer ${
              error ? 'border-alert-400' : ''
            } ${className}`}
            required={required}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm text-gray-700 leading-comfortable cursor-pointer flex-1"
          >
            {label}
            {required && <span className="text-alert-400 ml-1">*</span>}
          </label>
        </div>
        {error && <p className="mt-2 text-sm text-alert-400 ml-8">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
