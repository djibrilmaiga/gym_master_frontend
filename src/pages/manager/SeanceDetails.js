import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SeanceService from '../../services/SeanceService';

const SeanceDetails = () => {
  const { id } = useParams();
  const [seance, setSeance] = useState(null);
  const [activeTab, setActiveTab] = useState('detailsCours');
  const navigate = useNavigate();

  // Chargement des données via API
  useEffect(() => {
    SeanceService.getSeanceById(id)
      .then(response => {
        setSeance(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des détails de la séance:", error);
      });
  }, [id]);

  // UX chargement de la page
  if (!seance) {
    return <div>Chargement...</div>;
  }

  // Gestion des onglets
  const renderContent = () => {
    switch (activeTab) {
      case 'detailsCours':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Détails du Cours</h5>
              <p className="card-text"><strong>Titre :</strong> {seance.titre}</p>
              <p className="card-text"><strong>Type de Séance :</strong> {seance.typeSeance}</p>
              <p className="card-text"><strong>Nombre de Participants :</strong> {seance.nbreParticipants}</p>
              <p className="card-text"><strong>Date et Heure :</strong> {new Date(seance.dateHeure).toLocaleString()}</p>
              <p className="card-text"><strong>Durée :</strong> {seance.dureeMinute} minutes</p>
              <p className="card-text"><strong>Description :</strong> {seance.description}</p>
              <p className="card-text"><strong>Statut :</strong> {seance.statut}</p>
            </div>
          </div>
        );
      case 'participantsCours':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Liste des Participants</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID Abonné</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {seance.participations.map((participation, index) => (
                    <tr key={index}>
                      <td>{participation.id.abonneId}</td>
                      <td>{participation.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Détails de la Séance</h2>
      <Link to="/cours" className="btn btn-danger mb-4">
        <i className="bi bi-arrow-left"></i> Retour
      </Link>

      {/* Onglets */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'detailsCours' ? 'active' : ''}`} onClick={() => setActiveTab('detailsCours')}>Détails du Cours</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'participantsCours' ? 'active' : ''}`} onClick={() => setActiveTab('participantsCours')}>Participants du Cours</button>
        </li>
      </ul>

      {/* Contenu en fonction de l'onglet sélectionné */}
      <div className="tab-content mt-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default SeanceDetails;