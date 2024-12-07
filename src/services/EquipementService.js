import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API
const API_URL = 'http://localhost:8080/api/equipement';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer un nouvel équipement pour une catégorie donnée
const createEquipement = (categorieId, newEquipement) => {
  return axios.post(`${API_URL}/categorie/${categorieId}`, newEquipement, { headers: getAuthHeaders() });
}; 

// GET ALL - Récupérer tous les équipements
const getAllEquipements = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ID
const getEquipementById = (id) =>{
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour un équipement existant par ID
const updateEquipement = (id, updatedEquipement) => {
  return axios.put(`${API_URL}/${id}`, updatedEquipement, { headers: getAuthHeaders() });
};

// DELETE - Supprimer un équipement par ID
const deleteEquipement = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createEquipement,
  getAllEquipements,
  getEquipementById,
  updateEquipement,
  deleteEquipement,
};