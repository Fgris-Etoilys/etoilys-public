import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  helperText?: string | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-alert-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 ${
            error ? 'border-alert-400 focus:ring-alert-400' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-alert-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-textLight">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
