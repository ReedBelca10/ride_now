"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, Plus, X, User as UserIcon, Shield, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'MANAGER' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
    telephone?: string;
    _count?: { reservations: number };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        password: "", // Only for new users
        role: "USER"
    });

    useEffect(() => {
        loadUsers();
    }, [search, roleFilter]);

    const loadUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (roleFilter) params.append("role", roleFilter);

            const response = await apiClient.get<{ users: User[] }>(`/admin/users?${params.toString()}`);
            if (response.success && response.data) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async () => {
        try {
            if (isNewUser) {
                const response = await apiClient.post("/admin/users", formData);
                if (response.success) {
                    setShowModal(false);
                    loadUsers();
                }
            } else if (selectedUser) {
                const response = await apiClient.put(`/admin/users/${selectedUser.id}`, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    telephone: formData.telephone
                });

                if (response.success) {
                    // Check if role improved
                    if (selectedUser.role !== formData.role) {
                        await apiClient.patch(`/admin/users/${selectedUser.id}/role`, { role: formData.role });
                    }
                    setShowModal(false);
                    loadUsers();
                }
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const handleToggleActive = async (userId: number, isActive: boolean) => {
        try {
            // Note: Admin DELETE route usually does soft delete/deactivate. 
            // If we want to toggle back, we might need a specific endpoint or use Update.
            // Assuming DELETE = deactivate for now as per controller analysis.
            // For reactivity, we can use the PUT endpoint if it allows 'isActive' updates.
            // DTO says isActive is optional in UpdateUserDto.
            const response = await apiClient.put(`/admin/users/${userId}`, { isActive: !isActive });
            if (response.success) loadUsers();

        } catch (error) {
            console.error("Erreur activation:", error);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsNewUser(false);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            telephone: user.telephone || "",
            password: "",
            role: user.role
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setSelectedUser(null);
        setIsNewUser(true);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            telephone: "",
            password: "",
            role: "USER"
        });
        setShowModal(true);
    };

    if (loading) return (
        <div className="h-screen bg-[#0B0B15] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0B15] text-white p-6 md:p-10 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
                        Utilisateurs
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Gestion des accès</p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={openNewModal}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0B0B15] px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} />
                    Nouvel Utilisateur
                </motion.button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#121223] p-2 rounded-2xl border border-white/5 w-fit">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none text-white pl-12 pr-4 py-2 focus:ring-0 w-64 placeholder-gray-600"
                    />
                </div>
                <div className="w-px bg-white/10 hidden md:block"></div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent border-none text-gray-300 focus:ring-0 cursor-pointer"
                >
                    <option value="" className="bg-[#121223]">Tous les rôles</option>
                    <option value="USER" className="bg-[#121223]">Utilisateurs</option>
                    <option value="MANAGER" className="bg-[#121223]">Managers</option>
                    <option value="ADMIN" className="bg-[#121223]">Admins</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={user.id}
                        className="bg-[#121223] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                    >
                        {/* Bg Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6 relative">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                                    user.role === 'MANAGER' ? 'bg-pink-500/10 text-pink-400' :
                                        'bg-cyan-500/10 text-cyan-400'
                                    }`}>
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{user.firstName} {user.lastName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${user.role === 'ADMIN' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' :
                                            user.role === 'MANAGER' ? 'border-pink-500/30 text-pink-400 bg-pink-500/10' :
                                                'border-gray-700 text-gray-400 bg-gray-800/50'
                                            }`}>
                                            {user.role}
                                        </span>
                                        {user.isActive ? (
                                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                                <CheckCircle size={10} /> Actif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                                <AlertCircle size={10} /> Inactif
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => openEditModal(user)}
                                className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6 relative">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail size={16} />
                                <span className="truncate">{user.email}</span>
                            </div>
                            {user.telephone && (
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Phone size={16} />
                                    <span>{user.telephone}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 relative">
                            <div className="text-xs text-gray-500">
                                <strong className="text-white">{user._count?.reservations || 0}</strong> réservations
                            </div>
                            <button
                                onClick={() => handleToggleActive(user.id, user.isActive)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${user.isActive
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                            >
                                {user.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                        </div>

                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-[#121223] border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {isNewUser ? "Nouvel Utilisateur" : "Modifier"}
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Prénom</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Téléphone</label>
                                    <input
                                        type="text"
                                        value={formData.telephone}
                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                        className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Rôle</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="USER">Utilisateur</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Administrateur</option>
                                    </select>
                                </div>

                                {isNewUser && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Mot de passe (Temporaire)</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Laisser vide pour défaut: RideNow123!"
                                            className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-[#0B0B15] text-gray-400 hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
