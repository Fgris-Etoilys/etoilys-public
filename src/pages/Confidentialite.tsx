export default function Confidentialite() {
  return (
    <>
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-4xl">
          <h1 className="mb-3">Politique de confidentialité</h1>
          <p className="text-sm text-textLight mb-10">Dernière mise à jour : 29 mars 2026</p>

          <div className="space-y-10 text-textLight leading-comfortable">
            {/* Intro */}
            <div className="space-y-4">
              <p>
                La présente politique de confidentialité décrit la manière dont ETOILYS collecte et
                traite les données personnelles des utilisateurs du site{' '}
                <a
                  href="https://www.etoilys.fr"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.etoilys.fr
                </a>
                , notamment lorsqu&apos;ils utilisent le formulaire de contact ou le formulaire de
                demande de classement.
              </p>
              <p>
                ETOILYS attache une importance particulière à la protection des données personnelles
                et s&apos;engage à traiter ces données de manière licite, loyale, transparente et
                proportionnée aux finalités poursuivies.
              </p>
            </div>

            {/* 1. Responsable du traitement */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                1. Responsable du traitement
              </h2>
              <p className="mb-4">Le responsable du traitement est :</p>
              <div className="bg-primary-100 rounded-card p-6 text-sm space-y-0.5 mb-4">
                <p className="font-semibold text-gray-800">ETOILYS</p>
                <p>SAS au capital social de 2&nbsp;000&nbsp;€</p>
                <p>RCS Bergerac 939&nbsp;330&nbsp;809</p>
                <p>Siège social : 1345 route de Dautre, 24150 Mauzac-et-Grand-Castang, France</p>
                <p>
                  E-mail :{' '}
                  <a href="mailto:contact@etoilys.fr" className="text-primary hover:underline">
                    contact@etoilys.fr
                  </a>
                </p>
                <p>
                  Téléphone :{' '}
                  <a href="tel:+33649551540" className="text-primary hover:underline">
                    06 49 55 15 40
                  </a>
                </p>
              </div>
              <p>
                Pour toute question relative à la présente politique ou au traitement de vos données
                personnelles, vous pouvez nous contacter à l&apos;adresse suivante :{' '}
                <a href="mailto:contact@etoilys.fr" className="text-primary hover:underline">
                  contact@etoilys.fr
                </a>
                .
              </p>
            </div>

            {/* 2. Données collectées */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                2. Données personnelles collectées
              </h2>
              <p className="mb-3">
                Selon les formulaires et les échanges, ETOILYS peut collecter les catégories de
                données suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 mb-4">
                <li>
                  <strong className="text-gray-700">
                    données d&apos;identification et de contact
                  </strong>{' '}
                  : nom, prénom, adresse e-mail, numéro de téléphone ;
                </li>
                <li>
                  <strong className="text-gray-700">données relatives à votre demande</strong> :
                  objet de la demande, contenu du message, informations sur votre projet de
                  classement ;
                </li>
                <li>
                  <strong className="text-gray-700">données relatives au meublé concerné</strong> :
                  adresse du bien, caractéristiques utiles à l&apos;étude de la demande, et plus
                  largement toute information que vous choisissez de nous transmettre ;
                </li>
                <li>
                  <strong className="text-gray-700">
                    données techniques liées à l&apos;utilisation du site
                  </strong>{' '}
                  : adresse IP, journaux techniques, données de sécurité, informations nécessaires à
                  la prévention des abus et au fonctionnement des formulaires ;
                </li>
                <li>
                  <strong className="text-gray-700">
                    données issues d&apos;un dispositif anti-spam ou anti-bot
                  </strong>
                  , lorsque ce mécanisme est utilisé pour sécuriser l&apos;envoi des formulaires.
                </li>
              </ul>
              <p>
                ETOILYS veille à ne collecter que les données strictement nécessaires au traitement
                des demandes qui lui sont adressées.
              </p>
            </div>

            {/* 3. Finalités et bases légales */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                3. Finalités et bases légales des traitements
              </h2>
              <p className="mb-4">
                Vos données personnelles sont traitées pour les finalités suivantes :
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    a) Répondre à vos demandes envoyées via le formulaire de contact
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Base légale :</span> intérêt légitime
                    d&apos;ETOILYS à répondre aux sollicitations reçues ou, selon la nature de la
                    demande, mesures précontractuelles prises à votre demande.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    b) Étudier et traiter vos demandes de classement ou de devis
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Base légale :</span> mesures précontractuelles
                    prises à votre demande et, le cas échéant, exécution du contrat si une relation
                    contractuelle est engagée.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    c) Assurer le suivi administratif et commercial de la relation
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Base légale :</span> exécution du contrat, mesures
                    précontractuelles ou intérêt légitime selon le stade de la relation.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    d) Sécuriser le site, prévenir le spam, les envois automatisés et les usages
                    abusifs
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Base légale :</span> intérêt légitime
                    d&apos;ETOILYS à protéger son site, ses formulaires et ses services. La CNIL
                    cite d&apos;ailleurs les mesures de type CAPTCHA parmi les mesures pouvant être
                    mobilisées dans un objectif légitime de protection technique.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    e) Respecter les obligations légales, comptables, fiscales ou probatoires
                    applicables
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Base légale :</span> obligation légale.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Destinataires */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                4. Destinataires des données
              </h2>
              <p className="mb-3">
                Les données personnelles collectées sont destinées uniquement aux personnes
                habilitées au sein d&apos;ETOILYS, dans la limite de ce qui est nécessaire à la
                gestion de votre demande.
              </p>
              <p className="mb-3">
                Elles peuvent également être transmises à des prestataires techniques agissant pour
                le compte d&apos;ETOILYS, notamment pour :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
                <li>l&apos;hébergement et l&apos;exploitation technique du site ;</li>
                <li>le traitement technique des formulaires ;</li>
                <li>l&apos;envoi et l&apos;acheminement d&apos;e-mails ;</li>
                <li>la sécurisation des formulaires et la prévention des abus ;</li>
                <li>le stockage technique ou la gestion des journaux applicatifs.</li>
              </ul>
              <p className="mb-3">
                À ce titre, le site peut notamment s&apos;appuyer sur les services suivants, selon
                sa configuration effective :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
                <li>
                  <strong className="text-gray-700">Vercel</strong> pour l&apos;hébergement et
                  l&apos;exploitation du site ;
                </li>
                <li>
                  <strong className="text-gray-700">Supabase</strong> pour certaines fonctions
                  techniques ou de traitement ;
                </li>
                <li>
                  <strong className="text-gray-700">Resend</strong> pour l&apos;acheminement de
                  courriels ;
                </li>
                <li>
                  <strong className="text-gray-700">Cloudflare Turnstile</strong> pour la protection
                  anti-bot des formulaires.
                </li>
              </ul>
              <p>ETOILYS ne vend pas vos données personnelles à des tiers.</p>
            </div>

            {/* 5. Transferts hors UE */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                5. Transferts de données hors Union européenne
              </h2>
              <p className="mb-3">
                Certains prestataires techniques utilisés par ETOILYS peuvent être situés ou traiter
                certaines données en dehors de l&apos;Union européenne ou de l&apos;Espace
                économique européen.
              </p>
              <p className="mb-3">
                Lorsque de tels transferts ont lieu, ETOILYS veille à ce qu&apos;ils soient encadrés
                par des garanties appropriées, par exemple :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>des clauses contractuelles types approuvées par la Commission européenne ;</li>
                <li>
                  ou, lorsque cela est applicable, un mécanisme reconnu comme le Data Privacy
                  Framework.
                </li>
              </ul>
            </div>

            {/* 6. Durées de conservation */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                6. Durées de conservation
              </h2>
              <p className="mb-3">
                ETOILYS ne conserve vos données personnelles que pendant la durée nécessaire aux
                finalités poursuivies, puis pendant les durées requises pour satisfaire à ses
                obligations légales ou pour défendre ses droits.
              </p>
              <p className="mb-3">À titre principal :</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  les données relatives à une demande de contact ou à une demande de classement sans
                  suite contractuelle sont conservées pendant le temps nécessaire au traitement de
                  la demande, puis peuvent être conservées jusqu&apos;à 3 ans à compter du dernier
                  contact émanant de la personne concernée, à des fins de suivi commercial ou de
                  reprise de contact ;
                </li>
                <li>
                  en cas de relation contractuelle, les données sont conservées pendant la durée de
                  la relation, puis archivées pendant les durées légales applicables ;
                </li>
                <li>
                  les contrats et la correspondance commerciale peuvent être conservés pendant 5 ans
                  ;
                </li>
                <li>les factures et pièces comptables sont conservées pendant 10 ans ;</li>
                <li>
                  les informations nécessaires à la gestion d&apos;une opposition à la prospection
                  peuvent être conservées pendant 3 ans afin de tenir compte de votre choix.
                </li>
              </ul>
            </div>

            {/* 7. Sécurité */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">7. Sécurité des données</h2>
              <p>
                ETOILYS met en œuvre des mesures techniques et organisationnelles appropriées afin
                de préserver la sécurité, l&apos;intégrité et la confidentialité des données
                personnelles, et de prévenir notamment leur altération, leur perte, leur divulgation
                ou leur accès non autorisé.
              </p>
            </div>

            {/* 8. Vos droits */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">8. Vos droits</h2>
              <p className="mb-3">
                Conformément à la réglementation applicable, vous disposez, selon les cas, des
                droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 mb-4">
                <li>droit d&apos;accès à vos données ;</li>
                <li>droit de rectification ;</li>
                <li>droit à l&apos;effacement ;</li>
                <li>droit à la limitation du traitement ;</li>
                <li>droit d&apos;opposition ;</li>
                <li>droit à la portabilité des données lorsque celui-ci est applicable ;</li>
                <li>
                  droit de retirer votre consentement à tout moment lorsque le traitement repose sur
                  le consentement.
                </li>
              </ul>
              <p className="mb-3">
                Vous pouvez exercer vos droits en écrivant à :{' '}
                <a href="mailto:contact@etoilys.fr" className="text-primary hover:underline">
                  contact@etoilys.fr
                </a>
              </p>
              <p className="mb-3">
                En cas de doute raisonnable sur votre identité, un justificatif pourra vous être
                demandé afin de sécuriser le traitement de votre demande.
              </p>
              <p className="mb-3">
                ETOILYS s&apos;efforcera de répondre dans les meilleurs délais et, en tout état de
                cause, dans le délai légal maximal applicable. La CNIL rappelle que ce délai est en
                principe d&apos;un mois.
              </p>
              <p>
                Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés,
                vous pouvez introduire une réclamation auprès de la{' '}
                <a
                  href="https://www.cnil.fr"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CNIL
                </a>
                .
              </p>
            </div>

            {/* 9. Cookies */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                9. Cookies et autres traceurs
              </h2>
              <p className="mb-3">
                Le site peut utiliser des cookies ou autres traceurs nécessaires à son
                fonctionnement, à sa sécurité ou à la soumission des formulaires.
              </p>
              <p className="mb-3">
                Conformément aux règles rappelées par la CNIL, certains traceurs peuvent être
                dispensés de consentement lorsqu&apos;ils sont strictement nécessaires au
                fonctionnement du service demandé ou à certaines finalités techniques admises. En
                revanche, les cookies ou traceurs non strictement nécessaires ne peuvent être
                déposés qu&apos;après recueil de votre consentement.
              </p>
              <p>
                Si ETOILYS met en place des outils de mesure d&apos;audience ou d&apos;autres
                traceurs non exemptés, un mécanisme de gestion de vos choix vous permettra de les
                accepter, de les refuser ou de modifier vos préférences. La CNIL rappelle par
                ailleurs que certaines solutions de mesure d&apos;audience peuvent être exemptées de
                consentement uniquement sous conditions strictes.
              </p>
            </div>

            {/* 10. Modification */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">
                10. Modification de la politique
              </h2>
              <p className="mb-3">
                ETOILYS peut modifier la présente politique de confidentialité à tout moment,
                notamment pour tenir compte d&apos;évolutions légales, réglementaires, techniques ou
                de changements dans les traitements mis en œuvre sur le site.
              </p>
              <p>
                La version applicable est celle publiée sur le site à la date de votre consultation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
