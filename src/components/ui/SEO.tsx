import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

export default function SEO({ title, description, keywords, ogImage }: SEOProps) {
  const location = useLocation();
  const fullTitle = `${title} | Etoilys - Classement Meublés de Tourisme`;
  const siteUrl = 'https://etoilys.fr';
  const currentUrl = `${siteUrl}${location.pathname}`;
  const defaultImage = `${siteUrl}/og-image.jpg`;

  useEffect(() => {
    document.title = fullTitle;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords || 'classement meublé tourisme, location saisonnière, hébergement touristique, étoiles' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: ogImage || defaultImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage || defaultImage },
    ];

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
  }, [fullTitle, description, keywords, currentUrl, ogImage, defaultImage]);

  return null;
}
