/**
 * DTOs de réservations
 * Validation des données d'entrée pour les endpoints de réservations
 */

import { IsNumber, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsNumber({}, { message: 'L\'ID du véhicule doit être un nombre' })
  vehiculeId: number;

  @IsDateString({}, { message: 'La date de début est invalide (format ISO 8601 requis)' })
  dateDebut: string;

  @IsDateString({}, { message: 'La date de fin est invalide (format ISO 8601 requis)' })
  dateFin: string;

  @IsString({ message: 'Le lieu de prise en charge est requis' })
  lieuPickup: string;

  @IsString({ message: 'Le lieu de retour est optionnel' })
  @IsOptional()
  lieuRetour?: string;

  @IsString({ message: 'Les remarques sont optionnelles' })
  @IsOptional()
  remarques?: string;
}

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  etat?: string; // EN_ATTENTE, CONFIRMEE, EN_COURS, COMPLETEE, ANNULEE, REFUSEE

  @IsString()
  @IsOptional()
  remarques?: string;

  @IsString()
  @IsOptional()
  lieuRetour?: string;
}
