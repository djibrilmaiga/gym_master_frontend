import axios from 'axios';
import AuthService from './AuthService'; 

// URL de base pour l'API des instructeurs
const API_URL = 'http://localhost:8080/api/instructeur';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouvel instructeur
const createInstructeur = (instructeur) => {
  return axios.post(API_URL, instructeur, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer tous les instructeurs
const getAllInstructeurs = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET BY ID - Récupérer un instructeur par ID
const getInstructeurById = (instructeurId) => {
  return axios.get(`${API_URL}/${instructeurId}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un instructeur
const updateInstructeur = (instructeurId, updatedInstructeur) => {
  return axios.put(`${API_URL}/${instructeurId}`, updatedInstructeur, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un instructeur
const deleteInstructeur = (instructeurId) => {
  return axios.delete(`${API_URL}/${instructeurId}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createInstructeur,
  getAllInstructeurs,
  getInstructeurById,
  updateInstructeur,
  deleteInstructeur,
};