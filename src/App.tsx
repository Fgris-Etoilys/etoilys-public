import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Classement from './pages/Classement';
import PourquoiClasser from './pages/PourquoiClasser';
import Prerequis from './pages/Prerequis';
import Procedure from './pages/Procedure';
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
// import Recrutement from './pages/Recrutement'; // TODO: réactiver quand la page sera prête
import Contact from './pages/Contact';
import DemandeClassement from './pages/DemandeClassement';
import Confidentialite from './pages/Confidentialite';
import MentionsLegales from './pages/MentionsLegales';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classement" element={<Classement />} />
          <Route path="les-avantages-du-classement" element={<PourquoiClasser />} />
          <Route path="prerequis-au-classement" element={<Prerequis />} />
          <Route path="procedure" element={<Procedure />} />
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
          {/* <Route path="recrutement" element={<Recrutement />} /> */}
          {/* TODO: réactiver quand la page sera prête */}
          <Route path="contact" element={<Contact />} />
          <Route path="demande-classement" element={<DemandeClassement />} />
          <Route path="confidentialite" element={<Confidentialite />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
