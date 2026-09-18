import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DepartmentInterventionArea } from '../../content/local/types';

type DepartmentHeadingLevel = 3 | 4 | 5 | 6;

interface InterventionAreaCardsProps {
  areas: readonly DepartmentInterventionArea[];
  departmentHeadingLevel?: DepartmentHeadingLevel;
}

export default function InterventionAreaCards({
  areas,
  departmentHeadingLevel = 3,
}: InterventionAreaCardsProps) {
  const DepartmentHeading = `h${departmentHeadingLevel}` as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {areas.map((area) => (
        <article
          key={area.id}
          className="overflow-hidden rounded-editorial border border-ink/15 bg-paper transition-colors hover:border-copper/45"
        >
          <Link
            to={area.path}
            aria-label={area.hubLinkLabel.replace(/\s*→\s*$/, '')}
            className="ui-focus block p-5 text-ink no-underline hover:text-ink"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 rounded-control border border-copper/20 bg-surface-warm px-2.5 py-1 text-xs font-medium text-copper">
                {area.departmentCode}
              </span>
              <DepartmentHeading className="min-w-0 flex-1 text-2xl font-playfair font-semibold leading-tight text-ink">
                {area.name}
              </DepartmentHeading>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
            </div>
            <p className="text-sm leading-comfortable text-muted">{area.description}</p>
          </Link>
          {area.localPages.length > 0 && (
            <footer className="border-t border-ink/10 bg-surface-warm/55 px-5 py-4">
              <p className="mb-2 text-xs font-medium text-muted">Dans ce département</p>
              <ul className="flex flex-col gap-2">
                {area.localPages.map((localPage) => (
                  <li key={localPage.id}>
                    <Link
                      to={localPage.path}
                      className="editorial-inline-link ui-focus inline-flex min-h-11 items-center rounded-sm text-sm font-semibold leading-snug text-ink"
                    >
                      {localPage.hubLabel ?? localPage.label}
                      <ArrowRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>
      ))}
    </div>
  );
}
