import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className = '', hover = true, ...props },
  ref
) {
  const hoverClasses = hover
    ? 'hover:border-ink/25 hover:shadow-[0_4px_16px_rgb(var(--color-ink)/0.06)] transition-colors duration-300'
    : '';

  return (
    <div
      ref={ref}
      className={`bg-surface border border-ink/10 rounded-editorial ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
