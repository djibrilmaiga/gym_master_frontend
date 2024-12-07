import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import Filter from '../../components/Filter';
import PaiementTable from '../../components/PaiementTable';
import PaiementService from '../../services/PaiementService';

const PaiementListAdm = () => {
    const [paiements, setPaiements] = useState([]);
    const [filteredPaiements, setFilteredPaiements] = useState([]);
    const [search, setSearch] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate(); 

  // Simulation de l'appel d'une API pour récupérer les paiements
  useEffect(() => {
    const fetchPaiements = async () => {
        try{
            const response = await PaiementService.getAllPaiementsWithAbonneInfo();
            setPaiements(response.data);
        } catch (error) {
            console.error("Erreur du chargement des Paiements: ", error);
        }
    };
    fetchPaiements();
}, []);

    // Filtrer la liste par méthode de paiement
    useEffect(() => {
        const filtered = paiements.filter((paiement) => {
            return (
                paiement.modePaiement.includes(paymentMethod) &&
                (paiement.nomAbonne.toLowerCase().includes(search.toLowerCase()) ||
                paiement.prenomAbonne.toLowerCase().includes(search.toLowerCase()))
            );
        });
        setFilteredPaiements(filtered);
    }, [paymentMethod, search, paiements]);

    // Gestionnaire de vue d'un paiement
    const handleViewClick = (id) => {
        navigate(`/paiement/${id}`);
    }

    // Gestionnaire pour supprimer les paiements
    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    };

    // Fonction d'Appel API pour supprimer
    const confirmDelete = async () => {
        try {
            // Appel API pour supprimer le paiement
            await PaiementService.deletePaiement(confirmDeleteId);
            // Mise à jour de la liste des abonnés
            const updatedPaiements = paiements.filter(paiement => paiement.id !== confirmDeleteId);
            setPaiements(updatedPaiements);
            setFilteredPaiements(updatedPaiements);
            // Réinitialisation de l'état 
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(`Erreur lors de la suppression de l'abonné avec id ${confirmDeleteId}:`, err);
        }
    };

    // Gestion du tri par colonne
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedPaiements = [...filteredPaiements].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortConfig({ key, direction });
        setFilteredPaiements(sortedPaiements);
    };

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <section className='section mt-3'>
                <h2>Suivi des Paiements</h2>

            {/* Filtres */}
            <Filter 
                search={search}
                setSearch={setSearch}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod} />

            {/* Tableau des paiements */}
            <PaiementTable 
                paiements={filteredPaiements}
                handleSort={handleSort}
                handleViewClick={handleViewClick}
                handleDeleteClick={handleDeleteClick}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                confirmDelete={confirmDelete} />
            </section>
        </div>
    </div>
  );
};

export default PaiementListAdm;