import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {areas.map((area) => {
        const visibleLocalPages = area.localPages.slice(0, 3);
        const singleLocalPage = visibleLocalPages[0];

        return (
          <Card key={area.id} className="flex min-h-[320px] flex-col p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <DepartmentHeading className="text-2xl font-playfair font-semibold text-ink">
                {area.name}
              </DepartmentHeading>
            </div>
            <p className="mb-4 text-sm leading-comfortable text-muted">{area.description}</p>

            {visibleLocalPages.length === 1 && singleLocalPage && (
              <Link
                to={singleLocalPage.path}
                className="editorial-inline-link ui-focus mb-6 inline-flex rounded-sm text-sm font-medium leading-comfortable"
              >
                {singleLocalPage.hubLabel ?? singleLocalPage.label} →
              </Link>
            )}

            {visibleLocalPages.length > 1 && (
              <div className="mb-6 border-t border-gray-200 pt-5">
                <p className="mb-3 text-sm font-semibold text-ink">Pages locales</p>
                <ul className="space-y-2">
                  {visibleLocalPages.map((localPage) => (
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
              </div>
            )}

            <div className="mt-auto">
              <Button href={area.path} variant="primary">
                Consulter la page {area.name}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
