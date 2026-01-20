/**
 * Service de gestion des réservations
 * Gère l'accès aux données et la logique métier des réservations
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { Reservation, Prisma } from '@prisma/client';

@Injectable()
export class ReservationsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Récupère toutes les réservations avec pagination
     */
    async findAll(
        skip: number = 0,
        take: number = 10,
        utilisateurId?: number,
    ): Promise<Reservation[]> {
        const where: Prisma.ReservationWhereInput = utilisateurId
            ? { utilisateurId }
            : {};

        return this.prisma.reservation.findMany({
            where,
            include: {
                vehicule: true,
                utilisateur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Récupère une réservation par ID
     */
    async findOne(id: number): Promise<Reservation | null> {
        return this.prisma.reservation.findUnique({
            where: { id },
            include: {
                vehicule: true,
                utilisateur: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Crée une nouvelle réservation
     */
    async create(
        utilisateurId: number,
        createReservationDto: CreateReservationDto,
    ): Promise<Reservation> {
        // Valide les dates
        const debut = new Date(createReservationDto.dateDebut);
        const fin = new Date(createReservationDto.dateFin);

        if (debut >= fin) {
            throw new BadRequestException(
                'La date de fin doit être après la date de début',
            );
        }

        // Vérifie que le véhicule existe
        const vehicule = await this.prisma.vehicle.findUnique({
            where: { id: createReservationDto.vehiculeId },
        });

        if (!vehicule) {
            throw new BadRequestException('Véhicule non trouvé');
        }

        // Vérifie la disponibilité
        const existingReservation = await this.prisma.reservation.findFirst({
            where: {
                vehiculeId: createReservationDto.vehiculeId,
                AND: [
                    { dateDebut: { lt: fin } },
                    { dateFin: { gt: debut } },
                ],
                etat: { in: ['CONFIRMEE', 'EN_COURS'] },
            },
        });

        if (existingReservation) {
            throw new BadRequestException(
                'Le véhicule est déjà réservé pour cette période',
            );
        }

        // Calcule le nombre de jours
        const dureeJours = Math.ceil(
            (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Calcule le prix total
        if (vehicule.prixParJour === null || vehicule.prixParJour === undefined) {
            throw new BadRequestException('Le prix du véhicule n\'est pas défini, impossible de créer une réservation');
        }
        const prixTotal = vehicule.prixParJour * dureeJours;

        // Génère un code de location unique
        const locationCode = `LOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return this.prisma.reservation.create({
            data: {
                utilisateurId,
                vehiculeId: createReservationDto.vehiculeId,
                dateDebut: debut,
                dateFin: fin,
                dureeJours,
                prixTotal,
                locationCode,
                lieuPickup: createReservationDto.lieuPickup,
                lieuRetour: createReservationDto.lieuRetour,
                remarques: createReservationDto.remarques,
                etat: 'EN_ATTENTE',
            },
            include: {
                vehicule: true,
            },
        });
    }

    /**
     * Met à jour une réservation
     */
    async update(
        id: number,
        updateReservationDto: UpdateReservationDto,
    ): Promise<Reservation> {
        const reservation = await this.findOne(id);
        if (!reservation) {
            throw new BadRequestException('Réservation non trouvée');
        }

        return this.prisma.reservation.update({
            where: { id },
            data: {
                ...(updateReservationDto.etat && { etat: updateReservationDto.etat as any }),
                ...(updateReservationDto.remarques !== undefined && {
                    remarques: updateReservationDto.remarques,
                }),
                ...(updateReservationDto.lieuRetour && {
                    lieuRetour: updateReservationDto.lieuRetour,
                }),
            } as any,
        });
    }

    /**
     * Annule une réservation
     */
    async cancel(id: number): Promise<Reservation> {
        const reservation = await this.findOne(id);
        if (!reservation) {
            throw new BadRequestException('Réservation non trouvée');
        }

        if (['COMPLETEE', 'ANNULEE'].includes(reservation.etat)) {
            throw new BadRequestException(
                'Impossible d\'annuler une réservation complétée ou déjà annulée',
            );
        }

        return this.prisma.reservation.update({
            where: { id },
            data: { etat: 'ANNULEE' },
            include: {
                vehicule: true,
            },
        });
    }

    /**
     * Récupère les réservations de l'utilisateur
     */
    async getUserReservations(
        utilisateurId: number,
        skip: number = 0,
        take: number = 10,
    ): Promise<Reservation[]> {
        return this.findAll(skip, take, utilisateurId);
    }
}
