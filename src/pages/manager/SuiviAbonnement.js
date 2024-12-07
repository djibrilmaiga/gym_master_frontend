import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Siderbar';
import Header from '../../components/Header';
import AbonnementService from '../../services/AbonnementService';

const SuiviAbonnement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filters, setFilters] = useState({statut: "", dateDebut: ""});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Chargement des données via API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AbonnementService.getAllAbonnementWithAbonneInf();
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Erreur du chargement des abonnements: ", error);
      }
    };

    fetchData();
  }, []);


  // Gérer le filtrage
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  // Gérer le tri
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filtrer la liste des abonnements
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return (
      (filters.statut === "" || subscription.statutAbonnement === filters.statut) &&
      (filters.dateDebut === "" || subscription.dateDebut >= filters.dateDebut)
    );
  });

  // Trier la liste des abonnements
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Render
  return (
    <div className="wrapper d-flex">
      <Sidebar />
      <div className="content">
          <Header />
          <div className="navbar navbar-expand-md">
              <nav className="breadcrumb">
                  <ul className="nav nav-tabs mb-4 ms-auto">
                      <li className="nav-item"><Link className="nav-link" to="/abonne">Liste des abonnés</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/abonne-add">Inscrire un abonné</Link></li>
                      <li className="nav-item"><Link className="nav-link active" to="/abonnement">Suivi des abonnements</Link></li>
                  </ul>
              </nav>
          </div>
          <section className='section'>
            <div className="card mb-4">
              <div className="card-header">
                <h4>Suivi des Abonnements</h4>
              </div>

              {/* Filtres de recherche */}
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="statut"
                        value={filters.statut}
                        onChange={handleFilterChange}
                      >
                        <option value="">Filtrer par statut</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Expiré</option>
                      </select>
                      <label htmlFor="statut">Statut d'abonnement</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id="dateDebut"
                        value={filters.dateDebut}
                        onChange={handleFilterChange}
                      />
                      <label htmlFor="dateDebut">Date de début</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tableau des abonnements */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col" onClick={() => handleSort("nom")}>
                        Nom <i className="fas fa-sort"></i>
                      </th>
                      <th scope="col" onClick={() => handleSort("prenom")}>
                        Prénom <i className="fas fa-sort"></i>
                      </th>
                      <th scope="col" onClick={() => handleSort("dateDebut")}>
                        Date début <i className="fas fa-sort"></i>
                      </th>
                      <th scope="col" onClick={() => handleSort("dateFin")}>
                        Date fin <i className="fas fa-sort"></i>
                      </th>
                      <th scope="col" onClick={() => handleSort("statut")}>
                        Statut <i className="fas fa-sort"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubscriptions.map((subscription, index) => (
                      <tr key={index}>
                        <td>{subscription.nomAbonne}</td>
                        <td>{subscription.prenomAbonne}</td>
                        <td>{new Date(subscription.dateDebut).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                        <td>{new Date(subscription.dateFin).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                        <td>
                          <span className={`badge ${subscription.statutAbonnement === "Actif" ? "bg-success" : "bg-danger"}`}>
                            {subscription.statutAbonnement}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
      </div>
    </div>
  );
}

export default SuiviAbonnement;