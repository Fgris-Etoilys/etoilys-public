import { Briefcase } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';

export default function Recrutement() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Recrutement
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Rejoignez une équipe passionnée et dynamique, engagée dans l'accompagnement des propriétaires de meublés de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-6'>
                <Briefcase className='h-10 w-10 text-primary-300' />
              </div>
              <h2 className='mb-6'>Pourquoi nous rejoindre ?</h2>
              <p className='text-lg text-textLight leading-comfortable'>
                Chez Etoilys, nous sommes convaincus que notre succès repose sur la qualité et l'engagement de nos collaborateurs. Nous offrons un environnement de travail stimulant où chacun peut s'épanouir et développer ses compétences.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-16'>
              <div className='bg-primary-100 p-6 rounded-card'>
                <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
                  Un secteur passionnant
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Évoluez dans le domaine dynamique du tourisme et contribuez à valoriser le patrimoine immobilier français.
                </p>
              </div>
              <div className='bg-primary-100 p-6 rounded-card'>
                <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
                  Formation continue
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Profitez de formations régulières pour développer vos compétences et rester à jour sur les évolutions du secteur.
                </p>
              </div>
              <div className='bg-primary-100 p-6 rounded-card'>
                <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
                  Équipe soudée
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Intégrez une équipe bienveillante où l'entraide et la collaboration sont au cœur de nos valeurs.
                </p>
              </div>
              <div className='bg-primary-100 p-6 rounded-card'>
                <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
                  Opportunités d'évolution
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Développez votre carrière au sein d'une entreprise en croissance qui valorise les talents.
                </p>
              </div>
            </div>

            <div className='bg-accent-1 rounded-card p-8 mb-12'>
              <h3 className='text-2xl font-playfair font-semibold text-gray-900 mb-4 text-center'>
                Candidature spontanée
              </h3>
              <p className='text-textLight text-center mb-8 leading-comfortable'>
                Aucune offre ne correspond à votre profil ? Envoyez-nous votre candidature spontanée. Nous sommes toujours à la recherche de talents pour renforcer notre équipe.
              </p>
              <ContactForm
                title='Formulaire de candidature'
                submitButtonText='Envoyer ma candidature'
                successMessage='Votre candidature a été envoyée avec succès ! Nous reviendrons vers vous rapidement.'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
