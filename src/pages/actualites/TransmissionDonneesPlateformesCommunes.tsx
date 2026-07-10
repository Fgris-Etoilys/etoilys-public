import { Link } from 'react-router-dom';
import ArticleHeaderMeta from '../../components/ui/ArticleHeaderMeta';
import Button from '../../components/ui/Button';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';

const transmittedDataColumns = [
  {
    key: 'data',
    label: 'Donnée',
    widthClassName: 'w-[25%]',
    cellClassName: 'font-medium text-gray-700',
  },
  {
    key: 'example',
    label: 'Exemple concret',
    widthClassName: 'w-[32%]',
    cellClassName: 'text-gray-600',
  },
  {
    key: 'importance',
    label: "Pourquoi c'est important",
    widthClassName: 'w-[43%]',
    cellClassName: 'text-gray-600',
  },
];

const transmittedDataRows = [
  {
    key: 'registration-number',
    cells: {
      data: "Numéro d'enregistrement",
      example: "Le numéro affiché sur l'annonce",
      importance: 'Vérifier que le logement est bien déclaré',
    },
  },
  {
    key: 'listing-url',
    cells: {
      data: "URL de l'annonce",
      example: 'Lien Airbnb, Booking, Abritel',
      importance: 'Relier une annonce en ligne à un logement',
    },
  },
  {
    key: 'address',
    cells: {
      data: 'Adresse précise',
      example: 'Adresse du meublé',
      importance: 'Identifier le bien concerné',
    },
  },
  {
    key: 'rental-days',
    cells: {
      data: 'Nombre de jours loués',
      example: 'Jours loués via chaque plateforme',
      importance: 'Contrôler les plafonds de location',
    },
  },
  {
    key: 'owner-data',
    cells: {
      data: 'Données du loueur, si connues',
      example: 'Nom, SIRET, email, adresse',
      importance: 'Identifier le loueur ou le déclarant',
    },
  },
  {
    key: 'property-status',
    cells: {
      data: 'Statut du logement, si connu',
      example: 'Résidence principale ou non',
      importance: 'Vérifier les règles de durée applicables',
    },
  },
];

export default function ArticleTransmissionDonneesPlateformesCommunes() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <ArticleHeaderMeta readingTime="9 min de lecture" />
            <h1 className="mb-0 text-white">
              Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?
            </h1>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-comfortable text-gray-700 mb-10">
              Depuis 2026, les communes disposent d&apos;un nouvel outil pour contrôler les meublés
              de tourisme loués via des plateformes comme Airbnb, Booking ou Abritel :{' '}
              <strong>l&apos;API Meublés</strong>. Lorsqu&apos;un logement est loué par
              l&apos;intermédiaire d&apos;une plateforme, celle-ci transmet notamment le numéro
              d&apos;enregistrement, l&apos;adresse du logement, l&apos;URL de l&apos;annonce et le
              nombre de jours loués. Toutes les communes ne reçoivent pas toutes les données
              automatiquement, mais le contrôle devient beaucoup plus simple pour celles qui
              s&apos;inscrivent et demandent à utiliser le dispositif.
            </p>

            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Lorsqu'un meublé est loué via Airbnb, Booking, Abritel ou une autre plateforme, l'intermédiaire transmet des données d'activité dans le cadre prévu par l'API Meublés, lorsque la commune ou l'intercommunalité utilise le dispositif.",
                  "Les données principales concernent le numéro d'enregistrement, l'adresse du logement, les URL d'annonces et le nombre de jours loués.",
                  "Les communes et les intercommunalités, c'est-à-dire les regroupements de communes compétents sur certains sujets comme le tourisme, utilisent ces données pour contrôler les obligations applicables aux meublés.",
                  "L'API Meublés rend plus visibles certaines incohérences : faux numéro, ancien numéro devenu invalide, adresse incohérente ou dépassement du plafond de jours pour une résidence principale.",
                  "L'API Meublés ne sert pas au suivi des paiements de taxe de séjour, qui relève d'un autre dispositif.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="mt-12 mb-4">
              Pourquoi les données des plateformes remontent-elles aux communes ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le développement des plateformes de réservation a rendu le contrôle local plus
              complexe. Une même location peut être publiée sur plusieurs sites, avec des annonces,
              des calendriers et parfois des informations différentes. Pour connaître
              l&apos;activité d&apos;un logement, une commune devait auparavant demander des
              informations séparément à chaque intermédiaire.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La Direction générale des Entreprises présente l&apos;API Meublés comme un{' '}
              <strong>guichet unique de centralisation des données d&apos;activité</strong>{' '}
              transmises par les intermédiaires de location. La commune ou l&apos;intercommunalité
              inscrite peut ainsi accéder, depuis un même outil, aux données demandées pour son
              territoire.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le numéro d&apos;enregistrement sert de clé pour rapprocher le registre du meublé, son
              adresse, ses annonces en ligne et les jours loués par chaque intermédiaire. Les
              collectivités peuvent alors vérifier plus facilement la cohérence des déclarations,
              contrôler les obligations locales et disposer de statistiques sur l&apos;activité
              touristique.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                L&apos;accès n&apos;est pas automatique partout. Une commune ou une intercommunalité
                doit s&apos;inscrire dans l&apos;API Meublés et demander explicitement les données
                d&apos;activité correspondant à son territoire.
              </p>
            </div>

            <h2 className="mt-12 mb-4">Quelles plateformes sont concernées ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le texte ne vise pas seulement Airbnb. Il concerne plus largement les intermédiaires
              qui prêtent leur concours à la mise en location d&apos;un meublé de tourisme. En
              pratique, cela vise les grandes plateformes de réservation, comme Airbnb, Booking et
              Abritel, mais aussi tout acteur entrant dans ce rôle d&apos;intermédiaire.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Chaque intermédiaire transmet les données relatives aux locations réalisées par son
              propre service. L&apos;API permet ensuite à la collectivité de rapprocher les
              informations plateforme par plateforme autour du même numéro d&apos;enregistrement.
              Une activité répartie entre plusieurs sites devient donc plus simple à reconstituer.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Une réservation conclue directement par le propriétaire, sans intermédiaire, ne
              constitue pas une donnée transmise par Airbnb, Booking ou Abritel. Elle reste
              toutefois soumise aux obligations applicables au logement. Le code du tourisme permet
              notamment à la commune de demander au loueur un décompte des jours pendant lesquels le
              meublé a été loué.
            </p>

            <h2 className="mt-12 mb-4">Quelles données sont transmises ?</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le décret du 19 mars 2026 distingue les données que l&apos;intermédiaire doit
              transmettre pour chaque meublé loué et celles qu&apos;il transmet seulement s&apos;il
              les connaît.
            </p>
            <ResponsiveComparisonTable
              columns={transmittedDataColumns}
              rows={transmittedDataRows}
              primaryColumnKey="data"
              caption="Données relatives aux meublés de tourisme transmises dans le cadre de l'API Meublés"
              className="mb-6"
              bodyClassName="[&>tr:nth-child(even)]:bg-gray-50 [&>tr]:border-b [&>tr]:border-gray-100"
              mobileValueClassName="text-sm text-gray-900 text-left"
            />
            <p className="text-gray-700 leading-comfortable mb-4">
              Quatre données sont au cœur de la transmission obligatoire : le numéro
              d&apos;enregistrement, les URL des annonces publiées en ligne, l&apos;adresse précise
              du meublé et le nombre de jours loués par l&apos;intermédiaire pendant la période
              concernée.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              D&apos;autres informations sont transmises lorsque l&apos;intermédiaire en a
              connaissance : identité et coordonnées du loueur, SIRET, statut de résidence
              principale, caractère professionnel de l&apos;activité ou encore total annuel des
              jours loués par cet intermédiaire.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L&apos;objectif est de relier sans ambiguïté une annonce, un logement, un numéro
              d&apos;enregistrement et une activité de location. Le système peut aussi intégrer les
              informations des registres communaux lorsque les collectivités choisissent de les
              transmettre, ce qui facilite les contrôles de cohérence.
            </p>

            <h2 className="mt-12 mb-4">
              Est-ce que les communes verront aussi vos revenus, vos paiements ou la taxe de séjour
              ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              <strong>
                Non, l&apos;API Meublés n&apos;est pas un outil de suivi des revenus locatifs.
              </strong>{' '}
              Les données obligatoires transmises par les plateformes portent sur
              l&apos;identification du meublé, ses annonces et son activité en nombre de jours, pas
              sur le montant des loyers encaissés ni sur le détail des paiements des voyageurs.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L&apos;API Meublés n&apos;est pas non plus le système de collecte ou de suivi de la
              taxe de séjour. La DGE la distingue expressément de <strong>FARITAS</strong>, le
              dispositif expérimental de télédéclaration de la taxe de séjour collectée par les
              opérateurs numériques, prévu jusqu&apos;à la fin de l&apos;année 2026.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les plateformes peuvent transmettre des informations fiscales à l&apos;administration
              fiscale dans le cadre d&apos;autres règles. Cette transmission est distincte de
              l&apos;accès accordé aux communes et intercommunalités par l&apos;API Meublés.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                Autrement dit, l&apos;API Meublés sert d&apos;abord à contrôler l&apos;existence,
                l&apos;adresse, les annonces et l&apos;activité déclarée des meublés de tourisme. Ce
                n&apos;est pas l&apos;outil qui calcule votre impôt, ni celui qui suit le paiement
                de votre taxe de séjour.
              </p>
            </div>

            <h2 className="mt-12 mb-4">
              Depuis quand et à quel rythme les données sont-elles transmises ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les décrets n° 2026-196 et n° 2026-197 du <strong>19 mars 2026</strong> ont précisé le
              cadre de transmission et créé le traitement de données API Meublés. La version bêta,
              destinée aux collectivités déjà habilitées, a été déployée à partir de mars 2026. La
              DGE annonce la version finale pour le <strong>second semestre 2026</strong>, sans
              fixer à ce stade de date d&apos;ouverture plus précise.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour la majorité des intermédiaires, la période de transmission est{' '}
              <strong>mensuelle</strong>. Elle est <strong>trimestrielle</strong> pour certaines
              microentreprises et petites entreprises qui restent sous le seuil réglementaire de
              référencements. La transmission intervient au plus tard un mois après la fin de la
              période concernée.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Dans la version finale, les loueurs devront demander un nouveau numéro
              d&apos;enregistrement national pour chaque meublé de tourisme via le téléservice
              national. Les anciens numéros locaux resteront utilisables pendant une période
              transitoire, puis deviendront invalides.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette transition concerne l&apos;enregistrement des logements. Pour un décryptage
              centré sur cette démarche, vous pouvez{' '}
              <Link
                to="/actualites/api-meubles-declaration-meuble-tourisme"
                className="article-inline-link"
              >
                comprendre le fonctionnement de l&apos;API Meublés
              </Link>{' '}
              et le calendrier annoncé pour le nouveau numéro national.
            </p>

            <h2 className="mt-12 mb-4">
              Ce que cela change pour les logements non déclarés ou mal déclarés
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              L&apos;API Meublés ne crée pas toutes les obligations applicables aux locations
              touristiques. La déclaration, l&apos;enregistrement dans certaines communes et les
              plafonds de location d&apos;une résidence principale existaient déjà. Le changement
              porte surtout sur la capacité à rapprocher les données.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Avant, une commune devait souvent demander des informations plateforme par plateforme.
              Avec l&apos;API Meublés, les données d&apos;activité sont centralisées autour du
              numéro d&apos;enregistrement. Cela rend plus visibles les annonces sans numéro là où
              il est obligatoire, les faux numéros, les anciens numéros devenus invalides, les
              adresses incohérentes ou les dépassements de durée pour les résidences principales.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La commune peut comparer le numéro, l&apos;adresse, les URL d&apos;annonces, le statut
              de résidence principale lorsqu&apos;il est connu et le nombre de jours déclaré par
              chaque plateforme. Répartir les réservations entre plusieurs intermédiaires ne rend
              donc plus aussi difficile la reconstitution du total d&apos;activité.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le code prévoit également que la collectivité soit informée lorsqu&apos;un logement
              déclaré comme résidence principale dépasse 120 jours de location, ou le plafond local
              abaissé entre 90 et 119 jours. Les données présentes dans l&apos;API peuvent être
              utilisées par les communes dans le cadre de leurs contrôles et de leurs contentieux.
            </p>

            <h2 className="mt-12 mb-4">Ce que cela change concrètement pour un propriétaire</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le point pratique est la cohérence entre la déclaration du logement, les annonces
              publiées et l&apos;activité réelle. Les vérifications suivantes permettent
              d&apos;identifier les écarts avant qu&apos;ils ne ressortent lors d&apos;un contrôle :
            </p>
            <div className="space-y-4 mb-8 text-gray-700">
              {[
                "Vérifier que le numéro d'enregistrement affiché sur chaque annonce est correct.",
                "Vérifier que l'adresse du logement est cohérente entre la déclaration, les plateformes et les annonces.",
                'Demander le nouveau NER national quand la version finale du téléservice sera ouverte.',
                "Remplacer l'ancien numéro pendant la période transitoire, avant qu'il ne devienne invalide.",
                'Suivre le nombre de jours loués, surtout pour une résidence principale.',
                "Ne pas supposer que « si la plateforme accepte l'annonce, tout est conforme ».",
                'Garder aussi une trace des locations en direct, car la commune peut demander au loueur le nombre de jours loués.',
              ].map((item, index) => (
                <div className="flex gap-4" key={item}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="leading-comfortable">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-10">
              <p className="text-gray-700 leading-comfortable">
                Le changement n&apos;est pas que les plateformes transmettent « plus de données pour
                le plaisir ». Le vrai changement, c&apos;est que les communes disposent d&apos;un
                outil plus simple pour rapprocher les annonces, les numéros d&apos;enregistrement,
                les adresses et les jours loués. Pour un propriétaire, les points essentiels sont
                donc la cohérence de ses annonces, le suivi de ses jours de location et la
                vérification des obligations locales.
              </p>
            </div>

            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <p className="text-h4 font-playfair font-semibold text-gray-900 mb-3">
                Faire le point sur vos obligations
              </p>
              <p className="text-gray-700 mb-6">
                Retrouvez les principales démarches dans la FAQ et comparez, séparément, la
                fiscalité d&apos;un meublé classé ou non classé.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/faq" variant="primary">
                  Consulter la FAQ
                </Button>
                <Button href="/simulateur-fiscal-classement" variant="secondary">
                  Utiliser le simulateur fiscal classement 2026
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-h4 mb-3">Sources officielles</h2>
              <p className="text-sm text-gray-600 mb-4">
                Cet article s&apos;appuie sur les textes et ressources officiels suivants.
              </p>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  {
                    label:
                      "Direction générale des Entreprises — API Meublés, guichet unique de centralisation des données d'activité des intermédiaires",
                    url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation',
                  },
                  {
                    label: 'Légifrance — Code du tourisme, article L. 324-2-1',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050650350/2026-05-21',
                  },
                  {
                    label: 'Légifrance — Code du tourisme, article R. 324-2-1',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053704515/2026-05-19',
                  },
                  {
                    label:
                      'Légifrance — Décret n° 2026-196 du 19 mars 2026 relatif à la location de meublés de tourisme',
                    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703509',
                  },
                  {
                    label:
                      'Légifrance — Décret n° 2026-197 du 19 mars 2026 portant création du traitement API Meublés',
                    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703549',
                  },
                  {
                    label: 'Service-Public — Mettre en location sa résidence principale',
                    url: 'https://www.service-public.fr/particuliers/vosdroits/F33175',
                  },
                  {
                    label: 'Service-Public — Mettre en location sa résidence secondaire',
                    url: 'https://www.service-public.fr/particuliers/vosdroits/F2043',
                  },
                  {
                    label:
                      'Ministère de l’Économie — Économie collaborative : comment déclarer vos revenus ?',
                    url: 'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/economie-collaborative-comment-declarer-vos-revenus',
                  },
                ].map(({ label, url }, index) => (
                  <li key={url} className="flex gap-2">
                    <span className="text-primary-400 font-medium shrink-0">{index + 1}.</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words hover:text-primary-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
