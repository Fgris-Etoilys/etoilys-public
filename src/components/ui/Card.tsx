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
    ? 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300'
    : '';

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-card shadow-card ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
