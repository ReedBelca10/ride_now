"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Mail, AlertCircle, CheckCircle, Loader2, ArrowRight } from "lucide-react";

function ForgotPasswordContent() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email) {
            setError("L'email est requis");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Une erreur est survenue");
            }

            setSuccess(true);
            setEmail("");
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "0.75rem 1rem",
        paddingLeft: "3rem",
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
                            right: 0,
                            width: "24rem",
                            height: "24rem",
                            background: "rgba(249, 115, 22, 0.1)",
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
                                Récupérer
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                                Entrez votre email pour réinitialiser votre mot de passe
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
                                    <span style={{ fontWeight: 500 }}>
                                        Vérifiez votre email pour le lien de réinitialisation
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Email */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={labelStyle}>Email</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="email"
                                        required
                                        disabled={loading || success}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        style={inputStyle}
                                    />
                                    <Mail size={20} style={{
                                        position: "absolute",
                                        left: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--text-tertiary)"
                                    }} />
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
                                    background: success ? "var(--success)" : "#f97316",
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
                                    boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)",
                                    transition: "all 0.2s"
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                        <span>Envoi en cours...</span>
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Email envoyé!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Envoyer le lien</span>
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
                                Vous vous souvenez de votre mot de passe ?{" "}
                                <Link href="/login" style={{
                                    color: "#f97316",
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
                    border-color: #f97316 !important;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
                }
                input::placeholder {
                    color: var(--text-tertiary);
                }
            `}</style>
        </main>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 style={{ color: "var(--text-primary)", animation: "spin 1s linear infinite" }} size={32} />
            </div>
        }>
            <ForgotPasswordContent />
        </Suspense>
    );
}
