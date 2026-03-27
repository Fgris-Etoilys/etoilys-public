import ArticleCard from '../components/ui/ArticleCard';
import { actualitesArticlesByRecency } from '../content/actualitesArticles';

export default function Actualites() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Actualités</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Restez informé des dernières nouveautés, conseils et actualités du secteur des meublés
              de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {actualitesArticlesByRecency.map((article) => (
              <ArticleCard
                key={article.title}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
                href={article.href}
                date={article.date}
              />
            ))}
          </div>
          {actualitesArticlesByRecency.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-textLight">
                Aucun article disponible pour le moment. Revenez bientôt pour découvrir nos
                actualités.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
