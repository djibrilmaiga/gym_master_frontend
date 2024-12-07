import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import CategorieService from '../../services/CategorieService';
import EquipementService from '../../services/EquipementService';

const EquipementCreate = () => {
    const [categories, setCategories] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [newCategorie, setNewCategorie] = useState("");
    const [newEquipement, setNewEquipement] = useState({
      name: "",
      categoryId: ""
    });
  
    // Récupérer toutes les catégories
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const response = await CategorieService.getAllCategorie();
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };
  
    // Récupérer tous les équipements
    useEffect(() => {
      fetchEquipements();
    }, []);
  
    const fetchEquipements = async () => {
      try {
        const response = await EquipementService.getAllEquipements();
        setEquipements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipements:", error);
      }
    };
  
    // Gérer les changements de formulaire pour la catégorie
    const handleCategorieChange = (e) => setNewCategorie(e.target.value);
  
    // Gérer les changements de formulaire pour l'équipement
    const handleEquipementChange = (e) => {
      setNewEquipement({
        ...newEquipement,
        [e.target.id]: e.target.value
      });
    };
  
    // Ajouter une catégorie
    const handleAddCategorie = async (e) => {
      e.preventDefault();
      if (newCategorie) {
        try {
          await CategorieService.createCategorie({ libelle: newCategorie });
          fetchCategories(); // Rafraîchir la liste des catégories
          setNewCategorie(""); // Réinitialiser le champ
        } catch (error) {
          console.error("Erreur lors de la création de la catégorie:", error);
        }
      }
    };
  
    // Supprimer une catégorie
    const handleDeleteCategorie = async (id) => {
      try {
        await CategorieService.deleteCategorie(id);
        fetchCategories(); // Rafraîchir la liste des catégories
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie:", error);
      }
    };
  
    // Ajouter un équipement
    const handleAddEquipement = async (e) => {
      e.preventDefault();
      if (newEquipement.name && newEquipement.categoryId) {
        try {
          await EquipementService.createEquipement(newEquipement.categoryId, {
            nom: newEquipement.name,
            quantite: 0
          });
          fetchEquipements(); // Rafraîchir la liste des équipements
          setNewEquipement({ name: "", categoryId: "" }); // Réinitialiser le formulaire
        } catch (error) {
          console.error("Erreur lors de la création de l'équipement:", error);
        }
      }
    };
  
    // Supprimer un équipement
    const handleDeleteEquipement = async (id) => {
      try {
        await EquipementService.deleteEquipement(id);
        fetchEquipements(); // Rafraîchir la liste des équipements
      } catch (error) {
        console.error("Erreur lors de la suppression de l'équipement:", error);
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
                        <li class="nav-item"><Link to='/admin/equipement' class="nav-link active" >Créer un équipement</Link></li>
                        <li class="nav-item"><Link to='/admin/equipement-list' class="nav-link">Gestion des équipements</Link></li>
                        <li class="nav-item"><Link to='/admin/technicien' class="nav-link">Techniciens</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance' class="nav-link">Planifier une maintenance</Link></li>
                        <li class="nav-item"><Link to='/admin/maintenance-hist' class="nav-link">Historique des maintenances</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <h2 className="mb-4">Créer un équipement</h2>

                {/* Onglets de navigation */}
                <ul className="nav nav-tabs" id="equipementsTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="categorie-tab" data-bs-toggle="tab" data-bs-target="#categorie" type="button" role="tab" aria-controls="categorie" aria-selected="true">
                            Catégories
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="equipement-tab" data-bs-toggle="tab" data-bs-target="#equipement" type="button" role="tab" aria-controls="equipement" aria-selected="false">
                            Équipements
                        </button>
                    </li>
                </ul>

                {/* Contenu des onglets */}
                <div className="tab-content mt-3" id="equipementsTabContent">
                    {/* Onglet Catégories */}
                    <div className="tab-pane fade show active" id="categorie" role="tabpanel" aria-labelledby="categorie-tab">
                        <div className='row'>
                            <div className='col-md-5'>
                                <div className="card bg-light mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Créer une Catégorie d'Équipement</h5>
                                        <form onSubmit={handleAddCategorie}>
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="categorieNom" placeholder="Nom de la catégorie" value={newCategorie} onChange={handleCategorieChange} />
                                                <label htmlFor="categorieNom">Nom de la catégorie</label>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Ajouter Catégorie</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className='col-md-7'>
                                {/* Liste des catégories */}
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Liste des Catégories</h6>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map((categorie) => (
                                                    <tr key={categorie.id}>
                                                    <td>{categorie.libelle}</td>
                                                    <td>
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategorie(categorie.id)}>Supprimer</button>
                                                    </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Onglet Équipements */}
                    <div className="tab-pane fade" id="equipement" role="tabpanel" aria-labelledby="equipement-tab">
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Créer un Équipement</h5>
                                        <form onSubmit={handleAddEquipement}>
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="name" placeholder="Nom de l'équipement" value={newEquipement.name} onChange={handleEquipementChange} />
                                                <label htmlFor="name">Nom de l'équipement</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <select className="form-select" id="categoryId" value={newEquipement.categoryId} onChange={handleEquipementChange}>
                                                    <option value="" disabled>Sélectionner une catégorie</option>
                                                    {categories.map((categorie) => (
                                                    <option key={categorie.id} value={categorie.id}>{categorie.libelle}</option>
                                                    ))}
                                                </select>
                                                <label htmlFor="categoryId">Catégorie</label>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Ajouter Équipement</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className='col-md-8'>
                                {/* Liste des équipements */}
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Liste des Équipements</h6>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Catégorie</th>
                                                    <th>Quantité</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {equipements.map((equipement) => (
                                                    <tr key={equipement.id}>
                                                        <td>{equipement.nomEquipement}</td>
                                                        <td>{equipement.nomCategorie}</td>
                                                        <td>{equipement.quantite}</td>
                                                        <td>
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEquipement(equipement.id)}>Supprimer</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default EquipementCreate;