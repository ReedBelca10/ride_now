/**
 * Service d'administration
 * Gère les opérations admin: gestion utilisateurs et analytics
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto, ChangeUserRoleDto } from './dto/admin.dto';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crée un nouvel utilisateur (Admin)
     */
    async createUser(createUserDto: any): Promise<Omit<User, 'password'>> {
        // Validate required fields
        if (!createUserDto.email || !createUserDto.firstName || !createUserDto.lastName) {
            throw new BadRequestException('Email, prénom et nom sont requis');
        }

        // Validate role
        const validRoles = ['USER', 'MANAGER', 'ADMIN'];
        const role = createUserDto.role || 'USER';
        if (!validRoles.includes(role)) {
            throw new BadRequestException(`Rôle invalide. Les valeurs valides sont: ${validRoles.join(', ')}`);
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new BadRequestException('Cet email est déjà utilisé');
        }

        // Hash default password if provided, else use a default
        const password = createUserDto.password || 'RideNow123!';
        const hashedPassword = await import('bcrypt').then(m => m.hash(password, 10));

        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                password: hashedPassword,
                role: role as any,
                telephone: createUserDto.telephone,
                isActive: true,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    /**
     * Récupère tous les utilisateurs avec pagination et filtres
     */
    async getAllUsers(
        skip: number = 0,
        take: number = 10,
        role?: 'USER' | 'MANAGER' | 'ADMIN',
        search?: string
    ) {
        const where: Prisma.UserWhereInput = {
            ...(role && { role }),
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    telephone: true,
                    adresse: true,
                    ville: true,
                    _count: {
                        select: {
                            reservations: true,
                        },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            users,
            total,
            skip,
            take,
        };
    }

    /**
     * Met à jour un utilisateur
     */
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Validate role if provided
        if (updateUserDto.role) {
            const validRoles = ['USER', 'MANAGER', 'ADMIN'];
            if (!validRoles.includes(updateUserDto.role)) {
                throw new BadRequestException(`Rôle invalide. Les valeurs valides sont: ${validRoles.join(', ')}`);
            }
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });

        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }

    /**
     * Supprime un utilisateur (soft delete - désactivation)
     */
    async deleteUser(id: number): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        if (user.role === 'ADMIN') {
            throw new BadRequestException('Impossible de supprimer un administrateur');
        }

        await this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });

        return { message: 'Utilisateur désactivé avec succès' };
    }

    /**
     * Supprime définitivement un utilisateur (hard delete)
     */
    async hardDeleteUser(id: number): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        if (user.role === 'ADMIN') {
            throw new BadRequestException('Impossible de supprimer définitivement un administrateur');
        }

        // Delete all related reservations first
        await this.prisma.reservation.deleteMany({
            where: { utilisateurId: id },
        });

        // Delete all related reviews
        await this.prisma.review.deleteMany({
            where: { utilisateurId: id },
        });

        // Delete the user
        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'Utilisateur supprimé définitivement' };
    }

    /**
     * Change le rôle d'un utilisateur
     */
    async changeUserRole(id: number, changeRoleDto: ChangeUserRoleDto): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: { role: changeRoleDto.role },
        });

        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }

    /**
     * Récupère les statistiques globales
     */
    async getAnalytics() {
        const [
            totalUsers,
            totalVehicles,
            availableVehicles,
            totalReservations,
            activeReservations,
            totalRevenue,
            recentReservations,
        ] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.vehicle.count({ where: { isActive: true } }),
            this.prisma.vehicle.count({ where: { isActive: true, etat: 'DISPONIBLE' } }),
            this.prisma.reservation.count(),
            this.prisma.reservation.count({
                where: { etat: { in: ['CONFIRMEE', 'EN_COURS'] } },
            }),
            this.prisma.reservation.aggregate({
                _sum: { prixTotal: true },
                where: { etat: 'COMPLETEE' },
            }),
            this.prisma.reservation.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    utilisateur: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    vehicule: {
                        select: {
                            marque: true,
                            modele: true,
                        },
                    },
                },
            }),
        ]);

        return {
            totalUsers,
            totalVehicles,
            availableVehicles,
            totalReservations,
            activeReservations,
            totalRevenue: totalRevenue._sum.prixTotal || 0,
            recentReservations,
        };
    }

    /**
     * Récupère les statistiques de croissance des utilisateurs
     */
    async getUserGrowthStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const users = await this.prisma.user.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
            },
            select: { createdAt: true },
        });

        // Grouper par mois
        const monthlyData: { [key: string]: number } = {};
        users.forEach((user) => {
            const month = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        return Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count,
        }));
    }

    /**
     * Récupère les statistiques de réservations
     */
    async getReservationStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const reservations = await this.prisma.reservation.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
            },
            select: { createdAt: true, etat: true },
        });

        // Grouper par mois
        const monthlyData: { [key: string]: number } = {};
        reservations.forEach((reservation) => {
            const month = reservation.createdAt.toISOString().slice(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });

        return Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count,
        }));
    }

    /**
     * Récupère les statistiques de revenus
     */
    async getRevenueStats() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const reservations = await this.prisma.reservation.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                etat: 'COMPLETEE',
            },
            select: { createdAt: true, prixTotal: true },
        });

        // Grouper par mois
        const monthlyData: { [key: string]: number } = {};
        reservations.forEach((reservation) => {
            const month = reservation.createdAt.toISOString().slice(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + reservation.prixTotal;
        });

        return Object.entries(monthlyData).map(([month, revenue]) => ({
            month,
            revenue,
        }));
    }

    /**
     * Récupère les statistiques des véhicules par type
     */
    async getVehicleTypeStats() {
        const vehicles = await this.prisma.vehicle.groupBy({
            by: ['typeVehicule'],
            _count: true,
            where: { isActive: true },
        });

        return vehicles.map((v) => ({
            type: v.typeVehicule,
            count: v._count,
        }));
    }



    /**
     * Récupère toutes les réservations avec pagination et filtres
     */
    async getAllReservations(
        skip: number = 0,
        take: number = 10,
        etat?: string,
        search?: string
    ) {
        const where: Prisma.ReservationWhereInput = {
            ...(etat && { etat: etat as any }),
            ...(search && {
                OR: [
                    { utilisateur: { firstName: { contains: search, mode: 'insensitive' } } },
                    { utilisateur: { lastName: { contains: search, mode: 'insensitive' } } },
                    { utilisateur: { email: { contains: search, mode: 'insensitive' } } },
                    { vehicule: { marque: { contains: search, mode: 'insensitive' } } },
                    { vehicule: { modele: { contains: search, mode: 'insensitive' } } },
                    { locationCode: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [reservations, total] = await Promise.all([
            this.prisma.reservation.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    utilisateur: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            telephone: true,
                        },
                    },
                    vehicule: {
                        select: {
                            id: true,
                            marque: true,
                            modele: true,
                            immatriculation: true,
                        },
                    },
                },
            }),
            this.prisma.reservation.count({ where }),
        ]);

        return {
            reservations,
            total,
            skip,
            take,
        };
    }

    /**
     * Met à jour l'état d'une réservation
     */
    async updateReservationEtat(id: number, newEtat: string) {
        const reservation = await this.prisma.reservation.findUnique({
            where: { id },
        });

        if (!reservation) {
            throw new NotFoundException('Réservation non trouvée');
        }

        return this.prisma.reservation.update({
            where: { id },
            data: { etat: newEtat as any },
            include: {
                utilisateur: true,
                vehicule: true,
            },
        });
    }
}
