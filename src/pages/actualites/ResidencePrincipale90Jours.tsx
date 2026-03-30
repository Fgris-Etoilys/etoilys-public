import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ArticleResidencePrincipale90Jours() {
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
              <time dateTime="2026-03-27">Publié le 27 mars 2026</time>
              <span aria-hidden="true">•</span>
              <span>Florian Grisorio</span>
            </div>
            <h1 className="mb-0 text-white">
              Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?
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
              Non, la limite des <strong>90 jours</strong> ne s'applique pas automatiquement à
              toutes les résidences principales partout en France. La règle de base reste{' '}
              <strong>120 jours par an</strong>, mais une commune peut décider d'abaisser ce
              plafond, dans certaines conditions, jusqu'à <strong>90 jours</strong>. L'enjeu pour
              vous est simple : ne pas confondre la règle nationale, les décisions locales, et les
              autres limites qui existent en location saisonnière. Cette règle concerne par ailleurs
              tous les meublés de tourisme, pas seulement ceux loués via Airbnb — Abritel, Booking
              ou la location en direct sont également visés.
            </p>

            {/* À retenir */}
            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>

              {/* Tableau comparatif des règles */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-300 text-white">
                      <th className="p-3 text-left font-semibold">Règle</th>
                      <th className="p-3 text-left font-semibold">Portée</th>
                      <th className="p-3 text-left font-semibold">Ce que cela signifie</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b border-primary-200">
                      <td className="p-3 font-semibold text-primary-400">120 jours / an</td>
                      <td className="p-3 text-gray-700">Règle nationale</td>
                      <td className="p-3 text-gray-700">
                        Plafond de base pour toute résidence principale louée en meublé de tourisme
                      </td>
                    </tr>
                    <tr className="bg-primary-100 border-b border-primary-200">
                      <td className="p-3 font-semibold text-gray-900">90 à 119 jours / an</td>
                      <td className="p-3 text-gray-700">Règle locale (si délibération)</td>
                      <td className="p-3 text-gray-700">
                        La commune peut abaisser le plafond annuel par délibération motivée
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-gray-900">90 jours consécutifs</td>
                      <td className="p-3 text-gray-700">Autre règle (différente)</td>
                      <td className="p-3 text-gray-700">
                        Durée maximale d'une même location à un même client — ne se confond pas avec
                        le plafond annuel
                      </td>
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
                    Cette limite concerne les <strong>résidences principales</strong>, pas les
                    résidences secondaires (qui obéissent à un cadre différent et souvent plus
                    contraignant).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le <strong>classement</strong> du meublé ne permet pas de dépasser ce plafond :
                    un meublé classé reste soumis aux mêmes limites de durée.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">
              La réponse courte : non, tout le monde n'est pas limité à 90 jours
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est probablement la confusion la plus fréquente depuis la réforme de 2024.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Beaucoup de propriétaires ont retenu une formule simplifiée du type : "Airbnb, c'est
              désormais 90 jours maximum en résidence principale." En réalité, cette formule est
              incomplète.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La règle nationale de base reste la suivante : lorsqu'un logement constitue la{' '}
              <strong>résidence principale</strong> du loueur, il peut être loué comme meublé de
              tourisme dans la limite de <strong>120 jours par année civile</strong>, sauf
              obligation professionnelle, raison de santé ou cas de force majeure. C'est ce que
              prévoit l'
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623378/2026-05-20"
                target="_blank"
                rel="noopener noreferrer"
              >
                article L. 324-1-1 du code du tourisme
              </a>
              .
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La nouveauté depuis la{' '}
              <a
                href="https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur"
                target="_blank"
                rel="noopener noreferrer"
              >
                loi du 19 novembre 2024
              </a>
              , c'est que la <strong>commune</strong> peut désormais décider, par une{' '}
              <strong>délibération motivée</strong>, d'abaisser cette limite. Le plafond local peut
              alors être fixé dans une fourchette allant de <strong>90 à 119 jours</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le bon message est donc simple :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <strong>120 jours</strong> reste la règle générale ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <strong>90 jours</strong> n'est pas automatique ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  il faut <strong>vérifier la règle locale</strong> de la commune où se situe le
                  bien.
                </span>
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="mt-12 mb-4">Qui est concerné par cette limite ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette limite concerne les logements qui sont{' '}
              <strong>vraiment la résidence principale</strong> du loueur. La résidence principale
              est définie comme le logement occupé <strong>au moins huit mois par an</strong>, sauf
              obligation professionnelle, raison de santé ou cas de force majeure.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Concrètement, cela vise surtout le propriétaire — ou parfois le locataire avec accord
              écrit du bailleur — qui loue ponctuellement son logement pendant des vacances,
              quelques week-ends ou certaines périodes de l'année via Airbnb, Abritel, Booking ou un
              autre canal.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En revanche, il faut bien distinguer ce cas de la{' '}
              <strong>résidence secondaire</strong>. Une résidence secondaire n'entre pas dans ce
              régime "résidence principale louée ponctuellement". Elle peut être soumise à des
              règles beaucoup plus contraignantes, notamment en matière de{' '}
              <strong>déclaration</strong>, de <strong>numéro d'enregistrement</strong> ou de{' '}
              <strong>changement d'usage</strong> selon la commune.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Autrement dit, la question "suis-je concerné par la limite des 90 jours ?" doit
              d'abord être reformulée ainsi :
            </p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Mon logement est-il réellement ma résidence principale, et ma commune a-t-elle abaissé
              le plafond ?
            </blockquote>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour en savoir plus sur ce que le classement peut apporter à votre situation,
              consultez notre page{' '}
              <Link to="/les-avantages-du-classement">
                pourquoi faire classer son meublé de tourisme
              </Link>
              .
            </p>

            {/* Section 3 */}
            <h2 className="mt-12 mb-4">Ce que la commune peut faire depuis la réforme</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La{' '}
              <a
                href="https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur"
                target="_blank"
                rel="noopener noreferrer"
              >
                loi du 19 novembre 2024
              </a>{' '}
              a renforcé les outils de régulation locale des meublés de tourisme. Parmi ces outils
              figure la possibilité, pour la commune, d'abaisser la durée maximale de location d'une
              résidence principale comme meublé de tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ce point mérite une explication claire :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  la commune ne remplace pas la règle nationale par une règle uniforme de 90 jours
                  partout ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  elle peut <strong>choisir</strong> de fixer un plafond inférieur à 120 jours ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  cette décision doit être prise par <strong>délibération motivée</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  le plafond local ne peut pas descendre en dessous de <strong>90 jours</strong>.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, il ne faut pas partir du principe que la règle locale existe forcément,
              ni qu'elle est identique d'une commune à l'autre. Le bon réflexe est de vérifier :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>si la commune a adopté une délibération en ce sens ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>à partir de quelle date elle s'applique ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  et quelles autres démarches locales s'ajoutent, notamment en matière
                  d'enregistrement.
                </span>
              </li>
            </ul>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              Cette règle dépend de la commune concernée. Le plafond de 90 jours n'est donc pas une
              règle automatique applicable partout : il faut vérifier la délibération locale et la
              réglementation en vigueur dans la commune du logement.
            </blockquote>

            {/* Section 4 */}
            <h2 className="mt-12 mb-4">
              Le piège des "90 jours" : il y a en réalité plusieurs règles différentes
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est la partie la plus importante. Quand vous lisez "90 jours", cela peut désigner au
              moins <strong>trois choses différentes</strong>.
            </p>

            <div className="space-y-6 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Les 120 jours par an pour la résidence principale',
                    desc: "C'est la règle nationale de base pour un logement déclaré comme résidence principale. Elle s'applique par défaut, sauf délibération locale contraire.",
                  },
                  {
                    num: '2',
                    title: 'Les 90 à 119 jours si la commune a abaissé le plafond',
                    desc: "C'est une règle locale, prise par délibération motivée, qui peut réduire le nombre de jours autorisés dans la commune. Elle ne s'applique que si la commune a effectivement pris cette délibération.",
                  },
                  {
                    num: '3',
                    title: 'Les 90 jours consécutifs maximum à un même client',
                    desc: "C'est encore autre chose. La location saisonnière elle-même ne doit pas excéder 90 jours consécutifs à un même client. Cette règle ne se confond pas avec le plafond annuel applicable à la résidence principale.",
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
              Cette confusion conduit à des erreurs fréquentes :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  croire qu'une location de 20 nuits par an est interdite parce qu'on a vu "90
                  jours" quelque part ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  croire à l'inverse qu'on peut louer 150 jours au total tant qu'aucun séjour ne
                  dépasse 90 jours ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  ou croire qu'une commune passée à 90 jours fait automatiquement perdre au logement
                  son statut de résidence principale dès le 91e jour.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ce ne sont pas les bonnes lectures. Chaque règle a sa logique propre et son champ
              d'application.
            </p>

            {/* Section 5 */}
            <h2 className="mt-12 mb-4">
              Dépasser le plafond dans une commune qui l'a abaissé : qu'est-ce que cela change ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Lorsqu'une commune a abaissé le plafond, un logement loué au-delà du nombre de jours
              autorisé peut exposer le loueur à une <strong>sanction</strong>. Le code du tourisme
              prévoit une <strong>amende civile pouvant aller jusqu'à 15 000 €</strong> en cas de
              non-respect de cette obligation.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En revanche, dépasser 90 ou 100 jours dans une commune ayant abaissé le plafond ne
              transforme pas automatiquement le logement en résidence secondaire. La définition de
              la résidence principale repose sur le fait d'occuper le logement{' '}
              <strong>au moins huit mois par an</strong> — c'est ce critère qui détermine la
              qualification du logement, pas le seul dépassement du plafond de location.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, il faut raisonner en deux temps :
            </p>
            <div className="space-y-4 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Vérifier le plafond local autorisé',
                    desc: 'Y a-t-il une délibération dans ma commune ? Quel est le nombre de jours maximum fixé localement ?',
                  },
                  {
                    num: '2',
                    title:
                      "Ne pas oublier qu'au-delà d'un certain volume, d'autres questions se posent",
                    desc: "Sur la qualification réelle du logement et les règles locales applicables, notamment en matière de changement d'usage.",
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

            {/* Section 6 */}
            <h2 className="mt-12 mb-4">Le classement change-t-il quelque chose à cette limite ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">Non.</p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Un meublé de tourisme <strong>classé</strong> peut tout à fait être une résidence
              principale. Mais s'il est loué ponctuellement comme meublé de tourisme, il reste
              soumis au même plafond de durée : <strong>120 jours</strong> dans le cadre général, ou
              le plafond localement abaissé si la commune a pris une délibération en ce sens.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement ne sert donc pas à contourner les règles locales de durée.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En revanche, le classement garde un intérêt réel sur d'autres points :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>fiscalité micro-BIC (abattement et plafond plus favorables) ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>taxe de séjour ;</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>lisibilité et positionnement de l'offre.</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement reste utile, mais il ne remplace jamais le respect des règles locales
              sur la durée de location. Pour comprendre tous les avantages du classement,{' '}
              <Link to="/les-avantages-du-classement">consultez notre page dédiée</Link>.
            </p>

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">Ce qu'un propriétaire doit vérifier avant de louer</h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Avant de louer votre résidence principale en meublé de tourisme, voici ce qu'il faut
              vérifier au minimum :
            </p>

            <div className="space-y-4 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Votre logement est-il bien votre résidence principale ?',
                    desc: "Au sens juridique : logement occupé au moins huit mois par an. Si ce n'est pas le cas, vous relevez d'un autre régime.",
                  },
                  {
                    num: '2',
                    title: 'Le règlement de copropriété autorise-t-il ce type de location ?',
                    desc: 'Certains règlements de copropriété contiennent des clauses qui peuvent restreindre ou interdire la location meublée de courte durée.',
                  },
                  {
                    num: '3',
                    title:
                      "La mairie applique-t-elle une procédure d'enregistrement ou des règles locales particulières ?",
                    desc: "De nombreuses communes exigent une déclaration préalable ou un numéro d'enregistrement, indépendamment du plafond de jours.",
                  },
                  {
                    num: '4',
                    title:
                      'La commune a-t-elle abaissé le plafond annuel en dessous de 120 jours ?',
                    desc: 'Vérifiez si votre commune a adopté une délibération motivée abaissant le plafond entre 90 et 119 jours.',
                  },
                  {
                    num: '5',
                    title: 'Ne pas confondre plafond annuel et règle des 90 jours consécutifs',
                    desc: "La limite de 90 jours consécutifs à un même client est une règle distincte qui s'applique indépendamment du plafond annuel.",
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
              Des réponses aux questions les plus fréquentes sur le classement et les obligations
              associées sont disponibles dans notre <Link to="/faq">FAQ</Link>.
            </p>

            {/* Conclusion */}
            <h2 className="mt-12 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La limite des <strong>90 jours</strong> n'est pas une règle automatique qui s'applique
              partout à toutes les résidences principales. En pratique, il faut distinguer la règle
              générale des <strong>120 jours</strong>, la possibilité pour la{' '}
              <strong>commune</strong> d'abaisser ce plafond, et les autres règles qui gravitent
              autour de la location saisonnière.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En matière de résidence principale, la vraie question n'est pas "Airbnb est-il limité
              à 90 jours partout ?", mais plutôt :
            </p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic font-medium">
              Ma commune a-t-elle décidé d'abaisser le plafond, et est-ce que je respecte bien
              l'ensemble des règles applicables à mon logement ?
            </blockquote>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">
                Vous voulez savoir si votre logement peut être loué en meublé de tourisme et si le
                classement reste pertinent dans votre situation ?
              </h2>
              <p className="text-gray-700 mb-6">
                Consultez notre page sur la procédure de classement, notre FAQ, ou faites
                directement une demande de classement avec Etoilys.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/procedure" variant="primary">
                  Découvrir la procédure
                </Button>
                <Button href="/faq" variant="secondary">
                  Consulter la FAQ
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
                    label: 'Légifrance — article L. 324-1-1 du code du tourisme',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050623378/2026-05-20',
                  },
                  {
                    label:
                      'Service-Public — Mettre en location sa résidence principale (en faire un meublé de tourisme)',
                    url: 'https://www.service-public.fr/particuliers/vosdroits/F33175',
                  },
                  {
                    label:
                      "Vie-publique.fr — Loi du 19 novembre 2024 visant à renforcer les outils de régulation des meublés de tourisme à l'échelle locale",
                    url: 'https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur',
                  },
                  {
                    label:
                      'Ministère de la Transition écologique — Guide pratique 2025 de la réglementation des meublés de tourisme',
                    url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf',
                  },
                  {
                    label:
                      "Ministère de la Transition écologique — FAQ sur l'application dans le temps de la preuve de l'usage à la suite de la loi du 19 novembre 2024",
                    url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/FAQ%20sur%20l%27application%20dans%20le%20temps%20de%20la%20preuve%20de%20l%27usage%20%C3%A0%20la%20suite%20de%20la%20loi%20n%C2%B0%202024-1039%20du%2019%20novembre%202024_0.pdf',
                  },
                  {
                    label:
                      'economie.gouv.fr — Location meublée de tourisme : quelles sont les règles à respecter pour sa résidence principale ?',
                    url: 'https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence',
                  },
                  {
                    label: 'entreprises.gouv.fr — Les meublés de tourisme',
                    url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme',
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
