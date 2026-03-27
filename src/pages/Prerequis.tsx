import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const criteresMinimums = [
  {
    title: 'Un vrai meublé de tourisme, et non un hébergement exclu du dispositif',
    paragraphs: [
      "Pour être classé en meublé de tourisme, le logement doit être un logement entier, meublé, loué à l'usage exclusif du locataire, à une clientèle de passage qui n'y élit pas domicile.",
      "Certains hébergements sont exclus du classement en meublé de tourisme, notamment les logements non indépendants, les hébergements légers ou mobiles, les logements pouvant être loués simultanément à plusieurs clients, ou encore les chambres d'hôtes.",
    ],
  },
  {
    title: 'Un logement propre, entretenu et sans dégradation manifeste',
    paragraphs: [
      "L'état général du logement compte énormément. Un logement sale, mal entretenu ou présentant des éléments dégradés compromet directement l'issue de la visite.",
      "Autrement dit, avant même d'entrer dans les détails de la grille, il faut que le logement présente une base saine : propreté réelle, équipements en état, sanitaires corrects, revêtements propres et literie convenable.",
    ],
  },
  {
    title: 'Des pièces réellement comptabilisables pour le classement',
    paragraphs: [
      "Toutes les zones du logement ne sont pas automatiquement comptées comme des pièces d'habitation. Pour être prise en compte, une pièce doit notamment disposer d'une surface suffisante, d'une hauteur adaptée et d'un ouvrant sur l'extérieur.",
      "À l'inverse, une cabine trop petite, un coin montagne ou un espace sans ouverture sur l'extérieur ne sont pas considérés comme de vraies pièces d'habitation pour le classement, et les couchages qui s'y trouvent ne sont pas comptabilisés dans la capacité d'accueil.",
    ],
  },
  {
    title: "Un logement qui respecte les conditions minimales d'habitabilité",
    paragraphs: [
      "Le logement doit respecter un socle minimum de confort et d'habitabilité. Concrètement, cela signifie notamment qu'il doit comprendre une pièce d'habitation, une cuisine ou un coin cuisine intérieur, une salle d'eau intérieure et des sanitaires intérieurs.",
      "La cuisine ou le coin cuisine doit être situé à l'intérieur du logement. La salle d'eau doit également être située à l'intérieur et être alimentée en eau chaude et en eau froide. En pratique, l'absence d'eau chaude ou la présence d'équipements de cuisine ou de sanitaires à l'extérieur rendent le classement impossible.",
    ],
  },
];

const pointsBloquants = [
  'une surface insuffisante par rapport à la catégorie visée ;',
  'des sanitaires non privatifs ou situés hors du logement ;',
  'un logement mal entretenu ou insuffisamment propre ;',
  'des couchages, du mobilier ou des équipements incohérents avec la capacité annoncée ;',
  "l'absence d'un prérequis bloquant ;",
  'une catégorie visée trop élevée par rapport aux caractéristiques réelles du logement.',
];

const checklistItems = [
  'vérifier la surface réelle du logement et la catégorie envisagée ;',
  "vérifier que les sanitaires sont bien situés à l'intérieur du logement ;",
  "contrôler l'état de la literie, du mobilier, de la cuisine et des sanitaires ;",
  "s'assurer que les équipements sont cohérents avec le nombre de personnes accueillies ;",
  'préparer les services annoncés aux voyageurs ;',
  'prévoir un logement propre, rangé et prêt le jour de la visite.',
];

export default function Prerequis() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Les prérequis au classement d'un meublé de tourisme</h1>
            <p className="text-xl text-white/90 leading-comfortable mb-5">
              Le classement n'est pas réservé aux biens haut de gamme. Il existe des critères
              minimums à respecter, mais beaucoup de meublés peuvent entrer dans la démarche dès
              lors qu'ils sont propres, fonctionnels, correctement équipés et adaptés à leur
              capacité d'accueil.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8">
              Le classement s'adresse à bien plus de meublés qu'on ne l'imagine
            </h2>
            <div className="space-y-5 text-textLight leading-comfortable mb-8">
              <p>
                Un meublé de tourisme est un logement meublé, loué à l'usage exclusif du locataire,
                à une clientèle de passage qui n'y élit pas domicile. Il peut s'agir d'une maison,
                d'un appartement ou d'un studio.
              </p>
              <p>
                Le classement officiel attribue de 1 à 5 étoiles selon une grille nationale. Il est
                donc tout à fait possible de viser un classement sans disposer d'un bien "de luxe".
              </p>
              <p>
                Le classement ne commence pas à 4 ou 5 étoiles : il commence à 1 étoile, avec un
                niveau simple mais conforme à un socle de confort, d'équipement et d'entretien.
              </p>
            </div>
            <div className="bg-primary-100 rounded-card p-6">
              <p className="text-gray-800 leading-comfortable">
                <span className="font-semibold">Un studio peut tout à fait être classé.</span> Pour
                un studio ou T1 de 1 à 2 personnes, la surface minimale de base démarre à 12 m² en 1
                étoile. Le prérequis bloquant sur un logement d'une seule pièce est de 9 m² si la
                cuisine est séparée, ou 12 m² avec coin cuisine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">
              Ce qu'il faut vraiment vérifier avant de demander le classement
            </h2>
            <p className="text-textLight leading-comfortable mb-10 text-center">
              Avant de parler d'étoiles, il faut d'abord vérifier que le logement peut réellement
              entrer dans la démarche. Le sujet n'est pas seulement d'avoir "assez d'équipements",
              mais d'avoir un logement qui correspond bien à la définition du meublé de tourisme,
              qui respecte les conditions minimales attendues et dont la capacité d'accueil est
              cohérente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {criteresMinimums.map((critere) => (
                <div key={critere.title} className="flex gap-3">
                  <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">{critere.title}</p>
                    <div className="space-y-2">
                      {critere.paragraphs.map((p, i) => (
                        <p key={i} className="text-sm text-textLight leading-comfortable">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-primary-200 rounded-card p-6 text-center">
              <p className="text-gray-800 leading-comfortable">
                En clair, avant de viser une catégorie, il faut d'abord vérifier quatre choses : que
                le logement entre bien dans la définition du meublé de tourisme, qu'il respecte les
                conditions minimales d'habitabilité, que sa surface et sa capacité d'accueil sont
                cohérentes, et qu'il est présenté dans un état{' '}
                <span className="font-semibold">propre et soigné.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Les points qui bloquent le plus souvent</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              Certains points reviennent souvent lorsqu'un logement n'est pas prêt pour une visite
              de classement ou lorsque la catégorie visée est trop ambitieuse.
            </p>
            <div className="bg-warning-100 border border-warning-200 rounded-card p-6 mb-6">
              <ul className="space-y-3">
                {pointsBloquants.map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-warning-500 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-800 leading-comfortable">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-textLight leading-comfortable text-center mb-6">
              Dans de nombreux cas, le sujet n'est pas que le logement soit "non classable", mais
              plutôt que la catégorie visée ne soit pas la bonne.
            </p>
            <div className="bg-success-100 border border-success-200 rounded-card p-6">
              <p className="text-gray-800 leading-comfortable">
                <span className="font-semibold">Bonne nouvelle :</span> à l'issue de la visite, les
                outils d'Etoilys indiquent directement à quel classement maximal le logement peut
                prétendre. La catégorie visée peut alors être modifiée en conséquence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-primary-100">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Checklist simple avant de demander la visite</h2>
            <p className="text-textLight leading-comfortable mb-8 text-center">
              Avant de planifier une visite, quelques vérifications simples permettent d'aborder la
              démarche plus sereinement.
            </p>
            <div className="bg-white rounded-card p-8 max-w-2xl mx-auto">
              <ul className="space-y-4">
                {checklistItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="text-success-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-800 leading-comfortable">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-gradient-to-br from-primary-300 to-themePrimary-2 text-white">
        <div className="container-adaptive text-center">
          <h2 className="mb-6 text-white">Quelles sont les étapes pour obtenir son classement ?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-comfortable">
            Une fois les prérequis réunis, la procédure de classement suit un déroulement précis en
            quelques étapes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/procedure" variant="ghost" size="lg">
              La procédure de classement
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
