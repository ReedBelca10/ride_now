'use client';

import VehicleManager from '@/components/VehicleManager';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/lib/protected-route';

/**
 * Page de gestion des véhicules
 * Gestion complète CRUD des véhicules avec images Supabase
 */
export default function VehiclesPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <VehicleManager />
    </ProtectedRoute>
  );
}
