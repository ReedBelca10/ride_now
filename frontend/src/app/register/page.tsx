"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";


function RegisterContent() {
    const router = useRouter();
    const { register, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        try {
            await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
            setSuccess(true);
            // Redirect will happen when user state is updated
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            setLoading(false);
        }
    };

    // Redirect after successful registration (when user is set and success is true)
    if (user && success) {
        setTimeout(() => {
            if (user.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/vehicles");
            }
        }, 1500);
    }

    const inputStyle = {
        width: "100%",
        padding: "0.75rem 1rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        borderRadius: "var(--radius-md)",
        outline: "none",
        transition: "all 0.2s",
        fontSize: "0.9rem",
        opacity: loading || success ? 0.5 : 1
    };

    const labelStyle = {
        fontSize: "0.7rem",
        fontWeight: 600,
        color: "var(--text-secondary)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em"
    };

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
                            left: 0,
                            width: "24rem",
                            height: "24rem",
                            background: "rgba(22, 163, 74, 0.1)",
                            borderRadius: "50%",
                            filter: "blur(80px)"
                        }} />
                        <div style={{
                            position: "absolute",
                            bottom: "-5rem",
                            right: 0,
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
                        padding: "3rem",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}>
                        {/* Header */}
                        <div style={{ marginBottom: "3rem" }}>
                            <h1 style={{
                                fontSize: "3rem",
                                fontWeight: 700,
                                marginBottom: "1rem",
                                letterSpacing: "-0.025em",
                                color: "var(--text-primary)"
                            }}>
                                S&apos;inscrire
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
                                Rejoignez la plateforme de gestion de flotte
                            </p>
                        </div>

                        {/* Messages */}
                        <AnimatePresence>
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
                            {success && (
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
                                    <span style={{ fontWeight: 500 }}>Inscription réussie ! Redirection en cours...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Firstname & Lastname */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <label style={labelStyle}>Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={loading || success}
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="John"
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <label style={labelStyle}>Nom</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={loading || success}
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Doe"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    required
                                    disabled={loading || success}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="vous@exemple.com"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Passwords */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <label style={labelStyle}>Mot de passe</label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            style={{ ...inputStyle, paddingRight: "3rem" }}
                                        />
                                        <button
                                            type="button"
                                            disabled={loading || success}
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
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <label style={labelStyle}>Confirmer</label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            style={{ ...inputStyle, paddingRight: "3rem" }}
                                        />
                                        <button
                                            type="button"
                                            disabled={loading || success}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={!loading && !success ? { scale: 1.02 } : {}}
                                whileTap={!loading && !success ? { scale: 0.98 } : {}}
                                type="submit"
                                disabled={loading || success}
                                style={{
                                    width: "100%",
                                    marginTop: "1.5rem",
                                    padding: "1rem 1.5rem",
                                    background: success ? "var(--success)" : "var(--primary)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    fontSize: "0.875rem",
                                    letterSpacing: "0.1em",
                                    borderRadius: "var(--radius-md)",
                                    border: "none",
                                    cursor: loading || success ? "not-allowed" : "pointer",
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
                                        <span>Inscription en cours...</span>
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Inscription réussie!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>S&apos;inscrire</span>
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
                                Déjà membre ?{" "}
                                <Link href="/login" style={{
                                    color: "var(--success)",
                                    fontWeight: 700,
                                    textDecoration: "none"
                                }}>
                                    Se connecter
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
                    border-color: var(--success) !important;
                    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
                }
                input::placeholder {
                    color: var(--text-tertiary);
                }
            `}</style>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 style={{ color: "var(--text-primary)", animation: "spin 1s linear infinite" }} size={32} />
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
