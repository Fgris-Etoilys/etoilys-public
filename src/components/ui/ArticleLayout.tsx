import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  formatReadingTime,
  getArticleCategoryLabel,
  type ArticleLocale,
  type ActualiteArticle,
} from '../../content/actualitesArticles';
import type { ArticleAuthor } from '../../content/articleAuthors';
import { formatArticleDate } from '../../content/dateFormatting';
import ArticleAuthorBlock from './ArticleAuthorBlock';
import ArticleReadingUtilities from './ArticleReadingUtilities';
import ArticleRelatedArticles from './ArticleRelatedArticles';
import ArticleTableOfContents, { type ArticleTableOfContentsItem } from './ArticleTableOfContents';

export type ArticleLayoutArticle = Omit<
  ActualiteArticle,
  'date' | 'imageKey' | 'imageAlt' | 'updatedDate'
>;

interface ArticleLayoutProps {
  article: ArticleLayoutArticle;
  lede: ReactNode;
  keyTakeaways: ReactNode;
  tableOfContents?: readonly ArticleTableOfContentsItem[];
  children: ReactNode;
  footerCta?: ReactNode;
  sources?: ReactNode;
  relatedArticles?: readonly ActualiteArticle[];
  relatedArticlesSlot?: ReactNode;
  author?: ArticleAuthor;
  authorBlock?: ReactNode;
  locale?: ArticleLocale;
}

const ARTICLE_LAYOUT_LABELS = {
  fr: {
    backHref: '/actualites',
    backLabel: 'Retour aux actualités',
    published: 'Publié le',
    updated: 'Mis à jour le',
  },
  en: {
    backHref: '/en',
    backLabel: 'Back to home',
    published: 'Published on',
    updated: 'Updated on',
  },
  nl: {
    backHref: '/nl',
    backLabel: 'Terug naar de startpagina',
    published: 'Gepubliceerd op',
    updated: 'Bijgewerkt op',
  },
} as const satisfies Record<
  ArticleLocale,
  { backHref: string; backLabel: string; published: string; updated: string }
>;

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
  tableOfContents = [],
  children,
  footerCta,
  sources,
  relatedArticles,
  relatedArticlesSlot,
  author,
  authorBlock,
  locale = 'fr',
}: ArticleLayoutProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const editorialContentRef = useRef<HTMLDivElement>(null);
  const headingId = buildHeadingId(article.href);
  const updatedAt =
    article.updatedAt && article.updatedAt !== article.publishedAt ? article.updatedAt : null;
  const relatedArticlesNode =
    relatedArticlesSlot ??
    (relatedArticles && relatedArticles.length > 0 ? (
      <ArticleRelatedArticles articles={relatedArticles} />
    ) : null);
  const authorBlockNode =
    authorBlock ?? (author ? <ArticleAuthorBlock author={author} locale={locale} /> : null);
  const labels = ARTICLE_LAYOUT_LABELS[locale];
  const hasFooter = Boolean(footerCta || sources || relatedArticlesNode || authorBlockNode);
  const shouldShowTableOfContents =
    tableOfContents.length > 0 && (tableOfContents.length >= 5 || article.readingTimeMinutes >= 6);

  return (
    <article aria-labelledby={headingId}>
      <ArticleReadingUtilities startRef={headingRef} endRef={editorialContentRef} locale={locale} />
      <header>
        <section className="bg-paper pb-10 pt-14 text-ink sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
          <div className="container-editorial">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
              <div className="mx-auto w-full min-w-0 max-w-[56rem] xl:col-start-2 xl:mx-0 xl:max-w-none">
                <Link
                  to={labels.backHref}
                  className="ui-focus group mb-5 inline-flex min-h-11 items-center gap-2 rounded-control border border-ink/15 bg-surface px-4 py-2 text-sm font-semibold text-ink no-underline transition-colors duration-200 hover:bg-surface-hover hover:text-ink motion-reduce:transition-none"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                  <span>{labels.backLabel}</span>
                </Link>
                <div className="mb-5">
                  <span className="inline-flex rounded-control border border-ink/15 bg-surface px-3 py-1 text-sm font-medium text-ink">
                    {getArticleCategoryLabel(article.category, locale)}
                  </span>
                </div>
                <h1
                  ref={headingRef}
                  id={headingId}
                  tabIndex={-1}
                  className="editorial-title mb-5 scroll-mt-24 text-ink focus:outline-none xl:scroll-mt-28"
                >
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
                  <time dateTime={article.publishedAt}>
                    {labels.published} {formatArticleDate(article.publishedAt, locale)}
                  </time>
                  {updatedAt && (
                    <>
                      <span aria-hidden="true">·</span>
                      <time dateTime={updatedAt}>
                        {labels.updated} {formatArticleDate(updatedAt, locale)}
                      </time>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{article.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatReadingTime(article.readingTimeMinutes, locale)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section
        className={`bg-surface pt-10 sm:pt-12 lg:pt-14 ${hasFooter ? 'pb-0' : 'pb-section'}`}
      >
        <div className="container-editorial">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
            {shouldShowTableOfContents && (
              <ArticleTableOfContents items={tableOfContents} variant="desktop" locale={locale} />
            )}
            <div
              ref={editorialContentRef}
              className="mx-auto w-full min-w-0 max-w-[56rem] xl:col-start-2 xl:mx-0 xl:max-w-none"
            >
              <div className="article-lede mb-10 space-y-6 text-xl leading-comfortable text-muted sm:mb-12">
                {lede}
              </div>
              {keyTakeaways}
              {shouldShowTableOfContents && (
                <ArticleTableOfContents items={tableOfContents} variant="mobile" locale={locale} />
              )}
              {children}
            </div>
          </div>
        </div>
      </section>

      {hasFooter && (
        <footer className="bg-surface pb-section pt-10 sm:pt-12">
          <div className="container-editorial">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,16rem)_minmax(0,56rem)]">
              <div className="article-footer-slots mx-auto w-full min-w-0 max-w-[56rem] xl:col-start-2 xl:mx-0 xl:max-w-none">
                {footerCta}
                {sources}
                {relatedArticlesNode}
                {authorBlockNode}
              </div>
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}
