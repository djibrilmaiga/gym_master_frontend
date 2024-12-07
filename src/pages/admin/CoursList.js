import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import SeanceService from '../../services/SeanceService';

const CoursList = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [instructors, setInstructors] = useState({});
  const [filterStatus, setFilterStatus] = useState('');

    // Appel API pour récupérer les cours dès que le composant est monté
    useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await SeanceService.getAllSeances();
            setCourses(response.data);

            // Récupération des instructeurs pour chaque cours
            const instructorPromises = response.data.map(course => 
                SeanceService.getCoachSeanceById(course.id)  // Utiliser l'ID de la séance
                    .then(res => {
                        setInstructors(prevInstructors => ({
                            ...prevInstructors,
                            [course.id]: `${res.data.prenom} ${res.data.nom}` // Associer l'instructeur avec l'ID de la séance
                        }));
                    })
                    .catch(error => {
                        console.error(`Erreur lors de la récupération de l'instructeur pour la séance ${course.id}:`, error);
                    })
            );

            // Attendre que toutes les promesses soient résolues
            await Promise.all(instructorPromises);
        } catch (error) {
            console.error("Erreur lors de la récupération des cours:", error);
        }
    };

    fetchCourses();
    }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleSort = (column) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortColumn(column);

    const sortedCourses = [...courses].sort((a, b) => {
      if (order === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setCourses(sortedCourses);
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterStatus || course.statut === filterStatus)
    );
  });

  const supprimerCours = (id) => {
    SeanceService.deleteSeance(id)
      .then(() => {
        setCourses(courses.filter(course => course.id !== id));
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du cours:', error);
      });
  };

  return (
    <div className='wrapper d-flex'>
      <SiderBarAdm />
      <div className='content'>
        <Header />
        <div className='navbar navbar-expand-md'>
          <nav className='breadcrumb'>
            <ul className='nav nav-tabs mb-4 ms-auto'>
              <li className='nav-item'>
                <Link to='/admin/cours-historique' className='nav-link active'>
                  Historique des Cours
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/admin/coach-create' className='nav-link'>
                  Créer un instructeur
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/admin/coach-list' className='nav-link'>
                  Liste des instructeurs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <section className='section'>
          <div className='container mt-5'>
            <h2 className='mb-4'>Historique des Cours</h2>

            <div className='row mb-3'>
              <div className='col-md-4'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Rechercher un cours par nom'
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className='col-md-4'>
                <select
                  className='form-control'
                  value={filterStatus}
                  onChange={handleFilterStatus}
                >
                  <option value=''>Tous les Statuts</option>
                  <option value='Planifié'>Planifié</option>
                  <option value='Terminé'>Terminé</option>
                </select>
              </div>
            </div>

            <table className='table table-striped'>
              <thead>
                <tr>
                  <th onClick={() => handleSort('titre')}>Nom du Cours</th>
                  <th onClick={() => handleSort('dateHeure')}>Date</th>
                  <th onClick={() => handleSort('dureeMinute')}>Durée (minutes)</th>
                  <th>Instructeur</th>
                  <th onClick={() => handleSort('nbreParticipants')}>
                    Nombre de Participants
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
                <tbody>
                    {filteredCourses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.titre}</td>
                            <td>{new Date(course.dateHeure).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                            <td>{course.dureeMinute}</td>
                            <td>{instructors[course.id] || 'Chargement...'}</td> {/* Afficher l'instructeur associé à la séance */}
                            <td>{course.nbreParticipants}</td>
                            <td>
                                <Link className="btn btn-info btn-sm me-2">
                                    <i className="fas fa-eye"></i> Consulter
                                </Link>
                                <button className="btn btn-danger btn-sm" onClick={() => supprimerCours(course.id)}>
                                    <i className="fas fa-trash"></i> Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursList;
