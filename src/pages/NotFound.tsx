import { Link, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { notFoundContent } from '../i18n/notFoundContent';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function NotFound() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const content = notFoundContent[locale];

  return (
    <>
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-3xl text-center">
          <p className="text-sm font-medium text-primary-300 mb-4">{content.eyebrow}</p>
          <h1 className="mb-6">{content.title}</h1>
          <p className="text-textLight leading-comfortable mb-8">{content.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={content.homeHref} variant="primary">
              {content.homeLabel}
            </Button>
            <Link
              to={content.contactHref}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-primary-300 text-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              {content.contactLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
