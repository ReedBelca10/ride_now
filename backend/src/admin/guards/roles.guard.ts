import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard pour vérifier les rôles des utilisateurs
 * Seuls les utilisateurs avec le rôle ADMIN peuvent accéder aux routes protégées
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Utilisateur non authentifié');
        }

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Accès réservé aux administrateurs');
        }

        return true;
    }
}
