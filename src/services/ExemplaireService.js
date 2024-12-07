import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des exemplaires
const API_URL = 'http://localhost:8080/api/exemplaire';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouvel exemplaire pour un équipement donné
const createExemplaire = (equipementId, newExemplaire) => {
  return axios.post(`${API_URL}/equipement/${equipementId}`, newExemplaire, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer tous les exemplaires
const getAllExemplaires = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ID - Récupérer un exemplaire par son ID
const getExemplaireById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// GET COUNT
const getNombreExemplaireEnPanne = () => {
  return axios.get(`${API_URL}/en-panne`, { headers: getAuthHeaders() })
}

// PUT - Mettre à jour un exemplaire existant par ID
const updateExemplaire = (id, updatedExemplaire) => {
  return axios.put(`${API_URL}/${id}`, updatedExemplaire, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un exemplaire par ID
const deleteExemplaire = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createExemplaire,
  getAllExemplaires,
  getExemplaireById,
  getNombreExemplaireEnPanne,
  updateExemplaire,
  deleteExemplaire,
};