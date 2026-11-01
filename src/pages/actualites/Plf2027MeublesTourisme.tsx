import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref, getRelatedArticles } from '../../content/actualitesArticles';
import { getArticleAuthor } from '../../content/articleAuthors';

const PLF_DOSSIER_URL = 'https://www.assemblee-nationale.fr/dyn/17/dossiers/PLF_2027';
const PLF_TEXTE_URL = 'https://www.assemblee-nationale.fr/dyn/17/textes/l17b3210_projet-loi';
const AMENDEMENT_I540_URL = 'https://www.assemblee-nationale.fr/dyn/17/amendements/3210A/AN/540';
const SCRUTIN_9366_URL = 'https://www.assemblee-nationale.fr/dyn/17/scrutins/9366';
const AMENDEMENT_I96_URL = 'https://www.assemblee-nationale.fr/dyn/17/amendements/3210A/AN/96';
const SCRUTIN_9359_URL = 'https://www.assemblee-nationale.fr/dyn/17/scrutins/9359';
const ARTICLE_50_0_URL = 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042159220/';
const ARTICLE_39_C_URL =
  'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029355753/2026-01-29';
const MICRO_BIC_2026_URL =
  'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence';
const MICRO_BIC_ARTICLE_HREF = '/actualites/micro-bic-2026-meuble-classe-vs-non-classe';
const AVANTAGES_CLASSEMENT_HREF = '/les-avantages-du-classement';

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
      'Version analysée : projet initial du Gouvernement déposé le 1er octobre 2026. Les alinéas 7 à 24 de l’article 7, sur l’amortissement des locations meublées, ont été supprimés en séance le 30 octobre 2026. L’article 33 porte sur l’entrée en vigueur des mesures fiscales.',
  },
  {
    id: 'assemblee-nationale-amendement-i-540-plf-2027-3',
    organization: 'Assemblée nationale',
    title: 'Amendement n° I-540 après l’article 7 du PLF 2027',
    url: AMENDEMENT_I540_URL,
    detail:
      'Modifie l’article 50-0 du CGI pour les meublés de tourisme classés, les chambres d’hôtes et les gîtes ruraux. Adopté en séance publique le 30 octobre 2026.',
  },
  {
    id: 'assemblee-nationale-scrutin-9366-4',
    organization: 'Assemblée nationale',
    title: 'Scrutin public n° 9366 sur l’amendement n° I-540',
    url: SCRUTIN_9366_URL,
    detail: '30 octobre 2026 : 37 voix pour, 35 contre, 2 abstentions.',
  },
  {
    id: 'legifrance-article-50-0-cgi-5',
    organization: 'Légifrance',
    title:
      'Article 50-0 du Code général des impôts (version en vigueur depuis le 1er juillet 2026)',
    url: ARTICLE_50_0_URL,
  },
  {
    id: 'assemblee-nationale-amendement-i-96-plf-2027-6',
    organization: 'Assemblée nationale',
    title: 'Amendement n° I-96 à l’article 7 du PLF 2027',
    url: AMENDEMENT_I96_URL,
    detail:
      'Supprime les alinéas 7 à 24 de l’article 7. Adopté en séance publique le 30 octobre 2026, avec plusieurs amendements identiques.',
  },
  {
    id: 'assemblee-nationale-scrutin-9359-7',
    organization: 'Assemblée nationale',
    title: 'Scrutin public n° 9359 sur l’amendement n° I-96',
    url: SCRUTIN_9359_URL,
    detail: '30 octobre 2026 : 45 voix pour, 41 contre.',
  },
  {
    id: 'legifrance-article-39-c-cgi-8',
    organization: 'Légifrance',
    title: 'Article 39 C du Code général des impôts (version en vigueur)',
    url: ARTICLE_39_C_URL,
  },
  {
    id: 'economie-gouv-fr-micro-bic-meubles-tourisme-9',
    organization: 'economie.gouv.fr',
    title: 'Location meublée de tourisme : règles fiscales et seuils micro-BIC',
    url: MICRO_BIC_2026_URL,
  },
];

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'micro-bic-les-deputes-votent-71-dabattement-pour-les-meubles-classes',
    label: 'Micro-BIC : les députés votent 71 % d’abattement pour les meublés classés',
  },
  {
    id: 'amortissement-lmnp-le-plafonnement-prevu-a-ete-retire-du-texte',
    label: 'Amortissement LMNP : le plafonnement prévu a été retiré du texte',
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

const removedAmortizationMeasures = [
  'un plafond de 1,5 % et 5 000 € par an et par foyer fiscal pour l’amortissement d’un meublé de tourisme ;',
  'un plafond de 2,5 % et 7 000 € pour les autres locations meublées non professionnelles ;',
  'la fin du report de l’amortissement non déduit, pour les exercices clos à compter du 1er janvier 2027 ;',
  'un délai pour utiliser l’amortissement accumulé avant 2027 : jusqu’au 31 décembre 2036, dans la limite de la moitié du résultat imposable.',
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={[
      {
        id: 'plf2027meublestourisme-takeaway-1',
        content: (
          <>
            Le 30 octobre 2026, les députés ont voté un{' '}
            <strong>micro-BIC à 71 % d’abattement pour les meublés de tourisme classés</strong>,
            avec un plafond de recettes de 203 100 €. Pour les revenus 2026, ce régime est de 50 %
            et 83 600 €.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-2',
        content: (
          <>
            Les meublés non classés restent à 30 % d’abattement et 15 000 € de plafond.{' '}
            <strong>
              L’écart d’abattement entre classé et non classé passerait de 20 à 41 points
            </strong>{' '}
            : le classement deviendrait un levier fiscal bien plus puissant qu’aujourd’hui.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-3',
        content: (
          <>
            Les députés ont aussi <strong>supprimé le plafonnement de l’amortissement</strong> prévu
            pour les LMNP au régime réel : 1,5 % et 5 000 € par an pour un meublé de tourisme, 2,5 %
            et 7 000 € pour les autres locations meublées.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-4',
        content: (
          <>
            La <strong>fin du report</strong> des amortissements non déduits et la limitation du
            stock accumulé avant 2027 ont également été retirées. Au régime réel, les règles
            actuelles restent donc les mêmes à ce stade.
          </>
        ),
      },
      {
        id: 'plf2027meublestourisme-takeaway-5',
        content: (
          <>
            Ces votes ont eu lieu en première lecture à l’Assemblée nationale. Ils peuvent encore
            être remis en cause d’ici l’adoption définitive du budget : pour l’instant, les règles
            actuelles continuent de s’appliquer.
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
          Le 30 octobre 2026, les députés ont voté un avantage fiscal majeur pour les meublés de
          tourisme classés : un micro-BIC à 71 % d’abattement, contre 50 % aujourd’hui, avec un
          plafond de recettes porté à 203 100 €. Les non-classés restant à 30 %, l’écart
          d’abattement entre les deux ferait plus que doubler. Les députés ont aussi retiré le
          plafonnement de l’amortissement prévu pour les loueurs au régime réel. Rien n’est encore
          définitif : tant que le budget n’est pas adopté, les règles actuelles s’appliquent.
        </p>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <div className="article-cta-panel mb-12 mt-12 p-8">
          <h2 className="text-h4 mb-3">Vous êtes au micro-BIC ?</h2>
          <p className="text-muted leading-comfortable mb-6">
            Pour vos revenus 2026, le classement change déjà nettement votre imposition. Notre
            décryptage détaille les seuils et abattements qui s’appliquent aujourd’hui, en attendant
            le vote définitif du budget.
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
      <ArticleSectionHeading id="micro-bic-les-deputes-votent-71-dabattement-pour-les-meubles-classes">
        Micro-BIC : les députés votent 71 % d’abattement pour les meublés classés
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Le 30 octobre 2026, les députés ont adopté{' '}
        <a
          href={AMENDEMENT_I540_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          l’amendement n° I-540
        </a>
        , qui donne un sérieux coup de pouce aux meublés de tourisme classés au micro-BIC. Dans ce
        régime, vous ne déduisez ni vos charges ni l’amortissement : l’administration applique un
        abattement forfaitaire sur vos recettes, et vous êtes imposé sur le reste.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        L’amendement porte cet abattement à <strong>71 %</strong> pour les meublés de tourisme
        classés, contre 50 % pour les revenus 2026. Le plafond de recettes pour rester au micro-BIC
        passerait de 83 600 € à <strong>203 100 €</strong>. Les chambres d’hôtes et les gîtes ruraux
        sont aussi concernés. Le vote a été acquis par 37 voix contre 35.
      </p>

      <ResponsiveComparisonTable
        appearance="editorial"
        className="mb-6"
        caption="Micro-BIC des meublés de tourisme : règles des revenus 2026 et amendement voté le 30 octobre 2026"
        primaryColumnKey="logement"
        columns={[
          {
            key: 'logement',
            label: 'Logement',
            align: 'center',
            widthClassName: 'w-1/3',
          },
          {
            key: 'revenus2026',
            label: (
              <>
                Revenus 2026
                <br />
                (règles actuelles)
              </>
            ),
            mobileLabel: 'Revenus 2026 (règles actuelles)',
            align: 'center',
            widthClassName: 'w-1/3',
          },
          {
            key: 'amendement',
            label: (
              <>
                Avec l’amendement
                <br />
                du 30 octobre
              </>
            ),
            mobileLabel: 'Avec l’amendement du 30 octobre',
            align: 'center',
            widthClassName: 'w-1/3',
          },
        ]}
        rows={[
          {
            key: 'classe',
            cells: {
              logement: 'Meublé de tourisme classé',
              revenus2026: (
                <>
                  50 % d’abattement
                  <br />
                  plafond de 83 600 €<span className="sr-only"> pour les revenus 2026</span>
                </>
              ),
              amendement: (
                <span className="font-semibold text-copper">
                  71 % d’abattement
                  <br />
                  plafond de 203 100 €
                </span>
              ),
            },
          },
          {
            key: 'non-classe',
            cells: {
              logement: 'Meublé de tourisme non classé',
              revenus2026: (
                <>
                  30 % d’abattement
                  <br />
                  plafond de 15 000 €
                </>
              ),
              amendement: (
                <>
                  Inchangé : 30 % d’abattement
                  <br />
                  plafond de 15 000 €
                </>
              ),
            },
          },
        ]}
        desktopWrapperClassName="hidden md:block"
        headerCellClassName="p-3 font-semibold break-words"
        mobileContainerClassName="md:hidden space-y-3"
        mobileTitleClassName="text-sm font-semibold text-ink mb-3"
        mobileLabelClassName="text-xs font-medium text-muted"
      />

      <p className="text-muted leading-comfortable mb-4">
        C’est surtout l’écart avec les meublés non classés qui changerait d’échelle. L’amendement ne
        les concerne pas : ils restent à 30 % d’abattement, dans la limite de 15 000 € de recettes.
        La différence d’abattement entre un meublé classé et un meublé non classé passerait ainsi de
        20 à 41 points.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Ce ne serait donc pas un simple retour en arrière. Avant la loi Le Meur de 2024, les meublés
        classés bénéficiaient déjà de 71 %, mais les non-classés relevaient en général de 50 %, soit
        21 points d’écart. Avec cet amendement, l’avantage du classement serait deux fois plus
        important.
      </p>
      <div className="article-callout-muted mb-6 p-5">
        <p className="text-muted leading-comfortable">
          <strong className="text-ink">Exemple.</strong> Prenons un logement qui encaisse 12 000 €
          de recettes dans l’année. Non classé, il est imposé sur 8 400 €. Classé, il l’est
          aujourd’hui sur 6 000 €, et le serait sur 3 480 € avec l’amendement voté le 30 octobre :
          un montant imposable près de deux fois et demie plus faible que pour le même logement non
          classé. Ce calcul porte sur le revenu soumis à l’impôt, avant application de votre taux
          d’imposition et des prélèvements sociaux.
        </p>
      </div>
      <p className="text-muted leading-comfortable mb-4">
        Le point important : ce vote ne change pas encore vos règles. Tant que la loi de finances
        n’est pas définitivement adoptée, un meublé classé au micro-BIC reste soumis à un abattement
        de 50 %, dans la limite de 83 600 € de recettes pour les revenus 2026.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        L’amendement ne fixe pas lui-même de date d’application. Dans ce cas,{' '}
        <a
          href={PLF_TEXTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          l’article 33 du projet
        </a>{' '}
        prévoit une entrée en vigueur au 31 décembre 2026 pour les impôts calculés sur l’année
        civile, comme l’impôt sur le revenu. Si la mesure restait inchangée jusqu’au vote final,
        elle pourrait donc s’appliquer dès les revenus 2026. Tout dépendra du texte définitivement
        adopté.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Si cette mesure est confirmée, faire classer son meublé deviendrait un levier fiscal bien
        plus puissant qu’aujourd’hui pour les loueurs au micro-BIC. Aujourd’hui déjà, le classement
        change nettement le calcul de votre impôt : retrouvez{' '}
        <Link to={AVANTAGES_CLASSEMENT_HREF} className="article-inline-link">
          les avantages du classement de votre meublé
        </Link>{' '}
        et le détail des seuils actuels dans{' '}
        <Link to={MICRO_BIC_ARTICLE_HREF} className="article-inline-link">
          notre décryptage du micro-BIC 2026
        </Link>
        .
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Si vous êtes au réel avec un meublé classé, un abattement de 71 % pourrait aussi rendre le
        micro-BIC plus intéressant dans certains cas. La comparaison ne pourra se faire qu’une fois
        les règles définitives connues.
      </p>

      <ArticleSectionHeading id="amortissement-lmnp-le-plafonnement-prevu-a-ete-retire-du-texte">
        Amortissement LMNP : le plafonnement prévu a été retiré du texte
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Le même jour, les députés ont aussi retiré du texte la principale mesure qui visait les
        loueurs au régime réel : le plafonnement de l’amortissement.
      </p>
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
        Le projet initial du Gouvernement, déposé le 1er octobre 2026, voulait fortement restreindre
        ce mécanisme. Il prévoyait :
      </p>
      <ul className="space-y-2 mb-6 text-muted">
        {removedAmortizationMeasures.map((measure) => (
          <li key={measure} className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-bold text-copper" aria-hidden="true">
              •
            </span>
            <span>{measure}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted leading-comfortable mb-4">
        Le 30 octobre 2026, les députés ont supprimé l’ensemble de ces mesures avec{' '}
        <a
          href={AMENDEMENT_I96_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          l’amendement n° I-96
        </a>{' '}
        et plusieurs amendements identiques, adoptés par 45 voix contre 41. Elles ne figurent plus
        dans le texte examiné.
      </p>
      <div className="article-callout-muted mb-6 p-5">
        <p className="text-muted leading-comfortable">
          <strong className="text-ink">Concrètement.</strong> Si vous êtes au régime réel, vos
          règles d’amortissement restent celles d’aujourd’hui, y compris le report sans limite de
          durée. Gardez seulement en tête qu’une mesure supprimée par l’Assemblée peut revenir plus
          tard dans la discussion du budget.
        </p>
      </div>

      <ArticleSectionHeading id="ce-qui-peut-encore-changer-pendant-lexamen-du-budget">
        Ce qui peut encore changer pendant l’examen du budget
      </ArticleSectionHeading>
      <p className="text-muted leading-comfortable mb-4">
        Les votes du 30 octobre modifient le texte en discussion, pas encore la loi. Deux questions
        restent ouvertes.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        <strong className="text-ink">
          Les 71 % pour les meublés classés seront-ils confirmés ?
        </strong>{' '}
        Rien ne le garantit. L’amendement a été adopté de justesse et peut encore être modifié ou
        supprimé avant le vote définitif.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        <strong className="text-ink">Le plafonnement de l’amortissement peut-il revenir ?</strong>{' '}
        C’est possible. Une mesure supprimée par les députés peut être réintroduite plus tard, par
        exemple par le Sénat ou dans la version finale du budget.
      </p>
      <p className="text-muted leading-comfortable mb-4">
        Plusieurs étapes peuvent encore faire évoluer le texte : le vote des députés sur l’ensemble
        du budget, l’examen au Sénat, puis la recherche d’une version commune entre les deux
        assemblées. Si le Gouvernement engage sa responsabilité avec l’article 49.3 de la
        Constitution, c’est lui qui choisit les amendements conservés. Et si les députés rejetaient
        le budget, le Sénat repartirait du projet initial du Gouvernement : sans la mesure sur le
        micro-BIC, et avec les restrictions sur l’amortissement.
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
        Il est en cours d’examen en première lecture à l’Assemblée nationale. Les votes du 30
        octobre modifient le texte, mais ne valent pas adoption de la loi de finances : le budget
        doit encore être voté par les députés, puis examiné par le Sénat.
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
        <li>
          <p className="font-semibold text-ink mb-1">
            <time dateTime="2026-10-30">30 octobre 2026</time> — Votes des députés en séance
            publique
          </p>
          <p className="leading-comfortable">
            Les députés adoptent l’amendement n° I-540, qui porte à 71 % l’abattement micro-BIC des
            meublés de tourisme classés, des chambres d’hôtes et des gîtes ruraux, avec un plafond
            de 203 100 € (37 voix contre 35). Ils suppriment aussi l’ensemble des restrictions sur
            l’amortissement des LMNP (amendement n° I-96 et amendements identiques, 45 voix contre
            41).
          </p>
        </li>
      </ol>
    </ArticleLayout>
  );
}
