/**
 * DTOs de véhicules
 * Validation des données d'entrée pour les endpoints de gestion des véhicules
 */

import { IsString, IsNumber, IsOptional, IsPositive, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString({ message: 'La marque doit être une chaîne de caractères' })
  marque: string;

  @IsString({ message: 'Le modèle doit être une chaîne de caractères' })
  modele: string;

  @IsNumber({}, { message: 'L\'année doit être un nombre' })
  @Min(1950, { message: 'L\'année doit être au minimum 1950' })
  annee: number;

  @IsString({ message: 'L\'immatriculation doit être une chaîne de caractères' })
  immatriculation: string;

  @IsString({ message: 'Le type de véhicule doit être spécifié' })
  typeVehicule: string; // BERLINE, SPORTIVE, SUV, etc.

  @IsString({ message: 'Le carburant doit être spécifié' })
  @IsOptional()
  carburant?: string; // ESSENCE, DIESEL, HYBRIDE, ELECTRIQUE

  @IsString({ message: 'La transmission doit être spécifiée' })
  @IsOptional()
  transmission?: string; // MANUELLE, AUTOMATIQUE

  @IsNumber({}, { message: 'Le nombre de places doit être un nombre' })
  @IsOptional()
  @Min(1, { message: 'Le nombre de places doit être au minimum 1' })
  nombrePlaces?: number;

  @IsString({ message: 'La couleur doit être une chaîne de caractères' })
  couleur: string;

  @IsNumber({}, { message: 'Le kilométrage doit être un nombre' })
  @IsOptional()
  @Min(0, { message: 'Le kilométrage ne peut pas être négatif' })
  kilometrage?: number;

  @IsNumber({}, { message: 'Le prix par jour doit être un nombre' })
  @Min(0, { message: 'Le prix par jour doit être positif ou nul' })
  @IsOptional()
  prixParJour?: number;

  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string;

  // Note: L'image est uploadée séparément via FormData
}

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  marque?: string;

  @IsString()
  @IsOptional()
  modele?: string;

  @IsString()
  @IsOptional()
  immatriculation?: string;

  @IsNumber()
  @IsOptional()
  annee?: number;

  @IsString()
  @IsOptional()
  typeVehicule?: string;

  @IsString()
  @IsOptional()
  carburant?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsNumber()
  @IsOptional()
  nombrePlaces?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  prixParJour?: number;

  @IsString()
  @IsOptional()
  etat?: string; // DISPONIBLE, RESERVE, EN_MAINTENANCE, INDISPONIBLE

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  couleur?: string;

  @IsNumber()
  @IsOptional()
  kilometrage?: number;

  // Note: L'image est uploadée séparément via FormData
}

export class ArchiveVehicleDto {
  // DTO vide, utilisé pour la validation
}

