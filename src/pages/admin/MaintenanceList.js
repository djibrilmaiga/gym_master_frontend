import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import MaintenanceService from '../../services/MaintenanceService';

const MaintenanceList = () => {
    const [maintenances, setMaintenances] = useState([]);
    const navigate = useNavigate();
  
    // Fonction pour récupérer les maintenances via l'API
    const fetchMaintenances = async () => {
      try {
        const response = await MaintenanceService.getAllMaintenances();
        setMaintenances(response.data); 
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances :", error);
      }
    };
  
    useEffect(() => {
      fetchMaintenances();
    }, []);
  
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?");
        if (confirmed) {
          try {
            await MaintenanceService.deleteMaintenance(id); // Appel API pour suppression
            setMaintenances(maintenances.filter((maintenance) => maintenance.maintenanceId !== id));
          } catch (error) {
            console.error("Erreur lors de la suppression de la maintenance :", error);
          }
        }
    };
  
    const handleConsult = (id) => {
      navigate(`/admin/maintenance-hist/${id}`);
    }

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/equipement' class="nav-link" >Créer un équipement</Link></li>
                        <li class="nav-item"><Link to='/admin/equipement-list' class="nav-link">Gestion des équipements</Link></li>
                        <li class="nav-item"><Link to='/admin/technicien' class="nav-link">Techniciens</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance' class="nav-link">Planifier une maintenance</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance-hist' class="nav-link active">Historique des maintenances</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container-fluid">
                    <h2>Historique des Maintenances</h2>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Numéro de série</th>
                                <th>Nom de l'équipement</th>
                                <th>Date de la maintenance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenances.length > 0 ? (
                            maintenances.map((maintenance) => (
                                <tr key={maintenance.maintenanceId}>
                                    <td>{maintenance.numSerieExemplaire}</td>
                                    <td>{maintenance.nomEquipement}</td>
                                    <td>{new Date(maintenance.dateMaintenance).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                                    <td>
                                        <button
                                        className="btn btn-sm btn-info mx-1"
                                        onClick={() => handleConsult(maintenance.maintenanceId)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(maintenance.maintenanceId)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="4">Aucune maintenance trouvée.</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
  )
}

export default MaintenanceList