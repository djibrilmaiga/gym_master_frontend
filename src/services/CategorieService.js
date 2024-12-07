import axios from "axios";
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api/categorie';

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };
};

// POST
const createCategorie = (newCategorie) => {
  return axios.post(API_URL, newCategorie, { headers: getAuthHeaders() });
};

// GET ALL
const getAllCategorie = () => {
    return axios.get(API_URL, { headers: getAuthHeaders() });
};

// GET ID
const getCategorieById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// PUT
const updateCategorie = (id, updateCategorie) => {
    return axios.put(`${API_URL}/${id}`, updateCategorie, { headers: getAuthHeaders() });
};

// DELETE
const deleteCategorie = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

export default {
    createCategorie,
    getAllCategorie,
    getCategorieById,
    updateCategorie,
    deleteCategorie,
};