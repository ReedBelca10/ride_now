/**
 * Contrôleur d'authentification
 * Endpoints pour login, register, et gestion du profil
 */

import {
    Controller,
    Post,
    Patch,
    Get,
    Body,
    Request,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * POST /auth/login
     * Authentifie un utilisateur
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        return this.authService.login(user);
    }

    /**
     * POST /auth/register
     * Crée un nouvel utilisateur
     */
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    /**
     * GET /auth/profile
     * Récupère les informations de l'utilisateur connecté
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role,
        };
    }

    /**
     * PATCH /auth/profile
     * Met à jour le profil de l'utilisateur connecté
     */
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.authService.updateProfile(req.user.id, updateProfileDto);
    }

    /**
     * POST /auth/change-password
     * Change le mot de passe de l'utilisateur
     */
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(
        @Request() req: any,
        @Body() body: { oldPassword: string; newPassword: string },
    ) {
        if (!body.oldPassword || !body.newPassword) {
            throw new BadRequestException(
                'L\'ancien et le nouveau mot de passe sont requis',
            );
        }

        return this.authService.changePassword(
            req.user.id,
            body.oldPassword,
            body.newPassword,
        );
    }

    /**
     * POST /auth/forgot-password
     * Initie le processus de récupération de mot de passe
     */
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    /**
     * POST /auth/reset-password
     * Réinitialise le mot de passe avec un token valide
     */
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
    }
}
