"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Menu, X, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

interface UserData {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: string;
}

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setDropdownOpen(false);
        router.push("/");
    };

    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.inner}>
                    <Link href="/" className={styles.logo}>
                        <Car className={styles.logoIcon} />
                        <span>RideNow</span>
                    </Link>

                    <div className={styles.desktopMenu}>
                        <Link href="/vehicles" className={styles.link}>
                            Notre Flotte
                        </Link>
                        <Link href="/about" className={styles.link}>
                            Missions
                        </Link>
                        <Link href="/services" className={styles.link}>
                            Support
                        </Link>
                    </div>

                    <div className={styles.actions}>
                        {user ? (
                            <div ref={dropdownRef} style={{ position: "relative" }}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={styles.profileLink}
                                    style={{ cursor: "pointer", background: "none", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                                >
                                    {user.profilePicture ? (
                                        <Image src={user.profilePicture} alt="Avatar" width={24} height={24} className={styles.avatarMini} />
                                    ) : (
                                        <User size={14} style={{ color: "var(--text-tertiary)" }} />
                                    )}
                                    <span className={styles.nameMini}>{user.firstName}</span>
                                    <ChevronDown
                                        size={12}
                                        style={{
                                            color: "var(--text-tertiary)",
                                            transition: "transform 0.2s",
                                            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)"
                                        }}
                                    />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 0.5rem)",
                                                right: 0,
                                                minWidth: "180px",
                                                background: "var(--surface)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "var(--radius-md)",
                                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
                                                overflow: "hidden",
                                                zIndex: 1001
                                            }}
                                        >
                                            <Link
                                                href="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.75rem",
                                                    padding: "0.875rem 1rem",
                                                    color: "var(--text-primary)",
                                                    fontSize: "0.875rem",
                                                    fontWeight: 500,
                                                    transition: "background 0.2s",
                                                    textDecoration: "none"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <User size={16} style={{ color: "var(--text-secondary)" }} />
                                                Mon Profil
                                            </Link>
                                            {user.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setDropdownOpen(false)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.75rem",
                                                        padding: "0.875rem 1rem",
                                                        color: "var(--text-primary)",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 500,
                                                        transition: "background 0.2s",
                                                        textDecoration: "none"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                                >
                                                    <ShieldCheck size={16} style={{ color: "var(--text-secondary)" }} />
                                                    Administration
                                                </Link>
                                            )}
                                            <div style={{ height: "1px", background: "var(--border)" }} />
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.75rem",
                                                    padding: "0.875rem 1rem",
                                                    color: "#ef4444",
                                                    fontSize: "0.875rem",
                                                    fontWeight: 500,
                                                    width: "100%",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s",
                                                    textAlign: "left"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <LogOut size={16} />
                                                Déconnexion
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className={styles.loginBtn}>
                                    Connexion
                                </Link>
                                <Link href="/register" className="btn btn-primary">
                                    S&apos;inscrire
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={styles.mobileMenu}
                    >
                        <Link href="/vehicles" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                            Véhicules
                        </Link>
                        <Link href="/about" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                            À propos
                        </Link>
                        <Link href="/services" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                            Services
                        </Link>
                        <div className={styles.mobileActions}>
                            {user ? (
                                <>
                                    <Link href="/profile" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                                        Mon Profil
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin/dashboard" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                                            For Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.75rem 0",
                                            color: "#ef4444",
                                            fontSize: "1.1rem",
                                            fontWeight: 500,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <LogOut size={18} />
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.mobileLogin} onClick={() => setIsOpen(false)}>
                                        Connexion
                                    </Link>
                                    <Link href="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                                        S&apos;inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
