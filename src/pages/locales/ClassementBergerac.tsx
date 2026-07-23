import { Link } from 'react-router-dom';
import { Award, CalendarDays, Euro, FileCheck, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import Accordion from '../../components/ui/Accordion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SmartImage from '../../components/ui/SmartImage';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import { BERGERAC_FAQ, BERGERAC_PROCEDURE_STEPS } from '../../content/localServiceAreas';

const taxComparison = [
  { label: 'Meublé non classé', value: '6,60 € par nuit' },
  { label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
];

const tariffCards = [
  {
    title: 'Tarif habituel',
    price: '150 € à 250 € TTC',
    description:
      'Pour une visite de classement dans le secteur de Bergerac, selon le logement et les modalités d’intervention.',
  },
  {
    title: 'Adhérents OT partenaires',
    price: 'Tarif préférentiel',
    description:
      'Un tarif préférentiel peut s’appliquer pour les clients adhérents aux offices de tourisme partenaires, comme l’OT de Bergerac.',
  },
  {
    title: 'Plusieurs meublés',
    price: 'Tarif dégressif',
    description:
      'Un tarif dégressif peut être proposé lorsque plusieurs meublés sont à classer dans le même secteur.',
  },
];

const etoilysReasons = [
  {
    icon: Award,
    title: 'Des spécialistes du classement',
    description:
      'Le classement des meublés de tourisme est notre spécialité. Nous maîtrisons précisément le référentiel et vous aidons à comprendre les critères de la catégorie visée.',
  },
  {
    icon: ShieldCheck,
    title: 'Un organisme accrédité',
    description: (
      <>
        Organisme accrédité Cofrac Inspection n°3-2394 – portée disponible{' '}
        <a
          href={COFRAC_ACCREDITATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-300 underline hover:text-primary-400"
        >
          ici
        </a>
        .
      </>
    ),
  },
  {
    icon: FileCheck,
    title: 'Une demande simple',
    description:
      'Quelques informations sur le logement suffisent pour lancer la démarche. Etoilys organise ensuite la visite sans vous imposer un dossier administratif lourd.',
  },
  {
    icon: CalendarDays,
    title: 'Une intervention rapide',
    description:
      'Nous intervenons généralement sous deux semaines, et toujours dans un délai maximal d’un mois après votre demande.',
  },
  {
    icon: Sparkles,
    title: 'Des outils pour préparer votre catégorie',
    description:
      'Nos simulateurs et outils de suivi vous indiquent les critères à compléter pour viser la catégorie souhaitée et les justificatifs à transmettre lorsqu’un complément est possible.',
  },
];

export default function ClassementBergerac() {
  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden py-section text-white">
        <div className="absolute inset-0">
          <SmartImage
            assetKey="bergeracHero"
            alt="Vue de la Dordogne et du centre-ville de Bergerac en fin d’après-midi"
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Bergerac et le Bergeracois
            </p>
            <h1 className="mb-6 text-white">
              Classement de meublé de tourisme à Bergerac et dans le Bergeracois
            </h1>
            <p className="max-w-3xl text-xl leading-comfortable text-white/90">
              Vous souhaitez faire classer un gîte, une maison de vacances ou un appartement à
              Bergerac ? Etoilys réalise la visite officielle directement dans votre logement, avec
              des tarifs clairs et une intervention généralement sous deux semaines.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/demande-classement" variant="white" size="lg">
                Demander mon classement
              </Button>
              <Button href="/simulateur" variant="ghost" size="lg">
                Estimer la catégorie de mon logement
              </Button>
            </div>
            <p className="mt-6 max-w-2xl text-xs leading-comfortable text-white/75">
              Photo :{' '}
              <a
                href="https://commons.wikimedia.org/wiki/File:Bergerac_-_View_in_late_afternoon.jpg"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="underline hover:text-white"
              >
                Benjamin Smith / Wikimedia Commons
              </a>{' '}
              —{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="underline hover:text-white"
              >
                CC BY-SA 4.0
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-400">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Intervention locale
            </div>
            <h2 className="mb-5">Etoilys intervient à Bergerac et dans les communes proches</h2>
            <div className="space-y-5 text-textLight leading-comfortable">
              <p>
                Nous organisons des visites à Bergerac, Creysse, Prigonrieux, Monbazillac,
                Cours-de-Pile, Lembras, Mouleydier, La Force, Gardonne, Sigoulès-et-Flaugeac,
                Issigeac, Eymet et Lalinde.
              </p>
              <p>
                Cette liste est indicative et non exhaustive. Si votre commune n’apparaît pas,
                envoyez-nous simplement l’adresse du logement : nous vous confirmerons les
                prochaines possibilités d’intervention.
              </p>
              <p>
                Aucun frais de déplacement supplémentaire n’est ajouté pour une visite organisée
                dans le secteur habituel autour de Bergerac.
              </p>
            </div>
            <Link
              to="/classement-meuble-tourisme-dordogne"
              className="mt-6 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
            >
              Voir l’ensemble de nos interventions en Dordogne
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-center">
            <div>
              <h2 className="mb-5">À Bergerac, le classement peut réduire la taxe de séjour</h2>
              <div className="space-y-5 text-textLight leading-comfortable">
                <p>
                  Entre le centre historique, la Dordogne et les vignobles du Bergeracois, le
                  secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés
                  en location saisonnière. Le classement peut notamment changer la manière dont la
                  taxe de séjour est calculée.
                </p>
                <p>
                  À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix
                  de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par
                  personne, déterminé par son nombre d’étoiles.
                </p>
                <p>
                  Sur une réservation à 150 € la nuit pour quatre adultes, un meublé classé 2
                  étoiles permet par exemple de réduire la taxe de séjour de 3,48 € par nuit.
                </p>
              </div>
              <Button href="/simulateur-taxe-sejour" variant="primary" className="mt-6">
                Comparer la taxe de séjour de mon logement
              </Button>
            </div>

            <Card hover={false} className="overflow-hidden">
              <div className="bg-primary-400 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
                  Exemple à Bergerac
                </p>
                <p className="mt-2 text-2xl font-playfair font-semibold">
                  150 € la nuit · 4 adultes
                </p>
              </div>
              <div className="space-y-4 p-6">
                {taxComparison.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 rounded-card border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-xl font-bold text-primary-400">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-card border border-success-200 bg-success-100 p-5">
                  <p className="text-2xl font-bold text-success-500">
                    3,48 € de moins par nuit · soit environ –53 %
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Sur 7 nuits : 24,36 € de taxe de séjour en moins
                  </p>
                </div>
                <p className="text-xs leading-comfortable text-gray-500">
                  Tarifs 2026 de la Communauté d’agglomération Bergeracoise.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6">Comment faire classer votre meublé à Bergerac ?</h2>
            <p className="mb-8 text-textLight leading-comfortable">
              La démarche est simple : vous nous transmettez les informations principales, nous
              organisons la visite dans votre logement, puis Etoilys réalise le classement officiel.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {BERGERAC_PROCEDURE_STEPS.map((step) => (
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
            <Button href="/procedure" variant="secondary" className="mt-8">
              Découvrir la procédure complète
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-400">
              <Euro className="h-4 w-4" aria-hidden="true" />
              Tarifs
            </div>
            <h2 className="mb-5">Combien coûte le classement d’un meublé à Bergerac ?</h2>
            <p className="mb-8 max-w-4xl text-textLight leading-comfortable">
              Pour une visite de classement à Bergerac, le tarif se situe généralement entre 150 €
              et 250 € TTC. Le prix exact est confirmé avant tout engagement et dépend notamment du
              nombre de logements, de leur localisation et de la possibilité de regrouper les
              visites.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {tariffCards.map((tariff) => (
                <Card key={tariff.title} hover={false} className="p-6">
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    {tariff.title}
                  </h3>
                  <p className="mb-4 text-3xl font-bold text-primary-400">{tariff.price}</p>
                  <p className="text-sm text-textLight leading-comfortable">{tariff.description}</p>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-sm font-medium text-gray-900">
              Aucun frais de déplacement supplémentaire n’est ajouté dans le secteur habituel autour
              de Bergerac.
            </p>
            <Button href="/demande-classement" variant="primary" className="mt-6">
              Obtenir le tarif pour mon logement
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8">Pourquoi choisir Etoilys pour votre classement à Bergerac ?</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {etoilysReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <Card key={reason.title} hover={false} className="p-6">
                    <Icon className="mb-4 h-8 w-8 text-primary-300" aria-hidden="true" />
                    <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-textLight leading-comfortable">
                      {reason.description}
                    </p>
                  </Card>
                );
              })}
            </div>
            <Link
              to="/les-avantages-du-classement"
              className="mt-8 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
            >
              Comprendre les avantages du classement
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center">Questions fréquentes sur le classement à Bergerac</h2>
            <Accordion items={BERGERAC_FAQ} />
            <div className="mt-8 text-center">
              <Button href="/faq" variant="secondary">
                Consulter toutes les questions fréquentes
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-300 to-themePrimary-2 py-section text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">
            Vous souhaitez faire classer votre meublé à Bergerac ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl leading-comfortable text-white/90">
            Envoyez-nous l’adresse du logement et quelques informations. Nous vous confirmerons
            rapidement le tarif et les prochaines disponibilités dans le Bergeracois.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/demande-classement" variant="white" size="lg">
              Déposer ma demande de classement
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Poser une question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
