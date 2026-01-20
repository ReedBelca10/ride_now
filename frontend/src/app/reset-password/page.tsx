"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ArrowRight } from "lucide-react";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!token) {
            setError("Token invalide. Veuillez cliquer sur le lien dans votre email");
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    newPassword: formData.newPassword,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Une erreur est survenue");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
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
        paddingRight: "3rem",
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
                            background: "rgba(59, 130, 246, 0.1)",
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
                                Réinitialiser
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                                Créez un nouveau mot de passe sécurisé
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
                                        Mot de passe réinitialisé! Redirection vers la connexion...
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        {token ? (
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {/* New Password */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <label style={labelStyle}>Nouveau mot de passe</label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            style={inputStyle}
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

                                {/* Confirm Password */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <label style={labelStyle}>Confirmer le mot de passe</label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            disabled={loading || success}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            style={inputStyle}
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
                                        background: success ? "var(--success)" : "#3b82f6",
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
                                        boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                            <span>Réinitialisation en cours...</span>
                                        </>
                                    ) : success ? (
                                        <>
                                            <CheckCircle size={20} />
                                            <span>Réinitialisé!</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Réinitialiser</span>
                                            <ArrowRight size={20} strokeWidth={2.5} />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
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
                                    <span style={{ fontWeight: 500 }}>
                                        Lien invalide. Veuillez demander un nouveau lien de réinitialisation.
                                    </span>
                                </motion.div>
                                <Link
                                    href="/forgot-password"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "1rem 1.5rem",
                                        background: "#f97316",
                                        color: "#fff",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        fontSize: "0.875rem",
                                        letterSpacing: "0.1em",
                                        borderRadius: "var(--radius-md)",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    Demander un nouveau lien
                                </Link>
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{
                            marginTop: "3rem",
                            paddingTop: "2rem",
                            borderTop: "1px solid var(--border)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                Revenir à la{" "}
                                <Link href="/login" style={{
                                    color: "#3b82f6",
                                    fontWeight: 700,
                                    textDecoration: "none"
                                }}>
                                    connexion
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
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
                input::placeholder {
                    color: var(--text-tertiary);
                }
            `}</style>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 style={{ color: "var(--text-primary)", animation: "spin 1s linear infinite" }} size={32} />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
