import axios from 'axios';
import AuthService from './AuthService';


// URL de base pour l'API des inscriptions
const API_URL = 'http://localhost:8080/api/inscription';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
  };
};

// POST - Créer une nouvelle inscription
const createInscription = (inscription) => {
  const userId = AuthService.getUserId();
    if (!userId) {
        throw new Error('Utilisateur non authentifié.');
    }
  return axios.post(`${API_URL}/${userId}`, inscription, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer toutes les inscriptions
const getAllInscriptions = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET - Récupérer une inscription par son ID
const getInscriptionById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour une inscription existante par ID
const updateInscription = (id, updatedInscription) => {
  return axios.put(`${API_URL}/${id}`, updatedInscription, { headers: getAuthHeaders() });
};

// DELETE - Supprimer une inscription par ID
const deleteInscription = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createInscription,
  getAllInscriptions,
  getInscriptionById,
  updateInscription,
  deleteInscription,
};