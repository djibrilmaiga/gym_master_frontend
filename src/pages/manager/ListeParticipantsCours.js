import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import SeanceService from '../../services/SeanceService';
import AbonneService from '../../services/AbonneService';

const ListeParticipantsCours = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [presences, setPresences] = useState({});
    const [absentWarning, setAbsentWarning] = useState(false);

    // Charger toutes les séances depuis l'API au montage du composant
    useEffect(() => {
        const fetchCourses = async () => {
        try {
            const response = await SeanceService.getAllSeances();
            setCourses(response.data);  // Mettre à jour la liste des séances
        } catch (error) {
            console.error('Erreur lors du chargement des séances', error);
        }
        };
        fetchCourses();
    }, []);

    // Fonction pour récupérer les détails de l'abonné
    const fetchAbonneDetails = async (membreId) => {
        try {
            const response = await AbonneService.getAbonneById(membreId);
            return `${response.data.prenom} ${response.data.nom}`;
        } catch (error) {
            console.error(`Erreur lors du chargement de l'abonné avec l'ID: ${membreId}`, error);
            return 'Nom inconnu';
        }
    };

    // Fonction pour sélectionner un cours et afficher la liste des présences
    const afficherPresences = async (course) => {
        setSelectedCourse(course);
        
        const initialPresences = course.participations.reduce((acc, participation) => {
            acc[participation.id.membreId] = participation.statut === 'Present';
            return acc;
        }, {});
        setPresences(initialPresences);
        setAbsentWarning(false);
    
        // Charger les détails des abonnés pour afficher leurs noms
        const updatedParticipations = await Promise.all(
            course.participations.map(async (participation) => {
                const abonneNom = await fetchAbonneDetails(participation.id.membreId);
                return {
                    ...participation,
                    abonneNom, // Ajouter le nom complet de l'abonné
                };
            })
        );
    
        // Mettre à jour la séance sélectionnée avec les noms des abonnés
        setSelectedCourse((prevCourse) => ({
            ...prevCourse,
            participations: updatedParticipations,
        }));
    };

    // Marquer la présence ou l'absence
    const marquerPresence = (participantId, present) => {
        setPresences((prevState) => ({
        ...prevState,
        [participantId]: present,
        }));
        const hasAbsent = Object.values(presences).some((status) => status === false);
        setAbsentWarning(hasAbsent);
    };

    // Sauvegarder les modifications et marquer la séance comme "Terminée"
    const sauvegarderPresences = async () => {
        const updatedCourse = {
        ...selectedCourse,
        participations: Object.keys(presences).map((participantId) => ({
            id: { seanceId: selectedCourse.id, abonneId: parseInt(participantId) },
            statut: presences[participantId] ? 'Present' : 'Absent',
        })),
        };

        try {
        await SeanceService.updateSeance(selectedCourse.id, updatedCourse);
        alert('Présences sauvegardées avec succès.');
        } catch (error) {
        console.error('Erreur lors de la sauvegarde des présences', error);
        }
    };

    // Simuler l'exportation des données de présence
    const exporterPresence = (format) => {
        const exportData = {
        course: selectedCourse.name,
        instructor: selectedCourse.instructor,
        presences,
        };
        alert(`Exporté en ${format.toUpperCase()}: ${JSON.stringify(exportData)}`);
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
                        <li className="nav-item"><Link className="nav-link" to="/cours-add-abonne">Inscrire un abonné</Link></li>
                        <li className="nav-item"><Link className="nav-link active" to="/cours-participation">Suivi des présences</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours">Liste des cours</Link></li>
                      </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container mt-5">
                    <h2 className="mb-4">Suivi des Présences</h2>

                    {/* Liste des cours */}
                    <h4 className="mb-3">Cours du jour</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Cours</th>
                                <th>Heure</th>
                                <th>Participation</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.filter(course => course.statut === 'Planifié').map((course) => (
                                <tr key={course.id}>
                                    <td>{course.titre}</td>
                                    <td>{new Date(course.dateHeure).toLocaleTimeString()}</td>
                                    <td>{course.participations.length}</td>
                                    <td>
                                        <button
                                            className="btn btn-info"
                                            onClick={() => afficherPresences(course)}
                                        >
                                            Voir Présences
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Section de suivi des présences */}
                    {selectedCourse && (
                        <div className="mt-5">
                         <h4>
                            Présences pour {selectedCourse.titre} - Instructeur: {selectedCourse.instructor}
                        </h4>

                        <div className="form-group mt-3">
                            <label htmlFor="statutCours">Statut du Cours:</label>
                            <select
                                className="form-control"
                                id="statutCours"
                                value={selectedCourse.statut}
                                onChange={(e) => setSelectedCourse({ ...selectedCourse, statut: e.target.value })}
                            >
                                <option value="Planifié">Planifié</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>

                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>Nom de l'Abonné</th>
                                    <th>Présent</th>
                                    <th>Absent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCourse.participations.map((participation) => (
                                <tr key={participation.id.membreId}>
                                    <td>{participation.abonneNom}</td>
                                    <td>
                                    <input
                                        type="checkbox"
                                        checked={presences[participation.id.membreId] === true}
                                        onChange={() => marquerPresence(participation.id.membreId, true)}
                                    />
                                    </td>
                                    <td>
                                    <input
                                        type="checkbox"
                                        checked={presences[participation.id.membreId] === false}
                                        onChange={() => marquerPresence(participation.id.membreId, false)}
                                    />
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                            {/* Notifications visuelles des absences */}
                            {absentWarning && (
                                <div className="alert alert-danger mt-3">
                                    Certains abonnés sont absents.
                                </div>
                            )}

                             {/* Bouton de sauvegarde */}
                            <button className="btn btn-success mt-3" onClick={sauvegarderPresences}>
                                Sauvegarder les présences
                            </button>

                             {/* Boutons d'exportation */}
                            <div className="mt-4">
                                <button
                                className="btn btn-primary"
                                onClick={() => exporterPresence('pdf')}
                                >
                                Exporter en PDF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    </div>
  );
}

export default ListeParticipantsCours;