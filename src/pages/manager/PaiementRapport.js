import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { saveAs } from "file-saver";
import Header from '../../components/Header';
import Sidebar from '../../components/Siderbar';
import PaiementService from "../../services/PaiementService";

const PaiementRapport = () => {
    const [period, setPeriod] = useState("monthly");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showCustomDates, setShowCustomDates] = useState(false);
    const [totalPaiements, setTotalPaiements] = useState(0);
    const [repartitionPaiements, setRepartitionPaiements] = useState([]);
    const [paiementsParMois, setPaiementsParMois] = useState([]);

    // Références pour les graphiques
    const paymentMethodsChartRef = useRef(null);
    const paymentTrendsChartRef = useRef(null);
    let paymentMethodsChartInstance = null;
    let paymentTrendsChartInstance = null;

    // Récupérer la somme des paiements pour le mois en cours
    const fetchSommePaiements = async () => {
        try {
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1; // Le mois est indexé à partir de 0
            const response = await PaiementService.getSommePaiements(year, month);
            setTotalPaiements(response.data); // Mettre à jour la somme des paiements
        } catch (error) {
            console.error("Erreur lors de la récupération des paiements", error);
        }
    };

    // Récupérer la répartition des paiements par mode (Espèce/Mobile Money)
    const fetchRepartitionPaiements = async () => {
        try {
            const response = await PaiementService.getRepartitionPaiementsParMode();
            setRepartitionPaiements(response.data); // Mettre à jour la répartition des paiements
        } catch (error) {
            console.error("Erreur lors de la récupération de la répartition des paiements", error);
        }
    };

    // Récupérer les paiements pour chaque mois de l'année en cours
    const fetchPaiementsParMois = async () => {
        const year = new Date().getFullYear();
        const moisLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const paiements = [];

        try {
            for (let month = 1; month <= 12; month++) {
                const response = await PaiementService.getSommePaiements(year, month);
                paiements.push(response.data);
            }
            setPaiementsParMois({
                labels: moisLabels,
                datasets: [{
                    label: "Paiements par mois",
                    data: paiements,
                    backgroundColor: "#36a2eb",
                }],
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des paiements mensuels", error);
        }
    };

    useEffect(() => {
        // Récupérer les données lors du chargement du composant
        fetchSommePaiements();
        fetchRepartitionPaiements();
        fetchPaiementsParMois();
    }, []);

    useEffect(() => {
        // Gérer la visibilité des dates personnalisées
        if (period === "custom") {
            setShowCustomDates(true);
        } else {
            setShowCustomDates(false);
        }
    }, [period]);

    useEffect(() => {
        // Vérifier que le canvas existe avant d'initialiser les graphiques
        if (paymentMethodsChartRef.current && paymentTrendsChartRef.current) {
            // Détruire les anciennes instances de graphique si elles existent
            if (paymentMethodsChartInstance) {
                paymentMethodsChartInstance.destroy();
            }
            if (paymentTrendsChartInstance) {
                paymentTrendsChartInstance.destroy();
            }

            // Préparer les données pour le graphique de répartition des paiements
            const repartitionData = {
                labels: repartitionPaiements.map(p => p.modePaiement),
                datasets: [{
                    label: "Répartition des méthodes de paiement",
                    data: repartitionPaiements.map(p => p.totalPaiements),
                    backgroundColor: ["#36a2eb", "#ff6384"],
                }],
            };

            // Initialisation des graphiques
            paymentMethodsChartInstance = new Chart(paymentMethodsChartRef.current, {
                type: "pie",
                data: repartitionData,
            });

            paymentTrendsChartInstance = new Chart(paymentTrendsChartRef.current, {
                type: "bar",
                data: paiementsParMois,
            });

            // Nettoyage lors du démontage du composant pour éviter les fuites de mémoire
            return () => {
                if (paymentMethodsChartInstance) {
                    paymentMethodsChartInstance.destroy();
                }
                if (paymentTrendsChartInstance) {
                    paymentTrendsChartInstance.destroy();
                }
            };
        }
    }, [repartitionPaiements, paiementsParMois]); // Mettre à jour les graphiques lorsque la répartition des paiements change

    const handleGenerateReport = () => {
        // Logique pour générer le rapport financier basé sur la période choisie
        console.log("Generating report for", period, startDate, endDate);
    };

    const handleExportReport = (format) => {
        // Logique d'exportation des rapports en PDF ou Excel
        console.log(`Exporting report in ${format}`);
        alert(`Exporter le rapport en ${format}`);
        saveAs(new Blob(), `report.${format}`);
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
                        <li className="nav-item"><Link className="nav-link" to="/paiement-add">Enregistrer un paiement</Link></li>
                        <li className="nav-item"><Link className="nav-link active" to="/rapport-finance">Rapports financiers</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container mt-4">
                <h2>Rapports Financiers</h2>

                {/* Formulaire de sélection de la période */}
                <form id="report-form">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="period">Sélectionner la période :</label>
                                <select
                                    id="period"
                                    className="form-select"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <option value="daily">Par jour</option>
                                    <option value="weekly">Par semaine</option>
                                    <option value="monthly">Par mois</option>
                                    <option value="yearly">Par année</option>
                                    <option value="custom">Plage de dates personnalisée</option>
                                </select>
                            </div>
                        </div>

                    {/* Sélection des dates personnalisées */}
                    {showCustomDates && (
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="start-date">Date de début :</label>
                                <input
                                type="date"
                                id="start-date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                />
                                <label htmlFor="end-date">Date de fin :</label>
                                <input
                                type="date"
                                id="end-date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                        {/* Bouton de génération de rapport */}
                        <div className="col-md-4">
                            <button
                            type="button"
                            className="btn btn-primary mt-4"
                            onClick={handleGenerateReport}
                            >
                            Générer le rapport
                            </button>
                        </div>
                    </div>
                </form>

                {/* Section Résumé des paiements */}
                <div className="mt-4">
                    <h3>Résumé des paiements</h3>
                        <div id="report-summary">
                        {/* Résumé des paiements ici */}
                        <p>Total des paiements du mois : {totalPaiements} FCFA</p>
                    </div>
                </div>

                {/* Graphiques */}
                <div className="row mt-4">
                    <div className="col-md-6">
                        <h3>Répartition des paiements</h3>
                        <canvas ref={paymentMethodsChartRef}></canvas>
                    </div>
                    <div className="col-md-6">
                        <h3>Tendances des paiements</h3>
                        <canvas ref={paymentTrendsChartRef}></canvas>
                    </div>
                </div>

                    {/* Exportation */}
                    <div className="mt-4">
                        <button className="btn btn-success" onClick={() => handleExportReport("pdf")}>
                        Exporter en PDF
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}

export default PaiementRapport