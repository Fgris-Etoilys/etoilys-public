import { IMAGE_MANIFEST, type ImageAssetKey } from '../../content/imageManifest';

export interface SmartImageProps {
  assetKey: ImageAssetKey;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export default function SmartImage({
  assetKey,
  alt,
  priority = false,
  sizes = '100vw',
  className,
}: SmartImageProps) {
  const asset = IMAGE_MANIFEST[assetKey];

  return (
    <picture>
      <source type="image/avif" srcSet={asset.srcSetAvif} sizes={sizes} />
      <source type="image/webp" srcSet={asset.srcSetWebp} sizes={sizes} />
      <img
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}
