import { ButtonHTMLAttributes } from 'react';
import { openCookiePreferencesModal } from '../../utils/cookiePreferences';

type CookiePreferencesButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export default function CookiePreferencesButton({
  children = 'Gérer mes cookies',
  className = '',
  onClick,
  ...props
}: CookiePreferencesButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 motion-reduce:transition-none ${className}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          openCookiePreferencesModal();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
