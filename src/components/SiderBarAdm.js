import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const SiderBarAdm = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout(); // Appel à la fonction logout du service
        navigate('/');   // Redirection vers la page de login après déconnexion
    };
  return (
        <div>
            <button 
                type="button"
                className="btn btn-dark d-md-none" 
                data-bs-toggle="collapse" 
                data-bs-target="#sidebar" 
                aria-expanded="false" 
                aria-controls="sidebar"
            >
                <i className="fas fa-bars"></i>
            </button>
            <nav 
                id='siderbar'
                className="sidebar collapse d-md-block" 
            >
                <div id="user-role-text" className="text-center mb-3 mt-4">
                    <h5>Page Administrateur</h5>
                </div>
                <ul>
                    <li className="text-start">
                        <Link to={"/admin/dashboard"}>
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/user-add"}>
                            <i className="fas fa-users-cog"></i> Utilisateurs
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/service"}>
                            <i className="fas fa-concierge-bell"></i> Services
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/cours-historique"}>
                            <i className="fas fa-calendar-alt"></i> Séances
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/paiement"}>
                            <i className="fas fa-money-bill-wave"></i> Paiements
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/equipement"}>
                            <i className="fas fa-dumbbell"></i> Équipements
                        </Link>
                    </li>
                    <li className="text-start">
                        <Link to={"/admin/rapport"}>
                            <i className="fas fa-chart-pie"></i> Rapports
                        </Link>
                    </li>
                    <li className="text-start mt-auto">
                        <button onClick={handleLogout} className="logout-btn-adm">
                            <i className="fas fa-sign-out-alt"></i> Déconnexion
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
  )
}

export default SiderBarAdm;