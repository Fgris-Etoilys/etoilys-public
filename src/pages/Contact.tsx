import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';

export default function Contact() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              Nous contacter
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Une question sur le classement de votre meublé de tourisme ? Notre équipe est à votre écoute pour vous répondre et vous accompagner.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <div>
              <h2 className='mb-8'>Nos coordonnées</h2>
              <div className='space-y-6 mb-12'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center'>
                      <MapPin className='h-6 w-6 text-primary-300' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                      Adresse
                    </h3>
                    <p className='text-textLight leading-comfortable'>
                      123 Rue du Tourisme<br />
                      75001 Paris<br />
                      France
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center'>
                      <Phone className='h-6 w-6 text-primary-300' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                      Téléphone
                    </h3>
                    <a
                      href='tel:+33123456789'
                      className='text-textLight hover:text-primary-300 leading-comfortable'
                    >
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center'>
                      <Mail className='h-6 w-6 text-primary-300' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                      Email
                    </h3>
                    <a
                      href='mailto:contact@etoilys.fr'
                      className='text-textLight hover:text-primary-300 leading-comfortable'
                    >
                      contact@etoilys.fr
                    </a>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center'>
                      <Clock className='h-6 w-6 text-primary-300' />
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                      Horaires d'ouverture
                    </h3>
                    <p className='text-textLight leading-comfortable'>
                      Lundi - Vendredi : 9h00 - 18h00<br />
                      Samedi : 9h00 - 12h00<br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-primary-100 rounded-card p-6'>
                <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-3'>
                  Réponse rapide
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Nous nous engageons à répondre à votre demande sous 24 heures ouvrées. Pour une demande urgente, n'hésitez pas à nous appeler directement.
                </p>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className='py-section bg-gray-100'>
        <div className='container-adaptive'>
          <div className='bg-white rounded-card overflow-hidden shadow-card'>
            <div className='aspect-[16/9] bg-gray-200 flex items-center justify-center'>
              <MapPin className='h-16 w-16 text-gray-400' />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
