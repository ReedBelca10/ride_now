/**
 * Composant de gestion des véhicules pour l'admin
 * Permet de créer, mettre à jour, archiver et supprimer des véhicules avec images
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getAllVehiclesAdmin,
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  archiveVehicle,
  restoreVehicle,
  deleteVehicle,
} from '@/lib/vehicle-api';
import styles from './VehicleManager.module.css';

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
  imagePath?: string;
  etat: string;
  isActive: boolean;
  isArchived: boolean;
  archivedAt?: string;
}

interface FormData {
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
  prixParJour: number | '';
  description: string;
}

const initialFormData: FormData = {
  marque: '',
  modele: '',
  annee: new Date().getFullYear(),
  immatriculation: '',
  typeVehicule: 'BERLINE',
  carburant: 'ESSENCE',
  transmission: 'AUTOMATIQUE',
  nombrePlaces: 2,
  couleur: '',
  kilometrage: 0,
  prixParJour: '',
  description: '',
};

export default function VehicleManager() {
  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);

  // Charger les véhicules
  useEffect(() => {
    if (!token) return;
    loadVehicles();
  }, [token, includeArchived]);

  const loadVehicles = async () => {
    try {
      setError(null);
      const data = await getAllVehiclesAdmin(token!, 0, 100, includeArchived);
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'annee' || name === 'nombrePlaces' || name === 'kilometrage' || name === 'prixParJour'
          ? (value === '' ? '' : parseFloat(value))
          : value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne peut pas dépasser 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let vehicleId: number;

      if (editingId) {
        // Mise à jour
        // Nettoyage des données pour gérer les champs optionnels
        const dataToSend = {
          ...formData,
          prixParJour: formData.prixParJour === '' ? undefined : formData.prixParJour,
        };

        await updateVehicle(token!, editingId, dataToSend);
        vehicleId = editingId;
      } else {
        // Création
        // Nettoyage des données pour gérer les champs optionnels
        const dataToSend = {
          ...formData,
          prixParJour: formData.prixParJour === '' ? undefined : formData.prixParJour,
        };

        const created = await createVehicle(token!, dataToSend);
        vehicleId = created.id;
      }

      // Upload l'image si sélectionnée
      if (selectedImage) {
        await uploadVehicleImage(token!, vehicleId, selectedImage);
      }

      setSuccess(editingId ? 'Véhicule mis à jour avec succès' : 'Véhicule créé avec succès');
      resetForm();
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
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
      prixParJour: vehicle.prixParJour ?? '',
      description: vehicle.description || '',
    });
    setEditingId(vehicle.id);
    setShowForm(true);
    if (vehicle.imageUrl) {
      setImagePreview(vehicle.imageUrl);
    }
  };

  const handleDeleteImage = async (vehicleId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    setLoading(true);
    try {
      await deleteVehicleImage(token!, vehicleId);
      setSuccess('Image supprimée avec succès');
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (vehicleId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir archiver ce véhicule ?')) return;

    setLoading(true);
    try {
      await archiveVehicle(token!, vehicleId);
      setSuccess('Véhicule archivé avec succès');
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'archivage');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (vehicleId: number) => {
    setLoading(true);
    try {
      await restoreVehicle(token!, vehicleId);
      setSuccess('Véhicule restauré avec succès');
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de restauration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?')) return;

    setLoading(true);
    try {
      await deleteVehicle(token!, vehicleId);
      setSuccess('Véhicule supprimé définitivement');
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedImage(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return <div className={styles.error}>Accès non autorisé</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestion des Véhicules</h1>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.controls}>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.primaryBtn}
          disabled={loading}
        >
          {showForm ? 'Annuler' : '+ Ajouter un véhicule'}
        </button>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={(e) => setIncludeArchived(e.target.checked)}
          />
          Afficher les véhicules archivés
        </label>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="marque">Marque *</label>
              <input
                id="marque"
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modele">Modèle *</label>
              <input
                id="modele"
                type="text"
                name="modele"
                value={formData.modele}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="annee">Année *</label>
              <input
                id="annee"
                type="number"
                name="annee"
                value={formData.annee}
                onChange={handleInputChange}
                min="1950"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="immatriculation">Immatriculation *</label>
              <input
                id="immatriculation"
                type="text"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="typeVehicule">Type de véhicule *</label>
              <select
                id="typeVehicule"
                name="typeVehicule"
                value={formData.typeVehicule}
                onChange={handleInputChange}
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
              <label htmlFor="carburant">Carburant *</label>
              <select
                id="carburant"
                name="carburant"
                value={formData.carburant}
                onChange={handleInputChange}
              >
                <option value="ESSENCE">Essence</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRIDE">Hybride</option>
                <option value="ELECTRIQUE">Électrique</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="transmission">Transmission *</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
              >
                <option value="MANUELLE">Manuelle</option>
                <option value="AUTOMATIQUE">Automatique</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="couleur">Couleur *</label>
              <input
                id="couleur"
                type="text"
                name="couleur"
                value={formData.couleur}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombrePlaces">Nombre de places *</label>
              <input
                id="nombrePlaces"
                type="number"
                name="nombrePlaces"
                value={formData.nombrePlaces}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="kilometrage">Kilométrage</label>
              <input
                id="kilometrage"
                type="number"
                name="kilometrage"
                value={formData.kilometrage}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="prixParJour">Prix par jour (€)</label>
              <input
                id="prixParJour"
                type="number"
                name="prixParJour"
                value={formData.prixParJour}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.imageSection}>
            <h3>Image du véhicule</h3>
            <div className={styles.imageUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={loading}
              />
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Prévisualisation" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
          >
            {loading ? 'En cours...' : editingId ? 'Mettre à jour' : 'Créer'}
          </button>
        </form>
      )}

      <div className={styles.vehiclesList}>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`${styles.vehicleCard} ${vehicle.isArchived ? styles.archived : ''}`}
          >
            {vehicle.imageUrl && (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.marque} ${vehicle.modele}`}
                className={styles.vehicleImage}
              />
            )}

            <div className={styles.vehicleInfo}>
              <h3>
                {vehicle.marque} {vehicle.modele} ({vehicle.annee})
              </h3>
              <p>
                <strong>Immatriculation:</strong> {vehicle.immatriculation}
              </p>
              <p>
                <strong>Type:</strong> {vehicle.typeVehicule}
              </p>
              <p>
                <strong>Carburant:</strong> {vehicle.carburant}
              </p>
              <p>
                <strong>Couleur:</strong> {vehicle.couleur}
              </p>
              <p>
                <strong>Places:</strong> {vehicle.nombrePlaces}
              </p>
              <p>
                <strong>Prix/jour:</strong> {vehicle.prixParJour ? `${vehicle.prixParJour}€` : 'Non défini'}
              </p>
              {vehicle.isArchived && (
                <p className={styles.archivedLabel}>
                  Archivé le {new Date(vehicle.archivedAt!).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <div className={styles.vehicleActions}>
              {!vehicle.isArchived ? (
                <>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className={styles.secondaryBtn}
                    disabled={loading}
                  >
                    Modifier
                  </button>
                  {vehicle.imageUrl && user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteImage(vehicle.id)}
                      className={styles.dangerBtn}
                      disabled={loading}
                    >
                      Supprimer image
                    </button>
                  )}
                  <button
                    onClick={() => handleArchive(vehicle.id)}
                    className={styles.warningBtn}
                    disabled={loading}
                  >
                    Archiver
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleRestore(vehicle.id)}
                    className={styles.secondaryBtn}
                    disabled={loading}
                  >
                    Restaurer
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className={styles.dangerBtn}
                      disabled={loading}
                    >
                      Supprimer définitivement
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
