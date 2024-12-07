import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import InstructeurService from '../../services/InstructeurService';

const CoachList = () => {
    const [instructors, setInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingInstructor, setEditingInstructor] = useState(null);

    // Récupérer les instructeurs depuis l'API
    useEffect(() => {
        InstructeurService.getAllInstructeurs()
            .then(response => {
                setInstructors(response.data);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des instructeurs:', error);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const showEditForm = (instructor) => {
        setEditingInstructor(instructor);
    };

    const hideEditForm = () => {
        setEditingInstructor(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingInstructor((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Sauvegarder les modifications via l'API
    const handleSave = (e) => {
        e.preventDefault();
        InstructeurService.updateInstructeur(editingInstructor.id, editingInstructor)
            .then(() => {
                setInstructors((prevInstructors) =>
                    prevInstructors.map((inst) =>
                        inst.id === editingInstructor.id ? editingInstructor : inst
                    )
                );
                hideEditForm();
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'instructeur:', error);
            });
    };

    // Supprimer l'instructeur via l'API
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet instructeur ?')) {
            InstructeurService.deleteInstructeur(id)
                .then(() => {
                    setInstructors((prevInstructors) =>
                        prevInstructors.filter((inst) => inst.id !== id)
                    );
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression de l\'instructeur:', error);
                });
        }
    };

    const filteredInstructors = instructors.filter((instructor) =>
        instructor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/cours-historique' class="nav-link" >Historique des Cours</Link></li>
                        <li class="nav-item"><Link to='/admin/coach-create' class="nav-link">Créer un instructeur</Link></li>
                        <li class="nav-item"><Link to='/admin/coach-list' class="nav-link active">Liste des instructeurs</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="card mb-4">
                    <div className="card-header">
                        <h4 className="mb-0">Liste des Instructeurs</h4>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par nom ou prénom"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Téléphone</th>
                                    <th>Spécialité</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInstructors.map((instructor) => (
                                    <tr key={instructor.id}>
                                    <td>{instructor.nom}</td>
                                    <td>{instructor.prenom}</td>
                                    <td>{instructor.telephone}</td>
                                    <td>{instructor.specialite}</td>
                                    <td>
                                        <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => showEditForm(instructor)}
                                        >
                                        <i className="fas fa-edit"></i> Modifier
                                        </button>
                                        <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(instructor.id)}
                                        >
                                        <i className="fas fa-trash"></i> Supprimer
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {editingInstructor && (
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="mb-0">Modifier l'Instructeur</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="form-label">Nom</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        className="form-control"
                                        value={editingInstructor.nom}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Prénom</label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        className="form-control"
                                        value={editingInstructor.prenom}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Téléphone</label>
                                    <input
                                        type="text"
                                        name="telephone"
                                        className="form-control"
                                        value={editingInstructor.telephone}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Spécialité</label>
                                    <input
                                        type="text"
                                        name="specialite"
                                        className="form-control"
                                        value={editingInstructor.specialite}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">
                                    Enregistrer les modifications
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={hideEditForm}
                                >
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </div>
    </div>
  )
}

export default CoachList