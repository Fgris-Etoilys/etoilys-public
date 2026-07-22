import { Link } from 'react-router-dom';
import { Award, Calculator, MapPin, Percent, PiggyBank, ShieldCheck } from 'lucide-react';
import Accordion from '../../components/ui/Accordion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FeatureCard from '../../components/ui/FeatureCard';
import SmartImage from '../../components/ui/SmartImage';
import DepartmentLocalPages from '../../components/local/DepartmentLocalPages';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import {
  LOT_ET_GARONNE_FAQ,
  LOT_ET_GARONNE_PROCEDURE_STEPS,
  LOT_ET_GARONNE_SERVICE_SECTORS,
  LOT_ET_GARONNE_SOURCES,
  LOT_ET_GARONNE_TOURISM_ROWS,
  getDepartmentInterventionArea,
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
      'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un département où les gîtes, maisons de vacances et locations saisonnières occupent une place réelle.',
  },
];

export default function ClassementLotEtGaronne() {
  const departmentArea = getDepartmentInterventionArea('lot-et-garonne');

  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden py-section text-white">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="lotEtGaronneHero"
            alt="Village du Lot-et-Garonne au bord de l’eau"
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Lot-et-Garonne
            </p>
            <h1 className="mb-6 text-white">
              Classement de gîte et meublé de tourisme dans le Lot-et-Garonne
            </h1>
            <div className="max-w-3xl space-y-5 text-xl leading-comfortable text-white/90">
              <p>
                Vous louez un gîte, une maison de vacances ou un meublé de tourisme dans le
                Lot-et-Garonne ? Etoilys vous accompagne pour organiser la visite de classement
                officielle de votre logement, notamment autour d’Agen, Villeneuve-sur-Lot, Marmande,
                Casteljaloux, Lauzun ou Villeréal.
              </p>
              <p>
                Entre hébergements familiaux, maisons de vacances, gîtes ruraux et séjours nature,
                le département présente une offre touristique diffuse. Dans ce contexte, le
                classement permet de donner un cadre officiel au logement et de rendre l’offre plus
                lisible pour les voyageurs.
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
                Pourquoi faire classer un meublé de tourisme dans le Lot-et-Garonne ?
              </h2>
              <p>
                Le Lot-et-Garonne rassemble des situations de location variées : gîtes, maisons de
                vacances, logements familiaux, résidences secondaires, hébergements proches des
                bastides ou locations situées autour des principaux bassins de vie.
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

            <div className="mx-auto mt-8 flex max-w-4xl gap-3 rounded-card border border-primary-200 bg-primary-100 px-5 py-4 text-sm leading-comfortable text-textLight">
              <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary-300" />
              <div>
                <p className="font-semibold text-gray-900">Organisme accrédité Cofrac Inspection</p>
                <p>
                  Etoilys réalise les visites officielles de classement dans le Lot-et-Garonne dans
                  le cadre de son accréditation Cofrac Inspection n°3-2394.
                </p>
                <a
                  href={COFRAC_ACCREDITATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex font-medium text-primary-300 underline hover:text-primary-400"
                >
                  Voir la portée d’accréditation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6">
              Un territoire rural où les meublés touristiques structurent l’accueil local
            </h2>
            <div className="mb-8 space-y-5 text-textLight leading-comfortable">
              <p>
                Dans le Lot-et-Garonne, l’hébergement touristique repose largement sur une offre
                diffuse : maisons de vacances, gîtes, résidences secondaires et logements
                saisonniers répartis entre vallées, bastides, villages de caractère et pôles urbains
                comme Agen, Marmande ou Villeneuve-sur-Lot.
              </p>
              <p>
                Les données du Mémento du Tourisme en Lot-et-Garonne 2025 montrent que les meublés
                occupent une place réelle dans l’offre locale, avec un parc identifié et une part
                significative de logements déjà classés.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
              <SmartImage
                assetKey="lotEtGaronneTerritory"
                alt="Maison et territoire touristique dans le Lot-et-Garonne"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-full min-h-[420px] w-full rounded-card object-cover shadow-card-hover"
              />

              <Card hover={false} className="p-6">
                <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                  Données Lot-et-Garonne
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {LOT_ET_GARONNE_TOURISM_ROWS.map((row) => (
                    <div key={row.key} className="rounded-card bg-white p-5 shadow-sm">
                      <p className="mb-1 text-3xl font-bold text-primary-300">{row.value}</p>
                      <p className="text-sm leading-comfortable text-textLight">{row.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Source : Mémento du Tourisme en Lot-et-Garonne 2025, Tourisme Lot-et-Garonne /
                  SIRTAQUI / Lighthouse.
                </p>
              </Card>
            </div>

            <div className="mt-8 space-y-5 text-textLight leading-comfortable">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                Un classement déjà bien installé dans le département
              </h3>
              <p>
                Avec plus de la moitié des meublés recensés déjà classés, le classement fait partie
                des pratiques bien identifiées dans le Lot-et-Garonne. Pour un propriétaire, ce
                n’est donc pas seulement une démarche administrative : c’est aussi un moyen
                d’inscrire son logement dans un cadre déjà largement utilisé par l’offre locale.
              </p>
              <p>
                Dans un territoire où les hébergements sont très variés — gîtes ruraux, maisons de
                vacances, logements familiaux ou résidences secondaires louées à la saison — le
                classement apporte un repère commun. Il permet de présenter le logement selon une
                grille nationale, valable 5 ans, avec une catégorie de 1 à 5 étoiles.
              </p>
              <p>
                Le classement ne remplace pas la qualité de l’accueil ni la personnalité du bien.
                Mais dans un département où une part importante des meublés est déjà classée, il
                peut aider à rendre l’offre plus lisible pour les voyageurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-400">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Intervention locale
              </div>
              <h2 className="mb-5">
                Classement de meublés en Lot-et-Garonne : les secteurs couverts
              </h2>
              <p className="text-textLight leading-comfortable">
                Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais,
                la vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le
                Fumélois, les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le
                secteur de Casteljaloux.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {LOT_ET_GARONNE_SERVICE_SECTORS.map((sector) => (
                <Card key={sector.name} hover={false} className="p-6 md:last:col-span-2">
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    {sector.name}
                  </h3>
                  <p className="text-sm text-textLight leading-comfortable">
                    {sector.communes.join(', ')}.
                  </p>
                </Card>
              ))}
            </div>

            <p className="mt-8 max-w-4xl text-sm text-textLight leading-comfortable">
              Cette liste n’est pas exhaustive. Si votre commune n’apparaît pas, vous pouvez tout de
              même déposer une demande : Etoilys vous confirmera les possibilités d’intervention
              selon la localisation du logement et l’organisation des tournées.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Button href="/demande-classement" variant="primary">
                Faire une demande de classement
              </Button>
              <Button href="/zones-intervention" variant="secondary">
                Consulter toutes les zones d’intervention
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DepartmentLocalPages
        departmentName={departmentArea.name}
        localPages={departmentArea.localPages}
      />

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6">Comment se déroule une visite de classement avec Etoilys ?</h2>
            <p className="mb-8 text-textLight leading-comfortable">
              Vous déposez votre demande, nous vérifions le périmètre avec vous, puis la visite est
              organisée sur place selon la grille officielle.
            </p>
            <SmartImage
              assetKey="lotEtGaronneCanal"
              alt="Château et paysage rural dans le Lot-et-Garonne"
              sizes="(min-width: 1024px) 960px, 100vw"
              className="mb-10 aspect-[16/7] w-full rounded-card object-cover shadow-card-hover"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {LOT_ET_GARONNE_PROCEDURE_STEPS.map((step) => (
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
            <h2 className="mb-6">
              Combien coûte une visite de classement dans le Lot-et-Garonne ?
            </h2>
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
              items={LOT_ET_GARONNE_FAQ.map((item) => ({
                question: item.question,
                answer:
                  item.question === 'Le classement remplace-t-il la déclaration en mairie ?' ? (
                    <p>
                      Non. Le classement et la déclaration en mairie sont deux démarches
                      différentes. Les{' '}
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
          <h2 className="mb-6 text-white">
            Demander le classement de votre meublé dans le Lot-et-Garonne
          </h2>
          <div className="mx-auto mb-8 max-w-2xl space-y-5 text-xl leading-comfortable text-white/90">
            <p>
              Vous louez ou préparez la mise en location d’un meublé de tourisme dans le
              Lot-et-Garonne ? Etoilys peut vous accompagner pour organiser la visite de classement.
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
              {LOT_ET_GARONNE_SOURCES.map((source) => (
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
