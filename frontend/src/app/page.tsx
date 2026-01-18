import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar />
      <Hero />

      {/* Section Véhicules en Vedette - À implémenter avec des données dynamiques */}
      <section className="container" style={{ padding: "4rem 1.5rem" }}>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: "var(--text-primary)"
        }}>
          Véhicules en Vedette
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          color: "var(--text-secondary)"
        }}>
          {/* We will populate this later */}
          <div style={{
            background: "var(--surface)",
            height: "400px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border)"
          }}>
            <p>Collection de véhicules bientôt disponible</p>
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
            <p>Collection de véhicules bientôt disponible</p>
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
            <p>Collection de véhicules bientôt disponible</p>
          </div>
        </div>
      </section>

      <footer style={{
        background: "var(--surface)",
        padding: "4rem 1.5rem",
        marginTop: "4rem",
        borderTop: "1px solid var(--border)"
      }}>
        <div className="container" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <p>&copy; 2026 RideNow. Par ReedBelca.</p>
        </div>
      </footer>
    </main>
  );
}
