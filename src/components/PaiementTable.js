import React from 'react';

const PaiementTable = ({ paiements, handleSort, handleViewClick, handleDeleteClick, confirmDeleteId, setConfirmDeleteId, confirmDelete }) => {
    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('nom')}>Nom</th>
                        <th onClick={() => handleSort('prenom')}>Prénom</th>
                        <th onClick={() => handleSort('typePaiement')}>Type de Paiement</th>
                        <th onClick={() => handleSort('montant')}>Montant Payé</th>
                        <th onClick={() => handleSort('date')}>Date de Paiement</th>
                        <th onClick={() => handleSort('method')}>Méthode de Paiement</th>
                        <th onClick={() => handleSort('restant')}>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="payment-list">
                    {paiements.length > 0 ? (
                        paiements.map((paiement) => (
                            <tr key={paiement.id}>
                                <td>{paiement.id}</td>
                                <td>{paiement.nomAbonne}</td>
                                <td>{paiement.prenomAbonne}</td>
                                <td>{paiement.typePaiement}</td>
                                <td>{paiement.montantPaye}</td>
                                <td>{new Date(paiement.datePaiement).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                                <td>{paiement.modePaiement}</td>
                                <td>{paiement.statutPaiement}</td>
                                <td>
                                    <button
                                        className='btn btn-info btn-sm me-2'
                                        title='consulter'
                                        onClick={() => handleViewClick(paiement.id)}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                        className='btn btn-danger btn-sm'
                                        title='supprimer'
                                        onClick={() => handleDeleteClick(paiement.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">Aucun paiement trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal de confirmation de suppression */}
            {confirmDeleteId && (
                <div className="modal fade show d-block" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmation de suppression</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDeleteId(null)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Êtes-vous sûr de vouloir supprimer ce paiement ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Annuler</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Confirmer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaiementTable;
