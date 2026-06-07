import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ArticleHeaderMeta from '../../components/ui/ArticleHeaderMeta';

export default function ArticleDpeMeublesTourisme() {
  return (
    <>
      {/* Hero */}
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <ArticleHeaderMeta
              publishedAt="2026-05-14"
              publishedDate="14 mai 2026"
              updatedAt="2026-06-07"
              updatedDate="7 juin 2026"
              author="Florian Grisorio"
              readingTime="6 min de lecture"
            />
            <h1 className="mb-0 text-white">
              DPE des meublés de tourisme : ce qui s&apos;applique en 2026 et ce qui attend 2034
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
              Faut-il déjà un DPE pour louer un meublé de tourisme ? En 2026, la réponse dépend
              surtout de votre situation : le DPE est déjà exigé dans certains cas de{' '}
              <strong>changement d&apos;usage</strong>, mais il n&apos;existe pas encore
              d&apos;obligation énergétique générale applicable à tous les meublés de tourisme. La
              règle plus large de <strong>décence énergétique</strong> pour les meublés qui ne sont
              pas la résidence principale du loueur entrera en vigueur le{' '}
              <strong>1er janvier 2034</strong>.
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
                    En 2026, un DPE est déjà requis pour certaines demandes d&apos;
                    <strong>autorisation préalable de changement d&apos;usage</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Cette règle ne concerne <strong>pas tous les meublés de tourisme</strong> : elle
                    dépend notamment de la commune et de la situation du logement.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    À partir du <strong>1er janvier 2034</strong>, les meublés de tourisme qui ne
                    constituent pas la <strong>résidence principale du loueur</strong> devront
                    respecter les niveaux de performance énergétique d&apos;un logement décent.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le changement d&apos;usage peut exister <strong>même sans travaux</strong> :
                    c&apos;est l&apos;utilisation réelle du logement qui compte.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Avant de louer, la bonne vérification consiste à regarder la situation du bien,
                    les règles locales et l&apos;existence éventuelle d&apos;une autorisation
                    préalable.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">Faut-il déjà un DPE pour louer un meublé de tourisme ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le point important est simple : il n&apos;existe pas, en 2026, une obligation générale
              de DPE qui s&apos;appliquerait automatiquement à tous les meublés de tourisme, partout
              en France.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En revanche, le DPE est déjà un vrai sujet dans certains cas. C&apos;est notamment le
              cas lorsqu&apos;un logement est soumis à une{' '}
              <strong>autorisation préalable de changement d&apos;usage</strong> en vue d&apos;une
              mise en location de meublé de tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La confusion vient souvent du fait que deux règles différentes sont mélangées :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  la règle déjà applicable pour certaines demandes de changement d&apos;usage ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  la règle de <strong>décence énergétique</strong> prévue à partir du{' '}
                  <strong>1er janvier 2034</strong> pour les meublés de tourisme qui ne constituent
                  pas la résidence principale du loueur.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, il faut donc éviter deux erreurs :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  croire que tous les meublés de tourisme doivent déjà respecter le même seuil DPE ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>croire que le sujet ne commencera qu&apos;en 2034.</span>
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="mt-12 mb-4">
              Ce qui s&apos;applique déjà : le DPE dans certains cas de changement d&apos;usage
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le texte central se trouve dans le <strong>CCH</strong>, c&apos;est-à-dire le{' '}
              <strong>code de la construction et de l&apos;habitation</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L&apos;article <strong>L.&nbsp;631-10</strong> prévoit que, pour obtenir
              l&apos;autorisation préalable prévue à l&apos;article <strong>L.&nbsp;631-7</strong>{' '}
              ou à l&apos;article <strong>L.&nbsp;631-7-1&nbsp;A</strong> en vue d&apos;une mise en
              location de meublé de tourisme, les propriétaires des locaux concernés doivent
              présenter un <strong>diagnostic de performance énergétique</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En France métropolitaine, le niveau exigé est :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  entre <strong>A et E</strong> aujourd&apos;hui ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  puis entre <strong>A et D</strong> à partir du <strong>1er janvier 2034</strong>.
                </span>
              </li>
            </ul>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                Cette exigence ne s&apos;applique donc pas à tous les meublés de tourisme par
                principe. Elle s&apos;applique lorsque le logement entre dans une situation où une{' '}
                <strong>autorisation préalable de changement d&apos;usage</strong> est requise.
              </p>
            </div>

            {/* Section 3 */}
            <h2 className="mt-12 mb-4">
              Changement d&apos;usage : de quoi parle-t-on concrètement ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le changement d&apos;usage correspond au fait de prendre un logement normalement
              destiné à l&apos;habitation et de l&apos;utiliser, de manière répétée, pour des
              locations de courte durée à une clientèle de passage qui n&apos;y élit pas domicile.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Dit plus simplement : un logement d&apos;habitation peut être considéré comme ayant
              changé d&apos;usage lorsqu&apos;il est exploité comme meublé de tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ce changement d&apos;usage ne suppose pas forcément des travaux. Il peut exister même
              si le logement n&apos;a pas été modifié physiquement. C&apos;est l&apos;usage réel du
              bien qui compte.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Concrètement, cela peut concerner :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  une résidence secondaire transformée en location touristique régulière dans une
                  commune qui applique cette procédure ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un logement dédié à la location saisonnière dans une ville où l&apos;autorisation
                  préalable est exigée ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un appartement situé dans une zone où la commune encadre fortement la
                  transformation de logements d&apos;habitation en meublés touristiques.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              À l&apos;inverse, la location ponctuelle de sa résidence principale n&apos;entraîne
              pas automatiquement le même raisonnement. Il faut toujours regarder la situation
              précise du bien et la règle locale applicable.
            </p>

            {/* Section 4 - tableau */}
            <h2 className="mt-12 mb-4">
              Résidence principale, résidence secondaire, changement d&apos;usage : le tableau pour
              s&apos;y retrouver
            </h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le bon réflexe n&apos;est pas de demander si{' '}
              <em>le DPE s&apos;applique aux meublés de tourisme</em> en général, mais de regarder
              dans quelle situation précise se trouve votre logement.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[35%]" />
                  <col className="w-[35%]" />
                </colgroup>
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-left font-semibold">Situation</th>
                    <th className="p-3 text-left font-semibold">En 2026</th>
                    <th className="p-3 text-left font-semibold">À partir du 1er janvier 2034</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">
                      Résidence principale louée occasionnellement
                    </td>
                    <td className="p-3 text-gray-600">
                      Pas d&apos;obligation générale de DPE liée au seul fait de louer en meublé de
                      tourisme. Il faut vérifier les règles locales applicables.
                    </td>
                    <td className="p-3 text-gray-600">
                      La règle de décence énergétique des meublés hors résidence principale ne vise
                      pas ce cas.
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">
                      Logement soumis à autorisation préalable de changement d&apos;usage
                    </td>
                    <td className="p-3 text-gray-600">
                      DPE à présenter pour obtenir l&apos;autorisation. En métropole, le niveau
                      exigé est compris entre A et E.
                    </td>
                    <td className="p-3 text-gray-600">
                      Le niveau exigé pour cette autorisation passera de A à D.
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700 font-medium">
                      Meublé de tourisme qui n&apos;est pas la résidence principale du loueur
                    </td>
                    <td className="p-3 text-gray-600">
                      Pas encore soumis à la règle générale de décence énergétique du code du
                      tourisme. Attention toutefois aux règles locales et au changement
                      d&apos;usage.
                    </td>
                    <td className="p-3 text-gray-600">
                      Le logement devra respecter les niveaux de performance énergétique d&apos;un
                      logement décent.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 5 */}
            <h2 className="mt-12 mb-4">
              Ce qui changera en 2034 pour les meublés hors résidence principale
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La règle plus large se trouve dans l&apos;article{' '}
              <strong>L.&nbsp;324-2-2 du code du tourisme</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              À partir du <strong>1er janvier 2034</strong>, les meublés de tourisme devront
              respecter les niveaux de performance énergétique d&apos;un logement décent, sauf
              lorsque le local loué constitue la résidence principale du loueur.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, cela vise surtout les meublés de tourisme qui ne sont pas la résidence
              principale du loueur : résidences secondaires, logements dédiés à la location
              touristique ou biens exploités principalement en courte durée.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              À cette échéance, le maire pourra demander au propriétaire de transmettre un DPE en
              cours de validité. L&apos;absence de transmission ou le maintien en location d&apos;un
              meublé ne respectant pas les niveaux requis pourra entraîner des sanctions
              administratives.
            </p>

            {/* Section 6 */}
            <h2 className="mt-12 mb-4">Comment savoir si votre commune est concernée ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Il n&apos;existe pas, à ce stade, de carte nationale unique permettant de savoir
              instantanément si chaque commune applique une procédure de changement d&apos;usage.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Depuis la mise en place du nouveau cadre d&apos;enregistrement, un DPE peut aussi être
              demandé dans la procédure administrative lorsque le logement est concerné par une
              autorisation de changement d&apos;usage. Cette demande ne signifie pas que tous les
              meublés de tourisme doivent fournir un DPE en 2026 : elle vise les cas où le bien
              entre déjà dans le champ du changement d&apos;usage.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Si la commune demande un DPE dans le cadre de l&apos;enregistrement, vérifiez
              d&apos;abord si cette demande est liée à une autorisation de changement d&apos;usage.
              C&apos;est souvent cette condition qui déclenche l&apos;exigence énergétique dès 2026.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La vérification doit donc se faire à partir de sources fiables :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>le site officiel de la mairie ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>les pages urbanisme, logement ou meublés de tourisme de la commune ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  l&apos;
                  <a
                    href="https://lannuaire.service-public.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 underline hover:no-underline"
                  >
                    annuaire officiel de l&apos;administration
                  </a>{' '}
                  pour identifier la mairie compétente ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  les informations disponibles sur Service-Public et les pages ministérielles.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, avant de louer un logement en meublé de tourisme, il faut vérifier :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>si le logement est votre résidence principale ou non ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  si la commune impose une déclaration ou un numéro d&apos;enregistrement ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>si une autorisation préalable de changement d&apos;usage est exigée ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>si un DPE doit être présenté pour cette autorisation ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  si le règlement de copropriété contient des restrictions, lorsque le logement est
                  en copropriété.
                </span>
              </li>
            </ul>

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">Que vérifier avant de louer ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le sujet DPE n&apos;est pas une règle unique applicable partout, mais une vérification
              à faire selon la situation du logement et la commune.
            </p>
            <div className="space-y-4 mb-8 text-gray-700">
              {[
                'Identifier le statut réel du logement : résidence principale, résidence secondaire ou logement dédié à la location touristique.',
                'Vérifier les règles de la commune : déclaration, enregistrement, changement d’usage.',
                'Regarder si un DPE est déjà nécessaire dans votre situation.',
                'Anticiper l’échéance de 2034 si le logement n’est pas votre résidence principale.',
                'Vérifier le règlement de copropriété si le bien est en immeuble collectif.',
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
                Avant de louer, le plus important est donc de qualifier correctement votre situation
                : résidence principale, résidence secondaire, logement soumis ou non à changement
                d&apos;usage. Une fois ce point clarifié, vous saurez si le DPE est déjà nécessaire
                aujourd&apos;hui ou s&apos;il relève surtout de l&apos;échéance 2034.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">Un doute sur votre situation ?</h2>
              <p className="text-gray-700 mb-6">
                Consultez notre{' '}
                <Link to="/faq" className="text-primary-400 underline hover:no-underline">
                  FAQ
                </Link>{' '}
                pour les questions fréquentes sur les meublés de tourisme, ou{' '}
                <Link to="/contact" className="text-primary-400 underline hover:no-underline">
                  contactez Etoilys
                </Link>{' '}
                pour faire le point sur votre dossier.
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
                      'Légifrance \u2014 Code de la construction et de l\u2019habitation, article L.\u00a0631-10 : DPE requis pour certaines autorisations de changement d\u2019usage en meublé de tourisme',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623427/2026-03-16',
                  },
                  {
                    label:
                      'Légifrance \u2014 Code du tourisme, article L.\u00a0324-2-2 : exigence de décence énergétique applicable à partir du 1er janvier 2034 aux meublés de tourisme qui ne constituent pas la résidence principale du loueur',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050614567/2034-01-01',
                  },
                  {
                    label: 'Légifrance — Loi du 19 novembre 2024',
                    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050612711',
                  },
                  {
                    label:
                      'Ministère de la Transition écologique — Guide pratique 2025 de la réglementation des meublés de tourisme',
                    url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf',
                  },
                  {
                    label:
                      'Ministère de la Transition écologique — La location touristique meublée',
                    url: 'https://www.ecologie.gouv.fr/politiques-publiques/location-touristique-meublee',
                  },
                  {
                    label: 'Direction générale des Entreprises — Les meublés de tourisme',
                    url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme',
                  },
                  {
                    label:
                      'Service-Public — Mettre en location sa résidence secondaire (en faire un meublé de tourisme)',
                    url: 'https://www.service-public.fr/particuliers/vosdroits/F2043',
                  },
                  {
                    label: 'Annuaire officiel de l’administration — Mairie (Service Public)',
                    url: 'https://lannuaire.service-public.fr/',
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
          </div>
        </div>
      </section>
    </>
  );
}
