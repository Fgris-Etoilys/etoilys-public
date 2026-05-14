import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ArticleDpeMeublesTourisme() {
  return (
    <>
      {/* Hero */}
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-white/80 text-sm">
              <Link to="/actualites" className="hover:text-white transition-colors text-white/80">
                ← Actualités
              </Link>
              <span aria-hidden="true">•</span>
              <time dateTime="2026-05-14">Publié le 14 mai 2026</time>
              <span aria-hidden="true">•</span>
              <span>Florian Grisorio</span>
            </div>
            <h1 className="mb-0 text-white">
              DPE et meublés de tourisme : ce qui s'applique déjà, et ce qui viendra plus tard
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
              Beaucoup de propriétaires se demandent si leur meublé de tourisme est déjà concerné
              par le DPE. La réponse dépend de votre situation : en 2026, le sujet est déjà concret
              lorsqu'un logement est soumis à{' '}
              <strong>autorisation préalable de changement d'usage</strong>. La règle plus large de{' '}
              <strong>décence énergétique</strong> pour les meublés de tourisme qui ne sont pas la
              résidence principale du loueur, elle, n'entre en vigueur qu'au{' '}
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
                    En 2026, le DPE est déjà requis dans certains cas de{' '}
                    <strong>changement d'usage</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Cette exigence actuelle ne vise{' '}
                    <strong>pas tous les meublés de tourisme</strong> partout en France.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    À partir du <strong>1er janvier 2034</strong>, les meublés de tourisme qui{' '}
                    <strong>ne sont pas la résidence principale du loueur</strong> devront respecter
                    les niveaux de performance énergétique d'un logement décent.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le sujet dépend à la fois de la <strong>commune</strong>, du{' '}
                    <strong>type de logement</strong> et du fait que le bien soit ou non soumis à{' '}
                    <strong>changement d'usage</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le bon réflexe n'est pas de raisonner{' '}
                    <em>location saisonnière = même règle partout</em>, mais de vérifier votre
                    situation concrète.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">
              La réponse courte : le DPE est déjà un sujet pour certains meublés, mais pas pour tous
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Beaucoup de propriétaires entendent parler du DPE appliqué aux meublés de tourisme
              sans savoir ce qui est déjà en vigueur et ce qui relève encore d'un calendrier futur.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La bonne lecture est la suivante :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  en <strong>2026</strong>, le DPE est déjà un sujet concret pour certains
                  logements, notamment lorsqu'une{' '}
                  <strong>autorisation préalable de changement d'usage</strong> est nécessaire ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  en revanche, la règle plus large de <strong>décence énergétique</strong> visant
                  les meublés de tourisme qui ne constituent pas la résidence principale du loueur
                  n'entre en vigueur qu'au <strong>1er janvier 2034</strong>.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              L'erreur à éviter est donc double :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  croire que tous les meublés sont déjà soumis aujourd'hui à la même exigence
                  énergétique ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>ou croire qu'il ne se passe rien avant 2034.</span>
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="mt-12 mb-4">
              Ce qui s'applique déjà : le DPE pour certaines demandes de changement d'usage
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le texte clé ici se trouve dans le <strong>CCH</strong>, c'est-à-dire le{' '}
              <strong>code de la construction et de l'habitation</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L'article <strong>L.&nbsp;631-10</strong> prévoit que, pour obtenir l'autorisation
              préalable prévue à l'article <strong>L.&nbsp;631-7</strong> ou à l'article{' '}
              <strong>L.&nbsp;631-7-1&nbsp;A</strong> en vue d'une mise en location de meublé de
              tourisme, le propriétaire doit présenter un{' '}
              <strong>diagnostic de performance énergétique</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En métropole, le niveau exigé est :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <strong>entre A et E</strong> aujourd'hui ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  puis <strong>entre A et D à partir du 1er janvier 2034</strong>.
                </span>
              </li>
            </ul>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                Cette exigence ne s'applique pas à tous les meublés de tourisme par principe. Elle
                s'applique lorsque le logement est dans une situation où une{' '}
                <strong>autorisation préalable de changement d'usage</strong> est requise.
              </p>
            </div>

            {/* Section 3 */}
            <h2 className="mt-12 mb-4">Changement d'usage : de quoi parle-t-on concrètement ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est un point qu'il faut expliquer simplement.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le <strong>changement d'usage</strong> correspond au fait de prendre un logement qui a
              normalement vocation à l'habitation et de le louer,{' '}
              <strong>de manière répétée</strong>, pour de <strong>courtes durées</strong>, à une{' '}
              <strong>clientèle de passage qui n'y élit pas domicile</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Autrement dit, quand un logement d'habitation est exploité comme meublé de tourisme,
              le droit peut considérer qu'il ne reste plus dans son usage normal d'habitation. Le
              changement d'usage ne se produit pas seulement s'il y a des travaux : il peut exister{' '}
              <strong>même sans travaux</strong>, simplement du fait de l'usage réel du bien.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">Quelques exemples concrets :</p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un propriétaire qui transforme sa <strong>résidence secondaire</strong> en
                  location touristique régulière dans une commune qui applique cette procédure ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  un logement dédié à la location saisonnière dans une ville en tension où la
                  commune a mis en place une <strong>autorisation préalable</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  à l'inverse, une <strong>résidence principale</strong> louée occasionnellement
                  n'entre pas automatiquement dans la même situation.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Il faut aussi noter que le changement d'usage est une logique différente du{' '}
              <strong>changement de destination</strong> en urbanisme : ce n'est pas le même sujet,
              pas le même fondement juridique, et l'un ne remplace pas l'autre.
            </p>

            {/* Section 4 */}
            <h2 className="mt-12 mb-4">Dans quelles communes cela peut-il s'appliquer ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La procédure de changement d'usage peut s'appliquer dans les communes où elle a été
              mise en place selon les règles prévues par le CCH et les textes locaux. Elle ne dépend
              donc pas d'une règle uniforme identique partout en France.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La page officielle du ministère de la Transition écologique sur la location
              touristique meublée contient une FAQ sur l'application du changement d'usage pour les
              communes concernées.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Il n'existe pas nécessairement, pour le propriétaire, un{' '}
              <strong>outil national unique et parfaitement à jour</strong> qui répond d'un clic à
              la question pour toutes les communes. En pratique, les bons réflexes sont :
            </p>

            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Comment vérifier si votre commune est concernée ?
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <p>
                    Consultez la{' '}
                    <a
                      href="https://www.ecologie.gouv.fr/politiques-publiques/location-touristique-meublee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 underline hover:no-underline"
                    >
                      page officielle du ministère sur la location touristique meublée
                    </a>
                    .
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <p>Vérifiez les informations publiées par votre mairie.</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <p>
                    En cas de doute, contactez directement votre mairie via l&apos;
                    <a
                      href="https://lannuaire.service-public.fr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 underline hover:no-underline"
                    >
                      annuaire officiel de l&apos;administration
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Tableau */}
            <h2 className="mt-12 mb-4">Ce qui s'applique selon votre situation</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le bon réflexe n'est pas de demander si{' '}
              <em>le DPE s'applique aux meublés de tourisme</em> en général, mais de regarder dans
              quelle situation précise se trouve votre logement :
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[35%]" />
                  <col className="w-[35%]" />
                </colgroup>
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-left font-semibold">Situation</th>
                    <th className="p-3 text-left font-semibold">Ce qui s'applique déjà</th>
                    <th className="p-3 text-left font-semibold">Ce qui viendra plus tard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">
                      Résidence principale louée occasionnellement
                    </td>
                    <td className="p-3 text-gray-600">
                      Pas de bascule générale DPE du seul fait de la location touristique
                    </td>
                    <td className="p-3 text-gray-600">
                      La règle 2034 du code du tourisme ne vise pas la résidence principale du
                      loueur
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="p-3 text-gray-700 font-medium">
                      Logement soumis à autorisation de changement d'usage
                    </td>
                    <td className="p-3 text-gray-600">
                      DPE requis pour obtenir l'autorisation ; niveau A à E en métropole
                    </td>
                    <td className="p-3 text-gray-600">Niveau A à D à partir du 1er janvier 2034</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700 font-medium">
                      Meublé de tourisme hors résidence principale
                    </td>
                    <td className="p-3 text-gray-600">
                      Pas de règle générale de décence énergétique déjà applicable du seul fait du
                      code du tourisme en 2026
                    </td>
                    <td className="p-3 text-gray-600">
                      À partir du 1er janvier 2034, respect des niveaux de performance énergétique
                      d'un logement décent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 5 */}
            <h2 className="mt-12 mb-4">
              Ce qui ne s'applique pas encore en 2026 : la règle générale de décence énergétique
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le deuxième texte clé est l'article <strong>L.&nbsp;324-2-2</strong> du code du
              tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ce texte prévoit que les meublés de tourisme doivent respecter les niveaux de
              performance énergétique d'un logement décent,{' '}
              <strong>sauf lorsque le local constitue la résidence principale du loueur</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Mais cette règle n'entre en vigueur qu'au <strong>1er janvier 2034</strong>. En
              pratique, cela signifie qu'en 2026, cette obligation plus large vise les meublés de
              tourisme <strong>hors résidence principale</strong>, mais seulement à partir de 2034.
            </p>

            {/* Section 6 */}
            <h2 className="mt-12 mb-4">À partir de 2034 : contrôle du maire et sanctions</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              À partir de 2034, le maire pourra demander à tout moment au propriétaire d'un meublé
              de tourisme de transmettre, dans un délai de <strong>deux mois</strong>, un DPE en
              cours de validité.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">À l'expiration de ce délai :</p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  l'absence de transmission du DPE pourra entraîner une{' '}
                  <strong>astreinte administrative de 100&nbsp;€ par jour</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  le fait de louer ou de maintenir en location un meublé de tourisme qui ne respecte
                  pas les niveaux de performance énergétique d'un logement décent pourra entraîner
                  une <strong>amende administrative pouvant aller jusqu'à 5&nbsp;000&nbsp;€</strong>{' '}
                  par local concerné.
                </span>
              </li>
            </ul>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                Ces sanctions concernent la règle future du code du tourisme applicable à partir de{' '}
                <strong>2034</strong>, pas les obligations actuelles liées au changement d'usage.
              </p>
            </div>

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">En pratique, que vérifier dès maintenant ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Quelques points à clarifier selon votre situation :
            </p>
            <div className="space-y-4 mb-8 text-gray-700">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Résidence principale ou non</p>
                  <p className="leading-comfortable">
                    Votre logement est-il votre résidence principale ? Cela détermine d&apos;emblée
                    si la règle 2034 du code du tourisme vous concernera.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Procédure de changement d&apos;usage
                  </p>
                  <p className="leading-comfortable">
                    Votre commune applique-t-elle une procédure de changement d&apos;usage ? Si oui,
                    un DPE (niveau A à E en métropole) est déjà requis pour obtenir
                    l&apos;autorisation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Autorisation préalable</p>
                  <p className="leading-comfortable">
                    Votre projet de location touristique nécessite-t-il une autorisation préalable ?
                    Si c&apos;est le cas, le DPE fait partie du dossier dès aujourd&apos;hui.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">DPE valide</p>
                  <p className="leading-comfortable">
                    Disposez-vous déjà d&apos;un DPE en cours de validité ? Si vous projetez une
                    exploitation touristique durable, un DPE récent peut faciliter les démarches et
                    anticiper les futures exigences.
                  </p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <h2 className="mt-12 mb-4">En résumé</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En 2026, le DPE est déjà un sujet concret dans certains cas — notamment lorsqu'une
              autorisation de changement d'usage est requise. La règle plus large pour les meublés
              hors résidence principale n'arrive qu'en 2034.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le point décisif est donc de vérifier la <strong>situation du bien</strong> et la{' '}
              <strong>règle locale</strong>, pas de raisonner avec une formule générale trop
              simplifiée.
            </p>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">Un doute sur les démarches à vérifier ?</h2>
              <p className="text-gray-700 mb-6">
                Consultez notre{' '}
                <Link to="/faq" className="text-primary-400 underline hover:no-underline">
                  FAQ
                </Link>{' '}
                pour les questions fréquentes sur les meublés de tourisme, ou{' '}
                <Link to="/contact" className="text-primary-400 underline hover:no-underline">
                  contactez Etoilys
                </Link>{' '}
                pour faire le point sur votre situation.
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
              <h2 className="text-h4 mb-6">Sources officielles</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  {
                    label:
                      'Légifrance — Article L.\u00a0631-10 du code de la construction et de l\u2019habitation',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623427',
                  },
                  {
                    label: 'Légifrance — Article L.\u00a0324-2-2 du code du tourisme',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050614567/',
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
                    label: 'Annuaire officiel de l\u2019administration — Mairie (Service Public)',
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
