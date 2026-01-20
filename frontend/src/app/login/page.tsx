"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ArrowRight } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user } = useAuth();
    const registered = searchParams.get("registered");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(formData.email, formData.password);
            // Login successful, redirect will happen based on user role
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            setLoading(false);
        }
    };

    // Redirect after successful login (when user is set)
    if (user) {
        if (user.role === "ADMIN") {
            router.push("/admin/dashboard");
        } else {
            router.push("/vehicles");
        }
        return null;
    }

    return (
        <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text-primary)" }}>
            <Navbar />

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "1rem",
                paddingTop: "100px"
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ width: "100%", maxWidth: "28rem", position: "relative" }}
                >
                    {/* Background effects */}
                    <div style={{ position: "absolute", inset: "-5rem", pointerEvents: "none" }}>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "24rem",
                            height: "24rem",
                            background: "rgba(79, 70, 229, 0.1)",
                            borderRadius: "50%",
                            filter: "blur(80px)"
                        }} />
                        <div style={{
                            position: "absolute",
                            bottom: "-5rem",
                            left: "-5rem",
                            width: "18rem",
                            height: "18rem",
                            background: "rgba(100, 100, 100, 0.1)",
                            borderRadius: "50%",
                            filter: "blur(80px)"
                        }} />
                    </div>

                    {/* Container */}
                    <div style={{
                        position: "relative",
                        zIndex: 10,
                        background: "var(--surface)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "2rem",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}>
                        {/* Header */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h1 style={{
                                fontSize: "2.5rem",
                                fontWeight: 700,
                                marginBottom: "0.5rem",
                                letterSpacing: "-0.025em",
                                color: "var(--text-primary)"
                            }}>
                                Connexion
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                                Accédez à votre espace de gestion de flotte
                            </p>
                        </div>

                        {/* Messages */}
                        <AnimatePresence>
                            {registered && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        marginBottom: "2rem",
                                        padding: "1rem",
                                        border: "1px solid rgba(22, 163, 74, 0.3)",
                                        background: "rgba(22, 163, 74, 0.1)",
                                        borderRadius: "var(--radius-md)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        color: "var(--success)",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    <CheckCircle size={18} style={{ flexShrink: 0 }} />
                                    <span style={{ fontWeight: 500 }}>Inscription réussie! Connectez-vous maintenant.</span>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        marginBottom: "2rem",
                                        padding: "1rem",
                                        border: "1px solid rgba(220, 38, 38, 0.3)",
                                        background: "rgba(220, 38, 38, 0.1)",
                                        borderRadius: "var(--radius-md)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        color: "var(--error)",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                    <span style={{ fontWeight: 500 }}>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="vous@exemple.com"
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem 1rem",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-primary)",
                                        borderRadius: "var(--radius-md)",
                                        outline: "none",
                                        transition: "all 0.2s",
                                        fontSize: "0.9rem"
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        color: "var(--text-secondary)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em"
                                    }}>
                                        Mot de passe
                                    </label>
                                    <Link href="/forgot-password" style={{
                                        fontSize: "0.7rem",
                                        color: "var(--text-tertiary)",
                                        fontWeight: 500,
                                        textDecoration: "none",
                                        transition: "color 0.2s"
                                    }}>
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 2.5rem 0.75rem 1rem",
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-primary)",
                                            borderRadius: "var(--radius-md)",
                                            outline: "none",
                                            transition: "all 0.2s",
                                            fontSize: "0.9rem"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            right: "1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--text-tertiary)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "0.25rem"
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    marginTop: "1.5rem",
                                    padding: "1rem 1.5rem",
                                    background: "var(--primary)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    fontSize: "0.875rem",
                                    letterSpacing: "0.1em",
                                    borderRadius: "var(--radius-md)",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.5 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.75rem",
                                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                                    transition: "all 0.2s"
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                        <span>Connexion en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Se connecter</span>
                                        <ArrowRight size={20} strokeWidth={2.5} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <div style={{
                            marginTop: "3rem",
                            paddingTop: "2rem",
                            borderTop: "1px solid var(--border)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                Pas encore membre ?{" "}
                                <Link href="/register" style={{
                                    color: "var(--primary)",
                                    fontWeight: 700,
                                    textDecoration: "none"
                                }}>
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                input:focus {
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
                }
                input::placeholder {
                    color: var(--text-tertiary);
                }
            `}</style>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 style={{ color: "var(--text-primary)", animation: "spin 1s linear infinite" }} size={32} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
