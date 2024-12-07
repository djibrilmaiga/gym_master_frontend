import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginForm from './components/LoginForm';
import DashManager from './pages/manager/DashManager';
import Abonne from './pages/manager/Abonne';
import AbonneDetails from './pages/manager/AbonneDetails';
import CreateAbonne from './pages/manager/CreateAbonne';
import SuiviAbonnement from './pages/manager/SuiviAbonnement';
import PaiementList from './pages/manager/PaiementList';
import PaiementDetails from './pages/manager/PaiementDetails';
import PaiementCreate from './pages/manager/PaiementCreate';
import PaiementRapport from './pages/manager/PaiementRapport';
import CalendrierCours from './pages/manager/CalendrierCours';
import InscrireAbonneCours from './pages/manager/InscrireAbonneCours';
import ListeParticipantsCours from './pages/manager/ListeParticipantsCours';
import ListeCours from './pages/manager/ListeCours';
import SeanceDetails from './pages/manager/SeanceDetails';
import Equipements from './pages/manager/Equipements';
import EquipmentDetails from './pages/manager/EquipementDetails';
import EquipementPanne from './pages/manager/EquipementPanne';
import DashAdmin from './pages/admin/DashAdmin';
import UserForm from './pages/admin/UserForm';
import UsersList from './pages/admin/UsersList';
import Service from './pages/admin/Service';
import ServiceList from './pages/admin/ServiceList';
import PaiementListAdm from './pages/admin/PaiementList';
import CoursList from './pages/admin/CoursList';
import CoachCreate from './pages/admin/CoachCreate';
import CoachList from './pages/admin/CoachList';
import EquipementCreate from './pages/admin/EquipementCreate';
import EquipementList from './pages/admin/EquipementList';
import EquipementTech from './pages/admin/EquipementTech';
import MaintenanceCreate from './pages/admin/MaintenanceCreate';
import MaintenanceList from './pages/admin/MaintenanceList';
import MaintenanceDetails from './pages/admin/MaintenanceDetails';
import RapportsStat from './pages/admin/RapportsStat';
import RapportFinance from './pages/admin/RapportFinance';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Path pour la page de connexion */}
        <Route path='/' element={<LoginForm />} />

        {/* Path pour le manager */}
        <Route element={<PrivateRoute roles={['MANAGER']} />}>
          <Route path='/dashboard' element={<DashManager />} />
          <Route path='/abonne' element={<Abonne />} />
          <Route path='/abonne/:id' element={<AbonneDetails />} />
          <Route path='/abonne-add'element={<CreateAbonne />}/>
          <Route path='/abonnement'element={<SuiviAbonnement />}/>
          <Route path='/paiement' element={<PaiementList />} />
          <Route path='/paiement/:id' element={<PaiementDetails />} />
          <Route path='/paiement-add' element={<PaiementCreate />} />
          <Route path='/rapport-finance' element={<PaiementRapport />} />
          <Route path='/cours-calendrier' element={<CalendrierCours />} />
          <Route path='/cours-add-abonne' element={<InscrireAbonneCours />} />
          <Route path='/cours-participation' element={<ListeParticipantsCours />} />
          <Route path='/cours' element={<ListeCours />} />
          <Route path='/cours/:id' element={<SeanceDetails />} />
          <Route path='/equipement' element={<Equipements />} />
          <Route path='/equipement/:id' element={<EquipmentDetails />} />
          <Route path='/equipement-add' element={<EquipementPanne />} />
        </Route>

        {/* Path pour l'admin */}
        <Route element={<PrivateRoute roles={['ADMIN']} />}>
          <Route path='/admin/dashboard' element={<DashAdmin />} />
          <Route path='/admin/user-add' element={<UserForm />} />
          <Route path='/admin/user-list' element={<UsersList />} />
          <Route path='/admin/service' element={<Service />} />
          <Route path='/admin/service-list' element={<ServiceList />} />
          <Route path='/admin/paiement' element={<PaiementListAdm />} />
          <Route path='/admin/cours-historique' element={<CoursList/>} />
          <Route path='/admin/coach-create' element={<CoachCreate />} />
          <Route path='/admin/coach-list' element={<CoachList />} />
          <Route path='/admin/equipement' element={<EquipementCreate />} />
          <Route path='/admin/equipement-list' element={<EquipementList />} />
          <Route path='/admin/technicien' element={<EquipementTech />} />
          <Route path='/admin/maintenance' element={<MaintenanceCreate />} />
          <Route path='/admin/maintenance-hist' element={<MaintenanceList />} />
          <Route path='/admin/maintenance-hist/:id' element={<MaintenanceDetails />} />
          <Route path='/admin/rapport' element={<RapportsStat />} />
          <Route path='/admin/rapport-finance' element={<RapportFinance />} />
        </Route>

        {/* Gestion des accès non autorisés */}
        <Route path='/unauthorized' element={<h2>Accès non autorisé</h2>} />
      </Routes>
    </Router>
  );
}

export default App;