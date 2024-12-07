import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des utilisateurs
const API_URL = 'http://localhost:8080/api/utilisateur';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouvel utilisateur
const createUtilisateur = (utilisateur) => {
  return axios.post(API_URL, utilisateur, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer tous les utilisateurs
const getAllUtilisateurs = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ID - Récupérer un utilisateur par ID
const getUtilisateurById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un utilisateur
const updateUtilisateur = (id, utilisateur) => {
  return axios.put(`${API_URL}/${id}`, utilisateur, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un utilisateur
const deleteUtilisateur = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
};