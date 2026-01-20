/**
 * Service de gestion des avis
 * Gère les avis et évaluations des utilisateurs sur les véhicules
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Review, Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Récupère tous les avis d'un véhicule
     */
    async findByVehicle(vehiculeId: number): Promise<Review[]> {
        return this.prisma.review.findMany({
            where: { vehiculeId },
            include: {
                utilisateur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { dateAvis: 'desc' },
        });
    }

    /**
     * Récupère la note moyenne d'un véhicule
     */
    async getAverageRating(vehiculeId: number): Promise<number> {
        const result = await this.prisma.review.aggregate({
            where: { vehiculeId },
            _avg: {
                note: true,
            },
        });

        return result._avg.note || 0;
    }

    /**
     * Crée un nouvel avis
     */
    async create(
        utilisateurId: number,
        vehiculeId: number,
        reservationId: number,
        note: number,
        commentaire?: string,
    ): Promise<Review> {
        // Valide la note
        if (note < 1 || note > 5) {
            throw new BadRequestException('La note doit être entre 1 et 5');
        }

        // Vérifie que la réservation existe et appartient à l'utilisateur
        const reservation = await this.prisma.reservation.findUnique({
            where: { id: reservationId },
        });

        if (!reservation) {
            throw new BadRequestException('Réservation non trouvée');
        }

        if (reservation.utilisateurId !== utilisateurId) {
            throw new BadRequestException(
                'Vous ne pouvez évaluer que vos propres réservations',
            );
        }

        // Vérifie que la réservation est complétée
        if (reservation.etat !== 'COMPLETEE') {
            throw new BadRequestException(
                'Vous pouvez uniquement évaluer les réservations complétées',
            );
        }

        // Vérifie qu'il n'y a pas déjà un avis pour cette réservation
        const existingReview = await this.prisma.review.findFirst({
            where: { reservationId },
        });

        if (existingReview) {
            throw new BadRequestException(
                'Un avis existe déjà pour cette réservation',
            );
        }

        return this.prisma.review.create({
            data: {
                utilisateurId,
                vehiculeId,
                reservationId,
                note,
                commentaire,
            },
            include: {
                utilisateur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    /**
     * Met à jour un avis
     */
    async update(
        reviewId: number,
        utilisateurId: number,
        note?: number,
        commentaire?: string,
    ): Promise<Review> {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new BadRequestException('Avis non trouvé');
        }

        if (review.utilisateurId !== utilisateurId) {
            throw new BadRequestException(
                'Vous ne pouvez modifier que vos propres avis',
            );
        }

        if (note && (note < 1 || note > 5)) {
            throw new BadRequestException('La note doit être entre 1 et 5');
        }

        return this.prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(note && { note }),
                ...(commentaire !== undefined && { commentaire }),
            },
        });
    }

    /**
     * Supprime un avis
     */
    async delete(reviewId: number, utilisateurId: number): Promise<Review> {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new BadRequestException('Avis non trouvé');
        }

        if (review.utilisateurId !== utilisateurId) {
            throw new BadRequestException(
                'Vous ne pouvez supprimer que vos propres avis',
            );
        }

        return this.prisma.review.delete({
            where: { id: reviewId },
        });
    }
}
