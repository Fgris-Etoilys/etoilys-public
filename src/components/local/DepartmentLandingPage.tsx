import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck } from 'lucide-react';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FeatureCard from '../ui/FeatureCard';
import SmartImage from '../ui/SmartImage';
import { renderLocalMarkdownLinks } from './renderLocalMarkdownLinks';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import type { DepartmentLandingPageConfig } from '../../content/local/types';

interface DepartmentLandingPageProps {
  config: DepartmentLandingPageConfig;
}

export default function DepartmentLandingPage({ config }: DepartmentLandingPageProps) {
  const faqItems = config.faq.items.map((item) => ({
    ...item,
    answer: renderLocalMarkdownLinks(item.answer),
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
            className={config.hero.imageClassName}
          />
          <div className={config.hero.overlayClassName} />
        </div>
        <div className="container-adaptive relative flex min-h-[560px] items-center">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              {config.hero.eyebrow}
            </p>
            <h1 className="mb-6 text-white">{config.hero.h1}</h1>
            <div className="max-w-3xl space-y-5 text-xl leading-comfortable text-white/90">
              {config.hero.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
              <h2 className="mb-6 text-gray-900">{config.benefits.title}</h2>
              {config.benefits.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? undefined : 'mt-5'}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {config.benefits.items.map((benefit) => (
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
                <p>{config.benefits.cofracDescription}</p>
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
            <h2 className="mb-6">{config.tourism.title}</h2>
            <div className="mb-8 space-y-5 text-textLight leading-comfortable">
              {config.tourism.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
              <SmartImage
                assetKey={config.tourism.image.assetKey}
                alt={config.tourism.image.alt}
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-full min-h-[420px] w-full rounded-card object-cover shadow-card-hover"
              />

              <Card hover={false} className="p-6">
                <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                  {config.tourism.cardTitle}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {config.tourism.rows.map((row) => (
                    <div key={row.key} className="rounded-card bg-white p-5 shadow-sm">
                      <p className="mb-1 text-3xl font-bold text-primary-300">{row.value}</p>
                      <p className="text-sm leading-comfortable text-textLight">{row.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">{config.tourism.sourceNote}</p>
              </Card>
            </div>

            <div className="mt-8 space-y-5 text-textLight leading-comfortable">
              <h3 className="text-2xl font-playfair font-semibold text-gray-900">
                {config.tourism.afterTitle}
              </h3>
              {config.tourism.afterParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
              <h2 className="mb-5">{config.serviceArea.title}</h2>
              <p className="text-textLight leading-comfortable">{config.serviceArea.intro}</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {config.serviceArea.sectors.map((sector) => {
                const sectorLink = config.serviceArea.sectorLinks?.[sector.name];

                return (
                  <Card key={sector.name} hover={false} className="p-6 md:last:col-span-2">
                    <h3 className="mb-3 text-xl font-playfair font-semibold text-gray-900">
                      {sector.name}
                    </h3>
                    <p className="text-sm text-textLight leading-comfortable">
                      {sector.communes.join(', ')}.
                    </p>
                    {sectorLink && (
                      <Link
                        to={sectorLink.href}
                        className="mt-4 inline-flex text-sm font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400"
                      >
                        {sectorLink.label}
                      </Link>
                    )}
                  </Card>
                );
              })}
            </div>

            <p className="mt-8 max-w-4xl text-sm text-textLight leading-comfortable">
              {config.serviceArea.outro}
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

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6">{config.procedure.title}</h2>
            <p className="mb-8 text-textLight leading-comfortable">{config.procedure.intro}</p>
            <SmartImage
              assetKey={config.procedure.image.assetKey}
              alt={config.procedure.image.alt}
              sizes="(min-width: 1024px) 960px, 100vw"
              className="mb-10 aspect-[16/7] w-full rounded-card object-cover shadow-card-hover"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-8 rounded-card bg-white p-6 shadow-card">
              <h3 className="mb-3 text-2xl font-playfair font-semibold text-gray-900">
                {config.procedure.simulatorPrompt.title}
              </h3>
              <p className="mb-5 text-textLight leading-comfortable">
                {config.procedure.simulatorPrompt.description}
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
            <h2 className="mb-6">{config.tariff.title}</h2>
            <Card hover={false} className="p-8">
              <div className="space-y-5 text-textLight leading-comfortable">
                {config.tariff.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
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

      <section className={config.faq.sectionClassName}>
        <div className="container-adaptive">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center">{config.faq.title}</h2>
            <Accordion items={faqItems} />
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
              {config.sources.map((source) => (
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
