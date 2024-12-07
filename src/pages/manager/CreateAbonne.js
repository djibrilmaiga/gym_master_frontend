import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InscriptionService from '../../services/InscriptionService';
import AbonneService from '../../services/AbonneService';
import TypeAbonnementService from '../../services/TypeAbonnementService';
import Sidebar from '../../components/Siderbar';
import Header from '../../components/Header';

const CreateAbonne = () => {
    // Etats des données Abonnés, Inscriptions et TypeAbonnements
    const [abonne, setAbonne] = useState({
        nom: '',
        prenom: '',
        genre: '',
        telephone: '+223',
        email: '',
        dateInscription: new Date(),
        paiementTotal: 0.00,
        paiements: [],
        abonnements: []
    });
    const [inscriptions, setInscriptions] = useState([]);
    const [typeAbonnements, setTypeAbonnements] = useState([]);

    const [selectedInscription, setSelectedInscription] = useState(null);
    const [selectedTypeAbonnement, setSelectedTypeAbonnement] = useState(null);

    const [modePaiementInscription, setModePaiementInscription] = useState('');
    const [montantAPayerInscription, setMontantAPayerInscription] = useState(0);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [modePaiementAbonnement, setModePaiementAbonnement] = useState('');
    const [montantAPayerAbonnement, setMontantAPayerAbonnement] = useState(0);
    const [montantPayeAbonnement, setMontantPayeAbonnement] = useState(0);
    const [montantRestant, setMontantRestant] = useState(0.0);
    const [statutPaiement, setStatutPaiement] = useState('Partiel');
    const [dateDebutAbonnement, setDateDebutAbonnement] = useState(new Date());

    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    // Chargement des données via API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inscriptionsResponse, typeAbonnementsResponse] = await Promise.all([
                    InscriptionService.getAllInscriptions(),
                    TypeAbonnementService.getAllTypeAbonnement()
                ]);
                setInscriptions(inscriptionsResponse.data);
                setTypeAbonnements(typeAbonnementsResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Gestionnaire pour l'inscription
    const handleInscriptionChange = (event) => {
        const selectedId = event.target.value;
        const selectedInscription = inscriptions.find(inscription => inscription.id === parseInt(selectedId));
        setSelectedInscription(selectedInscription);
        setMontantAPayerInscription(selectedInscription ? selectedInscription.tarif : 0);
    };

    // Gestionnaire pour le type d'abonnement
    const handleTypeAbonnementChange = (event) => {
        const selectedId = event.target.value;
        const selectedType = typeAbonnements.find(type => type.id === parseInt(selectedId));
        setSelectedTypeAbonnement(selectedType);
        setMontantAPayerAbonnement(selectedType ? selectedType.tarif : 0);
    };

    // Gestionnaire de changement des champs de formulaire
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAbonne({ ...abonne, [name]: value });
    };

    // Calcul du montant restant et statut paiement pour l'abonnement
    useEffect(() => {
        if (montantPayeAbonnement > 0 && montantAPayerAbonnement > 0) {
            const remainingAmount = montantAPayerAbonnement - montantPayeAbonnement;
            setMontantRestant(remainingAmount);
            setStatutPaiement(remainingAmount === 0 ? 'Complet' : 'Partiel');
        }
    }, [montantPayeAbonnement, montantAPayerAbonnement]);

    // Validation des champs du formulaire
    const validateForm = () => {
        let formErrors = {};
        if (!abonne.nom) formErrors.nom = "Le nom est obligatoire";
        if (!abonne.prenom) formErrors.prenom = "Le prénom est obligatoire";
        if (!abonne.telephone) formErrors.telephone = "Le téléphone est obligatoire";
        if (!selectedInscription) formErrors.inscription = "Sélectionnez une inscription";
        
        // Si l'abonnement est activé, vérifier les détails d'abonnement
        if (isSubscribed) {
            if (!selectedTypeAbonnement) formErrors.typeAbonnement = "Sélectionnez un type d'abonnement";
            if (!montantPayeAbonnement || montantPayeAbonnement <= 0) formErrors.paiementAbonnement = "Le paiement de l'abonnement est requis";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Gestionnaire de soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); 

        if (!validateForm()) {
            return; // Si des erreurs existent, stopper l'envoi du formulaire
        }
        
        // Préparer le paiement de l'inscription
        const paiementInscription = {
            typePaiement: 'Inscription',
            modePaiement: modePaiementInscription,
            datePaiement: new Date(),
            statutPaiement: 'Complet',
            montantAPayer: montantAPayerInscription,
            montantPaye: montantAPayerInscription,
            montantRestant: 0,
            commentaire: 'Paiement frais d’inscription'
        };
        
        // Ajouter le paiement d'inscription à l'abonné
        const updatedAbonne = { 
            ...abonne, 
            paiements: [paiementInscription], 
            paiementTotal: montantAPayerInscription
        };

        // Si l'utilisateur souhaite également s'abonner
        if (isSubscribed && selectedTypeAbonnement) {
            const remainingAmount = montantAPayerAbonnement - montantPayeAbonnement;

            // Préparer le paiement de l'abonnement
            const paiementAbonnement = {
                typePaiement: 'Abonnement',
                modePaiement: modePaiementAbonnement,
                datePaiement: new Date(),
                statutPaiement: remainingAmount === 0 ? 'Complet' : 'Partiel',
                montantAPayer: montantAPayerAbonnement,
                montantPaye: montantPayeAbonnement,
                montantRestant: remainingAmount,
                commentaire: 'Paiement abonnement'
            };

            // Préparer l'objet abonnement
            const abonnement = {
                dateDebut: dateDebutAbonnement,
                dateFin: new Date(new Date(dateDebutAbonnement).setDate(new Date(dateDebutAbonnement).getDate() + selectedTypeAbonnement.dureeJour)),
                statutAbonnement: "Actif",
                typeId: selectedTypeAbonnement.id
            };

            // Mettre à jour l'abonné avec le paiement d'abonnement et l'abonnement
            updatedAbonne.paiements.push(paiementAbonnement);
            updatedAbonne.abonnements.push(abonnement);
            updatedAbonne.paiementTotal += montantPayeAbonnement;
        }

        // Appel API pour créer l'abonné
        try {
            await AbonneService.createAbonne(updatedAbonne);
            setSuccess(true);
            navigate('/abonne');
        } catch (error) {
            setError('Une erreur est survenue lors de la création de l’élément.');
            console.error('Erreur lors de la création de l\'abonné : ', error);
        }
    };

    const handleSubscriptionToggle = () => {
        setIsSubscribed(!isSubscribed);
    };

    return (
        <div className="wrapper d-flex">
            <Sidebar />
            <div className="content">
                <Header />

                <div className="navbar navbar-expand-md">
                    <nav className="breadcrumb">
                        <ul className="nav nav-tabs mb-4 ms-auto">
                            <li className="nav-item"><Link className="nav-link" to="/abonne">Liste des abonnés</Link></li>
                            <li className="nav-item"><Link className="nav-link active" to="/abonne-add">Inscrire un abonné</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/abonnement">Suivi des abonnements</Link></li>
                        </ul>
                    </nav>
                </div>

                <section className='section'>
                    <div className="container mt-5">
                        <div className="card">
                            <div className="card-header">
                                <h4>Inscription d'un Abonné</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    id="nom"
                                                    name='nom'
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Nom" 
                                                    value={abonne.nom}
                                                    onChange={handleInputChange}
                                                    required 
                                                />
                                                <label htmlFor="nom">Nom</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    id="prenom"
                                                    name='prenom' 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Prénom" 
                                                    value={abonne.prenom}
                                                    onChange={handleInputChange}
                                                    required 
                                                />
                                                <label htmlFor="prenom">Prénom</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    id="genre"
                                                    name='genre'
                                                    className="form-control"
                                                    value={abonne.genre}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="" disabled>Sélectionnez un genre</option>
                                                    <option value="Homme">Homme</option>
                                                    <option value="Femme">Femme</option>
                                                </select>
                                                <label htmlFor="genre">Genre</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    id="telephone"
                                                    name='telephone'
                                                    type="tel" 
                                                    className="form-control" 
                                                    placeholder="Téléphone" 
                                                    value={abonne.telephone}
                                                    onChange={handleInputChange}
                                                    maxLength={12}
                                                    required 
                                                />
                                                <label htmlFor="telephone">Téléphone</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    id="email"
                                                    name='email'
                                                    type="email" 
                                                    className="form-control"                                                      
                                                    placeholder="Email" 
                                                    value={abonne.email} 
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="email">Email</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    id="date-inscription"
                                                    name='dateInscription' 
                                                    type="date" 
                                                    className="form-control" 
                                                    placeholder="Date d'Inscription" 
                                                    value={abonne.dateInscription || new Date().toISOString().split('T')[0]}
                                                    onChange={handleInputChange}  
                                                    required 
                                                />
                                                <label htmlFor="date-inscription">Date d'Inscription</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    id="type-inscription"
                                                    className="form-control"                                                    
                                                    onChange={handleInscriptionChange}
                                                    required
                                                >
                                                    <option value="">Sélectionnez une formule d'inscription</option>
                                                    {inscriptions.map((inscription) => (
                                                        <option key={inscription.id} value={inscription.id}>
                                                            <strong>{inscription.libelle} - {inscription.tarif} Fcfa</strong>
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor="type-inscription">Formule Inscription</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-control">
                                                <label>Montant à Payer : {montantAPayerInscription} FCFA </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    id="mode-paiement-abonnement"
                                                    className="form-control"                                                    
                                                    value={modePaiementInscription}
                                                    onChange={(e) => setModePaiementInscription(e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled>Sélectionnez le mode de paiement</option>
                                                    <option value="Espece">Espèce</option>
                                                    <option value="Mobile_Money">Mobile Money</option>
                                                </select>
                                                <label htmlFor="mode-paiement-abonnement">Mode de Paiement</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-check form-switch mb-3">
                                        <input 
                                            id="subscribe-switch" 
                                            className="form-check-input" 
                                            type="checkbox"                                            
                                            checked={isSubscribed} 
                                            onChange={handleSubscriptionToggle} 
                                        />
                                        <label className="form-check-label" htmlFor="subscribe-switch">Souscrire à un abonnement ?</label>
                                    </div>

                                    {isSubscribed && (
                                        <>
                                            <h4 className="mb-3">Souscription à un Abonnement</h4>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <select 
                                                            id="type-abonnement" 
                                                            className="form-control"                                                             
                                                            onChange={handleTypeAbonnementChange} 
                                                            required
                                                        >
                                                            <option value="">Choisir un abonnement</option>
                                                            {typeAbonnements.map((abonnement) => (
                                                                <option key={abonnement.id} value={abonnement.id}>
                                                                    {abonnement.libelle} - {abonnement.tarif} Fcfa
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="type-abonnement">Type d'Abonnement</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <select
                                                            id="mode-paiement-abonnement"
                                                            className="form-control"                                                            
                                                            value={modePaiementAbonnement}
                                                            onChange={(e) => setModePaiementAbonnement(e.target.value)}
                                                            required
                                                        >
                                                            <option value="" disabled>Sélectionnez le mode de paiement</option>
                                                            <option value="Espece">Espèce</option>
                                                            <option value="Mobile_Money">Mobile Money</option>
                                                        </select>
                                                        <label htmlFor="mode-paiement-abonnement">Mode de Paiement (Abonnement) :</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">                                                
                                                <div className="col-md-6">
                                                    <div className="form-control">
                                                        <label>Montant à Payer : {montantAPayerAbonnement} FCFA</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input 
                                                            id="montant-paye" 
                                                            type="number" 
                                                            className="form-control"                                                            
                                                            placeholder="Montant Payé" 
                                                            value={montantPayeAbonnement}
                                                            onChange={(e) => setMontantPayeAbonnement(parseFloat(e.target.value) || 0)}
                                                            min="0" 
                                                            required 
                                                        />
                                                        <label htmlFor="montant-paye">Montant Payé (Abonnement)</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">                                                
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input 
                                                            id="date-abonnement" 
                                                            type="date" 
                                                            className="form-control" 
                                                            placeholder="Date d'Inscription"
                                                            value={dateDebutAbonnement}
                                                            onChange={(e) => { setDateDebutAbonnement(e.target.value)}}
                                                            required 
                                                        />
                                                        <label htmlFor="date-abonnement">Date debut de l'abonnement</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <button type="submit" className="btn btn-success">
                                        Enregistrer un Abonné
                                    </button>
                                </form>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {success && <p style={{ color: 'green' }}>Élément créé avec succès !</p>}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CreateAbonne;