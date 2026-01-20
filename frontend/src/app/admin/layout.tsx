'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AdminSidebar from '@/components/AdminSidebar';
import styles from './admin.module.css';

/**
 * Layout for all admin pages
 * Protects routes and provides consistent admin UI
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    // Don't render if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            <AdminSidebar />
            <main className={styles.adminMain}>
                {children}
            </main>
        </div>
    );
}
