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
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {areas.map((area) => {
        return (
          <article
            key={area.id}
            className="grid gap-4 py-5 md:grid-cols-[minmax(0,0.25fr)_minmax(0,1fr)] md:gap-6"
          >
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Département {area.departmentCode}
              </p>
              <DepartmentHeading className="text-xl font-playfair font-semibold text-ink">
                <Link to={area.path} className="ui-focus rounded-sm hover:text-ink-hover">
                  {area.name}
                </Link>
              </DepartmentHeading>
            </div>
            <div>
              <p className="text-sm leading-comfortable text-muted">{area.description}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to={area.path}
                  className="editorial-inline-link ui-focus inline-flex rounded-sm text-sm font-semibold leading-comfortable"
                >
                  {area.hubLinkLabel}
                </Link>
                {area.localPages.length > 0 && (
                  <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {area.localPages.map((localPage) => (
                      <li key={localPage.id}>
                        <Link
                          to={localPage.path}
                          className="editorial-inline-link ui-focus inline-flex rounded-sm text-sm font-medium leading-comfortable"
                        >
                          {localPage.hubLabel ?? localPage.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
