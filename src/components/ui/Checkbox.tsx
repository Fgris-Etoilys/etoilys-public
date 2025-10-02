import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='w-full'>
        <div className='flex items-start gap-3'>
          <input
            ref={ref}
            type='checkbox'
            className={`mt-1 h-5 w-5 rounded border-gray-300 text-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-offset-0 transition-all duration-200 cursor-pointer ${
              error ? 'border-alert-400' : ''
            } ${className}`}
            {...props}
          />
          <label className='text-sm text-gray-700 leading-comfortable cursor-pointer flex-1'>
            {label}
            {props.required && <span className='text-alert-400 ml-1'>*</span>}
          </label>
        </div>
        {error && (
          <p className='mt-2 text-sm text-alert-400 ml-8'>{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
