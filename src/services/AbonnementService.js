import axios from 'axios';
import AuthService from './AuthService';


// URL de base pour l'API des abonnements
const API_URL = 'http://localhost:8080/api/abonnement';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST
const createAbonnement = (abonneId, abonnement) => {
  return axios.post(`${API_URL}/abonne/${abonneId}`, abonnement, { headers: getAuthHeaders() })
}

// GET ALL - Récupérer tous les abonnements avec les informations des abonnés
const getAllAbonnementWithAbonneInf = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ALL Abonnement actif proche d'expiration
const getAllAbonnementExpiration = () => {
  return axios.get(`${API_URL}/proche-expiration`, { headers: getAuthHeaders() });
}

// Exportation des fonctions de service
export default {
  createAbonnement,
  getAllAbonnementExpiration,
  getAllAbonnementWithAbonneInf,
};