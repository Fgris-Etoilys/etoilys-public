import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getHtmlLang,
  getCanonicalUrl,
  getSeoTitle,
  SITE_NAME,
  type SeoAlternateLink,
} from '../../content/seoRoutes';

interface SEOProps {
  title: string;
  description: string;
  robots?: string | undefined;
  ogImage?: string | undefined;
  preloadImage?: string | undefined;
  preloadImageSrcSet?: string | undefined;
  preloadImageSizes?: string | undefined;
  alternateLinks?: SeoAlternateLink[] | undefined;
  includeCanonical?: boolean | undefined;
}

export default function SEO({
  title,
  description,
  robots = 'index,follow',
  ogImage,
  preloadImage,
  preloadImageSrcSet,
  preloadImageSizes,
  alternateLinks = [],
  includeCanonical = true,
}: SEOProps) {
  const location = useLocation();
  const fullTitle = getSeoTitle(title);
  const currentUrl = getCanonicalUrl(location.pathname);
  const image = ogImage?.trim();
  const htmlLang = getHtmlLang(location.pathname);

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = htmlLang;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
    ];
    if (image) {
      metaTags.push({ property: 'og:image', content: image });
      metaTags.push({ name: 'twitter:image', content: image });
    }

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name='${name}']` : `meta[property='${property}']`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    const canonical = document.querySelector("link[rel='canonical']");
    if (includeCanonical) {
      const canonicalLink = canonical ?? document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', currentUrl);
      if (!canonical) {
        document.head.appendChild(canonicalLink);
      }
    } else if (canonical) {
      canonical.remove();
    }

    document.querySelectorAll("link[data-seo-alternate='true']").forEach((element) => {
      element.remove();
    });

    alternateLinks.forEach((alternate) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      link.setAttribute('data-seo-alternate', 'true');
      document.head.appendChild(link);
    });

    const preloadSelector = "link[data-seo-lcp-preload='true']";
    const preloadLink = document.querySelector<HTMLLinkElement>(preloadSelector);

    if (preloadImage?.trim()) {
      const link = preloadLink ?? document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'image');
      link.setAttribute('href', preloadImage);
      if (preloadImageSrcSet?.trim()) {
        link.setAttribute('imagesrcset', preloadImageSrcSet);
      } else {
        link.removeAttribute('imagesrcset');
      }
      if (preloadImageSizes?.trim()) {
        link.setAttribute('imagesizes', preloadImageSizes);
      } else {
        link.removeAttribute('imagesizes');
      }
      link.setAttribute('data-seo-lcp-preload', 'true');
      if (!preloadLink) {
        document.head.appendChild(link);
      }
    } else if (preloadLink) {
      preloadLink.remove();
    }
  }, [
    fullTitle,
    description,
    robots,
    currentUrl,
    image,
    htmlLang,
    alternateLinks,
    includeCanonical,
    preloadImage,
    preloadImageSrcSet,
    preloadImageSizes,
  ]);

  return null;
}
