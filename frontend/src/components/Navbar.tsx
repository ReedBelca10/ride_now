"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                            Véhicules
                        </Link>
                        <Link href="/about" className={styles.link}>
                            À propos
                        </Link>
                        <Link href="/services" className={styles.link}>
                            Services
                        </Link>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/login" className={styles.loginBtn}>
                            Connexion
                        </Link>
                        <Link href="/signup" className="btn btn-primary">
                            S'inscrire
                        </Link>
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
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={styles.mobileMenu}
                >
                    <Link href="/vehicles" className={styles.mobileLink}>
                        Véhicules
                    </Link>
                    <Link href="/about" className={styles.mobileLink}>
                        À propos
                    </Link>
                    <Link href="/services" className={styles.mobileLink}>
                        Services
                    </Link>
                    <div className={styles.mobileActions}>
                        <Link href="/login" className={styles.mobileLogin}>
                            Connexion
                        </Link>
                        <Link href="/signup" className="btn btn-primary">
                            S'inscrire
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
