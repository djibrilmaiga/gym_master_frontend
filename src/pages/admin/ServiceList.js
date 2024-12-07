import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SiderBarAdm from '../../components/SiderBarAdm';
import InscriptionService from '../../services/InscriptionService';
import TypeAbonnementService from '../../services/TypeAbonnementService';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]); // Liste filtrée
    const [filterType, setFilterType] = useState(''); // Type de service sélectionné
    const navigate = useNavigate();

    // Récupération des inscriptions et abonnements au montage du composant
        useEffect(() => {
        const fetchServices = async () => {
            try {
                const inscriptionsResponse = await InscriptionService.getAllInscriptions();
                const inscriptions = inscriptionsResponse.data.map((inscription) => ({
                    id: inscription.id,
                    nom: inscription.libelle,
                    prix: inscription.tarif,
                    description: inscription.description,
                    typeService: 'Inscription'
                }));

                const abonnementsResponse = await TypeAbonnementService.getAllTypeAbonnement();
                const abonnements = abonnementsResponse.data.map((abonnement) => ({
                    id: abonnement.id,
                    nom: abonnement.libelle,
                    prix: abonnement.tarif,
                    duree: abonnement.dureeJour,
                    description: abonnement.description,
                    typeService: 'Abonnement'
                }));

                const allServices = [...inscriptions, ...abonnements];
                setServices(allServices);
                setFilteredServices(allServices);
            } catch (error) {
                console.error('Erreur lors du chargement des services:', error);
            }
        };

        fetchServices();
    }, []);

    // Filtrage basé sur le type de service sélectionné (Inscription/Abonnement/Tous)
    useEffect(() => {
        if (filterType === '') {
            // Si aucun type n'est sélectionné, afficher tous les services
            setFilteredServices(services);
        } else {
            // Sinon, filtrer par type
            const filtered = services.filter(service => service.typeService === filterType);
            setFilteredServices(filtered);
        }
    }, [filterType, services]); // Filtrer à chaque changement de filterType ou de services

    // Fonction pour changer le type de filtre
    const handleFilterType = (e) => {
        setFilterType(e.target.value); // Met à jour le type de filtre
    };

    // Fonction pour supprimer un service
    const handleDelete = (id) => {
        const updatedServices = services.filter((service) => service.id !== id);
        setServices(updatedServices);
        setFilteredServices(updatedServices);
    };

    // Fonction pour rediriger vers la page d'édition d'un service
    const handleEdit = (id) => {
        navigate(`/edit-service/${id}`);
    };

    // Redirection vers la page d'ajout de service
    const handleAdd = () => {
        navigate('/admin/service');
    };

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/service' class="nav-link" >Créer un service</Link></li>
                        <li class="nav-item"><Link to='/admin/service-list' class="nav-link active">Liste des services</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section container'>
                <div className="card">
                    <div className="card-header">
                        <h5>Liste des Services</h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <label className="me-3">
                                <input
                                    type="radio"
                                    value=""
                                    checked={filterType === ''}
                                    onChange={handleFilterType}
                                    className="me-1"
                                />
                                Tous les services
                            </label>
                            <label className="me-3">
                                <input
                                    type="radio"
                                    value="Inscription"
                                    checked={filterType === 'Inscription'}
                                    onChange={handleFilterType}
                                    className="me-1"
                                />
                                Inscription
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Abonnement"
                                    checked={filterType === 'Abonnement'}
                                    onChange={handleFilterType}
                                    className="me-1"
                                />
                                Abonnement
                            </label>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom du service</th>
                                    <th>Tarif (FCFA)</th>
                                    <th>Type de Service</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((service) => (
                                    <tr key={service.id}>
                                        <td>{service.nom}</td>
                                        <td>{service.prix}</td>
                                        <td>{service.typeService}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(service.id)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-success mt-3" onClick={handleAdd}>
                            <i className="fas fa-plus"></i> Ajouter un Service
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
};

export default ServiceList;