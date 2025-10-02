import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {label}
            {props.required && <span className='text-alert-400 ml-1'>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200 resize-none ${
            error ? 'border-alert-400 focus:ring-alert-400' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className='mt-2 text-sm text-alert-400'>{error}</p>
        )}
        {helperText && !error && (
          <p className='mt-2 text-sm text-textLight'>{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
