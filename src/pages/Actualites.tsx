import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ActualitesArticleCard from '../components/ui/ActualitesArticleCard';
import FeaturedActualiteCard from '../components/ui/FeaturedActualiteCard';
import PageHero from '../components/ui/PageHero';
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
      <PageHero
        size="compact"
        eyebrow="Actualités"
        eyebrowMarked
        title="Actualités"
        description="Décryptages, guides pratiques et informations utiles sur le classement et la réglementation des meublés de tourisme."
      />

      <section className="bg-surface pb-section pt-12 sm:pt-14 lg:pt-16">
        <div className="container-editorial">
          <p className="editorial-eyebrow mb-3">Explorer les actualités</p>
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
                  className={`ui-focus min-h-11 rounded-control border px-4 py-2 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                    isActive
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/15 bg-surface text-ink hover:bg-surface-hover'
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
              <p className="mb-6 text-lg text-muted">
                Aucun article n’est encore publié dans cette catégorie.
              </p>
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className="ui-focus inline-flex min-h-11 items-center justify-center rounded-control bg-ink px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-ink-hover hover:text-white motion-reduce:transition-none"
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
