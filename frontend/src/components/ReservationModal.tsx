'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './ReservationModal.module.css';
import { Vehicle } from './VehicleCard';
import { createReservation } from '@/lib/reservation-api';

interface ReservationModalProps {
    vehicle: Vehicle;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReservationModal({ vehicle, isOpen, onClose, onSuccess }: ReservationModalProps) {
    const [formData, setFormData] = useState({
        dateDebut: '',
        dateFin: '',
        lieuPickup: 'Agence Centrale',
        lieuRetour: 'Agence Centrale',
        remarques: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (formData.dateDebut && formData.dateFin) {
            const start = new Date(formData.dateDebut);
            const end = new Date(formData.dateFin);
            if (end > start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDays(diffDays);
                setTotalPrice(diffDays * (vehicle.prixParJour || 0));
            } else {
                setDays(0);
                setTotalPrice(0);
            }
        }
    }, [formData.dateDebut, formData.dateFin, vehicle.prixParJour]);

    if (!mounted || !isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Vous devez être connecté pour réserver.');

            await createReservation(token, {
                vehiculeId: vehicle.id,
                ...formData
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la réservation.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Réserver ce véhicule</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.form}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
                                <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Demande Envoyée !</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Votre demande de réservation a été transmise aux administrateurs pour validation.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className={styles.vehicleBrief}>
                                <img src={vehicle.imageUrl || '/car-placeholder.png'} alt={vehicle.modele} className={styles.miniImage} />
                                <div className={styles.vehicleBriefInfo}>
                                    <h4>{vehicle.marque} {vehicle.modele}</h4>
                                    <p>{vehicle.typeVehicule} • {vehicle.transmission}</p>
                                </div>
                            </div>

                            {error && (
                                <div className={styles.error}>
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Date de départ</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="date"
                                            className={styles.input}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.dateDebut}
                                            onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Date de retour</label>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        required
                                        min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                                        value={formData.dateFin}
                                        onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Lieu de prise</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.lieuPickup}
                                        onChange={(e) => setFormData({ ...formData, lieuPickup: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Lieu de retour</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.lieuRetour}
                                        onChange={(e) => setFormData({ ...formData, lieuRetour: e.target.value })}
                                    />
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Remarques (optionnel)</label>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="Besoins spécifiques, demandes particulières..."
                                        value={formData.remarques}
                                        onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
                                    />
                                </div>
                            </div>

                            {days > 0 && (
                                <div className={styles.priceSummary}>
                                    <div className={styles.priceRow}>
                                        <span>Prix par jour</span>
                                        <span>{vehicle.prixParJour}€</span>
                                    </div>
                                    <div className={styles.priceRow}>
                                        <span>Durée</span>
                                        <span>{days} jours</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>Total Estimé</span>
                                        <span className={styles.totalPrice}>{totalPrice}€</span>
                                    </div>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                                    Annuler
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Envoi en cours...' : 'Confirmer la demande'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
