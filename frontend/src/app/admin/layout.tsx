"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "ADMIN") {
                router.push("/");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Animated background gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-t from-pink-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <AdminSidebar />
            <main className="min-h-screen relative z-10" style={{ marginLeft: '288px' }}>
                {children}
            </main>
        </div>
    );
}
