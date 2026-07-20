import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActualitesArticleCard from '../components/ui/ActualitesArticleCard';
import FeaturedActualiteCard from '../components/ui/FeaturedActualiteCard';
import {
  ACTUALITES_CATEGORY_FILTERS,
  actualitesArticlesByRecency,
  getFeaturedActualiteArticle,
  isArticleCategory,
  type ActualitesCategoryFilter,
} from '../content/actualitesArticles';

const CATEGORY_SEARCH_PARAM = 'categorie';

export default function Actualites() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get(CATEGORY_SEARCH_PARAM);
  const activeFilter: ActualitesCategoryFilter = isArticleCategory(rawCategory)
    ? rawCategory
    : 'all';
  const featuredArticle = getFeaturedActualiteArticle(actualitesArticlesByRecency);
  const shouldShowFeaturedArticle = activeFilter === 'all' && featuredArticle !== null;
  const visibleArticles =
    activeFilter === 'all'
      ? actualitesArticlesByRecency.filter((article) => article.href !== featuredArticle?.href)
      : actualitesArticlesByRecency.filter((article) => article.category === activeFilter);

  useEffect(() => {
    if (rawCategory !== null && !isArticleCategory(rawCategory)) {
      setSearchParams({}, { replace: true });
    }
  }, [rawCategory, setSearchParams]);

  const handleFilterChange = (filter: ActualitesCategoryFilter) => {
    if (filter === 'all') {
      setSearchParams({});
      return;
    }

    setSearchParams({ [CATEGORY_SEARCH_PARAM]: filter });
  };

  return (
    <>
      <section className="bg-gradient-to-br from-themePrimary-1 to-primary-300 py-14 text-white sm:py-16 lg:py-20">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Actualités</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Décryptages, guides pratiques et informations utiles sur le classement et la
              réglementation des meublés de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-section pt-12 sm:pt-14 lg:pt-16">
        <div className="container-adaptive">
          <p className="mb-3 text-sm font-semibold text-textLight">Explorer les actualités</p>
          <div
            className="mb-8 flex flex-wrap gap-3"
            role="group"
            aria-label="Filtrer les articles par catégorie"
          >
            {ACTUALITES_CATEGORY_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                    isActive
                      ? 'border-primary-400 bg-primary-400 text-white'
                      : 'border-gray-200 bg-white text-themePrimary-1 hover:border-primary-300 hover:bg-primary-100'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {shouldShowFeaturedArticle && (
            <div className="mb-10">
              <FeaturedActualiteCard article={featuredArticle} />
            </div>
          )}

          {visibleArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <ActualitesArticleCard key={article.href} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="mb-6 text-lg text-textLight">
                Aucun article n’est encore publié dans cette catégorie.
              </p>
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-400 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Voir toutes les actualités
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
