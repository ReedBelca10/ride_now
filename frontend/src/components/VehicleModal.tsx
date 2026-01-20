'use client';

import { useState, useEffect } from 'react';
import styles from './VehicleModal.module.css';

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    annee: number;
    immatriculation: string;
    typeVehicule: string;
    carburant: string;
    transmission: string;
    nombrePlaces: number;
    couleur: string;
    kilometrage: number;
    prixParJour: number;
    description?: string;
    imageUrl?: string;
    etat: string;
}

interface VehicleModalProps {
    vehicle: Vehicle | null;
    onClose: (shouldRefresh: boolean) => void;
}

/**
 * Vehicle Create/Edit Modal
 * Full form for all vehicle fields
 */
export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
    const [formData, setFormData] = useState({
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        immatriculation: '',
        typeVehicule: 'BERLINE',
        carburant: 'ESSENCE',
        transmission: 'AUTOMATIQUE',
        nombrePlaces: 5,
        couleur: '',
        kilometrage: 0,
        prixParJour: 0,
        description: '',
        imageUrl: '',
        etat: 'DISPONIBLE',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (vehicle) {
            setFormData({
                marque: vehicle.marque,
                modele: vehicle.modele,
                annee: vehicle.annee,
                immatriculation: vehicle.immatriculation,
                typeVehicule: vehicle.typeVehicule,
                carburant: vehicle.carburant,
                transmission: vehicle.transmission,
                nombrePlaces: vehicle.nombrePlaces,
                couleur: vehicle.couleur,
                kilometrage: vehicle.kilometrage,
                prixParJour: vehicle.prixParJour,
                description: vehicle.description || '',
                imageUrl: vehicle.imageUrl || '',
                etat: vehicle.etat,
            });
        }
    }, [vehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { adminAPI } = await import('@/lib/admin-api');

            if (vehicle) {
                // Update existing vehicle
                await adminAPI.updateVehicle(vehicle.id, formData);
            } else {
                // Create new vehicle
                await adminAPI.createVehicle(formData);
            }

            onClose(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={() => onClose(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
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
                            <label className={styles.label}>Marque *</label>
                            <input
                                type="text"
                                value={formData.marque}
                                onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                                className={styles.input}
                                required
                                placeholder="Ex: Ferrari, Lamborghini"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Modèle *</label>
                            <input
                                type="text"
                                value={formData.modele}
                                onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                                className={styles.input}
                                required
                                placeholder="Ex: F8 Tributo"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Année *</label>
                            <input
                                type="number"
                                value={formData.annee}
                                onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                                className={styles.input}
                                required
                                min="1950"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Immatriculation *</label>
                            <input
                                type="text"
                                value={formData.immatriculation}
                                onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
                                className={styles.input}
                                required
                                placeholder="Ex: AB-123-CD"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type *</label>
                            <select
                                value={formData.typeVehicule}
                                onChange={(e) => setFormData({ ...formData, typeVehicule: e.target.value })}
                                className={styles.input}
                                required
                            >
                                <option value="BERLINE">Berline</option>
                                <option value="SPORTIVE">Sportive</option>
                                <option value="SUV">SUV</option>
                                <option value="CABRIOLET">Cabriolet</option>
                                <option value="MONOSPACE">Monospace</option>
                                <option value="COMBI">Combi</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Carburant *</label>
                            <select
                                value={formData.carburant}
                                onChange={(e) => setFormData({ ...formData, carburant: e.target.value })}
                                className={styles.input}
                                required
                            >
                                <option value="ESSENCE">Essence</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="HYBRIDE">Hybride</option>
                                <option value="ELECTRIQUE">Électrique</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Transmission *</label>
                            <select
                                value={formData.transmission}
                                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                className={styles.input}
                                required
                            >
                                <option value="MANUELLE">Manuelle</option>
                                <option value="AUTOMATIQUE">Automatique</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Places *</label>
                            <input
                                type="number"
                                value={formData.nombrePlaces}
                                onChange={(e) => setFormData({ ...formData, nombrePlaces: parseInt(e.target.value) })}
                                className={styles.input}
                                required
                                min="1"
                                max="9"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Couleur *</label>
                            <input
                                type="text"
                                value={formData.couleur}
                                onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                                className={styles.input}
                                required
                                placeholder="Ex: Rouge, Noir"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Kilométrage *</label>
                            <input
                                type="number"
                                value={formData.kilometrage}
                                onChange={(e) => setFormData({ ...formData, kilometrage: parseInt(e.target.value) })}
                                className={styles.input}
                                required
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Prix/jour (€) *</label>
                            <input
                                type="number"
                                value={formData.prixParJour}
                                onChange={(e) => setFormData({ ...formData, prixParJour: parseFloat(e.target.value) })}
                                className={styles.input}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>État *</label>
                            <select
                                value={formData.etat}
                                onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
                                className={styles.input}
                                required
                            >
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="RESERVE">Réservé</option>
                                <option value="EN_MAINTENANCE">En maintenance</option>
                                <option value="INDISPONIBLE">Indisponible</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>URL Image</label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className={styles.input}
                                placeholder="https://..."
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`${styles.input} ${styles.textarea}`}
                                rows={3}
                                placeholder="Description du véhicule..."
                            />
                        </div>
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
                            {isSubmitting ? 'En cours...' : vehicle ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
