import type { ReactNode } from 'react';
import SmartImage, { type SmartImageProps } from './SmartImage';

interface EditorialHeroMediaProps extends Pick<SmartImageProps, 'assetKey' | 'alt' | 'sizes'> {
  priority?: boolean;
  imageClassName?: string;
  caption?: ReactNode;
  note?: ReactNode;
  index?: ReactNode;
}

export default function EditorialHeroMedia({
  assetKey,
  alt,
  sizes,
  priority = false,
  imageClassName = 'h-full w-full object-cover',
  caption,
  note,
  index,
}: EditorialHeroMediaProps) {
  return (
    <div className="editorial-hero-media">
      <figure className="editorial-hero-media-photo">
        <SmartImage
          assetKey={assetKey}
          alt={alt}
          {...(sizes ? { sizes } : {})}
          priority={priority}
          className={imageClassName}
        />
        {caption && <figcaption className="editorial-hero-media-caption">{caption}</figcaption>}
      </figure>
      {note && <div className="editorial-hero-media-note">{note}</div>}
      {index && (
        <span className="editorial-hero-media-index" aria-hidden="true">
          {index}
        </span>
      )}
    </div>
  );
}
