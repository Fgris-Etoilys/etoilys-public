import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import AnalyticsRouteTracker from './AnalyticsRouteTracker';
import AnalyticsContactTracker from './AnalyticsContactTracker';
import CookieConsentManager from './CookieConsentManager';
import Header from './Header';
import Footer from './Footer';
import { layoutContent } from '../../i18n/layoutContent';
import { getLocaleFromPath } from '../../i18n/routeHelpers';
import SEO from '../ui/SEO';
import { ToastProvider } from '../ui/Toast';
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  GlobalStructuredData,
} from '../ui/StructuredData';
import { getBreadcrumbItems } from '../../content/seoRoutes';
import { resolveSeoMetadata } from '../../content/seoMetadata';

export default function Layout() {
  const location = useLocation();
  const content = layoutContent[getLocaleFromPath(location.pathname)];
  const seoMetadata = useMemo(() => resolveSeoMetadata(location.pathname), [location.pathname]);
  const breadcrumbItems = getBreadcrumbItems(location.pathname);
  const shouldRenderStructuredData = seoMetadata.includeStructuredData;

  useEffect(() => {
    if (location.hash) {
      let frameId: number | null = null;
      const scrollToHashTarget = () => {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        target?.scrollIntoView();
        return Boolean(target);
      };

      try {
        if (!scrollToHashTarget()) {
          frameId = window.requestAnimationFrame(scrollToHashTarget);
        }
      } catch {
        // Ignore malformed URL fragments and preserve the current scroll position.
      }
      return () => {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
      };
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsRouteTracker />
      <AnalyticsContactTracker />
      <SEO metadata={seoMetadata} />
      {shouldRenderStructuredData && <GlobalStructuredData pathname={location.pathname} />}
      {shouldRenderStructuredData && <BreadcrumbStructuredData items={breadcrumbItems} />}
      {shouldRenderStructuredData && seoMetadata.article && (
        <ArticleStructuredData {...seoMetadata.article.structuredData} />
      )}
      <ToastProvider>
        <a href="#main-content" className="skip-link ui-focus">
          {content.skipToContentLabel}
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-grow site-main">
          <Outlet />
        </main>
        <Footer />
        <CookieConsentManager />
      </ToastProvider>
    </div>
  );
}
