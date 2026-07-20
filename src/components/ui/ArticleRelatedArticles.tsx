import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getArticleCategoryLabel, type ActualiteArticle } from '../../content/actualitesArticles';

interface ArticleRelatedArticlesProps {
  articles: readonly ActualiteArticle[];
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

export default function ArticleRelatedArticles({ articles }: ArticleRelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  const visibleArticles = articles.slice(0, 3);

  return (
    <section className="mt-9 border-t border-gray-200 pt-8" aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-5 text-h4">
        À lire aussi
      </h2>
      <ul
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        aria-label="Articles connexes"
        tabIndex={0}
      >
        {visibleArticles.map((article) => {
          const dateMetadata = getDateMetadata(article);

          return (
            <li key={article.href} className="min-w-[78%] snap-start sm:min-w-[20rem] md:min-w-0">
              <article className="flex h-full flex-col rounded-card border border-gray-200 bg-white p-4 shadow-card md:p-3">
                <span className="mb-2 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-500">
                  {getArticleCategoryLabel(article.category)}
                </span>
                <h3 className="mb-2 text-lg font-playfair font-semibold leading-snug text-gray-900">
                  <Link
                    to={article.href}
                    className="rounded-sm no-underline hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                  >
                    {article.title}
                  </Link>
                </h3>
                <time className="mb-2 text-sm text-textLight" dateTime={dateMetadata.dateTime}>
                  {dateMetadata.label}
                </time>
                <p className="mb-3 flex-1 text-[11px] leading-relaxed text-textLight">
                  {article.relatedSummary}
                </p>
                <Link
                  to={article.href}
                  aria-label={`Lire l’article ${article.title}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-primary-400 no-underline transition-colors duration-200 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 motion-reduce:transition-none"
                >
                  Lire l’article
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
