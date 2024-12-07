import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import TechnicienService from '../../services/TechnicienService';

const EquipementTech = () => {
    const [techniciens, setTechniciens] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTechnicien, setCurrentTechnicien] = useState(null);
    const [newTechnicien, setNewTechnicien] = useState({ nom: '', prenom: '', telephone: '' });
    const [activeTab, setActiveTab] = useState('list');

    // Charger la liste des techniciens
    useEffect(() => {
        TechnicienService.getAllTechniciens().then((response) => {
            setTechniciens(response.data);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des techniciens", error);
        });
    }, []);

    // Filtrer les techniciens selon le terme de recherche
    const filteredTechniciens = techniciens.filter(
        (technicien) =>
            technicien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            technicien.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gestion de la modification des champs d'entrée du formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTechnicien({ ...newTechnicien, [name]: value });
    };

    // Ajouter un nouveau technicien
    const handleAddTechnicien = (e) => {
        e.preventDefault();
        TechnicienService.createTechnicien(newTechnicien).then((response) => {
            setTechniciens([...techniciens, response.data]);
            setNewTechnicien({ nom: '', prenom: '', telephone: '' });
            setActiveTab('list'); // Retour à l'onglet liste après ajout
        }).catch((error) => {
            console.error("Erreur lors de la création du technicien", error);
        });
    };

    // Modifier un technicien
    const handleEditTechnicien = (technicien) => {
        setIsEditing(true);
        setCurrentTechnicien(technicien);
        setNewTechnicien(technicien);
        setActiveTab('edit');
    };

    // Sauvegarder les modifications d'un technicien
    const handleSaveTechnicien = (e) => {
        e.preventDefault();
        TechnicienService.updateTechnicien(currentTechnicien.id, newTechnicien).then((response) => {
            const updatedTechniciens = techniciens.map((technicien) =>
                technicien.id === currentTechnicien.id ? response.data : technicien
            );
            setTechniciens(updatedTechniciens);
            setIsEditing(false);
            setCurrentTechnicien(null);
            setActiveTab('list');
        }).catch((error) => {
            console.error("Erreur lors de la modification du technicien", error);
        });
    };

    // Supprimer un technicien
    const handleDeleteTechnicien = (id) => {
        TechnicienService.deleteTechnicien(id).then(() => {
            setTechniciens(techniciens.filter((technicien) => technicien.id !== id));
        }).catch((error) => {
            console.error("Erreur lors de la suppression du technicien", error);
        });
    };

    return (
        <div className='wrapper d-flex'>
            <SiderBarAdm />
            <div className='content'>
                <Header />
                <div className="navbar navbar-expand-md">
                    <nav className="breadcrumb">
                        <ul className="nav nav-tabs mb-4 ms-auto">
                            <li className="nav-item"><Link to='/admin/equipement' className="nav-link">Créer un équipement</Link></li>
                            <li className="nav-item"><Link to='/admin/equipement-list' className="nav-link">Gestion des équipements</Link></li>
                            <li className="nav-item"><Link to='/admin/technicien' className="nav-link active">Techniciens</Link></li>
                            <li className="nav-item"><Link to='/admin/maintenance' className="nav-link">Planifier une maintenance</Link></li>
                            <li className="nav-item"><Link to='/admin/maintenance-hist' className="nav-link">Historique des maintenances</Link></li>
                        </ul>
                    </nav>
                </div>
                <section className='section'>
                    <h2 className="mb-4">Gestion des techniciens</h2>

                    {/* Affichage des boutons pour basculer entre les onglets */}
                    {activeTab === 'list' && (
                        <div className="mb-3">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setActiveTab('create')}
                            >
                                Ajouter un Technicien
                            </button>
                        </div>
                    )}

                    {/* Onglet Créer un technicien */}
                    {activeTab === 'create' && (
                        <div className="tab-pane">
                            <div className="card bg-light mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Créer un Technicien</h5>
                                    <form onSubmit={handleAddTechnicien}>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nomTechnicien"
                                                name="nom"
                                                placeholder="Nom"
                                                value={newTechnicien.nom}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="nomTechnicien">Nom</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="prenomTechnicien"
                                                name="prenom"
                                                placeholder="Prénom"
                                                value={newTechnicien.prenom}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="prenomTechnicien">Prénom</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="telTechnicien"
                                                name="telephone"
                                                placeholder="Téléphone"
                                                value={newTechnicien.telephone}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="telTechnicien">Téléphone</label>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Ajouter Technicien</button>
                                    </form>
                                    <button 
                                        className="btn btn-secondary mt-3"
                                        onClick={() => setActiveTab('list')}
                                    >
                                        Retour à la liste
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Onglet Liste des techniciens */}
                    {activeTab === 'list' && (
                        <div className="tab-pane">
                            <div className="card bg-light mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Liste des Techniciens</h5>

                                    {/* Barre de recherche */}
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Rechercher par nom ou prénom..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Prénom</th>
                                                <th>Téléphone</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTechniciens.length > 0 ? (
                                                filteredTechniciens.map((technicien, index) => (
                                                    <tr key={technicien.id}>
                                                        <td>{technicien.nom}</td>
                                                        <td>{technicien.prenom}</td>
                                                        <td>{technicien.telephone}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-warning btn-sm me-2"
                                                                onClick={() => handleEditTechnicien(technicien)}
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => handleDeleteTechnicien(technicien.id)}
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">Aucun technicien trouvé</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulaire de modification */}
                    {activeTab === 'edit' && (
                        <div className="tab-pane">
                            <div className="card bg-light mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Modifier un Technicien</h5>
                                    <form onSubmit={handleSaveTechnicien}>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nom"
                                                placeholder="Nom"
                                                value={newTechnicien.nom}
                                                onChange={handleInputChange}
                                            />
                                            <label>Nom</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="prenom"
                                                placeholder="Prénom"
                                                value={newTechnicien.prenom}
                                                onChange={handleInputChange}
                                            />
                                            <label>Prénom</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="telephone"
                                                placeholder="Téléphone"
                                                value={newTechnicien.telephone}
                                                onChange={handleInputChange}
                                            />
                                            <label>Téléphone</label>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Sauvegarder</button>
                                        <button 
                                            className="btn btn-secondary mt-3"
                                            onClick={() => setActiveTab('list')}
                                        >
                                            Retour à la liste
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EquipementTech;