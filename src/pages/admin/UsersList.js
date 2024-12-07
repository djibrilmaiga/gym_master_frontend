import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import SiderBarAdm from '../../components/SiderBarAdm';
import UtilisateurService from '../../services/UtilisateurService';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] = useState(''); // Action actuelle (view, edit, delete)
    const [loading, setLoading] = useState(false);

    // Charger les utilisateurs au démarrage
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await UtilisateurService.getAllUtilisateurs();
            setUsers(response.data); // Mettre à jour les utilisateurs
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await UtilisateurService.deleteUtilisateur(userId);
                setUsers(users.filter(user => user.id !== userId)); // Mettre à jour la liste
                setAction(''); // Réinitialise l'action
            } catch (error) {
                console.error("Erreur lors de la suppression de l'utilisateur", error);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await UtilisateurService.updateUtilisateur(selectedUser.id, selectedUser);
            setUsers(users.map(user => (user.id === selectedUser.id ? selectedUser : user)));
            setAction('');
            setSelectedUser(null);
        } catch (error) {
            console.error("Erreur lors de la modification de l'utilisateur", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    if (loading) {
        return <p>Chargement en cours...</p>;
    }
    
  return (
    <div className='wrapper d-flex'>
        <SiderBarAdm />
        <div className='content'>
            <Header />
            <div class="navbar navbar-expand-md">
                <nav class="breadcrumb">
                    <ul class="nav nav-tabs mb-4 ms-auto">
                        <li class="nav-item"><Link to='/admin/user-add' class="nav-link" >Créer un utilisateur</Link></li>
                        <li class="nav-item"><Link to='/admin/user-list' class="nav-link active">Liste des utilisateurs</Link></li>
                    </ul>
                </nav>
            </div>
            <section className='section'>
                <div className="card mb-4">
                    <div className="card-header">
                      <h4 className="mb-0">Liste des utilisateurs</h4>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Login</th>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.login}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setAction('view');
                                                }}
                                            >
                                                Consulter
                                            </button>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setAction('edit');
                                                }}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Affichage de la section pour l'action sélectionnée */}
                {action === 'view' && selectedUser && (
                    <div className="card mt-4">
                        <div className="card-header">
                            <h5>Informations de l'utilisateur</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>Login:</strong> {selectedUser.login}</p>
                            <p><strong>Rôle:</strong> {selectedUser.role}</p>
                            <button className="btn btn-secondary" onClick={() => setAction('')}>
                                Fermer
                            </button>
                        </div>
                    </div>
                )}

                {action === 'edit' && selectedUser && (
                    <div className="card mt-4">
                        <div className="card-header">
                            <h5>Modifier l'utilisateur</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="login">Login</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="login"
                                        name="login"
                                        value={selectedUser.login}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="role">Rôle</label>
                                    <select
                                        className="form-select"
                                        id="role"
                                        name="role"
                                        value={selectedUser.role}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="ADMIN">Administrateur</option>
                                        <option value="MANAGER">Gestionnaire</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Enregistrer les modifications
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setAction('')}
                                >
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </div>
    </div>
  )
}

export default UsersList