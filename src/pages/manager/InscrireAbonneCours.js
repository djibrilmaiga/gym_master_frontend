import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import SeanceService from '../../services/SeanceService';
import AbonneService from '../../services/AbonneService';

const InscrireAbonneCours = () => {
  const [originalCours, setOriginalCours] = useState([]);
  const [originalAbonnes, setOriginalAbonnes] = useState([]);
  const [cours, setCours] = useState([]);
  const [abonneList, setAbonneList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [selectedAbonnes, setSelectedAbonnes] = useState([]);
  const [capacityReached, setCapacityReached] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [instructeur, setInstructeur] = useState();

  // Récupérer les cours disponibles dès le chargement du composant
  useEffect(() => {
    SeanceService.getAllSeances()
      .then((response) => {
        setCours(response.data);
        setOriginalCours(response.data); // Stocker les données originales
      })
      .catch((error) => console.error('Erreur lors du chargement des cours:', error));
  }, []);

  // Fonction pour rechercher un cours
  const rechercherCours = (event) => {
    const query = event.target.value.toLowerCase();
    if (query) {
      const filteredCours = originalCours.filter((course) =>
        course.titre.toLowerCase().includes(query)
      );
      setCours(filteredCours); // Filtrer la liste affichée
    } else {
      setCours(originalCours); // Restaurer la liste originale si la recherche est vide
    }
  };

  // Fonction pour sélectionner un cours
  const handleSelectCours = (course) => {
    if (!course || !course.id) {
      console.error("La séance sélectionnée est invalide ou n'a pas d'ID.");
      return;
    }
  
    setSelectedCours(course);
  
    // Récupérer l'instructeur du cours sélectionné
    SeanceService.getCoachSeanceById(course.id)
      .then((response) => {
        setInstructeur(response.data);
      })
      .catch((error) => console.error('Erreur lors du chargement de l\'instructeur:', error));
  
    // Charger les abonnés disponibles pour ce cours
    AbonneService.getAllAbonnesSelected()
      .then((response) => {
        setAbonneList(response.data);
        setOriginalAbonnes(response.data);
      })
      .catch((error) => console.error('Erreur lors du chargement des abonnés:', error));
  };  

  // Fonction pour rechercher un abonné
  const rechercherAbonne = (event) => {
    const query = event.target.value.toLowerCase();
    if (query) {
      const filteredAbonnes = originalAbonnes.filter((abonne) =>
        abonne.nom.toLowerCase().includes(query)
      );
      setAbonneList(filteredAbonnes); // Filtrer la liste affichée
    } else {
      setAbonneList(originalAbonnes); // Restaurer la liste originale si la recherche est vide
    }
  };

  // Fonction pour ajouter un abonné à la séance sélectionnée
  const handleAddAbonne = (abonne) => {
    if (!abonne || !abonne.id) {
      console.error("L'abonné est invalide ou n'a pas d'ID.");
      return;
    }
  
    if (!selectedCours || !selectedCours.id) {
      console.error("La séance sélectionnée est invalide ou n'a pas d'ID.");
      return;
    }
  
    if (selectedAbonnes.length < selectedCours.nbreParticipants) {
      const newSelectedAbonnes = [...selectedAbonnes, abonne];
      setSelectedAbonnes(newSelectedAbonnes);
  
      // Vérifier si la capacité est atteinte
      setCapacityReached(newSelectedAbonnes.length >= selectedCours.nbreParticipants);
    } else {
      console.error("Capacité atteinte, impossible d'ajouter plus d'abonnés.");
    }
  };  

  // Fonction pour supprimer un abonné de la liste des sélectionnés
  const handleRemoveAbonne = (abonne) => {
    const updatedAbonnes = selectedAbonnes.filter((a) => a.id !== abonne.id);
    setSelectedAbonnes(updatedAbonnes);
  
    // Vérifier à nouveau si la capacité est atteinte
    if (updatedAbonnes.length < selectedCours.nbreParticipants) {
      setCapacityReached(false);
    }
  };

  const validateParticipations = () => {
    if (!selectedCours || !selectedCours.id) {
      return false; // S'Assurer que la séance est bien sélectionnée
    }
  
    return selectedAbonnes.every((abonne) => abonne.id); // Vérifie que chaque abonné a un ID
  };
  
  // Fonction pour confirmer l'inscription des abonnés
  const confirmerInscription = () => {
    if (!validateParticipations()) {
      setErrorMessage('Erreur : chaque participant doit avoir un ID de séance et de membre.');
      return;
    }
  
    const updatedSeance = {
      ...selectedCours,
      participations: selectedAbonnes.map((abonne) => ({
        id: { seanceId: selectedCours.id, abonneId: abonne.id },
        statut: null
      })),
    };
  
    SeanceService.inscrireSeance(selectedCours.id, updatedSeance)
      .then((response) => {
        console.log('Inscriptions mises à jour:', response.data);
        alert('Inscriptions enregistrées avec succès!');
        setSelectedCours(null);
        setSelectedAbonnes([]);
        setCapacityReached(false);
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des inscriptions:', error);
        setErrorMessage('Erreur lors de la mise à jour des inscriptions.');
      });
  };   

  return (
    <div className='wrapper d-flex'>
        <Sidebar />
        <div className='content'>
            <Header />
            <div className="navbar navbar-expand-md">
                <nav className="breadcrumb">
                     <ul className="nav nav-tabs mb-4 ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/cours-calendrier">Calendrier des cours</Link></li>
                        <li className="nav-item"><Link className="nav-link active" to="/cours-add-abonne">Inscrire un abonné</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours-participation">Suivi des présences</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours">Liste des cours</Link></li>
                      </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container mt-5"> 
                    <h2 className="mb-4">Inscrire un Abonné à un Cours</h2>

                    {/* Recherche du cours */}
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher un cours..."
                            onChange={rechercherCours}
                        />
                    </div>

                    {/* Liste des cours */}
                    <h4 className="mb-3">Cours disponibles</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                            <th>Titre</th>
                            <th>Seance</th>
                            <th>Date et Heure</th>
                            <th>Capacité</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cours.map((course) => (
                            <tr key={course.id}>
                                <td>{course.titre}</td>
                                <td>{course.typeSeance}</td>
                                <td>{course.dateHeure}</td>
                                <td>{course.nbreParticipants}</td>
                                <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleSelectCours(course)}
                                    disabled={course.nbreParticipants <= 0}
                                >
                                    Sélectionner
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Section pour ajouter des abonnés une fois le cours sélectionné */}
                    {selectedCours && (
                    <div className="mt-5">
                        <h4 className="mb-4">Ajouter des abonnés au cours sélectionné: {selectedCours.name}</h4>
                        <p><strong>Instructeur:</strong> {instructeur ? `${instructeur.prenom} ${instructeur.nom}` : 'Instructeur non défini'}</p>

                        {/* Recherche des abonnés */}
                        <div className="input-group mb-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher un abonné..."
                                onChange={rechercherAbonne}
                            />
                        </div>

                        {/* Liste des abonnés */}
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                  <th>Nom de l'Abonné</th>
                                  <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                              {abonneList.map((abonne) => (
                                <tr key={abonne.id}>
                                  <td>{abonne.prenom} {abonne.nom}</td>
                                  <td>
                                    {selectedAbonnes.some(a => a.id === abonne.id) ? (
                                      <button className="btn btn-success" onClick={() => handleRemoveAbonne(abonne)}>
                                        Supprimer
                                      </button>
                                    ) : (
                                      <button className="btn btn-secondary" onClick={() => handleAddAbonne(abonne)} disabled={capacityReached}>
                                        Ajouter
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                        </table>

                        {capacityReached && (
                        <p className="text-danger">Capacité atteinte. Vous ne pouvez plus ajouter d'abonnés.</p>
                        )}

                        {errorMessage && (
                          <p className="text-danger">{errorMessage}</p>
                        )}

                        <button className="btn btn-primary" onClick={confirmerInscription}>
                        Enregistrer les inscriptions
                        </button>
                    </div>
                    )}
                </div>
            </section>
        </div>
    </div>
  );
}

export default InscrireAbonneCours;