/**
 * DTOs pour les opérations administratives
 */

import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
}

export class ChangeUserRoleDto {
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
