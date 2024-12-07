import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import TechnicienService from '../../services/TechnicienService';
import MaintenanceService from '../../services/MaintenanceService';
import ExemplaireService from '../../services/ExemplaireService';

const MaintenanceCreate = () => {
  const [technicians, setTechnicians] = useState([]);
  const [exemplaires, setExemplaires] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [formData, setFormData] = useState({
      exemplaireId: '',
      technicienId: '',
      dateDebut: '',
      cout: '',
      rapport: ''
  });

    useEffect(() => {
        // Récupérer la liste des techniciens
        const fetchTechnicians = async () => {
            try {
                const response = await TechnicienService.getAllTechniciens();
                setTechnicians(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des techniciens", error);
            }
        };

        // Récupérer la liste des exemplaires en panne
        const fetchExemplaires = async () => {
            try {
                const response = await ExemplaireService.getAllExemplaires();
                const exemplairesEnPanne = response.data.filter(exemplaire => exemplaire.etat === 'En_panne');
                setExemplaires(exemplairesEnPanne);
            } catch (error) {
                console.error("Erreur lors de la récupération des exemplaires", error);
            }
        };

        fetchTechnicians();
        fetchExemplaires();
    }, []);

    // Gestion des champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "exemplaireId") {
        // Trouver l'équipement correspondant à l'exemplaire sélectionné
        const selectedExemplaire = exemplaires.find(exemplaire => exemplaire.exemplaireId.toString() === value);
        if (selectedExemplaire) {
            setSelectedEquipement(selectedExemplaire.nomEquipement); // Mettre à jour le nom de l'équipement
        } else {
            setSelectedEquipement('');
        }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { exemplaireId, technicienId, dateDebut, cout, rapport } = formData;

        const maintenanceData = {
            dateDebut,
            cout: parseFloat(cout), // S'assurer que le coût est un nombre
            rapport
        };

        try {
            await MaintenanceService.createMaintenance(exemplaireId, technicienId, maintenanceData);
            alert('Maintenance créée avec succès!');
            setFormData({
                exemplaireId: '',
                technicienId: '',
                dateDebut: '',
                cout: '',
                rapport: ''
            });
            setSelectedEquipement(''); // Réinitialiser le nom de l'équipement après soumission
        } catch (error) {
            console.error("Erreur lors de la création de la maintenance", error);
        }
    };

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
                        <li class="nav-item"><Link to='/admin/maintenance' class="nav-link active">Planifier une maintenance</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance-hist' class="nav-link">Historique des maintenances</Link></li>
                    </ul>
                </nav>
            </div>
          <section className='section'>
            <div className="container mt-4">
                <h3>Planifier une Maintenance</h3>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Date de la maintenance et coût */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="dateDebut" className="form-label">Date prévue pour la maintenance</label>
                                    <input 
                                        type="date"
                                        id="dateDebut"
                                        name="dateDebut"
                                        className="form-control"
                                        value={formData.dateDebut}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cout" className="form-label">Coût (en FCFA)</label>
                                    <input 
                                        type="number"
                                        id="cout"
                                        name="cout"
                                        className="form-control"
                                        value={formData.cout}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Liste des exemplaires en panne et sélection du technicien */}
                            <div className="row">
                            <div className="col-md-4 mb-3">
                                    <label htmlFor="exemplaireId" className="form-label">Numéro de série de l'exemplaire (en panne)</label>
                                    <select
                                        id="exemplaireId"
                                        name="exemplaireId"
                                        className="form-select"
                                        value={formData.exemplaireId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Sélectionnez un exemplaire</option>
                                        {exemplaires.length > 0 ? (
                                            exemplaires.map((exemplaire) => (
                                                <option key={exemplaire.exemplaireId} value={exemplaire.exemplaireId}>
                                                    {exemplaire.numSerie}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Aucun exemplaire en panne</option>
                                        )}
                                    </select>
                                </div>

                                {/* Affichage du nom de l'équipement */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Nom de l'équipement associé</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={selectedEquipement} 
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="technicienId" className="form-label">Technicien</label>
                                    <select 
                                        id="technicienId"
                                        name="technicienId"
                                        className="form-select"
                                        value={formData.technicienId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Sélectionnez un technicien</option>
                                        {technicians.map((technician) => (
                                            <option key={technician.id} value={technician.id}>
                                                {technician.prenom} {technician.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description de la maintenance */}
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="rapport" className="form-label">Description</label>
                                    <textarea 
                                        id="rapport"
                                        name="rapport"
                                        className="form-control"
                                        rows="4"
                                        value={formData.rapport}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="row">
                                <div className="col-md-12 text-end">
                                    <button type="submit" className="btn btn-primary">Planifier Maintenance</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          </section>
        </div>
    </div>
  )
}

export default MaintenanceCreate;