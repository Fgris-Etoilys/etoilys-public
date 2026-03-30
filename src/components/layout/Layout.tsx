import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import SEO from '../ui/SEO';
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  GlobalStructuredData,
} from '../ui/StructuredData';
import { getSeoRouteConfig, getBreadcrumbItems, SITE_URL } from '../../content/seoRoutes';
import { getArticleStructuredData } from '../../content/articleStructuredData';
import { IMAGE_MANIFEST } from '../../content/imageManifest';

export default function Layout() {
  const location = useLocation();
  const seoConfig = getSeoRouteConfig(location.pathname);
  const breadcrumbItems = getBreadcrumbItems(location.pathname);
  const articleData = getArticleStructuredData(location.pathname);
  const lcpPreloadUrl = seoConfig.lcpImageKey
    ? IMAGE_MANIFEST[seoConfig.lcpImageKey].src
    : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        robots={seoConfig.robots}
        preloadImage={lcpPreloadUrl}
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
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
