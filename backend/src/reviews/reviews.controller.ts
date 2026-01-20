/**
 * Contrôleur de gestion des avis
 * Endpoints pour créer et consulter les avis
 */

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateReviewDto {
    vehiculeId: number;
    reservationId: number;
    note: number;
    commentaire?: string;
}

interface UpdateReviewDto {
    note?: number;
    commentaire?: string;
}

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    /**
     * GET /reviews/vehicle/:vehiculeId
     * Récupère tous les avis d'un véhicule
     */
    @Get('vehicle/:vehiculeId')
    async getVehicleReviews(@Param('vehiculeId') vehiculeId: string) {
        return this.reviewsService.findByVehicle(Number(vehiculeId));
    }

    /**
     * GET /reviews/vehicle/:vehiculeId/average
     * Récupère la note moyenne d'un véhicule
     */
    @Get('vehicle/:vehiculeId/average')
    async getVehicleAverageRating(@Param('vehiculeId') vehiculeId: string) {
        const average = await this.reviewsService.getAverageRating(
            Number(vehiculeId),
        );
        return { vehiculeId: Number(vehiculeId), averageRating: average };
    }

    /**
     * POST /reviews
     * Crée un nouvel avis
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Request() req: any,
        @Body() createReviewDto: CreateReviewDto,
    ) {
        if (
            !createReviewDto.vehiculeId ||
            !createReviewDto.reservationId ||
            !createReviewDto.note
        ) {
            throw new BadRequestException(
                'Les champs vehiculeId, reservationId et note sont requis',
            );
        }

        return this.reviewsService.create(
            req.user.id,
            createReviewDto.vehiculeId,
            createReviewDto.reservationId,
            createReviewDto.note,
            createReviewDto.commentaire,
        );
    }

    /**
     * PATCH /reviews/:id
     * Met à jour un avis
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Request() req: any,
        @Body() updateReviewDto: UpdateReviewDto,
    ) {
        return this.reviewsService.update(
            Number(id),
            req.user.id,
            updateReviewDto.note,
            updateReviewDto.commentaire,
        );
    }

    /**
     * DELETE /reviews/:id
     * Supprime un avis
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string, @Request() req: any) {
        return this.reviewsService.delete(Number(id), req.user.id);
    }
}
