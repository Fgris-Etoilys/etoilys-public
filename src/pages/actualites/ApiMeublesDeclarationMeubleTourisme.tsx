import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref } from '../../content/actualitesArticles';

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'le-vrai-changement-tout-le-monde-devra-declarer-son-meuble',
    label: 'Le vrai changement : tout le monde devra déclarer son meublé',
  },
  { id: 'api-meubles-c-est-quoi-exactement', label: "API Meublés, c'est quoi exactement ?" },
  { id: 'ce-qui-a-change-depuis-le-20-mai-2026', label: 'Ce qui a changé depuis le 20 mai 2026' },
  { id: 'que-faire-pendant-la-transition', label: 'Que faire pendant la transition ?' },
  {
    id: 'comment-devrait-fonctionner-la-declaration-via-api-meubles',
    label: 'Comment devrait fonctionner la déclaration via API Meublés ?',
  },
  {
    id: 'que-deviennent-les-anciens-numeros-d-enregistrement',
    label: "Que deviennent les anciens numéros d'enregistrement ?",
  },
  {
    id: 'quelles-sanctions-si-le-meuble-n-est-pas-declare',
    label: "Quelles sanctions si le meublé n'est pas déclaré ?",
  },
  {
    id: 'que-faire-concretement-pendant-la-periode-de-transition',
    label: 'Que faire concrètement pendant la période de transition ?',
  },
];

const article = getActualiteArticleByHref('/actualites/api-meubles-declaration-meuble-tourisme');

export default function ArticleApiMeubles() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <>
          {/* Chapô */}
          <p className="text-xl leading-comfortable text-gray-700 mb-10">
            Depuis le <strong>20 mai 2026</strong>, le cadre légal de déclaration des meublés de
            tourisme a changé : tous les loueurs devront, à terme, obtenir un{' '}
            <strong>numéro d&apos;enregistrement national</strong> via un téléservice connecté à{' '}
            <strong>API Meublés</strong>. Le détail un peu gênant, sinon ce serait trop simple : la
            version finale du service destiné aux propriétaires est annoncée pour le{' '}
            <strong>second semestre 2026</strong>. En pratique, il faut donc comprendre ce qui
            change, se préparer à redéclarer son meublé, et suivre les démarches transitoires en
            attendant l&apos;ouverture du nouveau service.
          </p>
        </>
      }
      keyTakeaways={
        <>
          {/* À retenir */}
          <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
            <h2 className="text-h4 mb-4">À retenir</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  Jusqu&apos;ici, certains loueurs n&apos;étaient pas concernés par une déclaration
                  systématique, notamment lorsque le logement loué était leur{' '}
                  <strong>résidence principale</strong>, sauf dans certaines communes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  Avec API Meublés,{' '}
                  <strong>
                    tous les loueurs de meublés de tourisme devront demander ou redemander un numéro
                    d&apos;enregistrement national
                  </strong>{' '}
                  pour chaque logement mis en location.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  Le cadre légal a basculé depuis le <strong>20 mai 2026</strong>, mais la DGE
                  indique que le téléservice final destiné aux loueurs doit ouvrir au{' '}
                  <strong>second semestre 2026</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  Depuis le 20 mai 2026, la démarche en ligne de Service-Public n&apos;est plus
                  disponible. Service-Public renvoie désormais vers le{' '}
                  <strong>Cerfa n°14004</strong> ou les modalités prévues par la mairie.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  Ne pas déclarer son meublé, faire une fausse déclaration ou utiliser un faux
                  numéro pourra entraîner des sanctions.
                </span>
              </li>
            </ul>
          </div>
        </>
      }
      footerCta={
        <>
          {/* CTA */}
          <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
            <h2 className="text-h4 mb-3">Des questions sur votre situation ?</h2>
            <p className="text-gray-700 mb-6">
              Retrouvez les réponses générales dans la FAQ ou échangez avec Etoilys sur le
              classement de votre meublé.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/faq" variant="primary">
                Consulter la FAQ
              </Button>
              <Button href="/contact" variant="secondary">
                Nous contacter
              </Button>
            </div>
          </div>
        </>
      }
      sources={
        <>
          {/* Sources officielles */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-h4 mb-3">Sources officielles</h2>
            <p className="text-sm text-gray-600 mb-4">
              Cet article s&apos;appuie sur les textes et ressources officiels suivants.
            </p>
            <ol className="space-y-3 text-sm text-gray-600">
              {[
                {
                  label:
                    'Direction générale des Entreprises — API Meublés, guichet unique de centralisation des données d\u2019activité des intermédiaires de meublés de tourisme',
                  url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation',
                },
                {
                  label:
                    'Légifrance — Code du tourisme, article L.324-1-1, version applicable à partir du 20 mai 2026',
                  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623378/2026-05-20',
                },
                {
                  label:
                    'Légifrance — Code du tourisme, article L.324-1-1, version en vigueur jusqu\u2019au 20 mai 2026',
                  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050650414',
                },
                {
                  label: 'Service-Public — Déclarer en mairie un meublé de tourisme',
                  url: 'https://www.service-public.fr/particuliers/vosdroits/R14321',
                },
                {
                  label:
                    'Service-Public — Formulaire Cerfa n°14004, déclaration en mairie des meublés de tourisme',
                  url: 'https://www.service-public.fr/particuliers/vosdroits/R76417',
                },
                {
                  label:
                    'Légifrance — Code du tourisme, article L.324-1-1, version en vigueur depuis le 20 mai 2026 : déclaration des meublés de tourisme, téléservice national, numéro de déclaration et sanctions',
                  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042070525/2026-05-23',
                },
                {
                  label:
                    'Légifrance — Décret n° 2026-196 du 19 mars 2026 relatif à la transmission des données par les intermédiaires aux communes et EPCI',
                  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703509',
                },
                {
                  label:
                    'Légifrance — Décret n° 2026-197 du 19 mars 2026 portant création du traitement automatisé API Meublés',
                  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703549',
                },
              ].map(({ label, url }, i) => (
                <li key={url} className="flex gap-2">
                  <span className="text-primary-400 font-medium shrink-0">{i + 1}.</span>
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
        </>
      }
    >
      {/* Section 1 */}
      <ArticleSectionHeading id="le-vrai-changement-tout-le-monde-devra-declarer-son-meuble">
        Le vrai changement : tout le monde devra déclarer son meublé
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le changement important n&apos;est pas seulement technique. Il ne s&apos;agit pas juste de
        remplacer un formulaire par un autre, avec un joli nom numérique pour faire moderne.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Jusqu&apos;au 20 mai 2026, le Code du tourisme prévoyait une déclaration auprès du maire
        pour les meublés de tourisme, mais avec une exception importante : cette déclaration
        préalable n&apos;était pas obligatoire lorsque le logement constituait la{' '}
        <strong>résidence principale</strong> du loueur. Dans certaines communes, une procédure
        d&apos;enregistrement pouvait déjà s&apos;appliquer plus largement, mais ce n&apos;était pas
        un système uniforme pour tous les propriétaires.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Depuis le <strong>20 mai 2026</strong>, la rédaction du texte a changé : toute personne qui
        offre à la location un meublé de tourisme doit procéder à une déclaration soumise à
        enregistrement auprès d&apos;un <strong>téléservice national</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Concrètement, cela signifie qu&apos;à terme, la logique devient nationale :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        {[
          'vous louez une résidence secondaire en meublé de tourisme ;',
          'vous louez ponctuellement votre résidence principale ;',
          'vous êtes déjà titulaire d\u2019un ancien numéro d\u2019enregistrement local ;',
          'vous passez par Airbnb, Abritel, Booking ou une autre plateforme ;',
          'vous louez en direct.',
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        Dans tous ces cas, vous devrez demander un{' '}
        <strong>nouveau numéro d&apos;enregistrement national</strong> lorsque le téléservice final
        sera ouvert.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
        <p className="text-gray-700 leading-comfortable">
          La DGE est claire sur ce point : au lancement de la version finale d&apos;API Meublés,{' '}
          <strong>tous les loueurs, sans exception</strong>, devront demander un numéro
          d&apos;enregistrement auprès du téléservice national pour chaque meublé de tourisme mis en
          location.
        </p>
      </div>

      {/* Section 2 */}
      <ArticleSectionHeading id="api-meubles-c-est-quoi-exactement">
        API Meublés, c&apos;est quoi exactement ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        <strong>API Meublés</strong> est la nouvelle plateforme nationale qui doit centraliser les
        données liées aux meublés de tourisme.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Son objectif est simple à comprendre : aujourd&apos;hui, les informations sont dispersées
        entre les communes, les plateformes de location et les anciens systèmes
        d&apos;enregistrement locaux. Résultat : des démarches différentes selon les territoires,
        des numéros qui ne se ressemblent pas, des contrôles plus compliqués, et une belle usine à
        gaz administrative.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        API Meublés doit servir de <strong>guichet unique centralisateur</strong> entre :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        {[
          'les intermédiaires de location de meublés, comme Airbnb, Abritel ou Booking ;',
          'les communes ;',
          'les établissements publics de coopération intercommunale compétents ;',
          'et, à terme, les loueurs eux-mêmes via un téléservice national.',
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        La plateforme doit notamment permettre de centraliser les numéros d&apos;enregistrement, les
        données d&apos;activité transmises par les plateformes, l&apos;adresse des logements et les
        URL des annonces. Pour comprendre précisément quelles informations Airbnb, Booking, Abritel
        et les autres intermédiaires transmettent aux collectivités, consultez{' '}
        <Link
          to="/actualites/airbnb-booking-abritel-donnees-communes-api-meubles"
          className="article-inline-link"
        >
          notre décryptage des données qui remontent aux communes
        </Link>
        .
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour un propriétaire, le point concret est le suivant : lorsque le service final sera
        ouvert, il faudra passer par le téléservice national relié à API Meublés pour obtenir un{' '}
        <strong>numéro d&apos;enregistrement national</strong>.
      </p>

      {/* Section 3 - tableau */}
      <ArticleSectionHeading id="ce-qui-a-change-depuis-le-20-mai-2026">
        Ce qui a changé depuis le 20 mai 2026
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Depuis le <strong>20 mai 2026</strong>, le code du tourisme prévoit une déclaration des
        meublés de tourisme via un téléservice national. Cette déclaration doit permettre la
        délivrance d&apos;un récépissé électronique avec un numéro de déclaration.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En pratique, il faut toutefois distinguer le cadre légal et le déploiement opérationnel. La
        DGE indique encore que le téléservice final destiné aux loueurs doit ouvrir au{' '}
        <strong>second semestre 2026</strong>. Pendant cette période de transition, les
        propriétaires doivent donc continuer à vérifier la procédure applicable auprès de la commune
        du logement.
      </p>
      <p className="text-gray-700 leading-comfortable mb-6">
        Il faut donc distinguer deux choses :
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[70%]" />
          </colgroup>
          <thead>
            <tr className="bg-primary-300 text-white">
              <th className="p-3 text-left font-semibold">Date ou période</th>
              <th className="p-3 text-left font-semibold">
                Ce que cela signifie pour le propriétaire
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-gray-100">
              <td className="p-3 text-gray-700 font-medium">Jusqu&apos;au 20 mai 2026</td>
              <td className="p-3 text-gray-600">
                La déclaration peut encore passer par la démarche en ligne actuelle de
                Service-Public, par un formulaire ou par le service propre de certaines mairies.
              </td>
            </tr>
            <tr className="bg-gray-50 border-b border-gray-100">
              <td className="p-3 text-gray-700 font-medium">Depuis le 20 mai 2026</td>
              <td className="p-3 text-gray-600">
                Le nouveau cadre légal est en vigueur, mais le téléservice final API Meublés destiné
                aux loueurs n&apos;est pas encore ouvert.
              </td>
            </tr>
            <tr className="bg-white">
              <td className="p-3 text-gray-700 font-medium">Second semestre 2026</td>
              <td className="p-3 text-gray-600">
                Le téléservice national relié à API Meublés doit permettre aux loueurs de demander
                leur nouveau numéro d&apos;enregistrement national.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le bon réflexe est de comprendre la période de transition et de se préparer à demander un
        nouveau numéro dès que le service national sera ouvert.
      </p>

      {/* Section 4 */}
      <ArticleSectionHeading id="que-faire-pendant-la-transition">
        Que faire pendant la transition ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        La démarche en ligne de déclaration d&apos;hébergement touristique sur Service-Public
        s&apos;est arrêtée le <strong>20 mai 2026</strong>. Les déclarations déposées avant cette
        date ont été traitées jusqu&apos;à leur terme.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Service-Public indique que cette démarche est désormais remplacée par le{' '}
        <strong>formulaire Cerfa n°14004</strong>. Ce Cerfa n&apos;est pas un nouveau dispositif API
        Meublés : c&apos;est le formulaire classique de{' '}
        <strong>déclaration en mairie d&apos;un meublé de tourisme</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En pratique, cela veut dire que pendant la période intermédiaire, avant l&apos;ouverture du
        téléservice national API Meublés aux loueurs, il faudra suivre les modalités disponibles :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        {[
          'vérifier les consignes de la mairie où se situe le logement ;',
          'utiliser le Cerfa n°14004 si c\u2019est la démarche demandée ;',
          'passer par le service local de la mairie si elle en propose un ;',
          'conserver les justificatifs et les accusés de réception ;',
          'surveiller l\u2019ouverture du téléservice national API Meublés.',
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
        <p className="text-gray-700 leading-comfortable">
          Toutes les mairies ne fonctionneront pas forcément exactement de la même façon pendant
          cette transition. Certaines peuvent proposer leur propre service ou leurs propres
          modalités de dépôt. Il faut donc vérifier localement avant d&apos;envoyer un formulaire.
        </p>
      </div>

      {/* Section 5 */}
      <ArticleSectionHeading id="comment-devrait-fonctionner-la-declaration-via-api-meubles">
        Comment devrait fonctionner la déclaration via API Meublés ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Lorsque le téléservice final sera ouvert, le propriétaire devra demander un numéro
        d&apos;enregistrement pour <strong>chaque meublé de tourisme mis en location</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La déclaration devra notamment indiquer si le logement constitue la{' '}
        <strong>résidence principale</strong> du loueur. Si c&apos;est le cas, le texte prévoit que
        le loueur devra en apporter la preuve dans sa déclaration.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La DGE indique aussi que des pièces justificatives seront nécessaires. La liste exacte est
        encore en cours de stabilisation, mais elle devrait notamment inclure :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>une pièce d&apos;identité ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            un avis d&apos;imposition si le meublé est déclaré comme résidence principale du loueur.
          </span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        Une fois la déclaration complète reçue, le téléservice doit délivrer un avis de réception
        électronique avec un numéro de déclaration. Ce numéro servira ensuite de référence nationale
        pour identifier le meublé.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le propriétaire devra aussi mettre à jour sa déclaration en cas de changement des
        informations ou des pièces justificatives fournies.
      </p>

      {/* Section 6 */}
      <ArticleSectionHeading id="que-deviennent-les-anciens-numeros-d-enregistrement">
        Que deviennent les anciens numéros d&apos;enregistrement ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        C&apos;est l&apos;une des questions les plus importantes pour les propriétaires qui ont déjà
        fait une déclaration dans leur commune.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La réponse est simple : les anciens numéros ne resteront pas valables indéfiniment.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La DGE indique qu&apos;au lancement de la version finale d&apos;API Meublés, tous les
        loueurs devront demander un nouveau numéro d&apos;enregistrement national. Les loueurs déjà
        titulaires d&apos;un numéro délivré sous l&apos;ancienne législation bénéficieront d&apos;un{' '}
        <strong>délai raisonnable</strong> pour le renouveler.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Après cette période transitoire, les anciens numéros deviendront invalides et ne pourront
        plus être utilisés auprès des intermédiaires de location.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
        <p className="text-gray-700 leading-comfortable">
          Si vous avez déjà un numéro local, il devra être remplacé par un nouveau numéro national
          lorsque le dispositif final sera ouvert.
        </p>
      </div>

      {/* Section 7 */}
      <ArticleSectionHeading id="quelles-sanctions-si-le-meuble-n-est-pas-declare">
        Quelles sanctions si le meublé n&apos;est pas déclaré ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le nouveau cadre prévoit des sanctions plus nettes.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        L&apos;absence de déclaration préalable peut entraîner une{' '}
        <strong>amende administrative prononcée par la commune</strong>, dont le montant peut aller
        jusqu&apos;à <strong>10 000 €</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Une fausse déclaration ou l&apos;utilisation d&apos;un faux numéro de déclaration peut
        entraîner une amende administrative pouvant aller jusqu&apos;à <strong>20 000 €</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Avec API Meublés, l&apos;enregistrement devient un point central de conformité pour les
        loueurs de meublés de tourisme.
      </p>

      {/* Section 8 */}
      <ArticleSectionHeading id="que-faire-concretement-pendant-la-periode-de-transition">
        Que faire concrètement pendant la période de transition ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Tant que le téléservice final national n&apos;est pas ouvert, le bon réflexe reste le même :
        vérifier la procédure applicable auprès de la mairie du logement. Selon la commune, la
        déclaration peut encore passer par le formulaire Cerfa 14004*04 ou par un téléservice local.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Au lancement du téléservice final, les loueurs devront demander un nouveau numéro
        d&apos;enregistrement pour chaque meublé concerné. Les anciens numéros ont vocation à être
        invalidés après une période transitoire.
      </p>
      <p className="text-gray-700 leading-comfortable mb-6">
        En attendant, les actions utiles sont les suivantes :
      </p>
      <div className="space-y-4 mb-8 text-gray-700">
        {[
          'Vérifier si votre meublé dispose déjà d\u2019un ancien numéro d\u2019enregistrement.',
          'Conserver les documents liés à votre déclaration actuelle.',
          'Identifier si votre logement est déclaré comme résidence principale ou non.',
          'Préparer une pièce d\u2019identité et, si le logement est votre résidence principale, votre avis d\u2019imposition.',
          'Vérifier les consignes de votre mairie si vous devez déclarer avant l\u2019ouverture d\u2019API Meublés.',
          'Surveiller l\u2019ouverture du téléservice national annoncé pour le second semestre 2026.',
          'Prévoir de demander un nouveau numéro national pour chaque meublé mis en location.',
        ].map((item, index) => (
          <div className="flex gap-4" key={item}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            <p className="leading-comfortable">{item}</p>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-10">
        <p className="text-gray-700 leading-comfortable">
          Le changement à retenir est clair : l&apos;enregistrement des meublés de tourisme devient
          national, et tous les loueurs devront obtenir un nouveau numéro via API Meublés. Le
          service final n&apos;est pas encore ouvert aux propriétaires, mais la bascule est engagée.
        </p>
      </div>
    </ArticleLayout>
  );
}
