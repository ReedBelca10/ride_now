'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/admin-api';
import UserModal from '@/components/UserModal';
import styles from './users.module.css';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'MANAGER' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
    telephone?: string;
    _count?: {
        reservations: number;
    };
}

interface GetUsersResponse {
    users: User[];
    total: number;
}

/**
 * Users Management Page
 * Full CRUD operations for users
 */
export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminAPI.getUsers(
                currentPage * pageSize,
                pageSize,
                roleFilter || undefined,
                searchTerm || undefined
            ) as GetUsersResponse;
            setUsers(data.users || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(0);
        fetchUsers();
    }, [searchTerm, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleCreate = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleDelete = async (userId: number, userName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir désactiver l'utilisateur ${userName} ?`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            alert('Utilisateur désactivé avec succès');
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Une erreur est survenue';
            alert(`Erreur: ${message}`);
            console.error('Erreur suppression utilisateur:', error);
        }
    };

    const handleHardDelete = async (userId: number, userName: string) => {
        if (!confirm(`⚠️ ATTENTION: Êtes-vous absolument sûr de vouloir supprimer définitivement l'utilisateur ${userName} ? Cette action est irréversible !`)) {
            return;
        }

        // Double confirmation
        const confirmed = confirm(`Confirmez la suppression définitive de ${userName} et de TOUTES ses données ?`);
        if (!confirmed) {
            return;
        }

        try {
            await adminAPI.hardDeleteUser(userId);
            alert('Utilisateur supprimé définitivement');
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Une erreur est survenue';
            alert(`Erreur: ${message}`);
            console.error('Erreur suppression définitive utilisateur:', error);
        }
    };

    const handleToggleActive = async (userId: number, currentStatus: boolean, userName: string) => {
        const action = currentStatus ? 'désactiver' : 'réactiver';
        if (!confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${userName} ?`)) {
            return;
        }

        try {
            await adminAPI.toggleUserActive(userId, !currentStatus);
            alert(`Utilisateur ${action}é avec succès`);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Une erreur est survenue';
            alert(`Erreur: ${message}`);
            console.error(`Erreur ${action}vation utilisateur:`, error);
        }
    };

    const handleModalClose = (shouldRefresh: boolean) => {
        setModalOpen(false);
        setEditingUser(null);
        if (shouldRefresh) {
            fetchUsers();
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Utilisateurs</h1>
                    <p className={styles.subtitle}>Gérer les comptes et les rôles</p>
                </div>
                <button onClick={handleCreate} className={styles.createBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Créer Utilisateur</span>
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className={styles.roleFilter}
                >
                    <option value="">Tous les rôles</option>
                    <option value="USER">Utilisateur</option>
                    <option value="MANAGER">Gestionnaire</option>
                    <option value="ADMIN">Administrateur</option>
                </select>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement des utilisateurs...</p>
                </div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Téléphone</th>
                                    <th>Réservations</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userName}>
                                                <div className={styles.userAvatar}>
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <span>{user.firstName} {user.lastName}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.telephone || '—'}</td>
                                        <td>{user._count?.reservations || 0}</td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.isActive, `${user.firstName} ${user.lastName}`)}
                                                className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}
                                                title={user.isActive ? 'Cliquer pour désactiver' : 'Cliquer pour réactiver'}
                                                disabled={user.role === 'ADMIN'}
                                            >
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className={styles.actionBtn}
                                                    title="Éditer"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                    title="Désactiver"
                                                    disabled={user.role === 'ADMIN'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleHardDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                                    className={`${styles.actionBtn} ${styles.hardDeleteBtn}`}
                                                    title="Supprimer définitivement"
                                                    disabled={user.role === 'ADMIN'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                        <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className={styles.empty}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                </svg>
                                <p>Aucun utilisateur trouvé</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className={styles.paginationBtn}
                        >
                            Précédent
                        </button>

                        <span className={styles.paginationInfo}>
                            Page {currentPage + 1} sur {Math.ceil(total / pageSize)} ({total} total)
                        </span>

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={(currentPage + 1) * pageSize >= total}
                            className={styles.paginationBtn}
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}

            {/* Modal */}
            {modalOpen && (
                <UserModal
                    user={editingUser}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}
