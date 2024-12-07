import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des séances
const API_URL = 'http://localhost:8080/api/seance';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer une séance avec instructeur
const createSeanceWithCoach = (instructeurId, seance) => {
  return axios.post(`${API_URL}/instructeur/${instructeurId}`, seance, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer toutes les séances
const getAllSeances = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// Get - Instructeur 
const getCoachSeanceById = (seanceId) => {
  return axios.get(`${API_URL}/${seanceId}/instructeur`, { headers: getAuthHeaders() })
}

// GET BY ID - Récupérer une séance par ID
const getSeanceById = (seanceId) => {
  return axios.get(`${API_URL}/${seanceId}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour une séance
const updateSeance = (seanceId, updatedSeance) => {
  return axios.put(`${API_URL}/${seanceId}`, updatedSeance, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour une séance
const inscrireSeance = (seanceId, updatedSeance) => {
  return axios.put(`${API_URL}/inscrire/${seanceId}`, updatedSeance, { headers: getAuthHeaders() });
};

// DELETE - Supprimer une séance
const deleteSeance = (seanceId) => {
  return axios.delete(`${API_URL}/${seanceId}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createSeanceWithCoach,
  getAllSeances,
  getCoachSeanceById,
  getSeanceById,
  updateSeance,
  inscrireSeance,
  deleteSeance,
};