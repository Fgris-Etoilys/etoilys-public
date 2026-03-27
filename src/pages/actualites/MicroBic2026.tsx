import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import Button from '../../components/ui/Button';

const ARTICLE_URL = 'https://etoilys.fr/actualites/micro-bic-2026-meuble-classe-vs-non-classe';
const COVER_IMAGE =
  'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function ArticleMicroBic2026() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-schema-micro-bic-2026';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: "Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse",
      author: { '@type': 'Person', name: 'Florian Grisorio' },
      datePublished: '2026-03-12',
      dateModified: '2026-03-12',
      image: COVER_IMAGE,
      publisher: {
        '@type': 'Organization',
        name: 'Etoilys',
        logo: { '@type': 'ImageObject', url: 'https://etoilys.fr/logo.png' },
      },
      mainEntityOfPage: ARTICLE_URL,
      description:
        'Seuils, abattements, régime réel, micro-entreprise : voici ce qui change en 2026 entre un meublé de tourisme classé et non classé.',
    });
    document.head.appendChild(script);
    return () => {
      const existing = document.getElementById('article-schema-micro-bic-2026');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  return (
    <>
      <SEO
        title="Micro-BIC 2026 : meublé classé vs non classé | Etoilys"
        description="Seuils, abattements, régime réel, micro-entreprise : voici ce qui change en 2026 entre un meublé de tourisme classé et non classé."
        keywords="micro-BIC 2026, meublé de tourisme classé, meublé non classé, abattement fiscal, régime réel, micro-entreprise, classement meublé"
      />

      {/* Hero */}
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-white/80 text-sm">
              <Link to="/actualites" className="hover:text-white transition-colors text-white/80">
                ← Actualités
              </Link>
              <span aria-hidden="true">•</span>
              <time dateTime="2026-03-12">Publié le 12 mars 2026</time>
              <span aria-hidden="true">•</span>
              <span>Florian Grisorio</span>
            </div>
            <h1 className="mb-0 text-white">
              Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse
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
              En 2026, le classement d'un meublé de tourisme garde un intérêt fiscal concret : il
              permet encore de rester dans un cadre micro-BIC nettement moins dégradé que celui d'un
              meublé non classé. Le point essentiel à comprendre est simple : entre 2025 et 2026,
              l'écart fiscal entre classé et non classé s'est fortement creusé, et la première vraie
              rupture s'applique déjà à la <strong>déclaration 2026 sur les revenus 2025</strong>.
              Il faut aussi éviter de confondre micro-BIC, micro-entreprise et régime réel.
            </p>

            {/* À retenir */}
            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>

              {/* Tableau comparatif */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-300 text-white">
                      <th className="p-3 text-left font-semibold">Période</th>
                      <th className="p-3 text-center font-semibold">Non classé — plafond</th>
                      <th className="p-3 text-center font-semibold">Non classé — abattement</th>
                      <th className="p-3 text-center font-semibold">Classé — plafond</th>
                      <th className="p-3 text-center font-semibold">Classé — abattement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-primary-200">
                      <td className="p-3 text-gray-700">
                        Revenus 2025
                        <br />
                        (déclarés en 2026)
                      </td>
                      <td className="p-3 text-center font-semibold text-gray-900">15 000 €</td>
                      <td className="p-3 text-center text-gray-700">30 %</td>
                      <td className="p-3 text-center font-semibold text-primary-400">77 700 €</td>
                      <td className="p-3 text-center text-gray-700">50 %</td>
                    </tr>
                    <tr className="bg-primary-100">
                      <td className="p-3 text-gray-700">
                        Revenus 2026
                        <br />
                        (déclarés en 2027)
                      </td>
                      <td className="p-3 text-center font-semibold text-gray-900">15 000 €</td>
                      <td className="p-3 text-center text-gray-700">30 %</td>
                      <td className="p-3 text-center font-semibold text-primary-400">83 600 €</td>
                      <td className="p-3 text-center text-gray-700">50 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le <strong>classement ne supprime pas les autres obligations</strong>, mais il
                    conserve un intérêt fiscal concret pour les propriétaires qui restent au
                    micro-BIC.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Il ne faut pas confondre le <strong>micro-BIC fiscal</strong> avec la{' '}
                    <strong>micro-entreprise</strong> : le cadre devient beaucoup plus contraignant
                    pour les meublés non classés.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">
              La vraie question en 2026 : le classement garde-t-il encore un avantage fiscal ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">Oui, clairement.</p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement d'un meublé de tourisme n'est pas qu'un repère commercial ou
              administratif. En 2026, il garde un effet fiscal concret, parce qu'il permet encore de
              bénéficier d'un cadre micro-BIC beaucoup moins dégradé que celui des meublés non
              classés.
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
              n'a pas supprimé l'intérêt fiscal du classement. Elle l'a au contraire rendu plus
              visible, parce qu'elle a fortement durci la situation des meublés non classés. Et la
              grande rupture s'applique déjà à la déclaration 2026 sur les revenus 2025, pas
              seulement à des horizons futurs.
            </p>

            {/* Section 2+3 fusionnées */}
            <h2 className="mt-12 mb-4">Seuils et abattements micro-BIC : le détail par année</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Depuis la réforme issue de la{' '}
              <a
                href="https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur"
                target="_blank"
                rel="noopener noreferrer"
              >
                loi du 19 novembre 2024
              </a>
              , les seuils et abattements du micro-BIC ne sont plus du tout les mêmes selon que le
              meublé est classé ou non. Le tableau suivant résume les paramètres en vigueur, tels
              que confirmés par la{' '}
              <a
                href="https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau"
                target="_blank"
                rel="noopener noreferrer"
              >
                FAQ fiscale DGFiP mise à jour le 18 mars 2026
              </a>{' '}
              et l'
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048844097/2023-12-31"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 50-0 du CGI
              </a>
              .
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-left font-semibold">Période</th>
                    <th className="p-3 text-center font-semibold">
                      Non classé
                      <br />
                      Plafond micro
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Non classé
                      <br />
                      Abattement
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Classé
                      <br />
                      Plafond micro
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Classé
                      <br />
                      Abattement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">
                      Revenus 2025
                      <br />
                      (déclarés en 2026)
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900">15 000 €</td>
                    <td className="p-3 text-center text-gray-600">30 %</td>
                    <td className="p-3 text-center font-semibold text-primary-400">77 700 €</td>
                    <td className="p-3 text-center text-gray-600">50 %</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 text-gray-700 font-medium">
                      Revenus 2026
                      <br />
                      (déclarés en 2027)
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-900">15 000 €</td>
                    <td className="p-3 text-center text-gray-600">30 %</td>
                    <td className="p-3 text-center font-semibold text-primary-400">83 600 €</td>
                    <td className="p-3 text-center text-gray-600">50 %</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-comfortable mb-4">
              L'écart est structurant. Avant la réforme, de nombreux propriétaires raisonnaient
              encore avec les anciens seuils (188 700 € et 71 % d'abattement pour les classés). Ce
              n'est plus le bon cadre de référence depuis la déclaration 2026. Et l'écart ne
              s'efface pas en 2027 : le plafond classé monte à 83 600 € par revalorisation, tandis
              que le seuil non classé reste bloqué à 15 000 €. Ces paramètres sont également
              confirmés par la{' '}
              <a
                href="https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence"
                target="_blank"
                rel="noopener noreferrer"
              >
                page économie.gouv.fr sur la location meublée de tourisme
              </a>
              .
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour comprendre ce que le classement apporte concrètement au-delà de la fiscalité,
              consultez notre page{' '}
              <Link to="/les-avantages-du-classement">
                pourquoi faire classer son meublé de tourisme
              </Link>
              .
            </p>

            {/* Section 4 */}
            <h2 className="mt-12 mb-4">
              Pourquoi cet écart fiscal change vraiment la donne pour un propriétaire
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, le classement peut permettre à un propriétaire :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>de rester plus facilement dans le régime micro-BIC ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>de bénéficier d'un abattement forfaitaire plus favorable ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>d'éviter de basculer trop vite dans un cadre déclaratif plus lourd.</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              À l'inverse, un meublé non classé se retrouve très vite confronté à un plafond bas. À
              partir du moment où les recettes dépassent <strong>15 000 €</strong>, le régime
              micro-BIC n'est plus accessible.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L'effet concret, pour un propriétaire, est donc moins théorique qu'il n'y paraît :
              selon le niveau de recettes, le classement peut faire la différence entre un régime
              simplifié encore accessible et une sortie rapide vers le régime réel. Pour en savoir
              plus sur la procédure,{' '}
              <Link to="/procedure">
                découvrez comment se déroule le classement d'un meublé de tourisme
              </Link>
              .
            </p>

            {/* Section 5 */}
            <h2 className="mt-12 mb-4">
              Le point que beaucoup confondent : micro-BIC, micro-entreprise et régime réel
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est probablement la partie la plus importante pédagogiquement.
            </p>

            <h3 className="mt-8 mb-3">1. Le micro-BIC fiscal</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le micro-BIC est un <strong>régime fiscal</strong> au sens de l'imposition sur le
              revenu. Il détermine :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>le plafond de recettes à ne pas dépasser ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>et l'abattement forfaitaire appliqué par l'administration.</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour les meublés de tourisme, ce régime dépend désormais très fortement du fait que le
              bien soit classé ou non. La base légale est l'
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048844097/2023-12-31"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 50-0 du Code général des impôts
              </a>
              .
            </p>

            <h3 className="mt-8 mb-3">2. La micro-entreprise</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              La micro-entreprise ajoute une dimension <strong>sociale</strong> au sujet. Il faut
              surtout ne pas mélanger :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>le seuil fiscal du micro-BIC ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  et les conditions du régime micro-entrepreneur (cotisations sociales, URSSAF).
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour les meublés non classés, la situation devient particulièrement contraignante.{' '}
              <a
                href="https://entreprendre.service-public.fr/vosdroits/F39451"
                target="_blank"
                rel="noopener noreferrer"
              >
                Service-Public Entreprendre
              </a>{' '}
              précise qu'à compter du <strong>1er janvier 2026</strong>, le loueur de meublé de
              tourisme non classé ne sera plus éligible au régime de la micro-entreprise, le nouveau
              plafond fiscal étant fixé à <strong>15 000 €</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Autrement dit : un loueur non classé ne peut pas continuer tranquillement comme avant
              dans un cadre micro "standard". Ce n'est plus la bonne lecture depuis la réforme 2024.
            </p>

            <h3 className="mt-8 mb-3">3. Le régime réel</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le régime réel s'applique lorsque les seuils du micro sont dépassés, ou lorsque le
              loueur y opte. Il ne constitue pas une bonne ou mauvaise solution universelle.
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>au-delà des seuils micro, le régime réel devient la règle ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  il implique une comptabilité et des obligations déclaratives plus lourdes ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  il peut nécessiter un accompagnement comptable selon la situation du propriétaire.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour comprendre les implications du régime BIC,{' '}
              <a
                href="https://www.economie.gouv.fr/entreprises/gerer-sa-fiscalite-et-ses-impots/limpot-sur-les-benefices-ir-et/impot-sur-le-revenu-bic-bnc-comment-ca-marche"
                target="_blank"
                rel="noopener noreferrer"
              >
                economie.gouv.fr explique les principes de l'impôt sur le revenu BIC/BNC
              </a>
              .
            </p>

            {/* Section 6 */}
            <h2 className="mt-12 mb-4">Les erreurs fréquentes à éviter sur le micro-BIC 2026</h2>

            <div className="space-y-6 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: "Reprendre les anciens seuils comme s'ils étaient encore valables",
                    desc: "On voit encore circuler des contenus qui mentionnent 188 700 € et 71 % d'abattement pour les meublés classés. Pour un article publié en mars 2026, ce n'est plus le bon cadre de référence pour les revenus 2025 déclarés en 2026 ni pour les revenus 2026 déclarés en 2027.",
                  },
                  {
                    num: '2',
                    title: 'Croire que classé et non classé restent dans des écarts modérés',
                    desc: 'Le différentiel est devenu structurant : 15 000 € / 30 % pour le non classé, contre 77 700 € / 50 % pour le classé sur les revenus 2025 déclarés en 2026, et 83 600 € / 50 % pour le classé sur les revenus 2026 déclarés en 2027.',
                  },
                  {
                    num: '3',
                    title: 'Confondre micro-BIC et micro-entreprise',
                    desc: "C'est la confusion la plus fréquente. Le micro-BIC est un régime fiscal (imposition sur le revenu) ; la micro-entreprise est un régime social (cotisations URSSAF). Les deux peuvent coexister, mais ils obéissent à des seuils et des logiques distincts.",
                  },
                  {
                    num: '4',
                    title: 'Penser que le classement règle tout',
                    desc: "Le classement garde un intérêt fiscal réel, mais il ne remplace ni les obligations locales, ni la réglementation communale, ni les sujets de changement d'usage, ni les autres contraintes du meublé de tourisme.",
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

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">
              Concrètement, que doit vérifier un propriétaire en 2026 ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              En pratique, il faut vérifier :
            </p>
            <div className="space-y-6 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Si le logement est déjà classé ou non',
                    desc: "Le classement conditionne directement le seuil et l'abattement applicables au régime micro-BIC.",
                  },
                  {
                    num: '2',
                    title: 'Quel est le niveau réel de recettes attendu',
                    desc: "La comparaison entre 15 000 € et 77 700 € / 83 600 € n'est pas abstraite : elle détermine concrètement si le régime micro reste accessible.",
                  },
                  {
                    num: '3',
                    title: 'Si le propriétaire reste en régime micro ou doit passer au régime réel',
                    desc: "Au-delà du plafond applicable, le régime réel s'impose. Il implique une comptabilité plus lourde.",
                  },
                  {
                    num: '4',
                    title:
                      "S'il ne confond pas sa situation fiscale avec le régime micro-entrepreneur",
                    desc: 'Le régime fiscal (micro-BIC) et le régime social (micro-entreprise) obéissent à des logiques et des seuils distincts. Les consulter ensemble est indispensable.',
                  },
                  {
                    num: '5',
                    title: "Les autres obligations qui s'ajoutent au cadre fiscal",
                    desc: "Enregistrement communal, déclaration en mairie, règlement de copropriété, et éventuellement autorisation de changement d'usage restent des sujets séparés, non couverts par le seul classement.",
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
              Si vous avez des questions sur votre situation, la <Link to="/faq">FAQ Etoilys</Link>{' '}
              répond aux questions les plus fréquentes des propriétaires.
            </p>

            {/* Section 8 */}
            <h2 className="mt-12 mb-4">Pourquoi le classement reste pertinent dans ce contexte</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Dans un environnement devenu plus strict, le classement garde un intérêt concret pour
              les propriétaires qui veulent structurer leur activité proprement.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement n'est pas un miracle fiscal, mais il conserve un avantage clair par
              rapport à un meublé non classé quand on parle du micro-BIC, et il s'inscrit dans une
              démarche plus lisible et plus professionnelle.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour mieux comprendre les étapes concrètes,{' '}
              <Link to="/procedure">consultez la page sur la procédure de classement</Link>.
            </p>

            {/* Conclusion */}
            <h2 className="mt-12 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En 2026, la bonne question n'est plus seulement «micro ou réel ?», mais aussi «classé
              ou non classé ?». C'est cette distinction qui structure désormais une grande partie de
              l'écart fiscal entre deux meublés de tourisme comparables.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour beaucoup de propriétaires, elle change très concrètement le seuil applicable,
              l'abattement et la possibilité de rester dans un cadre simplifié. Et la première vraie
              rupture s'applique déjà à la déclaration 2026 portant sur les revenus 2025.
            </p>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">
                Vous voulez savoir si le classement de votre meublé change réellement votre
                situation fiscale ?
              </h2>
              <p className="text-gray-700 mb-6">
                Consultez notre page sur la procédure de classement ou faites directement une
                demande de classement avec Etoilys.
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

            {/* Sources officielles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-h4 mb-6">Sources officielles</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  {
                    label: 'FAQ fiscale DGFiP mise à jour le 18 mars 2026',
                    url: 'https://www.impots.gouv.fr/particulier/questions/je-suis-proprietaire-dune-location-meublee-de-tourisme-quel-est-le-nouveau',
                  },
                  {
                    label:
                      'Service-Public Entreprendre / hébergement touristique et micro-entreprise',
                    url: 'https://entreprendre.service-public.fr/vosdroits/F39451',
                  },
                  {
                    label:
                      'economie.gouv.fr / location meublée de tourisme / ce qui change en 2026',
                    url: 'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence',
                  },
                  {
                    label: 'Service-Public Entreprendre / régime fiscal de la micro-entreprise',
                    url: 'https://entreprendre.service-public.fr/vosdroits/F23267',
                  },
                  {
                    label: 'economie.gouv.fr / micro-entrepreneurs / déclarer ses revenus',
                    url: 'https://www.economie.gouv.fr/entreprises/gerer-sa-micro-entreprise/micro-entrepreneurs-comment-declarer-vos-revenus',
                  },
                  {
                    label: 'economie.gouv.fr / impôt sur le revenu : BIC, BNC',
                    url: 'https://www.economie.gouv.fr/entreprises/gerer-sa-fiscalite-et-ses-impots/limpot-sur-les-benefices-ir-et/impot-sur-le-revenu-bic-bnc-comment-ca-marche',
                  },
                  {
                    label: 'Loi du 19 novembre 2024 / synthèse Vie publique',
                    url: 'https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur',
                  },
                  {
                    label: 'Légifrance / article 50-0 du CGI (base légale des seuils)',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048844097/2023-12-31',
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
