'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getAllReservations, updateReservationStatus } from '@/lib/reservation-api';
import styles from './ReservationsManager.module.css';
import {
    CheckCircle,
    XCircle,
    Clock,
    RefreshCcw,
    AlertCircle
} from 'lucide-react';

export default function ReservationsManager() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getAllReservations(token, 0, 50);
            setReservations(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [token]);

    const handleStatusUpdate = async (id: number, status: string) => {
        if (!token) return;
        try {
            await updateReservationStatus(token, id, status);
            setReservations(prev => prev.map(res =>
                res.id === id ? { ...res, etat: status } : res
            ));
            fetchReservations();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'EN_ATTENTE': return styles.badgePending;
            case 'CONFIRMEE': return styles.badgeConfirmed;
            case 'ANNULEE': return styles.badgeCancelled;
            case 'REFUSEE': return styles.badgeRefused;
            default: return '';
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Gestion des Réservations</h1>
                        <p className={styles.secondaryText}>Validez ou refusez les demandes de vos clients.</p>
                    </div>
                    <button onClick={fetchReservations} className={styles.actionBtn} title="Rafraîchir">
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {error && (
                <div className={styles.errorBox} style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loading}>Chargement des réservations...</div>
                ) : reservations.length === 0 ? (
                    <div className={styles.noData}>
                        <Clock size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>Aucune réservation trouvée.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Véhicule</th>
                                <th>Période</th>
                                <th>Prix Total</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <span className={styles.primaryText}>{res.utilisateur.firstName} {res.utilisateur.lastName}</span>
                                            <span className={styles.secondaryText}>{res.utilisateur.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.vehicleCell}>
                                            <span className={styles.primaryText}>{res.vehicule.marque} {res.vehicule.modele}</span>
                                            <span className={styles.secondaryText}>{res.vehicule.immatriculation}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.dateCell}>
                                            <div className={styles.primaryText}>
                                                {new Date(res.dateDebut).toLocaleDateString()}
                                            </div>
                                            <div className={styles.secondaryText}>
                                                au {new Date(res.dateFin).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.primaryText} style={{ color: 'var(--primary)' }}>{res.prixTotal}€</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${getStatusClass(res.etat)}`}>
                                            {res.etat === 'EN_ATTENTE' && <Clock size={14} style={{ marginRight: 4 }} />}
                                            {res.etat === 'CONFIRMEE' && <CheckCircle size={14} style={{ marginRight: 4 }} />}
                                            {(res.etat === 'REFUSEE' || res.etat === 'ANNULEE') && <XCircle size={14} style={{ marginRight: 4 }} />}
                                            {res.etat}
                                        </span>
                                    </td>
                                    <td>
                                        {res.etat === 'EN_ATTENTE' && (
                                            <div className={styles.actions}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                                    onClick={() => handleStatusUpdate(res.id, 'CONFIRMEE')}
                                                    title="Valider la réservation"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.refuseBtn}`}
                                                    onClick={() => handleStatusUpdate(res.id, 'REFUSEE')}
                                                    title="Refuser la réservation"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
