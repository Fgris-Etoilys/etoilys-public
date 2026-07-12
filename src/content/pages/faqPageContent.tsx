import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { COFRAC_ACCREDITATION_URL } from '../accreditationLinks';
import type { Locale } from '../../i18n/locales';

type FaqPageContent = {
  hero: {
    title: string;
    description: string;
  };
  sourceLinkLabel: string;
  sections: readonly {
    title: string;
    items: readonly {
      question: string;
      answer: ReactNode;
    }[];
  }[];
  finalCta: {
    title: string;
    description: string;
    links: readonly [
      {
        label: string;
        href: string;
        variant: 'primary';
      },
      {
        label: string;
        href: string;
        variant: 'secondary';
      },
    ];
  };
};

const sourceLinkClassName = 'mt-3 block text-sm font-medium';
const accreditationLinkClassName = 'font-medium text-primary-300 underline hover:text-primary-400';

// eslint-disable-next-line react-refresh/only-export-components -- Local JSX helper for structured content.
function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={sourceLinkClassName}>
      {label} &rarr;
    </a>
  );
}

export const faqPageContent: Record<Locale, FaqPageContent> = {
  fr: {
    hero: {
      title: 'FAQ sur le classement des meublés de tourisme',
      description:
        'Retrouvez les réponses aux questions les plus fréquentes sur le classement des meublés de tourisme.',
    },
    sourceLinkLabel: 'Source officielle',
    sections: [
      {
        title: '1. Définition et bases',
        items: [
          {
            question: "Qu'est-ce qu'un meublé de tourisme ?",
            answer: (
              <>
                Selon l&apos;article D324-1 du Code du tourisme : &laquo;&nbsp;Les meublés de
                tourisme sont des villas, appartements, ou studios meublés, à l&apos;usage exclusif
                du locataire, offerts en location à une clientèle de passage qui y effectue un
                séjour caractérisé par une location à la journée, à la semaine ou au mois, et qui
                n&apos;y élit pas domicile.&nbsp;&raquo; Il s&apos;agit donc d&apos;un logement
                entier mis à disposition d&apos;une clientèle de passage, sans que le locataire
                n&apos;y établisse son domicile.
                <SourceLink
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039475084"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: "Le classement d'un meublé de tourisme est-il obligatoire ?",
            answer: (
              <>
                Non. Le classement est une démarche volontaire. Un logement peut être loué sans être
                classé, à condition de respecter les autres obligations applicables.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: "Combien de catégories d'étoiles existent ?",
            answer: (
              <>
                Le classement officiel comporte 5 catégories, de 1 à 5 étoiles.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question:
              "Quelle est la différence entre une chambre d'hôtes et un meublé de tourisme ?",
            answer: (
              <>
                Un meublé de tourisme est loué en entier, à l&apos;usage exclusif du locataire. Une
                chambre d&apos;hôtes implique la présence du propriétaire sur place. Une chambre
                d&apos;hôtes ne relève pas du même système officiel de classement en étoiles que le
                meublé de tourisme.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-chambres-dhotes"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Une résidence principale peut-elle être classée ?',
            answer: (
              <>
                Oui. Une résidence principale peut être classée si elle respecte les prérequis et
                les critères du classement. En revanche, le classement ne modifie pas les règles de
                durée de location applicables à une résidence principale.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/une-residence-principale-peut-elle-etre-classee-en-tant"
                  label="Source officielle"
                />
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
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Combien coûte un classement ?',
            answer:
              "Le prix d'une visite dépend du logement, de sa localisation et du nombre de biens concernés. Pour obtenir un tarif adapté, le plus simple est de déposer une demande : Etoilys vous confirme les modalités avant validation.",
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
                L&apos;évaluation repose sur une grille nationale de 133 critères, répartis en 3
                grands chapitres : équipements et aménagements, services au client, accessibilité et
                développement durable.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Comment se déroule la procédure de classement ?',
            answer: (
              <>
                Le propriétaire choisit un organisme habilité, planifie la visite, puis reçoit un
                certificat de visite comprenant le rapport, la grille de contrôle et la décision
                proposée. Le propriétaire dispose ensuite de 15 jours pour refuser la proposition.
                Sans refus dans ce délai, le classement est acquis.
                <Link to="/procedure" className={sourceLinkClassName}>
                  Voir notre page dédiée &rarr;
                </Link>
              </>
            ),
          },
          {
            question: 'Qui peut réaliser la visite de classement ?',
            answer: (
              <>
                La visite doit être réalisée par un organisme accrédité ou agréé figurant sur les
                listes publiées par Atout France. Etoilys est un{' '}
                <a
                  href={COFRAC_ACCREDITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={accreditationLinkClassName}
                >
                  organisme de contrôle accrédité Cofrac Inspection n°3-2394
                </a>{' '}
                pour le classement des meublés de tourisme.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/qui-sadresser-pour-faire-classer-son-meuble-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Le classement peut-il se faire à distance ?',
            answer: (
              <>
                Non. La procédure prévoit une visite d&apos;inspection du logement. Le classement
                repose donc sur une visite sur place.
                <SourceLink
                  href="https://www.classement.atout-france.fr/documents/20142/1516337/Guide%2Bde%2Bcontr%C3%B4le%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme.pdf/299cffdd-92c7-839a-ac7a-b13a3e1e81c1?download=true&version=1.0"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Peut-on refuser le classement proposé ?',
            answer: (
              <>
                Oui. Le propriétaire peut refuser la proposition de classement dans les 15 jours
                suivant la réception du certificat de visite.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/principes-communs-au-classement-des"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Faut-il afficher quelque chose une fois le logement classé ?',
            answer: (
              <>
                Oui. La décision de classement doit être affichée de manière visible à
                l&apos;intérieur du logement. En revanche, le panonceau extérieur n&apos;est pas
                obligatoire pour un meublé de tourisme, même s&apos;il peut améliorer la visibilité.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/existe-t-il-des-obligations-en-termes-daffichage-du"
                  label="Source officielle"
                />
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
                Oui. Pour les revenus 2026 déclarés en 2027, les meublés de tourisme classés
                bénéficient d’un abattement micro-BIC de 50&nbsp;%, contre 30&nbsp;% pour les
                meublés non classés.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Quels sont les seuils micro-BIC à retenir ?',
            answer: (
              <>
                Pour les revenus 2026 déclarés en 2027, le régime micro-BIC s’applique jusqu’à
                83&nbsp;600&nbsp;€ de recettes pour un meublé classé, contre 15&nbsp;000&nbsp;€ pour
                un meublé non classé.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Le classement change-t-il la taxe de séjour ?',
            answer: (
              <>
                Oui. Un meublé classé relève d&apos;un tarif fixé selon sa catégorie d&apos;étoiles.
                Un meublé non classé ou en attente de classement relève en principe d&apos;un taux
                proportionnel du coût de la nuitée, dans les limites prévues par la collectivité.
                <SourceLink
                  href="https://entreprendre.service-public.fr/vosdroits/F31635"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Le classement garantit-il plus de réservations ou plus de revenus ?',
            answer: (
              <>
                Non, pas automatiquement. Le classement est un repère officiel pour les voyageurs et
                un outil de visibilité et de commercialisation, mais il ne constitue pas une
                garantie de revenus ou de taux d&apos;occupation.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: "Le classement est-il la même chose qu'un label ?",
            answer: (
              <>
                Non. Le classement est un dispositif officiel en étoiles, encadré par le Code du
                tourisme. Un label est une démarche distincte. Il n&apos;existe pas
                d&apos;équivalence automatique entre les labels et les étoiles.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
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
                commune et le type de logement, il peut rester nécessaire de faire une déclaration
                en mairie, d&apos;obtenir un numéro d&apos;enregistrement ou une autorisation de
                changement d&apos;usage.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Faut-il un numéro SIRET ?',
            answer: (
              <>
                Oui. L&apos;obligation d&apos;obtenir un numéro SIRET s&apos;applique à tous les
                loueurs, professionnels comme non professionnels.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/lobligation-dobtenir-un-numero-siret-simpose-t-elle-tous"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Peut-on louer sans être classé ?',
            answer: (
              <>
                Oui. Le classement n&apos;est pas obligatoire. En revanche, l&apos;absence de
                classement ne dispense pas de respecter les règles fiscales, déclaratives et locales
                applicables.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question:
              'Les hébergements insolites peuvent-ils être classés comme meublés de tourisme ?',
            answer: (
              <>
                Pas toujours. Pour être classable comme meublé de tourisme, l&apos;hébergement doit
                être une maison ou un appartement reposant sur des fondations, et ne doit pas être
                démontable, transportable ni tractable.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/les-hebergements-dits-insolites-cabanes-dans-les-arbres"
                  label="Source officielle"
                />
              </>
            ),
          },
          {
            question: 'Un propriétaire peut-il demander lui-même le déclassement de son meublé ?',
            answer: (
              <>
                Non. Il n&apos;existe pas de procédure de déclassement à la demande du propriétaire.
                En revanche, l&apos;autorité compétente peut abroger la décision de classement pour
                l&apos;avenir dans certains cas objectifs, par exemple en cas de vente du bien.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/un-loueur-peut-il-renoncer-de-lui-meme-au-classement-de"
                  label="Source officielle"
                />
              </>
            ),
          },
        ],
      },
    ],
    finalCta: {
      title: 'Une autre question ?',
      description:
        'Notre équipe est à votre disposition pour répondre à toutes vos questions sur le classement de votre meublé de tourisme.',
      links: [
        { label: 'Nous contacter', href: '/contact', variant: 'primary' },
        { label: 'Demander votre classement', href: '/demande-classement', variant: 'secondary' },
      ],
    },
  },
  en: {
    hero: {
      title: 'FAQ on furnished tourist accommodation classification',
      description:
        'Find answers to common questions about the official French classification of furnished tourist accommodation.',
    },
    sourceLinkLabel: 'Official French source',
    sections: [
      {
        title: '1. Definition and basics',
        items: [
          {
            question: 'What is furnished tourist accommodation?',
            answer: (
              <>
                Under the French Tourism Code, furnished tourist accommodation means furnished
                villas, apartments or studios made available for the exclusive use of the tenant, to
                passing customers staying by the day, week or month and not making it their home. It
                is therefore a whole property made available to passing customers.
                <SourceLink
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039475084"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Is furnished tourist accommodation classification mandatory?',
            answer: (
              <>
                No. Classification is voluntary. Accommodation can be rented without being
                classified, provided the other applicable obligations are respected.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'How many star categories exist?',
            answer: (
              <>
                The official classification has 5 categories, from 1 to 5 stars.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question:
              'What is the difference between a bed and breakfast room and furnished tourist accommodation?',
            answer: (
              <>
                Furnished tourist accommodation is rented as a whole property for the tenant&apos;s
                exclusive use. A bed and breakfast room involves the owner being present on site. It
                does not fall under the same official star classification system as furnished
                tourist accommodation.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-chambres-dhotes"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can a main residence be classified?',
            answer: (
              <>
                Yes. A main residence can be classified if it meets the prerequisites and criteria
                for classification. However, classification does not change the rental duration
                rules that apply to a main residence.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/une-residence-principale-peut-elle-etre-classee-en-tant"
                  label="Official French source"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '2. Classification in practice',
        items: [
          {
            question: 'How long is a classification valid?',
            answer: (
              <>
                Classification is valid for 5 years. At the end of this period, a new request is
                needed if the owner wants the accommodation to continue benefiting from
                classification.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'How much does classification cost?',
            answer:
              'The price of an inspection depends on the property, its location and the number of properties concerned. To obtain an adapted price, the simplest option is to submit a request: Etoilys confirms the arrangements before validation.',
          },
          {
            question: 'How long does a classification inspection take?',
            answer:
              'An inspection generally lasts between 45 minutes and 2 hours, depending on the property size and characteristics.',
          },
          {
            question: 'What does the assessment cover?',
            answer: (
              <>
                The assessment is based on a national grid of 133 criteria, divided into 3 main
                chapters: equipment and fittings, customer services, accessibility and sustainable
                development.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'How does the classification process work?',
            answer: (
              <>
                The owner chooses an authorised body, schedules the inspection and then receives an
                inspection certificate including the report, the inspection grid and the proposed
                decision. The owner then has 15 days to refuse the proposal. If there is no refusal
                within that period, the classification is acquired.
                <Link to="/en/classification-process" className={sourceLinkClassName}>
                  See the dedicated page &rarr;
                </Link>
              </>
            ),
          },
          {
            question: 'Who can carry out the classification inspection?',
            answer: (
              <>
                The inspection must be carried out by an accredited or approved body listed by Atout
                France. Etoilys is a{' '}
                <a
                  href={COFRAC_ACCREDITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={accreditationLinkClassName}
                >
                  Cofrac Inspection accredited inspection body, no. 3-2394
                </a>
                , for furnished tourist accommodation classification.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/qui-sadresser-pour-faire-classer-son-meuble-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can classification be carried out remotely?',
            answer: (
              <>
                No. The procedure requires an inspection visit of the accommodation. Classification
                is therefore based on an on-site visit.
                <SourceLink
                  href="https://www.classement.atout-france.fr/documents/20142/1516337/Guide%2Bde%2Bcontr%C3%B4le%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme.pdf/299cffdd-92c7-839a-ac7a-b13a3e1e81c1?download=true&version=1.0"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can the proposed classification be refused?',
            answer: (
              <>
                Yes. The owner can refuse the classification proposal within 15 days of receiving
                the inspection certificate.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/principes-communs-au-classement-des"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Must anything be displayed once the accommodation is classified?',
            answer: (
              <>
                Yes. The classification decision must be displayed visibly inside the accommodation.
                By contrast, the external sign is not mandatory for furnished tourist accommodation,
                even though it can improve visibility.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/existe-t-il-des-obligations-en-termes-daffichage-du"
                  label="Official French source"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '3. Tax, benefits and limits',
        items: [
          {
            question: 'Does classification change anything for tax purposes?',
            answer: (
              <>
                Yes. For 2026 income declared in 2027, classified furnished tourist accommodation
                benefits from a 50% micro-BIC tax allowance, compared with 30% for non-classified
                accommodation.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Which micro-BIC thresholds apply?',
            answer: (
              <>
                For 2026 income declared in 2027, the micro-BIC regime applies to revenue of up to
                €83,600 for classified furnished tourist accommodation, compared with €15,000 for
                non-classified accommodation.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Does classification change tourist tax?',
            answer: (
              <>
                Yes. Classified furnished tourist accommodation falls under a tariff set according
                to its star category. Non-classified accommodation, or accommodation awaiting
                classification, generally falls under a proportional rate based on the overnight
                price, within the limits set by the local authority.
                <SourceLink
                  href="https://entreprendre.service-public.fr/vosdroits/F31635"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Does classification guarantee more bookings or higher income?',
            answer: (
              <>
                No, not automatically. Classification is an official reference point for travellers
                and a commercial information tool, but it is not a guarantee of income or occupancy
                rate.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Is classification the same thing as a label?',
            answer: (
              <>
                No. Classification is an official star-rating system governed by the French Tourism
                Code. A label is a separate process. There is no automatic equivalence between
                labels and stars.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '4. Formalities and specific cases',
        items: [
          {
            question: 'Does classification replace declaration to the town hall?',
            answer: (
              <>
                No. Classification does not replace local administrative procedures. Depending on
                the municipality and the type of accommodation, it may still be necessary to make a
                declaration to the town hall, obtain a registration number or obtain change of use
                authorisation.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Is a SIRET number required?',
            answer: (
              <>
                Yes. The obligation to obtain a SIRET number applies to all lessors, whether
                professional or non-professional.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/lobligation-dobtenir-un-numero-siret-simpose-t-elle-tous"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can accommodation be rented without classification?',
            answer: (
              <>
                Yes. Classification is not mandatory. However, the absence of classification does
                not remove the need to comply with applicable tax, declaration and local rules.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can unusual accommodation be classified as furnished tourist accommodation?',
            answer: (
              <>
                Not always. To be classifiable as furnished tourist accommodation, the accommodation
                must be a house or apartment resting on foundations and must not be removable,
                transportable or towable.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/les-hebergements-dits-insolites-cabanes-dans-les-arbres"
                  label="Official French source"
                />
              </>
            ),
          },
          {
            question: 'Can an owner request the declassification of their accommodation?',
            answer: (
              <>
                No. There is no declassification procedure at the owner&apos;s request. However, the
                competent authority may revoke the classification decision for the future in certain
                objective cases, for example if the property is sold.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/un-loueur-peut-il-renoncer-de-lui-meme-au-classement-de"
                  label="Official French source"
                />
              </>
            ),
          },
        ],
      },
    ],
    finalCta: {
      title: 'Another question?',
      description:
        'Our team is available to answer all your questions about the classification of your furnished tourist accommodation.',
      links: [
        { label: 'Contact Etoilys', href: '/en/contact', variant: 'primary' },
        {
          label: 'Request your classification',
          href: '/en/request-a-classification',
          variant: 'secondary',
        },
      ],
    },
  },
  nl: {
    hero: {
      title: 'FAQ over classificatie van vakantiewoningen in Frankrijk',
      description:
        'Antwoorden op veelgestelde vragen over de officiële Franse classificatie van vakantiewoningen, juridisch meublés de tourisme.',
    },
    sourceLinkLabel: 'Officiële Franse bron',
    sections: [
      {
        title: '1. Definitie en basis',
        items: [
          {
            question: 'Wat is een meublé de tourisme?',
            answer: (
              <>
                Volgens de Franse Code du tourisme zijn meublés de tourisme gemeubileerde villa’s,
                appartementen of studio’s, voor exclusief gebruik door de huurder, verhuurd aan
                reizigers die er per dag, week of maand verblijven en er niet hun woonplaats
                vestigen. Het gaat dus om een volledige vakantiewoning voor tijdelijke gasten.
                <SourceLink
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039475084"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Is classificatie van een vakantiewoning verplicht?',
            answer: (
              <>
                Nee. Classificatie is vrijwillig. Een woning kan zonder classificatie worden
                verhuurd, mits de andere toepasselijke verplichtingen worden nageleefd.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Hoeveel sterrencategorieën bestaan er?',
            answer: (
              <>
                De officiële classificatie kent 5 categorieën, van 1 tot 5 sterren.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Wat is het verschil tussen een chambre d’hôtes en een meublé de tourisme?',
            answer: (
              <>
                Een meublé de tourisme wordt als volledige woning verhuurd, voor exclusief gebruik
                door de huurder. Een chambre d’hôtes houdt in dat de eigenaar ter plaatse aanwezig
                is. Zij valt niet onder hetzelfde officiële sterrenclassificatiesysteem.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-chambres-dhotes"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Kan een hoofdverblijf worden geclassificeerd?',
            answer: (
              <>
                Ja. Een hoofdverblijf kan worden geclassificeerd als het aan de voorwaarden en
                criteria voldoet. Classificatie verandert echter niet de verhuurduurregels die op
                een hoofdverblijf van toepassing zijn.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/une-residence-principale-peut-elle-etre-classee-en-tant"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '2. Classificatie in de praktijk',
        items: [
          {
            question: 'Hoe lang is een classificatie geldig?',
            answer: (
              <>
                Een classificatie is 5 jaar geldig. Na deze periode is een nieuwe aanvraag nodig om
                de classificatie te behouden.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Hoeveel kost een classificatie?',
            answer:
              'De prijs van een bezoek hangt af van de woning, de ligging en het aantal betrokken woningen. Voor een passend tarief kan een aanvraag worden ingediend: Etoilys bevestigt de voorwaarden vóór validatie.',
          },
          {
            question: 'Hoe lang duurt een classificatiebezoek?',
            answer:
              'Een bezoek duurt meestal tussen 45 minuten en 2 uur, afhankelijk van de oppervlakte en kenmerken van de woning.',
          },
          {
            question: 'Waarop heeft de beoordeling betrekking?',
            answer: (
              <>
                De beoordeling berust op een nationale lijst van 133 criteria, verdeeld over 3
                hoofdstukken: uitrusting en inrichting, diensten aan de klant, toegankelijkheid en
                duurzame ontwikkeling.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Hoe verloopt de classificatieprocedure?',
            answer: (
              <>
                De eigenaar kiest een bevoegde instantie, plant het bezoek en ontvangt vervolgens
                een inspectiecertificaat met het rapport, de controlelijst en het voorgestelde
                besluit. De eigenaar heeft daarna 15 dagen om het voorstel te weigeren. Zonder
                weigering binnen die termijn is de classificatie verworven.
                <Link
                  to="/nl/classificatieprocedure-vakantiewoning"
                  className={sourceLinkClassName}
                >
                  Bekijk de pagina over de procedure &rarr;
                </Link>
              </>
            ),
          },
          {
            question: 'Wie mag het classificatiebezoek uitvoeren?',
            answer: (
              <>
                Het bezoek moet worden uitgevoerd door een geaccrediteerde of goedgekeurde instantie
                die voorkomt op de lijsten van Atout France. Etoilys is een{' '}
                <a
                  href={COFRAC_ACCREDITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={accreditationLinkClassName}
                >
                  door Cofrac Inspection geaccrediteerde controle-instantie, nr. 3-2394
                </a>{' '}
                voor de classificatie van meublés de tourisme.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/qui-sadresser-pour-faire-classer-son-meuble-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Kan classificatie op afstand plaatsvinden?',
            answer: (
              <>
                Nee. De procedure voorziet in een inspectiebezoek van de woning. Classificatie
                berust dus op een bezoek ter plaatse.
                <SourceLink
                  href="https://www.classement.atout-france.fr/documents/20142/1516337/Guide%2Bde%2Bcontr%C3%B4le%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme.pdf/299cffdd-92c7-839a-ac7a-b13a3e1e81c1?download=true&version=1.0"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Kan het voorgestelde classificatieniveau worden geweigerd?',
            answer: (
              <>
                Ja. De eigenaar kan het classificatievoorstel weigeren binnen 15 dagen na ontvangst
                van het inspectiecertificaat.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/principes-communs-au-classement-des"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Moet er iets worden opgehangen nadat de woning is geclassificeerd?',
            answer: (
              <>
                Ja. Het classificatiebesluit moet zichtbaar in de woning worden aangebracht. Het
                buitenbord is daarentegen niet verplicht voor een meublé de tourisme, ook al kan het
                worden gebruikt.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/existe-t-il-des-obligations-en-termes-daffichage-du"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '3. Fiscaliteit, voordelen en grenzen',
        items: [
          {
            question: 'Verandert classificatie iets fiscaal?',
            answer: (
              <>
                Ja. Voor inkomsten over 2026 die in 2027 worden aangegeven, geldt voor
                geclassificeerde meublés de tourisme een micro-BIC-aftrek van 50%, tegenover 30%
                voor niet-geclassificeerde woningen.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Welke micro-BIC-drempels gelden?',
            answer: (
              <>
                Voor inkomsten over 2026 die in 2027 worden aangegeven, geldt het micro-BIC-regime
                tot 83.600 euro omzet voor een geclassificeerde woning, tegenover 15.000 euro voor
                een niet-geclassificeerde woning.
                <SourceLink
                  href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Verandert classificatie de toeristenbelasting?',
            answer: (
              <>
                Ja. Een geclassificeerde vakantiewoning valt onder een tarief volgens de
                sterrencategorie. Een niet-geclassificeerde woning of een woning in afwachting van
                classificatie valt in principe onder een proportioneel tarief op de nachtprijs,
                binnen de grenzen van de lokale overheid.
                <SourceLink
                  href="https://entreprendre.service-public.fr/vosdroits/F31635"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Garandeert classificatie meer boekingen of hogere inkomsten?',
            answer: (
              <>
                Nee, niet automatisch. Classificatie is een officieel herkenningspunt voor reizigers
                en een informatie-instrument, maar geen garantie voor inkomsten of bezettingsgraad.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Is classificatie hetzelfde als een label?',
            answer: (
              <>
                Nee. Classificatie is een officieel sterrensysteem dat door de Code du tourisme
                wordt geregeld. Een label is een aparte procedure. Er bestaat geen automatische
                gelijkwaardigheid tussen labels en sterren.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
        ],
      },
      {
        title: '4. Formaliteiten en bijzondere gevallen',
        items: [
          {
            question: 'Vervangt classificatie de aangifte bij de gemeente?',
            answer: (
              <>
                Nee. Classificatie vervangt lokale administratieve stappen niet. Afhankelijk van de
                gemeente en het type woning kan een aangifte bij de gemeente, een registratienummer
                of een toestemming voor wijziging van gebruik nodig blijven.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Is een SIRET-nummer verplicht?',
            answer: (
              <>
                Ja. De verplichting om een SIRET-nummer te verkrijgen geldt voor alle verhuurders,
                professioneel en niet-professioneel.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/lobligation-dobtenir-un-numero-siret-simpose-t-elle-tous"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Kan een woning zonder classificatie worden verhuurd?',
            answer: (
              <>
                Ja. Classificatie is niet verplicht. Het ontbreken van classificatie ontslaat echter
                niet van fiscale, declaratieve en lokale regels die van toepassing zijn.
                <SourceLink
                  href="https://www.classement.atout-france.fr/le-classement-des-meubles-de-tourisme"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question:
              'Kunnen bijzondere accommodaties als meublé de tourisme worden geclassificeerd?',
            answer: (
              <>
                Niet altijd. Om classificeerbaar te zijn als meublé de tourisme, moet de
                accommodatie een huis of appartement op funderingen zijn en mag zij niet
                demonteerbaar, verplaatsbaar of sleepbaar zijn.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/les-hebergements-dits-insolites-cabanes-dans-les-arbres"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
          {
            question: 'Kan een eigenaar zelf om declassificatie vragen?',
            answer: (
              <>
                Nee. Er bestaat geen declassificatieprocedure op verzoek van de eigenaar. De
                bevoegde autoriteit kan het classificatiebesluit wel voor de toekomst intrekken in
                bepaalde objectieve gevallen, bijvoorbeeld bij verkoop van de woning.
                <SourceLink
                  href="https://www.entreprises.gouv.fr/espace-entreprises/faq/meubles-de-tourisme/un-loueur-peut-il-renoncer-de-lui-meme-au-classement-de"
                  label="Officiële Franse bron"
                />
              </>
            ),
          },
        ],
      },
    ],
    finalCta: {
      title: 'Nog een vraag?',
      description:
        'Ons team kan vragen beantwoorden over de classificatie van uw vakantiewoning in Frankrijk.',
      links: [
        { label: 'Contact met Etoilys', href: '/nl/contact', variant: 'primary' },
        {
          label: 'Classificatie aanvragen',
          href: '/nl/classificatie-aanvragen',
          variant: 'secondary',
        },
      ],
    },
  },
};
