import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';

const faqItems = [
  {
    question: "Qu'est-ce qu'un meublé de tourisme classé ?",
    answer:
      'Un meublé de tourisme classé est un hébergement qui a obtenu une certification officielle attestant de sa qualité et de son niveau de confort, matérialisée par un classement de 1 à 5 étoiles. Cette classification est délivrée par un organisme accrédité et est valable 5 ans.',
  },
  {
    question: 'Le classement est-il obligatoire pour louer mon bien ?',
    answer:
      "Non, le classement n'est pas obligatoire. Cependant, il est fortement recommandé car il valorise votre bien, rassure les locataires, permet d'accéder à un abattement micro-BIC de 50 % (plafond 77 700 €) au lieu de 30 % (plafond 15 000 €) sans classement, et améliore la visibilité sur les plateformes de réservation.",
  },
  {
    question: 'Combien coûte une demande de classement ?',
    answer:
      "Le coût varie selon l'organisme et la catégorie d'étoiles visée, généralement entre 300€ et 800€. Cet investissement est rapidement amorti grâce aux avantages fiscaux et à l'augmentation des revenus locatifs. Contactez-nous pour obtenir un devis personnalisé.",
  },
  {
    question: 'Combien de temps faut-il pour obtenir le classement ?',
    answer:
      "En moyenne, le délai entre le dépôt d'un dossier complet et l'obtention du certificat est de 4 à 6 semaines. Ce délai peut varier selon la période de l'année et la disponibilité des auditeurs pour la visite de contrôle.",
  },
  {
    question: 'Quels sont les critères pris en compte pour le classement ?',
    answer:
      "Les critères incluent la surface minimale, les équipements (literie, cuisine, salle de bain), le confort (chauffage, climatisation), les services (accueil, ménage), l'accessibilité, et le développement durable. Plus vous remplissez de critères, plus votre classement sera élevé.",
  },
  {
    question: 'Puis-je demander un classement supérieur après amélioration de mon bien ?',
    answer:
      "Oui, absolument. Si vous améliorez votre hébergement (rénovation, ajout d'équipements, nouveaux services), vous pouvez à tout moment demander une nouvelle visite de classement pour obtenir un niveau d'étoiles supérieur.",
  },
  {
    question: 'Que se passe-t-il si mon hébergement ne remplit pas les critères ?',
    answer:
      "Si votre hébergement ne remplit pas les critères minimums, l'auditeur vous indiquera les points à améliorer. Vous pourrez alors effectuer les modifications nécessaires et représenter votre dossier. Nous vous accompagnons pour maximiser vos chances de réussite dès la première visite.",
  },
  {
    question: 'Le classement est-il valable dans toute la France ?',
    answer:
      'Oui, le classement des meublés de tourisme est un dispositif national reconnu sur tout le territoire français. Votre certificat de classement est valable partout en France et doit être affiché dans votre hébergement et sur vos annonces.',
  },
];

export default function FAQ() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Foire aux questions</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Retrouvez les réponses aux questions les plus fréquentes sur le classement des meublés
              de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Une autre question ?</h2>
            <p className="text-lg text-textLight mb-8 leading-comfortable">
              Notre équipe est à votre disposition pour répondre à toutes vos questions sur le
              classement de votre meublé de tourisme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Nous contacter
              </Button>
              <Button href="/demande-classement" variant="secondary">
                Demander votre classement
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
