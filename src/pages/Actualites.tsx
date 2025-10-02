import ArticleCard from '../components/ui/ArticleCard';

const articles = [
  {
    title: 'Les avantages fiscaux du classement meublé de tourisme',
    excerpt: "Découvrez comment le classement de votre meublé de tourisme peut vous permettre de bénéficier d'avantages fiscaux significatifs et optimiser votre rentabilité locative.",
    image: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/actualites/avantages-fiscaux-classement',
    date: '15 mars 2025',
  },
  {
    title: 'Nouveaux critères de classement 2025',
    excerpt: "Les critères de classement des meublés de tourisme évoluent en 2025. Retrouvez toutes les nouvelles exigences pour chaque catégorie d'étoiles.",
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/actualites/nouveaux-criteres-2025',
    date: '8 mars 2025',
  },
];

export default function Actualites() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Actualités
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Restez informé des dernières nouveautés, conseils et actualités du secteur des meublés de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {articles.map((article) => (
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
          {articles.length === 0 && (
            <div className='text-center py-16'>
              <p className='text-lg text-textLight'>
                Aucun article disponible pour le moment. Revenez bientôt pour découvrir nos actualités.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
