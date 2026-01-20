'use client';

import { useState, useEffect } from 'react';
import styles from './UserModal.module.css';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'MANAGER' | 'ADMIN';
    telephone?: string;
}

interface UserModalProps {
    user: User | null;
    onClose: (shouldRefresh: boolean) => void;
}

/**
 * User Create/Edit Modal
 * Premium glassmorphism design
 */
export default function UserModal({ user, onClose }: UserModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'USER',
        telephone: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                telephone: user.telephone || '',
                password: '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { adminAPI } = await import('@/lib/admin-api');

            if (user) {
                // Update existing user
                await adminAPI.updateUser(user.id, {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    telephone: formData.telephone || undefined,
                });
            } else {
                // Create new user
                await adminAPI.createUser({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    telephone: formData.telephone || undefined,
                    password: formData.password || undefined,
                });
            }

            onClose(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={() => onClose(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {user ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
                    </h2>
                    <button className={styles.closeBtn} onClick={() => onClose(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Prénom *</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nom *</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Téléphone</label>
                            <input
                                type="tel"
                                value={formData.telephone}
                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rôle *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                className={styles.input}
                                required
                            >
                                <option value="USER">Utilisateur</option>
                                <option value="MANAGER">Gestionnaire</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>

                        {!user && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mot de passe</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={styles.input}
                                    placeholder="Laisser vide pour mot de passe par défaut"
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className={styles.cancelBtn}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'En cours...' : user ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
