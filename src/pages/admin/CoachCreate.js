import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import InstructeurService from '../../services/InstructeurService';

const CoachCreate = () => {
    const [instructor, setInstructor] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        specialite: ''
    }); 
    const navigate = useNavigate();

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { id, value } = e.target;
        setInstructor({
        ...instructor,
        [id]: value
        });
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // Envoyer les données du formulaire à l'API pour créer un instructeur
        await InstructeurService.createInstructeur(instructor);
        // Rediriger vers la liste des instructeurs après la création réussie
        navigate('/admin/coach-list');
        } catch (error) {
        console.error('Erreur lors de la création de l\'instructeur:', error);
        }
    };


  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/cours-historique' class="nav-link" >Historique des Cours</Link></li>
                        <li class="nav-item"><Link to='/admin/coach-create' class="nav-link active">Créer un instructeur</Link></li>
                        <li class="nav-item"><Link to='/admin/coach-list' class="nav-link">Liste des instructeurs</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section container'>
                <div className="card mb-5">
                    <div className="container mt-5">
                        <h2 className="mb-4">Créer un Instructeur</h2>
                        <div className="card-body">
                            <form id="form-instructor" onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nom"
                                                placeholder="Nom de l'Instructeur"
                                                value={instructor.nom}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="nom">Nom de l'Instructeur</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="prenom"
                                                placeholder="Prénom de l'Instructeur"
                                                value={instructor.prenom}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="prenom">Prénom de l'Instructeur</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="telephone"
                                                placeholder="Téléphone"
                                                value={instructor.telephone}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="telephone">Téléphone</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="specialite"
                                                placeholder="Spécialité"
                                                value={instructor.specialite}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="specialite">Spécialité</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}

export default CoachCreate