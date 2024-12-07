import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../login.css';
import logo from '../assets/gym_logo.png';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // Gestionnaire d'authentification
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);

    AuthService.authenticate(login, password)
    .then(response => {
      setIsLoading(false);
      setIsSuccess(true);

      const userRole = AuthService.getCurrentUser().role; // Récupération du rôle depuis localStorage
      if (userRole === 'ADMIN') {
        navigate("/admin/dashboard");
      } else if (userRole === 'MANAGER') {
        navigate("/dashboard");
      } else {
        setMessage('Rôle non autorisé.');
      }
    })
    .catch(error => {
      setIsLoading(false);
      setMessage('Échec de la connexion! Vérifiez vos identifiants.');
      console.error("Erreur d'authentification", error);
    });
  };

  return (
    <div className="login-background">
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card customer-card">
              <div className="card-header text-center">
                <img src={logo} alt="Gym Manager Logo" className="logo-img" />
                <h2>Bienvenue sur Gym Manager</h2>
                <p>Veuillez vous authentifier</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="form-floating mb-3">
                    <input
                      id="floatingInput"
                      type="text"
                      className="form-control"
                      placeholder="Votre login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      required
                    />
                    <label id="lglabel" htmlFor="floatingInput">Login</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input                    
                      id="floatingPassword"
                      type="password"
                      className="form-control"
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label id="pwdlabel" htmlFor="floatingPassword">Mot de passe</label>
                  </div>
                  {message && <div className='text-danger'>{message}</div>}
                  {isSuccess && (
                    <div className="alert alert-success mt-3">
                      Connexion réussie ! Redirection en cours...
                    </div>
                  )}
                  <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      "Se connecter"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
