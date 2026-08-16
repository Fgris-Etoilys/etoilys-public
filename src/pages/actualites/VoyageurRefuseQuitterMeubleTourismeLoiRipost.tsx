import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref, getRelatedArticles } from '../../content/actualitesArticles';
import { getArticleAuthor } from '../../content/articleAuthors';

const CC_DECISION_URL = 'https://www.conseil-constitutionnel.fr/decision/2026/2026915DC.htm';
const CC_COMMUNIQUE_URL =
  'https://www.conseil-constitutionnel.fr/actualites/communique/decision-n-2026-915-dc-du-14-aout-2026-communique-de-presse';
const ARTICLE_38_DALO_URL = 'https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000042655744/';
const SENAT_CMP_URL = 'https://www.senat.fr/leg/pjl25-905.html';
const SENAT_RAPPORT_URL = 'https://www.senat.fr/rap/l25-601/l25-6014.html';
const SERVICE_PUBLIC_SQUAT_URL = 'https://www.service-public.fr/particuliers/vosdroits/F35254';
const PREFECTURES_ANNUAIRE_URL = 'https://lannuaire.service-public.fr/navigation/prefecture';

const officialSources = [
  {
    id: 'conseil-constitutionnel-decision-2026-915-dc-1',
    organization: 'Conseil constitutionnel',
    title: 'Décision n° 2026-915 DC du 14 août 2026',
    url: CC_DECISION_URL,
  },
  {
    id: 'conseil-constitutionnel-communique-2026-915-dc-2',
    organization: 'Conseil constitutionnel',
    title: 'Communiqué de presse sur la décision n° 2026-915 DC',
    url: CC_COMMUNIQUE_URL,
  },
  {
    id: 'legifrance-article-38-loi-dalo-3',
    organization: 'Légifrance',
    title: 'Article 38 de la loi DALO du 5 mars 2007 (version consolidée)',
    url: ARTICLE_38_DALO_URL,
  },
  {
    id: 'senat-texte-cmp-loi-ripost-4',
    organization: 'Sénat',
    title: 'Texte du projet de loi RIPOST issu de la commission mixte paritaire',
    url: SENAT_CMP_URL,
  },
  {
    id: 'senat-rapport-meubles-tourisme-ripost-5',
    organization: 'Sénat',
    title: 'Rapport sur la disposition relative aux meublés de tourisme',
    url: SENAT_RAPPORT_URL,
  },
  {
    id: 'service-public-squat-evacuation-6',
    organization: 'Service-Public.fr',
    title: 'Squat : que faire en cas d’occupation illicite de son logement ?',
    url: SERVICE_PUBLIC_SQUAT_URL,
    detail: 'Décrit la procédure administrative antérieure à la loi RIPOST.',
  },
  {
    id: 'service-public-annuaire-prefectures-7',
    organization: 'Service-Public.fr',
    title: 'Annuaire des préfectures',
    url: PREFECTURES_ANNUAIRE_URL,
  },
];

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'pourquoi-cette-situation-posait-probleme-jusquici',
    label: 'Pourquoi cette situation posait problème jusqu’ici',
  },
  {
    id: 'ce-que-la-loi-ripost-prevoit-de-changer',
    label: 'Ce que la loi RIPOST prévoit de changer',
  },
  {
    id: 'ce-que-le-conseil-constitutionnel-a-change-le-14-aout',
    label: 'Ce que le Conseil constitutionnel a changé le 14 août',
  },
  {
    id: 'peut-on-vraiment-recuperer-son-logement-en-72-heures',
    label: 'Peut-on vraiment récupérer son logement en 72 heures ?',
  },
  {
    id: 'que-faire-si-un-voyageur-refuse-de-quitter-votre-meuble',
    label: 'Que faire si un voyageur refuse de quitter votre meublé ?',
  },
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={[
      {
        id: 'voyageurrefusequittermeubletourismeloiripost-takeaway-1',
        content: (
          <>
            Si un voyageur refuse de partir à la fin de sa réservation, RIPOST prévoit d’ouvrir la
            possibilité de demander au préfet son évacuation, alors que la procédure était jusqu’ici
            mal adaptée à ce cas.
          </>
        ),
      },
      {
        id: 'voyageurrefusequittermeubletourismeloiripost-takeaway-2',
        content: (
          <>
            Le Conseil constitutionnel n’a pas supprimé cette nouvelle possibilité. Il a censuré les
            nouvelles sanctions pénales prévues en parallèle.
          </>
        ),
      },
      {
        id: 'voyageurrefusequittermeubletourismeloiripost-takeaway-3',
        content: (
          <>
            Le propriétaire ne peut pas expulser lui-même le voyageur : il doit réunir les preuves
            de la réservation, déposer plainte, faire constater l’occupation, puis demander
            l’évacuation au préfet.
          </>
        ),
      },
      {
        id: 'voyageurrefusequittermeubletourismeloiripost-takeaway-4',
        content: (
          <>
            « Expulsion en 72 heures » est une formule trompeuse : les 72 heures correspondent à une
            étape particulière de la procédure, pas au délai garanti pour récupérer le logement.
          </>
        ),
      },
      {
        id: 'voyageurrefusequittermeubletourismeloiripost-takeaway-5',
        content: (
          <>
            Au jour de la publication de cet article, la loi RIPOST n’est pas encore promulguée :
            cette page sera mise à jour dès la publication du texte définitif.
          </>
        ),
      },
    ]}
  />
);

const articleSources = <ArticleSources sources={officialSources} />;

const article = getActualiteArticleByHref(
  '/actualites/voyageur-refuse-quitter-meuble-tourisme-loi-ripost'
);

export default function ArticleVoyageurRefuseQuitterMeubleTourismeLoiRipost() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <p className="text-xl leading-comfortable text-gray-700 mb-6">
          Un voyageur termine sa réservation mais refuse de quitter le logement : jusqu’ici, la
          procédure administrative rapide utilisée contre certaines occupations illégales était mal
          adaptée, car le voyageur était entré légalement dans les lieux. La loi RIPOST prévoit de
          permettre au propriétaire de saisir le préfet pour demander l’évacuation du logement, sans
          devoir commencer par une procédure judiciaire classique. Le Conseil constitutionnel a
          maintenu cette possibilité le 14 août 2026, tout en censurant les nouvelles sanctions
          pénales prévues en parallèle.
        </p>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
          <h2 className="text-h4 mb-3">
            Vous voulez faire le point sur les règles qui changent pour les meublés de tourisme ?
          </h2>
          <p className="text-gray-700 leading-comfortable mb-6">
            Fiscalité, DPE, copropriété, enregistrement national et durée de location : plusieurs
            autres règles ont aussi évolué pour les propriétaires de meublés de tourisme.
          </p>
          <Button
            href="/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026"
            variant="primary"
          >
            Voir ce qui change pour les meublés de tourisme
          </Button>
        </div>
      }
      sources={articleSources}
      relatedArticles={getRelatedArticles(article)}
      author={getArticleAuthor(article.authorId)}
    >
      <ArticleSectionHeading id="pourquoi-cette-situation-posait-probleme-jusquici">
        Pourquoi cette situation posait problème jusqu’ici
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Vous louez votre maison du samedi au samedi. La réservation se termine à 10 h, mais le
        voyageur refuse de rendre les clés et annonce qu’il reste dans le logement.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Contrairement à quelqu’un qui entre par effraction, ce voyageur avait le droit d’entrer dans
        le logement au début du séjour : il avait réservé et payé son séjour. C’est précisément ce
        qui rendait la procédure administrative existante mal adaptée à son cas. Le{' '}
        <a
          href={SENAT_RAPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          rapport du Sénat
        </a>{' '}
        sur cette disposition identifie précisément cette difficulté : un voyageur entré
        régulièrement dans un meublé de tourisme, mais qui se maintient dans les lieux après la fin
        de son contrat, n’entrait pas dans le champ de cette procédure rapide.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Dans le langage courant, la situation ressemble évidemment à un squat. Juridiquement, la
        différence est importante : le voyageur était entré dans le logement avec votre
        autorisation.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le problème n’était pas que le propriétaire n’avait aucun droit. Le problème était que la
        procédure rapide existante avait été conçue pour d’autres formes d’occupation illégale.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Cette lacune s’ajoute à plusieurs autres évolutions réglementaires du secteur : retrouvez
        notre point sur{' '}
        <Link
          to="/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026"
          className="article-inline-link font-semibold"
        >
          ce qui change vraiment en 2025-2026 pour les propriétaires
        </Link>
        .
      </p>

      <ArticleSectionHeading id="ce-que-la-loi-ripost-prevoit-de-changer">
        Ce que la loi RIPOST prévoit de changer
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        La loi RIPOST prévoit d’étendre la procédure administrative au cas d’un voyageur entré
        légalement dans un meublé mais qui refuse de partir après la fin de son contrat.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Concrètement, le mécanisme prévu suit ces étapes :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>le séjour est terminé ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>le voyageur reste malgré la fin de son droit d’occuper le logement ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>le propriétaire réunit les preuves et engage les démarches prévues ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>il demande au préfet d’ordonner le départ de l’occupant ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            si la mise en demeure n’est pas respectée et si les conditions sont réunies, la
            procédure peut aller jusqu’à l’évacuation forcée.
          </span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        Juridiquement, cette procédure est prévue par{' '}
        <a
          href={ARTICLE_38_DALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          l’article 38 de la loi DALO
        </a>
        . Le nom importe peu pour le propriétaire : son intérêt est de permettre une intervention
        administrative sous l’autorité du préfet, plutôt que de devoir commencer par une procédure
        judiciaire classique.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        À chaque étape, l’intervention reste toutefois encadrée : le propriétaire ne peut pas
        décider seul de faire partir l’occupant, un simple appel à la préfecture ne suffit pas, et
        rien ne garantit une évacuation automatique ou immédiate.
      </p>

      <ArticleSectionHeading id="ce-que-le-conseil-constitutionnel-a-change-le-14-aout">
        Ce que le Conseil constitutionnel a changé le 14 août
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour un propriétaire qui cherche surtout à récupérer son logement, le principal dispositif
        de la réforme a été conservé.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Voici, en synthèse, ce que retient la décision du 14 août 2026 :
      </p>
      <ResponsiveComparisonTable
        className="mb-6"
        primaryColumnKey="disposition"
        columns={[
          {
            key: 'disposition',
            label: 'Ce que prévoyait la loi RIPOST',
            mobileLabel: 'Disposition',
          },
          {
            key: 'statut',
            label: 'Après la décision du 14 août',
            mobileLabel: 'Statut',
          },
        ]}
        rows={[
          {
            key: 'evacuation',
            cells: {
              disposition:
                'Permettre de demander au préfet l’évacuation d’un voyageur qui refuse de partir après la fin du séjour',
              statut: 'Conservé',
            },
          },
          {
            key: 'sanctions',
            cells: {
              disposition: 'Ajouter de nouvelles sanctions pénales spécifiques',
              statut: 'Censuré',
            },
          },
        ]}
        caption="Comparaison entre ce que prévoyait la loi RIPOST et le résultat après la décision du Conseil constitutionnel du 14 août 2026"
      />
      <p className="text-gray-700 leading-comfortable mb-4">
        Le Conseil constitutionnel n’a pas remis en cause le principe d’une protection pour le
        propriétaire. Il a censuré la partie du texte qui créait, pour les mêmes faits, deux
        infractions pénales distinctes assorties de peines différentes : une construction qui
        méconnaît le principe d’égalité devant la loi pénale.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour récupérer votre logement, l’essentiel de la réforme a donc survécu au contrôle du
        Conseil constitutionnel.
      </p>

      <ArticleSectionHeading id="peut-on-vraiment-recuperer-son-logement-en-72-heures">
        Peut-on vraiment récupérer son logement en 72 heures ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Non : la loi ne garantit pas que le voyageur sera dehors 72 heures après votre demande.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le délai de 72 heures concerne un cas particulier : si l’occupation vous empêche de
        récupérer ou de fournir les justificatifs nécessaires pour établir votre droit sur le
        logement, le préfet sollicite l’administration fiscale dans un délai de 72 heures pour
        établir ce droit. Ces 72 heures ne correspondent donc pas à la durée totale de la procédure.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Une fois votre droit établi, le préfet dispose ensuite de 48 heures pour statuer sur la mise
        en demeure adressée à l’occupant. Le délai d’exécution de cette mise en demeure dépend alors
        d’un critère précis : si le logement constitue votre domicile, ce délai ne peut être
        inférieur à 24 heures ; s’il ne constitue pas votre domicile — ce qui est le cas de la
        plupart des meublés de tourisme, qui ne sont pas la résidence du propriétaire — ce délai est
        porté à 7 jours. Si l’occupant ne quitte pas les lieux dans ce délai, l’évacuation forcée
        peut alors être engagée.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La procédure peut être beaucoup plus rapide qu’une procédure judiciaire classique, mais
        personne ne peut sérieusement promettre au propriétaire de récupérer ses clés sous 72
        heures.
      </p>

      <ArticleSectionHeading id="que-faire-si-un-voyageur-refuse-de-quitter-votre-meuble">
        Que faire si un voyageur refuse de quitter votre meublé ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Voici, dans l’ordre, les démarches à engager si un voyageur refuse de quitter votre meublé
        de tourisme :
      </p>
      <div className="rounded-card border border-primary-200 bg-primary-100 p-6 mb-8">
        <ul className="space-y-4 text-gray-700">
          <li>
            <strong>1. Garder toutes les preuves de la réservation.</strong> Contrat ou confirmation
            de réservation, plateforme utilisée, dates et heures prévues du séjour, identité du
            voyageur, échanges utiles : ces éléments servent à prouver que le séjour est terminé et
            que le voyageur n’a plus de droit à rester dans le logement.
          </li>
          <li>
            <strong>2. Demander clairement au voyageur de quitter les lieux.</strong> Conservez une
            trace écrite de cette demande, sans rédiger de mise en demeure juridique maison.
          </li>
          <li>
            <strong>3. Déposer plainte.</strong> Cette étape reste une condition de la procédure
            administrative.
          </li>
          <li>
            <strong>4. Faire constater que le voyageur occupe toujours le logement.</strong> Ce
            constat doit être établi par un officier de police judiciaire, le maire ou un
            commissaire de justice.
          </li>
          <li>
            <strong>5. Préparer la preuve du droit sur le logement.</strong> Vous devez pouvoir
            établir que vous êtes bien propriétaire, ou titulaire du droit d’occuper le logement.
          </li>
          <li>
            <strong>6. Adresser la demande au préfet du département.</strong> Retrouvez les
            coordonnées de votre préfecture dans{' '}
            <a
              href={PREFECTURES_ANNUAIRE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="article-inline-link"
            >
              l’annuaire officiel des préfectures
            </a>
            .
          </li>
          <li>
            <strong>7. Ne pas tenter d’expulser soi-même le voyageur.</strong> Ne changez pas les
            serrures, ne coupez pas l’accès aux équipements et ne prenez aucune mesure de contrainte
            de votre propre initiative. En cas de situation complexe ou contestée, faites appel à un
            commissaire de justice ou à un professionnel du droit.
          </li>
        </ul>
      </div>

      <p className="text-gray-700 leading-comfortable mb-4">
        Si un voyageur refuse de partir à la fin de son séjour, RIPOST doit surtout donner au
        propriétaire une nouvelle porte de sortie : demander au préfet d’engager une procédure
        d’évacuation, alors que ce recours était jusqu’ici mal adapté à cette situation.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le Conseil constitutionnel n’a pas remis en cause ce mécanisme. En revanche, la procédure ne
        devient pas automatique : il faut conserver les preuves, déposer plainte si le texte
        l’exige, faire constater l’occupation et saisir officiellement la préfecture.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Si cela vous arrive, votre premier réflexe doit donc être de conserver toutes les preuves de
        la réservation et du refus de partir, puis d’engager rapidement les démarches officielles
        plutôt que de tenter de récupérer le logement par vos propres moyens.
      </p>
    </ArticleLayout>
  );
}
