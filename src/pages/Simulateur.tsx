import { Calculator } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Simulateur() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Simulateur de classement
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Estimez le niveau de classement potentiel de votre meublé et calculez vos économies fiscales.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl mx-auto text-center'>
            <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 mb-8'>
              <Calculator className='h-12 w-12 text-primary-300' />
            </div>
            <h2 className='mb-6'>Bientôt disponible</h2>
            <p className='text-lg text-textLight mb-12 leading-comfortable'>
              Nous travaillons actuellement sur un simulateur interactif qui vous permettra de calculer vos économies grâce au classement de votre meublé de tourisme.
            </p>
            <div className='bg-primary-100 rounded-card p-8 mb-12'>
              <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-4'>
                Ce que le simulateur vous permettra de faire :
              </h3>
              <ul className='text-left space-y-3 text-textLight max-w-2xl mx-auto'>
                <li className='flex gap-3'>
                  <span className='text-primary-300 font-bold'>✓</span>
                  <span>Estimer le niveau de classement potentiel (1 à 5 étoiles) de votre hébergement</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary-300 font-bold'>✓</span>
                  <span>Calculer vos économies fiscales annuelles grâce à l'abattement de 71%</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary-300 font-bold'>✓</span>
                  <span>Comparer vos revenus avant et après classement</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary-300 font-bold'>✓</span>
                  <span>Identifier les améliorations à apporter pour obtenir un classement supérieur</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary-300 font-bold'>✓</span>
                  <span>Recevoir une estimation personnalisée du retour sur investissement</span>
                </li>
              </ul>
            </div>
            <div className='bg-accent-1 rounded-card p-8'>
              <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-4'>
                En attendant, parlons de votre projet
              </h3>
              <p className='text-textLight mb-6 leading-comfortable'>
                Notre équipe d'experts est disponible pour étudier votre situation et vous fournir une estimation personnalisée de votre classement potentiel et des économies réalisables.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button href='/demande-classement' variant='primary'>
                  Demander un classement
                </Button>
                <Button href='/contact' variant='secondary'>
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
