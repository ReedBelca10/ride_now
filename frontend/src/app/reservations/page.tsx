'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/lib/protected-route';
import { getMyReservations } from '@/lib/reservation-api'; // I need to add this
import styles from './user-reservations.module.css';
import {
    CheckCircle,
    XCircle,
    Clock,
    Car,
    Calendar as CalendarIcon,
    MapPin,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function UserReservationsPage() {
    const { token } = useAuth();
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReservations = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:3001/api/reservations/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setReservations(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReservations();
    }, [token]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'EN_ATTENTE': return 'En attente de validation';
            case 'CONFIRMEE': return 'Confirmée';
            case 'REFUSEE': return 'Refusée';
            case 'ANNULEE': return 'Annulée';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EN_ATTENTE': return '#f59e0b';
            case 'CONFIRMEE': return '#10b981';
            case 'REFUSEE': return '#ef4444';
            case 'ANNULEE': return '#6b7280';
            default: return '#fff';
        }
    };

    return (
        <ProtectedRoute>
            <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
                <Navbar />

                <main className="container" style={{ padding: '6rem 1.5rem 4rem' }}>
                    <header style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>
                            Mes <span style={{ color: 'var(--primary)' }}>Réservations</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Retrouvez ici l'historique de vos demandes de réservation.</p>
                    </header>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement...</div>
                    ) : reservations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <CalendarIcon size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.1, color: '#fff' }} />
                            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Aucune réservation</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Vous n'avez pas encore effectué de réservation.
                            </p>
                            <Link href="/vehicles" className="btn btn-primary">
                                Parcourir la flotte
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {reservations.map((res) => (
                                <div key={res.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.status} style={{ borderColor: getStatusColor(res.etat), color: getStatusColor(res.etat) }}>
                                            {res.etat === 'EN_ATTENTE' && <Clock size={14} />}
                                            {res.etat === 'CONFIRMEE' && <CheckCircle size={14} />}
                                            {getStatusLabel(res.etat)}
                                        </div>
                                        <span className={styles.code}>{res.locationCode}</span>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.vehicleInfo}>
                                            <img src={res.vehicule.imageUrl || '/car-placeholder.png'} alt={res.vehicule.modele} className={styles.vehicleImage} />
                                            <div>
                                                <h3>{res.vehicule.marque} {res.vehicule.modele}</h3>
                                                <p>{res.vehicule.typeVehicule}</p>
                                            </div>
                                        </div>

                                        <div className={styles.details}>
                                            <div className={styles.detailItem}>
                                                <CalendarIcon size={16} />
                                                <span>Du {new Date(res.dateDebut).toLocaleDateString()} au {new Date(res.dateFin).toLocaleDateString()}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <MapPin size={16} />
                                                <span>Prise : {res.lieuPickup}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <span className={styles.price}>{res.prixTotal}€</span>
                                        <Link href={`/vehicles`} className={styles.viewLink}>
                                            Détails véhicule <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
