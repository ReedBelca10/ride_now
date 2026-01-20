"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Car, BarChart3, Settings, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Utilisateurs", href: "/admin/users" },
    { icon: Car, label: "Véhicules", href: "/admin/vehicles" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="fixed left-0 top-0 h-screen w-72 bg-zinc-950 border-r border-zinc-800/50 flex flex-col z-50"
        >
            {/* Solid background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

            {/* Logo */}
            <div className="relative p-6 border-b border-zinc-800/50">
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                    <motion.div
                        className="relative p-2.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <ShieldCheck size={24} className="text-white" strokeWidth={2.5} />
                        <motion.div
                            className="absolute inset-0 rounded-2xl bg-white/20"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-white font-bold text-xl tracking-tight">RideNow</h1>
                        <div className="flex items-center gap-1.5">
                            <Sparkles size={12} className="text-purple-400" />
                            <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Admin Panel</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                className={`
                                    relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden
                                    ${isActive
                                        ? "text-white"
                                        : "text-zinc-400 hover:text-white"
                                    }
                                `}
                            >
                                {/* Active background with gradient */}
                                {isActive && (
                                    <>
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.5, 0.8, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </>
                                )}

                                {/* Hover background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-zinc-800/0 group-hover:bg-zinc-800/50 rounded-2xl transition-colors duration-300" />
                                )}

                                {/* Icon */}
                                <motion.div
                                    className="relative z-10"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <item.icon size={20} strokeWidth={2} />
                                </motion.div>

                                {/* Label */}
                                <span className="relative z-10 text-sm font-semibold tracking-wide">{item.label}</span>

                                {/* Shine effect */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            repeatDelay: 1
                                        }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="relative p-4 border-t border-zinc-800/50">
                <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-zinc-400 hover:text-white bg-zinc-800/0 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
                >
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LogOut size={20} strokeWidth={2} className="group-hover:text-red-400 transition-colors" />
                    </motion.div>
                    <span className="text-sm font-semibold tracking-wide group-hover:text-red-400 transition-colors">Déconnexion</span>
                </motion.button>
            </div>
        </motion.aside>
    );
}
