import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import type { LocalInterventionPage } from '../../content/localServiceAreas';

interface DepartmentLocalPagesProps {
  departmentName: string;
  localPages: LocalInterventionPage[];
}

export default function DepartmentLocalPages({
  departmentName,
  localPages,
}: DepartmentLocalPagesProps) {
  if (localPages.length === 0) {
    return null;
  }

  return (
    <section className="bg-primary-100 py-section" aria-labelledby="department-local-pages-title">
      <div className="container-adaptive">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <h2 id="department-local-pages-title" className="mb-4">
              Pages locales en {departmentName}
            </h2>
            <p className="text-textLight leading-comfortable">
              Certaines zones disposent d’une page dédiée lorsque leurs informations locales sont
              publiées.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {localPages.map((localPage) => (
              <Card key={localPage.id} className="p-6">
                <Link
                  to={localPage.path}
                  className="group inline-flex min-h-12 w-full items-center text-lg font-semibold leading-snug text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
                >
                  <span className="underline-offset-4 group-hover:text-primary-400 group-hover:underline">
                    {localPage.label}
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
