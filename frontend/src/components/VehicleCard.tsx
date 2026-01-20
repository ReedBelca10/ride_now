import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Fuel, Gauge, CheckCircle } from 'lucide-react';
import styles from './VehicleCard.module.css';

export interface Vehicle {
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
    prixParJour?: number;
    description: string;
    imageUrl?: string;
    isActive: boolean;
    isArchived: boolean;
    etat?: 'DISPONIBLE' | 'RESERVE' | 'EN_MAINTENANCE' | 'INDISPONIBLE';
}

interface VehicleCardProps {
    vehicle: Vehicle;
    index?: number;
    onReserve?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, index = 0, onReserve }: VehicleCardProps) {
    const isAvailable = vehicle.etat === 'DISPONIBLE' || !vehicle.etat;

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={styles.vehicleCard}
            >
                <div className={styles.imageWrapper}>
                    <div className={`${styles.statusBadge} ${isAvailable ? styles.available : styles.unavailable}`}>
                        {isAvailable ? 'Disponible' : (vehicle.etat || 'Indisponible')}
                    </div>
                    {vehicle.imageUrl ? (
                        <img
                            src={vehicle.imageUrl}
                            alt={`${vehicle.marque} ${vehicle.modele}`}
                            className={styles.vehicleImage}
                        />
                    ) : (
                        <div className={styles.noImage}>
                            <Car size={48} />
                        </div>
                    )}
                    {vehicle.prixParJour && (
                        <div className={styles.priceBadge}>
                            <span>{vehicle.prixParJour}€</span>/jour
                        </div>
                    )}
                </div>

                <div className={styles.vehicleInfo}>
                    <div className={styles.headerInfo}>
                        <h3>{vehicle.marque} {vehicle.modele}</h3>
                        <span className={styles.year}>{vehicle.annee}</span>
                    </div>

                    <div className={styles.specsGrid}>
                        <div className={styles.specItem}>
                            <Users size={16} />
                            <span>{vehicle.nombrePlaces} places</span>
                        </div>
                        <div className={styles.specItem}>
                            <Fuel size={16} />
                            <span>{vehicle.carburant}</span>
                        </div>
                        <div className={styles.specItem}>
                            <Gauge size={16} />
                            <span>{vehicle.transmission}</span>
                        </div>
                        <div className={styles.specItem}>
                            <CheckCircle size={16} />
                            <span>{vehicle.typeVehicule}</span>
                        </div>
                    </div>

                    <p className={styles.description}>{vehicle.description}</p>
                </div>

                <div className={styles.cardFooter}>
                    <button
                        className={styles.reserveBtn}
                        onClick={() => onReserve && onReserve(vehicle)}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Réserver' : 'Indisponible'}
                    </button>
                </div>
            </motion.div>

        </>
    );
}
