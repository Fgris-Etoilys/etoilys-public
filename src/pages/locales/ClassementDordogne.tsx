import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  MapPin,
  ShieldCheck,
  Star,
  Calculator,
  Receipt,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SmartImage from '../../components/ui/SmartImage';
import PageHero from '../../components/ui/PageHero';
import EditorialHeroMedia from '../../components/ui/EditorialHeroMedia';
import ClassificationHeroNote from '../../components/ui/ClassificationHeroNote';
import HeroReassurance from '../../components/ui/HeroReassurance';
import ProofStrip from '../../components/ui/ProofStrip';
import FeatureCard from '../../components/ui/FeatureCard';
import Timeline from '../../components/ui/Timeline';
import Accordion from '../../components/ui/Accordion';
import PageCta from '../../components/ui/PageCta';
import DepartmentPricingSection from '../../components/local/DepartmentPricingSection';
import { LocalDepartmentServiceAreaSection } from '../../components/local/LocalLandingSections';
import { COFRAC_ACCREDITATION_URL } from '../../content/accreditationLinks';
import { DORDOGNE_DEPARTMENT_PAGE } from '../../content/local/departments/dordogne';
import { getSeoRouteConfig } from '../../content/seoRoutes';

const heroImageSizes =
  getSeoRouteConfig('/classement-meuble-tourisme-dordogne').lcpImageSizes ?? '100vw';
const officialClassificationUrl =
  'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme';

const heroReassurance = [
  'Rappel sous 24 h ouvrées',
  'Visite en moyenne sous deux semaines',
  'Aucun frais de déplacement',
] as const;

const processSteps = [
  {
    number: 1,
    title: 'Vous nous parlez de votre logement.',
    description:
      'Envoyez vos coordonnées et l’adresse du meublé. Nous vous rappelons sous 24 h ouvrées pour préciser votre projet.',
  },
  {
    number: 2,
    title: 'Nous préparons la visite ensemble.',
    description:
      'Nous confirmons le tarif et les modalités, puis convenons d’une date. La visite a lieu en moyenne sous deux semaines.',
  },
  {
    number: 3,
    title: 'Votre logement est évalué sur place.',
    description:
      'Après le contrôle selon la grille officielle, vous recevez les documents et la proposition de classement.',
  },
] as const;

const questions = [
  {
    question: 'Intervenez-vous dans ma commune en Dordogne ?',
    answer: (
      <>
        Nous couvrons les sept secteurs présentés sur cette page, du Bergeracois au Périgord Noir,
        ainsi que le Grand Périgueux, la vallée de l’Isle et le Ribéracois. Consultez les{' '}
        <a href="#communes">communes de nos secteurs</a> ou indiquez votre adresse dans votre
        demande pour confirmer notre intervention.
      </>
    ),
  },
  {
    question: 'Quel est le prix d’une visite de classement ?',
    answer: (
      <>
        Sélectionnez votre commune dans le <a href="#tarifs">calculateur de tarif</a>. Le prix
        inclut la visite et les documents de classement, sans frais de déplacement. Nous confirmons
        les modalités avant tout engagement.
      </>
    ),
  },
  {
    question: 'Sous quel délai pouvez-vous réaliser la visite ?',
    answer: (
      <>
        Nous vous rappelons sous 24 h ouvrées après votre demande. La visite a lieu en moyenne sous
        deux semaines, à une date convenue ensemble selon les disponibilités.
      </>
    ),
  },
  {
    question: 'Proposez-vous un tarif pour plusieurs meublés ?',
    answer: (
      <>
        Oui, des tarifs dégressifs s’appliquent pour plusieurs meublés visités le même jour dans le
        même secteur. Précisez le nombre de logements dans votre demande : nous vous confirmons le
        tarif adapté.
      </>
    ),
  },
  {
    question: 'Etoilys est-il accrédité pour réaliser le classement ?',
    answer: (
      <>
        Oui. Etoilys est un organisme d’inspection accrédité Cofrac sous le numéro 3-2394. La visite
        suit le référentiel officiel des meublés de tourisme.{' '}
        <a href={COFRAC_ACCREDITATION_URL} target="_blank" rel="noopener noreferrer">
          Consulter notre portée d’accréditation.
        </a>
      </>
    ),
  },
  {
    question: 'Mon gîte ou mon logement proposé sur Airbnb peut-il être classé ?',
    answer: (
      <>
        Maison de vacances, gîte rural, studio ou appartement : le classement concerne les meublés
        de tourisme, quelle que soit la plateforme de réservation utilisée. Les critères dépendent
        de la capacité, des équipements et de la catégorie visée.{' '}
        <Link to="/prerequis-au-classement">Consulter les prérequis.</Link>
      </>
    ),
  },
  {
    question: 'Comment choisir le nombre d’étoiles à demander ?',
    answer: (
      <>
        Notre <Link to="/simulateur">simulateur de classement</Link> vous aide à repérer les
        critères de la catégorie envisagée. Son résultat est indicatif : seule la visite officielle
        permet d’évaluer le logement. Vous pouvez aussi nous expliquer votre projet dès la demande.
      </>
    ),
  },
  {
    question: 'Et si mon logement ne remplit pas tous les critères ?',
    answer: (
      <>
        L’inspecteur vous explique les points constatés. Selon le critère et ce que permet le
        référentiel, certains justificatifs ou compléments peuvent être transmis après la visite. La
        catégorie demandée n’est jamais garantie à l’avance.
      </>
    ),
  },
  {
    question: 'Le classement est-il obligatoire ? Combien de temps dure-t-il ?',
    answer: (
      <>
        Le classement est volontaire et valable cinq ans une fois acquis. Il ne remplace pas les
        formalités de déclaration ou d’enregistrement applicables à votre location.{' '}
        <a href={officialClassificationUrl} target="_blank" rel="noopener noreferrer">
          Voir le cadre officiel.
        </a>
      </>
    ),
  },
];

export default function ClassementDordogne() {
  return (
    <div className="dd-landing">
      <PageHero
        eyebrow="Propriétaires en Dordogne"
        eyebrowMarked
        title={
          <>
            Classement de gîtes et meublés de tourisme{' '}
            <span className="text-copper">en Dordogne</span>
          </>
        }
        description="Faites classer votre gîte, maison ou appartement de 1 à 5 étoiles avec Etoilys, organisme accrédité Cofrac. Nous réalisons la visite officielle dans votre logement."
        media={
          <EditorialHeroMedia
            assetKey="dordogneLaRoqueGageac"
            alt="Les maisons de pierre de La Roque-Gageac au bord de la Dordogne"
            priority
            sizes={heroImageSizes}
            imageClassName="h-full w-full object-cover object-[38%_center] max-[680px]:object-[center_48%]"
            caption={
              <>
                <MapPin size={14} aria-hidden="true" /> La Roque-Gageac, Dordogne
              </>
            }
            note={
              <ClassificationHeroNote
                title="Un classement de 1 à 5 étoiles"
                description="Du studio au grand gîte, un repère de qualité pour vos voyageurs."
              />
            }
            index="24 / LE PÉRIGORD"
          />
        }
      >
        <div className="flex flex-col items-start gap-3">
          <Button href="/demande-classement" size="lg" className="editorial-hero-cta">
            Demander mon classement <ArrowUpRight size={20} aria-hidden="true" />
          </Button>
          <a href="#department-pricing-locality" className="editorial-link ui-focus dd-hero-price">
            Connaître mon tarif <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <HeroReassurance items={heroReassurance} />
      </PageHero>

      <ProofStrip
        items={[
          {
            icon: ShieldCheck,
            title: 'Organisme accrédité',
            link: {
              href: COFRAC_ACCREDITATION_URL,
              label: 'Cofrac Inspection n° 3-2394',
            },
          },
          {
            value: '5',
            title: 'ans de validité',
            description: 'Une fois le classement acquis',
          },
          {
            icon: MapPin,
            title: 'Une équipe qui connaît votre secteur',
            description: 'À votre écoute, réactive à chaque étape.',
          },
        ]}
      />

      <section
        id="le-classement"
        className="editorial-section container-editorial dd-benefits"
        aria-labelledby="dd-benefits-title"
      >
        <div className="dd-section-intro">
          <p className="editorial-eyebrow">LE CLASSEMENT, POUR VOUS</p>
          <h2 className="editorial-heading" id="dd-benefits-title">
            Pourquoi faire classer votre meublé de tourisme ?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Calculator}
            title="Une fiscalité micro-BIC plus favorable"
            description="Profitez d’un abattement fiscal plus élevé et d’un plafond de recettes supérieur à ceux d’un meublé non classé."
            linkHref="/simulateur-fiscal-classement"
            linkLabel="Sous conditions : estimer mon avantage"
          />
          <FeatureCard
            icon={Receipt}
            title="Une taxe de séjour maîtrisée"
            description="Un tarif fixé selon vos étoiles, indépendant du prix de la nuitée. Une taxe qui peut être moins élevée pour vos voyageurs, selon le barème local."
            linkHref="/simulateur-taxe-sejour"
            linkLabel="Comparer pour ma location"
          />
          <FeatureCard
            icon={Star}
            title="Un repère officiel de qualité"
            description="Des étoiles reconnues pour valoriser votre logement et rassurer vos voyageurs."
            linkHref="/les-avantages-du-classement"
            linkLabel="Découvrir les avantages du classement"
          />
        </div>
      </section>

      {DORDOGNE_DEPARTMENT_PAGE.serviceArea && (
        <div id="communes" className="dd-service-area">
          <div className="container-editorial">
            <LocalDepartmentServiceAreaSection
              serviceArea={{
                ...DORDOGNE_DEPARTMENT_PAGE.serviceArea,
                title: 'Dans quelles communes de Dordogne intervenons-nous ?',
              }}
            />
          </div>
          <div className="container-editorial">
            <Link to="/zones-intervention" className="editorial-link ui-focus">
              Voir toutes nos zones d’intervention <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      <section
        id="tarifs"
        className="editorial-section container-editorial dd-tariff-section"
        aria-labelledby="dd-tariff-title"
      >
        <div className="dd-tariff-copy">
          <p className="editorial-eyebrow">VOTRE LOGEMENT, VOTRE TARIF</p>
          <h2 className="editorial-heading" id="dd-tariff-title">
            Quel tarif pour classer votre meublé en Dordogne ?
          </h2>
          <p>
            Indiquez la commune de votre logement pour consulter le tarif prévu. Nous confirmons
            ensuite les modalités et la possibilité d’intervenir à votre adresse.
          </p>
          <ul className="dd-checks">
            <li>
              <Check size={18} aria-hidden="true" />
              <span>
                Aucun frais de déplacement : la visite et les documents de classement sont inclus.
              </span>
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              <span>
                Des tarifs dégressifs pour plusieurs meublés visités le même jour dans le même
                secteur.
              </span>
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              <span>
                Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles
                demandée.
              </span>
            </li>
          </ul>
          <Link to="/procedure" className="editorial-link ui-focus">
            Les modalités de la visite <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {DORDOGNE_DEPARTMENT_PAGE.pricing && (
          <DepartmentPricingSection config={DORDOGNE_DEPARTMENT_PAGE.pricing} variant="dordogne" />
        )}
      </section>

      <section id="etapes" className="dd-process" aria-labelledby="dd-process-title">
        <div className="container-editorial">
          <div className="dd-process-heading">
            <div>
              <p className="editorial-eyebrow">DE LA DEMANDE AUX ÉTOILES</p>
              <h2 className="editorial-heading" id="dd-process-title">
                Votre classement en trois étapes
              </h2>
            </div>
            <Link to="/procedure" className="editorial-link ui-focus">
              La procédure en détail <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <Timeline layout="horizontal" steps={processSteps} />
          <p className="dd-process-note">
            Nos inspecteurs vous accompagnent à chaque étape, de votre demande à la remise des
            documents de classement.
          </p>
        </div>
      </section>

      <section className="dd-expertise bg-surface-hover" aria-labelledby="dd-expertise-title">
        <div className="container-editorial editorial-media-split">
          <figure className="editorial-expertise-photo dd-stone-photo">
            <SmartImage
              assetKey="dordogneLandscape"
              alt="Architecture de pierre et végétation dans un village du Périgord"
              sizes="(min-width: 900px) 35vw, 100vw"
              className="h-full w-full object-cover object-[center_55%] max-[680px]:object-[center_40%]"
            />
            <figcaption>Les pierres du Périgord.</figcaption>
          </figure>
          <div className="dd-expertise-copy">
            <h2 className="editorial-heading" id="dd-expertise-title">
              Pourquoi choisir Etoilys pour votre classement ?
            </h2>
            <ul className="dd-expertise-arguments">
              <li>
                <Star size={23} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <h3>100 % spécialisés dans le classement des meublés de tourisme</h3>
                  <p>
                    Etoilys se consacre exclusivement au classement des meublés de tourisme. Nos
                    inspecteurs connaissent en profondeur la réglementation, la grille officielle et
                    les points qui font réellement la différence pour atteindre la catégorie visée.
                  </p>
                </div>
              </li>
              <li>
                <Calculator size={23} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <h3>Des outils pour préparer votre visite</h3>
                  <p>
                    Notre simulateur vous aide à estimer la catégorie visée et à repérer les points
                    à préparer.
                  </p>
                  <Link to="/simulateur" className="editorial-link ui-focus">
                    Estimer mon classement <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </li>
              <li>
                <ShieldCheck size={23} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <h3>Un organisme accrédité Cofrac</h3>
                  <p>
                    Etoilys réalise les visites officielles de classement dans le cadre de son
                    accréditation Cofrac Inspection n° 3-2394.
                  </p>
                  <a
                    href={COFRAC_ACCREDITATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link ui-focus"
                  >
                    Consulter notre accréditation <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        className="editorial-section container-editorial dd-faq"
        aria-labelledby="dd-faq-title"
      >
        <div>
          <p className="editorial-eyebrow">AVANT DE VOUS LANCER</p>
          <h2 className="editorial-heading" id="dd-faq-title">
            Questions fréquentes sur le classement en Dordogne
          </h2>
          <p>Un point particulier sur votre logement ?</p>
          <Link to="/contact" className="editorial-link ui-focus">
            Parlons-en <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="dd-faq-list">
          <Accordion items={questions} density="compact" />
        </div>
      </section>

      <PageCta
        density="compact"
        eyebrow="À VOUS DE JOUER"
        title="Demandez le classement de votre meublé en Dordogne"
        description="Parlez-nous de votre projet. Rappel sous 24 h ouvrées, visite en moyenne sous deux semaines."
      >
        <Button
          href="/demande-classement"
          size="lg"
          variant="secondary"
          className="editorial-inverse-button editorial-hero-cta"
        >
          Demander mon classement <ArrowRight size={20} aria-hidden="true" />
        </Button>
        <span className="text-center text-xs text-white/75">
          Tarif confirmé avant tout engagement.
        </span>
      </PageCta>
    </div>
  );
}
