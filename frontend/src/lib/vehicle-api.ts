/**
 * Utilitaires pour les opérations CRUD de véhicules avec gestion d'images
 */

import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Récupère tous les véhicules
 */
export async function getAllVehicles(
  skip: number = 0,
  take: number = 10,
) {
  const response = await fetch(
    `${API_BASE_URL}/vehicles?skip=${skip}&take=${take}`,
  );
  if (!response.ok) throw new Error('Erreur lors de la récupération des véhicules');
  return response.json();
}

/**
 * Récupère tous les véhicules (admin) - y compris archivés
 */
export async function getAllVehiclesAdmin(
  token: string,
  skip: number = 0,
  take: number = 10,
  includeArchived: boolean = false,
) {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/admin/all?skip=${skip}&take=${take}&includeArchived=${includeArchived}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) throw new Error('Erreur lors de la récupération des véhicules');
  return response.json();
}

/**
 * Récupère un véhicule par ID
 */
export async function getVehicle(id: number) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
  if (!response.ok) throw new Error('Véhicule non trouvé');
  return response.json();
}

/**
 * Crée un nouveau véhicule
 */
export async function createVehicle(token: string, vehicleData: any) {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) throw new Error('Erreur lors de la création du véhicule');
  return response.json();
}

/**
 * Met à jour un véhicule
 */
export async function updateVehicle(
  token: string,
  id: number,
  vehicleData: any,
) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicleData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour du véhicule');
  }
  return response.json();
}

/**
 * Upload une image pour un véhicule
 */
export async function uploadVehicleImage(
  token: string,
  vehicleId: number,
  file: File,
): Promise<any> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
  }

  return response.json();
}

/**
 * Supprime l'image d'un véhicule
 */
export async function deleteVehicleImage(token: string, vehicleId: number) {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/${vehicleId}/image`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) throw new Error('Erreur lors de la suppression de l\'image');
  return response.json();
}

/**
 * Archive un véhicule (soft delete)
 */
export async function archiveVehicle(token: string, vehicleId: number) {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/${vehicleId}/archive`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) throw new Error('Erreur lors de l\'archivage du véhicule');
  return response.json();
}

/**
 * Restaure un véhicule archivé
 */
export async function restoreVehicle(token: string, vehicleId: number) {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/${vehicleId}/restore`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) throw new Error('Erreur lors de la restauration du véhicule');
  return response.json();
}

/**
 * Supprime définitivement un véhicule
 */
export async function deleteVehicle(token: string, vehicleId: number) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du véhicule');
  return response.json();
}
