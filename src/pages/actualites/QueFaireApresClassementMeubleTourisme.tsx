import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import KeyTakeaways from '../../components/ui/KeyTakeaways';
import ArticleSources from '../../components/ui/ArticleSources';
import ArticleLayout from '../../components/ui/ArticleLayout';
import ArticleSectionHeading from '../../components/ui/ArticleSectionHeading';
import type { ArticleTableOfContentsItem } from '../../components/ui/ArticleTableOfContents';
import { getActualiteArticleByHref } from '../../content/actualitesArticles';

const keyTakeaways = [
  'La décision de classement doit être affichée de manière visible à l’intérieur du logement.',
  'La déclaration ou l’enregistrement du meublé doit être actualisé si la procédure de votre commune le prévoit.',
  'Le classement doit être pris en compte par l’organisme chargé de la taxe de séjour dans votre secteur.',
  'Lorsque votre plateforme calcule ou collecte la taxe de séjour, vérifiez que votre catégorie de classement est correctement renseignée.',
];

const declarationSteps = [
  'Ouvrir le téléservice utilisé par la commune.',
  'Rechercher l’option permettant de modifier ou renouveler la déclaration.',
  'Renseigner la date de la décision de classement.',
  'Renseigner la catégorie obtenue.',
  'Joindre la décision si le portail la demande.',
  'Conserver l’accusé de réception.',
];

const airbnbSteps = [
  'Ouvrir la gestion de l’annonce sur le site ou l’application Airbnb.',
  'Accéder à l’onglet Réglementations.',
  'Choisir la catégorie de classement du meublé.',
  'Vérifier le tarif de taxe de séjour affiché après modification.',
];

const abritelSteps = [
  'Ouvrir le tableau de bord de l’hébergement.',
  'Sélectionner Lois et réglementations locales.',
  'Ouvrir Taxes, puis Classement.',
  'Ajouter le type d’hébergement et la catégorie obtenue.',
  'Enregistrer, puis appliquer la modification.',
  'Vérifier le taux actualisé dans les paramètres.',
];

const bookingSteps = [
  'Se connecter à l’extranet Booking.com.',
  'Ouvrir le menu Établissement.',
  'Sélectionner TVA, taxes et frais.',
  'Ouvrir les paramètres utilisés pour calculer la taxe de séjour, parfois intitulés « Edit tax drivers » dans l’extranet anglophone.',
  'Remplir le questionnaire en vérifiant le type ou la catégorie de l’hébergement.',
  'Enregistrer les modifications, puis contrôler le tarif affiché sur les prochaines réservations.',
];

const finalChecklist = [
  'Afficher la décision dans le logement.',
  'Actualiser la déclaration ou l’enregistrement du meublé, puis conserver l’accusé.',
  'Vérifier la catégorie et le tarif sur le portail local de taxe de séjour.',
  'Mettre à jour le classement sur vos plateformes de réservation.',
  'Noter la date d’expiration du classement.',
];

const officialSources = [
  {
    id: 'legifrance-code-du-tourisme-article-d-324-6-1',
    organization: 'Légifrance',
    title: 'Code du tourisme, article D. 324-6',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025846054',
  },
  {
    id: 'legifrance-code-du-tourisme-sous-section-consacree-au-classement-2',
    organization: 'Légifrance',
    title: 'Code du tourisme, sous-section consacrée au classement',
    url: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006175549',
  },
  {
    id: 'legifrance-informations-comprises-dans-la-declaration-du-meuble-3',
    organization: 'Légifrance',
    title: 'informations comprises dans la déclaration du meublé',
    url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074073/LEGISCTA000006158429/',
  },
  {
    id: 'service-public-declaration-en-mairie-des-meubles-de-tourisme-4',
    organization: 'Service-Public',
    title: 'déclaration en mairie des meublés de tourisme',
    url: 'https://www.service-public.fr/particuliers/vosdroits/R14321',
  },
  {
    id: 'service-public-cerfa-14004-5',
    organization: 'Service-Public',
    title: 'Cerfa 14004',
    url: 'https://www.formulaires.service-public.fr/gf/cerfa_14004.do',
  },
  {
    id: 'dge-api-meubles-et-teleservice-national-6',
    organization: 'DGE',
    title: 'API Meublés et téléservice national',
    url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation',
  },
  {
    id: 'service-public-entreprendre-bareme-2026-de-la-taxe-de-sejour-7',
    organization: 'Service-Public Entreprendre',
    title: 'barème 2026 de la taxe de séjour',
    url: 'https://entreprendre.service-public.fr/vosdroits/F31635',
  },
  {
    id: 'service-public-entreprendre-fonctionnement-general-de-la-taxe-de-sejour-8',
    organization: 'Service-Public Entreprendre',
    title: 'fonctionnement général de la taxe de séjour',
    url: 'https://entreprendre.service-public.fr/vosdroits/F743',
  },
  {
    id: 'airbnb-collecte-et-versement-de-la-taxe-de-sejour-en-france-9',
    organization: 'Airbnb',
    title: 'collecte et versement de la taxe de séjour en France',
    url: 'https://www.airbnb.fr/help/article/2284',
  },
  {
    id: 'abritel-perception-de-la-taxe-de-sejour-et-mise-a-jour-du-classement-10',
    organization: 'Abritel',
    title: 'perception de la taxe de séjour et mise à jour du classement',
    url: 'https://aide.abritel.fr/articles/En-France-quelles-sont-les-villes-ou-Abritel-HomeAway-se-charge-de-la-perception-et-du-versement-des-taxes',
  },
  {
    id: 'booking-com-taxe-de-sejour-en-france-11',
    organization: 'Booking.com',
    title: 'taxe de séjour en France',
    url: 'https://partner.booking.com/fr/aide/commission-factures-et-taxes/taxes-locales/taxe-de-s%C3%A9jour-en-france%C2%A0-questions-fr%C3%A9quentes',
  },
  {
    id: 'booking-com-comprendre-les-taxes-locales-12',
    organization: 'Booking.com',
    title: 'comprendre les taxes locales',
    url: 'https://partner.booking.com/fr/aide/commission-factures-et-taxes/taxes-locales/comprendre-la-tva-et-les-taxes-locales',
  },
  {
    id: 'ancv-conventionnement-cheque-vacances-13',
    organization: 'ANCV',
    title: 'conventionnement Chèque-Vacances',
    url: 'https://static.ancv.com/ddmc/connect/PTL/PAP_PTL_Se_conventionner_Ch%C3%A8que-Vacances.pdf',
  },
  {
    id: 'atout-france-panonceaux-des-meubles-de-tourisme-14',
    organization: 'Atout France',
    title: 'panonceaux des meublés de tourisme',
    url: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
];

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  {
    id: 'affichez-la-decision-de-classement-dans-le-logement',
    label: 'Affichez la décision de classement dans le logement',
  },
  {
    id: 'actualisez-la-declaration-ou-l-enregistrement-du-meuble',
    label: 'Actualisez la déclaration ou l’enregistrement du meublé',
  },
  {
    id: 'verifiez-la-mise-a-jour-de-votre-taxe-de-sejour',
    label: 'Vérifiez la mise à jour de votre taxe de séjour',
  },
  {
    id: 'renseignez-votre-classement-sur-les-plateformes-de-reservation',
    label: 'Renseignez votre classement sur les plateformes de réservation',
  },
  {
    id: 'conservez-vos-documents-et-anticipez-le-renouvellement',
    label: 'Conservez vos documents et anticipez le renouvellement',
  },
  {
    id: 'une-demarche-facultative-accepter-les-cheques-vacances',
    label: 'Une démarche facultative : accepter les Chèques-Vacances',
  },
];

const keyTakeawaysBlock = (
  <KeyTakeaways
    variant="bullets"
    items={keyTakeaways.map((item) => ({ id: item, content: item }))}
  />
);

const articleSources = (
  <ArticleSources
    sources={officialSources}
    description={<>Cet article s’appuie sur les textes officiels et centres d’aide suivants.</>}
  />
);

const article = getActualiteArticleByHref('/actualites/que-faire-apres-classement-meuble-tourisme');

export default function ArticleQueFaireApresClassementMeubleTourisme() {
  return (
    <ArticleLayout
      article={article}
      tableOfContents={tableOfContents}
      lede={
        <>
          <p className="text-xl leading-comfortable text-gray-700 mb-10">
            Vous venez de recevoir votre décision de classement ? Voici les principales démarches à
            effectuer : afficher la décision dans le logement, actualiser votre déclaration, mettre
            à jour votre classement pour la taxe de séjour et le renseigner sur les plateformes qui
            la calculent.
          </p>
        </>
      }
      keyTakeaways={keyTakeawaysBlock}
      footerCta={
        <>
          <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
            <h2 className="text-h4 mb-3">Vérifiez maintenant votre taxe de séjour</h2>
            <p className="text-gray-700 mb-6">
              Une fois votre classement renseigné, utilisez le simulateur Etoilys pour contrôler le
              tarif applicable dans votre commune. La FAQ répond également aux principales questions
              sur les démarches qui suivent le classement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/simulateur-taxe-sejour" variant="primary">
                Simuler ma taxe de séjour
              </Button>
              <Button href="/faq" variant="secondary">
                Consulter la FAQ
              </Button>
            </div>
          </div>
        </>
      }
      sources={articleSources}
    >
      <ArticleSectionHeading id="affichez-la-decision-de-classement-dans-le-logement">
        Affichez la décision de classement dans le logement
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le Code du tourisme distingue deux éléments. La décision de classement doit être affichée de
        manière visible à l’intérieur du meublé. Le panonceau extérieur, lui, permet de signaler le
        classement, mais il reste facultatif pour un meublé de tourisme.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        En pratique, l’emplacement doit être simple à repérer : entrée, panneau d’informations,
        espace d’accueil ou porte-document visible. Le rapport de contrôle et la grille de contrôle
        n’ont pas à être affichés ; ils doivent seulement rester conservés avec vos documents de
        classement.
      </p>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-card border border-primary-200 bg-primary-100 p-5">
          <p className="font-semibold text-gray-900 mb-1">Obligatoire</p>
          <p className="text-gray-700">La décision de classement à l’intérieur du logement.</p>
        </div>
        <div className="rounded-card border border-gray-200 bg-gray-50 p-5">
          <p className="font-semibold text-gray-900 mb-1">Facultatif</p>
          <p className="text-gray-700">Le panonceau extérieur.</p>
        </div>
      </div>
      <p className="text-gray-700 leading-comfortable mb-4">
        Atout France met à disposition les{' '}
        <a
          href="https://www.atout-france.fr/fr/classement/meuble-de-tourisme"
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          documents relatifs aux panonceaux des meublés de tourisme
        </a>{' '}
        dans sa page dédiée aux documents de classement.
      </p>

      <ArticleSectionHeading id="actualisez-la-declaration-ou-l-enregistrement-du-meuble">
        Actualisez la déclaration ou l’enregistrement du meublé
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        La date de la décision et la catégorie de classement font partie des informations déclarées
        pour un meublé de tourisme. Après obtention du classement, vérifiez donc si la déclaration
        ou l’enregistrement doit être mis à jour selon la procédure prévue par la commune du
        logement.
      </p>
      <div className="space-y-4 mb-6 text-gray-700">
        {declarationSteps.map((step, index) => (
          <div className="flex gap-4" key={step}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-300 text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            <p className="leading-comfortable">{step}</p>
          </div>
        ))}
      </div>
      <p className="text-gray-700 leading-comfortable mb-4">
        Les interfaces diffèrent selon les collectivités. Certaines communes utilisent un
        téléservice local, d’autres demandent un formulaire ou une prise de contact avec la mairie.
        Si aucune fonction de modification n’est proposée, contactez la mairie ou le service indiqué
        par le portail.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
        <p className="text-h4 font-playfair font-semibold text-gray-900 mb-3">
          Attention au calendrier 2026
        </p>
        <p className="text-gray-700 leading-comfortable">
          Au 8 juillet 2026, le téléservice national définitif n’est pas encore ouvert aux loueurs.
          Continuez à suivre la procédure indiquée par votre commune. Un nouveau numéro national
          devra être demandé lorsque le téléservice sera lancé.
        </p>
        <p className="text-gray-700 leading-comfortable mt-3">
          Pour situer cette transition, vous pouvez{' '}
          <Link
            to="/actualites/api-meubles-declaration-meuble-tourisme"
            className="article-inline-link"
          >
            comprendre le futur téléservice national d’enregistrement
          </Link>
          .
        </p>
      </div>

      <ArticleSectionHeading id="verifiez-la-mise-a-jour-de-votre-taxe-de-sejour">
        Vérifiez la mise à jour de votre taxe de séjour
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Etoilys transmet la décision de classement à l’office de tourisme du secteur. Vous n’avez
        donc pas à renvoyer systématiquement la décision à ce même office de tourisme.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Vérifiez que votre classement est bien enregistré auprès de l’organisme chargé de la taxe de
        séjour dans votre secteur, afin que le tarif correspondant à votre nombre d’étoiles soit
        appliqué. Selon le territoire, il peut s’agir de l’office de tourisme, de la commune ou de
        la communauté de communes.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Si votre catégorie n’est pas à jour sur le portail local, contactez le service indiqué par
        ce portail et transmettez la décision si nécessaire.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour aller plus loin, vous pouvez{' '}
        <Link
          to="/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne"
          className="article-inline-link"
        >
          comprendre le calcul de la taxe de séjour d’un meublé classé
        </Link>{' '}
        ou{' '}
        <Link to="/simulateur-taxe-sejour" className="article-inline-link">
          simuler votre taxe de séjour
        </Link>
        .
      </p>

      <ArticleSectionHeading id="renseignez-votre-classement-sur-les-plateformes-de-reservation">
        Renseignez votre classement sur les plateformes de réservation
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Les intitulés peuvent varier selon la version de l’application, le type de compte et les
        évolutions de chaque plateforme.
      </p>

      <h3 className="mt-8 mb-3">Sur Airbnb</h3>
      <p className="text-gray-700 leading-comfortable mb-4">
        Airbnb collecte et reverse automatiquement la taxe de séjour pour les réservations
        concernées en France. Le tarif est calculé à partir du type d’hébergement et de la catégorie
        de classement renseignés par l’hôte. Si le classement n’est pas renseigné, Airbnb applique
        le tarif d’un meublé non classé.
      </p>
      <ol className="space-y-3 mb-6 text-gray-700">
        {airbnbSteps.map((step) => (
          <li key={step} className="list-decimal ml-6 pl-1 leading-comfortable">
            {step}
          </li>
        ))}
      </ol>
      <p className="text-gray-700 leading-comfortable mb-4">
        La taxe est collectée au moment de la réservation.
      </p>

      <h3 className="mt-8 mb-3">Sur Abritel</h3>
      <p className="text-gray-700 leading-comfortable mb-4">
        Abritel indique calculer, percevoir et reverser la taxe de séjour pour les hébergements
        publiés en France. Le classement déclaré détermine le tarif utilisé, et le propriétaire
        reste responsable de la mise à jour de son classement.
      </p>
      <ol className="space-y-3 mb-6 text-gray-700">
        {abritelSteps.map((step) => (
          <li key={step} className="list-decimal ml-6 pl-1 leading-comfortable">
            {step}
          </li>
        ))}
      </ol>

      <h3 className="mt-8 mb-3">Sur Booking.com</h3>
      <p className="text-gray-700 leading-comfortable mb-4">
        Booking.com permet de modifier le type ou la catégorie de l’hébergement dans les paramètres
        de calcul de la taxe de séjour. La mise à jour se fait depuis l’extranet :
      </p>
      <ol className="space-y-3 mb-6 text-gray-700">
        {bookingSteps.map((step) => (
          <li key={step} className="list-decimal ml-6 pl-1 leading-comfortable">
            {step}
          </li>
        ))}
      </ol>
      <p className="text-gray-700 leading-comfortable mb-4">
        Après l’enregistrement, contrôlez que la catégorie et le tarif affichés sur les prochaines
        réservations correspondent au classement obtenu.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Pour les autres plateformes de réservation, recherchez la rubrique liée aux taxes,
        réglementations locales ou informations de l’hébergement, puis vérifiez la catégorie de
        classement et le tarif de taxe de séjour affiché.
      </p>

      <ArticleSectionHeading id="conservez-vos-documents-et-anticipez-le-renouvellement">
        Conservez vos documents et anticipez le renouvellement
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Conservez ces documents dans un même dossier pendant toute la durée du classement : décision
        de classement, rapport de contrôle, grille de contrôle, accusé de réception de la
        déclaration mise à jour et éventuels échanges avec le service de taxe de séjour.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le classement est valable cinq ans et ne se renouvelle pas automatiquement. Notez dès
        maintenant sa date d’expiration, prévoyez une nouvelle visite avant l’échéance si vous
        souhaitez conserver le classement, et maintenez le logement et ses équipements pendant toute
        la durée du classement.
      </p>

      <div className="mt-12 mb-10 rounded-card border border-primary-200 bg-primary-100 p-6">
        <h2 className="text-h4 mb-4">Votre checklist après classement</h2>
        <ul className="space-y-3 text-gray-700">
          {finalChecklist.map((item) => (
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

      <ArticleSectionHeading id="une-demarche-facultative-accepter-les-cheques-vacances">
        Une démarche facultative : accepter les Chèques-Vacances
      </ArticleSectionHeading>
      <p className="text-gray-700 leading-comfortable mb-4">
        Le classement permet à un propriétaire de location meublée de déposer une demande de
        conventionnement auprès de l’ANCV. Ce conventionnement est nécessaire pour accepter les
        Chèques-Vacances, mais il n’est pas automatique.
      </p>
      <p className="text-gray-700 leading-comfortable mb-4">
        L’ANCV demande notamment une activité éligible, un numéro SIRET, un compte bancaire
        domicilié dans l’Union européenne et une preuve de classement pour une location meublée. La
        procédure est détaillée dans la{' '}
        <a
          href="https://static.ancv.com/ddmc/connect/PTL/PAP_PTL_Se_conventionner_Ch%C3%A8que-Vacances.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="article-inline-link"
        >
          ressource officielle ANCV sur le conventionnement Chèque-Vacances
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
