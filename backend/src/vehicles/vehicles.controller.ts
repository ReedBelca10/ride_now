/**
 * Contrôleur de gestion des véhicules
 * Endpoints pour la consultation et la gestion des véhicules
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
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private vehiclesService: VehiclesService,
    private supabaseService: SupabaseService,
  ) { }

  /**
   * GET /vehicles
   * Récupère tous les véhicules disponibles
   */
  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('type') type?: string,
    @Query('carburant') carburant?: string,
  ) {
    const skipNum = skip ? Math.max(0, parseInt(skip)) : 0;
    const takeNum = take ? Math.min(100, parseInt(take)) : 10;

    return this.vehiclesService.findAll(skipNum, takeNum, type, carburant);
  }

  /**
   * GET /vehicles/admin/all
   * Récupère tous les véhicules (admin) - y compris archivés
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async findAllAdmin(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    const skipNum = skip ? Math.max(0, parseInt(skip)) : 0;
    const takeNum = take ? Math.min(100, parseInt(take)) : 10;
    const archived = includeArchived === 'true';

    return this.vehiclesService.findAllAdmin(skipNum, takeNum, archived);
  }

  /**
   * GET /vehicles/available
   * Récupère les véhicules disponibles pour une plage de dates
   */
  @Get('available')
  async getAvailable(
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    if (!dateDebut || !dateFin) {
      throw new BadRequestException('Les dates de début et fin sont requises');
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (debut >= fin) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    return this.vehiclesService.getAvailableVehicles(debut, fin);
  }

  /**
   * GET /vehicles/:id
   * Récupère un véhicule par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehicule = await this.vehiclesService.findOne(Number(id));
    if (!vehicule) {
      throw new BadRequestException('Véhicule non trouvé');
    }
    return vehicule;
  }

  /**
   * POST /vehicles
   * Crée un nouveau véhicule (Admin uniquement)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * POST /vehicles/:id/image
   * Upload une image pour un véhicule
   */
  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const vehicleId = Number(id);
    const vehicle = await this.vehiclesService.findOne(vehicleId);

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    // Valider le type de fichier
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Format d\'image non autorisé. Utilisez JPEG, PNG ou WebP',
      );
    }

    // Limiter la taille (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('L\'image ne peut pas dépasser 5MB');
    }

    try {
      // Générer un chemin unique
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop();
      const path = `vehicles/${vehicleId}/${timestamp}.${extension}`;

      // Upload l'image
      const { url, path: uploadPath } = await this.supabaseService.uploadVehicleImage(
        file.buffer,
        undefined,
        path,
      );

      // Mettre à jour la base de données
      const updatedVehicle = await this.vehiclesService.updateVehicleImage(
        vehicleId,
        url,
        uploadPath,
      );

      return {
        message: 'Image uploadée avec succès',
        vehicle: updatedVehicle,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de l'upload: ${error.message}`,
      );
    }
  }

  /**
   * DELETE /vehicles/:id/image
   * Supprime l'image d'un véhicule
   */
  @Delete(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async deleteImage(@Param('id') id: string) {
    const vehicleId = Number(id);
    const vehicle = await this.vehiclesService.findOne(vehicleId);

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    if (!vehicle.imagePath) {
      throw new BadRequestException('Ce véhicule n\'a pas d\'image');
    }

    try {
      // Supprimer l'image de Supabase
      await this.supabaseService.deleteVehicleImage(
        vehicle.imagePath,
      );

      // Mettre à jour la base de données
      const updatedVehicle = await this.vehiclesService.update(vehicleId, {});

      return {
        message: 'Image supprimée avec succès',
        vehicle: updatedVehicle,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la suppression: ${error.message}`,
      );
    }
  }

  /**
   * PATCH /vehicles/:id
   * Met à jour un véhicule (Admin uniquement)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(Number(id), updateVehicleDto);
  }

  /**
   * PATCH /vehicles/:id/archive
   * Archive un véhicule (soft delete)
   */
  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async archive(@Param('id') id: string) {
    return this.vehiclesService.archive(Number(id));
  }

  /**
   * PATCH /vehicles/:id/restore
   * Restaure un véhicule archivé
   */
  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async restore(@Param('id') id: string) {
    return this.vehiclesService.restore(Number(id));
  }

  /**
   * DELETE /vehicles/:id
   * Supprime définitivement un véhicule (Admin uniquement)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.vehiclesService.delete(Number(id));
  }
}
