import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref, getRelatedArticles } from '../../content/actualitesArticles';
import { getArticleAuthor } from '../../content/articleAuthors';

const PLF_DOSSIER_URL = 'https://www.assemblee-nationale.fr/dyn/17/dossiers/PLF_2027';
const PLF_TEXTE_URL = 'https://www.assemblee-nationale.fr/dyn/17/textes/l17b3210_projet-loi';
const ARTICLE_39_C_URL =
  'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029355753/2026-01-29';
const MICRO_BIC_2026_URL =
  'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence';
const RAPPORT_LE_MEUR_URL =
  'https://portail.documentation.developpement-durable.gouv.fr/pub/CGE00001131-propositions-reforme-fiscalite-locative-appui-mme.html';
const MICRO_BIC_ARTICLE_HREF = '/actualites/micro-bic-2026-meuble-classe-vs-non-classe';

const officialSources = [
  {
    id: 'assemblee-nationale-dossier-plf-2027-1',
    organization: 'Assemblée nationale',
    title: 'Projet de loi de finances pour 2027 : dossier législatif',
    url: PLF_DOSSIER_URL,
  },
  {
    id: 'assemblee-nationale-texte-plf-2027-articles-7-33-2',
    organization: 'Assemblée nationale',
    title: 'Projet de loi de finances pour 2027 n° 3210, articles 7 et 33',
    url: PLF_TEXTE_URL,
    detail:
      'Version analysée : projet initial du Gouvernement déposé le 1er octobre 2026. L’article 7 porte sur l’amortissement, l’article 33 sur l’entrée en vigueur des mesures fiscales.',
  },
  {
    id: 'legifrance-article-39-c-cgi-3',
    organization: 'Légifrance',
    title: 'Article 39 C du Code général des impôts (version en vigueur)',
    url: ARTICLE_39_C_URL,
  },
  {
    id: 'economie-gouv-fr-micro-bic-meubles-tourisme-4',
    organization: 'economie.gouv.fr',
    title: 'Location meublée de tourisme : règles fiscales et seuils micro-BIC',
    url: MICRO_BIC_2026_URL,
  },
  {
    id: 'igf-igedd-rapport-le-meur-fiscalite-locative-5',
    organization: 'IGF / IGEDD',
    title: 'Propositions de réforme de la fiscalité locative (appui à Annaïg Le Meur, mai 2024)',
    url: RAPPORT_LE_MEUR_URL,
    detail:
      'Tableau 14 : déclarants LMNP par régime d’imposition en 2021, d’après la Direction de la législation fiscale.',
  },
];

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'le-plf-2027-veut-fortement-limiter-lamortissement-des-meubles-de-tourisme',
    label: 'Le PLF 2027 veut fortement limiter l’amortissement des meublés de tourisme',
  },
  {
    id: 'qui-serait-reellement-concerne',
    label: 'Qui serait réellement concerné ?',
  },
  {
    id: 'le-projet-change-aussi-le-sort-des-amortissements-non-deduits',
    label: 'Le projet change aussi le sort des amortissements non déduits',
  },
  {
    id: 'ce-qui-peut-encore-changer-pendant-lexamen-du-budget',
    label: 'Ce qui peut encore changer pendant l’examen du budget',
  },
  {
    id: 'ou-en-est-le-plf-2027',
    label: 'Où en est le PLF 2027 ?',
  },
];

const pointsToWatch = [
  'le taux de 1,5 % et le plafond de 5 000 € prévus pour les meublés de tourisme ;',
  'l’écart de traitement avec les autres locations meublées (2,5 % et 7 000 €) ;',
  'la fin du report des amortissements non déduits ;',
  'le sort du stock accumulé avant 2027 : délai jusqu’en 2036 et limite de 50 % ;',
  'le calendrier d’application ;',
  'l’apparition d’une autre mesure visant les meublés de tourisme, notamment sur le micro-BIC.',
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={[
      {
        id: 'plf2027meublestourisme-takeaway-1',
        content: (
          <>
            Pour les meublés de tourisme, le Gouvernement propose de plafonner la déduction de
            l’amortissement du logement à{' '}
            <strong>1,5 % et 5 000 € par an et par foyer fiscal</strong>, contre 2,5 % et 7 000 €
            pour les autres locations meublées non professionnelles.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-2',
        content: (
          <>
            Pour les exercices clos à compter du 1er janvier 2027, l’amortissement qui ne pourrait
            pas être déduit dans l’année <strong>ne serait plus reportable</strong> sur les
            exercices suivants.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-3',
        content: (
          <>
            Les amortissements accumulés avant 2027 resteraient utilisables{' '}
            <strong>jusqu’au 31 décembre 2036</strong>, mais dans la limite de la moitié du résultat
            imposable restant après application des nouvelles règles.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-4',
        content: (
          <>
            La mesure vise les <strong>LMNP au régime réel</strong>. Au micro-BIC, vous ne déduisez
            pas d’amortissement : ce plafonnement ne vous concerne pas. Pour les revenus 2026, un
            meublé classé y conserve un plafond de 83 600 € avec 50 % d’abattement, contre 15 000 €
            et 30 % pour un non-classé.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-5',
        content: (
          <>
            Rien n’est encore définitif : ces règles correspondent au projet déposé le 1er octobre
            2026 et peuvent encore évoluer avant l’adoption du budget.
          </>
        ),
      },
    ]}
  />
);

const articleSources = <ArticleSources sources={officialSources} />;

const article = getActualiteArticleByHref('/actualites/plf-2027-meubles-tourisme');

export default function ArticlePlf2027MeublesTourisme() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <p className="text-xl leading-comfortable text-muted mb-6">
          Le PLF 2027 s’attaque directement à l’un des grands avantages du LMNP au régime réel :
          l’amortissement. Pour les meublés de tourisme, le Gouvernement propose de limiter beaucoup
          plus fortement ce qui peut être déduit chaque année. Si vous êtes au micro-BIC, cette
          mesure ne vous concerne pas. Si vous êtes au réel, en revanche, le changement peut être
          important.
        </p>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <div className="article-cta-panel mb-12 mt-12 p-8">
          <h2 className="text-h4 mb-3">Vous êtes au micro-BIC ?</h2>
          <p className="text-muted leading-comfortable mb-6">
            Cette réforme de l’amortissement ne vous concerne pas directement. Pour vous, les
            repères restent les seuils et abattements du micro-BIC, qui diffèrent fortement entre
            meublés classés et non classés.
          </p>
          <Button href={MICRO_BIC_ARTICLE_HREF} variant="primary">
            Lire notre décryptage du micro-BIC 2026
          </Button>
        </div>
      }
      sources={articleSources}
      relatedArticles={getRelatedArticles(article)}
      author={getArticleAuthor(article.authorId)}
    >
      <ArticleSectionHeading id="le-plf-2027-veut-fortement-limiter-lamortissement-des-meubles-de-tourisme">
        Le PLF 2027 veut fortement limiter l’amortissement des meublés de tourisme
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Au régime réel, un loueur en meublé non professionnel (LMNP) ne paie pas l’impôt sur ses
        loyers bruts. Il déduit ses charges réelles (intérêts d’emprunt, assurance, taxe foncière,
        frais de gestion…) et l’amortissement du logement : chaque année, une partie de sa valeur,
        hors terrain, est passée en charge. C’est le mécanisme central du réel en LMNP.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Cet amortissement a déjà une limite : il ne peut pas créer de déficit. Il se déduit dans la
        limite des loyers diminués des autres charges. La part qui dépasse n’est pas perdue pour
        autant : elle est reportée sur les années suivantes, sans limite de durée. C’est ce que
        prévoit l’
        <a
          href={ARTICLE_39_C_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          article 39 C du Code général des impôts
        </a>
        .
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Le projet veut surtout changer deux choses : le montant déductible chaque année, et le sort
        de ce qui n’est pas déduit.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Pour toutes les locations meublées non professionnelles, l’amortissement du logement serait
        déductible dans la limite d’un taux de <strong>2,5 %</strong>, sans dépasser{' '}
        <strong>7 000 €</strong> par an et par foyer fiscal. Pour un meublé de tourisme, la règle
        serait plus stricte : <strong>1,5 %</strong> et <strong>5 000 €</strong> au maximum. Le
        plafond est fixé par foyer fiscal, et non par logement.
      </p>
      <div className="article-callout-muted mb-6 p-5">
        <p className="text-muted leading-comfortable">
          <strong className="text-ink">Concrètement.</strong> Prenons un propriétaire qui exploite
          un seul meublé de tourisme et dont la comptabilité fait apparaître 8 000 € d’amortissement
          sur l’exercice 2027. Avec le projet actuel, il ne pourrait pas en déduire plus de 5 000 €.
          Selon la valeur du logement, le taux de 1,5 % peut même conduire à une déduction plus
          faible. Au moins 3 000 € ne seraient donc pas déductibles au titre de cet exercice et ne
          pourraient plus être reportés sur les exercices suivants.
        </p>
      </div>
      <p className="text-muted leading-comfortable mb-4">
        Pour un propriétaire, cela signifie un résultat imposable plus élevé, donc, selon les cas,
        davantage d’impôt. Le montant exact dépend de ses autres charges, de son résultat et de la
        situation fiscale de son foyer.
      </p>

      <ArticleSectionHeading id="qui-serait-reellement-concerne">
        Qui serait réellement concerné ?
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        La mesure vise les loueurs en meublé non professionnels au régime réel. Les loueurs en
        meublé professionnels (LMP) ne sont pas concernés par ce nouveau plafonnement.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Si vous êtes au micro-BIC, vous n’êtes pas directement concerné. L’administration applique
        un abattement forfaitaire sur vos recettes : vous ne déduisez ni vos charges réelles ni
        d’amortissement. Un plafond d’amortissement ne change donc rien à votre calcul.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Pour les revenus 2026, un meublé de tourisme classé peut actuellement rester au micro-BIC
        jusqu’à 83 600 € de recettes avec un abattement de 50 %, contre 15 000 € et 30 % pour un
        meublé non classé. Le détail figure dans{' '}
        <Link to={MICRO_BIC_ARTICLE_HREF} className="article-inline-link">
          notre décryptage du micro-BIC 2026
        </Link>
        .
      </p>
      <p className="text-muted leading-comfortable mb-4">
        À titre d’ordre de grandeur, les données fiscales 2021 reprises dans le{' '}
        <a
          href={RAPPORT_LE_MEUR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          rapport Le Meur
        </a>{' '}
        comptaient environ 305 000 déclarants LMNP au régime réel sur un peu plus d’un million au
        total, soit près de 30 %. Ce chiffre concerne l’ensemble de la location meublée non
        professionnelle, pas uniquement les meublés de tourisme.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Le rapport relève aussi que le choix du réel n’est presque jamais lié à un dépassement des
        seuils du micro : il tient surtout à l’intérêt de déduire ses charges et l’amortissement du
        bien. C’est précisément ce levier que vise le projet.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Dans la rédaction actuelle du PLF, le plafond spécifique vise les meublés de tourisme sans
        distinguer les logements classés des non-classés.
      </p>

      <ArticleSectionHeading id="le-projet-change-aussi-le-sort-des-amortissements-non-deduits">
        Le projet change aussi le sort des amortissements non déduits
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        La réforme ne se limite pas au couple 1,5 % / 5 000 €. Elle change aussi ce qui arrive à
        l’amortissement que vous ne pouvez pas déduire dans l’année.
      </p>

      <h3 className="mt-8 mb-3">1. L’amortissement à venir ne serait plus reportable</h3>
      <p className="text-muted leading-comfortable mb-4">
        Aujourd’hui, l’amortissement non déduit faute de bénéfice suffisant est mis de côté, puis
        utilisé plus tard, sans limite de temps. C’est ce qui permet souvent de neutraliser l’impôt
        sur les loyers pendant plusieurs années.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Avec le projet, pour les exercices clos à compter du 1er janvier 2027, l’amortissement non
        déduit ne pourrait plus être reporté sur les exercices suivants, qu’il dépasse le nouveau
        plafond ou la limite existante des loyers diminués des charges. Il ne servirait donc plus à
        réduire l’impôt des années suivantes.
      </p>

      <h3 className="mt-8 mb-3">
        2. Le stock accumulé avant 2027 : jusqu’en 2036, avec une limite
      </h3>
      <p className="text-muted leading-comfortable mb-4">
        L’amortissement accumulé et non déduit avant le 1er janvier 2027 ne disparaîtrait pas du
        jour au lendemain. Il resterait déductible des résultats des exercices clos jusqu’au
        31&nbsp;décembre&nbsp;2036, mais pas librement : chaque année, il ne pourrait réduire que la
        moitié du résultat imposable restant après application des nouvelles règles. Le texte ne
        prévoit pas de déduction au-delà de 2036.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Aujourd’hui, ce stock s’utilise sans limite de durée et sans plafond de moitié.
      </p>
      <div className="article-callout-muted mb-6 p-5">
        <p className="text-muted leading-comfortable">
          <strong className="text-ink">Exemple.</strong> Un propriétaire arrive au 31 décembre 2026
          avec 20 000 € d’amortissements non encore déduits. En 2027, après ses charges et
          l’amortissement de l’année, son résultat imposable s’élève à 6 000 €. Avec le projet, son
          stock ne pourrait réduire ce résultat que de 3 000 € cette année-là. Il lui resterait
          17&nbsp;000&nbsp;€ à utiliser, dans les mêmes limites, jusqu’en 2036.
        </p>
      </div>

      <ArticleSectionHeading id="ce-qui-peut-encore-changer-pendant-lexamen-du-budget">
        Ce qui peut encore changer pendant l’examen du budget
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Le texte présenté ici est celui du Gouvernement. Avant de considérer la réforme comme
        acquise, voici les points à surveiller :
      </p>
      <ul className="space-y-2 mb-6 text-muted">
        {pointsToWatch.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
              •
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted leading-comfortable mb-4">
        Le calendrier mérite une attention particulière. Le projet ne fixe pas de date d’application
        propre au nouveau plafond. Sauf disposition contraire, son{' '}
        <a
          href={PLF_TEXTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          article 33
        </a>{' '}
        prévoit une entrée en vigueur au 31 décembre 2026 pour les impositions dont le fait
        générateur est l’achèvement de l’année civile ou la clôture de l’exercice comptable. La fin
        du report et le régime du stock visent, eux, expressément les exercices clos à compter du
        1er janvier 2027.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Seules les modifications adoptées comptent : un amendement simplement déposé ne change pas
        l’état du texte.
      </p>

      <ArticleSectionHeading id="ou-en-est-le-plf-2027">
        Où en est le PLF 2027 ?
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Le projet de loi de finances pour 2027 a été déposé par le Gouvernement le 1er octobre 2026.
        Les mesures présentées dans cet article correspondent à l’état actuel du texte : elles
        peuvent encore être amendées, supprimées ou remplacées avant l’adoption définitive du
        budget.
      </p>

      <h3 className="mt-8 mb-3">Historique des étapes importantes</h3>
      <ol className="mb-6 space-y-4 text-muted">
        <li>
          <p className="font-semibold text-ink mb-1">
            <time dateTime="2026-10-01">1er octobre 2026</time> — Projet initial du Gouvernement
          </p>
          <p className="leading-comfortable">
            Le Gouvernement propose de plafonner l’amortissement immobilier des LMNP, avec un régime
            plus strict pour les meublés de tourisme : 1,5 % et 5 000 € par an et par foyer fiscal.
            Il propose aussi de supprimer le report des amortissements non déduits à partir des
            exercices clos en 2027.
          </p>
        </li>
      </ol>
    </ArticleLayout>
  );
}
