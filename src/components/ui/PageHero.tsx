import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  description: string;
  eyebrow?: string;
  media?: ReactNode;
  size?: 'default' | 'compact';
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  eyebrow,
  media,
  size = 'default',
  children,
}: PageHeroProps) {
  const isSplit = Boolean(media);

  return (
    <section
      className={`${size === 'compact' ? 'editorial-hero-compact' : isSplit ? 'editorial-hero-featured' : 'editorial-section'} bg-paper text-ink`}
    >
      <div className={`container-editorial ${isSplit ? 'editorial-hero-grid' : ''}`}>
        <div className={isSplit ? 'min-w-0' : 'max-w-4xl'}>
          {eyebrow && <p className="editorial-eyebrow mb-6">{eyebrow}</p>}
          <h1 className="editorial-title mb-6">{title}</h1>
          <p className="max-w-3xl text-lg text-muted leading-comfortable">{description}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
        {media}
      </div>
    </section>
  );
}
