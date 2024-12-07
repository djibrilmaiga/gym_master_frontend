import axios from 'axios';
import AuthService from './AuthService';


// URL de base pour l'API des paiements
const API_URL = 'http://localhost:8080/api/paiement';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un paiement pour un abonné
const createPaiement = (abonneId, paiement) => {
  return axios.post(`${API_URL}/abonne/${abonneId}`, paiement, { headers: getAuthHeaders() });
};

// GET ALL WITH ABONNE INFO - Récupérer tous les paiements avec les informations des abonnés
const getAllPaiementsWithAbonneInfo = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET BY ID - Récupérer un paiement par ID
const getPaiementById = (paiementId) => {
  return axios.get(`${API_URL}/${paiementId}`, { headers: getAuthHeaders() });
};

const getPaiementAbonneById = (paiementId) => {
  return axios.get(`${API_URL}/paiement-abonne/${paiementId}`, { headers: getAuthHeaders() })
}

// GET SOMME - Récupérer la somme des paiements par mois
const getSommePaiements = (year, month) => {
  return axios.get(`${API_URL}/somme`, { params: { year, month }, headers: getAuthHeaders() });
};

// GET REPARTITION - Récupérer la répartition des paiements par mode
const getRepartitionPaiementsParMode = () => {
  return axios.get(`${API_URL}/repartition`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un paiement
const updatePaiement = (paiementId, newPaiement) => {
  return axios.put(`${API_URL}/${paiementId}`, newPaiement, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un paiement
const deletePaiement = (paiementId) => {
  return axios.delete(`${API_URL}/${paiementId}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createPaiement,
  getAllPaiementsWithAbonneInfo,
  getPaiementById,
  getPaiementAbonneById,
  getSommePaiements,
  getRepartitionPaiementsParMode,
  updatePaiement,
  deletePaiement,
};