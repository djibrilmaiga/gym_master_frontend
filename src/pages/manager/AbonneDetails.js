import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AbonneService from '../../services/AbonneService';

const AbonneDetails = () => {
  const { id } = useParams();
  const [abonne, setAbonne] = useState(null);
  const [abonnements, setAbonnements] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [activeTab, setActiveTab] = useState('infoPersonnel');
  const navigate = useNavigate();

  // Chargement des données via API
  useEffect(() => {
    AbonneService.getAbonneById(id)
      .then(response => {
        setAbonne(response.data);
      })
      .catch(error => {
      console.error("Erreur lors du chargement des détails de l'abonné:", error);
      });
  }, [id]);

  // UX chargement de la page
  if (!abonne) {
    return <div>Chargement...</div>;
  }

   // Fonction pour déterminer le statut d'abonnement
   const getStatutAbonnement = (dateFin) => {
    const today = new Date();
    const endDate = new Date(dateFin);
    return today <= endDate ? 'Actif' : 'Inactif';
  };

  // Gestion des changements formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAbonne(abonne => ({ ...abonne, [name]: value }));
  };

  // Gestionnaire de soumission du formulaire de modification
  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      // Appel API PUT pour mettre à jour l'abonné
      const response = await AbonneService.updateAbonne(abonne.id, abonne);
      
      if (response.status === 200) {
        alert('Abonné mis à jour avec succès');
        navigate('/abonne');
      } else {
        alert('Erreur lors de la mise à jour de l\'abonné');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'abonné');
    }
  };

  if (!abonne) return <div>Chargement...</div>;

  // Gestion des onglets
  const renderContent = () => {
    switch (activeTab) {
      case 'infoPersonnel':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Détails Personnels</h5>
              <p className="card-text"><strong>Nom :</strong> {abonne.nom}</p>
              <p className="card-text"><strong>Prénom :</strong> {abonne.prenom}</p>
              <p className="card-text"><strong>Genre :</strong> {abonne.genre}</p>
              <p className="card-text"><strong>Téléphone :</strong> {abonne.telephone}</p>
              <p className="card-text"><strong>Email :</strong> {abonne.email}</p>
              <p className="card-text"><strong>Date d'inscription :</strong> {new Date(abonne.dateInscription).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</p>
            </div>
          </div>
        );
      case 'historiqueAbonnement':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Historique des Abonnements</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {abonne.abonnements.map((abonnement, index) => (
                    <tr key={index}>
                      <td>{new Date(abonnement.dateDebut).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                      <td>{new Date(abonnement.dateFin).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                      <td>{getStatutAbonnement(abonnement.dateFin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'historiquePaiement':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Historique des Paiements</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type de Paiement</th>
                    <th>Date du Paiement</th>
                    <th>Montant</th>
                    <th>Méthode de Paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {abonne.paiements.map((paiement, index) => (
                    <tr key={index}>
                      <td>{paiement.typePaiement}</td>
                      <td>{new Date(paiement.datePaiement).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                      <td>{paiement.montantPaye}</td>
                      <td>{paiement.modePaiement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <h6>Total des paiements : {abonne.paiementTotal} CFA</h6>
            </div>
          </div>
        );
      case 'modifierInfo':
        return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Modifier les Informations Personnelles</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nom" className="form-label">Nom</label>
                  <input 
                    id="nom"
                    name='nom'
                    type="text" 
                    className="form-control" 
                    value={abonne.nom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="prenom" className="form-label">Prénom</label>
                  <input 
                    id="prenom"
                    name='prenom'
                    type="text" 
                    className="form-control"  
                    value={abonne.prenom}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="genre" className="form-label">Genre</label>
                  <select 
                    id="genre" 
                    name='genre'
                    className="form-control"                     
                    value={abonne.genre}
                    onChange={handleInputChange}>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="telephone" className="form-label">Téléphone</label>
                  <input 
                    id="telephone"
                    name='telephone'
                    type="text" 
                    className="form-control" 
                    value={abonne.telephone}
                    onChange={handleInputChange} 
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    id="email" 
                    name='email'
                    type="email" 
                    className="form-control" 
                    value={abonne.email}
                    onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Enregistrer les Modifications</button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Détails de l'abonné</h2>
      <Link to="/abonne" className="btn btn-danger mb-4">
        <i className="bi bi-arrow-left"></i> Retour
      </Link>

      {/* Onglets */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'infoPersonnel' ? 'active' : ''}`} onClick={() => setActiveTab('infoPersonnel')}>Informations Personnelles</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'historiqueAbonnement' ? 'active' : ''}`} onClick={() => setActiveTab('historiqueAbonnement')}>Historique des Abonnements</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'historiquePaiement' ? 'active' : ''}`} onClick={() => setActiveTab('historiquePaiement')}>Historique des Paiements</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'modifierInfo' ? 'active' : ''}`} onClick={() => setActiveTab('modifierInfo')}>Modifier les Informations Personnelles</button>
        </li>
      </ul>

      {/* Contenu en fonction de l'onglet sélectionné */}
      <div className="tab-content mt-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default AbonneDetails;
