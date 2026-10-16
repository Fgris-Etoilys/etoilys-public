import { ChevronDown, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/locales';

const VISIBLE_SOURCE_COUNT = 3;

export interface ArticleSource {
  id: string;
  organization: string;
  title: ReactNode;
  url: string;
  detail?: ReactNode;
}

interface ArticleSourcesProps {
  sources: readonly ArticleSource[];
  description?: ReactNode;
  className?: string;
  locale?: Locale;
}

const ARTICLE_SOURCES_LABELS = {
  fr: {
    heading: 'Sources officielles',
    externalLink: 'ouvre dans un nouvel onglet',
    showOther: "Afficher l'autre source",
    showMore: (count: number) => `Afficher les ${count} autres sources`,
    hideMore: 'Masquer les sources supplémentaires',
  },
  en: {
    heading: 'Official sources',
    externalLink: 'Opens in a new tab',
    showOther: 'Show the other source',
    showMore: (count: number) => `Show ${count} more sources`,
    hideMore: 'Hide additional sources',
  },
  nl: {
    heading: 'Officiële bronnen',
    externalLink: 'Opent in een nieuw tabblad',
    showOther: 'Toon de andere bron',
    showMore: (count: number) => `Toon nog ${count} bronnen`,
    hideMore: 'Verberg aanvullende bronnen',
  },
} as const satisfies Record<
  Locale,
  {
    heading: string;
    externalLink: string;
    showOther: string;
    showMore: (count: number) => string;
    hideMore: string;
  }
>;

function SourceList({
  sources,
  startIndex = 0,
  locale,
}: {
  sources: readonly ArticleSource[];
  startIndex?: number;
  locale: Locale;
}) {
  const labels = ARTICLE_SOURCES_LABELS[locale];

  return (
    <ol className="space-y-3 text-sm text-muted" start={startIndex + 1}>
      {sources.map((source, index) => (
        <li key={source.id} className="flex gap-2">
          <span className="shrink-0 font-medium text-copper" aria-hidden="true">
            {startIndex + index + 1}.
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-ink">{source.organization}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="article-inline-link inline-flex min-w-0 items-start gap-1 break-words"
            >
              <span className="min-w-0 break-words">{source.title}</span>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only"> ({labels.externalLink})</span>
            </a>
            {source.detail && <p className="mt-1 leading-snug text-muted">{source.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ArticleSources({
  sources,
  description,
  className = '',
  locale = 'fr',
}: ArticleSourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  const visibleSources = sources.slice(0, VISIBLE_SOURCE_COUNT);
  const hiddenSources = sources.slice(VISIBLE_SOURCE_COUNT);
  const headingId = 'sources-officielles';
  const hiddenCount = hiddenSources.length;
  const labels = ARTICLE_SOURCES_LABELS[locale];
  const closedSummaryLabel = hiddenCount === 1 ? labels.showOther : labels.showMore(hiddenCount);
  const openSummaryLabel = labels.hideMore;

  return (
    <section
      id={headingId}
      aria-labelledby={`${headingId}-title`}
      className={`mt-12 border-t border-ink/15 pt-8 ${className}`}
    >
      <h2 id={`${headingId}-title`} className="mb-3 text-h4">
        {labels.heading}
      </h2>
      {description && <div className="mb-4 text-sm text-muted">{description}</div>}
      <SourceList sources={visibleSources} locale={locale} />
      {hiddenCount > 0 && (
        <details className="group mt-4 rounded-editorial border border-ink/15 bg-paper px-4 py-3">
          <summary className="ui-focus flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-control text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{closedSummaryLabel}</span>
            <span className="hidden group-open:inline">{openSummaryLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="mt-3 border-t border-ink/15 pt-3">
            <SourceList sources={hiddenSources} startIndex={VISIBLE_SOURCE_COUNT} locale={locale} />
          </div>
        </details>
      )}
    </section>
  );
}
