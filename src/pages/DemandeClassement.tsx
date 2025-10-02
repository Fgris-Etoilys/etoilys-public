import { Star } from 'lucide-react';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';

export default function DemandeClassement() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Demande de classement
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Remplissez le formulaire ci-dessous pour démarrer votre démarche de classement. Notre équipe reviendra vers vous sous 24 heures pour vous accompagner.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2'>
              <DemandeClassementForm />
            </div>

            <div>
              <div className='bg-primary-100 rounded-card p-8 mb-6 sticky top-24'>
                <div className='flex items-center gap-2 mb-6'>
                  <Star className='h-8 w-8 text-primary-300 fill-current' />
                  <h3 className='text-xl font-playfair font-semibold text-gray-900'>
                    Pourquoi Etoilys ?
                  </h3>
                </div>
                <ul className='space-y-4 text-textLight leading-comfortable'>
                  <li className='flex gap-3'>
                    <span className='text-primary-300 font-bold flex-shrink-0'>✓</span>
                    <span>Organisme agréé et reconnu par l'État</span>
                  </li>
                  <li className='flex gap-3'>
                    <span className='text-primary-300 font-bold flex-shrink-0'>✓</span>
                    <span>Accompagnement personnalisé à chaque étape</span>
                  </li>
                  <li className='flex gap-3'>
                    <span className='text-primary-300 font-bold flex-shrink-0'>✓</span>
                    <span>Délai moyen de 4 à 6 semaines</span>
                  </li>
                  <li className='flex gap-3'>
                    <span className='text-primary-300 font-bold flex-shrink-0'>✓</span>
                    <span>Taux de réussite supérieur à 95%</span>
                  </li>
                  <li className='flex gap-3'>
                    <span className='text-primary-300 font-bold flex-shrink-0'>✓</span>
                    <span>Support disponible 6j/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
