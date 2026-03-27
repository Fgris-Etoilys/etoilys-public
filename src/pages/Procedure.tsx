import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Timeline from '../components/ui/Timeline';

const procedureSteps = [
  {
    number: 1,
    title: 'Demande de classement',
    description:
      'Votre demande peut être déposée en ligne ou bien en contactant directement Etoilys au 06 49 55 15 40.',
  },
  {
    number: 2,
    title: 'Prise de contact',
    description:
      "L'inspecteur de votre secteur prend contact avec vous sous 24 heures pour confirmer l'éligibilité de votre logement et convenir avec vous de la date de la visite d'inspection.",
  },
  {
    number: 3,
    title: "Visite d'inspection",
    description: (
      <>
        {"L'inspecteur visite le logement en votre présence et contrôle les "}
        <a
          href="/Référentiel de classement des meublés de tourisme 2022 V2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          133 critères du référentiel officiel
        </a>
        {
          ". À l'issue de la visite, vous avez la possibilité d'ajuster le niveau de classement visé en fonction des résultats."
        }
      </>
    ),
  },
  {
    number: 4,
    title: 'Proposition de classement',
    description:
      "Vous recevez sous 7 jours le certificat de visite complet incluant la grille de contrôle, le rapport d'inspection détaillé et la proposition de classement officielle. Vous avez alors 15 jours pour faire appel de la décision.",
  },
  {
    number: 5,
    title: 'Attribution du classement',
    description:
      "À l'issue de la procédure, le classement obtenu est valable 5 ans et peut figurer sur les annonces et supports de communication du logement.",
  },
];

const chifflesCles = [
  { value: '24h', label: 'Délai de rappel après la demande' },
  { value: '133', label: 'Critères contrôlés lors de la visite' },
  { value: '7 jours', label: 'Délai de remise du certificat' },
  { value: '15 jours', label: "Délai d'appel après la proposition" },
  { value: '5 ans', label: 'Durée de validité du classement' },
];

const certificatItems = [
  'La grille de contrôle complète des 133 critères',
  "Le rapport d'inspection détaillé",
  'La proposition de classement officielle',
];

export default function Procedure() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">La procédure de classement</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Le classement d'un meublé de tourisme suit une procédure structurée en 5 étapes, de la
              demande initiale à l'attribution officielle du classement.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Les 5 étapes du classement</h2>
            <Timeline steps={procedureSteps} />
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Chiffres clés de la procédure</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {chifflesCles.map((item) => (
                <div
                  key={item.value}
                  className="bg-white rounded-card p-6 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-3xl font-bold text-primary-300 mb-2">{item.value}</div>
                  <p className="text-sm text-textLight leading-comfortable">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-center">Ce que comprend le certificat de visite</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              À l'issue de la visite, un dossier complet est transmis dans un délai de 7 jours.
            </p>
            <div className="bg-primary-100 rounded-card p-8">
              <ul className="space-y-4">
                {certificatItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-800 leading-comfortable">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">Lancez-vous dès maintenant</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            Notre équipe est prête à vous accompagner dans votre démarche de classement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/faq" variant="ghost" size="lg">
              Questions fréquentes
            </Button>
            <Button href="/demande-classement" variant="white" size="lg">
              Demander votre classement
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
