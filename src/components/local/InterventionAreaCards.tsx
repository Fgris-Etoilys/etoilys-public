import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { DepartmentInterventionArea } from '../../content/localServiceAreas';

interface InterventionAreaCardsProps {
  areas: DepartmentInterventionArea[];
}

export default function InterventionAreaCards({ areas }: InterventionAreaCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {areas.map((area) => {
        const visibleLocalPages = area.localPages.slice(0, 3);
        const singleLocalPage = visibleLocalPages[0];

        return (
          <Card key={area.id} className="flex min-h-[320px] flex-col p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900">{area.name}</h3>
            </div>
            <p className="mb-4 text-sm leading-comfortable text-textLight">{area.description}</p>

            {visibleLocalPages.length === 1 && singleLocalPage && (
              <Link
                to={singleLocalPage.path}
                className="mb-6 inline-flex text-sm font-medium leading-comfortable text-primary-300 underline-offset-4 hover:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
              >
                {singleLocalPage.hubLabel ?? singleLocalPage.label} →
              </Link>
            )}

            {visibleLocalPages.length > 1 && (
              <div className="mb-6 border-t border-gray-200 pt-5">
                <p className="mb-3 text-sm font-semibold text-gray-900">Pages locales</p>
                <ul className="space-y-2">
                  {visibleLocalPages.map((localPage) => (
                    <li key={localPage.id}>
                      <Link
                        to={localPage.path}
                        className="inline-flex text-sm font-medium leading-comfortable text-primary-300 underline-offset-4 hover:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
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
