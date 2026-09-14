import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { normalizeAnalyticsPath, trackCtaClick } from '../../utils/analytics';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'white' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  state?: LinkProps['state'];
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  state,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses =
    'ui-focus inline-flex items-center justify-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-ink text-white hover:bg-ink-hover hover:text-white',
    secondary: 'bg-transparent border border-ink text-ink hover:bg-surface-hover hover:text-ink',
    white: 'bg-paper text-ink hover:bg-white hover:text-ink',
    ghost: 'bg-transparent border border-white text-white hover:bg-white/10 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-control',
    md: 'px-6 py-3 text-base rounded-control',
    lg: 'px-8 py-4 text-lg rounded-control',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    const destinationPath = normalizeAnalyticsPath(href);
    const ctaId =
      destinationPath === '/'
        ? `cta_${variant}_home`
        : `cta_${variant}_${destinationPath.replace(/^\/+/, '').replace(/[^a-z0-9]+/gi, '_')}`;

    return (
      <Link
        to={href}
        state={state}
        className={classes}
        onClick={() => {
          trackCtaClick({ ctaId, destinationPath });
          onClick?.();
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
