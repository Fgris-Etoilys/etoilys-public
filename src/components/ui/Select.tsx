import { SelectHTMLAttributes, forwardRef } from 'react';
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
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-alert-400">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-base transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              error ? 'border-alert-400 focus:ring-alert-400' : ''
            } ${className}`}
            {...props}
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
        {error && <p className="mt-2 text-sm text-alert-400">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-textLight">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
