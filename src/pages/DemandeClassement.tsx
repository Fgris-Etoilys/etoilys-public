import { useLocation } from 'react-router-dom';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { COFRAC_ACCREDITATION_URL } from '../content/accreditationLinks';
import { getLocaleFromPath } from '../i18n/routeHelpers';

export default function DemandeClassement() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Demande de classement</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Déposez votre demande en quelques minutes. Etoilys vous recontacte sous 24 heures
              ouvrées pour confirmer les modalités de visite, le tarif applicable et les prochaines
              disponibilités avant toute validation.
            </p>
            <p className="mt-4 text-white/80">Vous pouvez également contacter le 06 49 55 15 40</p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <DemandeClassementForm locale={locale} />
            </div>

            <div>
              <div className="sticky top-24">
                <div className="bg-primary-100 rounded-card p-8 mb-6">
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-6">
                    Pourquoi confier votre classement à Etoilys ?
                  </h3>
                  <ul className="space-y-4 text-textLight leading-comfortable">
                    <li className="flex gap-3">
                      <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
                      <span>Organisme accrédité Cofrac Inspection</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
                      <span>Accompagnement personnalisé à chaque étape</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
                      <span>Procédure simple, sans dossier à constituer</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
                      <span>Réactivité et fiabilité</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary-300 font-bold flex-shrink-0">✓</span>
                      <span>Visite planifiée rapidement</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <img
                    src="/Inspection_RVB.jpg"
                    alt="Marque d’accréditation Cofrac Inspection"
                    width={1440}
                    height={2399}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-auto flex-shrink-0"
                  />
                  <p className="text-sm text-gray-600 leading-snug">
                    Accréditation n°3-2394
                    <br />
                    Portée disponible sur
                    <br />
                    <a
                      href={COFRAC_ACCREDITATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-300 hover:underline"
                    >
                      www.cofrac.fr
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
