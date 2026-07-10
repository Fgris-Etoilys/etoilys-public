import { Link, useLocation } from 'react-router-dom';
import { getArticleStructuredData } from '../../content/articleStructuredData';
import { formatFrenchDate } from '../../content/dateFormatting';

interface ArticleHeaderMetaProps {
  readingTime: string;
  backHref?: string;
  backLabel?: string;
}

export default function ArticleHeaderMeta({
  readingTime,
  backHref = '/actualites',
  backLabel = 'Actualités',
}: ArticleHeaderMetaProps) {
  const location = useLocation();
  const article = getArticleStructuredData(location.pathname);

  if (article === null) {
    return null;
  }

  const isUpdated = article.dateModified !== article.datePublished;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
      <Link to={backHref} className="text-white/80 transition-colors hover:text-white">
        ← {backLabel}
      </Link>
      <span aria-hidden="true">•</span>
      <time dateTime={article.datePublished}>
        Publié le {formatFrenchDate(article.datePublished)}
      </time>
      {isUpdated && (
        <>
          <span aria-hidden="true">•</span>
          <time dateTime={article.dateModified}>
            Mis à jour le {formatFrenchDate(article.dateModified)}
          </time>
        </>
      )}
      <span aria-hidden="true">•</span>
      <span>{article.authorName}</span>
      <span aria-hidden="true">•</span>
      <span>{readingTime}</span>
    </div>
  );
}
