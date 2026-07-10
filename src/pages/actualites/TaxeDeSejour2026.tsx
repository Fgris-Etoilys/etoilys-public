import { Link } from 'react-router-dom';
import ArticleHeaderMeta from '../../components/ui/ArticleHeaderMeta';
import Button from '../../components/ui/Button';

export default function ArticleTaxeDeSejour2026() {
  return (
    <>
      {/* Hero */}
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <ArticleHeaderMeta readingTime="8 min de lecture" />
            <h1 className="mb-0 text-white">
              Taxe de séjour 2026 : pourquoi le classement change la donne
            </h1>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            {/* Chapô */}
            <p className="text-xl leading-comfortable text-gray-700 mb-10">
              En 2026, le classement change bien la taxe de séjour, mais pas de la façon que
              beaucoup imaginent. Un <strong>meublé classé</strong> relève d'un{' '}
              <strong>tarif fixe</strong> par personne et par nuitée selon son nombre d'étoiles,
              alors qu'un <strong>meublé non classé</strong> relève en principe d'un{' '}
              <strong>taux proportionnel</strong> appliqué au prix de la nuitée, avec un plafond
              local. À cela peuvent s'ajouter, selon le territoire, des{' '}
              <strong>taxes additionnelles</strong> départementales ou régionales. Si vous louez un
              meublé de tourisme, la vraie question n'est donc pas seulement « classé ou non classé
              ? », mais aussi « dans quelle commune et avec quelles majorations ? ».
            </p>

            {/* À retenir */}
            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    En <strong>2026</strong>, un <strong>meublé classé</strong> relève d'un{' '}
                    <strong>barème fixe</strong> par personne et par nuitée, décidé localement dans
                    les bornes prévues par le barème national.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    En <strong>2026</strong>, un{' '}
                    <strong>meublé non classé ou en attente de classement</strong> relève en
                    principe d'un <strong>taux entre 1 % et 5 %</strong> du coût par personne de la
                    nuitée <strong>HT</strong>, dans la limite du tarif le plus élevé adopté par la
                    collectivité.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le classement ne rend pas toujours la taxe plus faible dans l'absolu, mais il
                    rend son calcul <strong>plus lisible et plus prévisible</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le montant final peut être augmenté par des{' '}
                    <strong>taxes additionnelles</strong> : <strong>10 %</strong> dans certains
                    départements, <strong>15 %</strong> et <strong>200 %</strong> en Île-de-France,
                    et <strong>34 %</strong> dans certains départements visés par le CGCT.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Avant de raisonner « à la louche », il faut vérifier le{' '}
                    <strong>barème local</strong> et les <strong>majorations applicables</strong>{' '}
                    dans la commune du bien.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-accent-1 rounded-card p-6 md:p-8 mb-12">
              <h2 className="text-h4 mb-3">Simulateur taxe de séjour</h2>
              <p className="text-gray-700 leading-comfortable mb-5">
                Un simulateur est disponible pour estimer le montant de taxe de séjour sur un séjour
                type, par commune et par catégorie de classement, avec les taxes additionnelles
                applicables.
              </p>
              <Button href="/simulateur-taxe-sejour" variant="primary">
                Ouvrir le simulateur
              </Button>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">
              La vraie différence : classé = tarif fixe, non classé = taux proportionnel
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En 2026, le classement change d'abord <strong>la manière de calculer</strong> la taxe
              de séjour.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour un <strong>meublé de tourisme classé</strong>, la taxe de séjour est calculée
              selon un <strong>tarif fixe</strong> par personne et par nuitée. Ce tarif dépend :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  de la <strong>catégorie d'étoiles</strong> du bien ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  et de la <strong>délibération locale</strong> de la commune ou de l'EPCI, dans les
                  limites du barème national 2026.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour un <strong>meublé de tourisme non classé</strong> ou{' '}
              <strong>en attente de classement</strong>, la logique n'est plus la même : la taxe est
              en principe calculée selon un <strong>taux entre 1 % et 5 %</strong> du{' '}
              <strong>coût par personne de la nuitée HT</strong>, avec une <strong>limite</strong>{' '}
              fixée par le tarif le plus élevé adopté par la collectivité.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement ne change donc pas juste une « case administrative » : il change
              directement la mécanique de calcul.
            </p>

            {/* Section 2 */}
            <h2 className="mt-12 mb-4">Pourquoi le classement change concrètement la donne</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement ne signifie pas que le bien sera <strong>toujours moins taxé</strong>.
              Ce serait trop simpliste et parfois inexact.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">Ce qui change concrètement :</p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un meublé <strong>classé</strong> bascule dans un <strong>barème fixe</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un meublé <strong>non classé</strong> reste dans un{' '}
                  <strong>calcul proportionnel</strong> lié au prix de la nuitée.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, cela change plusieurs choses :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  la taxe d'un meublé classé est souvent <strong>plus prévisible</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  la taxe d'un meublé non classé peut <strong>monter plus vite</strong> quand le
                  prix par nuitée est élevé ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  sur les biens positionnés plus haut en gamme, ou sur les périodes de forte
                  demande, l'écart peut devenir très visible.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est aussi pour cela que le classement garde un intérêt concret, au-delà du seul
              sujet micro-BIC. Pour un panorama plus large des effets du classement, consultez la
              page{' '}
              <Link to="/les-avantages-du-classement" className="article-inline-link">
                pourquoi faire classer son meublé de tourisme
              </Link>
              .
            </p>

            {/* Section 3 */}
            <h2 className="mt-12 mb-4">Le barème 2026 à retenir pour les meublés classés</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les bornes nationales 2026 pour les <strong>meublés de tourisme classés</strong> sont
              les suivantes (source :{' '}
              <a
                href="https://entreprendre.service-public.fr/vosdroits/F31635"
                target="_blank"
                rel="noopener noreferrer"
              >
                Service-Public Entreprendre – barème 2026 de la taxe de séjour
              </a>
              ) :
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                <colgroup>
                  <col className="w-1/3" />
                  <col className="w-1/3" />
                  <col className="w-1/3" />
                </colgroup>
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-center font-semibold">Catégorie</th>
                    <th className="p-3 text-center font-semibold">Minimum national</th>
                    <th className="p-3 text-center font-semibold">Maximum national</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      { cat: '1 étoile', min: '0,20 €', max: '0,80 €' },
                      { cat: '2 étoiles', min: '0,30 €', max: '1,00 €' },
                      { cat: '3 étoiles', min: '0,50 €', max: '1,70 €' },
                      { cat: '4 étoiles', min: '0,70 €', max: '2,60 €' },
                      { cat: '5 étoiles', min: '0,70 €', max: '3,60 €' },
                    ] as { cat: string; min: string; max: string }[]
                  ).map(({ cat, min, max }, i) => (
                    <tr
                      key={cat}
                      className={i % 2 === 0 ? 'bg-white border-b border-gray-100' : 'bg-gray-50'}
                    >
                      <td className="p-3 text-center text-gray-700 font-medium">{cat}</td>
                      <td className="p-3 text-center text-gray-600">{min}</td>
                      <td className="p-3 text-center font-semibold text-primary-400">{max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ces fourchettes sont fixées au niveau national. C'est ensuite la{' '}
              <strong>commune</strong> ou l'<strong>EPCI</strong> qui choisit le tarif réellement
              appliqué dans la fourchette autorisée.
            </p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Le classement ne fixe pas le montant exact partout en France. Il fait entrer le bien
              dans une catégorie de barème local plus lisible.
            </blockquote>

            {/* Section 4 */}
            <h2 className="mt-12 mb-4">
              Les taxes additionnelles : le détail qu'il ne faut surtout pas oublier
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La taxe de séjour ne se limite pas au seul tarif de base de la commune. Selon le
              territoire, des <strong>taxes additionnelles</strong> peuvent s'y ajouter.
            </p>

            <h3 className="mt-8 mb-3">1. Une taxe additionnelle départementale de 10 %</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le <strong>conseil départemental</strong> peut instituer une taxe additionnelle de{' '}
              <strong>10 %</strong> à la taxe de séjour ou à la taxe de séjour forfaitaire (
              <a
                href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006181112/"
                target="_blank"
                rel="noopener noreferrer"
              >
                article L3333-1 du CGCT
              </a>
              ). Elle ne s'applique donc <strong>pas automatiquement partout</strong>, mais elle
              existe dans de nombreux territoires.
            </p>

            <h3 className="mt-8 mb-3">
              2. En Île-de-France, deux taxes additionnelles spécifiques
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              En <strong>Île-de-France</strong>, deux taxes additionnelles s'ajoutent à la taxe de
              séjour :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <strong>15 %</strong> au titre de l'article{' '}
                  <a
                    href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048704475"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    L2531-17 du CGCT
                  </a>{' '}
                  ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <strong>200 %</strong> au titre de l'article{' '}
                  <a
                    href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070633/LEGISCTA000037960232/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    L2531-18 du CGCT
                  </a>
                  .
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ces deux majorations concernent l'ensemble de la <strong>région Île-de-France</strong>
              , pas uniquement Paris.
            </p>

            <h3 className="mt-8 mb-3">
              3. Dans certains départements, une taxe additionnelle de 34 %
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le CGCT prévoit aussi, dans certains départements précis, une taxe additionnelle de{' '}
              <strong>34 %</strong> à la taxe de séjour ou à la taxe de séjour forfaitaire. Cela
              concerne des départements visés par les{' '}
              <a
                href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006164705"
                target="_blank"
                rel="noopener noreferrer"
              >
                articles L4332-4 à L4332-6 du CGCT
              </a>
              , notamment pour le financement de certains grands projets d'infrastructure.
            </p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Le bon réflexe n'est pas de raisonner uniquement avec le barème national. Il faut
              toujours vérifier le tarif réellement appliqué dans la commune du bien et les taxes
              additionnelles qui s'y ajoutent.
            </blockquote>

            {/* Section 5 – Tableau */}
            <h2 className="mt-12 mb-4">Exemples concrets</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le tableau suivant illustre comment le classement, le tarif local et les majorations
              éventuelles se combinent. Les exemples 1 et 2 sont{' '}
              <strong>hypothétiques et pédagogiques</strong> ; les exemples 3 et 4 s'appuient sur
              les{' '}
              <a
                href="https://www.service-public.fr/particuliers/actualites/A17929"
                target="_blank"
                rel="noopener noreferrer"
              >
                tarifs officiels 2026 à Paris
              </a>
              .
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-left font-semibold">Situation</th>
                    <th className="p-3 text-left font-semibold">Hypothèses</th>
                    <th className="p-3 text-left font-semibold">Calcul</th>
                    <th className="p-3 text-center font-semibold">Montant</th>
                    <th className="p-3 text-left font-semibold">Ce que ça montre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-100 align-top">
                    <td className="p-3 text-gray-700 font-medium">
                      Meublé classé 3★
                      <br />
                      <span className="text-gray-500 font-normal text-xs">
                        (hypothétique, hors taxes additionnelles)
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      Commune hors Île-de-France, sans taxe additionnelle. Tarif local voté : 1,20 €
                      par adulte et par nuitée. Séjour de 2 adultes pendant 2 nuits.
                    </td>
                    <td className="p-3 text-gray-600">1,20 € × 2 adultes × 2 nuits</td>
                    <td className="p-3 text-center font-semibold text-primary-400 whitespace-nowrap">
                      4,80 €
                    </td>
                    <td className="p-3 text-gray-600">
                      Avec un meublé classé, le calcul est direct et prévisible.
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100 align-top">
                    <td className="p-3 text-gray-700 font-medium">
                      Meublé non classé
                      <br />
                      <span className="text-gray-500 font-normal text-xs">
                        (hypothétique, même commune)
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      Séjour à 240 € HT pour 2 adultes pendant 2 nuits. Coût par personne et par
                      nuitée : 60 €. Taux voté : 5 %. Plafond local maximal : 2,60 €.
                    </td>
                    <td className="p-3 text-gray-600">
                      60 € × 5 % = 3,00 € théoriques, mais plafonné à 2,60 €. Soit 2,60 € × 2
                      adultes × 2 nuits.
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900 whitespace-nowrap">
                      10,40 €
                    </td>
                    <td className="p-3 text-gray-600">
                      Le non classé peut coûter nettement plus cher, et le plafond local devient
                      essentiel.
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100 align-top">
                    <td className="p-3 text-gray-700 font-medium">
                      Paris 2026, meublé classé 3★
                      <br />
                      <span className="text-gray-500 font-normal text-xs">(exemple officiel)</span>
                    </td>
                    <td className="p-3 text-gray-600">
                      Tarif de base : 1,70 €. Taxe additionnelle départementale (10 %) : 0,17 €.
                      Majoration régionale 15 % : 0,26 €. Majoration 200 % : 3,40 €.
                    </td>
                    <td className="p-3 text-gray-600">
                      Total officiel : 5,53 € par adulte et par nuitée. Pour 2 adultes pendant 2
                      nuits : 5,53 € × 2 × 2.
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900 whitespace-nowrap">
                      22,12 €
                    </td>
                    <td className="p-3 text-gray-600">
                      En Île-de-France, les majorations changent fortement le montant final.
                    </td>
                  </tr>
                  <tr className="bg-gray-50 align-top">
                    <td className="p-3 text-gray-700 font-medium">
                      Paris 2026, meublé non classé
                      <br />
                      <span className="text-gray-500 font-normal text-xs">
                        (pédagogique, règles officielles Paris)
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      2 adultes, 1 nuit, 200 € HT au total. Coût par personne/nuit : 100 €. Taux
                      appliqué : 5 %. Base théorique : 5 €/adulte/nuit.
                    </td>
                    <td className="p-3 text-gray-600">
                      5,00 € × 3,25 = 16,25 € théoriques par adulte/nuit, mais plafond officiel 2026
                      à Paris (non classé) : 15,93 €. Soit 15,93 € × 2 adultes.
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900 whitespace-nowrap">
                      31,86 €
                    </td>
                    <td className="p-3 text-gray-600">
                      Sur un non classé à prix élevé, le calcul proportionnel peut vite atteindre le
                      plafond local.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Ces exemples montrent pourquoi il faut éviter les raccourcis. Le classement change la
              logique de calcul, mais le montant final dépend aussi du prix de la nuitée, du taux
              local et des taxes additionnelles applicables.
            </blockquote>

            {/* Section 6 – Checklist */}
            <h2 className="mt-12 mb-4">Le bon réflexe avant de comparer deux biens</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Pour évaluer l'impact du classement sur la taxe de séjour dans un cas précis, il faut
              vérifier dans cet ordre :
            </p>
            <div className="space-y-6 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: "La commune ou l'EPCI qui perçoit la taxe",
                    desc: "C'est la collectivité locale qui fixe les tarifs applicables.",
                  },
                  {
                    num: '2',
                    title: 'Le régime local applicable (réel ou forfaitaire)',
                    desc: 'Ce point détermine la logique de calcul retenue pour le territoire.',
                  },
                  {
                    num: '3',
                    title: "Le tarif local voté pour la catégorie du bien s'il est classé",
                    desc: 'Le tarif exact est déterminé par délibération locale dans les bornes du barème national.',
                  },
                  {
                    num: '4',
                    title: "Le taux appliqué aux hébergements non classés s'il ne l'est pas",
                    desc: 'Ce taux, entre 1 % et 5 %, est également fixé par délibération locale.',
                  },
                  {
                    num: '5',
                    title: 'Le plafond local applicable aux non classés',
                    desc: 'Le montant résultant du calcul proportionnel est plafonné au tarif le plus élevé adopté par la collectivité.',
                  },
                  {
                    num: '6',
                    title: 'Les taxes additionnelles éventuelles',
                    desc: "Taxe additionnelle départementale (10 %), majorations d'Île-de-France (15 % et 200 %), ou majoration de 34 % dans certains départements selon le CGCT.",
                  },
                  {
                    num: '7',
                    title: 'Le prix moyen réel des nuitées HT',
                    desc: 'Pour le non classé, ce prix entre directement dans le calcul. Plus il est élevé, plus la taxe peut être significative.',
                  },
                ] as { num: string; title: string; desc: string }[]
              ).map(({ num, title, desc }) => (
                <div key={num} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                    {num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base leading-snug">
                      {title}
                    </h3>
                    <p className="text-gray-700 leading-comfortable">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-comfortable mb-4">
              Si vous avez des questions sur votre situation, la{' '}
              <Link to="/faq" className="article-inline-link">
                FAQ Etoilys
              </Link>{' '}
              répond aux questions les plus fréquentes des propriétaires.
            </p>

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">Le lien avec le classement Etoilys</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement ne change pas seulement le calcul de la taxe de séjour. Il conserve
              aussi un effet distinct sur le micro-BIC, détaillé dans{' '}
              <Link
                to="/actualites/micro-bic-2026-meuble-classe-vs-non-classe"
                className="article-inline-link"
              >
                notre comparatif fiscal 2026 entre meublé classé et non classé
              </Link>
              .
            </p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Si vous hésitez à faire classer votre meublé, la taxe de séjour fait partie des sujets
              concrets à regarder. Elle ne se résume pas à un avantage automatique, mais le
              classement peut rendre le cadre plus lisible et, selon le positionnement du bien et le
              territoire, plus favorable.
            </blockquote>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour en savoir plus sur la démarche concrète, consultez{' '}
              <Link to="/procedure" className="article-inline-link">
                la procédure de classement
              </Link>{' '}
              ou la{' '}
              <Link to="/faq" className="article-inline-link">
                FAQ Etoilys
              </Link>
              .
            </p>

            {/* Conclusion */}
            <h2 className="mt-12 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En 2026, le classement change bien la donne sur la taxe de séjour, parce qu'il fait
              passer le bien d'un calcul proportionnel à un barème fixe. Mais pour connaître
              l'impact réel, il faut toujours regarder le territoire du bien, le tarif local et les
              majorations applicables.
            </p>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">Simuler l’impact du classement sur la taxe de séjour</h2>
              <p className="text-gray-700 mb-6">
                Utilisez le simulateur pour comparer un meublé classé et non classé selon la
                commune, la durée du séjour et les taxes additionnelles applicables.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/simulateur-taxe-sejour" variant="primary">
                  Ouvrir le simulateur
                </Button>
                <Button href="/procedure" variant="secondary">
                  Comprendre la procédure de classement
                </Button>
              </div>
            </div>

            {/* Sources officielles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-h4 mb-6">Sources officielles</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  {
                    label: 'Service-Public Entreprendre – barème 2026 de la taxe de séjour',
                    url: 'https://entreprendre.service-public.fr/vosdroits/F31635',
                  },
                  {
                    label:
                      'Service-Public Entreprendre – taxe de séjour sur les hébergements touristiques',
                    url: 'https://entreprendre.service-public.fr/vosdroits/F743',
                  },
                  {
                    label:
                      'Légifrance – article L3333-1 du CGCT (taxe additionnelle départementale de 10 %)',
                    url: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006181112/',
                  },
                  {
                    label:
                      'Légifrance – article L2531-17 du CGCT (taxe additionnelle de 15 % en Île-de-France)',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048704475',
                  },
                  {
                    label:
                      'Légifrance – article L2531-18 du CGCT (taxe additionnelle de 200 % en Île-de-France)',
                    url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070633/LEGISCTA000037960232/',
                  },
                  {
                    label:
                      'Légifrance – articles L4332-4 à L4332-6 du CGCT (taxe additionnelle de 34 % dans certains départements)',
                    url: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006164705',
                  },
                  {
                    label: 'Service-Public – actualité officielle sur les tarifs 2026 à Paris',
                    url: 'https://www.service-public.fr/particuliers/actualites/A17929',
                  },
                ].map(({ label, url }, i) => (
                  <li key={url} className="flex gap-2">
                    <span className="text-primary-400 font-medium shrink-0">{i + 1}.</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="break-words">
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
