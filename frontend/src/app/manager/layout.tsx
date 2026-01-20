'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ManagerSidebar from '@/components/ManagerSidebar';
import styles from './manager.module.css';

/**
 * Layout for all manager pages
 * Protects routes and provides consistent manager UI (similar to Admin)
 */
export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isManager, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isManager && !isAdmin) {
                // If not manager AND not admin, redirect home
                router.push('/');
            }
        }
    }, [isAuthenticated, isManager, isAdmin, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    // Don't render if not authenticated or not authorized
    if (!isAuthenticated || (!isManager && !isAdmin)) {
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            <ManagerSidebar />
            <main className={styles.adminMain}>
                {children}
            </main>
        </div>
    );
}
