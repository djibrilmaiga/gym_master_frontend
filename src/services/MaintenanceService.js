import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des maintenances
const API_URL = 'http://localhost:8080/api/maintenance';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer une nouvelle maintenance pour un exemplaire et un technicien donnés
const createMaintenance = (exemplaireId, technicienId, maintenanceData) => {
  return axios.post(`${API_URL}/exemplaire/${exemplaireId}/technicien/${technicienId}`, maintenanceData, { headers: getAuthHeaders() });
};

// GET ALL - Récupérer toutes les maintenances
const getAllMaintenances = () => {
  return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ID - Récupérer une maintenance par son ID
const getMaintenanceById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour une maintenance existante par ID
const updateMaintenance = (id, updatedMaintenance) => {
  return axios.put(`${API_URL}/${id}`, updatedMaintenance, { headers: getAuthHeaders() });
};

// DELETE - Supprimer une maintenance par ID
const deleteMaintenance = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createMaintenance,
  getAllMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};