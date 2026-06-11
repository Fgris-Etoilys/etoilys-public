import {
  CheckCircle,
  ClipboardCheck,
  GraduationCap,
  Laptop,
  MapPinned,
  Route,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SmartImage from '../components/ui/SmartImage';
import Timeline from '../components/ui/Timeline';

const missionSteps = [
  {
    number: 1,
    title: 'Développer votre réseau local',
    description:
      'Identifier de nouveaux partenaires, répondre aux sollicitations et mener des actions ciblées de prospection dans votre zone d’intervention.',
  },
  {
    number: 2,
    title: 'Organiser vos tournées d’inspection',
    description:
      'Planifier vos visites en lien avec les demandes reçues ou générées par vos actions terrain.',
  },
  {
    number: 3,
    title: 'Réaliser les visites sur site',
    description: 'Évaluer la conformité des meublés selon les critères de classement applicables.',
  },
  {
    number: 4,
    title: 'Échanger avec les propriétaires',
    description: 'Adopter une posture claire, neutre et pédagogique pendant la visite.',
  },
  {
    number: 5,
    title: 'Assurer le suivi des dossiers',
    description:
      'Suivre les corrections, les pièces complémentaires et les relances en lien avec les équipes Etoilys.',
  },
];

const profileQualities = [
  {
    label: 'Rigueur',
    text: 'vous avez le souci du détail et vous savez appliquer une méthode précise. Le classement repose sur des procédures strictes qui ne laissent pas de place aux approximations.',
  },
  {
    label: 'Organisation',
    text: 'vous savez gérer votre temps et planifier vos tâches de manière efficace.',
  },
  {
    label: 'Autonomie',
    text: 'vous savez prendre des initiatives et travailler de manière indépendante sans supervision constante.',
  },
  {
    label: 'Fibre commerciale',
    text: 'vous êtes à l’aise pour créer des contacts, développer un réseau local et nouer des relations solides avec les acteurs du tourisme.',
  },
];

const prerequisites = [
  'Formation Bac+2 minimum ou expérience professionnelle pertinente.',
  'Intérêt pour le tourisme, l’hébergement, l’immobilier ou la relation client.',
  'Permis B.',
  'Véhicule personnel.',
  'Statut indépendant ou volonté de le créer.',
  'Une expérience dans le classement, l’audit, le tourisme, l’immobilier ou la relation client est un vrai plus.',
];

const etoilysCards = [
  {
    icon: Laptop,
    title: 'Une application métier développée sur mesure',
    text: 'Etoilys vous fournit un outil pensé pour le terrain : contrats générés en un clic, grille de contrôle intuitive, niveau de classement visible en temps réel, critères bloquants identifiés automatiquement, contrôles anti-oubli et génération des documents de fin de dossier.',
  },
  {
    icon: Sparkles,
    title: 'Des demandes entrantes générées par notre visibilité',
    text: 'Etoilys investit dans sa visibilité pour générer des demandes de classement. Ces demandes vous sont transmises directement, en complément de votre prospection locale et de votre réseau terrain.',
  },
  {
    icon: GraduationCap,
    title: 'Une formation complète au métier',
    text: 'Avant vos premières missions, vous bénéficiez d’une formation complète au classement touristique : cadre général, grille d’évaluation, méthode de visite et bonnes pratiques terrain. L’objectif : vous donner les repères nécessaires pour démarrer dans de bonnes conditions.',
  },
  {
    icon: ClipboardCheck,
    title: 'Un cadre de collaboration clair',
    text: 'Vous intervenez dans un cadre structuré, basé sur la confiance, l’autonomie et la reconnaissance du travail bien fait.',
  },
  {
    icon: Route,
    title: 'Une liberté d’organisation réelle',
    text: 'Organisez vos journées comme vous le souhaitez, en choisissant librement vos horaires et en adaptant votre emploi du temps à vos préférences personnelles. Cette liberté vous permet de concilier vie professionnelle et personnelle tout en développant votre activité à votre propre rythme et selon vos ambitions.',
  },
  {
    icon: MapPinned,
    title: 'Une activité utile localement',
    text: 'Contribuez activement à la mise en avant du patrimoine touristique en accompagnant les propriétaires dans l’obtention des classements qu’ils méritent, renforçant ainsi l’attrait et la qualité de l’offre locale.',
  },
];

const onboardingSteps = [
  {
    number: 1,
    title: 'Premier échange en visio',
    description:
      'Un échange pour faire connaissance, comprendre votre projet et répondre à vos questions.',
  },
  {
    number: 2,
    title: 'Échange avec l’équipe Etoilys',
    description:
      'Un second temps pour valider l’adéquation avec le fonctionnement, les attentes terrain et le cadre de collaboration.',
  },
  {
    number: 3,
    title: 'Formation initiale',
    description:
      'Une formation en présentiel sur deux demi-journées pour vous transmettre les outils, la méthode et les bases du métier.',
  },
  {
    number: 4,
    title: 'Démarrage sur votre secteur',
    description:
      'Une fois formé, vous pouvez lancer votre activité et réaliser vos premières missions.',
  },
];

const faqItems = [
  {
    question: 'Faut-il déjà connaître le classement des meublés de tourisme ?',
    answer:
      'Non. Une formation initiale est prévue pour vous transmettre la méthode, les outils et les bases du classement. Une expérience dans le tourisme, l’audit, l’immobilier ou la relation client reste un vrai plus.',
  },
  {
    question: 'Je travaille déjà dans le secteur du classement : puis-je rejoindre Etoilys ?',
    answer:
      'Oui. Si vous connaissez déjà le classement des meublés de tourisme ou les métiers d’inspection, votre expérience peut être un vrai atout. L’échange permettra de vérifier votre secteur, votre cadre actuel et les conditions dans lesquelles une collaboration avec Etoilys peut être envisagée.',
  },
  {
    question: 'Dois-je trouver moi-même mes missions ?',
    answer:
      'La base de l’activité repose sur votre maillage local : développer des contacts, construire un réseau et créer des opportunités sur votre secteur. En parallèle, Etoilys investit dans sa visibilité pour générer des demandes de classement sur le territoire national et les transmettre directement à ses consultants.',
  },
  {
    question: 'Quelle zone puis-je couvrir ?',
    answer:
      'La zone est définie ensemble selon votre localisation, le potentiel local, les besoins Etoilys et votre capacité à organiser vos déplacements.',
  },
  {
    question: 'Comment fonctionne la rémunération ?',
    answer:
      'Votre rémunération est directement liée à votre activité : vous percevez un pourcentage du chiffre d’affaires généré par vos missions de classement. Une visite rapporte en moyenne autour de 100 €. En regroupant les visites sur une journée dédiée, un consultant peut généralement réaliser 4 à 6 classements, soit un potentiel d’environ 400 à 600 € sur la journée, selon le secteur, les tarifs et l’organisation de la tournée.',
  },
  {
    question: 'Que permet l’application métier Etoilys ?',
    answer: (
      <>
        <p>
          L’application Etoilys a été pensée pour simplifier tout le déroulement d’un dossier de
          classement. Elle permet de générer les contrats en un clic et de les envoyer
          automatiquement aux clients, puis de gérer facilement la visite, la grille de contrôle et
          le suivi du dossier.
        </p>
        <p className="mt-4">
          Le consultant peut visualiser en temps réel le niveau de classement atteignable par le
          logement, ainsi que les critères bloquants pour accéder à une catégorie supérieure. Des
          contrôles automatiques l’aident aussi à repérer les erreurs, oublis ou incohérences avant
          la finalisation du dossier.
        </p>
        <p className="mt-4">
          Après la visite, l’application permet de gérer les justificatifs transmis par le client,
          puis de générer et d’envoyer en un clic la facture et le certificat de visite. D’autres
          fonctionnalités sont également prévues pour continuer à simplifier le travail des
          consultants.
        </p>
      </>
    ),
  },
  {
    question: 'La formation est-elle obligatoire ?',
    answer: (
      <>
        <p>
          Oui. Elle permet de garantir une méthode homogène, une bonne utilisation des outils
          Etoilys et une qualité de visite cohérente sur l’ensemble du réseau.
        </p>
        <p className="mt-4">
          Si vous avez déjà de l’expérience dans le classement des meublés de tourisme, la formation
          est adaptée et raccourcie afin de se concentrer sur la méthode Etoilys, nos outils et nos
          attentes opérationnelles.
        </p>
      </>
    ),
  },
];

function SectionHeader({
  title,
  subtitle,
  className = '',
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto mb-12 max-w-3xl text-center ${className}`}>
      <h2 className="mb-4">{title}</h2>
      {subtitle && <p className="text-lg leading-comfortable text-textLight">{subtitle}</p>}
    </div>
  );
}

function IconCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card className="h-full p-6" hover={false}>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
          <Icon className="h-6 w-6 text-primary-300" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-playfair font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="leading-comfortable text-textLight">{text}</p>
    </Card>
  );
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Recrutement() {
  return (
    <>
      <section className="bg-gradient-to-br from-themePrimary-1 to-primary-300 py-section text-white">
        <div className="container-adaptive">
          <div className="max-w-5xl">
            <h1 className="mb-6 text-white">
              Rejoignez Etoilys comme consultant indépendant en classement de meublés de tourisme
            </h1>
            <p className="max-w-3xl text-xl leading-comfortable text-white/90">
              Réalisez des visites de classement dans votre région, évaluez des logements
              touristiques et accompagnez les propriétaires dans une démarche officielle, concrète
              et utile.
            </p>
            <div className="mt-8 flex">
              <Button
                href="#candidature"
                variant="white"
                size="lg"
                onClick={() => scrollToSection('candidature')}
              >
                Candidater
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:items-start">
            <div>
              <h2 className="mb-4">Qui sommes-nous ?</h2>
              <div className="space-y-5 text-gray-800">
                <p className="leading-comfortable">
                  Chez Etoilys, nous aidons les propriétaires de logements touristiques à faire
                  classer leur meublé de tourisme.
                </p>
                <p className="leading-comfortable">
                  Concrètement, nous parcourons les régions françaises pour évaluer les hébergements
                  sur place, selon la grille officielle de classement. Notre rôle est de vérifier
                  les critères applicables et d’attribuer à chaque meublé un classement de 1 à 5
                  étoiles.
                </p>
                <p className="leading-comfortable">
                  En mettant en avant la qualité des hébergements touristiques, nous contribuons
                  aussi à renforcer l’attractivité des territoires et à valoriser l’offre locale.
                </p>
                <p className="leading-comfortable">
                  Pour répondre à une demande croissante de classements et renforcer notre présence
                  sur le terrain, nous recherchons des consultants indépendants capables de réaliser
                  des visites de classement et d’accompagner les propriétaires tout au long du
                  processus.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-card shadow-card lg:max-w-[585px] lg:justify-self-end">
              <SmartImage
                assetKey="recrutementInspection"
                alt="Consultante Etoilys réalisant une visite de classement dans un hébergement touristique"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="role" className="bg-primary-100 py-section scroll-mt-24">
        <div className="container-adaptive">
          <SectionHeader
            title="Votre rôle comme consultant Etoilys"
            subtitle="Devenir le relais local d’Etoilys sur votre secteur."
          />
          <div className="mx-auto max-w-4xl space-y-5 text-center text-gray-800">
            <p className="leading-comfortable">
              En tant que consultant indépendant en classement de meublés de tourisme, vous
              développez votre activité sur un secteur défini ensemble, au plus près des
              propriétaires et des acteurs touristiques locaux.
            </p>
            <p className="leading-comfortable">
              Sur le terrain, vous représentez Etoilys : vous identifiez les opportunités,
              construisez votre réseau, réalisez les visites de classement avec méthode et
              accompagnez les propriétaires avec clarté et professionnalisme.
            </p>
          </div>
        </div>
      </section>

      <section id="missions" className="bg-white py-section scroll-mt-24">
        <div className="container-adaptive">
          <SectionHeader
            title="Vos missions"
            subtitle="Vous assurez l’ensemble du processus de classement, de la prospection à la finalisation du dossier, dans une logique de qualité, d’autonomie et de proximité."
          />
          <div className="mx-auto max-w-4xl">
            <Timeline steps={missionSteps} />
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <SectionHeader
            title="Le profil que nous recherchons"
            subtitle="Un profil autonome, rigoureux et à l’aise sur le terrain."
          />
          <p className="mx-auto mb-10 max-w-4xl text-center leading-comfortable text-gray-800">
            Ce rôle peut vous convenir si vous aimez le terrain, les échanges avec les
            propriétaires, le travail précis et l’autonomie. Il demande à la fois de la méthode, un
            bon relationnel et une vraie capacité à développer un réseau local.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6" hover={false}>
              <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                Les qualités attendues
              </h3>
              <ul className="space-y-4">
                {profileQualities.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-400"
                      aria-hidden="true"
                    />
                    <span className="leading-comfortable text-gray-800">
                      <strong className="font-semibold text-gray-900">{item.label} :</strong>{' '}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6" hover={false}>
              <h3 className="mb-6 text-2xl font-playfair font-semibold text-gray-900">
                Les prérequis
              </h3>
              <ul className="space-y-4">
                {prerequisites.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-300"
                      aria-hidden="true"
                    />
                    <span className="leading-comfortable text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <SectionHeader
            title="Ce que vous trouverez chez Etoilys"
            subtitle="Des outils, de la visibilité et un cadre pensé pour développer votre activité."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {etoilysCards.map((card) => (
              <IconCard key={card.title} icon={card.icon} title={card.title} text={card.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-100 py-section">
        <div className="container-adaptive">
          <SectionHeader
            title="Comment se passe l’intégration ?"
            subtitle="Un parcours simple pour vérifier l’adéquation, se former puis démarrer sur votre secteur."
          />
          <div className="mx-auto max-w-4xl">
            <Timeline steps={onboardingSteps} />
          </div>
        </div>
      </section>

      <section className="bg-white py-section">
        <div className="container-adaptive">
          <SectionHeader title="Questions fréquentes" className="mb-8" />
          <div className="mx-auto max-w-3xl">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      <section id="candidature" className="bg-primary-100 py-section scroll-mt-24">
        <div className="container-adaptive">
          <div className="rounded-card bg-gradient-to-br from-themePrimary-1 to-primary-300 px-6 py-10 text-center text-white shadow-[0_18px_45px_rgba(1,50,176,0.16)] sm:px-10 lg:px-16">
            <h2 className="mb-6 text-white">
              Vous souhaitez développer votre activité avec Etoilys ?
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg leading-comfortable text-white/90">
              Présentez-nous votre profil, votre secteur et votre expérience. Nous reviendrons vers
              vous pour échanger sur le cadre de collaboration et les prochaines étapes.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/contact?objet=recrutement" variant="white" size="lg">
                Candidater
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
