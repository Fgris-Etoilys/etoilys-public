import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Classement from './pages/Classement';
import PourquoiClasser from './pages/PourquoiClasser';
import Procedure from './pages/Procedure';
import Simulateur from './pages/Simulateur';
import FAQ from './pages/FAQ';
import Equipe from './pages/Equipe';
import Actualites from './pages/Actualites';
import Recrutement from './pages/Recrutement';
import Contact from './pages/Contact';
import DemandeClassement from './pages/DemandeClassement';
import Confidentialite from './pages/Confidentialite';
import MentionsLegales from './pages/MentionsLegales';
import Cgu from './pages/Cgu';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classement" element={<Classement />} />
          <Route path="pourquoi-classer" element={<PourquoiClasser />} />
          <Route path="procedure" element={<Procedure />} />
          <Route path="simulateur" element={<Simulateur />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="equipe" element={<Equipe />} />
          <Route path="actualites" element={<Actualites />} />
          <Route path="recrutement" element={<Recrutement />} />
          <Route path="contact" element={<Contact />} />
          <Route path="demande-classement" element={<DemandeClassement />} />
          <Route path="confidentialite" element={<Confidentialite />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="cgu" element={<Cgu />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
