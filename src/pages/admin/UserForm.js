import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import SiderBarAdm from '../../components/SiderBarAdm';
import UtilisateurService from '../../services/UtilisateurService';

const UserForm = () => {
    // États pour les champs du formulaire
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin'); // Valeur par défaut

    // État pour gérer le statut de la soumission
    const [status, setStatus] = useState({ success: false, error: false });

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construction des données à envoyer
        const userData = {
            login,
            password,
            role,
        };

        try {
            // Utilisation de UtilisateurService pour créer un nouvel utilisateur
            await UtilisateurService.createUtilisateur(userData);

            // Si la réponse est un succès
            setStatus({ success: true, error: false });
            // Réinitialiser les champs du formulaire après la création
            setLogin('');
            setPassword('');
            setRole('ADMIN');
        } catch (error) {
            console.error('Erreur lors de la création de l’utilisateur:', error);
            setStatus({ success: false, error: true });
        }
    };

  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/user-add' class="nav-link active" >Créer un utilisateur</Link></li>
                        <li class="nav-item"><Link to='/admin/user-list' class="nav-link">Liste des utilisateurs</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="container">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h3 className="card-title">Créer un nouvel utilisateur</h3>
                        </div>
                            <div className="card-body">
                            {status.success && (
                                <div className="alert alert-success" role="alert">
                                Utilisateur créé avec succès!
                                </div>
                            )}
                            {status.error && (
                                <div className="alert alert-danger" role="alert">
                                Erreur lors de la création de l'utilisateur. Veuillez réessayer.
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="login"
                                        name="login"
                                        placeholder="Login"
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="login">Login</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Mot de passe</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        <option value="ADMIN">Administrateur</option>
                                        <option value="MANAGER">Gestionnaire</option>
                                    </select>
                                    <label htmlFor="role">Rôle</label>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                Créer l'utilisateur
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}
 
export default UserForm