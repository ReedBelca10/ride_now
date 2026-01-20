"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VehicleCard, { Vehicle } from "@/components/VehicleCard";
import ReservationModal from "@/components/ReservationModal";
import { getAllVehicles } from "@/lib/vehicle-api";
import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getAllVehicles(0, 3);
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load vehicles", error);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <Hero />

      {/* Section Flotte de Service */}
      <section style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem"
          }}>
            <div>
              <h2 style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "1rem"
              }}>
                Flotte de <span style={{ color: "var(--primary)" }}>Service</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                Découvrez nos véhicules les plus populaires disponibles immédiatement.
              </p>
            </div>
            <Link href="/vehicles" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary)",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "1rem",
              transition: "all 0.2s"
            }} className="hover-link">
              Voir toute la flotte <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: "var(--text-secondary)" }}>Chargement des véhicules...</p>
            </div>
          ) : (
            <div>
              <div className="vehicles-grid">
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      index={index}
                      onReserve={(v) => setSelectedVehicle(v)}
                    />
                  ))
                ) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--text-tertiary)" }}>
                    <Car size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                    <p>Aucun véhicule disponible pour le moment.</p>
                  </div>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "4rem" }}>
                <Link href="/vehicles" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem 2.5rem",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  borderRadius: "var(--radius-full)",
                  fontWeight: "700",
                  fontSize: "1rem",
                  border: "1px solid var(--border)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }} className="explorer-btn">
                  Explorer plus de véhicules <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section À propos */}
      <section style={{
        background: "var(--surface)",
        padding: "6rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid var(--border)"
      }}>
        <div className="container">
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "1.5rem",
            color: "var(--text-primary)"
          }}>
            Pourquoi utiliser <span style={{ color: "var(--primary)" }}>RideNow</span> ?
          </h2>
          <p style={{
            fontSize: "1.2rem",
            color: "var(--text-secondary)",
            lineHeight: "1.8",
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            RideNow simplifie la gestion de vos déplacements professionnels. Organisez vos missions en réservant un véhicule adapté en quelques secondes, tout en garantissant la disponibilité et le suivi de la flotte.
          </p>
        </div>
      </section>

      <style jsx>{`
        .vehicles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .vehicles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .vehicles-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .hover-link:hover {
          gap: 0.75rem !important;
          color: var(--primary-hover) !important;
        }
        .explorer-btn:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 15px 40px rgba(0, 212, 255, 0.2);
          background: var(--surface-hover);
        }
      `}</style>

      {/* Footer */}
      <footer style={{
        background: "var(--surface)",
        padding: "3rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        color: "var(--text-secondary)"
      }}>
        <p>&copy; 2026 RideNow. Par ReedBelca.</p>
      </footer>

      {selectedVehicle && (
        <ReservationModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onSuccess={() => { }}
        />
      )}
    </main>
  );
}
