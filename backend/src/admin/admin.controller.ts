/**
 * Contrôleur d'administration
 * Endpoints pour gérer les utilisateurs et récupérer les analytics
 * Tous les endpoints sont protégés et accessibles uniquement aux ADMIN
 */

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto, ChangeUserRoleDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private adminService: AdminService) { }

    /**
     * GET /admin/users
     * Liste tous les utilisateurs avec pagination et filtres
     */
    @Get('users')
    @Roles('ADMIN')
    async getAllUsers(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('role') role?: 'USER' | 'MANAGER' | 'ADMIN',
        @Query('search') search?: string,
    ) {
        return this.adminService.getAllUsers(
            skip ? parseInt(skip) : 0,
            take ? parseInt(take) : 10,
            role,
            search,
        );
    }

    /**
     * POST /admin/users
     * Crée un nouvel utilisateur
     */
    @Post('users')
    @Roles('ADMIN')
    async createUser(@Body() createUserDto: any) {
        return this.adminService.createUser(createUserDto);
    }

    /**
     * PUT /admin/users/:id
     * Met à jour un utilisateur
     */
    @Put('users/:id')
    @Roles('ADMIN')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.adminService.updateUser(id, updateUserDto);
    }

    /**
     * DELETE /admin/users/:id
     * Supprime (désactive) un utilisateur
     */
    @Delete('users/:id')
    @Roles('ADMIN')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteUser(id);
    }

    /**
     * DELETE /admin/users/:id/permanent
     * Supprime définitivement un utilisateur (hard delete)
     */
    @Delete('users/:id/permanent')
    @Roles('ADMIN')
    async hardDeleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.hardDeleteUser(id);
    }

    /**
     * PATCH /admin/users/:id/role
     * Change le rôle d'un utilisateur
     */
    @Patch('users/:id/role')
    @Roles('ADMIN')
    async changeUserRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() changeRoleDto: ChangeUserRoleDto,
    ) {
        return this.adminService.changeUserRole(id, changeRoleDto);
    }

    /**
     * GET /admin/analytics
     * Récupère les statistiques globales
     */
    @Get('analytics')
    @Roles('ADMIN', 'MANAGER')
    async getAnalytics() {
        return this.adminService.getAnalytics();
    }

    /**
     * GET /admin/analytics/users
     * Récupère les statistiques de croissance des utilisateurs
     */
    @Get('analytics/users')
    @Roles('ADMIN')
    async getUserGrowthStats() {
        return this.adminService.getUserGrowthStats();
    }

    /**
     * GET /admin/analytics/reservations
     * Récupère les statistiques de réservations
     */
    @Get('analytics/reservations')
    @Roles('ADMIN', 'MANAGER')
    async getReservationStats() {
        return this.adminService.getReservationStats();
    }

    /**
     * GET /admin/analytics/revenue
     * Récupère les statistiques de revenus
     */
    @Get('analytics/revenue')
    @Roles('ADMIN')
    async getRevenueStats() {
        return this.adminService.getRevenueStats();
    }

    /**
     * GET /admin/analytics/vehicles
     * Récupère les statistiques des véhicules par type
     */
    @Get('analytics/vehicles')
    @Roles('ADMIN', 'MANAGER')
    async getVehicleTypeStats() {
        return this.adminService.getVehicleTypeStats();
    }





    /**
     * GET /admin/reservations
     * Liste toutes les réservations avec pagination et filtres
     */
    @Get('reservations')
    @Roles('ADMIN', 'MANAGER')
    async getAllReservations(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('etat') etat?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getAllReservations(
            skip ? parseInt(skip) : 0,
            take ? parseInt(take) : 10,
            etat,
            search,
        );
    }

    /**
     * PATCH /admin/reservations/:id/etat
     * Change l'état d'une réservation
     */
    @Patch('reservations/:id/etat')
    @Roles('ADMIN', 'MANAGER')
    async updateReservationEtat(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEtatDto: any,
    ) {
        return this.adminService.updateReservationEtat(id, updateEtatDto.etat);
    }
}
