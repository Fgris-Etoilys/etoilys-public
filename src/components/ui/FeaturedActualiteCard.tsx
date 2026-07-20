import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  formatReadingTime,
  getArticleCategoryLabel,
  type ActualiteArticle,
} from '../../content/actualitesArticles';
import SmartImage from './SmartImage';

interface FeaturedActualiteCardProps {
  article: ActualiteArticle;
}

function getDateMetadata(article: ActualiteArticle): { label: string; dateTime: string } {
  if (article.updatedAt && article.updatedAt !== article.publishedAt) {
    return {
      label: `Mis à jour le ${article.updatedDate ?? article.date}`,
      dateTime: article.updatedAt,
    };
  }

  return {
    label: `Publié le ${article.date}`,
    dateTime: article.publishedAt,
  };
}

export default function FeaturedActualiteCard({ article }: FeaturedActualiteCardProps) {
  const dateMetadata = getDateMetadata(article);
  const hasImage = Boolean(article.imageKey);

  return (
    <article
      className={`group overflow-hidden rounded-card border border-gray-200 bg-white shadow-card ${
        hasImage ? 'grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]' : ''
      }`}
    >
      <div className="flex min-w-0 flex-col p-6 sm:p-8 lg:p-10">
        <span className="mb-4 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-500">
          {getArticleCategoryLabel(article.category)}
        </span>
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-textLight">
          <time dateTime={dateMetadata.dateTime}>{dateMetadata.label}</time>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(article.readingTimeMinutes)}</span>
        </div>
        <h2 className="mb-4 text-h3 leading-tight text-gray-900">
          <Link
            to={article.href}
            className="rounded-sm no-underline hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mb-6 text-lg leading-comfortable text-textLight">{article.excerpt}</p>
        <Link
          to={article.href}
          aria-label={`Lire l’article ${article.title}`}
          className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-primary-400 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors duration-200 hover:bg-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Lire l’article
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      {hasImage && (
        <div className="aspect-[16/9] overflow-hidden bg-primary-100 lg:aspect-auto lg:min-h-full">
          <SmartImage
            assetKey={article.imageKey}
            alt={article.title}
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
    </article>
  );
}
