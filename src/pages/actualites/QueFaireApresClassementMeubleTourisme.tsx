import { Link } from 'react-router-dom';
import ArticleHeaderMeta from '../../components/ui/ArticleHeaderMeta';
import Button from '../../components/ui/Button';

const keyTakeaways = [
  'La décision de classement doit être affichée de manière visible à l’intérieur du logement.',
  'La déclaration ou l’enregistrement du meublé doit être actualisé avec la date et la catégorie de classement.',
  'Etoilys transmet la décision à l’office de tourisme du secteur ; vérifiez ensuite que le classement apparaît correctement sur votre portail local de taxe de séjour.',
  'Le classement doit être renseigné sur vos plateformes de réservation pour que la taxe de séjour soit calculée avec la bonne catégorie.',
  'Le classement est valable cinq ans : conservez les documents et notez l’échéance de renouvellement.',
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
  'Ouvrir les paramètres de calcul de la taxe, intitulés Edit tax drivers dans la version anglaise.',
  'Remplir le questionnaire en vérifiant le type ou la catégorie de l’hébergement.',
  'Enregistrer les modifications, puis contrôler le tarif affiché sur les prochaines réservations.',
];

const finalChecklist = [
  'Afficher la décision dans le logement.',
  'Actualiser la déclaration ou l’enregistrement du meublé, puis conserver l’accusé.',
  'Vérifier la catégorie et le tarif sur le portail local de taxe de séjour.',
  'Mettre à jour le classement sur vos plateformes de réservation.',
  'Conserver la décision, le rapport et la grille, puis noter la date d’expiration.',
];

const officialSources = [
  {
    label: 'Légifrance — Code du tourisme, article D. 324-6',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000025846054',
  },
  {
    label: 'Légifrance — Code du tourisme, sous-section consacrée au classement',
    url: 'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006175549',
  },
  {
    label: 'Légifrance — informations comprises dans la déclaration du meublé',
    url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074073/LEGISCTA000006158429/',
  },
  {
    label: 'Service-Public — déclaration en mairie des meublés de tourisme',
    url: 'https://www.service-public.fr/particuliers/vosdroits/R14321',
  },
  {
    label: 'Service-Public — Cerfa 14004',
    url: 'https://www.formulaires.service-public.fr/gf/cerfa_14004.do',
  },
  {
    label: 'DGE — API Meublés et téléservice national',
    url: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/lapi-meubles-guichet-unique-de-centralisation',
  },
  {
    label: 'Service-Public Entreprendre — barème 2026 de la taxe de séjour',
    url: 'https://entreprendre.service-public.fr/vosdroits/F31635',
  },
  {
    label: 'Service-Public Entreprendre — fonctionnement général de la taxe de séjour',
    url: 'https://entreprendre.service-public.fr/vosdroits/F743',
  },
  {
    label: 'Airbnb — collecte et versement de la taxe de séjour en France',
    url: 'https://www.airbnb.fr/help/article/2284',
  },
  {
    label: 'Abritel — perception de la taxe de séjour et mise à jour du classement',
    url: 'https://aide.abritel.fr/articles/En-France-quelles-sont-les-villes-ou-Abritel-HomeAway-se-charge-de-la-perception-et-du-versement-des-taxes',
  },
  {
    label: 'Booking.com — taxe de séjour en France',
    url: 'https://partner.booking.com/fr/aide/commission-factures-et-taxes/taxes-locales/taxe-de-s%C3%A9jour-en-france%C2%A0-questions-fr%C3%A9quentes',
  },
  {
    label: 'Booking.com — comprendre les taxes locales',
    url: 'https://partner.booking.com/fr/aide/commission-factures-et-taxes/taxes-locales/comprendre-la-tva-et-les-taxes-locales',
  },
  {
    label: 'ANCV — conventionnement Chèque-Vacances',
    url: 'https://static.ancv.com/ddmc/connect/PTL/PAP_PTL_Se_conventionner_Ch%C3%A8que-Vacances.pdf',
  },
  {
    label: 'Atout France — panonceaux des meublés de tourisme',
    url: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
];

export default function ArticleQueFaireApresClassementMeubleTourisme() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-4xl">
            <ArticleHeaderMeta
              publishedAt="2026-07-08"
              publishedDate="8 juillet 2026"
              updatedAt="2026-07-08"
              updatedDate="8 juillet 2026"
              author="Florian Grisorio"
              readingTime="7 min de lecture"
            />
            <h1 className="mb-0 text-white">
              Meublé de tourisme classé : que faire après la décision de classement ?
            </h1>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-comfortable text-gray-700 mb-10">
              Vous venez de recevoir votre décision de classement. Quelques démarches simples
              permettent maintenant de mettre à jour la situation de votre logement, d’appliquer le
              bon tarif de taxe de séjour et de renseigner correctement votre classement auprès des
              services et plateformes de réservation concernés.
            </p>

            <div className="bg-primary-100 border-l-4 border-primary-300 rounded-card p-6 mb-12">
              <h2 className="text-h4 mb-4">À retenir</h2>
              <ul className="space-y-3 text-gray-700">
                {keyTakeaways.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-primary-400 font-bold shrink-0 mt-0.5" aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="mt-12 mb-4">Affichez la décision de classement dans le logement</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le Code du tourisme distingue deux éléments. La décision de classement doit être
              affichée de manière visible à l’intérieur du meublé. Le panonceau extérieur, lui,
              permet de signaler le classement, mais il reste facultatif pour un meublé de tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              En pratique, l’emplacement doit être simple à repérer : entrée, panneau
              d’informations, espace d’accueil ou porte-document visible. Le rapport de contrôle et
              la grille de contrôle n’ont pas à être affichés ; ils doivent seulement rester
              conservés avec vos documents de classement.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="rounded-card border border-primary-200 bg-primary-100 p-5">
                <p className="font-semibold text-gray-900 mb-1">Obligatoire</p>
                <p className="text-gray-700">
                  La décision de classement à l’intérieur du logement.
                </p>
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

            <h2 className="mt-12 mb-4">Actualisez la déclaration ou l’enregistrement du meublé</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              La date de la décision et la catégorie de classement font partie des informations
              déclarées pour un meublé de tourisme. Après obtention du classement, la déclaration ou
              l’enregistrement doit donc être mis à jour selon la procédure prévue par la commune du
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
              téléservice local, d’autres demandent un formulaire ou une prise de contact avec la
              mairie. Si aucune fonction de modification n’est proposée, contactez la mairie ou le
              service indiqué par le portail.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-card p-5 mb-6">
              <p className="text-gray-700 leading-comfortable">
                <strong>Au 8 juillet 2026</strong>, la DGE annonce toujours l’ouverture de la
                version finale du téléservice national au second semestre 2026. Tant que ce service
                n’est pas ouvert aux loueurs, utilisez la procédure actuellement indiquée par votre
                commune. Lors du lancement national, tous les loueurs devront demander un nouveau
                numéro d’enregistrement pour chaque meublé de tourisme. Les anciens numéros
                resteront utilisables pendant une période transitoire, puis deviendront invalides.
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

            <h2 className="mt-12 mb-4">Vérifiez la mise à jour de votre taxe de séjour</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Etoilys transmet la décision de classement à l’office de tourisme du secteur. Vous
              n’avez donc pas à renvoyer systématiquement la décision à ce même office de tourisme.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              La taxe de séjour peut toutefois être administrée, selon le territoire, par la
              commune, une communauté de communes — c’est-à-dire un regroupement de communes — ou un
              service dédié. Etoilys ne garantit pas que l’information sera automatiquement
              répercutée dans chaque outil local.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Vérifiez donc que votre catégorie apparaît correctement sur le portail local de taxe
              de séjour. Si elle n’est pas mise à jour, contactez le service indiqué par ce portail
              et transmettez la décision si nécessaire. Vérifiez aussi le tarif appliqué aux
              prochains séjours.
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

            <h2 className="mt-12 mb-4">
              Renseignez votre classement sur les plateformes de réservation
            </h2>

            <h3 className="mt-8 mb-3">Sur Airbnb</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Airbnb collecte et reverse automatiquement la taxe de séjour pour les réservations
              concernées en France. Le tarif est calculé à partir du type d’hébergement et de la
              catégorie de classement renseignés par l’hôte. Si le classement n’est pas renseigné,
              Airbnb applique le tarif d’un meublé non classé.
            </p>
            <ol className="space-y-3 mb-6 text-gray-700">
              {airbnbSteps.map((step) => (
                <li key={step} className="list-decimal ml-6 pl-1 leading-comfortable">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-gray-700 leading-comfortable mb-4">
              La prise en compte de la modification peut prendre jusqu’à 24 heures. La taxe est
              collectée au moment de la réservation.
            </p>

            <h3 className="mt-8 mb-3">Sur Abritel</h3>
            <p className="text-gray-700 leading-comfortable mb-4">
              Abritel indique calculer, percevoir et reverser la taxe de séjour pour les
              hébergements publiés en France. Le classement déclaré détermine le tarif utilisé, et
              le propriétaire reste responsable de la mise à jour de son classement.
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
              Booking.com permet de modifier le type ou la catégorie de l’hébergement dans les
              paramètres de calcul de la taxe de séjour. La mise à jour se fait depuis l’extranet :
            </p>
            <ol className="space-y-3 mb-6 text-gray-700">
              {bookingSteps.map((step) => (
                <li key={step} className="list-decimal ml-6 pl-1 leading-comfortable">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-gray-700 leading-comfortable mb-4">
              Les intitulés peuvent varier selon le compte partenaire, le type d’établissement ou la
              version de l’extranet. Après l’enregistrement, contrôlez que la catégorie et le tarif
              affichés sur les prochaines réservations correspondent au classement obtenu.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Pour les autres plateformes de réservation, recherchez la rubrique liée aux taxes,
              réglementations locales ou informations de l’hébergement, puis vérifiez la catégorie
              de classement et le tarif de taxe de séjour affiché.
            </p>

            <h2 className="mt-12 mb-4">Conservez vos documents et anticipez le renouvellement</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Conservez ces documents dans un même dossier pendant toute la durée du classement :
              décision de classement, rapport de contrôle, grille de contrôle, accusé de réception
              de la déclaration mise à jour et éventuels échanges avec le service de taxe de séjour.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              Le classement est valable cinq ans et ne se renouvelle pas automatiquement. Notez dès
              maintenant sa date d’expiration, prévoyez une nouvelle visite avant l’échéance si vous
              souhaitez conserver le classement, et maintenez le logement et ses équipements pendant
              toute la durée du classement.
            </p>

            <h2 className="mt-12 mb-4">Vous souhaitez accepter les Chèques-Vacances ?</h2>
            <p className="text-gray-700 leading-comfortable mb-4">
              Cette démarche est facultative. Le classement permet à un propriétaire de location
              meublée de déposer une demande de conventionnement auprès de l’ANCV. Ce
              conventionnement est nécessaire pour accepter les Chèques-Vacances, mais il n’est pas
              automatique.
            </p>
            <p className="text-gray-700 leading-comfortable mb-4">
              L’ANCV demande notamment une activité éligible, un numéro SIRET, un compte bancaire
              domicilié dans l’Union européenne et une preuve de classement pour une location
              meublée. La procédure est détaillée dans la{' '}
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

            <p className="text-gray-700 leading-comfortable mb-4">
              Après la décision de classement, l’essentiel tient en quelques vérifications :
              afficher le document dans le logement, actualiser sa déclaration, contrôler la taxe de
              séjour et renseigner correctement les plateformes qui la calculent. Il reste ensuite à
              conserver les documents et à anticiper l’échéance des cinq ans.
            </p>

            <div className="mt-12 mb-12 p-8 bg-primary-100 rounded-card border border-primary-200">
              <h2 className="text-h4 mb-3">Faire le point après le classement</h2>
              <p className="text-gray-700 mb-6">
                Retrouvez les réponses générales dans la FAQ ou estimez le montant de taxe de séjour
                selon la commune et la catégorie du logement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/faq" variant="primary">
                  Consulter la FAQ
                </Button>
                <Button href="/simulateur-taxe-sejour" variant="secondary">
                  Simuler ma taxe de séjour
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-h4 mb-3">Sources officielles</h2>
              <p className="text-sm text-gray-600 mb-4">
                Cet article s’appuie sur les textes officiels et centres d’aide suivants.
              </p>
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
          </div>
        </div>
      </section>
    </>
  );
}
