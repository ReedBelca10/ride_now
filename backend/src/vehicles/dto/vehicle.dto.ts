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
  @IsPositive({ message: 'Le prix par jour doit être positif' })
  prixParJour: number;

  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'L\'image doit être une chaîne de caractères' })
  @IsOptional()
  image?: string;
}

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  marque?: string;

  @IsString()
  @IsOptional()
  modele?: string;

  @IsNumber()
  @IsOptional()
  annee?: number;

  @IsString()
  @IsOptional()
  typeVehicule?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  prixParJour?: number;

  @IsString()
  @IsOptional()
  etat?: string; // DISPONIBLE, RESERVE, EN_MAINTENANCE, INDISPONIBLE

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
