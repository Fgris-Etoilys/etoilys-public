import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  formatReadingTime,
  getArticleCategoryLabel,
  type ActualiteArticle,
} from '../../content/actualitesArticles';
import { formatFrenchDate } from '../../content/dateFormatting';

export type ArticleLayoutArticle = Omit<ActualiteArticle, 'date' | 'imageKey' | 'updatedDate'>;

interface ArticleLayoutProps {
  article: ArticleLayoutArticle;
  lede: ReactNode;
  keyTakeaways: ReactNode;
  children: ReactNode;
  footerCta?: ReactNode;
  sources?: ReactNode;
  relatedArticles?: ReactNode;
  authorBlock?: ReactNode;
}

function buildHeadingId(href: string): string {
  const slug = href
    .replace(/^\/+actualites\/+/, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/^-+|-+$/g, '');

  return slug ? `article-${slug}-title` : 'article-title';
}

export default function ArticleLayout({
  article,
  lede,
  keyTakeaways,
  children,
  footerCta,
  sources,
  relatedArticles,
  authorBlock,
}: ArticleLayoutProps) {
  const headingId = buildHeadingId(article.href);
  const updatedAt =
    article.updatedAt && article.updatedAt !== article.publishedAt ? article.updatedAt : null;
  const hasFooter = Boolean(footerCta || sources || relatedArticles || authorBlock);

  return (
    <article aria-labelledby={headingId}>
      <header>
        <section className="bg-gradient-to-br from-themePrimary-1 to-primary-300 pb-10 pt-14 text-white sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
          <div className="container-adaptive">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
              <div className="lg:col-start-2">
                <Link
                  to="/actualites"
                  className="group mb-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline transition-[background-color,border-color,color] duration-200 hover:border-white/35 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-themePrimary-1 motion-reduce:transition-none"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                  <span>Retour aux actualités</span>
                </Link>
                <div className="mb-5">
                  <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium text-white">
                    {getArticleCategoryLabel(article.category)}
                  </span>
                </div>
                <h1 id={headingId} className="mb-5 text-white">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
                  <time dateTime={article.publishedAt}>
                    Publié le {formatFrenchDate(article.publishedAt)}
                  </time>
                  {updatedAt && (
                    <>
                      <span aria-hidden="true">·</span>
                      <time dateTime={updatedAt}>Mis à jour le {formatFrenchDate(updatedAt)}</time>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{article.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatReadingTime(article.readingTimeMinutes)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section className={`bg-white pt-10 sm:pt-12 lg:pt-14 ${hasFooter ? 'pb-0' : 'pb-section'}`}>
        <div className="container-adaptive">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
            <div className="lg:col-start-2">
              <div className="article-lede mb-10 space-y-6 text-xl leading-comfortable text-gray-700 sm:mb-12">
                {lede}
              </div>
              {keyTakeaways}
              {children}
            </div>
          </div>
        </div>
      </section>

      {hasFooter && (
        <footer className="bg-white pb-section pt-10 sm:pt-12">
          <div className="container-adaptive">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
              <div className="article-footer-slots lg:col-start-2">
                {footerCta}
                {sources}
                {relatedArticles}
                {authorBlock}
              </div>
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}
