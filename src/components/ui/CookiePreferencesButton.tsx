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
      className={className}
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
