import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PaiementService from '../../services/PaiementService';

const PaiementDetails = () => {
    const { id } = useParams();
    const [paiement, setPaiement] = useState(null);
    const [montantPaye, setMontantPaye] = useState(0);

    useEffect(() => {
        PaiementService.getPaiementAbonneById(id)
        .then(response => {
            setPaiement(response.data);
            setMontantPaye(response.data.montantPaye);
        })
        .catch(error => {
            console.error("Erreur lors du chargement des details du Paiements:", error);
        });
    }, [id]);

    const handleUpdatePayment = () => {
        // Logic to update the payment
        const updatedPayment = { ...paiement, montantPaye };
        PaiementService.updatePaiement(id, updatedPayment) // Supposons qu'une méthode updatePaiement existe dans le service
            .then(response => {
                setPaiement(response.data);
                alert("Paiement mis à jour avec succès !");
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour du Paiement:", error);
                alert("Erreur lors de la mise à jour du paiement.");
            });
    };

    if (!paiement) {
        return <div>Chargement...</div>;
    }

    return (
        <div className='container mt-5'>
             <Link to="/paiement" className="btn btn-danger mb-4">
                <i className="bi bi-arrow-left"></i> Retour
            </Link>
            <div className='card'>
                <div className='card-body'>
                    <h2 className='card-title'>Détails du Paiement</h2>
                    <p><strong>Nom complet de l'abonné:</strong> {paiement.prenomAbonne} {paiement.nomAbonne}</p>
                    <p><strong>Type de paiement:</strong> {paiement.typePaiement}</p>
                    <p><strong>Mode de paiement:</strong> {paiement.modePaiement}</p>
                    <p><strong>Montant à payer:</strong> {paiement.montantAPayer}</p>
                    <p><strong>Montant payé:</strong> {paiement.montantPaye}</p>
                    <p><strong>Montant restant:</strong> {paiement.montantRestant}</p>
                    <p><strong>Statut du Paiement:</strong> {paiement.statutPaiement}</p>
                    <p><strong>Date de Paiement:</strong> {new Date(paiement.datePaiement).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</p>
                    <p><strong>Commentaires:</strong> {paiement.commentaire}</p>
                </div>
                <div className='card mt-4'>
                    <div className='card-body'>
                        <h3 className='card-title'>Mettre à jour le paiement</h3>
                        <div>
                            <input 
                                type="number"
                                value={montantPaye}
                                onChange={(e) => setMontantPaye(parseFloat(e.target.value))}
                            />
                            <button onClick={handleUpdatePayment}>Mettre à jour</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaiementDetails;
