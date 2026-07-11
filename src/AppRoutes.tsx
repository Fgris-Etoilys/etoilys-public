import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Classement from './pages/Classement';
import PourquoiClasser from './pages/PourquoiClasser';
import Prerequis from './pages/Prerequis';
import Procedure from './pages/Procedure';
import ZonesIntervention from './pages/ZonesIntervention';
import ClassementDordogne from './pages/locales/ClassementDordogne';
import ClassementGironde from './pages/locales/ClassementGironde';
import ClassementLotEtGaronne from './pages/locales/ClassementLotEtGaronne';
import SimulateurTaxeSejour from './pages/SimulateurTaxeSejour';
import SimulateurFiscalClassement from './pages/SimulateurFiscalClassement';
import Simulateur from './pages/Simulateur';
import SimulationClassement from './pages/SimulationClassement';
import FAQ from './pages/FAQ';
// import Equipe from './pages/Equipe'; // TODO: réactiver quand la page sera prête
import Actualites from './pages/Actualites';
import ArticleMeubles20252026 from './pages/actualites/MeublesChangements20252026';
import ArticleMicroBic2026 from './pages/actualites/MicroBic2026';
import ArticleResidencePrincipale90Jours from './pages/actualites/ResidencePrincipale90Jours';
import ArticleCoproprieteLocationTouristique from './pages/actualites/CoproprieteLocationTouristique';
import ArticleTaxeDeSejour2026 from './pages/actualites/TaxeDeSejour2026';
import ArticleMeubleClasseNonClasseSeuils from './pages/actualites/MeubleClasseNonClasseSeuils';
import ArticleFacturationElectronique2026 from './pages/actualites/FacturationElectronique2026';
import ArticleDpeMeublesTourisme from './pages/actualites/DpeMeublesTourisme';
import ArticleApiMeubles from './pages/actualites/ApiMeublesDeclarationMeubleTourisme';
import ArticleTransmissionDonneesPlateformesCommunes from './pages/actualites/TransmissionDonneesPlateformesCommunes';
import ArticleQueFaireApresClassementMeubleTourisme from './pages/actualites/QueFaireApresClassementMeubleTourisme';
import Recrutement from './pages/Recrutement';
import Contact from './pages/Contact';
import DemandeClassement from './pages/DemandeClassement';
import Confidentialite from './pages/Confidentialite';
import MentionsLegales from './pages/MentionsLegales';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="classement" element={<Classement />} />
        <Route path="les-avantages-du-classement" element={<PourquoiClasser />} />
        <Route path="prerequis-au-classement" element={<Prerequis />} />
        <Route path="procedure" element={<Procedure />} />
        <Route path="zones-intervention" element={<ZonesIntervention />} />
        <Route path="classement-meuble-tourisme-dordogne" element={<ClassementDordogne />} />
        <Route path="classement-meuble-tourisme-gironde" element={<ClassementGironde />} />
        <Route
          path="classement-meuble-tourisme-lot-et-garonne"
          element={<ClassementLotEtGaronne />}
        />
        <Route path="simulateur-taxe-sejour" element={<SimulateurTaxeSejour />} />
        <Route path="simulateur-fiscal-classement" element={<SimulateurFiscalClassement />} />
        <Route path="simulateur" element={<Simulateur />} />
        <Route path="simulateur/:simulationId" element={<SimulationClassement />} />
        <Route path="faq" element={<FAQ />} />
        {/* <Route path="equipe" element={<Equipe />} /> */}
        {/* TODO: réactiver quand la page sera prête */}
        <Route path="actualites" element={<Actualites />} />
        <Route
          path="actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026"
          element={<ArticleMeubles20252026 />}
        />
        <Route
          path="actualites/micro-bic-2026-meuble-classe-vs-non-classe"
          element={<ArticleMicroBic2026 />}
        />
        <Route
          path="actualites/airbnb-residence-principale-limite-90-jours"
          element={<ArticleResidencePrincipale90Jours />}
        />
        <Route
          path="actualites/copropriete-location-touristique-reglement"
          element={<ArticleCoproprieteLocationTouristique />}
        />
        <Route
          path="actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne"
          element={<ArticleTaxeDeSejour2026 />}
        />
        <Route
          path="actualites/meuble-classe-non-classe-seuils-micro-bic"
          element={<ArticleMeubleClasseNonClasseSeuils />}
        />
        <Route
          path="actualites/facturation-electronique-2026-proprietaires-meubles"
          element={<ArticleFacturationElectronique2026 />}
        />
        <Route
          path="actualites/dpe-meubles-tourisme-2026-2034"
          element={<ArticleDpeMeublesTourisme />}
        />
        <Route
          path="actualites/api-meubles-declaration-meuble-tourisme"
          element={<ArticleApiMeubles />}
        />
        <Route
          path="actualites/airbnb-booking-abritel-donnees-communes-api-meubles"
          element={<ArticleTransmissionDonneesPlateformesCommunes />}
        />
        <Route
          path="actualites/que-faire-apres-classement-meuble-tourisme"
          element={<ArticleQueFaireApresClassementMeubleTourisme />}
        />
        <Route path="recrutement" element={<Recrutement />} />
        <Route path="contact" element={<Contact />} />
        <Route path="demande-classement" element={<DemandeClassement />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="en" element={<Home />} />
        <Route path="en/furnished-tourist-accommodation-classification" element={<Classement />} />
        <Route
          path="en/benefits-of-furnished-tourist-accommodation-classification"
          element={<PourquoiClasser />}
        />
        <Route path="en/classification-requirements" element={<Prerequis />} />
        <Route path="en/classification-process" element={<Procedure />} />
        <Route path="en/faq" element={<FAQ />} />
        <Route path="en/contact" element={<Contact />} />
        <Route path="en/request-a-classification" element={<DemandeClassement />} />
        <Route path="en/privacy-policy" element={<Confidentialite />} />
        <Route path="en/tourist-tax-simulator" element={<SimulateurTaxeSejour />} />
        <Route
          path="en/furnished-tourist-accommodation-tax-simulator"
          element={<SimulateurFiscalClassement />}
        />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
