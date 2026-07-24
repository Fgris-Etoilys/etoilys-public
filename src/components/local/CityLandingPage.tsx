import type { ReactNode } from 'react';
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
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ResponsiveComparisonTable from '../ui/ResponsiveComparisonTable';
import SmartImage from '../ui/SmartImage';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import type { CityLandingPageConfig } from '../../content/cityLandingPages';

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

function renderFaqAnswer(answer: string): ReactNode {
  const linkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match = linkPattern.exec(answer);

  while (match !== null) {
    const [rawMatch, label, href] = match;

    if (label === undefined || href === undefined) {
      match = linkPattern.exec(answer);
      continue;
    }

    if (match.index > lastIndex) {
      parts.push(answer.slice(lastIndex, match.index));
    }

    parts.push(
      <Link
        key={`${href}-${match.index}`}
        to={href}
        className="font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400"
      >
        {label}
      </Link>
    );

    lastIndex = match.index + rawMatch.length;
    match = linkPattern.exec(answer);
  }

  if (parts.length === 0) {
    return answer;
  }

  if (lastIndex < answer.length) {
    parts.push(answer.slice(lastIndex));
  }

  return <>{parts}</>;
}

interface CityLandingPageProps {
  config: CityLandingPageConfig;
}

export default function CityLandingPage({ config }: CityLandingPageProps) {
  const PrimaryReasonIcon = etoilysPrimaryReason.icon;
  const faqItems = config.faq.items.map((item) => ({
    ...item,
    answer: renderFaqAnswer(item.answer),
  }));

  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden py-section text-white">
        <div className="absolute inset-0">
          <SmartImage
            assetKey={config.hero.assetKey}
            alt={config.hero.alt}
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              {config.hero.eyebrow}
            </p>
            <h1 className="mb-6 text-white">{config.hero.h1}</h1>
            <p className="max-w-3xl text-xl leading-comfortable text-white/90">
              {config.hero.intro}
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
              href={config.hero.credit.sourceHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline hover:text-white"
            >
              {config.hero.credit.sourceLabel}
            </a>{' '}
            —{' '}
            <a
              href={config.hero.credit.licenseHref}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline hover:text-white"
            >
              {config.hero.credit.licenseLabel}
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
            <h2 className="mb-5">{config.serviceArea.title}</h2>
            <div className="space-y-5 text-textLight leading-comfortable">
              <p>{config.serviceArea.intro}</p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {config.serviceArea.communes.map((commune) => (
                  <li
                    key={commune}
                    className="rounded-full border border-primary-200 bg-primary-100 px-4 py-2 text-sm font-medium text-primary-500"
                  >
                    {commune}
                  </li>
                ))}
              </ul>
              {config.serviceArea.outro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              to={config.serviceArea.parentLink.href}
              className="mt-6 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
            >
              {config.serviceArea.parentLink.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-center">
            <div>
              <h2 className="mb-5">{config.tax.title}</h2>
              <div className="space-y-5 text-textLight leading-comfortable">
                {config.tax.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Button
                href="/simulateur-taxe-sejour"
                variant="primary"
                className="mt-6 hidden lg:inline-flex"
              >
                Comparer la taxe de séjour de mon logement
              </Button>
            </div>

            <div>
              <Card hover={false} className="overflow-hidden">
                <div className="bg-primary-400 p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
                    {config.tax.exampleLabel}
                  </p>
                  <p className="mt-2 text-2xl font-playfair font-semibold">
                    {config.tax.exampleTitle}
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  {config.tax.comparison.map((item) => (
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
                      {config.tax.savingsHeadline}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {config.tax.savingsDetail}
                    </p>
                  </div>
                  <p className="text-xs leading-comfortable text-gray-500">
                    {config.tax.sourceNote}
                  </p>
                </div>
              </Card>
              <Button href="/simulateur-taxe-sejour" variant="primary" className="mt-6 lg:hidden">
                Comparer la taxe de séjour de mon logement
              </Button>
            </div>
          </div>
        </div>
      </section>

      {config.localWarning && (
        <section className="bg-white py-section">
          <div className="container-adaptive">
            <div className="mx-auto max-w-5xl">
              <Card hover={false} className="border-warning-200 bg-warning-100 p-6 md:p-8">
                <h2 className="mb-5 text-h3">{config.localWarning.title}</h2>
                <div className="space-y-5 text-textLight leading-comfortable">
                  {config.localWarning.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {config.localWarning.source && (
                  <a
                    href={config.localWarning.source.href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="mt-5 inline-flex text-sm font-medium text-primary-300 underline hover:text-primary-400"
                  >
                    {config.localWarning.source.label}
                  </a>
                )}
              </Card>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6">{config.procedure.title}</h2>
            <p className="mb-8 text-textLight leading-comfortable">{config.procedure.intro}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {config.procedure.steps.map((step) => (
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
            <h2 className="mb-5">Combien coûte le classement d’un meublé à {config.city} ?</h2>
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
                Tarifs dégressifs pour plusieurs logements sur le même secteur
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
            <h2 className="mb-8">
              Pourquoi choisir Etoilys pour votre classement à {config.city} ?
            </h2>
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
            <h2 className="mb-8 text-center">{config.faq.title}</h2>
            <Accordion items={faqItems} />
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
          <h2 className="mb-6 text-white">{config.finalCta.title}</h2>
          <div className="mx-auto mb-8 max-w-2xl space-y-5 text-xl leading-comfortable text-white/90">
            {config.finalCta.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
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
