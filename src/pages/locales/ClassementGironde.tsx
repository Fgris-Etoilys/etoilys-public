import { Link } from 'react-router-dom';
import { Award, Calculator, MapPin, Percent, PiggyBank } from 'lucide-react';
import Accordion from '../../components/ui/Accordion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FeatureCard from '../../components/ui/FeatureCard';
import SmartImage from '../../components/ui/SmartImage';
import {
  GIRONDE_FAQ,
  GIRONDE_PRIORITY_SECTORS,
  GIRONDE_PROCEDURE_STEPS,
  GIRONDE_SOURCES,
  GIRONDE_TOURISM_ROWS,
} from '../../content/localServiceAreas';

const localBenefits = [
  {
    icon: Calculator,
    title: 'Fiscalité micro-BIC',
    description:
      'Un meublé classé conserve un cadre micro-BIC plus favorable qu’un meublé non classé, avec un plafond plus élevé et un abattement forfaitaire plus important selon les règles applicables.',
  },
  {
    icon: Percent,
    title: 'Taxe de séjour',
    description:
      'Une taxe de séjour plus lisible, souvent plus avantageuse, et plus simple à présenter à vos voyageurs.',
  },
  {
    icon: PiggyBank,
    title: 'Cotisations sociales',
    description:
      'Si vous relevez du régime micro-social, le classement peut aussi changer le cadre applicable : les meublés de tourisme classés bénéficient d’un taux spécifique de 6 %, sous conditions de seuils.',
  },
  {
    icon: Award,
    title: 'Repère officiel pour les voyageurs',
    description:
      'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un département où l’offre de meublés, gîtes et locations saisonnières est importante.',
  },
];

export default function ClassementGironde() {
  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden py-section text-white">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="girondeHero"
            alt="Vue de Saint-Émilion en Gironde"
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Gironde
            </p>
            <h1 className="mb-6 text-white">Classement de meublé de tourisme en Gironde</h1>
            <div className="max-w-3xl space-y-5 text-xl leading-comfortable text-white/90">
              <p>
                Vous louez un appartement, une maison de vacances, un gîte ou une location
                saisonnière en Gironde ? Etoilys accompagne les propriétaires qui souhaitent
                demander le classement officiel de leur meublé de tourisme.
              </p>
              <p>
                Entre Bordeaux, le Libournais, Saint-Émilion, l’Entre-deux-Mers, le Sud-Gironde, le
                Blayais, le Bassin d’Arcachon et le littoral médocain, la Gironde est un territoire
                touristique majeur. Dans ce contexte, le classement peut renforcer la lisibilité de
                votre logement et avoir des effets concrets sur la fiscalité, la taxe de séjour et
                la présentation de votre offre auprès des voyageurs.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/demande-classement" variant="white" size="lg">
                Demander le classement de mon meublé
              </Button>
              <Button href="/procedure" variant="ghost" size="lg">
                Comprendre la procédure
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center text-textLight leading-comfortable">
              <h2 className="mb-6 text-gray-900">
                Les bénéfices concrets du classement pour votre meublé en Gironde
              </h2>
              <p>
                La Gironde attire des clientèles très différentes : séjours urbains à Bordeaux,
                œnotourisme autour de Saint-Émilion et du Médoc, vacances sur le Bassin d’Arcachon,
                séjours nature dans l’Entre-deux-Mers, itinérances à vélo, escapades patrimoniales
                ou familiales.
              </p>
              <p className="mt-5">
                Le classement ne sert pas seulement à obtenir des étoiles. Pour un propriétaire, il
                peut aussi jouer sur la fiscalité, la taxe de séjour, les cotisations sociales et la
                présentation du logement auprès des voyageurs.
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {localBenefits.map((benefit) => (
                <FeatureCard
                  key={benefit.title}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  iconColor="bicolor"
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="mb-5 text-lg font-medium text-gray-900">
                Vous voulez vérifier concrètement l’impact du classement ?
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button href="/simulateur-fiscal-classement" variant="primary">
                  Estimer l’impact fiscal
                </Button>
                <Button href="/simulateur-taxe-sejour" variant="secondary">
                  Comparer la taxe de séjour
                </Button>
              </div>
              <Link
                to="/les-avantages-du-classement"
                className="mt-5 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
              >
                Voir tous les avantages du classement
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6">Une Gironde touristique aux profils de locations très variés</h2>
            <div className="mb-8 space-y-5 text-textLight leading-comfortable">
              <p>
                La Gironde ne se résume pas à Bordeaux. Entre le bassin d’Arcachon, le Médoc,
                Saint-Émilion, Libourne, l’Entre-deux-Mers et la métropole bordelaise, les
                propriétaires de meublés de tourisme font face à des situations très différentes.
              </p>
              <p>
                Certains louent un appartement urbain, d’autres une maison de vacances, un gîte
                viticole ou une résidence secondaire proche du littoral. Dans tous les cas, le
                classement permet de donner un cadre officiel au logement et d’éclairer les
                voyageurs sur son niveau de confort.
              </p>
              <p>
                Les chiffres publiés par Gironde Tourisme et l’INSEE confirment le poids du tourisme
                dans le département.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
              <SmartImage
                assetKey="girondeTerritory"
                alt="Promenade littorale en Gironde"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-full min-h-[420px] w-full rounded-card object-cover shadow-card-hover"
              />

              <Card hover={false} className="p-6">
                <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                  Données Gironde
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {GIRONDE_TOURISM_ROWS.map((row) => (
                    <div key={row.key} className="rounded-card bg-white p-5 shadow-sm">
                      <p className="mb-1 text-3xl font-bold text-primary-300">{row.value}</p>
                      <p className="text-sm leading-comfortable text-textLight">{row.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Sources : Gironde Tourisme, Chiffres clés 2025 et Enquête clientèle 2025.
                </p>
              </Card>
            </div>

            <div className="mt-8 space-y-5 text-textLight leading-comfortable">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                En Gironde, les meublés de tourisme ne sont pas un marché secondaire
              </h3>
              <p>
                Avec 38 % des lits marchands en meublés et locations, la Gironde fait partie des
                territoires où la location saisonnière occupe une place importante dans l’offre
                touristique.
              </p>
              <p>
                En 2024, Gironde Tourisme recensait aussi 46 000 logements entiers proposés à la
                location sur Airbnb, Booking et Abritel. L’INSEE confirme cette dynamique : la
                Gironde est le département néo-aquitain qui concentre le plus de nuitées réservées
                via les plateformes en 2024.
              </p>
              <p>
                Dans ce contexte, le classement n’est pas seulement une formalité administrative. Il
                permet à votre logement de s’inscrire dans un cadre officiel, plus lisible pour les
                voyageurs, et peut avoir des effets concrets sur la fiscalité, la taxe de séjour et
                les cotisations sociales.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-400">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Intervention locale
              </div>
              <h2 className="mb-5">Classement de meublés en Gironde : les secteurs couverts</h2>
              <div className="space-y-5 text-textLight leading-comfortable">
                <p>
                  Etoilys accompagne les propriétaires de meublés de tourisme en Gironde, selon la
                  localisation du logement et l’organisation des tournées.
                </p>
                <p>
                  Après réception de votre demande, nous vous confirmons les possibilités
                  d’intervention, les délais et les conditions applicables avant toute validation.
                </p>
              </div>
              <div className="mt-7">
                <Button href="/demande-classement" variant="primary">
                  Faire une demande de classement
                </Button>
              </div>
            </div>

            <Card hover={false} className="p-6 md:p-8">
              <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                Secteurs couverts
              </h3>
              <div className="flex flex-wrap gap-3">
                {GIRONDE_PRIORITY_SECTORS.map((sector) => (
                  <span
                    key={sector}
                    className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-gray-800"
                  >
                    {sector}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm text-textLight leading-comfortable">
                Votre commune n’est pas listée ? Indiquez-la dans votre demande : nous vous
                confirmerons les modalités d’intervention avant toute validation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6">Comment se déroule une visite de classement avec Etoilys ?</h2>
            <p className="mb-8 text-textLight leading-comfortable">
              Vous déposez votre demande, nous vérifions le périmètre avec vous, puis la visite est
              organisée sur place selon la grille officielle.
            </p>
            <SmartImage
              assetKey="girondeCoast"
              alt="Littoral girondin et dune du Pilat"
              sizes="(min-width: 1024px) 960px, 100vw"
              className="mb-10 aspect-[16/7] w-full rounded-card object-cover shadow-card-hover"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {GIRONDE_PROCEDURE_STEPS.map((step) => (
                <Card key={step.number} hover={false} className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-300 text-lg font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-textLight leading-comfortable">{step.description}</p>
                </Card>
              ))}
            </div>
            <div className="mt-8 rounded-card bg-white p-6 shadow-card">
              <h3 className="mb-3 text-2xl font-playfair font-semibold text-gray-900">
                Vous voulez avoir une première idée du classement possible ?
              </h3>
              <p className="mb-5 text-textLight leading-comfortable">
                Le simulateur Etoilys permet d’estimer la catégorie que votre logement pourrait
                viser avant une visite officielle sur place.
              </p>
              <Button href="/simulateur" variant="primary">
                Simuler mon classement
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6">Combien coûte une visite de classement en Gironde ?</h2>
            <Card hover={false} className="p-8">
              <div className="space-y-5 text-textLight leading-comfortable">
                <p>
                  Le tarif d’une visite dépend de plusieurs éléments simples : la localisation du
                  logement, le délai souhaité, le nombre de meublés à classer et la possibilité de
                  regrouper plusieurs visites dans le même secteur.
                </p>
                <p>
                  Après réception de votre demande, Etoilys vous confirme les modalités
                  d’intervention et le tarif applicable avant toute validation. Vous savez donc à
                  quoi vous engager avant de fixer la visite.
                </p>
              </div>
              <div className="mt-6">
                <Button href="/demande-classement" variant="primary">
                  Demander mon classement
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center">Questions fréquentes</h2>
            <Accordion
              items={GIRONDE_FAQ.map((item) => ({
                question: item.question,
                answer:
                  item.question === 'Le classement remplace-t-il la déclaration en mairie ?' ? (
                    <p>
                      Non. Le classement ne remplace pas les formalités déclaratives ou
                      d’enregistrement applicables localement. Les{' '}
                      <Link to="/prerequis-au-classement" className="text-primary-300 underline">
                        prérequis au classement
                      </Link>{' '}
                      présentent les principaux points à vérifier.
                    </p>
                  ) : (
                    item.answer
                  ),
              }))}
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-300 to-themePrimary-2 py-section text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">Demander le classement de votre meublé en Gironde</h2>
          <div className="mx-auto mb-8 max-w-2xl space-y-5 text-xl leading-comfortable text-white/90">
            <p>
              Vous louez ou préparez la mise en location d’un meublé de tourisme en Gironde ?
              Etoilys peut vous accompagner pour organiser la visite de classement.
            </p>
            <p>
              Déposez votre demande en ligne : nous vous confirmerons les modalités d’intervention,
              le tarif applicable et les prochaines disponibilités avant toute validation.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/demande-classement" variant="white" size="lg">
              Demander le classement de mon meublé
            </Button>
            <Button href="/faq" variant="ghost" size="lg">
              Lire la FAQ
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-h4">Sources officielles et institutionnelles</h2>
            <ul className="space-y-3">
              {GIRONDE_SOURCES.map((source) => (
                <li key={source.href} className="text-sm leading-comfortable text-textLight">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-primary-300 underline hover:text-primary-400"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
