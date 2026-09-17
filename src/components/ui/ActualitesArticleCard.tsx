import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  formatReadingTime,
  getArticleCategoryLabel,
  type ActualiteArticle,
} from '../../content/actualitesArticles';
import Card from './Card';
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
    <Card as="article" className="group flex h-full min-w-0 flex-col overflow-hidden" hover={false}>
      {article.imageKey && (
        <div className="aspect-[16/9] overflow-hidden bg-paper">
          <SmartImage
            assetKey={article.imageKey}
            alt={article.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 inline-flex w-fit rounded-control bg-paper px-3 py-1 text-xs font-semibold text-ink">
          {getArticleCategoryLabel(article.category)}
        </span>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <time dateTime={dateMetadata.dateTime}>{dateMetadata.label}</time>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(article.readingTimeMinutes)}</span>
        </div>
        <h2 className="mb-3 text-xl font-playfair font-semibold leading-snug text-ink">
          <Link to={article.href} className="ui-focus rounded-sm no-underline hover:text-ink-hover">
            {article.title}
          </Link>
        </h2>
        <p className="mb-5 flex-1 text-muted leading-comfortable">{article.excerpt}</p>
        <Link
          to={article.href}
          aria-label={`Lire l’article ${article.title}`}
          className="editorial-link w-fit"
        >
          Lire l’article
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
