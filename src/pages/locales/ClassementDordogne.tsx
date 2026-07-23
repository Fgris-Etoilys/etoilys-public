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
  DORDOGNE_FAQ,
  DORDOGNE_PROCEDURE_STEPS,
  DORDOGNE_SERVICE_SECTORS,
  DORDOGNE_SOURCES,
  DORDOGNE_TOURISM_ROWS,
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
      'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un territoire touristique comme la Dordogne, où les gîtes et locations saisonnières sont nombreux.',
  },
];

export default function ClassementDordogne() {
  const departmentArea = getDepartmentInterventionArea('dordogne');

  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden py-section text-white">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="dordogneHero"
            alt="Paysage de Dordogne autour d’un secteur touristique"
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Dordogne
            </p>
            <h1 className="mb-6 text-white">
              Classement de gîte et meublé de tourisme en Dordogne
            </h1>
            <div className="max-w-3xl space-y-5 text-xl leading-comfortable text-white/90">
              <p>
                Vous louez un gîte, une maison de vacances, un appartement ou une location
                saisonnière en Dordogne ? Etoilys accompagne les propriétaires qui souhaitent
                demander le classement officiel de leur meublé de tourisme.
              </p>
              <p>
                La Dordogne est un territoire touristique majeur, avec une offre importante de
                meublés, de résidences secondaires et de locations de courte durée. Dans ce
                contexte, le classement peut renforcer l’intérêt économique de votre meublé,
                notamment sur la fiscalité, la taxe de séjour et la lisibilité de votre offre auprès
                des voyageurs.
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
                Les bénéfices concrets du classement pour votre meublé en Dordogne
              </h2>
              <p>
                La Dordogne accueille chaque année une clientèle touristique importante, attirée par
                le Périgord Noir, la vallée de la Dordogne, les bastides, les villages classés, le
                patrimoine préhistorique, la gastronomie et les séjours nature.
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
                  Etoilys réalise les visites officielles de classement en Dordogne dans le cadre de
                  son accréditation Cofrac Inspection n°3-2394.
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
            <h2 className="mb-6">Un territoire touristique où les meublés ont une vraie place</h2>
            <div className="mb-8 space-y-5 text-textLight leading-comfortable">
              <p>
                En Dordogne, les meublés de tourisme représentent une part importante de l’offre
                d’hébergement touristique.
              </p>
              <p>
                Les données touristiques départementales confirment le poids du secteur : fin 2025,
                la Dordogne comptait :
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
              <SmartImage
                assetKey="dordogneLandscape"
                alt="Village et paysage de Dordogne"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-full min-h-[420px] w-full rounded-card object-cover shadow-card-hover"
              />

              <Card hover={false} className="p-6">
                <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                  Données Dordogne
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {DORDOGNE_TOURISM_ROWS.map((row) => (
                    <div key={row.key} className="rounded-card bg-white p-5 shadow-sm">
                      <p className="mb-1 text-3xl font-bold text-primary-300">{row.value}</p>
                      <p className="text-sm leading-comfortable text-textLight">{row.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">Source : CDT Dordogne 2025.</p>
              </Card>
            </div>

            <div className="mt-8 space-y-5 text-textLight leading-comfortable">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                En Dordogne, les meublés de tourisme ne sont pas un marché de niche
              </h3>
              <p>
                Avec plus de 8 000 meublés de tourisme recensés fin 2025, la Dordogne fait partie
                des territoires où la location saisonnière occupe une place importante dans l’offre
                touristique.
              </p>
              <p>
                Dans ce contexte, le classement n’est pas seulement une formalité. Il permet à votre
                logement de s’inscrire dans un cadre officiel, plus lisible pour les voyageurs, et
                peut avoir des effets concrets sur la fiscalité, la taxe de séjour et les
                cotisations sociales.
              </p>
              <p>
                Plus de 3 000 meublés étaient déjà classés dans le département fin 2025. Autrement
                dit, une partie importante du marché est déjà structurée autour du classement.
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
              <h2 className="mb-5">Classement de meublés en Dordogne : les secteurs couverts</h2>
              <p className="text-textLight leading-comfortable">
                Etoilys intervient en Dordogne sur une large zone couvrant notamment le Bergeracois,
                le Périgord Noir, la vallée de la Dordogne, la vallée de la Vézère, le Grand
                Périgueux, la vallée de l’Isle, le Ribéracois et une partie du nord-ouest du
                département.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {DORDOGNE_SERVICE_SECTORS.map((sector) => (
                <Card key={sector.name} hover={false} className="p-6 md:last:col-span-2">
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    {sector.name}
                  </h3>
                  <p className="text-sm text-textLight leading-comfortable">
                    {sector.communes.join(', ')}.
                  </p>
                  {sector.name === 'Bergeracois et sud Dordogne' && (
                    <Link
                      to="/classement-meuble-tourisme-bergerac"
                      className="mt-4 inline-flex text-sm font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400"
                    >
                      Voir la page Bergerac →
                    </Link>
                  )}
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
              assetKey="dordogneInterior"
              alt="Intérieur de maison de vacances"
              sizes="(min-width: 1024px) 960px, 100vw"
              className="mb-10 aspect-[16/7] w-full rounded-card object-cover shadow-card-hover"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DORDOGNE_PROCEDURE_STEPS.map((step) => (
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
                Utilisez le simulateur Etoilys pour estimer la catégorie que votre logement pourrait
                viser, avant une visite officielle sur place.
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
            <h2 className="mb-6">Combien coûte une visite de classement en Dordogne ?</h2>
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

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center">Questions fréquentes</h2>
            <Accordion
              items={DORDOGNE_FAQ.map((item) => ({
                question: item.question,
                answer:
                  item.question === 'Le classement remplace-t-il la déclaration en mairie ?' ? (
                    <p>
                      Non. Le classement ne remplace pas les formalités déclaratives ou
                      d’enregistrement applicables localement. Avant de déposer une demande, vous
                      pouvez consulter les{' '}
                      <Link to="/prerequis-au-classement" className="text-primary-300 underline">
                        prérequis au classement
                      </Link>
                      .
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
          <h2 className="mb-6 text-white">Demander le classement de votre meublé en Dordogne</h2>
          <div className="mx-auto mb-8 max-w-2xl space-y-5 text-xl leading-comfortable text-white/90">
            <p>
              Vous louez ou préparez la mise en location d’un meublé de tourisme en Dordogne ?
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
              {DORDOGNE_SOURCES.map((source) => (
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
