import React, { useState, useEffect }  from 'react';
import Header from '../../components/Header';
import SiderBarAdm from '../../components/SiderBarAdm';
import AbonneService from '../../services/AbonneService';
import PaiementService from '../../services/PaiementService';
import ExemplaireService from '../../services/ExemplaireService';

const DashAdmin = () => {
    const [totalAbonnes, setTotalAbonnes] = useState(0);
    const [recetteMois, setRecetteMois] = useState(0);
    const [equipementsEnPanne, setEquipementsEnPanne] = useState(0);

    // Récuperer le nombre total d'abonnés
    const fetchTotalAbonne = async () =>{
      try {
        const response = await AbonneService.getTotalAbonne();
        setTotalAbonnes(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du nombre total d'abonnés");
      }
    };

    // Récupérer la somme des paiements pour le mois en cours
    const fetchSommePaiements = async () => {
        try {
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
            const response = await PaiementService.getSommePaiements(year, month);
            setRecetteMois(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des paiements", error);
        }
    };

  // Récuperer le nombre d'équipements en Panne
  const fetchExemplaireEnPanne = async () => {
    try {
      const response = await ExemplaireService.getNombreExemplaireEnPanne();
      setEquipementsEnPanne(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des exemplaires en panne", error);
    }
  }


  useEffect(() => {
    fetchTotalAbonne();
    fetchSommePaiements();
    fetchExemplaireEnPanne();
  }, []);

  return (
    <div className='wrapper d-flex'>
      <>
      <SiderBarAdm />
        <div className='content'>
            <Header />
            <section className='section'>
              <div className="container-fluid">
                <div className="row mt-4">
                  <h2>Vue d'ensemble</h2>

                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Total Abonnés</h5>
                        <p className="card-text">{totalAbonnes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Paiements du Mois</h5>
                        <p className="card-text">{recetteMois} FCFA</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications pour les équipements en panne */}
                <div className="row mt-4">
                  <h2>Notifications Automatiques</h2>
                  {equipementsEnPanne > 0 ? (
                    <div className="alert alert-danger" role="alert">
                      <strong>Problème détecté!</strong> <br />
                      {equipementsEnPanne} équipement{equipementsEnPanne > 1 ? "s sont" : " est"} signalé{equipementsEnPanne > 1 ? "s" : ""} en panne.
                    </div>
                  ) : (
                    <div className="alert alert-success" role="alert">
                      <strong>Tout va bien!</strong> <br />
                      Aucun équipement n'est en panne.
                    </div>
                  )}
                </div>
              </div>
            </section>
        </div> 
      </>
    </div>
  )
}

export default DashAdmin