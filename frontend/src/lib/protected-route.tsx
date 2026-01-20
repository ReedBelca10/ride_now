/**
 * Composant pour protéger les routes
 * Redirige vers login si l'utilisateur n'est pas authentifié
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

/**
 * Wrapper pour les pages protégées
 * Exemple d'utilisation: <ProtectedRoute requiredRole="ADMIN">...</ProtectedRoute>
 * Ou: <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>...</ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Attend que le chargement soit terminé
    if (isLoading) {
      return;
    }

    // Redirige si non authentifié
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Vérifie le rôle si requis
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/'); // Redirige vers l'accueil si rôle insuffisant
      return;
    }

    // Vérifie si le rôle est dans la liste autorisée
    if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
      router.push('/');
      return;
    }
  }, [isLoading, isAuthenticated, user?.role, requiredRole, allowedRoles, router]);

  // Affiche un loading state pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Affiche la page si authentifié et autorisé
  const isRoleAuthorized =
    (!requiredRole || user?.role === requiredRole) &&
    (!allowedRoles || (user?.role && allowedRoles.includes(user.role)));

  if (isAuthenticated && isRoleAuthorized) {
    return <>{children}</>;
  }


  // Affiche rien si la redirection est en cours
  return null;
}
