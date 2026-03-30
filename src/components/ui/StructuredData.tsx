import { useEffect } from 'react';
import { SITE_URL, type BreadcrumbItem } from '../../content/seoRoutes';

interface JsonLdScriptProps {
  id: string;
  data: Record<string, unknown>;
}

export interface ArticleStructuredDataProps {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  authorName: string;
}

function JsonLdScript({ id, data }: JsonLdScriptProps) {
  const payload = JSON.stringify(data);

  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = payload;
    document.head.appendChild(script);

    return () => {
      const mounted = document.getElementById(id);
      if (mounted) {
        mounted.remove();
      }
    };
  }, [id, payload]);

  return null;
}

export function GlobalStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Etoilys',
        legalName: 'ETOILYS',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-etoilys.svg`,
        identifier: '93933080900012',
        email: 'contact@etoilys.fr',
        telephone: '+33649551540',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'contact@etoilys.fr',
            telephone: '+33649551540',
            availableLanguage: 'fr',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1345 route de Dautre',
          addressLocality: 'Mauzac-et-Grand-Castang',
          postalCode: '24150',
          addressCountry: 'FR',
        },
      },
      {
        '@type': 'WebSite',
        name: 'Etoilys',
        url: SITE_URL,
      },
    ],
  };

  return <JsonLdScript id="structured-data-global" data={data} />;
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript id="structured-data-breadcrumbs" data={data} />;
}

export function ArticleStructuredData({
  url,
  headline,
  description,
  datePublished,
  dateModified,
  image,
  authorName,
}: ArticleStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified,
    image,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Etoilys',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-etoilys.svg`,
      },
    },
    mainEntityOfPage: url,
  };

  return <JsonLdScript id="structured-data-article" data={data} />;
}
