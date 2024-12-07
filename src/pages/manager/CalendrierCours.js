import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import daygrid from '@fullcalendar/daygrid';
import timegrid from '@fullcalendar/timegrid';
import interaction from '@fullcalendar/interaction';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import SeanceService from '../../services/SeanceService';
import InstructeurService from '../../services/InstructeurService';

const CalendrierCours = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [instructorId, setInstructorId] = useState('');

    // States pour le formulaire
    const [courseTitle, setCourseTitle] = useState('');
    const [courseType, setCourseType] = useState('Collectif');
    const [courseTime, setCourseTime] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [courseCapacity, setCourseCapacity] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    // Charger la liste des instructeurs à partir de l'API
    useEffect(() => {
        const fetchInstructors = async () => {
        try {
            const response = await InstructeurService.getAllInstructeurs();
            setInstructors(response.data); // Récupérer la liste des instructeurs
        } catch (error) {
            console.error('Erreur lors de la récupération des instructeurs:', error);
        }
        };
        fetchInstructors();
    }, []);

    // Soumettre le formulaire pour créer un cours
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newCourse = {
        titre: courseTitle,
        typeSeance: courseType, 
        nbreParticipants: courseCapacity,
        dateHeure: courseTime,
        dureeMinute: courseDuration,
        description: courseDescription,
        statut: 'Planifié',
        };

        try {
        // Envoyer le nouveau cours avec l'instructeur sélectionné
        const response = await SeanceService.createSeanceWithCoach(instructorId, newCourse);
        setCourses([...courses, { 
            ...newCourse, 
            id: response.data.id,
            start: courseTime,
            end: new Date(new Date(courseTime).getTime() + courseDuration * 60000).toISOString(), // Ajuster l'heure de fin
        
        }]); // Mettre à jour le calendrier avec le nouveau cours
        clearForm();
        } catch (error) {
        console.error('Erreur lors de la création du cours:', error);
        }
    };

    // Réinitialiser le formulaire après soumission
    const clearForm = () => {
        setCourseTitle('');
        setCourseType('Collectif');
        setCourseTime('');
        setCourseDuration('');
        setCourseCapacity('');
        setInstructorId('');
        setCourseDescription('');
    };

    // Gestion des clics sur un événement dans le calendrier
    const handleEventClick = (clickInfo) => {
        const course = courses.find(c => c.titre === clickInfo.event.title); // Remplacer 'title' par 'titre'
        if (course) {
            setSelectedCourse(course);
        }
    };
    
  return (
    <div className='wrapper d-flex'>
        <Sidebar />
        <div className='content'>
            <Header />
            <div className="navbar navbar-expand-md">
                <nav className="breadcrumb">
                     <ul className="nav nav-tabs mb-4 ms-auto">
                        <li className="nav-item"><Link className="nav-link active" to="/cours-calendrier">Calendrier des cours</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours-add-abonne">Inscrire un abonné</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours-participation">Suivi des présences</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cours">Liste des cours</Link></li>
                      </ul>
                </nav>
             </div>
             <section className='section'>
                <div className="card mt-4">
                    <div className="card-header">
                        <h2 className="mb-0">Créer un Cours</h2>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Titre du Cours</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Titre du cours"
                                        value={courseTitle}
                                        onChange={(e) => setCourseTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Type de Cours</label>
                                    <select
                                        className="form-select"
                                        value={courseType}
                                        onChange={(e) => setCourseType(e.target.value)}
                                        required
                                    >
                                        <option value="Collective">Collectif</option>
                                        <option value="Individuelle">Particulier</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Horaire</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={courseTime}
                                        onChange={(e) => setCourseTime(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Durée (en minutes)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={courseDuration}
                                        onChange={(e) => setCourseDuration(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Capacité</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={courseCapacity}
                                        onChange={(e) => setCourseCapacity(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Instructeur</label>
                                    <select
                                        className="form-select"
                                        value={instructorId}
                                        onChange={(e) => setInstructorId(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un instructeur</option>
                                        {instructors.map((instructor) => (
                                            <option key={instructor.id} value={instructor.id}>
                                            <strong>{instructor.prenom} {instructor.nom} - Specialité {instructor.specialite}</strong>
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                                        
                            <div className="row mb-3">
                                <div className="col-12">
                                    <label className="form-label">Description du Cours</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">Créer</button>
                            <button type="reset" className="btn btn-secondary" onClick={clearForm}>Annuler</button>
                        </form>
                    </div>

                    <div className="container mt-4">
                        <FullCalendar
                            plugins={[daygrid, timegrid, interaction]}
                            initialView="dayGridMonth"
                            events={courses.map(course => ({
                                title: courseTitle,
                                start: course.dateHeure,
                                end: new Date(new Date(course.dateHeure).getTime() + course.dureeMinute * 60000).toISOString(),
                                extendedProps: {
                                    description: course.description,
                                    typeSeance: course.typeSeance,
                                    nbreParticipants: course.nbreParticipants,
                                    statut: course.statut,
                                },
                            }))}
                            eventClick={handleEventClick}
                        />
                    </div>

                    {selectedCourse && (
                        <div className="card mt-4">
                            <div className="card-header">
                                <h3>Détails du Cours</h3>
                            </div>
                            <div className="card-body">
                                <p><strong>Titre:</strong> {selectedCourse.titre}</p>
                                <p><strong>Instructeur:</strong> {selectedCourse.instructeurId}</p>
                                <p><strong>Type:</strong> {selectedCourse.typeSeance}</p>
                                <p><strong>Capacité:</strong> {selectedCourse.nbreParticipants}</p>
                                <p><strong>Date et Heure:</strong> {new Date(selectedCourse.dateHeure).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</p>
                                <p><strong>Durée:</strong> {selectedCourse.dureeMinute}</p>
                                <p><strong>Description:</strong> {selectedCourse.description}</p>
                                <p><strong>Statut:</strong> {selectedCourse.statut}</p>
                            </div>
                        </div>
                    )}
                </div>
             </section>
        </div>
    </div>
  );
}

export default CalendrierCours;