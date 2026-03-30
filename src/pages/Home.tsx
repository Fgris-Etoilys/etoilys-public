import { Shield, Zap, Clock, Calculator, Users, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import ArticleCard from '../components/ui/ArticleCard';
import SmartImage from '../components/ui/SmartImage';
import { actualitesArticlesByRecency } from '../content/actualitesArticles';

const features = [
  {
    icon: Shield,
    title: 'Expertise reconnue',
    description: 'Organisme accrédité par le COFRAC pour le classement des meublés de tourisme.',
  },
  {
    icon: Zap,
    title: 'Technologie de pointe',
    description:
      'Des outils digitaux développés sur-mesure pour un suivi en temps réel, des contrôles précis et une transparence maximale.',
  },
  {
    icon: Clock,
    title: 'Proximité et réactivité',
    description:
      'Nos inspecteurs proches de chez vous vous accompagnent personnellement pour un classement rapide et efficace.',
  },
];

const advantages = [
  {
    icon: Calculator,
    title: 'Régime fiscal avantageux',
    description:
      "Un meublé classé bénéficie d'un abattement fiscal majoré en régime micro-BIC (50 % contre 30 %).",
  },
  {
    icon: Users,
    title: 'Confiance des voyageurs',
    description:
      'Le classement en étoiles est un gage de qualité et de transparence pour les locataires.',
  },
  {
    icon: Globe,
    title: 'Référencement officiel',
    description:
      "Les meublés classés sont référencés dans les réseaux officiels du tourisme et bénéficient d'une meilleure visibilité.",
  },
];

export default function Home() {
  const latestArticles = actualitesArticlesByRecency.slice(0, 2);
  return (
    <>
      <section className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="homeHero"
            alt="Facade d'un meuble de tourisme"
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-adaptive relative z-10 py-24 text-center">
          <h1 className="mb-6 text-white">Classement officiel de votre meublé de tourisme</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-comfortable">
            Etoilys vous accompagne dans votre démarche de classement pour obtenir votre
            certification officielle en étoiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/demande-classement" variant="primary" size="lg">
              Demander votre classement
            </Button>
            <Button
              href="/les-avantages-du-classement"
              variant="secondary"
              size="lg"
              className="bg-white/10 border-white text-white hover:!bg-white/20 hover:text-white"
            >
              Les avantages du classement
            </Button>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">Pourquoi choisir Etoilys ?</h2>
            <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
              Nous sommes le partenaire de confiance des propriétaires de meublés de tourisme
              partout en France.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor="bicolor"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">Les bénéfices d'un classement officiel</h2>
            <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
              Un classement en étoiles apporte de nombreux avantages pour votre activité de location
              saisonnière.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage) => (
              <FeatureCard
                key={advantage.title}
                icon={advantage.icon}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button href="/les-avantages-du-classement" variant="primary">
              Découvrir tous les avantages
            </Button>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Une procédure simple et rapide</h2>
              <div className="space-y-4 text-textLight leading-comfortable">
                <p>
                  La démarche de classement est simple : dès réception de votre demande, un
                  inspecteur situé près de chez vous vous contacte sous 24 heures pour planifier la
                  visite selon vos disponibilités et répondre à vos questions.
                </p>
                <p>
                  La visite se déroule à votre logement, sur rendez-vous, à une date qui vous
                  convient.
                </p>
                <p>
                  Sous 7 jours suivant la visite, vous recevez une proposition de classement en
                  étoiles, que vous êtes libre d'accepter ou de refuser.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/procedure" variant="primary">
                  Découvrir la procédure
                </Button>
              </div>
            </div>
            <div className="relative">
              <SmartImage
                assetKey="homeProcedure"
                alt="Interieur d'un meuble de tourisme moderne"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-card shadow-card-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-accent-1">
        <div className="container-adaptive">
          <div className="text-center mb-16">
            <h2 className="mb-4">Nos dernières actualités</h2>
            <p className="text-lg text-textLight max-w-2xl mx-auto leading-comfortable">
              Restez informé des nouveautés réglementaires et des évolutions du secteur de la
              location meublée de tourisme.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article.title}
                title={article.title}
                excerpt={article.excerpt}
                imageKey={article.imageKey}
                href={article.href}
                date={article.date}
              />
            ))}
          </div>
          <div className="text-center">
            <Button href="/actualites" variant="secondary">
              Voir toutes les actualités
            </Button>
          </div>
        </div>
      </section>

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">Lancez votre démarche de classement.</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            Etoilys prend en charge l'intégralité de la procédure. Un inspecteur de proximité vous
            accompagne de la première prise de contact jusqu'à la délivrance de votre certificat
            officiel.
          </p>
          <Button
            href="/demande-classement"
            variant="secondary"
            size="lg"
            className="border-white text-white hover:!bg-white/20 hover:text-white"
          >
            Demander votre classement
          </Button>
        </div>
      </section>
    </>
  );
}
