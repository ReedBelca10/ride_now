/**
 * Guard JWT pour la protection des routes
 * Vérifie que l'utilisateur est authentifié avec un token JWT valide
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // La logique d'authentification est gérée par le JwtStrategy
}
