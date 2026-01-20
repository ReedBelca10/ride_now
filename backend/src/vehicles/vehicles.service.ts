/**
 * Service de gestion des véhicules
 * Gère l'accès aux données et la logique métier des véhicules
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { Vehicle, Prisma } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) { }

  /**
   * Récupère tous les véhicules actifs
   */
  async findAll(
    skip: number = 0,
    take: number = 10,
    typeVehicule?: string,
    carburant?: string,
  ): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {
      isActive: true,
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
        prixParJour: data.prixParJour,
        description: data.description,
        image: data.image,
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
        ...(data.prixParJour && { prixParJour: data.prixParJour }),
        ...(data.etat && { etat: data.etat as any }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image && { image: data.image }),
      } as any,
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
        etat: 'DISPONIBLE',
        id: { notIn: vehiculeIdsReserves },
      },
      orderBy: { prixParJour: 'asc' },
    });
  }
}
