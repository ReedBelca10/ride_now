"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Car, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

// --- Interfaces ---
interface Analytics {
    totalUsers: number;
    totalVehicles: number;
    totalReservations: number;
    activeReservations: number;
}

interface MonthData {
    month: string;
    count: number;
}

interface VehicleTypeData {
    type: string;
    count: number;
}

// --- Icons ---
const EmployeesIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

// --- Charts ---
function WavyChart({ data, color = "#10b981" }: { data: MonthData[], color?: string }) {
    if (!data.length) return null;
    const values = data.map(d => d.count);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * 100;
        const y = 100 - ((v - min) / (max - min || 1)) * 70;
        return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cp1x = prev.x + (curr.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (curr.x - prev.x) / 2;
        const cp2y = curr.y;
        d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
    }

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <motion.path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
        </svg>
    );
}

function MiniAreaChart() {
    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-20">
            <path d="M0 100 L0 60 Q25 30 50 60 T100 40 L100 100 Z" fill="url(#grad)" />
            <defs>
                <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00E0FF" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [userGrowth, setUserGrowth] = useState<MonthData[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [global, growth, vehicles] = await Promise.all([
                    apiClient.get<Analytics>("/admin/analytics"),
                    apiClient.get<MonthData[]>("/admin/analytics/users"),
                    apiClient.get<VehicleTypeData[]>("/admin/analytics/vehicles"),
                ]);

                if (global.success) setAnalytics(global.data || null);
                if (growth.success) setUserGrowth(growth.data || []);
                if (vehicles.success) setVehicleTypes(vehicles.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-screen bg-[#0B0B15] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-cyan-400 text-sm">Chargement...</p>
            </div>
        </div>
    );

    const availableRes = (analytics?.totalVehicles || 0) - (analytics?.activeReservations || 0);

    return (
        <div className="h-screen bg-[#0B0B15] text-white flex flex-col font-sans overflow-hidden">
            {/* Top Header - with generous padding */}
            <div className="px-10 py-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">Dashboard</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">Vue d'ensemble de votre plateforme</p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-emerald-400 font-semibold">Système opérationnel</span>
                </div>
            </div>

            {/* Main Content Grid with generous gaps */}
            <div className="flex-1 min-h-0 px-10 pb-10 grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* --- LEFT COLUMN (Span 4) --- */}
                <div className="xl:col-span-4 flex flex-col gap-8 h-full">

                    {/* Card: EMPLOYÉS - Clean and spacious */}
                    <div className="bg-[#121223] rounded-3xl p-10 flex flex-col justify-center h-[38%]">
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.25em] mb-6">Employés</h3>
                        </div>

                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl"></div>
                                <EmployeesIcon className="w-24 h-24 text-cyan-400 relative" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-7xl font-bold text-white mb-4 tracking-tight">{analytics?.totalUsers}</h2>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">Employés</p>
                        </div>
                    </div>

                    {/* Card: ACTIONS & TOTAL - More breathing room */}
                    <div className="bg-[#121223] rounded-3xl p-10 flex flex-col h-[62%]">

                        {/* Actions Section */}
                        <div className="mb-auto">
                            <h3 className="text-xl font-bold text-white mb-8">Actions Rapides</h3>
                            <div className="space-y-5">
                                <a href="/admin/users" className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                                            <Users size={20} className="text-cyan-400" />
                                        </div>
                                        <span className="text-base text-gray-300 group-hover:text-white font-medium">Gerer Utilisateurs</span>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-600 group-hover:text-cyan-400" />
                                </a>
                                <a href="/admin/vehicles" className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-pink-500/10 rounded-xl">
                                            <Car size={20} className="text-pink-400" />
                                        </div>
                                        <span className="text-base text-gray-300 group-hover:text-white font-medium">Gerer Véhicules</span>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-600 group-hover:text-pink-400" />
                                </a>
                            </div>
                        </div>

                        {/* Total Reservations Section with chart background */}
                        <div className="mt-12 pt-10 border-t border-white/5 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-28 -mb-10 pointer-events-none">
                                <MiniAreaChart />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-2">Total Réservations</h3>
                                <p className="text-sm text-gray-500 mb-6">Global plateforme</p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-6xl font-bold text-white">{analytics?.totalReservations}</h2>
                                    <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full mb-2">+5%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN (Span 8) --- */}
                <div className="xl:col-span-8 flex flex-col gap-8 h-full">

                    {/* Top Row: Active and Available Reservations */}
                    <div className="grid grid-cols-2 gap-8 h-[32%]">
                        {/* Active */}
                        <div className="bg-[#121223] rounded-3xl p-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.25em]">Réservations Actives</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 text-lg font-bold">+15%</span>
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-7xl font-bold text-white mb-6">{analytics?.activeReservations}</h2>
                                <div className="space-y-3">
                                    <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
                                        <span className="text-sm text-cyan-400 font-bold">Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available */}
                        <div className="bg-[#121223] rounded-3xl p-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.25em]">Réservations Disponibles</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 text-lg font-bold">+5%</span>
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-7xl font-bold text-white">{availableRes}</h2>
                        </div>
                    </div>

                    {/* Bottom Row: Charts */}
                    <div className="grid grid-cols-2 gap-8 h-[68%]">

                        {/* Croissance */}
                        <div className="bg-[#121223] rounded-3xl p-10 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-3">Croissance Utilisateurs</h3>
                                <p className="text-sm text-gray-500">Historique sur les 6 derniers mois</p>
                            </div>
                            <div className="flex-1 min-h-0 mb-6">
                                <WavyChart data={userGrowth} color="#10b981" />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-bold text-emerald-400">+12%</span>
                            </div>
                        </div>

                        {/* Répartition */}
                        <div className="bg-[#121223] rounded-3xl p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3">Répartition Véhicules</h3>
                                    <p className="text-sm text-gray-500">Flotte actuelle</p>
                                </div>
                                <div className="p-3 bg-pink-500/10 rounded-2xl">
                                    <Car size={28} className="text-pink-500" />
                                </div>
                            </div>

                            {/* Scrollable vehicle list */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                {vehicleTypes.length > 0 ? vehicleTypes.map((t, i) => (
                                    <div key={i} className="flex justify-between items-center px-5 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${['bg-pink-500', 'bg-cyan-500', 'bg-emerald-500'][i % 3]}`}></div>
                                            <span className="text-gray-200 font-medium text-base">{t.type}</span>
                                        </div>
                                        <span className="font-bold text-white text-xl">{t.count}</span>
                                    </div>
                                )) : (
                                    <div className="text-gray-600 text-sm text-center py-4">Aucun véhicule</div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
