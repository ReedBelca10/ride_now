/**
 * Utilitaires pour les opérations de réservations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Récupère toutes les réservations (Admin/Manager)
 */
export async function getAllReservations(token: string, skip: number = 0, take: number = 10) {
    const response = await fetch(`${API_BASE_URL}/reservations?skip=${skip}&take=${take}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des réservations');
    return response.json();
}

/**
 * Crée une nouvelle réservation
 */
export async function createReservation(token: string, reservationData: any) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la réservation');
    }
    return response.json();
}

/**
 * Met à jour le statut d'une réservation (Admin/Manager)
 */
export async function updateReservationStatus(token: string, id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ etat: status }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la réservation');
    }
    return response.json();
}

/**
 * Annule une réservation
 */
export async function cancelReservation(token: string, id: number) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Erreur lors de l\'annulation');
    return response.json();
}
