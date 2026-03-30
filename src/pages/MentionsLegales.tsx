import SEO from '../components/ui/SEO';

export default function MentionsLegales() {
  return (
    <>
      <SEO
        title="Mentions légales"
        description="Mentions légales et informations d'édition du site Etoilys."
      />
      <section className="py-section bg-white">
        <div className="container-adaptive max-w-4xl">
          <h1 className="mb-3">Mentions légales</h1>
          <p className="text-sm text-textLight mb-10">Dernière mise à jour : 27 mars 2026</p>

          <div className="space-y-10 text-textLight leading-comfortable">
            {/* Éditeur */}
            <div>
              <p className="mb-4">
                Le présent site, accessible notamment à l&apos;adresse{' '}
                <a
                  href="https://www.etoilys.fr"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.etoilys.fr
                </a>
                , est édité par :
              </p>
              <div className="bg-primary-100 rounded-card p-6 space-y-1 text-sm">
                <p>
                  <strong className="text-gray-800">ETOILYS</strong>, société par actions simplifiée
                  (SAS) au capital social de 2&nbsp;000&nbsp;€, immatriculée au RCS de Bergerac sous
                  le numéro 939&nbsp;330&nbsp;809, dont le siège social est situé 1345 route de
                  Dautre, 24150 Mauzac-et-Grand-Castang, France.
                </p>
                <p>SIRET : 939&nbsp;330&nbsp;809&nbsp;00012</p>
                <p>Numéro de TVA intracommunautaire : FR43939330809</p>
                <p>
                  Téléphone :{' '}
                  <a href="tel:+33649551540" className="text-primary hover:underline">
                    06 49 55 15 40
                  </a>
                </p>
                <p>
                  Adresse e-mail :{' '}
                  <a href="mailto:contact@etoilys.fr" className="text-primary hover:underline">
                    contact@etoilys.fr
                  </a>
                </p>
              </div>
              <p className="mt-4">Directeur de la publication : Florian Grisorio</p>
              <p>Responsable de la rédaction : Florian Grisorio</p>
            </div>

            {/* Hébergement */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Hébergement</h2>
              <p className="mb-3">Le site est hébergé par :</p>
              <div className="bg-primary-100 rounded-card p-6 text-sm space-y-0.5">
                <p className="font-semibold text-gray-800">Vercel Inc.</p>
                <p>440 N Barranca Ave #4133</p>
                <p>Covina, CA 91723</p>
                <p>États-Unis</p>
                <p>
                  Téléphone :{' '}
                  <a href="tel:+15592887060" className="text-primary hover:underline">
                    +1 559 288 7060
                  </a>
                </p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Propriété intellectuelle</h2>
              <p className="mb-3">
                L&apos;ensemble des éléments présents sur le site, notamment les textes, contenus,
                images, photographies, illustrations, logos, éléments graphiques, structure,
                arborescence, ainsi que leur mise en forme, sont, sauf mention contraire, la
                propriété exclusive d&apos;ETOILYS ou font l&apos;objet d&apos;un droit
                d&apos;utilisation.
              </p>
              <p>
                Toute reproduction, représentation, adaptation, traduction, diffusion ou
                exploitation, totale ou partielle, du site ou de l&apos;un quelconque de ses
                éléments, par quelque procédé que ce soit, sans autorisation écrite préalable
                d&apos;ETOILYS, est interdite, sauf dans les cas prévus par la loi.
              </p>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Responsabilité</h2>
              <p className="mb-3">
                ETOILYS s&apos;efforce de fournir sur le site des informations aussi précises et à
                jour que possible. Toutefois, ETOILYS ne saurait garantir l&apos;exactitude,
                l&apos;exhaustivité ou l&apos;actualité de l&apos;ensemble des informations
                diffusées sur le site.
              </p>
              <p className="mb-3">ETOILYS ne pourra être tenue responsable :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>des interruptions temporaires du site ;</li>
                <li>de la survenance de bogues ;</li>
                <li>
                  de toute inexactitude ou omission portant sur les informations disponibles sur le
                  site ;
                </li>
                <li>
                  de tout dommage résultant d&apos;une intrusion frauduleuse d&apos;un tiers ayant
                  entraîné une modification des informations mises à disposition sur le site ;
                </li>
                <li>
                  et, plus généralement, de tout dommage direct ou indirect résultant de
                  l&apos;accès au site ou de son utilisation.
                </li>
              </ul>
            </div>

            {/* Liens hypertextes */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Liens hypertextes</h2>
              <p className="mb-3">
                Le site peut contenir des liens vers des sites tiers. ETOILYS n&apos;exerce aucun
                contrôle sur ces sites et ne saurait être tenue responsable de leur contenu, de
                leurs politiques, de leur disponibilité ou des dommages pouvant résulter de leur
                consultation.
              </p>
              <p>
                La création de liens vers le site{' '}
                <a
                  href="https://www.etoilys.fr"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.etoilys.fr
                </a>{' '}
                est autorisée, sous réserve qu&apos;elle ne porte pas atteinte à l&apos;image, aux
                intérêts ou aux droits d&apos;ETOILYS et qu&apos;elle ne crée aucune confusion sur
                la nature des services proposés.
              </p>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Données personnelles</h2>
              <p className="mb-3">
                ETOILYS peut être amenée à collecter des données personnelles via le site, notamment
                au moyen des formulaires de contact et de demande de classement.
              </p>
              <p className="mb-3">
                Les traitements de données mis en œuvre via le site sont encadrés par la{' '}
                <a href="/confidentialite" className="text-primary hover:underline">
                  Politique de confidentialité
                </a>{' '}
                d&apos;ETOILYS, que l&apos;utilisateur est invité à consulter pour obtenir
                l&apos;ensemble des informations relatives :
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>aux données collectées ;</li>
                <li>aux finalités des traitements ;</li>
                <li>aux bases légales ;</li>
                <li>aux destinataires des données ;</li>
                <li>aux durées de conservation ;</li>
                <li>et aux droits des personnes concernées.</li>
              </ul>
            </div>

            {/* Cookies et traceurs */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Cookies et traceurs</h2>
              <p className="mb-3">
                Le site peut utiliser des cookies ou autres traceurs nécessaires à son
                fonctionnement, à la mesure d&apos;audience ou à l&apos;amélioration de
                l&apos;expérience utilisateur.
              </p>
              <p>
                Lorsque la réglementation applicable l&apos;exige, le consentement de
                l&apos;utilisateur est recueilli préalablement au dépôt des cookies non strictement
                nécessaires. L&apos;utilisateur peut à tout moment modifier ses préférences via le
                mécanisme prévu à cet effet sur le site.
              </p>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Droit applicable</h2>
              <p className="mb-3">
                Les présentes mentions légales sont soumises au droit français.
              </p>
              <p>
                En cas de litige et à défaut de résolution amiable préalable, les juridictions
                françaises seront seules compétentes, sous réserve des dispositions légales
                impératives contraires.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-h4 font-semibold text-gray-800 mb-3">Contact</h2>
              <p>
                Pour toute question relative au site ou à son contenu, vous pouvez contacter ETOILYS
                à l&apos;adresse suivante :{' '}
                <a href="mailto:contact@etoilys.fr" className="text-primary hover:underline">
                  contact@etoilys.fr
                </a>{' '}
                ou par téléphone au{' '}
                <a href="tel:+33649551540" className="text-primary hover:underline">
                  06 49 55 15 40
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
