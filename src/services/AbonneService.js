import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des abonnés
const API_URL = 'http://localhost:8080/api/abonne';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouvel abonné
const createAbonne = (abonne) => {
  return axios.post(API_URL, abonne, {
    headers: getAuthHeaders(),
  });
};

// GET ALL - Récupérer tous les abonnés
const getAllAbonnes = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ALL Abonnés (nom, prénom, téléphone)
const getAllAbonnesSelected = () => {
  return axios.get(`${API_URL}/abonnes-selected`, { headers: getAuthHeaders() })
}

// GET ALL WITHOUT ACTIVE SUBSCRIPTION - Récupérer tous les abonnés sans abonnement actif
const getAbonnesSansAbonnementActif = () => {
  return axios.get(`${API_URL}/sans-abonnement-actif`, { headers: getAuthHeaders() });
};

// GET TOTAL - Récupérer le total des abonnés
const getTotalAbonne = () => {
  return axios.get(`${API_URL}/count`, { headers: getAuthHeaders() });
};

// GET BY ID - Récupérer un abonné par ID
const getAbonneById = (abonneId) => {
  return axios.get(`${API_URL}/${abonneId}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un abonné
const updateAbonne = (abonneId, updatedAbonne) => {
  return axios.put(`${API_URL}/${abonneId}`, updatedAbonne, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un abonné
const deleteAbonne = (abonneId) => {
  return axios.delete(`${API_URL}/${abonneId}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createAbonne,
  getAllAbonnes,
  getAllAbonnesSelected,
  getAbonnesSansAbonnementActif,
  getTotalAbonne,
  getAbonneById,
  updateAbonne,
  deleteAbonne,
};