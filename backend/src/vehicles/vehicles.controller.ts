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
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) { }

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
  @Roles('ADMIN')
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * PATCH /vehicles/:id
   * Met à jour un véhicule (Admin uniquement)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(Number(id), updateVehicleDto);
  }

  /**
   * DELETE /vehicles/:id
   * Désactive un véhicule (Admin uniquement)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.vehiclesService.deactivate(Number(id));
  }
}
