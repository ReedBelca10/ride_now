import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/roles.decorator';

/**
 * Guard pour vérifier les rôles des utilisateurs
 * Seuls les utilisateurs avec le rôle ADMIN peuvent accéder aux routes protégées
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Utilisateur non authentifié');
        }

        // Si aucun rôle n'est spécifié, on par défaut à ADMIN seulement pour la sécurité
        // ou si la route est dans AdminController sans décorateur
        if (!requiredRoles) {
            if (user.role !== 'ADMIN') {
                throw new ForbiddenException('Accès réservé aux administrateurs');
            }
            return true;
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException(`Accès refusé. Rôle requis: ${requiredRoles.join(' ou ')}`);
        }

        return true;
    }
}
