import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MaintenanceService from '../../services/MaintenanceService';

const MaintenanceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilisation de useEffect pour charger les détails de la maintenance au montage du composant
  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      try {
        const response = await MaintenanceService.getMaintenanceById(id);
        setMaintenance(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des détails de la maintenance.');
      } finally {
        setLoading(false); // Arrête l'état de chargement une fois la requête terminée
      }
    };

    fetchMaintenanceDetails();
  }, [id]);

  if (loading) {
    return <p>Chargement des détails de la maintenance...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!maintenance) {
    return <p>Aucune information trouvée pour cette maintenance.</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Détails de la Maintenance</h2>
      <button className="btn btn-danger mb-4" onClick={() => navigate(-1)}>
        Retour
      </button>
      <div className="tab-content mt-3">
        <div className="tab-pane fade show active">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Informations sur la Maintenance</h5>
              <p><strong>Numéro de série :</strong> {maintenance.numSerieExemplaire}</p>
              <p><strong>Équipement :</strong> {maintenance.nomEquipement}</p>
              <p><strong>Date de la maintenance :</strong> {maintenance.dateMaintenance}</p>
              <p><strong>Coût (FCFA) :</strong> {maintenance.coutMaintenance}</p>
              <p><strong>Technicien :</strong> {maintenance.prenomTechnicien} {maintenance.nomTechnicen}</p>
              <p><strong>Description :</strong> {maintenance.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;