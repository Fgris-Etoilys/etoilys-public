import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';

function SourceLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block text-sm font-medium"
    >
      Source officielle &rarr;
    </a>
  );
}

interface FaqSection {
  title: string;
  items: Array<{ question: string; answer: ReactNode }>;
}

const faqSections: FaqSection[] = [
  {
    title: '1. Définition et bases',
    items: [
      {
        question: "Qu'est-ce qu'un meublé de tourisme ?",
        answer: (
          <>
            Selon l&apos;article D324-1 du Code du tourisme : &laquo;&nbsp;Les meublés de tourisme
            sont des villas, appartements, ou studios meublés, à l&apos;usage exclusif du locataire,
            offerts en location à une clientèle de passage qui y effectue un séjour caractérisé par
            une location à la journée, à la semaine ou au mois, et qui n&apos;y élit pas
            domicile.&nbsp;&raquo; Il s&apos;agit donc d&apos;un logement entier mis à disposition
            d&apos;une clientèle de passage, sans que le locataire n&apos;y établisse son domicile.
            <SourceLink href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039475084" />
          </>
        ),
      },
      {
        question: "Le classement d'un meublé de tourisme est-il obligatoire ?",
        answer: (
          <>
            Non. Le classement est une démarche volontaire. Un logement peut être loué sans être
            classé, à condition de respecter les autres obligations applicables.
            {/* Source secondaire : https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme */}
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: "Combien de catégories d'étoiles existent ?",
        answer: (
          <>
            Le classement officiel comporte 5 catégories, de 1 à 5 étoiles.
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: "Quelle est la différence entre une chambre d'hôtes et un meublé de tourisme ?",
        answer: (
          <>
            Un meublé de tourisme est loué en entier, à l&apos;usage exclusif du locataire. Une
            chambre d&apos;hôtes implique la présence du propriétaire sur place. Une chambre
            d&apos;hôtes ne relève pas du même système officiel de classement en étoiles que le
            meublé de tourisme.
            {/* Source secondaire : https://www.service-public.fr/particuliers/vosdroits/F33175 */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-chambres-dhotes" />
          </>
        ),
      },
      {
        question: 'Une résidence principale peut-elle être classée ?',
        answer: (
          <>
            Oui. Une résidence principale peut être classée en meublé de tourisme si elle respecte
            les prérequis et les critères du classement.
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/une-residence-principale-peut-elle-etre-classee-en-tant" />
          </>
        ),
      },
    ],
  },
  {
    title: '2. Le classement en pratique',
    items: [
      {
        question: 'Combien de temps est valable un classement ?',
        answer: (
          <>
            Le classement est valable 5 ans. À l&apos;issue de cette période, il faut faire une
            nouvelle demande si l&apos;on souhaite continuer à bénéficier du classement.
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: 'Combien coûte un classement ?',
        answer:
          'Le tarif dépend de la région, de la superficie du logement et du nombre de biens à classer au même endroit. Chez Etoilys, il faut généralement compter entre 150\u00a0€ et 250\u00a0€, avec des réductions possibles en cas de classement de plusieurs biens sur un même site.',
      },
      {
        question: 'Combien de temps dure une visite de classement ?',
        answer:
          'Une visite dure en général entre 45 minutes et 2 heures, selon la superficie du logement et ses caractéristiques.',
      },
      {
        question: "Sur quoi porte l'évaluation ?",
        answer: (
          <>
            L&apos;évaluation repose sur une grille nationale de 133 critères, répartis en 3 grands
            chapitres : équipements et aménagements, services au client, accessibilité et
            développement durable.
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: 'Comment se déroule la procédure de classement ?',
        answer: (
          <>
            Le propriétaire choisit un organisme habilité, planifie la visite, puis reçoit un
            certificat de visite comprenant le rapport, la grille de contrôle et la décision
            proposée. Le propriétaire dispose ensuite de 15 jours pour refuser la proposition. Sans
            refus dans ce délai, le classement est acquis.
            {/* Source secondaire : https://www.service-public.fr/demarches-silence-vaut-accord/demarches/1398 */}
            <Link to="/procedure" className="mt-3 block text-sm font-medium">
              Voir notre page dédiée &rarr;
            </Link>
          </>
        ),
      },
      {
        question: 'Qui peut réaliser la visite de classement ?',
        answer: (
          <>
            La visite doit être réalisée par un organisme accrédité ou agréé figurant sur les listes
            publiées par Atout France.
            {/* Source secondaire : https://www.classement.atout-france.fr/nos-documents-de-classement */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/qui-sadresser-pour-faire-classer-son-meuble-de-tourisme" />
          </>
        ),
      },
      {
        question: 'Le classement peut-il se faire à distance ?',
        answer: (
          <>
            Non. La procédure prévoit une visite d&apos;inspection du logement. Le classement repose
            donc sur une visite sur place.
            <SourceLink href="https://www.classement.atout-france.fr/documents/20142/1516337/Guide%2Bde%2Bcontr%C3%B4le%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme.pdf/299cffdd-92c7-839a-ac7a-b13a3e1e81c1?download=true&version=1.0" />
          </>
        ),
      },
      {
        question: 'Peut-on refuser le classement proposé ?',
        answer: (
          <>
            Oui. Le propriétaire peut refuser la proposition de classement dans les 15 jours suivant
            la réception du certificat de visite.
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/principes-communs-au-classement-des" />
          </>
        ),
      },
      {
        question: 'Faut-il afficher quelque chose une fois le logement classé ?',
        answer: (
          <>
            Oui. La décision de classement doit être affichée de manière visible à l&apos;intérieur
            du logement. En revanche, le panonceau extérieur n&apos;est pas obligatoire pour un
            meublé de tourisme, même s&apos;il peut améliorer la visibilité.
            {/* Source secondaire : https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/principes-communs-au-classement-des */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/existe-t-il-des-obligations-en-termes-daffichage-du" />
          </>
        ),
      },
    ],
  },
  {
    title: '3. Fiscalité, avantages et limites',
    items: [
      {
        question: 'Le classement change-t-il quelque chose fiscalement ?',
        answer: (
          <>
            Oui. Pour les revenus 2025 déclarés en 2026, le régime micro-BIC prévoit un abattement
            de 50&nbsp;% pour les meublés de tourisme classés, contre 30&nbsp;% pour les meublés non
            classés.
            <SourceLink href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau" />
          </>
        ),
      },
      {
        question: 'Quels sont les seuils micro-BIC à retenir ?',
        answer: (
          <>
            Pour les revenus 2025 déclarés en 2026, le seuil micro-BIC est de 77&nbsp;700&nbsp;€
            pour les meublés classés et de 15&nbsp;000&nbsp;€ pour les meublés non classés.
            {/* Source secondaire : https://www.service-public.fr/professionnels-entreprises/vosdroits/F39451 */}
            <SourceLink href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau" />
          </>
        ),
      },
      {
        question: 'Le classement change-t-il la taxe de séjour ?',
        answer: (
          <>
            Oui. Un meublé classé relève d&apos;un tarif fixé selon sa catégorie d&apos;étoiles. Un
            meublé non classé ou en attente de classement relève en principe d&apos;un taux
            proportionnel du coût de la nuitée, dans les limites prévues par la collectivité.
            <SourceLink href="https://entreprendre.service-public.fr/vosdroits/F31635" />
          </>
        ),
      },
      {
        question: 'Le classement garantit-il plus de réservations ou plus de revenus ?',
        answer: (
          <>
            Non, pas automatiquement. Le classement est un repère officiel pour les voyageurs et un
            outil de visibilité et de commercialisation, mais il ne constitue pas une garantie de
            revenus ou de taux d&apos;occupation.
            {/* Source secondaire : https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: "Le classement est-il la même chose qu'un label ?",
        answer: (
          <>
            Non. Le classement est un dispositif officiel en étoiles, encadré par le Code du
            tourisme. Un label est une démarche distincte. Il n&apos;existe pas d&apos;équivalence
            automatique entre les labels et les étoiles.
            {/* Source secondaire : https://www.entreprises.gouv.fr/files/files/Publications/2021/Guides/2021-guide-pratique-taxe-sejour.pdf */}
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
    ],
  },
  {
    title: '4. Formalités et cas particuliers',
    items: [
      {
        question: 'Le classement remplace-t-il la déclaration en mairie ?',
        answer: (
          <>
            Non. Le classement ne remplace pas les démarches administratives locales. Selon la
            commune et le type de logement, il peut rester nécessaire de faire une déclaration en
            mairie, d&apos;obtenir un numéro d&apos;enregistrement ou une autorisation de changement
            d&apos;usage.
            {/* Sources secondaires : https://www.service-public.fr/particuliers/vosdroits/F2043
                https://www.service-public.fr/particuliers/vosdroits/F33175 */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: 'Faut-il un numéro SIRET ?',
        answer: (
          <>
            Oui. L&apos;obligation d&apos;obtenir un numéro SIRET s&apos;applique à tous les
            loueurs, professionnels comme non professionnels.
            {/* Source secondaire : https://www.service-public.fr/particuliers/vosdroits/F32744 */}
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/lobligation-dobtenir-un-numero-siret-simpose-t-elle-tous" />
          </>
        ),
      },
      {
        question: 'Peut-on louer sans être classé ?',
        answer: (
          <>
            Oui. Le classement n&apos;est pas obligatoire. En revanche, l&apos;absence de classement
            ne dispense pas de respecter les règles fiscales, déclaratives et locales applicables.
            {/* Source secondaire : https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme */}
            <SourceLink href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme" />
          </>
        ),
      },
      {
        question: 'Les hébergements insolites peuvent-ils être classés comme meublés de tourisme ?',
        answer: (
          <>
            Pas toujours. Pour être classable comme meublé de tourisme, l&apos;hébergement doit être
            une maison ou un appartement reposant sur des fondations, et ne doit pas être
            démontable, transportable ni tractable.
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/les-hebergements-dits-insolites-cabanes-dans-les-arbres" />
          </>
        ),
      },
      {
        question: 'Un propriétaire peut-il demander lui-même le déclassement de son meublé ?',
        answer: (
          <>
            Non. Il n&apos;existe pas de procédure de déclassement à la demande du propriétaire. En
            revanche, l&apos;autorité compétente peut abroger la décision de classement pour
            l&apos;avenir dans certains cas objectifs, par exemple en cas de vente du bien.
            <SourceLink href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/un-loueur-peut-il-renoncer-de-lui-meme-au-classement-de" />
          </>
        ),
      },
    ],
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
          <div className="max-w-3xl mx-auto space-y-10">
            {faqSections.map((section, i) => (
              <div key={i}>
                <h4 className="text-themePrimary-1 mb-5 pb-2 border-b border-primary-200">
                  {section.title}
                </h4>
                <Accordion items={section.items} />
              </div>
            ))}
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
