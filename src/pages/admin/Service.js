import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import InscriptionService from '../../services/InscriptionService';
import TypeAbonnementService from '../../services/TypeAbonnementService';

const Service = () => {
    // State pour gérer les champs du formulaire
    const [formData, setFormData] = useState({
        nomService: '',
        duree: '',
        description: '',
        prix: '',
        typeService: 'inscription',
    });

    // Gérer le changement de valeur dans les champs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
        ...formData,
        [id]: value
        });
    };

    // Gérer le changement de type de service
    const handleTypeChange = (e) => {
        const { value } = e.target;
        setFormData({
        ...formData,
        typeService: value,
        duree: value === 'inscription' ? '' : formData.duree, // Effacer la durée si c'est une inscription
        });
    };

    // Gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Préparer les données pour l'inscription ou le type d'abonnement
        if (formData.typeService === 'inscription') {
            const newInscription = {
                libelle: formData.nomService,
                tarif: formData.prix,
                description: formData.description
            };

            // Appel API pour créer une inscription
            InscriptionService.createInscription(newInscription)
            .then(response => {
                console.log("Inscription créée avec succès:", response.data);
                alert('Inscription crée avec succès');
            })
            .catch(error => {
                console.error("Erreur lors de la création de l'inscription:", error);
                alert('Erreur lors de la création de l\'inscription');
            });
        } 
        else if (formData.typeService === 'abonnement') {
            const newTypeAbonnement = {
                libelle: formData.nomService,
                dureeJour: formData.duree,
                tarif: formData.prix,
                description: formData.description
            };

            // Appel API pour créer un type d'abonnement
            TypeAbonnementService.createTypeAbonnement(newTypeAbonnement)
            .then(response => {
                console.log("Type d'abonnement créé avec succès:", response.data);
                alert('Type d\'abonnement crée avec succès');
            })
            .catch(error => {
                console.error("Erreur lors de la création du type d'abonnement:", error);
                alert('Erreur lors de la création du type d\'abonnement');
            });
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
                        <li class="nav-item"><Link to='/admin/service' class="nav-link active" >Créer un service</Link></li>
                        <li class="nav-item"><Link to='/admin/service-list' class="nav-link">Liste des services</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section container'>
                <div className="card mb-5">
                    <div className="card-header">
                        <h5>Créer un service</h5>
                    </div>
                    <div className="card-body">
                        <form id="form-service" onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            id="typeService"
                                            className="form-select"
                                            value={formData.typeService}
                                            onChange={handleTypeChange}
                                        >
                                            <option value="inscription">Inscription</option>
                                            <option value="abonnement">Abonnement</option>
                                        </select>
                                        <label htmlFor="typeService">Type de service</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nomService"
                                            placeholder="Nom du service"
                                            value={formData.nomService}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="nomService">Libellé du service</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="prix"
                                            placeholder="Prix en FCFA"
                                            value={formData.prix}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="prix">Définissez le tarif (FCFA)</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            placeholder="Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="description">Description</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                 {/* Afficher la durée si le type de service est "abonnement" */}
                                 {formData.typeService === 'abonnement' && (
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                            type="number"
                                            className="form-control"
                                            id="duree"
                                            placeholder="Durée en jours"
                                            value={formData.duree}
                                            onChange={handleChange}
                                            required
                                            />
                                            <label htmlFor="duree">Durée (en jours)</label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Enregistrer
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default Service;