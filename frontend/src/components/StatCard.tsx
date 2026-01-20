"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    index?: number;
    variant?: 'cyan' | 'magenta' | 'purple';
}

const variantStyles = {
    cyan: {
        gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
        borderGlow: "shadow-[0_0_20px_rgba(0,217,255,0.3)]",
        hoverBorder: "hover:border-cyan-500/50",
    },
    magenta: {
        gradient: "from-pink-500/20 via-pink-400/10 to-transparent",
        iconBg: "bg-pink-500/10",
        iconColor: "text-pink-400",
        borderGlow: "shadow-[0_0_20px_rgba(255,0,110,0.3)]",
        hoverBorder: "hover:border-pink-500/50",
    },
    purple: {
        gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
        borderGlow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        hoverBorder: "hover:border-purple-500/50",
    },
};

export default function StatCard({ label, value, icon: Icon, trend, index = 0, variant = 'cyan' }: StatCardProps) {
    const style = variantStyles[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            className="relative overflow-hidden group cursor-pointer"
        >
            {/* Dark background */}
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" />

            {/* Vibrant gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Border with glow effect */}
            <div className={`absolute inset-0 rounded-2xl border border-zinc-800/80 ${style.hoverBorder} transition-all duration-300 group-hover:${style.borderGlow}`} />

            {/* Content */}
            <div className="relative p-6 rounded-2xl">
                {/* Icon and Trend */}
                <div className="flex justify-between items-start mb-6">
                    <motion.div
                        className={`p-3 rounded-xl ${style.iconBg} ${style.iconColor} group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        <Icon size={32} strokeWidth={1.5} />
                    </motion.div>

                    {trend && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${trend.isPositive
                                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                                    : 'bg-red-500/10 border border-red-500/30'
                                }`}
                        >
                            {trend.isPositive ? (
                                <TrendingUp size={14} className="text-emerald-400" />
                            ) : (
                                <TrendingDown size={14} className="text-red-400" />
                            )}
                            <span className={`text-xs font-bold ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Label */}
                <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mb-2 font-bold">
                    {label}
                </p>

                {/* Value */}
                <motion.h3
                    className="text-6xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                >
                    {value}
                </motion.h3>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
            </div>
        </motion.div>
    );
}
