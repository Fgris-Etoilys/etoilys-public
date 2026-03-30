import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  robots?: string;
  ogImage?: string;
  preloadImage?: string;
}

export default function SEO({
  title,
  description,
  robots = 'index,follow',
  ogImage,
  preloadImage,
}: SEOProps) {
  const location = useLocation();
  const fullTitle = `${title} | Etoilys - Classement Meubles de Tourisme`;
  const siteUrl = 'https://www.etoilys.fr';
  const currentUrl = `${siteUrl}${location.pathname}`;
  const image = ogImage?.trim();

  useEffect(() => {
    document.title = fullTitle;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
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

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    const preloadSelector = "link[data-seo-lcp-preload='true']";
    const preloadLink = document.querySelector<HTMLLinkElement>(preloadSelector);

    if (preloadImage?.trim()) {
      const link = preloadLink ?? document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'image');
      link.setAttribute('href', preloadImage);
      link.setAttribute('data-seo-lcp-preload', 'true');
      if (!preloadLink) {
        document.head.appendChild(link);
      }
    } else if (preloadLink) {
      preloadLink.remove();
    }
  }, [fullTitle, description, robots, currentUrl, image, preloadImage]);

  return null;
}
