'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/admin-api';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import styles from './dashboard.module.css';

interface Analytics {
    totalVehicles: number;
    availableVehicles: number;
    activeReservations: number;
}

export default function ManagerDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Analytics | null>(null);
    const [vehicleStats, setVehicleStats] = useState<any[]>([]);
    const [reservationStats, setReservationStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [analyticsData, vehicleStatsData, reservationStatsData] = await Promise.all([
                adminAPI.getAnalytics(),
                adminAPI.getVehicleTypeStats(),
                adminAPI.getReservationStats(),
            ]);
            setStats(analyticsData as Analytics);
            setVehicleStats(vehicleStatsData as any[]);
            setReservationStats(reservationStatsData as any[]);
            setLastSync(new Date());
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
            setError('Erreur lors du chargement des données');
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

    if (isLoading && !stats) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
                <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 animate-pulse uppercase tracking-widest text-xs">Synchronisation avec le serveur...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-[#050505] min-h-screen text-white">
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Tableau de bord Manager</h1>
                    <div className="flex items-center gap-3 text-zinc-500 text-sm">
                        <p>Vue d'ensemble de la flotte et des réservations</p>
                        <span>•</span>
                        <p>Dernière sync: {lastSync.toLocaleTimeString('fr-FR')}</p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
                >
                    <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}
                    >
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-widest">{isLoading ? 'Synchronisation...' : 'Actualiser'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <StatCard
                    title="Total Véhicules"
                    value={stats?.totalVehicles || 0}
                    subtitle="Véhicules actifs dans la flotte"
                    trend={{ value: 'Fleet total', isPositive: true }}
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 17h2m10 0h2M7 17c0 1.1-.9 2-2 2s-2-.9-2-2m4 0c0-1.1-.9-2-2-2m4 2h6m4 0c0 1.1-.9 2-2 2s-2-.9-2-2" />
                            <path d="M3 11l2-7h14l2 7H3z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Véhicules Disponibles"
                    value={stats?.availableVehicles || 0}
                    subtitle="Prêts pour une nouvelle location"
                    trend={{ value: 'Disponible', isPositive: true }}
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />
                <StatCard
                    title="Réservations Actives"
                    value={stats?.activeReservations || 0}
                    subtitle="En cours ou confirmées aujourd'hui"
                    trend={{ value: 'En direct', isPositive: true }}
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                />
            </div>

            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                    <LineChart
                        data={vehicleStats.map((v) => ({ month: v.type, value: v.count }))}
                        title="Répartition par Type"
                        subtitle="Volumes actuels de la flotte"
                        color="cyan"
                    />
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                    <LineChart
                        data={reservationStats.map(d => ({ month: d.month, value: d.count || 0 }))}
                        title="Tendance des Réservations"
                        subtitle="Volume de demandes sur 6 mois"
                        color="purple"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-white mb-6 uppercase tracking-widest">Gestion Rapide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push('/manager/vehicles')}
                        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/50 hover:bg-white/[0.05] transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-purple-500/10 text-cyan-400 border border-cyan-400/20">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 17h2m10 0h2M7 17c0 1.1-.9 2-2 2s-2-.9-2-2m4 0c0-1.1-.9-2-2-2m4 2h6m4 0c0 1.1-.9 2-2 2s-2-.9-2-2" />
                                    <path d="M3 11l2-7h14l2 7H3z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">Gérer la Flotte</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">Modifier, ajouter ou archiver</span>
                            </div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
