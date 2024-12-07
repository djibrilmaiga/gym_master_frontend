import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AbonneService from '../../services/AbonneService';
import Sidebar from '../../components/Siderbar';
import Header from '../../components/Header';

const Abonne = () => {
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [abonnes, setAbonnes] = useState([]); // État pour stocker la liste des abonnés
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(''); // État d'erreur

    const navigate = useNavigate();

    // Fonction pour récupérer la liste des abonnés depuis l'API
    useEffect(() => {
        const fetchAbonnes = async () => {
            try {
                setLoading(true); // Début du chargement
                const response = await AbonneService.getAllAbonnes();
                setAbonnes(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des abonnés.');
                console.error(err);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };
        fetchAbonnes();
    }, []);

    // Gestionnaire de Recherche
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Gestionnaire pour consulter un abonné
    const handleViewClick = (id) => {
        navigate(`/abonne/${id}`);
    };

    // Gestionnaire pour supprimer un abonné
    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    };

    // Fonction d'Appel API pour supprimer
    const confirmDelete = async () => {
        try {
            // Appel API pour supprimer l'abonné
            await AbonneService.deleteAbonne(confirmDeleteId);
            // Mise à jour de la liste des abonnés
            setAbonnes(abonnes.filter(abonne => abonne.id !== confirmDeleteId));
             // Réinitialisation de l'état 
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(`Erreur lors de la suppression de l'abonné avec id ${confirmDeleteId}:`, err);
        }
    };

    //  Fonction de Filtrage des abonnés selon la recherche
    const filteredAbonnes = abonnes.filter(abonne => 
        abonne.telephone.toLowerCase().includes(search.toLowerCase()) ||
        abonne.nom.toLowerCase().includes(search.toLowerCase()) ||
        abonne.prenom.toLowerCase().includes(search.toLowerCase())
    );

    // Fonction de tri
    const handleSort = (column) => {
        const direction = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        filteredAbonnes.sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return null;
        if (sortDirection === 'asc') return <i className="fas fa-sort-up"></i>;
        return <i className="fas fa-sort-down"></i>;
    };

    return (
        <>
            <div className='wrapper d-flex'>
                <Sidebar />
                <div className='content'>
                    <Header />
                    <div className="navbar navbar-expand-md">
                        <nav className="breadcrumb">
                            <ul className="nav nav-tabs mb-4 ms-auto">
                                <li className="nav-item"><Link className="nav-link active" to="/abonne">Liste des abonnés</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/abonne-add">Inscrire un abonné</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/abonnement">Suivi des abonnements</Link></li>
                            </ul>
                        </nav>
                    </div>

                    <section className='list-abonne'>
                        <h2>Liste des abonnés</h2>
                        <input
                            type="text"
                            id="search"
                            className="form-control mb-3"
                            placeholder="Rechercher par téléphone, nom ou prénom"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        
                        {loading ? (
                            <p>Chargement...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <table className="table table-striped table-bordered table-hover table-abonnes">
                                <thead>
                                    <tr>
                                        <th className="text-center" onClick={() => handleSort('id')}>N° {getSortIcon('id')}</th>
                                        <th className="text-center" onClick={() => handleSort('nom')}>Nom {getSortIcon('nom')}</th>
                                        <th className="text-center" onClick={() => handleSort('prenom')}>Prénom {getSortIcon('prenom')}</th>
                                        <th className="text-center" onClick={() => handleSort('genre')}>Genre {getSortIcon('genre')}</th>
                                        <th className="text-center" onClick={() => handleSort('telephone')}>Téléphone {getSortIcon('telephone')}</th>
                                        <th className="text-center" onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                                        <th className="text-center" onClick={() => handleSort('dateInscription')}>Date d'inscription {getSortIcon('dateInscription')}</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAbonnes.length > 0 ? (
                                        filteredAbonnes.map(abonne => (
                                            <tr key={abonne.id}>
                                                <td>{abonne.id}</td>
                                                <td>{abonne.nom}</td>
                                                <td>{abonne.prenom}</td>
                                                <td>{abonne.genre}</td>
                                                <td>{abonne.telephone}</td>
                                                <td>{abonne.email}</td>
                                                <td>{new Date(abonne.dateInscription).toLocaleDateString('fr-FR', {day: '2-digit',month: '2-digit',year: 'numeric'})}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-info btn-sm me-2"
                                                        title="Consulter"
                                                        onClick={() => handleViewClick(abonne.id)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        title="Supprimer"
                                                        onClick={() => handleDeleteClick(abonne.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">Aucun abonné trouvé</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

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
                                            Êtes-vous sûr de vouloir supprimer cet abonné ?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Annuler</button>
                                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Confirmer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default Abonne;
