"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Search,
  DollarSign,
  Fuel,
  Users,
  Gauge,
  Heart,
  Filter,
  ChevronDown,
} from "lucide-react";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuel: string;
  transmission: string;
  seats: number;
  color: string;
  mileage: number;
  pricePerDay: number;
  description: string;
  status: string;
}

export default function VehiclesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("TOUS");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedFilters, setExpandedFilters] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchVehicles();
  }, [isAuthenticated, router]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vehicles");
      if (response.success && response.data) {
        setVehicles(response.data as Vehicle[]);
        setFilteredVehicles(response.data as Vehicle[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des véhicules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = vehicles;

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(
        (v) =>
          v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (selectedType !== "TOUS") {
      result = result.filter((v) => v.type === selectedType);
    }

    // Filtre par prix
    result = result.filter(
      (v) => v.pricePerDay >= priceRange[0] && v.pricePerDay <= priceRange[1]
    );

    setFilteredVehicles(result);
  }, [searchTerm, selectedType, priceRange, vehicles]);

  const toggleFavorite = (vehicleId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(vehicleId)) {
      newFavorites.delete(vehicleId);
    } else {
      newFavorites.add(vehicleId);
    }
    setFavorites(newFavorites);
  };

  const handleReserve = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}/reserve`);
  };

  const vehicleTypes = ["TOUS", "BERLINE", "SPORTIVE", "SUV", "CABRIOLET", "MONOSPACE", "COMBI"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="relative pt-24 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-7xl md:text-8xl font-extralight tracking-tighter text-white mb-4">
              Découvrez notre collection
            </h1>
            <p className="text-zinc-400 text-lg">
              {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? "s" : ""} disponible{filteredVehicles.length > 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            {/* Main Search Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  type="text"
                  placeholder="Chercher une marque ou modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none transition-all hover:bg-white/10 focus:bg-white/10 focus:border-white/20"
                />
              </div>

              <button
                onClick={() => setExpandedFilters(!expandedFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all"
              >
                <Filter size={20} />
                <span>Filtres</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${expandedFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Expanded Filters */}
            {expandedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-6 bg-white/[0.02] border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Type de véhicule</label>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-2 rounded text-sm font-semibold transition-all ${
                            selectedType === type
                              ? "bg-white text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">
                      Prix par jour: {priceRange[0]} € - {priceRange[1]} €
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">Dates de réservation</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white outline-none"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Vehicles Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-zinc-400">Chargement des véhicules...</div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">
                Aucun véhicule ne correspond à vos critères
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  variants={itemVariants}
                  className="group relative border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent" />
                    <Gauge className="text-zinc-700 group-hover:text-zinc-500" size={48} />

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(vehicle.id)}
                      className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all"
                    >
                      <Heart
                        size={20}
                        className={favorites.has(vehicle.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
                      {vehicle.status === "DISPONIBLE" ? "✓ Disponible" : "❌ Indisponible"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Brand & Model */}
                    <div className="mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-zinc-500 text-sm">{vehicle.year}</p>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{vehicle.description}</p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Fuel size={16} />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Users size={16} />
                        <span>{vehicle.seats} places</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <DollarSign size={16} />
                        <span className="font-bold">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Gauge size={16} />
                        <span>{vehicle.mileage} km</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">
                          €{vehicle.pricePerDay}
                        </p>
                        <p className="text-zinc-500 text-xs">par jour</p>
                      </div>

                      <button
                        onClick={() => handleReserve(vehicle.id)}
                        disabled={vehicle.status !== "DISPONIBLE"}
                        className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-zinc-100 disabled:bg-zinc-700 disabled:text-zinc-500 transition-all"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
