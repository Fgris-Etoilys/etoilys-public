import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  formatReadingTime,
  getArticleCategoryLabel,
  type ActualiteArticle,
} from '../../content/actualitesArticles';
import SmartImage from './SmartImage';

interface ActualitesArticleCardProps {
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

export default function ActualitesArticleCard({ article }: ActualitesArticleCardProps) {
  const dateMetadata = getDateMetadata(article);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover motion-reduce:transition-none">
      {article.imageKey && (
        <div className="aspect-[16/9] overflow-hidden bg-primary-100">
          <SmartImage
            assetKey={article.imageKey}
            alt={article.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-500">
          {getArticleCategoryLabel(article.category)}
        </span>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-textLight">
          <time dateTime={dateMetadata.dateTime}>{dateMetadata.label}</time>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(article.readingTimeMinutes)}</span>
        </div>
        <h2 className="mb-3 text-xl font-playfair font-semibold leading-snug text-gray-900">
          <Link
            to={article.href}
            className="rounded-sm no-underline hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mb-5 flex-1 text-textLight leading-comfortable">{article.excerpt}</p>
        <Link
          to={article.href}
          aria-label={`Lire l’article ${article.title}`}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full text-sm font-semibold text-primary-400 no-underline transition-colors duration-200 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 motion-reduce:transition-none"
        >
          Lire l’article
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
