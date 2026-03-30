import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ArticleCoproprieteLocationTouristique() {
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
              <time dateTime="2026-03-23">Publié le 23 mars 2026</time>
              <span aria-hidden="true">•</span>
              <span>Florian Grisorio</span>
            </div>
            <h1 className="mb-0 text-white">
              Copropriété et location touristique : ce que le règlement peut désormais prévoir
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
              Depuis le <strong>21 novembre 2024</strong>, le cadre a évolué pour les meublés de
              tourisme en copropriété. Concrètement, un règlement de copropriété{' '}
              <strong>établi depuis cette date</strong> doit dire explicitement si la location de
              meublés de tourisme est autorisée ou interdite. Pour les règlements plus anciens, une
              interdiction peut parfois être ajoutée à la majorité de l'article 26, mais{' '}
              <strong>pas dans n'importe quelle copropriété, ni pour n'importe quel lot</strong>. Si
              vous louez un bien en copropriété, il faut donc vérifier à la fois le règlement
              existant, les possibilités de modification, et vos obligations vis-à-vis du syndic.
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
                    Depuis le <strong>21 novembre 2024</strong>, les{' '}
                    <strong>nouveaux règlements de copropriété</strong> doivent mentionner
                    explicitement l'autorisation ou l'interdiction des meublés de tourisme.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Dans certaines copropriétés, un <strong>règlement existant</strong> peut être
                    modifié à la{' '}
                    <strong>
                      majorité des membres du syndicat représentant au moins les deux tiers des voix
                    </strong>{' '}
                    pour interdire certains meublés de tourisme.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Cette possibilité ne vise pas tous les cas : elle concerne les{' '}
                    <strong>
                      lots à usage d'habitation autres que ceux constituant une résidence principale
                    </strong>
                    , et suppose que le règlement interdise déjà toute activité commerciale dans les
                    lots non commerciaux.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Lorsqu'un lot fait l'objet de la <strong>déclaration</strong> prévue par le code
                    du tourisme, le copropriétaire — ou son locataire autorisé — doit{' '}
                    <strong>informer le syndic</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Le <strong>classement</strong> du meublé ne permet pas d'écarter le règlement de
                    copropriété.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <h2 className="mt-12 mb-4">
              La réponse courte : oui, le cadre a changé, mais pas dans le sens d'une interdiction
              automatique partout
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Beaucoup de propriétaires ont retenu une version trop simplifiée de la réforme : "la
              copropriété peut maintenant interdire Airbnb plus facilement".
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, c'est plus nuancé.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Oui, la{' '}
              <a
                href="https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur"
                target="_blank"
                rel="noopener noreferrer"
              >
                loi du 19 novembre 2024
              </a>{' '}
              a renforcé les outils des copropriétés face aux meublés de tourisme. Mais elle n'a pas
              créé une règle uniforme qui permettrait à n'importe quelle copropriété d'interdire
              toutes les locations touristiques à la majorité des deux tiers.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le bon réflexe est de distinguer :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  ce que doit prévoir un{' '}
                  <strong>règlement établi depuis le 21 novembre 2024</strong> ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  ce qu'une <strong>copropriété existante</strong> peut modifier ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  et ce que vous devez <strong>déclarer au syndic</strong> si vous louez déjà.
                </span>
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="mt-12 mb-4">Ce qui change depuis le 21 novembre 2024</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La première nouveauté est simple : les règlements de copropriété{' '}
              <strong>établis à compter du 21 novembre 2024</strong> doivent mentionner de manière
              explicite l'<strong>autorisation</strong> ou l'<strong>interdiction</strong> de
              location de meublés de tourisme (
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050617303"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 8-1-1 de la loi du 10 juillet 1965
              </a>
              ).
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Autrement dit, dans une copropriété neuve ou dans un règlement établi depuis cette
              date, le sujet ne doit plus rester flou. Le règlement doit prendre position noir sur
              blanc.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour un propriétaire, cela change surtout une chose : au moment d'acheter, d'investir
              ou de mettre un bien en location touristique, il devient encore plus important de lire
              le règlement de copropriété en détail, au lieu de partir du principe que "si rien
              n'est écrit, c'est bon".
            </p>

            {/* Section 3 */}
            <h2 className="mt-12 mb-4">
              Règlement récent, règlement existant : ce n'est pas la même logique
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est probablement la distinction la plus utile de cet article. Le tableau suivant
              résume les quatre situations à distinguer.
            </p>

            {/* Tableau */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary-300 text-white">
                    <th className="p-3 text-left font-semibold">Situation</th>
                    <th className="p-3 text-left font-semibold">
                      Ce que le règlement / la copro peut faire
                    </th>
                    <th className="p-3 text-left font-semibold">Condition ou majorité</th>
                    <th className="p-3 text-left font-semibold">Ce que cela change pour vous</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-primary-200">
                    <td className="p-3 font-semibold text-primary-400">
                      Règlement établi depuis le 21 novembre 2024
                    </td>
                    <td className="p-3 text-gray-700">
                      Doit mentionner explicitement l'autorisation ou l'interdiction des meublés de
                      tourisme
                    </td>
                    <td className="p-3 text-gray-700">Mention expresse dans le règlement</td>
                    <td className="p-3 text-gray-700">
                      Il faut vérifier le texte exact avant de louer ou d'acheter
                    </td>
                  </tr>
                  <tr className="bg-primary-100 border-b border-primary-200">
                    <td className="p-3 font-semibold text-gray-900">Règlement plus ancien</td>
                    <td className="p-3 text-gray-700">
                      Peut déjà contenir des clauses liées à la destination de l'immeuble ou à
                      l'interdiction d'activités commerciales
                    </td>
                    <td className="p-3 text-gray-700">Lecture du règlement existant</td>
                    <td className="p-3 text-gray-700">
                      L'absence du mot "Airbnb" ne signifie pas forcément que tout est permis
                    </td>
                  </tr>
                  <tr className="bg-white border-b border-primary-200">
                    <td className="p-3 font-semibold text-gray-900">
                      Modification du règlement existant
                    </td>
                    <td className="p-3 text-gray-700">
                      Peut, dans certains cas, interdire certains meublés de tourisme (lots
                      d'habitation hors résidence principale, si le règlement interdit déjà toute
                      activité commerciale)
                    </td>
                    <td className="p-3 text-gray-700">
                      Majorité de l'article 26 + conditions légales
                    </td>
                    <td className="p-3 text-gray-700">
                      La copro ne peut pas interdire n'importe quoi dans n'importe quel immeuble
                    </td>
                  </tr>
                  <tr className="bg-primary-100">
                    <td className="p-3 font-semibold text-gray-900">
                      Lot déclaré en meublé de tourisme
                    </td>
                    <td className="p-3 text-gray-700">Obligation d'information du syndic</td>
                    <td className="p-3 text-gray-700">
                      Déclaration du lot au titre du code du tourisme
                    </td>
                    <td className="p-3 text-gray-700">
                      Le sujet sera porté à l'ordre du jour de la prochaine AG sous forme
                      d'information
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-comfortable mb-4">
              Un règlement plus ancien pouvait déjà, avant la réforme, contenir des clauses limitant
              certaines activités selon la destination de l'immeuble. La réforme n'a donc pas effacé
              l'ancien droit : elle a ajouté un outil supplémentaire dans certains cas.
            </p>

            {/* Section 4 */}
            <h2 className="mt-12 mb-4">
              Le vote aux deux tiers : ce qu'il permet vraiment, et ce qu'il ne permet pas
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              C'est le point sur lequel il faut être le plus précis.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La loi permet désormais, dans certaines copropriétés, de modifier un règlement
              existant à la{' '}
              <strong>
                majorité des membres du syndicat représentant au moins les deux tiers des voix
              </strong>{' '}
              (
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050623612"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 26 de la loi du 10 juillet 1965
              </a>
              ). Mais ce mécanisme ne vaut pas pour interdire toutes les locations touristiques,
              sans distinction.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Deux conditions sont posées par la loi :
            </p>
            <div className="space-y-4 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Seuls certains lots sont visés',
                    desc: "L'interdiction ne peut viser que les lots à usage d'habitation autres que ceux constituant une résidence principale. La réforme vise donc surtout les résidences secondaires ou les logements dédiés à la location touristique.",
                  },
                  {
                    num: '2',
                    title: 'Le règlement doit déjà interdire toute activité commerciale',
                    desc: "La copropriété doit être dotée d'un règlement qui interdit toute activité commerciale dans les lots qui ne sont pas spécifiquement à destination commerciale. Ce mécanisme ne s'applique pas à toutes les copropriétés indistinctement.",
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

            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic">
              La majorité des deux tiers n'autorise pas une copropriété à interdire n'importe quelle
              location touristique dans n'importe quelles conditions. Elle ouvre une possibilité
              ciblée, sous conditions, visant surtout les lots d'habitation qui ne constituent pas
              une résidence principale.
            </blockquote>

            <p className="text-gray-700 leading-comfortable mb-4">
              À noter : le <strong>Conseil constitutionnel</strong>, dans sa décision du{' '}
              <strong>19 mars 2026</strong> (
              <a
                href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053704054"
                target="_blank"
                rel="noopener noreferrer"
              >
                décision n° 2025-1186 QPC
              </a>
              ), a jugé ces nouvelles dispositions conformes à la Constitution.
            </p>

            {/* Section 5 */}
            <h2 className="mt-12 mb-4">
              Louer en copropriété : ce que vous devez désormais au syndic
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Autre nouveauté importante : lorsqu'un lot de copropriété fait l'objet de la{' '}
              <strong>déclaration prévue par le code du tourisme</strong>, le copropriétaire — ou,
              par son intermédiaire, le locataire autorisé — doit{' '}
              <strong>en informer le syndic</strong> (
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050618105"
                target="_blank"
                rel="noopener noreferrer"
              >
                article 9-2 de la loi du 10 juillet 1965
              </a>
              ).
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette logique d'information ne concerne pas seulement les logements dédiés toute
              l'année à la location touristique. Elle peut aussi concerner un lot déclaré comme
              meublé de tourisme dans d'autres situations, y compris quand le logement est loué de
              manière ponctuelle.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Une fois cette information transmise, un <strong>point d'information</strong> relatif
              à l'activité de location de meublés touristiques dans la copropriété doit être inscrit
              à l'ordre du jour de la <strong>prochaine assemblée générale</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ce point à l'ordre du jour est un <strong>mécanisme d'information</strong>, pas une
              autorisation préalable à demander pour chaque location.
            </p>

            {/* Section 6 */}
            <h2 className="mt-12 mb-4">
              Le classement change-t-il quelque chose au règlement de copropriété ?
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">Non.</p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Un meublé de tourisme <strong>classé</strong> reste soumis à toutes les règles de
              l'immeuble : destination de la copropriété, clauses du règlement, éventuelle
              interdiction explicite, et obligations d'information vis-à-vis du syndic. Le
              classement ne permet jamais d'écarter ces règles.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement peut rester utile pour d'autres raisons :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  fiscalité micro-BIC (abattement et plafond plus favorables) — voir notre article
                  sur le{' '}
                  <Link to="/actualites/micro-bic-2026-meuble-classe-vs-non-classe">
                    Micro-BIC 2026
                  </Link>{' '}
                  ;
                </span>
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
              Pour comprendre tous les avantages du classement,{' '}
              <Link to="/les-avantages-du-classement">consultez notre page dédiée</Link>.
            </p>

            {/* Section 7 */}
            <h2 className="mt-12 mb-4">
              Ce que vous devez vérifier concrètement avant de louer un lot en copropriété
            </h2>
            <p className="text-gray-700 leading-comfortable mb-6">
              Avant de proposer un logement en location touristique dans une copropriété, voici ce
              qu'il faut vérifier au minimum :
            </p>
            <div className="space-y-4 mb-8">
              {(
                [
                  {
                    num: '1',
                    title: 'Le texte exact du règlement de copropriété',
                    desc: 'Lisez-le intégralement, pas seulement le résumé ou les grandes lignes.',
                  },
                  {
                    num: '2',
                    title: 'La date du règlement ou de sa dernière modification',
                    desc: "Un règlement établi depuis le 21 novembre 2024 doit mentionner explicitement l'autorisation ou l'interdiction des meublés de tourisme.",
                  },
                  {
                    num: '3',
                    title:
                      "La destination de l'immeuble et les clauses sur les activités commerciales",
                    desc: 'Ces clauses pouvaient déjà limiter certaines activités avant la réforme.',
                  },
                  {
                    num: '4',
                    title: 'Si le logement constitue ou non votre résidence principale',
                    desc: 'La résidence principale et la résidence secondaire ne suivent pas le même régime, y compris en copropriété.',
                  },
                  {
                    num: '5',
                    title: 'Si une modification du règlement a été votée',
                    desc: "Une décision prise en assemblée générale à la majorité de l'article 26 peut avoir modifié les règles applicables depuis votre dernier état daté.",
                  },
                  {
                    num: '6',
                    title: "Informer le syndic si le lot a fait l'objet de la déclaration prévue",
                    desc: 'Si votre lot est déclaré comme meublé de tourisme au titre du code du tourisme, vous devez en informer le syndic.',
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
              La bonne question n'est donc pas seulement :
            </p>
            <blockquote className="border-l-4 border-gray-300 pl-5 py-2 my-4 text-gray-600 italic">
              Ma copropriété peut-elle interdire Airbnb ?
            </blockquote>
            <p className="text-gray-700 leading-comfortable mb-4">La vraie question est plutôt :</p>
            <blockquote className="border-l-4 border-primary-300 pl-5 py-2 my-6 text-gray-700 italic font-medium">
              Que dit exactement mon règlement de copropriété, et dans quelle situation juridique se
              trouve mon lot ?
            </blockquote>

            <p className="text-gray-700 leading-comfortable mb-4">
              Des réponses aux questions les plus fréquentes sont disponibles dans notre{' '}
              <Link to="/faq">FAQ</Link>.
            </p>

            {/* Conclusion */}
            <h2 className="mt-12 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              En copropriété, la réforme de <strong>fin 2024</strong> n'a pas créé une interdiction
              automatique de la location touristique. Elle a surtout rendu le cadre plus explicite
              et, dans certains cas, plus facile à durcir.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Si vous louez — ou envisagez de louer — un bien en copropriété, le point de départ
              reste toujours le même : lire le <strong>règlement</strong>, vérifier la{' '}
              <strong>situation réelle du lot</strong>, puis regarder si des obligations
              supplémentaires existent vis-à-vis du <strong>syndic</strong> et de la{' '}
              <strong>commune</strong>.
            </p>

            {/* CTA */}
            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">
                Vous voulez savoir si votre logement peut être classé et comment articuler
                classement, copropriété et réglementation locale ?
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
                    label: 'Service-Public — Règlement de copropriété',
                    url: 'https://www.service-public.fr/particuliers/vosdroits/F2589',
                  },
                  {
                    label: 'Légifrance — Loi du 10 juillet 1965, article 8-1-1',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050617303',
                  },
                  {
                    label: 'Légifrance — Loi du 10 juillet 1965, article 26',
                    url: 'https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050623612',
                  },
                  {
                    label: 'Légifrance — Loi du 10 juillet 1965, article 9-2',
                    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050618105',
                  },
                  {
                    label:
                      "vie-publique.fr — Loi du 19 novembre 2024 visant à renforcer les outils de régulation des meublés de tourisme à l'échelle locale",
                    url: 'https://www.vie-publique.fr/loi/292100-loi-du-19-novembre-2024-airbnb-desequilibres-du-marche-locatif-le-meur',
                  },
                  {
                    label: 'ANIL — Renforcer les outils de régulation des meublés de tourisme',
                    url: 'https://www.anil.org/aj-renforcer-outils-regulation-meubles-tourisme/',
                  },
                  {
                    label: 'Légifrance — Décision n° 2025-1186 QPC du 19 mars 2026',
                    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053704054',
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
