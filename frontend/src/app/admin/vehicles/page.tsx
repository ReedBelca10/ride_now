"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, Plus, X, Car, Info, DollarSign, Calendar, Tag, CheckCircle, AlertOctagon } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    annee: number;
    typeVehicule: string;
    prixParJour: number;
    etat: string;
    image?: string;
    immatriculation: string;
    couleur: string;
    isActive?: boolean;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isNewVehicle, setIsNewVehicle] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [formData, setFormData] = useState({
        marque: "",
        modele: "",
        annee: new Date().getFullYear(),
        typeVehicule: "BERLINE",
        prixParJour: 0,
        immatriculation: "",
        couleur: "",
        etat: "DISPONIBLE",
        image: ""
    });

    useEffect(() => {
        loadVehicles();
    }, [search]);

    const loadVehicles = async () => {
        try {
            const response = await apiClient.get<Vehicle[]>("/vehicles");
            if (response.success) {
                setVehicles(response.data ?? []);
            }
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveVehicle = async () => {
        try {
            if (isNewVehicle) {
                const response = await apiClient.post("/vehicles", formData);
                if (response.success) {
                    setShowModal(false);
                    loadVehicles();
                }
            } else if (selectedVehicle) {
                // Using PATCH here as per backend definition
                const response = await apiClient.patch(`/vehicles/${selectedVehicle.id}`, formData);
                if (response.success) {
                    setShowModal(false);
                    loadVehicles();
                }
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const handleDeleteVehicle = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;
        try {
            const response = await apiClient.delete(`/vehicles/${id}`);
            if (response.success) loadVehicles();
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    };

    const openEditModal = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsNewVehicle(false);
        setFormData({
            marque: vehicle.marque,
            modele: vehicle.modele,
            annee: vehicle.annee,
            typeVehicule: vehicle.typeVehicule,
            prixParJour: vehicle.prixParJour,
            immatriculation: vehicle.immatriculation,
            couleur: vehicle.couleur,
            etat: vehicle.etat,
            image: vehicle.image || ""
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setSelectedVehicle(null);
        setIsNewVehicle(true);
        setFormData({
            marque: "",
            modele: "",
            annee: new Date().getFullYear(),
            typeVehicule: "BERLINE",
            prixParJour: 0,
            immatriculation: "",
            couleur: "",
            etat: "DISPONIBLE",
            image: ""
        });
        setShowModal(true);
    };

    const filteredVehicles = vehicles.filter(v =>
        v.marque.toLowerCase().includes(search.toLowerCase()) ||
        v.modele.toLowerCase().includes(search.toLowerCase())
    );

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
                        Véhicules
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Gestion de la flotte</p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={openNewModal}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
                >
                    <Plus size={20} />
                    Ajouter un véhicule
                </motion.button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-8 bg-[#121223] p-2 rounded-2xl border border-white/5 w-fit">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher marque, modèle..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none text-white pl-12 pr-4 py-2 focus:ring-0 w-64 placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVehicles.map((vehicle) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={vehicle.id}
                        className="bg-[#121223] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group flex flex-col"
                    >
                        {/* Image Area */}
                        <div className="h-48 bg-[#0B0B15] relative group-hover:scale-105 transition-transform duration-500">
                            {vehicle.image ? (
                                <img src={vehicle.image} alt={vehicle.marque} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    <Car size={48} opacity={0.2} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vehicle.etat === 'DISPONIBLE' ? 'bg-emerald-500 text-black' :
                                    vehicle.etat === 'RESERVE' ? 'bg-cyan-500 text-black' :
                                        'bg-red-500 text-white'
                                    }`}>
                                    {vehicle.etat}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="font-bold text-xl text-white mb-1">{vehicle.marque} {vehicle.modele}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-medium">
                                    <span>{vehicle.annee}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span>{vehicle.typeVehicule}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-400 mb-6 font-medium">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-pink-500" />
                                    {vehicle.immatriculation}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: vehicle.couleur }}></div>
                                    {vehicle.couleur}
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-2xl font-bold text-white">
                                    {vehicle.prixParJour}€ <span className="text-xs text-gray-500 font-normal">/jour</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(vehicle)}
                                        className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-[#121223] border border-white/10 w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {isNewVehicle ? "Nouveau Véhicule" : "Modifier le Véhicule"}
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Marque & Modele */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Marque</label>
                                    <input type="text" value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Modèle</label>
                                    <input type="text" value={formData.modele} onChange={(e) => setFormData({ ...formData, modele: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>

                                {/* Annee & Type */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Année</label>
                                    <input type="number" value={formData.annee} onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Type</label>
                                    <select value={formData.typeVehicule} onChange={(e) => setFormData({ ...formData, typeVehicule: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors appearance-none cursor-pointer">
                                        <option value="BERLINE">Berline</option>
                                        <option value="SPORTIVE">Sportive</option>
                                        <option value="SUV">SUV</option>
                                        <option value="CABRIOLET">Cabriolet</option>
                                        <option value="MONOSPACE">Monospace</option>
                                        <option value="COMBI">Combi</option>
                                    </select>
                                </div>

                                {/* Immat & Couleur */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Immatriculation</label>
                                    <input type="text" value={formData.immatriculation} onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Couleur</label>
                                    <input type="text" value={formData.couleur} onChange={(e) => setFormData({ ...formData, couleur: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>

                                {/* Prix & Etat */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Prix / Jour (€)</label>
                                    <input type="number" value={formData.prixParJour} onChange={(e) => setFormData({ ...formData, prixParJour: parseFloat(e.target.value) })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">État</label>
                                    <select value={formData.etat} onChange={(e) => setFormData({ ...formData, etat: e.target.value })} className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors appearance-none cursor-pointer">
                                        <option value="DISPONIBLE">Disponible</option>
                                        <option value="RESERVE">Réservé</option>
                                        <option value="EN_MAINTENANCE">En Maintenance</option>
                                        <option value="INDISPONIBLE">Indisponible</option>
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Image URL</label>
                                    <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="w-full bg-[#0B0B15] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 focus:outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold bg-[#0B0B15] text-gray-400 hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveVehicle}
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
