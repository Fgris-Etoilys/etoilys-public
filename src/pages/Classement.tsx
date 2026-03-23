import { Link } from 'react-router-dom';
import { Star, Calculator, Users, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';

const classementLevels = [
  {
    stars: 1,
    title: '1 étoile',
    description:
      "Hébergement confortable répondant aux critères de base de qualité et d'équipement.",
  },
  {
    stars: 2,
    title: '2 étoiles',
    description: 'Niveau de confort supérieur avec des équipements et services de qualité.',
  },
  {
    stars: 3,
    title: '3 étoiles',
    description: 'Hébergement de standing avec équipements modernes et prestations soignées.',
  },
  {
    stars: 4,
    title: '4 étoiles',
    description:
      'Très haut niveau de confort, équipements haut de gamme et prestations exceptionnelles.',
  },
  {
    stars: 5,
    title: '5 étoiles',
    description:
      "Excellence absolue, luxe et prestations d'exception pour une expérience inoubliable.",
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

export default function Classement() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Le classement des meublés de tourisme</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Le classement en étoiles est une certification officielle qui atteste de la qualité et
              du niveau de confort de votre hébergement touristique. Découvrez tout ce qu'il faut
              savoir sur cette démarche valorisante.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Qu'est-ce que le classement meublé de tourisme ?</h2>
            <div className="prose prose-lg max-w-none text-textLight leading-comfortable space-y-4">
              <p>
                Le classement des meublés de tourisme est une démarche volontaire permettant
                d'obtenir une certification officielle de 1 à 5 étoiles, valable 5 ans. Il est régi
                par le{' '}
                <a
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025576926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  Code du tourisme (articles L.324-1 et suivants)
                </a>{' '}
                et son référentiel est fixé par l'{' '}
                <a
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044413389"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  arrêté du 24 novembre 2021
                </a>
                , entré en vigueur le 1er février 2022.
              </p>
              <p>
                La visite de contrôle est obligatoirement réalisée en présence physique par un
                organisme accrédité par le COFRAC ou agréé par Atout France. Les listes des
                organismes habilités sont publiées et tenues à jour par Atout France.
              </p>
              <p>
                Le classement s'applique à tous les types de meublés de tourisme : studios,
                appartements, maisons, chalets. Il n'est soumis à aucun critère géographique ou de
                taille minimale autre que ceux du{' '}
                <a
                  href="https://www.classement.atout-france.fr/documents/20142/50558/R%C3%A9f%C3%A9rentiel+de+classement+des+meubl%C3%A9s+de+tourisme+2022+V2.pdf/544f474f-0496-d5e8-a191-13b66d4582cc?version=1.0&download=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:underline"
                >
                  référentiel officiel
                </a>
                . Pour plus d'informations sur les conditions d'éligibilité, consultez les{' '}
                <Link to="/prerequis-au-classement" className="text-primary-300 hover:underline">
                  prérequis au classement
                </Link>
                .
              </p>
            </div>
            <div className="bg-accent-1 border border-accent-2 rounded-card p-4 mt-6">
              <p className="text-sm text-textLight leading-comfortable">
                <span className="font-semibold text-gray-900">À noter : </span>
                le classement ne remplace pas les obligations locales — déclaration en mairie,
                numéro d'enregistrement si applicable, immatriculation (SIRET). Ces démarches sont
                distinctes et peuvent être exigées indépendamment du classement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <h2 className="mb-12 text-center">Les 5 niveaux de classement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classementLevels.map((level) => (
              <div
                key={level.stars}
                className="bg-white p-8 rounded-card border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: level.stars }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-warning fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  {level.title}
                </h3>
                <p className="text-textLight leading-comfortable">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
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

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">Prêt à faire classer votre meublé ?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            Contactez-nous dès aujourd'hui pour obtenir votre classement officiel et profiter de
            tous ses avantages.
          </p>
          <Button
            href="/demande-classement"
            variant="secondary"
            size="lg"
            className="border-white text-white hover:bg-white/20"
          >
            Demander votre classement
          </Button>
        </div>
      </section>
    </>
  );
}
