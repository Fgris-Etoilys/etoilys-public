import { TrendingUp, Users, Award, Calculator, Globe, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import Card from '../components/ui/Card';

const mainBenefits = [
  {
    icon: TrendingUp,
    title: 'Augmentation des revenus',
    description: 'Un meublé classé génère en moyenne 15 à 25% de revenus supplémentaires grâce à une meilleure visibilité et des tarifs justifiés.',
  },
  {
    icon: Users,
    title: 'Confiance accrue',
    description: 'Les voyageurs privilégient les hébergements classés qui garantissent un niveau de qualité et de confort vérifié.',
  },
  {
    icon: Award,
    title: 'Reconnaissance officielle',
    description: "Le classement est délivré par un organisme accrédité et reconnu par l'État, valorisant votre professionnalisme.",
  },
  {
    icon: Calculator,
    title: 'Avantages fiscaux',
    description: "Bénéficiez d'un abattement fiscal de 71% au lieu de 50% sur vos revenus locatifs en régime micro-BIC.",
  },
  {
    icon: Globe,
    title: 'Visibilité renforcée',
    description: 'Les plateformes de réservation mettent en avant les hébergements classés dans leurs résultats de recherche.',
  },
  {
    icon: Shield,
    title: 'Protection juridique',
    description: 'Le classement facilite vos démarches administratives et vous protège en cas de litige avec les locataires.',
  },
];

const fiscalComparison = [
  {
    title: 'Sans classement',
    abattement: '50%',
    example: 'Pour 20 000€ de revenus : 10 000€ imposables',
    color: 'bg-gray-100',
  },
  {
    title: 'Avec classement',
    abattement: '71%',
    example: 'Pour 20 000€ de revenus : 5 800€ imposables',
    color: 'bg-success-100',
  },
];

export default function PourquoiClasser() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Pourquoi faire classer son meublé de tourisme ?
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Le classement de votre meublé de tourisme est bien plus qu'une simple formalité administrative. C'est un investissement stratégique qui valorise votre bien et optimise vos revenus locatifs.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <h2 className='mb-12 text-center'>Les avantages d'un meublé classé</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {mainBenefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                iconColor='bicolor'
              />
            ))}
          </div>
        </div>
      </section>

      <section className='py-section bg-primary-100'>
        <div className='container-adaptive'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='mb-8 text-center'>Avantages fiscaux : comparaison</h2>
            <p className='text-center text-textLight mb-12 leading-comfortable'>
              Le classement vous permet de bénéficier d'un abattement fiscal majoré, réduisant significativement votre base imposable.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {fiscalComparison.map((item) => (
                <Card key={item.title} hover={false} className={item.color}>
                  <div className='p-8 text-center'>
                    <h3 className='text-2xl font-playfair font-semibold text-gray-900 mb-4'>
                      {item.title}
                    </h3>
                    <div className='text-4xl font-bold text-primary-300 mb-4'>
                      {item.abattement}
                    </div>
                    <p className='text-sm text-textLight'>d'abattement fiscal</p>
                    <div className='mt-6 pt-6 border-t border-gray-300'>
                      <p className='text-sm text-gray-700 leading-comfortable'>
                        {item.example}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className='mt-8 bg-success-100 border border-success-200 rounded-card p-6'>
              <p className='text-center text-gray-800 font-medium'>
                <span className='text-success-400 font-bold'>Économie fiscale :</span> Un classement vous fait économiser jusqu'à 4 200€ d'impôts sur 20 000€ de revenus locatifs !
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='order-2 lg:order-1'>
              <img
                src='https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200'
                alt="Graphique montrant l'augmentation des revenus"
                className='rounded-card shadow-card-hover w-full'
              />
            </div>
            <div className='order-1 lg:order-2'>
              <h2 className='mb-6'>Une rentabilité prouvée</h2>
              <div className='space-y-4 text-textLight leading-comfortable'>
                <p>
                  Les études menées sur le marché de la location saisonnière démontrent que les hébergements classés bénéficient d'un taux d'occupation supérieur de 20 à 30% par rapport aux logements non classés.
                </p>
                <p>
                  Cette meilleure performance s'explique par la confiance que le classement inspire aux voyageurs et par la mise en avant des hébergements certifiés sur les plateformes de réservation.
                </p>
                <p>
                  De plus, le classement vous permet de justifier des tarifs plus élevés, reflétant la qualité et le confort de votre hébergement. L'investissement dans le classement est généralement amorti en moins d'un an.
                </p>
              </div>
              <div className='mt-8'>
                <Button href='/simulateur' variant='primary'>
                  Simuler mes économies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-section bg-accent-1'>
        <div className='container-adaptive'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='mb-6'>Un investissement rentable</h2>
            <p className='text-lg text-textLight mb-8 leading-comfortable'>
              Le coût du classement est rapidement compensé par l'augmentation de vos revenus et les économies fiscales réalisées. C'est un investissement intelligent pour valoriser votre patrimoine et optimiser votre activité de location saisonnière.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white p-6 rounded-card'>
                <div className='text-3xl font-bold text-primary-300 mb-2'>+25%</div>
                <p className='text-sm text-textLight'>de revenus en moyenne</p>
              </div>
              <div className='bg-white p-6 rounded-card'>
                <div className='text-3xl font-bold text-primary-300 mb-2'>71%</div>
                <p className='text-sm text-textLight'>d'abattement fiscal</p>
              </div>
              <div className='bg-white p-6 rounded-card'>
                <div className='text-3xl font-bold text-primary-300 mb-2'>5 ans</div>
                <p className='text-sm text-textLight'>de validité</p>
              </div>
            </div>
            <Button href='/demande-classement' variant='primary' size='lg'>
              Demander mon classement
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
