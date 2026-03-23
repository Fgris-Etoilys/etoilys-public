import { Star, CheckCircle, TrendingUp, Shield } from 'lucide-react';
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

const benefits = [
  {
    icon: CheckCircle,
    title: 'Reconnaissance officielle',
    description:
      "Le classement est délivré par un organisme accrédité et reconnu par l'État français.",
  },
  {
    icon: TrendingUp,
    title: 'Augmentation des revenus',
    description:
      'Les hébergements classés affichent des taux de réservation et des prix moyens supérieurs.',
  },
  {
    icon: Shield,
    title: 'Garantie de qualité',
    description:
      'Le classement rassure les voyageurs sur la qualité et la conformité de votre hébergement.',
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
                Le classement des meublés de tourisme est une démarche volontaire qui permet aux
                propriétaires d'obtenir une classification officielle de leur hébergement, de 1 à 5
                étoiles. Cette certification, valable 5 ans, est délivrée par un organisme accrédité
                par le COFRAC (Comité français d'accréditation).
              </p>
              <p>
                Cette reconnaissance officielle atteste de la qualité, du confort et des équipements
                de votre location meublée selon des critères précis définis par la réglementation
                française. Le classement est un gage de sérieux et de transparence apprécié par les
                voyageurs.
              </p>
              <p>
                Que vous soyez propriétaire d'un studio, d'un appartement ou d'une maison, le
                classement s'adapte à tous les types d'hébergements et valorise vos efforts en
                matière de qualité d'accueil.
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
          <h2 className="mb-12 text-center">Les avantages du classement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
          <div className="bg-accent-1 rounded-card p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">
                Des avantages fiscaux attractifs
              </h3>
              <p className="text-textLight leading-comfortable mb-6">
                En régime micro-BIC, un meublé classé bénéficie d'un abattement de 50 % (plafond 77
                700 €) contre 30 % (plafond 15 000 €) pour un meublé non classé, depuis la loi du 19
                novembre 2024.
              </p>
              <Button href="/les-avantages-du-classement" variant="primary">
                En savoir plus sur les avantages
              </Button>
            </div>
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
            variant="primary"
            size="lg"
            className="bg-white text-primary-300 hover:bg-gray-100"
          >
            Demander un classement
          </Button>
        </div>
      </section>
    </>
  );
}
