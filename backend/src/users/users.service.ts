/**
 * Service de gestion des utilisateurs
 * Gère l'accès aux données et la logique métier des utilisateurs
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Trouve un utilisateur par email
     */
    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Trouve un utilisateur par ID
     */
    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Trouve un utilisateur par token de réinitialisation
     */
    async findByResetToken(token: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: { resetToken: token },
        });
    }

    /**
     * Crée un nouvel utilisateur
     */
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    /**
     * Met à jour un utilisateur
     */
    async update(id: number, data: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
                ...(data.profilePicture !== undefined && {
                    profilePicture: data.profilePicture,
                }),
                ...(data.telephone && { telephone: data.telephone }),
                ...(data.adresse && { adresse: data.adresse }),
                ...(data.codePostal && { codePostal: data.codePostal }),
                ...(data.ville && { ville: data.ville }),
                ...(data.dateNaissance && { dateNaissance: data.dateNaissance }),
                ...(data.permisConduire && { permisConduire: data.permisConduire }),
                ...(data.password && { password: data.password }),
                ...(data.resetToken !== undefined && { resetToken: data.resetToken }),
                ...(data.resetTokenExpires !== undefined && {
                    resetTokenExpires: data.resetTokenExpires,
                }),
            } as any,
        });
    }

    /**
     * Désactive un utilisateur
     */
    async deactivate(id: number): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false } as any,
        });
    }
}
