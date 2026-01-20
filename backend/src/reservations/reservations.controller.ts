/**
 * Contrôleur de gestion des réservations
 * Endpoints pour créer, consulter et gérer les réservations
 */

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reservations')
export class ReservationsController {
    constructor(private reservationsService: ReservationsService) { }

    /**
     * GET /reservations
     * Récupère toutes les réservations (Admin uniquement)
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        const skipNum = skip ? Math.max(0, parseInt(skip)) : 0;
        const takeNum = take ? Math.min(100, parseInt(take)) : 10;

        return this.reservationsService.findAll(skipNum, takeNum);
    }

    /**
     * GET /reservations/my
     * Récupère les réservations de l'utilisateur connecté
     */
    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getMyReservations(
        @Request() req: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
    ) {
        const skipNum = skip ? Math.max(0, parseInt(skip)) : 0;
        const takeNum = take ? Math.min(100, parseInt(take)) : 10;

        return this.reservationsService.getUserReservations(
            req.user.id,
            skipNum,
            takeNum,
        );
    }

    /**
     * GET /reservations/:id
     * Récupère une réservation par ID
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Request() req: any) {
        const reservation = await this.reservationsService.findOne(Number(id));

        if (!reservation) {
            throw new BadRequestException('Réservation non trouvée');
        }

        // Vérifie que l'utilisateur est autorisé
        if (
            reservation.utilisateurId !== req.user.id &&
            req.user.role !== 'ADMIN'
        ) {
            throw new BadRequestException(
                'Accès refusé à cette réservation',
            );
        }

        return reservation;
    }

    /**
     * POST /reservations
     * Crée une nouvelle réservation
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Request() req: any,
        @Body() createReservationDto: CreateReservationDto,
    ) {
        return this.reservationsService.create(req.user.id, createReservationDto);
    }

    /**
     * PATCH /reservations/:id
     * Met à jour une réservation (Admin uniquement)
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async update(
        @Param('id') id: string,
        @Body() updateReservationDto: UpdateReservationDto,
    ) {
        return this.reservationsService.update(Number(id), updateReservationDto);
    }

    /**
     * DELETE /reservations/:id
     * Annule une réservation
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async cancel(@Param('id') id: string, @Request() req: any) {
        const reservation = await this.reservationsService.findOne(Number(id));

        if (!reservation) {
            throw new BadRequestException('Réservation non trouvée');
        }

        // Vérifie que l'utilisateur est autorisé
        if (
            reservation.utilisateurId !== req.user.id &&
            req.user.role !== 'ADMIN'
        ) {
            throw new BadRequestException(
                'Accès refusé pour annuler cette réservation',
            );
        }

        return this.reservationsService.cancel(Number(id));
    }
}
