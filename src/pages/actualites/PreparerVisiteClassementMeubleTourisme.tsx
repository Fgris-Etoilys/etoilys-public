import { Link } from 'react-router-dom';
import ArticleHeaderMeta from '../../components/ui/ArticleHeaderMeta';
import Button from '../../components/ui/Button';
import ResponsiveComparisonTable from '../../components/ui/ResponsiveComparisonTable';

const REFERENTIEL_URL =
  'https://www.atout-france.fr/sites/default/files/2025-12/R%C3%A9f%C3%A9rentiel%20de%20classement%20des%20meubl%C3%A9s%20de%20tourisme%202022%20V2.pdf';
const GUIDE_CONTROLE_URL =
  'https://www.atout-france.fr/sites/default/files/2026-01/Guide%20de%20contr%C3%B4le%20-%20Meubl%C3%A9%20de%20tourisme.pdf';

const keyTakeaways = [
  'Les 133 critères ne sont pas tous obligatoires pour toutes les catégories.',
  'La catégorie demandée et la capacité d’accueil déterminent une partie des exigences applicables.',
  'Il faut atteindre au moins 95 % des points obligatoires, ainsi qu’un quota de points à la carte.',
  'Certains critères obligatoires non compensables doivent impérativement être validés.',
];

const dishes = [
  '2 verres à eau ;',
  '1 verre à vin ;',
  '2 assiettes plates ;',
  '2 assiettes creuses ;',
  '2 assiettes à dessert ;',
  '2 grandes cuillères ;',
  '2 petites cuillères ;',
  '2 couteaux ;',
  '2 fourchettes ;',
  '2 bols ;',
  '2 tasses ou mugs.',
];

const checklist = [
  'La catégorie demandée est-elle cohérente avec le niveau d’équipement du logement ?',
  'La capacité déclarée correspond-elle aux couchages réellement présents ?',
  'Les places à table et dans le salon correspondent-elles aux exigences liées à cette capacité ?',
  'Les quantités de vaisselle prévues par le critère 63 sont-elles respectées ?',
  'La vaisselle forme-t-elle des ensembles cohérents ?',
  'Tous les éléments du critère 65 sont-ils présents ?',
  'Les équipements sont-ils accessibles et fonctionnels ?',
  'Au moins cinq supports d’information touristique sont-ils disponibles, dont trois en langue étrangère ou bilingues ?',
  'Les services proposés aux voyageurs sont-ils indiqués par écrit ?',
  'L’accessibilité ou la non-accessibilité du logement est-elle précisée ?',
  'Une information simple sensibilise-t-elle les voyageurs au respect de l’environnement ?',
  'Le logement est-il propre, entretenu et présenté comme il le serait pour accueillir des voyageurs ?',
];

const officialSources = [
  {
    label: 'Atout France — Meublé de tourisme',
    url: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
  {
    label: 'Atout France — Référentiel de classement des meublés de tourisme 2022',
    url: REFERENTIEL_URL,
  },
  {
    label: 'Atout France — Guide de contrôle du classement des meublés de tourisme',
    url: GUIDE_CONTROLE_URL,
  },
  {
    label: 'Atout France — FAQ Meublé de tourisme',
    url: 'https://www.atout-france.fr/fr/classement/faq-meuble-de-tourisme',
  },
];

function ArticleBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6 text-gray-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ArticlePreparerVisiteClassementMeubleTourisme() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <ArticleHeaderMeta readingTime="11 min de lecture" />
            <h1 className="mb-0 text-white">
              Comment préparer la visite de classement de votre meublé de tourisme ?
            </h1>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-comfortable text-gray-700 mb-6">
              Lors de la visite de classement, l’inspecteur évalue votre logement à partir des{' '}
              <strong>
                133 critères du{' '}
                <a
                  href={REFERENTIEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-inline-link"
                >
                  référentiel national
                </a>
              </strong>
              . Certains critères sont obligatoires, d’autres sont « à la carte », et leur
              répartition change selon la catégorie demandée. Pour obtenir le classement visé, votre
              logement doit atteindre au moins <strong>95 % des points obligatoires</strong>, ainsi
              qu’un quota de points à la carte. Certains critères obligatoires non compensables
              doivent, eux, être validés dans tous les cas.
            </p>
            <p className="text-xl leading-comfortable text-gray-700 mb-8">
              Cela ne signifie pas que votre logement doit être parfait. En revanche, certains
              critères reposent sur des éléments très simples auxquels on pense rarement : une
              quantité précise de vaisselle, une information écrite dans l’annonce ou un petit
              équipement manquant. Cet article fait le point sur les éléments les plus souvent
              oubliés ou bloquants, afin d’éviter les mauvaises surprises le jour de la visite.
            </p>

            <div className="rounded-card border border-primary-200 bg-primary-100 p-5 mb-12">
              <p className="text-gray-700 leading-comfortable">
                Les exemples ci-dessous reprennent les règles générales du référentiel. Ils ne
                constituent ni une évaluation préalable de votre logement, ni un conseil
                personnalisé sur les équipements à ajouter, ni une garantie d’obtenir la catégorie
                demandée.
              </p>
            </div>

            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>
              <ArticleBulletList items={keyTakeaways} />
              <p className="text-gray-700 leading-comfortable">
                Le{' '}
                <Link to="/simulateur" className="article-inline-link font-semibold">
                  simulateur de classement Etoilys
                </Link>{' '}
                permet de parcourir tous les critères et d’estimer la catégorie à laquelle votre
                logement peut prétendre.
              </p>
            </div>

            <h2 className="mt-12 mb-4">
              Comprendre les critères correspondant à la catégorie demandée
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Avant le début de la visite, vous indiquez la catégorie de classement demandée.
              L’inspecteur examine ensuite le logement en appliquant les critères correspondant à
              cette catégorie.
            </p>
            <p className="text-gray-700 leading-comfortable mb-6">
              Un même équipement peut être à la carte pour une catégorie, puis devenir obligatoire
              lorsque le nombre d’étoiles augmente. Quelques exemples permettent de comprendre
              rapidement cette logique :
            </p>

            <ResponsiveComparisonTable
              className="mb-6"
              primaryColumnKey="critere"
              columns={[
                {
                  key: 'critere',
                  label: 'Exemple de critère',
                  mobileLabel: 'Exemple de critère',
                  widthClassName: 'w-1/3',
                },
                {
                  key: 'one',
                  label: '1 étoile',
                  mobileLabel: '1 étoile',
                  align: 'center',
                  widthClassName: 'w-[13.4%]',
                },
                {
                  key: 'two',
                  label: '2 étoiles',
                  mobileLabel: '2 étoiles',
                  align: 'center',
                  widthClassName: 'w-[13.4%]',
                },
                {
                  key: 'three',
                  label: '3 étoiles',
                  mobileLabel: '3 étoiles',
                  align: 'center',
                  widthClassName: 'w-[13.4%]',
                },
                {
                  key: 'four',
                  label: '4 étoiles',
                  mobileLabel: '4 étoiles',
                  align: 'center',
                  widthClassName: 'w-[13.4%]',
                },
                {
                  key: 'five',
                  label: '5 étoiles',
                  mobileLabel: '5 étoiles',
                  align: 'center',
                  widthClassName: 'w-[13.4%]',
                },
              ]}
              rows={[
                {
                  key: 'bouilloire',
                  rowClassName: 'bg-white border-b border-gray-100',
                  cells: {
                    critere: 'Bouilloire',
                    one: 'À la carte',
                    two: 'Obligatoire',
                    three: 'Obligatoire',
                    four: 'Obligatoire',
                    five: 'Obligatoire',
                  },
                },
                {
                  key: 'produits-accueil',
                  rowClassName: 'bg-gray-50 border-b border-gray-100',
                  cells: {
                    critere: 'Produits d’accueil dans la salle d’eau',
                    one: 'À la carte',
                    two: 'À la carte',
                    three: 'Obligatoire',
                    four: 'Obligatoire',
                    five: 'Obligatoire',
                  },
                },
                {
                  key: 'expresso',
                  rowClassName: 'bg-white',
                  cells: {
                    critere: 'Machine à expresso',
                    one: 'À la carte',
                    two: 'À la carte',
                    three: 'À la carte',
                    four: 'Obligatoire',
                    five: 'Obligatoire',
                  },
                },
              ]}
              caption="Exemples de critères selon la catégorie de classement demandée"
              tableClassName="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm"
              cellClassName="p-3 align-middle"
              mobileValueClassName="text-sm text-gray-900 text-right"
            />

            <p className="text-gray-700 leading-comfortable mb-4">
              Les produits d’accueil correspondent au minimum à du savon ou du gel douche et du
              shampoing dans chaque salle d’eau. Un produit combiné shampoing-douche est également
              accepté.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour obtenir la catégorie demandée, le logement doit atteindre au moins 95 % des
              points obligatoires et le quota de points à la carte prévu pour cette catégorie. Un
              critère obligatoire manquant n’empêche donc pas systématiquement d’obtenir le
              classement. En revanche, les critères obligatoires non compensables doivent tous être
              validés.
            </p>

            <h3 className="mt-8 mb-3">Vous ne savez pas quelle catégorie demander ?</h3>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le{' '}
              <Link to="/simulateur" className="article-inline-link font-semibold">
                simulateur de classement Etoilys
              </Link>{' '}
              reprend les 133 critères et adapte l’évaluation à la catégorie envisagée et à la
              capacité de votre logement. Il permet de réaliser une première auto-évaluation avant
              la visite.
            </p>
            <div className="mb-12">
              <Button href="/simulateur" variant="primary">
                Tester mon logement avec le simulateur
              </Button>
            </div>

            <h2 className="mt-12 mb-4">
              Vérifier les équipements et les quantités correspondant à la capacité
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La capacité d’accueil déclarée ne détermine pas seulement le nombre de couchages. Elle
              modifie aussi les quantités de vaisselle, le nombre de places autour de la table et
              plusieurs autres exigences du référentiel.
            </p>

            <h3 className="mt-8 mb-3">Critère 63 : vérifier les quantités de vaisselle</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le critère 63 porte sur la{' '}
              <strong>quantité de vaisselle de table non dépareillée, minimum par personne</strong>.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour chaque personne accueillie, le logement doit disposer au minimum de :
            </p>
            <ArticleBulletList items={dishes} />
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour un logement classé pour <strong>6 personnes</strong>, il faut donc notamment 12
              verres à eau, 6 verres à vin, 12 assiettes plates, 12 bols, 12 tasses ou mugs et 12
              exemplaires de chaque couvert demandé en double.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La vaisselle ne doit pas nécessairement être entièrement identique. Pour les 12 bols
              d’un logement de 6 personnes, vous pouvez par exemple disposer de{' '}
              <strong>6 bols blancs identiques et de 6 bols bleus identiques</strong>. Vous disposez
              alors de deux séries cohérentes d’un bol par personne. En revanche, 12 bols tous
              différents ne constituent pas des ensembles de vaisselle non dépareillée.
            </p>

            <h3 className="mt-8 mb-3">Critère 65 : vérifier la liste complète</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le critère 65 exige l’équipement minimum suivant pour la préparation des repas :
            </p>
            <div className="rounded-card border border-primary-200 bg-primary-100 p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                1 saladier, 1 plat allant au four, 2 casseroles, 1 poêle, 1 fait-tout, 1
                tire-bouchon, 1 décapsuleur, 1 paire de ciseaux, 1 planche à découper, 1 couteau à
                pain, 1 passoire, 1 couvercle, 1 essoreuse à salade, 1 moule à tarte et/ou moule à
                gâteau, 1 ouvre-boîte, 1 économe, 1 dessous de plat, 1 verre doseur, 1 louche, 1
                écumoire, 1 spatule et 1 fouet.
              </p>
            </div>
            <p className="text-gray-700 leading-comfortable mb-4">
              Tous ces éléments appartiennent au même critère.{' '}
              <strong>S’il en manque un seul, le critère 65 ne peut pas être validé.</strong>
            </p>

            <h3 className="mt-8 mb-3">Les assises doivent également correspondre à la capacité</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              La table et ses assises doivent correspondre à la capacité totale du logement. Pour
              l’espace salon, le nombre de places sur le canapé et les fauteuils doit également
              correspondre à la capacité, mais cette exigence est{' '}
              <strong>plafonnée à 7 personnes</strong>. Un logement prévu pour 10 personnes n’a donc
              pas besoin de proposer 10 assises dans son salon pour valider ce critère.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Si votre logement accueille 6 personnes mais que le salon ne propose que 5 assises, le
              critère correspondant ne pourra pas être validé. Cela ne signifie pas automatiquement
              que le classement sera refusé : le logement doit atteindre au moins 95 % des points
              obligatoires. Tous les critères manquants n’ont donc pas le même caractère bloquant.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              D’autres exigences varient selon la capacité, notamment le nombre de couchages, la
              capacité du réfrigérateur, le nombre de foyers de cuisson ou certains équipements
              sanitaires. Le{' '}
              <Link to="/simulateur" className="article-inline-link font-semibold">
                simulateur de classement Etoilys
              </Link>{' '}
              adapte automatiquement ces exigences à la capacité renseignée.
            </p>

            <h2 className="mt-12 mb-4">
              Préparer les documents et les informations destinées aux voyageurs
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Certains critères ne reposent pas seulement sur la présence d’un équipement. Ils
              vérifient aussi les informations réellement mises à la disposition des voyageurs. Une
              déclaration orale faite le jour de la visite ne suffit pas toujours : l’information
              doit pouvoir être retrouvée sur un support vérifiable.
            </p>

            <h3 className="mt-8 mb-3">
              Critère 100 : prévoir cinq supports d’information touristique
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le critère 100 demande de mettre à disposition des informations locales et
              touristiques en français et dans au moins une langue étrangère.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour le valider, il faut prévoir :
            </p>
            <ul className="space-y-2 mb-6 text-gray-700">
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  au moins <strong>5 dépliants, brochures ou supports d’information</strong> au
                  total ;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>
                  parmi eux, au moins{' '}
                  <strong>3 disponibles dans une ou plusieurs langues étrangères</strong>.
                </span>
              </li>
            </ul>
            <p className="text-gray-700 leading-comfortable mb-4">
              Une brochure bilingue compte à la fois pour le français et pour la langue étrangère.
              Les supports peuvent être proposés sur papier ou sous forme numérique : QR code,
              tablette, lien de téléchargement, site internet ou guide numérique.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Ces informations peuvent par exemple concerner les sites et monuments, les activités
              de loisirs, les excursions, les animations, l’office de tourisme, les commerces, les
              services publics ou les professionnels de santé à proximité.
            </p>

            <h3 className="mt-8 mb-3">
              Critères 105, 106, 108 et 110 : rendre les services vérifiables par écrit
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les critères suivants portent sur des services proposés aux voyageurs :
            </p>
            <ResponsiveComparisonTable
              className="mb-6"
              primaryColumnKey="critere"
              columns={[
                {
                  key: 'critere',
                  label: 'Critère',
                  mobileLabel: 'Critère',
                  align: 'center',
                  widthClassName: 'w-1/4',
                },
                {
                  key: 'information',
                  label: 'Information concernée',
                  mobileLabel: 'Information concernée',
                  widthClassName: 'w-3/4',
                },
              ]}
              rows={[
                {
                  key: '105',
                  rowClassName: 'bg-white border-b border-gray-100',
                  cells: {
                    critere: '105',
                    information: 'Draps de lit proposés systématiquement par le loueur',
                  },
                },
                {
                  key: '106',
                  rowClassName: 'bg-gray-50 border-b border-gray-100',
                  cells: {
                    critere: '106',
                    information: 'Linge de toilette proposé systématiquement par le loueur',
                  },
                },
                {
                  key: '108',
                  rowClassName: 'bg-white border-b border-gray-100',
                  cells: {
                    critere: '108',
                    information: 'Lits faits à l’arrivée proposés systématiquement par le loueur',
                  },
                },
                {
                  key: '110',
                  rowClassName: 'bg-gray-50',
                  cells: {
                    critere: '110',
                    information: 'Service de ménage proposé systématiquement',
                  },
                },
              ]}
              caption="Services proposés aux voyageurs à rendre vérifiables par écrit"
              tableClassName="w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm"
              cellClassName="p-3 align-middle"
            />
            <p className="text-gray-700 leading-comfortable mb-4">
              Ces prestations peuvent être gratuites ou payantes. L’important est qu’elles soient
              systématiquement proposées et que l’information puisse être vérifiée par écrit :
              annonce de location, livret d’accueil, site internet, e-mail type, brochure ou
              affichage dans le logement.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Dire simplement à l’inspecteur que les lits sont toujours faits ou que le ménage est
              toujours proposé ne permet pas, à lui seul, de valider le critère. Il faut que cette
              information soit effectivement communiquée aux voyageurs.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Attention également à ne pas confondre deux services différents :{' '}
              <strong>proposer les draps</strong> et{' '}
              <strong>proposer que les lits soient faits à l’arrivée</strong> correspondent à deux
              critères distincts.
            </p>

            <h3 className="mt-8 mb-3">
              Critère 116 : informer sur l’accessibilité ou la non-accessibilité
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le critère 116 porte sur les{' '}
              <strong>
                informations concernant l’accessibilité sur les supports d’information
              </strong>
              .
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le logement n’a pas besoin d’être accessible aux personnes à mobilité réduite pour
              valider ce critère. En revanche, les voyageurs doivent être clairement informés de son
              niveau d’accessibilité. Si le logement n’est pas adapté, cela doit être précisé sur
              l’annonce, le site internet, le livret d’accueil ou un autre support destiné aux
              voyageurs.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Une phrase simple peut suffire :
            </p>
            <blockquote className="rounded-card border-l-4 border-primary-300 bg-gray-50 p-5 mb-6 text-gray-700">
              Ce logement n’est pas adapté à l’accueil des personnes à mobilité réduite.
            </blockquote>

            <h3 className="mt-8 mb-3">
              Critère 130 : sensibiliser les voyageurs au respect de l’environnement
            </h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le critère 130 porte sur la{' '}
              <strong>
                sensibilisation des clients aux actions qu’ils peuvent réaliser pendant leur séjour
                en matière de respect de l’environnement
              </strong>
              .
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette information peut figurer dans le livret d’accueil, sur l’annonce, sur le site
              internet ou sur une affichette dans le logement. Il n’est pas nécessaire de rédiger
              une charte environnementale de trois pages. Une consigne courte et concrète peut
              permettre d’informer les voyageurs, par exemple :
            </p>
            <blockquote className="rounded-card border-l-4 border-primary-300 bg-gray-50 p-5 mb-6 text-gray-700">
              Pensez à éteindre les lumières et la climatisation lorsque vous quittez le logement,
              et à limiter votre consommation d’eau pendant votre séjour.
            </blockquote>
            <p className="text-gray-700 leading-comfortable mb-4">
              La sensibilisation peut aussi porter sur le tri des déchets, les transports en commun,
              la location de vélos, les itinéraires pédestres, les produits locaux ou d’autres
              moyens de réduire l’impact environnemental du séjour.
            </p>

            <h2 className="mt-12 mb-4">Présenter le logement dans sa configuration réelle</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La visite porte sur le logement tel qu’il est réellement proposé aux voyageurs. Les
              pièces comprises dans la location doivent être accessibles, les couchages doivent être
              installés dans leur configuration habituelle et les équipements déclarés doivent être
              présents, accessibles et fonctionnels.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les appareils, les télécommandes, l’accès au Wi-Fi et les documents présentés comme
              des services du logement doivent pouvoir être vérifiés pendant la visite.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le logement doit également être propre et correctement entretenu. Les sanitaires, les
              sols, les murs et plafonds, le mobilier, la literie ainsi que la cuisine et ses
              équipements font l’objet de cinq critères obligatoires non compensables : ils doivent
              tous être validés.
            </p>

            <h2 className="mt-12 mb-4">La checklist avant la visite</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Avant le rendez-vous, vérifiez les points suivants :
            </p>
            <div className="rounded-card border border-primary-200 bg-primary-100 p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-primary-300 bg-white"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-12">
              <Button href="/simulateur" variant="primary">
                Faire l’auto-évaluation complète de mon logement
              </Button>
            </div>

            <h2 className="mt-12 mb-4">Peut-on transmettre des compléments après la visite ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le{' '}
              <strong>
                <a
                  href={GUIDE_CONTROLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-inline-link"
                >
                  guide de contrôle
                </a>
              </strong>{' '}
              permet de transmettre certains éléments factuels dans un délai maximal de{' '}
              <strong>15 jours ouvrés après la visite</strong>. Il peut notamment s’agir de
              documents, d’un affichage, d’un guide d’accueil ou de certains petits équipements.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette possibilité n’est toutefois ni automatique, ni destinée à remplacer la
              préparation du logement. Les équipements et les services doivent normalement être
              constatés sur place le jour de l’inspection. La prise en compte d’un complément dépend
              de la nature du critère et des éléments transmis.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Un devis ou une facture ne permet notamment pas de valider des travaux non réalisés,
              un problème de propreté, un défaut d’entretien ou un équipement important qui n’était
              pas présent lors de la visite.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Etoilys vérifie au cas par cas si les éléments transmis permettent de constater
              valablement le respect du critère concerné. Pour comprendre l’ensemble des étapes et
              des délais, vous pouvez également{' '}
              <Link to="/procedure" className="article-inline-link font-semibold">
                comprendre la procédure de classement
              </Link>
              .
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-h4 mb-6">Sources officielles</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                {officialSources.map(({ label, url }, index) => (
                  <li key={url} className="flex gap-2">
                    <span className="text-primary-400 font-medium shrink-0">{index + 1}.</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words hover:text-primary-400 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <h2 className="mt-12 mb-4">
              Bien préparer la visite, sans chercher à rendre chaque critère parfait
            </h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Préparer la visite ne consiste pas à rendre chaque critère parfait. Il s’agit surtout
              de choisir une catégorie cohérente, de vérifier les quantités qui dépendent de la
              capacité et de rendre accessibles les équipements, documents et informations
              réellement proposés aux voyageurs.
            </p>
            <p className="text-gray-700 leading-comfortable mb-6">
              Le moyen le plus simple de faire le point avant la visite reste de parcourir les 133
              critères dans le{' '}
              <Link to="/simulateur" className="article-inline-link font-semibold">
                simulateur de classement Etoilys
              </Link>
              . Vous pouvez ensuite{' '}
              <Link to="/prerequis-au-classement" className="article-inline-link font-semibold">
                consulter les prérequis au classement
              </Link>{' '}
              ou{' '}
              <Link to="/demande-classement" className="article-inline-link font-semibold">
                faire une demande de classement
              </Link>{' '}
              lorsque votre projet est prêt.
            </p>

            <div className="mt-12 mb-8 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">Faire le point avant la visite</h2>
              <p className="text-gray-700 mb-6">
                Parcourez les critères du référentiel et estimez la catégorie possible de votre
                logement avec l’outil Etoilys.
              </p>
              <Button href="/simulateur" variant="primary">
                Tester mon logement avec le simulateur de classement
              </Button>
            </div>

            <div className="rounded-card border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-h4 mb-3">À lire aussi</h2>
              <Link
                to="/actualites/micro-bic-2026-meuble-classe-vs-non-classe"
                className="article-inline-link font-semibold"
              >
                Micro-BIC 2026 : meublé classé vs non classé, l’écart se creuse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
