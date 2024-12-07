import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import PaiementService from '../../services/PaiementService';

Chart.register(...registerables);

const RapportFinance = () => {
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const chartInstances = useRef({});
    
    const canvasRefs = {
        totalRevenue: useRef(null),
        serviceRevenue: useRef(null),
        revenueGrowth: useRef(null),
        paymentTrends: useRef(null),
    };

    // Récupérer les paiements
    useEffect(() => {
        const fetchPaiements = async () => {
            try {
                const data = await PaiementService.getAllPaiementsWithAbonneInfo();
                setPaiements(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des paiements :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaiements();
    }, []);

    // Initialiser les graphiques une fois les données chargées
    useEffect(() => {
        if (!loading && paiements.length > 0) {
            initializeCharts();
        }
        return () => {
            // Nettoyage des instances de graphiques au démontage du composant
            Object.values(chartInstances.current).forEach(chart => chart.destroy());
            chartInstances.current = {};
        };
    }, [paiements, loading]);

    // Fonction pour initialiser les graphiques
    const initializeCharts = () => {
        const { totalRevenue, serviceRevenue, revenueGrowth, paymentTrends } = canvasRefs;
        
        // Supprimer les anciens graphiques avant d'en créer de nouveaux
        destroyExistingCharts();

        // Calcul des données
        const totalRevenueData = calculateTotalRevenue(paiements);
        const serviceRevenueData = calculateServiceRevenueData(paiements);
        const revenueGrowthData = calculateRevenueGrowthData(paiements);
        const paymentTrendsData = calculatePaymentTrendsData(paiements);

        // Dessiner les graphiques
        chartInstances.current.totalRevenue = drawChart(totalRevenue, 'pie', ['Total Revenus'], [totalRevenueData], ['#36A2EB']);
        chartInstances.current.serviceRevenue = drawChart(serviceRevenue, 'bar', Object.keys(serviceRevenueData), Object.values(serviceRevenueData), ['#FF6384', '#36A2EB', '#FFCE56']);
        chartInstances.current.revenueGrowth = drawChart(revenueGrowth, 'line', Object.keys(revenueGrowthData), Object.values(revenueGrowthData), '#36A2EB', true);
        chartInstances.current.paymentTrends = drawChart(paymentTrends, 'line', Object.keys(paymentTrendsData), Object.values(paymentTrendsData), '#FF6384', true);
    };

    // Fonction générique pour dessiner un graphique
    const drawChart = (chartRef, type, labels, data, colors, fill = false) => {
        const context = chartRef.current.getContext('2d');
        return new Chart(context, {
            type,
            data: {
                labels,
                datasets: [{
                    label: type === 'line' ? 'Montant (FCFA)' : 'Revenus (FCFA)',
                    data,
                    backgroundColor: colors,
                    borderColor: type === 'line' ? colors : undefined,
                    fill,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: type === 'bar' || type === 'line' ? {
                    y: { beginAtZero: true },
                } : undefined,
            },
        });
    };

    // Fonction pour détruire les graphiques existants
    const destroyExistingCharts = () => {
        Object.values(chartInstances.current).forEach(chart => {
            if (chart) chart.destroy();
        });
    };

    // Fonctions de calcul des données
    const calculateTotalRevenue = (paiements) => paiements.reduce((acc, paiement) => acc + paiement.montantPaye, 0);
    const calculateServiceRevenueData = (paiements) => paiements.reduce((acc, paiement) => {
        acc[paiement.typePaiement] = (acc[paiement.typePaiement] || 0) + paiement.montantPaye;
        return acc;
    }, {});
    const calculateRevenueGrowthData = (paiements) => paiements.reduce((acc, paiement) => {
        const month = new Date(paiement.datePaiement).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + paiement.montantPaye;
        return acc;
    }, {});
    const calculatePaymentTrendsData = (paiements) => {
        const data = {};
        const currentYear = new Date().getFullYear();
        for (let month = 0; month < 12; month++) {
            const date = new Date(currentYear, month, 1);
            const monthLabel = date.toLocaleString('default', { month: 'short' });
            data[monthLabel] = PaiementService.getSommePaiements(currentYear, month + 1) || 0;
        }
        return data;
    };

    return (
        <div className="wrapper d-flex">
            <SiderBarAdm />
            <div className="content">
                <Header />
                <div className="navbar navbar-expand-md">
                    <nav className="breadcrumb">
                        <ul className="nav nav-tabs mb-4 ms-auto">
                            <li className="nav-item"><Link to='/admin/rapport' className="nav-link">Rapports Statistiques</Link></li>
                            <li className="nav-item"><Link to='/admin/rapport-finance' className="nav-link active">Rapports Financiers</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="container mt-4">
                    <h2>Rapports Financiers</h2>
                    <div className="row">
                        <div className="col-md-6"><canvas ref={canvasRefs.totalRevenue}></canvas></div>
                        <div className="col-md-6"><canvas ref={canvasRefs.serviceRevenue}></canvas></div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-6"><canvas ref={canvasRefs.revenueGrowth}></canvas></div>
                        <div className="col-md-6"><canvas ref={canvasRefs.paymentTrends}></canvas></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RapportFinance;
