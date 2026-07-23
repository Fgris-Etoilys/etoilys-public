import { Link } from 'react-router-dom';
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Euro,
  FileCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Accordion from '../../components/ui/Accordion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';
import SmartImage from '../../components/ui/SmartImage';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import {
  BERGERAC_FAQ,
  BERGERAC_PROCEDURE_STEPS,
  BERGERAC_SERVICE_COMMUNES,
} from '../../content/localServiceAreas';

const taxComparison = [
  { label: 'Meublé non classé', value: '6,60 € par nuit' },
  { label: 'Meublé classé 2 étoiles', value: '3,12 € par nuit' },
];

const tariffCards = [
  {
    title: 'Tarif public',
    price: '240 € TTC',
  },
  {
    title: 'Adhérent à un office de tourisme partenaire',
    price: '200 € TTC',
  },
];

const multiPropertyTariffColumns = [
  {
    key: 'logement',
    label: 'Logement visité',
    widthClassName: 'w-3/5',
  },
  {
    key: 'tarif',
    label: 'Tarif TTC',
    widthClassName: 'w-2/5',
    align: 'right' as const,
  },
];

const multiPropertyTariffRows = [
  {
    key: 'first',
    cells: {
      logement: 'Premier logement',
      tarif: '240 €',
    },
  },
  {
    key: 'second',
    cells: {
      logement: 'Deuxième logement',
      tarif: '160 €',
    },
  },
  {
    key: 'third-and-next',
    cells: {
      logement: 'Troisième logement et suivants',
      tarif: '100 € par logement',
    },
  },
];

const etoilysPrimaryReason = {
  icon: Sparkles,
  title: 'Des outils pour atteindre plus facilement la catégorie visée',
  description:
    'Avant la visite, le simulateur Etoilys vous indique précisément les critères à compléter pour la catégorie demandée. Pendant le contrôle, l’inspecteur vous explique les éventuels points bloquants, puis son compte rendu détaille les équipements, ajustements ou justificatifs encore utiles pour atteindre le classement visé.',
};

const etoilysSecondaryReasons = [
  {
    icon: FileCheck,
    title: 'Une demande en 30 secondes, sans dossier complexe',
    description:
      'Quelques informations essentielles suffisent pour lancer votre demande. Vous n’avez aucun dossier technique à constituer ni relevé détaillé du logement à préparer : Etoilys organise la visite et prend en charge les documents et démarches administratives du classement.',
  },
  {
    icon: CalendarDays,
    title: 'Une intervention rapide',
    description:
      'La visite est organisée en moyenne sous deux semaines et toujours sous un mois après votre demande. La date d’intervention est fixée directement avec vous selon vos disponibilités.',
  },
  {
    icon: Award,
    title: '100 % spécialisés dans le classement',
    description:
      'Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos inspecteurs connaissent en profondeur la réglementation, la grille officielle et les points qui font réellement la différence pour atteindre la catégorie visée.',
  },
  {
    icon: ShieldCheck,
    title: 'Un organisme accrédité',
    description: (
      <>
        Etoilys est accrédité Cofrac Inspection n°3-2394 pour réaliser les visites officielles de
        classement des meublés de tourisme.{' '}
        <a
          href={COFRAC_ACCREDITATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-300 underline hover:text-primary-400"
        >
          Consulter la portée d’accréditation Cofrac
        </a>
        .
      </>
    ),
  },
];

export default function ClassementBergerac() {
  const PrimaryReasonIcon = etoilysPrimaryReason.icon;

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
              une démarche simple et des tarifs clairs.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/demande-classement" variant="white" size="lg">
                Demander mon classement
              </Button>
              <Button href="/simulateur" variant="ghost" size="lg">
                Estimer la catégorie de mon logement
              </Button>
            </div>
            <p className="mt-5 flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium leading-relaxed text-white/90">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 flex-shrink-0 text-success-200"
                  aria-hidden="true"
                />
                Demande en 30 secondes
              </span>
              <span aria-hidden="true" className="text-white/45">
                ·
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 flex-shrink-0 text-success-200"
                  aria-hidden="true"
                />
                Visite en moyenne sous deux semaines
              </span>
              <span aria-hidden="true" className="text-white/45">
                ·
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 flex-shrink-0 text-success-200"
                  aria-hidden="true"
                />
                Aucun frais de déplacement
              </span>
            </p>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <p className="container-adaptive text-xs leading-comfortable text-white/70">
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
                Etoilys organise des visites à Bergerac et dans l’ensemble du Bergeracois, notamment
                dans les communes suivantes :
              </p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BERGERAC_SERVICE_COMMUNES.map((commune) => (
                  <li
                    key={commune}
                    className="rounded-full border border-primary-200 bg-primary-100 px-4 py-2 text-sm font-medium text-primary-500"
                  >
                    {commune}
                  </li>
                ))}
              </ul>
              <p>
                Cette liste n’est pas exhaustive. Si votre commune n’apparaît pas, transmettez-nous
                simplement l’adresse du logement pour connaître les prochaines possibilités
                d’intervention.
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
                  en location saisonnière. Au-delà de ses avantages fiscaux et de la visibilité
                  qu’il peut apporter, le classement a aussi un effet concret sur la taxe de séjour
                  payée par vos voyageurs.
                </p>
                <p>
                  À Bergerac, un meublé non classé relève en 2026 d’un tarif proportionnel au prix
                  de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par
                  personne.
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
                    Pour les voyageurs, cela représente 24,36 € de taxe de séjour en moins sur une
                    semaine.
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
            <p className="mb-8 max-w-5xl text-textLight leading-comfortable">
              Les tarifs ci-dessous sont tout compris, sans frais de déplacement. Le montant
              applicable est confirmé avant tout engagement.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {tariffCards.map((tariff) => (
                <Card key={tariff.title} hover={false} className="p-6">
                  <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                    {tariff.title}
                  </h3>
                  <p className="mb-4 text-3xl font-bold text-primary-400">{tariff.price}</p>
                </Card>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-playfair font-semibold text-gray-900">
                Tarifs dégressifs pour plusieurs logements
              </h3>
              <ResponsiveComparisonTable
                columns={multiPropertyTariffColumns}
                rows={multiPropertyTariffRows}
                primaryColumnKey="logement"
                caption="Tarifs dégressifs Etoilys pour plusieurs logements"
                tableClassName="w-full table-fixed overflow-hidden rounded-card border border-gray-200 bg-white text-sm shadow-card"
                headerRowClassName="bg-primary-400 text-white"
                headerCellClassName="p-4 font-semibold"
                cellClassName="border-t border-gray-100 p-4 align-top"
                mobileCardClassName="rounded-card border border-gray-200 bg-white p-4 shadow-card"
                mobileTitleClassName="mb-3 text-base font-semibold text-gray-900"
                mobileValueClassName="text-base font-bold text-primary-400 text-right"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <Button href="/demande-classement" variant="primary">
                Demander mon classement
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8">Pourquoi choisir Etoilys pour votre classement à Bergerac ?</h2>
            <Card hover={false} className="mb-6 border-primary-200 bg-primary-100 p-8">
              <PrimaryReasonIcon className="mb-4 h-10 w-10 text-primary-400" aria-hidden="true" />
              <h3 className="mb-3 text-2xl font-playfair font-semibold text-gray-900">
                {etoilysPrimaryReason.title}
              </h3>
              <p className="max-w-5xl text-textLight leading-comfortable">
                {etoilysPrimaryReason.description}
              </p>
            </Card>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {etoilysSecondaryReasons.map((reason) => {
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
