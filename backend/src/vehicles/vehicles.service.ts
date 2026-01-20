/**
 * Service de gestion des véhicules
 * Gère l'accès aux données et la logique métier des véhicules
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { Vehicle, Prisma } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) { }

  /**
   * Récupère tous les véhicules actifs et non archivés
   */
  async findAll(
    skip: number = 0,
    take: number = 10,
    typeVehicule?: string,
    carburant?: string,
  ): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {
      isActive: true,
      isArchived: false,
      ...(typeVehicule && { typeVehicule: typeVehicule as any }),
      ...(carburant && { carburant: carburant as any }),
    };

    return this.prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère tous les véhicules (admin) - y compris archivés
   */
  async findAllAdmin(
    skip: number = 0,
    take: number = 10,
    includeArchived: boolean = false,
  ): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {
      isActive: true,
      ...(includeArchived ? {} : { isArchived: false }),
    };

    return this.prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère un véhicule par ID
   */
  async findOne(id: number): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  /**
   * Crée un nouveau véhicule (Admin uniquement)
   */
  async create(data: CreateVehicleDto): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        marque: data.marque,
        modele: data.modele,
        annee: data.annee,
        immatriculation: data.immatriculation,
        typeVehicule: data.typeVehicule as any,
        carburant: (data.carburant || 'ESSENCE') as any,
        transmission: (data.transmission || 'AUTOMATIQUE') as any,
        nombrePlaces: data.nombrePlaces || 2,
        couleur: data.couleur,
        kilometrage: data.kilometrage || 0,
        prixParJour: (data.prixParJour ?? null) as any,
        description: data.description,
      },
    });
  }

  /**
   * Met à jour un véhicule
   */
  async update(id: number, data: UpdateVehicleDto): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...(data.marque && { marque: data.marque }),
        ...(data.modele && { modele: data.modele }),
        ...(data.annee && { annee: data.annee }),
        ...(data.typeVehicule && { typeVehicule: data.typeVehicule as any }),
        ...(data.carburant && { carburant: data.carburant as any }),
        ...(data.transmission && { transmission: data.transmission as any }),
        ...(data.nombrePlaces && { nombrePlaces: data.nombrePlaces }),
        ...(data.immatriculation && { immatriculation: data.immatriculation }),
        ...(data.prixParJour !== undefined && { prixParJour: data.prixParJour }),
        ...(data.etat && { etat: data.etat as any }),
        ...(data.couleur && { couleur: data.couleur }),
        ...(data.kilometrage !== undefined && { kilometrage: data.kilometrage }),
        ...(data.description !== undefined && { description: data.description }),
      } as any,
    });
  }

  /**
   * Met à jour l'image d'un véhicule
   */
  async updateVehicleImage(
    id: number,
    imageUrl: string,
    imagePath: string,
  ): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    // Supprimer l'ancienne image si elle existe
    if (vehicle.imagePath) {
      try {
        await this.supabase.deleteVehicleImage(vehicle.imagePath);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancienne image:', error);
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        imageUrl,
        imagePath,
      },
    });
  }

  /**
   * Archive un véhicule (soft delete)
   */
  async archive(id: number): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    if (vehicle.isArchived) {
      throw new BadRequestException('Ce véhicule est déjà archivé');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  }

  /**
   * Restaure un véhicule archivé
   */
  async restore(id: number): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    if (!vehicle.isArchived) {
      throw new BadRequestException('Ce véhicule n\'est pas archivé');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    });
  }

  /**
   * Supprime définitivement un véhicule et ses images
   */
  async delete(id: number): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new BadRequestException('Véhicule non trouvé');
    }

    // Supprimer l'image de Supabase
    if (vehicle.imagePath) {
      try {
        await this.supabase.deleteVehicleImage(vehicle.imagePath);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    }

    // Supprimer le véhicule de la base de données
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  /**
   * Désactive un véhicule
   */
  async deactivate(id: number): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Récupère les véhicules disponibles pour une plage de dates
   */
  async getAvailableVehicles(dateDebut: Date, dateFin: Date): Promise<Vehicle[]> {
    // Récupère les véhicules qui ne sont pas déjà réservés pendant cette période
    const vehiculesReserves = await this.prisma.reservation.findMany({
      where: {
        AND: [
          { dateDebut: { lt: dateFin } },
          { dateFin: { gt: dateDebut } },
          { etat: { in: ['CONFIRMEE', 'EN_COURS'] } },
        ],
      },
      select: { vehiculeId: true },
    });

    const vehiculeIdsReserves = vehiculesReserves.map((r) => r.vehiculeId);

    return this.prisma.vehicle.findMany({
      where: {
        isActive: true,
        isArchived: false,
        etat: 'DISPONIBLE',
        id: { notIn: vehiculeIdsReserves },
      },
      orderBy: { prixParJour: 'asc' },
    });
  }
}
