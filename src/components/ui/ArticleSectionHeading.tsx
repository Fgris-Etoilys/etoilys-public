import type { ReactNode } from 'react';

interface ArticleSectionHeadingProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function ArticleSectionHeading({
  id,
  children,
  className = 'mt-12 mb-4',
}: ArticleSectionHeadingProps) {
  return (
    <h2 id={id} className={`scroll-mt-24 xl:scroll-mt-28 ${className}`}>
      {children}
    </h2>
  );
}
