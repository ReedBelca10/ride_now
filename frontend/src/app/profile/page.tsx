"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  User,
  Plus,
  Globe,
  Check,
  AlertCircle,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username?: string;
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Wait for auth context to finish loading before checking authentication
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [isAuthenticated, authLoading, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/auth/profile");
      if (response.success && response.data) {
        setUser(response.data as UserProfile);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleRefresh = () => {
    fetchProfile();
    setMessage({ type: "success", text: "Profil rafraîchi" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Show loading while auth is loading or while fetching profile
  if (authLoading || loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "8rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "2.5rem",
              height: "2.5rem",
              border: "4px solid var(--primary)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <div style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Chargement du profil...</div>
          </div>
        </div>
      </main>
    );
  }

  // If not authenticated after loading is complete, don't render (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text-primary)" }}>
      <Navbar />

      <div className="container" style={{ maxWidth: "72rem", paddingTop: "7rem", paddingBottom: "5rem" }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
          gap: "1rem"
        }}>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--text-primary)"
          }}>
            Mon profil
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s"
            }}>
              Mes favoris
            </button>
            <button
              onClick={handleRefresh}
              style={{
                padding: "0.5rem 1.25rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Rafraîchir
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1.25rem",
                background: "#dc2626",
                color: "#fff",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s"
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                border: message.type === "success" ? "1px solid rgba(22, 163, 74, 0.3)" : "1px solid rgba(220, 38, 38, 0.3)",
                background: message.type === "success" ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)",
                color: message.type === "success" ? "var(--success)" : "var(--error)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
            >
              {message.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem"
        }} className="profile-grid">
          {/* Sidebar / Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ gridColumn: "span 1" }}
            className="profile-sidebar"
          >
            <div style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "8rem",
                  height: "8rem",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #0d2340 50%, #0a4d4a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid var(--surface)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  position: "relative"
                }}>
                  <Globe style={{
                    color: "rgba(255, 255, 255, 0.3)",
                    width: "5rem",
                    height: "5rem",
                    position: "absolute"
                  }} strokeWidth={0.5} />
                  <div style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <User size={64} style={{ color: "rgba(255, 255, 255, 0.9)" }} />
                  </div>
                </div>
                <button style={{
                  position: "absolute",
                  bottom: "0.25rem",
                  right: "0.25rem",
                  width: "2rem",
                  height: "2rem",
                  background: "var(--primary)",
                  border: "2px solid var(--surface)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}>
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.25rem"
              }}>
                {user?.firstName || 'Admin'}
              </h2>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                marginBottom: "1.5rem"
              }}>
                {user?.username || user?.role?.toLowerCase() || 'admin'}
              </p>

              <div style={{
                width: "100%",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{
                    fontSize: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    color: "var(--text-tertiary)"
                  }}>Adresse e-mail</span>
                  <span style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--primary)"
                  }}>
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content / Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ gridColumn: "span 1" }}
            className="profile-main"
          >
            <div style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              padding: "2.5rem",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem"
                }}>Informations personnelles</h3>
                <p style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem"
                }}>Gérez vos informations de compte et préférences.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", flex: 1 }}>
                <div>
                  <label style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "0.5rem"
                  }}>Nom complet</label>
                  <p style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)"
                  }}>
                    {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "0.5rem"
                  }}>E-mail</label>
                  <p style={{
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    color: "var(--text-primary)"
                  }}>
                    {user?.email}
                  </p>
                </div>

                <div>
                  <label style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "0.5rem"
                  }}>Rôle</label>
                  <p style={{
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    textTransform: "lowercase"
                  }}>
                    {user?.role || 'admin'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => router.push('/vehicles')}
                  style={{
                    padding: "0.75rem 2rem",
                    background: "var(--primary)",
                    color: "#fff",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)"
                  }}
                >
                  Nouvelle réservation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr 2fr !important;
          }
          .profile-sidebar {
            grid-column: span 1 !important;
          }
          .profile-main {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
