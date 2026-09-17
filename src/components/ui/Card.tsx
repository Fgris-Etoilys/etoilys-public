import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  as?: 'div' | 'article';
  className?: string;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, as = 'div', className = '', hover = true, ...props },
  ref
) {
  const hoverClasses = hover
    ? 'hover:border-ink/25 hover:shadow-[0_4px_16px_rgb(var(--color-ink)/0.06)] transition-colors duration-300'
    : '';

  const classes = `bg-surface border border-ink/10 rounded-editorial ${hoverClasses} ${className}`;

  if (as === 'article') {
    return (
      <article className={classes} {...props}>
        {children}
      </article>
    );
  }

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

export default Card;
