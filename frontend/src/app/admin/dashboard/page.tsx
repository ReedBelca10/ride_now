'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/admin-api';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import styles from './dashboard.module.css';

interface Analytics {
    totalUsers: number;
    totalVehicles: number;
    totalReservations: number;
    activeReservations: number;
    totalRevenue: number;
}

interface MonthData {
    month: string;
    count?: number;
    revenue?: number;
}

/**
 * Admin Dashboard Main Page
 * Displays statistics, charts, and quick actions
 */
export default function DashboardPage() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [userGrowth, setUserGrowth] = useState<MonthData[]>([]);
    const [vehicleStats, setVehicleStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [analyticsData, userGrowthData, vehicleStatsData] = await Promise.all([
                adminAPI.getAnalytics(),
                adminAPI.getUserGrowthStats(),
                adminAPI.getVehicleTypeStats(),
            ]);

            setAnalytics(analyticsData as Analytics);
            setUserGrowth(userGrowthData as MonthData[]);
            setVehicleStats(vehicleStatsData as any[]);
            setLastSync(new Date());
        } catch (error) {
            console.error('Erreur chargement analytics:', error);
            setError('Erreur lors du chargement des données du dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSync = () => {
        fetchData();
    };

    if (isLoading && !analytics) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement du dashboard...</p>
            </div>
        );
    }

    if (error && !analytics) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button onClick={handleSync} className={styles.retryBtn}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Vue d'ensemble de la plateforme</p>
                    {lastSync && (
                        <p className={styles.syncTime}>
                            Dernière synchronisation: {lastSync.toLocaleTimeString('fr-FR')}
                        </p>
                    )}
                </div>
                <button onClick={handleSync} className={styles.syncBtn} disabled={isLoading}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isLoading ? styles.spinning : ''}>
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                    <span>{isLoading ? 'Synchronisation...' : 'Synchroniser'}</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Employés"
                    value={analytics?.totalUsers || 0}
                    subtitle="Total utilisateurs actifs"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />

                <StatCard
                    title="Réservations Actives"
                    value={analytics?.activeReservations || 0}
                    trend={{ value: '+15%', isPositive: true }}
                    subtitle="En cours ou confirmées"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                />

                <StatCard
                    title="Véhicules Disponibles"
                    value={analytics?.totalVehicles || 0}
                    trend={{ value: '+5%', isPositive: true }}
                    subtitle="Véhicules actifs"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />

                <StatCard
                    title="Chiffre d'affaires"
                    value={`€${(analytics?.totalRevenue || 0).toFixed(2)}`}
                    trend={{ value: '+22%', isPositive: true }}
                    subtitle="Revenus totaux"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Actions Rapides</h2>
                <div className={styles.actionsGrid}>
                    <button onClick={() => router.push('/admin/users')} className={styles.actionCard}>
                        <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 255, 242, 0.15))' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <span className={styles.actionText}>Gérer Utilisateurs</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.actionArrow}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <button onClick={() => router.push('/admin/vehicles')} className={styles.actionCard}>
                        <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(168, 85, 247, 0.15))' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2">
                                <path d="M5 17h2m10 0h2M7 17c0 1.1-.9 2-2 2s-2-.9-2-2m4 0c0-1.1-.9-2-2-2m4 2h6m4 0c0 1.1-.9 2-2 2s-2-.9-2-2" />
                                <path d="M3 11l2-7h14l2 7H3z" />
                            </svg>
                        </div>
                        <span className={styles.actionText}>Gérer Véhicules</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.actionArrow}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <button onClick={() => router.push('/admin/reservations')} className={styles.actionCard}>
                        <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(74, 222, 128, 0.15))' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <span className={styles.actionText}>Gérer Réservations</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.actionArrow}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Charts */}
            <div className={styles.chartsGrid}>
                <LineChart
                    data={userGrowth.map(d => ({ month: d.month, value: d.count || 0 }))}
                    title="Croissance Utilisateurs"
                    subtitle="Nouveaux utilisateurs par mois"
                    color="cyan"
                    trend="+12%"
                />

                <LineChart
                    data={vehicleStats.map((v) => ({ month: v.type, value: v.count }))}
                    title="Répartition Véhicules"
                    subtitle="Par type de véhicule"
                    color="purple"
                    trend="+8%"
                />
            </div>
        </div>
    );
}
