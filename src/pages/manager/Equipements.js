import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import CategorieService from '../../services/CategorieService';

const Equipements = () => {
    const [categories, setCategories] = useState([]); // Stocker les catégories et leurs équipements
    const [equipements, setEquipements] = useState([]); // Stocker les équipements extraits
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const navigate = useNavigate();

    // Fonction pour récupérer la liste des catégories d'équipements
    const fetchCategorie = async () => {
        try {
            const response = await CategorieService.getAllCategorie();
            setCategories(response.data);
            extractEquipments(response.data); // Extraire les équipements après récupération
        } catch (error) {
            console.error("Erreur de chargement de la liste des catégories:", error);
        }
    };

    // Extraire les équipements des catégories et les stocker dans un tableau plat
    const extractEquipments = (categoriesData) => {
        const allEquipments = [];
        categoriesData.forEach((category) => {
            category.equipements.forEach((equipment) => {
                allEquipments.push({
                    id: equipment.id,
                    nom: equipment.nom,
                    categorie: category.libelle,
                    quantite: equipment.quantite
                });
            });
        });
        setEquipements(allEquipments);
    };

    // Exécuter les fetchs
    useEffect(() => {
        fetchCategorie();
    }, []);

    // Filtrer les équipements selon la recherche et la catégorie
    const filterEquipments = () => {
        return equipements.filter(
            (equipment) =>
                equipment.nom.toLowerCase().includes(search.toLowerCase()) &&
                (filterType === "" || equipment.categorie === filterType)
        );
    };

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleTypeChange = (e) => setFilterType(e.target.value);
    const handleViewDetails = (id) => { navigate(`/equipement/${id}`); };
    
  return (
    <div className='wrapper d-flex'>
        <Sidebar />
        <div className='content'>
            <Header />
            <div className="navbar navbar-expand-md">
                <nav className="breadcrumb">
                    <ul className="nav nav-tabs mb-4 ms-auto">
                        <li className="nav-item"><Link className="nav-link active" to="/equipement">Suivi des équipements</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/equipement-add">Signaler une panne</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container mt-5">
                    <h2 className="mb-4">Suivi des Équipements</h2>

                    {/* Filtre et barre de recherche */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher un équipement"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <select className="form-control" value={filterType} onChange={handleTypeChange}>
                                <option value="">Toutes les catégories d'équipements</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.libelle}>
                                        {category.libelle}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tableau des équipements */}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Équipements</th>
                                <th>Catégorie</th>
                                <th>Quantité</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterEquipments().map((equipment) => (
                                <tr key={equipment.id}>
                                    <td>{equipment.id}</td>
                                    <td>{equipment.nom}</td>
                                    <td>{equipment.categorie}</td>
                                    <td>{equipment.quantite}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleViewDetails(equipment.id)} // Appel de la fonction de navigation
                                        >
                                            Voir Détails
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
  )
}

export default Equipements