import type { ReactNode } from 'react';
import SmartImage, { type SmartImageProps } from './SmartImage';

interface PageHeroProps {
  title: ReactNode;
  description: string;
  eyebrow?: string;
  image?: Pick<SmartImageProps, 'assetKey' | 'alt' | 'sizes'>;
  imageOverlay?: ReactNode;
  size?: 'default' | 'compact';
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  eyebrow,
  image,
  imageOverlay,
  size = 'default',
  children,
}: PageHeroProps) {
  return (
    <section
      className={`${size === 'compact' ? 'editorial-hero-compact' : image ? 'editorial-hero-featured' : 'editorial-section'} bg-paper text-ink`}
    >
      <div className={`container-editorial ${image ? 'editorial-hero-grid' : ''}`}>
        <div className={image ? 'min-w-0' : 'max-w-4xl'}>
          {eyebrow && <p className="editorial-eyebrow mb-6">{eyebrow}</p>}
          <h1 className="editorial-title mb-6">{title}</h1>
          <p className="max-w-3xl text-lg text-muted leading-comfortable">{description}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="editorial-hero-visual">
            <div className="editorial-hero-photo">
              <SmartImage {...image} priority className="h-full w-full object-cover" />
            </div>
            {imageOverlay && <div className="editorial-hero-overlay">{imageOverlay}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
