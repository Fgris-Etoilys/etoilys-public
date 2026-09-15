import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  description: string;
  eyebrow?: string;
  eyebrowMarked?: boolean;
  media?: ReactNode;
  size?: 'default' | 'compact';
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  eyebrow,
  eyebrowMarked = false,
  media,
  size = 'default',
  children,
}: PageHeroProps) {
  const isSplit = Boolean(media);
  const eyebrowClasses = `editorial-eyebrow ${eyebrowMarked ? 'editorial-eyebrow-marked ' : ''}mb-6`;
  const descriptionClasses = isSplit
    ? 'editorial-hero-description'
    : 'max-w-3xl text-lg text-muted leading-comfortable';
  const childrenClasses = isSplit ? 'mt-[26px]' : 'mt-8';

  return (
    <section
      className={`${size === 'compact' ? 'editorial-hero-compact' : isSplit ? 'editorial-hero-featured' : 'editorial-section'} bg-paper text-ink`}
    >
      <div className={`container-editorial ${isSplit ? 'editorial-hero-grid' : ''}`}>
        <div className={isSplit ? 'min-w-0' : 'max-w-4xl'}>
          {eyebrow && <p className={eyebrowClasses}>{eyebrow}</p>}
          <h1 className="editorial-title mb-6">{title}</h1>
          <p className={descriptionClasses}>{description}</p>
          {children && <div className={childrenClasses}>{children}</div>}
        </div>
        {media}
      </div>
    </section>
  );
}
