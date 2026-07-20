import { useEffect } from 'react';
import type { ArticleAuthorId } from '../../content/articleAuthors';
import type { BreadcrumbItem } from '../../content/seoRoutes';
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  buildPageStructuredData,
} from '../../content/structuredData';

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
  authorId: ArticleAuthorId;
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

export function GlobalStructuredData({ pathname }: { pathname: string }) {
  const data = buildPageStructuredData(pathname);

  if (!data) {
    return null;
  }

  return <JsonLdScript id="structured-data-global" data={data} />;
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  const data = buildBreadcrumbStructuredData(items);

  if (!data) {
    return null;
  }

  return <JsonLdScript id="structured-data-breadcrumbs" data={data} />;
}

export function ArticleStructuredData({
  url,
  headline,
  description,
  datePublished,
  dateModified,
  image,
  authorId,
}: ArticleStructuredDataProps) {
  const data = buildArticleStructuredData({
    url,
    headline,
    description,
    datePublished,
    dateModified,
    image,
    authorId,
  });

  return <JsonLdScript id="structured-data-article" data={data} />;
}
