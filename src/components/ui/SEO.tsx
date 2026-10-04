import { useEffect } from 'react';
import {
  SEO_MANAGED_META_KEYS,
  buildSeoMetaTags,
  getSeoMetaAttribute,
  type ResolvedSeoMetadata,
  type SeoMetaKey,
  type SeoMetaTag,
} from '../../content/seoMetadata';

interface SEOProps {
  metadata: ResolvedSeoMetadata;
}

function getMetaSelector(key: SeoMetaKey): string {
  return `meta[${getSeoMetaAttribute(key)}='${key}']`;
}

function syncSeoMetaTags(tags: readonly SeoMetaTag[]) {
  const activeKeys = new Set<SeoMetaKey>(tags.map((tag) => tag.key));

  SEO_MANAGED_META_KEYS.forEach((key) => {
    if (!activeKeys.has(key)) {
      document.head.querySelectorAll(getMetaSelector(key)).forEach((element) => element.remove());
    }
  });

  tags.forEach(({ attribute, key, content }) => {
    const [element, ...duplicates] = Array.from(
      document.head.querySelectorAll(getMetaSelector(key))
    );
    duplicates.forEach((duplicate) => duplicate.remove());

    const meta = element ?? document.createElement('meta');
    meta.setAttribute(attribute, key);
    meta.setAttribute('content', content);
    if (!element) {
      document.head.appendChild(meta);
    }
  });
}

export default function SEO({ metadata }: SEOProps) {
  useEffect(() => {
    document.title = metadata.title;
    document.documentElement.lang = metadata.htmlLang;

    syncSeoMetaTags(buildSeoMetaTags(metadata));

    const canonical = document.querySelector("link[rel='canonical']");
    if (metadata.canonicalUrl) {
      const canonicalLink = canonical ?? document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', metadata.canonicalUrl);
      if (!canonical) {
        document.head.appendChild(canonicalLink);
      }
    } else if (canonical) {
      canonical.remove();
    }

    document.querySelectorAll("link[data-seo-alternate='true']").forEach((element) => {
      element.remove();
    });

    metadata.alternateLinks.forEach((alternate) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      link.setAttribute('data-seo-alternate', 'true');
      document.head.appendChild(link);
    });

    const preloadSelector = "link[data-seo-lcp-preload='true']";
    const preloadLink = document.querySelector<HTMLLinkElement>(preloadSelector);
    const preload = metadata.lcpPreload;

    if (preload) {
      const link = preloadLink ?? document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'image');
      link.setAttribute('href', preload.href);
      link.setAttribute('imagesrcset', preload.imageSrcSet);
      link.setAttribute('imagesizes', preload.imageSizes);
      link.setAttribute('data-seo-lcp-preload', 'true');
      if (!preloadLink) {
        document.head.appendChild(link);
      }
    } else if (preloadLink) {
      preloadLink.remove();
    }
  }, [metadata]);

  return null;
}
