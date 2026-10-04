import type { Locale } from '../i18n/locales';
import { getArticleStructuredData } from './articleStructuredData';
import { getImageAltText, type DescribedImageAssetKey } from './imageAltText';
import { IMAGE_MANIFEST } from './imageManifest';
import {
  SITE_NAME,
  SITE_URL,
  getCanonicalUrl,
  getHtmlLang,
  getOgLocale,
  getSeoAlternateLinks,
  getSeoRouteConfig,
  getSeoTitle,
  type SeoAlternateLink,
} from './seoRoutes';
import type { ArticleStructuredDataInput } from './structuredData';

/**
 * Single SEO head resolution shared by the SPA runtime (`SEO.tsx`) and the
 * static prerender (`scripts/prerender.ts`). Pages never write these tags.
 */

export const DEFAULT_OG_IMAGE_KEY = 'homeHero' satisfies DescribedImageAssetKey;

const DEFAULT_ROBOTS = 'index,follow';
const LARGE_IMAGE_PREVIEW_DIRECTIVE = 'max-image-preview:large';
const IMAGE_PREVIEW_DIRECTIVE_PREFIX = 'max-image-preview:';
const INDEXING_BLOCKING_DIRECTIVES = new Set(['noindex', 'none']);

/** Every meta tag owned by the SEO layer, in emission order. */
export const SEO_MANAGED_META_KEYS = [
  'description',
  'robots',
  'og:title',
  'og:description',
  'og:url',
  'og:type',
  'og:site_name',
  'og:locale',
  'og:image',
  'og:image:alt',
  'article:published_time',
  'article:modified_time',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
] as const;

export type SeoMetaKey = (typeof SEO_MANAGED_META_KEYS)[number];
export type SeoMetaAttribute = 'name' | 'property';

export interface SeoMetaTag {
  attribute: SeoMetaAttribute;
  key: SeoMetaKey;
  content: string;
}

export interface ResolvedSeoImage {
  key: DescribedImageAssetKey;
  url: string;
  alt: string | undefined;
}

export interface ResolvedSeoArticle {
  publishedTime: string;
  modifiedTime: string;
  structuredData: ArticleStructuredDataInput;
}

export interface ResolvedSeoPreload {
  href: string;
  imageSrcSet: string;
  imageSizes: string;
}

export interface ResolvedSeoMetadata {
  title: string;
  description: string;
  robots: string;
  url: string;
  canonicalUrl: string | null;
  htmlLang: Locale;
  ogLocale: string;
  ogType: 'website' | 'article';
  image: ResolvedSeoImage;
  article: ResolvedSeoArticle | null;
  alternateLinks: SeoAlternateLink[];
  lcpPreload: ResolvedSeoPreload | null;
  includeStructuredData: boolean;
}

export function parseRobotsDirectives(content: string): string[] {
  return [
    ...new Set(
      content
        .split(',')
        .map((directive) => directive.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
}

/**
 * Indexable pages allow large image previews (Google Discover / robots meta).
 * Explicit restrictive directives (`noindex`, `none`) and explicit
 * `max-image-preview:*` rules are preserved as-is.
 */
export function resolveRobotsContent(robots: string | undefined): string {
  const directives = parseRobotsDirectives(robots ?? DEFAULT_ROBOTS);
  const blocksIndexing = directives.some((directive) =>
    INDEXING_BLOCKING_DIRECTIVES.has(directive)
  );
  const hasImagePreviewRule = directives.some((directive) =>
    directive.startsWith(IMAGE_PREVIEW_DIRECTIVE_PREFIX)
  );

  if (!blocksIndexing && !hasImagePreviewRule) {
    directives.push(LARGE_IMAGE_PREVIEW_DIRECTIVE);
  }

  return directives.join(',');
}

export function getSeoMetaAttribute(key: SeoMetaKey): SeoMetaAttribute {
  return key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name';
}

function getImageUrl(key: DescribedImageAssetKey): string {
  return `${SITE_URL}${IMAGE_MANIFEST[key].src}`;
}

export function resolveSeoMetadata(pathname: string): ResolvedSeoMetadata {
  const route = getSeoRouteConfig(pathname);
  const article = getArticleStructuredData(pathname);
  const htmlLang = getHtmlLang(pathname);
  const url = getCanonicalUrl(pathname);
  const imageKey = article?.imageKey ?? route.ogImageKey ?? DEFAULT_OG_IMAGE_KEY;
  const image: ResolvedSeoImage = {
    key: imageKey,
    url: getImageUrl(imageKey),
    alt: getImageAltText(imageKey, htmlLang),
  };
  const lcpAsset = route.lcpImageKey ? IMAGE_MANIFEST[route.lcpImageKey] : undefined;

  return {
    title: getSeoTitle(route.title),
    description: route.description,
    robots: resolveRobotsContent(route.robots),
    url,
    canonicalUrl: route.includeCanonical === false ? null : url,
    htmlLang,
    ogLocale: getOgLocale(pathname),
    ogType: article ? 'article' : 'website',
    image,
    article: article
      ? {
          publishedTime: article.datePublished,
          modifiedTime: article.dateModified,
          structuredData: {
            url: `${SITE_URL}${article.path}`,
            headline: article.headline,
            description: article.description,
            datePublished: article.datePublished,
            dateModified: article.dateModified,
            image: image.url,
            authorId: article.authorId,
          },
        }
      : null,
    alternateLinks: getSeoAlternateLinks(pathname),
    lcpPreload: lcpAsset
      ? {
          href: lcpAsset.src,
          imageSrcSet: lcpAsset.srcSetAvif,
          imageSizes: route.lcpImageSizes ?? '100vw',
        }
      : null,
    includeStructuredData: route.includeStructuredData !== false,
  };
}

export function buildSeoMetaTags(metadata: ResolvedSeoMetadata): SeoMetaTag[] {
  const contentByKey: Record<SeoMetaKey, string | undefined> = {
    description: metadata.description,
    robots: metadata.robots,
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:url': metadata.url,
    'og:type': metadata.ogType,
    'og:site_name': SITE_NAME,
    'og:locale': metadata.ogLocale,
    'og:image': metadata.image.url,
    'og:image:alt': metadata.image.alt,
    'article:published_time': metadata.article?.publishedTime,
    'article:modified_time': metadata.article?.modifiedTime,
    'twitter:card': 'summary_large_image',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    'twitter:image': metadata.image.url,
  };

  return SEO_MANAGED_META_KEYS.flatMap((key) => {
    const content = contentByKey[key];
    return content !== undefined && content.trim() !== ''
      ? [{ attribute: getSeoMetaAttribute(key), key, content }]
      : [];
  });
}
