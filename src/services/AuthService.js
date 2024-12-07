import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:8080/api/auth';

// Authentification
const authenticate = async (login, password) =>{
    const response = await axios.post(`${API_URL}/authenticate`, { login, password });
    if (response.data.token) {
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('user', JSON.stringify({
            token: response.data.token,
            role: decodedToken.roles
          }));
    }
    return response.data;
};

// Déconnexion
const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// Méthode pour obtenir le token
const getToken = () => {
    const user = getCurrentUser();
    return user ? user.token : null;
};

const getUserId = () => {
    const token = getToken();
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId;
    }
    return null;
};

export default {
    authenticate,
    logout,
    getCurrentUser,
    getToken,
    getUserId
};