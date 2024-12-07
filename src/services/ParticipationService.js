import axios from 'axios';
import AuthService from './AuthService';

// URL de base pour l'API des participations
const API_URL = 'http://localhost:8080/api/participation';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST - Créer une nouvelle participation
const createParticipation = (coursId, abonneId, presence) => {
  return axios.post(`${API_URL}/cours/${coursId}/abonne/${abonneId}`, null, {
    headers: getAuthHeaders(),
    params: { presence },
  });
};

// GET ALL - Récupérer tous les abonnés dans un cours
const getAllAbonneInCourse = (seanceId) => {
  return axios.get(`${API_URL}/seance/${seanceId}`, { headers: getAuthHeaders() });
};

// GET ID
const getTauxParticipation = () => {
  return axios.get(`${API_URL}/taux-participation`, { headers: getAuthHeaders() });
};

// PUT - Mettre à jour une participation
const updateParticipation = (id, presence) => {
  return axios.post(`${API_URL}/${id}`, null, {
    headers: getAuthHeaders(),
    params: { presence },
  });
};

// DELETE - Supprimer une participation
const deleteParticipation = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Exportation des fonctions de service
export default {
  createParticipation,
  getAllAbonneInCourse,
  getTauxParticipation,
  updateParticipation,
  deleteParticipation,
};