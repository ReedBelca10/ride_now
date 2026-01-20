/**
 * DTOs pour les opérations administratives
 */

import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    telephone?: string;

    @IsOptional()
    @IsString()
    adresse?: string;

    @IsOptional()
    @IsString()
    codePostal?: string;

    @IsOptional()
    @IsString()
    ville?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ChangeUserRoleDto {
    @IsEnum(['USER', 'MANAGER', 'ADMIN'])
    role: 'USER' | 'MANAGER' | 'ADMIN';
}

export class UserQueryDto {
    @IsOptional()
    @IsNumber()
    skip?: number;

    @IsOptional()
    @IsNumber()
    take?: number;

    @IsOptional()
    @IsEnum(['USER', 'MANAGER', 'ADMIN'])
    role?: 'USER' | 'MANAGER' | 'ADMIN';

    @IsOptional()
    @IsString()
    search?: string;
}
