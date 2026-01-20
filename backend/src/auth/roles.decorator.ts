/**
 * Décorateur pour spécifier les rôles requis
 * Utilisé conjointement avec le RolesGuard
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Décorateur @Roles('ADMIN', 'MODERATOR')
 * Spécifie quels rôles sont autorisés à accéder à la route
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
