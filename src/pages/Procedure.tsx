import { FileText, Search, ClipboardCheck, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Timeline from '../components/ui/Timeline';
import FeatureCard from '../components/ui/FeatureCard';

const procedureSteps = [
  {
    number: 1,
    title: 'Constitution du dossier',
    description: 'Nous vous accompagnons dans la préparation de votre dossier de classement. Vous fournissez les informations sur votre hébergement, les photos et les documents nécessaires. Notre équipe vérifie que tout est conforme avant soumission.',
  },
  {
    number: 2,
    title: 'Dépôt de la demande',
    description: "Une fois votre dossier complet, nous le déposons auprès de l'organisme accrédité. Vous recevez un accusé de réception et votre dossier est enregistré officiellement.",
  },
  {
    number: 3,
    title: 'Visite de contrôle',
    description: 'Un auditeur qualifié se déplace dans votre hébergement pour vérifier la conformité avec les critères de classement. Cette visite dure généralement entre 1h et 2h selon la taille du bien.',
  },
  {
    number: 4,
    title: 'Analyse et notation',
    description: "L'auditeur établit un rapport détaillé évaluant votre hébergement selon une grille de critères officiels. Chaque critère est noté et le nombre d'étoiles est déterminé.",
  },
  {
    number: 5,
    title: 'Obtention du certificat',
    description: 'Si votre hébergement répond aux exigences, vous recevez votre certificat de classement officiel, valable 5 ans. Vous pouvez afficher votre classement en étoiles et bénéficier de tous ses avantages.',
  },
];

const requiredDocuments = [
  {
    icon: FileText,
    title: 'Descriptif détaillé',
    description: "Surface, nombre de pièces, équipements, capacité d'accueil de votre hébergement.",
  },
  {
    icon: Search,
    title: 'Photographies',
    description: 'Photos récentes et de qualité de toutes les pièces et des équipements.',
  },
  {
    icon: ClipboardCheck,
    title: 'Justificatifs',
    description: 'Attestations de conformité électrique et de ramonage si applicable.',
  },
  {
    icon: Award,
    title: 'Informations légales',
    description: 'Coordonnées du propriétaire, adresse exacte du bien, statut juridique.',
  },
];

export default function Procedure() {
  return (
    <>
      <section className='py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl'>
            <h1 className='mb-6 text-white'>
              La procédure de classement
            </h1>
            <p className='text-xl text-white/90 leading-comfortable'>
              Obtenir le classement de votre meublé de tourisme est une démarche simple et structurée. Découvrez les étapes à suivre pour valoriser officiellement votre hébergement.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='mb-12 text-center'>Les 5 étapes du classement</h2>
            <Timeline steps={procedureSteps} />
          </div>
        </div>
      </section>

      <section className='py-section bg-primary-100'>
        <div className='container-adaptive'>
          <h2 className='mb-12 text-center'>Documents nécessaires</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
            {requiredDocuments.map((doc) => (
              <FeatureCard
                key={doc.title}
                icon={doc.icon}
                title={doc.title}
                description={doc.description}
              />
            ))}
          </div>
          <div className='bg-white rounded-card p-8 max-w-3xl mx-auto'>
            <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-4 text-center'>
              Nous nous occupons de tout
            </h3>
            <p className='text-textLight text-center leading-comfortable'>
              Pas d'inquiétude si vous ne savez pas par où commencer. Notre équipe vous guide à chaque étape et vérifie que votre dossier est complet avant soumission. Nous maximisons vos chances d'obtenir le meilleur classement possible.
            </p>
          </div>
        </div>
      </section>

      <section className='py-section bg-white'>
        <div className='container-adaptive'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='mb-8 text-center'>Durée et validité</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
              <div className='bg-accent-1 p-8 rounded-card text-center'>
                <div className='text-4xl font-bold text-primary-300 mb-3'>4-6 semaines</div>
                <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                  Délai moyen
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Du dépôt de votre dossier complet à l'obtention de votre certificat de classement.
                </p>
              </div>
              <div className='bg-accent-1 p-8 rounded-card text-center'>
                <div className='text-4xl font-bold text-primary-300 mb-3'>5 ans</div>
                <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-2'>
                  Validité
                </h3>
                <p className='text-textLight leading-comfortable'>
                  Votre classement est valable 5 ans. Vous pouvez ensuite renouveler votre demande.
                </p>
              </div>
            </div>
            <div className='bg-warning-100 border border-warning-200 rounded-card p-6'>
              <h3 className='text-lg font-playfair font-semibold text-gray-900 mb-3'>
                Important à savoir
              </h3>
              <ul className='space-y-2 text-textLight leading-comfortable'>
                <li className='flex gap-2'>
                  <span className='text-warning-400 mt-1'>•</span>
                  <span>Le classement est facultatif mais fortement recommandé pour valoriser votre bien.</span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-warning-400 mt-1'>•</span>
                  <span>Les critères évoluent régulièrement, nous vous tenons informé des changements.</span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-warning-400 mt-1'>•</span>
                  <span>Le classement obtenu doit être affiché dans votre hébergement et sur vos annonces.</span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-warning-400 mt-1'>•</span>
                  <span>Vous pouvez demander un classement supérieur après amélioration de votre bien.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className='py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white'>
        <div className='container-adaptive text-center'>
          <h2 className='mb-6 text-white'>Lancez-vous dès maintenant</h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable'>
            Notre équipe est prête à vous accompagner dans votre démarche de classement. Contactez-nous pour démarrer.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button href='/demande-classement' variant='primary' size='lg' className='bg-white text-primary-300 hover:bg-gray-100'>
              Demander un classement
            </Button>
            <Button href='/contact' variant='secondary' size='lg' className='bg-white/10 border-white text-white hover:bg-white/20'>
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
