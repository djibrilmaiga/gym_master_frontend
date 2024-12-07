import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tab, Table, Button } from 'react-bootstrap';
import EquipementService from '../../services/EquipementService';

const EquipmentDetails = () => {
    const { id } = useParams(); // Seul l'ID de l'équipement est utilisé
    const [selectedEquipement, setSelectedEquipement] = useState(null);
    const [key, setKey] = useState('details');

    useEffect(() => {
        // Appel API pour récupérer les détails de l'équipement par ID
        EquipementService.getEquipementById(id)
            .then((response) => {
                setSelectedEquipement(response.data); // Stocker l'équipement récupéré
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des détails de l\'équipement :', error);
            });
    }, [id]);
    
  /*  if (!selectedEquipement) {
        return <div>Chargement...</div>; // Afficher un message pendant le chargement
    }*/

    const handleView = (exemplaireId) => {
        console.log("Consulter l'exemplaire avec l'ID :", exemplaireId);
    };
    
    const handleEdit = (exemplaireId) => {
        console.log("Modifier l'exemplaire avec l'ID :", exemplaireId);
    };

    return (
        <div className="container mt-5">
            {!selectedEquipement ? (
                <div>Chargement...</div>
            ) : (
                <>
                    <h2 className="mb-4">Détails de l'équipement : {selectedEquipement.nom}</h2>
                    
                    {/* Bouton retour */}
                    <Link to="/equipement" className="btn btn-danger mb-4">
                        <i className="bi bi-arrow-left"></i> Retour
                    </Link>

                    <Tabs
                        id="equipement-details-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="details" title="Détails">
                            <div>
                                <p><strong>Nom de l'équipement :</strong> {selectedEquipement.nom}</p>
                                <p><strong>Quantité :</strong> {selectedEquipement.quantite}</p>
                            </div>
                        </Tab>
                        <Tab eventKey="exemplaires" title="Exemplaires">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Numéro de série</th>
                                        <th>État</th>
                                        <th>Dernière Date de Maintenance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEquipement.exemplaires.length === 0 ? (
                                        <tr>
                                            <td colSpan="4">Aucun exemplaire disponible.</td>
                                        </tr>
                                    ) : (
                                        selectedEquipement.exemplaires.map((exemplaire) => (
                                            <tr key={exemplaire.id}>
                                                <td>{exemplaire.numSerie}</td>
                                                <td>{exemplaire.etat}</td>
                                                <td>{exemplaire.dateDernierMaintenance ? exemplaire.dateDernierMaintenance : 'Aucune maintenance'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default EquipmentDetails;