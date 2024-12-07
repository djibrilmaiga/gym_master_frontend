import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import CategorieService from '../../services/CategorieService';
import ExemplaireService from '../../services/ExemplaireService';

const EquipementPanne = () => {
    const [categories, setCategories] = useState([]);
    const [selectedEquipement, setSelectedEquipement] = useState(null);
    const [selectedExemplaire, setSelectedExemplaire] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Charger les catégories et les équipements associés
        CategorieService.getAllCategorie()
            .then(response => setCategories(response.data))
            .catch(error => console.error('Erreur lors du chargement des catégories:', error));
    }, []);

    const handleEquipementSelect = (e) => {
        const equipementId = e.target.value;
        // Trouver l'équipement sélectionné
        const equipement = categories.flatMap(categorie => categorie.equipements).find(e => e.id == equipementId);
        setSelectedEquipement(equipement);
        setSelectedExemplaire(null); // Réinitialiser l'exemplaire lorsque l'équipement change
    };

    const handleExemplaireSelect = (e) => {
        const exemplaireId = e.target.value;
        const exemplaire = selectedEquipement.exemplaires.find(ex => ex.id == exemplaireId);
        setSelectedExemplaire(exemplaire);
    };

    const handleSubmit = () => {
        if (!selectedEquipement || !selectedExemplaire) {
            setError('Veuillez sélectionner un équipement et un exemplaire.');
            return;
        }

        // Mettre à jour l'état de l'exemplaire à "En_Panne"
        const updatedExemplaire = { ...selectedExemplaire, etat: 'En_panne' };

        ExemplaireService.updateExemplaire(selectedExemplaire.id, updatedExemplaire)
            .then(() => {
                alert(`L'exemplaire ${selectedExemplaire.numSerie} a été signalé en panne.`);
                // Réinitialiser la sélection après le succès de l'opération
                setSelectedEquipement(null);
                setSelectedExemplaire(null);
                setError('');
            })
            .catch(error => {
                setError('Erreur lors de la mise à jour de l\'état de l\'exemplaire.');
                console.error('Erreur:', error);
            });
    };


    return (
        <div className='wrapper d-flex'>
            <Sidebar />
            <div className='content'>
                <Header />
                <div className="navbar navbar-expand-md">
                    <nav className="breadcrumb">
                        <ul className="nav nav-tabs mb-4 ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/equipement">Suivi des équipements</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/equipement-add">Signaler une panne</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <section className='section'>
                    <div className="container mt-5">
                        <h2>Signaler un équipement en panne</h2>

                        <div className="mb-3">
                            <label htmlFor="equipement" className="form-label">Équipement</label>
                            <select
                                id="equipement"
                                className="form-select"
                                value={selectedEquipement ? selectedEquipement.id : ''}
                                onChange={handleEquipementSelect}
                            >
                                <option value="">-- Sélectionner un équipement --</option>
                                {categories.flatMap(categorie => categorie.equipements).map(equipement => (
                                    <option key={equipement.id} value={equipement.id}>
                                        {equipement.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEquipement && (
                            <div className="mb-3">
                                <label htmlFor="exemplaire" className="form-label">Exemplaire</label>
                                <select
                                    id="exemplaire"
                                    className="form-select"
                                    value={selectedExemplaire ? selectedExemplaire.id : ''}
                                    onChange={handleExemplaireSelect}
                                >
                                    <option value="">-- Sélectionner un exemplaire --</option>
                                    {selectedEquipement.exemplaires.map(exemplaire => (
                                        <option key={exemplaire.id} value={exemplaire.id}>
                                            {exemplaire.numSerie} - {exemplaire.etat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {error && <div className="alert alert-danger">{error}</div>}

                        {selectedExemplaire && (
                            <button
                                className="btn btn-danger"
                                onClick={handleSubmit}
                            >
                                Signaler comme en panne
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EquipementPanne;