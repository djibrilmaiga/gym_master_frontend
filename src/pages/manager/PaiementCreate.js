import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import AbonneService from '../../services/AbonneService';
import AbonnementService from '../../services/AbonnementService';
import PaiementService from '../../services/PaiementService';
import TypeAbonnementService from '../../services/TypeAbonnementService';

const PaiementCreate = () => {
    const [abonnes, setAbonnes] = useState([]);
    const [typeAbonnements, setTypeAbonnements] = useState([]);
    const [service, setService] = useState('');
    const [paiement, setPaiement] = useState({
      typePaiement: '',
      modePaiement: '',
      montantAPayer: 0,
      montantPaye: 0,
      montantRestant: 0,
      statutPaiement: '',
      commentaire: '',
    });
    const [abonnement, setAbonnement] = useState({
      dateDebut: '',
      dateFin: '',
      statutAbonnement: '',
    });
    const [selectedAbonne, setSelectedAbonne] = useState('');
    const [selectedTypeAbonnement, setSelectedTypeAbonnement] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Fetch all abonnes
      AbonneService.getAllAbonnesSelected().then(response => {
        setAbonnes(response.data);
      });
  
      // Fetch all typeAbonnement
      if (service === 'Abonnement') {
        TypeAbonnementService.getAllTypeAbonnement().then(response => {
          setTypeAbonnements(response.data);
        });
      }

      if (service === 'Seance') {
        setPaiement((prevState) => ({
          ...prevState,
          montantAPayer: 5000,  // Exemple de tarif fixe pour une séance
          montantRestant: 5000 - prevState.montantPaye,
        }));
      }
      
    }, [service]);
  
    const handleAbonneChange = (e) => {
      setSelectedAbonne(e.target.value);
    };
  
    const handleTypeAbonnementChange = (e) => {
      const selected = typeAbonnements.find(
        (type) => type.id === parseInt(e.target.value)
      );
      setSelectedTypeAbonnement(selected);
      setPaiement({
        ...paiement,
        typePaiement: 'Abonnement',
        montantAPayer: selected.tarif,
        montantRestant: selected.tarif - paiement.montantPaye,
      });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPaiement((prevState) => ({
        ...prevState,
        [name]: value,
        montantRestant: prevState.montantAPayer - prevState.montantPaye,
      }));
      if (name === 'montantPaye') {
        const remaining = paiement.montantAPayer - value;
        setPaiement((prevState) => ({
          ...prevState,
          montantRestant: remaining,
          statutPaiement: remaining === 0 ? 'Complet' : 'Partiel',
        }));
      }
    };
  
    const handleAbonnementDateChange = (e) => {
      const dateDebut = e.target.value;
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + selectedTypeAbonnement.dureeJour);
      setAbonnement({
        dateDebut,
        dateFin: dateFin.toISOString().split('T')[0],
        statutAbonnement: 'Actif',
        typeId: selectedTypeAbonnement.id
      });
    };

    const handleServiceChange = (e) => {
        const selectedService = e.target.value;
        setService(selectedService);
      
        // Mettre à jour le type de paiement en fonction du service
        setPaiement((prevState) => ({
          ...prevState,
          typePaiement: selectedService === 'Abonnement' ? 'Abonnement' : 'Seance',
        }));
    };
      
  
    const handleSubmit = (e) => {
        e.preventDefault();
      
        // Vérifier si un abonné est sélectionné
        if (!selectedAbonne) {
          alert("Veuillez choisir un abonné.");
          return;
        }
      
        // Vérifier si un service est sélectionné
        if (!service) {
          alert("Veuillez choisir un service.");
          return;
        }
      
        const paiementData = {
          ...paiement,
          datePaiement: new Date().toISOString(),
        };
      
        if (service === 'Abonnement') {
          const abonnementData = {
            ...abonnement,
            statutAbonnement: paiement.statutPaiement === 'Complet' ? 'Actif' : 'Actif',
          };
          // Créer paiement et abonnement pour l'abonné
          PaiementService.createPaiement(selectedAbonne, paiementData)
          .then((response) => {
            console.log('Paiement enregistré', response);
            AbonnementService.createAbonnement(selectedAbonne, abonnementData)
            .then(() => {
              navigate('/paiement');
            });
          })
          .catch((error) => {
            console.error('Erreur lors de la création du paiement', error.response?.data || error.message);
          });
        } else if (service === 'Seance') {
          // Paiement de séance
          PaiementService.createPaiement(selectedAbonne, paiementData)
          .then((response) => {
            console.log('Paiement enregistré', response)
            navigate('/paiement');
          })
          .catch((error) => {
            console.error('Erreur lors de la création du paiement', error.response?.data || error.message);
          });
        }
    };

  return (
    <div className='wrapper d-flex'>
        <Sidebar />
        <div className='content'>
            <Header />
            <div className="navbar navbar-expand-md">
                <nav className="breadcrumb">
                    <ul className="nav nav-tabs mb-4 ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/paiement">Suivi des paiements</Link></li>
                        <li className="nav-item"><Link className="nav-link active" to="/paiement-add">Enregistrer un paiement</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/rapport-finance">Rapports financiers</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="card mb-4">
                    <div className="card-header">
                        <h4 className="mb-0">Enregistrer un Paiement</h4>
                    </div>
                    <div className="card-body">
                        <form id="payment-form" onSubmit={handleSubmit}>
                            {/* Sélection de l'abonné */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="subscriber" className="form-label">Abonné</label>
                                    <select
                                        id="subscriber"
                                        className="form-select"
                                        onChange={handleAbonneChange}
                                        required
                                    >
                                        <option value="">Choisir un abonné</option>
                                        {abonnes.map((abonne) => (
                                            <option key={abonne.id} value={abonne.id}>
                                                {abonne.prenom} {abonne.nom} - {abonne.telephone}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sélection du service */}
                                <div className="col-md-6">
                                    <label htmlFor="service" className="form-label">Service</label>
                                    <select
                                        id="service"
                                        className="form-select"
                                        value={service}
                                        onChange={handleServiceChange}
                                        required
                                    >
                                        <option value="" disabled>Choisir un service</option>
                                        <option value="Abonnement">Abonnement</option>
                                        <option value="Seance">Cours</option>
                                    </select>
                                </div>
                            </div>

                            {/* Champs dynamiques pour abonnement */}
                            {service === "Abonnement" && (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="type-abonnement" className="form-label">Formule d'Abonnement</label>
                                            <select
                                                id="type-abonnement"
                                                className="form-select"
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
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="payment-type" className="form-label">Type de Paiement</label>
                                            <input
                                                id="payment-type"
                                                name='typePaiement'
                                                className="form-select"
                                                value={paiement.typePaiement}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="payment-method" className="form-label">Mode de Paiement</label>
                                            <select
                                                id="payment-method"
                                                name='modePaiement'
                                                className="form-select"
                                                value={paiement.modePaiement}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Choisir un mode de paiement</option>
                                                <option value="Espece">Espèce</option>
                                                <option value="Mobile_Money">Mobile Money</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="amount-due" className="form-label">Montant à Payer</label>
                                            <input
                                                id="amount-due"
                                                name="montantAPayer"
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantAPayer}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="amount-paid" className="form-label">Montant Payé</label>
                                            <input
                                                id="amount-paid"
                                                name='montantPaye'
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantPaye}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="amount-remaining" className="form-label">Montant Restant</label>
                                            <input
                                                id="amount-remaining"
                                                name="montantRestant"
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantRestant}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label htmlFor="payment-status" className="form-label">Statut du Paiement</label>
                                            <input
                                                id="payment-status"
                                                name="statutPaiement"
                                                type="text"
                                                className="form-control"
                                                value={paiement.statutPaiement}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="date-abonnement">Date debut de l'abonnement</label>
                                            <input 
                                                id="date-abonnement" 
                                                type="date" 
                                                name='dateDebut'
                                                className="form-control"
                                                onChange={handleAbonnementDateChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="end-date" className="form-label">Date de Fin</label>
                                            <input
                                                id="end-date"
                                                name="dateFin"
                                                type="date"
                                                className="form-control"
                                                value={abonnement.dateFin}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Champs dynamiques pour cours */}
                            {service === "Seance" && (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="payment-type" className="form-label">Type de Paiement</label>
                                            <select
                                                id="payment-type"
                                                className="form-select"
                                                value={paiement.typePaiement}
                                                required
                                                readOnly
                                            >
                                                <option value={service} selected>Cours</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="payment-method" className="form-label">Mode de Paiement</label>
                                            <select
                                                id="payment-method"
                                                name='modePaiement'
                                                className="form-select"
                                                value={paiement.modePaiement}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="" disabled>Choisir un mode de paiement</option>
                                                <option value="Espece">Espèce</option>
                                                <option value="Mobile_Money">Mobile Money</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="amount-due" className="form-label">Montant à Payer</label>
                                            <input
                                                id="amount-due"
                                                name='montantAPayer'
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantAPayer}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="amount-paid" className="form-label">Montant Payé</label>
                                            <input
                                                id="amount-paid"
                                                name='montantPaye'
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantPaye}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="amount-remaining" className="form-label">Montant Restant</label>
                                            <input
                                                id="amount-remaining"
                                                type="number"
                                                className="form-control"
                                                value={paiement.montantRestant}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="payment-status" className="form-label">Statut du Paiement</label>
                                            <input
                                                id="payment-status"
                                                type="text"
                                                className="form-control"
                                                value={paiement.statutPaiement}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Commentaire */}
                            <div className="row mb-3">
                                <label htmlFor="comment" className="form-label">Commentaire</label>
                                <textarea
                                    id="comment"
                                    name='commentaire'
                                    className="form-control"
                                    value={paiement.commentaire}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-success">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>

            </section>
        </div>
    </div>
  )
}

export default PaiementCreate