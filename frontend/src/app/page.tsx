"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <Hero />

      {/* Section Flotte de Service */}
      <section className="container" style={{ padding: "4rem 1.5rem" }}>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: "var(--text-primary)"
        }}>
          Flotte de Service
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          color: "var(--text-secondary)"
        }}>
          <div style={{
            background: "var(--surface)",
            height: "400px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
          }}>
            <p>Liste des véhicules disponibles prochainement</p>
          </div>
          <div style={{
            background: "var(--surface)",
            height: "400px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
          }}>
            <p>Liste des véhicules disponibles prochainement</p>
          </div>
          <div style={{
            background: "var(--surface)",
            height: "400px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
          }}>
            <p>Liste des véhicules disponibles prochainement</p>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section style={{
        background: "var(--surface)",
        padding: "4rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid var(--border)"
      }}>
        <div className="container">
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "2rem",
            color: "var(--text-primary)"
          }}>
            Pourquoi utiliser RideNow ?
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            RideNow simplifie la gestion de vos déplacements professionnels. Organisez vos missions en réservant un véhicule adapté en quelques secondes, tout en garantissant la disponibilité et le suivi de la flotte.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--surface)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        color: "var(--text-secondary)"
      }}>
        <p>&copy; 2026 RideNow. Par ReedBelca.</p>
      </footer>
    </main>
  );
}
