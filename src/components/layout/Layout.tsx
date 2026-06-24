import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AnalyticsRouteTracker from './AnalyticsRouteTracker';
import CookieConsentManager from './CookieConsentManager';
import Header from './Header';
import Footer from './Footer';
import SEO from '../ui/SEO';
import { ToastProvider } from '../ui/Toast';
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  GlobalStructuredData,
} from '../ui/StructuredData';
import {
  getSeoRouteConfig,
  getBreadcrumbItems,
  getSeoAlternateLinks,
  SITE_URL,
} from '../../content/seoRoutes';
import { getArticleStructuredData } from '../../content/articleStructuredData';
import { IMAGE_MANIFEST } from '../../content/imageManifest';

export default function Layout() {
  const location = useLocation();
  const seoConfig = getSeoRouteConfig(location.pathname);
  const alternateLinks = getSeoAlternateLinks(location.pathname);
  const breadcrumbItems = getBreadcrumbItems(location.pathname);
  const articleData = getArticleStructuredData(location.pathname);
  const defaultOgImageUrl = `${SITE_URL}${IMAGE_MANIFEST.homeHero.src}`;
  const routeOgImageUrl = seoConfig.ogImageKey
    ? `${SITE_URL}${IMAGE_MANIFEST[seoConfig.ogImageKey].src}`
    : defaultOgImageUrl;
  const articleOgImageUrl = articleData
    ? `${SITE_URL}${IMAGE_MANIFEST[articleData.imageKey].src}`
    : null;
  const ogImageUrl = articleOgImageUrl ?? routeOgImageUrl;
  const lcpPreloadAsset = seoConfig.lcpImageKey ? IMAGE_MANIFEST[seoConfig.lcpImageKey] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsRouteTracker />
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        robots={seoConfig.robots}
        ogImage={ogImageUrl}
        preloadImage={lcpPreloadAsset?.src}
        preloadImageSrcSet={lcpPreloadAsset?.srcSetAvif}
        preloadImageSizes={lcpPreloadAsset ? '100vw' : undefined}
        alternateLinks={alternateLinks}
      />
      <GlobalStructuredData />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {articleData && (
        <ArticleStructuredData
          url={`${SITE_URL}${articleData.path}`}
          headline={articleData.headline}
          description={articleData.description}
          datePublished={articleData.datePublished}
          dateModified={articleData.dateModified}
          image={`${SITE_URL}${IMAGE_MANIFEST[articleData.imageKey].src}`}
          authorName={articleData.authorName}
        />
      )}
      <ToastProvider>
        <Header />
        <main className="flex-grow pt-16">
          <Outlet />
        </main>
        <Footer />
        <CookieConsentManager />
      </ToastProvider>
    </div>
  );
}
