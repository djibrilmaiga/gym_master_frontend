import axios from 'axios';
import AuthService from './AuthService';


// URL de base pour l'API des types d'abonnement
const API_URL = 'http://localhost:8080/api/typeabonnement';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouveau type d'abonnement
const createTypeAbonnement = (typeAbonnement) => {
  return axios.post(API_URL, typeAbonnement, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer tous les types d'abonnement
const getAllTypeAbonnement = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET - Récupérer un type d'abonnement par son ID
const getTypeAbonnementById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un type d'abonnement existant par ID
const updateTypeAbonnement = (id, updatedTypeAbonnement) => {
  return axios.put(`${API_URL}/${id}`, updatedTypeAbonnement, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un type d'abonnement par ID
const deleteTypeAbonnement = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createTypeAbonnement,
  getAllTypeAbonnement,
  getTypeAbonnementById,
  updateTypeAbonnement,
  deleteTypeAbonnement,
};