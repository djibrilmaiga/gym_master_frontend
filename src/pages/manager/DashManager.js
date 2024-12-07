import React, { useEffect, useState, useRef } from 'react';
import { Chart } from "chart.js/auto";
import FullCalendar from '@fullcalendar/react';
import daygrid from '@fullcalendar/daygrid';
import timegrid from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import Sidebar from '../../components/Siderbar';
import Header from '../../components/Header';
import AbonneService from '../../services/AbonneService';
import PaiementService from '../../services/PaiementService';
import AbonnementService from '../../services/AbonnementService';
import SeanceService from '../../services/SeanceService';

const DashManager = () => {
    const [totalAbonnes, setTotalAbonnes] = useState(0);
    const [recetteMois, setRecetteMois] = useState(0);
    const [paiementsParMois, setPaiementsParMois] = useState([]);
    const [abonnementsEcheance, setAbonnementsEcheance] = useState([]);
    const [abonnesInactif, setAbonnesInactif] = useState([]);
    const [seances, setSeances] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const paymentTrendsChartRef = useRef(null);
    let paymentTrendsChartInstance = null;

    // Récuperer le nombre total d'abonnés
    const fetchTotalAbonne = async () =>{
      try {
        const response = await AbonneService.getTotalAbonne();
        setTotalAbonnes(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du nombre total d'abonnés");
      }
    };

    // Récupérer la somme des paiements pour le mois en cours
    const fetchSommePaiements = async () => {
      try {
          const year = new Date().getFullYear();
          const month = new Date().getMonth() + 1;
          const response = await PaiementService.getSommePaiements(year, month);
          setRecetteMois(response.data);
      } catch (error) {
          console.error("Erreur lors de la récupération des paiements", error);
      }
  };

    // Récupérer les paiements pour chaque mois de l'année en cours
    const fetchPaiementsParMois = async () => {
      const year = new Date().getFullYear();
      const moisLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const paiements = [];

      try {
          for (let month = 1; month <= 12; month++) {
              const response = await PaiementService.getSommePaiements(year, month);
              paiements.push(response.data);
          }
          setPaiementsParMois({
              labels: moisLabels,
              datasets: [{
                  label: "Paiements par mois",
                  data: paiements,
                  backgroundColor: "#36a2eb",
              }],
          });
      } catch (error) {
          console.error("Erreur lors de la récupération des paiements mensuels", error);
      }
  };

  // Récuperer la liste des abonnés sans abonnements actifs
  const fetchAbonneSansAbonnement = async () =>{
    try {
      const response =  await AbonneService.getAbonnesSansAbonnementActif();
      setAbonnesInactif(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de la liste des Abonnés inactis", error);
      
    }
  };

  // Récupérer la liste des abonnements actif proche d'xpiration
  const fetchAbonnementExpiration = async () => {
    try {
      const response = await AbonnementService.getAllAbonnementExpiration();
      setAbonnementsEcheance(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnements en expiration!", error);
    }
  }

  // Récuperer la liste des séances
  const fetchSeances = async () => {
    try {
        const response = await SeanceService.getAllSeances();
        const events = response.data.map(seance => ({
            id: seance.id,
            title: seance.titre,
            start: seance.dateHeure, // Date de début
            extendedProps: {
                description: seance.description,
                typeSeance: seance.typeSeance,
                nbreParticipants: seance.nbreParticipants,
                dureeMinute: seance.dureeMinute,
                statut: seance.statut
            }
        }));
        setSeances(events);
    } catch (error) {
        console.error("Erreur lors du chargement des séances", error);
    }
};

  useEffect(() => {
    // Récupérer les données lors du chargement du composant
    fetchTotalAbonne();
    fetchSommePaiements();
    fetchPaiementsParMois();
    fetchAbonneSansAbonnement();
    fetchAbonnementExpiration();
    fetchSeances();
  }, []);

  useEffect(() => {
    // Vérifier que le canvas existe avant d'initialiser les graphiques
    if (paymentTrendsChartRef.current) {
        // Détruire les anciennes instances de graphique si elles existent
        if (paymentTrendsChartInstance) {
            paymentTrendsChartInstance.destroy();
        }

        paymentTrendsChartInstance = new Chart(paymentTrendsChartRef.current, {
            type: "bar",
            data: paiementsParMois,
        });

        // Nettoyage lors du démontage du composant pour éviter les fuites de mémoire
        return () => {
            if (paymentTrendsChartInstance) {
                paymentTrendsChartInstance.destroy();
            }
        };
    }
  }, [paiementsParMois]);

  // Fonction pour gérer le clic sur un événement
  const handleEventClick = (info) => {
    const courseDetails = info.event.extendedProps; // Récupérer les détails du cours
    setSelectedCourse(courseDetails); // Mettre à jour l'état avec les détails du cours
};
    
  return (
    <div className='wrapper d-flex'>
        <Sidebar />
        <div className='content'>
          <Header />
          <div className="container-fluid">
            <ul className="nav nav-tabs mb-4" id="dashboardTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">Vue d'Ensemble</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="subscriptions-tab" data-bs-toggle="tab" data-bs-target="#subscriptions" type="button" role="tab" aria-controls="subscriptions" aria-selected="false">Abonnements Échéants</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="calendar-tab" data-bs-toggle="tab" data-bs-target="#calendar" type="button" role="tab" aria-controls="calendar" aria-selected="false">Calendrier des Cours</button>
                </li>
            </ul>

            <div className="tab-content" id="dashboardTabContent">
              {/* Vue d'Ensemble */}
              <div className="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
                <div className="row mt-4">
                  <h2>Statistique</h2>
                  <div className="col-md-6 col-lg-4">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Total Abonnés</h5>
                        <p className="card-text">{totalAbonnes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Recette du mois</h5>
                        <p className="card-text">{recetteMois}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section des graphiques */}
                <div className="row">
                  <h2>Graphiques</h2>
                  <div className="col-md-12 col-lg-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Paiements</h5>
                        <canvas ref={paymentTrendsChartRef}></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abonnements Prochains */}
              <div className="tab-pane fade" id="subscriptions" role="tabpanel" aria-labelledby="subscriptions-tab">
                <div className="mt-4">
                  {/* Abonnements proches d'expiration */}
                  <h5 className="mt-4">Abonnements Échéants dans les 7 Prochains Jours</h5>
                  <div className="card">
                      <div className="card-body">
                          <table className="table table-striped">
                              <thead>
                                  <tr>
                                      <th>Nom</th>
                                      <th>Prénom</th>
                                      <th>Date d'Échéance</th>
                                      <th>Jours Restants</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {abonnementsEcheance.length > 0 ? (
                                    abonnementsEcheance.map((abonnement, index) => (
                                      <tr key={index}>
                                          <td>{abonnement.nom}</td>
                                          <td>{abonnement.prenom}</td>
                                          <td>{new Date(abonnement.dateFin).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                                          <td>{abonnement.joursRestant} jours</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            Aucun abonnement actif en expiration trouvé
                                        </td>
                                    </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Abonnés sans abonnements actifs */}
                  <h5 className="mt-4">Abonnés Sans Abonnement Actif</h5>
                  <div className="card">
                      <div className="card-body">
                          <table className="table table-striped">
                              <thead>
                                  <tr>
                                      <th>Nom</th>
                                      <th>Prénom</th>
                                      <th>Téléphone</th>
                                      <th>Date de Fin du Dernier Abonnement</th>
                                  </tr>
                              </thead>
                              <tbody>
                              {abonnesInactif.length > 0 ? (
                                abonnesInactif.map((abonne, index) => (
                                    <tr key={index}>
                                        <td>{abonne.nom}</td>
                                        <td>{abonne.prenom}</td>
                                        <td>{abonne.telephone}</td>
                                        <td>{new Date(abonne.derniereDateFinAbonnement).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                                    </tr>
                                ))
                              ) : (
                                  <tr>
                                      <td colSpan="4" className="text-center">
                                          Aucun abonné sans abonnement actif trouvé
                                      </td>
                                  </tr>
                              )}
                              </tbody>
                          </table>
                      </div>
                  </div>
                </div>
              </div>

              {/* Calendrier des seances */}
              <div className='container'>
                <div className="tab-pane fade" id="calendar" role="tabpanel" aria-labelledby="calendar-tab">
                  <div className="container mt-4">
                    <h2>Calendrier des Cours Planifiés</h2>
                    <FullCalendar
                        plugins={[daygrid, timegrid, interaction]}
                        initialView="dayGridMonth"
                        events={seances} // Affichage des séances
                        eventClick={handleEventClick} // Gestion du clic sur les événements
                        locale="fr"
                    />
                  </div>

                  {/* Détails du cours sélectionné */}
                  {selectedCourse && (
                        <div className="course-details mt-4">
                            <h3>Détails de la Séance</h3>
                            <p><strong>Titre :</strong> {selectedCourse.description}</p>
                            <p><strong>Type :</strong> {selectedCourse.typeSeance}</p>
                            <p><strong>Nombre de participants :</strong> {selectedCourse.nbreParticipants}</p>
                            <p><strong>Durée :</strong> {selectedCourse.dureeMinute} minutes</p>
                            <p><strong>Statut :</strong> {selectedCourse.statut}</p>
                        </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default DashManager;