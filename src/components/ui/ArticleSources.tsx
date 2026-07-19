import { ChevronDown, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

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
}

function SourceList({
  sources,
  startIndex = 0,
}: {
  sources: readonly ArticleSource[];
  startIndex?: number;
}) {
  return (
    <ol className="space-y-3 text-sm text-gray-600" start={startIndex + 1}>
      {sources.map((source, index) => (
        <li key={source.id} className="flex gap-2">
          <span className="shrink-0 font-medium text-primary-400" aria-hidden="true">
            {startIndex + index + 1}.
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-gray-800">{source.organization}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="article-inline-link inline-flex min-w-0 items-start gap-1 break-words"
            >
              <span className="min-w-0 break-words">{source.title}</span>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only"> (ouvre dans un nouvel onglet)</span>
            </a>
            {source.detail && <p className="mt-1 leading-snug text-gray-600">{source.detail}</p>}
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
}: ArticleSourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  const visibleSources = sources.slice(0, VISIBLE_SOURCE_COUNT);
  const hiddenSources = sources.slice(VISIBLE_SOURCE_COUNT);
  const headingId = 'sources-officielles';
  const hiddenCount = hiddenSources.length;
  const closedSummaryLabel =
    hiddenCount === 1 ? "Afficher l'autre source" : `Afficher les ${hiddenCount} autres sources`;

  return (
    <section
      id={headingId}
      aria-labelledby={`${headingId}-title`}
      className={`mt-12 border-t border-gray-200 pt-8 ${className}`}
    >
      <h2 id={`${headingId}-title`} className="mb-3 text-h4">
        Sources officielles
      </h2>
      {description && <div className="mb-4 text-sm text-gray-600">{description}</div>}
      <SourceList sources={visibleSources} />
      {hiddenCount > 0 && (
        <details className="group mt-4 rounded-card border border-gray-200 bg-gray-50 px-4 py-3">
          <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-semibold text-themePrimary-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{closedSummaryLabel}</span>
            <span className="hidden group-open:inline">Masquer les sources supplémentaires</span>
            <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0" />
          </summary>
          <div className="mt-3 border-t border-gray-200 pt-3">
            <SourceList sources={hiddenSources} startIndex={VISIBLE_SOURCE_COUNT} />
          </div>
        </details>
      )}
    </section>
  );
}
