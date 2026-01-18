"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ShieldCheck, Zap } from "lucide-react";
import styles from "./Hero.module.css";
// Import de l'image générée (supposée être dans public/hero_car_luxury.png)
// Pour l'instant, j'utilise le chemin où generate_image l'a enregistré, ou je devrai le déplacer.
// L'outil generate_image enregistre dans les artefacts. Je devrai le copier dans le dossier public.
// Je suppose que l'image est disponible à '/hero_car_luxury.png' après l'avoir déplacée.

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
    };

    return (
        <section className={styles.hero}>
            <div className={styles.bgImage}>
                <Image
                    src="/hero_car_luxury.png"
                    alt="Voiture de luxe"
                    fill
                    priority
                    style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <div className={styles.overlay} />
            </div>

            <div className={styles.rightImageContainer}>
                <Image
                    src="/car-right.png"
                    alt="Voiture Sportive"
                    fill
                    priority
                    style={{ objectFit: "contain", objectPosition: "right center" }}
                />
            </div>

            <div className="container" style={{ position: "relative", zIndex: 10 }}>
                <motion.div
                    className={styles.content}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 className={styles.title} variants={itemVariants}>
                        Conduisez <span className={styles.highlight}>l'Extraordinaire</span>
                    </motion.h1>

                    <motion.p className={styles.subtitle} variants={itemVariants}>
                        Vivez le frisson de la mobilité électrique premium.
                        Réservez votre véhicule de rêve en quelques secondes avec RideNow.
                    </motion.p>

                    <motion.div className={styles.buttons} variants={itemVariants}>
                        <Link href="/vehicles" className="btn btn-primary">
                            Voir la Flotte <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Link>
                        <Link href="/about" className="btn btn-outline">
                            En Savoir Plus
                        </Link>
                    </motion.div>

                    <motion.div className={styles.features} variants={itemVariants}>
                        <div className={styles.featureItem}>
                            <Zap className={styles.featureIcon} size={24} />
                            <div>
                                <h3>Réservation Instantanée</h3>
                                <p>Réservez en quelques clics</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <ShieldCheck className={styles.featureIcon} size={24} />
                            <div>
                                <h3>Assurance Tous Risques</h3>
                                <p>Roulez en toute sérénité</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <Calendar className={styles.featureIcon} size={24} />
                            <div>
                                <h3>Dates Flexibles</h3>
                                <p>Changez vos plans à tout moment</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
