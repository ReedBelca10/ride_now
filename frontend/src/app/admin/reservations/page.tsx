'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/admin-api';
import styles from './page.module.css';

interface Reservation {
    id: number;
    locationCode: string;
    dateDebut: string;
    dateFin: string;
    prixTotal: number;
    etat: 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_COURS' | 'COMPLETEE' | 'ANNULEE' | 'REFUSEE';
    lieuPickup: string;
    lieuRetour?: string;
    utilisateur: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        telephone?: string;
    };
    vehicule: {
        id: number;
        marque: string;
        modele: string;
        immatriculation: string;
    };
}

interface ReservationsResponse {
    reservations: Reservation[];
    total: number;
}

/**
 * Reservations Management Page
 * Full CRUD operations for reservations
 */
export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [etatFilter, setEtatFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const data = await adminAPI.getReservations(
                currentPage * pageSize,
                pageSize,
                etatFilter || undefined,
                searchTerm || undefined
            ) as ReservationsResponse;
            setReservations(data.reservations || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Erreur chargement réservations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(0);
        fetchReservations();
    }, [etatFilter, searchTerm]);

    useEffect(() => {
        fetchReservations();
    }, [currentPage]);

    const handleEtatChange = async (reservationId: number, newEtat: string, reservationInfo: string) => {
        try {
            await adminAPI.updateReservationEtat(reservationId, newEtat);
            alert(`État de la réservation ${reservationInfo} mis à jour avec succès`);
            fetchReservations();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Une erreur est survenue';
            alert(`Erreur: ${message}`);
            console.error('Erreur mise à jour réservation:', error);
        }
    };

    const getEtatBadgeColor = (etat: string) => {
        switch (etat) {
            case 'CONFIRMEE':
                return '#10b981';
            case 'EN_COURS':
                return '#3b82f6';
            case 'COMPLETEE':
                return '#8b5cf6';
            case 'ANNULEE':
                return '#ef4444';
            case 'EN_ATTENTE':
                return '#f59e0b';
            case 'REFUSEE':
                return '#dc2626';
            default:
                return '#6b7280';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Réservations</h1>
                    <p className={styles.subtitle}>Gérer et suivre les réservations</p>
                </div>
                <button onClick={() => fetchReservations()} className={styles.refreshBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36" />
                    </svg>
                    <span>Actualiser</span>
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
                        placeholder="Rechercher par client, véhicule ou code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <select
                    value={etatFilter}
                    onChange={(e) => setEtatFilter(e.target.value)}
                    className={styles.etatFilter}
                >
                    <option value="">Tous les états</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRMEE">Confirmée</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="COMPLETEE">Complétée</option>
                    <option value="ANNULEE">Annulée</option>
                    <option value="REFUSEE">Refusée</option>
                </select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement des réservations...</p>
                </div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Client</th>
                                    <th>Véhicule</th>
                                    <th>Dates</th>
                                    <th>Montant</th>
                                    <th>État</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td>
                                            <span className={styles.code}>
                                                {reservation.locationCode}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div>
                                                    <p className={styles.userName}>
                                                        {reservation.utilisateur.firstName} {reservation.utilisateur.lastName}
                                                    </p>
                                                    <p className={styles.userEmail}>
                                                        {reservation.utilisateur.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.vehiculeCell}>
                                                <p className={styles.vehiculeName}>
                                                    {reservation.vehicule.marque} {reservation.vehicule.modele}
                                                </p>
                                                <p className={styles.immatriculation}>
                                                    {reservation.vehicule.immatriculation}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.datesCell}>
                                                <p>{formatDate(reservation.dateDebut)}</p>
                                                <p className={styles.dateSeparator}>→</p>
                                                <p>{formatDate(reservation.dateFin)}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.price}>
                                                {reservation.prixTotal.toFixed(2)} €
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={reservation.etat}
                                                onChange={(e) => handleEtatChange(reservation.id, e.target.value, `${reservation.id}`)}
                                                className={styles.etatSelect}
                                                style={{
                                                    borderLeftColor: getEtatBadgeColor(reservation.etat),
                                                }}
                                            >
                                                <option value="EN_ATTENTE">En attente</option>
                                                <option value="CONFIRMEE">Confirmée</option>
                                                <option value="EN_COURS">En cours</option>
                                                <option value="COMPLETEE">Complétée</option>
                                                <option value="ANNULEE">Annulée</option>
                                                <option value="REFUSEE">Refusée</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => {
                                                        // TODO: Implémenter modal de détails
                                                    }}
                                                    className={styles.actionBtn}
                                                    title="Voir détails"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {reservations.length === 0 && (
                            <div className={styles.empty}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <p>Aucune réservation trouvée</p>
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
        </div>
    );
}
