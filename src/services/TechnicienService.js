import axios from 'axios';
import AuthService from './AuthService'; 

// URL de base pour l'API des techniciens
const API_URL = 'http://localhost:8080/api/technicien';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouveau technicien
const createTechnicien = (technicien) => {
  return axios.post(API_URL, technicien, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer tous les techniciens
const getAllTechniciens = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET - Récupérer un technicien par son ID
const getTechnicienById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un technicien existant par ID
const updateTechnicien = (id, updatedTechnicien) => {
  return axios.put(`${API_URL}/${id}`, updatedTechnicien, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un technicien par ID
const deleteTechnicien = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createTechnicien,
  getAllTechniciens,
  getTechnicienById,
  updateTechnicien,
  deleteTechnicien,
};