'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getAllVehicles } from '@/lib/vehicle-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Car, Users, Fuel, Gauge, CheckCircle } from 'lucide-react';
import styles from './vehicles.module.css';

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
  prixParJour?: number;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  isArchived: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, selectedType]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await getAllVehicles(0, 100);
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let result = vehicles;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v =>
        v.marque.toLowerCase().includes(term) ||
        v.modele.toLowerCase().includes(term) ||
        v.description.toLowerCase().includes(term)
      );
    }

    if (selectedType !== 'ALL') {
      result = result.filter(v => v.typeVehicule === selectedType);
    }

    setFilteredVehicles(result);
  };

  const vehicleTypes = [
    { id: 'ALL', label: 'Tous' },
    { id: 'BERLINE', label: 'Berline' },
    { id: 'SUV', label: 'SUV' },
    { id: 'SPORTIVE', label: 'Sportive' },
    { id: 'CABRIOLET', label: 'Cabriolet' },
    { id: 'COMBI', label: 'Combi' },
    { id: 'MONOSPACE', label: 'Monospace' },
  ];

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.hero}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroContent}
          >
            <h1>Trouvez le véhicule idéal pour votre prochaine aventure</h1>
            <p>Une large gamme de véhicules premium pour tous vos besoins de mobilité.</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Search & Filters */}
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.typesGrid}>
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                className={`${styles.typeBtn} ${selectedType === type.id ? styles.activeType : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Chargement des véhicules...</p>
          </div>
        ) : (
          <div className={styles.vehiclesGrid}>
            <AnimatePresence>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={styles.vehicleCard}
                  >
                    <div className={styles.imageWrapper}>
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
                      <button className={styles.reserveBtn}>
                        Réserver
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.empty}>
                  <Car size={64} opacity={0.3} />
                  <h3>Aucun véhicule trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
