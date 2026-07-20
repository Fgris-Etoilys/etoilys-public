import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref, getRelatedArticles } from '../../content/actualitesArticles';
import { getArticleAuthor } from '../../content/articleAuthors';

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'la-reponse-courte-non-ce-n-est-pas-une-lecture-tout-ou-rien',
    label: "La réponse courte : non, ce n'est pas une lecture « tout ou rien »",
  },
  {
    id: 'ce-que-montrent-les-sources-officielles',
    label: 'Ce que montrent les sources officielles',
  },
  {
    id: 'ce-que-cela-veut-dire-concretement-si-vous-avez-plusieurs-logements',
    label: 'Ce que cela veut dire concrètement si vous avez plusieurs logements',
  },
  { id: 'et-pour-les-abattements', label: 'Et pour les abattements ?' },
  { id: 'la-prudence-a-garder', label: 'La prudence à garder' },
  { id: 'conclusion', label: 'Conclusion' },
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={[
      {
        id: 'meubleclassenonclasseseuils-takeaway-1',
        content: (
          <>
            Les recettes de <strong>meublés classés</strong> et de{' '}
            <strong>meublés non classés</strong> sont distinguées par l'administration fiscale, avec
            des <strong>cases séparées</strong> dans la déclaration 2042 C PRO.
          </>
        ),
      },
      {
        id: 'meubleclassenonclasseseuils-takeaway-2',
        content: (
          <>
            En <strong>activité mixte</strong>, Service-Public Entreprendre indique qu'il faut
            respecter un <strong>seuil global de chiffre d'affaires</strong> et le{' '}
            <strong>seuil propre à chaque activité</strong>, en citant explicitement la location
            meublée classée ou non classée.
          </>
        ),
      },
      {
        id: 'meubleclassenonclasseseuils-takeaway-3',
        content: (
          <>
            Les <strong>abattements</strong> s'appliquent sur la{' '}
            <strong>fraction de chiffre d'affaires correspondant à chaque activité</strong> :
            50&nbsp;% pour les classés, 30&nbsp;% pour les non classés (revenus 2025 déclarés en
            2026).
          </>
        ),
      },
      {
        id: 'meubleclassenonclasseseuils-takeaway-4',
        content: (
          <>
            Cet article traite de la <strong>logique micro-fiscale / micro-BIC</strong>. Il n'a pas
            vocation à couvrir tous les cas complexes de structuration juridique.
          </>
        ),
      },
      {
        id: 'meubleclassenonclasseseuils-takeaway-5',
        content: (
          <>
            Si vos recettes deviennent significatives, il faut examiner le{' '}
            <strong>régime réel</strong> et, si nécessaire, faire confirmer le montage par un
            professionnel du chiffre.
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
        id: 'service-public-entreprendre-regime-fiscal-de-la-micro-entreprise-activite-mixte-1',
        organization: 'Service-Public Entreprendre',
        title: 'Régime fiscal de la micro-entreprise (activité mixte)',
        url: 'https://entreprendre.service-public.fr/vosdroits/F23267',
      },
      {
        id: 'service-public-impot-sur-le-revenu-revenus-d-une-location-meublee-2',
        organization: 'Service-Public',
        title: "Impôt sur le revenu : revenus d'une location meublée",
        url: 'https://www.service-public.fr/particuliers/vosdroits/F32744',
      },
      {
        id: 'impots-gouv-fr-faq-fiscale-sur-les-meubles-de-tourisme-3',
        organization: 'impots.gouv.fr',
        title: 'FAQ fiscale sur les meublés de tourisme',
        url: 'https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau',
      },
      {
        id: 'economie-gouv-fr-location-meublee-de-tourisme-regles-fiscales-pour-la-residence-p-4',
        organization: 'economie.gouv.fr',
        title: 'Location meublée de tourisme : règles fiscales pour la résidence principale',
        url: 'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence',
      },
      {
        id: 'legifrance-cgi-article-50-0-5',
        organization: 'Légifrance',
        title: 'CGI, article 50-0',
        url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042159220/',
      },
      {
        id: 'impots-gouv-fr-brochure-pratique-ir-2026-2042-c-pro-declaration-des-revenus-202-6',
        organization: 'impots.gouv.fr',
        title: 'Brochure pratique IR 2026 / 2042 C PRO (déclaration des revenus 2025)',
        url: 'https://www.impots.gouv.fr/www2/fichiers/documentation/brochure/ir_2026/pdf_integral/Brochure-IR-2026.pdf',
      },
    ]}
  />
);

const article = getActualiteArticleByHref('/actualites/meuble-classe-non-classe-seuils-micro-bic');

export default function ArticleMeubleClasseNonClasseSeuils() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <>
          {/* Chapô */}
          <p className="text-xl leading-comfortable text-gray-700 mb-10">
            Lorsque vous avez à la fois un <strong>meublé classé</strong> et un{' '}
            <strong>meublé non classé</strong>, la lecture des seuils micro-BIC n'est ni « tout sous
            15&nbsp;000&nbsp;€ » ni « tout sous 77&nbsp;700&nbsp;€ ». Les sources officielles les
            plus précises distinguent bien les recettes selon leur catégorie, prévoient des{' '}
            <strong>abattements différents</strong>, et indiquent qu'en{' '}
            <strong>activité mixte</strong> il faut respecter à la fois un{' '}
            <strong>seuil global</strong> et le <strong>seuil propre à chaque activité</strong>.
          </p>
        </>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <>
          {/* CTA */}
          <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
            <h2 className="text-h4 mb-3">
              Le classement de l'un de vos logements change-t-il votre cadre fiscal ?
            </h2>
            <p className="text-gray-700 mb-6">
              Consultez la procédure de classement pour comprendre les démarches, ou faites
              directement une demande de classement avec Etoilys.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/procedure" variant="primary">
                Voir la procédure de classement
              </Button>
              <Button href="/demande-classement" variant="secondary">
                Faire une demande de classement
              </Button>
            </div>
          </div>
        </>
      }
      sources={articleSources}
      relatedArticles={getRelatedArticles(article)}
      author={getArticleAuthor(article.authorId)}
    >
      {/* Section 1 */}
      <ArticleSectionHeading id="la-reponse-courte-non-ce-n-est-pas-une-lecture-tout-ou-rien">
        La réponse courte : non, ce n'est pas une lecture « tout ou rien »
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Si vous avez un logement <strong>classé</strong> et un autre <strong>non classé</strong>, la
        lecture la plus solide des sources officielles n'est ni :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>« tout est plafonné à 15&nbsp;000&nbsp;€ »,</span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>ni « tout profite du plafond classé ».</span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le point le plus solide, c'est la page Service-Public Entreprendre sur le{' '}
        <strong>régime fiscal de la micro-entreprise</strong> : en <strong>activité mixte</strong>,
        elle indique qu'il faut respecter un <strong>seuil global de chiffre d'affaires</strong> et
        le <strong>seuil applicable à chaque activité</strong>, en citant explicitement la{' '}
        <strong>location meublée classée ou non classée</strong>.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Les sources officielles montrent donc bien une{' '}
        <strong>logique de distinction par catégorie de recettes</strong>, pas un pot commun où tout
        serait fondu sans distinction.
      </p>

      {/* Section 2 – sources + tableau */}
      <ArticleSectionHeading id="ce-que-montrent-les-sources-officielles">
        Ce que montrent les sources officielles
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Trois indices officiels vont dans le même sens :
      </p>
      <div className="space-y-4 mb-8 text-gray-700">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
            1
          </div>
          <div>
            <p className="leading-comfortable">
              <strong>Le CGI distingue les seuils</strong> (
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042159220/"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 50-0 du CGI
              </a>
              ) : 15&nbsp;000&nbsp;€ pour la location de meublés de tourisme non classés, et
              77&nbsp;700&nbsp;€ (revenus 2025) / 83&nbsp;600&nbsp;€ (revenus 2026) pour les autres
              entreprises relevant des BIC — dont les meublés de tourisme classés.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
            2
          </div>
          <div>
            <p className="leading-comfortable">
              <strong>La déclaration 2042 C PRO distingue les recettes</strong> : les meublés
              classés et non classés ne sont pas déclarés dans les mêmes cases (
              <a
                href="https://www.impots.gouv.fr/www2/fichiers/documentation/brochure/ir_2026/pdf_integral/Brochure-IR-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                brochure pratique IR 2026
              </a>
              ).
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
            3
          </div>
          <div>
            <p className="leading-comfortable">
              <strong>Service-Public Entreprendre parle d'activité mixte</strong> (
              <a
                href="https://entreprendre.service-public.fr/vosdroits/F23267"
                target="_blank"
                rel="noopener noreferrer"
              >
                régime fiscal de la micro-entreprise
              </a>
              ) et précise que les activités de location meublée classée ou non classée ont chacune
              leur <strong>seuil spécifique</strong>.
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-comfortable mb-4">
        Le tableau suivant résume les seuils et abattements applicables selon la catégorie de
        recettes :
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
          <caption className="sr-only">
            Seuils et abattements micro-BIC applicables selon la catégorie de recettes
          </caption>
          <colgroup>
            <col className="w-2/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
            <col className="w-1/5" />
          </colgroup>
          <thead>
            <tr className="bg-primary-300 text-white">
              <th scope="col" className="p-3 text-left font-semibold">
                Catégorie de recettes
              </th>
              <th scope="col" className="p-3 text-center font-semibold">
                Revenus 2025
                <br />
                <span className="font-normal text-xs">(déclarés en 2026)</span>
              </th>
              <th scope="col" className="p-3 text-center font-semibold">
                Revenus 2026
                <br />
                <span className="font-normal text-xs">(déclarés en 2027)</span>
              </th>
              <th scope="col" className="p-3 text-center font-semibold">
                Abattement micro
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-gray-100">
              <th scope="row" className="p-3 text-gray-700 font-medium">
                Meublés de tourisme non classés
              </th>
              <td className="p-3 text-center text-gray-600">15&nbsp;000&nbsp;€</td>
              <td className="p-3 text-center text-gray-600">15&nbsp;000&nbsp;€</td>
              <td className="p-3 text-center font-semibold text-gray-700">30&nbsp;%</td>
            </tr>
            <tr className="bg-gray-50">
              <th scope="row" className="p-3 text-gray-700 font-medium">
                Meublés de tourisme classés
              </th>
              <td className="p-3 text-center text-gray-600">77&nbsp;700&nbsp;€</td>
              <td className="p-3 text-center font-semibold text-primary-400">83&nbsp;600&nbsp;€</td>
              <td className="p-3 text-center font-semibold text-gray-700">50&nbsp;%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 leading-comfortable mb-8">
        En pratique, si vous avez des recettes des deux côtés, il faut les lire séparément, puis
        vérifier aussi le cadre global applicable à votre activité.
      </p>

      {/* Section 3 */}
      <ArticleSectionHeading id="ce-que-cela-veut-dire-concretement-si-vous-avez-plusieurs-logements">
        Ce que cela veut dire concrètement si vous avez plusieurs logements
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">Si vous avez :</p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            un ou plusieurs <strong>meublés classés</strong> ;
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            et un ou plusieurs <strong>meublés non classés</strong>,
          </span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        les recettes classées et non classées doivent être distinguées. Les seuils spécifiques et
        les abattements correspondants s'apprécient par catégorie de recettes, dans un cadre
        micro-fiscal qui peut aussi imposer la vérification d'un seuil global en activité mixte.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Deux points à éviter dans cette lecture :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            Ne pas raisonner comme si chaque logement était analysé isolément, sans jamais tenir
            compte de l'activité globale.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            Ne pas supposer que la présence d'un seul meublé non classé ferait automatiquement
            tomber <em>toutes</em> les recettes dans le régime du non classé.
          </span>
        </li>
      </ul>
      <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
        Les recettes classées et non classées doivent être distinguées. Les seuils spécifiques et
        les abattements correspondants s'apprécient par catégorie de recettes, dans un cadre
        micro-fiscal qui peut aussi imposer la vérification d'un seuil global en activité mixte.
      </blockquote>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour comprendre pourquoi le classement fait une différence concrète sur d'autres sujets
        fiscaux, consultez la page{' '}
        <Link to="/les-avantages-du-classement" className="article-inline-link">
          pourquoi faire classer son meublé de tourisme
        </Link>
        .
      </p>

      {/* Section 4 */}
      <ArticleSectionHeading id="et-pour-les-abattements">
        Et pour les abattements ?
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Sur ce point, les sources officielles sont plus nettes que beaucoup de contenus publiés en
        ligne.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Service-Public Entreprendre précise que, lorsque l'activité est <strong>mixte</strong>, les{' '}
        <strong>
          abattements propres à chaque activité s'appliquent cumulativement sur la fraction de
          chiffre d'affaires correspondant à chacune de ces activités
        </strong>
        .
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Concrètement, cela veut dire qu'on ne prend pas tout le chiffre d'affaires pour lui
        appliquer un seul abattement uniforme. On distingue :
      </p>
      <ul className="space-y-2 mb-6 text-gray-700">
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            <strong>50&nbsp;%</strong> sur la part de recettes correspondant aux meublés classés ;
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>
            <strong>30&nbsp;%</strong> sur la part correspondant aux meublés non classés,
          </span>
        </li>
      </ul>
      <p className="text-gray-700 leading-comfortable mb-4">
        sous réserve bien sûr que le régime micro reste applicable (seuils et conditions respectés).
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour un rappel des règles générales sur la fiscalité des meublés classés, la page{' '}
        <Link to="/faq" className="article-inline-link">
          FAQ Etoilys
        </Link>{' '}
        répond aux questions les plus fréquentes.
      </p>

      {/* Section 5 */}
      <ArticleSectionHeading id="la-prudence-a-garder">La prudence à garder</ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Ce sujet est assez clair dans les{' '}
        <strong>sources officielles sur le micro-fiscal / activité mixte</strong>. Mais quelques
        points méritent attention :
      </p>
      <div className="space-y-6 mb-8">
        {(
          [
            {
              num: '1',
              title: 'Cet article porte sur la logique micro-BIC',
              desc: "Il n'a pas vocation à couvrir tous les cas de structuration juridique plus complexe (SCI, indivision, statut LMP/LMNP, etc.).",
            },
            {
              num: '2',
              title: 'Le régime réel reste à examiner',
              desc: 'Si le niveau de recettes devient élevé, ou si la situation est mal cadrée, il faut regarder de près le régime réel. Il peut être plus adapté, voire obligatoire.',
            },
            {
              num: '3',
              title: 'Une confirmation professionnelle peut être utile',
              desc: 'Pour des situations complexes (plusieurs biens, montages mixtes, doutes sur les seuils globaux), une confirmation par un professionnel du chiffre reste la voie la plus solide.',
            },
          ] as { num: string; title: string; desc: string }[]
        ).map(({ num, title, desc }) => (
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

      {/* Conclusion */}
      <ArticleSectionHeading id="conclusion">Conclusion</ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Si vous avez un meublé classé et un non classé, la bonne approche n'est ni de tout mélanger,
        ni de raisonner logement par logement sans cadre global.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        La lecture la plus solide des sources officielles est la suivante :{' '}
        <strong>
          on distingue les recettes par catégorie, on applique les abattements correspondants, et on
          vérifie aussi les seuils applicables en activité mixte
        </strong>
        .
      </p>
    </ArticleLayout>
  );
}
