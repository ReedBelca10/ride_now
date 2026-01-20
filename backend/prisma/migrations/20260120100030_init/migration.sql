-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TypeVehicule" AS ENUM ('BERLINE', 'SPORTIVE', 'SUV', 'CABRIOLET', 'MONOSPACE', 'COMBI');

-- CreateEnum
CREATE TYPE "Carburant" AS ENUM ('ESSENCE', 'DIESEL', 'HYBRIDE', 'ELECTRIQUE');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUELLE', 'AUTOMATIQUE');

-- CreateEnum
CREATE TYPE "EtatVehicule" AS ENUM ('DISPONIBLE', 'RESERVE', 'EN_MAINTENANCE', 'INDISPONIBLE');

-- CreateEnum
CREATE TYPE "EtatReservation" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'COMPLETEE', 'ANNULEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('CARTE_BANCAIRE', 'VIREMENT', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'REMBOURSE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "dateNaissance" TIMESTAMP(3),
    "permisConduire" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "typeVehicule" "TypeVehicule" NOT NULL,
    "carburant" "Carburant" NOT NULL DEFAULT 'ESSENCE',
    "transmission" "Transmission" NOT NULL DEFAULT 'AUTOMATIQUE',
    "nombrePlaces" INTEGER NOT NULL DEFAULT 2,
    "couleur" TEXT NOT NULL,
    "kilometrage" INTEGER NOT NULL DEFAULT 0,
    "prixParJour" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "etat" "EtatVehicule" NOT NULL DEFAULT 'DISPONIBLE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "vehiculeId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "dureeJours" INTEGER NOT NULL,
    "prixTotal" DOUBLE PRECISION NOT NULL,
    "etat" "EtatReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "locationCode" TEXT NOT NULL,
    "lieuPickup" TEXT NOT NULL,
    "lieuRetour" TEXT,
    "remarques" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "vehiculeId" INTEGER NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "dateAvis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "modePaiement" "ModePaiement" NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "referenceTransaction" TEXT,
    "dateTransaction" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_immatriculation_key" ON "Vehicle"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_locationCode_key" ON "Reservation"("locationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
