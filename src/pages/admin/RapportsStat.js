import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import SiderBarAdm from '../../components/SiderBarAdm';
import Header from '../../components/Header';
import AbonneService from '../../services/AbonneService';
import ParticipationService from '../../services/ParticipationService';
import InstructeurService from '../../services/InstructeurService';

const RapportsStat = () => {
    const genderChartRef = useRef(null);
    const newSubscribersChartRef = useRef(null);
    const instructorCoursesChartRef = useRef(null);
    const [participationRate, setParticipationRate] = useState(0);
    const [abonneData, setAbonneData] = useState([]);
    const [instructeurData, setInstructeurData] = useState([]);
    const [genderChart, setGenderChart] = useState(null);
    const [newSubscribersChart, setNewSubscribersChart] = useState(null);
    const [instructorCoursesChart, setInstructorCoursesChart] = useState(null);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('Rapport KPI', 10, 10);

        if (genderChartRef.current) {
            doc.addImage(genderChartRef.current.toDataURL(), 'PNG', 10, 20, 180, 100);
        }
        if (newSubscribersChartRef.current) {
            doc.addImage(newSubscribersChartRef.current.toDataURL(), 'PNG', 10, 130, 180, 100);
        }
        doc.save('rapport_kpi.pdf');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const abonneResponse = await AbonneService.getAllAbonnes();
                setAbonneData(abonneResponse.data);

                const maleCount = abonneResponse.data.filter(abonne => abonne.genre === 'Homme').length;
                const femaleCount = abonneResponse.data.filter(abonne => abonne.genre === 'Femme').length;

                const genderCtx = genderChartRef.current?.getContext('2d');
                if (genderCtx) {
                    if (genderChart) {
                        genderChart.destroy();
                    }
                    const genderChartInstance = new Chart(genderCtx, {
                        type: 'pie',
                        data: {
                            labels: ['Masculins', 'Féminins'],
                            datasets: [{
                                data: [maleCount, femaleCount],
                                backgroundColor: ['#007bff', '#dc3545']
                            }]
                        },
                        options: {
                            responsive: true
                        }
                    });
                    setGenderChart(genderChartInstance);
                }

                const monthlyData = Array(12).fill(0);
                abonneResponse.data.forEach(abonne => {
                    const month = new Date(abonne.dateInscription).getMonth();
                    monthlyData[month]++;
                });

                const newSubscribersCtx = newSubscribersChartRef.current?.getContext('2d');
                if (newSubscribersCtx) {
                    if (newSubscribersChart) {
                        newSubscribersChart.destroy();
                    }
                    const newSubscribersChartInstance = new Chart(newSubscribersCtx, {
                        type: 'bar',
                        data: {
                            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                            datasets: [{
                                label: 'Nouveaux Abonnés',
                                data: monthlyData,
                                backgroundColor: '#28a745'
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                    setNewSubscribersChart(newSubscribersChartInstance);
                }

                const participationResponse = await ParticipationService.getTauxParticipation();
                setParticipationRate(participationResponse.data);

                const instructeurResponse = await InstructeurService.getAllInstructeurs();
                setInstructeurData(instructeurResponse.data);
                const courseCount = instructeurResponse.data.map(instructeur => instructeur.seances.length);
                const instructorNames = instructeurResponse.data.map(instructeur => `${instructeur.nom} ${instructeur.prenom}`);

                const instructorCoursesCtx = instructorCoursesChartRef.current?.getContext('2d');
                if (instructorCoursesCtx) {
                    if (instructorCoursesChart) {
                        instructorCoursesChart.destroy();
                    }
                    const instructorCoursesChartInstance = new Chart(instructorCoursesCtx, {
                        type: 'bar',
                        data: {
                            labels: instructorNames,
                            datasets: [{
                                label: 'Cours Donnés',
                                data: courseCount,
                                backgroundColor: '#17a2b8'
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                    setInstructorCoursesChart(instructorCoursesChartInstance);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();

        return () => {
            if (genderChart) {
                genderChart.destroy();
            }
            if (newSubscribersChart) {
                newSubscribersChart.destroy();
            }
            if (instructorCoursesChart) {
                instructorCoursesChart.destroy();
            }
        };
    }, []); 

    return (
        <div className='wrapper d-flex'>
            <SiderBarAdm />
            <div className='content'>
                <Header />
                <div className="navbar navbar-expand-md">
                    <nav className="breadcrumb">
                        <ul className="nav nav-tabs mb-4 ms-auto">
                            <li className="nav-item"><Link to='/admin/rapport' className="nav-link active">Rapports Statistiques</Link></li>
                            <li className="nav-item"><Link to='/admin/rapport-finance' className="nav-link">Rapports Financiers</Link></li>
                        </ul>
                    </nav>
                </div>
                <main className='section'>
                    <div className="container">
                        <h2 className='mb-5'>Rapport Statistiques</h2>
                        {/* Section 1: KPI Abonnés */}
                        <section id="kpi-abonnes">
                            <h3>Indicateurs liés aux Abonnés</h3>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Nombre Total d'Abonnés</h5>
                                            <p className="card-text display-3">{abonneData.length}</p>
                                            <canvas ref={genderChartRef}></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Nouveaux Abonnés (Mo./An.)</h5>
                                            <p className="card-text display-4">+{abonneData.filter(abonne => new Date(abonne.dateInscription).getFullYear() === new Date().getFullYear()).length}</p>
                                            <canvas ref={newSubscribersChartRef}></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Section 2: KPI Instructeurs */}
                        <section id="kpi-instructeurs">
                            <h3>Indicateurs liés aux Instructeurs</h3>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Taux de Participation</h5>
                                            <p className="card-text display-4">{participationRate}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Cours Donnés par Instructeur</h5>
                                            <canvas ref={instructorCoursesChartRef}></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <button className="btn btn-primary" onClick={exportPDF}>Exporter en PDF</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RapportsStat;
