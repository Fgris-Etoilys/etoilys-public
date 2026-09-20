import type { HTMLAttributes, ReactNode, Ref } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

type DivCardProps = BaseCardProps &
  HTMLAttributes<HTMLDivElement> & {
    as?: 'div';
    ref?: Ref<HTMLDivElement>;
  };

type ArticleCardProps = BaseCardProps &
  HTMLAttributes<HTMLElement> & {
    as: 'article';
    ref?: Ref<HTMLElement>;
  };

type CardProps = DivCardProps | ArticleCardProps;

export default function Card({
  children,
  as = 'div',
  className = '',
  hover = true,
  ...props
}: CardProps) {
  const hoverClasses = hover
    ? 'hover:border-ink/25 hover:shadow-[0_4px_16px_rgb(var(--color-ink)/0.06)] transition-colors duration-300'
    : '';

  const classes = `bg-surface border border-ink/10 rounded-editorial ${hoverClasses} ${className}`;

  if (as === 'article') {
    const { ref, ...articleProps } = props as Omit<ArticleCardProps, keyof BaseCardProps | 'as'>;
    return (
      <article ref={ref} className={classes} {...articleProps}>
        {children}
      </article>
    );
  }

  const { ref, ...divProps } = props as Omit<DivCardProps, keyof BaseCardProps | 'as'>;
  return (
    <div ref={ref} className={classes} {...divProps}>
      {children}
    </div>
  );
}
