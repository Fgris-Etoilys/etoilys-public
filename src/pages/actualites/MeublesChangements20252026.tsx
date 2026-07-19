import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref } from '../../content/actualitesArticles';

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'la-vraie-rupture-2025-2026-ne-concerne-pas-la-grille-de-classement',
    label: 'La vraie rupture 2025-2026 ne concerne pas la grille de classement',
  },
  {
    id: 'fiscalite-le-vrai-choc-concerne-le-micro-bic',
    label: 'Fiscalité : le vrai choc concerne le micro-BIC',
  },
  {
    id: 'les-communes-ont-desormais-plus-de-pouvoir-sur-les-locations-touristiques',
    label: 'Les communes ont désormais plus de pouvoir sur les locations touristiques',
  },
  {
    id: 'dpe-ce-qui-s-applique-deja-et-ce-qui-ne-s-appliquera-qu-en-2034',
    label: "DPE : ce qui s'applique déjà, et ce qui ne s'appliquera qu'en 2034",
  },
  {
    id: 'copropriete-un-point-desormais-impossible-a-negliger',
    label: 'Copropriété : un point désormais impossible à négliger',
  },
  {
    id: 'enregistrement-national-le-cadre-legal-est-en-vigueur-mais-le-deploiement-reste-transitoire',
    label:
      'Enregistrement national : le cadre légal est en vigueur, mais le déploiement reste transitoire',
  },
  {
    id: 'concretement-qu-est-ce-que-cela-change-pour-un-proprietaire-en-2026',
    label: "Concrètement, qu'est-ce que cela change pour un propriétaire en 2026 ?",
  },
  {
    id: 'pourquoi-le-classement-reste-pertinent-malgre-les-nouvelles-contraintes',
    label: 'Pourquoi le classement reste pertinent malgré les nouvelles contraintes',
  },
  { id: 'conclusion', label: 'Conclusion' },
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={[
      {
        id: 'meubleschangements20252026-takeaway-1',
        content: (
          <>
            Pour les <strong>revenus 2025 déclarés en 2026</strong>, le micro-BIC a été fortement
            durci : <strong>15 000 € de plafond et 30 % d’abattement</strong> pour les meublés de
            tourisme non classés, contre <strong>77 700 € et 50 %</strong> pour les meublés classés.
          </>
        ),
      },
      {
        id: 'meubleschangements20252026-takeaway-2',
        content: (
          <>
            Pour les <strong>revenus 2026 déclarés en 2027</strong>, le plafond micro des meublés
            classés passe à <strong>83 600 €</strong>, tandis que le seuil des meublés non classés
            reste à <strong>15 000 €</strong>.
          </>
        ),
      },
      {
        id: 'meubleschangements20252026-takeaway-3',
        content: (
          <>
            Depuis 2025, certaines communes peuvent ramener la limite de location de la résidence
            principale de <strong>120 jours à 90 jours</strong>.
          </>
        ),
      },
      {
        id: 'meubleschangements20252026-takeaway-4',
        content: (
          <>
            Le <strong>DPE</strong> entre déjà en jeu dans certains cas de changement d'usage, mais
            l'obligation de décence énergétique généralisée pour les meublés qui ne sont pas la
            résidence principale n'entre en vigueur qu'en <strong>2034</strong>.
          </>
        ),
      },
      {
        id: 'meubleschangements20252026-takeaway-5',
        content: (
          <>
            Depuis le <strong>20 mai 2026</strong>, le Code du tourisme prévoit une déclaration
            soumise à enregistrement auprès d'un téléservice national, mais la DGE décrit encore un
            déploiement opérationnel en deux temps avec une version finale annoncée pour le second
            semestre 2026.
          </>
        ),
      },
    ]}
  />
);

const articleSources = (
  <ArticleSources
    sources={[
      {
        id: 'loi-du-19-novembre-2024-synthese-vie-publique-1',
        organization: 'Loi du 19 novembre 2024',
        title: 'synthèse Vie publique',
        url: 'https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur',
      },
      {
        id: 'dgfip-faq-fiscale-mise-a-jour-le-18-mars-2026-2',
        organization: 'DGFiP',
        title: 'FAQ fiscale mise à jour le 18 mars 2026',
        url: 'https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau',
      },
      {
        id: 'service-public-hebergement-touristique-et-micro-entreprise-3',
        organization: 'Service-Public',
        title: 'hébergement touristique et micro-entreprise',
        url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F39451',
      },
      {
        id: 'ministere-de-la-transition-ecologique-guide-pratique-2025-de-la-reglementation-des-meubles-de-tourisme-4',
        organization: 'Ministère de la Transition écologique',
        title:
          'Guide pratique 2025 de la réglementation des meublés de tourisme (Ministère de la Transition écologique)',
        url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf',
      },
      {
        id: 'ministere-de-la-transition-ecologique-ce-qui-change-avec-la-loi-du-19-novembre-2024-ministere-5',
        organization: 'Ministère de la Transition écologique',
        title: 'Ce qui change avec la loi du 19 novembre 2024 (Ministère)',
        url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Regulation-meubles-touristiques_2025_VF.pdf',
      },
      {
        id: 'api-meubles-dge-5-mars-2026-6',
        organization: 'API Meublés',
        title: 'DGE/5 mars 2026',
        url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation',
      },
      {
        id: 'service-public-declaration-et-enregistrement-des-meubles-de-tourisme-7',
        organization: 'Service-Public',
        title: 'déclaration et enregistrement des meublés de tourisme',
        url: 'https://www.service-public.fr/particuliers/vosdroits/R14321',
      },
      {
        id: 'service-public-reglement-de-copropriete-8',
        organization: 'Service-Public',
        title: 'règlement de copropriété',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F2589',
      },
      {
        id: 'legifrance-dpe-et-changement-d-usage-article-l631-10-cch-9',
        organization: 'Légifrance',
        title: "DPE et changement d'usage/article L631-10 CCH",
        url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623427',
      },
      {
        id: 'service-public-entreprendre-taxe-de-sejour-2026-10',
        organization: 'Service-Public Entreprendre',
        title: 'taxe de séjour 2026',
        url: 'https://entreprendre.service-public.fr/vosdroits/F31635',
      },
      {
        id: 'atout-france-note-de-clarification-septembre-2025-11',
        organization: 'Atout France',
        title: 'note de clarification septembre 2025',
        url: 'https://www.classement.atout-france.fr/documents/20142/1515299/Note%2Bde%2Bclarification%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme%2B-%2BSeptembre%2B2025.pdf/0e816e66-0a27-dd43-12db-a4a607aea165?download=true&version=2.4',
      },
      {
        id: 'legifrance-decret-du-20-fevrier-2026-legifrance-12',
        organization: 'Légifrance',
        title: 'Décret du 20 février 2026 (Légifrance)',
        url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053525578',
      },
      {
        id: 'legifrance-code-du-tourisme-article-l324-1-1-version-en-vigueur-depuis-le-20-mai-2026-13',
        organization: 'Légifrance / Code du tourisme, article L324-1-1',
        title: 'version en vigueur depuis le 20 mai 2026',
        url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050650414',
      },
      {
        id: 'legifrance-decret-n-2026-196-du-19-mars-2026-relatif-a-la-location-de-meubl-14',
        organization: 'Légifrance',
        title: 'Décret n° 2026-196 du 19 mars 2026 relatif à la location de meublés de tourisme',
        url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053703509',
      },
    ]}
  />
);

const article = getActualiteArticleByHref(
  '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026'
);

export default function ArticleMeubles20252026() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <>
          {/* Chapô */}
          <p className="text-xl leading-comfortable text-gray-700 mb-10">
            Depuis 2025, les plus gros changements pour les propriétaires de meublés de tourisme ne
            concernent pas la grille de classement elle-même, mais la fiscalité, les pouvoirs des
            communes, le DPE, la copropriété et l'enregistrement. Au 7 juin 2026, le plus important
            est de distinguer ce qui s'applique partout en France de ce qui dépend encore de la
            commune, du statut du logement ou du calendrier de déploiement administratif.
          </p>
        </>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <>
          {/* CTA */}
          <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
            <h2 className="text-h4 mb-3">
              Vous voulez savoir si le classement de votre meublé reste pertinent dans votre
              situation ?
            </h2>
            <p className="text-gray-700 mb-6">
              Consultez notre page sur la procédure de classement ou faites directement une demande
              de classement avec Etoilys.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/procedure" variant="primary">
                Découvrir la procédure
              </Button>
              <Button href="/demande-classement" variant="secondary">
                Faire une demande de classement
              </Button>
            </div>
          </div>
        </>
      }
      sources={articleSources}
    >
      {/* Section 1 */}
      <ArticleSectionHeading id="la-vraie-rupture-2025-2026-ne-concerne-pas-la-grille-de-classement">
        La vraie rupture 2025-2026 ne concerne pas la grille de classement
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Quand on parle des changements 2025-2026, beaucoup de propriétaires pensent d'abord au
        classement en étoiles. En réalité, le plus gros bouleversement ne vient pas de la grille de
        classement elle-même.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Au 7 juin 2026, le classement des meublés de tourisme reste une démarche officielle,
        facultative, valable 5 ans, fondée sur une grille nationale. Il n'y a pas eu de nouveau
        référentiel homologué remplaçant la grille actuelle sur la période 2025-2026. En revanche,
        Atout France a publié en septembre 2025 une{' '}
        <a
          href="https://www.classement.atout-france.fr/documents/20142/1515299/Note%2Bde%2Bclarification%2B-%2BMeubl%C3%A9s%2Bde%2Btourisme%2B-%2BSeptembre%2B2025.pdf/0e816e66-0a27-dd43-12db-a4a607aea165?download=true&version=2.4"
          target="_blank"
          rel="noopener noreferrer"
        >
          note de clarification utile pour l'interprétation pratique de certains critères
        </a>
        , et un{' '}
        <a
          href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053525578"
          target="_blank"
          rel="noopener noreferrer"
        >
          décret du 20 février 2026
        </a>{' '}
        est venu clarifier un point réglementaire sur la radiation d'un meublé classé de la liste
        des meublés classés.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Autrement dit : le classement continue d'exister dans un cadre assez stable, mais
        l'environnement juridique et fiscal autour des meublés de tourisme, lui, a clairement
        changé.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        C'est cela qu'un propriétaire doit suivre en priorité en 2026.
      </p>

      {/* Section 2 */}
      <ArticleSectionHeading id="fiscalite-le-vrai-choc-concerne-le-micro-bic">
        Fiscalité : le vrai choc concerne le micro-BIC
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le changement le plus visible pour les propriétaires est fiscal.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La{' '}
        <a
          href="https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur"
          target="_blank"
          rel="noopener noreferrer"
        >
          loi du 19 novembre 2024
        </a>{' '}
        a mis fin à l'ancien écart très favorable dont bénéficiaient les locations meublées de
        tourisme au régime micro-BIC. Depuis la déclaration des revenus 2025 effectuée en 2026, les
        règles ne sont plus du tout les mêmes selon que le meublé est classé ou non classé.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour un <strong>meublé de tourisme non classé</strong>, le régime micro est désormais limité
        à <strong>15 000 € de recettes annuelles</strong>, avec un{' '}
        <strong>abattement de 30 %</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour un <strong>meublé de tourisme classé</strong>, le régime micro reste beaucoup plus
        favorable :{' '}
        <strong>77 700 € de recettes annuelles pour les revenus 2025 déclarés en 2026</strong>, avec
        un <strong>abattement de 50 %</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour les <strong>revenus 2026 déclarés en 2027</strong>, le plafond micro-BIC des meublés
        classés passe à <strong>83 600 €</strong>, tandis que celui des meublés non classés reste
        fixé à <strong>15 000 €</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le classement ne supprime pas les autres contraintes du secteur, mais il conserve en 2026 un
        intérêt fiscal concret pour les propriétaires qui restent au micro-BIC.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour retrouver les seuils, les abattements et les différences entre revenus 2025 et 2026,
        consultez{' '}
        <Link
          to="/actualites/micro-bic-2026-meuble-classe-vs-non-classe"
          className="article-inline-link"
        >
          notre décryptage complet du micro-BIC 2026 pour les meublés classés et non classés
        </Link>
        .
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Il faut aussi éviter une erreur fréquente : beaucoup de contenus en ligne reprennent encore
        d'anciens seuils. Pour vérifier les paramètres en vigueur, il faut s'appuyer sur la{' '}
        <a
          href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ fiscale DGFiP mise à jour le 18 mars 2026
        </a>
        .
      </p>

      {/* Section 3 */}
      <ArticleSectionHeading id="les-communes-ont-desormais-plus-de-pouvoir-sur-les-locations-touristiques">
        Les communes ont désormais plus de pouvoir sur les locations touristiques
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le deuxième changement majeur est local.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Depuis 2025, dans les communes qui ont mis en place une procédure d'enregistrement, le
        conseil municipal peut abaisser la durée maximale de location d'une{' '}
        <strong>résidence principale</strong> de <strong>120 jours à 90 jours par an</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Cette règle n'est pas une limitation automatique et uniforme partout en France. Il existe
        désormais un cadre légal permettant d'abaisser ce plafond, mais sa mise en œuvre dépend de
        la commune concernée et, plus largement, de la réglementation locale applicable au logement.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La baisse à 90 jours n&apos;est toutefois ni nationale ni automatique :{' '}
        <Link
          to="/actualites/airbnb-residence-principale-limite-90-jours"
          className="article-inline-link"
        >
          notre article sur la limite de location d&apos;une résidence principale
        </Link>{' '}
        explique quelles communes peuvent l&apos;appliquer et comment vérifier le plafond local.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En pratique, il faut désormais vérifier au minimum :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>si le logement est une résidence principale ou une résidence secondaire ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            quelle procédure d'enregistrement s'applique au moment de la démarche : encore auprès de
            la commune, ou via le téléservice national lorsque la version finale sera déployée ;
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>si la commune a abaissé le plafond à 90 jours ;</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            si le logement est situé dans un secteur soumis à autorisation de changement d'usage.
          </span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        <strong>Le classement ne remplace pas les formalités locales.</strong> Être classé ne
        dispense ni d'une déclaration, ni d'un numéro d'enregistrement quand il est requis, ni d'un
        changement d'usage lorsqu'il s'applique, ni de l'obtention d'un SIRET.
      </p>

      {/* Section 4 */}
      <ArticleSectionHeading id="dpe-ce-qui-s-applique-deja-et-ce-qui-ne-s-appliquera-qu-en-2034">
        DPE : ce qui s'applique déjà, et ce qui ne s'appliquera qu'en 2034
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le sujet du DPE est souvent mal présenté. Il faut distinguer deux niveaux de règles.
      </p>

      <h3 className="mt-8 mb-3">Ce qui s'applique déjà</h3>
      <p className="text-gray-700 leading-comfortable mb-4">
        Depuis l'entrée en vigueur de la loi du 19 novembre 2024, un <strong>DPE</strong> est requis
        pour obtenir une <strong>autorisation préalable de changement d'usage</strong> en vue d'une
        mise en location de meublé de tourisme dans les zones concernées. Le niveau exigé est{' '}
        <strong>compris entre A et E</strong> en métropole, puis{' '}
        <strong>entre A et D à partir de 2034</strong>. Le DPE est donc déjà devenu un sujet concret
        pour certains propriétaires, mais uniquement dans le cadre d'une autorisation préalable de
        changement d'usage. Voir notamment{' '}
        <a
          href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623427"
          target="_blank"
          rel="noopener noreferrer"
        >
          l'article L631-10 du CCH sur Légifrance
        </a>
        .
      </p>

      <h3 className="mt-8 mb-3">Ce qui n'entrera en vigueur qu'en 2034</h3>
      <p className="text-gray-700 leading-comfortable mb-4">
        Il existe aussi une règle plus large de <strong>décence énergétique</strong> applicable aux
        meublés de tourisme qui ne sont <strong>pas</strong> la résidence principale du loueur. Mais
        cette exigence n'entre pas en vigueur en 2026 : elle est prévue pour <strong>2034</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le DPE a déjà des effets concrets dans certains cas de changement d'usage ; mais la bascule
        énergétique généralisée pour les meublés touristiques qui ne sont pas la résidence
        principale est un sujet de moyen terme, avec un horizon 2034.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour distinguer les obligations déjà applicables des exigences prévues pour 2034, consultez{' '}
        <Link to="/actualites/dpe-meubles-tourisme-2026-2034" className="article-inline-link">
          notre décryptage du DPE des meublés de tourisme
        </Link>
        .
      </p>

      {/* Section 5 */}
      <ArticleSectionHeading id="copropriete-un-point-desormais-impossible-a-negliger">
        Copropriété : un point désormais impossible à négliger
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Autre évolution importante depuis le 21 novembre 2024 : les{' '}
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F2589"
          target="_blank"
          rel="noopener noreferrer"
        >
          règlements de copropriété
        </a>{' '}
        établis à compter de cette date doivent mentionner explicitement si la location de meublés
        de tourisme est autorisée ou interdite.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Ce changement ne signifie pas que toutes les copropriétés anciennes interdisent soudainement
        la location touristique. En revanche, il renforce clairement le sujet dans les projets
        d'achat, d'investissement ou de mise en location.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Avant de louer, il faut vérifier les règles locales, mais il faut aussi vérifier le{' '}
        <strong>règlement de copropriété</strong> si le bien est concerné. C'est particulièrement
        important pour éviter le raisonnement du type : «j'ai le droit fiscalement, donc j'ai le
        droit dans l'immeuble». Ce n'est pas la même question.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Les règles dépendent notamment de la date et du contenu du règlement :{' '}
        <Link
          to="/actualites/copropriete-location-touristique-reglement"
          className="article-inline-link"
        >
          notre article sur la copropriété et la location touristique
        </Link>{' '}
        détaille les clauses et décisions à vérifier.
      </p>

      {/* Section 6 */}
      <ArticleSectionHeading id="enregistrement-national-le-cadre-legal-est-en-vigueur-mais-le-deploiement-reste-transitoire">
        Enregistrement national : le cadre légal est en vigueur, mais le déploiement reste
        transitoire
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Depuis le <strong>20 mai 2026</strong>, l'
        <a
          href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050650414"
          target="_blank"
          rel="noopener noreferrer"
        >
          article L. 324-1-1 du Code du tourisme
        </a>{' '}
        prévoit que toute personne qui offre à la location un meublé de tourisme doit procéder
        préalablement à une déclaration soumise à enregistrement auprès d'un téléservice national.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En pratique, la DGE présente encore le dispositif{' '}
        <a
          href="https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Meublés
        </a>{' '}
        comme un déploiement en deux temps : la version bêta, accessible depuis début mars 2026,
        laisse les loueurs s'enregistrer directement auprès des communes ; la version finale,
        annoncée pour le second semestre 2026, doit permettre l'enregistrement direct de chaque
        meublé sur le téléservice national.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le point à retenir est donc simple : le cadre juridique national est désormais posé, mais
        tant que la version finale n'est pas pleinement déployée, un propriétaire doit vérifier la
        procédure réellement applicable auprès de sa commune et suivre les informations officielles
        sur API Meublés.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour suivre la transition vers le numéro national et comprendre ce que deviennent les
        anciens numéros locaux, consultez{' '}
        <Link
          to="/actualites/api-meubles-declaration-meuble-tourisme"
          className="article-inline-link"
        >
          notre article consacré à la déclaration via l&apos;API Meublés
        </Link>
        .
      </p>

      {/* Section 7 - Checklist */}
      <ArticleSectionHeading id="concretement-qu-est-ce-que-cela-change-pour-un-proprietaire-en-2026">
        Concrètement, qu'est-ce que cela change pour un propriétaire en 2026 ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-6">
        En pratique, un propriétaire de meublé de tourisme doit désormais vérifier au moins six
        points :
      </p>

      <div className="space-y-6 mb-8">
        {[
          {
            num: '1',
            title: 'Le statut réel du logement',
            desc: "S'agit-il d'une résidence principale ou d'une résidence secondaire ? Cette distinction change beaucoup de choses sur les plafonds de location et sur certaines obligations.",
          },
          {
            num: '2',
            title: 'Les règles de la commune',
            desc: "Quelle procédure d'enregistrement s'applique au moment de la démarche ? La commune a-t-elle abaissé le plafond de 120 à 90 jours ? Le changement d'usage s'applique-t-il ?",
          },
          {
            num: '3',
            title: 'Le sujet énergétique',
            desc: "Si le bien est dans une zone où une autorisation préalable de changement d'usage est requise, le DPE peut déjà devenir un prérequis concret.",
          },
          {
            num: '4',
            title: 'Le bon régime fiscal',
            desc: 'Il faut raisonner avec les nouveaux seuils micro-BIC, et non avec des paramètres anciens trouvés sur des pages ou articles non mis à jour.',
          },
          {
            num: '5',
            title: 'Le règlement de copropriété',
            desc: "Dans certains cas, c'est lui qui peut bloquer le projet, indépendamment du reste.",
          },
          {
            num: '6',
            title: "L'intérêt ou non de demander le classement",
            desc: "Le classement n'est pas un bouclier universel, mais il reste un vrai levier en 2026 : il conserve un intérêt fiscal au micro-BIC, il change la logique de taxe de séjour, il apporte un repère officiel pour le niveau de confort du bien, et il s'intègre dans une démarche plus professionnelle.",
          },
        ].map(({ num, title, desc }) => (
          <div key={num} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
              {num}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-base leading-snug">{title}</h3>
              <p className="text-gray-700 leading-comfortable">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 8 */}
      <ArticleSectionHeading id="pourquoi-le-classement-reste-pertinent-malgre-les-nouvelles-contraintes">
        Pourquoi le classement reste pertinent malgré les nouvelles contraintes
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le classement ne remplace pas les obligations locales, fiscales ou énergétiques. En
        revanche, dans un cadre devenu plus encadré et plus technique, il reste un outil utile pour
        les propriétaires qui veulent structurer leur activité proprement.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En 2026, il garde notamment un intérêt parce qu'il permet encore de conserver un cadre
        micro-BIC nettement moins dégradé que celui des meublés non classés, et parce qu'il donne au
        logement un niveau officiel de lisibilité pour le marché.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour mieux comprendre ce que le classement apporte concrètement, consultez la page{' '}
        <Link to="/les-avantages-du-classement" className="article-inline-link">
          pourquoi faire classer son meublé
        </Link>
        , ou pour en savoir plus, découvrez{' '}
        <Link to="/procedure" className="article-inline-link">
          comment se déroule la procédure de classement
        </Link>
        .
      </p>

      {/* Conclusion */}
      <ArticleSectionHeading id="conclusion">Conclusion</ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Entre 2025 et 2026, le propriétaire de meublé de tourisme doit moins se demander si «une
        seule règle nationale a tout changé» que comprendre comment plusieurs couches de règles
        s'additionnent : fiscalité, commune, copropriété, énergie et enregistrement.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le sujet est donc devenu plus technique, pas plus simple. Et c'est précisément dans ce
        contexte que le classement mérite d'être analysé sérieusement, sans promesse excessive mais
        sans le sous-estimer non plus.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Si vous avez des questions sur vos obligations ou sur la procédure, la{' '}
        <Link to="/faq" className="article-inline-link">
          FAQ Etoilys
        </Link>{' '}
        répond aux questions les plus fréquentes des propriétaires.
      </p>
    </ArticleLayout>
  );
}
