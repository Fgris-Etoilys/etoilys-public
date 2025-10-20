import { Shield, Zap, Clock, Award, Users, FileCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import ArticleCard from '../components/ui/ArticleCard';
import SEO from '../components/ui/SEO';

const features = [
  {
    icon: Shield,
    title: 'Expertise reconnue',
    description: 'Organisme accrédité par le COFRAC pour le classement des meublés de tourisme.',
  },
  {
    icon: Zap,
    title: 'Technologie de pointe',
    description: 'Des outils digitaux développés en interne pour un suivi en temps réel, des contrôles précis et une transparence maximale.',
  },
  {
    icon: Clock,
    title: 'Proximité et réactivité',
    description: 'Nos inspecteurs proches de chez vous vous accompagnent personnellement pour un classement rapide et efficace.',
  },
];

const advantages = [
  {
    icon: Award,
    title: 'Reconnaissance officielle',
    description: "Obtenez une classification en étoiles reconnue par l'État et valorisez votre hébergement.",
  },
  {
    icon: Users,
    title: 'Confiance des voyageurs',
    description: 'Un classement rassure les locataires et améliore votre taux de réservation.',
  },
  {
    icon: FileCheck,
    title: 'Accompagnement complet',
    description: "De la constitution du dossier à l'obtention du certificat, nous gérons tout.",
  },
];

const latestArticles = [
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

export default function Home() {
  return (
    <>
      <SEO
        title='Accueil'
        description='Etoilys vous accompagne dans le classement de votre meublé de tourisme. Obtenez votre certification officielle en étoiles et valorisez votre hébergement.'
        keywords='classement meublé tourisme, location saisonnière, hébergement touristique, certification étoiles, Etoilys'
      />
      <section className='relative min-h-[600px] flex items-center justify-center text-white' style={{ backgroundImage: 'url(https://images.pexels.com/photos/13139460/pexels-photo-13139460.jpeg?auto=compress&cs=tinysrgb&w=1920)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='container-adaptive relative z-10 py-24 text-center'>
          <h1 className='mb-6 text-white'>
            Valorisez votre meublé de tourisme avec un classement officiel
          </h1>
          <p className='text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-comfortable'>
            Etoilys vous accompagne dans votre démarche de classement pour obtenir une reconnaissance officielle et augmenter la valeur de votre hébergement.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button href='/demande-classement' variant='primary' size='lg'>
              Demander un classement
            </Button>
            <Button href='/simulateur' variant='secondary' size='lg' className='bg-white/10 border-white text-white hover:bg-white/20'>
              Simuler mon classement
            </Button>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='text-center mb-16'>
            <h2 className='mb-4'>Pourquoi choisir Etoilys ?</h2>
            <p className='text-lg text-textLight max-w-2xl mx-auto leading-comfortable'>
              Nous sommes le partenaire de confiance des propriétaires de meublés de tourisme partout en France.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor='bicolor'
              />
            ))}
          </div>
        </div>
      </section>

      <section className='py-section bg-primary-100'>
        <div className='container-adaptive'>
          <div className='text-center mb-16'>
            <h2 className='mb-4'>Les bénéfices d'un classement officiel</h2>
            <p className='text-lg text-textLight max-w-2xl mx-auto leading-comfortable'>
              Un classement en étoiles apporte de nombreux avantages pour votre activité de location saisonnière.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {advantages.map((advantage) => (
              <FeatureCard
                key={advantage.title}
                icon={advantage.icon}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='mb-6'>Une procédure simple et rapide</h2>
              <div className='space-y-4 text-textLight leading-comfortable'>
                <p>
                  Obtenir le classement de votre meublé de tourisme n'a jamais été aussi simple. Notre équipe d'experts vous accompagne à chaque étape du processus.
                </p>
                <p>
                  De la constitution de votre dossier à la visite de contrôle, en passant par l'obtention de votre certificat officiel, nous gérons l'intégralité de la démarche pour vous.
                </p>
                <p>
                  En moyenne, nos clients obtiennent leur classement en moins de 6 semaines. Profitez rapidement des avantages d'un hébergement classé.
                </p>
              </div>
              <div className='mt-8'>
                <Button href='/procedure' variant='primary'>
                  Découvrir la procédure
                </Button>
              </div>
            </div>
            <div className='relative'>
              <img
                src='https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200'
                alt="Intérieur d'un meublé de tourisme moderne"
                className='rounded-card shadow-card-hover w-full'
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-section bg-accent-1'>
        <div className='container-adaptive'>
          <div className='text-center mb-16'>
            <h2 className='mb-4'>Nos dernières actualités</h2>
            <p className='text-lg text-textLight max-w-2xl mx-auto leading-comfortable'>
              Restez informé des nouveautés et conseils pour optimiser votre activité de location meublée.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            {latestArticles.map((article) => (
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
          <div className='text-center'>
            <Button href='/actualites' variant='secondary'>
              Voir toutes les actualités
            </Button>
          </div>
        </div>
      </section>

      <section className='py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white'>
        <div className='container-adaptive text-center'>
          <h2 className='mb-6 text-white'>Prêt à valoriser votre meublé de tourisme ?</h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable'>
            Obtenez votre classement officiel en quelques semaines et profitez de tous les avantages d'un hébergement reconnu.
          </p>
          <Button href='/demande-classement' variant='primary' size='lg' className='bg-white text-primary-300 hover:bg-gray-100'>
            Demander votre classement
          </Button>
        </div>
      </section>
    </>
  );
}
