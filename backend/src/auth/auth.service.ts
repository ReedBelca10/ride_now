/**
 * Service d'authentification
 * Gère les opérations de login, register et validation des utilisateurs
 */

import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    /**
     * Valide les identifiants de l'utilisateur
     */
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email ou mot de passe incorrect');
        }

        // Retourne l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Génère les tokens JWT et retourne l'utilisateur
     */
    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture || null,
                role: user.role,
            },
        };
    }

    /**
     * Crée un nouvel utilisateur et génère un token
     */
    async register(registerDto: RegisterDto) {
        // Vérifie si l'email existe déjà
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Cet email est déjà utilisé');
        }

        // Hache le mot de passe
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Crée l'utilisateur
        const newUser = await this.usersService.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            profilePicture: null,
            role: 'USER',
        });

        // Envoie un email de bienvenue (asynchrone, ne bloque pas la réponse)
        this.emailService.sendWelcomeEmail(
            newUser.email,
            `${newUser.firstName} ${newUser.lastName}`,
        ).catch(err => console.error('Erreur envoi email de bienvenue:', err));

        return this.login(newUser);
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    async updateProfile(userId: number, updateData: any) {
        const updatedUser = await this.usersService.update(userId, updateData);
        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    /**
     * Change le mot de passe de l'utilisateur
     */
    async changePassword(
        userId: number,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new BadRequestException('Utilisateur non trouvé');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Ancien mot de passe incorrect');
        }

        if (oldPassword === newPassword) {
            throw new BadRequestException(
                'Le nouveau mot de passe doit être différent de l\'ancien',
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(userId, {
            password: hashedPassword,
        });

        return { message: 'Mot de passe changé avec succès' };
    }

    /**
     * Initie le processus de récupération de mot de passe
     */
    async forgotPassword(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) {
            // Pour des raisons de sécurité, on retourne un message générique
            return { message: 'Si cet email existe, un lien de réinitialisation sera envoyé' };
        }

        // Génère un token aléatoire
        const resetToken = randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // Expire dans 1 heure

        // Stocke le token en base de données
        await this.usersService.update(user.id, {
            resetToken,
            resetTokenExpires,
        });

        // Envoie un email avec le lien de réinitialisation
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        await this.emailService.sendPasswordResetEmail(
            user.email,
            user.firstName,
            resetLink,
        );

        return { message: 'Si cet email existe, un lien de réinitialisation sera envoyé' };
    }

    /**
     * Réinitialise le mot de passe avec un token valide
     */
    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByResetToken(token);

        if (!user) {
            throw new BadRequestException('Token invalide ou expiré');
        }

        // Vérifie que le token n'a pas expiré
        if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new BadRequestException('Token invalide ou expiré');
        }

        // Hache le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Met à jour le mot de passe et efface le token
        await this.usersService.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null,
        });

        return { message: 'Mot de passe réinitialisé avec succès' };
    }
}
