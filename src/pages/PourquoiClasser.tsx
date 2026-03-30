import { Award, Calculator, CheckCircle, Globe, Percent, PiggyBank, Ticket } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import Card from '../components/ui/Card';
import SmartImage from '../components/ui/SmartImage';

const mainBenefits = [
  {
    icon: Calculator,
    title: 'Abattement fiscal majoré',
    description:
      'En régime micro-BIC, le classement donne accès à un abattement de 50 % (plafond 77 700 €) contre 30 % (plafond 15 000 €) pour un meublé non classé, depuis la loi du 19 novembre 2024.',
  },
  {
    icon: Percent,
    title: 'Taxe de séjour avantageuse',
    description:
      "Les meublés classés bénéficient d'un tarif forfaitaire de taxe de séjour par personne et par nuit, généralement inférieur à celui appliqué aux meublés non classés.",
  },
  {
    icon: PiggyBank,
    title: 'Cotisations sociales allégées',
    description:
      "Les loueurs relevant du régime micro-entrepreneur bénéficient d'un taux de cotisations sociales de 6 % pour les meublés classés, contre 21,2 % pour les meublés non classés.",
  },
  {
    icon: Award,
    title: 'Label officiel reconnu',
    description:
      "Le loueur reçoit un panonceau officiel du ministère chargé du Tourisme (1 à 5 étoiles), apposable sur le bien et mentionnable dans toutes les annonces. Il atteste du respect de critères de confort et d'équipement du logement.",
  },
  {
    icon: Globe,
    title: 'Référencement touristique',
    description:
      "Les meublés classés sont référencés par les offices de tourisme locaux et éligibles aux bases de données nationales de promotion touristique. Le niveau d'étoiles constitue un repère standardisé pour les voyageurs.",
  },
  {
    icon: Ticket,
    title: 'Chèques-vacances acceptés',
    description:
      "Le classement ouvre le droit à l'affiliation à l'ANCV (Agence nationale pour les chèques-vacances). Les meublés affiliés peuvent accepter les chèques-vacances et être référencés dans les supports de l'ANCV.",
  },
];

const panonceaux = [
  { src: '/panonceaux/panonceau-1-etoile.png', label: '1 étoile' },
  { src: '/panonceaux/panonceau-2-etoiles.png', label: '2 étoiles' },
  { src: '/panonceaux/panonceau-3-etoiles.png', label: '3 étoiles' },
  { src: '/panonceaux/panonceau-4-etoiles.png', label: '4 étoiles' },
  { src: '/panonceaux/panonceau-5-etoiles.png', label: '5 étoiles' },
];

const fiscalComparison = [
  {
    title: 'Sans classement',
    abattement: '30%',
    example: 'Pour 12 000 € de revenus : 8 400 € imposables (plafond micro-BIC* : 15 000 €)',
    color: 'bg-gray-100',
  },
  {
    title: 'Avec classement',
    abattement: '50%',
    example: 'Pour 12 000 € de revenus : 6 000 € imposables (plafond micro-BIC* : 77 700 €)',
    color: 'bg-success-100',
  },
];

function FootnoteMicroBIC() {
  return (
    <div className="text-xs text-gray-500 leading-relaxed">
      <p className="mb-2">
        * Le régime micro-BIC s'applique tant que les recettes annuelles restent sous le plafond
        applicable. En cas de dépassement pendant deux années consécutives, le loueur bascule
        obligatoirement au régime réel d'imposition, qui implique :
      </p>
      <ul className="list-disc list-inside space-y-1 mb-2">
        <li>la tenue d'une comptabilité conforme au plan comptable général ;</li>
        <li>
          l'établissement et la télétransmission d'une liasse fiscale (formulaire 2031) avant la
          déclaration de revenus ;
        </li>
        <li>le recours habituel à un expert-comptable.</li>
      </ul>
      <p>
        Source :{' '}
        <a
          href="https://www.jedeclaremonmeuble.com/micro-bic-changements-regime-reel/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          jedeclaremonmeuble.com
        </a>
      </p>
    </div>
  );
}

export default function PourquoiClasser() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Pourquoi faire classer son meublé de tourisme ?</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Le classement de votre meublé de tourisme est bien plus qu'une simple formalité
              administrative. C'est un investissement stratégique qui valorise votre bien et
              optimise vos revenus locatifs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <h2 className="mb-12 text-center">Les avantages d'un meublé classé</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainBenefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                iconColor="bicolor"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Avantages fiscaux : comparaison</h2>
            <p className="text-center text-textLight mb-12 leading-comfortable">
              Le classement vous permet de bénéficier d'un abattement fiscal majoré, réduisant
              significativement votre base imposable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fiscalComparison.map((item) => (
                <Card key={item.title} hover={false} className={item.color}>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <div className="text-4xl font-bold text-primary-300 mb-4">
                      {item.abattement}
                    </div>
                    <p className="text-sm text-textLight">d'abattement fiscal</p>
                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <p className="text-sm text-gray-700 leading-comfortable">{item.example}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 bg-success-100 border border-success-200 rounded-card p-6 text-center">
              <div className="text-4xl font-bold text-success-400 mb-1">2 400 €</div>
              <p className="text-sm font-semibold text-gray-700 mb-3">de base imposable en moins</p>
              <p className="text-sm text-gray-600">
                Sur 12 000 € de recettes, la base micro-BIC est de 6 000 € avec classement (50 %)
                contre 8 400 € sans classement (30 %).
              </p>
            </div>
            <div className="mt-6">
              <FootnoteMicroBIC />
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">
              Taxe de séjour : forfait fixe ou taux proportionnel
            </h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              Les meublés classés relèvent d'un tarif forfaitaire par personne et par nuit, fixé
              selon le nombre d'étoiles dans une fourchette définie par arrêté ministériel. Les
              meublés non classés sont soumis à un taux proportionnel au prix de la nuitée, compris
              entre 1 % et 5 % selon les délibérations locales.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-100 rounded-card p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Meublé non classé</h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-center text-3xl font-bold text-alert-400 mb-1">1 % – 5 %</p>
                  <p className="text-center text-sm text-gray-700">
                    du prix HT par personne et par nuit
                  </p>
                  <p className="text-center text-xs text-gray-600 mt-3">
                    Taux fixé par délibération locale, dans cette fourchette nationale.
                  </p>
                </div>
              </div>
              <div className="bg-success-100 rounded-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Meublé classé</h3>
                <p className="text-center text-sm font-medium text-gray-700 mb-3">
                  Tarif forfaitaire par étoile (fourchette nationale 2026)
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-success-200">
                      <th className="text-left py-1 text-gray-600 font-medium">Classement</th>
                      <th className="text-right py-1 text-gray-600 font-medium">
                        Min – Max / pers / nuit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-success-200/50">
                      <td className="py-1">1 étoile</td>
                      <td className="text-right">0,20 € – 0,80 €</td>
                    </tr>
                    <tr className="border-b border-success-200/50">
                      <td className="py-1">2 étoiles</td>
                      <td className="text-right">0,30 € – 1,00 €</td>
                    </tr>
                    <tr className="border-b border-success-200/50">
                      <td className="py-1">3 étoiles</td>
                      <td className="text-right">0,50 € – 1,70 €</td>
                    </tr>
                    <tr className="border-b border-success-200/50">
                      <td className="py-1">4 étoiles</td>
                      <td className="text-right">0,70 € – 2,60 €</td>
                    </tr>
                    <tr>
                      <td className="py-1">5 étoiles</td>
                      <td className="text-right">0,70 € – 3,60 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-primary-100 rounded-card p-6 mb-6">
              <p className="font-semibold text-gray-800 mb-4">
                Exemple à Paris — meublé 3★, loué 120 € / nuit à 2 personnes (60 € HT / pers)
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Paris applique une surtaxe départementale (+10 %) et une surtaxe Île-de-France
                Mobilités (+200 %) sur la base de la taxe de séjour.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary-200">
                      <th className="text-left py-2 text-gray-600 font-medium"></th>
                      <th className="text-right py-2 text-gray-600 font-medium">Non classé</th>
                      <th className="text-right py-2 text-success-500 font-medium">Classé 3★</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-primary-200/50">
                      <td className="py-2">Base taxe de séjour</td>
                      <td className="text-right">5 % × 60 € = 3,00 €</td>
                      <td className="text-right text-success-600">1,70 €</td>
                    </tr>
                    <tr className="border-b border-primary-200/50">
                      <td className="py-2">+ Surtaxe dépt. (10 %)</td>
                      <td className="text-right">0,30 €</td>
                      <td className="text-right text-success-600">0,17 €</td>
                    </tr>
                    <tr className="border-b border-primary-200/50">
                      <td className="py-2">+ Surtaxe IDF Mobilités (200 %)</td>
                      <td className="text-right">6,00 €</td>
                      <td className="text-right text-success-600">3,40 €</td>
                    </tr>
                    <tr className="font-semibold border-t-2 border-primary-300">
                      <td className="py-2">Total / pers / nuit</td>
                      <td className="text-right">9,30 €</td>
                      <td className="text-right text-success-600">5,27 €</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-2">Total 2 pers / nuit</td>
                      <td className="text-right">18,60 €</td>
                      <td className="text-right text-success-600">10,54 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-success-400">8,06 €</span>
                <span className="text-sm text-gray-600 ml-2">
                  de taxe de séjour en moins par nuit, répercutés sur le voyageur
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Le tarif effectif dépend de la délibération de chaque collectivité.{' '}
              <a
                href="https://taxesejour.impots.gouv.fr/FR/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Consulter les barèmes applicables dans votre commune (impots.gouv.fr).
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">
              Régime social : un avantage concret pour les meublés classés en 2026
            </h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              En dessous de 23 000 € de recettes annuelles, loueurs classés et non classés relèvent
              des mêmes prélèvements sociaux (17,2 % sur les revenus nets) — sans cotisations
              sociales professionnelles. Au-delà de ce seuil, les situations divergent nettement sur
              le plan social. Le meublé de tourisme classé peut, selon sa situation, continuer à
              relever du micro-social à 6 % sur les recettes brutes. En 2026, la location de courte
              durée non classée ne peut plus accéder à ce cadre : elle bascule vers le régime des
              travailleurs indépendants, plus complexe et potentiellement plus lourd.
            </p>

            <div className="overflow-x-auto mb-2">
              <table className="w-full text-sm bg-white rounded-card overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary-200 text-gray-800">
                    <th className="text-left px-4 py-3 font-semibold">Situation</th>
                    <th className="text-left px-4 py-3 font-semibold">Meublé classé</th>
                    <th className="text-left px-4 py-3 font-semibold">Meublé non classé</th>
                    <th className="text-left px-4 py-3 font-semibold">À retenir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">Recettes &lt; 15 000 €/an</td>
                    <td className="px-4 py-3">
                      Prélèvements sociaux — pas de cotisations professionnelles
                    </td>
                    <td className="px-4 py-3">
                      Prélèvements sociaux — pas de cotisations professionnelles
                    </td>
                    <td className="px-4 py-3">Même cadre dans les deux cas</td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">15 000 € – 23 000 €/an</td>
                    <td className="px-4 py-3">
                      Pas de cotisations sociales — micro-BIC accessible
                    </td>
                    <td className="px-4 py-3">Pas de cotisations sociales — régime réel fiscal</td>
                    <td className="px-4 py-3">
                      Pas encore de cotisations ; divergence fiscale (voir bloc précédent)
                    </td>
                  </tr>
                  <tr className="text-gray-700">
                    <td className="px-4 py-3">&gt; 23 000 €/an</td>
                    <td className="px-4 py-3 bg-success-100">
                      Micro-social possible à{' '}
                      <span className="font-bold text-success-500">6 %</span>*
                    </td>
                    <td className="px-4 py-3 bg-alert-100 font-medium">
                      Régime des travailleurs indépendants
                    </td>
                    <td className="px-4 py-3">
                      Le classement permet de conserver un cadre social plus simple et favorable
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mb-8 px-1">
              * Applicable entre 23 000 € et 83 600 €, si les recettes 2024 ou 2025 n'excèdent pas
              77 700 €. Au-delà de 83 600 €, le meublé classé bascule également vers le régime des
              indépendants.
            </p>

            <div className="bg-success-100 border border-success-200 rounded-card p-6 mb-6 text-center">
              <p className="text-gray-800 leading-comfortable">
                En 2026, le classement ne se limite pas à un avantage fiscal : il permet aussi de
                conserver un cadre social plus simple et potentiellement beaucoup plus favorable.
              </p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              <a
                href="https://www.urssaf.fr/accueil/actualites/auto-entrepreneur-loueur-meuble.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Source : Urssaf — auto-entrepreneur loueur en meublé : le point sur les changements
              </a>
              {' · '}
              <a
                href="https://www.urssaf.fr/accueil/services/economie-collaborative.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Urssaf — économie collaborative
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <h2 className="mb-8 text-center">Le panonceau officiel : un repère certifié</h2>
          <p className="text-textLight leading-comfortable mb-6 text-center max-w-2xl mx-auto">
            Après attribution du classement, le loueur dispose du droit d'apposer le panonceau
            officiel géré par Atout France, sous l'autorité du ministère chargé du Tourisme. Il peut
            être affiché sur la façade du bien et reproduit sur toutes les annonces.
          </p>

          <div className="flex flex-nowrap justify-center items-start pb-10">
            {panonceaux.map(({ src, label }, i) => (
              <div
                key={label}
                className={`relative group -mx-4 sm:-mx-5 transition-transform duration-200 hover:-translate-y-3 ${
                  i % 2 === 1 ? 'translate-y-10' : ''
                }`}
                style={{ zIndex: i === 2 ? 10 : 5 - Math.abs(2 - i) }}
              >
                <img
                  src={src}
                  alt={`Panonceau officiel meublé de tourisme ${label}`}
                  width={842}
                  height={1191}
                  loading="lazy"
                  decoding="async"
                  className="w-44 sm:w-56 object-contain drop-shadow-lg"
                />
              </div>
            ))}
          </div>
          <div className="text-center mb-12">
            <a
              href="https://www.classement.atout-france.fr/les-panonceaux-de-classement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-primary-300 hover:text-primary-400"
            >
              Panonceaux officiels 2026 — Atout France
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Émis sous l'autorité du ministère chargé du Tourisme
                </p>
                <p className="text-sm text-textLight">
                  Le panonceau est géré par Atout France. Il atteste que le logement a été inspecté
                  par un organisme accrédité par le Cofrac ou agréé par Atout France.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Reproductible sur toutes les annonces
                </p>
                <p className="text-sm text-textLight">
                  Le nombre d'étoiles peut figurer sur les plateformes de réservation (Airbnb,
                  Booking…), sur le site du loueur et sur tout support de communication.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Validité 5 ans</p>
                <p className="text-sm text-textLight">
                  Le panonceau porte l'année d'attribution et est renouvelé après une nouvelle
                  inspection, assurant la mise à jour régulière du niveau de classement.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Critères objectifs et consultables
                </p>
                <p className="text-sm text-textLight">
                  Les étoiles correspondent à des critères de confort et d'équipement définis par
                  arrêté ministériel. La grille d'évaluation est publique et vérifiable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <h2 className="mb-10 text-center">Référencement touristique</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <SmartImage
                assetKey="pourquoiReferencement"
                alt="Meuble de tourisme"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-card shadow-card-hover w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Un classement qui rend votre bien plus visible
                    </p>
                    <p className="text-sm text-textLight leading-comfortable">
                      Le classement officiel donne à votre meublé un repère reconnu par tout
                      l'écosystème touristique. Il facilite sa reprise dans les circuits
                      d'information des offices de tourisme et des organismes touristiques locaux,
                      auprès desquels Atout France invite justement les voyageurs et propriétaires à
                      se renseigner pour les meublés classés.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Une information exploitable bien au-delà de votre annonce
                    </p>
                    <p className="text-sm text-textLight leading-comfortable">
                      Les données touristiques issues des offices de tourisme, agences
                      départementales et comités régionaux alimentent{' '}
                      <a
                        href="https://www.datatourisme.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-700"
                      >
                        DATAtourisme
                      </a>
                      , la plateforme nationale de référence. Ce système permet de diffuser une
                      information homogène, réutilisable à grande échelle par des acteurs publics,
                      privés et des supports d'information touristique.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      Des étoiles qui parlent immédiatement aux voyageurs
                    </p>
                    <p className="text-sm text-textLight leading-comfortable">
                      Le classement repose sur une échelle officielle de 1 à 5 étoiles, valable 5
                      ans, fondée sur 133 critères. Pour un voyageur, c'est un signal simple et
                      rassurant pour situer le niveau de confort, d'équipement et de services du
                      logement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">
            Quels types de logements peuvent bénéficier d'un classement ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            Contrairement aux idées reçues, le classement n'est pas réservé aux biens haut de gamme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/prerequis-au-classement" variant="ghost" size="lg">
              Découvrir les prérequis
            </Button>
            <Button href="/demande-classement" variant="white" size="lg">
              Demander votre classement
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
