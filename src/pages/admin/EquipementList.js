import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import CategorieService from '../../services/CategorieService';
import EquipementService from '../../services/EquipementService';
import ExemplaireService from '../../services/ExemplaireService';

const EquipementList = () => {
    const [equipments, setEquipments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [instances, setInstances] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [newInstance, setNewInstance] = useState({ numSerie: '' });
    const [activeTab, setActiveTab] = useState('list');

    useEffect(() => {
        // Charger la liste des équipements
        EquipementService.getAllEquipements()
            .then((response) => setEquipments(response.data))
            .catch((error) => console.error("Erreur lors du chargement des équipements", error));

        // Charger les catégories pour le filtre
        CategorieService.getAllCategorie()
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Erreur lors du chargement des catégories", error));
    }, []);

    // Fonction pour filtrer les équipements
    useEffect(() => {
        const filtered = equipments.filter((equipment) => {
            const matchesSearch = equipment.nomEquipement.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = !filterCategory || equipment.nomCategorie === filterCategory;  // Compare le nom
            return matchesSearch && matchesFilter;
        });
        setFilteredEquipments(filtered);
    }, [equipments, searchQuery, filterCategory]);

    // Gérer la sélection d'un équipement pour afficher ses exemplaires
    const handleViewInstances = (equipmentId) => {
        EquipementService.getEquipementById(equipmentId)
            .then((response) => {
                setInstances(response.data.exemplaires);
                setSelectedEquipment(equipmentId);
            })
            .catch((error) => console.error("Erreur lors du chargement des exemplaires", error));
        setActiveTab('list'); // Reste dans l'onglet "Liste"
    };

    // Ajouter un nouvel exemplaire
    const handleAddInstance = () => {
        ExemplaireService.createExemplaire(selectedEquipment, { ...newInstance, etat: 'Fonctionnel', dateDernierMaintenance: null })
            .then(() => {
                alert("Exemplaire créé avec succès !"); // Alerte de confirmation
                setNewInstance({ numSerie: '' });
                handleViewInstances(selectedEquipment); // Rafraîchir la liste des exemplaires
            })
            .catch((error) => console.error("Erreur lors de la création de l'exemplaire", error));
    };

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/equipement' class="nav-link" >Créer un équipement</Link></li>
                        <li class="nav-item"><Link to='/admin/equipement-list' class="nav-link active">Gestion des équipements</Link></li>
                        <li class="nav-item"><Link to='/admin/technicien' class="nav-link">Techniciens</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance' class="nav-link">Planifier une maintenance</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance-hist' class="nav-link">Historique des maintenances</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container mt-4">
                    <h2>Gestion des Équipements</h2>

                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>Liste des équipements</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Créer un exemplaire</button>
                        </li>
                    </ul>

                    {activeTab === 'list' && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher par nom d'équipement..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={filterCategory}
                                        onChange={(e) => {
                                            const selectedCategory = e.target.options[e.target.selectedIndex].text;
                                            setFilterCategory(selectedCategory === "Toutes les catégories" ? "" : selectedCategory); // Réinitialise si "Toutes les catégories" est sélectionné
                                        }}
                                    >
                                        <option value="">Toutes les catégories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.libelle}>{category.libelle}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Nom de l'Équipement</th>
                                        <th>Catégorie de l'Équipement</th>
                                        <th>Quantité</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEquipments.length > 0 ? (
                                        filteredEquipments.map((equipment) => (
                                            <tr key={equipment.id}>
                                                <td>{equipment.nomEquipement}</td>
                                                <td>{equipment.nomCategorie}</td>
                                                <td>{equipment.quantite}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-info" onClick={() => handleViewInstances(equipment.id)}>
                                                    <i className="fas fa-eye"></i> Consulter</button>
                                                    <button className="btn btn-sm btn-success mx-1" onClick={() => {
                                                            setSelectedEquipment(equipment.id);
                                                            setActiveTab('create');
                                                        }}>
                                                        <i className="fas fa-plus"></i> Ajouter</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center">Aucun équipement trouvé.</td></tr>
                                    )}
                                </tbody>
                            </table>

                            {selectedEquipment && instances.length > 0 && (
                                <div className="mt-4">
                                    <h3>Exemplaires de l'équipement sélectionné</h3>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Numéro de série</th>
                                                <th>État</th>
                                                <th>Date de dernière maintenance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instances.map((instance) => (
                                                <tr key={instance.id}>
                                                    <td>{instance.numSerie}</td>
                                                    <td>{instance.etat}</td>
                                                    <td>{instance.dateDernierMaintenance || "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'create' && selectedEquipment && (
                        <div>
                            <h3>Créer un exemplaire pour {equipments.find(e => e.id === selectedEquipment).nomEquipement}</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddInstance(); }}>
                                <div className="mb-3">
                                    <label htmlFor="numSerie" className="form-label">Numéro de série</label>
                                    <input
                                        type="text"
                                        id="numSerie"
                                        className="form-control"
                                        value={newInstance.numSerie}
                                        onChange={(e) => setNewInstance({ ...newInstance, numSerie: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">Créer</button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    </div>
  )
}

export default EquipementList